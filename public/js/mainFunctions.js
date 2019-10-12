 
    document.getElementById("pmidbox").style.border = "thin solid #000";
   document.getElementById("doibox").style.border = "thin solid #000";
    document.getElementById("htmlbox").style.border = "thin solid #000";
    document.getElementById("extractbox").style.border = "thin solid #000";
function openPmidBox() { 
   document.getElementById('pmidbox').style.display="block";
document.getElementById('doibox').style.display="none";
document.getElementById('htmlbox').style.display="none";
document.getElementById('extractbox').style.display="none";
document.getElementById('referencebox').style.display="none";
}
function openDoiBox() { 
   document.getElementById('pmidbox').style.display="none";
document.getElementById('doibox').style.display="block";
document.getElementById('htmlbox').style.display="none";
document.getElementById('extractbox').style.display="none";
document.getElementById('referencebox').style.display="none";
}
function openHtmlBox() { 

   document.getElementById('pmidbox').style.display="none";
document.getElementById('doibox').style.display="none";
document.getElementById('htmlbox').style.display="block";
document.getElementById('extractbox').style.display="none";
document.getElementById('referencebox').style.display="none";
}
function openTBox() { 

   document.getElementById('pmidbox').style.display="none";
document.getElementById('doibox').style.display="none";
document.getElementById('htmlbox').style.display="none";
document.getElementById('extractbox').style.display="none";
document.getElementById('referencebox').style.display="block";
}
function openEBox() { 

   document.getElementById('pmidbox').style.display="none";
document.getElementById('doibox').style.display="none";
document.getElementById('htmlbox').style.display="none";
document.getElementById('extractbox').style.display="block";
document.getElementById('referencebox').style.display="none";
}
document.getElementById('pmidbox').style.display="block";
document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="none";
var table = $('#user_data').DataTable({
                            "aaSorting": [[0, "desc"]],

                            "dom": 'Bfrtip',

                            "bProcessing": true,
    "scrollX": true,
    "ordering": false,
                            "font-size": "10px",
                            "autoWidth": false,
                            "columnDefs": [
         { "width": "310px", "targets": 0 },
      { "width": "320px", "targets": 1 },
      { "width": "320px", "targets": 2 },
      { "width": "320px", "targets": 3 },
      { "width": "320px", "targets": 4 },
      { "width": "320px", "targets": 5 },
      { "width": "320px", "targets": 6}
  ]

                        });
var table2 = $('#user_data2').DataTable({
                            "aaSorting": [[0, "desc"]],

                            "dom": 'Bfrtip',
    "ordering": false,
                            "bProcessing": true,
                            "scrollX": true,
                            "font-size": "10px"

                        });
