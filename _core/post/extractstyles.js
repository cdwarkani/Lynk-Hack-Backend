var Q = require('q');
var fs = require('fs');
var parser = require('xml2json');
var path=require('path');
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
module.exports = {
	extractstyles: function (req, res, wfXML) {
        var listoffiles = [];
        var filelist = [];
        var jsonPath = path.join(__dirname, '..','..','_data','styles');
        fs.readdirSync(jsonPath).forEach(file => {
            filelist.push(file);
        });
        var filePromiseobject = [];
        for (var k = 0; k < filelist.length; k++) {
            var filepath=path.join(jsonPath,filelist[k]);
            filePromiseobject.push(fs.readFileSync(filepath, "utf8"));
        }
        Q.allSettled(filePromiseobject).then(function (data) {
            for (var k = 0; k < data.length; k++) {
                if(filelist[k].includes(".csl"))
                {listoffiles.push(JSON.parse(parser.toJson(data[k].value)).style.info.title + '|' + filelist[k]);}
            } 
            res.status(200).json({status:{code: 200, message: listoffiles}}).end();    
        }).catch(function (error) {
            res.status(500).json({status:{code: 500, message: "Unable to extract list of styles. Please try after sometime. Something went wrong"}}).end();
            return;
        });
    }
}