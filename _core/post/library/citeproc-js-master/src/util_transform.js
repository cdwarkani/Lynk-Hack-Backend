/*global CSL: true */

/*
 * Fields can be transformed by translation/transliteration, or by
 * abbreviation.  Transformations are performed in that order.
 *
 * Renderings of original, translated or transliterated content
 * (followed by abbreviation if requested) are placed in the primary
 * output slot or the (implicitly punctuated) secondary and tertiary
 * output slots according to the settings registered in the
 * state.opt['cite-lang-prefs'] arrays. The array has six segments:
 * 'persons', 'institutions', 'titles', 'journals', 'publishers', and
 * 'places'. Each segment always contains at least one item, and may
 * hold values 'orig', 'translit' or 'translat'. The array defaults to
 * a single item 'orig'.
 *
 * All multilingual variables are associated with segments,
 * with the exception of 'edition' and 'genre'. These two
 * exceptions are always rendered with the first matching
 * language form found in state.opt['locale-translit'] or, if
 * composing a sort key, state.opt['locale-sort']. No secondary
 * slot rendering is performed for this two variables.
 *
 * The balance of multilingual variables are rendered with
 * the first matching value in the transform locales spec
 * (no transform, state.opt['locale-translit'], or 
 * state.opt['locale-translat']) mapped to the target
 * slot.
 *
 * Full primary+secondary+tertiary rendering is performed only in
 * note-style citations and the bibliography.  In-text citations are
 * rendered in the primary output slot only, following the same spec
 * parameters.
 *
 *   Optional setters:
 *     .setAbbreviationFallback(); fallback flag
 *       (if true, a failed abbreviation will fallback to long)
 *
 *     .setAlternativeVariableName(): alternative variable name in Item,
 *       for use as a fallback abbreviation source
 *
 * Translation/transliteration
 *
 *   Optional setter:
 *     .setTransformFallback():
 *       default flag (if true, the original field value will be used as a fallback)
 *
 * The getTextSubField() method may be used to obtain a string transform
 * of a field, without abbreviation, as needed for setting sort keys
 * (for example).
 *
 */