function GenerateOutput(type,htmlmultipledata) { 
var style= document.getElementById("styleid").value;
var locale= document.getElementById("localeid").value;
var pre= document.getElementById("preid").value;
var post= document.getElementById("postid").value;
var data;
var biblioinputstring;
var endpoint;
document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="none";
     document.getElementById('dataatabpmidanddoi').style.display="block";
if(type=='pmid')
{
  data= document.getElementById("pmiddata").value;
//endpoint= document.getElementById("pmidep").value;
endpoint="http://biblioservice.kriyadocs.com/";
//biblioinputstring= document.getElementById("pmidbiblio").value;
biblioinputstring="";

document.getElementById("generatedapi").value=endpoint+"search?type="+type+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post;
data = data.split(",");
}
else if(type=='doi')
{
  data= document.getElementById("doidata").value;
//endpoint= document.getElementById("doiep").value;
endpoint="http://biblioservice.kriyadocs.com/";
//biblioinputstring= document.getElementById("doibiblio").value;
biblioinputstring=""
document.getElementById("generatedapi").value=endpoint+"search?type="+type+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post;
data = data.split(",");
} 
else if(type=='html')
{
  var datas=[];
  data= decodeURI(document.getElementById("htmldata").value);
  data=data.replace("&", "and");
  //biblioinputstring= document.getElementById("htmlbiblio").value;
    biblioinputstring="";
//endpoint= document.getElementById("htmlep").value;
endpoint="http://biblioservice.kriyadocs.com/";
document.getElementById("generatedapi").value=endpoint+"validate?type="+type+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post;
datas.push(data);
data=datas;
} 
else if(type=='htmlmultiple')
{
  var datas=[];
  data= htmlmultipledata;

  //biblioinputstring= document.getElementById("htmlbiblio").value;
    biblioinputstring="";
//endpoint= document.getElementById("htmlep").value;
endpoint="http://biblioservice.kriyadocs.com/";
document.getElementById("generatedapi").value=endpoint+"validate?type="+type+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post;
datas.push(data);
data=datas;
var str='';
for(var k=0;k<htmlmultipledata.length;k++)
{
  htmlmultipledata[k]=htmlmultipledata[k].replace("&","and");
  str=str+'{'+htmlmultipledata[k]+'}'+',';
}
str=str.slice(0,-1);

data=str;
endpoint= "http://biblioservice.kriyadocs.com/";
document.getElementById("generatedapi").value=endpoint+"parseReference?type="+type+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post+"&data="+data;

} 
else if(type=='extract')
{
  data= document.getElementById("extractdata").value;
endpoint= "http://biblioservice.kriyadocs.com/";
document.getElementById("generatedapi").value=endpoint+"extract?type="+type+"&style="+style+"&locale="+locale+"&data="+data+"&pre="+pre+"&post="+post;
} 
else if(type=='reference')
{
  data= document.getElementById("refdata").value;
  data=data.replace("&","and");
 
endpoint= "http://biblioservice.kriyadocs.com/";
document.getElementById("generatedapi").value=endpoint+"parseReference?type="+type+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post+"&data="+data;

}

var apiUrl =document.getElementById("generatedapi").value ;
   
 oopen();
if(type=='extract')
{

   document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="block";
     document.getElementById('dataatabpmidanddoi').style.display="none";
$.ajax({
  url: apiUrl,
  success: function(response) {
    //Although response is an object, the field contents is a string and needs to be parsed here.
    var data = response; 
  

if(data && data.status && (data.status.code==500  || data.status.code==400 ))
{
  document.getElementById('output').value = JSON.stringify(data);
  $('#myModal').modal('toggle');
}
else
{
  document.getElementById('output').value = "successfully fetched the data.";
   $('#myModal').modal('toggle');
                        table2.clear();
                        for(var k=0;k<response.length;k++)
                        {
                        dataSet = [JSON.stringify(response[k].value.InputJSON),response[k].value.Citation,response[k].value.BibliographyString ];
                        table2.rows.add([dataSet]).draw();
                        }

      }                  
                    
  
  },
  error: function(request) {
    document.getElementById('output').value = request;
     $('#myModal').modal('toggle');
  }
});
}else if(type=='reference')
{
  $('#myModal').modal('toggle');


document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="none";
    document.getElementById('dataatabpmidanddoi').style.display="block";
     
                       
                        /* Formatting function for row details - modify as you need */
                        function format(d) {
                          var Pubmedarticlelink="No Pubmed article exist";
                          var CrossrefArticleLink="No Crossref article exist";
                          var pubmedjson="Not found in pubmed";
                          var crossrefjson="Skipped, since we found in pubmed";
                          var truecaser="Slicing from the string error at html front end.";
                          var mergedJSON="No merged JSON done";
                          if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].title)
                          {
                            var tempfinal=d.finalbiblio.toLowerCase();
                          
                          var tempinput=JSON.parse(d.MatchedJson)["Item-1"].title.toLowerCase();
                          if(tempinput[tempinput.length-1].match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/))
                          {tempinput=tempinput.slice(0,-1);
                          }
                       
                          var i1=tempfinal.indexOf(tempinput);
                          if(tempfinal)
                         
                          var ss=tempfinal.slice(i1,tempfinal.length);
                       
                          var i2=ss.indexOf("</span>");
                        

                        
                          truecaser=d.finalbiblio.slice(i1,(i2+i1));
                          
                          }

