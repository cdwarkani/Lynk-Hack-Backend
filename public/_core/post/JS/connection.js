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
    quotes: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'Quotes'
            });
            connection.getConnection(function (err) {
                if (err) {
                    resolve({ "status": 400, "error": err });
                    connection.end();
                    return;
                }
                var queryValue = "select q.QuoteId,QuoteTag,QuoteDesc,LikeId,userId,QuoteCategoryId from Quotes as q left join UserLikes as u ON( q.quoteid=u.quoteid) ";
                var queryValue2 = "select count(*) from Quotes as q left join UserLikes as u ON( q.quoteid=u.quoteid) ";
                if (data.userId) {
                    queryValue += "AND u.userId =" + data.userId;
                    queryValue2 += "AND u.userId =" + data.userId;
                }
                if (data.QuoteCategoryId) {
                    queryValue += " where QuoteCategoryId=" + data.QuoteCategoryId;
                    queryValue2 += " where QuoteCategoryId=" + data.QuoteCategoryId;
                }
                if (data.lowLimit && data.HighLimit) {
                    queryValue += " LIMIT " + data.lowLimit + "," + data.HighLimit;
                    queryValue2 += " LIMIT " + data.lowLimit + "," + data.HighLimit;
                }
                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        connection.end();
                        return;
                    }
                    connection.query(queryValue2, function (err, result2, fields2) {
                        if (err) {
                            resolve({ "status": 400, "error": err });
                            connection.end();
                            return;
                        }
                        if (result[0] && result2 && result2[0] && result2[0]["count(*)"]) {
                            result[0]["maxCount"] = result2[0]["count(*)"];
                        }


                        if (!data.ipaddress) { data["ipaddress"] = "donno" }
                        var timeNow = new Date();
                        var queryValue3 = "INSERT INTO `Quotes`.`Analytics` (`android_id`, `ipaddress`, `entryTime`, `apiType`, `lowLimit`, `HighLimit`) VALUES ('";
                        queryValue3 += data.android_id + "','"
                        queryValue3 += data.ipaddress + "','"
                        queryValue3 += timeNow.toString() + "','"
                        queryValue3 += "quotes" + "','"
                        queryValue3 += data.lowLimit + "','"
                        queryValue3 += data.HighLimit + "');"
                        connection.query(queryValue3, function (err, result3, fields) {
                            if (err) {
                                resolve({ "status": 400, "error": err });
                                connection.end();
                                return;
                            }

                            resolve({ "status": 200, "data": result });

                            connection.end();
                            return;

                        });




                    });

                });
            });

        });
    },
    settings: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'Quotes'
            });
            connection.getConnection(function (err) {
                var queryValue = "Insert into Users(UserId,TimeStamp,PhoneModel,Others) values('";
                queryValue += data.userid + "','"
                queryValue += data.timestamp + "','"
                queryValue += data.phonemodel + "','"
                queryValue += data.others + "');"

                connection.query(queryValue, function (err, result, fields) {
                    var queryValue2 = "select * from Settings";
                    connection.query(queryValue2, function (err, result, fields) {
                        if (err) {
                            resolve({ "status": 400, "error": err });
                            return;
                        }
                        resolve({ "status": 200, "data": result });
                        return;
                    });
                });
            });

        });
    },
    likeorunlike: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'Quotes'
            });
            connection.getConnection(function (err) {
                var queryValue = "select * from Settings";
                if (data.userId && data.timestamp) {
                    queryValue += " LIMIT " + data.lowLimit + "," + data.HighLimit;
                }
                if (err) {
                    resolve({ "status": 400, "error": err });
                    return;
                }
                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        return;
                    }
                    resolve({ "status": 200, "data": result });
                    return;
                });
            });

        });
    },
    likedquotes: function (data) {
        return new Promise(function (resolve, reject) {
            var connection = mysql.createPool({
                host: '139.59.94.48',
                user: 'playtowindbuser',
                password: 'Gameuser@123',
                database: 'Quotes'
            });
            connection.getConnection(function (err) {
                var queryValue = "select q.QuoteId,QuoteTag,QuoteDesc,LikeId,userId,QuoteCategoryId from Quotes as q, UserLikes as u where q.quoteid=u.quoteid ";

                if (data.userId) {
                    queryValue += "AND u.userId =" + data.userId;
                }
                if (data.lowLimit && data.HighLimit) {
                    queryValue += " LIMIT " + data.lowLimit + "," + data.HighLimit;
                }
                if (err) {
                    resolve({ "status": 400, "error": err });
                    return;
                }
                connection.query(queryValue, function (err, result, fields) {
                    if (err) {
                        resolve({ "status": 400, "error": err });
                        return;
                    }
                    resolve({ "status": 200, "data": result });
                    return;
                });
            });

        });
    }

}