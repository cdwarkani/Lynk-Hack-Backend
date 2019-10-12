var mysql = require('mysql');

module.exports = {
    volunteerauth: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            
            connection.getConnection(function (err) {
                var queryValue = "select * from Volunteer";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }
                if (data.phoneNo) {
                    queryValue += " where PhoneNo = " + data.phoneNo;
                }else
                {
                        resolve({ "status": 400, "error": "No phoneNo field found" });
                        connection.end();
                        return;
                    
                }
                if (data.lowLimit && data.HighLimit) {
                    queryValue += " LIMIT " + data.lowLimit + "," + data.HighLimit;
                }

                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    if (result.length && result.length > 0) {
                        resolve({ "status": 200, "data": result, "isNewUser": false, "isSuccess": true });
                    } else {
                        resolve({ "status": 200, "isNewUser": true, "isSuccess": true });
                    }


                    connection.end();
                    return;

                });
            });


        });
    }, volunteerinsert: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            connection.getConnection(function (err) {
                var queryValue = "select * from Volunteer";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }
                if (data.phoneNo) {
                    queryValue += " where PhoneNo = " + data.phoneNo;
                }else
                {
                        resolve({ "status": 400, "error": "No phoneNo field found" });
                        connection.end();
                        return;
                    
                }
                if (data.lowLimit && data.HighLimit) {
                    queryValue += " LIMIT " + data.lowLimit + "," + data.HighLimit;
                }

                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    if (result.length && result.length > 0) {
                        resolve({ "status": 200, "data": result, "isNewUser": false, "isSuccess": true });
                    } else {
                        resolve({ "status": 200, "isNewUser": true, "isSuccess": true });
                    }


                    connection.end();
                    return;

                });
            });


        });
    },getstates: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            
            connection.getConnection(function (err) {
                var queryValue = "select * from States";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }
                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    resolve({ "status": 200, "data": result,  "isSuccess": true });
              
                    connection.end();
                    return;

                });
            });


        });
    },getcities: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            
            connection.getConnection(function (err) {
                var queryValue = "select * from City";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }
                if (data.StateID) {
                    queryValue += " where StateID = " + data.StateID;
                }else
                {
                        resolve({ "status": 400, "error": "No StateID field found" });
                        connection.end();
                        return;
                    
                }
                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    resolve({ "status": 200, "data": result,  "isSuccess": true });
              
                    connection.end();
                    return;

                });
            });


        });
    },getareas: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            
            connection.getConnection(function (err) {
                var queryValue = "select * from Areas";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }
                if (data.CityID) {
                    queryValue += " where CityID = " + data.CityID;
                }else
                {
                        resolve({ "status": 400, "error": "No CityID field found" });
                        connection.end();
                        return;
                    
                }
                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    resolve({ "status": 200, "data": result,  "isSuccess": true });
              
                    connection.end();
                    return;

                });
            });


        });
    }


}