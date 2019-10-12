var c2j = require('./xml2json.js');
var decode = require('unescape');
var getFormattedRef = require('./../library/citeproc-js-master/demo/demo.js');
var biblioExtract = {
    papers2citations_to_CslJSON: function (xmlstring, input) {

        return new Promise(function (resolve, reject) {
            try {

                c2j.convert3(decode(xmlstring)).then(function (data) {


                    if (JSON.parse(data).citation) {
                        var csljson = JSON.parse(data).citation.publications.publication;



                        var k = 0;

                        if (csljson["authors"] && csljson["authors"].author) {
                            var author = csljson["authors"].author;
                            var i;

                            for (i = 0; i < author.length; i++) {
                                author[i].family = author[i]['lastName'];
                                if (author[i]['middleNames']) {
                                    author[i].given = author[i]['firstName'] + ' ' + author[i]['middleNames'];
                                    delete author[i].middleNames;
                                } else {
                                    author[i].given = author[i]['firstName'];
                                }
                                delete author[i].lastName;
                                delete author[i].firstName;

                            }


                        }

                        if (csljson.startpage) {
                            csljson.page = csljson.startpage;
                            delete csljson.startpage;
                        }
                        if (csljson.endpage) {
                            csljson.page = csljson.page + '-' + csljson.endpage;
                            delete csljson.endpage;
                        }

                        if (csljson.bundle && csljson.bundle.publication && csljson.bundle.publication.title)
                            csljson["container-title"] = csljson.bundle.publication.title;

                        if (!csljson.title) {

                            resolve("");
                            return;
                        }


                        getFormattedRef.RenderBibliography2(csljson, input, "", "papers2citations").then(function (data) {
                            resolve(data);
                        }).catch(function (error) {
                            resolve({
                                'status': {
                                    'code': 500,
                                    'message': 'Unable to get data. Something went wrong.'
                                },
                                'message': error
                            });
                            return;
                        });;
                    }
                    else {
                        resolve("");
                        return;

                    }
                })
                    .catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    });




            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': error
                });
                return;
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    },
    CslJSON_to_Biblio: function (json, input, TYPE) {

        return new Promise(function (resolve, reject) {
            try {

                var promisesobject = [];
                json = "[" + json + "]";

                if (JSON.parse(json) && JSON.parse(json)[0] && JSON.parse(json)[0].citationItems) {
                    var x = JSON.parse(json)[0].citationItems;

                    getFormattedRef.RenderBibliography2(x[0].itemData, input, "", "Mendeley or zotero").then(function (data) {
                        resolve(data);
                    }).catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    });;


                }
            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': e
                });
                return;

            }





        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });
    },
    endnote_to_CslJSON: function (xmlstring, input) {
        return new Promise(function (resolve, reject) {
            try {
                c2j.convert3(decode(xmlstring)).then(function (data) {
                    var csljson = JSON.parse(data).EndNote.Cite.record;



                    if (csljson && csljson.titles && csljson.titles.title && csljson.titles.title.style) {
                        var tittle = '';
                        var titless = (csljson.titles.title.style);
                        for (var k = 0; k < titless.length; k++) {
                            tittle = tittle + titless[k]["$t"];
                        }

                        csljson.title = tittle;
                    }
                    else if (csljson && csljson.titles && csljson.titles.title) {
                        csljson.title = csljson.titles.title;

                        //csljson.title=csljson.titles.title;

                    }

                    //csljson.author=csljson.contributors.authors.author;

                    if (csljson && csljson.contributors && csljson.contributors.authors && csljson.contributors.authors.author) {
                        var authorlist = (csljson.contributors.authors.author);
                        var append = "[";

                        for (var i = 0; i < authorlist.length; i++) {
                            var splitFunc = authorlist[i];
                            var val = splitFunc.split(',');
                            append = append + "{";
                            if (val[0]) {
                                append = append + "\"family\":\"" + val[0] + "\","
                            }
                            append = append + "\"given\":\"";
                            if (val[1]) {
                                append = append + val[1];
                            }
                            append = append + "\"},";
                        }
                        append = append.slice(0, -1);
                        append = append + "]";
                        csljson.author = JSON.parse(append);
                    }

                    if (csljson && csljson.titles && csljson.titles['secondary-title'])
                        csljson['secondary-title'] = csljson.titles['secondary-title'];

                    if (csljson && csljson.pages)
                        csljson.page = csljson.pages;

                    if (csljson && csljson.isbn)
                        csljson.ISBN = csljson.isbn;

                    if (csljson && csljson.periodical && csljson.periodical["abbr-1"]) {
                        csljson["container-title"] = csljson.periodical["abbr-1"];
                    }
                    else if (csljson && csljson.periodical && csljson.periodical['full-title']) {
                        csljson["container-title"] = csljson.periodical['full-title'];

                        //csljson.title=csljson.titles.title;
                    }





                    getFormattedRef.RenderBibliography2(csljson, input, "", "Mendeley").then(function (data) {
                        resolve(data);
                    }).catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    });;

                })
                    .catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    });


            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': e
                });
                return;
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });



    },
    refman_to_CslJSON: function (xmlstring) {

        return new Promise(function (resolve, reject) {
            try {

                c2j.convert3(decode(xmlstring)).then(function (data) {



                    if (JSON.parse(data).Refman && JSON.parse(data).Refman.Cite) {
                        var csljson = JSON.parse(data).Refman.Cite;



                    }
                    csljson.title = csljson["IDText"];
                    csljson.volume = csljson.MDL.Volume;
                    csljson.issue = csljson.MDL.Issue;
                    csljson.page = csljson.MDL["Start_Page"] + "-" + csljson.MDL["End_Page"];

                    var len = (csljson.MDL["Authors_Primary"].length);

                    var append = "[";

                    for (var i = 0; i < len; i++) {
                        var splitFunc = (csljson.MDL["Authors_Primary"][i]);
                        var val = splitFunc.split(',');
                        append = append + "{";
                        if (val[0]) {
                            append = append + "\"family\":\"" + val[0] + "\","
                        }
                        append = append + "\"given\":\"";
                        if (val[1]) {
                            append = append + val[1];
                        }
                        append = append + "\"},";
                    }
                    append = append.slice(0, -1);
                    append = append + "]";

                    ////console.log(append);
                    ////console.log(append);
                    csljson.author = JSON.parse(append);
                    ////console.log(csljson.author);

                    getFormattedRef.RenderBibliography2(csljson, "chicago-fullnote-bibliography.csl", "", "refman");



                })
                    .catch(function (error) {
                        resolve({
                            'status': {
                                'code': 500,
                                'message': 'Unable to get data. Something went wrong.'
                            },
                            'message': error
                        });
                        return;
                    });


            } catch (e) {
                resolve({
                    'status': {
                        'code': 500,
                        'message': 'Unable to get data. Something went wrong.'
                    },
                    'message': e
                });
                return;
            }
        }).catch(function (error) {
            resolve({
                'status': {
                    'code': 500,
                    'message': 'Unable to get data. Something went wrong.'
                },
                'message': error
            });
            return;
        });



    }




};


module.exports = biblioExtract;