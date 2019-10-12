var Q = require('q');
var fs = require('fs');
var parser = require('xml2json');
var path = require('path');
var sleep = require('thread-sleep');
var outcount = 0;
var errorFormatter = require(path.join(__dirname, '..', 'post', 'JS', 'errorFormatter.js'));
module.exports = {
    multiplevalidate: function (req, res, wfXML) {
        outcount = 0;
       
        var listcol = [];
        var datastring = [];
        var listData = req.body.data.split("},{");
        //comment from here in case of req.body.data as json input

        if (listData.length == 1) {
            datastring.push(listData[0].substr(2, listData[0].length - 4));
        } else {
            listData[0] = listData[0].substr(2, listData[0].length);
            listData[listData.length - 1] = listData[listData.length - 1].substr(0, listData[listData.length - 1].length - 2)

            for (var i = 0; i < listData.length; i++) {
                datastring.push(listData[i]);
            }
        }
        // comment till here


        /*
        if direct array is beign sent from input then please use this.
        for(var i=0;i<req.body.data.length;i++)
                    {
                        datastring.push(req.body.data[i]);
                    }
        */

        
        // load all the values in datastring variables
        //The below functions helps us to pipleline our request to handle server limitation of 10 tps.
        (function (k, req, listcol, Q, count) {
            count++;
            if (k < datastring.length) {
                // call the function.
                listcol.push(validateMultipleRef(datastring[k], req.body.style, req.body.locale, "html", req.body.refJournalType, true, k));


                // The currently executing function which is an anonymous function.
                var caller = arguments.callee;
                setTimeout(function () {
                    // the caller and the count variables are
                    // captured in a closure as they are defined
                    // in the outside scope.
                    //caller is a reccursive function which helps to pipleline the request in order to handle the server limitation of 10 tps.
                    caller(k + 1, req, listcol, Q, count);
                }, 1000);
            }
            if (count == datastring.length) {
                Q.allSettled(listcol).then(function (data) {
                    res.status(200).json({ "data": data }).end();
                });

            }
        })(0, req, listcol, Q, 0);
    }
}
    function validateMultipleRef(reference, style, locale, type, refJournalType, flag, index) {
        return new Promise(function (resolve, reject) {
        try {
            var us = require(path.join(__dirname, '..', 'post', 'JS', 'urest.js'));
            var head = { "Content-Type": "application/x-www-form-urlencoded" };
            us.requestData('post', 'http://localhost:3000/api/validate', head, { 'data': reference, 'pre': "", 'post': "", "locale": locale, "style": style, "type": type, "refJournalType": refJournalType, "index": index, "flag": "true" }).catch(function (error) {
                ////console.log("error");
                resolve(error);
                return;
            }).then(function (data) {
                outcount++;
              //  console.log("out count " + outcount + " with index " + data.message.status.message.data[0].index);
                resolve(data);
                return;

            });
            setTimeout(function() {
                console.log("timeout boss" + index);
                reject('{Promise timed out after ' + '12000' + ' ms}');
            }, 16000);

        }
        catch (e) {

            resolve(e);
            return;
        }
    });
}
