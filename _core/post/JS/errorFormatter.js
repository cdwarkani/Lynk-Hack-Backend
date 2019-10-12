module.exports = {
	errorFormatter: function(statusCode, message, stackTrace) {
        //console.log(stackTrace);
        console.log(stackTrace);
        return {
            
            
                'code': statusCode,
                'message': message,
            'StackTrace': stackTrace
        };
    }
}