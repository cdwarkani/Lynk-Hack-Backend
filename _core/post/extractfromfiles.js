var path = require('path');
var et = require('elementtree');
var path = require('path');
var decode = require('unescape');
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
var decompress = require('decompress');
var biblioextract = require(path.join(__dirname, '..', 'post', 'JS', 'biblioExtract.js'));
var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var Q = require('q');


module.exports = {
    extractfromfiles: function (req, res) {
        //performs extract search.
        if (req.body.data == "") {
            var item = {};
            item["Input"] = req.body.data;
            item["Citation"] = JSON.stringify("");
            item["finalbiblio"] = "No input supplied to the system";
            var data = [];
            data.push(item);
            var x = { "data": data };
            res.send(x);
            return;
        }
        Extract(req.body.data, req.body.style, req.body.locale, req.body.pre, req.body.post, req.body.type).then(function (data) {
            JSON.stringify(res.status(200).json({ status: { code: 200, message: data } }).end());
            return;
        }).catch(function (error) {
           
            res.status(500).json({ status: { code: 500, message: "Unable to extract data. Please try after sometime. Something went wrong" } }).end();
            return;
        });
    }
}
function Extract(datas, style, locale, pre, post, type) {
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
                        var doc = new DOMParser().parseFromString(inputs.data);
                        var k = doc.getElementsByTagName("w:instrText");
                        var promisesobject = [];
                        var frst = '',
                            second = '';
                        frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
                        if (frst.startsWith(" ADDIN PAPERS2_CITATIONS") || frst.startsWith("ADDIN PAPERS2_CITATIONS")) {
                            //papaers2citation is done from here.
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
                            for (var i = 1; i < k.length; i++) {
                                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                                //x=data;
                                if (second.startsWith(" ADDIN PAPERS2_CITATIONS") || second.startsWith("ADDIN PAPERS2_CITATIONS")) {
                                    var frst = frst.substr(24);
                                   
                                    promisesobject.push(biblioextract.papers2citations_to_CslJSON(frst, inputs));
                                    frst = second;
                                } else {
                                    frst = frst + second;
                                }
                            }
                            var frst = frst.substr(24);
                            promisesobject.push(biblioextract.papers2citations_to_CslJSON(frst, inputs));
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
                        } else if (frst.startsWith(" ADDIN ZOTERO_ITEM CSL_CITATION") || frst.startsWith("ADDIN ZOTERO_ITEM CSL_CITATION")) {
                            //zotero based file processing is done here.
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
                            frst = decode(doc.getElementsByTagName("w:instrText")[0].firstChild.toString());
                            for (var i = 1; i < k.length; i++) {
                                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                                //x=data;
                                if (second.startsWith(" ADDIN ZOTERO_ITEM CSL_CITATION") || second.startsWith("ADDIN ZOTERO_ITEM CSL_CITATION")) {
                                    frst = frst.substr(32);
                                    if (frst[frst.length - 2].toLowerCase() == 'y') {
                                        frst = frst.slice(0, -50);
                                    }
                                    promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, inputs));
                                    frst = second;
                                } else {
                                    frst = frst + second;
                                }
                            }
                            frst = frst.substr(32);
                            promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, inputs));
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

                        } else if (frst.startsWith(" ADDIN CSL_CITATION") || frst.startsWith("ADDIN CSL_CITATION")) {
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

                            //csl citation based procesing is done here.
                            for (var i = 1; i < k.length; i++) {
                                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                                //x=data;
                                if (second.startsWith(" ADDIN CSL_CITATION") || second.startsWith("ADDIN CSL_CITATION")) {
                                    frst = frst.substr(18);
                                    promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, inputs));
                                    frst = second;
                                } else {
                                    frst = frst + second;
                                }
                            }
                            frst = frst.substr(18);
                            frst = frst.slice(0, -44);
                            if (frst.length == '}') {
                                promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, inputs));
                            }
                            else {
                                frst = frst.slice(0, -1);
                                promisesobject.push(biblioextract.CslJSON_to_Biblio(frst, inputs));
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
                        } else if (frst.startsWith(" ADDIN REFMGR.CITE") || frst.startsWith("ADDIN REFMGR.CITE")) {
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
                            for (var i = 1; i < k.length; i++) {
                                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                                //x=data;
                                if (second.startsWith(" ADDIN REFMGR.CITE") || second.startsWith("ADDIN REFMGR.CITE") || second.startsWith("ADDIN EN.CITE.DATA") || second.startsWith(" ADDIN EN.CITE.DATA") || second.startsWith("  ADDIN EN.CITE.DATA")) {
                                    frst = frst.substr(18);
                                    if (frst[1] == '<') {
                                        promisesobject.push(biblioextract.refman_to_CslJSON(frst, inputs));
                                    }
                                    frst = second;
                                } else {
                                    frst = frst + second;
                                }
                            }
                            frst = frst.substr(18);
                            if (frst[1] == '<') {
                                promisesobject.push(biblioextract.refman_to_CslJSON(frst, inputs));
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
                        } else if (frst.startsWith(" ADDIN EN.CITE") || frst.startsWith("ADDIN EN.CITE")) {
                            for (var i = 1; i < k.length; i++) {
                                second = decode(doc.getElementsByTagName("w:instrText")[i].firstChild.toString());
                                if (second.startsWith(" ADDIN EN.CITE") || second.startsWith("ADDIN EN.CITE")) {
                                    frst = frst.substr(15);
                                    if (frst[0] == '<' && frst[frst.length - 1] == '>') {
                                        promisesobject.push(biblioextract.endnote_to_CslJSON(frst, inputs));
                                    }
                                    frst = second;
                                } else {
                                    frst = frst + second;
                                }
                            }
                            frst = frst.slice(15, 15);
                            if (frst[0] == '<' && frst[frst.length - 1] == '>') {
                                promisesobject.push(biblioextract.endnote_to_CslJSON(frst, inputs));
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
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500, error, "No data found in specieifed path."));
                return;
            });
            return;;
        }
        catch (e) {
            reject(errorFormatter.errorFormatter(500, "Unable to detect the document type.", "please specify either- zotero | mendeley | refmgr | endnote | papers2citation "));
            return;
        }
    });
}