const product = require("./product");

module.exports = (router, jwt, knex) => {

    router
        .get('/generateId', (req, res) => {
            var str = "",
                charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
            for (var i = 0; i < 18; i++) {
                str += charset.charAt(Math.floor(Math.random() * charset.length));
            }

            res.send({ cart_id: str });
        })


        .post("/shoppingcart/add", (req, res) => {
            const cookie = req.headers.cookie.slice(4);
            const jwt_verify = jwt.verify(cookie, "tarique")

            var cart_value = {
                'cart_id': req.body.cart_id,
                'product_id': req.body.product_id,
                'attributes': req.body.attributes,
                'quantity': 1,
                'added_on': new Date()
            }
            knex
                .select('quantity')
                .from('shopping_cart')
                .where('shopping_cart.cart_id', cart_value.cart_id)
                .andWhere('shopping_cart.product_id', cart_value.product_id)
                .andWhere('shopping_cart.attributes', cart_value.attributes)
                .then((value) => {
                    // console.log('quantity', value);
                    if (value.length == 0) {
                        // for quantity
                        knex('shopping_cart')
                            .insert({
                                'cart_id': cart_value.cart_id,
                                'product_id': cart_value.product_id,
                                'attributes': cart_value.attributes,
                                'quantity': 1,
                                'added_on': new Date()
                            })
                            .then(() => {
                                knex
                                    .select(
                                        'item_id',
                                        'name',
                                        'attributes',
                                        'shopping_cart.product_id',
                                        'price',
                                        'quantity',
                                        'image'
                                    )
                                    .from('shopping_cart')
                                    .join('product', function () {
                                        this.on('shopping_cart.product_id', 'product.product_id')
                                    })
                                    .then(value => {
                                        let value_list = []
                                        for (let i of value) {
                                            let subtotal = i.price * i.quantity;
                                            i.subtotal = subtotal;
                                            // console.log(i);
                                            value_list.push(i);
                                        }
                                        console.log(value_list)
                                        res.send(value);
                                    }).catch(err => console.log(err));
                            }).catch((err) => console.log(err))
                    } else {

                        // product quantity increase
                        const quantity = value[0].quantity + 1;
                        knex('shopping_cart')
                            .update({ quantity: quantity })
                            .where('shopping_cart.cart_id', cart_value.cart_id)
                            .andWhere('shopping_cart.product_id', cart_value.product_id)
                            .andWhere('shopping_cart.attributes', cart_value.attributes)
                            .then(() => {
                                knex
                                    .select(
                                        'item_id',
                                        'name',
                                        'attributes',
                                        'shopping_cart.product_id',
                                        'price',
                                        'quantity',
                                        'image',
                                        "added_on"
                                    )
                                    .from('shopping_cart')
                                    .join('product', function () {
                                        this.on('product.product_id', 'shopping_cart.product_id')
                                    })
                                    .then(value => {

                                        // Update quantity

                                        console.log('value updated!')

                                        let value_list = [];
                                        for (var i of value) {
                                            const subtotal = i.price * i.quantity;
                                            i.subtotal = subtotal;
                                            value_list.push(i);
                                        }

                                        res.send(value_list);
                                    })
                                    .catch(err => console.log(err));
                            })
                    }
                })
        })

        // get data from cart_id
        .get("/shopping_cart/cart_id/:cart_id", (req, res) => {

            const cart_id = req.params.cart_id;
            knex.select(

                'item_id',
                'name',
                'attributes',
                'shopping_cart.product_id',
                'product.price',
                'quantity',
                'image')
                .from("shopping_cart")
                .join("product", "shopping_cart.product_id", "=", "product.product_id")
                .where("shopping_cart.cart_id", cart_id)
                .then((data) => {
                    for (value of data) {
                        value.subtotal = value.price * value.quantity


                    }
                    res.send(value)


                }).catch((err) => {
                    console.log(err);

                })
        })

        // update of quantity from shoppin_cart
        .put("/shopping_cart/update/:item_id", (req, res) => {
            knex.select(
                "quantity"
            ).update(req.body).from("shopping_cart").where("shopping_cart.item_id", req.params.item_id)
                .then(() => {
                    console.log("data updated")
                    knex.select(
                        'item_id',
                        'product.name',
                        'shopping_cart.attributes',
                        'shopping_cart.product_id',
                        'product.price',
                        'shopping_cart.quantity'

                    )
                        .from("shopping_cart")
                        .join("product", "shopping_cart.product_id", "=", "product.product_id")
                        .where("shopping_cart.item_id", req.params.item_id)
                        .then((data) => {
                            for (value of data) {
                                value.subtotal = value.price * value.quantity


                            }
                            res.send(value)

                        }).catch((err) => {
                            console.log(err);

                        })
                }).catch((err) => {
                    console.log(err);

                })
        })

        // deleting data of by cart_id from shopping_cart
        .delete("/shopping_cart/empty/:cart_id", (req, res) => {
            knex("*").from("shopping_cart").
                del().where("shopping_cart.cart_id", req.params.cart_id)
                .then((data) => {
                    console.log("delete successfull done");
                    res.send({ delete: "delete successfull done" })
                }).catch((err) => {
                    console.log(err);

                })
        })

        // return data of Total Amount
        .get("/shopping_cart/totalAmount/:cart_id", (req, res) => {
            knex.select(
                "shopping_cart.quantity",
                "product.price"
            ).from("shopping_cart")
                .join("product", "shopping_cart.product_id", "=", "product.product_id")
                .where("shopping_cart.cart_id", req.params.cart_id)
                .then((data) => {
                    if (data.length > 0) {
                        for (value of data) {
                            value.subtotal = value.price * value.quantity


                        }
                        res.send(value)
                    } else {
                        console.log("your cart_id is not exist");
                        res.send("Your cart_id is not exist,please put correct cart_id")

                    }

                }).catch((err) => {
                    console.log(err);

                })
        })

        .get("/moveToCart/savelater/tablecreat", (req, res) => {
            // create table for Moveto cart end point
            knex.schema.createTable('cart', function (table) {
                table.increments('item_id').primary();
                table.string('cart_id');
                table.integer('product_id');
                table.string('attributes');
                table.integer('quantity');
                table.integer('buy_now');
                table.datetime('added_on');
            }).then(() => {
                console.log("cart table created successfully....")
                // res.send("cart table created successfully....")
            }).catch(() => {
                console.log("cart table is already exists!");
                // res.send("cart table is already exists!")
            })

            // create table for savetolater end pint
            knex.schema.createTable('savelater', function (table) {
                table.increments('item_id').primary();
                table.string('cart_id');
                table.integer('product_id');
                table.string('attributes');
                table.integer('quantity');
                table.integer('buy_now');
                table.datetime('added_on');
            }).then(() => {
                console.log("savelater table created successfully....!")
                // res.send("savelater table created successfully....!")
            }).catch((err) => {
                console.log("savelater table is already exists")
                // res.send("savelater table is already exists")
            })
        res.send("table created")


        })
   


    .get("/shopping_cart/movetocart/:item_id",(req,res)=>{
        knex.select("*").from("shopping_cart")
        .where("item_id",req.params.item_id)
        .then((data)=>{
            // console.log(data)
            if (data.length>0){
                knex("cart").insert(data)
                .then((data)=>{
                    console.log({data:"successfuly move to cart"});
                    res.send("move to cart completed add")
                    
                }).catch((err)=>{
                    console.log(err);
                    knex("shopping_cart").del().where("item_id",req.params.item_id)
                    .then(()=>{
                        console.log("delete seccessfull from shopping_cart");
                        
                    }).catch((err)=>{
                        console.log(err);
                        
                    })
                    
                })
                knex.select("*").from("shopping_cart").where("item_id",req.params.item_id)
                .then((data)=>{
                    res.send(data)
                }).catch((err)=>{
                    console.log(err);
                    
                })
              
            }else{
                console.log("your item_id is not valid");                             
            }
            
        }).catch((err)=>{
            console.log(err);
            
        })
        
    })

   
    .get("/shopping_cart/saveforlater/:item_id",(req,res)=>{
        knex
        .select('*')
        .from('shopping_cart')
        .where('item_id', req.params.item_id)
        .then((data) =>{
            // console.log(data);
            if (data.length>0){
                knex('savelater')
                .insert(data[0])
                .then((data) =>{
                    knex
                    .select('*')
                    .from('shopping_cart')
                    .where('item_id', req.params.item_id)
                    .then(() =>{
                        res.send("data move from shopping_cart to later successfully!")
                    })
                }).catch((err) =>{
                    console.log(err);
                })
            }else{
                res.send({"Error": "sorry! this item_id is not available in this table."})
            }
        })
    })

    .get("/shopping_cart/getsaved/:cart_id",(req,res)=>{
        knex.select(
            "item_id",
            "product.name",
            "shopping_cart.attributes",
            "product.price")
            .from("shopping_cart")
            .join("product","product.product_id",'=',"shopping_cart.product_id")
            .where("shopping_cart.cart_id",req.params.cart_id)
            .then((data)=>{
                res.send(data)

            }).catch((err)=>{
                console.log(err);
                
            })
    })


}
