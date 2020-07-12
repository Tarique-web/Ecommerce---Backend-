module.exports = (router, knex) => {


    router
        .get("/category", (req, res) => {
            knex.select('*').from('category')
                .then((data) => {
                    res.send(data);
                    // console.log("geting data---");

                }).catch((err) => {
                    console.log(err);

                })
        })

        // get categories data by ID
        .get("/category/:id", (req, res) => {
            var id = req.params.id;
            knex.select('*').from('category').where('category_id', id)
                .then((data) => {
                    res.send(data);
                    // console.log("getting your data---");

                }).catch((err) => {
                    console.log(err);
                })
        })


        // get categories of a product
        .get("/category/inProduct/:id", (req, res) => {
            var id = req.params.id;
            knex.select(
                'category.category_id',
                'department_id',
                'name'
            )
                .table("category")
                .join("product_category", { "product_category.category_id": "category.category_id" })
                .where("product_category.product_id", id)
                .then((data) => {
                    res.send(data)
                }).catch((err) => {
                    console.log(err);
                })
        })


        // get categories of a department
        .get("/category/inDepartment/:id", (req, res) => {
            var id = req.params.id;
            knex
                .select(
                    'category_id',
                    'name',
                    'description',
                    'department_id'
                )
                .from('category')
                .where('department_id', id)
                .then((data) => {
                    res.send(data);
                }).catch((err) => {
                    console.log(err);
                })
        })
}