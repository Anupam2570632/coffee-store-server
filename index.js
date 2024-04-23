const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oeipnk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();

        const coffeeCollection = client.db('myDB').collection('coffees')
        const userCollection = client.db('myDB').collection('user')


        app.get('/coffees', async (req, res) => {
            const result = await coffeeCollection.find().toArray()
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })


        app.post('/coffees', async (req, res) => {
            const coffee = req.body;
            console.log(coffee)
            const result = await coffeeCollection.insertOne(coffee)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })


        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        app.put('/coffees', async (req, res) => {
            const coffee = req.body;
            const id = coffee.id

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = {
                $set: {
                    name: coffee.name,
                    chef: coffee.chef,
                    quantity: coffee.quantity,
                    test: coffee.test,
                    photo: coffee.photo
                }
            }

            const result = await coffeeCollection.updateOne(filter, updatedCoffee, options)
            res.send(result)
        })

        app.patch('/users', async (req, res) => {
            const updatedData = req.body;
            console.log(updatedData)
            const email = updatedData.email;

            const filter = { email: updatedData.email }
            const user = {
                $set: {
                    lastSignInAt: updatedData.lastLoggedAt
                }
            }
            const result = await userCollection.updateOne(filter, user)
            res.send(result)
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
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


app.get('/', (req, res) => {
    res.send('coffee store server is running');
})

app.listen(port, () => {
    console.log(`coffee store server is running on port: ${port}`);
})