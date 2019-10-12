var Q = require('q');
var fs = require('fs');
var parser = require('xml2json');
var path = require('path');
var crossrefComp = require(path.join(__dirname, '..', 'post', 'JS', 'crossrefComp.js'));
const bodyParser = require("body-parser");
var fs = require('fs');
var u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var validateusingcrossref = {
    //performs Pubmed and DOI Search.
    /**
    * Method to search the data in pubmed or crossref based on PMID or DOI supplied.
    * @param {String} req the req message input by the user. 
    * @param {String} res To supply back the response to the user.
    */
    validateusingcrossref: function (req, res) {
        validateusingcrossref.validateusingcrossrefmodule(req)
            .then(function (data) {
                res.status(200).json(data).end();
            })
            .catch(function (err) {
                res.status(500).json({ "reason": "Failed in while converting to json to citeproc." }).end();
            });
    },
    validateusingcrossrefmodule: function (req) {
        return new Promise(function (resolve, reject) {
            let dataToGenerateBibliography = [];
            let skipTrackChanges = req.body.skipTrackChanges;
            if ((typeof req.body.data) == "string" && JSON.parse(req.body.data))
                req.body.data = JSON.parse(req.body.data);
            let FinalData = [];
            for (var i = 0; i < req.body.data.length; i++) {
                FinalData.push(validateusingcrossref.validateDataUsingCrossref(req.body.data[i]));
                Q.allSettled(FinalData).then(function (data) {
                    let dataJSON = [];
                    for (let j = 0; j < data.length; j++) {
                        dataJSON.push(data[j].value);
                    }
                    resolve(dataJSON);
                    return;
                });
            }
        });
        // res.status(200).json({ status: { code: 200, message: " Non Validated data Updated to the server." } }).end();
    }, validateDataUsingCrossref: function (FinalDataIndividual) {
        return new Promise(function (resolve, reject) {
            let FinalData = JSON.parse(JSON.stringify(FinalDataIndividual));
            if (FinalDataIndividual.state == "fulfilled" && FinalDataIndividual.value.status == "200") {
                if(FinalDataIndividual.value.message.YetToBeResolved==undefined)
                {
                    FinalDataIndividual.value.message["YetToBeResolved"]=[];
                }
                let datainfoYetToBeResolved = FinalDataIndividual.value.message.YetToBeResolved;

                let datainfoYetToBeResolvedPromise = [];
                for (let i = 0; i < datainfoYetToBeResolved.length; i++) {
                    datainfoYetToBeResolvedPromise.push(validateusingcrossref.resolveUsingCrossRef(datainfoYetToBeResolved[i], FinalDataIndividual, i));
                }
                Q.allSettled(datainfoYetToBeResolvedPromise).then(function (data) {
                    let indexToBeDeleted = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].state == "fulfilled" && data[i].value && data[i].value.status == 200) {
                            console.log(FinalDataIndividual.value.message.YetToBeResolved[data[i].value.posisition][data[i].value.keyvalue]);
                            FinalData.value.message.YetToBeResolved[data[i].value.posisition][data[i].value.keyvalue].author = data[i].value.authors;
                            FinalData.value.message.YetToBeResolved[data[i].value.posisition][data[i].value.keyvalue]["source"] = "CrossRef";
                            if(FinalData.value.message.SuccesfullyValidatedAndResolved==undefined)
                            {
                                FinalData.value.message["SuccesfullyValidatedAndResolved"]=[];
                            }
                            FinalData.value.message.SuccesfullyValidatedAndResolved.push(FinalData.value.message.YetToBeResolved[data[i].value.posisition]);
                            // FinalData.value.message.YetToBeResolved.splice(data[i].value.posisition, 1);
                            indexToBeDeleted.push(data[i].value.posisition);
                        }
                    }
                    for(let k=0;k<indexToBeDeleted.length;k++)
                    {
                        FinalData.value.message.YetToBeResolved.splice(indexToBeDeleted[k]-k, 1);
                    }
                    FinalData["CrossrefValidatedIndex"]=indexToBeDeleted;
                    resolve(FinalData);
                    return;
                });
            } else {
                resolve(FinalDataIndividual);
            }


        });
        // res.status(200).json({ status: { code: 200, message: " Non Validated data Updated to the server." } }).end();
    }, resolveUsingCrossRef: function (jsonData, index, position) {

        /**
          *
          *  Purpose: Gets the input json and quries Crossref with set of html tagged data entered by the user.
          *
          *  Functionality: Gets the inputJson(Entered json by the user) and then queries Crossref. Crossref may return multiple matches. Multiple doi resolution logic is written here to inorder to detect unique DOI.
          *
          *
          *  EXAMPLE url to query crossref with tagged reference input data:
          *  https://api.crossref.org/works?query.container-title=Materials+and+Design&query.author=suman+das
          *
          */
        return new Promise(function (resolve, reject) {
            Object.keys(jsonData).map(function (key) {
                setTimeout(function () {
                    resolve({
                        status: 500,
                        "input": inputjson,
                        "index": index
                    });
                    return;
                }, 10000);


                let inputjson = JSON.parse(JSON.stringify(jsonData))[key];
                var finalPMIDS = '';
                var article_title = '',
                    vol = '',
                    page = '',
                    issue = '',
                    prcnt = '',
                    year = '',
                    titl = '',
                    prcnt_title = '',
                    author = '';
                var csljson;
                var append = '';
                if (inputjson && inputjson.author && inputjson.author[0]) {
                    if (inputjson.author[0].family && inputjson.author[0].given)
                        append = append + "query.author=\"" + inputjson.author[0].family + " " + inputjson.author[0].given + "\"&";
                    else if (inputjson.author[0].family)
                        append = append + "query.author=\"" + inputjson.author[0].family + "\"&";
                    else if (inputjson.author[0].given)
                        append = append + "query.author=\"" + inputjson.author[0].given + "\"&";

                }
                if (inputjson["container-title"]) {
                    append = append + "query.container-title=\"" + inputjson["container-title"] + "\"&";
                }
                if (inputjson["title"]) {
                    append = append + "query.title=\"" + inputjson["title"] + "\"&";
                }

                var url = "https://api.crossref.org/works?" + append + "rows=" + 1;
                console.log("Request sent to crossref :: " + url);
                u.requestData('GET', encodeURI(url), "", "", { "index": inputjson, "requestType": "CrossRefServer" })
                    .then(function (data) {

                        if (data.status == "200") {
                            if (data.message && data.message.message && data.message.message.items && data.message.message.items[0] && data.message.message.items[0].score && data.message.message.items[0].author) {
                                if (data.message.message.items[0].author && !data.message.message.items[0].score < 25) {
                                    if (data.message.message.items[0].score > 95) {
                                        resolve({
                                            status: 200,
                                            "input": inputjson,
                                            "index": index,
                                            "authors": data.message.message.items[0].author,
                                            "keyvalue": key,
                                            "posisition": position
                                        });
                                        return;

                                    } else {
                                        let validatedAuthors = data.message.message.items[0].author;
                                        let nonValidatedAuthors = inputjson.author;
                                        let Mainflag = 1;
                                        if (nonValidatedAuthors && nonValidatedAuthors.length)
                                            for (let iAuthors = 0; iAuthors < nonValidatedAuthors.length; iAuthors++) {
                                                let Innerflag = 0;
                                                let checkGiven = nonValidatedAuthors[0].given;
                                                let checkFamily = nonValidatedAuthors[0].family;
                                                if (validatedAuthors && validatedAuthors.length)
                                                    for (let jAuthors = 0; jAuthors < validatedAuthors.length; jAuthors++) {
                                                        if (checkGiven != undefined && checkFamily != undefined && validatedAuthors[jAuthors].given != undefined && validatedAuthors[jAuthors].family != undefined) {
                                                            if (validatedAuthors[jAuthors].given.toLowerCase() == checkGiven.toLowerCase() && validatedAuthors[jAuthors].family.toLowerCase() == checkFamily.toLowerCase()) {
                                                                Innerflag = 1;
                                                            }
                                                        } else if (checkGiven != undefined && validatedAuthors[jAuthors].given != undefined) {
                                                            if (validatedAuthors[jAuthors].given.toLowerCase() == checkGiven.toLowerCase()) {
                                                                Innerflag = 1;
                                                            }

                                                        } else if (checkFamily != undefined && validatedAuthors[jAuthors].family != undefined) {
                                                            if (validatedAuthors[jAuthors].family.toLowerCase() == checkFamily.toLowerCase()) {
                                                                Innerflag = 1;
                                                            }
                                                        }
                                                    }
                                                if (Innerflag != 1) {
                                                    Mainflag = 0;
                                                }
                                            }
                                        if (Mainflag == 1) {
                                            resolve({
                                                status: 200,
                                                "input": inputjson,
                                                "index": index,
                                                "authors": data.message.message.items[0].author,
                                                "keyvalue": key,
                                                "posisition": position
                                            });
                                            return;
                                        }
                                        else {
                                            resolve({
                                                status: 500,
                                                "input": inputjson,
                                                "index": index
                                            });
                                            return;
                                        }
                                    }
                                } else {
                                    resolve({
                                        status: 500,
                                        "input": inputjson,
                                        "index": index
                                    });
                                    return;

                                }
                            }


                        } else {
                            resolve({
                                status: 500,
                                "input": inputjson,
                                "index": index
                            });
                            return;
                        }
                    });
            });
        });
    }
}
module.exports = validateusingcrossref;