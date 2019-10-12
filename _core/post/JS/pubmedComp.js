/**
 * https://www.ncbi.nlm.nih.gov/home/develop/api/
 * https://www.ncbi.nlm.nih.gov/pmc/tools/developers/
 * https://www.ncbi.nlm.nih.gov/CBBresearch/Lu/Demo/tmTools/RESTfulAPIs.html
 * https://www.ncbi.nlm.nih.gov/pmc/tools/get-metadata/
 * https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=3539452&retmode=json&tool=my_tool&email=my_email@example.com
 * https://www.ncbi.nlm.nih.gov/pmc/tools/id-converter-api/
 * https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=my_tool&email=my_email@example.com&ids=10.1073/pnas.170144197
 * https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=my_tool&email=my_email@example.com&ids=PMC3531190,PMC3245039
 * https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=my_tool&email=my_email@example.com&ids=PMC3531190,PMC3245039,PMC27850&versions=no&showaiid=yes
 *
 * API key - username - pari@exeterpremedia.com - 7777b808a293ce668f679051df383de2e208
 * https://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ECitMatch
 *
 * https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=kriya&email=pari@exeterpremedia.com&ids=PMC3531190,PMC3245039&versions=no&format=json
 */
/**
 * elife article
 * https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5839742/
 * https://www.ncbi.nlm.nih.gov/pubmed/29461205
 *
 * https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?idtype=doi&tool=kriya&email=pari@exeterpremedia.com&versions=no&ids=10.1093/cercor/bhs015,10.1093/cercor/bhs016
 *
 *
 */
var decode = require('unescape');
var c2j = require('./xml2json.js');
var crossrefcomp = require('./crossrefComp.js');
var u = require('./urest.js');
var fs = require('fs');
var FinalCitations = require('./getFormattedRef.js');
const defaultParams = '?tool=kriya&email=pari@exeterpremedia.com';
const efetchURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
const formatAsJSON = '&format=json';
const idconvURL = 'https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/';
var errorFormatter = require('./errorFormatter.js');
const retModeXML = '&retmode=xml&api_key=80e7e63d06de8fb27a5392b52a6acaec7b09';
const retModeJSON = '&retmode=json';

