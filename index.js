const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const objectId = require("mongodb").ObjectID;
const { ObjectId } = require("bson");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apoqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const orderCollection = client.db("amazonClone").collection("orders");
  const productsCollection = client.db("amazonClone").collection("products");
  const itemsCollection = client.db("amazonClone").collection("items");
 const adminCollection = client.db("amazonClone").collection("admins");
  

//? post Products from Inventory using fake data(bulk)
  app.post('/addItems',(req,res)=>{
      const items = req.body;
      itemsCollection.insertMany(items)
    .then(result => {
        res.send(result.insertedCount > 0)
       
    })
  })

//? post Products from Inventory using fake data(single)
  app.post('/addProduct',(req,res)=>{
      const product = req.body;
      productsCollection.insertOne(product)
    .then(result => {
        res.send(result.insertedCount > 0)
       
    })
  })

//   ? post Products from Inventory using API
  app.post('/addProducts',(req,res)=>{
      const products = req.body;
      productsCollection.insertMany(products)
    .then(result => {
        res.send(result.insertedCount > 0)
       
    })
  })



//?  get Products fakeData
  app.get('/getItems',(req,res)=>{ 
    const search = req.query.search;
    itemsCollection.find({name: {$regex: search}})
    .toArray((err,items) => {
      res.send(items);
  })
  })

//   ? get Products to product (All products)
  app.get('/getProductsManager',(req,res)=>{ 
    const search = req.query.search;
    productsCollection.find({})
    .toArray((err,products) => {
      res.send(products);
  })
  })

//   ? get Products to product
  app.get('/getProducts',(req,res)=>{ 
    const search = req.query.search;
    productsCollection.find({title: {$regex: search}})
    .toArray((err,products) => {
      res.send(products);
  })
  })

//?   Read Products from Manager
  app.get('/getProductManager/:id', (req,res) => {
    productsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents) => {
      res.send(documents[0]);
    })
  })  

//?  Update product
  app.patch('/updateProduct/:id',(req, res) => {
 productsCollection.updateOne({_id: ObjectId(req.params.id)},
 {
   $set: {price: req.body.price, category: req.body.category},
 })
  .then((result) => {
    res.send(result.modifiedCount > 0);
  })
  }) 

    //? Delete Product
 app.delete('/deleteProduct/:id',(req,res)=>{
   productsCollection.deleteOne({_id: ObjectId(req.params.id)})
   .then((result)=>{
     res.send(result.deletedCount > 0)
   })
 })

  //   ? from MakeAdmin
  app.post('/addAdmin',(req,res)=>{
      const admin = req.body;
      adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
       
    })
  })

 //? To Dashboard 
  app.get('/getAdmin',(req,res)=>{
    adminCollection.find({email:req.query.email})
    .toArray((err,result)=>{
      res.send(result.length > 0);
    })
  })

//   ? post order
  app.post('/addOrder',(req,res)=>{
      const order = req.body;
      orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
       
    })
  })

  //? get order
  app.get('/getAllOrder',(req,res)=>{
    orderCollection.find({})
    .toArray((err,orders)=>{
      res.send(orders)
    })
  })

  //? get customer order
  app.get('/getOrder',(req,res)=>{
    orderCollection.find({email:req.query.email})
    .toArray((err,orders)=>{
      res.send(orders)
    })
  })

  //? Delete order
   app.delete("/delete/:id", (req, res) => {
    orderCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });


  app.get('/', (req, res) => {
   res.send('Hello World!58')
  })

});

app.listen(process.env.PORT || port)



