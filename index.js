const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) =>{
    res.send("Hello from Kid Zone")
})

// MongoDB CRUD Operation 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ml6ryd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();

    const dollsCollection = client.db("dollDB").collection("dolls");

    app.get("/dolls", async(req, res) =>{
        let query = {};
        if(req.query?.sellerEmail){
            query = {sellerEmail: req.query.sellerEmail}
        }
        else if(req.query?.category === "Disney Dolls" || req.query?.category === "American Girl" || req.query?.category === "Barbie Dolls"){
            query = { category: req.query.category}
        }
        const result = await dollsCollection.find(query).toArray();
        res.send(result)
    });

    app.get("/dolls/:id", async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await dollsCollection.findOne(query);
        res.send(result)
    });

   


    app.post("/dolls", async(req, res) =>{
        const doll = req.body;
        console.log(doll)
        const result = await dollsCollection.insertOne(doll)

    });


app.delete("/dolls/:id", async(req, res) =>{
    const id = req.params.id;
    const query = { _id : new ObjectId(id)}
    const result = await dollsCollection.deleteOne(query);
    res.send(result)
})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () =>{
    console.log(`Server is running on : ${port}`)
})