var errorFormatter = require('./errorFormatter.js');
function compare_input_and_VerifiedMatchedJSON(input, matched_json) {
    /**
     *
     *  Purpose: Gets the input json and matched json from pubmed or crossref and compares all the author names.
     *
     *  Functionality: Gets the inputJson(Entered json by the user) and Matched json ( return from pubmed or crossref ). Compares all the author names and corrects if any mismatch happens.
     *
     *
     */
    if (input.author.length < matched_json.author.length) {
        ////console.log("Some of the author names are missing in input data supplied so the  data obtained using the match has been used for generating bibliography.");
    } else if (input.author.length > matched_json.author.length) {
        ////console.log("\n\nyou have entered more authors than present in Pubmed/crossref record for the article in query. Some of the author names are missing in matched data record so the  data obtained using the match has been used for generating bibliography.\n\n");
    } else {
        for (var i = 0; i < matched_json.author.length; i++) {
            var lastname = input.author[i].split(' ');
            if (lastname[0].toLowerCase() == matched_json.author[i].family.toLowerCase()) {
                if (input.author[i].toLowerCase().localeCompare(matched_json.author[i].family.toLowerCase() + " " + matched_json.author[i].given.toLowerCase()) == 0) {
                } else if (input.author[i].toLowerCase().localeCompare(matched_json.author[i].family.toLowerCase() + " " + matched_json.author[i].given.toLowerCase()) == 1) {
                    var fname = '';
                    for (var j = 1; j < lastname.length; j++) {
                        if (j > 1) {
                            fname = fname + " ";
                        }
                        fname = fname + lastname[j];
                    }
                    ////console.log("\n\n\nCHANGES : The author name in the pubmed \"" + matched_json.author[i].family + " " + matched_json.author[i].given + "\" is changed to \"" + input.author[i] + "\" (supplied in the input by the user)\n\n\n");
                    matched_json.author[i].given = fname;
                }
            } else {
            }
        }
    }
    return matched_json;
}
function ExtractfullJournalName(input) {
    return new Promise(function (resolve, reject) {
        try {
            /*
                   var header = { "Content-Type": "application/x-www-form-urlencoded" };
                   var data = { "isoName": input };
         u.requestData('post', 'http://kriya2.kriyadocs.com/api/parsereference?apiKey=36ab61a9-47e1-4db6-96db-8b95a9923599', header, data).then(function(data) {
                               try {
       if(data.message.body="")
       {
           reject("Not Found");
       }
       else
       {
           resolve(data.message.body);
       }
       */
            var header = { "Content-Type": "application/x-www-form-urlencoded" };
            var data = { "isoName": input };
            u.requestData('post', 'http://kriya2.kriyadocs.com/api/parsereference?apiKey=36ab61a9-47e1-4db6-96db-8b95a9923599', header, data).then(function (data) {
                try {
                    if (data.message.body != "ERROR:Table 'login.j_medline' doesn't exist") {
                        resolve(data.message.body);
                        return;
                    }
                    else {
                        reject(errorFormatter.errorFormatter(500, "Not found", "Not found"));
                        return;
                    }
                } catch (e) {
                    reject(errorFormatter.errorFormatter(500, "Not found", "Not found"));
                    return;
                }
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500, "Not found", "Not found"));
                return;
            });
        }
        catch (e) {
            reject(errorFormatter.errorFormatter(500, "Not found", "Not found"));
            return;
        }
    });
}
function usingPMID(inputObj, style, pos, inputobjs) {
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
        var promisejson = c2j.convert(inputObj);
        promisejson.then(function (value) {
            var pmid = value['PMID'];
            if (pmid == undefined) {
                reject(errorFormatter.errorFormatter(500, 'unable to get pmid from input supplied.', "Unable to convert tagged data to pmid.Please check your pmid." ));
                return;
            }
            var url = efetchURL + defaultParams + retModeXML + '&db=pubmed&id=' + pmid;
            u.requestData('GET', url,"","",pos)
                .then(function (data) {
                    try {
                        var FINALCSLJSON = {};
                        var csljson = c2j.convert2(data.message);
                        if (csljson == undefined) {
                            reject(errorFormatter.errorFormatter(500, 'pmid does not Exist',"Unable to convert the data.Please check your pmid. " ));
                            return;
                        }
                        if (value.author) {
                            //Compare the input author json and matched author json.
                            var finaljson = compare_input_and_VerifiedMatchedJSON(value, csljson);
                        } else {
                            finaljson = csljson;
                        }
                        FINALCSLJSON["Item-1"] = finaljson;
                        FinalCitations.CSLJson_to_RequiredCitation(FINALCSLJSON, style, pos, "Pubmed", value, inputObj, inputobjs).then(function (data) {
                            data["Input"] = value;
                            resolve(data);
                            return;
                        }).catch(function (error) {
                            reject(errorFormatter.errorFormatter(500, error,'Unable to convert data. Something went wrong.' ));
                            return;
                        });
                    } catch (error) {
                        reject(errorFormatter.errorFormatter(500, error,'Unable to get pubmed meta data using pmid. Something went wrong.' ));
                            return;
                    }
                })
                .catch(function (error) {
                    reject(errorFormatter.errorFormatter(500, error,'Unable to get pubmed meta data using pmid. Something went wrong.' ));
                            return;
                });
        }).catch(function (error) {
            reject(errorFormatter.errorFormatter(500, error,'Unable to get pubmed meta data using pmid. Something went wrong.' ));
            return;
        });;
    });
}
function usingDOI(input, style, pos, inputObj) {
    return new Promise(function (resolve, reject) {
        /**
         *
         *  Purpose: Used for querying Crossref with DOI as input
         *
         *  Functionality: It Gets the input object and checks if any PMID exist for the doi. If pmid exist then queries pubmed to resolve the pmid else Converts the input object to crossref query url. Sends the query to Crossref and gets the output data in CSL JSON format which can be directly fed into the CiteProc.js
         *
         *  Example of url to check if pmid exist for the doi :
         *  https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?tool=kriya&email=pari@exeterpremedia.com&format=json&ids=10.1016/S0360-3016(02)03428-4
         *
         *
         *  Example of crossref url having DOI=10.5555/12345678 to get the meta data from crossref: 
         *  https://api.crossref.org/works/10.5555/12345678/transform/application/vnd.citationstyles.csl+json
         *
         */
        var promisejson = c2j.convert(input);
        promisejson.then(function (value) {
            var doi = value['DOI'];
            var url = idconvURL + defaultParams + formatAsJSON + '&ids=' + doi;
            url = (decode(url));
            u.requestData('GET', encodeURI(url))
                .then(function (data) {
                    if ((data.status == 200) && data.message.records && (data.message.records.length > 0)) {
                        var pmidArray = [];
                        data.message.records.forEach(function (record) {
                            pmidArray.push(record.pmid);
                        });
                        var pmid = pmidArray.join();
                        if (!pmid) {
                            //We couldn't resolve using pmid so we are gonna pass the input to crossrefcomp.JS which will help us to get the information.
                            doi = decode(doi);
                            var citeprocJSON = crossrefcomp.doi2citeprocjson(doi);
                            citeprocJSON.then(function (data) {
                                if (data.status != 500) {
                                    data = JSON.parse(data);
                                    data["id"] = "Item-1";
                                    var x = {};
                                    var csljson = data;
                                    if (value.author) {
                                        var FINALCSLJSON = compare_input_and_VerifiedMatchedJSON(value, csljson);
                                    } else {
                                        FINALCSLJSON = csljson;
                                    }
                                    x["Item-1"] = FINALCSLJSON;
                                    FinalCitations.CSLJson_to_RequiredCitation(x, style, pos, "Crossref", value, input, inputObj).then(function (data) {
                                        resolve(data);
                                    }).catch(function (error) {
                                        reject(errorFormatter.errorFormatter(500, error,'unable to convert csljson to req json.' ));
                                        return;
                                    });
                                } 
                                else{
                                    reject(errorFormatter.errorFormatter(500, "unable to convert csljson to req json.",'unable to convert csljson to req json.' ));
                                    return;
                                }
                                
                            }).catch(function (error) {
                                reject(errorFormatter.errorFormatter(500, error,'unable to convert csljson to req json.' ));
                                return;
                            });
                        } else {
                            var url = efetchURL + defaultParams + retModeXML + '&db=pubmed&id=' + pmid;
                            u.requestData('GET', url)
                                .then(function (data) {
                                    try {
                                        var FinalCslJson = {};
                                        var csljson = c2j.convert2(data.message);
                                        if (csljson == undefined) {
                                            //console.log('\n\n{ status: 500' + ', message: Unable to get pubmed meta data using pmid. }');
                                            return;
                                        }
                                        if (value.author) {
                                            var ss = compare_input_and_VerifiedMatchedJSON(value, csljson);
                                        } else {
                                            ss = csljson;
                                        }
                                        FinalCslJson["Item-1"] = ss;
                                        FinalCitations.CSLJson_to_RequiredCitation(FinalCslJson, style, pos, "Crossref", value, input, inputObj).then(function (data) {
                                            resolve(data);
                                        }).catch(function (error) {
                                            reject(errorFormatter.errorFormatter(500, error,'unable to convert csljson to req json.' ));
                                            return;
                                            return;
                                        });
                                    } catch (error) {
                                        reject(errorFormatter.errorFormatter(500, error,'unable to convert csljson to req json.' ));
                                        return;
                                    }
                                }).catch(function (error) {
                                    reject(errorFormatter.errorFormatter(500, error,'unable to get data using doi.' ));
                                    return;
                                });
                        }
                    } else {
                        //We couldn't resolve using pmid so we are gonna pass the input to crossrefcomp.JS which will help us to get the information from crossref.
                        doi = decode(doi);
                        var citeprocJSON = crossrefcomp.doi2citeprocjson(doi);
                        citeprocJSON.then(function (data) {
                            if (data.status != 500) {
                                data = JSON.parse(data);
                                data["id"] = "Item-1";
                                var x = {};
                                var csljson = data;
                                if (value.author) {
                                    var FINALCSLJSON = compare_input_and_VerifiedMatchedJSON(value, csljson);
                                } else {
                                    FINALCSLJSON = csljson;
                                }
                                x["Item-1"] = FINALCSLJSON;
                                FinalCitations.CSLJson_to_RequiredCitation(x, style, pos, "Crossref", value, input, inputObj).then(function (data) {
                                    resolve(data);
                                }).catch(function (error) {
                                    reject(errorFormatter.errorFormatter(500, error,'unable to convert csljson to req json.' ));
                                    return;
                                });
                            }
                        }).catch(function (error) {
                            reject(errorFormatter.errorFormatter(500, error,'unable to convert csljson to req json.' ));
                            return;
                        });
                    }
                })
                .catch(function (error) {
                    reject(errorFormatter.errorFormatter(500, error,'unable to get data using doi' ));
                    return;
                })
        }).catch(function (error) {
            reject(errorFormatter.errorFormatter(500, error,'unable to get data using doi' ));
            return;
        });
    });
}
   /**
         *
         *  Purpose: Used for querying pubmed and crossref with html tagged reference data as input.
         *
         *
         *  Functionality: It gets the HTML input object and converts it to JSON. Send the json to pubmed to find if any match for the data exist. If no match is found in pubmed then the data is sent to the crossref. 
         *  Once the match has been found the data is converted to CSL JSON and fed to the Citeproc.js
         *
         */
     
