var Q = require('q');
var path = require('path');
var cheerio = require('cheerio');
var decode = require('unescape');
var u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var c2j = require(path.join(__dirname, '..', 'post', 'JS', 'xml2json.js'));
var xml2js = require('xml2js');
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
const defaultParams = '?tool=kriya&email=pari@exeterpremedia.com';
const efetchURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
const formatAsJSON = '&format=json';
const idconvURL = 'https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/';
const retModeXML = '&retmode=xml&api_key=80e7e63d06de8fb27a5392b52a6acaec7b09';
exports.validationStatus = "true";
var us = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var tchg = require('./trackchanges.js');
var c2bsJson = require('./convert2bsjson.js');
var fpmId = require('./fetchpmid.js');
var multiplepmId = require('./resolvemultiplepmidsusingpubmed.js');
var json2citeproc = require('./bsjson2citeproc.js');
var rateLimit = 20;

module.exports = {
    validationStatus: true,
    validateusingfetchpmidandresolvemultiplepmid: function (req, res, wfXML) {
        var skipTrackChanges = req.body.skipTrackChanges;
        var datainfo = req.body.data;
        if (req.body.validationstatus == "false") {
            this.validationStatus = "false";
        }else
        {
            this.validationStatus = "true";
        }
        if (!((datainfo) instanceof {}.constructor)) {
            datainfo = JSON.parse(datainfo);
        }
        if (req && req.body && req.body.rateLimit && req.body.rateLimit != "" && req.body.rateLimit > 0) {
            try {
                rateLimit = parseInt(req.body.rateLimit);
            } catch (e) {
                //npt important try block
            }
        }
        if (datainfo.status == 200) {
            var processDataBasedOnRateLimit = [];
            var dataToProcess = datainfo.message.output;
            var datainfoToProcess = [];
            for (var i = 0; i < dataToProcess.length;) {
                DatumInfo = datainfo;
                datainfoToProcess = [];
                for (var k = i; ((k - i) < rateLimit && k < dataToProcess.length); k++) {
                    datainfoToProcess.push(dataToProcess[k]);
                }
                DatumInfo.message.output = datainfoToProcess;
                processDataBasedOnRateLimit.push(processData(DatumInfo));
                i = i + rateLimit;
            }
            Q.allSettled(processDataBasedOnRateLimit).then(function (data) {

                res.status(200).json(data).end();
                return;
            });
        }
    }
}
function processData(datainfo) {
    var head = { "Content-Type": "application/x-www-form-urlencoded" };
    return new Promise(function (resolve, reject) {
        fpmId.fetchpmidModule({ 'data': JSON.stringify(datainfo.message.output), 'type': "html", 'post': "", "locale": datainfo.message.input.locale, "style": datainfo.message.input.style }, true)
            .catch(function (error) {
                reject({ "message": "Data conversion for converting the validate JSON to desired style stage failed.", "status": "Failed" });
                return;
            }).then(function (datainfo) {
                if (datainfo.status == 200) {
                    multiplepmId.resolvemultiplepmidsusingpubmedModule({ 'data': JSON.stringify(datainfo.message), "locale": datainfo.message.InputSupplied.locale, "style": datainfo.message.InputSupplied.style }, true)
                        .catch(function (error) {
                            reject({ "message": "Data conversion for converting the validate JSON to desired style stage failed.", "status": "Failed" });
                            return;
                        }).then(function (datainfo) {
                            if (datainfo.status == 200) {

                                resolve(datainfo);
                                return;

                            } else {
                                reject({ "message": "Data conversion for converting the validate JSON to desired style stage failed.", "status": "Failed" });
                                return;
                            }
                        });
                } else {
                    reject({ "message": "Data conversion for converting the validate JSON to desired style stage failed.", "status": "Failed" });
                    return;
                }
            });

    });
}