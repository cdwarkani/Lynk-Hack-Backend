var path = require('path');
var exec = require('child_process').exec;
const fs = require('fs');
var parser = require('xml2json');
var convert = require('xml-js');
var xmltoTaggedData = require('./Json/xmltoTaggedData.json');
var message = "Succesfully Trained.";
const uuidv1 = require('uuid/v1');
let processingLimit = 150;
var Q = require('q');


var anystyle = {

    checkstatus: function () {
        return message;
    }, anystyle: function (req, res) {
        var FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
        if (req.body.type == "train" && req.body.information == "default") {
            res.download(FileBase + '/defaultdata.xml', 'default-facing-filename.pdf');
        } else if (req.body.information == "present" && req.body.type == "train") {
            res.download(FileBase + '/presentdataset.xml', 'present-facing-filename.pdf');
        } else {
            this.anystylemodule(req)
                .then(function (data) {
                    res.status(200).json(data).end();
                }).catch(function (err) {
                    res.status(400).json("Either no data was supplied or something unexpectedly went wrong.").end();
                });
        }
    },
    anystylemodule: function (req, param) {
        return new Promise(function (resolve, reject) {
            var fileName = uuidv1();
            var journalNametoIsoName = require('./Json/jtoiso.json');
            let anystyleProcessingModule = require('./anystyle.js').anystyleProcessingModule;
            if (req.body.type == "test") {
                if (req.body.text) {
                    req.body.text = req.body.text.replace(/ /g, " ");
                    req.body.text = req.body.text.replace(/<(.|\n)*?>/g, '');
                    let reqSplit = req.body.text.split("%0D");
                    let reqArrayData = [];
                    let i, j;

                    //creating  data set splits and storing it in array in order to process data over anystyle with splits based on processingLimit parameter initialized before.
                    for (i = processingLimit, j = 0; i < reqSplit.length;) {
                        reqArrayData.push(reqSplit.slice(j, i));
                        i = i + processingLimit;
                        j = j + processingLimit;
                    }
                    let remainingLength = reqSplit.length % processingLimit;
                    if (remainingLength != 0) {
                        reqArrayData.push(reqSplit.slice(j, j + remainingLength));
                    }


                    //send req to process Reference to JSON conversion service
                    let processDataBasedOnRateLimit = [];
                    for (let i = 0; i < reqArrayData.length; i++) {
                        processDataBasedOnRateLimit.push(anystyleProcessingModule({ "body": { "text": reqArrayData[i].join("%0D"), "type": "test" } }, param, i));
                    }


                    Q.allSettled(processDataBasedOnRateLimit).then(function (Collectivedata) {
                        let data = [], htmlDataArray = [], index = {}, xml, XMLArray = [];

                        for (let i = 0; i < Collectivedata.length; i++) {
                            if (Collectivedata[i].state == "fulfilled") {
                                data = data.concat(Collectivedata[i].value.data);
                                htmlDataArray = htmlDataArray.concat(Collectivedata[i].value.htmlDataArray);
                                XMLArray = XMLArray.concat(Collectivedata[i].value.XMLArray);
                                xml = xml + Collectivedata[i].value.xml;
                                index = Collectivedata[i].value.index;
                            } else {
                                reject("Anystyle threw some issue. Please contact admin.");
                            }
                        }
                        resolve({ "data": data, "index": index, "xml": xml, "XMLArray": XMLArray, "htmlDataArray": htmlDataArray });
                        return;
                    }).catch(function (err) {
                        reject("Either no data was supplied or something unexpectedly went wrong.");
                    });;

                    /*
                                        anystyleProcessingModule(req, param).then(function (data) {
                                            resolve(data);
                                            return;
                                        }).catch(function (err) {
                                            reject(err);
                                        });
                    */

                } else {
                    reject("No data supplied");
                }
            } else if (req.body.type == "train") {
                if (req.body.information == "traindata") {

                    message = "";

                    var FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
                    fs.writeFile(FileBase + "/presentdataset.xml", req.body.content, function (err) {
                        if (err) {
                            message = "Last Training Failed."
                        } else {
                            fs.unlink('custom.mod', function (err) {

                                // if no error, file has been deleted successfully
                                console.log('File deleted!');
                                var FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
                                console.log("anystyle -w train '" + FileBase + "/presentdataset.xml' custom.mod");
                                execute("anystyle -w train '" + FileBase + "/presentdataset.xml' custom.mod", "", function (names, input) {
                                    message = "Succesfully Trained\n " + names;

                                });
                            });
                        }

                    });

                }
            }
        });
    }, anystyleProcessingModule: function (req, param, currentArrayIndex) {
        return new Promise(function (resolve, reject) {
            var journalNametoIsoName = require('./Json/jtoiso.json');
            if (req.body.type == "test") {
                var dataset = "";

                if (req.body.text) {
                    dataset = req.body.text.split("%0D");
                } else {
                    reject("No input supplied");
                }
                FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
                let fnameIP = "biblio" + uuidv1() + currentArrayIndex + ".txt";
                var logger = fs.createWriteStream(FileBase + "/" + fnameIP, {
                    flags: 'w' // 'a' means appending (old data will be preserved)
                })

                for (var i = 0; i < dataset.length; i++) {

                    //regex = /\):[0-9]/g;
                    // = regex.exec(dataset[i])
                    //remove all trailing space
                    dataset[i] = dataset[i].replace(/\s+$/g, '');
                    //if doi has space the remove the space
                    dataset[i] = dataset[i].replace(/doi :/g, 'doi:');
                    //remove next lines symbol in between the reference set
                    dataset[i] = dataset[i].replace(/\n/g, '');
                    /*
                                        if (result != null) {
                                            dataset[i] = [dataset[i].slice(0, result.index + 2), " ", dataset[i].slice(result.index + 2)].join('');
                                        }
                                        if (result == null) {
                                            */
                    regex = /:[a-z|A-Z|0-9]/g;
                    result = regex.exec(dataset[i]);
                    if (result != null) {
                        dataset[i] = [dataset[i].slice(0, result.index + 1), " ", dataset[i].slice(result.index + 1)].join('');
                    }
                    regex = /;[a-z|A-Z|0-9]/g;
                    result = regex.exec(dataset[i]);
                    if (result != null) {
                        dataset[i] = [dataset[i].slice(0, result.index + 1), " ", dataset[i].slice(result.index + 1)].join('');
                    }
                    //regex = /[a-z|A-Z|0-9]\(/g;
                    result = regex.exec(dataset[i]);
                    if (result != null) {
                        dataset[i] = [dataset[i].slice(0, result.index + 1), " ", dataset[i].slice(result.index + 1)].join('');
                    }
                    /*
                    }
                    */
                    if (dataset[i].index)
                        var indexofcit = /[a-z]/i.exec(dataset[i]).index;
                    if (indexofcit > 0) {
                        if (dataset[i][indexofcit - 1] != " ") {
                            dataset[i] = dataset[i].slice(0, indexofcit) + " " + dataset[i].slice(indexofcit, dataset[i].length)
                        }
                    }
                    console.log(dataset[i]);
                    logger.write(dataset[i]);
                    if (i < dataset.length - 1) {
                        if (i == 125) {
                            console.log();
                        }
                        logger.write('\r\n');
                    }

                }
                logger.end();
                var FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
                execute("anystyle -P custom.mod -f csl,xml parse " + FileBase + "/" + fnameIP, req.body.text, function (name, input) {
                    try {
                        fs.unlink(FileBase + "/" + fnameIP, (err) => {
                            if (err) throw err;
                            console.log(FileBase + "/" + fnameIP + " was deleted.");
                        });
                        var jsonData = {};
                        var htmlJSON = [];
                        var nameD = JSON.parse(name.split('<?xml version="1.0" encoding="UTF-8"?>')[0]);
                        var xml = name.split('<?xml version="1.0" encoding="UTF-8"?>')[1];

                        //remove space between tags and remove \n characters from string

                        xml = xml.replace(/\n/g, "");
                        xml = xml.replace(/\>\s+\</g, '><');
                        // code to bring the spaces back in xml which are removed by anystyle


                        let xmldatum = xml.replace(/<\/dataset>/g, "").replace(/<dataset>/g, "");
                        let XMLArray = xmldatum.split("</sequence>");
                        delete XMLArray[XMLArray.length - 1];
                        XMLArray.length = XMLArray.length - 1;
                        var xmlFullData = "";
                        var normalize_special_characters = function (str) {

                            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        };
                        let inputArray = input.split("%0D");
                        for (var i = 0; i < inputArray.length; i++) {
                            inputArray[i] = inputArray[i].replace(/\n/g, "");
                            var jsonData = JSON.parse(convert.xml2json(XMLArray[i] + "</sequence>", { compact: false, spaces: 4 }));
                            let refData = jsonData["elements"][0]["elements"];
                            var prevmatch1 = "", prevmatch3 = "";

                            for (let s = 0; s < refData.length; s++) {
                                try {
                                    let xs = normalize_special_characters(refData[s]["elements"][0]["text"]);
                                    xs = xs.replace("(", "\\\(");
                                    xs = xs.replace(")", "\\\)");
                                    xs = xs.replace("[", "\\\[");
                                    xs = xs.replace("]", "\\\]");
                                    xs = xs.replace("?", "\\\?");
                                    let regex = new RegExp("([ ]*)(" + xs + ")" + "([ ]*)");


                                    var match = regex.exec(normalize_special_characters(inputArray[i]));

                                    if (match != null) {
                                        if (match[1] != "" && prevmatch3 == "") {
                                            refData[s]["elements"][0]["text"] = match[1] + refData[s]["elements"][0]["text"];
                                        }
                                        if (match[match.length - 1] != "") {
                                            refData[s]["elements"][0]["text"] = refData[s]["elements"][0]["text"] + match[match.length - 1];
                                        }
                                        prevmatch1 = match[1];
                                        prevmatch3 = match[match.length - 1];
                                    } else {
                                        prevmatch1 = "";
                                        prevmatch3 = "";
                                    }
                                } catch (e) {
                                    //skip the punctutaion fix for that reference alone.
                                    // no catch block since the task inside try block is not important.
                                }

                            }
                            xmlFullData += convert.json2xml(jsonData, { compact: false, ignoreComment: true, spaces: 4 }).replace(/\n/g, "").replace(/\>\s+\</g, '><');

                        }
                        console.log();
                        xml = "<dataset>" + xmlFullData + "</dataset>";

                        htmlJSON = convert.xml2json(xml, { compact: false, spaces: 4 });
                        try {
                            jsonData = JSON.parse(parser.toJson(xml));

                            if (jsonData["dataset"]["sequence"].length == undefined) {
                                jsonData["dataset"]["sequence"] = [jsonData["dataset"]["sequence"]];
                            }
                        } catch (e) {
                            // Do nothing because its not important to convert the xml to json.
                        }
                        var journalNametoIsoName = require('./Json/jtoiso.json');
                        for (var i = 0; i < nameD.length; i++) {

                            if (jsonData && jsonData["dataset"] && jsonData["dataset"]["sequence"] && jsonData["dataset"]["sequence"][i] && jsonData["dataset"]["sequence"][i]["pages"]) {
                                var patternToCheckIfAlphabet = /.*[^a-z].*/g;
                                var result = patternToCheckIfAlphabet.exec(jsonData["dataset"]["sequence"][i]["pages"]);
                                if (result) {
                                    nameD[i]["page"] = result[0];
                                }
                                if (jsonData["dataset"]["sequence"][i]["pages"][jsonData["dataset"]["sequence"][i]["pages"].length - 1] == "." || jsonData["dataset"]["sequence"][i]["pages"][jsonData["dataset"]["sequence"][i]["pages"].length - 1] == ",") {
                                    nameD[i]["page"] = jsonData["dataset"]["sequence"][i]["pages"].slice(0, jsonData["dataset"]["sequence"][i]["pages"].length - 1);
                                }
                                if (nameD[i]["page"][0] == "." || nameD[i]["page"][0] == "," || nameD[i]["page"][0] == ":") {
                                    nameD[i]["page"] = nameD[i]["page"].slice(1, nameD[i]["page"].length);
                                }
                                if ((typeof nameD[i]["page"]) == "string") {
                                    nameD[i]["page"] = nameD[i]["page"].replace("pp.", "");
                                    nameD[i]["page"] = nameD[i]["page"].replace("p.", "");
                                    nameD[i]["page"] = nameD[i]["page"].replace("pp", "");
                                    nameD[i]["page"] = nameD[i]["page"].replace("p", "");
                                    match = /(\()(.*)(\))/g.exec(nameD[i]["page"]);

                                    if (match && match.length == 4) {
                                        nameD[i]["page"] = match[2];
                                    }

                                    nameD[i]["page"] = nameD[i]["page"].trim();
                                }
                            }
                            /*
                            if (jsonData && jsonData["dataset"] && jsonData["dataset"]["sequence"] && jsonData["dataset"]["sequence"][i]["author"]) {
                                var newAuthor=jsonData["dataset"]["sequence"][i]["author"].split(",");
                                
                                if(newAuthor.length>0 && !(nameD[i].author.length==((newAuthor.length)/2)))
                                {
                                    for(var kindex=0;kindex<newAuthor.length;kindex++)
                                    {
                                        var XnewAuthor=newAuthor[kindex];
                                        if(XnewAuthor.split(" ").length>0)
                                        {
                                            if(nameD[i].author && nameD[i].author[kindex] && nameD[i].author[kindex].family && nameD[i].author[kindex].given)
                                            {
                                                var temp=nameD[i].author[kindex].family;
                                                nameD[i].author[kindex].family=nameD[i].author[kindex].given;
                                                nameD[i].author[kindex].given=temp;

                                            }
                                            
                                        }
                                    }
                                }
                            }
                            */
                            if (nameD[i]["title"] && jsonData["dataset"]["sequence"][i]["title"]) {
                                nameD[i]["title"] = jsonData["dataset"]["sequence"][i]["title"];
                            }

                            if (nameD[i]["author"] && nameD[i]["author"].length) {
                                var prevAuthorIndex = 0;
                                for (var si = 0; si < nameD[i]["author"].length; si++) {


                                    if (nameD[i]["author"][si]["family"] && nameD[i]["author"][si]["given"]) {
                                        //workaround to handle author names getting interchanged
                                        if (jsonData["dataset"]["sequence"][i]["author"]) {
                                            var tempStr = "";
                                            try {
                                                if (jsonData["dataset"]["sequence"][i]["author"] instanceof Array) {
                                                    if (jsonData["dataset"]["sequence"][i]["author"][0])
                                                        jsonData["dataset"]["sequence"][i]["author"] = jsonData["dataset"]["sequence"][i]["author"][0];
                                                }
                                                if (si > 0) {
                                                    if (nameD[i]["author"][si] && nameD[i]["author"][si]["family"]) {
                                                        prevAuthorIndex += nameD[i]["author"][si]["family"].length;
                                                    }

                                                    if (nameD[i]["author"][si] && nameD[i]["author"][si]["given"]) {

                                                        prevAuthorIndex += nameD[i]["author"][si]["given"].length;
                                                    }
                                                }



                                                var givenindexI = jsonData["dataset"]["sequence"][i]["author"].replace(/\./g, "").indexOf(nameD[i]["author"][si]["given"].replace(/\./g, ""), prevAuthorIndex);
                                                if (givenindexI > -1) {
                                                    var givenindexJLength = givenindexI + nameD[i]["author"][si]["given"].replace(/\./g, "").length;
                                                }
                                                var familyindexI = jsonData["dataset"]["sequence"][i]["author"].replace(/\./g, "").indexOf(nameD[i]["author"][si]["family"].replace(/\./g, ""), prevAuthorIndex);
                                                if (familyindexI >= givenindexI && familyindexI <= givenindexJLength) {
                                                    familyindexI = jsonData["dataset"]["sequence"][i]["author"].replace(/\./g, "").indexOf(nameD[i]["author"][si]["family"].replace(/\./g, ""), givenindexJLength);
                                                }
                                                if (familyindexI > -1) {
                                                    var familyindexjLength = familyindexI + nameD[i]["author"][si]["family"].replace(/\./g, "").length;
                                                }
                                                if (givenindexI < familyindexI && familyindexI > -1 && givenindexI > -1) {
                                                    var midArea = jsonData["dataset"]["sequence"][i]["author"].replace(/\./g, "").slice(givenindexJLength, familyindexI);

                                                    if (midArea.trim() == "") {
                                                        if (nameD[i]["author"].length > 0 && nameD[i]["author"][si]["family"].length < nameD[i]["author"][si]["given"].replace(/\./g, "").length) {
                                                            var temp = nameD[i]["author"][si]["given"];
                                                            nameD[i]["author"][si]["given"] = nameD[i]["author"][si]["family"];
                                                            nameD[i]["author"][si]["family"] = temp;

                                                        }
                                                    }
                                                } else if ((givenindexI > familyindexI && familyindexI > -1 && givenindexI > -1)) {
                                                    var midArea = jsonData["dataset"]["sequence"][i]["author"].replace(/\./g, "").slice(familyindexjLength, givenindexI);
                                                    if (midArea.trim() == "" && nameD[i]["author"][si]["family"].length < nameD[i]["author"][si]["given"].replace(/\./g, "").length) {
                                                        if (nameD[i]["author"].length > 0) {
                                                            var temp = nameD[i]["author"][si]["given"];
                                                            nameD[i]["author"][si]["given"] = nameD[i]["author"][si]["family"];
                                                            nameD[i]["author"][si]["family"] = temp;
                                                        }

                                                    }
                                                }
                                                //If there are any multiple words in family name then push those words in given name which exist after space
                                                var SpaceIndex = nameD[i]["author"][si]["family"].indexOf(" ");
                                                if (SpaceIndex > -1) {
                                                    if (nameD[i]["author"][si]["family"].substring(SpaceIndex + 1, nameD[i]["author"][si]["family"].length) == nameD[i]["author"][si]["family"].substring(SpaceIndex + 1, nameD[i]["author"][si]["family"].length).toUpperCase()) {
                                                        nameD[i]["author"][si]["given"] = nameD[i]["author"][si]["family"].substring(SpaceIndex + 1, nameD[i]["author"][si]["family"].length) + " " + nameD[i]["author"][si]["given"];
                                                        nameD[i]["author"][si]["family"] = nameD[i]["author"][si]["family"].slice(0, SpaceIndex);
                                                    }
                                                }
                                                if (nameD[i]["author"][si]["given"] == nameD[i]["author"][si]["given"].toUpperCase()) {
                                                    if (nameD[i]["author"][si]["given"][nameD[i]["author"][si]["given"].length - 1] != ".") {
                                                        nameD[i]["author"][si]["given"] += ".";
                                                    }
                                                }




                                            } catch (e) {
                                                console.log(e);
                                                //no functionality here because its not necesarry for this to happen. 
                                            }
                                        }


                                    }
                                }
                            }

                            if (nameD[i]["editor"] && nameD[i]["editor"].length) {
                                for (var si = 0; si < nameD[i]["editor"].length; si++) {
                                    if (nameD[i]["editor"][si]["family"] && nameD[i]["editor"][si]["given"]) {
                                        //workaround to handle editor names getting interchanged
                                        var prevAuthorIndex = 0;
                                        if (jsonData["dataset"]["sequence"][i]["editor"]) {
                                            var tempStr = "";
                                            try {
                                                if (jsonData["dataset"]["sequence"][i]["editor"] instanceof Array) {
                                                    if (jsonData["dataset"]["sequence"][i]["editor"][0])
                                                        jsonData["dataset"]["sequence"][i]["editor"] = jsonData["dataset"]["sequence"][i]["editor"][0];
                                                }

                                                if (si > 0) {
                                                    if (nameD[i]["editor"][si] && nameD[i]["editor"][si]["family"]) { prevAuthorIndex += nameD[i]["editor"][si]["family"].length }

                                                    if (nameD[i]["editor"][si] && nameD[i]["editor"][si]["given"]) {
                                                        prevAuthorIndex += nameD[i]["editor"][si]["given"].length + 3;
                                                    }
                                                }

                                                var givenindexI = jsonData["dataset"]["sequence"][i]["editor"].replace(/\./g, "").indexOf(nameD[i]["editor"][si]["given"].replace(/\./g, ""), prevAuthorIndex);
                                                if (givenindexI > -1) {
                                                    var givenindexJLength = givenindexI + nameD[i]["editor"][si]["given"].replace(/\./g, "").length;
                                                }
                                                var familyindexI = jsonData["dataset"]["sequence"][i]["editor"].replace(/\./g, "").indexOf(nameD[i]["editor"][si]["family"].replace(/\./g, ""), prevAuthorIndex);
                                                if (familyindexI >= givenindexI && familyindexI <= givenindexJLength) {
                                                    familyindexI = jsonData["dataset"]["sequence"][i]["editor"].replace(/\./g, "").indexOf(nameD[i]["editor"][si]["family"].replace(/\./g, ""), givenindexJLength);
                                                }

                                                if (familyindexI > -1) {
                                                    var familyindexjLength = familyindexI + nameD[i]["editor"][si]["family"].replace(/\./g, "").length;
                                                }
                                                if (givenindexI < familyindexI && familyindexI > -1 && givenindexI > -1) {
                                                    var midArea = jsonData["dataset"]["sequence"][i]["editor"].replace(/\./g, "").slice(givenindexJLength, familyindexI);

                                                    if (midArea.trim() == "") {
                                                        if (nameD[i]["editor"].length > 0 && nameD[i]["editor"][si]["family"].length < nameD[i]["editor"][si]["given"].replace(/\./g, "").length) {
                                                            var temp = nameD[i]["editor"][si]["given"];
                                                            nameD[i]["editor"][si]["given"] = nameD[i]["editor"][si]["family"];
                                                            nameD[i]["editor"][si]["family"] = temp;

                                                        }
                                                    }
                                                } else if ((givenindexI > familyindexI && familyindexI > -1 && givenindexI > -1)) {
                                                    var midArea = jsonData["dataset"]["sequence"][i]["editor"].replace(/\./g, "").slice(familyindexjLength, givenindexI);
                                                    if (midArea.trim() == "" && nameD[i]["editor"][si]["family"].length < nameD[i]["editor"][si]["given"].replace(/\./g, "").length) {
                                                        if (nameD[i]["editor"].length > 0) {
                                                            var temp = nameD[i]["editor"][si]["given"];
                                                            nameD[i]["editor"][si]["given"] = nameD[i]["editor"][si]["family"];
                                                            nameD[i]["editor"][si]["family"] = temp;
                                                        }

                                                    }
                                                }
                                                var SpaceIndex = nameD[i]["editor"][si]["family"].indexOf(" ");
                                                if (SpaceIndex > -1) {
                                                    nameD[i]["editor"][si]["given"] = nameD[i]["editor"][si]["family"].substring(SpaceIndex + 1, nameD[i]["author"][si]["family"].length) + " " + nameD[i]["author"][si]["given"];
                                                    nameD[i]["editor"][si]["family"] = nameD[i]["editor"][si]["family"].slice(0, SpaceIndex);

                                                }
                                                if (nameD[i]["editor"][si]["given"] == nameD[i]["editor"][si]["given"].toUpperCase()) {
                                                    if (nameD[i]["editor"][si]["given"][nameD[i]["editor"][si]["given"].length - 1] != ".") {
                                                        nameD[i]["editor"][si]["given"] += ".";
                                                    }
                                                }




                                            } catch (e) {
                                                console.log(e);
                                                //no functionality here because its not necesarry for this to happen. 
                                            }
                                        }


                                    }
                                }
                            }


                            if (nameD[i]["container-title"]) {
                                try {
                                    nameD[i]["container-title"] = nameD[i]["container-title"].replace(/^\s/g, '');
                                    if (nameD[i]["container-title"]) {
                                        nameD[i]["container-title"] = nameD[i]["container-title"].replace(/^\s/g, '');
                                        if (jsonData["dataset"]["sequence"][i]["journal"]) {
                                            nameD[i]["container-title"] = jsonData["dataset"]["sequence"][i]["journal"];
                                        }
                                        if (jsonData["dataset"]["sequence"][i]["container-title"]) {
                                            nameD[i]["container-title"] = jsonData["dataset"]["sequence"][i]["container-title"];
                                        }
                                        if (nameD[i]["container-title"] && nameD[i]["container-title"][0] && nameD[i]["container-title"][0] == ".") {
                                            nameD[i]["container-title"] = nameD[i]["container-title"].replace(/^\.+/g, '');
                                            nameD[i]["container-title"] = nameD[i]["container-title"].replace(/^\s/g, '');
                                        }
                                        if (nameD[i]["container-title"][nameD[i]["container-title"].length - 1] == "." || nameD[i]["container-title"][nameD[i]["container-title"].length - 1] == ",") {
                                            nameD[i]["container-title"] = nameD[i]["container-title"].substr(0, nameD[i]["container-title"].length - 1);
                                            nameD[i]["container-title"] = nameD[i]["container-title"].replace(/^\s/g, '');
                                        }
                                        if (nameD[i]["container-title"] && nameD[i]["container-title"][0] && nameD[i]["container-title"][0] == "…") {
                                            nameD[i]["container-title"] = nameD[i]["container-title"].substr(1, nameD[i]["container-title"].length);
                                            nameD[i]["container-title"] = nameD[i]["container-title"].replace(/^\s/g, '');
                                        }
                                    }
                                } catch (e) {
                                    //no functionality since container-title is not compulsory to be checked.
                                }
                            }


                            if (nameD[i]["title"]) {
                                //remove all preceeding space using regex
                                nameD[i]["title"] = ("" + nameD[i]["title"]).replace(/^\s/g, '');
                                if (nameD[i]["title"][0] == ".") {
                                    nameD[i]["title"] = nameD[i]["title"].replace(/^\.+/g, '');
                                    nameD[i]["title"] = nameD[i]["title"].replace(/^\s/g, '');
                                }
                                //two time same loop because there are case when two times check is required
                                if (nameD[i]["title"][nameD[i]["title"].length - 1] == "." || nameD[i]["title"][nameD[i]["title"].length - 1] == "," || nameD[i]["title"][nameD[i]["title"].length - 1] == "'" || nameD[i]["title"][nameD[i]["title"].length - 1] == "\"" || nameD[i]["title"][nameD[i]["title"].length - 1] == "’") {
                                    nameD[i]["title"] = nameD[i]["title"].substr(0, nameD[i]["title"].length - 1);
                                    nameD[i]["title"] = nameD[i]["title"].replace(/^\s/g, '');
                                }
                                if (nameD[i]["title"][nameD[i]["title"].length - 1] == "." || nameD[i]["title"][nameD[i]["title"].length - 1] == "," || nameD[i]["title"][nameD[i]["title"].length - 1] == "'" || nameD[i]["title"][nameD[i]["title"].length - 1] == "\"" || nameD[i]["title"][nameD[i]["title"].length - 1] == "’") {
                                    nameD[i]["title"] = nameD[i]["title"].substr(0, nameD[i]["title"].length - 1);
                                    nameD[i]["title"] = nameD[i]["title"].replace(/^\s/g, '');
                                }

                                if (nameD[i]["title"][0] == "…" || nameD[i]["title"][0] == "'" || nameD[i]["title"][0] == "\"" || nameD[i]["title"][0] == "‘") {
                                    nameD[i]["title"] = nameD[i]["title"].substr(1, nameD[i]["title"].length);
                                    nameD[i]["title"] = nameD[i]["title"].replace(/^\s/g, '');
                                }
                                var title = nameD[i]["title"];
                                var indexI = title.indexOf("[");
                                var indexJ = title.indexOf("]");
                                if ((indexI > 0) && (indexJ > 0)) {
                                    nameD[i]["title"] = title.substr(0, indexI);
                                    nameD[i]["title"] = nameD[i]["title"].replace(/\s+$/g, '');
                                    nameD[i]["genre"] = title.substr(indexI, indexJ);

                                } else if (indexI > 0) {
                                    nameD[i]["title"] = title.substr(0, indexI);
                                    nameD[i]["title"] = nameD[i]["title"].replace(/\s+$/g, '');
                                    if (title) {
                                        nameD[i]["genre"] = title.substr(indexI, title.length);
                                        if (nameD[i]["genre"].length != "]") {
                                            nameD[i]["genre"] += "]";
                                        }

                                    }
                                }

                            }
                            if (nameD[i]["genre"]) {
                                if (nameD[i]["genre"][nameD[i]["genre"].length - 1] == ".") {
                                    nameD[i]["genre"] = nameD[i]["genre"].substr(0, nameD[i]["genre"].length - 1);
                                }
                            }
                            if (nameD[i]["volume"]) {
                                try {

                                    var indexIvol = nameD[i].volume.toLowerCase().indexOf("supp");
                                    if (indexIvol > -1) {
                                        nameD[i]["issue"] = nameD[i]["volume"].substr(indexIvol, nameD[i]["volume"].length).trim();
                                        nameD[i]["volume"] = nameD[i]["volume"].substr(0, indexIvol).trim();
                                        //remove leading and trailing space
                                        nameD[i]["issue"].replace(/^\s/g, '').replace(/\s+$/g, '');;
                                    }
                                } catch (e) {
                                    //doing nothing since volume check is not compulsory
                                }

                            }
                            if (nameD[i]["issued"]) {
                                var sIssued = nameD[i]["issued"];
                                sIssued = sIssued.split('-');

                                //Initializing year
                                var year = sIssued[0];

                                //workaround to check if a year has alphabet in xml tag but not in csl json.
                                var yearD = jsonData["dataset"]["sequence"][i]["journal"];
                                if (year && jsonData && jsonData["dataset"] && jsonData["dataset"]["sequence"] && jsonData["dataset"]["sequence"][i] && jsonData["dataset"]["sequence"][i]["date"]) {

                                    var yearToCheck = jsonData["dataset"]["sequence"][i]["date"];
                                    if (yearToCheck && Array.isArray(yearToCheck) && yearToCheck[0]) {
                                        yearToCheck = yearToCheck[0];
                                    }
                                    if (yearToCheck && (typeof yearToCheck) == ("string")) {

                                        var index = yearToCheck.indexOf(year);
                                        if (index > -1) {
                                            var charac = yearToCheck.substr(index + 4, 1);
                                        }
                                        var patternToCheckIfAlphabet = /[a-z|A-Z]/g;
                                        if (charac != undefined) {
                                            var resultD = patternToCheckIfAlphabet.exec(charac);
                                            if (resultD) {
                                                //con
                                                console.log();
                                                sIssued[0] += resultD[0];
                                            }
                                        }
                                    }

                                }


                                nameD[i]["issued"] = {};
                                nameD[i]["issued"]["date-parts"] = [];
                                nameD[i]["issued"]["date-parts"].push(sIssued);

                            }

                            if (nameD[i]["literal"]) {
                                if (nameD[i]["literal"][nameD[i]["literal"].length - 1] == ".") {
                                    nameD[i]["literal"] = nameD[i]["literal"].substr(0, nameD[i]["literal"].length - 1);
                                }
                                if (nameD[i]["container-author"]) {
                                    var s = {};
                                    s["literal"] = nameD[i]["literal"];
                                    nameD[i].author.push(s);
                                    delete nameD[i].literal
                                } else {
                                    var s = {};
                                    s["literal"] = nameD[i]["literal"];
                                    nameD[i]["container-author"] = [];
                                    nameD[i]["container-author"].push(s);
                                    delete nameD[i].literal;
                                }
                            }
                            if (nameD[i]["literal"]) {
                                if (nameD[i]["literal"][nameD[i]["literal"].length - 1] == ".") {
                                    nameD[i]["literal"] = nameD[i]["literal"].substr(0, nameD[i]["literal"].length - 1);
                                }
                                if (nameD[i]["container-author"]) {
                                    var s = {};
                                    s["literal"] = nameD[i]["literal"];
                                    nameD[i].author.push(s);
                                    delete nameD[i].literal
                                } else {
                                    var s = {};
                                    s["literal"] = nameD[i]["literal"];
                                    nameD[i]["container-author"] = [];
                                    nameD[i]["container-author"].push(s);
                                    delete nameD[i].literal;
                                }

                            }
                        }


                        for (var i = 0; i < XMLArray.length; i++) {
                            XMLArray[i] += "</sequence>";
                            XMLArray[i] = XMLArray[i].replace(/\n/g, "");
                        }
                        var htmlData = [];
                        htmlJSON = JSON.parse(htmlJSON);
                        var htmlJSONele = htmlJSON["elements"][0]["elements"];
                        var normalize_special_characters = function (str) {

                            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        };
                        for (var i = 0; i < htmlJSONele.length; i++) {
                            var newObject = {};
                            var snameD = htmlJSONele[i]["elements"];

                            for (var z = 0; z < snameD.length; z++) {
                                if (snameD[z].name == "author" && nameD[i].author) {
                                    //tagging authors with html tag
                                    var authorString = "";
                                    var replaceAfter = 0;
                                    for (var k = 0; k < nameD[i].author.length; k++) {

                                        var auth = nameD[i].author[k];

                                        if (auth.family && auth.given) {
                                            if (nameD[i].author.length == 1) {

                                                snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                if (indexpoint > 0) {
                                                    snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                }
                                            }
                                            else if (k == 0) {
                                                var indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family));
                                                var indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                try {
                                                    //sometimes json have extra added dots in given name from anystyle service so html mappoing fails in such cases. the following work around is to remove the dots and try to find the given and family match in the original string.
                                                    if (indexgiven == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join("")))) > -1) {
                                                        indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join("")));
                                                        auth.given = auth.given.split(".").join("");
                                                    }
                                                    if (indexfam == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join("")))) > -1) {
                                                        indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join("")));
                                                        auth.family = auth.family.split(".").join("");
                                                    }
                                                    if (indexgiven == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join(". ").trim()))) > -1) {
                                                        indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join(". ").trim()));
                                                        auth.given = auth.given.split(".").join(". ").trim();
                                                    }
                                                    if (indexfam == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join(". ").trim()))) > -1) {
                                                        indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join(". ").trim()));
                                                        auth.family = auth.family.split(".").join(". ").trim();
                                                    }

                                                } catch (e) {
                                                    //No catch since the try block is not necesarry to be executed
                                                }

                                                if (indexfam >= 0 && indexgiven >= 0) {
                                                    if (indexfam > indexgiven) {
                                                        if (snameD[z]["elements"][0].text[indexfam] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                        var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family));
                                                        if (indexpoint > 0) {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefAuthor\">", replaceAfter);
                                                        }
                                                    } else {
                                                        if (snameD[z]["elements"][0].text[indexgiven] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);

                                                        }
                                                        var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                        if (indexpoint > 0) {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span></span><span class=\"RefAuthor\">", replaceAfter);
                                                        }
                                                    }
                                                    replaceAfter += ("<span class=\"RefSurName\">" + auth.family + "</span>" + "<span class=\"RefGivenName\">" + auth.given + "</span>" + "</span><span class=\"RefAuthor\">").length;

                                                } else {
                                                    replaceAfter += (auth.family + auth.given).length;
                                                    /* if (indexfam == -1) {
 
                                                         authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";
                                                         authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                         snameD[z]["elements"][0].text = authorString;
 
                                                     } else {
                                                         authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                         authorString += "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefAuthor\">";
                                                         snameD[z]["elements"][0].text = authorString;
 
                                                     }
                                                     */

                                                }
                                            } else if (k == (nameD[i].author.length - 1)) {
                                                var indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family));
                                                var indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                try {
                                                    //sometimes json have extra added dots in given name from anystyle service so html mappoing fails in such cases. the following work around is to remove the dots and try to find the given and family match in the original string.
                                                    if (indexgiven == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join("")))) > -1) {
                                                        indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join("")));
                                                        auth.given = auth.given.split(".").join("");
                                                    }
                                                    if (indexfam == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join("")))) > -1) {
                                                        indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join("")));
                                                        auth.family = auth.family.split(".").join("");
                                                    }
                                                    if (indexgiven == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join(". ").trim()))) > -1) {
                                                        indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join(". ").trim()));
                                                        auth.given = auth.given.split(".").join(". ").trim();
                                                    }
                                                    if (indexfam == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join(". ").trim()))) > -1) {
                                                        indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join(". ").trim()));
                                                        auth.family = auth.family.split(".").join(". ").trim();
                                                    }
                                                } catch (e) {
                                                    //No catch since the try block is not necesarry to be executed
                                                }
                                                if (indexfam >= 0 && indexgiven >= 0) {
                                                    if (indexfam > indexgiven) {
                                                        if (snameD[z]["elements"][0].text[indexfam] == " ") {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                        var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family));
                                                        if (indexpoint > 0) {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        }
                                                    } else {
                                                        if (snameD[z]["elements"][0].text[indexgiven] == " ") {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);

                                                        }
                                                        var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                        if (indexpoint > 0) {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                    }

                                                }
                                                replaceAfter += ("<span class=\"RefSurName\">" + auth.family + "</span>" + "<span class=\"RefGivenName\">" + auth.given + "</span>").length;
                                            } else {
                                                var indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family));
                                                var indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                try {
                                                    //sometimes json have extra added dots in given name from anystyle service so html mappoing fails in such cases. the following work around is to remove the dots and try to find the given and family match in the original string.
                                                    if (indexgiven == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join("")))) > -1) {
                                                        indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join("")));
                                                        auth.given = auth.given.split(".").join("");
                                                    }
                                                    if (indexfam == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join("")))) > -1) {
                                                        indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join("")));
                                                        auth.family = auth.family.split(".").join("");
                                                    }
                                                    if (indexgiven == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join(". ").trim()))) > -1) {
                                                        indexgiven = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given.split(".").join(". ").trim()));
                                                        auth.given = auth.given.split(".").join(". ").trim();
                                                    }
                                                    if (indexfam == -1 && (normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join(". ").trim()))) > -1) {
                                                        indexfam = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family.split(".").join(". ").trim()));
                                                        auth.family = auth.family.split(".").join(". ").trim();
                                                    }
                                                } catch (e) {
                                                    //No catch since the try block is not necesarry to be executed
                                                }
                                                if (indexfam >= 0 && indexgiven >= 0) {
                                                    if (indexfam > indexgiven) {
                                                        if (snameD[z]["elements"][0].text[indexfam] == " ") {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                        var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.family));
                                                        if (indexpoint > 0) {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefAuthor\">", replaceAfter);
                                                        }
                                                    } else {
                                                        if (snameD[z]["elements"][0].text[indexgiven] == " ") {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, replaceAfter) + normalize_special_characters(snameD[z]["elements"][0].text.slice(replaceAfter, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);

                                                        }
                                                        var indexpoint = normalize_special_characters(snameD[z]["elements"][0].text).indexOf(normalize_special_characters(auth.given));
                                                        if (indexpoint > 0) {
                                                            snameD[z]["elements"][0].text = snameD[z]["elements"][0].text.slice(0, indexpoint) + normalize_special_characters(snameD[z]["elements"][0].text.slice(indexpoint, snameD[z]["elements"][0].text.length)).replace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span></span><span class=\"RefAuthor\">", replaceAfter);
                                                        }
                                                    }
                                                    replaceAfter += ("<span class=\"RefSurName\">" + auth.family + "</span>" + "<span class=\"RefGivenName\">" + auth.given + "</span>" + "</span><span class=\"RefAuthor\">").length;

                                                } else {
                                                    /* if (indexfam == -1) {
 
                                                         authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";
                                                         authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                         snameD[z]["elements"][0].text = authorString;
 
                                                     } else {
                                                         authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                         authorString += "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefAuthor\">";
                                                         snameD[z]["elements"][0].text = authorString;
 
                                                     }
                                                     */

                                                }
                                            }

                                        } else if (auth.family) {
                                            /*
                                            if (nameD[i].author.length == 1) {
                                                authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";

                                            } else if (k == 0) {
                                                authorString += "<span class=\"RefSurName\">" + auth.family + "</span></span>";

                                            } else if (k == nameD[i].author.length) {

                                                authorString += "<span class=\"RefAuthor\"><span class=\"RefSurName\">" + auth.family + "</span>";
                                            }
                                            else {
                                                authorString += "<span class=\"RefAuthor\"><span class=\"RefSurName\">" + auth.family + "</span></span>";
                                            }
                                            */


                                        } else if (auth.given) {
                                            /*
                                             if (nameD[i].author.length == 1) {
                                                 authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
 
                                             } else if (k == 0) {
                                                 authorString += "<span class=\"RefGivenName\">" + auth.given + "</span></span>";
 
                                             } else if (k == nameD[i].author.length) {
 
                                                 authorString += "<span class=\"RefAuthor\"><span class=\"RefGivenName\">" + auth.given + "</span>";
                                             }
                                             else {
                                                 authorString += "<span class=\"RefAuthor\"><span class=\"RefGivenName\">" + auth.given + "</span></span>";
                                             }
 
                                         }
                                         console.log();
                                         */
                                        }
                                        snameD[z].name = "span class=\"RefAuthor\"";
                                    }
                                } else if (snameD[z].name == "editor" && nameD[i].editor) {
                                    //tagging editors with html tag
                                    var authorString = "";
                                    var replaceAfter = 0;
                                    for (var k = 0; k < nameD[i].editor.length; k++) {

                                        var auth = nameD[i].editor[k];
                                        if (auth.family && auth.given) {
                                            if (nameD[i].editor.length == 1) {
                                                snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                            }
                                            else if (k == 0) {
                                                var indexfam = snameD[z]["elements"][0].text.indexOf(auth.family);
                                                var indexgiven = snameD[z]["elements"][0].text.indexOf(auth.given);

                                                if (indexfam >= 0 && indexgiven >= 0) {
                                                    if (indexfam > indexgiven) {
                                                        if (snameD[z]["elements"][0].text[indexfam] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                        snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefEditor\">", replaceAfter);

                                                    } else {
                                                        if (snameD[z]["elements"][0].text[indexgiven] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);

                                                        }
                                                        snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span></span><span class=\"RefEditor\">", replaceAfter);
                                                    }
                                                    replaceAfter += ("<span class=\"RefSurName\">" + auth.family + "</span>" + "<span class=\"RefGivenName\">" + auth.given + "</span>" + "</span><span class=\"RefEditor\">").length;

                                                } else {
                                                    /* if (indexfam == -1) {
 
                                                         authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";
                                                         authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                         snameD[z]["elements"][0].text = authorString;
 
                                                     } else {
                                                         authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                         authorString += "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefEditor\">";
                                                         snameD[z]["elements"][0].text = authorString;
 
                                                     }
                                                     */

                                                }
                                            } else if (k == (nameD[i].editor.length - 1)) {
                                                var indexfam = snameD[z]["elements"][0].text.indexOf(auth.family);
                                                var indexgiven = snameD[z]["elements"][0].text.indexOf(auth.given);

                                                if (indexfam >= 0 && indexgiven >= 0) {
                                                    if (indexfam > indexgiven) {
                                                        if (snameD[z]["elements"][0].text[indexfam] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                        snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                    } else {
                                                        if (snameD[z]["elements"][0].text[indexgiven] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);

                                                        }
                                                        snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                    }
                                                } else {
                                                    /*
                                                    if (indexfam == -1) {

                                                        authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";
                                                        authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                        snameD[z]["elements"][0].text = authorString;

                                                    } else {
                                                        authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";
                                                        authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";
                                                        snameD[z]["elements"][0].text = authorString;

                                                    }
                                                    */
                                                }
                                                replaceAfter += ("<span class=\"RefSurName\">" + auth.family + "</span>" + "<span class=\"RefGivenName\">" + auth.given + "</span>").length;
                                            } else {

                                                var indexfam = snameD[z]["elements"][0].text.indexOf(auth.family);
                                                var indexgiven = snameD[z]["elements"][0].text.indexOf(auth.given);

                                                if (indexfam >= 0 && indexgiven >= 0) {
                                                    if (indexfam > indexgiven) {
                                                        if (snameD[z]["elements"][0].text[indexfam] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\"><span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span>", replaceAfter);
                                                        }
                                                        snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span></span><span class=\"RefEditor\">", replaceAfter);
                                                    } else {
                                                        if (snameD[z]["elements"][0].text[indexgiven] == " ") {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);
                                                        } else {
                                                            snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.family), "<span class=\"RefSurName\">" + auth.family + "</span>", replaceAfter);

                                                        }
                                                        snameD[z]["elements"][0].text = normalize_special_characters(snameD[z]["elements"][0].text).betterReplace(normalize_special_characters(auth.given), "<span class=\"RefGivenName\">" + auth.given + "</span></span><span class=\"RefEditor\">", replaceAfter);
                                                    }

                                                } else {
                                                    /*
                                                    authorString += "<span class=\"RefGivenName\">" + auth.given + "</span></span>";
                                                    authorString += "<span class=\"RefSurName\">" + auth.family + "</span></span>";
                                                    snameD[z]["elements"][0].text = authorString;
                                                    */
                                                }
                                                replaceAfter += ("<span class=\"RefSurName\">" + auth.family + "</span>" + "<span class=\"RefGivenName\">" + auth.given + "</span>" + "</span><span class=\"RefEditor\">").length;
                                            }

                                        } else if (auth.family) {
                                            if (nameD[i].editor.length == 1) {
                                                authorString += "<span class=\"RefSurName\">" + auth.family + "</span>";

                                            } else if (k == 0) {
                                                authorString += "<span class=\"RefSurName\">" + auth.family + "</span></span>";

                                            } else if (k == nameD[i].editor.length) {

                                                authorString += "<span class=\"RefEditor\"><span class=\"RefSurName\">" + auth.family + "</span>";
                                            }
                                            else {
                                                authorString += "<span class=\"RefEditor\"><span class=\"RefSurName\">" + auth.family + "</span></span>";
                                            }


                                        } else if (auth.given) {
                                            if (nameD[i].editor.length == 1) {
                                                authorString += "<span class=\"RefGivenName\">" + auth.given + "</span>";

                                            } else if (k == 0) {
                                                authorString += "<span class=\"RefGivenName\">" + auth.given + "</span></span>";

                                            } else if (k == nameD[i].editor.length) {

                                                authorString += "<span class=\"RefEditor\"><span class=\"RefGivenName\">" + auth.given + "</span>";
                                            }
                                            else {
                                                authorString += "<span class=\"RefEditor\"><span class=\"RefGivenName\">" + auth.given + "</span></span>";
                                            }

                                        }
                                    }
                                    snameD[z].name = "span class=\"RefEditor\"";
                                } else if (xmltoTaggedData[snameD[z].name]) {
                                    htmlJSON["elements"][0]["elements"][i]["elements"][z].name = xmltoTaggedData[snameD[z].name];
                                }

                                if (nameD[i] && nameD[i]["container-title"] && journalNametoIsoName[nameD[i]["container-title"]]) {
                                    nameD[i]["container-title-short"] = journalNametoIsoName[nameD[i]["container-title"]];
                                    nameD[i]["type"] = "article-journal";
                                } else if (nameD[i]["editor"] || nameD[i]["edition"]) {

                                    if ((nameD[i]["page"] && nameD[i]["title"])) {
                                        nameD[i]["type"] = "chapter";
                                    } else {

                                        nameD[i]["type"] = "book";

                                    }

                                }
                                if (nameD[i]["type"] == "book" && nameD[i]["title"] && nameD[i]["container-title"]) {
                                    nameD[i]["type"] = "chapter";
                                }

                                if (XMLArray[i] && (XMLArray[i].indexOf("et al") != -1)) {
                                    nameD[i]["etal"] = " et al.";
                                }

                            }

                            console.log();
                            if (nameD[i] && nameD[i]["type"]) {
                                htmlData.push("<p " + "type='" + nameD[i]["type"] + "' >" + convert.json2xml(htmlJSON["elements"][0]["elements"][i], { compact: false, ignoreComment: true, spaces: 4 }));

                            } else {
                                htmlData.push("<p " + "type='null'>" + convert.json2xml(htmlJSON["elements"][0]["elements"][i], { compact: false, ignoreComment: true, spaces: 4 }));
                            }
                            htmlData[i] = htmlData[i].replace(/&lt;/g, "<");
                            htmlData[i] = htmlData[i].replace(/&gt;/g, ">");
                            htmlData[i] = htmlData[i].replace(/\n/g, "");
                            //regex to match punctuation</span class="anything"> tags and apply it as </span>
                            htmlData[i] = htmlData[i].replace(/\<\/[a-zA-Z0-9\s+.,\"\/#!$%\^&\*;:{}=\-_`~()]+\>/g, "</span>") + "</p>";
                            var match = null;
                            //regex to match: punctuation</span> tags and write it as </span>punctuation
                            match = /([.,\"\/#!$%\ ^&\*;:{}=\-_`~()]+)(\<\/[a-zA-Z0-9\s+.,\"\/#!$%\^&\*;:{}=\-_`~()]+\>)([ ]*)(\<span)/.exec(htmlData[i]);
                            while (match != null) {
                                htmlData[i] = htmlData[i].replace(/([.,\"\/#!$% \^&\*;:{}=\-_`~()]+)(\<\/[a-zA-Z0-9\s+.,\"\/#!$%\^&\*;:{}=\-_`~()]+\>)([ ]*)(\<span)/, match[2] + match[1] + match[3] + match[4]);
                                match = /([.,\"\/#! $%\^&\*;:{}=\-_`~()]+)(\<\/[a-zA-Z0-9\s+.,\"\/#!$%\^&\*;:{}=\-_`~()]+\>)([ ]*)(\<span)/.exec(htmlData[i]);
                            }
                            // match '<span class="RefEditor">[any punctuation ]</span' and replace it with '[any punctuation ]<span class="RefEditor"></span'
                            match = /(<span class=\"RefAuthor\">)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]+)(<span)/.exec(htmlData[i]);
                            while (match != null && match.length == 4) {
                                htmlData[i] = htmlData[i].replace(/(<span class=\"RefAuthor\">)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]+)(<span)/, match[2] + match[1] + match[3]);
                                match = /(<span class=\"RefAuthor\">)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]+)(<span)/.exec(htmlData[i]);
                            }


                            match = /(<span class=\"RefEditor\">)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]+)(<span)/.exec(htmlData[i]);
                            while (match != null && match.length == 4) {
                                htmlData[i] = htmlData[i].replace(/(<span class=\"RefEditor\">)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]+)(<span)/, match[2] + match[1] + match[3]);
                                match = /(<span class=\"RefEditor\">)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]+)(<span)/.exec(htmlData[i]);
                            }
                            //regex to match punctuation</span></p> tags
                            htmlData[i] = htmlData[i].replace(/et al<\/span>/, '</span><span class="RefEtal">et al</span>');
                            // tag et al
                            match = /([.,\"\/#!$%\^&\*;:{}=\-_`~()]+)(\<\/[a-zA-Z0-9\s+.,\"\/#!$%\^&\*;:{}=\-_`~()]+\>)(<\/p>)/.exec(htmlData[i]);
                            if (match != null) {
                                htmlData[i] = htmlData[i].replace(/([.,\"\/#!$%\^&\*;:{}=\-_`~()]+)(\<\/[a-zA-Z0-9\s+.,\"\/#!$%\^&\*;:{}=\-_`~()]+\>)(<\/p>)/, match[2] + match[1] + match[3]);
                            }

                            //htmlData[i] = htmlData[i].replace(/\<\/span\>\<span/g, "</span> <span");

                            //regex to replace <span class="any class">(pp. 217(any punct)225</span> kindof pattern to proper order
                            match = /([ ]+)(<\/span>)/.exec(htmlData[i]);
                            while (match != null) {
                                if (match[1].trim() == "") {
                                    htmlData[i] = htmlData[i].replace(/([ ]+)(<\/span>)/, "</span>" + match[1]);
                                }
                                match = /([ ]+)(<\/span>)/.exec(htmlData[i]);
                            }




                            match = /(\<span class=\"Refpages\">)([\(\[ \]p[.]*]*)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/.exec(htmlData[i]);
                            if (match != null) {
                                if (match[2].trim() == "") {
                                    htmlData[i] = htmlData[i].replace(/(\<span class=\"Refpages\">)([\(\[ \]p[.]*]*)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/, "<span class=\"RefFpage\">" + match[3] + "</span>" + match[4] + "<span class=\"RefLpage\">" + match[5] + "</span>");
                                } else {
                                    htmlData[i] = htmlData[i].replace(/(\<span class=\"Refpages\">)([\(\[ \]p[.]*]*)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/, "<span class=\"RefComment\">" + match[2] + "</span>" + "<span class=\"RefFpage\">" + match[3] + "</span>" + match[4] + "<span class=\"RefLpage\">" + match[5] + "</span>");

                                }
                            }
                            match = /(\<span class=\"RefVolume\">)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/.exec(htmlData[i]);
                            while (match != null && match.length == 6) {
                                if (match[4].trim() == "") {
                                    htmlData[i] = htmlData[i].replace(/(\<span class=\"RefVolume\">)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/, match[1] + match[2] + match[5] + match[3] + "<span class=\"RefIssue\">" + match[4] + "</span>");
                                } else {
                                    htmlData[i] = htmlData[i].replace(/(\<span class=\"RefVolume\">)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/, match[1] + match[2] + match[5] + match[3] + "<span class=\"RefIssue\">" + match[4] + "</span>");
                                }
                                match = /(\<span class=\"RefVolume\">)([a-zA-Z0-9\s+]+)([+.,\"\/#!$%\^&\*;:{}=\-–_`~()]+)([a-zA-Z0-9\s+]+)(<\/span>)/.exec(htmlData[i]);

                            }

                            //replacing all Eds. from RefEditor and putting it inside seperate Comment Tag
                            match = /(\(Ed[a-zA-Z0-9. ]*)(<\/span>)/.exec(htmlData[i]);
                            while (match != null) {

                                htmlData[i] = htmlData[i].replace(/(\(Ed[a-zA-Z0-9. ]*)(<\/span>)/, match[2] + "<span class=\"RefComment\">" + match[1] + "</span note=\"Tagged by regex\">");

                                match = /(\(Ed[a-zA-Z0-9. ]*)(<\/span>)/.exec(htmlData[i]);
                            }

                            /*
                                                        match = /(\<\/span\>)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]*)([\.,])(\<span)/g.exec(htmlData[i]);
                                                        while (match != null && match.length == 5) {
                            
                                                            match[3] += " ";
                                                            htmlData[i] = htmlData[i].replace(/(\<\/span\>)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]*)([\.,])(\<span)/, match[1] + match[2] + match[3] + match[4]);
                            
                                                            match = /(\<\/span\>)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;]*)([\.,])(\<span)/g.exec(htmlData[i]);
                            
                                                        }
                                                        */

                            //MATCHES ALL  '<span class="refEditors">In' and changes it to '<span class="refComment">In</span></</span><span class="refEditors">'
                            match = /(\<span class=\"RefEditor\"\>)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;\s]*)(In)([a-zA-Z0-9\s*])/g.exec(htmlData[i]);
                            while (match != null && match.length == 5) {

                                match[3] += " ";
                                htmlData[i] = htmlData[i].replace(/(\<span class=\"RefEditor\"\>)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;\s]*)(In)([a-zA-Z0-9\s*])/, "<span class=\"RefComment\">" + match[2] + match[3] + "</span>" + match[1] + match[4]);

                                match = /(\<span class=\"RefEditor\"\>)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;\s]*)(In)([a-zA-Z0-9\s*])/g.exec(htmlData[i]);

                            }




                            match = /([ ]*)(\<span class=\"RefYear\">)([([])([a-zA-Z0-9\s+]+)/.exec(htmlData[i]);
                            if (match != null && match.length == 5) {

                                htmlData[i] = htmlData[i].replace(/([ ]*)(\<span class=\"RefYear\">)([([])([a-zA-Z0-9\s+]+)/, match[1] + match[3] + match[2] + match[4]);
                            }
                            
                        }
                        resolve({ "data": nameD, "index": param, "xml": xml, "XMLArray": XMLArray, "htmlDataArray": htmlData });
                    }
                    catch (e) {
                        console.log(e);
                        reject(e);
                    }


                });
            } else if (req.body.type == "train") {
                if (req.body.information == "traindata") {

                    message = "";

                    var FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
                    fs.writeFile(FileBase + "/presentdataset.xml", req.body.content, function (err) {
                        if (err) {
                            message = "Last Training Failed."
                        } else {
                            fs.unlink('custom.mod', function (err) {

                                // if no error, file has been deleted successfully
                                console.log('File deleted!');
                                var FileBase = path.join(__dirname, '..', '..', '_data', 'anystyle');
                                console.log("anystyle -w train '" + FileBase + "/presentdataset.xml' custom.mod");
                                execute("anystyle -w train '" + FileBase + "/presentdataset.xml' custom.mod", "", function (names, input) {
                                    message = "Succesfully Trained\n " + names;

                                });
                            });
                        }

                    });

                }
            }

        });
    }, hardReplaceXML: function (xml, JSONData) {
        return xml;
    }

}
function execute(command, input, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout, input);
    });
};

String.prototype.betterReplace = function (search, replace, from) {
    if (this.length > from) {
        return this.slice(0, from) + this.slice(from).replace(search, replace);
    }
    return this;
}





module.exports = anystyle;


/*



Code to extract journal and iso collection from pubmed txt files.
------------------------
   fs.readFile(path.join(__dirname, '..', '..', '_core','post','Json', 'J_Medline.txt'), function read(err, data) {
                if (err) {
                    throw err;
                }
                content = data;
            
                // Invoke the next step here however you like
                //console.log(content);   // Put all of the code here (not the best solution)
                processFile(content.toString());          // Or put the next step in a function and invoke it
            });
            
            function processFile(content) {
               var contentArray= content.split("--------------------------------------------------------");
            console.log();
            var JSONArr={},JSONArr2={};
            for(var i=0;i<contentArray.length;i++)
            {
                var s=contentArray[i].split("\n");
               
                if(s.length==9)
                {
                    var JourTitle="";
                    var IsoName="";
                for(var k=0;k<s.length;k++)
                {
               
                    if(s[k].indexOf("JournalTitle")!=-1)
                    {
                        JourTitle=s[k].split(":")[1].trim();
                        
                        
                    }
                    if(s[k].indexOf("IsoAbbr")!=-1)
                    {
                        IsoName=s[k].split(":")[1].trim();
                        
                    }
                    
                }
                JSONArr[JourTitle]=IsoName;
                JSONArr2[IsoName]=JourTitle;
            }
            }
            console.log();
            fs.writeFile('jtoiso.json', JSON.stringify(JSONArr), 'utf8');
            fs.writeFile('isotoj.json', JSON.stringify(JSONArr2), 'utf8');
            }



*/