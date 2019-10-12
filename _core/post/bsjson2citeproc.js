var Q = require('q');
var path = require('path');
var us = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
var getFormattedRef = require(path.join(__dirname, '..', 'post', 'JS', 'getFormattedRef.js'));
var json2citeproc = {
    bsjson2citeproc: function (req, res) {
        json2citeproc.bsjson2citeprocModule(req)
            .then(function (data) {
                res.status(200).json(data).end();
            })
            .catch(function () {
                res.status(500).json({ "reason": "Failed in while converting to json to citeproc." }).end();
            });
    },
    bsjson2citeprocModule: function (inputDatas, updateStatus) {
        return new Promise(function (resolve, reject) {
            var data = "", titleTrueCase = [];
            console.log('reached');
            let inputData=inputDatas;
            if(inputData.body == undefined && updateStatus){
                inputData['body'] = inputData;
            }
            if (inputData.body && JSON.parse(inputData.body.data)) {
                data = JSON.parse(inputData.body.data);
            }else {
                reject({ "reason": "JSON input supplied is not properly structured." });
                return;
            }
            var InputData = [], indexOfInputData = [], isValidated = [];
            var JSONData = data.SuccesfullyValidatedAndResolved;
            var InputConvertedToBSJson = data.InputConvertedToBSJson;
            if(data && data.SuccesfullyValidatedAndResolved)
            {
            for (var i = 0; i < JSONData.length; i++) {
                var JSONDatas = JSONData[i];
                isValidated.push(true);
                Object.keys(JSONDatas).map(function (s) {
                    Object.keys(InputConvertedToBSJson).map(function (sindex) {
                        var FirstInputConvertedToBSJson = InputConvertedToBSJson[sindex];
                        //this is always o(1) time.
                        var out = Object.keys(FirstInputConvertedToBSJson).map(function (sindexfirst) {
                            var actualJsonD = FirstInputConvertedToBSJson[sindexfirst];
                            if (sindexfirst == s) {
                                if (actualJsonD["type"]) {
                                    JSONDatas[s]["type"] = actualJsonD["type"];
                                    if(actualJsonD["type"]=="book")
                                    {
                                        console.log();
                                    }
                                    JSONDatas[s]["prefixForStyled"] = actualJsonD["prefixForStyled"];
                                    JSONDatas[s]["suffixForStyled"] = actualJsonD["suffixForStyled"];

                                }
                            }
                        });
                    });
                    InputData.push(JSONDatas[s]);//the input jsomn data are stored seperately in array
                    if (JSONDatas[s].title) {
                        titleTrueCase.push(JSONDatas[s].title);//creating inputs for sending to truecaser api
                    } else {
                        titleTrueCase.push("");
                    }
                    indexOfInputData.push(s);//storing index of all inputs
                });
            }
        }

            if(data && data.YetToBeResolved)
            {
            JSONData = data.YetToBeResolved;
            for (var i = 0; i < JSONData.length; i++) {
                var JSONDatas = JSONData[i];
                isValidated.push(false);
                Object.keys(JSONDatas).map(function (s) {
                    InputData.push(JSONDatas[s]);
                    if (JSONDatas[s].title) {
                        titleTrueCase.push(JSONDatas[s].title);
                    } else {
                        titleTrueCase.push("");
                    }
                    indexOfInputData.push(s);
                });
            }
        }else{
            data["YetToBeResolved"]=[];
            JSONData = data.YetToBeResolved;
            for (var i = 0; i < JSONData.length; i++) {
                var JSONDatas = JSONData[i];
                isValidated.push(false);
                Object.keys(JSONDatas).map(function (s) {
                    InputData.push(JSONDatas[s]);
                    if (JSONDatas[s].title) {
                        titleTrueCase.push(JSONDatas[s].title);
                    } else {
                        titleTrueCase.push("");
                    }
                    indexOfInputData.push(s);
                });
            }

        }

            truecaser(titleTrueCase.join("<END_OF_INPUT>"), { "InputData": InputData, "indexOfInputData": indexOfInputData, "data": inputData.body.data, "isValidated": isValidated, "style": inputData.body.style, "locale": inputData.body.locale })
                .then(function (output) {
                    var truecasedTitleInfo = [];
                    truecasedTitleInfo = output.value.split('<END_OF_INPUT>');
                    for (var s = 0; s < truecasedTitleInfo.length; s++) {
                        if ((truecasedTitleInfo[s].trim()) != "") {
                            if (InputData[s])
                                InputData[s].title = truecasedTitleInfo[s];
                        }
                    }
                    var styleSet=output.index.style.split(',');
                    var FinalData = [];
                    for (var i = 0; i < InputData.length; i++) {
                        if (i == 0) {
                            for(var k=0;k<styleSet.length;k++)
                            {
                            FinalData.push(generateStyledAndUnstyledData({ "Item-1": output.index.InputData[i] }, { "index": output.index.indexOfInputData[i], "data": JSON.parse(output.index.data), "isValidated": output.index.isValidated[i] },styleSet[k], output.index.locale));
                            }
                        } else {
                            for(var k=0;k<styleSet.length;k++)
                            {
                            FinalData.push(generateStyledAndUnstyledData({ "Item-1": output.index.InputData[i] }, { "index": output.index.indexOfInputData[i], "data": "", "isValidated": output.index.isValidated[i] }, styleSet[k], output.index.locale));
                            }
                        }
                    }
                    Q.allSettled(FinalData).then(function (data) {
                        
                        var dataActual=[];
                        var style=data[0].value.index.data.InputSupplied.style.split(',');;
                        for(var k=0;k<data.length;k=k+style.length)
                        {
                            var bibliostring=[];
                            for(var s=0;s<style.length;s++)
                            {
                                bibliostring.push(data[k+s]["value"]["BibliographyString"]);
                            }
                            data[k]["value"]["BibliographyString"]=bibliostring;
                            dataActual.push(data[k]);
                        }

                        var result = ProcessAndFilterFinalDatum(dataActual);
                        if(updateStatus){
                            resolve({"status":200, "message":result});
                            return;
                        }else{
                            resolve({"status":200, "message":result});
                            return;
                        }
                    });
                })
                .catch(function (e) {
                    reject({ "reason": "JSON input supplied is not properly structured." });
                    return;
                });
        });
    }
}
module.exports = json2citeproc;
function generateStyledAndUnstyledData(data, pos, style, locale) {
    return new Promise(function (resolve, reject) {
        getFormattedRef.CSLJson_to_RequiredCitation(data, style, pos, "", "", "", { "locales": locale }).then(function (result) {
            resolve(result);
        });
    });
}
function ProcessAndFilterFinalDatum(data) {
    var ValidatedAndFormatted = [], NonValidatedbutFormatted = [], FailedInputs = [], InputConvertedToBSJson = [], temporaryJSON = {};
    for (var i = 0; i < data.length; i++) {
        if (data[i].state == "fulfilled") {
            if (data[i].value.index && data[i].value.index.data != "") {
                InputConvertedToBSJson = data[i].value.index.data.InputConvertedToBSJson;
               if(data[i] && data[i].value && data[i].value.index && data[i].value.index.data && data[i].value.index.data.FailedInputs)
                FailedInputs = data[i].value.index.data.FailedInputs;


            }
            if (data[i].value && data[i].value.index && data[i].value.index.index && data[i].value.BibliographyStringUnstyled && (data[i].value.BibliographyStringUnstyled.indexOf("CSL STYLE ERROR") == -1)) {
                temporaryJSON = {};
                temporaryJSON[data[i].value.index.index] = data[i].value;
                if (data[i].value.index && data[i].value.index.isValidated) {
                    ValidatedAndFormatted.push(temporaryJSON);
                } else {
                    NonValidatedbutFormatted.push(temporaryJSON);
                }

            } else {
                temporaryJSON = {};
                temporaryJSON[data[i].value.index.index] = "Couldn't convert to desired CSL. Input suplied is insufficient to convert to desired style.";
                FailedInputs.push(temporaryJSON);
            }

        }
    }
    return { "Output": { "ValidatedAndFormatted": ValidatedAndFormatted, "NonValidatedbutFormatted": NonValidatedbutFormatted }, "FailedInputs": FailedInputs, "InputConvertedToBSJson": InputConvertedToBSJson };
}
function truecaser(input, kss) {
    return new Promise(function (resolve, reject) {
        try {
            var head = { "Content-Type": "application/json" };
            var inputSet=[];

            var truecaserInputs=[];
            inputSet=input.split("<END_OF_INPUT>");
            for(var i=0;i<inputSet.length;i++)
            {
                truecaserInputs.push(us.requestData('post', 'http://truecase.kriyadocs.com/gettruecase', head, { 'sentence': inputSet[i] }));
            
            }
            
            Q.allSettled(truecaserInputs).then(function (datas) {
                var truecaserInputsEOI="";
                for(var k=0;k<datas.length;k++)
                {
                    var data=datas[k].value;
                    if (data && data.status && data.status == 200 && data.message && data.message.sentence) {
                        truecaserInputsEOI=truecaserInputsEOI+data.message.sentence+"<END_OF_INPUT>";
                    }
                    else {
                        truecaserInputsEOI=truecaserInputsEOI+input+"<END_OF_INPUT>";
                    }
                }
                var data = { "index": kss, "value": truecaserInputsEOI };
                resolve(data);
                return;

               
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