var inputsource;
if(d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson)&& JSON.parse(d.InputConvertedJson).PMID)
{
inputsource="Pubmed";
pubmedjson=d.MatchedJson;
mergedJSON=JSON.stringify(JSON.parse(d.MatchedJson)["Item-1"].author);


}
else if(d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson)&& JSON.parse(d.InputConvertedJson).DOI)
{
  inputsource="Crossref";
  crossrefjson=d.MatchedJson;
  mergedJSON=JSON.parse(d.MatchedJson)["Item-1"];

}
else
{
 pubmedjson="Not found in pubmed";
                         crossrefjson="Not found in crossref"

}

                          if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].DOI)
                          {
                            
                            CrossrefArticleLink='https://doi.org/'+JSON.parse(d.MatchedJson)["Item-1"].DOI;
                          }
   if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].PMID)
  {
    Pubmedarticlelink='https://www.ncbi.nlm.nih.gov/pubmed/'+JSON.parse(d.MatchedJson)["Item-1"].PMID;

  }

                            // `d` is the original data object for the row
                            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                                '<tr>' +
                                '<td>Input:</td>' +
                                '<td>'+d.Input+'</td>' +
                                '</tr>' +
                                '<tr>'  +

'<td>Input data converted to json:</td>' +
'<td>'+JSON.stringify(d.InputConvertedJson1)+'</td>' +

'</tr>'+
                                '<td>Output from parseReference:</td>' +
                                '<td>'+d.parseref+' </td>' +
                                '</tr>' +
                                '<tr>' +
                                '<tr>' +
                               '<tr>' +
                                '<td>PUBMED JSON:</td>' +
                                '<td>'+pubmedjson+'</td>' +
                                '</tr>' +
                                '</tr>' +
                               '<tr>' +
                                '<td>CROSSREF JSON:</td>' +
                                '<td>'+crossrefjson+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Merged JSON:</td>' +
                                '<td>'+mergedJSON+'</td>' +
                                '</tr>' +
                                
                                '<td>Output from TrueCaser:</td>' +
                                '<td>'+truecaser+'</td>' +

                                '</tr>' +
                                '</tr>' +
                                
                                '<td>Changed JSON:</td>' +
                                '<td>' + d.ChangedJSON + '</td>' +

                                '</tr>' +
                                '<tr>' +
                                '<td>Input to CiteProc system:</td>' +
                                '<td>'+d.MatchedJson+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>Bibliography String from CiteProc system:</td>' +
                                '<td>'+d.BibliographyStringUnstyled+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Citation String from CiteProc system:</td>' +
                                '<td>'+d.Citation+'</td>' +
                                '</tr>' +
                                 '<tr>' +
                                '<td>Final Generated Bibliography string:</td>' +
                                '<td>'+d.finalbiblio+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>Crossref  link of the article:</td>' +
                                '<td>'+CrossrefArticleLink+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>Pubmed  link of the article:</td>' +
                                '<td>'+Pubmedarticlelink+'</td>' +
                                '</tr>' +
                                
                                '</table>';
                        }
