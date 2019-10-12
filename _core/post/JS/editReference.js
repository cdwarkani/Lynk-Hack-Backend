var p = require('./pubmedComp.js');
var biblioextract = require('./biblioExtract.js');
var decode = require('unescape');
var f = require('fs');
var et = require('elementtree');
var fs = require('fs');
var express = require('express');
var router = express();
var decompress = require('decompress');
var path = require('path');
var parser = require('xml2json');
var Q = require('q');
var jsonxml = require('jsontoxml');
var DOMParser = require('xmldom').DOMParser;
var u = require('./urest.js');
var c2j = require('./xml2json.js');
var locks = require('locks');
var mutex = locks.createMutex();
var getFormattedRef = require('./../library/citeproc-js-master/demo/demo.js');
//adding it to set default directory for loading interface page
router.use(express.static('public'));
router.get('/extractLocaleList', function (req, res) {
    //This router is used to extract all the styles file name along with its actualy name stored inside each of the files
    //returns json object with csl file name and csl Name
    var listoffiles = [];
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var filelist = [];
    const testFolder = './../../dataset/styles/';
    fs.readdirSync(testFolder).forEach(file => {
        filelist.push(file);
    });
    var filePromiseobject = [];
    for (var k = 4; k < filelist.length; k++) {
        filePromiseobject.push(fs.readFileSync('./../../dataset/styles/' + filelist[k], "utf8"));
    }
    Q.allSettled(filePromiseobject).then(function (data) {
        for (var k = 4; k < data.length; k++) {
            listoffiles.push(JSON.parse(parser.toJson(data[k].value)).style.info.title + '|' + filelist[k]);
        }
        res.status(200).send(listoffiles).end();
    }).catch(function (error) {
        res.status(500).json({status:{code: 500, message: "Unable to extract list of styles. Please try after sometime. Something went wrong."}}).end();
    });
});
router.get('/parseReference', function (req, res) {
    //This router gets the input of text reference string and returns the JSON object output.
    //Parses the text string, does truecasing, validates  reference, sends to citeproc and gives us the formatted output as JSON object along with the output we get from each and every stage.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var datastring=req.query.data;;
   //slicing the array to get JSON present inside them.
    var str = [];
    str = (JSON.parse(JSON.stringify(req.query.data)));
    str = str.slice(1, str.length);
    str = str.slice(0, -1);
    str = str.split('},{');
    datastring = str;
    var xs = [];
    var n = datastring.length;
        var flag = 1;
    var kflag = 0;
    var promisesobject=[];
    for (var index = 0; index < datastring.length; index++) {
       var s=req;
       s.query.data=datastring[index];
    promisesobject.push(multipleparseref(s));
    }
    Q.allSettled(promisesobject).then(function (data) {
        var datas = [];
        for(var k=0;k<data.length;k++)
        {
        var item = {};
        datas.push(data[k].value.data[0]);
        }
        var x = { "data": datas };
        res.send(x);
        return;
    }).catch(function (error) {
        var item = {}
        item["Input"] = req.query.data;
        item["Citation"] = JSON.stringify("");
        item["finalbiblio"] = "" ;
        var data = [];
        data.push(item);
        var x = { "data": data };
        res.send(x);
        return;
    });
});
router.get('/search', function (req, res) {
    //performs PMID and DOI search.
    /*
    please remove the header once u upload this service to the server. These were put inorder to access the service through html page.
    */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.query.data == "") {
        var item = {}
        item["Input"] = req.query.data;
        item["Citation"] = JSON.stringify("");
        item["finalbiblio"] = "No input supplied to the system";
        var data = [];
        data.push(item);
        var x = { "data": data };
        res.send(x);
        return;
    }
    BiblioValidate.search(req.query.data, req.query.style, req.query.locale, req.query.pre, req.query.post, req.query.type).then(function (datass) {
        datass.finalbiblio = datass.BibliographyString;
        var d = datass;
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
            datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'DOI: ' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
            datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'PMID: ' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
            datass.BibliographyStringUnstyled = datass.BibliographyStringUnstyled + '<br></br><a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'DOI: ' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
            datass.BibliographyStringUnstyled = datass.BibliographyStringUnstyled + '<br></br><a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'PMID: ' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]) {
            const object1 = d.InputConvertedJson;
            const object2 = JSON.parse(d.MatchedJson)["Item-1"];
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
        }
        //datass["parseref"] = parsedata;
        var x = { "data": data };
        var data = datass;
        var data = [];
        datass.Input = req.query.data;
        if (datass.finalbiblio == undefined) {
            datass.finalbiblio = JSON.stringify(datass.message);
        }
        if (datass.Citation == undefined) {
            datass.Citation = "No Match found"
        }
        data.push(datass);
        //console.log(data);
        var x = { "data": data };
        res.send(x);
        return;
        BiblioValidate.parseReference(datass.BibliographyString).then(function (datas) {
            datass.finalbiblio = datas;
            datass.Input = JSON.stringify(datass.Input);
            var d = datass;
            if (datass && datass.finalbiblio == undefined && datass.finalbiblio.message == undefined) {
                var item = {}
                item["Input"] = req.query.data;
                item["Citation"] = JSON.stringify("");
                item["finalbiblio"] = "Unable to find the data. No record exist in pubmed and crossref.";
                var data = [];
                data.push(item);
                var x = { "data": data };
                res.send(x);
                return;
            }
            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
                datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
            }
            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
            }
            var x = { "data": [datass] };
            res.send(x);
        }).catch(function (error) {
            res.send(error);
        });
    }).catch(function (error) {
        res.send(error);
    });
});
router.get('/validate', function (req, res) {
    //performs html string search.
    /*
    please remove the header once u upload this service to the server. These were put inorder to access the service through html page.
    */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.query.data == "") {
        var item = {};
        item["Input"] = req.query.data;
        item["Citation"] = "No input supplied to the system";
        item["finalbiblio"] = req.query.data;
        var data = [];
        data.push(item);
        var x = { "data": data };
        res.send(x);
        return;
    }
    var datastring;
    datastring = req.query.data;
    var type = req.query.refJournalType;
    if (req.query.flag == "false") {
        BiblioValidate.ConvertTOCSL(req).then(function (finalData) {
            res.send(finalData);
            return;
        }).catch(function (error) {
            res.send(error);
        });;
        return;
    }
    BiblioValidate.validate(datastring, req.query.style, req.query.locale, req.query.pre, req.query.post, req.query.type, "single").then(function (datass) {
        if (datass.message) {
            req.query.flag = "false";
            if (req.query.flag == "false") {
                BiblioValidate.ConvertTOCSL(req).then(function (finalData) {
                    res.send(finalData);
                    return;
                }).catch(function (error) {
                    var item = {};
                    item["Input"] = req.query.data;
                    item["Citation"] = JSON.stringify(datass.message);
                    item["status"] = "Validatin Failed";
                    item["finalbiblio"] = error;
                    var data = [];
                    data.push(item);
                    var x = { "data": data };
                    res.send(x);
                    return;
                });;
                return;
            }
            return;
        }
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
                /*  BiblioValidate.parseReference(datass[k].BibliographyString).then(function (datas) {
                 //console.log(datass[k].BibliographyString);
                 var d=datass[k];
                //
                                       if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].DOI)
                                       {
                                      datass[k].finalbiblio=datass[k].finalbiblio+'<a href="'+'https://doi.org/'+JSON.parse(d.MatchedJson)["Item-1"].DOI+'">'+'https://doi.org/'+JSON.parse(d.MatchedJson)["Item-1"].DOI+' </a>';
                                       }
                if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].PMID)
               {
                        datass[k].finalbiblio=datass[k].finalbiblio+'<a href="'+'https://www.ncbi.nlm.nih.gov/pubmed/'+JSON.parse(d.MatchedJson)["Item-1"].PMID+'"> '+'https://www.ncbi.nlm.nih.gov/pubmed/'+JSON.parse(d.MatchedJson)["Item-1"].PMID+'</a>';
               }
               */
                xs.push(datass[k]);
            }
            var x = { "data": xs };
            ////console.log(JSON.stringify(x));
            res.send(x);
        } else {
            var d = datass;
            BiblioValidate.parseReference(datass.BibliographyString).then(function (datas) {
                datass.finalbiblio = datas;
                var s = req.query.data;
                var PTagFirst = s.indexOf("<");
                var PTagEnd = s.indexOf(">");
                var pTag = s.slice(PTagFirst, PTagEnd + 1);
                var newPTag = pTag.slice(PTagFirst, PTagEnd);
                var PmidAndDoiForPTag = ' ';
                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                    //datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
                    if (pTag.includes("data-pmid")) {
                    }
                    else {
                        PmidAndDoiForPTag = PmidAndDoiForPTag + 'data-pmid=\"https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '\" ';
                    }
                }
                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
                    if (pTag.includes("data-doi")) {
                    }
                    else {
                        PmidAndDoiForPTag = PmidAndDoiForPTag + 'data-doi=\"' + JSON.parse(d.MatchedJson)["Item-1"].DOI + "\" ";
                    }
                    //datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
                }
                PmidAndDoiForPTag = PmidAndDoiForPTag + " ";
                newPTag = newPTag + PmidAndDoiForPTag + " >";
                datass.finalbiblio = datass.finalbiblio.replace('<p>', newPTag);
                datass.Input = JSON.stringify(datass.Input);
                var x = { "data": [datass] };
                res.send(x);
            }).catch(function (error) {
                req.query.flag = "false";
                if (req.query.flag == "false") {
                    BiblioValidate.ConvertTOCSL(req).then(function (finalData) {
                        res.send(finalData);
                        return;
                    }).catch(function (error) {
                        var item = {};
                        item["Input"] = req.query.data;
                        item["Citation"] = JSON.stringify(datass.message);
                        item["status"] = "Validatin Failed";
                        item["finalbiblio"] = error;
                        var data = [];
                        data.push(item);
                        var x = { "data": data };
                        res.send(x);
                        return;
                    });;
                    return;
                }
            });
        }
    }).catch(function (error) {
        req.query.flag = "false";
        if (req.query.flag == "false") {
            BiblioValidate.ConvertTOCSL(req).then(function (finalData) {
                res.send(finalData);
                return;
            }).catch(function (error) {
                var item = {};
                item["Input"] = req.query.data;
                item["Citation"] = JSON.stringify(datass.message);
                item["status"] = "Validatin Failed";
                item["finalbiblio"] = error;
                var data = [];
                data.push(item);
                var x = { "data": data };
                res.send(x);
                return;
            });;
            return;
        }
    });
});
router.get('/extract', function (req, res) {
    /*
    please remove the header once u upload this service to the server. These were put inorder to access the service through html page.
    */
    //performs extract search.
    if (req.query.data == "") {
        var item = {}
        item["Input"] = req.query.data;
        item["Citation"] = JSON.stringify("");
        item["finalbiblio"] = "No input supplied to the system";
        var data = [];
        data.push(item);
        var x = { "data": data };
        res.send(x);
        return;
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    BiblioExtract.Extract(req.query.data, req.query.style, req.query.locale, req.query.pre, req.query.post, req.query.type).then(function (data) {
        res.send(data);
    }).catch(function (error) {
        res.send(error);
    });
});
router.listen(3000, function () {
    //console.log('listening on port 3000.\n Please run http://localhost:3000/search?parameters ');
});
/*
fs.writeFile("Output", "", function(err) {
    if (err) {
        return //console.log(err);
    }
});
fs.truncate('Output', 0, function() {});
*/
/** DESCRIPTION ABOUT THE INPUTS TO THE SYSTEM:
 *
 *
 * case 1: user trying to insert a reference using PMID as input
 * case 2: user trying to insert a reference using DOI as input
 * case 3: user trying to insert a reference using reference string
 *
 *
 * sample inputObj:
 *
 *      var inputObj = [{
 *      'data':    'pmid or doi or reference htmlstring or DocumentFileLocation',
 *      'type':    'pmid|doi|html|document',
 *      'request': 'search|validate|Generate'
 *      'style':    "Style name",
 *      'pre':      "String value",
 *      'post':     "String value"
 *       }];
 *
 *
 */
/*
// PMID INPUT OBJECT EXAMPLE:
{
   'data': '<p><span class="RefPMID">11954634</span>.</p>',
      'type': 'pmid',
   'request': 'validate',
   'style': "academy-of-management-review.csl",
   'pre':"sds",
   'post':"sdsds"
}
// DOI INPUT OBJ EXAMPLE:
{
   'data': '<p><span class="RefDOI">10.1126/science.169.3946.635</span>.</p>',
      'type': 'doi',
   'request': 'validate',
   'style': "academy-of-management-review.csl",
   'pre':"sds",
   'post':"sdsds"
}
// HTML STRING INPUT OBJ EXAMPLE:
{
   'data': '<p> <span class="RefAuthor">Suman Das</span>. <span class="RefYear">1999</span>. <span class="RefArticleTitle"></span>. <span class="RefJournalTitle">Materials & Design</span> <span class="RefVolume"></span>.</p>',
  'type': 'html',
   'request': 'validate',
   'style': "academy-of-management-review.csl",
   'pre':"sds",
   'post':"sdsds"
}
// DOCUMENT INPUT OBJ EXAMPLE:
{  
    'data': 'ExtractedFiles/documentmendley2.xml',
   'type': 'document',  
    'request': 'Generate',  
    'style': "academy-of-management-review.csl",  
    'pre':"sds",  
    'post':"sdsds"  
} 
//You can  add multiple input objects here seperated by comma.
example:
var inputObj=[
{
      'data':    'pmid or doi or reference htmlstring or DocumentFileLocation',
      'type':    'pmid|doi|html|document',
      'request': 'search|validate|Generate'
      'style':    "Style name",
      'pre':      "String value",
      'post':     "String value"
      },
      {
      'data':    'pmid or doi or reference htmlstring or DocumentFileLocation',
      'type':    'pmid|doi|html|document',
      'request': 'search|validate|Generate'
      'style':    "Style name",
      'pre':      "String value",
     'post':     "String value"
     }
]
*/
/*
test input:
{
        'data': '<p> <span class="RefAuthor">Agich</span>. <span class="RefYear">2001</span>. <span class="RefArticleTitle"></span>. <span class="RefJournalTitle">American Journal of Bioethics</span> <span class="RefVolume"></span>.</p>',
        'type': 'html',
        'request': 'validate',
        'style': "academy-of-management-review.csl",
        'pre': "sds",
        'post': "sdsds",
    }
*/
var inputs;
var BiblioValidate = {
    tagParseReference: function (datainfo, datass) {
        return new Promise(function (resolve, reject) {
            try {
                //console.log(datass);
            }
            catch (e) {
            }
        });
    }, ConvertTOCSL: function (req) {
        //CONVERTS THE TAGGED INPUT TO DESIRED CSL WITHOUT VALIDATION.
        return new Promise(function (resolve, reject) {
            try {
                var str;
                var promisejson = c2j.convert(req.query.data);
                if (req.query.type == "CSLJSON") {
                    str = "<p> <span class=\"RefAuthor\">J.K. Rowling</span>. <span class=\"RefYear\">2001</span>. <span class=\"RefBookTitle\">Harry Potter and the sorcerer's stone</span>. <span class=\"RefPublisherName\">Bloomsburg Children's</span> <span class=\"RefPublisherLoc\">London</span>.</p>";
                    promisejson = c2j.convert(str);
                }
                promisejson.then(function (value) {
                    if (req.query.type == "CSLJSON") {
                        value = JSON.parse(req.query.data);
                    }
                    if (value["container-title"]) {
                        value["journalAbbreviation"] = value["container-title"];
                    }
                    value["id"] = "Item-1";
                    value["issued"] = { "date-parts": [[value["RefYear"]]] };
                    delete value["RefYear"];
                    var type = req.query.refJournalType;
                    if (type == "Journal") {
                        value["type"] = "article-journal";
                    }
                    if (type == "Book") {
                        value["type"] = "book";
                    }
                    if (type == "Book_Editor") {
                        value["type"] = "book";
                    }
                    if (type == "Thesis") {
                        value["type"] = "thesis";
                    }
                    if (type == "Data") {
                        value["type"] = "dataset";
                    }
                    if (type == "Conference") {
                        value["type"] = "paper-conference";
                    }
                    if (type == "Software") {
                        value["type"] = "entry";
                    }
                    if (type == "Patent") {
                        value["type"] = "patent";
                    }
                    if (type == "Website") {
                        value["type"] = "webpage";
                    }
                    if (type == "Periodical") {
                        value["type"] = "article-journal";
                    }
                    if (type == "Preprint") {
                        value["type"] = "article-journal";
                    }
                    if (type == "Clinicaltrial") {
                        value["type"] = "article-journal";
                    }
                    if (type == "Report") {
                        value["type"] = "report";
                    }
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
                    //console.log(req.query);
                    req.query["locales"] = req.query["locale"];
                    var x = {};
                    x["Item-1"] = value;
                    getFormattedRef.RenderBibliography(x, req.query.style, "3", value, value, value, req.query).then(function (values) {
                        //console.log(values);
                        values["index"] = values["index"].slice(0, -1);
                        values["BibliographyString"] = values["BibliographyString"].replace("1.", "<span class=\"RefSlNo\">" + values["index"] + "</span>.");
                        values["finalbiblio"] = values["BibliographyString"];
                        values["finalbiblio"] = values["finalbiblio"].slice(36, values["finalbiblio"].length);
                        values["finalbiblio"] = values["finalbiblio"].slice(0, -16);
                        var s = req.query.data;
                        var PTagFirst = s.indexOf("<");
                        var PTagEnd = s.indexOf(">");
                        var pTag = s.slice(PTagFirst, PTagEnd + 1);
                        values["finalbiblio"] = pTag + "." + values["finalbiblio"] + "</p>. ";
                        values["finalbiblio"] = values["finalbiblio"].replace(/^<div[^>]*>|<\/div>$/g, '');
                        var i1 = values["finalbiblio"].indexOf("<div");
                        var i2 = values["finalbiblio"].indexOf("inline\">");
                        var s1 = values["finalbiblio"].slice(0, i1);
                        var s2 = values["finalbiblio"].slice(i2 + 8, values["finalbiblio"].length);
                        values["finalbiblio"] = s1 + s2;
                        var data = [];
                        data.push(values);
                        var x = { "data": data };
                        resolve(x);
                        return;
                    }).catch(function (error) {
                        var item = {}
                        item["Input"] = req.query.data;
                        item["Citation"] = JSON.stringify("");
                        item["finalbiblio"] = "Failed";
                        item["errorinfo"] = error;
                        var data = [];
                        data.push(item);
                        var x = { "data": data };
                        resolve(x);
                        return;
                    });
                }).catch(function (error) {
                    var item = {}
                    item["Input"] = req.query.data;
                    item["Citation"] = JSON.stringify("");
                    item["finalbiblio"] = "Unable to convert CSL JSON to required CSL.";
                    var data = [];
                    data.push(item);
                    var x = { "data": data };
                    resolve(x);
                    return;
                });
                return;
            }
            catch (e) {
                return (e);
            }
        }).catch(function (error) {
            return;
        });
    }
    , parseReference: function (datainfo) {
        return new Promise(function (resolve, reject) {
            try {
                if (!datainfo) {
                    resolve({
                        'status': {
                            'code': 500,
                            'message': 'No data found.parse ref failed.'
                        },
                        'message': datainfo
                    });
                    return;
                }
                var header = { "Content-Type": "application/x-www-form-urlencoded" };
                var data = { "format": "html", "data": "<editreference><parse>" + datainfo + "</parse></editreference>", "processType": "parseReference" };
                u.requestData('post', 'http://kriya2.kriyadocs.com/api/process_reference?apiKey=36ab61a9-47e1-4db6-96db-8b95a9923599', header, data).catch(function (error) {
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
                    resolve({
                        'status': {
                            'code': 500,
                            'message': 'Unable to get data. Something went wrong.'
                        },
                        'message': error
                    });
                    return;
                });
            }
            catch (e) {
                return (e);
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    },
    search: function (PmidOrDoi, style, locale, pre, post, type) {
        return new Promise(function (resolve, reject) {
            try {
                if (type == "pmid") {
                    inputs = {
                        'data': '<p><span class="RefPMID">' + PmidOrDoi + '</span></p',
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
                    resolve({
                        'status': {
                            'code': 500,
                            'message': 'Something went wrong while collecting back the promises..'
                        },
                        'message': error
                    });
                    return;
                });
                return;
            }
            catch (e) {
                return (e);
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    },
    validate: function (html, style, locale, pre, post, type, mode) {
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
                    resolve({
                        'status': {
                            'code': 500,
                            'message': 'No data has been found.'
                        },
                        'message': error
                    });
                });
                return;
            }
            catch (e) {
                return (e);
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    }
};
module.exports = BiblioValidate;
var BiblioExtract = {
    Extract: function (datas, style, locale, pre, post, type) {
        return new Promise(function (resolve, reject) {
            try {
                filePath = datas;
                file = path.basename(filePath)
                folderDir = path.dirname(filePath)
                var folderPath = filePath.replace(/\.docx$/gi, '');
                decompress(filePath, folderPath).then(files => {
                    fs.readFile(folderPath + '/word/document.xml', 'utf8', function (err, contents) {
                        var inputs = {
                            'data': contents,
                            'type': 'document',
                            'request': 'extract',
                            'style': style,
                            'locales': locale,
                            'pre': pre,
                            'post': post
                        };
                        var XML = et.XML;
                        var ElementTree = et.ElementTree;
                        var element = et.Element;
                        var subElement = et.SubElement;
                        var data, etree;
                        data = contents;
                        var doc = new DOMParser().parseFromString(data);
                        var k = doc.getElementsByTagName("w:instrText");
                        if (doc.getElementsByTagName("w:instrText") && doc.getElementsByTagName("w:instrText")[0]) {
                            var frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
                            if (frst.startsWith(" ADDIN PAPERS2_CITATIONS") || frst.startsWith("ADDIN PAPERS2_CITATIONS")) {
                                //verified
                                papers2citation(inputs).then(function (data) {
                                    resolve(data);
                                });
                            } else if (frst.startsWith(" ADDIN ZOTERO_ITEM CSL_CITATION") || frst.startsWith("ADDIN ZOTERO_ITEM CSL_CITATION")) {
                                //verified
                                zotero2citation(inputs).then(function (data) {
                                    resolve(data);
                                });
                            } else if (frst.startsWith(" ADDIN CSL_CITATION") || frst.startsWith("ADDIN CSL_CITATION")) {
                                // verified
                                csl2citation(inputs).then(function (data) {
                                    resolve(data);
                                });
                            } else if (frst.startsWith(" ADDIN REFMGR.CITE") || frst.startsWith("ADDIN REFMGR.CITE")) {
                                //veriified
                                REFMGR2citation(inputs).then(function (data) {
                                    resolve(data);
                                });
                            } else if (frst.startsWith(" ADDIN EN.CITE") || frst.startsWith("ADDIN EN.CITE")) {
                                //verified
                                Endnote2Citation(inputs).then(function (data) {
                                    resolve(data);
                                });
                            }
                            else {
                                resolve({
                                    'status': {
                                        'code': 500,
                                        'message': 'Unable to detect the document type.'
                                    },
                                    'message': 'please specify either- zotero | mendeley | refmgr | endnote | papers2citation '
                                });
                                return;
                            }
                        }
                    });
                });
            }
            catch (e) {
                return (e);
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    }
};
module.exports = BiblioExtract;
//BiblioExtract.Extract('ExtractedFiles/zoterofile.docx',"academy-of-management-review.csl","locales-en-US.xml","","","extract");
async function multipleparseref(req) {
    return new Promise(async function (resolve, reject) {
        try {
            BiblioValidate.parseReference(req.query.data).then(function (parsedata) {
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
                    var x = { "data": xs };
                }
                BiblioValidate.validate(parsedata, req.query.style, req.query.locale, req.query.pre, req.query.post, req.query.type, "single").then(function (datass) {
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
                            /*  BiblioValidate.parseReference(datass[k].BibliographyString).then(function (datas) {
                             //console.log(datass[k].BibliographyString);
                             var d=datass[k];
                            //
                                                   if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].DOI)
                                                   {
                                                  datass[k].finalbiblio=datass[k].finalbiblio+'<a href="'+'https://doi.org/'+JSON.parse(d.MatchedJson)["Item-1"].DOI+'">'+'https://doi.org/'+JSON.parse(d.MatchedJson)["Item-1"].DOI+' </a>';
                                                   }
                            if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].PMID)
                           {
                                    datass[k].finalbiblio=datass[k].finalbiblio+'<a href="'+'https://www.ncbi.nlm.nih.gov/pubmed/'+JSON.parse(d.MatchedJson)["Item-1"].PMID+'"> '+'https://www.ncbi.nlm.nih.gov/pubmed/'+JSON.parse(d.MatchedJson)["Item-1"].PMID+'</a>';
                           }
                           */
                            datass[k].Input = req.query.data;
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
                                    datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
                                }
                                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                                    datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
                                }
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
                                datass.Input = req.query.data;
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
                                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
                                    datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
                                }
                                if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                                    datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
                                }
                                datass["parseref"] = parsedata;
                                if (datass.ObtainedDataSource == "Crossref") {
                                    datass.finalbiblio = parsedata;
                                }
                                var data = datass;
                                var data = [];
                                datass.Input = req.query.data;
                                data.push(datass);
                                if (datass.finalbiblio == undefined) {
                                    datass.finalbiblio = datass.message;
                                }
                                var x = { "data": data };
                                resolve(x);
                                return;
                            });
                            /*
                                   BiblioValidate.parseReference(datass.BibliographyString).then(function (datas) {
                                            datass.finalbiblio = datas;
                                            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {
                                                datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + '">' + 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI + ' </a>';
                                            }
                                            if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
                                                datass.finalbiblio = datass.finalbiblio + '<a href="' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '"> ' + 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID + '</a>';
                                            }
                                            datass.Input = req.query.data;
                                            datass["parseref"] = parsedata;
                                            var data=datass;
                                            var data=[];
                                            data.push(datass);
                                            var x = { "data": data };
                                            if(datass && datass.finalbiblio && datass.finalbiblio!=undefined &&  datass.Citation!=undefined)
                                            {
                                                            res.send(x);
                                            }else
                                            {
                                                var item = {}
                                                item ["Input"] = req.query.data;
                                                item["Citation"]=JSON.stringify(datas);
                                            item["finalbiblio"]=fullparsedata;
                                            var data=[];
                                            data.push(item);
                                            var x = { "data": data };
                                            res.send(x);
                                            }
                                        }).catch(function (error) {
                                            var item = {}
                                            item ["Input"] = req.query.data;
                                            item["Citation"]=JSON.stringify(error);
                                        item["finalbiblio"]=fullparsedata;
                                        var data=[];
                                        data.push(item);
                                        var x = { "data": data };
                                        res.send(x);
                                        });
                                        */
                        }
                        else {
                            var item = {}
                            item["Input"] = req.query.data;
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
                    item["Input"] = req.query.data;
                    item["Citation"] = JSON.stringify(error);
                    item["finalbiblio"] = fullparsedata;
                    var data = [];
                    data.push(item);
                    var x = { "data": data };
                    resolve(x);
                });
            }).catch(function (error) {
                var item = {}
                item["Input"] = req.query.data;
                item["Citation"] = JSON.stringify(error);
                item["finalbiblio"] = error;
                var data = [];
                data.push(item);
                var x = { "data": data };
                resolve(x);
                return;
            });
        }
        catch (e) {
        }
    });
}
function zotero2citation(input) {
    return new Promise(function (resolve, reject) {
        try {
            /**
             * Purpose: This function is called when document has zotero reference.
             *
             * Functionality:
             * Gets the input docx object location and parses the document.xml file by detecting the each zotero type references under w:instrxt Tag and then sends
             * the references to CslJSON_to_Biblio module in BiblioExtract 2.0
             *
             * Example reference inside document.xml for zotero:
             * <w:instrText xml:space="preserve"> ADDIN ZOTERO_ITEM CSL_CITATION {"citationID":"2ara1bjank","properties":{"formattedCitation":"(1)","plainCitation":"(1)"},"citationItems":[{"id":218,"uris":["http://zotero.org/users/local/sk3Vw0aK/items/EZ8NVJ38"],"uri":["http://zotero.org/users/local/sk3Vw0aK/items/EZ8NVJ38"],"itemData":{"id":218,"type":"article-journal","title":"Gene expression patterns of breast carcinomas distinguish tumor subclasses with clinical implications","container-title":"Proceedings of the National Academy of Sciences","page":"10869-10874","volume":"98","issue":"19","source":"www.pnas.org","abstract":"The purpose of this study was to classify breast carcinomas based on variations in gene expression patterns derived from cDNA microarrays and to correlate tumor characteristics to clinical outcome. A total of 85 cDNA microarray experiments representing 78 cancers, three fibroadenomas, and four normal breast tissues were analyzed by hierarchical clustering. As reported previously, the cancers could be classified into a basal epithelial-like group, an ERBB2-overexpressing group and a normal breast-like group based on variations in gene expression. A novel finding was that the previously characterized luminal epithelial/estrogen receptor-positive group could be divided into at least two subgroups, each with a distinctive expression profile. These subtypes proved to be reasonably robust by clustering using two different gene sets: first, a set of 456 cDNA clones previously selected to reflect intrinsic properties of the tumors and, second, a gene set that highly correlated with patient outcome. Survival analyses on a subcohort of patients with locally advanced breast cancer uniformly treated in a prospective study showed significantly different outcomes for the patients belonging to the various groups, including a poor prognosis for the basal-like subtype and a significant difference in outcome for the two estrogen receptor-positive groups.","DOI":"10.1073/pnas.191367098","ISSN":"0027-8424, 1091-6490","note":"PMID: 11553815","journalAbbreviation":"PNAS","language":"en","author":[{"family":"Sørlie","given":"Therese"},{"family":"Perou","given":"Charles M."},{"family":"Tibshirani","given":"Robert"},{"family":"Aas","given":"Turid"},{"family":"Geisler","given":"Stephanie"},{"family":"Johnsen","given":"Hilde"},{"family":"Hastie","given":"Trevor"},{"family":"Eisen","given":"Michael B."},{"family":"Rijn","given":"Matt","dropping-particle":"van de"},{"family":"Jeffrey","given":"Stefanie S."},{"family":"Thorsen","given":"Thor"},{"family":"Quist","given":"Hanne"},{"family":"Matese","given":"John C."},{"family":"Brown","given":"Patrick O."},{"family":"Botstein","given":"David"},{"family":"Lønning","given":"Per Eystein"},{"family":"Børresen-Dale","given":"Anne-Lise"}],"issued":{"date-parts":[["2001",9,11]]}}}],"schema":"https://github.com/citation-style-language/schema/raw/master/csl-citation.json"} </w:instrText>
             *
             *
             * Note: Zotero references are in the form of the CSL JSON which can be directly fed to citeproc.js.
             *
             */
            var promisesobject = [];
            var doc = new DOMParser().parseFromString(input.data);
            var k = doc.getElementsByTagName("w:instrText");
            var frst = '',
                second = '';
            frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
            for (var i = 1; i < k.length; i++) {
                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                //x=data;
                if (second.startsWith(" ADDIN ZOTERO_ITEM CSL_CITATION") || second.startsWith("ADDIN ZOTERO_ITEM CSL_CITATION")) {
                    frst = frst.substr(32);
                    if (frst[frst.length - 2].toLowerCase() == 'y') {
                        frst = frst.slice(0, -50);
                    }
                    promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, input));
                    frst = second;
                } else {
                    frst = frst + second;
                }
            }
            frst = frst.substr(32);
            promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, input));
            Q.allSettled(promisesobject).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });
        }
        catch (e) {
            return (e);
        }
    }).catch(function (error) {
        resolve({
            'status': {
                'code': 500,
                'message': 'Unable to get data. Something went wrong.'
            },
            'message': error
        });
        return;
    });
}
function Endnote2Citation(input) {
    /*
      for (var i = 0; i < k.length; i++) {
                    var str = (decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString()));
                    var n = str.indexOf("<EndNote>");
                    if (n == -1) {
                    } else {
                      //console.log(str.slice(n,str.length));
                    }
                }
    */
    return new Promise(function (resolve, reject) {
        try {
            var promisesobject = [];
            var doc = new DOMParser().parseFromString(input.data);
            var k = doc.getElementsByTagName("w:instrText");
            fs.truncate('Output', 0, function () { });
            var frst = '',
                second = '';
            frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
            for (var i = 1; i < k.length; i++) {
                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                // //console.log(second);
                //x=data;
                if (second.startsWith(" ADDIN EN.CITE") || second.startsWith("ADDIN EN.CITE")) {
                    frst = frst.substr(15);
                    if (frst[0] == '<' && frst[frst.length - 1] == '>') {
                        promisesobject.push(biblioextract.endnote_to_CslJSON(frst, input));
                    }
                    frst = second;
                } else {
                    frst = frst + second;
                }
            }
            frst = frst.slice(15, 15);
            if (frst[0] == '<' && frst[frst.length - 1] == '>') {
                promisesobject.push(biblioextract.endnote_to_CslJSON(frst, input));
            }
            Q.allSettled(promisesobject).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });
        }
        catch (e) {
            resolve(e);
        }
    }).catch(function (error) {
        resolve({
            'status': {
                'code': 500,
                'message': 'Unable to get data. Something went wrong.'
            },
            'message': error
        });
        return;
    });
}
function truecaser(input, kss) {
    return new Promise(function (resolve, reject) {
        try {
            var head = { "Content-Type": "application/json" };
            var us = require('./urest.js');
            us.requestData('post', 'http://truecase.kriyadocs.com/gettruecase', head, { 'sentence': input }).catch(function (error) {
                ////console.log("error");
                resolve(error);
                return;
            }).then(function (data) {
                if (data && data.status && data.status == 200 && data.message && data.message.sentence) {
                    var data = { "index": kss, "value": JSON.stringify(data.message.sentence) };
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
function REFMGR2citation(input) {
    return new Promise(function (resolve, reject) {
        try {
            /**
             * Purpose: This function is called when document has Ref Manager references.
             *
             * Functionality:
             * Gets the input docx object location and parses the document.xml file by detecting the each RefMgr type references under w:instrxt Tag and then sends
             * the references to refman_to_CslJSON() function in BiblioExtract 2.0
             *
             * Example reference inside document.xml for refmgr:
             * <w:instrText xml:space="preserve"> ADDIN REFMGR.CITE &lt;Refman&gt;&lt;Cite&gt;&lt;Author&gt;Cortes&lt;/Author&gt;&lt;Year&gt;2007&lt;/Year&gt;&lt;RecNum&gt;2259&lt;/RecNum&gt;&lt;IDText&gt;Epigenetic silencing of Plasmodium falciparum genes linked to erythrocyte invasion&lt;/IDText&gt;&lt;MDL Ref_Type="Journal"&gt;&lt;Ref_Type&gt;Journal&lt;/Ref_Type&gt;&lt;Ref_ID&gt;2259&lt;/Ref_ID&gt;&lt;Title_Primary&gt;Epigenetic silencing of Plasmodium falciparum genes linked to erythrocyte invasion&lt;/Title_Primary&gt;&lt;Authors_Primary&gt;Cortes,A.&lt;/Authors_Primary&gt;&lt;Authors_Primary&gt;Carret,C.&lt;/Authors_Primary&gt;&lt;Authors_Primary&gt;Kaneko,O.&lt;/Authors_Primary&gt;&lt;Authors_Primary&gt;Yim Lim,B.Y.&lt;/Authors_Primary&gt;&lt;Authors_Primary&gt;Ivens,A.&lt;/Authors_Primary&gt;&lt;Authors_Primary&gt;Holder,A.A.&lt;/Authors_Primary&gt;&lt;Date_Primary&gt;2007/8/3&lt;/Date_Primary&gt;&lt;Keywords&gt;Amino Acid Sequence&lt;/Keywords&gt;&lt;Keywords&gt;animals&lt;/Keywords&gt;&lt;Keywords&gt;Carrier Proteins&lt;/Keywords&gt;&lt;Keywords&gt;Clone Cells&lt;/Keywords&gt;&lt;Keywords&gt;Dna&lt;/Keywords&gt;&lt;Keywords&gt;Epigenesis,Genetic&lt;/Keywords&gt;&lt;Keywords&gt;Erythrocytes&lt;/Keywords&gt;&lt;Keywords&gt;Gene Silencing&lt;/Keywords&gt;&lt;Keywords&gt;Genes&lt;/Keywords&gt;&lt;Keywords&gt;genetics&lt;/Keywords&gt;&lt;Keywords&gt;Host-Parasite Interactions&lt;/Keywords&gt;&lt;Keywords&gt;Human&lt;/Keywords&gt;&lt;Keywords&gt;Humans&lt;/Keywords&gt;&lt;Keywords&gt;Ligands&lt;/Keywords&gt;&lt;Keywords&gt;Merozoites&lt;/Keywords&gt;&lt;Keywords&gt;Molecular Sequence Data&lt;/Keywords&gt;&lt;Keywords&gt;Multigene Family&lt;/Keywords&gt;&lt;Keywords&gt;Oligonucleotide Array Sequence Analysis&lt;/Keywords&gt;&lt;Keywords&gt;parasitology&lt;/Keywords&gt;&lt;Keywords&gt;pathogenicity&lt;/Keywords&gt;&lt;Keywords&gt;Plasmodium&lt;/Keywords&gt;&lt;Keywords&gt;Plasmodium falciparum&lt;/Keywords&gt;&lt;Keywords&gt;Proteins&lt;/Keywords&gt;&lt;Keywords&gt;Protozoan Proteins&lt;/Keywords&gt;&lt;Keywords&gt;Research&lt;/Keywords&gt;&lt;Reprint&gt;Not in File&lt;/Reprint&gt;&lt;Start_Page&gt;e107&lt;/Start_Page&gt;&lt;Periodical&gt;PLoS.Pathog.&lt;/Periodical&gt;&lt;Volume&gt;3&lt;/Volume&gt;&lt;Issue&gt;8&lt;/Issue&gt;&lt;User_Def_1&gt;clag&lt;/User_Def_1&gt;&lt;Web_URL&gt;17676953&lt;/Web_URL&gt;&lt;ZZ_JournalStdAbbrev&gt;&lt;f name="System"&gt;PLoS.Pathog.&lt;/f&gt;&lt;/ZZ_JournalStdAbbrev&gt;&lt;ZZ_WorkformID&gt;1&lt;/ZZ_WorkformID&gt;&lt;/MDL&gt;&lt;/Cite&gt;&lt;/Refman&gt;</w:instrText>
             *
             * Note: RefMgr references are in the form of the XML tags which is mapped to CSL JSON by calling refman_to_CslJSON() in BiblioExtract.js .
             *
             */
            var doc = new DOMParser().parseFromString(input.data);
            var k = doc.getElementsByTagName("w:instrText");
            var promisesobject = [];
            var frst = '',
                second = '';
            frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
            for (var i = 1; i < k.length; i++) {
                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                //x=data;
                if (second.startsWith(" ADDIN REFMGR.CITE") || second.startsWith("ADDIN REFMGR.CITE") || second.startsWith("ADDIN EN.CITE.DATA") || second.startsWith(" ADDIN EN.CITE.DATA") || second.startsWith("  ADDIN EN.CITE.DATA")) {
                    frst = frst.substr(18);
                    if (frst[1] == '<') {
                        promisesobject.push(biblioextract.refman_to_CslJSON(frst, input));
                    }
                    frst = second;
                } else {
                    frst = frst + second;
                }
            }
            frst = frst.substr(18);
            if (frst[1] == '<') {
                promisesobject.push(biblioextract.refman_to_CslJSON(frst, input));
            }
            Q.allSettled(promisesobject).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });
        }
        catch (e) {
            return (e);
        }
    }).catch(function (error) {
        resolve({
            'status': {
                'code': 500,
                'message': 'Unable to get data. Something went wrong.'
            },
            'message': error
        });
        return;
    });
}
function csl2citation(input) {
    return new Promise(function (resolve, reject) {
        try {
            /**
             * Purpose: This function is called when document has Mendley references.
             *
             * Functionality:
             * Gets the input docx object location and parses the document.xml file by detecting the each Mendley type references under w:instrxt Tag and then sends
             * the references to CslJSON_to_Biblio() function in BiblioExtract 2.0
             *
             * Example reference inside document.xml for mendley:
             * <w:instrText>ADDIN CSL_CITATION {"mendeley": {"previouslyFormattedCitation": "(Stocker, 1994)"}, "citationItems": [{"uris": ["http://www.mendeley.com/documents/?uuid=b1d516a7-9f88-49f6-ba91-fe30ce078b25"], "id": "ITEM-1", "itemData": {"title": "The organization of the chemosensory system in Drosophila melanogaster : a review", "issued": {"date-parts": [["1994"]]}, "author": [{"given": "RF", "dropping-particle": "", "suffix": "", "family": "Stocker", "parse-names": false, "non-dropping-particle": ""}], "page": "3-26", "volume": "275", "container-title": "Cell and Tissue Research", "type": "article-journal", "id": "ITEM-1"}}], "properties": {"noteIndex": 0}, "schema": "https://github.com/citation-style-language/schema/raw/master/csl-citation.json"}</w:instrText>
             *
             * Note: Mendeley references are in the form of the CSL JSON .
             *
             */
            var promisesobject = [];
            var doc = new DOMParser().parseFromString(input.data);
            var k = doc.getElementsByTagName("w:instrText");
            var frst = '',
                second = '';
            frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
            for (var i = 1; i < k.length; i++) {
                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                //x=data;
                if (second.startsWith(" ADDIN CSL_CITATION") || second.startsWith("ADDIN CSL_CITATION")) {
                    frst = frst.substr(18);
                    promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, input));
                    frst = second;
                } else {
                    frst = frst + second;
                }
            }
            frst = frst.substr(18);
            frst = frst.slice(0, -44);
            if (frst.length == '}') {
                promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, input));
            }
            else {
                frst = frst.slice(0, -1);
                promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, input));
            }
            Q.allSettled(promisesobject).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });
        }
        catch (e) {
            return (e);
        }
    }).catch(function (error) {
        resolve({
            'status': {
                'code': 500,
                'message': 'Unable to get data. Something went wrong.'
            },
            'message': error
        });
        return;
    });
}
function papers2citation(input) {
    /**
     * Purpose: This function is called when document has papers2citation references.
     *
     * Functionality:
     * Gets the input docx object location and parses the papers2citation.xml file by detecting the each papers2citation type references under w:instrxt Tag and then sends
     * the references to CslJSON_to_Biblio() function in BiblioExtract 2.0
     *
     * Example reference inside document.xml for papers2citation:
     * <w:instrText xml:space="preserve"> ADDIN PAPERS2_CITATIONS &lt;citation&gt;&lt;uuid&gt;9E5D09AC-87A2-44BB-84D4-751C35D65D91&lt;/uuid&gt;&lt;priority&gt;0&lt;/priority&gt;&lt;publications&gt;&lt;publication&gt;&lt;type&gt;400&lt;/type&gt;&lt;publication_date&gt;99199100001200000000200000&lt;/publication_date&gt;&lt;title&gt;FtsZ ring structure associated with division in Escherichia coli&lt;/title&gt;&lt;url&gt;https://www.researchgate.net/profile/Erfei_Bi/publication/21210591_Bi_E_Lutkenhaus_J_FtsZ_ring_structure_associated_with_division_in_Escherichia_coli_Nature_354_161-164/links/550c6da40cf212874161025d.pdf&lt;/url&gt;&lt;subtype&gt;400&lt;/subtype&gt;&lt;uuid&gt;DD2C1E95-990A-4DF1-8A42-191160AB8025&lt;/uuid&gt;&lt;bundle&gt;&lt;publication&gt;&lt;publisher&gt;Nature Publishing Group&lt;/publisher&gt;&lt;title&gt;Nature&lt;/title&gt;&lt;type&gt;-100&lt;/type&gt;&lt;subtype&gt;-100&lt;/subtype&gt;&lt;uuid&gt;3FDD3344-D33E-43AA-868C-CD108AAEA70C&lt;/uuid&gt;&lt;/publication&gt;&lt;/bundle&gt;&lt;authors&gt;&lt;author&gt;&lt;firstName&gt;E&lt;/firstName&gt;&lt;lastName&gt;Bi&lt;/lastName&gt;&lt;/author&gt;&lt;author&gt;&lt;firstName&gt;J&lt;/firstName&gt;&lt;lastName&gt;Lutkenhaus&lt;/lastName&gt;&lt;/author&gt;&lt;/authors&gt;&lt;/publication&gt;&lt;/publications&gt;&lt;cites&gt;&lt;/cites&gt;&lt;/citation&gt;</w:instrText>
     *
     * Note: PAPERS2_CITATIONS references are in the form of the xml tags which is mapped to csljson .
     *
     */
    return new Promise(function (resolve, reject) {
        var promisesobject = [];
        try {
            var doc = new DOMParser().parseFromString(input.data);
            var k = doc.getElementsByTagName("w:instrText");
            var frst = '',
                second = '';
            frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
            for (var i = 1; i < k.length; i++) {
                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                //x=data;
                if (second.startsWith(" ADDIN PAPERS2_CITATIONS") || second.startsWith("ADDIN PAPERS2_CITATIONS")) {
                    var frst = frst.substr(24);
                    ////console.log(frst,"\n\n\n");
                    promisesobject.push(biblioextract.papers2citations_to_CslJSON(frst, input));
                    frst = second;
                } else {
                    frst = frst + second;
                }
            }
            var frst = frst.substr(24);
            promisesobject.push(biblioextract.papers2citations_to_CslJSON(frst, input));
            Q.allSettled(promisesobject).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            });
        }
        catch (e) {
            return (e);
        }
    }).catch(function (error) {
        resolve({
            'status': {
                'code': 500,
                'message': 'Unable to get data. Something went wrong.'
            },
            'message': error
        });
        return;
    });
}
function normalize_special_characters(str) {
    var x = '';
    var unwanted_array = {
        '&': 'and',
        'Ĳ': 'I',
        'Ö': 'O',
        'Œ': 'O',
        'Ü': 'U',
        'ä': 'a',
        'æ': 'a',
        'ĳ': 'i',
        'ö': 'o',
        'œ': 'o',
        'ü': 'u',
        'ß': 's',
        'ſ': 's',
        'À': 'A',
        'Á': 'A',
        'Â': 'A',
        'Ã': 'A',
        'Ä': 'A',
        'Å': 'A',
        'Æ': 'A',
        'Ā': 'A',
        'Ą': 'A',
        'Ă': 'A',
        'Ç': 'C',
        'Ć': 'C',
        'Č': 'C',
        'Ĉ': 'C',
        'Ċ': 'C',
        'Ď': 'D',
        'Đ': 'D',
        'È': 'E',
        'É': 'E',
        'Ê': 'E',
        'Ë': 'E',
        'Ē': 'E',
        'Ę': 'E',
        'Ě': 'E',
        'Ĕ': 'E',
        'Ė': 'E',
        'Ĝ': 'G',
        'Ğ': 'G',
        'Ġ': 'G',
        'Ģ': 'G',
        'Ĥ': 'H',
        'Ħ': 'H',
        'Ì': 'I',
        'Í': 'I',
        'Î': 'I',
        'Ï': 'I',
        'Ī': 'I',
        'Ĩ': 'I',
        'Ĭ': 'I',
        'Į': 'I',
        'İ': 'I',
        'Ĵ': 'J',
        'Ķ': 'K',
        'Ľ': 'K',
        'Ĺ': 'K',
        'Ļ': 'K',
        'Ŀ': 'K',
        'Ł': 'L',
        'Ñ': 'N',
        'Ń': 'N',
        'Ň': 'N',
        'Ņ': 'N',
        'Ŋ': 'N',
        'Ò': 'O',
        'Ó': 'O',
        'Ô': 'O',
        'Õ': 'O',
        'Ø': 'O',
        'Ō': 'O',
        'Ő': 'O',
        'Ŏ': 'O',
        'Ŕ': 'R',
        'Ř': 'R',
        'Ŗ': 'R',
        'Ś': 'S',
        'Ş': 'S',
        'Ŝ': 'S',
        'Ș': 'S',
        'Š': 'S',
        'Ť': 'T',
        'Ţ': 'T',
        'Ŧ': 'T',
        'Ț': 'T',
        'Ù': 'U',
        'Ú': 'U',
        'Û': 'U',
        'Ū': 'U',
        'Ů': 'U',
        'Ű': 'U',
        'Ŭ': 'U',
        'Ũ': 'U',
        'Ų': 'U',
        'Ŵ': 'W',
        'Ŷ': 'Y',
        'Ÿ': 'Y',
        'Ý': 'Y',
        'Ź': 'Z',
        'Ż': 'Z',
        'Ž': 'Z',
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ā': 'a',
        'ą': 'a',
        'ă': 'a',
        'å': 'a',
        'ç': 'c',
        'ć': 'c',
        'č': 'c',
        'ĉ': 'c',
        'ċ': 'c',
        'ď': 'd',
        'đ': 'd',
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e',
        'ē': 'e',
        'ę': 'e',
        'ě': 'e',
        'ĕ': 'e',
        'ė': 'e',
        'ƒ': 'f',
        'ĝ': 'g',
        'ğ': 'g',
        'ġ': 'g',
        'ģ': 'g',
        'ĥ': 'h',
        'ħ': 'h',
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i',
        'ī': 'i',
        'ĩ': 'i',
        'ĭ': 'i',
        'į': 'i',
        'ı': 'i',
        'ĵ': 'j',
        'ķ': 'k',
        'ĸ': 'k',
        'ł': 'l',
        'ľ': 'l',
        'ĺ': 'l',
        'ļ': 'l',
        'ŀ': 'l',
        'ñ': 'n',
        'ń': 'n',
        'ň': 'n',
        'ņ': 'n',
        'ŉ': 'n',
        'ŋ': 'n',
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ø': 'o',
        'ō': 'o',
        'ő': 'o',
        'ŏ': 'o',
        'ŕ': 'r',
        'ř': 'r',
        'ŗ': 'r',
        'ś': 's',
        'š': 's',
        'ť': 't',
        'ù': 'u',
        'ú': 'u',
        'û': 'u',
        'ū': 'u',
        'ů': 'u',
        'ű': 'u',
        'ŭ': 'u',
        'ũ': 'u',
        'ų': 'u',
        'ŵ': 'w',
        'ÿ': 'y',
        'ý': 'y',
        'ŷ': 'y',
        'ż': 'z',
        'ź': 'z',
        'ž': 'z',
        'Α': 'A',
        'Ά': 'A',
        'Ἀ': 'A',
        'Ἁ': 'A',
        'Ἂ': 'A',
        'Ἃ': 'A',
        'Ἄ': 'A',
        'Ἅ': 'A',
        'Ἆ': 'A',
        'Ἇ': 'A',
        'ᾈ': 'A',
        'ᾉ': 'A',
        'ᾊ': 'A',
        'ᾋ': 'A',
        'ᾌ': 'A',
        'ᾍ': 'A',
        'ᾎ': 'A',
        'ᾏ': 'A',
        'Ᾰ': 'A',
        'Ᾱ': 'A',
        'Ὰ': 'A',
        'ᾼ': 'A',
        'Β': 'B',
        'Γ': 'G',
        'Δ': 'D',
        'Ε': 'E',
        'Έ': 'E',
        'Ἐ': 'E',
        'Ἑ': 'E',
        'Ἒ': 'E',
        'Ἓ': 'E',
        'Ἔ': 'E',
        'Ἕ': 'E',
        'Ὲ': 'E',
        'Ζ': 'Z',
        'Η': 'I',
        'Ή': 'I',
        'Ἠ': 'I',
        'Ἡ': 'I',
        'Ἢ': 'I',
        'Ἣ': 'I',
        'Ἤ': 'I',
        'Ἥ': 'I',
        'Ἦ': 'I',
        'Ἧ': 'I',
        'ᾘ': 'I',
        'ᾙ': 'I',
        'ᾚ': 'I',
        'ᾛ': 'I',
        'ᾜ': 'I',
        'ᾝ': 'I',
        'ᾞ': 'I',
        'ᾟ': 'I',
        'Ὴ': 'I',
        'ῌ': 'I',
        'Θ': 'T',
        'Ι': 'I',
        'Ί': 'I',
        'Ϊ': 'I',
        'Ἰ': 'I',
        'Ἱ': 'I',
        'Ἲ': 'I',
        'Ἳ': 'I',
        'Ἴ': 'I',
        'Ἵ': 'I',
        'Ἶ': 'I',
        'Ἷ': 'I',
        'Ῐ': 'I',
        'Ῑ': 'I',
        'Ὶ': 'I',
        'Κ': 'K',
        'Λ': 'L',
        'Μ': 'M',
        'Ν': 'N',
        'Ξ': 'K',
        'Ο': 'O',
        'Ό': 'O',
        'Ὀ': 'O',
        'Ὁ': 'O',
        'Ὂ': 'O',
        'Ὃ': 'O',
        'Ὄ': 'O',
        'Ὅ': 'O',
        'Ὸ': 'O',
        'Π': 'P',
        'Ρ': 'R',
        'Ῥ': 'R',
        'Σ': 'S',
        'Τ': 'T',
        'Υ': 'Y',
        'Ύ': 'Y',
        'Ϋ': 'Y',
        'Ὑ': 'Y',
        'Ὓ': 'Y',
        'Ὕ': 'Y',
        'Ὗ': 'Y',
        'Ῠ': 'Y',
        'Ῡ': 'Y',
        'Ὺ': 'Y',
        'Φ': 'F',
        'Χ': 'X',
        'Ψ': 'P',
        'Ω': 'O',
        'Ώ': 'O',
        'Ὠ': 'O',
        'Ὡ': 'O',
        'Ὢ': 'O',
        'Ὣ': 'O',
        'Ὤ': 'O',
        'Ὥ': 'O',
        'Ὦ': 'O',
        'Ὧ': 'O',
        'ᾨ': 'O',
        'ᾩ': 'O',
        'ᾪ': 'O',
        'ᾫ': 'O',
        'ᾬ': 'O',
        'ᾭ': 'O',
        'ᾮ': 'O',
        'ᾯ': 'O',
        'Ὼ': 'O',
        'ῼ': 'O',
        'α': 'a',
        'ά': 'a',
        'ἀ': 'a',
        'ἁ': 'a',
        'ἂ': 'a',
        'ἃ': 'a',
        'ἄ': 'a',
        'ἅ': 'a',
        'ἆ': 'a',
        'ἇ': 'a',
        'ᾀ': 'a',
        'ᾁ': 'a',
        'ᾂ': 'a',
        'ᾃ': 'a',
        'ᾄ': 'a',
        'ᾅ': 'a',
        'ᾆ': 'a',
        'ᾇ': 'a',
        'ὰ': 'a',
        'ᾰ': 'a',
        'ᾱ': 'a',
        'ᾲ': 'a',
        'ᾳ': 'a',
        'ᾴ': 'a',
        'ᾶ': 'a',
        'ᾷ': 'a',
        'β': 'b',
        'γ': 'g',
        'δ': 'd',
        'ε': 'e',
        'έ': 'e',
        'ἐ': 'e',
        'ἑ': 'e',
        'ἒ': 'e',
        'ἓ': 'e',
        'ἔ': 'e',
        'ἕ': 'e',
        'ὲ': 'e',
        'ζ': 'z',
        'η': 'i',
        'ή': 'i',
        'ἠ': 'i',
        'ἡ': 'i',
        'ἢ': 'i',
        'ἣ': 'i',
        'ἤ': 'i',
        'ἥ': 'i',
        'ἦ': 'i',
        'ἧ': 'i',
        'ᾐ': 'i',
        'ᾑ': 'i',
        'ᾒ': 'i',
        'ᾓ': 'i',
        'ᾔ': 'i',
        'ᾕ': 'i',
        'ᾖ': 'i',
        'ᾗ': 'i',
        'ὴ': 'i',
        'ῂ': 'i',
        'ῃ': 'i',
        'ῄ': 'i',
        'ῆ': 'i',
        'ῇ': 'i',
        'θ': 't',
        'ι': 'i',
        'ί': 'i',
        'ϊ': 'i',
        'ΐ': 'i',
        'ἰ': 'i',
        'ἱ': 'i',
        'ἲ': 'i',
        'ἳ': 'i',
        'ἴ': 'i',
        'ἵ': 'i',
        'ἶ': 'i',
        'ἷ': 'i',
        'ὶ': 'i',
        'ῐ': 'i',
        'ῑ': 'i',
        'ῒ': 'i',
        'ῖ': 'i',
        'ῗ': 'i',
        'κ': 'k',
        'λ': 'l',
        'μ': 'm',
        'ν': 'n',
        'ξ': 'k',
        'ο': 'o',
        'ό': 'o',
        'ὀ': 'o',
        'ὁ': 'o',
        'ὂ': 'o',
        'ὃ': 'o',
        'ὄ': 'o',
        'ὅ': 'o',
        'ὸ': 'o',
        'π': 'p',
        'ρ': 'r',
        'ῤ': 'r',
        'ῥ': 'r',
        'σ': 's',
        'ς': 's',
        'τ': 't',
        'υ': 'y',
        'ύ': 'y',
        'ϋ': 'y',
        'ΰ': 'y',
        'ὐ': 'y',
        'ὑ': 'y',
        'ὒ': 'y',
        'ὓ': 'y',
        'ὔ': 'y',
        'ὕ': 'y',
        'ὖ': 'y',
        'ὗ': 'y',
        'ὺ': 'y',
        'ῠ': 'y',
        'ῡ': 'y',
        'ῢ': 'y',
        'ῦ': 'y',
        'ῧ': 'y',
        'φ': 'f',
        'χ': 'x',
        'ψ': 'p',
        'ω': 'o',
        'ώ': 'o',
        'ὠ': 'o',
        'ὡ': 'o',
        'ὢ': 'o',
        'ὣ': 'o',
        'ὤ': 'o',
        'ὥ': 'o',
        'ὦ': 'o',
        'ὧ': 'o',
        'ᾠ': 'o',
        'ᾡ': 'o',
        'ᾢ': 'o',
        'ᾣ': 'o',
        'ᾤ': 'o',
        'ᾥ': 'o',
        'ᾦ': 'o',
        'ᾧ': 'o',
        'ὼ': 'o',
        'ῲ': 'o',
        'ῳ': 'o',
        'ῴ': 'o',
        'ῶ': 'o',
        'ῷ': 'o',
        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ё': 'E',
        'Ж': 'Z',
        'З': 'Z',
        'И': 'I',
        'Й': 'I',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Х': 'K',
        'Ц': 'T',
        'Ч': 'C',
        'Ш': 'S',
        'Щ': 'S',
        'Ы': 'Y',
        'Э': 'E',
        'Ю': 'Y',
        'Я': 'Y',
        'а': 'A',
        'б': 'B',
        'в': 'V',
        'г': 'G',
        'д': 'D',
        'е': 'E',
        'ё': 'E',
        'ж': 'Z',
        'з': 'Z',
        'и': 'I',
        'й': 'I',
        'к': 'K',
        'л': 'L',
        'м': 'M',
        'н': 'N',
        'о': 'O',
        'п': 'P',
        'р': 'R',
        'с': 'S',
        'т': 'T',
        'у': 'U',
        'ф': 'F',
        'х': 'K',
        'ц': 'T',
        'ч': 'C',
        'ш': 'S',
        'щ': 'S',
        'ы': 'Y',
        'э': 'E',
        'ю': 'Y',
        'я': 'Y',
        'ð': 'd',
        'Ð': 'D',
        'þ': 't',
        'Þ': 'T',
        'ა': 'a',
        'ბ': 'b',
        'გ': 'g',
        'დ': 'd',
        'ე': 'e',
        'ვ': 'v',
        'ზ': 'z',
        'თ': 't',
        'ი': 'i',
        'კ': 'k',
        'ლ': 'l',
        'მ': 'm',
        'ნ': 'n',
        'ო': 'o',
        'პ': 'p',
        'ჟ': 'z',
        'რ': 'r',
        'ს': 's',
        'ტ': 't',
        'უ': 'u',
        'ფ': 'p',
        'ქ': 'k',
        'ღ': 'g',
        'ყ': 'q',
        'შ': 's',
        'ჩ': 'c',
        'ც': 't',
        'ძ': 'd',
        'წ': 't',
        'ჭ': 'c',
        'ხ': 'k',
        'ჯ': 'j',
        'ჰ': 'h'
    };
    for (var i = 0; i < str.length; i++) {
        if (unwanted_array[str[i]]) {
            var k = unwanted_array[str[i]];
            x = x + k;
        } else {
            x = x + str[i];
        }
    }
    return x;
}