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

var fetchpmid = {
  /**
 * Function extracts the pmid and doi list from data and tries to resolve and validate the data from pubmed as well as crossref.
 * @param {string} req - Input request point of the service.
 * @param {string} res - Output response point of the service.
 */
  fetchpmid: function (req, res) {
    fetchpmid.fetchpmidModule(req)
      .then(function (pmidJSONList) {
        res.status(200).json(pmidJSONList.message).end();
      })
      .catch(function (err) {
        res.status(500).send(err).end();
      });
  },
  fetchpmidModule: function (param, updateStatus) {
    return new Promise(function (resolve, reject) {
      try {
        if (updateStatus) {
          param['body'] = param;
        }
        var pmidList = [], doiList = [], HtmltoJSONList = [], FailedInputs = [], temporaryJSON = {}, temporaryJSON2 = {}, pmidListSeperatedbyComma = "", doiListSeperatedbyComma = "", pmidIndexListSeperatedbyComma = "", data = JSON.parse(param.body.data);
        var templJSON = require('./Json/j_iso_name.json');
        for (var k = 0; k < data.length; k++) {
          temporaryJSON = {};
          temporaryJSON2 = {};
          if (data[k].state == "fulfilled") {
            temporaryJSON[k] = data[k].value.message;
            tit = temporaryJSON[k]["container-title"];
            if (tit && templJSON[tit]) {
              temporaryJSON[k]["container-title"] = templJSON[tit];
            }
            HtmltoJSONList.push(temporaryJSON);
            if (data[k].value.message.PMID) {
              temporaryJSON2[k] = data[k].value.message.PMID;
              pmidList.push(temporaryJSON2);
            } else if (data[k].value.message.DOI && (data[k].value.message.title.indexOf('/') > 0) && (data[k].value.message.title.indexOf('.') > 0)) {
              temporaryJSON2[k] = data[k].value.DOI;
              doiList.push(temporaryJSON2);
              doiListSeperatedbyComma = doiListSeperatedbyComma + data[k].value.message.DOI + ",";
            }
          } else {
            temporaryJSON[k] = "Sorry, Input is poorly structured. We were unable to convert the input to JSON.";
            FailedInputs.push(temporaryJSON);
          }
        }
        doiListSeperatedbyComma = doiListSeperatedbyComma.slice(0, doiListSeperatedbyComma.length - 1);

        var url = idconvURL + defaultParams + formatAsJSON + '&ids=' + doiListSeperatedbyComma;
        url = (decode(url));
        if (doiListSeperatedbyComma == "") {
          url = "type1";
        }
        u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
        u.requestData('GET', encodeURI(url), "", "", { "style": param.body.style, "locale": param.body.locale })
          .then(function (data) {
            pmidListSeperatedbyComma = "";
            if ((data.status == 200) && data.message.records && (data.message.records.length > 0)) {
              for (var i = 0; i < data.message.records.length; i++) {
                var index = "", pmid = "";
                temporaryJSON2 = {};
                for (var k = 0; k < doiList.length; k++) {
                  var arr = Object.keys(doiList[k]).map(function (s) {
                    if ((doiList[k][s] == data.message.records[i].doi) && data.message.records[i].pmid) {
                      index = s;
                      pmid = data.message.records[i].pmid;
                      temporaryJSON2[index] = pmid;
                      pmidList.push(temporaryJSON2);
                    }
                  });
                }
              }
            }
            for (var k = 0; k < pmidList.length; k++) {
              var arr = Object.keys(pmidList[k]).map(function (s) {
                index = s;
                pmid = pmidList[k][s];
                pmidListSeperatedbyComma += pmid + ",";
                pmidIndexListSeperatedbyComma += index + ",";

              });
            }
            pmidListSeperatedbyComma = pmidListSeperatedbyComma.slice(0, pmidListSeperatedbyComma.length - 1);
            pmidIndexListSeperatedbyComma = pmidIndexListSeperatedbyComma.slice(0, pmidIndexListSeperatedbyComma.length - 1);
            fetchpmid.resolveMultiplePMID(pmidListSeperatedbyComma, pmidIndexListSeperatedbyComma, HtmltoJSONList, data.index)
              .then(function (pmidJSONList) {
                resolve({ "status": 200, 'message': { "YetToBeResolved": pmidJSONList.yetToBeResolved, "FailedInputs": FailedInputs, "SuccesfullyValidatedAndResolved": pmidJSONList.finalpubmedJSONList, "InputConvertedToBSJson": HtmltoJSONList, "InputSupplied": pmidJSONList.extraData } });
                return;
              })
              .catch(function () {
                reject('error');
                return;
              });
          });
      } catch (err) {
        reject(err);
      }

    });
  },
  resolveMultiplePMID: function (pmidListSeperatedbyComma, pmidIndexListSeperatedbyComma, HtmltoJSONList, extraData) {
    /**
     *
     *  Purpose: Used for querying pubmed with PMID or PMCID as input
     *
     *  Functionality: It Gets the input object and Converts the input object to pubmed query url. Sends the query to pubmed and gets the meta Pubmed XML data.
     *  Converts the meta data to CSLJSON and feeds it to the CiteProc.js
     *
     *
     *  Example of pubmed url having PMID=11954634 which returns pubmed Xml data:
     *  https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmax=5000&retmode=xml&id=11954634
     *
     */
    return new Promise(function (resolve, reject) {
      try {
        var finalpubmedJSONList = [];
        if (pmidListSeperatedbyComma == undefined) {
          reject(errorFormatter.errorFormatter(500, 'unable to get pmid from input supplied.', "Unable to convert tagged data to pmid.Please check your pmid."));
          return;
        }
        var url = efetchURL + defaultParams + retModeXML + '&db=pubmed&id=' + pmidListSeperatedbyComma;

        if (pmidListSeperatedbyComma == "") {
          url = "type1";
        }
        console.log(url);
        u.requestData('GET', url, "", "", { "index": pmidIndexListSeperatedbyComma, "HtmltoJSONList": HtmltoJSONList, "pmidListSeperatedbyComma": pmidListSeperatedbyComma, "extraData": extraData,"requestType":"pubmedServer" })
          .then(function (data) {
            try {
              var FINALCSLJSON = {}, temporaryJSON = {};
              var extractJsonFromXml = "";
              var pmidList = data.index.pmidListSeperatedbyComma.split(',');
              var xml2js = require('xml2js');
              var parser = new xml2js.Parser();
              data.message = data.message.replace(/&/g, "&amp;");
              data.message = data.message.replace(/\n/g, "");
              data.message = data.message.replace(/[\s0-9]*[<]+[\s0-9]+/g, "");
              data.message = data.message.replace(/[\s0-9]*<-+[\s0-9]+/g, "");
              parser.parseString(data.message, function (err, result) {
                //Extract the value from the data element
                if (err && err.message && err.message == ("Non-whitespace before first tag.\nLine: 0\nColumn: 1\nChar: u")) {
                } else if (err) {
                  console.log("ERROR:::::  The xml output from pubmed was not properly converted to JSON. Check the parser.parseString() module in fetchpmid.js"+err);
                }
                extractJsonFromXml = result;


                var builder = new xml2js.Builder();
                var pmidIndexListCollection = data.index.index.split(',');
                var FinalHtmltoJSONList = JSON.parse(JSON.stringify(data.index.HtmltoJSONList));

                if (extractJsonFromXml && extractJsonFromXml["PubmedArticleSet"] && extractJsonFromXml["PubmedArticleSet"]["PubmedArticle"] && extractJsonFromXml["PubmedArticleSet"]["PubmedArticle"].length) {
                  for (var i = 0; i < extractJsonFromXml["PubmedArticleSet"]["PubmedArticle"].length; i++) {
                    temporaryJSON = {};
                    var csljson = c2j.convert2(builder.buildObject({ "PubmedArticleSet": { "PubmedArticle": extractJsonFromXml["PubmedArticleSet"]["PubmedArticle"][i] } }));
                    csljson["source"]="Pubmed";
                    if (csljson != undefined) {
                      for (var si = 0; si < pmidList.length; si++) {
                        if (pmidList[si] == csljson.PMID) {
                          temporaryJSON[pmidIndexListCollection[si]] = csljson;
                          break;
                        }
                      }
                      for (var k = 0; k < data.index.HtmltoJSONList.length; k++) {
                        var arr = Object.keys(data.index.HtmltoJSONList[k]).map(function (s) {
                          if (s == pmidIndexListCollection[i]) {
                            FinalHtmltoJSONList = FinalHtmltoJSONList.slice(0, k).concat(FinalHtmltoJSONList.slice(k + 1, FinalHtmltoJSONList.length))
                          }
                        });
                      }
                      data.index.HtmltoJSONList = JSON.parse(JSON.stringify(FinalHtmltoJSONList));
                      finalpubmedJSONList.push(temporaryJSON);
                    }
                    temporaryJSON = {};

                  }
                }
                resolve({ "finalpubmedJSONList": finalpubmedJSONList, "yetToBeResolved": FinalHtmltoJSONList, "extraData": data.index.extraData });
                return;
              });
            } catch (error) {
              reject(errorFormatter.errorFormatter(500, error, 'Unable to get pubmed meta data using pmid. Something went wrong.'));
              return;
            }
          })
          .catch(function (error) {
            reject(errorFormatter.errorFormatter(500, error, 'Unable to get pubmed meta data using pmid. Something went wrong.'));
            return;
          });
      } catch (e) {
        reject(e);
      }
    });
  }
}
module.exports = fetchpmid;

