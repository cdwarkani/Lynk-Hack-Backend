var path = require('path');
var exec = require('child_process').exec;
const fs = require('fs');
var parser = require('xml2json');
var message = "Succesfully Trained.";
var convert = require('xml-js');
var Template = require('./Json/jatstotrainingxml.json');
var TemplateCSL = require('./Json/customizedcsl.json');
var jatsconverter = {
    checkstatus: function () {
        return message;
    }, jatsconverter: function (req, res) {
        this.anystylemodule(req)
            .then(function (data) {
                res.status(200).json(data).end();
            })
            .catch(function (err) {
                res.status(400).json("Something unexpectedly went wrong").end();
            });

    },
    anystylemodule: function (req, param) {
        return new Promise(function (resolve, reject) {
            try {
                var result1 = convert.xml2json(req.body.text, { compact: false, spaces: 4 });
                var result1 = convertjatstoBiblioJSON(result1);
                var options = { compact: false, ignoreComment: true, spaces: 4 };
                if (result1 instanceof Array) {
                    var result = "";
                    for (var ir = 0; ir < result1.length; ir++) {
                        result += "<sequence>" + convert.json2xml(result1[ir], options) + "</sequence>";
                    }

                } else {
                    var result = "<sequence>" + convert.json2xml(result1, options) + "</sequence>";
                }
                resolve({ "data": result1, "index": "param", "xml": result, "XMLArray": "XMLArray" });
            } catch (e) {
                reject(e)
            }
        });


    }


}
function convertjatstoBiblioJSON(result1) {
    result1 = JSON.parse(result1);

    if (result1["elements"][0]["name"] != "data" && result1["elements"][0]["elements"].length == 2) {
        var Data = result1["elements"][0]["elements"][1];
        var actualData = result1["elements"][0]["elements"][1]["elements"];
        var Data = convertJatsOneRed(result1["elements"][0]);
        return Data;
    } else {
        var output = [];
        var multipleJats = result1["elements"][0]["elements"];
        for (var ki = 0; ki < multipleJats.length; ki++) {
            output.push(convertJatsOneRed(multipleJats[ki]));
        }
    }
    return output;
}
function convertJatsOneRed(result1) {
    var Data = result1["elements"][1];
    if (Data["attributes"] && Data["attributes"]["publication-type"]) {
        type = Data["attributes"]["publication-type"];
    }
    var actualData = result1["elements"][1]["elements"];
    var page = "";
    for (var i = 0; i < actualData.length; i++) {
        if (actualData[i]) {
            if (actualData[i].name == "string-name") {
                var authorVal = "";
                var val = actualData[i]["elements"];

                for (var z = 0; z < val.length; z++) {
                    if (val[z] && val[z]["elements"] && val[z]["elements"][0] && val[z]["elements"][0].text) {
                        if (z == 0)
                            {authorVal += val[z]["elements"][0].text;
                    }
                        else
                            {
                                authorVal +=" "+ val[z]["elements"][0].text;
                            }


                    } else if (val[z] && val[z].text) {
                        authorVal += val[z].text;
                    }
                    console.log();
                }

                if (actualData[i] && actualData[i]["attributes"] && actualData[i]["attributes"]["person-group-type"]) {
                    if (actualData[i]["attributes"]["person-group-type"] == "author") {
                        actualData[i].name = "author";
                    } else if (actualData[i]["attributes"]["person-group-type"] == "editor") {
                        actualData[i].name = "editor";
                    }
                } else if (actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0] && actualData[i]["elements"][0]["name"] == "collab") {
                    actualData[i].name = "literal";
                }
                actualData[i]["name"] ="author";
                actualData[i]["elements"] = [];
                actualData[i]["elements"].push({ "type": "text", "text": authorVal })


            }
            else if (actualData[i].name) {
                if (actualData[i].name == "x") {
                    if (actualData[i + 1] && actualData[i + 1].name && actualData[i + 1].name == "year" && actualData[i + 1]["elements"] && actualData[i + 1]["elements"][0] && actualData[i + 1]["elements"][0]["text"] && actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0].text) {
                        actualData[i + 1]["elements"][0]["text"] = actualData[i]["elements"][0]["text"] + actualData[i + 1]["elements"][0]["text"];
                    }
                    else if (actualData[i + 1] && actualData[i + 1].name && actualData[i + 1].name == "issue" && actualData[i + 1]["elements"] && actualData[i + 1]["elements"][0] && actualData[i + 1]["elements"][0]["text"] && actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0].text) {
                        actualData[i + 1]["elements"][0]["text"] = actualData[i]["elements"][0]["text"] + actualData[i + 1]["elements"][0]["text"];
                    } else {
                        if (i > 0 && actualData[i - 1] && actualData[i - 1]["elements"] && actualData[i - 1]["elements"][0] && actualData[i - 1]["elements"][0].text && actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0].text) {
                            //console.log(actualData[i-1]["elements"][0].text);
                            actualData[i - 1]["elements"][0].text += actualData[i]["elements"][0].text;
                        }
                    }
                    delete actualData[i];

                }
                else if (actualData[i].name == "pub-id") {
                    if (actualData[i]["attributes"] && actualData[i]["attributes"]["pub-id-type"]) {
                        actualData[i].name = actualData[i]["attributes"]["pub-id-type"];
                    } else {
                        actualData[i].name = Template[actualData[i].name];
                    }

                } else if (actualData[i].name == "volume") {
                    if (actualData[i]["attributes"] && actualData[i]["attributes"]["pub-id-type"]) {
                        actualData[i].name = actualData[i]["attributes"]["pub-id-type"];
                    } else {
                        actualData[i].name = Template[actualData[i].name];
                    }

                } else if (actualData[i].name == "fpage" && actualData[i + 1] && actualData[i + 1].name == "x" && actualData[i + 2] && actualData[i + 2].name == "lpage") {
                    if (actualData[i + 2]["elements"] && actualData[i + 2]["elements"][0] && actualData[i + 2]["elements"][0].text && actualData[i + 1]["elements"] && actualData[i + 1]["elements"][0] && actualData[i + 1]["elements"][0].text)
                        actualData[i].name = "pages";
                    actualData[i]["elements"][0].text = actualData[i]["elements"][0].text + actualData[i + 1]["elements"][0].text + actualData[i + 2]["elements"][0].text;
                    delete actualData[i + 1];
                    delete actualData[i + 2];
                    if (actualData[i + 3] && actualData[i + 3].name && actualData[i + 3].name == "x" && actualData[i + 3]["elements"] && actualData[i + 3]["elements"][0] && actualData[i + 3]["elements"][0].text) {
                        actualData[i]["elements"][0].text = actualData[i]["elements"][0].text + actualData[i + 3]["elements"][0].text;
                        delete actualData[i + 3];
                    }
                } else if (actualData[i].name && actualData[i].name == "year") {
                    if (actualData[i + 1] && actualData[i + 1].name == "x" && actualData[i + 2] && actualData[i + 2].name == "month" && actualData[i + 3] && actualData[i + 3].name == "x" && actualData[i + 4] && actualData[i + 4].name == "day" && actualData[i + 5] && actualData[i + 5].name == "x") {
                        if (actualData[i + 2]["elements"] && actualData[i + 2]["elements"][0] && actualData[i + 2]["elements"][0].text && actualData[i + 1]["elements"] && actualData[i + 1]["elements"][0] && actualData[i + 1]["elements"][0].text)
                            actualData[i].name = "date";
                        if (!actualData[i + 1]["elements"]) {
                            actualData[i + 1]["elements"] = [];
                            actualData[i + 1]["elements"].push({ "text": " " });

                        }
                        if (!actualData[i + 3]["elements"]) {
                            actualData[i + 3]["elements"] = [];
                            actualData[i + 3]["elements"].push({ "text": " " });
                        }
                        if (!actualData[i + 5]["elements"]) {
                            actualData[i + 5]["elements"] = [];
                            actualData[i + 5]["elements"].push({ "text": " " });
                        }
                        actualData[i]["elements"][0].text = actualData[i]["elements"][0].text + actualData[i + 1]["elements"][0].text + actualData[i + 2]["elements"][0].text + actualData[i + 3]["elements"][0].text + actualData[i + 4]["elements"][0].text + actualData[i + 5]["elements"][0].text;

                        delete actualData[i + 1];
                        delete actualData[i + 2];
                        delete actualData[i + 3];
                        delete actualData[i + 4];
                        delete actualData[i + 5];
                    } else {
                        actualData[i].name = Template[actualData[i].name];
                    }
                } else if (actualData[i].name && Template[actualData[i].name]) {
                    actualData[i].name = Template[actualData[i].name];
                }


            }

            if (actualData[i] != undefined)
                delete actualData[i].attributes;
        }
    }

    Data["elements"] = actualData;
    return Data;

}
module.exports = jatsconverter;




