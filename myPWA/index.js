const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('.database/datasource.db');

let myString = '123';

/*
START
GET sddstudents
DISPLAY writeRecord(sddstudents)
END

START SUBROUTINE writeRecord(record)
    LET myString = '[\n'
    LET counter = 0
    FOR EACH item IN record
        LET myString = myString + '{\n"nesaID":' + record.nesaID[counter] + ",\n" + '{\n"name":' + record.name[counter] + ",\n" + '{\n"age":' + record.nesaID[age] + "\n}"
        IF counter + 1 = record.length
            LET myString = myString + "\n]"
        ELSE IF 
            LET myString = myString + ",\n"
        END IF
        LET counter = counter + 1
    END FOR EACH
    RETURN myString
END SUBROUTINE
*/


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