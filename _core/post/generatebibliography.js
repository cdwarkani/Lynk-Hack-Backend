var Q = require('q');
var path = require('path');
var us = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var tchg = require('./trackchanges.js');
var c2bsJson = require('./convert2bsjson.js');
var fpmId = require('./fetchpmid.js');
var multiplepmId = require('./resolvemultiplepmidsusingpubmed.js');
var json2citeproc = require('./bsjson2citeproc.js');
var rateLimit = 20;
module.exports = {
    generatebibliography: function (req, res, wfXML) {
    var dataToGenerateBibliography=[];  
    var skipTrackChanges = req.body.skipTrackChanges;
    if(JSON.parse(req.body.data))
    req.body.data=JSON.parse(req.body.data);

    for(var i=0;i<req.body.data.length;i++)
      {
          if(req.body.data[i]!=null && req.body.data[i].state=="fulfilled" && req.body.data[i].value.status=="200" )
          {
              var datainfo=req.body.data[i].value;
              dataToGenerateBibliography.push(json2citeproc.bsjson2citeprocModule({ 'data': JSON.stringify(datainfo.message), "locale": datainfo.message.InputSupplied.locale, "style": datainfo.message.InputSupplied.style }, true));
          }
        
      }
      Q.allSettled(dataToGenerateBibliography).then(function (data) {
        data = mergeOutputs(data).then(function (data) {
            if(skipTrackChanges == undefined){
                tchg.trackchangesModule(data.value, inputInformation, true)
                .then(function (datainfo) {
                    res.status(200).json({ "message": datainfo.message, "status": "success" }).end();
                    return;
                })
                .catch(function (e) {
                    res.status(500).json({ "message": "Something went wrong while adding track changes", "status": "Failed" }).end();
                    return;
                });
            }else{
                res.status(200).json({ "message": data.value.message, "status": "success" }).end();
            }
        });
    });
      
}

}
function mergeOutputs(datainfo) {
    return new Promise(function (resolve, reject) {
        var index;
        for (var i = 0; i < datainfo.length; i++) {
            index = i * rateLimit;
            if (i > 0) {
                if (datainfo[i].state == "fulfilled") {
                    var FailedInputs = datainfo[i].value.message.FailedInputs;
                    var InputConvertedToBSJson = datainfo[i].value.message["InputConvertedToBSJson"];
                    var ValidatedAndFormatted = datainfo[i].value.message["Output"]["ValidatedAndFormatted"];
                    var NonValidatedbutFormatted = datainfo[i].value.message["Output"]["NonValidatedbutFormatted"];
                    for (var a = 0; a < FailedInputs.length; a++) {
                        var input = FailedInputs[a];
                        var tempJson = {};
                        var indexB = index;
                        Object.keys(input).map(function (indexBI) {
                            indexB = parseInt(indexBI) + index;
                            tempJson[indexB] = input[indexBI];
                        });
                        datainfo[0].value.message["FailedInputs"].push(tempJson);

                    }
                    for (var b = 0; b < InputConvertedToBSJson.length; b++) {
                        var input = InputConvertedToBSJson[b];
                        var tempJson = {};
                        var indexB = index;
                        Object.keys(input).map(function (indexBI) {
                            indexB = parseInt(indexBI) + index;
                            tempJson[indexB] = input[indexBI];
                        });
                        datainfo[0].value.message["InputConvertedToBSJson"].push(tempJson);
                    }
                    for (var c = 0; c < ValidatedAndFormatted.length; c++) {
                        var input = ValidatedAndFormatted[c];
                        var tempJson = {};
                        var indexB = index;
                        Object.keys(input).map(function (indexBI) {
                            indexB = parseInt(indexBI) + index;
                            tempJson[indexB] = input[indexBI];
                        });
                        datainfo[0].value.message["Output"]["ValidatedAndFormatted"].push(tempJson);
                    }
                    for (var d = 0; d < NonValidatedbutFormatted.length; d++) {
                        var input = NonValidatedbutFormatted[d];
                        var tempJson = {};
                        var indexB = index;
                        Object.keys(input).map(function (indexBI) {
                            indexB = parseInt(indexBI) + index;
                            tempJson[indexB] = input[indexBI];
                        });
                        datainfo[0].value.message["Output"]["NonValidatedbutFormatted"].push(tempJson);
                    }
                }
            }
        }
        resolve(datainfo[0]);
        return;
    });
}