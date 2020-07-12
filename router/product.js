module.exports = (router, jwt, knex) => {
    router
        .get("/product", (req, res) => {
            knex.select("*").from("product")
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);

                })
        })

        // get by data search
        .get('/products/search', (req, res) => {
            knex
                .select(
                    'product_id',
                    'name',
                    'description',
                    'price',
                    'discounted_price',
                    'thumbnail'
                )
                .from('product').then((data) => {
                    res.send(data);
                }).catch((err) => {
                    console.log(err)
                    res.send(err)
                })
        })

        // get by product_id
        .get('/products/:product_id', (req, res) => {
            const product_id = req.params.product_id;
            knex
                .select('*').from('product').where('product_id', product_id)
                .then((data) => {
                    if (data.length > 0) {
                        res.send(data)
                    }
                    else {
                        console.log("Your id isn't valid please put correct id");

                    }

                }).catch((err) => {
                    console.log(err);
                    res.send(err);
                })
        })

        .get("/products/inCategory/:category_id", (req, res) => {
            const category_id = req.params.category_id;
            knex.select("product.product_id",
                "name",
                "description",
                "price",
                "discounted_price",
                "thumbnail")
                .from("product")
                .join("product_category", "product_category.product_id", "=", "product.product_id")
                .where("product_category.category_id", category_id)
                .then((data) => {
                    if (data.length > 0) {
                        res.send(data)
                    } else {
                        console.log("Your id isn't valid please put correct category_id");

                    }
                }).catch((err) => {
                    console.log(err);

                })
        })

        .get("/products/inDepartment/:department_id", (req, res) => {
            const department_id = req.params.department_id;
            knex.select(
                'product.product_id',
                'product.name',
                'price',
                'discounted_price',
                'product.description',
                'thumbnail')
                .from('product')
                .join('product_category', 'product.product_id', '=', 'product_category.product_id')
                .join('category', 'product_category.category_id', '=', 'category.category_id')
                .where('category.department_id', department_id)
                .then((data) => {
                    if (data.length > 0) {
                        res.send(data)
                    } else {
                        console.log("Your id isn't valid please put correct category_id");

                    }
                }).catch((err) => {
                    console.log(err);

                })
        })

        .get("/products/product_id/:details", (req, res) => {
            const details = req.params.details;
            knex.select("*").from("product").where("product_id", details)
                .then((data) => {
                    if (data.length > 0) {
                        var dict_list = []
                        for (value of data) {
                            var dict = {}
                            dict.product_id = value.product_id
                            dict.name = value.name
                            dict.description = value.description
                            dict.price = value.price
                            dict.discounted_price = value.discounted_price

                            dict.image = value.image
                            dict.image_2 = value.image_2

                            dict_list.push(dict)
                            res.send(dict_list)


                        }
                    } else {
                        console.log("Your id isn't valid please put correct product_id");


                    }
                }).catch((err) => {
                    console.log(err);

                })
        })

        .get("/products/product_id/location/:location", (req, res) => {
            const location = req.params.location;
            knex.select(
                "category.category_id",
                "category.name as category_name",
                "department.department_id",
                "department.name as department_name"

            ).from("product")
                .join('product_category', 'product.product_id', '=', 'product_category.product_id')
                .join('category', 'product_category.category_id', '=', 'category.category_id')
                .join("department", "category.department_id", "=", "department.department_id")
                .where("product.product_id", location)
                .then((data) => {
                    res.send(data)
                }).catch((err => {
                    console.log(err);

                }))
        })


        .get('/products/reviews/:product_id', (req, res) => {
            knex.select(
                'product.name',
                'review',
                'rating',
                'created_on'
            )
                .from("review")
                .join("product", 'product.product_id', '=', 'review.product_id')
                .where('review.product_id', req.params.product_id)
                .then((result) => {
                    res.send(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        })

        .post('/reviews/:product_id', (req, res) => {
            const cookie = req.headers.cookie.slice(4)
            const jwt_verify = jwt.verify(cookie, "tarique")
            // res.send(jwt_verify)
            knex.select("*").from("customer").where("email", jwt_verify.email)
                .then((data) => {
                    if (data.length > 0) {

                        knex.select("product_id").from("product").where("product_id", req.params.product_id)
                            .then((data1) => {
                                if (data1.length > 0) {

                                    knex("review").insert({
                                        "review": req.body.review,
                                        "rating": req.body.rating,
                                        "created_on": new Date(),
                                        "product_id": req.params.product_id,
                                        "customer_id": jwt_verify.customer_id
                                    }).then(() => {
                                        console.log("Thank your for giving review");
                                        res.send("Your review seccessfull done")


                                    }).catch((err) => {
                                        console.log(err);

                                    })
                                } else {
                                    console.log("sommething error in your product_id");


                                }
                            }).catch((err) => {
                                console.log(err);

                            })
                    } else {
                        console.log("sommething error");


                    }
                }).catch((err) => {
                    console.log(err);

                })



        })

}