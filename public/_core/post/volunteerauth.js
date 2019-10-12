var path = require('path');
var connection = require(path.join(__dirname, '..', 'post', 'JS', 'connection.js'));
module.exports = {
    volunteerauth: function (req, res, wfXML) {
      connection.volunteerauth(req.body).then(function(data){
         if(data.status==200)
        {
            res.status(200).json(data).end();
        }else
        {
            res.status(400).json({"message":"something went wrong."}).end();
        }
        return;
     });
    }
}