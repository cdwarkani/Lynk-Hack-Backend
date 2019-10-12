
module.exports = {
    resolvepmidsusingcrossref: function (req, res, wfXML) {
        var data="";
        if (JSON.parse(req.body.data)) {
            var data = JSON.parse(req.body.data).YetToBeResolved;
        }
        else {
            res.status(500).json({ "reason": "JSON input supplied is not properly structured." }).end();
        }
        var CreatedPubmedURLdata = CreatedCrossrefURL(data);
        var dataInfo = CreatedPubmedURLdata.dataInfo;
        var indexListSeperatedByComma = CreatedPubmedURLdata.indexListSeperatedBYComma;
        res.status(200).json(data).end();
        return;
    }
}
function CreatedPubmedURL(JSONCollection) {
    var dataInfo = "", indexListSeperatedByComma = "";
    for (var i = 0; i < JSONCollection.length; i++) {
        var JSONData = JSONCollection[i];
        Object.keys(JSONData).map(function (s) {
            indexListSeperatedByComma += s + ",";

            var JSONdata = JSONData[s];
            var container;
            var inputjson = unverified_xml_data_in_JsonFormat;
            var finalPMIDS = '';
            var article_title = '',
                vol = '',
                page = '',
                issue = '',
                prcnt = '',
                year = '',
                titl = '',
                prcnt_title = '',
                author = '';
            var csljson;
            var append = '';
            if (unverified_xml_data_in_JsonFormat && unverified_xml_data_in_JsonFormat.author && unverified_xml_data_in_JsonFormat.author[0] ) {
                if(unverified_xml_data_in_JsonFormat.author[0].family && unverified_xml_data_in_JsonFormat.author[0].given )
                append = append + "query.author=\"" + unverified_xml_data_in_JsonFormat.author[0].family +" "+unverified_xml_data_in_JsonFormat.author[0].given + "\"&";
                else if(unverified_xml_data_in_JsonFormat.author[0].family  )
                append = append + "query.author=\"" + unverified_xml_data_in_JsonFormat.author[0].family +"\"&";
                else if(unverified_xml_data_in_JsonFormat.author[0].given  )
                append = append + "query.author=\"" + unverified_xml_data_in_JsonFormat.author[0].given +"\"&";
           
            }
            if (unverified_xml_data_in_JsonFormat["container-title"]) {
                append = append + "query.container-title=\"" + unverified_xml_data_in_JsonFormat["container-title"] + "\"&";
            }
            else if (unverified_xml_data_in_JsonFormat["RefBookTitle"]) {
                append = append + "query.container-title=\"" + unverified_xml_data_in_JsonFormat["RefBookTitle"] + "\"&";
            }
            else if (unverified_xml_data_in_JsonFormat["RefConfTitle"]) {
                append = append + "query.title=\"" + unverified_xml_data_in_JsonFormat["RefConfTitle"] + "\"&";
            }
            if (unverified_xml_data_in_JsonFormat["title"]) {
                append = append + "query.title=\"" + unverified_xml_data_in_JsonFormat["title"] + "\"&";
            }
        });
        dataInfo = dataInfo + "%0D";
    }
    indexListSeperatedByComma = indexListSeperatedByComma.slice(0, indexListSeperatedByComma.length - 1);
    dataInfo = dataInfo.slice(0, dataInfo.length - 3);
    return { "dataInfo": dataInfo, "indexListSeperatedBYComma": indexListSeperatedByComma };

}