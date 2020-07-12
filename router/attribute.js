module.exports = (router, knex) => {
    router
        .get("/attributes", (req, res) => {
            knex.select("*").from("attribute")
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);

                })
        })

        // get attribute by Id
        .get("/attributes/:attribute_id", (req, res) => {
            const attribute_id = req.params.attribute_id;
            knex.select("*").from("attribute").where("attribute_id", attribute_id)
                .then((data) => {
                    if (data.length > 0) {
                        res.send(data)

                    }
                    else {
                        console.log("Your id isn't valid please put correct id");

                    }

                }).catch((err) => {
                    console.log(err);

                })
        })

        // get attribute value by attribute_id
        .get("/attributes/values/:attribute_id", (req, res) => {
            const attribute_id = req.params.attribute_id;
            knex.select(
                'attribute_value_id',
                'value'
            ).from("attribute_value")
                .where('attribute_id', attribute_id)
                .then((data) => {
                    if (data.length > 0) {
                        res.send(data)
                    } else {
                        console.log("Your id isn't valid please put correct id");

                    }
                }).catch((err) => {
                    console.log(err);

                })
        })
        
        .get("./arrtibutes/inProduct/:product_id",(req,res)=>{
            const product_id = req.params.product_id;
            
        })
}