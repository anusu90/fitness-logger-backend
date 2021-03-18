var express = require('express');
var router = express.Router();
let myAuth = require("./auth")
let { queryExercise, queryStatement, queryExerTable, queryFreeStatement } = require("./aws")


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/exercise', async function (req, res, next) {
  exercisePromise = queryExercise()
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err)
      res.send(500).json({ message: "Unknown Error" })
    })

});

router.get('/exercisetable', myAuth, async function (req, res, next) {
  exercisePromise = queryExerTable(req.body)
    .then(data => {
      console.log(data)
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err)
      res.send(500).json({ message: "Unknown Error" })
    })
});

router.get('/exercisemax', myAuth, async function (req, res, next) {
  let statement = `select exercise_id, date_exercise , max(weight) from user_exer_log where user_id='${req.body.user_id}' group by exercise_id`;
  console.log(statement)
  exercisePromise = queryFreeStatement(statement)
    .then(data => {
      console.log(data)
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err)
      res.send(500).json({ message: "Unknown Error" })
    })
});

router.post('/exercise/insert', myAuth, async function (req, res, next) {
  console.log(req.body)
  exercisePromise = queryStatement(req.body)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err)
      res.send(500).json({ message: "Unknown Error" })
    })

});


router.get("/updateuser:id", myAuth, (req, res) => {
  res.send(req.params.id)
})

module.exports = router;