table.destroy();
var final=document.getElementById("generatedapi").value;

                                                   table = $('#example').DataTable({
                                "ajax": final,
                                                       "dom": 'Bfrtip',
                                                       "ordering": false,
        "buttons": [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
                                "columns": [
                                    {
                                        "className": 'details-control',
                                        "orderable": false,
                                        "data": null,
                                        "defaultContent": ''
                                    },
                                    { "data": "Input" },
                                    { "data": "BibliographyStringUnstyled" },
                                    { "data": "Citation" },
                                    
                                ],
                                 "columnDefs": [
         { "width": "30px", "targets": 0 },
      { "width": "60%", "targets": 1 },
      { "width": "60%", "targets": 2 },
      { "width": "60%", "targets": 3 },
  
  
  ],
                                "order": [[1, 'asc']]
                            });
 
 $("#example tbody").unbind("click");
                            // Add event listener for opening and closing details
                            $('#example tbody').on('click', 'td.details-control', function () {
                               
                                var tr = $(this).closest('tr');
                                var row = table.row(tr);

                                if (row.child.isShown()) {
                                    // This row is already open - close it
                                    row.child.hide();
                                    tr.removeClass('shown');
                                }
                                else {
                                    // Open this row
                                    row.child(format(row.data())).show();
                                    tr.addClass('shown');
                                }
                            });





}
else if(type=='htmlmultiple')
{
  $('#myModal').modal('toggle');
document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="none";
    document.getElementById('dataatabpmidanddoi').style.display="block";
     
                       
                        /* Formatting function for row details - modify as you need */
    function format(d) {
        var Pubmedarticlelink = "No Pubmed article exist";
        var CrossrefArticleLink = "No Crossref article exist";
        var pubmedjson = "Not found in pubmed";
        var crossrefjson = "Skipped, since we found in pubmed";
        var truecaser = "Slicing from the string error at html front end.";
        var mergedJSON = "No merged JSON done";
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].title) {
            var tempfinal = d.finalbiblio.toLowerCase();

            var tempinput = JSON.parse(d.MatchedJson)["Item-1"].title.toLowerCase();
            if (tempinput[tempinput.length - 1].match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                tempinput = tempinput.slice(0, -1);
            }

            var i1 = tempfinal.indexOf(tempinput);
            if (tempfinal)

                var ss = tempfinal.slice(i1, tempfinal.length);

            var i2 = ss.indexOf("</span>");



            truecaser = d.finalbiblio.slice(i1, (i2 + i1));

        }

        var inputsource;
        if (d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson) && JSON.parse(d.InputConvertedJson).PMID) {
            inputsource = "Pubmed";
            pubmedjson = d.MatchedJson;
            mergedJSON = JSON.stringify(JSON.parse(d.MatchedJson)["Item-1"].author);


        }
        else if (d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson) && JSON.parse(d.InputConvertedJson).DOI) {
            inputsource = "Crossref";
            crossrefjson = d.MatchedJson;
            mergedJSON = JSON.parse(d.MatchedJson)["Item-1"];

        }
        else {
            pubmedjson = "Not found in pubmed";
            crossrefjson = "Not found in crossref"

        }

        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {

            CrossrefArticleLink = 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI;
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
            Pubmedarticlelink = 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID;

        }

        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Input:</td>' +
            '<td>' + d.Input + '</td>' +
            '</tr>' +
            '<tr>' +

            '<td>Input data converted to json:</td>' +
            '<td>' + JSON.stringify(d.InputConvertedJson1) + '</td>' +

            '</tr>' +
            '<td>Output from parseReference:</td>' +
            '<td>' + d.parseref + ' </td>' +
            '</tr>' +
            '<tr>' +
            '<tr>' +
            '<tr>' +
            '<td>PUBMED JSON:</td>' +
            '<td>' + pubmedjson + '</td>' +
            '</tr>' +
            '</tr>' +
            '<tr>' +
            '<td>CROSSREF JSON:</td>' +
            '<td>' + crossrefjson + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Merged JSON:</td>' +
            '<td>' + mergedJSON + '</td>' +
            '</tr>' +

            '<td>Output from TrueCaser:</td>' +
            '<td>' + truecaser + '</td>' +

            '</tr>' +
            '</tr>' +

            '<td>Changed JSON:</td>' +
            '<td>' + d.ChangedJSON + '</td>' +

            '</tr>' +
            '<tr>' +
            '<td>Input to CiteProc system:</td>' +
            '<td>' + d.MatchedJson + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Bibliography String from CiteProc system:</td>' +
            '<td>' + d.BibliographyStringUnstyled + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Citation String from CiteProc system:</td>' +
            '<td>' + d.Citation + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Final Generated Bibliography string:</td>' +
            '<td>' + d.finalbiblio + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Crossref  link of the article:</td>' +
            '<td>' + CrossrefArticleLink + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Pubmed  link of the article:</td>' +
            '<td>' + Pubmedarticlelink + '</td>' +
            '</tr>' +

            '</table>';
    }
