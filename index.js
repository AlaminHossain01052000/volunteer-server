const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const cors = require("cors");
const port = process.env.PORT || 5000;
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.li11u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const databse = client.db("volunteer_network");
        const eventCollection = databse.collection("events");
        const registerCollection = databse.collection("registers")

        app.get("/events", async (req, res) => {
            const events = await eventCollection.find({}).toArray();
            res.json(events)
        })

        // events entering
        app.post("/events", async (req, res) => {
            const newEvent = await eventCollection.insertOne(req.body);
            res.json(newEvent);
        })
        // get registers
        app.get("/registers", async (req, res) => {
            const registers = await registerCollection.find({}).toArray();
            res.json(registers);
        })
        // get my events
        app.get("/registers/:email", async (req, res) => {
            const email = req.params.email;
            const query = { Email: req.params.email }
            const result = registerCollection.find(query);
            const registration = await result.toArray();
            res.json(registration)
            // res.json(myRegistration);
        })

        // find a specific event
        app.get("/events/:id", async (req, res) => {
            const event = await eventCollection.findOne({ _id: ObjectId(req.params.id) });
            res.json(event)

        })
        // post a register
        app.post("/registers", async (req, res) => {
            console.log(req.body);
            const registered = await registerCollection.insertOne(req.body);
            res.json(registered);
        })

        // delete a registered id

        app.delete("/registers/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const result = await registerCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is alright")
})
app.listen(port, () => {
    console.log("listening to port", port);
})