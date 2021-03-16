var express = require('express');
var router = express.Router();
let myAuth = require("./auth")

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get("/updateuser:id", myAuth, (req, res) => {
  res.send(req.params.id)
})

module.exports = router;
