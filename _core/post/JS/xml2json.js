var xpath = require('xpath')
    , DOMParser = require('xmldom').DOMParser
    , serializer = require('xmldom').XMLSerializer;
const templJSON = require('./../Json/template.json');
var cheerio = require('cheerio');
const pubmedXMLConfigFile = require('./../Json/pubmedXMLConfigFile.json');
var fs = require('fs');
var et = require('elementtree');
var parser = require('xml2json');
var errorFormatter = require('./errorFormatter.js');
/**
 * https://citation.js.org/demo/
 * https://citation.js.org/demo/bibtxt.html
 */
var xml2json = {
    convert3: function (xmlstring) {
        return new Promise(function (resolve, reject) {
            try {
                var json = parser.toJson(normalize_special_characters(xmlstring).replace('<Go to ISI>:', ''));
                resolve(json);
            }
            catch (error) {
                reject(errorFormatter.errorFormatter(500, error, "Unable to convert to json. Something went wrong."));
                return;
            }
        });
    },
    //function to convert pubmed xml to citeproc json
    convert2: function (xmlstring) {
        try{
        //console.log("hit in at Convert2 function");
        var XML = et.XML;
        var ElementTree = et.ElementTree;
        var element = et.Element;
        var subElement = et.SubElement;
        var data, etree;
        var citeproc = {};
        // add a item
        var article = et.parse(xmlstring);
        if (!article.find("PubmedArticle/MedlineCitation/Article")) {
            //console.log("hit out at Convert2 function");
            return;
        }
        Object.keys(pubmedXMLConfigFile).forEach(function (keys) {
            if (pubmedXMLConfigFile[keys]);
            {
                var value = article.findtext(pubmedXMLConfigFile[keys]);
                if (value)
                    citeproc[keys] = value;
            }
        });
        //need to extract date and ocnvert it to csl form.
        var date_parts = [];
        var date = article.find("PubmedArticle/MedlineCitation/Article/ArticleDate");
        date_parts = extract_publication_date_parts(article);
        if (date_parts) {
            citeproc["issued"] = "{" + "date" + ": [" + date_parts[0] + ", " + date_parts[1] + ", " + date_parts[2] + "] }";
        }
        var value;
        var authors = article.findall("PubmedArticle/MedlineCitation/Article/AuthorList/Author");
        var authors_given = article.findall("PubmedArticle/MedlineCitation/Article/AuthorList/Author/ForeName");
        var authors_family = article.findall("PubmedArticle/MedlineCitation/Article/AuthorList/Author/LastName");
        var authors_suffix = article.findall("PubmedArticle/MedlineCitation/Article/AuthorList/Author/Suffix");
        var authors_prefix = article.findall("PubmedArticle/MedlineCitation/Article/AuthorList/Author/Prefix");
        var authors_initials = article.findall("PubmedArticle/MedlineCitation/Article/AuthorList/Author/Initials");
        var authors_list;
        var authors_append_list = {};
        if (authors_given && authors_given.length) {
            for (var i = 0; i < authors_given.length; i++) {
                if (i == 0) {
                    authors_list = "[{" + "\"family\":\"" + authors_family[i].text + "\"," + "\"given\":\"" + authors_given[i].text + "\"}";
                }
                else {
                    authors_list = authors_list + ",{" + "\"family\":\"" + authors_family[i].text + "\"," + "\"given\":\"" + authors_given[i].text + "\"}";
                }
            }
            authors_list = authors_list + "]";
            citeproc["author"] = JSON.parse(authors_list);
        }
        authors_list = [];
        var data_list = {};
        for (var i = 0; i < authors.length; i++) {
            data_list = {};
            var ss = authors[i]["_children"];
            var keyVal = "";
            for (var k = 0; k < ss.length; k++) {
                keyVal = ss[k].tag;
                if (keyVal == "ForeName") {
                    keyVal = "given";
                } else if (keyVal == "LastName") {
                    if (data_list && !data_list[keyVal])
                        keyVal = "family";

                } else if (keyVal == "Initials") {
                    keyVal = "initial";

                } else if (keyVal == "Suffix") {
                    keyVal = "suffix";
                }
                else if (keyVal == "CollectiveName") {
                    keyVal = "literal";
                }
                if (keyVal == "literal") {
                   if(!citeproc["container-author"])
                    citeproc["container-author"]=[];
                    data_list[keyVal] = ss[k].text;
                    citeproc["container-author"].push(data_list);

                    data_list="";
                }
                else {
                    data_list[keyVal] = ss[k].text;
                }

            }
            if(data_list)
            authors_list.push(data_list);
        }
        citeproc["author"] = authors_list;



        var collective_container_authors_ = article.findtext("PubmedArticle/MedlineCitation/Article/AuthorList/Author/CollectiveName");
        if (collective_container_authors_) {
            citeproc["CollectiveAuthor"] = collective_container_authors_;
        }
        citeproc["URL"] = "https://www.ncbi.nlm.nih.gov/pubmed/" + citeproc["PMID"];
        citeproc["id"] = pubmedXMLConfigFile["id"];
        if(article.findtext("PubmedArticle/MedlineCitation/Article/Language"))
        {
            citeproc["language"]=article.findtext("PubmedArticle/MedlineCitation/Article/Language");
        }
        //console.log("hit out at Convert2 function");
        return citeproc;
        }
        catch (error) {
            //console.log("hit out at Convert2 function");
            return citeproc;
        }
    },
    /**
     * function to get the tagged refrence html string as input and return the citeproc json
    */
    convert: function (htmlString,position) {
        return new Promise(function (resolve, reject) {
            try {
                var s=cheerio.load(htmlString);
                htmlString=htmlString.replace(/(<em[^>]+?>|<em>|<\/em>)/img, "");
                htmlString=htmlString.replace(/(<u[^>]+?>|<u>|<\/u>)/img, "");
                htmlString=htmlString.replace(/(<strong[^>]+?>|<strong>|<\/strong>)/img, "");
                htmlString=htmlString.replace(/(<i[^>]+?>|<i>|<\/i>)/img, "");
                htmlString=htmlString.replace(/(<b[^>]+?>|<b>|<\/b>)/img, "");

                var doc = new DOMParser().parseFromString('<div>' + htmlString + '</div>', 'text/html');
                var refParas = doc.getElementsByTagName('p');
                if (refParas.length == 0) {
                    reject(errorFormatter.errorFormatter(500, 'Unable to convert to json. Something went wrong.', 'Unable to convert to json. Something went wrong.'));
                    return;
                }
                else if (refParas.length > 1) {
                    reject(errorFormatter.errorFormatter(500, 'Unable to convert to json. Something went wrong.', 'Unable to convert to json. Something went wrong.'));
                    return;
                }
                refPara = refParas[0];
                // check if we have direct text nodes that contains characters other than punctuation
                // if we do, then we cannot handle this situation, throw an error
                var textNodes = xpath.select('./text()', refPara);
                var untaggedData = false;
                textNodes.forEach(function (textNode) {
                    var textNodeValue = textNode.nodeValue;
                    if (!/^[^A-Za-z0-9]+$/g.test(textNodeValue) && !textNodeValue == "and") {
                        untaggedData = true;
                    }
                });
                if (untaggedData) {
                    reject(errorFormatter.errorFormatter(500, 'Unable to convert to json. Something went wrong.', 'Unable to convert to json. Something went wrong.'));
                    return;
                }
                // using the classes, create a json using template.json
                var childNodes = xpath.select('./*', refPara);
                var unknownTag = false;
                var refObj = {};
                var type=s(htmlString).attr('data-reftype');
                
                if(journalTypeInfo[type])
                {
                    var Jinfo=journalTypeInfo[type];
                    refObj["type"]=Jinfo;
                }else
                {
                    refObj["type"]="article-journal";
                }
                childNodes.forEach(function (childNode) {
                    var className = childNode.getAttribute('class').replace(/^\s|\s$/gi, '');
                    var textNodeValue = childNode.textContent;
                    if (!className || /\s/g.test(className) || !/^Ref[A-Za-z0-9]+$/g.test(className)) {
                        unknownTag = true;
                    }
                    else if (templJSON[className]) {
                        var templObj = templJSON[className];
                        var childNodeHTMLString = new serializer().serializeToString(childNode);
                        childNodeHTMLString = childNodeHTMLString.replace(/^<[^>]+>|<\/[^>]+>$/g, '');
                        var mapName = templJSON[className];
                        if (typeof (mapName) == 'string') {
                            refObj[mapName] = childNodeHTMLString;
                        }
                        else {
                            mapName = mapName[0];
                            if (!refObj[mapName]) {
                                refObj[mapName] = [];
                            }
                            refObj[mapName].push(childNodeHTMLString);
                        }
                    }
                })
                if (unknownTag) {
                    reject(errorFormatter.errorFormatter(500, 'Unable to convert to json. Something went wrong.', 'Unable to convert to json. Something went wrong.'));
                    return;
                }
                else {
                    if(refObj["page-first"] && refObj["page-last"])
                    {
                    refObj["page"]=refObj["page-first"] +"-"+refObj["page-last"];
                    delete refObj["page-first"];
                    delete refObj["page-last"];
                    }else if(refObj["page-first"])
                    {
                        refObj["page"]=refObj["page-first"] ;
                        delete refObj["page-first"];
                    }
                    else if(refObj["page-last"])
                    {
                        refObj["page"]=refObj["page-last"];
                        delete refObj["page-last"];
                    }
                   
                    resolve({"info":refObj,"index":position});
                    return;
                }
            }
            catch (error) {
                reject(errorFormatter.errorFormatter(500, error, 'Unable to convert to json. Something went wrong.'));
                return;
            }
        });
    }
}
function extract_publication_date_parts(article) {
    // print articles
    var date_parts = [];
    var date = article.find("PubmedArticle/MedlineCitation/Article/Journal/JournalIssue/PubDate");
    if (date && date.findtext('Year')) {
        var x;
        for (var i = 0; i < 3; i++) {
            if (i == 0) {
                var val = date.findtext('Year');
                if (!val) {
                }
                date_parts[0] = val;
            }
            if (i == 1) {
                var val = date.findtext('Month');
                if (!val) {
                }
                date_parts[1] = (val);
            }
            if (i == 2) {
                var val = date.findtext('Day');
                if (!val) {
                }
                date_parts[2] = val;
            }
        }


        return date_parts;
    } else if (date && date.findtext('MedlineDate')) {
        var val = date.findtext('MedlineDate');
        var datum = val.split(' ');
        date_parts[0] = datum[0];
        return date_parts;

    }
    var date_parts = [];
    // Electronic articles
    var date = article.find("PubmedArticle/MedlineCitation/Article/ArticleDate");
    if (date) {
        var x;
        for (var i = 0; i < 3; i++) {
            if (i == 0) {
                var val = date.findtext('Year');
                if (!val) {
                }
                date_parts[0] = val;
            }
            if (i == 1) {
                var val = date.findtext('Month');
                if (!val) {
                }
                date_parts[1] = (val);
            }
            if (i == 2) {
                var val = date.findtext('Day');
                if (!val) {
                }
                date_parts[2] = val;
            }
        }
        return date_parts;
    }



}
function normalize_special_characters(str) {
    var x = '';
    var unwanted_array = {
        '&': '&amp;',
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
var journalTypeInfo={
    "Journal":"article-journal",
    "Book":"book",
    "Book_Editor":"book",
    "Thesis":"thesis",
    "Data":"dataset",
    "Conference":"paper-conference",
    "Software":"entry",
    "Patent":"patent",
    "Website":"webpage",
    "Report":"report"
}
module.exports = xml2json;