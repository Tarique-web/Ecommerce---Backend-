const express = require('express');
const body = require("body-parser");

// const mysql  = require("mysql");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const router = express.Router();
const app = express();
app.use(body.json())



const knex = require('knex')({
  client: 'mysql',
  connection: {
      host: 'localhost',
      user: 'root',
       
      password: 'tarique',
      database: 'ecommerce'
      
  }
})

app.use("/",router);
require("./router/department")(router,jwt,knex);

app.use("/",router);
require("./router/categories")(router,knex);

app.use("/",router);
require("./router/attribute")(router,knex);

app.use("/",router);
require("./router/product")(router,jwt,knex);

app.use("/",router);
require("./router/customer")(router,jwt,knex);

app.use("/",router);
require("./router/order")(router,jwt,knex);

app.use("/",router);
require('./router/shipping')(router,jwt,knex);


app.use('/',router);
require('./router/shopping')(router,jwt,knex);

app.use("/",router);
require('./router/tax')(router,knex);


// var port = 4444;
app.listen(process.env.PORT || 4444, () => {
	console.log('Server is working on port',process.env.PORT || 4444);
});