table.destroy();
var final=document.getElementById("generatedapi").value;

                                                   table = $('#example').DataTable({
                                "ajax": final,
                                                       "dom": 'Bfrtip',
                                                       "ordering": false,
        "buttons": [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
                                "columns": [
                                    {
                                        "className": 'details-control',
                                        "orderable": false,
                                        "data": null,
                                        "defaultContent": ''
                                    },
                                    { "data": "Input" },
                                    { "data": "BibliographyStringUnstyled" },
                                    { "data": "Citation" },
                                    
                                ],
                                 "columnDefs": [
         { "width": "30px", "targets": 0 },
      { "width": "60%", "targets": 1 },
      { "width": "60%", "targets": 2 },
      { "width": "60%", "targets": 3 },
  
  
  ],
                                "order": [[1, 'asc']]
                            });
 
 $("#example tbody").unbind("click");
                            // Add event listener for opening and closing details
                            $('#example tbody').on('click', 'td.details-control', function () {
                               
                                var tr = $(this).closest('tr');
                                var row = table.row(tr);

                                if (row.child.isShown()) {
                                    // This row is already open - close it
                                    row.child.hide();
                                    tr.removeClass('shown');
                                }
                                else {
                                    // Open this row
                                    row.child(format(row.data())).show();
                                    tr.addClass('shown');
                                }
                            });





 


}
else if(type=='pmid' || type=='doi')
{
             
document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="none";
    document.getElementById('dataatabpmidanddoi').style.display="block";
     
                       
                        /* Formatting function for row details - modify as you need */
    function format(d) {
        var Pubmedarticlelink = "No Pubmed article exist";
        var CrossrefArticleLink = "No Crossref article exist";
        var pubmedjson = "Not found in pubmed";
        var crossrefjson = "Skipped, since we found in pubmed";
        var truecaser = "Slicing from the string error at html front end.";
        var mergedJSON = "No merged JSON done";
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].title) {
            var tempfinal = d.finalbiblio.toLowerCase();

            var tempinput = JSON.parse(d.MatchedJson)["Item-1"].title.toLowerCase();
            if (tempinput[tempinput.length - 1].match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                tempinput = tempinput.slice(0, -1);
            }

            var i1 = tempfinal.indexOf(tempinput);
            if (tempfinal)

                var ss = tempfinal.slice(i1, tempfinal.length);

            var i2 = ss.indexOf("</span>");



            truecaser = d.finalbiblio.slice(i1, (i2 + i1));

        }

        var inputsource;
        if (d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson) && JSON.parse(d.InputConvertedJson).PMID) {
            inputsource = "Pubmed";
            pubmedjson = d.MatchedJson;
            mergedJSON = JSON.stringify(JSON.parse(d.MatchedJson)["Item-1"].author);


        }
        else if (d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson) && JSON.parse(d.InputConvertedJson).DOI) {
            inputsource = "Crossref";
            crossrefjson = d.MatchedJson;
            mergedJSON = JSON.parse(d.MatchedJson)["Item-1"];

        }
        else {
            pubmedjson = "Not found in pubmed";
            crossrefjson = "Not found in crossref"

        }

        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {

            CrossrefArticleLink = 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI;
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
            Pubmedarticlelink = 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID;

        }

        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Input:</td>' +
            '<td>' + d.Input + '</td>' +
            '</tr>' +
            '<tr>' +

            '<td>Input data converted to json:</td>' +
            '<td>' + JSON.stringify(d.InputConvertedJson1) + '</td>' +

            '</tr>' +
            '<td>Output from parseReference:</td>' +
            '<td>' + d.parseref + ' </td>' +
            '</tr>' +
            '<tr>' +
            '<tr>' +
            '<tr>' +
            '<td>PUBMED JSON:</td>' +
            '<td>' + pubmedjson + '</td>' +
            '</tr>' +
            '</tr>' +
            '<tr>' +
            '<td>CROSSREF JSON:</td>' +
            '<td>' + crossrefjson + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Merged JSON:</td>' +
            '<td>' + mergedJSON + '</td>' +
            '</tr>' +

            '<td>Output from TrueCaser:</td>' +
            '<td>' + truecaser + '</td>' +

            '</tr>' +
            '</tr>' +

            '<td>Changed JSON:</td>' +
            '<td>' + d.ChangedJSON + '</td>' +

            '</tr>' +
            '<tr>' +
            '<td>Input to CiteProc system:</td>' +
            '<td>' + d.MatchedJson + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Bibliography String from CiteProc system:</td>' +
            '<td>' + d.BibliographyStringUnstyled + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Citation String from CiteProc system:</td>' +
            '<td>' + d.Citation + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Final Generated Bibliography string:</td>' +
            '<td>' + d.finalbiblio + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Crossref  link of the article:</td>' +
            '<td>' + CrossrefArticleLink + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Pubmed  link of the article:</td>' +
            '<td>' + Pubmedarticlelink + '</td>' +
            '</tr>' +

            '</table>';
    }  function format(d) {
        var Pubmedarticlelink = "No Pubmed article exist";
        var CrossrefArticleLink = "No Crossref article exist";
        var pubmedjson = "Not found in pubmed";
        var crossrefjson = "Skipped, since we found in pubmed";
        var truecaser = "Slicing from the string error at html front end.";
        var mergedJSON = "No merged JSON done";
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].title) {
            var tempfinal = d.finalbiblio.toLowerCase();

            var tempinput = JSON.parse(d.MatchedJson)["Item-1"].title.toLowerCase();
            if (tempinput[tempinput.length - 1].match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                tempinput = tempinput.slice(0, -1);
            }

            var i1 = tempfinal.indexOf(tempinput);
            if (tempfinal)

                var ss = tempfinal.slice(i1, tempfinal.length);

            var i2 = ss.indexOf("</span>");



            truecaser = d.finalbiblio.slice(i1, (i2 + i1));

        }

        var inputsource;
        if (d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson) && JSON.parse(d.InputConvertedJson).PMID) {
            inputsource = "Pubmed";
            pubmedjson = d.MatchedJson;
            mergedJSON = JSON.stringify(JSON.parse(d.MatchedJson)["Item-1"].author);


        }
        else if (d && d.InputConvertedJson && JSON.parse(d.InputConvertedJson) && JSON.parse(d.InputConvertedJson).DOI) {
            inputsource = "Crossref";
            crossrefjson = d.MatchedJson;
            mergedJSON = JSON.parse(d.MatchedJson)["Item-1"];

        }
        else {
            pubmedjson = "Not found in pubmed";
            crossrefjson = "Not found in crossref"

        }

        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].DOI) {

            CrossrefArticleLink = 'https://doi.org/' + JSON.parse(d.MatchedJson)["Item-1"].DOI;
        }
        if (d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"] && JSON.parse(d.MatchedJson)["Item-1"].PMID) {
            Pubmedarticlelink = 'https://www.ncbi.nlm.nih.gov/pubmed/' + JSON.parse(d.MatchedJson)["Item-1"].PMID;

        }

        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Input:</td>' +
            '<td>' + d.Input + '</td>' +
            '</tr>' +
            '<tr>' +

            '<td>Input data converted to json:</td>' +
            '<td>' + JSON.stringify(d.InputConvertedJson) + '</td>' +

            '</tr>' +
            '<td>Output from parseReference:</td>' +
            '<td>' + d.parseref + ' </td>' +
            '</tr>' +
            '<tr>' +
            '<tr>' +
            '<tr>' +
            '<td>PUBMED JSON:</td>' +
            '<td>' + pubmedjson + '</td>' +
            '</tr>' +
            '</tr>' +
            '<tr>' +
            '<td>CROSSREF JSON:</td>' +
            '<td>' + crossrefjson + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Merged JSON:</td>' +
            '<td>' + mergedJSON + '</td>' +
            '</tr>' +

            '<td>Output from TrueCaser:</td>' +
            '<td>' + truecaser + '</td>' +

            '</tr>' +
            '</tr>' +

            '<td>Changed JSON:</td>' +
            '<td>' + d.ChangedJSON + '</td>' +

            '</tr>' +
            '<tr>' +
            '<td>Input to CiteProc system:</td>' +
            '<td>' + d.MatchedJson + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Bibliography String from CiteProc system:</td>' +
            '<td>' + d.BibliographyStringUnstyled + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Citation String from CiteProc system:</td>' +
            '<td>' + d.Citation + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Final Generated Bibliography string:</td>' +
            '<td>' + d.finalbiblio + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Crossref  link of the article:</td>' +
            '<td>' + CrossrefArticleLink + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td>Pubmed  link of the article:</td>' +
            '<td>' + Pubmedarticlelink + '</td>' +
            '</tr>' +

            '</table>';
    }
