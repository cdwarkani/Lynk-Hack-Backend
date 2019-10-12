var path = require('path');
var exec = require('child_process').exec;
const fs = require('fs');
var message = "";
var path = require('path');
var us = require(path.join(__dirname, '..', 'post', 'anystyle.js'));
var anystyle = {
    check: function (req, res ) {
        if(us.checkstatus()=="")
        {
        res.status(200).send("Training data in progress.").end();
        }else
        {
            res.status(200).send(""+us.checkstatus()).end();
        }
    }
}
module.exports = anystyle;