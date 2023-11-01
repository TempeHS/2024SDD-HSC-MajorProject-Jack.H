const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('.database/datasource.db');

let myString = '123';


var fs = require('fs');
fs.writeFile("public/frontEndData.json", myString + "]", function(err) {
    if (err) {
        console.log(err);
    }
});


const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "myPWA/public/index.html"));
});
app.listen(8000, () => console.log("test"));