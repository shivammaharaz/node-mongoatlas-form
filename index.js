const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('public'))
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// db connection starts ****************************************//

mongoose.connect(
  "mongodb+srv://Shivam:2001@cluster0.bxo7vjp.mongodb.net/DemoData",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const user = model("USER", userSchema);
//db connection ends *******************************************//

// home page ***************************************************//
app.get("/", async (req, resp) => {
  resp.sendFile(__dirname+"/public/index.html")
});
app.get("/data",  (req, resp) => {
  const data = user.find({});
  resp.send(JSON.stringify(data));
});
//  home page code ends here ***********************************//

// user login page code  ****************************************//

app.post("/login", (req, resp) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(data);
  user.findOne({ email: data.email }, (err, users) => {
    if (users) {
      if (users.password === data.password) {
        resp.send({ message: "Login Successful", user: users });
      } else {
        resp.send({ message: "Incorrect Password" });
      }
    } else {
      console.log(users);
      resp.send({ message: "User not Registered" });
    }
  });
});

// user login code ends here **************************************//

// user registartion code  *****************************************//

app.post("/register", (req, resp) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  user.findOne({ email: data.email }, (err, users) => {
    if (users) {
      resp.send({ message: "User already registered" });
    } else {
      const myData = new user(data);
      myData.save((err) => {
        if (!err) {
          resp.send({ message: "Registration Successful" });
        } else {
          console.log(err);
        }
      });
    }
  });
});

// user registration code ends here *************************************//

app.listen(port, () => {
  console.log("listening ont port ", port);
});
