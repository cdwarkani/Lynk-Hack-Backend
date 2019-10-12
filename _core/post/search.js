var Q = require('q');
var fs = require('fs');
var parser = require('xml2json');
var path = require('path');
var p = require(path.join(__dirname, '..', 'post', 'JS', 'pubmedComp.js'));
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
const bodyParser = require("body-parser");
module.exports = {
    //performs Pubmed and DOI Search.
     /**
     * Method to search the data in pubmed or crossref based on PMID or DOI supplied.
     * @param {String} req the req message input by the user. 
     * @param {String} res To supply back the response to the user.
     */
    search: function (req, res) {
        /* req parameter :
        * req.body.data: PMID/DOI values.
        * req.body.style: DESIRED STYLE.
        * req.body.locale: DESIRED LOCALE.
        * req.body.pre: PRE STRING.
        * req.body.post: POST STRING.
        * req.body.type: pmid/doi.
        */
        if (req.body.data == "") {
            res.status(500).json({ status: { code: 500, message: "No input supplied to the system" } }).end();
        }
        searchData(req.body.data, req.body.style, req.body.locale, req.body.pre, req.body.post, req.body.type).then(function (datass) {
               datass.finalbiblio = datass.BibliographyString;
            /**
             *  @param {String} d holds the final converted json.
             *  @param {String} datass stores the converted json.
             */
            var d = datass;
            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]) {
                const object1 = d.InputConvertedJson;
                const object2 = JSON.parse(d.MatchedJson)["Item-1"];
            /**
             *  @param {String} x1 holds either Input converted JSON or Matched Json - whichever has less key-value pair. 
             */
                var x1;
            /**
             *  @param {String} x2 holds either Input converted JSON or Matched Json - whichever has more key-value pair. 
             */
                var x2;
                if (object2.length > object1.length) {
                    x2 = object1;
                    x1 = object2;
                }
                else {
                    x1 = object1;
                    x2 = object2;
                }
                //Computing the changed JSON by comparing Input JSON and Matched JSON.
                var flag;
                 /**
                *  @param {String} x3 holds the changed JSON.
                */
                var x3 = {};
                Object.keys(x2).forEach(function (keys) {
                    flag = 1;
                    Object.keys(x1).forEach(function (key) {
                        if ((key == keys)) {
                            flag = 0;
                            if (!(x1[key] == x2[keys])) {
                                x3[keys] = x2[keys];
                            }
                        }
                    });
                    if (flag == 1) {
                        x3[keys] = x2[keys];
                    }
                });
                datass["ChangedJSON"] = JSON.stringify(x3);
            }
            var x = { "data": data };
            var data = datass;
            var data = [];
            datass.Input = req.body.data;
            if (datass.finalbiblio == undefined) {
                datass.finalbiblio = JSON.stringify(datass.message);
            }
            if (datass.Citation == undefined) {
                datass.Citation = "No Match found"
            }
            data.push(datass);
            //console.log(data);
            /** 
            *  @param {String} x holds the final most json.
            */
            var x = { "data": data };
            res.status(200).json({ status: { code: 200, message: x } }).end();
            return;
        }).catch(function (error) {
            //console.log(JSON.stringify(error));
            res.status(500).json({ status: { code: 500, message: "No results Found in database." } }).end();
        });
    }
}
 /**
     * Method to search the data in pubmed or crossref based on PMID or DOI supplied.
     * @param {String} PmidOrDoi 
     * @param {String} style Desired user style.
     * @param {Object} locale Desired locale.
     * @param {*} pre any data to be attched before BilbioString
     * @param {*} post any data to be attached at the end of BiblioString
    * @param {*} type pmid | doi
     */
function searchData(PmidOrDoi, style, locale, pre, post, type) {
    //gets the pmid and required parameter and converts it to desired json.
    return new Promise(function (resolve, reject) {
        try {
            /** 
            *  @param {String} inputs holds the necessary input data which needs to be searched.
            */
            var inputs;
            if (type == "pmid") {
                inputs = {
                    'data': '<p><span class="RefPMID">' + PmidOrDoi + '</span></p>',
                    'type': 'pmid',
                    'request': 'search',
                    'style': style,
                    'locales': locale,
                    'pre': pre,
                    'post': post,
                    'finalbiblio': ''
                };
            }
            else if (type == "doi") {
                inputs = {
                    'data': '<p><span class="RefDOI">' + PmidOrDoi + '</span>.</p>',
                    'type': 'doi',
                    'request': 'search',
                    'style': style,
                    'locales': locale,
                    'pre': pre,
                    'post': post,
                    'finalbiblio': ''
                };
            }
            p.getPubMedRefHash(inputs, inputs.style, "0").then(function (result) {
                resolve(result);
                return;
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500,error,"Something went wrong while collecting back the promises."));
                return;
            });
            return;
        }
        catch (error) {
            reject(errorFormatter.errorFormatter(500,error,"Something went wrong while collecting back the promises."));
            return;
        }
    });
}