table.destroy();
var final=document.getElementById("generatedapi").value+"&data="+data;

                                                   table = $('#example').DataTable({
                                "ajax": final,
                                                       "dom": 'Bfrtip',
                                                       "ordering": false,
        "buttons": [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
                                "columns": [
                                    {
                                        "className": 'details-control',
                                        "orderable": false,
                                        "data": null,
                                        "defaultContent": ''
                                    },
                                    { "data": "Input" },
                                    { "data": "BibliographyStringUnstyled" },
                                    { "data": "Citation" },
                                    
                                ],
                                 "columnDefs": [
         { "width": "30px", "targets": 0 },
      { "width": "60%", "targets": 1 },
      { "width": "60%", "targets": 2 },
      { "width": "60%", "targets": 3 },
  
  
  ],
                                "order": [[1, 'asc']]
                            });
 $('#myModal').modal('toggle');
 $("#example tbody").unbind("click");
                            // Add event listener for opening and closing details
                            $('#example tbody').on('click', 'td.details-control', function () {
                               
                                var tr = $(this).closest('tr');
                                var row = table.row(tr);

                                if (row.child.isShown()) {
                                    // This row is already open - close it
                                    row.child.hide();
                                    tr.removeClass('shown');
                                }
                                else {
                                    // Open this row
                                    row.child(format(row.data())).show();
                                    tr.addClass('shown');
                                }
                            });
                     


}
else
{

              
document.getElementById('dataatab').style.display="none";
   document.getElementById('dataatabExtract').style.display="none";
    document.getElementById('dataatabpmidanddoi').style.display="block";
     
                      
                        /* Formatting function for row details - modify as you need */
                        function format(d) {
                          var Pubmedarticlelink="No Pubmed article exist";
                          var CrossrefArticleLink="No Crossref article exist";
                        
                          var truecaser="Slicing from the string error at html front end.";
                          if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].title)
                          {
                          var tempfinal=d.finalbiblio.toLowerCase();
                          
                          var tempinput=JSON.parse(d.MatchedJson)["Item-1"].title.toLowerCase();
                          if(tempinput[tempinput.length-1].match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/))
                          {tempinput=tempinput.slice(0,-1);
                          }
                       
                          var i1=tempfinal.indexOf(tempinput);
                          if(tempfinal)
                         
                          var ss=tempfinal.slice(i1,tempfinal.length);
                       
                          var i2=ss.indexOf("</span>");
                        

                        
                          truecaser=d.finalbiblio.slice(i1,(i2+i1));
                          
                          }
                          
                          if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].DOI)
                          {
                            
                            CrossrefArticleLink='https://doi.org/'+JSON.parse(d.MatchedJson)["Item-1"].DOI;
                          }
   if(d && d.MatchedJson && JSON.parse(d.MatchedJson)["Item-1"]&& JSON.parse(d.MatchedJson)["Item-1"].PMID)
  {
    Pubmedarticlelink='https://www.ncbi.nlm.nih.gov/pubmed/'+JSON.parse(d.MatchedJson)["Item-1"].PMID;

  }

                            // `d` is the original data object for the row
                            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                                '<tr>' +
                                '<td>Input:</td>' +
                                '<td>'+d.Input+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Output from parseReference:</td>' +
                                '<td>Skipped, since we have Pubmed or DOI id as input. </td>' +
                                '</tr>' +
                                '<tr>' +

                                '<td>Input data converted to json:</td>' +
                                '<td>'+d.InputConvertedJson+'</td>' +

                                '</tr>' +
                                '<tr>' +
                                '<td>Output from TrueCaser:</td>' +
                                '<td>'+truecaser+'</td>' +

                                '</tr>' +
                               '<tr>' +
                                '<td>Returned Matched JSON:</td>' +
                                '<td>'+d.MatchedJson+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Input to CiteProc system:</td>' +
                                '<td>'+d.MatchedJson+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>Bibliography String from CiteProc system:</td>' +
                                '<td>'+d.BibliographyString+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Citation String from CiteProc system:</td>' +
                                '<td>'+d.Citation+'</td>' +
                                '</tr>' +
                                 '<tr>' +
                                '<td>Final Generated Bibliography string:</td>' +
                                '<td>'+d.finalbiblio+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>Crossref  link of the article:</td>' +
                                '<td>'+CrossrefArticleLink+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td>Pubmed  link of the article:</td>' +
                                '<td>'+Pubmedarticlelink+'</td>' +
                                '</tr>' +
                                
                                '</table>';
                        }
