// demo.js
// for citeproc-js CSL citation formatter
// Get the citations that we are supposed to render, in the CSL-json format
//setting Biblio Graphy Styles
var fs = require('fs');
var path = require('path');
var styleloc = path.join(__dirname, '..', '..', '..', '..', '..', '_data', 'styles');
var localeloc = path.join(__dirname, '..', '..', '..', '..', '..', '_data', 'locales');
const Template = require('./ReverseTemplate.json');
const languageJson = require('./language.json');
var journalNametoIsoName = require('./jtoiso.json');
var convert = require('xml-js');

var us = require(path.join(__dirname, '..', '..', '..', '..', '..', '_core', 'post', 'JS', 'urest.js'));

var getFRef = {
    //function to convert pubmed xml to citeproc json
    RenderBibliography: function (csljson, style, pos, source, inputJSON, inputobj, inputobjs) {
        return new Promise(function (resolve, reject) {

            var citations = csljson;
            //citations=csljson;
            renderBib(style, pos, source, citations, inputJSON, inputobj, inputobjs).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                reject({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });
        });
    },
    RenderBibliography2: function (csljson, input, pos, source) {
        return new Promise(function (resolve, reject) {
            var x = {};
            var citations2 = require('./citations.json');
            csljson["id"] = "Item-1";
            x["Item-1"] = csljson;
            citations2 = x;
            getProcessor2(x, input, pos, source).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                reject({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });;
        });
    },
    getProcessor4: function (csljson, style, pos) {
        // Gets the UN-styled BilioGraphystring
        return new Promise(function (resolve, reject) {
            var matchedJSON = { "Item-1": JSON.parse(JSON.stringify(csljson)) };
            var citations = JSON.parse(JSON.stringify(matchedJSON));


            fs.readFile(localeloc + '/' + "locales-en-US.xml", 'utf8', function (err, datas) {
                if (err) {
                    reject({
                        'status': {
                            'code': 500,
                            'message': 'Unable to get data. Something went wrong.'
                        },
                        'message': err
                    });
                    return;
                }
                fs.readFile(styleloc + '/' + "dove-medical-press.csl", 'utf8', function (err, data) {
                    if (err) {
                        reject({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': err
                        });
                        return;
                    }

                    styleAsText = data;
                    citeprocSys2 = {
                        // Given a language tag in RFC-4646 form, this method retrieves the
                        // locale definition file.  This method must return a valid *serialized*
                        // CSL locale. (In other words, an blob of XML as an unparsed string.  The
                        // processor will fail on a native XML object or buffer).
                        retrieveLocale: function (lang) {
                            return datas;
                        }
                        ,
                        // Given an identifier, this retrieves one citation item.  This method
                        // must return a valid CSL-JSON object.
                        retrieveItem: function (id) {
                            citations = matchedJSON;

                            return citations[id];
                        }
                    };

                    var r = require('../citeproc.js');
                    var citeproc = new r.CSL.Engine(citeprocSys2, styleAsText);

                    r = '';
                    var itemIDs = [];
                    for (var key in citations) {
                        itemIDs.push(key);
                    }
                    citeproc.updateItems(itemIDs);
                    matchedJSON["Item-1"] = copy;
                    citations = matchedJSON;
                    var bibResult = citeproc.makeBibliography();


                    citati = [{
                        'id': "Item-1",
                        'locator': "1",
                        'label': "hi",
                        'type': "1",
                        'position': "hi"
                    }];

                    var result = citeproc.makeCitationCluster(citati);


                    resolve(bibResult);
                })
            })
        });
    }
};
module.exports = getFRef;
var copy;
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
//renderBib();
// Initialize a system object, which contains two methods needed by the
// engine.
// Given the identifier of a CSL style, this function instantiates a CSL.Engine
// object that can render citations in that style.
function getProcessor(styleID, pos, source, matchedJSONData, inputJSON, inputobj, inputobjs) {


    // Get the CSL style as a serialized string of XML
    return new Promise(function (resolve, reject) {
        //adding prefix and suffix for p tags
        let styleUsed = styleID;
        let authorInitialization = {}, editorInitialization = {}, doubleQuotesTypes = {}, authorInitializationlast;
        let matchedJSON = JSON.parse(JSON.stringify(matchedJSONData));
        let citations = JSON.parse(JSON.stringify(matchedJSON));
        let etAllBold = false, etalUnderLine = false, etAllItalics = false;
        if (matchedJSON["Item-1"]["citation-number"] && !(matchedJSON["Item-1"]["prefixForStyled"])) {
            matchedJSON["Item-1"]["prefixForStyled"] = "<p><span class=\"RefSlNo\">" + matchedJSON["Item-1"]["citation-number"] + "</span>";
        } else {
            matchedJSON["Item-1"]["prefixForStyled"] = "<p>";
        }
        if (!matchedJSON["Item-1"]["year"] && matchedJSON["Item-1"]["RefYear"]) {
            matchedJSON["Item-1"]["year"] = matchedJSON["Item-1"]["RefYear"];
            delete matchedJSON["Item-1"]["RefYear"];
        }
        matchedJSON["Item-1"]["suffixForStyled"] = "</p>";
        if (matchedJSON["Item-1"]["DOI"]) {
            matchedJSON["Item-1"]["DOI"] = matchedJSON["Item-1"]["DOI"].replace(/doi:/g, "");
            matchedJSON["Item-1"]["DOI"] = matchedJSON["Item-1"]["DOI"].replace(/doi :/g, "");
            matchedJSON["Item-1"]["DOI"] = matchedJSON["Item-1"]["DOI"].replace(/https:\/\/doi.org\//g, "");
            matchedJSON["Item-1"]["DOI"] = matchedJSON["Item-1"]["DOI"].replace(/http:\/\/doi.org\//g, "");
        }

        if (matchedJSON["Item-1"]["DOI"]) {
            matchedJSON["Item-1"]["DOI"] = matchedJSON["Item-1"]["DOI"].replace(/doi:/g, "");
        }


        let copy;
        if (citations["Item-1"]) {

            if (matchedJSON && matchedJSON["Item-1"] && matchedJSON["Item-1"]["volume"]) {
                // checking if volume has suppl 1 and if found adding it in brackets.
                var IndexOfissueinVolume = matchedJSON["Item-1"]["volume"].indexOf("Suppl");
                if (IndexOfissueinVolume > 0) {
                    matchedJSON["Item-1"]["volume"] = matchedJSON["Item-1"]["volume"].slice(0, matchedJSON["Item-1"]["volume"].indexOf("Suppl")) + "(" + matchedJSON["Item-1"]["volume"].slice(matchedJSON["Item-1"]["volume"].indexOf("Suppl"), matchedJSON["Item-1"]["volume"].length) + ")";
                }

            }
            if (matchedJSON && matchedJSON["Item-1"] && matchedJSON["Item-1"]["page"]) {
                // checking if volume has suppl 1 and if found adding it in brackets.
                matchedJSON["Item-1"].page = matchedJSON["Item-1"].page.replace("–", "-");
                if ((typeof citations["Item-1"].page) == "string" && citations["Item-1"].page[citations["Item-1"].page.length - 1] == ":") {
                    matchedJSON["Item-1"].page = matchedJSON["Item-1"].page.substr(0, citations["Item-1"].page.length - 1);
                }

            }
            if (matchedJSON && matchedJSON["Item-1"] && matchedJSON["Item-1"].title && matchedJSON["Item-1"].title.replace(/\s+$/g, '') && (matchedJSON["Item-1"].title.replace(/\s+$/g, '')[matchedJSON["Item-1"].title.replace(/\s+$/g, '').length - 1] == ".")) {
                matchedJSON["Item-1"].title = matchedJSON["Item-1"].title.replace(/\s+$/g, '');
                matchedJSON["Item-1"].title = matchedJSON["Item-1"].title.substr(0, matchedJSON["Item-1"].title.length - 1);
            }
            citations = matchedJSON;



            if (citations["Item-1"]["container-title-short"]) {
                citations["Item-1"]["journalAbbreviation"] = citations["Item-1"]["container-title-short"];
            }
            if (citations["Item-1"]["language"]) {
                citations["Item-1"]["language123#"] = citations["Item-1"]["language"];
                delete citations["Item-1"]["language"];;
            }
            if (citations && citations["Item-1"] && citations["Item-1"]["PMID"]) {
                citations["Item-1"]["pmid"] = citations["Item-1"]["PMID"];
            }
            if ((citations["Item-1"]["journalAbbreviation"] && citations["Item-1"]["journalAbbreviation"].slice(citations["Item-1"]["journalAbbreviation"].length - 1, citations["Item-1"]["journalAbbreviation"].length)) == ".") {
                citations["Item-1"]["journalAbbreviation"] = citations["Item-1"]["journalAbbreviation"].slice(0, citations["Item-1"]["journalAbbreviation"].length - 1);
            }
            if (matchedJSON["Item-1"])
                copy = JSON.parse(JSON.stringify(matchedJSON["Item-1"]));
            let xee = citations["Item-1"];
            Object.keys(xee).forEach(function (key) {
                if (key != "id" && key != "type" && key != "author" && key != "editor" && key != "issued" && key != "year") {
                    xee[key] = key;
                }
                else if (key == "author") {
                    for (var i = 0; i < xee[key].length; i++) {


                        if (xee[key][i].given && (xee[key][i].given == xee[key][i].given.toUpperCase())) {
                            xee[key][i].given = xee[key][i].given.replace(/\./g, '');
                            xee[key][i].given = xee[key][i].given.split("").join(" ");
                        }
                        var sliceslash = "";
                        //sometimes the first letter are not in capital. This issue was reported by production team. The below snippet is written inorder to make first letter as capital.
                        if (citations && citations["Item-1"] && citations["Item-1"][key] && citations["Item-1"][key][i] && citations["Item-1"][key][i].given) {
                            var str = citations["Item-1"][key][i].given;
                            var splitStr = str.toLowerCase().split(' ');
                            for (var iks = 0; iks < splitStr.length; iks++) {
                                // You do not need to check if i is larger than splitStr length, as your for does that for you
                                // Assign it back to the array
                                splitStr[iks] = splitStr[iks].charAt(0).toUpperCase() + splitStr[iks].substring(1);
                                //capitalizing the author name after en dash
                                if ((splitStr[iks].indexOf("-") > -1)) {
                                    var splitStrEndash = splitStr[iks].split('-');
                                    for (var ikse = 0; ikse < splitStrEndash.length; ikse++) {
                                        splitStrEndash[ikse] = splitStrEndash[ikse].charAt(0).toUpperCase() + splitStrEndash[ikse].substring(1);
                                    }
                                    splitStr[iks] = splitStrEndash.join("-");
                                } else if ((splitStr[iks].indexOf("–") > -1)) {
                                    var splitStrEndash = splitStr[iks].split('–');
                                    for (var ikse = 0; ikse < splitStrEndash.length; ikse++) {
                                        splitStrEndash[ikse] = splitStrEndash[ikse].charAt(0).toUpperCase() + splitStrEndash[ikse].substring(1);
                                    }
                                    splitStr[iks] = splitStrEndash.join("–");
                                }

                            }
                            citations["Item-1"][key][i].given = splitStr.join(' ');
                            copy[key][i].given = citations["Item-1"][key][i].given;
                        }

                        if (copy[key] && copy[key][i] && copy[key][i].family)
                            xee[key][i].family = "family" + i;
                        if (copy[key] && copy[key][i] && copy[key][i].family)
                            xee[key][i].given = "given" + i;
                    }

                } else if (key == "editor") {
                    for (var i = 0; i < xee[key].length; i++) {


                        if (xee[key][i].given && (xee[key][i].given == xee[key][i].given.toUpperCase())) {
                            xee[key][i].given = xee[key][i].given.replace(/\./g, '');
                            xee[key][i].given = xee[key][i].given.split("").join(" ");
                        }



                        var sliceslash = "";

                        //sometimes the first letter are not in capital. This issue was reported by production team. The below snippet is written inorder to make first letter as capital.
                        if (citations && citations["Item-1"] && citations["Item-1"][key] && citations["Item-1"][key][i] && citations["Item-1"][key][i].given) {
                            var str = citations["Item-1"][key][i].given;
                            var splitStr = str.toLowerCase().split(' ');
                            for (var iks = 0; iks < splitStr.length; iks++) {
                                // You do not need to check if i is larger than splitStr length, as your for does that for you
                                // Assign it back to the array
                                splitStr[iks] = splitStr[iks].charAt(0).toUpperCase() + splitStr[iks].substring(1);
                                //capitalizing the author name after en dash
                                if ((splitStr[iks].indexOf("-") > -1)) {
                                    var splitStrEndash = splitStr[iks].split('-');
                                    for (var ikse = 0; ikse < splitStrEndash.length; ikse++) {
                                        splitStrEndash[ikse] = splitStrEndash[ikse].charAt(0).toUpperCase() + splitStrEndash[ikse].substring(1);
                                    }
                                    splitStr[iks] = splitStrEndash.join("-");
                                } else if ((splitStr[iks].indexOf("–") > -1)) {
                                    var splitStrEndash = splitStr[iks].split('–');
                                    for (var ikse = 0; ikse < splitStrEndash.length; ikse++) {
                                        splitStrEndash[ikse] = splitStrEndash[ikse].charAt(0).toUpperCase() + splitStrEndash[ikse].substring(1);
                                    }
                                    splitStr[iks] = splitStrEndash.join("–");
                                }

                            }
                            citations["Item-1"][key][i].given = splitStr.join(' ');
                            copy[key][i].given = citations["Item-1"][key][i].given;
                        }

                        if (copy[key] && copy[key][i] && copy[key][i].family)
                            xee[key][i].family = "editorfamily" + i;
                        if (copy[key] && copy[key][i] && copy[key][i].given)
                            xee[key][i].given = "editorgiven" + i;
                    }

                } else if (key == "issued") {


                    if (xee && xee[key] && xee[key].date) {

                    }
                    else if (xee && xee[key]) {

                        var y;
                        if (copy && copy[key] && copy[key]["date-parts"] && copy[key]["date-parts"][0] && copy[key]["date-parts"][0][0]) {
                            y = copy[key]["date-parts"][0][0];
                        }
                        else if (copy[key] && ((typeof copy[key]) == "string") && copy[key].slice(8, 12)) {
                            y = copy[key].slice(8, 12);
                            xee[key] = { "date-parts": [[y]] };
                            copy[key] = { "date-parts": [[y]] };
                        }

                    }
                    if (xee[key] && xee[key]["date-parts"] && xee[key]["date-parts"][0] && xee[key]["date-parts"][0][0]) {
                        xee[key]["date-parts"][0][0] = 543210;
                    }

                }
                else if (key == "year") {
                    var year = xee[key];
                    xee["issued"] = { "date-parts": [['543210']] };
                    copy["issued"] = { "date-parts": [[year]] };

                }
            })



            fs.readFile(path.join(localeloc, inputobjs.locales), 'utf8', function (err, datas) {
                if (err) {
                    reject({
                        'status': {
                            'code': 500,
                            'message': 'Unable to get data. Something went wrong.'
                        },
                        'message': err
                    });
                    return;
                }
                fs.readFile(styleloc + '/' + styleID, 'utf8', function (err, data) {
                    if (err) {
                        reject({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': err
                        });
                        return;
                    }
                    var etalEditor = "et al", etalAuthor = "et al";

                    styleAsText = data;
                    try {
                        let style2JSON = JSON.parse(convert.xml2json(data));
                        style2JSON = style2JSON["elements"][0]["elements"];
                        for (let i = 0; i < style2JSON.length; i++) {
                            if (style2JSON[i].name && style2JSON[i].name == "macro" && style2JSON[i]["attributes"] && style2JSON[i]["attributes"].name && style2JSON[i]["attributes"].name == "title") {
                                let macroData = style2JSON[i]["elements"];
                                if (macroData && macroData[0] && macroData[0]["elements"]) {
                                    console.log();
                                    let macroDataInner = macroData[0]["elements"];
                                    for (let k = 0; k < macroDataInner.length; k++) {
                                        let macroDataInnerInner = macroDataInner[k];

                                        if (macroDataInnerInner["elements"] && macroDataInnerInner["elements"][0] && macroDataInnerInner["elements"][0]["attributes"]) {
                                            let types = "";
                                            if (macroDataInnerInner.name && macroDataInnerInner.name == "else") {
                                                if (macroDataInnerInner["elements"][0]["attributes"].quotes) {
                                                    doubleQuotesTypes["else"] = "true";
                                                }
                                            } else {
                                                if (macroDataInnerInner["elements"][0]["attributes"].variable) {

                                                    if ((typeof macroDataInnerInner["attributes"]["type"]) == "string") {
                                                        let types = macroDataInnerInner["attributes"]["type"].split(" ");
                                                        if (types) {
                                                            for (let zi = 0; zi < types.length; zi++) {
                                                                doubleQuotesTypes[types[zi]] = "true";
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (style2JSON[i].name && style2JSON[i].name == "macro" && style2JSON[i]["attributes"] && style2JSON[i]["attributes"].name && style2JSON[i]["attributes"].name == "author") {
                                let macroData = style2JSON[i]["elements"][0]["elements"];
                                for (let k = 0; k < macroData.length; k++) {
                                    if (macroData[k].name && macroData[k].name == "et-al") {
                                        let etAlSpecs = macroData[k]["attributes"];
                                        if (etAlSpecs["font-style"] == "italic") {
                                            etalAuthor = "<i>" + etalAuthor + "</i>";
                                        }
                                        if (etAlSpecs["font-style"] == "bold") {
                                            etalAuthor = "<b>" + etalAuthor + "</b>";
                                        }
                                        if (etAlSpecs["font-style"] == "underline") {
                                            etalAuthor = "<u>" + etalAuthor + "</u>";
                                        }
                                        if (etAlSpecs["prefix"]) {
                                            etalAuthor = etAlSpecs["prefix"] + etalAuthor;
                                        }
                                        if (etAlSpecs["suffix"]) {
                                            etalAuthor = etalAuthor + etAlSpecs["suffix"];
                                        }
                                    } else if (macroData[k].name && macroData[k].name == "name" && macroData[k].attributes) {
                                        authorInitialization = macroData[k].attributes;
                                    }
                                }
                            } else if (style2JSON[i].name && style2JSON[i].name == "macro" && style2JSON[i]["attributes"] && style2JSON[i]["attributes"].name && style2JSON[i]["attributes"].name == "editor") {
                                let macroData = style2JSON[i]["elements"][0]["elements"];
                                for (let k = 0; k < macroData.length; k++) {
                                    if (macroData[k].name && macroData[k].name == "et-al") {
                                        let etAlSpecs = macroData[k]["attributes"];
                                        if (etAlSpecs["font-style"] == "italic") {
                                            etalEditor = "<i>" + etalEditor + "<i>";
                                        }
                                        if (etAlSpecs["prefix"]) {
                                            etalEditor = etAlSpecs["prefix"] + etalEditor;
                                        }
                                        if (etAlSpecs["suffix"]) {
                                            etalEditor = etalEditor + etAlSpecs["suffix"];
                                        }
                                    } else if (macroData[k].name && macroData[k].name == "name") {
                                        editorInitialization = macroData[0]["attributes"];
                                    }
                                }

                            } else if (style2JSON[i].name && style2JSON[i].name == "macro" && style2JSON[i]["attributes"] && style2JSON[i]["attributes"].name && style2JSON[i]["attributes"].name == "contributors") {
                                let macroData = style2JSON[i]["elements"][0]["elements"];
                                for (let k = 0; k < macroData.length; k++) {
                                    if (macroData[k].name && macroData[k].name == "names") {
                                        let macroDataInner = macroData[k]["elements"];
                                        for (let s = 0; s < macroDataInner.length; s++) {
                                            if (macroDataInner[s] && macroDataInner[s].name == "name") {
                                                if (macroDataInner[s].attributes && macroDataInner[s].attributes && macroDataInner[s].attributes) {
                                                    authorInitialization = macroDataInner[s].attributes;
                                                }
                                            }
                                            if (macroDataInner[s] && macroDataInner[s].name == "label") {
                                                if (macroDataInner[s].attributes && macroDataInner[s].attributes && macroDataInner[s].attributes) {
                                                    if (macroDataInner[s].attributes.prefix) {
                                                        authorInitializationlast = macroDataInner[s].attributes.prefix;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                            } else if (style2JSON[i].name && style2JSON[i].name == "macro" && style2JSON[i]["attributes"] && style2JSON[i]["attributes"].name && style2JSON[i]["attributes"].name == "author") {
                                let macroData = style2JSON[i]["elements"][0]["elements"];
                                for (let k = 0; k < macroData.length; k++) {
                                    if (macroData[k].name && macroData[k].name == "names") {
                                        let macroDataInner = macroData[k]["elements"];
                                        for (let s = 0; s < macroDataInner.length; s++) {
                                            if (macroDataInner[s] && macroDataInner[s].name == "name") {
                                                if (macroDataInner[s].attributes && macroDataInner[s].attributes && macroDataInner[s].attributes) {
                                                    authorInitialization = macroDataInner[s].attributes;
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        console.log();
                    } catch (e) {

                    }
                    citeprocSys2 = {
                        // Given a language tag in RFC-4646 form, this method retrieves the
                        // locale definition file.  This method must return a valid *serialized*
                        // CSL locale. (In other words, an blob of XML as an unparsed string.  The
                        // processor will fail on a native XML object or buffer).
                        retrieveLocale: function (lang) {
                            ////console.log(JSON.stringify(datas));
                            return datas;
                            //return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<locale xmlns=\"http://purl.org/net/xbiblio/csl\" version=\"1.0\" xml:lang=\"en-US\">\r\n  <info>\r\n    <rights license=\"http://creativecommons.org/licenses/by-sa/3.0/\">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>\r\n    <updated>2012-07-04T23:31:02+00:00</updated>\r\n  </info>\r\n  <style-options punctuation-in-quote=\"true\"\r\n                 leading-noise-words=\"a,an,the\"\r\n                 name-as-sort-order=\"ja zh kr my hu vi\"\r\n                 name-never-short=\"ja zh kr my hu vi\"/>\r\n  <date form=\"text\">\r\n    <date-part name=\"month\" suffix=\" \"/>\r\n    <date-part name=\"day\" suffix=\", \"/>\r\n    <date-part name=\"year\"/>\r\n  </date>\r\n  <date form=\"numeric\">\r\n    <date-part name=\"month\" form=\"numeric-leading-zeros\" suffix=\"/\"/>\r\n    <date-part name=\"day\" form=\"numeric-leading-zeros\" suffix=\"/\"/>\r\n    <date-part name=\"year\"/>\r\n  </date>\r\n  <terms>\r\n    <term name=\"radio-broadcast\">radio broadcast</term>\r\n    <term name=\"television-broadcast\">television broadcast</term>\r\n    <term name=\"podcast\">podcast</term>\r\n    <term name=\"instant-message\">instant message</term>\r\n    <term name=\"email\">email</term>\r\n    <term name=\"number-of-volumes\">\r\n      <single>volume</single>\r\n      <multiple>volumes</multiple>\r\n    </term>\r\n    <term name=\"accessed\">accessed</term>\r\n    <term name=\"and\">and</term>\r\n    <term name=\"and\" form=\"symbol\">&amp;</term>\r\n    <term name=\"and others\">and others</term>\r\n    <term name=\"anonymous\">anonymous</term>\r\n    <term name=\"anonymous\" form=\"short\">anon.</term>\r\n    <term name=\"at\">at</term>\r\n    <term name=\"available at\">available at</term>\r\n    <term name=\"by\">by</term>\r\n    <term name=\"circa\">circa</term>\r\n    <term name=\"circa\" form=\"short\">c.</term>\r\n    <term name=\"cited\">cited</term>\r\n    <term name=\"edition\">\r\n      <single>edition</single>\r\n      <multiple>editions</multiple>\r\n    </term>\r\n    <term name=\"edition\" form=\"short\">ed.</term>\r\n    <term name=\"et-al\">et al.</term>\r\n    <term name=\"forthcoming\">forthcoming</term>\r\n    <term name=\"from\">from</term>\r\n    <term name=\"ibid\">ibid.</term>\r\n    <term name=\"in\">in</term>\r\n    <term name=\"in press\">in press</term>\r\n    <term name=\"internet\">internet</term>\r\n    <term name=\"interview\">interview</term>\r\n    <term name=\"letter\">letter</term>\r\n    <term name=\"no date\">no date</term>\r\n    <term name=\"no date\" form=\"short\">n.d.</term>\r\n    <term name=\"online\">online</term>\r\n    <term name=\"presented at\">presented at the</term>\r\n    <term name=\"reference\">\r\n      <single>reference</single>\r\n      <multiple>references</multiple>\r\n    </term>\r\n    <term name=\"reference\" form=\"short\">\r\n      <single>ref.</single>\r\n      <multiple>refs.</multiple>\r\n    </term>\r\n    <term name=\"retrieved\">retrieved</term>\r\n    <term name=\"scale\">scale</term>\r\n    <term name=\"version\">version</term>\r\n\r\n    <!-- ANNO DOMINI; BEFORE CHRIST -->\r\n    <term name=\"ad\">AD</term>\r\n    <term name=\"bc\">BC</term>\r\n\r\n    <!-- PUNCTUATION -->\r\n    <term name=\"open-quote\">\u201C</term>\r\n    <term name=\"close-quote\">\u201D</term>\r\n    <term name=\"open-inner-quote\">\u2018</term>\r\n    <term name=\"close-inner-quote\">\u2019</term>\r\n    <term name=\"page-range-delimiter\">\u2013</term>\r\n\r\n    <!-- ORDINALS -->\r\n    <term name=\"ordinal\">th</term>\r\n    <term name=\"ordinal-01\">st</term>\r\n    <term name=\"ordinal-02\">nd</term>\r\n    <term name=\"ordinal-03\">rd</term>\r\n    <term name=\"ordinal-11\">th</term>\r\n    <term name=\"ordinal-12\">th</term>\r\n    <term name=\"ordinal-13\">th</term>\r\n\r\n    <!-- LONG ORDINALS -->\r\n    <term name=\"long-ordinal-01\">first</term>\r\n    <term name=\"long-ordinal-02\">second</term>\r\n    <term name=\"long-ordinal-03\">third</term>\r\n    <term name=\"long-ordinal-04\">fourth</term>\r\n    <term name=\"long-ordinal-05\">fifth</term>\r\n    <term name=\"long-ordinal-06\">sixth</term>\r\n    <term name=\"long-ordinal-07\">seventh</term>\r\n    <term name=\"long-ordinal-08\">eighth</term>\r\n    <term name=\"long-ordinal-09\">ninth</term>\r\n    <term name=\"long-ordinal-10\">tenth</term>\r\n\r\n    <!-- LONG LOCATOR FORMS -->\r\n    <term name=\"book\">\r\n      <single>book</single>\r\n      <multiple>books</multiple>\r\n    </term>\r\n    <term name=\"chapter\">\r\n      <single>chapter</single>\r\n      <multiple>chapters</multiple>\r\n    </term>\r\n    <term name=\"column\">\r\n      <single>column</single>\r\n      <multiple>columns</multiple>\r\n    </term>\r\n    <term name=\"figure\">\r\n      <single>figure</single>\r\n      <multiple>figures</multiple>\r\n    </term>\r\n    <term name=\"folio\">\r\n      <single>folio</single>\r\n      <multiple>folios</multiple>\r\n    </term>\r\n    <term name=\"issue\">\r\n      <single>number</single>\r\n      <multiple>numbers</multiple>\r\n    </term>\r\n    <term name=\"line\">\r\n      <single>line</single>\r\n      <multiple>lines</multiple>\r\n    </term>\r\n    <term name=\"note\">\r\n      <single>note</single>\r\n      <multiple>notes</multiple>\r\n    </term>\r\n    <term name=\"opus\">\r\n      <single>opus</single>\r\n      <multiple>opera</multiple>\r\n    </term>\r\n    <term name=\"page\">\r\n      <single>page</single>\r\n      <multiple>pages</multiple>\r\n    </term>\r\n    <term name=\"paragraph\">\r\n      <single>paragraph</single>\r\n      <multiple>paragraph</multiple>\r\n    </term>\r\n    <term name=\"part\">\r\n      <single>part</single>\r\n      <multiple>parts</multiple>\r\n    </term>\r\n    <term name=\"section\">\r\n      <single>section</single>\r\n      <multiple>sections</multiple>\r\n    </term>\r\n    <term name=\"sub verbo\">\r\n      <single>sub verbo</single>\r\n      <multiple>sub verbis</multiple>\r\n    </term>\r\n    <term name=\"verse\">\r\n      <single>verse</single>\r\n      <multiple>verses</multiple>\r\n    </term>\r\n    <term name=\"volume\">\r\n      <single>volume</single>\r\n      <multiple>volumes</multiple>\r\n    </term>\r\n\r\n    <!-- SHORT LOCATOR FORMS -->\r\n    <term name=\"book\" form=\"short\">bk.</term>\r\n    <term name=\"chapter\" form=\"short\">chap.</term>\r\n    <term name=\"column\" form=\"short\">col.</term>\r\n    <term name=\"figure\" form=\"short\">fig.</term>\r\n    <term name=\"folio\" form=\"short\">f.</term>\r\n    <term name=\"issue\" form=\"short\">no.</term>\r\n    <term name=\"line\" form=\"short\">l.</term>\r\n    <term name=\"note\" form=\"short\">n.</term>\r\n    <term name=\"opus\" form=\"short\">op.</term>\r\n    <term name=\"page\" form=\"short\">\r\n      <single>p.</single>\r\n      <multiple>pp.</multiple>\r\n    </term>\r\n    <term name=\"paragraph\" form=\"short\">para.</term>\r\n    <term name=\"part\" form=\"short\">pt.</term>\r\n    <term name=\"section\" form=\"short\">sec.</term>\r\n    <term name=\"sub verbo\" form=\"short\">\r\n      <single>s.v.</single>\r\n      <multiple>s.vv.</multiple>\r\n    </term>\r\n    <term name=\"verse\" form=\"short\">\r\n      <single>v.</single>\r\n      <multiple>vv.</multiple>\r\n    </term>\r\n    <term name=\"volume\" form=\"short\">\r\n      <single>vol.</single>\r\n      <multiple>vols.</multiple>\r\n    </term>\r\n\r\n    <!-- SYMBOL LOCATOR FORMS -->\r\n    <term name=\"paragraph\" form=\"symbol\">\r\n      <single>\u00B6</single>\r\n      <multiple>\u00B6\u00B6</multiple>\r\n    </term>\r\n    <term name=\"section\" form=\"symbol\">\r\n      <single>\u00A7</single>\r\n      <multiple>\u00A7\u00A7</multiple>\r\n    </term>\r\n\r\n    <!-- LONG ROLE FORMS -->\r\n    <term name=\"director\">\r\n      <single>director</single>\r\n      <multiple>directors</multiple>\r\n    </term>\r\n    <term name=\"editor\">\r\n      <single>editor</single>\r\n      <multiple>editors</multiple>\r\n    </term>\r\n    <term name=\"editorial-director\">\r\n      <single>editor</single>\r\n      <multiple>editors</multiple>\r\n    </term>\r\n    <term name=\"illustrator\">\r\n      <single>illustrator</single>\r\n      <multiple>illustrators</multiple>\r\n    </term>\r\n    <term name=\"translator\">\r\n      <single>translator</single>\r\n      <multiple>translators</multiple>\r\n    </term>\r\n    <term name=\"editortranslator\">\r\n      <single>editor &amp; translator</single>\r\n      <multiple>editors &amp; translators</multiple>\r\n    </term>\r\n\r\n    <!-- SHORT ROLE FORMS -->\r\n    <term name=\"director\" form=\"short\">\r\n      <single>dir.</single>\r\n      <multiple>dirs.</multiple>\r\n    </term>\r\n    <term name=\"editor\" form=\"short\">\r\n      <single>ed.</single>\r\n      <multiple>eds.</multiple>\r\n    </term>\r\n    <term name=\"editorial-director\" form=\"short\">\r\n      <single>ed.</single>\r\n      <multiple>eds.</multiple>\r\n    </term>\r\n    <term name=\"illustrator\" form=\"short\">\r\n      <single>ill.</single>\r\n      <multiple>ills.</multiple>\r\n    </term>\r\n    <term name=\"translator\" form=\"short\">\r\n      <single>tran.</single>\r\n      <multiple>trans.</multiple>\r\n    </term>\r\n    <term name=\"editortranslator\" form=\"short\">\r\n      <single>ed. &amp; tran.</single>\r\n      <multiple>eds. &amp; trans.</multiple>\r\n    </term>\r\n\r\n    <!-- VERB ROLE FORMS -->\r\n    <term name=\"director\" form=\"verb\">directed by</term>\r\n    <term name=\"editor\" form=\"verb\">edited by</term>\r\n    <term name=\"editorial-director\" form=\"verb\">edited by</term>\r\n    <term name=\"illustrator\" form=\"verb\">illustrated by</term>\r\n    <term name=\"interviewer\" form=\"verb\">interview by</term>\r\n    <term name=\"recipient\" form=\"verb\">to</term>\r\n    <term name=\"reviewed-author\" form=\"verb\">by</term>\r\n    <term name=\"translator\" form=\"verb\">translated by</term>\r\n    <term name=\"editortranslator\" form=\"verb\">edited &amp; translated by</term>\r\n\r\n    <!-- SHORT VERB ROLE FORMS -->\r\n    <term name=\"container-author\" form=\"verb-short\">by</term>\r\n    <term name=\"director\" form=\"verb-short\">dir.</term>\r\n    <term name=\"editor\" form=\"verb-short\">ed.</term>\r\n    <term name=\"editorial-director\" form=\"verb-short\">ed.</term>\r\n    <term name=\"illustrator\" form=\"verb-short\">illus.</term>\r\n    <term name=\"translator\" form=\"verb-short\">trans.</term>\r\n    <term name=\"editortranslator\" form=\"verb-short\">ed. &amp; trans.</term>\r\n\r\n    <!-- LONG MONTH FORMS -->\r\n    <term name=\"month-01\">January</term>\r\n    <term name=\"month-02\">February</term>\r\n    <term name=\"month-03\">March</term>\r\n    <term name=\"month-04\">April</term>\r\n    <term name=\"month-05\">May</term>\r\n    <term name=\"month-06\">June</term>\r\n    <term name=\"month-07\">July</term>\r\n    <term name=\"month-08\">August</term>\r\n    <term name=\"month-09\">September</term>\r\n    <term name=\"month-10\">October</term>\r\n    <term name=\"month-11\">November</term>\r\n    <term name=\"month-12\">December</term>\r\n\r\n    <!-- SHORT MONTH FORMS -->\r\n    <term name=\"month-01\" form=\"short\">Jan.</term>\r\n    <term name=\"month-02\" form=\"short\">Feb.</term>\r\n    <term name=\"month-03\" form=\"short\">Mar.</term>\r\n    <term name=\"month-04\" form=\"short\">Apr.</term>\r\n    <term name=\"month-05\" form=\"short\">May</term>\r\n    <term name=\"month-06\" form=\"short\">Jun.</term>\r\n    <term name=\"month-07\" form=\"short\">Jul.</term>\r\n    <term name=\"month-08\" form=\"short\">Aug.</term>\r\n    <term name=\"month-09\" form=\"short\">Sep.</term>\r\n    <term name=\"month-10\" form=\"short\">Oct.</term>\r\n    <term name=\"month-11\" form=\"short\">Nov.</term>\r\n    <term name=\"month-12\" form=\"short\">Dec.</term>\r\n\r\n    <!-- SEASONS -->\r\n    <term name=\"season-01\">Spring</term>\r\n    <term name=\"season-02\">Summer</term>\r\n    <term name=\"season-03\">Autumn</term>\r\n    <term name=\"season-04\">Winter</term>\r\n  </terms>\r\n</locale>\r\n";
                        }
                        ,
                        // Given an identifier, this retrieves one citation item.  This method
                        // must return a valid CSL-JSON object.
                        retrieveItem: function (id) {
                            citations = matchedJSON;

                            var objectConstructor = {}.constructor;
                            if (citations["Item-1"].constructor === objectConstructor) {
                                if (citations["Item-1"]["type"] && doubleQuotesTypes[citations["Item-1"]["type"]]) {
                                    if (citations["Item-1"]["title"]) {
                                        citations["Item-1"]["title"] = citations["Item-1"]["title"].replace("“", "‘");
                                        citations["Item-1"]["title"] = citations["Item-1"]["title"].replace("”", "’");
                                    }
                                } else {
                                    if (citations["Item-1"]["type"] && doubleQuotesTypes["else"]) {
                                        if (copy["title"]) {
                                            copy["title"] = copy["title"].replace("“", "‘");
                                            copy["title"] = copy["title"].replace("”", "’");
                                        }
                                    }
                                }
                                if (citations && citations["Item-1"] && citations["Item-1"].author && citations["Item-1"].author.length && copy && copy.author && copy.author.length) {

                                    // getting author styling informations from CSL and applying it directly over data 
                                    if (copy["author"])
                                        for (let p = 0; p < copy["author"].length; p++) {
                                            if ((((typeof copy["author"][p].given) == "string") && copy["author"][p].given && authorInitialization && ((authorInitialization.initialize && authorInitialization.initialize == "true") || authorInitialization.initialize == undefined))) {
                                                let givenauthorInitial = copy["author"][p].given.split(" ");
                                                for (let ker = 0; ker < givenauthorInitial.length; ker++) {
                                                    if (givenauthorInitial[ker][0] != undefined)
                                                        givenauthorInitial[ker] = givenauthorInitial[ker][0];

                                                }

                                                if (authorInitialization["initialize-with"] && !(authorInitialization["initialize-with"] == "")) {
                                                    let copyauthorgiven = "";
                                                    if (givenauthorInitial.length > 1) {
                                                        for (let init = 0; init < (givenauthorInitial.length); init++) {
                                                            if (givenauthorInitial[init].length == 1) {
                                                                copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                            } else {
                                                                copyauthorgiven += givenauthorInitial[init] + " ";

                                                            }
                                                        }
                                                        copyauthorgiven = copyauthorgiven.trim();
                                                        copy["author"][p].given = copyauthorgiven;
                                                    } else if (givenauthorInitial.length == 1) {
                                                        givenauthorInitial = givenauthorInitial[0] + authorInitialization["initialize-with"];
                                                        givenauthorInitial = givenauthorInitial.trim();
                                                        copy["author"][p].given = givenauthorInitial;
                                                    }

                                                } else if (authorInitialization["initialize-with"] == "") {
                                                    copy["author"][p].given = givenauthorInitial.join("");
                                                }
                                            } else if ((typeof copy["author"][p].given) == "string") {
                                                copy["author"][p].given = copy["author"][p].given.replace(/\./g, '');
                                                let givenauthorInitial = copy["author"][p].given.split(" ");

                                                if (authorInitialization["initialize-with"] && !(authorInitialization["initialize-with"] == "")) {
                                                    let copyauthorgiven = "";
                                                    if (givenauthorInitial.length > 1) {
                                                        for (let init = 0; init < (givenauthorInitial.length); init++) {
                                                            if (copy["author"].length == 1) {
                                                                if (givenauthorInitial[init].length == 1 && init != (givenauthorInitial.length - 1)) {
                                                                    copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                                } else if (init == (givenauthorInitial.length - 1)) {
                                                                    copyauthorgiven += givenauthorInitial[init];
                                                                } else {
                                                                    copyauthorgiven += givenauthorInitial[init] + " ";
                                                                }
                                                            } else {
                                                                if (givenauthorInitial[init].length == 1) {
                                                                    copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                                } else {
                                                                    copyauthorgiven += givenauthorInitial[init] + " ";
                                                                }

                                                            }


                                                        }
                                                        copyauthorgiven = copyauthorgiven.trim();
                                                        copy["author"][p].given = copyauthorgiven;
                                                    } else if (givenauthorInitial.length == 1) {
                                                        if (givenauthorInitial[0].length == 1 && copy["author"].length != 1) {
                                                            givenauthorInitial = givenauthorInitial[0] + authorInitialization["initialize-with"];
                                                        } else {
                                                            givenauthorInitial = givenauthorInitial[0];
                                                        }

                                                        givenauthorInitial = givenauthorInitial.trim();
                                                        copy["author"][p].given = givenauthorInitial;
                                                    }

                                                } else if (authorInitialization["initialize-with"] == "") {
                                                    copy["author"][p].given = givenauthorInitial.join("");
                                                }
                                            }
                                        }
                                }

                                //getting editor style information from csl and applying it directly over data 
                                if (copy["editor"] && citations && citations["Item-1"] && citations["Item-1"].editor && citations["Item-1"].editor.length && copy && copy.editor && copy.editor.length) {
                                    console.log(editorInitialization);
                                    if (editorInitialization != undefined && !Object.keys(editorInitialization).length == false) {

                                        if (authorInitialization["initialize-with"] && !editorInitialization["initialize-with"]) {
                                            editorInitialization["initialize-with"] = authorInitialization["initialize-with"];
                                        }
                                        authorInitialization = editorInitialization;
                                    }
                                    for (let p = 0; p < copy["editor"].length; p++) {
                                        if ((typeof copy["editor"][p].given) == "string" && copy["editor"][p].given && authorInitialization && ((authorInitialization.initialize && authorInitialization.initialize == "true") || authorInitialization.initialize != undefined)) {
                                            let givenauthorInitial = copy["editor"][p].given.split(" ");
                                            for (let ker = 0; ker < givenauthorInitial.length; ker++) {
                                                givenauthorInitial[ker] = givenauthorInitial[ker][0];

                                            }

                                            if (authorInitialization["initialize-with"] && !(authorInitialization["initialize-with"] == "")) {
                                                let copyauthorgiven = "";
                                                if (givenauthorInitial.length > 1) {
                                                    for (let init = 0; init < (givenauthorInitial.length); init++) {

                                                        if (copy["editor"].length == 1) {
                                                            if (givenauthorInitial[init].length == 1 && init != (givenauthorInitial.length - 1)) {
                                                                copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                            } else if (init == (givenauthorInitial.length - 1)) {

                                                                if (authorInitializationlast != undefined && authorInitializationlast == authorInitialization["initialize-with"]) {
                                                                    copyauthorgiven += givenauthorInitial[init];
                                                                } else {

                                                                    copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];;
                                                                }
                                                            } else {
                                                                copyauthorgiven += givenauthorInitial[init] + " ";
                                                            }
                                                        } else {
                                                            if (givenauthorInitial[init].length == 1) {
                                                                copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                            } else {
                                                                copyauthorgiven += givenauthorInitial[init] + " ";
                                                            }

                                                        }
                                                    }

                                                    copyauthorgiven = copyauthorgiven.trim();
                                                    copy["editor"][p].given = copyauthorgiven;
                                                } else if (givenauthorInitial.length == 1) {
                                                    givenauthorInitial = givenauthorInitial[0] + authorInitialization["initialize-with"];
                                                    givenauthorInitial = givenauthorInitial.trim();
                                                    copy["editor"][p].given = givenauthorInitial;
                                                }

                                            } else if (authorInitialization["initialize-with"] == "") {
                                                copy["editor"][p].given = givenauthorInitial.join("");
                                            }
                                        } else if ((typeof copy["editor"][p].given) == "string") {
                                            copy["editor"][p].given = copy["editor"][p].given.replace(/\./g, '');
                                            let givenauthorInitial = copy["editor"][p].given.split(" ");

                                            if (authorInitialization["initialize-with"] && !(authorInitialization["initialize-with"] == "")) {
                                                let copyauthorgiven = "";
                                                if (givenauthorInitial.length > 1) {
                                                    for (let init = 0; init < (givenauthorInitial.length); init++) {
                                                        if (copy["editor"].length == 1) {
                                                            if (givenauthorInitial[init].length == 1 && init != (givenauthorInitial.length - 1)) {
                                                                copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                            } else if (init == (givenauthorInitial.length - 1)) {
                                                                copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];;

                                                            } else {
                                                                copyauthorgiven += givenauthorInitial[init] + " ";
                                                            }
                                                        } else {
                                                            if (givenauthorInitial[init].length == 1) {
                                                                copyauthorgiven += givenauthorInitial[init] + authorInitialization["initialize-with"];
                                                            } else {
                                                                copyauthorgiven += givenauthorInitial[init] + " ";
                                                            }

                                                        }


                                                    }
                                                    copyauthorgiven = copyauthorgiven.trim();
                                                    copy["editor"][p].given = copyauthorgiven;
                                                } else if (givenauthorInitial.length == 1) {
                                                    if (givenauthorInitial[0].length == 1 && copy["editor"].length != 1) {
                                                        givenauthorInitial = givenauthorInitial[0] + authorInitialization["initialize-with"];
                                                    } else {
                                                        givenauthorInitial = givenauthorInitial[0];
                                                    }

                                                    givenauthorInitial = givenauthorInitial.trim();
                                                    copy["editor"][p].given = givenauthorInitial;
                                                }

                                            } else if (authorInitialization["initialize-with"] == "") {
                                                copy["editor"][p].given = givenauthorInitial.join("");
                                            }
                                        }
                                    }

                                }
                            }
                            if (citations["Item-1"] && citations["Item-1"].author && citations["Item-1"].author.length) {
                                for (var ss = 0; ss < citations["Item-1"].author.length; ss++) {
                                    var initial = citations["Item-1"].author[ss].initial;
                                    var sinitialdata = "";
                                    if (initial) {
                                        var kinitil = initial;
                                        var stringInitial = "";
                                        //removing spaces from initials.
                                        for (var sinitial = 0; sinitial < kinitil.length; sinitial++) {
                                            if (kinitil[sinitial] != " ") {
                                                stringInitial = stringInitial + initial[sinitial];
                                            }

                                        }
                                        initial = stringInitial;
                                        //Creating a given name based on initial from pubmed json since citeproc system requires initial to be supplied as given otherwise it shows incprrect output.
                                        for (var sinitial = 0; sinitial < initial.length; sinitial++) {
                                            if (initial[sinitial] == initial[sinitial].toUpperCase()) {
                                                if (sinitial == 0) {
                                                    sinitialdata = sinitialdata + initial[sinitial] + " ";
                                                } else {
                                                    sinitialdata = sinitialdata + initial[sinitial] + " ";
                                                }

                                            }
                                            else {
                                                sinitialdata = sinitialdata + initial[sinitial];
                                            }

                                        }

                                    }
                                    if (sinitialdata != "") {
                                        //if initial are empty then dont replace the given with initial. Let given be as it is.


                                        try {

                                            // copy.author[ss].given = sinitialdata;
                                        }
                                        catch (e) {

                                        }
                                    }

                                }
                            }
                            if (copy["journalAbbreviation"]) {
                                //if journal abbr has dot then remove dot from middle and just keepn dots at the end ex: "J. Ers. Ed." should be converted to "J Ers Ed."
                                var splitindex = copy["journalAbbreviation"].split('.');
                                if (splitindex.length > 1) {
                                    splitindex = splitindex.join("");

                                    copy["journalAbbreviation"] = splitindex;
                                }

                            }
                            //removing extra dots and double quotes from title
                            if (copy["title"] && ((typeof copy["title"]) == "string")) {

                                if ((copy["title"][0] == "“" || copy["title"][0] == "\"" || copy["title"][0] == "”" || copy["title"][0] == "'" || copy["title"][0] == "‘" || copy["title"][0] == "’") && (copy["title"][copy["title"].length - 1] == "'" || copy["title"][copy["title"].length - 1] == "“" || copy["title"][copy["title"].length - 1] == "\"" || copy["title"][copy["title"].length - 1] == "”" || copy["title"][0] == "‘" || copy["title"][0] == "’")) {
                                    copy["title"] = copy["title"].substr(1, copy["title"].length - 2);
                                }

                                copy["title"] = copy["title"].replace(/\.+$/, "");
                                copy["title"] = copy["title"].replace(/\,+$/, "");
                                copy["title"] = copy["title"].replace(/\:+$/, "");
                            }
                            if (copy["URL"] && ((typeof copy["URL"]) == "string")) {

                                let match = copy["URL"].match(/(["‘’“'”]+)(.*)(["‘’“'”]+)/);

                                if (match != null && match.length == 4) {
                                    copy["URL"] = match[2];
                                }
                                copy["URL"] = copy["URL"].replace(/\.+$/, "");
                            }
                            if (copy["DOI"] && ((typeof copy["DOI"]) == "string")) {

                                let match = copy["DOI"].match(/(["‘’“'”]+)(.*)(["‘’“'”]+)/);

                                if (match != null && match.length == 4) {
                                    copy["DOI"] = match[2];
                                }
                                copy["DOI"] = copy["DOI"].replace(/\.+$/, "");
                            }

                            //removing extra dots and double quotes from container-title
                            if (copy["container-title"] && ((typeof copy["container-title"]) == "string")) {

                                let match = copy["container-title"].match(/(["“”]+)(.*)(["“”]+)/);

                                if (match != null && match.length == 4) {
                                    copy["container-title"] = match[2];
                                }
                                copy["container-title"] = copy["container-title"].replace(/\.+$/, "");
                                copy["container-title"] = copy["container-title"].replace(/\,+$/, "");
                                copy["container-title"] = copy["container-title"].replace(/\:+$/, "");
                            }
                            if (copy["URL"]) {

                                copy["URL"] = copy["URL"].replace(/\.+$/, "");
                            }


                            citations["Item-1"]["id"] = "Item-1";
                            if (citations["Item-1"]["editor"]) {
                                if (citations["Item-1"]["type"] == "article-journal") {
                                    citations["Item-1"]["type"] = "book";
                                }

                            }

                            return citations[id];
                        }
                    };


                    var r = require('../citeproc.js');
                    var citeproc = new r.CSL.Engine(citeprocSys2, styleAsText);
                    r = '';
                    var itemIDs = [];
                    for (var key in citations) {
                        itemIDs.push(key);
                    }
                    citeproc.updateItems(itemIDs);

                    var bibResult = citeproc.makeBibliography();

                    bibResult[1][0] = bibResult[1][0].replace(/<div class="csl-left-margin">(.*?)<\/div>/g, '');

                    // clearing all attributes of i tag or any otehr tags
                    bibResult[1][0] = bibResult[1][0].replace(/(<\/?(?:em|i|strong|b|u)[^>]*>)|<[^>]+>/ig, '$1');
                    bibResult[1][0] = bibResult[1][0].replace(/<\s*em.*?>/, '<em>');
                    bibResult[1][0] = bibResult[1][0].replace(/<\s*i.*?>/, '<i>');
                    bibResult[1][0] = bibResult[1][0].replace(/<\s*strong.*?>/, '<strong>');
                    bibResult[1][0] = bibResult[1][0].replace(/<\s*b.*?>/, '<b>');
                    bibResult[1][0] = bibResult[1][0].replace(/<\s*u.*?>/, '<u>');
                    bibResult[1][0] = bibResult[1][0].replace('Epub', '');
                    bibResult[1][0] = bibResult[1][0].trim();
                    console.log(bibResult[1][0]);

                    //get all the styling elemnts so that we can re add the styling elemnts at the end after we surroundthe text with proper tags
                    //example <i><span>abc</span><i> is the output if we do not use this methodology but we want span to be placed at first then rest tags.
                    bibResult[1][0] = bibResult[1][0].replace(/Container-Title/g, 'container-title');
                    bibResult[1][0] = bibResult[1][0].replace(/Container-title/g, "container-title");
                    bibResult[1][0] = bibResult[1][0].replace(/Edition/g, "edition");
                    bibResult[1][0] = bibResult[1][0].replace(/Title/g, "title");
                    bibResult[1][0] = bibResult[1][0].replace(/Genre/g, "genre");
                    var boldset = "", italicsset = "", underlineset = "";
                    var htmldata = bibResult[1][0];
                    if (htmldata.match(/<i>(.*?)<\/i>/g)) {
                        italicsset = htmldata.match(/<i>(.*?)<\/i>/g).map(function (val) {
                            return val.replace(/<(.|\n)*?>/g, '');
                        });
                    }
                    if (htmldata.match(/<u>(.*?)<\/u>/g)) {
                        underlineset = htmldata.match(/<u>(.*?)<\/u>/g).map(function (val) {
                            return val.replace(/<(.|\n)*?>/g, '');
                        });
                    }
                    if (htmldata.match(/<b>(.*?)<\/b>/g)) {
                        boldset = htmldata.match(/<b>(.*?)<\/b>/g).map(function (val) {
                            return val.replace(/<(.|\n)*?>/g, '');
                        });
                    }

                    bibResult[1][0] = bibResult[1][0].replace(/<(.|\n)*?>/g, '');

                    bibResult2 = '';
                    citati = [{
                        'id': "Item-1",
                        'locator': "1",
                        'label': "hi",
                        'type': "1",
                        'position': "hi"
                    }];
                    citations["Item-1"] = JSON.parse(JSON.stringify(copy));
                    var result = citeproc.makeCitationCluster(citati);
                    /*
                    //for printing the output in file Output.txt just uncomment this
               printFiles(inputobj,inputobjs,matchedJSON,source,result,bibResult,inputobjs,bibResult2);
               */

                    //we need to change the . Container-Title to .container-title for reverse JSON implementation.




                    if (copy["issued"] && copy["issued"]["date-parts"] && copy["issued"]["date-parts"][0][0])
                        bibResult[1][0] = bibResult[1][0].replace('543210', "<span class=\"RefYear\">" + copy["issued"]["date-parts"][0][0] + "</span>");
                    delete copy["id"];
                    //Workaround to handle when publisher comes after publisher-place on revrsed biblio unstyled string CONVERSION SINCE both publisher and publisher-place has same prefix so sometimes publisher-place frst word publish gets replaced.
                    if (copy["publisher"] && copy["publisher-place"]) {
                        var copypub = copy["publisher"];
                        var copypubplace = copy["publisher-place"];
                        delete copy["publisher"];
                        delete copy["publisher-place"];
                        copy["publisher-place"] = copypubplace;
                        copy["publisher"] = copypub;
                    }
                    if (copy && copy["issue"]) {
                        // if issue has any preceding ( or ) then remove it since csl adds those brackets
                        copy["issue"] = copy["issue"].replace("(", "");
                        copy["issue"] = copy["issue"].replace(")", "");
                    }

                    //replace the unstyled revresed string with tags.
                    Object.keys(copy).forEach(function (key) {
                        var boldbool = "", italicbool = "", underlinebool = "";
                        for (var ki = 0; ki < italicsset.length; ki++) {
                            if (italicsset[ki] == key) {
                                copy[key] = "<i>" + copy[key] + "</i>";

                            } else if (italicsset[ki].toLowerCase() == "et al." || italicsset[ki].toLowerCase() == "et al") {
                                etAllItalics = true;
                            }

                        }
                        for (var kb = 0; kb < boldset.length; kb++) {
                            if (boldset[kb] == key) {
                                copy[key] = "<b>" + copy[key] + "</b>";

                            } else if (boldset && boldset[ki] && (boldset[ki].toLowerCase() == "et al." || boldset[ki].toLowerCase() == "et al")) {
                                etAllBold = true;
                            }

                        }
                        for (var ku = 0; ku < underlineset.length; ku++) {
                            if (underlineset[ku] == key) {
                                copy[key] = "<u>" + copy[key] + "</u>";

                            } else if (underlineset[ki].toLowerCase() == "et al." || underlineset[ki].toLowerCase() == "et al") {
                                etalUnderLine = true;
                            }

                        }




                        if (key == "author") {
                            for (var i = 0; i < copy[key].length; i++) {
                                //result=result.replace("family"+i, copy[key][i].family);


                                if (copy["author"][i].family && copy["author"][i].given) {
                                    var indexFamily = bibResult[1][0].indexOf("family" + i);
                                    var indexGiven = bibResult[1][0].indexOf("given" + i);
                                    if (indexFamily < indexGiven) {
                                        bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefAuthor\"><span class=\"RefSurName\">" + copy[key][i].family + "</span>");

                                        result = result.replace("family" + i, "<span class=\"RefAuthor\"><span class=\"RefSurName\">" + copy[key][i].family + "</span>");
                                        if (bibResult[1][0].indexOf("given" + (i + 1)) != -1) {
                                            bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                            result = result.replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                        }
                                        else if (copy["etal"] && (bibResult[1][0].indexOf("et al") == -1)) {
                                            console.log("b" + bibResult[1][0]);
                                            bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>" + ", <span class=\"RefEtal\">" + etalAuthor + "</span>");
                                            result = result.replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>" + ", <span class=\"RefEtal\">" + etalAuthor + "</span>");
                                            console.log(bibResult[1][0]);
                                        } else {
                                            bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                            result = result.replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");

                                        }
                                    } else {
                                        bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefAuthor\"><span class=\"RefGivenName\">" + copy[key][i].given + "</span>");

                                        result = result.replace("given" + i, "<span class=\"RefAuthor\"><span class=\"RefGivenName\">" + copy[key][i].given + "</span>");
                                        if (bibResult[1][0].indexOf("family" + (i + 1)) != -1) {
                                            bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");
                                            result = result.replace("family" + i, "<span class=\"RefSurName\">" + copy[key][i].given + "</span></span>");
                                        }
                                        else if (copy["etal"] && (bibResult[1][0].indexOf("et al") == -1)) {
                                            console.log("b" + bibResult[1][0]);
                                            bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefSurName\">" + copy[key][i].given + "</span></span>" + ", <span class=\"RefEtal\">" + etalAuthor + "</span>");
                                            result = result.replace("family" + i, "<span class=\"RefSurName\">" + copy[key][i].given + "</span></span>" + ", <span class=\"RefEtal\">" + etalAuthor + "</span>");
                                            console.log(bibResult[1][0]);
                                        } else {
                                            bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");
                                            result = result.replace("family" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");

                                        }

                                    }

                                } else if (copy["author"][i].family) {
                                    if (bibResult[1][0].indexOf("given" + (i + 1)) != -1) {
                                        bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefGivenName\">" + copy[key][i].family + "</span></span>");
                                        result = result.replace("family" + i, "<span class=\"RefGivenName\">" + copy[key][i].family + "</span></span>");
                                    }
                                    else if (copy["etal"]) {

                                        bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefGivenName\">" + copy[key][i].family + "</span></span>" + ",<span class=\"RefEtal\">" + etalAuthor + "</span>");
                                        result = result.replace("family" + i, "<span class=\"RefGivenName\">" + copy[key][i].family + "</span></span>" + ",<span class=\"RefEtal\">" + etalAuthor + "</span>");
                                    } else {
                                        bibResult[1][0] = bibResult[1][0].replace("family" + i, "<span class=\"RefGivenName\">" + copy[key][i].family + "</span></span>");
                                        result = result.replace("family" + i, "<span class=\"RefGivenName\">" + copy[key][i].family + "</span></span>");
                                    }
                                }
                                else if (copy["author"][i].given) {
                                    if (bibResult[1][0].indexOf("given" + (i + 1)) != -1) {
                                        bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                        result = result.replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                    } else if (copy["etal"]) {
                                        bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>" + ",<span class=\"RefEtal\">" + etalAuthor + "</span>");
                                        result = result.replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>" + ",<span class=\"RefEtal\">" + etalAuthor + "</span>");

                                    } else {
                                        bibResult[1][0] = bibResult[1][0].replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                        result = result.replace("given" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");

                                    }
                                }


                            }
                        } else if (key == "editor") {
                            for (var i = 0; i < copy[key].length; i++) {
                                //result=result.replace("family"+i, copy[key][i].family);

                                if (copy["editor"][i].family && copy["editor"][i].given) {

                                    //check if editor given is first or editor family is first
                                    if (bibResult[1][0].indexOf("editorgiven" + i) <= bibResult[1][0].indexOf("editorfamily" + i)) {

                                        bibResult[1][0] = bibResult[1][0].replace("editorgiven" + i, "<span class=\"RefEditor\"><span class=\"RefGivenName\">" + copy[key][i].given + "</span>");

                                        result = result.replace("editorgiven" + i, "<span class=\"RefEditor\"><span class=\"RefGivenName\">" + copy[key][i].given + "</span>");
                                        if (bibResult[1][0].indexOf("editorfamily" + (i + 1)) != -1) {
                                            bibResult[1][0] = bibResult[1][0].replace("editorfamily" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");
                                            result = result.replace("editorfamily" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");
                                        }

                                        bibResult[1][0] = bibResult[1][0].replace("editorfamily" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");
                                        result = result.replace("editorfamily" + i, "<span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");

                                    } else {
                                        bibResult[1][0] = bibResult[1][0].replace("editorfamily" + i, "<span class=\"RefEditor\"><span class=\"RefSurName\">" + copy[key][i].family + "</span>");

                                        result = result.replace("editorfamily" + i, "<span class=\"RefEditor\"><span class=\"RefSurName\">" + copy[key][i].family + "</span>");
                                        if (bibResult[1][0].indexOf("editorgiven" + (i + 1)) != -1) {
                                            bibResult[1][0] = bibResult[1][0].replace("editorgiven" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                            result = result.replace("editorgiven" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                        }

                                        bibResult[1][0] = bibResult[1][0].replace("editorgiven" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                        result = result.replace("editorgiven" + i, "<span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");

                                    }
                                } else if (copy["editor"][i].family) {

                                    bibResult[1][0] = bibResult[1][0].replace("editorfamily" + i, "<span class=\"RefEditor\"><span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");
                                    result = result.replace("editorfamily" + i, "<span class=\"RefEditor\"><span class=\"RefSurName\">" + copy[key][i].family + "</span></span>");


                                } else if (copy["editor"][i].given) {
                                    bibResult[1][0] = bibResult[1][0].replace("editorgiven" + i, "<span class=\"RefEditor\"><span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");
                                    result = result.replace("editorgiven" + i, "<span class=\"RefEditor\"><span class=\"RefGivenName\">" + copy[key][i].given + "</span></span>");


                                }
                                if (bibResult[1][0].indexOf("Eds.") > -1) {
                                    bibResult[1][0] = bibResult[1][0].replace("Eds.", "<span class=\"RefEdition\">Eds.</span>");
                                } else if (bibResult[1][0].indexOf("Ed.") > -1) {
                                    bibResult[1][0] = bibResult[1][0].replace("Ed.", "<span class=\"RefEdition\">Ed.</span>");
                                }
                            }


                        } else if (key == "page") {
                            var str = copy[key].split('-');
                            if (str.length != 2) {
                                str = copy[key].split('–');
                            }
                            var resultString = '';
                            if (str[0]) {
                                resultString = resultString + "<span class=\"RefFPage\">" + str[0] + "</span>";
                            }
                            if (str[1]) {
                                var prefix = "";
                                /* if (str[0] && str[0].length > str[1].length)
                                     prefix = str[0].slice(0, (str[0].length - str[1].length));
                                     */

                                resultString = resultString + "–<span class=\"RefLPage\">" + prefix + str[1] + "</span>";
                            }
                            bibResult[1][0] = bibResult[1][0].replace(key, resultString);
                        } else if (key == "DOI") {
                            bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");
                        }
                        else {
                            if (key == "container-title" || key == "journalAbbreviation") {
                                if (copy["type"] == "book") {


                                    bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + "RefBookTitle" + "\">" + copy[key] + "</span>");
                                    bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + "RefBookTitle" + "\">" + copy[key] + "</span>");
                                }
                                else {


                                    bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");
                                    bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");
                                }
                            }
                            else if (key == "issued") {
                                bibResult[1][0] = bibResult[1][0].replace("543210", "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");
                            }
                            else if (key == "issue") {
                                bibResult[1][0] = bibResult[1][0].replace("(" + key + ")", "<span class=\"" + Template[key] + "\">" + "(" + copy[key] + ")" + "</span>");
                                bibResult[1][0] = bibResult[1][0].replace("( " + key + " )", "<span class=\"" + Template[key] + "\">" + "(" + copy[key] + ")" + "</span>");
                                bibResult[1][0] = bibResult[1][0].replace("(  " + key + "  )", "<span class=\"" + Template[key] + "\">" + "(" + copy[key] + ")" + "</span>");
                                bibResult[1][0] = bibResult[1][0].replace("(" + key + ")", "<span class=\"" + Template[key] + "\">" + "(" + copy[key] + ")" + "</span>");
                            } else if (key == "container-author") {
                                for (var indexautor = 0; indexautor < copy["container-author"].length; indexautor++) {
                                    bibResult[1][0] = bibResult[1][0].replace("container-author", "<span class=\"" + "RefCollaboration" + "\">" + copy["container-author"][indexautor].literal + "</span>");
                                }

                            }
                            else if (key == "title") {
                                if (copy[key] && copy[key].slice(copy[key].length - 1, copy[key].length) == "?") {
                                    bibResult[1][0] = bibResult[1][0].replace(key + ".", "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");
                                } else {
                                    bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");

                                }
                            } else if (key == "type" || key == "etal" || key == "source") {

                            }
                            else {
                                bibResult[1][0] = bibResult[1][0].replace(key, "<span class=\"" + Template[key] + "\">" + copy[key] + "</span>");
                            }
                        }
                    });
                    var resssult = JSON.stringify(bibResult[1][0]);
                    var s = JSON.parse(resssult);
                    s = s.replace("<div class=\"csl-entry\">", "");
                    s = s.replace("</div>", "");
                    var ss = "" + s + "";
                    item = {};
                    item["Input"] = inputobj;
                    item["InputConvertedJson"] = JSON.stringify(inputJSON);
                    item["MatchedJson"] = JSON.stringify(matchedJSON);

                    if (copy.source) {
                        item["ObtainedDataSource"] = copy.source;
                    }


                    item["Citation"] = JSON.stringify(result);
                    if (inputobjs.pre != undefined && inputobjs.post != undefined) {
                        item["BibliographyString"] = inputobjs.pre + ss + inputobjs.post;
                    } else if (inputobjs.pre != undefined) {
                        item["BibliographyString"] = inputobjs.pre + ss;
                    }
                    else if (inputobjs.post != undefined) {
                        item["BibliographyString"] = ss + inputobjs.post;
                    }
                    else {
                        item["BibliographyString"] = ss;
                    }
                    item["parseref"] = "";
                    item["index"] = pos;
                    let etAlString = "et al";

                    item["BibliographyString"] = item["BibliographyString"].replace('et al', '<span class=\"RefEtal\">' + etalAuthor + '</span>');

                    item["BibliographyString"] = item["BibliographyString"].replace(/<\s*em.*?>/, '<em>');
                    item["BibliographyString"] = item["BibliographyString"].replace(/<\s*i.*?>/, '<i>');
                    item["BibliographyString"] = item["BibliographyString"].replace(/<\s*strong.*?>/, '<strong>');
                    item["BibliographyString"] = item["BibliographyString"].replace(/<\s*b.*?>/, '<b>');
                    item["BibliographyString"] = item["BibliographyString"].replace(/<\s*u.*?>/, '<u>');

                    if (matchedJSON["Item-1"].prefixForStyled && matchedJSON["Item-1"].suffixForStyled) {
                        item["BibliographyString"] = matchedJSON["Item-1"].prefixForStyled + item["BibliographyString"] + matchedJSON["Item-1"].suffixForStyled;
                    }
                    item["BibliographyString"] = item["BibliographyString"].replace(/\n/g, '');
                    //removing extra In tags incase of book type
                    match = /(In|IN|in|iN)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;\s]*<span class=["0-9a-zA-Z]*>[<> ibu]*)(In|IN|in|iN)/.exec(item["BibliographyString"]);
                    if (match != null) {
                        item["BibliographyString"] = item["BibliographyString"].replace(/(In|IN|in|iN)([+.,\"\/#!$%\^&\*;:{}=\-–_`~() &amp;\s]*<span class=["0-9a-zA-Z]*>[<> ibu]*)(In|IN|in|iN)/, match[1] + match[2]);
                    }
                    getProcessor3(styleID, pos, source, matchedJSON, inputJSON, inputobj, inputobjs, item).then(function (result) {
                        try {
                            let matchedJSON = JSON.parse(result["MatchedJson"]);
                            let page = matchedJSON["Item-1"]["page"];
                            let issue = matchedJSON["Item-1"]["issue"];
                            let styledString = result["BibliographyStringUnstyled"];
                            console.log(result["BibliographyStringUnstyled"]);
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/‘/g, '\'');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/’/g, '\'');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/“/g, '\"');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/“/g, '\"');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/“/g, '\"');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/”/g, '\"');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/ /g, ' ');
                            result["BibliographyStringUnstyled"] = result["BibliographyStringUnstyled"].replace(/&#38;amp;/g, '&amp;');
                            if (matchedJSON["Item-1"]["title"]) {
                                matchedJSON["Item-1"]["title"] = matchedJSON["Item-1"]["title"].replace("(", "\\(");
                                matchedJSON["Item-1"]["title"] = matchedJSON["Item-1"]["title"].replace(")", "\\)");

                                matchedJSON["Item-1"]["title"] = matchedJSON["Item-1"]["title"].replace("?", "\\?");
                                matchedJSON["Item-1"]["title"] = matchedJSON["Item-1"]["title"].replace(/“/g, "'");
                                matchedJSON["Item-1"]["title"] = matchedJSON["Item-1"]["title"].replace(/”/g, "'");
                                matchedJSON["Item-1"]["title"] = matchedJSON["Item-1"]["title"].replace(/ /g, " ");

                                var regex = new RegExp(matchedJSON["Item-1"]["title"], "i");

                                let titleMatch = regex.exec(result["BibliographyStringUnstyled"]);
                                if (titleMatch != null && titleMatch.length > 0) {
                                    result["BibliographyString"] = result["BibliographyString"].replace(regex, titleMatch[0]);
                                    result["BibliographyString"] = result["BibliographyString"].replace(/'(?=\w|$)/g, "‘");
                                    result["BibliographyString"] = result["BibliographyString"].replace(/(?<=\w|^)'/g, "’");

                                }
                            }
                            if (matchedJSON["Item-1"]["container-title"]) {
                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace(":", "\\:");
                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace("(", "\\(");
                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace(")", "\\)");

                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace("?", "\\?");
                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace(/“/g, "'");
                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace(/”/g, "'");
                                matchedJSON["Item-1"]["container-title"] = matchedJSON["Item-1"]["container-title"].replace(/ /g, " ");
                                var regex = new RegExp(matchedJSON["Item-1"]["container-title"], "i");

                                let titleMatch = regex.exec(result["BibliographyStringUnstyled"]);
                                if (titleMatch != null && titleMatch.length > 0) {
                                    result["BibliographyString"] = result["BibliographyString"].replace(regex, titleMatch[0]);
                                    result["BibliographyString"] = result["BibliographyString"].replace(/'(?=\w|$)/g, "‘");
                                    result["BibliographyString"] = result["BibliographyString"].replace(/(?<=\w|^)'/g, "’");
                                }
                            }

                            if (matchedJSON["Item-1"]["journalAbbreviation"]) {
                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace(":", "\\:");
                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace("(", "\\(");
                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace(")", "\\)");

                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace("?", "\\?");
                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace(/“/g, "'");
                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace(/”/g, "'");
                                matchedJSON["Item-1"]["journalAbbreviation"] = matchedJSON["Item-1"]["journalAbbreviation"].replace(/ /g, " ");

                                var regex = new RegExp(matchedJSON["Item-1"]["journalAbbreviation"], "i");
                                let titleMatch = regex.exec(result["BibliographyStringUnstyled"]);
                                if (titleMatch != null && titleMatch.length > 0) {
                                    result["BibliographyString"] = result["BibliographyString"].replace(regex, titleMatch[0]);
                                    result["BibliographyString"] = result["BibliographyString"].replace(/'(?=\w|$)/g, "‘");
                                    result["BibliographyString"] = result["BibliographyString"].replace(/(?<=\w|^)'/g, "’");
                                }
                            }
                            if (matchedJSON["Item-1"]["container-title-short"]) {
                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace(":", "\\:");
                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace("(", "\\(");
                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace(")", "\\)");

                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace("?", "\\?");
                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace(/“/g, "'");
                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace(/”/g, "'");
                                matchedJSON["Item-1"]["container-title-short"] = matchedJSON["Item-1"]["container-title-short"].replace(/ /g, " ");

                                var regex = new RegExp(matchedJSON["Item-1"]["container-title-short"], "i");
                                let titleMatch = regex.exec(result["BibliographyStringUnstyled"]);
                                if (titleMatch != null && titleMatch.length > 0) {
                                    result["BibliographyString"] = result["BibliographyString"].replace(regex, titleMatch[0]);
                                    result["BibliographyString"] = result["BibliographyString"].replace(/'(?=\w|$)/g, "‘");
                                    result["BibliographyString"] = result["BibliographyString"].replace(/(?<=\w|^)'/g, "’");
                                }
                            }




                            if (page && (page.indexOf("-") != -1 || page.indexOf("–") != -1 || page.indexOf(":") != -1)) {
                                if (page.indexOf("-") != -1) {
                                    page = page.split("-");

                                } else if (page.indexOf("–") != -1) {
                                    page = page.split("–");
                                } else if (page.indexOf(":") != -1) {
                                    page = page.split(":");
                                }
                                let regex = new RegExp("(" + page[0] + ")([a-zA-Z0-9]*)([-:])([a-zA-Z0-9]*)(" + page[1][page[1].length - 1] + ")");
                                let pageArray = regex.exec(styledString.replace(/–/g, '-'));

                                if (pageArray.length == 6) {
                                    result["BibliographyString"] = result["BibliographyString"].replace("<span class=\"RefLPage\">" + page[1] + "</span>", "<span class=\"RefLPage\">" + pageArray[4] + pageArray[5] + "</span>");
                                }
                                console.log();
                            }

                            if (issue && (issue.indexOf("-") != -1 || issue.indexOf("–") != -1 || issue.indexOf(":") != -1)) {
                                if (issue.indexOf("-") != -1) {
                                    issue = issue.split("-");

                                } else if (issue.indexOf("–") != -1) {
                                    issue = issue.split("–");
                                } else if (issue.indexOf(":") != -1) {
                                    issue = issue.split(":");
                                }
                                let regex = new RegExp("(" + issue[0] + ")([a-zA-Z0-9]*)([-:])([a-zA-Z0-9]*)(" + issue[1][issue[1].length - 1] + ")");
                                let issueArray = regex.exec(styledString.replace(/–/g, '-'));
                                if (styledString.indexOf(issueArray[1] + issueArray[2] + "–" + issueArray[4] + issueArray[5])) {
                                    result["BibliographyString"] = result["BibliographyString"].replace(issueArray[1] + issueArray[2] + issueArray[3] + issueArray[4] + issueArray[5], issueArray[1] + issueArray[2] + "–" + issueArray[4] + issueArray[5])
                                }

                            }


                        } catch (e) {
                            //nothing since the try block is not necessary
                        }

                        resolve(result);
                        return;

                    }).catch(function (error) {
                        resolve(item);

                        return;
                    });

                })
            })

        }

    });
}
function getProcessor3(styleID, pos, source, matchedJSON3, inputJSON, inputobj, inputobjs, item) {
    // Gets the UN-styled BilioGraphystring
    return new Promise(function (resolve, reject) {
        let matchedJSON = JSON.parse(JSON.stringify(matchedJSON3));
        var citations = JSON.parse(JSON.stringify(matchedJSON));
        if (citations["Item-1"]["container-title-short"]) {
            citations["Item-1"]["journalAbbreviation"] = citations["Item-1"]["container-title-short"];
        }
        let copy = JSON.parse(JSON.stringify(matchedJSON["Item-1"]));
        let xee = citations["Item-1"];

        if (xee && xee["issued"] && (xee["issued"].length != undefined)) {
            let y = copy["issued"].slice(8, 12);
            xee["issued"] = { "date-parts": [[y, 12]] };
            copy["issued"] = { "date-parts": [[y, 12]] };
        }
        if (xee && xee["issued"] && xee["issued"].length) {
            // xee[key]["date-parts"][0][0]=5432;
            let y = copy["issued"].slice(8, 12);
            xee["issued"] = { "date-parts": [[y, 12]] };
            copy["issued"] = { "date-parts": [[y, 12]] };
        }

        fs.readFile(localeloc + '/' + inputobjs.locales, 'utf8', function (err, datas) {
            if (err) {
                reject({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': err
                });
                return;
            }
            fs.readFile(styleloc + '/' + styleID, 'utf8', function (err, data) {
                if (err) {
                    reject({
                        'status': {
                            'code': 500,
                            'message': 'Unable to get data. Something went wrong.'
                        },
                        'message': err
                    });
                    return;
                }

                styleAsText = data;
                citeprocSys2 = {
                    // Given a language tag in RFC-4646 form, this method retrieves the
                    // locale definition file.  This method must return a valid *serialized*
                    // CSL locale. (In other words, an blob of XML as an unparsed string.  The
                    // processor will fail on a native XML object or buffer).
                    retrieveLocale: function (lang) {
                        return datas;
                    }
                    ,
                    // Given an identifier, this retrieves one citation item.  This method
                    // must return a valid CSL-JSON object.
                    retrieveItem: function (id) {
                        citations = matchedJSON;
                        if (citations && citations["Item-1"] && citations["Item-1"].author && citations["Item-1"].author.length) {
                            if (citations["Item-1"].page) {
                                citations["Item-1"].page = citations["Item-1"].page.replace("–", "-");
                            }
                            for (var ss = 0; ss < citations["Item-1"].author.length; ss++) {
                                var initial = citations["Item-1"].author[ss].initial;
                                var sinitialdata = "";
                                if (initial) {
                                    var kinitil = initial;
                                    var stringInitial = "";
                                    //removing spaces
                                    for (var sinitial = 0; sinitial < kinitil.length; sinitial++) {
                                        if (kinitil[sinitial] != " ") {
                                            stringInitial = stringInitial + initial[sinitial];
                                        }

                                    }
                                    initial = stringInitial;
                                    //Creating a given name based on initial from pubmed json.
                                    for (var sinitial = 0; sinitial < initial.length; sinitial++) {
                                        if (initial[sinitial] == initial[sinitial].toUpperCase()) {
                                            if (sinitial == 0) {
                                                sinitialdata = sinitialdata + initial[sinitial] + " ";
                                            } else {
                                                sinitialdata = sinitialdata + " " + initial[sinitial] + " ";
                                            }

                                        }
                                        else {
                                            sinitialdata = sinitialdata + initial[sinitial];
                                        }

                                    }

                                }
                                if (sinitialdata != "") {
                                    try {
                                        sinitialdata = sinitialdata.replace(/ /g, '');
                                        copy.author[ss].given = sinitialdata;
                                    }
                                    catch (e) {

                                    }
                                }

                                // citations["Item-1"].author[ss].given = sinitialdata;

                            }

                        }
                        citations["Item-1"]["id"] = "Item-1";


                        return citations[id];
                    }
                };

                var r = require('../citeproc.js');
                var citeproc = new r.CSL.Engine(citeprocSys2, styleAsText);

                r = '';
                var itemIDs = [];
                for (var key in citations) {
                    itemIDs.push(key);
                }
                citeproc.updateItems(itemIDs);
                matchedJSON["Item-1"] = copy;
                citations = matchedJSON;
                var bibResult = citeproc.makeBibliography();
                console.log(bibResult[1][0]);
                let bibResult2 = '';
                citati = [{
                    'id': "Item-1",
                    'locator': "1",
                    'label': "hi",
                    'type': "1",
                    'position': "hi"
                }];
                citations["Item-1"] = JSON.parse(JSON.stringify(copy));
                let result = citeproc.makeCitationCluster(citati);
                matchedJSON["Item-1"] = copy;
                citations = matchedJSON;
                bibResult2 = citeproc.makeBibliography();
                let resssult = JSON.stringify(bibResult[1][0]);
                let s = JSON.parse(resssult);
                s = s.replace("<div class=\"csl-entry\">", "");
                s = s.replace("</div>", "");
                let ss = "" + s + "";
                ss = ss.replace(/(<\/?(?:em|i|strong|b|u)[^>]*>)|<[^>]+>/ig, '$1');
                ss = ss.replace(/\s+$/, '') + " ";
                ss = ss.trim();
                // apending alnguage to te references.

                if (copy && copy["language"] && copy["language"] != "eng") {
                    var indexpoint = ss.length;
                    if (ss.indexOf("doi:" + copy["DOI"]) > 0) {
                        indexpoint = ss.indexOf("doi:" + copy["DOI"]);
                    } else if (ss.indexOf("doi: " + copy["DOI"]) > 0) {
                        indexpoint = ss.indexOf("doi:" + copy["DOI"]);
                    }

                    if (languageJson[copy["language"]])
                        ss = ss.slice(0, indexpoint) + languageJson[copy["language"]] + " " + ss.slice(indexpoint, ss.length);

                }

                item["Input"] = inputobj;
                item["InputConvertedJson"] = JSON.stringify(inputJSON);
                item["MatchedJson"] = JSON.stringify(matchedJSON);
                if (copy.source) {
                    item["ObtainedDataSource"] = copy.source;
                }
                item["Citation"] = JSON.stringify(result);
                item["BibliographyStringUnstyled"] = ss;
                item["parseref"] = "";
                item["index"] = pos;
                resolve(item);

                return;
            })
        })
    });
}

function getProcessor4(styleID, pos, source, matchedJSON, inputJSON, inputobj, inputobjs, item) {
    // Gets the UN-styled BilioGraphystring


    citations = matchedJSON;


    fs.readFile(localeloc + '/' + inputobjs.locales, 'utf8', function (err, datas) {
        if (err) {
            reject({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': err
            });
            return;
        }
        fs.readFile(styleloc + '/' + styleID, 'utf8', function (err, data) {
            if (err) {
                reject({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': err
                });
                return;
            }

            styleAsText = data;
            citeprocSys2 = {
                // Given a language tag in RFC-4646 form, this method retrieves the
                // locale definition file.  This method must return a valid *serialized*
                // CSL locale. (In other words, an blob of XML as an unparsed string.  The
                // processor will fail on a native XML object or buffer).
                retrieveLocale: function (lang) {
                    return datas;
                }
                ,
                // Given an identifier, this retrieves one citation item.  This method
                // must return a valid CSL-JSON object.
                retrieveItem: function (id) {
                    citations = matchedJSON;

                    return citations[id];
                }
            };

            var r = require('../citeproc.js');
            var citeproc = new r.CSL.Engine(citeprocSys2, styleAsText);

            r = '';
            var itemIDs = [];
            for (var key in citations) {
                itemIDs.push(key);
            }
            citeproc.updateItems(itemIDs);
            matchedJSON["Item-1"] = copy;
            citations = matchedJSON;
            var bibResult = citeproc.makeBibliography();

            bibResult2 = '';
            citati = [{
                'id': "Item-1",
                'locator': "1",
                'label': "hi",
                'type': "1",
                'position': "hi"
            }];
            citations["Item-1"] = JSON.parse(JSON.stringify(copy));
            var result = citeproc.makeCitationCluster(citati);
            matchedJSON["Item-1"] = copy;
            citations = matchedJSON;
            var bibResult2 = citeproc.makeBibliography();
            var resssult = JSON.stringify(bibResult[1][0]);
            var s = JSON.parse(resssult);
            s = s.replace("<div class=\"csl-entry\">", "");
            s = s.replace("</div>", "");
            var ss = "" + s + "";
            ss = ss.replace(/(<\/?(?:em|i|strong|b|u)[^>]*>)|<[^>]+>/ig, '$1');
            ss = ss.replace(/\s+$/, '') + " ";
            // apending alnguage to te references.

            if (copy && copy["language"] && copy["language"] != "eng") {
                var indexpoint = ss.length;
                if (ss.indexOf("doi:" + copy["DOI"]) > 0) {
                    indexpoint = ss.indexOf("doi:" + copy["DOI"]);
                } else if (ss.indexOf("doi: " + copy["DOI"]) > 0) {
                    indexpoint = ss.indexOf("doi:" + copy["DOI"]);
                }


                if (languageJson[copy["language"]])
                    ss = ss.slice(0, indexpoint) + languageJson[copy["language"]] + " " + ss.slice(indexpoint, ss.length);

            }

            item["Input"] = inputobj;
            item["InputConvertedJson"] = JSON.stringify(inputJSON);
            item["MatchedJson"] = JSON.stringify(matchedJSON);
            if (copy.source) {
                item["ObtainedDataSource"] = copy.source;
            }
            item["Citation"] = JSON.stringify(result);
            item["BibliographyStringUnstyled"] = inputobjs.pre + ss + inputobjs.post;
            item["parseref"] = "";
            item["index"] = pos;
            resolve(item);

            return;
        })
    })

}

function getProcessor2(csljson, input, pos, source) {
    var styleID = input.style;
    // Get the CSL style as a serialized string of XML
    return new Promise(function (resolve, reject) {
        fs.readFile(localeloc + '/' + input.locales, 'utf8', function (err, datas) {
            if (err) {
                reject({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': err
                });
                return;
            }
            citeprocSys = {
                // Given a language tag in RFC-4646 form, this method retrieves the
                // locale definition file.  This method must return a valid *serialized*
                // CSL locale. (In other words, an blob of XML as an unparsed string.  The
                // processor will fail on a native XML object or buffer).
                retrieveLocale: function (lang) {
                    return datas;
                },
                // Given an identifier, this retrieves one citation item.  This method
                // must return a valid CSL-JSON object.
                retrieveItem: function (id) {
                    return citations2[id];
                }
            };
            //setting Biblio Graphy Styles
            fs.readFile(styleloc + '/' + styleID, 'utf8', function (err, data) {
                if (err) {
                    return ({
                        'status': {
                            'code': 500,
                            'message': 'Unable to read styles info. Something went wrong.'
                        },
                        'message': err
                    });
                    return;
                }
                styleAsText = data;
                var itemIDs = [];
                for (var key in citations2) {
                    itemIDs.push(key);
                }
                citations2 = csljson;
                if (csljson["Item-1"] && csljson["Item-1"].authors && csljson["Item-1"].authors.author) {
                    csljson["Item-1"].author = csljson["Item-1"].authors.author;
                }
                csljson["Item-1"].DOI = csljson["Item-1"].doi;
                csljson["Item-1"].type = "article-journal";
                var r = require('../citeproc.js');
                var citeproc = new r.CSL.Engine(citeprocSys, styleAsText);
                citeproc.updateItems(itemIDs);
                var bibResult = citeproc.makeBibliography();
                citati = [{
                    'id': "Item-1",
                    'locator': "1",
                    'label': "hi",
                    'type': "1",
                    'position': "hi"
                }];
                var result = citeproc.makeCitationCluster(citati);
                var resssult = JSON.stringify(bibResult[1][0]);
                var s = JSON.parse(resssult);
                s = s.replace("<div class=\"csl-entry\">", "");
                s = s.replace("</div>", "");
                var ss = input.pre + " " + s + " " + input.post;
                item = {}
                item["InputJSON"] = csljson;
                item["Citation"] = JSON.stringify(result);
                item["BibliographyString"] = ss;
                item["parseref"] = "";
                resolve(item);
                return;

            });
        });
    });
}
async function printFiles(inputobj, inputJSON, matchedJSON, source, result, bibResult, inputobjs, bibResult2) {
    var resssult = JSON.stringify(bibResult[1][0]);
    var s = JSON.parse(resssult);
    s = s.replace("<div class=\"csl-entry\">", "");
    s = s.replace("</div>", "");
    var ss = "" + s + "";
    return "{\"InputObjectSupplied\": " + JSON.stringify(inputobj) + ",\"ConvertedInputJson \":\"" + JSON.stringify(inputJSON) + "\"," + "\"MatchedJSON\":\"" + JSON.stringify(matchedJSON) + "\"" + ",\"ObtainedDataSource\":\"" + source + "\",\"Citation\":\"" + result + "\"," + "\"BibliographyString\":\"" + inputobjs.pre + ss + inputobjs.post + "\"}";
}
// This runs at document ready, and renders the bibliography
function renderBib(style, pos, source, matchedJSON, inputjson, inputobj, inputobjs) {
    return new Promise(function (resolve, reject) {

        getProcessor(style, pos, source, matchedJSON, inputjson, inputobj, inputobjs).then(function (data) {
            resolve(data);
            return;
        }).catch(function (error) {
            reject({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    });
}
function truecaser(input, kss) {
    return new Promise(function (resolve, reject) {
        try {
            var head = { "Content-Type": "application/json" };
            us.requestData('post', 'http://truecase.kriyadocs.com/gettruecase', head, { 'sentence': input }).catch(function (error) {
                ////console.log("error");
                resolve(error);
                return;
            }).then(function (data) {
                if (data && data.status && data.status == 200 && data.message && data.message.sentence) {
                    if (data.message.sentence.slice(data.message.sentence.length - 1, data.message.sentence.length) == ".") {
                        data.message.sentence = data.message.sentence.slice(0, data.message.sentence.length - 1);
                    }
                    var data = { "index": kss, "value": data.message.sentence };
                    resolve(data);
                    return;
                }
                else {
                    var data = { "index": kss, "value": input };
                    resolve(data);
                    return;

                }
            });
        }
        catch (e) {
            var data = { "index": kss, "value": input };
            resolve(data);
            return;
        }
    }).catch(function (error) {
        var data = { "index": kss, "value": input };
        resolve(data);
        return;
    });
}
