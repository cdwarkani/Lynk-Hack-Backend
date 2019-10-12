var u = require('./urest.js');
var c2j = require('./xml2json.js');
var Q = require('q');
var fs = require('fs');
var FinalCitations = require('./getFormattedRef.js');
var c2j = require('./xml2json.js');
var errorFormatter = require('./errorFormatter.js');
//compares the first array set and second array set and returns all the values which are presen in both first and second.
const defaultParams = '?tool=kriya&email=pari@exeterpremedia.com';
const efetchURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
const idconvURL = 'https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/';
const retModeXML = '&retmode=xml&api_key=80e7e63d06de8fb27a5392b52a6acaec7b09';
const retModeJSON = '&retmode=json';
const formatAsJSON = '&format=json';
var errorFormatter = require('./errorFormatter.js');
function compare_input_and_VerifiedMatchedJSON(input, matched_json) {
    /**
     *
     *  Purpose: Gets the input json and matched json from pubmed or crossref and compares all the author names.
     *
     *  Functionality: Gets the inputJson(Entered json by the user) and Matched json ( return from pubmed or crossref ). Compares all the author names and corrects if any mismatch happens.
     *
     */
    if (input.author.length < matched_json.author.length) {
     
        //console.log("Some of the author names are missing in input data supplied so the  data obtained using the match has been used for generating bibliography.");
    } else if (input.author.length > matched_json.author.length) {
        //console.log("\n\nyou have entered more authors than present in Pubmed/crossref record for the article in query. Some of the author names are missing in matched data record so the  data obtained using the match has been used for generating bibliography.\n\n");
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
                    //console.log("\n\n\nCHANGES : The author name in the pubmed \"" + matched_json.author[i].family + " " + matched_json.author[i].given + "\" is changed to \"" + input.author[i] + "\" (supplied in the input by the user)\n\n\n");
                    matched_json.author[i].given = fname;
                }
            } else {
            }
        }
    }
    return matched_json;
}
function compare_hashmaps(first, second) {
    /**
     *
     *  Purpose: Gets the array object first,second and compares them.
     *
     *  Functionality: compares the array object frst and second and returns the values which exist in both first and second.
     *
     */
    var pmid = '',
        pmid1, final = '';
    //starting from i=1 because the i=0 in both the arrays will be empty
    for (var i = 1; i < first.length; i++) {
        pmid1 = first[i];
        for (var j = 1; j < second.length; j++) {
            if (pmid1 == second[j]) {
                final = final + "," + pmid1;
                break;
            }
        }
    }
    return final;
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
var crossrefComp = {
    //raw json are the unverified json format
    doi2citeprocjson: function (doi) {
        /**
     *
     *  Purpose: Gets the doi and extracts csl json.
     *
     *  Functionality: Gets the doi and extracts csl json from crossref.
     *
     * example url : input doi = 10.5555/12345678
     *  https://api.crossref.org/works/10.5555/12345678/transform/application/vnd.citationstyles.csl+json
     */
        return new Promise(function (resolve, reject) {
            try {
                var url = "https://api.crossref.org/works/" + doi + "/transform/application/vnd.citationstyles.csl+json";
                u.requestData('GET', encodeURI(url))
                    .then(function (data) {
                        try {
                            if (data.status == 200) {
                                resolve(data.message);
                            }
                            else {
                                data.status = 500;
                                resolve(data);
                                return;
                            }


                        } catch (e) {
                            data.status = 500;
                            resolve(data);
                            return;
                        }
                    })
                    .catch(function (error) {
                        if (error.status == 429) {
                            u.requestData('GET', url)
                                .then(function (data) {
                                    try {
                                        resolve(data.message);
                                        return;
                                    } catch (e) {
                                        resolve({
                                            'status': {
                                                'code': 500,
                                                'message': 'unable to translate doi2citeprocjson.Something went wrong.'
                                            },
                                            'message': 'Please check your input parameters'
                                        });
                                        return;
                                    }
                                })
                                .catch(function (error) {
                                    resolve({
                                        'status': {
                                            'code': 500,
                                            'message': 'unable to get meta data using doi.Something went wrong.'
                                        },
                                        'message': error
                                    });
                                    return;
                                });
                        }
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'unable to get meta data using doi.Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    })
            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'unable to get meta data using input.Something went wrong.'
                    },
                    'message': e
                });
                return;
            }
        });
    },
    //raw json are the unverified json format
    //Citeprocjson are the verified json format from crossref ready to be feeded into Citeproc.JS FOR CITATION GENERATION
    solve_crossref_using_taggedinput: function (unverified_xml_data_in_JsonFormat, html, inputobj) {
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
            var inputjson = unverified_xml_data_in_JsonFormat;
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
            if (unverified_xml_data_in_JsonFormat && unverified_xml_data_in_JsonFormat.author && unverified_xml_data_in_JsonFormat.author[0] ) {
                if(unverified_xml_data_in_JsonFormat.author[0].family && unverified_xml_data_in_JsonFormat.author[0].given )
                append = append + "query.author=\"" + unverified_xml_data_in_JsonFormat.author[0].family +" "+unverified_xml_data_in_JsonFormat.author[0].given + "\"&";
                else if(unverified_xml_data_in_JsonFormat.author[0].family  )
                append = append + "query.author=\"" + unverified_xml_data_in_JsonFormat.author[0].family +"\"&";
                else if(unverified_xml_data_in_JsonFormat.author[0].given  )
                append = append + "query.author=\"" + unverified_xml_data_in_JsonFormat.author[0].given +"\"&";
           
            }
            if (unverified_xml_data_in_JsonFormat["container-title"]) {
                append = append + "query.container-title=\"" + unverified_xml_data_in_JsonFormat["container-title"] + "\"&";
            }
            else if (unverified_xml_data_in_JsonFormat["RefBookTitle"]) {
                append = append + "query.container-title=\"" + unverified_xml_data_in_JsonFormat["RefBookTitle"] + "\"&";
            }
            else if (unverified_xml_data_in_JsonFormat["RefConfTitle"]) {
                append = append + "query.title=\"" + unverified_xml_data_in_JsonFormat["RefConfTitle"] + "\"&";
            }
            if (unverified_xml_data_in_JsonFormat["title"]) {
                append = append + "query.title=\"" + unverified_xml_data_in_JsonFormat["title"] + "\"&";
            }
            var url = "https://api.crossref.org/works?" + append + "rows="+1;
            
            u.requestData('GET', encodeURI(url),"","",{"index":unverified_xml_data_in_JsonFormat,"requestType":"CrossRefServer"})
                .then(function (data) {
                 
                    if (data.status == "200") { } else {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'unable to resolve.Something went wrong.'
                            },
                            'message': data
                        });
                        return;
                    }

                    
                    ////console.log(data.message.message.items[0]);
                    for (var kz = 0; kz < data.message.message.items.length; kz++) {
                        ////console.log(data.message.message.items[0]);
                        csljson = '';
                        csljson = data.message.message.items[kz];
                        finalPMIDS = finalPMIDS + "," + csljson.DOI;
                        if (inputjson["title"] && csljson["title"]) {
                            var p = similar_text(csljson["title"][0].toLowerCase(), inputjson["title"].toLowerCase(), "s");
                            if (p > 85) {
                                ////console.log(csljson["volume"]);
                                // vol[csljson.volume]=PMIDSS[i];
                                titl = titl + "," + csljson.DOI;
                                prcnt_title = prcnt_title + "," + p;
                            }
                        }
                        if (inputjson["container-title"] && csljson["container-title"]) {
                            var p = similar_text(csljson["container-title"][0].toLowerCase(), inputjson["container-title"].toLowerCase(), "s");
                            if (p > 85) {
                                ////console.log(csljson["volume"]);
                                // vol[csljson.volume]=PMIDSS[i];
                                article_title = article_title + "," + csljson.DOI;
                                prcnt = prcnt + "," + p;
                            }
                        } else if (inputjson["RefBookTitle"] && csljson["container-title"]) {
                            var p = similar_text(csljson["container-title"][0].toLowerCase(), inputjson["RefBookTitle"].toLowerCase(), "s");
                            if (p > 85) {
                                ////console.log(csljson["volume"]);
                                // vol[csljson.volume]=PMIDSS[i];
                                article_title = article_title + "," + csljson.DOI;
                                prcnt = prcnt + "," + p;
                            }
                        } else if (inputjson["RefConfTitle"] && csljson["container-title"]) {
                            var p = similar_text(csljson["container-title"][0].toLowerCase(), inputjson["RefConfTitle"].toLowerCase(), "s");
                            if (p > 85) {
                                ////console.log(csljson["volume"]);
                                // vol[csljson.volume]=PMIDSS[i];
                                article_title = article_title + "," + csljson.DOI;
                                prcnt = prcnt + "," + p;
                            }
                        }
                        if (inputjson["volume"] && csljson["volume"]) {
                            csljson["volume"] = csljson["volume"].replace(/\D/g, '');
                            if (csljson["volume"].toLowerCase() == inputjson["volume"].toLowerCase()) {
                                vol = vol + "," + csljson.DOI;
                            }
                        }
                        if (inputjson["page-first"] && csljson["page"]) {
                            var x = csljson["page"];
                            x = x.split('-');
                            if (x[0].toLowerCase() == inputjson["page-first"].toLowerCase()) {
                                page = page + "," + csljson.DOI;
                            }
                        }
                        if (inputjson["issue"] && csljson["issue"]) {
                            var p = similar_text(csljson["issue"].toLowerCase(), inputjson["issue"].toLowerCase(), "s");
                            if (p == 100) {
                                issue = issue + "," + csljson.DOI;
                            }
                        }
                        if (csljson.license && csljson.license[0] && csljson.license[0].start && inputjson["RefYear"] && inputjson["RefYear"] == csljson.license[0].start["date-parts"][0][0]) {
                            year = year + "," + csljson.DOI;
                        } else if (csljson["published-print"] && inputjson["RefYear"] == csljson["published-print"]["date-parts"][0][0]) {
                            year = year + "," + csljson.DOI;
                        } else if (inputjson["RefYear"] && csljson.created["date-parts"] && (inputjson["RefYear"] == csljson.created["date-parts"][0][0])) {
                            year = year + "," + csljson.DOI;
                        }
                    }
                    if (inputjson && inputjson["title"] && !titl) {
                        ////console.log("No article with more than 80 perecnt title match exist in crossref and pubmed.");
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'No article with more than 80 perecnt title match exist in crossref and pubmed.'
                            },
                            'message': "No output Found in crossref or pubmed"
                        });
                        return;
                        return;
                    }
                    var title = titl;
                    var pmidss = finalPMIDS.split(',');
                    var pmid = article_title.split(',');
                    if (pmid.length == 2) {
                        resolve(pmid[1]);
                        return;
                    } else if (pmid.length == 1) {
                        var volumes = vol.split(',');
                        if (volumes.length == 2) {
                            resolve(volumes[1]);
                            return;
                        } else if (volumes.length == 1) {
                            var issues = issue.split(',');
                            if (issues.length == 2) {
                                resolve(issues[1]);
                                return;
                            } else if (issues.length == 1) {
                                var pages = page.split(',');
                                if (pages.length == 2) {
                                    resolve(pages[1]);
                                    return;
                                } else {
                                    var yearss = year.split(',');
                                    var pmids_year_common = compare_hashmaps(yearss, pmidss);
                                    pmids_year_common = pmids_year_common.split(',');
                                    if (pmids_year_common.length == 2) {
                                        resolve(pmids_year_common[1]);
                                        return;
                                    } else if (pmids_year_common.length == 1) {
                                        var title = title.split(',');
                                        var common = compare_hashmaps(pmidss, title);
                                        common = common.split(',');
                                        if (common.length == 2) {
                                            resolve(common[1]);
                                            return;
                                        } else if (common.length == 1) {
                                            pmidss[0] = "MULTIPLE";
                                            resolve(pmidss);
                                            return;
                                        } else {
                                            common[0] = "MULTIPLE";
                                            resolve(common);
                                            return;
                                        }
                                    } else {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(pmids_year_common, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            pmids_year_common[0] = "MULTIPLE";
                                            resolve(pmids_year_common);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    }
                                }
                            } else if (issues.length > 2) {
                                var pages = page.split(',');
                                var page_issue_common = compare_hashmaps(issues, pages);
                                page_issue_common = page_issue_common.split(',');
                                if (page_issue_common.length == 2) {
                                    resolve(page_issue_common[1]);
                                    return;
                                } else {
                                    var yearss = year.split(',');
                                    var common = compare_hashmaps(yearss, issues);
                                    common = common.split(',');
                                    if (common.length == 2) {
                                        resolve(common[1]);
                                        return;
                                    } else if (common.length == 1) {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(issues, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            issues[0] = "MULTIPLE";
                                            resolve(issues);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    } else {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(common, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            common[0] = "MULTIPLE";
                                            resolve(common);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    }
                                    return;
                                }
                            }
                        } else if (volumes.length > 2) {
                            var issues = issue.split(',');
                            var vol_issue_common = compare_hashmaps(issues, volumes);
                            vol_issue_common = vol_issue_common.split(',')
                            if (vol_issue_common.length == 2) {
                                resolve(vol_issue_common[1]);
                                return;
                            } else if (vol_issue_common.length == 1) {
                                var pages = page.split(',');
                                var vol_page_common = compare_hashmaps(pages, volumes);;
                                vol_page_common = vol_page_common.split(',');
                                if (vol_page_common.length == 2) {
                                    resolve(vol_page_common[1]);
                                    return;
                                } else {
                                    var yearss = year.split(',');
                                    var common = compare_hashmaps(yearss, volumes);
                                    common = common.split(',');
                                    if (common.length == 2) {
                                        resolve(common[1]);
                                        return;
                                    } else if (common.length == 1) {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(volumes, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            volumes[0] = "MULTIPLE";
                                            resolve(volumes[1]);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    } else {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(common, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            common[0] = "MULTIPLE";
                                            resolve(common);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    }
                                }
                            } else if (vol_issue_common.length > 2) {
                                var pages = page.split(',');
                                var vol_issue_pages_common = compare_hashmaps(pages, vol_issue_common);
                                vol_issue_pages_common = vol_issue_pages_common.split(',');
                                if (vol_issue_pages_common.length == 2) {
                                    resolve(vol_issue_pages_common[1]);
                                    return;
                                } else {
                                    var yearss = year.split(',');
                                    var common = compare_hashmaps(yearss, vol_issue_common);
                                    common = common.split(',');
                                    if (common.length == 2) {
                                        resolve(common[1]);
                                        return;
                                    } else if (common.length == 1) {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(vol_issue_common, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            vol_issue_common[0] = "MULTIPLE";
                                            resolve(vol_issue_common[1]);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    } else {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(common, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            common[0] = "MULTIPLE";
                                            resolve(common);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                    } else if (pmid.length > 2) {
                        var volumes = vol.split(',');
                        var vol_title_common = compare_hashmaps(pmid, volumes);
                        vol_title_common = vol_title_common.split(',');
                        if (vol_title_common.length == 2) {
                            resolve(vol_title_common[1]);
                            return;
                        } else if (vol_title_common.length == 1) {
                            var issues = issue.split(',');
                            var issue_title_common = compare_hashmaps(issues, pmid);
                            issue_title_common = issue_title_common.split(',');
                            if (issue_title_common.length == 2) {
                                resolve(issue_title_common[1]);
                                return;
                            } else if (issue_title_common.length == 1) {
                                var pages = page.split(',');
                                var pages_title_common = compare_hashmaps(pages, pmid);
                                pages_title_common = pages_title_common.split(',');
                                if (pages_title_common.length == 2) {
                                    resolve(pages_title_common[1]);
                                    return;
                                } else if (pages_title_common.length == 1) {
                                    var yearss = year.split(',');
                                    var common = compare_hashmaps(yearss, pmid);
                                    common = common.split(',');
                                    if (common.length == 2) {
                                        resolve(common[1]);
                                        return;
                                    } else if (common.length == 1) {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(pmid, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            pmid[0] = "MULTIPLE";
                                            resolve(pmid);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    } else {
                                        var title = title.split(',');
                                        var common2 = compare_hashmaps(common, title);
                                        common2 = common2.split(',');
                                        if (common2.length == 2) {
                                            resolve(common2[1]);
                                            return;
                                        } else if (common2.length == 1) {
                                            common[0] = "MULTIPLE";
                                            resolve(common);
                                            return;
                                        } else {
                                            common2[0] = "MULTIPLE";
                                            resolve(common2);
                                            return;
                                        }
                                    }
                                    return;
                                } else {
                                    var title = title.split(',');
                                    var title_common = compare_hashmaps(pages_title_common, title);
                                    title_common = title_common.split(',');
                                    if (title_common.length == 2) {
                                        resolve(title_common[1]);
                                        return;
                                    } else if (title_common.length == 1) {
                                        var years = year.split(',');
                                        var title_common_year = compare_hashmaps(pages_title_common, years);
                                        title_common_year = title_common_year.split(',');
                                        if (title_common_year.length == 2) {
                                            resolve(title_common_year[1]);
                                            return;
                                        } else if (title_common_year.length == 1) {
                                            pages_title_common[0] = "MULTIPLE";
                                            resolve(pages_title_common);
                                            return;
                                        } else if (title_common_year.length > 2) {
                                            title_common_year[0] = "MULTIPLE";
                                            resolve(title_common_year);
                                            return;
                                        }
                                    } else if (title_common.length > 2) {
                                        title_common[0] = "MULTIPLE";
                                        resolve(title_common);
                                        return;
                                    }
                                }
                            } else if (issue_title_common.length > 2) {
                                var volumes = vol.split(',');
                                var issue_title_vol_common = compare_hashmaps(issue_title_common, volumes);
                                issue_title_vol_common = issue_title_vol_common.split(',');
                                if (issue_title_vol_common.length == 2) {
                                    resolve(issue_title_vol_common[1]);
                                    return;
                                } else if (issue_title_vol_common.length == 1) {
                                    var pages = page.split(',');
                                    var issue_title_page_common = compare_hashmaps(issue_title_common, pages);
                                    issue_title_page_common = issue_title_page_common.split(',');
                                    if (issue_title_page_common.length == 2) {
                                        resolve(issue_title_page_common[1]);
                                        return;
                                    } else if (issue_title_page_common.length == 1) {
                                        var yearss = year.split(',');
                                        var common = compare_hashmaps(yearss, issue_title_common);
                                        common = common.split(',');
                                        if (common.length == 2) {
                                            resolve(common[1]);
                                            return;
                                        } else if (common.length == 1) {
                                            var title = title.split(',');
                                            var common2 = compare_hashmaps(issue_title_common, title);
                                            common2 = common2.split(',');
                                            if (common2.length == 2) {
                                                resolve(common2[1]);
                                                return;
                                            } else if (common2.length == 1) {
                                                issue_title_common[0] = "MULTIPLE";
                                                resolve(issue_title_common);
                                                return;
                                            } else {
                                                common2[0] = "MULTIPLE";
                                                resolve(common2);
                                                return;
                                            }
                                        } else {
                                            common[0] = "MULTIPLE";
                                            resolve(common);
                                            return;
                                        }
                                        return;
                                    } else if (issue_title_page_common > 2) {
                                        var volumes = vol.split(',');
                                        var issue_title_page_vol_common = compare_hashmaps(issue_title_page_common, volumes);
                                        issue_title_page_vol_common = issue_title_page_vol_common.split(',');
                                        if (issue_title_page_vol_common.length == 2) {
                                            resolve(issue_title_page_vol_common[1]);
                                            return;
                                        } else {
                                            var yearss = year.split(',');
                                            var common = compare_hashmaps(yearss, issue_title_page_common);
                                            common = common.split(',');
                                            if (common.length == 2) {
                                                resolve(common[1]);
                                                return;
                                            } else if (common.length == 1) {
                                                var title = title.split(',');
                                                var common2 = compare_hashmaps(issue_title_page_common, title);
                                                common2 = common2.split(',');
                                                if (common2.length == 2) {
                                                    resolve(common2[1]);
                                                    return;
                                                } else if (common2.length == 1) {
                                                    issue_title_page_common[1] = "MULTIPLE";
                                                    resolve(issue_title_page_common);
                                                    return;
                                                } else {
                                                    common2[0] = "MULTIPLE";
                                                    resolve(common2);
                                                    return;
                                                }
                                            } else {
                                                var title = title.split(',');
                                                var common2 = compare_hashmaps(common, title);
                                                common2 = common2.split(',');
                                                if (common2.length == 2) {
                                                    resolve(common2[1]);
                                                    return;
                                                } else if (common2.length == 1) {
                                                    common[0] = "MULTIPLE";
                                                    resolve(common);
                                                    return;
                                                } else {
                                                    common2[0] = "MULTIPLE";
                                                    resolve(common2);
                                                    return;
                                                }
                                            }
                                            return;
                                        }
                                    }
                                } else if (issue_title_vol_common > 2) {
                                    var pages = page.split(',');
                                    var issue_title_vol_page_common = compare_hashmaps(issue_title_vol_common, pages);
                                    issue_title_vol_page_common = issue_title_vol_page_common.split(',');
                                    if (issue_title_vol_page_common.length == 2) {
                                        resolve(issue_title_vol_page_common[1]);
                                        return;
                                    } else {
                                        resolve(issue_title_vol_common);
                                        return;
                                    }
                                }
                            }
                            /*
                              var max=0,pmid_based_on_max_percentile='';
                            for(var k=1;k<pmid.length;k++)
                            {
                              if(prcnt[k]>max)
                                {
                                  max=prcnt[k];
                                  pmid_based_on_max_percentile=pmid[k];
                                }
                            }
                            resolve(pmid_based_on_max_percentile);
                             return;
                             */
                        } else if (vol_title_common.length > 2) {
                            var pag = page.split(',');
                            var page_vol_title_common = compare_hashmaps(vol_title_common, pag);
                            page_vol_title_common = page_vol_title_common.split(',');
                            if (page_vol_title_common.length == 2) {
                                resolve(page_vol_title_common[1]);
                                return;
                            } else if (page_vol_title_common.length == 1) {
                                var max = 0,
                                    pmid_based_on_max_percentile = '';
                                for (var k = 1; k < pmid.length; k++) {
                                    if (prcnt[k] > max) {
                                        max = prcnt[k];
                                        pmid_based_on_max_percentile = pmid[k];
                                    }
                                }
                                resolve(pmid_based_on_max_percentile);
                                return;
                            } else if (page_vol_title_common.length > 2) {
                                var max = 0,
                                    pmid_based_on_max_percentile = '';
                                for (var k = 1; k < pmid.length; k++) {
                                    if (prcnt[k] > max) {
                                        max = prcnt[k];
                                        pmid_based_on_max_percentile = pmid[k];
                                    }
                                }
                                resolve(pmid_based_on_max_percentile);
                                return;
                            }
                        }
                    }
                }).catch(function (error) {
                    resolve({
                        'status': {
                            'code': 500,
                            'message': 'unable to get meta data using input.Something went wrong.'
                        },
                        'message': error
                    });
                    return;
                });;
        });
    },
    get_pmids_using_taggedinput: function (unverified_xml_data_in_JsonFormat, html, style, pos, inputobj) {
        /**
         *
         *  Purpose: Gets the input json and quries pubmed with set of html tagged data entered by the user.
         *
         *  Functionality: Gets the inputJson(Entered json by the user) and then queries pubmed. pubmed may return multiple matches. Multiple PMID resolution logic is written here to inorder to detect unique PMID.
         *
         *
         * EXAMPLE url to query pubmed with tagged reference input data:
         * https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&retmode=xml&bdata=American%20Journal%20of%20Bioethics|2001|||Agich
         *
         */
        return new Promise(function (resolve, reject) {
            try {
                var container;
                if (unverified_xml_data_in_JsonFormat['journalAbbreviation']) {
                    container = unverified_xml_data_in_JsonFormat['journalAbbreviation'];
                } else if (unverified_xml_data_in_JsonFormat['RefConfTitle']) {
                    container = unverified_xml_data_in_JsonFormat['RefConfTitle'];
                } else if (unverified_xml_data_in_JsonFormat['RefBookTitle']) {
                    container = unverified_xml_data_in_JsonFormat['RefBookTitle'];
                }
                if (unverified_xml_data_in_JsonFormat.author && unverified_xml_data_in_JsonFormat.author.length)
                    for (var i = 0; i < unverified_xml_data_in_JsonFormat.author.length; i++) {
                        var s = unverified_xml_data_in_JsonFormat.author[i];
                        /*
                        s=s.replace('<span class="RefSurname">',"");
                        s=s.replace('<span class="RefGivenname">',"");
                        s=s.replace("</span>"," ");
                        s=s.replace("</span>","");
                        */
                        unverified_xml_data_in_JsonFormat.author[i] = s;
                    }
                var url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&&api_key=80e7e63d06de8fb27a5392b52a6acaec7b09&retmode=unixref&bdata=";
                
                if (container) {
                    url = url + container + "|";
                }
                else {
                    url = url + "|";
                }
                if (unverified_xml_data_in_JsonFormat.RefYear) {
                    url = url + unverified_xml_data_in_JsonFormat.RefYear + "|";
                }
                else {
                    url = url + "|";
                }
                if (unverified_xml_data_in_JsonFormat.volume) {
                    url = url + unverified_xml_data_in_JsonFormat.volume + "|";
                }
                else {
                    url = url + "|";
                }
                if (unverified_xml_data_in_JsonFormat["page-first"]) {
                    url = url + unverified_xml_data_in_JsonFormat["page-first"] + "|";
                }
                else {
                    url = url + "|";
                }
                if (unverified_xml_data_in_JsonFormat && unverified_xml_data_in_JsonFormat.author && unverified_xml_data_in_JsonFormat.author[0]) {
                    url = url + unverified_xml_data_in_JsonFormat.author[0].family + " " + unverified_xml_data_in_JsonFormat.author[0].given;
                }
                var urlencoded = encodeURI(url);
                console.log("Sending request to pubmed db :"+url);
               // //console.log(url);
               /*
               https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&retmode=xml&bdata=proc+natl+acad+sci+u+s+a|1991|88|3248|mann+bj|Art1|%0Dscience|1987|235|182|palmenberg+ac|Art2|

               */
                u.requestData('GET', urlencoded)
                    .then(function (data) {
                        try {
                            var fields = data.message.split('|');
                            if (fields && fields[6] && fields[6][0] == 'A' && fields[6][10] != '(') {
                                var fields = fields[6].split(' ');
                                var fields = fields[1].split(',');
                                //check if the numbers are pmid else resolve it because sometimes thre return values are "AMBIGOUS (6 CITATIONS)"
                                var numbers = /^\d+$/;
                                if (numbers.test(fields[0])) {
                                    var finalPMIDS = crossrefComp.resolve_multiple_pmids(fields, unverified_xml_data_in_JsonFormat);
                                    finalPMIDS.then(function (pmid) {
                                        // var pmidss=pmid.split(',');
                                        // if(pmid.length2)
                                        if (pmid[0] == "MULTIPLE") {
                                            var promisesobject = [];
                                            for (var k = 1; k < pmid.length; k++) {
                                                inputObjs = {
                                                    'data': '<p><span class="RefPMID">' + pmid[k] + '</span>.</p>',
                                                    'type': 'pmid',
                                                    'request': 'search',
                                                    'style': inputobj.style,
                                                    'pre': inputobj.pre,
                                                    'locales': inputobj.locales,
                                                    'post': inputobj.post
                                                };
                                                inputObjs.data = normalize_special_characters(inputObjs.data);
                                                var p = require('./pubmedComp.js');
                                                if (inputObjs.type == "html" || inputObjs.type == "pmid" || inputObjs.type == "doi") {
                                                    promisesobject.push(p.getPubMedRefHash(inputObjs, inputobj.style, ""));
                                                }
                                            }
                                            Q.all(promisesobject).then(function (data) {
                                                resolve(data);
                                                return;
                                            }).catch(function (error) {
                                                reject(errorFormatter.errorFormatter(500, error, 'unable to get data for multiple pmidss.'));
                                                return;
                                            });
                                            return;
                                        }
                                        var reg = /^\d+$/;
                                        if (reg.test(pmid)) {
                                            var promisejson = c2j.convert(html);
                                            promisejson.then(function (value) {
                                                var url = efetchURL + defaultParams + retModeXML + '&db=pubmed&id=' + pmid;
                                                u.requestData('GET', url)
                                                    .then(function (data) {
                                                        try {
                                                            var x = {};
                                                            var csljson = c2j.convert2(data.message);
                                                            var ss = compare_input_and_VerifiedMatchedJSON(value, csljson);
                                                            x["Item-1"] = ss;
                                                            FinalCitations.CSLJson_to_RequiredCitation(x, style, pos, "Crossref", value, unverified_xml_data_in_JsonFormat, inputobj).then(function (data) {
                                                                resolve(data);
                                                            }).catch(function (error) {
                                                                reject(errorFormatter.errorFormatter(500, error, 'unable to get data for multiple pmidss.'));
                                                                return;
                                                            });
                                                        } catch (e) {
                                                            reject(errorFormatter.errorFormatter(500, error, 'unable to get data for multiple pmidss.'));
                                                            return;
                                                        }
                                                    })
                                                    .catch(function (error) {
                                                        reject(errorFormatter.errorFormatter(500, error, 'unable to get data for multiple pmidss.'));
                                                        return;
                                                    });
                                            }).catch(function (error) {
                                                reject(errorFormatter.errorFormatter(500, error, 'unable to get data for multiple pmidss.'));
                                                return;
                                            });;
                                        }
                                        else {
                                            resolve(pmid);
                                            return;
                                        }
                                    });
                                } else {
                                    reject(errorFormatter.errorFormatter(500, error, 'unable to get data for multiple pmidss.'));
                                    return;
                                }
                            } else if ((fields && fields[6] && (fields[6][0] == 'N' || fields[6][10] == '(')) || (fields.length == 1) ) {
                                //resolve using crossref
                                crossrefComp.solve_crossref_using_taggedinput(unverified_xml_data_in_JsonFormat, html, inputobj).then(function (doi) {
                                    var doi = doi;
                                    if (doi[0] == "MULTIPLE") {
                                        reject(errorFormatter.errorFormatter(500, 'No data found', ' No data found'));
                                        return;
                                    }
                                    else if (doi && doi.status && doi.status.code == 500) {
                                        resolve(doi);
                                        return;
                                    } else {
                                        var inputObj = [
                                            {
                                                'data': '<p><span class="RefDOI">' + doi + '</span>.</p>',
                                                'type': 'doi',
                                                'request': 'search',
                                                'style': inputobj.style,
                                                'locales': inputobj.locales,
                                                'pre': inputobj.pre,
                                                'post': inputobj.post
                                            }
                                        ];
                                        var input = inputObj[0];
                                        var p = require('./pubmedComp.js');
                                        p.getPubMedRefHash(input, input.style, "")
                                            .then(function (data) {
                                                resolve(data);
                                            })
                                            .catch(function (error) {
                                                reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                                                return;
                                            });
                                    }
                                }).catch(function (error) {
                                    reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                                    return;
                                });;
                            } else {
                                pmid = fields[6];
                                var inputObj = [
                                    {
                                        'data': '<p><span class="RefPMID">' + pmid + '</span>.</p>',
                                        'type': 'pmid',
                                        'request': 'search',
                                        'style': inputobj.style,
                                        'locales': inputobj.locales,
                                        'pre': inputobj.pre,
                                        'post': inputobj.post
                                    }
                                ];
                                var input = inputObj[0];
                                var p = require('./pubmedComp.js');
                                p.getPubMedRefHash(input, input.style, pos)
                                    .then(function (data) {
                                        if (data && JSON.parse(data.MatchedJson) && JSON.parse(data.MatchedJson)["Item-1"] && JSON.parse(data.MatchedJson)["Item-1"].title && unverified_xml_data_in_JsonFormat && unverified_xml_data_in_JsonFormat.title) {
                                            //checking if title of input applied and matched JSON is having less than 40 percentile match then rejecting the input.
                                            var simipercent = similar_text(data.title, JSON.parse(data.MatchedJson)["Item-1"].title, 40);
                                            simipercent=50;
                                            if (simipercent < 40) {
                                                crossrefComp.solve_crossref_using_taggedinput(unverified_xml_data_in_JsonFormat, html, inputobj).then(function (doi) {
                                                    var doi = doi;
                                                    if (doi[0] == "MULTIPLE") {
                                                        reject(errorFormatter.errorFormatter(500, 'No data found', ' No data found'));
                                                        return;
                                                    }
                                                    else if (doi && doi.status && doi.status.code == 500) {
                                                        resolve(doi);
                                                        return;
                                                    } else {
                                                        var inputObj = [
                                                            {
                                                                'data': '<p><span class="RefDOI">' + doi + '</span>.</p>',
                                                                'type': 'doi',
                                                                'request': 'search',
                                                                'style': inputobj.style,
                                                                'locales': inputobj.locales,
                                                                'pre': inputobj.pre,
                                                                'post': inputobj.post
                                                            }
                                                        ];
                                                        var input = inputObj[0];
                                                        var p = require('./pubmedComp.js');
                                                        p.getPubMedRefHash(input, input.style, "")
                                                            .then(function (data) {
                                                                resolve(data);
                                                                return;
                                                            })
                                                            .catch(function (error) {
                                                                reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                                                                return;
                                                            });
                                                    }
                                                }).catch(function (error) {
                                                    reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                                                    return;
                                                });;
                                            }else
                                            {

                                        resolve(data);
                                        return;
                                            }
                                        }




                                    })
                                    .catch(function (error) {
                                        reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                                        return;
                                    });
                                return;
                            }
                            //////////////////////////
                        } catch (error) {
                            reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                            return;
                        }
                    })
                    .catch(function (error) {
                        reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                        return;
                    })
            } catch (error) {
                reject(errorFormatter.errorFormatter(500, error, 'unable to get data for doi.'));
                return;
            }
        });
    },
    resolve_multiple_pmids: function (PMIDSS, inputjson,JSONData) {
        /**
          *
          *  Purpose: Gets the input json and quries pubmed with set of html tagged data entered by the user.
          *
          *  Functionality: Gets the inputJson(Entered json by the user) and then queries pubmed. pubmed may return multiple matches. Multiple PMID resolution logic is written here to inorder to detect unique PMID.
          *
          *
          * EXAMPLE url to query pubmed with tagged reference input data:
          * https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&retmode=xml&bdata=American%20Journal%20of%20Bioethics|2001|||Agich
          *
          */
        return new Promise(function (resolve, reject) {
            try {

                var finalPMIDS = '';
                var article_title = '',
                    vol = '',
                    page = '',
                    issue = '',
                    prcnt = '';
                var promisesobject = [];
                for (var i = 0; i < PMIDSS.length; i++) {
                    var url = efetchURL + defaultParams + retModeXML + '&db=pubmed&id=' + PMIDSS[i];
                    promisesobject.push(u.requestData('GET', url,"","",JSONData));
                }
                Q.all(promisesobject).then(function (data) {
                    for (var k = 0; k < data.length; k++) {
                        var csljson = c2j.convert2(data[k].message);
                        finalPMIDS = finalPMIDS + "," + csljson.PMID;
                        if (inputjson["title"] && csljson["title"]) {
                            var p = similar_text(csljson["title"].toLowerCase(), inputjson["title"].toLowerCase(), "s");
                            if (p > 80) {
                                ////console.log(csljson["volume"]);
                                // vol[csljson.volume]=PMIDSS[i];
                                article_title = article_title + "," + csljson.PMID;
                                prcnt = prcnt + "," + p;
                            }
                        }
                        if (inputjson["volume"] && csljson["volume"]) {
                            if (csljson["volume"].toLowerCase() == inputjson["volume"].toLowerCase()) {
                                vol = vol + "," + csljson.PMID;
                            }
                        }
                        if (inputjson["page-first"] && csljson["page"]) {
                            var x = csljson["page"].split('-');
                            var p = similar_text(x[0].toLowerCase(), inputjson["page-first"].toLowerCase(), "s");
                            if (p > 75) {
                                page = page + "," + csljson.PMID;
                            }
                        }
                        if (inputjson["issue"] && csljson["issue"]) {
                            var p = similar_text(csljson["issue"].toLowerCase(), inputjson["issue"].toLowerCase(), "s");
                            if (p > 85) {
                                issue = issue + "," + csljson.PMID;
                            }
                        }
                    }
                    if (inputjson && inputjson["title"] && !article_title) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'No journal with more than 80 perecnt title match exist in crossref and pubmed.'
                            },
                            'message': "No output Found in crossref or pubmed",
                            "JSONList":data[0].index

                        });
                        return;
                    }
                    solve_pmids(finalPMIDS, article_title, vol, issue, page,data[0].index).then(function (data) {
                        if (data[0] == "MULTIPLE") {
                            resolve({
                                'status': {
                                    'code': 500,
                                    'message': 'No journal with more than 80 perecnt title match exist in crossref and pubmed.'
                                },
                                'message': "No output Found in crossref or pubmed",
                                "JSONList":data.JSONList
                            });
                            return;
                        }
                        else {
                            resolve(data);
                        }
                    }).catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': '.Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    });
                }).catch(function (error) {
                    resolve({
                        'status': {
                            'code': 500,
                            'message': '.Something went wrong.'
                        },
                        'message': error
                    });
                    return;
                });
            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'unable to get meta data using input.Something went wrong.'
                    },
                    'message': e
                });
                return;
            }
        });
    },
    get_crossref_xml_data: function (unverified_xml_data_in_JsonFormat) {
        return new Promise(function (resolve, reject) {
            try {
                var url = "http://doi.crossref.org/servlet/query?usr=jbp&pwd=jbp221&format=unixref&qdata=<?xml version = \"1.0\" encoding=\"UTF-8\"?><query_batch version=\"2.0\" xmlns = \"http://www.crossref.org/qschema/2.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><head><email_address>pari@exeterpremedia.com</email_address><doi_batch_id>Sample multi resolve</doi_batch_id></head><body><query enable-multiple-hits=\"true\"  key=\"1178517\"><journal_title match=\"fuzzy\">" + unverified_xml_data_in_JsonFormat.title + "</journal_title><author search-all-authors=\"true\" match=\"fuzzy\">" + unverified_xml_data_in_JsonFormat.author[0] + "</author><year>" + unverified_xml_data_in_JsonFormat.RefYear + "</year></query></body></query_batch>";
                var urlencoded = encodeURI(url);
                u.requestData('GET', urlencoded)
                    .then(function (data) {
                        try {
                            //console.log(data.message);
                        } catch (e) {
                            resolve({
                                'status': {
                                    'code': 500,
                                    'message': 'unable to get meta data using input.Something went wrong.'
                                },
                                'message': error
                            });
                            return;
                        }
                    })
                    .catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'unable to get xml meta data using input.Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    })
            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'unable to get meta data using input.Something went wrong.'
                    },
                    'message': error
                });
                return;
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'unable to get meta data using input.Something went wrong.'
                },
                'message': error
            });
            return;
        });
    }
}
function solve_pmids(finalPMIDS, article_title, vol, issue, page,index) {
    /**
    *
    *  Purpose: Gets the pmid list present inside variables finalPMIDS,article_title,vol,issue,page and returns the unique pmid
    *
    *  Functionality:  Gets the pmid list present inside variables finalPMIDS,article_title,vol,issue,page and compares the set to find unique pmid. The resolution logic is present in the doc in the form of flowchart.
    *
    */
    return new Promise(function (resolve, reject) {
        try {
            var pmidss = finalPMIDS.split(',');
            var pmid = article_title.split(',');
            if (pmid.length == 2) {
                resolve({"status":200,"value":pmid[1],"JSONList":index});
                return;
            } else if (pmid.length == 1) {
                var volumes = vol.split(',');
                if (volumes.length == 2) {
                    resolve({"status":200,"value":volumes[1],"JSONList":index});
                    return;
                } else if (volumes.length == 1) {
                    var issues = issue.split(',');
                    if (issues.length == 2) {
                        resolve({"status":200,"value":issues[1],"JSONList":index});
                        return;
                    } else if (issues.length == 1) {
                        var pages = page.split(',');
                        if (pages.length == 2) {
                            resolve({"status":200,"value":pages[1],"JSONList":index});
                            return;
                        } else {
                            pmidss[0] = "MULTIPLE";
                            resolve({"status":200,"value":pmidss,"JSONList":index});
                            return;
                        }
                    } else if (issues.length > 2) {
                        var pages = page.split(',');
                        var page_issue_common = compare_hashmaps(issues, pages);
                        page_issue_common = page_issue_common.split(',');
                        if (page_issue_common.length == 2) {
                            resolve({"status":200,"value":page_issue_common[1],"JSONList":index});
                            return;
                        } else {
                            issues[0] = "MULTIPLE";
                            resolve({"status":200,"value":issues,"JSONList":index});
                            return;
                            
                        }
                    }
                } else if (volumes.length > 2) {
                    var issues = issue.split(',');
                    var vol_issue_common = compare_hashmaps(issues, volumes);
                    vol_issue_common = vol_issue_common.split(',')
                    if (vol_issue_common.length == 2) {
                        resolve({"status":200,"value":vol_issue_common[1],"JSONList":index});
                            return;
                    } else if (vol_issue_common.length == 1) {
                        var pages = page.split(',');
                        var vol_page_common = compare_hashmaps(pages, volumes);;
                        vol_page_common = vol_page_common.split(',');
                        if (vol_page_common.length == 2) {
                            resolve({"status":200,"value":vol_page_common[1],"JSONList":index});
                            return;

                        } else {
                            volumes[0] = "MULTIPLE";
                            resolve({"status":200,"value":volumes,"JSONList":index});
                            return;
                        }
                    } else if (vol_issue_common.length > 2) {
                        var pages = page.split(',');
                        var vol_issue_pages_common = compare_hashmaps(pages, vol_issue_common);
                        vol_issue_pages_common = vol_issue_pages_common.split(',');
                        if (vol_issue_pages_common.length == 2) {
                            resolve({"status":200,"value":vol_issue_pages_common[1],"JSONList":index});
                            return;
                        } else {
                            vol_issue_common[0] = "MULTIPLE";
                            resolve({"status":200,"value":vol_issue_common,"JSONList":index});
                            return;
                        }
                    }
                }
            } else if (pmid.length > 2) {
                var volumes = vol.split(',');
                var vol_title_common = compare_hashmaps(pmid, volumes);
                vol_title_common = vol_title_common.split(',');
                if (vol_title_common.length == 2) {
                    resolve({"status":200,"value":vol_title_common[1],"JSONList":index});
                    return;
                } else if (vol_title_common.length == 1) {
                    var issues = issue.split(',');
                    var issue_title_common = compare_hashmaps(issues, pmid);
                    issue_title_common = issue_title_common.split(',');
                    if (issue_title_common.length == 2) {
                        resolve({"status":200,"value":issue_title_common[1],"JSONList":index});
                        return;
                    } else if (issue_title_common.length == 1) {
                        var pages = page.split(',');
                        var pages_title_common = compare_hashmaps(pages, pmid);
                        pages_title_common = pages_title_common.split(',');
                        if (pages_title_common.length == 2) {
                            resolve({"status":200,"value":pages_title_common[1],"JSONList":index});
                            return;
                        } else if (pages_title_common.length == 1) {
                            pmid[0] = "MULTIPLE";
                            resolve({"status":200,"value":pmid,"JSONList":index});
                            return;
                        } else {
                        }
                    } else if (issue_title_common.length > 2) {
                        var volumes = vol.split(',');
                        var issue_title_vol_common = compare_hashmaps(issue_title_common, volumes);
                        issue_title_vol_common = issue_title_vol_common.split(',');
                        if (issue_title_vol_common.length == 2) {
                            resolve({"status":200,"value":issue_title_vol_common[1],"JSONList":index});
                            return;
                        } else if (issue_title_vol_common.length == 1) {
                            var pages = page.split(',');
                            var issue_title_page_common = compare_hashmaps(issue_title_common, pages);
                            issue_title_page_common = issue_title_page_common.split(',');
                            if (issue_title_page_common.length == 2) {
                                resolve({"status":200,"value":issue_title_page_common[1],"JSONList":index});
                                return;
                            } else if (issue_title_page_common.length == 1) {
                                issue_title_common[0] = "MULTIPLE";
                                resolve({"status":200,"value":issue_title_common,"JSONList":index});
                                return;
                            } else if (issue_title_page_common > 2) {
                                var volumes = vol.split(',');
                                var issue_title_page_vol_common = compare_hashmaps(issue_title_page_common, volumes);
                                issue_title_page_vol_common = issue_title_page_vol_common.split(',');
                                if (issue_title_page_vol_common.length == 2) {
                                    resolve({"status":200,"value":issue_title_page_vol_common[1],"JSONList":index});
                                    return;
                                } else {
                                    issue_title_page_common[1] = "MULTIPLE";
                                    resolve({"status":200,"value":issue_title_page_common,"JSONList":index});
                                    return;
                                }
                            }
                        } else if (issue_title_vol_common > 2) {
                            var pages = page.split(',');
                            var issue_title_vol_page_common = compare_hashmaps(issue_title_vol_common, pages);
                            issue_title_vol_page_common = issue_title_vol_page_common.split(',');
                            if (issue_title_vol_page_common.length == 2) {
                                resolve({"status":200,"value":issue_title_vol_page_common[1],"JSONList":index});
                                    return;
                            } else {
                                resolve({"status":200,"value":issue_title_vol_common,"JSONList":index});
                                    return;
                            }
                        }
                    }
                    /*
                      var max=0,pmid_based_on_max_percentile='';
                    for(var k=1;k<pmid.length;k++)
                    {
                      if(prcnt[k]>max)
                        {
                          max=prcnt[k];
                          pmid_based_on_max_percentile=pmid[k];
                        }
                    }
                    resolve(pmid_based_on_max_percentile);
                     return;
                     */
                } else if (vol_title_common.length > 2) {
                    var pag = page.split(',');
                    var page_vol_title_common = compare_hashmaps(vol_title_common, pag);
                    page_vol_title_common = page_vol_title_common.split(',');
                    if (page_vol_title_common.length == 2) {
                        resolve({"status":200,"value":page_vol_title_common[1],"JSONList":index});
                                    return;
                    } else if (page_vol_title_common.length == 1) {
                        var max = 0,
                            pmid_based_on_max_percentile = '';
                        for (var k = 1; k < pmid.length; k++) {
                            if (prcnt[k] > max) {
                                max = prcnt[k];
                                pmid_based_on_max_percentile = pmid[k];
                            }
                        }
                        resolve({"status":200,"value":pmid_based_on_max_percentile,"JSONList":index});
                        return;
                        
                    } else if (page_vol_title_common.length > 2) {
                        var max = 0,
                            pmid_based_on_max_percentile = '';
                        for (var k = 1; k < pmid.length; k++) {
                            if (prcnt[k] > max) {
                                max = prcnt[k];
                                pmid_based_on_max_percentile = pmid[k];
                            }
                        }
                        resolve({"status":200,"value":pmid_based_on_max_percentile,"JSONList":index});
                        return;
                    }
                }
            }
        } catch (e) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'unable to get meta data using input.Something went wrong.'
                },
                'message': error
            });
            return;
        }
    }).catch(function (error) {
        resolve({
            'status': {
                'code': 500,
                'message': 'unable to get meta data using input.Something went wrong.'
            },
            'message': error
        });
        return;
    });
}
/////////
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
module.exports = crossrefComp;