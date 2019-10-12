var Q = require('q');
var path = require('path');
var cheerio = require('cheerio');
var decode = require('unescape');
var c2j = require(path.join(__dirname, '..', 'post', 'JS', 'xml2json.js'));
var anystyle = require(path.join(__dirname, '..', 'post', 'anystyle.js'));
var u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));

var convert2bsjsonmod = {
  /**
 * Function converts HTML string of input to Biblioservice compatible JSON.
 * @param {string} req - Input request point of the service.
 * @param {string} res - Output response point of the service.
 */
  convert2bsjson: function (req, res) {
    this.convert2bsJsonModuleusingAnyStyle(req)
      .then(function (data) {
        res.status(200).json(data).end();
      })
      .catch(function (err) {
        res.status(500).json("Something unexpectedly went wrong").end();
      });

  },
  convert2bsJsonModule: function (param, updateStatus) {
    return new Promise(function (resolve, reject) {
      try {
        console.log(param);
        if (param.body.type == "html") {
          var cheerio = require('cheerio');
          var s = cheerio.load(param.body.data);
          var listData = [];
          for (var i = 0; i < s('p').length; i++) {
            listData.push(s(s('p')[i]).toString());
          }
          convertHTML2BsJSON(listData, param.body.type, { "style": param.body.style, "locale": param.body.locale, "type": param.body.type })
            .then(function (data) {
              if (updateStatus) {
                resolve({ "status": 200, 'message': { "output": data.message, "input": param.body } });
              } else {
                resolve({ "status": 200, 'message': { "output": data.message, "input": param.body } });
              }
              return;
            }).catch(function (e) {
              reject("Something unexpectedly went wrong");
              return;
            });
        } else if (param.body.type == "reference") {
          var dataSet;
          console.log();
          if (param && param.body && param.body.data) {
            dataSet = param.body.data.split('},{');
          }

          if (dataSet.length == 1) {
            dataSet[0] = dataSet[0].substring(2, dataSet[0].length);
          }
          if (dataSet.length > 1) {
            var x = dataSet.length;
            dataSet[0] = dataSet[0].substring(2, dataSet[0].length);
            dataSet[x - 1] = dataSet[x - 1].substring(0, dataSet[x - 1].length - 2);
          }
          convertReferencetoHTML(dataSet, param).then(function (value) {
            value.index.body.type = "html";
            value.index.body.data = value.data.join("");
            convert2bsjsonmod.convert2bsJsonModule(value.index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function () {
                reject("Something unexpectedly went wrong");
              });
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }, convert2bsJsonModuleusingAnyStyle: function (param, updateStatus) {
    return new Promise(function (resolve, reject) {
      try {
        console.log(param);
        if (param.body.type == "html") {
          var cheerio = require('cheerio');
          var s = cheerio.load(param.body.data);
          var listData = [];
          for (var i = 0; i < s('p').length; i++) {
            listData.push(s(s('p')[i]).toString());
          }
          convertHTML2BsJSON(listData, param.body.type, { "style": param.body.style, "locale": param.body.locale, "type": param.body.type })
            .then(function (data) {
              if (updateStatus) {
                resolve({ "status": 200, 'message': { "output": data.message, "input": param.body } });
              } else {
                resolve({ "status": 200, 'message': { "output": data.message, "input": param.body } });
              }
              return;
            }).catch(function (e) {
              reject("Something unexpectedly went wrong");
              return;
            });
        } else if (param.body.type == "reference") {
          var dataSet;
          console.log();
          if (param && param.body && param.body.data) {
            dataSet = param.body.data.split('%0D');
          }



          convertReferencetoJSONAnystyle(dataSet, param).then(function (value) {
            if (!value || !value["message"] ) {
              reject("Issue convert ref to JSON using anystyle");
              return;
            }
            var messageOutput = value["message"];
            delete value["message"];
            value["message"] = {};
            value["status"] = value["code"];
            value["message"]["input"] = messageOutput[0].value.index;
            for (var i = 0; i < messageOutput.length; i++) {
              delete messageOutput[i]["value"]["index"];
              var message = messageOutput[i]["value"]["message"];

              messageOutput[i]["value"]["message"] = message;
            }
            value["message"]["output"] = messageOutput;
            resolve(value);
            return;
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
module.exports = convert2bsjsonmod;
/**
 * Function converts HTML string of input to Biblioservice compatible JSON.
 * @param {string} reference - The html reference input.
 * @param {string} type - 'html' since the reference supplied is of html type.
 * @param {string} index - index number of the reference
 */
function convertHTML2BsJSON(reference, type, index) {
  return new Promise(function (resolve, reject) {
    try {
      var HtmltoJSONCollection = [];
      for (var i = 0; i < reference.length; i++) {
        HtmltoJSONCollection.push(convertHTML2BsJSONPreProcessing(reference[i], "html", index));
      }
      Q.allSettled(HtmltoJSONCollection).then(function (data) {

        resolve({ "code": 200, "message": data });
        return;
      }).catch(function (e) {
        reject(e);
        return;
      });

    }
    catch (e) {
      reject(e)
      return;
    }
  });
}
/**
 * Function converts HTML string of input to JSON for making it biblio compatible.
 * @param {string} reference - The html reference input.
 * @param {string} type - 'html' since the reference supplied is of html type.
 * @param {string} index - index number of the reference
 */
function convertHTML2BsJSONPreProcessing(reference, type, index) {
  return new Promise(function (resolve, reject) {
    try {
      var promisejson = c2j.convert(reference, JSON.stringify(index));
      promisejson.then(function (data) {
        value = data.info;
        if (value["container-title"])
          value["container-title"] = value["container-title"].replace(/<(.|\n)*?>/g, '');
        if (value["title"])
          value["title"] = value["title"].replace(/<(.|\n)*?>/g, '');
        var authorlist = [];
        if (value["author"]) {
          for (var i = 0; i < value["author"].length; i++) {
            var ss = value["author"][i];
            var famdata = {};
            var i1 = ss.indexOf(">");
            ss = ss.slice(i1 + 1, ss.length);
            i1 = ss.indexOf("</span>");
            var ssf = ss.slice(0, i1);
            ss = ss.slice(i1 + 7, ss.length);
            var i1 = ss.indexOf(">");
            ss = ss.slice(i1 + 1, ss.length);
            i1 = ss.indexOf("</span>");
            var sss = ss.slice(0, i1);
            famdata["family"] = ssf;
            famdata["given"] = sss;
            authorlist[i] = famdata;
          }
          value["author"] = authorlist;
        }
        if (value["container-title"])
          value["journalAbbreviation"] = value["container-title"];
        if (Object.keys(value).length === 0 && value.constructor === Object) {
          reject("Failed to cnvert the input to desired JSON");
        }
        resolve({ "message": value, "inputinfo": data.index });
        return;
      }).catch(function (e) {
        reject(e);
        return;
      });

    }
    catch (e) {
      reject(e);
      return;
    }
  });
}
function convertReferencetoJSONAnystyle(datainfo, param) {
  return new Promise(function (resolve, reject) {
    try {
      var HTMLOutputSet = [];
      if (!datainfo) {
        reject(errorFormatter.errorFormatter(500, datainfo, "Something went wrong while collecting back the promises."));
        return;
      }
      var HTMLData = [];
      var header = { "Content-Type": "application/x-www-form-urlencoded" };
      /*
       for (var i = 0; i < datainfo.length; i++) {
         HTMLData.push(u.requestData('post', 'http://localhost:3016/welcome', {}, { 'id': datainfo[i] }, param.body));
         // HTMLData.push(u.requestData('post', encodeURI('http://localhost:3015?id=' + ), "header", "data", param.body));
       }
       */

      var paramBody = param.body;
      var datainfor = { "body": { "text": datainfo.join('%0D'), "type": "test" } };
      anystyle.anystylemodule(datainfor, paramBody)
        .then(function (datainf) {
          var valData = [];
          data = datainf["data"];
          for (var i = 0; i < data.length; i++) {
            var sData = {};
            sData["state"] = "fulfilled";
            sData["value"] = {};
            sData["value"]["status"] = 200;
            sData["value"]["message"] = data[i];
            sData["value"]["index"] = datainf["index"];
            valData.push(sData);
          }

          resolve({ "code": 200, "message": valData,"htmlDataArray":datainf["htmlDataArray"],"xml":datainf["xml"],"XMLArray":datainf["XMLArray"] });
        })
        .catch(function (err) {
          resolve(errorFormatter.errorFormatter(500, err, "Something went wrong while collecting back the promises."));
        });

      /*
       Q.allSettled(HTMLData).then(function (data) {
 
         resolve({ "code": 200, "message": data });
         return;
       });
       */

    }
    catch (error) {
      resolve(errorFormatter.errorFormatter(500, error, "Something went wrong while collecting back the promises."));
      return;
    }
  });
}
function convertReferencetoHTML(datainfo, param) {
  return new Promise(function (resolve, reject) {
    try {
      var HTMLOutputSet = [];
      if (!datainfo) {
        reject(errorFormatter.errorFormatter(500, datainfo, "Something went wrong while collecting back the promises."));
        return;
      }
      var HTMLData = [];
      var header = { "Content-Type": "application/x-www-form-urlencoded" };
      for (var i = 0; i < datainfo.length; i++) {
        var data = { "format": "html", "data": "<editreference><parse>" + datainfo[i] + "</parse></editreference>", "processType": "parseReference" };
        HTMLData.push(u.requestData('post', 'http://kriya2.kriyadocs.com/api/process_reference?apiKey=36ab61a9-47e1-4db6-96db-8b95a9923599', header, data, param));
      }

      Q.allSettled(HTMLData).then(function (data) {
        dataVal = data;
        var dataIndex = "";
        for (var i = 0; i < dataVal.length; i++) {
          if (dataVal[i].state = "fulfilled") {
            data = dataVal[i].value;
            if (dataIndex == "") {
              dataIndex = data.index;
            }
            if (!data || data == undefined || data == '' || !data.message || !data.message.body) {
              HTMLOutputSet.push(JSON.stringify(data));
            }
            else {
              var str = data.message.body;
              var n = str.indexOf("<p");
              var endL = str.indexOf('/p>');
              str = str.slice(n, endL + 3);
              HTMLOutputSet.push(str);
            }
          } else {
            HTMLOutputSet.push("");
          }
        }
        resolve({ "data": HTMLOutputSet, "index": dataIndex });
        return;
      });
    }
    catch (error) {
      resolve(errorFormatter.errorFormatter(500, error, "Something went wrong while collecting back the promises."));
      return;
    }
  });
}