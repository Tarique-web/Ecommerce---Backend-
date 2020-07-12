module.exports = (router, jwt, knex) => {
    router
        .post("/", (req, res) => {
            var shippingId = req.body.shippingId;

            var tax_id = req.body.tax_id;
            var cart_id = req.body.cart_id;

            const cookie = req.headers.cookie.slice(4);
            const token_verify = jwt.verify(cookie, "tarique")
            // console.log(token_verify);

            // res.send(token_verify)



            knex
                .select(
                    "shopping_cart.product_id",
                    "shopping_cart.attributes",
                    "shopping_cart.quantity",
                    "product.name",
                    "product.price",

                ).from("shopping_cart")
                .join("product", "shopping_cart.product_id", "=", "product.product_id")
                .where("cart_id", req.body.cart_id)
                .then((data) => {
                    console.log(data[0].name);

                    if (data.length != 0) {
                        knex.select("shipping_cost")
                            .from("shipping")
                            .where('shipping_id', shippingId)
                            .then((data1) => {

                                // console.log(data1);
                                // res.send(data1)


                                knex.select("tax_percentage")
                                    .from("tax").where("tax_id", req.body.tax_id)
                                    .then((data2) => {
                                        // console.log(data2);



                                        const value_list = [];
                                        for (var i of data) {
                                            const total = i.price * i.quantity;
                                            i.total = total;

                                            value_list.push(i);
                                            // res.send(value_list)


                                        }
                                        const total1 = ((value_list[0]).total + (data1[0]).shipping_cost)
                                        const subtotal = (total1 * data2[0].tax_percentage / 100)
                                        const total_amount = total1 + subtotal
                                        // res.send(total_amount);
                                        // console.log(total_amount);
                                        const orders = {
                                            "total_amount": total_amount,
                                            "created_on": new Date(),
                                            "shipped_on": new Date(),
                                            "comments": req.body.comments,
                                            "customer_id": token_verify.customer_id,
                                            "auth_code": req.body.auth_code,
                                            "reference": req.body.reference,
                                            "shipping_id ": req.body.shippingId,
                                            "tax_id": req.body.tax_id
                                        }
                                        knex.select("*").from("orders")
                                            .insert(orders)
                                            .then(() => {

                                                knex.select("*").from("orders")
                                                    .then((orders_table) => {


                                                        knex("order_detail").insert({
                                                            "unit_cost": data[0].price,
                                                            "quantity": data[0].quantity,
                                                            "product_name": data[0].name,
                                                            "attributes": data[0].attributes,
                                                            "product_id": data[0].product_id,
                                                            "order_id": orders_table[0].order_id
                                                        }).then(() => {
                                                            res.send("your order is successfully done")
                                                            console.log("your order is successfully done");

                                                        }).catch((err) => {
                                                            console.log(err);

                                                        })
                                                    }).catch((err)=>{
                                                        console.log(err);
                                                        
                                                    })

                                            }).catch((err) => {
                                                console.log(err);

                                            })
                                    }).catch((err) => {
                                        console.log(err);
                                    })
                            }).catch((err) => {
                                console.log(err);

                            })
                    }
                }).catch((err) => {
                    console.log(err);

                })





        })

        // .get("/orders/:order_id",(req,res)=>{
        //     const cookie = req.headers.cookie.slice(4);
        //     const token_verify = jwt.verify(cookie, "tarique")
        //     // res.send(token_verify)

        // })


        // get data inCustomer
        .get("/orders/inCustomer", (req, res) => {
            const cookie = req.headers.cookie.slice(4);
            const token_verify = jwt.verify(cookie, "tarique").customer_id
            knex.select("*").from("orders")
                .where("customer_id", token_verify)
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);

                })

        })

        .get("/orders/shortDetails/:order_id", (req, res) => {
            const cookie = req.headers.cookie.slice(4);
            const token_verify = jwt.verify(cookie, "tarique").customer_id

            knex.select(
                "orders.order_id",
                "orders.total_amount",
                "orders.created_on",
                "orders.shipped_on",
                "orders.status",
                "order_detail.product_name"

            ).from("orders")
                .join("order_detail", "order_detail.order_id", "=", "orders.order_id")
                .where("customer_id", token_verify)
                // .andwhere("order_id",req.params.order_id)
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);

                })
        })


}
