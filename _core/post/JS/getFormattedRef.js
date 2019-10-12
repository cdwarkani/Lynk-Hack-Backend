var getFormattedRef = require('./../library/citeproc-js-master/demo/demo.js');
var errorFormatter = require('./errorFormatter.js');
var getFRef = {
    //function to convert pubmed xml to citeproc json
    CSLJson_to_RequiredCitation: function (csljson, style, pos, source, input, inputobj, inputobjs) {
        return new Promise(function (resolve, reject) {
            getFormattedRef.RenderBibliography(csljson, style, pos, source, input, inputobj, inputobjs).then(function (data) {
                resolve(data);
            }).catch(function (error) {
                reject(errorFormatter.errorFormatter(500, error, 'Unable to convert CSLJson_to_RequiredCitation.'));
                return;
            });;
        });
}
}
module.exports = getFRef;