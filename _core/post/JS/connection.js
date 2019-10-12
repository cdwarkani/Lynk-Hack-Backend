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
    },
    volunteerinsert: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            connection.getConnection(function (err) {
                var queryValue = "INSERT INTO `LynkHack`.`Volunteer` ( `PhoneNo`, `Name`, `Address`, `Latitude`, `Longitude`, `AreaID`, `createdOn`, `updatedOn`, `ipAddress`, `isActive`) VALUES (";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }

                if (data.phoneNo) {
                    queryValue += "'" + data.phoneNo+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No phoneNo field found" });
                        connection.end();
                        return;
                    
                }

                if (data.Name) {
                    queryValue += "'" + data.Name+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Name field found" });
                        connection.end();
                        return;
                    
                }

                if (data.Address) {
                    queryValue += "'" + data.Address+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Address field found" });
                        connection.end();
                        return;
                    
                }

                if (data.Latitude) {
                    queryValue += "'" + data.Latitude+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Latitude field found" });
                        connection.end();
                        return;
                    
                }
                if (data.Longitude) {
                    queryValue += "'" + data.Longitude+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Longitude field found" });
                        connection.end();
                        return;
                    
                }

                if (data.AreaID) {
                    queryValue += "'" + data.AreaID+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No AreaID field found" });
                        connection.end();
                        return;
                    
                }
                queryValue += "'2019-01-01 00:00:00','2019-01-01 00:00:00','1.1.1.1','1')";
            

                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    if (result) {
                        resolve({ "status": 200, "data": result, "isNewUser": false, "isSuccess": true });
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
    },
    creategroup: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'LynkHack'
            });
            connection.getConnection(function (err) {
                var queryValue = "INSERT INTO `LynkHack`.`Groups` (`VolunteerID`, `AreaID`, `Name`, `Description`, `Members`, `link`, `createdOn`, `updatedOn`, `isCompleted`, `isActive`) VALUES (";
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }

                if (data.VolunteerID) {
                    queryValue += "'" + data.VolunteerID+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No VolunteerID field found" });
                        connection.end();
                        return;
                    
                }

                if (data.AreaID) {
                    queryValue += "'" + data.AreaID+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No AreaID field found" });
                        connection.end();
                        return;
                    
                }

                if (data.Name) {
                    queryValue += "'" + data.Name+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Name field found" });
                        connection.end();
                        return;
                    
                }

                if (data.Description) {
                    queryValue += "'" + data.Description+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Description field found" });
                        connection.end();
                        return;
                    
                }
                if (data.Members) {
                    queryValue += "'" + data.Members+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No Members field found" });
                        connection.end();
                        return;
                    
                }

                if (data.link) {
                    queryValue += "'" + data.link+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No AreaID field found" });
                        connection.end();
                        return;
                    
                }
                queryValue += "'2019-01-01 00:00:00','2019-01-01 00:00:00'";
                if (data.isCompleted) {
                    queryValue += ",'" + data.isCompleted+"',";
                }else
                {
                        resolve({ "status": 400, "error": "No isCompleted field found" });
                        connection.end();
                        return;
                    
                }
                queryValue += "'1')";
            

                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    if (result) {
                        resolve({ "status": 200, "data": result, "isSuccess": true });
                    }
                    connection.end();
                    return;

                });
            });


        });
    }


}