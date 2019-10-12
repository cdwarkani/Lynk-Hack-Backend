var Q = require('q');
var path = require('path');
var u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
var crossrefComp = require(path.join(__dirname, '..', 'post', 'JS', 'crossrefComp.js'));
var xform = require('x-www-form-urlencode');

var resolvemultiplepmidsusingpubmed = {
    resolvemultiplepmidsusingpubmed: function (req, res) {
        resolvemultiplepmidsusingpubmed.resolvemultiplepmidsusingpubmedModule(req)
            .then(function (data) {
                res.status(200).json(data.message).end();
            })
            .catch(function (e) {
                res.status(500).json({ "reason": "JSON input supplied is not properly structured." }).end();
            });
    },
    resolvemultiplepmidsusingpubmedModule: function (param, updateStatus) {
        return new Promise(function (resolve, reject) {
            if(updateStatus){
                param['body'] = param;
            }
            var data = "";
            if (JSON.parse(param.body.data)) {
                data = JSON.parse(param.body.data).YetToBeResolved;
            }
            else {
                reject({ "reason": "JSON input supplied is not properly structured." });
            }
            var CreatedPubmedURLdata = CreatedPubmedURL(data);
            var dataInfo = CreatedPubmedURLdata.dataInfo;
            dataInfo=xform.encode(dataInfo);
            var indexListSeperatedByComma = CreatedPubmedURLdata.indexListSeperatedBYComma;
            var url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&api_key=80e7e63d06de8fb27a5392b52a6acaec7b09&retmode=unixref&bdata=" + dataInfo;
            console.log(url);
            u = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
            u.requestData('GET', url, "", "", { "indexListSeperatedByComma": indexListSeperatedByComma, "reqBodyData": JSON.parse(param.body.data),"requestType":"pubmedServer" })
                .then(function (data) {
                    var dataOutput = data.message.split('\n');
                    var actualJSONDataSupplied = data.index.reqBodyData;
                    var JSONData = data.index.reqBodyData.YetToBeResolved;
                    var indexOutput = data.index.indexListSeperatedByComma.split(','), getPmidList = [];
                    var pmidList = "", indexList = "";
                    for (var i = 0; i < dataOutput.length; i++) {
                        var JSONDataI = JSONData[i];
                        if (JSONDataI != undefined)
                            Object.keys(JSONDataI).map(function (i) {
                                JSONDataI = JSONDataI[i];
                            });
                        getPmidList.push(getSinglePMIDs(dataOutput[i], JSONDataI, JSONData, actualJSONDataSupplied));
                    }
                    Q.allSettled(getPmidList).then(function (data) {
                        var JSONactualData = "";
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].state == "fulfilled") {
                                if (JSONactualData == "" && data[i] && data[i].value && data[i].value.JSONData) {
                                    JSONactualData = data[i].value.JSONData;
                                }
                                var pmid = data[i].value;
                                if (pmid.status == 200) {
                                    if (indexOutput[i])
                                        indexList += indexOutput[i] + ",";
                                    pmidList += pmid.value + ",";
                                }
                            }
                        }
                        indexList = indexList.slice(0, indexList.length - 1);
                        pmidList = pmidList.slice(0, pmidList.length - 1);
                        var path = require('path');
                        var fetchPMID = require(path.join(__dirname, 'fetchpmid.js'));
                        fetchPMID.resolveMultiplePMID(pmidList, indexList, JSONData, JSONactualData).then(function (data) {
                            var previousValidated=[];
                            if(data && data.extraData && data.extraData.SuccesfullyValidatedAndResolved)
                             previousValidated = data.extraData.SuccesfullyValidatedAndResolved;
                            for (var k = 0; k < previousValidated.length; k++) {
                                data.finalpubmedJSONList.push(previousValidated[k]);
                            }
                            resolve({"status":200, 'message':{ "YetToBeResolved": data.yetToBeResolved, "FailedInputs": data.extraData.FailedInputs, "SuccesfullyValidatedAndResolved": data.finalpubmedJSONList, "InputConvertedToBSJson": data.extraData.InputConvertedToBSJson, "InputSupplied": data.extraData.InputSupplied, "status": "succesfully validated." }});
                            return;
                        });


                    }).catch(function (e) {

                    });

                    console.log();
                });
        });
    }

}
function getSinglePMIDs(data, JSONDataI, JSONData, actualJSONDataSupplied) {
    return new Promise(function (resolve, reject) {
        if (data == undefined || data == "" || JSONDataI == undefined || JSONDataI == "") {
            resolve({ status: 500, "value": "failed to resolve the pmid" });
            return;
        }
        try {
            var fields = data.split('|');
            if (fields && fields[6] && fields[6][0] == 'A' && fields[6][10] != '(') {
                var fields = fields[6].split(' ');
                var fields = fields[1].split(',');
                //check if the numbers are pmid else resolve it because sometimes thre return values are "AMBIGOUS (6 CITATIONS)"
                var numbers = /^\d+$/;
                if (numbers.test(fields[0])) {
                    var finalPMIDS = crossrefComp.resolve_multiple_pmids(fields, JSONDataI, actualJSONDataSupplied);
                    finalPMIDS.then(function (pmid) {
                        // var pmidss=pmid.split(',');
                        // if(pmid.length2)
                        if (pmid.status == 200) {
                            if (pmid.value[0] == "MULTIPLE") {
                                resolve({ status: 500, "value": "failed to resolve the multiple pmid input obtained from pubmed.", "pmids": pmid });
                                return;
                            }
                            var reg = /^\d+$/;
                            if (reg.test(pmid.value)) {

                                resolve({ status: 200, "value": pmid.value, "JSONData": pmid.JSONList });
                                return;
                            } else {
                                resolve({ status: 500, "value": "failed to resolve the pmid", "JSONData": pmid.JSONList });
                                return;
                            }
                        } else {
                            resolve({ status: 500, "value": "failed to resolve the pmid", "JSONData": pmid.JSONList });
                            return;

                        }

                    }).catch(function (e) {
                        resolve({ status: 500, "value": "failed to resolve the pmid", "JSONData": actualJSONDataSupplied });
                        return;
                    });
                } else {
                    resolve({ status: 500, "value": "failed to resolve the pmid", "JSONData": actualJSONDataSupplied });
                    return;
                }
            } else if ((fields && fields[6] && (fields[6][0] == 'N' || fields[6][10] == '(')) || (fields.length == 1)) {
                //resolve using crossref
                resolve({ status: 500, "value": "failed to resolve the pmid", "JSONData": actualJSONDataSupplied });
                return;
            } else {
                pmid = fields[6];
                resolve({ status: 200, "value": pmid, "JSONData": actualJSONDataSupplied });
                return;
            }
            //////////////////////////
        } catch (error) {
            resolve({ status: 500, "value": "failed to resolve the pmid", "JSONData": actualJSONDataSupplied });
            return;
        }
    });
}
function CreatedPubmedURL(JSONCollection) {
    var dataInfo = "", indexListSeperatedByComma = "";
    for (var i = 0; i < JSONCollection.length; i++) {
        var JSONData = JSONCollection[i];
        Object.keys(JSONData).map(function (s) {
            indexListSeperatedByComma += s + ",";

            var JSONdata = JSONData[s];
            var container;
            if (JSONdata['journalAbbreviation']) {
                container = JSONdata['journalAbbreviation'];
            } else if(JSONdata['container-title-short']) {
                container = JSONdata['container-title-short'];
            }else if (JSONdata['RefConfTitle']) {
                container = JSONdata['RefConfTitle'];
            } else if (JSONdata['RefBookTitle']) {
                container = JSONdata['RefBookTitle'];
            }else if(JSONdata['container-title'])
            {
                container = JSONdata['container-title'];
            }
            if (JSONdata.author && JSONdata.author.length)
                for (var i = 0; i < JSONdata.author.length; i++) {
                    var s = JSONdata.author[i];
                    /*
                    s=s.replace('<span class="RefSurname">',"");
                    s=s.replace('<span class="RefGivenname">',"");
                    s=s.replace("</span>"," ");
                    s=s.replace("</span>","");
                    */
                    JSONdata.author[i] = s;
                }
            if (container) {
                dataInfo = dataInfo + container + "|";
            }
            else {
                dataInfo = dataInfo + "|";
            }

            if (JSONdata.RefYear) {
                dataInfo = dataInfo + JSONdata.RefYear + "|";
            }
            else if(JSONdata.issued && JSONdata.issued["date-parts"] && JSONdata.issued["date-parts"][0]) {
                var sIssue=JSONdata.issued["date-parts"][0];
                if(sIssue && sIssue[0])
                dataInfo = dataInfo +sIssue[0]+ "|";


            }else{
                dataInfo = dataInfo + "|";
            }



            if (JSONdata.volume) {
                dataInfo = dataInfo + JSONdata.volume + "|";
            }
            else {
                dataInfo = dataInfo + "|";
            }
            
            if(JSONdata["page"]){
                try{
                let regex=new RegExp("([a-zA-Z0-9]*)([-:])([a-zA-Z0-9]*)");
                                let pageArray=regex.exec(JSONdata["page"].replace(/–/g,'-'));
                                if(pageArray.length==4)
                                {
                                    JSONdata["page-first"]=pageArray[1];
                                    JSONdata["page-last"]=pageArray[3];
                                }
                            }catch(e)
                            {
                                //nothing coz its not imp
                            }
            }

            if (JSONdata["page-first"]) {
                dataInfo = dataInfo + JSONdata["page-first"] + "|";
            }else
            {
                dataInfo = dataInfo + "|";
            }

            if (JSONdata && JSONdata.author && JSONdata.author[0]) {
                //regex .replace(/\.|[0-9]/g,''); checks if the name has any dots or number then it replaces it with '' since pubmed url fails if thats present.
                dataInfo = dataInfo + (JSONdata.author[0].family + " " + JSONdata.author[0].given).replace(/\.|[0-9]/g,'');
            }
        });
        dataInfo = dataInfo + "|Exeter|%0D";
    }
    indexListSeperatedByComma = indexListSeperatedByComma.slice(0, indexListSeperatedByComma.length - 1);
    dataInfo = dataInfo.slice(0, dataInfo.length - 3);
    
    dataInfo = dataInfo.replace(/&amp;/ig, 'and');
    dataInfo=dataInfo.split("%0D");
    dataInfo=dataInfo.join("\n");
    return { "dataInfo": dataInfo, "indexListSeperatedBYComma": indexListSeperatedByComma };

}
module.exports = resolvemultiplepmidsusingpubmed;