table.destroy();
var final=document.getElementById("generatedapi").value+"&data="+data;

                                                   table = $('#example').DataTable({
                                "ajax": final,
                                                       "dom": 'Bfrtip',
                                                       "ordering": false,
        "buttons": [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
                                "columns": [
                                    {
                                        "className": 'details-control',
                                        "orderable": false,
                                        "data": null,
                                        "defaultContent": ''
                                    },
                                    { "data": "Input" },
                                    { "data": "finalbiblio" },
                                    { "data": "Citation" },
                                    
                                ],
                                 "columnDefs": [
         { "width": "30px", "targets": 0 },
      { "width": "60%", "targets": 1 },
      { "width": "60%", "targets": 2 },
      { "width": "60%", "targets": 3 },
  
  
  ],
                                "order": [[1, 'asc']]
                            });
 $('#myModal').modal('toggle');
 $("#example tbody").unbind("click");
                            // Add event listener for opening and closing details
                            $('#example tbody').on('click', 'td.details-control', function () {
                               
                                var tr = $(this).closest('tr');
                                var row = table.row(tr);

                                if (row.child.isShown()) {
                                    // This row is already open - close it
                                    row.child.hide();
                                    tr.removeClass('shown');
                                }
                                else {
                                    // Open this row
                                    
                                    row.child(format(row.data())).show();
                                    tr.addClass('shown');
                                }
                            });
                     





}
return false;
  }
  
  var filess = document.getElementById('files');
  filess.addEventListener('change',function() {
          var style= document.getElementById("styleid").value;
var locale= document.getElementById("localeid").value;
var pre= document.getElementById("preid").value;
var post= document.getElementById("postid").value;
var data;
var endpoint;
document.getElementById('dataatab').style.display="block";
   document.getElementById('dataatabExtract').style.display="none";
            var file = this.files[0];
            
            var reader = new FileReader();
            reader.onload = function (progressEvent) {
                // Entire file
 // By lines
                var lines = this.result.split('\n');
                for (var line = 0; line < lines.length; line++) {
                     
  lines[line]=lines[line].replace("&", "and");


                    line++;
                }

//endpoint= document.getElementById("htmlep").value;
endpoint="http://biblioservice.kriyadocs.com/";
//document.getElementById("generatedapi").value=endpoint+"validate?type=html"+"&style="+style+"&locale="+locale+"&pre="+pre+"&post="+post;
var apiUrl=document.getElementById("generatedapi").value;
var data=lines;
table.clear();
oopen();
 var requests = [];
  var biblioinputstring = [];
  for (i = 0; i < data.length; ++i) {
biblioinputstring.push(data[i]);
//alert(biblioinputstring[i]);
}
GenerateOutput('htmlmultiple',biblioinputstring);

            };
            reader.readAsText(file);
        }
      ,false);
function oopen()
{
  $('#myModal').modal({
    backdrop: 'static',
    keyboard: false
})

}
oopen();
      $.ajax({
        
url: 'http://biblioservice.kriyadocs.com/extractLocaleList?',
success: function(response) {
  $('#myModal').modal('toggle');
//Although response is an object, the field contents is a string and needs to be parsed here.
var data = response; 
 var catOptions='';
for(var i=0;i<data.length;i++)
{
var a=[];
var sttr=data[i];
a=sttr.split('|');
catOptions += "<option value="+a[1]+">" + a[0] + "</option>";
} 
document.getElementById("styleid").innerHTML = catOptions;

},
error: function(request) {
  $('#myModal').modal('toggle');
alert("Unable to extract style list. Service doesn't seem to work fine.");
}
});