CSL.Transform = function (state) {
    var debug = false, abbreviations, token, fieldname, abbrev_family, opt;

    // Abbreviation families
    this.abbrevs = {};
    this.abbrevs["default"] = new state.sys.AbbreviationSegments();
    this.getTextSubField = getTextSubField;

    function getCountryOrJurisdiction(variable, normalizedKey, quashCountry) {
        var value = "";
        if (state.sys.getHumanForm) {
            if (variable === "country") {
                value = state.sys.getHumanForm(normalizedKey.toLowerCase(), false, true);
                value = value.split("|")[0];
            } else if (variable === "jurisdiction") {
                value = state.sys.getHumanForm(normalizedKey.toLowerCase(), false, true);
                if (!quashCountry) {
                    value = value.split("|").slice(1).join(", ");
                } else {
                    // Bare country name is rendered by "country", not "jurisdiction"
                    value = "";
                }
            }
	    }
	    return value;
    }
    
    // Internal function
    function abbreviate(state, tok, Item, altvar, basevalue, family_var, use_field, form) {
        var value = "";
        var myabbrev_family = CSL.FIELD_CATEGORY_REMAP[family_var];
        var preferredJurisdiction;
        if (!myabbrev_family) {
            return basevalue;
        }

        var variable = family_var;
        var normalizedKey = basevalue;
        if (state.sys.normalizeAbbrevsKey) {
            normalizedKey = state.sys.normalizeAbbrevsKey(family_var, basevalue);
        }
        var quashCountry = false;
        if (variable === "jurisdiction" && normalizedKey) {
            quashCountry = normalizedKey.indexOf(":") === -1;
        }
        
        // Lazy retrieval of abbreviations.
        if (state.sys.getAbbreviation) {

            if (["jurisdiction", "country", "language-name", "language-name-original"].indexOf(variable) > -1) {
                preferredJurisdiction = "default";
            } else if (Item.jurisdiction) {
                preferredJurisdiction = Item.jurisdiction;
            } else {
                preferredJurisdiction = "default";
            }
            var jurisdiction = state.transform.loadAbbreviation(preferredJurisdiction, myabbrev_family, normalizedKey, Item.type);

            // Some rules:
            // # variable === "country"
            // (1) If an abbreviation is associated with the code, then:
            //     (a) return the abbreviated form if form="short"
            // (2) Otherwise:
            //     (a) return the human-readable country name, or whatever is there if it's not a code
            // # variable === "jurisdiction"
            // (1) If !!getHumanForm(jurisdictionID, false, false):
            //     (a) If the code is top-level (i.e. a country):
            //         (i) return nothing -- this is what the "country" variable is for.
            //     (b) otherwise:
            //         (i) If an abbreviation is associated with the code, then:
            //             (A) return the abbreviated form
            //         (ii) Otherwise
            //             (A) return the human-readable form, with the country name & code removed from the front
            // (2) Otherwise:
            //     (a) abbreviate as per normal.
            // # other variables
            // (1) Abbreviate as per normal.

            if (state.transform.abbrevs[jurisdiction][myabbrev_family] && normalizedKey) {
                // Safe to test presence of abbrev against raw object in this block
                var abbrev = state.transform.abbrevs[jurisdiction][myabbrev_family][normalizedKey];
                if (tok.strings.form === "short" && abbrev) {
                    if (quashCountry) {
                        value = "";
                    } else {
                        value = abbrev;
                    }
                } else {
	                value = getCountryOrJurisdiction(variable, normalizedKey, quashCountry);
                }
            }
        }
        
        // Was for: 
        if (!value 
            && (!state.opt.development_extensions.require_explicit_legal_case_title_short || Item.type !== 'legal_case') 
            && altvar && Item[altvar] && use_field) {
            value = Item[altvar];
        }
        if (!value && !state.sys.getAbbreviation && state.sys.getHumanForm) {
	        value = getCountryOrJurisdiction(variable, normalizedKey, quashCountry);
	    }
        if (!value && !quashCountry && (!state.sys.getHumanForm || variable !== "jurisdiction")) {
            value = basevalue;
        }
        return value;
    }

    function getFieldLocale(Item,field) {
        var ret = state.opt["default-locale"][0].slice(0, 2)
        var localeRex;
        if (state.opt.development_extensions.strict_text_case_locales) {
            localeRex = new RegExp("^([a-zA-Z]{2})(?:$|-.*| .*)");
        } else {
            localeRex = new RegExp("^([a-zA-Z]{2})(?:$|-.*|.*)");
        }
        if (Item.language) {
            var m = ("" + Item.language).match(localeRex);
            if (m) {
                ret = m[1];
            } else {
                // Set garbage to "Klingon".
                ret = "tlh";
            }
        }
        if (Item.multi && Item.multi && Item.multi.main && Item.multi.main[field]) {
            ret = Item.multi.main[field];
        }
        if (!state.opt.development_extensions.strict_text_case_locales
           || state.opt.development_extensions.normalize_lang_keys_to_lowercase) {

            ret = ret.toLowerCase();
        }
        return ret;
    };

    // Internal functions
    function getTextSubField (Item, field, locale_type, use_default, stopOrig) {
        var m, lst, opt, o, oo, pos, key, ret, len, myret, opts;
        var usedOrig = stopOrig;
        var usingOrig = false;

        if (!Item[field]) {
            return {
                name:"",
                usedOrig:stopOrig,
                token: CSL.Util.cloneToken(this)
            };
        }
        ret = {name:"", usedOrig:stopOrig,locale:getFieldLocale(Item,field)};

        opts = state.opt[locale_type];
        var hasVal = false;
        var jurisdictionName = false;
        if (locale_type === 'locale-orig') {
            if (stopOrig) {
                ret = {name:"", usedOrig:stopOrig};
            } else {
                ret = {name:Item[field], usedOrig:false, locale:getFieldLocale(Item,field)};
            }
            hasVal = true;
            usingOrig = true;
        } else if (use_default && ("undefined" === typeof opts || opts.length === 0)) {
            // If we want the original, or if we don't have any specific guidance and we 
            // definitely want output, just return the original value.
            var ret = {name:Item[field], usedOrig:true, locale:getFieldLocale(Item,field)};
            hasVal = true;
            usingOrig = true;
        }

        if (!hasVal) {
            for (var i = 0, ilen = opts.length; i < ilen; i += 1) {
                opt = opts[i];
                o = opt.split(/[\-_]/)[0];
                if (opt && Item.multi && Item.multi._keys[field] && Item.multi._keys[field][opt]) {
                    ret.name = Item.multi._keys[field][opt];
                    ret.locale = opt;
                    //if (field === 'jurisdiction') jurisdictionName = ret.name;
                    break;
                } else if (o && Item.multi && Item.multi._keys[field] && Item.multi._keys[field][o]) {
                    ret.name = Item.multi._keys[field][o];
                    ret.locale = o;
                    //if (field === 'jurisdiction') jurisdictionName = ret.name;
                    break;
                }
            }
            if (!ret.name && use_default) {
                ret = {name:Item[field], usedOrig:true, locale:getFieldLocale(Item,field)};
                usingOrig = true;
            }
        }
        ret.token = CSL.Util.cloneToken(this);
        if (["title", "container-title"].indexOf(field) > -1) {
            if (!usedOrig
                && (!ret.token.strings["text-case"]
                    || ret.token.strings["text-case"] === "sentence"
                    || ret.token.strings["text-case"] === "normal")) {
                
                var locale = usingOrig ? false : ret.locale;
                var seg = field.slice(0,-5);
                var sentenceCase = ret.token.strings["text-case"] === "sentence" ? true : false;
                ret.name = CSL.titlecaseSentenceOrNormal(state, Item, seg, locale, sentenceCase);
                delete ret.token.strings["text-case"];
            }
        }
        return ret;
    }

    // Setter for abbreviation lists
    // This initializes a single abbreviation based on known
    // data.
    function loadAbbreviation(jurisdiction, category, orig, itemType) {
        var pos, len;
        if (!jurisdiction) {
            jurisdiction = "default";
        }
        if (!orig) {
            if (!state.transform.abbrevs[jurisdiction]) {
                state.transform.abbrevs[jurisdiction] = new state.sys.AbbreviationSegments();
            }
            if (!state.transform.abbrevs[jurisdiction][category]) {
                state.transform.abbrevs[jurisdiction][category] = {};
            }
            return jurisdiction;
        }
        // The getAbbreviation() function should check the
        // external DB for the content key. If a value exists
        // in this[category] and no value exists in DB, the entry
        // in memory is left untouched. If a value does exist in
        // DB, the memory value is created.
        //
        // See testrunner_stdrhino.js for an example.
        if (state.sys.getAbbreviation) {
            jurisdiction = state.sys.getAbbreviation(state.opt.styleID, state.transform.abbrevs, jurisdiction, category, orig, itemType, true);
            if (!jurisdiction) {
                jurisdiction = "default";
            }
        }
        return jurisdiction;
    }
    this.loadAbbreviation = loadAbbreviation;

    function publisherCheck (tok, Item, primary, family_var) {
        var varname = tok.variables[0];
        if (state.publisherOutput && primary) {
            if (["publisher","publisher-place"].indexOf(varname) === -1) {
                return false;
            } else {
                // In this case, the publisher bundle will be rendered
                // at the close of the group, by the closing group node.
                state.publisherOutput[varname + "-token"] = tok;
                state.publisherOutput.varlist.push(varname);
                var lst = primary.split(/;\s*/);
                if (lst.length === state.publisherOutput[varname + "-list"].length) {
                    state.publisherOutput[varname + "-list"] = lst;
                }
                // Abbreviate each of the items in the list here!
                for (var i = 0, ilen = lst.length; i < ilen; i += 1) {
                    lst[i] = abbreviate(state, tok, Item, false, lst[i], family_var, true);
                }
                state.tmp[varname + "-token"] = tok;
                return true;
            }
        }
        return false;
    }

    // Return function appropriate to selected options
    function getOutputFunction(variables, family_var, abbreviation_fallback, alternative_varname, transform_fallback) {
        // var mytoken;

        // Set the primary_locale and secondary_locale lists appropriately.
        // No instance helper function for this; everything can be derived
        // from processor settings and rendering context.

        var localesets;
        var langPrefs = CSL.LangPrefsMap[variables[0]];
        if (!langPrefs) {
            localesets = false;
        } else {
            localesets = state.opt['cite-lang-prefs'][langPrefs];
        }

        return function (state, Item, item, usedOrig) {
            var primary, primary_locale, secondary, secondary_locale, tertiary, tertiary_locale, primary_tok, group_tok, key;
            if (!variables[0] || (!Item[variables[0]] && !Item[alternative_varname])) {
                return null;
            }

            var slot = {primary:false, secondary:false, tertiary:false};
            if (state.tmp.area.slice(-5) === "_sort") {
                slot.primary = 'locale-sort';
            } else {
                if (localesets) {
                    var slotnames = ["primary", "secondary", "tertiary"];
                    for (var i = 0, ilen = slotnames.length; i < ilen; i += 1) {
                        if (localesets.length - 1 <  i) {
                            break;
                        }
                        if (localesets[i]) {
                            slot[slotnames[i]] = 'locale-' + localesets[i];
                        }
                    }
                } else {
                    slot.primary = 'locale-orig';
                }
            }
            
            if (variables[0] === "title-short" 
                || (state.tmp.area !== "bibliography"
                    && !(state.tmp.area === "citation"
                         && state.opt.xclass === "note"
                         && item && !item.position))) {
                
                slot.secondary = false;
                slot.tertiary = false;
            }
            
            // Problem for multilingual: we really should be
            // checking for sanity on the basis of the output
            // strings to be actually used. (also below)
            if (state.tmp["publisher-list"]) {
                if (variables[0] === "publisher") {
                    state.tmp["publisher-token"] = this;
                } else if (variables[0] === "publisher-place") {
                    state.tmp["publisher-place-token"] = this;
                }
                return null;
            }

            // True is for transform fallback
            var res = getTextSubField.call(this, Item, variables[0], slot.primary, true);
            primary = res.name;
            primary_locale = res.locale;
            var primary_tok = res.token;
            var primaryUsedOrig = res.usedOrig;

            if (publisherCheck(this, Item, primary, family_var)) {
                return null;
            }

            // No fallback for secondary and tertiary
            secondary = false;
            tertiary = false;
            var secondary_tok;
            var tertiary_tok;
            if (slot.secondary) {
                res = getTextSubField.call(this, Item, variables[0], slot.secondary, false, res.usedOrig);
                secondary = res.name;
                secondary_locale = res.locale;
                secondary_tok = res.token;
                //print("XXX secondary_locale: "+secondary_locale);
            }
            if (slot.tertiary) {
                res = getTextSubField.call(this, Item, variables[0], slot.tertiary, false, res.usedOrig);
                tertiary = res.name;
                tertiary_locale = res.locale;
                tertiary_tok = res.token;
                //print("XXX tertiary_locale: "+tertiary_locale);
            }
        
            // Abbreviate if requested and if poss.
            // (We don't yet control for the possibility that full translations may not
            // be provided on the alternative variable.)
            if (family_var) {
                primary = abbreviate(state, primary_tok, Item, alternative_varname, primary, family_var, true);
                // Suppress subsequent use of another variable if requested by
                // hack syntax in this abbreviation short form.
                if (primary) {
                    primary = quashCheck(primary);
                }
                // Avoid needless thrashing
                if (secondary) {
                    secondary = abbreviate(state, secondary_tok, Item, false, secondary, family_var, true);
                }
                if (tertiary) {
                    tertiary = abbreviate(state, tertiary_tok, Item, false, tertiary, family_var, true);
                }
            }
            
            // Decoration of primary (currently translit only) goes here
            var primaryPrefix;
            if (slot.primary === "locale-translit") {
                primaryPrefix = state.opt.citeAffixes[langPrefs][slot.primary].prefix;
            }                
            // XXX This should probably protect against italics at higher
            // levels.

            if (primaryPrefix === "<i>" && variables[0] === 'title' && !primaryUsedOrig) {
                var hasItalic = false;
                for (var i = 0, ilen = primary_tok.decorations.length; i < ilen; i += 1) {
                    if (primary_tok.decorations[i][0] === "@font-style"
                        && primary_tok.decorations[i][1] === "italic") {
                        
                        hasItalic = true;
                    }
                }
                if (!hasItalic) {
                    primary_tok.decorations.push(["@font-style", "italic"])
                }
            }

            //print("XXX "+primary_tok.strings["text-case"]);
            if (primary_locale !== "en" && primary_tok.strings["text-case"] === "title") {
                primary_tok.strings["text-case"] = "passthrough";
            }
            
            if ("title" === variables[0]) {
                primary = CSL.demoteNoiseWords(state, primary, this["leading-noise-words"]);
            }

            if (secondary || tertiary) {

                state.output.openLevel("empty");

                // A little too aggressive maybe.
                primary_tok.strings.suffix = primary_tok.strings.suffix.replace(/[ .,]+$/,"");
                state.output.append(primary, primary_tok);

                if (secondary) {
                    secondary_tok.strings.prefix = state.opt.citeAffixes[langPrefs][slot.secondary].prefix;
                    secondary_tok.strings.suffix = state.opt.citeAffixes[langPrefs][slot.secondary].suffix;
                    // Add a space if empty
                    if (!secondary_tok.strings.prefix) {
                        secondary_tok.strings.prefix = " ";
                    }
                    // Remove quotes
                    for (var i = secondary_tok.decorations.length - 1; i > -1; i += -1) {
                        if (['@quotes/true', '@font-style/italic', '@font-style/oblique', '@font-weight/bold'].indexOf(secondary_tok.decorations[i].join('/')) > -1) {
                            secondary_tok.decorations = secondary_tok.decorations.slice(0, i).concat(secondary_tok.decorations.slice(i + 1))
                        }
                    }
                    if (secondary_locale !== "en" && secondary_tok.strings["text-case"] === "title") {
                        secondary_tok.strings["text-case"] = "passthrough";
                    }
                    var secondary_outer = new CSL.Token();
                    secondary_outer.decorations.push(["@font-style", "normal"]);
                    secondary_outer.decorations.push(["@font-weight", "normal"]);
                    state.output.openLevel(secondary_outer);
                    state.output.append(secondary, secondary_tok);
                    state.output.closeLevel();

                    var blob_obj = state.output.current.value();
                    var blobs_pos = state.output.current.value().blobs.length - 1;
                    // Suppress supplementary multilingual info on subsequent
                    // partners of a parallel cite.
                    // The logic of this is obscure. Parent blob is used by parallels
                    // detection machinery (leveraged here), while parent list (blob.blobs)
                    // is used by the is-parallel conditional available on cs:group.
                    if (state.parallel.use_parallels) {
                        state.parallel.cite.front.push(variables[0] + ":secondary");
                        state.parallel.cite[variables[0] + ":secondary"] = {blobs:[[blob_obj, blobs_pos]]};
                    }
                }
                if (tertiary) {
                    tertiary_tok.strings.prefix = state.opt.citeAffixes[langPrefs][slot.tertiary].prefix;
                    tertiary_tok.strings.suffix = state.opt.citeAffixes[langPrefs][slot.tertiary].suffix;
                    // Add a space if empty
                    if (!tertiary_tok.strings.prefix) {
                        tertiary_tok.strings.prefix = " ";
                    }
                    // Remove quotes
                    for (var i = tertiary_tok.decorations.length - 1; i > -1; i += -1) {
                        if (['@quotes/true', '@font-style/italic', '@font-style/oblique', '@font-weight/bold'].indexOf(tertiary_tok.decorations[i].join('/')) > -1) {
                            tertiary_tok.decorations = tertiary_tok.decorations.slice(0, i).concat(tertiary_tok.decorations.slice(i + 1))
                        }
                    }
                    if (tertiary_locale !== "en" && tertiary_tok.strings["text-case"] === "title") {
                        tertiary_tok.strings["text-case"] = "passthrough";
                    }
                    var tertiary_outer = new CSL.Token();
                    tertiary_outer.decorations.push(["@font-style", "normal"]);
                    tertiary_outer.decorations.push(["@font-weight", "normal"]);
                    state.output.openLevel(tertiary_outer);
                    state.output.append(tertiary, tertiary_tok);
                    state.output.closeLevel();

                    var blob_obj = state.output.current.value();
                    var blobs_pos = state.output.current.value().blobs.length - 1;
                    // Suppress supplementary multilingual info on subsequent
                    // partners of a parallel cite.
                    // See note above.
                    if (state.parallel.use_parallels) {
                        state.parallel.cite.front.push(variables[0] + ":tertiary");
                        state.parallel.cite[variables[0] + ":tertiary"] = {blobs:[[blob_obj, blobs_pos]]};
                    }
                }
                state.output.closeLevel();
            } else {
                state.output.append(primary, primary_tok);
            }
            return null;
        };
    }
    this.getOutputFunction = getOutputFunction;

    // The name transform code is placed here to keep similar things
    // in one place.  Obviously this module could do with a little
    // tidying up.

    function quashCheck(value) {
        var m = value.match(/^!([-,_a-z]+)>>>/);
        if (m) {
            var fields = m[1].split(",");
            value = value.slice(m[0].length);
            for (var i = 0, ilen = fields.length; i < ilen; i += 1) {
                if (state.tmp.done_vars.indexOf(fields[i]) === -1) {
                    state.tmp.done_vars.push(fields[i]);
                }
            }
        }
        return value;
    }
    this.quashCheck = quashCheck;
};
