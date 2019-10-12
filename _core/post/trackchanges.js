const Q = require('q');
const cheerio = require('cheerio');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const uuidv4 = require('uuid/v4');
var tc = {
    trackchanges: function (req, res) {
        tc.trackchangesModule(req)
            .then(function (data) {
                res.status(200).json(data.message).end();
            })
            .catch(function (e) {
                res.status(500).json({ "reason": "Not able to add track changes." }).end();
            })
    },
    trackchangesModule: function (data, inputref, updateStatus) {
        return new Promise(function (resolve, reject) {
            var trackChangesArray = [];
            var finalData = data.message.Output;
            var finalDataKeysLen = Object.keys(finalData).length;
            var c = cheerio.load(inputref);
            for (var objkey in finalData) {
                if (finalData[objkey].length > 0) {
                    var currObj = finalData[objkey];
                    for (var ref in currObj) {
                        var currRefObj = currObj[ref];
                        var currRefKey = Object.keys(currRefObj)[0];
                        var currRefString = currRefObj[currRefKey].BibliographyString;
                        var currRefObtained = currRefObj[currRefKey].ObtainedDataSource;
                        var outputRef = {
                            'BibliographyString': currRefString,
                            'ObtainedDataSource': 'pubmed' // for now this information not available, should be replaced with "currRefObtained"
                        }
                        // getting respective input reference by matching id of output reference
                        // adding track changes by comparing and input and output element by element
                        var crs = cheerio.load(currRefString);
                        var currRefId = crs('p').attr('id');
                        var inputRef = c('p[id="' + currRefId + '"]').toString();
                        trackChangesArray.push(tc.addtrackchanges(outputRef, inputRef, objkey, currRefKey));
                        Q.allSettled(trackChangesArray)
                            .then(function (results) {
                                for (var result in results) {
                                    if (results[result].value.statusMessage == 'success') {
                                        var parentKey = results[result].value.parentKey;
                                        var parentObjKey = results[result].value.parentObjKey;
                                        for (var refFinalObj in data.message.Output[parentObjKey]) {
                                            if (typeof (data.message.Output[parentObjKey][refFinalObj][parentKey]) == "object") {
                                                data.message.Output[parentObjKey][refFinalObj][parentKey].BibliographyString = results[result].value.finalString.BibliographyString;
                                            }
                                        }
                                    }
                                }
                                resolve(data);
                                return;
                            })
                            .catch(function (e) {
                                reject(e);
                                return;
                            });
                    }
                }
            }

        });
    },
    addtrackchanges: function (outputRef, inputRef, parentObjKey, parentKey) {
        return new Promise(function (resolve, reject) {
            try {
                movePunctuationsOutsideTag(outputRef.BibliographyString)
                    .then(function (puncRef) {
                        var ipRef = cheerio.load(inputRef);
                        var opRef = cheerio.load(puncRef);
                        var formattingTags = ['b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup'];
                        var options = {
                            ignoreWhitespaces: true
                        };
                        var htmlDiffer = new HtmlDiffer(options);
                        // input and validated reference compared element by element to introdoce track changes
                        // elements are matched by class names
                        // if an element found in same poisition both in input and validated reference then elements are compared and track changes are introduced
                        var intialInputRefLen = ipRef('p > [class]').length;
                        var ipRefTemp = ipRef('p > [class]');
                        for (var key = 0; key < ipRef('p > [class]').length; key++) {
                            if (ipRef(ipRef('p > [class]')[key]).find('[id]').length > 0) {
                                ipRef(ipRef('p > [class]')[key]).find('[id]').removeAttr('id');
                            }
                            ipRef(ipRef('p > [class]')[key]).removeAttr('id'); //remove attr id from old data
                            if ((opRef('p > [class]')[key]) && (opRef(opRef('p > [class]')[key]).attr('class') == ipRef(ipRef('p > [class]')[key]).attr('class'))) {
                                if (opRef(opRef('p > [class]')[key]).attr('class') == 'RefAuthor') {
                                    var validatedSurName, validatedGivenName, oldSurName, oldGivenName, validatedAuthor, oldAuthor;
                                    //if input refernce doesn't have author as surname and given
                                    //then whole author text is compared with output to add track changes
                                    if (ipRef(ipRef('p > [class]')[key]).find('.RefSurName').length == 0) {
                                        oldAuthor = ipRef(ipRef('p > [class]')[key]).text().replace(/\s/g, '');
                                        validatedAuthor = opRef(opRef('p > [class]')[key]).text().replace(/\s/g, '');
                                        if (oldAuthor != validatedAuthor) {
                                            var validatedAuthorName = opRef(opRef('p > [class]')[key]).children().toString();
                                            opRef(opRef('p > [class]')[key]).children().remove();
                                            opRef(opRef('p > [class]')[key]).append('<span class="del">' + ipRef(ipRef('p > [class]')[key]).text() + '</span><span class="ins">' + validatedAuthorName + '</span>');
                                            opRef(opRef('p > [class]')[key]).find('.del, .ins').attr('data-diff-rid', uuidv4());
                                            if (opRef(opRef('p > [class]')[key]).attr('id') == undefined) { // adding same track id to author and trackchanges node
                                                var trackID = uuidv4();
                                                opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                                opRef(opRef('p > [class]')[key]).find('.del, .ins').attr('data-track-id', trackID);
                                            } else {
                                                var trackID = opRef(opRef('p > [class]')[key]).attr('id');
                                                opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                            }
                                        }
                                    } else {
                                        if (opRef(opRef('p > [class]')[key]).find('.RefSurName').length > 0) {
                                            validatedSurName = opRef(opRef('p > [class]')[key]).find('.RefSurName').toString();
                                        }
                                        if (opRef(opRef('p > [class]')[key]).find('.RefGivenName').length > 0) {
                                            validatedGivenName = opRef(opRef('p > [class]')[key]).find('.RefGivenName').toString();
                                        }
                                        if (ipRef(ipRef('p > [class]')[key]).find('.RefSurName').length > 0) {
                                            oldSurName = ipRef(ipRef('p > [class]')[key]).find('.RefSurName').toString();
                                        }
                                        if (ipRef(ipRef('p > [class]')[key]).find('.RefGivenName').length > 0) {
                                            oldGivenName = ipRef(ipRef('p > [class]')[key]).find('.RefGivenName').toString();
                                        }
                                        validatedAuthor = validatedSurName + validatedGivenName;
                                        oldAuthor = oldSurName + oldGivenName;
                                        if (!htmlDiffer.isEqual(oldAuthor, validatedAuthor)) {
                                            var validatedAuthorName = opRef(opRef('p > [class]')[key]).children().toString();
                                            opRef(opRef('p > [class]')[key]).children().remove();
                                            opRef(opRef('p > [class]')[key]).append('<span class="del">' + ipRef(ipRef('p > [class]')[key]).children() + '</span><span class="ins">' + validatedAuthorName + '</span>');
                                            opRef(opRef('p > [class]')[key]).find('.del, .ins').attr('data-diff-rid', uuidv4());
                                            if (opRef(opRef('p > [class]')[key]).attr('id') == undefined) { // adding same track id to author and trackchanges node
                                                var trackID = uuidv4();
                                                opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                                opRef(opRef('p > [class]')[key]).find('.del, .ins').attr('data-track-id', trackID);
                                            } else {
                                                var trackID = opRef(opRef('p > [class]')[key]).attr('id');
                                                opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                            }
                                        }
                                    }
                                } else {
                                    var oldData = ipRef(ipRef('p > [class]')[key]).toString();
                                    var validateData = opRef(opRef('p > [class]')[key]).toString();
                                    if (!htmlDiffer.isEqual(oldData, validateData)) {
                                        if (opRef(opRef('p > [class]')[key]).children().length > 0) {
                                            if (formattingTags.indexOf(opRef(opRef('p > [class]')[key]).children()[0].name) >= 0) {
                                                opRef(opRef('p > [class]')[key]).children().addClass('sty');
                                            } else {
                                                opRef(opRef('p > [class]')[key]).children().wrap('<span class="ins"></span>');
                                                if (ipRef(ipRef('p > [class]')[key]).children().length > 0) {
                                                    opRef(opRef('p > [class]')[key]).prepend('<span class="del">' + ipRef(ipRef('p > [class]')[key]).children().toString() + '</span>');
                                                } else {
                                                    opRef(opRef('p > [class]')[key]).prepend('<span class="del">' + ipRef(ipRef('p > [class]')[key]).text() + '</span>');
                                                }
                                            }
                                        } else {
                                            opRef(opRef('p > [class]')[key]).contents().eq(0).wrap('<span class="ins"></span>');
                                            opRef(opRef('p > [class]')[key]).prepend('<span class="del">' + ipRef(ipRef('p > [class]')[key]).text() + '</span>');
                                        }
                                        opRef(opRef('p > [class]')[key]).find('.del, .ins').attr('data-diff-rid', uuidv4());
                                        var trackID = uuidv4();
                                        opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                        opRef(opRef('p > [class]')[key]).find('.del, .ins').attr('data-track-id', trackID);
                                    }
                                }
                            }
                            else {
                                // if input element class does not match with validated element at the same position track changes has to be added
                                // if input ref has author element and validated reference does not has it. then it is marked as deleted element
                                // if validated ref has author and input element doesn't have the same. then it is marked as inserted
                                // for other elements, if element is not found in validated reference at any position then it is marked as deleted
                                if ((ipRef(ipRef('p > [class]')[key]).attr('class') == 'RefAuthor') || (opRef('p').find('[class=' + ipRef(ipRef('p > [class]')[key]).attr('class') + ']').length > 0)) { // handling inserted element
                                    if (opRef(opRef('p > [class]')[key]).attr('class') == 'RefAuthor') {
                                        var authorName = opRef(opRef('p > [class]')[key]).children().toString()
                                        opRef(opRef('p > [class]')[key]).children().remove();
                                        opRef(opRef('p > [class]')[key]).append('<span class="ins"></span>');
                                        opRef(opRef('p > [class]')[key]).find('.ins').append(authorName);
                                        opRef(opRef('p > [class]')[key]).find('.ins').attr('data-diff-rid', uuidv4());
                                        var trackID = uuidv4();
                                        opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                        opRef(opRef('p > [class]')[key]).find('.ins').attr('data-track-id', trackID);
                                        ipRef('<span class=insertedNode>dummy</span>').insertBefore(ipRef(ipRef('p > [class]')[key]));
                                    } else if (opRef(opRef('p > [class]')[key]).attr('class') == 'RefEtal') {
                                        opRef('<span class=del>' + ipRef(ipRef('p > [class]')[key]) + '</span>').insertBefore(opRef(opRef('p > [class]')[key]));
                                    } else if ((opRef('p').find('[class=' + ipRef(ipRef('p > [class]')[key]).attr('class') + ']').length > 0) && (opRef('p').find('[class=' + ipRef(ipRef('p > [class]')[key]).attr('class') + '] .ins').length > 0)) {
                                        opRef('<span class=del>' + ipRef(ipRef('p > [class]')[key]) + '</span>').insertBefore(opRef(opRef('p > [class]')[key]));
                                    } else {
                                        if (opRef(opRef('p > [class]')[key]).children().length > 0) {
                                            opRef(opRef('p > [class]')[key]).children().wrap('<span class="ins"></span>');
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-diff-rid', uuidv4());
                                            var trackID = uuidv4();
                                            opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-track-id', trackID);
                                        } else {
                                            opRef(opRef('p > [class]')[key]).contents().eq(0).wrap('<span class="ins"></span>');
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-diff-rid', uuidv4());
                                            var trackID = uuidv4();
                                            opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-track-id', trackID);
                                        }
                                        ipRef('<span class=insertedNode>dummy</span>').insertBefore(ipRef(ipRef('p > [class]')[key]));
                                    }
                                } else { // handling deleted element
                                    if (ipRef(ipRef('p > [class]')[key]).children().length > 0) {
                                        opRef('<span class="del">' + ipRef(ipRef('p > [class]')[key]).children() + '</span>').insertBefore(opRef(opRef('p > [class]')[key]));
                                        opRef(opRef('p > [class]')[key]).find('.del').attr('data-diff-rid', uuidv4());
                                    } else {
                                        opRef('<span class="del">' + ipRef(ipRef('p > [class]')[key]) + '</span>').insertBefore(opRef(opRef('p > [class]')[key]));
                                        opRef(opRef('p > [class]')[key]).find('.del').attr('data-diff-rid', uuidv4());
                                    }
                                }
                            }
                            if (intialInputRefLen * 2 < ipRef('p > [class]').length) {
                                ipRef('p').attr('data-track-changes', 'false');
                                break;
                            }
                        }
                        if (ipRef('p').attr('data-track-changes') == undefined) {
                            // considering that elements at the end of para which doesn't match with input elements as inserted elements
                            var inputEleLen = ipRef('p > [class]').length;
                            for (var key = ipRef('p > [class]').length; inputEleLen < opRef('p > [class]').length; key++) {
                                inputEleLen = inputEleLen + 1; // increasing element length
                                if (opRef(opRef('p > [class]')[key]).attr('class') != 'del' || opRef(opRef('p > [class]')[key]).attr('class') != 'ins') {
                                    if (ipRef('p').find('[class=' + opRef(opRef('p > [class]')[key]).attr('class') + ']').length == 0) {
                                        if (opRef(opRef('p > [class]')[key]).children().length > 0) {
                                            opRef(opRef('p > [class]')[key]).children().wrap('<span class="ins"></span>');
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-diff-rid', uuidv4());
                                            var trackID = uuidv4();
                                            opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-track-id', trackID);
                                        } else {
                                            opRef(opRef('p > [class]')[key]).contents().eq(0).wrap('<span class="ins"></span>');
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-diff-rid', uuidv4());
                                            var trackID = uuidv4();
                                            opRef(opRef('p > [class]')[key]).attr('data-track-id', trackID);
                                            opRef(opRef('p > [class]')[key]).find('.ins').attr('data-track-id', trackID);
                                        }
                                    }
                                }
                            }
                            // adding details to track changes
                            var objDate = new Date();
                            var locale = "en-us";
                            var unformatedTime = objDate.getTime();
                            var month = objDate.toLocaleString(locale, { month: "short" });
                            var time = objDate.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: true });
                            objDate = objDate.getDate() + ' ' + month + ' ' + (objDate.getYear() + 1900) + ' ' + time;
                            if (outputRef.ObtainedDataSource) {
                                opRef('p').find('.del').attr('title', 'Deleted by ' + outputRef.ObtainedDataSource + ' - ' + objDate).attr('data-userid', outputRef.ObtainedDataSource).attr('data-username', outputRef.ObtainedDataSource).attr('data-time', unformatedTime);
                                opRef('p').find('.ins').attr('title', 'Inserted by ' + outputRef.ObtainedDataSource + ' - ' + objDate).attr('data-userid', outputRef.ObtainedDataSource).attr('data-username', outputRef.ObtainedDataSource).attr('data-time', unformatedTime);
                            }
                            outputRef.BibliographyString = opRef('p').toString();
                        }
                        resolve({ 'statusMessage': 'success', 'finalString': outputRef, 'parentObjKey': parentObjKey, 'parentKey': parentKey });
                        return;
                    })
                    .catch(function (error) {
                        reject({ 'statusMessage': 'error', 'parentObjKey': parentObjKey, 'parentKey': parentKey });
                    });
            }
            catch (e) {
                reject({ 'statusMessage': 'error', 'parentObjKey': parentObjKey, 'parentKey': parentKey });
            }
        });
    }
}
module.exports = tc;

