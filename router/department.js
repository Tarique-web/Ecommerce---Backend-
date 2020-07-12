
module.exports = function(router, jwt, knex){
    router
        .get("/department", (req, res) => { 
            knex.select('*').from('department')
            .then(data=>{
                res.send(data)
            })
            .catch(err=>{
                res.send(err)
            })
        })

        .get("/department/:id",(req,res)=>{
            const id = req.params.id
            knex.select("*").from("department").where("department_id",id)
            .then((data)=>{
                res.send(data)
            }).catch((err)=>{
                res.send(err)
            })
        })
}