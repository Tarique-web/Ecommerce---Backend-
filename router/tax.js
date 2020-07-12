module.exports = (router, knex) => {
    router
        .get("/tax", (req, res) => {
            knex.select("*").from("tax")
            .then((data)=>{
                res.send(data)
            }).catch((err)=>{
                console.log(err);
                
            })

        })
    .get("/tax/:tax_id",(req,res)=>{
        knex.select("*").from("tax").where("tax_id",req.params.tax_id)
        .then((data)=>{
            res.send(data)

        }).catch((err)=>{
            console.log(err);
            
        })
    })
}