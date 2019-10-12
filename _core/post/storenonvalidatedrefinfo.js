var Q = require('q');
var fs = require('fs');
var parser = require('xml2json');
var path = require('path');
var p = require(path.join(__dirname, '..', 'post', 'JS', 'pubmedComp.js'));
var foldpath = path.join(__dirname, '..','..', 'public', 'NonTaggedData.txt');
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
const bodyParser = require("body-parser");
var fs = require('fs');
module.exports = {
    //performs Pubmed and DOI Search.
     /**
     * Method to search the data in pubmed or crossref based on PMID or DOI supplied.
     * @param {String} req the req message input by the user. 
     * @param {String} res To supply back the response to the user.
     */
    storenonvalidatedrefinfo: function (req, res) {
        fs.appendFileSync(foldpath, "\n"+req.body.timestamp+"\n\n");
        fs.appendFileSync(foldpath, req.body.data+"\n\n\n\n");
        res.status(200).json({ status: { code: 200, message: " Non Validated data Updated to the server." } }).end();
    }

}