var unirest = require('unirest');
var errorFormatter = require('./errorFormatter.js');
const Entities = require('html-entities').XmlEntities;
var pubmedServerRateLimit = 6;
var pubmedServerDelayBetweenRequest = 5000;// In miliseconds
const entities = new Entities();
var reqCount = 0;
var reqCount2 = 0;
var path = require('path');
var locks = require('locks');
var locks2 = require('locks');
var mutex = locks.createMutex();
var mutex2 = locks2.createMutex();
var validationstatus=require(path.join(__dirname, '..', 'validateusingfetchpmidandresolvemultiplepmid.js'));
var urest = {
    /**
     * general method to do GET|POST, etc
     * @param {String} method GET|POST
     * @param {String} url url to get or post data
     * @param {Object} headers optional - headers to set
     * @param {*} data any data to be passed
     */
    requestData: function (method, url, headers, data, pos) {
        return new Promise(function (resolve, reject) {
            if (!method || !url) {
                reject(errorFormatter.errorFormatter(500, 'unknown method or incorrect url', 'unknown method or incorrect url'));
                return;
            }
            method = method.toLowerCase();
            try {
                if (method == 'get') {
                    if (url == "type1") {
                        resolve({ 'status': 400, 'message': "url has no info", 'index': pos });
                        return;
                    } else if (pos && pos.requestType == "pubmedServer") {
                        mutex.lock(function () {

                            reqCount++;
                            var validationstatus=require(path.join(__dirname, '..', 'validateusingfetchpmidandresolvemultiplepmid.js'));
                          

                            if (reqCount % pubmedServerRateLimit == 0) {
                                console.log("rateLimit");
                            } setTimeout(function(){ 
                                    mutex.unlock();
                                }, 150);
                                
                                //  sleep(pubmedServerDelayBetweenRequest);
                                if(validationstatus && validationstatus.validationStatus=="false")
                                {
                                    resolve({ 'status': 400, 'message': "opted out from validation", 'index': pos });
                                    return;
                                }
                            unirest.get(url).end(function (resp) {
                                if (resp.error) {
                                    resolve({ 'status': resp.status, 'message': resp.error.message, 'index': pos });
                                    return;
                                }
                                else {
                                    resolve({ 'status': resp.status, 'message': entities.decode(resp.body), 'index': pos, "inputinfo": JSON.stringify(pos) });
                                    return;
                                }
                            });
                            // do stuff
                            
                           
                        });

                    }else if (pos && pos.requestType == "CrossRefServer") {
                       
                        mutex2.lock(function () {

                            reqCount2++;
                            if (reqCount2 % pubmedServerRateLimit == 0) {
                                console.log("rateLimitCrossref");
                            }
                             setTimeout(function(){ 
                                    mutex2.unlock();
                                }, 100);
                           console.log(url);
                        unirest.get(url).end(function (resp) {
                            if (resp.error) {
                                resolve({ 'status': resp.status, 'message': resp.error.message, 'index': pos });
                                return;
                            }
                            else {
                                resolve({ 'status': resp.status, 'message': resp.body, 'index': pos.index, "inputinfo": pos });
                                return;
                            }
                        });
                            // do stuff
                            
                           
                    });
                    }
                    else {

                        unirest.get(url).end(function (resp) {
                            if (resp.error) {
                                resolve({ 'status': resp.status, 'message': resp.error.message, 'index': pos });
                                return;
                            }
                            else {
                                resolve({ 'status': resp.status, 'message': entities.decode(resp.body), 'index': pos, "inputinfo": JSON.stringify(pos) });
                                return;
                            }
                        });
                    }

                }
                else if (method == 'post') {
                    unirest.post(url)
                        .header(headers).send(data).end(function (response) {


                            resolve({ 'status': response.status, 'message': response.body, 'index': pos });
                            return;

                        });
                    return;
                }
                else {
                    resolve('unknown method');
                    return;
                }
            }
            catch (error) {
                reject(errorFormatter.errorFormatter(500, error, 'unknown method or incorrect url'));
                return;
            }
        })
    }
}
module.exports = urest;
