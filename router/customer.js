module.exports = (router, jwt, knex) => {
    router
        .post("/customer/signup", (req, res) => {

            var name = req.body.name;
            var email = req.body.email;
            var password = req.body.password;

            if (name.length == 0 || email.length == 0 || password.length == 0) {
                console.log("name, email and password all are required");
                res.send("name, email and password all are required");
            } else {

                knex.select("*").from("customer").where("email", email)
                    .then((data) => {
                        if (data.length < 1) {
                            knex("customer").insert(req.body)
                                .then((data) => {
                                    console.log("Your registation has been done");

                                    res.send("Your registation has been done")
                                }).catch((err) => {
                                    console.log(err);

                                })
                        } else {
                            console.log("You have already an account");
                            res.send("You have already an account")

                        }



                    })
            }
        })

        .post("/login", (req, res) => {
            knex.select("*").from("customer").where("email", req.body.email)
                .then((data) => {
                    if (data.length > 0) {
                        if (data[0].password === req.body.password) {
                            var token = jwt.sign({
                                "customer_id": data[0].customer_id, "name": data[0].name,
                                "email": data[0].email
                            }, "tarique", { expiresIn: "1h" })
                            console.log(token)
                            res.cookie("key", token);
                            console.log({ "Login successfull!": data, token })
                            res.send({ "You Login successfully!": data, token });
                        }
                        else {
                            res.send({ "Error": "Password is invalid" })
                        }


                    } else {
                        res.send({ "Error": "This user doesn't exists! please Signup....." })


                    }
                }).catch((err) => {
                    console.log(err);

                })
        })

        .get("/customer/:customer_id", (req, res) => {
            const customer_id = req.params.customer_id
            knex.select(
                "customer_id",
                "name",
                "email",
                "address_1",
                "address_2",
                "city",
                "region",
                "postal_code",
                "country",
                "shipping_region_id",
                "day_phone",
                "eve_phone",
                "mob_phone",
                "credit_card"
            ).from("customer").where("customer_id", customer_id)
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);

                })
        })

        .put("/customer/update", (req, res) => {
            var cookie = req.headers.cookie.slice(4);
            // console.log(cookie)            
            var token_verify = jwt.verify(cookie, "tarique").customer_id
            knex("customer").update({
                "customer_id": req.body.customer_id,
                "name": req.body.name,
                "email": req.body.email,

                "address_1": req.body.address_1,
                "address_2": req.body.address_2,
                "city": req.body.city,
                "region": req.body.region,
                "postal_code": req.body.postal_code,
                "country": req.body.country,
                "shipping_region_id": req.body.shipping_region_id,
                "day_phone": req.body.day_phone,
                "eve_phone": req.body.eve_phone,
                "mob_phone": req.body.mob_phone,
                "credit_card": req.body.credit_card
            }

            ).where("customer_id", token_verify)
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);

                })
        })

        .put("/customer/creditCard", (req, res) => {
            const token = req.headers.cookie.slice(4)
            const token_verify = jwt.verify(token, "tarique").customer_id
            knex('customer')
                .update({
                    'credit_card': req.body.credit_card
                }).where('customer_id', token_verify)
                .then((data) => {
                    res.send("data updated successfully!")
                }).catch((err) => {
                    console.log("something err.")
                })

        })


}