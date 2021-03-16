var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var path = require("path");

var cookie = require('cookie');

require('dotenv').config(path.join(__dirname + "../.env"));
const MongoClient = require('mongodb').MongoClient
const ObjectID = require("mongodb").ObjectID
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;


const database = "gym-logger"

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/checkloginstatus', async function (req, res, next) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect()
    let userDBCollection = client.db(database).collection('myusers');

    console.log(req.headers)

    if (req.headers.cookie) {
      let jwtToken = req.headers.cookie.slice(9)
      let verifiedUser = jwt.verify(jwtToken, process.env.RANDOM_KEY_FOR_JWT);
      let user = await userDBCollection.findOne({ _id: ObjectID(verifiedUser.user._id) });
      console.log(user)
      if (user) {
        res.status(200).json(user)
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Unknown error. Please try agin" })
  } finally {
    await client.close()
  }
});


router.post("/login", async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect()
    let userDBCollection = client.db(database).collection('myusers');
    let user = await userDBCollection.findOne({ email: req.body.email });

    if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare == true) {
        let jwtToken = jwt.sign({ user: user }, process.env.RANDOM_KEY_FOR_JWT, { expiresIn: 1800 })
        res.setHeader('Set-Cookie', cookie.serialize("jwtToken", jwtToken, {
          httpOnly: true,
          maxAge: 60 * 60,
          sameSite: "none",
          secure: true
        }))
        res.status(200).json(user)
      } else {
        res.status(500).json({ message: "Invalid Credentials. Please try again" })
      }

    } else {
      res.status(500).json({ message: "No user found" })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  } finally {
    await client.close()
  }
})

router.post("/register", async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    let userDBCollection = client.db(database).collection('myusers');
    let user = await userDBCollection.findOne({
      email: req.body.email
    });
    if (!user) {
      console.log("user is", user)
      let salt = await bcrypt.genSalt(10);
      let hashedPass = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPass;

      let insertion = await userDBCollection.insertOne(req.body)
      if (insertion.insertedCount === 1) {
        console.log("user inserted")
        res.status(200).json({
          message: "user inserted"
        })
      }
    } else {
      res.status(500).json({ message: "User exists. Please try to recover your password" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Unknown error occured. Contact admin" })
  } finally {
    await client.close();
  }

})


router.get("/logout", async (req, res) => {

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect()
    let userDBCollection = client.db(database).collection('myusers');

    if (req.headers.cookie) {
      let jwtToken = req.headers.cookie.slice(9)
      let verifiedUser = jwt.verify(jwtToken, process.env.RANDOM_KEY_FOR_JWT);
      let user = await userDBCollection.findOne({ _id: ObjectID(verifiedUser.user._id) });
      if (user) {
        res.setHeader('Set-Cookie', cookie.serialize("jwtToken", "", {
          httpOnly: true,
          maxAge: 60 * 60,
          sameSite: "none",
          secure: true
        }))
        res.status(200).json({ message: "Logout Successful" })
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(400)
    }

  } catch (error) {
    res.status(500).json({ message: error })
  } finally {
    await client.close()
  }

})

module.exports = router;
