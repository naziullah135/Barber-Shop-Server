const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbnje.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log(err);
  const serviceCollection = client.db("BarberShop").collection("services")
  const reviewCollection = client.db("BarberShop").collection("reviews")

  app.post("/addService", (req, res) => {
    const service = req.body;
    console.log("add service", service);
    serviceCollection.insertOne(service).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, services) => {
      res.send(services);
    });
  });

  app.post("/addReview", (req, res) => {
    const review = req.body;
    console.log("add review", review);
    reviewCollection.insertOne(review).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find().toArray((err, review) => {
      res.send(review);
    });
  });
  
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
