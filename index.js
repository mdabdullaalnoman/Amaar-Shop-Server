const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const objectid = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

// Middle were
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ne473.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    // create a database on mongodb
    const database = client.db("amarShopWebsite");
    const products = database.collection('products');

    // 2.
    // Get Api (load all products)----------------------
    app.get('/products', async (req, res) => {
      const cursor = products.find({});
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    })

    // 3. Get specipic products by id--------------------------------- 
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectid(id)};
      const product = await products.findOne(query)
      res.json(product);
    })

    // 1.
    // Post API --------------------------------
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await products.insertOne(product);
      res.json(result)
    });

    // 4.
    // Delete Products--------------------------
    app.delete('/products/:id' , async(req , res) => {
      const id = req.params.id;
      const query = {_id: objectid(id)};
      const result = await products.deleteOne(query);
      res.json(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('hellow word');
})

app.listen(port, () => {
  console.log('listtening port ', port);
});