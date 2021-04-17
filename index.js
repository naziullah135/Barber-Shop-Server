const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect((err) => {
  console.log('connection error',err);
  const serviceCollection = client.db("BarberShop").collection("services");
  
  app.post("/addService", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service)
    .then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(service);
  });

  app.get("/services", (req, res) => {
    serviceCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(process.env.PORT || port);
