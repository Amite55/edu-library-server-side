const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionSuccessStatus : 200
}


app.use(cors(corsOptions));
app.use(express.json());

// eduLibrary
// sMZ7jIKtOYU65ILf

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g2fbusk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




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

        const booksCollection = client.db('eduLibrary').collection('books');
        const borrowedBooksCollection = client.db('eduLibrary').collection('borrowed');

      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();

    
    app.post('/book', async (req, res) => {
      const savedBooks = req.body;
      const result = await booksCollection.insertOne(savedBooks);
      res.send(result);
    })

    app.get('/books', async (req, res) => {
        const result = await booksCollection.find().toArray();
        res.send(result);
    })

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      // console.log(query);
      const result = await booksCollection.findOne(query);
      // console.log(result);
      res.send(result);
    })

    app.post('/borrowed', async (req, res) => {
       const borrowedData = req.body;
       const result = await borrowedBooksCollection.insertOne(borrowedData);
       res.send(result);
    })


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', ( req, res) => {
    res.send('edu library running ')
})

app.listen(port, () => {
    console.log(`Edu Library server on Port ${port}`);
})