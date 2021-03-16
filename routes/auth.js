const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config(path.join(__dirname, "../.env"))
const MongoClient = require('mongodb').MongoClient
const ObjectID = require("mongodb").ObjectID
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const database = "gym-logger"

async function myAuthentication(req, res, next) {
    if (req.headers.cookie) {
        try {
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect()
            let userDBCollection = client.db(database).collection('myusers');
            let jwtToken = req.headers.cookie.slice(9)
            let verifiedUser = jwt.verify(jwtToken, process.env.RANDOM_KEY_FOR_JWT);
            let user = await userDBCollection.findOne({ _id: ObjectID(verifiedUser.user._id) });
            if (user) {
                req.body.user_id = user.email
                next();
            } else {
                res.status(404).json({ message: "Authentication failed. Logout and try again" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Unknown error. Please try agin" })
        }
    }

}

module.exports = myAuthentication