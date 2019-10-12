var Q = require('q');
var fs = require('fs');
var parser = require('xml2json');
var path = require('path');
var c2j = require(path.join(__dirname, '..', 'post', 'JS', 'xml2json.js'));
var p = require(path.join(__dirname, '..', 'post', 'JS', 'pubmedComp.js'));
var u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
module.exports = {
    parsereference: function (req, res, wfXML) {
        var datastring = req.body.data;;
        //slicing the array to get JSON present inside them.
        var str = [];
        str = (JSON.parse(JSON.stringify(req.body.data)));
        str = str.slice(3, str.length);
        str = str.slice(0, -3);
        str = str.split('},{');
        datastring = str;
        var xs = [];
        var n = datastring.length;
        var flag = 1;
        var kflag = 0;
        var promisesobject = [];
        for (var index = 0; index < datastring.length; index++) {

            var s = req;
            var n=datastring[index].indexOf('}');
           if(index==0)
              {  s.body.data = datastring[index].slice(1,n);}
                else
                {
                    s.body.data = datastring[index].slice(0,n); 
                }
            
            promisesobject.push(multipleparseref(s));
        }
        Q.allSettled(promisesobject).then(function (data) {
            for (var k = 0; k < data.length; k++) {
                data[k]=data[k].value;
            }
           /* var datas = [];

            
            for (var k = 0; k < data.length; k++) {
                var item = {};
                datas.push(data[k].value.data[0]);
            }
            var x = { "data": datas };
            */
            res.status(200).json({"data": data} ).end();
            return;
        }).catch(function (error) {
            res.status(500).json({ status: { code: 500, message: "Unable to parse the references. Something went wrong." } }).end();
            return;
        });
    }
}
function parseReference(datainfo) {
    return new Promise(function (resolve, reject) {
        try {
            if (!datainfo) {
                reject(errorFormatter.errorFormatter(500,datainfo,"Something went wrong while collecting back the promises."));
                return;
            }
            var header = { "Content-Type": "application/x-www-form-urlencoded" };
            var data = { "format": "html", "data": "<editreference><parse>" + datainfo + "</parse></editreference>", "processType": "parseReference" };
            
            
            u.requestData('post', 'https://kriya2.kriyadocs.com/api/process_reference?apiKey=36ab61a9-47e1-4db6-96db-8b95a9923599', header, data).catch(function (error) {
                ////console.log(error);
                resolve(error);
                return;
            }).then(function (data) {
                if (!data || data == undefined || data == '' || !data.message || !data.message.body) {
                    resolve(JSON.stringify(data));
                    return;
                }
                var str = data.message.body;
                var n = str.indexOf("<response>");
                str = str.slice(n, str.length);
                resolve(str);
                return;
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500,error,"Something went wrong while collecting back the promises."));
                return;
            });
        }
        catch (error) {
            reject(errorFormatter.errorFormatter(500,error,"Something went wrong while collecting back the promises."));
            return;
        }
    });
}
function validate(html, style, locale, pre, post, type, mode) {
    return new Promise(function (resolve, reject) {
        try {
            var inputs = {
                'data': html,
                'type': 'html',
                'request': 'validate',
                'style': style,
                'pre': pre,
                'post': post,
                'locales': locale,
            };
            p.getPubMedRefHash(inputs, inputs.style, "0").then(function (result) {
                resolve(result);
                return;
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500,error,"No data found."));
                return;
            });
            return;
        }
        catch (error) {
            reject(errorFormatter.errorFormatter(500,error,"No data found."));
            return;
        }
    });
}
function multipleparseref(req) {
    return new Promise(async function (resolve, reject) {
        try {
            //input:text string
            parseReference(req.body.data).then(function (parsedata) {
                //output: tagged html data from parse ref.
                var fullparsedata = parsedata;
                parsedata = parsedata.slice(10, parsedata.length);
                parsedata = parsedata.slice(0, -11);
                if (parsedata == "") {
                    var item = {}
                    item["InputJSON"] = "";
                    item["Citation"] = JSON.stringify("");
                    item["BibliographyString"] = fullparsedata;
                    resolve(item);
                    return;
                }
                validate(parsedata, req.body.style, req.body.locale, req.body.pre, req.body.post, req.body.type, "single").then(function (datass) {
                    resolve(datass);
                    return;
                    if (datass && datass.length) {
                        var xs = [];
                        for (var k = 0; k < datass.length; k++) {
                            datass[k].finalbiblio = datass[k].BibliographyString;
                            var d = datass[k];
                            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
                                datass[k].finalbiblio = datass[k].finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
                            }
                            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                                datass[k].finalbiblio = datass[k].finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
                            }
                            datass[k].Input = req.body.data;
                            datass[k].parseref = data;
                            xs.push(datass[k]);
                        }
                        var x = { "data": xs };
                        ////console.log(JSON.stringify(x));
                        if (x && x.input) {
                            resolve(x);
                        } else {
                            var item = {}
                            item["InputJSON"] = "";
                            item["Citation"] = JSON.stringify("");
                            item["BibliographyString"] = fullparsedata;
                            resolve(item);
                            return;
                        }
                    } else {
                        var d = datass;
                        ////console.log(d);
                        if (d) {
                            var promisejsonss = c2j.convert(parsedata);
                            promisejsonss.then(function (value) {
                                if (value && value["[container-author]"]) {
                                    datass.BibliographyString = datass.BibliographyString.replace("> <span ", "><span class=\"RefCollaboration\">" + value["[container-author]"] + "</span>.<span ")
                                }
                                datass.finalbiblio = datass.BibliographyString;
                              
                                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
                                    datass.BibliographyStringUnstyled = datass.BibliographyStringUnstyled + '<br></br><a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'DOI: ' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>\n';
                                }
                                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                                    datass.BibliographyStringUnstyled = datass.BibliographyStringUnstyled + '<br></br><a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'PMID: ' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>\n';
                                }
                                //console.log(value);
                                //console.log(JSON.parse(datass.MatchedJson)["Item-1"]);
                                const object1 = value;
                                const object2 = JSON.parse(datass.MatchedJson)["Item-1"];
                                var x1, x2;
                                if (object2.length > object1.length) {
                                    x2 = object1;
                                    x1 = object2;
                                }
                                else {
                                    x1 = object1;
                                    x2 = object2;
                                }
                                //x1 will always be smaller than x2
                                var flag;
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
                                datass["parseref"] = parsedata;
                                if (datass.ObtainedDataSource == "Crossref") {
                                    datass.finalbiblio = parsedata;
                                }
                                var x = { "data": data };
                                var data = datass;
                                var data = [];
                                datass["InputConvertedJson1"] = value;
                                datass.Input = req.body.data;
                                data.push(datass);
                                if (datass.finalbiblio == undefined) {
                                    datass.finalbiblio = datass.message;
                                }
                                var x = { "data": data };
                                resolve(x);
                                return;
                            }).catch(function (error) {
                                if (datass.BibliographyString == undefined) {
                                    datass.BibliographyString = JSON.stringify(error);
                                }
                                if (datass.Citation == undefined) {
                                    datass.Citation = "parseref failed.";
                                }
                                datass.finalbiblio = datass.BibliographyString;
                                datass.BibliographyStringUnstyled = datass.BibliographyString;
                                
                                datass["parseref"] = parsedata;
                                if (datass.ObtainedDataSource == "Crossref") {
                                    datass.finalbiblio = parsedata;
                                }
                                var data = datass;
                                var data = [];
                                datass.Input = req.body.data;
                                data.push(datass);
                                if (datass.finalbiblio == undefined) {
                                    datass.finalbiblio = datass.message;
                                }
                                var x = { "data": data };
                                resolve(x);
                                return;
                            });
                        }
                        else {
                            var item = {}
                            item["Input"] = req.body.data;
                            item["Citation"] = JSON.stringify(error);
                            item["finalbiblio"] = fullparsedata;
                            var data = [];
                            data.push(item);
                            if (data.finalbiblio == undefined) {
                                data.finalbiblio = datass.message;
                            }
                            var x = { "data": data };
                            resolve(x);
                        }
                    }
                }).catch(function (error) {
                    var item = {}
                    item["Input"] = req.body.data;
                    item["Citation"] = JSON.stringify(error);
                    item["finalbiblio"] = fullparsedata;
                    var data = [];
                    data.push(item);
                    var x = { "data": data };
                    resolve(x);
                });
            }).catch(function (error) {
                var item = {}
                item["Input"] = req.body.data;
                item["Citation"] = JSON.stringify(error);
                item["finalbiblio"] = error;
                var data = [];
                data.push(item);
                var x = { "data": data };
                resolve(x);
                return;
            });
        }
        catch (error) {
            reject(errorFormatter.errorFormatter(500,error,"Something went wrong."));
            return;
        }
    });
}