/*
jats converter for benjamin

function convertJatsOneRed(result1) {
    var Data = result1["elements"][1];
    if(Data["attributes"] && Data["attributes"]["publication-type"] )
    { 
        type=Data["attributes"]["publication-type"] ;
    }
    var actualData = result1["elements"][1]["elements"];
    var page = "";
    for (var i = 0; i < actualData.length; i++) {
        if (actualData[i]){
        if (actualData[i].name == "person-group") {
            var authorVal = "";
            var authorEle = actualData[i]["elements"];
            for (var k = 0; k < authorEle.length; k++) {
                var val = authorEle[k]["elements"];
                for (var z = 0; z < val.length; z++) {
                    if (val[z] && val[z]["elements"] && val[z]["elements"][0] && val[z]["elements"][0].text) {

                        authorVal += val[z]["elements"][0].text;


                    } else if (val[z] && val[z].text) {
                        authorVal += val[z].text;
                    }
                    console.log();
                }
            }
            if (actualData[i] && actualData[i]["attributes"] && actualData[i]["attributes"]["person-group-type"]) {
                if (actualData[i]["attributes"]["person-group-type"] == "author") {
                    actualData[i].name = "author";
                } else if (actualData[i]["attributes"]["person-group-type"] == "editor") {
                    actualData[i].name = "editor";
                }
            } else if (actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0] && actualData[i]["elements"][0]["name"] == "collab") {
                actualData[i].name = "literal";
            }
            actualData[i]["elements"] = [];
            actualData[i]["elements"].push({ "type": "text", "text": authorVal })


        }
        else if (actualData[i].name) {
            if (actualData[i].name == "x") {
                if (actualData[i + 1] && actualData[i + 1].name && actualData[i + 1].name == "year" && actualData[i + 1]["elements"] && actualData[i + 1]["elements"][0] && actualData[i + 1]["elements"][0]["text"] && actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0].text) {
                    actualData[i + 1]["elements"][0]["text"] = actualData[i]["elements"][0]["text"] + actualData[i + 1]["elements"][0]["text"];
                }
                else if (actualData[i + 1] && actualData[i + 1].name && actualData[i + 1].name == "issue" && actualData[i + 1]["elements"] && actualData[i + 1]["elements"][0] && actualData[i + 1]["elements"][0]["text"] && actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0].text) {
                    actualData[i + 1]["elements"][0]["text"] = actualData[i]["elements"][0]["text"] + actualData[i + 1]["elements"][0]["text"];
                } else {
                    if (i > 0 && actualData[i - 1] && actualData[i - 1]["elements"] && actualData[i - 1]["elements"][0] && actualData[i - 1]["elements"][0].text && actualData[i] && actualData[i]["elements"] && actualData[i]["elements"][0] && actualData[i]["elements"][0].text) {
                        //console.log(actualData[i-1]["elements"][0].text);
                        actualData[i - 1]["elements"][0].text += actualData[i]["elements"][0].text;
                    }
                }
                delete actualData[i];

            }
            else if (actualData[i].name == "pub-id") {
                if (actualData[i]["attributes"] && actualData[i]["attributes"]["pub-id-type"]) {
                    actualData[i].name = actualData[i]["attributes"]["pub-id-type"];
                } else {
                    actualData[i].name = Template[actualData[i].name];
                }

            }  else if (actualData[i].name == "volume") {
                if (actualData[i]["attributes"] && actualData[i]["attributes"]["pub-id-type"]) {
                    actualData[i].name = actualData[i]["attributes"]["pub-id-type"];
                } else {
                    actualData[i].name = Template[actualData[i].name];
                }

            } else if( actualData[i].name=="fpage" && actualData[i+1] && actualData[i+1].name=="x" &&  actualData[i+2] && actualData[i+2].name=="lpage" ){
            if(actualData[i+2]["elements"] && actualData[i+2]["elements"][0] && actualData[i+2]["elements"][0].text && actualData[i+1]["elements"] && actualData[i+1]["elements"][0] &&  actualData[i+1]["elements"][0].text  )
            actualData[i].name="pages";
            actualData[i]["elements"][0].text=actualData[i]["elements"][0].text+actualData[i+1]["elements"][0].text+actualData[i+2]["elements"][0].text;
            delete actualData[i+1];
            delete actualData[i+2];
            if(actualData[i+3] && actualData[i+3].name && actualData[i+3].name=="x" && actualData[i+3]["elements"] && actualData[i+3]["elements"][0] && actualData[i+3]["elements"][0].text )
            {
                actualData[i]["elements"][0].text=actualData[i]["elements"][0].text+actualData[i+3]["elements"][0].text;
                delete actualData[i+3];
            }
            } else if( actualData[i].name && actualData[i].name=="year"){
                 if( actualData[i+1] && actualData[i+1].name=="x" && actualData[i+2] && actualData[i+2].name=="month" && actualData[i+3] && actualData[i+3].name=="x" && actualData[i+4] && actualData[i+4].name=="day" && actualData[i+5] && actualData[i+5].name=="x"  ){
                    if(actualData[i+2]["elements"] && actualData[i+2]["elements"][0] && actualData[i+2]["elements"][0].text && actualData[i+1]["elements"] && actualData[i+1]["elements"][0] &&  actualData[i+1]["elements"][0].text  )
                    actualData[i].name="date";
                    if(!actualData[i+1]["elements"])
                    {
                        actualData[i+1]["elements"]=[];
                        actualData[i+1]["elements"].push({"text":" "});
                    
                    }
                    if(!actualData[i+3]["elements"])
                    {
                        actualData[i+3]["elements"]=[];
                        actualData[i+3]["elements"].push({"text":" "});
                    }
                    if(!actualData[i+5]["elements"])
                    {
                        actualData[i+5]["elements"]=[];
                        actualData[i+5]["elements"].push({"text":" "});
                    }
                    actualData[i]["elements"][0].text=actualData[i]["elements"][0].text+actualData[i+1]["elements"][0].text+actualData[i+2]["elements"][0].text+actualData[i+3]["elements"][0].text+actualData[i+4]["elements"][0].text+actualData[i+5]["elements"][0].text;
                    
                    delete actualData[i+1];
                    delete actualData[i+2];
                    delete actualData[i+3];
                    delete actualData[i+4];
                    delete actualData[i+5];
                    }else
                    {
                        actualData[i].name = Template[actualData[i].name];
                    }
            }else if( actualData[i].name && Template[actualData[i].name]){
                actualData[i].name = Template[actualData[i].name];
            }


        }

        if (actualData[i] != undefined)
            delete actualData[i].attributes;
    }
    }

    Data["elements"] = actualData;
    return Data;

}


*/