function movePunctuationsOutsideTag(validatedRef) {
    return new Promise(function (resolve, reject) {
        try {
            var r = cheerio.load(validatedRef);
            var startPunc, currText, endPunc;
            r('p > [class]').each(function () {
                currText = r(this).text();
                startPunc = currText;
                endPunc = currText;
                startPunc = startPunc.replace(/((^[^a-ÿA-Z0-9])?[a-ÿA-Z0-9](\w|\W)*)/g, '$2');
                endPunc = endPunc.replace(/((\w|\W)([^a-ÿA-Z0-9]$)*)/g, '$3');
                if (endPunc != undefined && endPunc != '') {
                    endPunc = r.parseHTML(endPunc);
                    r(endPunc).insertAfter(r(this));
                }
                if (startPunc != undefined && startPunc != '') {
                    startPunc = r.parseHTML(startPunc);
                    r(startPunc).insertBefore(r(this));
                }
                if ((startPunc != undefined && startPunc != '') || (endPunc != undefined && endPunc != '')) {
                    currText = currText.replace(/^[^a-ÿA-Z0-9]|[^a-ÿA-Z0-9]$/g, '');
                    r(this).text(currText);
                }
            });
            resolve(r('p').toString());
            return;
        } catch (e) {
            reject(validatedRef);
        }
    });
}


