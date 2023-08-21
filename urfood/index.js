const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8000;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const data = await userModel.findOne({ email: email });
    if (data) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      data.save();
      res.send({ message: "Successfully sign up", alert: true });
    }
  } catch (err) {
    console.log(err);
  }
});

//api login
app.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email } = req.body;
  const result = await userModel.findOne({ email: email });
  if (result) {
    const dataSend = {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      image: result.image,
    };
    // console.log(dataSend);
    res.send({ message: "login successfull", alert: true, data: dataSend });
  } else {
    res.send({
      message: "Email is not available, please sign up",
      alert: false,
    });
  }
});

// product section

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  const data = await productModel(req.body);
  data.save();
  res.send({ message: "Upload successfully" });
});

//
app.get("/product", async (req, res) => {
  try {
    const data = await productModel.find({});
    res.send(JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
});

/*****payment getWay */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// console.log(process.env.STRIPE_SECRET_KEY)
app.post("/create-checkout-session", async (req, res) => {
  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1NhTnKSDeTXYn093o8YM01jW" }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              // images : [item.image]
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    // console.log(session)
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