function usingHTML(htmlString, style, pos, inputobj) {
    return new Promise(function (resolve, reject) {
        try {
            var promisejson = c2j.convert(htmlString,pos);
            promisejson.then(function (value) {
                resolve(value.info);
                if( value["container-title"])
                value["container-title"] = value["container-title"].replace(/<(.|\n)*?>/g, '');
                if(value["title"])
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
                var inputpmidobj;
                value["journalAbbreviation"] = value["container-title"];
                ExtractfullJournalName(value["container-title"]).then(function (fullname) {
                    ////console.log(data.message);
                    if (fullname != "0 results" && fullname != "") {
                         value["container-title"] = fullname; }
                    if (value && value.PMID) {
                        inputpmidobj = inputobj;
                        inputpmidobj.type = "pmid";
                        inputpmidobj.request = "search";
                        inputpmidobj.data = '<p><span class="RefPMID">' + value.PMID + '</span></p';
                        pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, pos).then(function (values) {
                       
                            if(values && JSON.parse(values.MatchedJson) && JSON.parse(values.MatchedJson)["Item-1"] && JSON.parse(values.MatchedJson)["Item-1"].title && value && value.title)
                            {
                                //checking if title of input applied and matched JSON is having less than 40 percentile match then rejecting the input.
                               var simipercent=similar_text(value.title,JSON.parse(values.MatchedJson)["Item-1"].title,40);
                            if(simipercent<40)
                            {
                                reject(errorFormatter.errorFormatter(500, error,'unable to get data using html' ));
                            return;
                            }
                        }
                            resolve(values);
                            return;
                        }).catch(function (error) {
                            reject(errorFormatter.errorFormatter(500, error,'unable to get data using html' ));
                            return;
                        });
                        return;
                    }
                    /*
                    else if (value && value.DOI) {
                        inputpmidobj = inputobj;
                        inputpmidobj.type = "doi";
                        inputpmidobj.request = "search";
                        inputpmidobj.data = '<p><span class="RefDOI">' + value.DOI + '</span></p';
                        pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, "0").then(function (result) {
                            resolve(result);
                            return;
                        }).catch(function (error) {
                            reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                            return;
                        });
                        return;
                       
                    }
                    */
                     
                    var citeprocJSON = crossrefcomp.get_pmids_using_taggedinput(value, htmlString, style, pos, inputobj);
                    citeprocJSON.then(function (values) {
                    
                    if(values && values.MatchedJson && JSON.parse(values.MatchedJson) && JSON.parse(values.MatchedJson)["Item-1"] && JSON.parse(values.MatchedJson)["Item-1"].title && value && value.title)
                    {
                        //checking if title of input applied and matched JSON is having less than 40 percentile match then rejecting the input.
                       var simipercent=similar_text(value.title,JSON.parse(values.MatchedJson)["Item-1"].title,40);
                    if(simipercent<40)
                    {
                        if (value && value.PMID) {
                            inputpmidobj = inputobj;
                            inputpmidobj.type = "pmid";
                            inputpmidobj.request = "search";
                            inputpmidobj.data = '<p><span class="RefPMID">' + value.PMID + '</span></p';
                            pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, values.index).then(function (result) {
                                resolve(result);
                                return;
                            }).catch(function (error) {
                                reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                                return;
                            });
                            return;
                        }
                        else if (value && value.DOI) {
                            inputpmidobj = inputobj;
                            inputpmidobj.type = "doi";
                            inputpmidobj.request = "search";
                            inputpmidobj.data = '<p><span class="RefDOI">' + value.DOI + '</span></p';
                            pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, values.index).then(function (result) {
                                
                                if(result && JSON.parse(result.MatchedJson) && JSON.parse(result.MatchedJson)["Item-1"] && JSON.parse(result.MatchedJson)["Item-1"].title && value && value.title)
                                {
                                var simipercent=similar_text(value.title,JSON.parse(result.MatchedJson)["Item-1"].title,40);
                                if(simipercent<40)
                                {
                                    reject(errorFormatter.errorFormatter(500, 'simi match less than 40','unable to get data using html input' ));
                                    return;

                                }
                            }
                                resolve(result);
                                return;
                           
                            }).catch(function (error) {
                                reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                                return;
                            });
                            return;
                        }
                    }else
                    {
                        resolve(values);
                        return;
                    }
                    }
                    else
                    {
                        resolve(values);
                        return;
                    
                      
                    }
                    
                    }).catch(function (error) {
                        reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                        return;
                    });;
                }).catch(function (error) {
                    if (value && value.PMID) {
                        inputpmidobj = inputobj;
                        inputpmidobj.type = "pmid";
                        inputpmidobj.request = "search";
                        inputpmidobj.data = '<p><span class="RefPMID">' + value.PMID + '</span></p';
                        pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, pos).then(function (result) {
                            resolve(result);
                            return;
                        }).catch(function (error) {
                            reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                            return;
                        });
                        return;
                    }
                    var citeprocJSON = crossrefcomp.get_pmids_using_taggedinput(value, htmlString, style, pos, inputobj);
                    citeprocJSON.then(function (values) {
                        if(values && JSON.parse(values.MatchedJson) && JSON.parse(values.MatchedJson)["Item-1"] && JSON.parse(values.MatchedJson)["Item-1"].title && value && value.title)
                        {
                            //checking if title of input applied and matched JSON is having less than 40 percentile match then rejecting the input.
                           var simipercent=similar_text(value.title,JSON.parse(values.MatchedJson)["Item-1"].title,40);
                        if(simipercent<40)
                        {
                            if (value && value.PMID) {
                                inputpmidobj = inputobj;
                                inputpmidobj.type = "pmid";
                                inputpmidobj.request = "search";
                                inputpmidobj.data = '<p><span class="RefPMID">' + value.PMID + '</span></p';
                                pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, pos).then(function (result) {
                                    resolve(result);
                                    return;
                                }).catch(function (error) {
                                    reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                                    return;
                                });
                                return;
                            }
                            else if (value && value.DOI) {
                                inputpmidobj = inputobj;
                                inputpmidobj.type = "doi";
                                inputpmidobj.request = "search";
                                inputpmidobj.data = '<p><span class="RefDOI">' + value.DOI + '</span></p';
                                pubmedComp.getPubMedRefHash(inputpmidobj, inputpmidobj.style, pos).then(function (result) {
                                  
                                    if(result && JSON.parse(result.MatchedJson) && JSON.parse(result.MatchedJson)["Item-1"] && JSON.parse(result.MatchedJson)["Item-1"].title && value && value.title)
                                    {
                                    var simipercent=similar_text(value.title,JSON.parse(result.MatchedJson)["Item-1"].title,40);
                                    if(simipercent<40)
                                    {
                                        reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                                        return;
    
                                    }
                                }
                                    
                                    return;
                               
                                }).catch(function (error) {
                                    reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                                    return;
                                });
                                return;
                            }
                        }
                        }
                        
                            resolve(result);
                        return;
                        
                    }).catch(function (error) {
                        reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                        return;
                    });;
                });
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
                return;
            });;
        } catch (e) {
            reject(errorFormatter.errorFormatter(500, error,'unable to get data using html input' ));
            return;
        }
        //  resolve('get pubmed ref hash using HTML');
    })
}
function similar_text(first, second, percent) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/similar_text/
    // original by: Rafał Kukawski (http://blog.kukawski.pl)
    // bugfixed by: Chris McMacken
    // bugfixed by: Jarkko Rantavuori original by findings in stackoverflow (http://stackoverflow.com/questions/14136349/how-does-similar-text-work)
    // improved by: Markus Padourek (taken from http://www.kevinhq.com/2012/06/php-similartext-function-in-javascript_16.html)
    //   example 1: similar_text('Hello World!', 'Hello locutus!')
    //   returns 1: 8
    //   example 2: similar_text('Hello World!', null)
    //   returns 2: 0
    if (first === null ||
        second === null ||
        typeof first === 'undefined' ||
        typeof second === 'undefined') {
        return 0
    }
    first += ''
    second += ''
    var pos1 = 0
    var pos2 = 0
    var max = 0
    var firstLength = first.length
    var secondLength = second.length
    var p
    var q
    var l
    var sum
    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
                (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++) { // eslint-disable-line max-len
                // @todo: ^-- break up this crazy for loop and put the logic in its body
            }
            if (l > max) {
                max = l
                pos1 = p
                pos2 = q
            }
        }
    }
    sum = max
    if (sum) {
        if (pos1 && pos2) {
            sum += similar_text(first.substr(0, pos1), second.substr(0, pos2))
        }
        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += similar_text(
                first.substr(pos1 + max, firstLength - pos1 - max),
                second.substr(pos2 + max,
                    secondLength - pos2 - max))
        }
    }
    if (!percent) {
        return sum
    }
    return (sum * 200) / (firstLength + secondLength)
}
var pubmedComp = {
    /**
     *
     *  Purpose: directs the input object based on inputobj.type entered by the user.
     *
     *  Functionality:  Gets the inputObj entered by the user and directs the input object to the relevant function bases on input Type (DOI | PMID| HTML).
     * @param {*} inputObj holds the complete input information.
     * @param {*} style desired user style.
     * @param {*} pos posistion variable for index count for multiple parse reference as input.
     */
    getPubMedRefHash: function (inputObj, style, pos) {
        return new Promise(function (resolve, reject) {
            if ((typeof (inputObj) == 'undefined') || (typeof (inputObj.data) == 'undefined') || (inputObj.data == '') || (typeof (inputObj.type) == 'undefined') || (inputObj.type == '')) {
                reject(errorFormatter.errorFormatter(500, 'invalid input.','unable to get data using html input.' ));
                return;
            }
            var myFunc;
            if (inputObj.type.toLowerCase() == 'pmid') {
                myFunc = usingPMID;
            } else if (inputObj.type.toLowerCase() == 'doi') {
                myFunc = usingDOI;
            } else if (inputObj.type.toLowerCase() == 'html') {
                myFunc = usingHTML;
            } else {
                reject(errorFormatter.errorFormatter(500, 'invalid input','Please check your input parameters' ));
                            return;
            }
            myFunc(inputObj.data, inputObj.style, pos, inputObj)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (error) {
                      reject(errorFormatter.errorFormatter(500, error,'Please check your input parameters' ));
                            return;
                })
        });
    }
};

module.exports = pubmedComp;