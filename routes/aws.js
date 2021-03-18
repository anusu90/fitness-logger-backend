const path = require("path")
var mysql = require('mysql');

require('dotenv').config(path.join(__dirname + "../.env"));
const { RDS } = require('@aws-sdk/client-rds');
const REGION = "ap-south-1";

function queryExercise() {
    var con = mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DB_NAME
    });

    let exerPromise = new Promise((res, rej) => {
        con.connect(function (err) {
            if (err) throw err;
            con.query("SELECT * FROM exercise", function (err, result, fields) {
                if (err) rej(err);
                con.end()
                res(result)
            });
        });
    })
    return exerPromise
}


function queryStatement(reqObj) {
    var con = mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DB_NAME
    });

    let statement = `insert into user_exer_log (user_id, exercise_id, sets, reps, weight, date_exercise) values ('${reqObj.user_id}', ${reqObj.exercise}, ${reqObj.set}, ${reqObj.reps}, ${reqObj.weight}, "${reqObj.date}")`

    console.log(statement)

    let exerPromise = new Promise((res, rej) => {
        con.connect(function (err) {
            if (err) throw err;
            con.query(`${statement}`, function (err, result, fields) {
                if (err) rej(err);
                con.end()
                res(result)
            });
        });
    })
    return exerPromise
}

function queryExerTable(reqObj) {
    var con = mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DB_NAME
    });

    let statement = `select exercise_id, date_exercise, sets, reps, weight from user_exer_log where user_id = '${reqObj.user_id}'`

    console.log(statement)

    let exerPromise = new Promise((res, rej) => {
        con.connect(function (err) {
            if (err) throw err;
            con.query(`${statement}`, function (err, result, fields) {
                if (err) rej(err);
                con.end()
                res(result)
            });
        });
    })
    return exerPromise
}

module.exports = { queryExercise, queryStatement, queryExerTable };