const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://metro:tW5eYW8hcr3GRnAw@cluster0.he0in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("MetroMeal").collection("user");
    const ordersCollection = client.db("MetroMeal").collection("orderData");
    const varificationCollection = client
      .db("MetroMeal")
      .collection("varificationRequest");

    app.get("/users", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      if (req.query.role) {
        query = { role: req.query.role };
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/allUsers", async (req, res) => {
      let query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.patch("/users/verify", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          varify: "True",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.patch("/users/:id", async (req, res) => {
      console.log("hitted");
      const id = req.params.id;
      let query = {};
      const options = { upsert: true };
      let updatedDoc = {
        $set: {},
      };
      if (req.body) {
        console.log(req.body);
        query = { _id: new ObjectId(id) };
        updatedDoc = {
          $set: {
            number: req.body.number,
            varify: req.body.varify,
          },
        };
      }
      const result = await usersCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(result);
    });
    app.patch("/users/coupon/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      let query = {};
      const options = { upsert: true };
      let updatedDoc = {
        $set: {},
      };
      if (req.body) {
        query = { _id: new ObjectId(id) };
        updatedDoc = {
          $set: {
            discount: req.body.discount,
          },
        };
      }
      const result = await usersCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(result);
    });
    app.patch("/users/varify/:id", async (req, res) => {
      const id = req.params.id;

      let query = {};
      const options = { upsert: true };
      let updatedDoc = {
        $set: {},
      };
      if (req.body) {
        query = { _id: new ObjectId(id) };
        updatedDoc = {
          $set: {
            roleCategory: req.body.role,
          },
        };
      }
      const result = await usersCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
      console.log("r", result);
    });
    app.patch("/users/updateInfo/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      let query = {};
      const options = { upsert: true };
      let updatedDoc = {
        $set: {},
      };
      if (req.body) {
        query = { _id: new ObjectId(id) };
        updatedDoc = {
          $set: {
            img: req.body.img,
            house: req.body.house,
            road: req.body.road,
            flat: req.body.flat,
            address: req.body.address,
          },
        };
      }
      const result = await usersCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(result);
    });
    app.delete("/varifyUser/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await varificationCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });
    app.get("/approvedOrders", async (req, res) => {
      let query = { status: true };

      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/pendingOrders", async (req, res) => {
      let query = { status: false };

      const result = await ordersCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    app.patch("/pendingOrders/:id", async (req, res) => {
      const id = req.params.id;

      let query = {};
      const options = { upsert: true };
      let updatedDoc = {
        $set: {},
      };
      if (req.body) {
        query = { _id: new ObjectId(id) };
        updatedDoc = {
          $set: {
            status: req.body.status,
          },
        };
      }
      const result = await ordersCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(result);
    });
    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.customerEmail) {
        query = { email: req.query.customerEmail };
      }
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const result = await ordersCollection
        .find(query, {
          projection: {
            _id: 1,
            orderId: 1,
            mealData: 1,
            mealPlan: 1,
            total: 1,
            container: 1,
            containerReturn: 1,
            containerReturnData: 1,
            status: 1,
            trxId: 1,
            imgLink: 1,
            paymentMethod: 1,
          },
        })
        .skip(skip)
        .limit(limit)
        .toArray();

      res.send(result);
    });

    app.post("/varifyUser", async (req, res) => {
      const data = req.body;
      const result = await varificationCollection.insertOne(data);
      console.log(result);
      res.send(result);
    });
    app.get("/AllVarifyReq", async (req, res) => {
      let query = {};

      const result = await varificationCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Turf server is running");
});

app.listen(port, () => console.log(`meal server is running on ${port}`));
