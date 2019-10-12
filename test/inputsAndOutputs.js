exports.expectedinput = "Frank, H. S. 1970. The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance. Science, 169(3946): 635–641.";
exports.expectedOutput = [
    {
        "author": [
            {
                "family": "Frank",
                "given": "H.S."
            }
        ],
        "title": "The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance",
        "volume": "169",
        "type": "article-journal",
        "container-title": "Science",
        "issue": "3946",
        "scripts": "Common",
        "issued": {
            "date-parts": [
                [
                    "1970"
                ]
            ]
        },
        "page": "635–641"
    }
];
exports.expectedOutput2 = "<dataset><sequence><author>Frank, H. S. </author><date>1970. </date><title>The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance. </title><journal>Science, </journal><volume>169(3946): </volume><pages>635–641.</pages></sequence></dataset>";
exports.expectedOutput3 = "<p><span class=\"RefAuthor\"><span class=\"RefSurName\">Frank</span>, H. S</span>. <span class=\"RefYear\">1970</span>. <span class=\"RefArticleTitle\">The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance</span>. <span class=\"RefJournalTitle\">Science</span>, <span class=\"RefVolume\">169</span>(<span class=\"RefIssue\">3946</span>): <span class=\"RefFpage\">635</span>–<span class=\"RefLpage\">641</span>.</p>";
exports.expectedOutput4 = {
    "message": {
        "Output": {
            "ValidatedAndFormatted": [
                {
                    "0": {
                        "Input": "",
                        "InputConvertedJson": "\"\"",
                        "MatchedJson": "{\"Item-1\":{\"title\":\"The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance.< END_OF_INPUT >\",\"volume\":\"169\",\"issue\":\"3946\",\"page\":\"635-41\",\"container-title\":\"Science (New York, N.Y.)\",\"container-title-short\":\"Science\",\"ISSN\":\"0036-8075\",\"PMID\":\"17791838\",\"DOI\":\"10.1126/science.169.3946.635\",\"abstract\":\"The train of thought pursued in this article has led to the conclusion that the structure of cold water seems likely to consist, for the most part, of hydrogen-bonded, four-coordinated, framework regions, with interstitial monomers occupying some fraction of the cavities the framework encloses. The precise geometry of the framework has not been specified, but some evidence suggests that it is rather regular at low temperatures and becomes more random as the water gets warmer. These conclusions, meager as they are in comparison with what we shall eventually need to know about water, are still \\\"subject to change without notice.\\\" Such a change would, for instance, be made necessary by the discrediting either of the data or of the interpretations on which the model is based. The discovery of new facts, or of new meanings in old facts, which were clearly in conflict with the model, would also make it necessary to modify, if not to abandon, it. Even this would be progress, however, for it would be another product of the method of drawing upon data from diverse sources and would be a further step toward the progressively more comprehensive model to which this method will lead and the progressively greater confidence we will be able to place in our conclusions.\",\"issn\":\"0036-8075\",\"issued\":{\"date-parts\":[[\"1970\"]]},\"author\":[{\"family\":\"Frank\",\"given\":\"HS\",\"initial\":\"HS\"}],\"URL\":\"https://www.ncbi.nlm.nih.gov/pubmed/17791838\",\"id\":\"Item-1\",\"language\":\"eng\",\"type\":\"article-journal\",\"prefixForStyled\":\"<p>\",\"suffixForStyled\":\"</p>\",\"journalAbbreviation\":\"Science\",\"pmid\":\"17791838\"}}",
                        "ObtainedDataSource": "",
                        "Citation": "\"(Frank, 1970, 1)\"",
                        "BibliographyString": [
                            "<p>  <span class=\"RefAuthor\"><span class=\"RefSurName\">Frank</span> <span class=\"RefGivenName\">HS</span></span>. <span class=\"RefYear\">1970</span>. <span class=\"RefArticleTitle\">The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance.< END_OF_INPUT ></span>. <span class=\"RefJournalTitle\"><i>Science (New York, N.Y.)</i></span> <span class=\"RefVolume\">169</span> <span class=\"RefIssue\">(3946)</span>: <span class=\"RefFPage\">635</span>–<span class=\"RefLPage\">641</span>. <span class=\"RefDOI\">10.1126/science.169.3946.635</span></p>"
                        ],
                        "parseref": "",
                        "index": {
                            "index": "0",
                            "data": {
                                "YetToBeResolved": [],
                                "FailedInputs": [],
                                "SuccesfullyValidatedAndResolved": [
                                    {
                                        "0": {
                                            "title": "The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance.",
                                            "volume": "169",
                                            "issue": "3946",
                                            "page": "635-41",
                                            "container-title": "Science (New York, N.Y.)",
                                            "container-title-short": "Science",
                                            "ISSN": "0036-8075",
                                            "PMID": "17791838",
                                            "DOI": "10.1126/science.169.3946.635",
                                            "abstract": "The train of thought pursued in this article has led to the conclusion that the structure of cold water seems likely to consist, for the most part, of hydrogen-bonded, four-coordinated, framework regions, with interstitial monomers occupying some fraction of the cavities the framework encloses. The precise geometry of the framework has not been specified, but some evidence suggests that it is rather regular at low temperatures and becomes more random as the water gets warmer. These conclusions, meager as they are in comparison with what we shall eventually need to know about water, are still \"subject to change without notice.\" Such a change would, for instance, be made necessary by the discrediting either of the data or of the interpretations on which the model is based. The discovery of new facts, or of new meanings in old facts, which were clearly in conflict with the model, would also make it necessary to modify, if not to abandon, it. Even this would be progress, however, for it would be another product of the method of drawing upon data from diverse sources and would be a further step toward the progressively more comprehensive model to which this method will lead and the progressively greater confidence we will be able to place in our conclusions.",
                                            "issn": "0036-8075",
                                            "issued": "{date: [1970, Aug, 14] }",
                                            "author": [
                                                {
                                                    "family": "Frank",
                                                    "given": "H S",
                                                    "initial": "HS"
                                                }
                                            ],
                                            "URL": "https://www.ncbi.nlm.nih.gov/pubmed/17791838",
                                            "id": "Item-1",
                                            "language": "eng"
                                        }
                                    }
                                ],
                                "InputConvertedToBSJson": [
                                    {
                                        "0": {
                                            "author": [
                                                {
                                                    "family": "Frank",
                                                    "given": "H.S."
                                                }
                                            ],
                                            "title": "The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance",
                                            "volume": "169",
                                            "type": "article-journal",
                                            "container-title": "Science",
                                            "issue": "3946",
                                            "scripts": "Common",
                                            "issued": {
                                                "date-parts": [
                                                    [
                                                        "1970"
                                                    ]
                                                ]
                                            },
                                            "page": "635–641"
                                        }
                                    }
                                ],
                                "InputSupplied": {
                                    "style": "IMA-2.csl",
                                    "locale": "locales-en-US.xml"
                                },
                                "status": "succesfully validated."
                            },
                            "isValidated": true
                        },
                        "BibliographyStringUnstyled": "  Frank HS. 1970. The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance.&#60; END_OF_INPUT &#62;. <i>Science (New York, N.Y.)</i> 169 (3946): 635–641. doi:10.1126/science.169.3946.635 "
                    }
                }
            ],
            "NonValidatedbutFormatted": []
        },
        "FailedInputs": [],
        "InputConvertedToBSJson": [
            {
                "0": {
                    "author": [
                        {
                            "family": "Frank",
                            "given": "H.S."
                        }
                    ],
                    "title": "The Structure of Ordinary Water: New data and interpretations are yielding new insights into this fascinating substance",
                    "volume": "169",
                    "type": "article-journal",
                    "container-title": "Science",
                    "issue": "3946",
                    "scripts": "Common",
                    "issued": {
                        "date-parts": [
                            [
                                "1970"
                            ]
                        ]
                    },
                    "page": "635–641"
                }
            }
        ]
    },
    "status": "success"
};
exports.expectedinput2={
    "YetToBeResolved": [
        {
            "1": {
                "citation-number": "2",
                "author": [
                    {
                        "family": "Auperin",
                        "given": "A"
                    },
                    {
                        "family": "Le Pechoux",
                        "given": "C"
                    },
                    {
                        "family": "Rolland",
                        "given": "E"
                    }
                ],
                "etal": "et al",
                "title": "Meta-analysis of concomitant versus sequential radiochemotherapy in locally advanced non-small-cell lung cancer",
                "container-title": "J Clin Oncol",
                "RefYear": "2010",
                "volume": "28",
                "issue": "13",
                "page-first": "2181",
                "page-last": "2190",
                "PMID": "2190",
                "page": "2181-2190",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "2": {
                "citation-number": "3",
                "author": [
                    {
                        "family": "",
                        "given": ""
                    },
                    {
                        "family": "Paulus",
                        "given": "R"
                    },
                    {
                        "family": "Langer",
                        "given": "CJ"
                    }
                ],
                "etal": "et al",
                "title": "Sequential vs. concurrent chemoradiation for stage III non-small cell lung cancer: randomized phase III trial RTOG 9410",
                "container-title": "J Natl Cancer Inst",
                "RefYear": "2011",
                "volume": "103",
                "issue": "19",
                "page-first": "1452",
                "page-last": "1460",
                "page": "1452-1460",
                "journalAbbreviation": "J Natl Cancer Inst"
            }
        },
        {
            "3": {
                "citation-number": "4",
                "author": [
                    {
                        "family": "Kelly",
                        "given": "K"
                    },
                    {
                        "family": "Chansky",
                        "given": "K"
                    },
                    {
                        "family": "Gaspar",
                        "given": "LE"
                    }
                ],
                "etal": "et al",
                "title": "Phase III trial of maintenance gefitinib or placebo after concurrent chemoradiotherapy and docetaxel consolidation in inoperable stage III non-small-cell lung cancer: SWOG S0023",
                "container-title": "J Clin Oncol",
                "RefYear": "2008",
                "volume": "26",
                "issue": "15",
                "page-first": "2450",
                "page-last": "2456",
                "page": "2450-2456",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "4": {
                "citation-number": "5",
                "author": [
                    {
                        "family": "Ferlay",
                        "given": "J"
                    },
                    {
                        "family": "Soerjomataram",
                        "given": "I"
                    },
                    {
                        "family": "Dikshit",
                        "given": "R"
                    }
                ],
                "etal": "et al",
                "title": "Cancer incidence and mortality worldwide: sources, methods and major patterns in GLOBOCAN 2012",
                "container-title": "Int J Cancer",
                "RefYear": "2015",
                "volume": "136",
                "issue": "5",
                "page-first": "E359",
                "page-last": "386",
                "page": "E359-386",
                "journalAbbreviation": "Int J Cancer"
            }
        },
        {
            "5": {
                "citation-number": "6",
                "author": [
                    {
                        "family": "Wang",
                        "given": "X"
                    },
                    {
                        "family": "Adjei",
                        "given": "AA"
                    }
                ],
                "title": "Lung cancer and metastasis: new opportunities and challenges",
                "container-title": "Cancer Metastasis Rev",
                "RefYear": "2015",
                "volume": "34",
                "issue": "2",
                "page-first": "169",
                "page-last": "171",
                "page": "169-171",
                "journalAbbreviation": "Cancer Metastasis Rev"
            }
        },
        {
            "6": {
                "citation-number": "7",
                "author": [
                    {
                        "family": "Velizheva",
                        "given": "NP"
                    },
                    {
                        "family": "Rechsteiner",
                        "given": "MP"
                    },
                    {
                        "family": "Valtcheva",
                        "given": "N"
                    }
                ],
                "etal": "et al",
                "title": "Targeted next-generation-sequencing for reliable detection of targetable rearrangements in lung adenocarcinoma-a single center retrospective study",
                "container-title": "Pathol Res Pract",
                "RefYear": "2018",
                "volume": "214",
                "issue": "4",
                "page-first": "572",
                "page-last": "578",
                "page": "572-578",
                "journalAbbreviation": "Pathol Res Pract"
            }
        },
        {
            "7": {
                "citation-number": "8",
                "author": [
                    {
                        "family": "Monterisi",
                        "given": "S"
                    },
                    {
                        "family": "Lo Riso",
                        "given": "P"
                    },
                    {
                        "family": "Russo",
                        "given": "K"
                    }
                ],
                "etal": "et al",
                "title": "HOXB7 overexpression in lung cancer is a hallmark of acquired stem-like phenotype",
                "container-title": "Oncogene",
                "RefYear": "2018",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "8": {
                "citation-number": "9",
                "author": [
                    {
                        "family": "Kim",
                        "given": "J"
                    },
                    {
                        "family": "McMillan",
                        "given": "E"
                    },
                    {
                        "family": "Kim",
                        "given": "HS"
                    }
                ],
                "etal": "et al",
                "title": "XPO1-dependent nuclear export is a druggable vulnerability in KRAS-mutant lung cancer",
                "container-title": "Nature",
                "RefYear": "2016",
                "volume": "538",
                "issue": "7623",
                "page-first": "114",
                "page-last": "117",
                "page": "114-117",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "9": {
                "citation-number": "10",
                "author": [
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Scholtes",
                        "given": "EH"
                    },
                    {
                        "family": "Zuydgeest",
                        "given": "D"
                    }
                ],
                "etal": "et al",
                "title": "Identification of an invasion-inducing gene, Tiam-1, that encodes a protein with homology to GDP-GTP exchangers for Rho-like proteins",
                "container-title": "Cell",
                "RefYear": "1994",
                "volume": "77",
                "issue": "4",
                "page-first": "537",
                "page-last": "549",
                "page": "537-549",
                "journalAbbreviation": "Cell"
            }
        },
        {
            "10": {
                "citation-number": "11",
                "author": [
                    {
                        "family": "Michiels",
                        "given": "F"
                    },
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Stam",
                        "given": "JC"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "RA"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "A role for Rac in Tiam1-induced membrane ruffling and invasion",
                "container-title": "Nature",
                "RefYear": "1995",
                "volume": "375",
                "issue": "6529",
                "page-first": "338",
                "page-last": "340",
                "page": "338-340",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "11": {
                "citation-number": "12",
                "author": [
                    {
                        "family": "Heasman",
                        "given": "SJ"
                    },
                    {
                        "family": "Ridley",
                        "given": "AJ"
                    }
                ],
                "title": "Mammalian Rho GTPases: new insights into their functions from in vivo studies",
                "container-title": "Nat Rev Mol Cell Biol",
                "RefYear": "2008",
                "volume": "9",
                "issue": "9",
                "page-first": "690",
                "page-last": "701",
                "page": "690-701",
                "journalAbbreviation": "Nat Rev Mol Cell Biol"
            }
        },
        {
            "12": {
                "citation-number": "13",
                "author": [
                    {
                        "family": "Hall",
                        "given": "A"
                    }
                ],
                "title": "Rho GTPases and the actin cytoskeleton",
                "container-title": "Science",
                "RefYear": "1998",
                "volume": "279",
                "issue": "5350",
                "page-first": "509",
                "page-last": "514",
                "page": "509-514",
                "journalAbbreviation": "Science"
            }
        },
        {
            "13": {
                "citation-number": "14",
                "author": [
                    {
                        "family": "Welch",
                        "given": "HC"
                    }
                ],
                "title": "Regulation and function of P-Rex family Rac-GEFs",
                "container-title": "Small GTPases",
                "RefYear": "2015",
                "volume": "6",
                "issue": "2",
                "page-first": "49",
                "page-last": "70",
                "page": "49-70",
                "journalAbbreviation": "Small GTPases"
            }
        },
        {
            "14": {
                "citation-number": "15",
                "author": [
                    {
                        "family": "Boissier",
                        "given": "P"
                    },
                    {
                        "family": "Huynh-Do",
                        "given": "U"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1: a Janus-faced molecule in cellular signaling",
                "container-title": "Cell Signal",
                "RefYear": "2014",
                "volume": "26",
                "issue": "3",
                "page-first": "483",
                "page-last": "491",
                "page": "483-491",
                "journalAbbreviation": "Cell Signal"
            }
        },
        {
            "15": {
                "citation-number": "16",
                "author": [
                    {
                        "family": "Stebel",
                        "given": "A"
                    },
                    {
                        "family": "Brachetti",
                        "given": "C"
                    },
                    {
                        "family": "Kunkel",
                        "given": "M"
                    },
                    {
                        "family": "Schmidt",
                        "given": "M"
                    },
                    {
                        "family": "Fritz",
                        "given": "G"
                    }
                ],
                "title": "Progression of breast tumors is accompanied by a decrease in expression of the Rho guanine exchange factor Tiam1",
                "container-title": "Oncol Rep",
                "RefYear": "2009",
                "volume": "21",
                "issue": "1",
                "page-first": "217",
                "page-last": "222",
                "page": "217-222",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "16": {
                "citation-number": "17",
                "author": [
                    {
                        "family": "Minard",
                        "given": "ME"
                    },
                    {
                        "family": "Herynk",
                        "given": "MH"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    },
                    {
                        "family": "Gallick",
                        "given": "GE"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1 increases colon carcinoma growth at metastatic sites in an orthotopic nude mouse model",
                "container-title": "Oncogene",
                "RefYear": "2005",
                "volume": "24",
                "issue": "15",
                "page-first": "2568",
                "page-last": "2573",
                "page": "2568-2573",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "17": {
                "citation-number": "18",
                "author": [
                    {
                        "family": "Li",
                        "given": "J"
                    },
                    {
                        "family": "Liang",
                        "given": "S"
                    },
                    {
                        "family": "Jin",
                        "given": "H"
                    },
                    {
                        "family": "Xu",
                        "given": "C"
                    },
                    {
                        "family": "Ma",
                        "given": "D"
                    },
                    {
                        "family": "Lu",
                        "given": "X"
                    }
                ],
                "title": "Tiam1, negatively regulated by miR-22, miR-183 and miR-31, is involved in migration, invasion and viability of ovarian cancer cells",
                "container-title": "Oncol Rep",
                "RefYear": "2012",
                "volume": "27",
                "issue": "6",
                "page-first": "1835",
                "page-last": "1842",
                "page": "1835-1842",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "18": {
                "citation-number": "19",
                "author": [
                    {
                        "family": "Wang",
                        "given": "HM"
                    },
                    {
                        "family": "Wang",
                        "given": "J"
                    }
                ],
                "title": "Expression of Tiam1 in lung cancer and its clinical significance",
                "container-title": "Asian Pac J Cancer Prev",
                "RefYear": "2012",
                "volume": "13",
                "issue": "2",
                "page-first": "613",
                "page-last": "615",
                "page": "613-615",
                "journalAbbreviation": "Asian Pac J Cancer Prev"
            }
        },
        {
            "19": {
                "citation-number": "20",
                "author": [
                    {
                        "family": "Rygiel",
                        "given": "TP"
                    },
                    {
                        "family": "Mertens",
                        "given": "AE"
                    },
                    {
                        "family": "Strumane",
                        "given": "K"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "R"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 prevents keratinocyte apoptosis by controlling ROS-mediated ERK phosphorylation",
                "container-title": "J Cell Sci",
                "RefYear": "2008",
                "volume": "121",
                "issue": "Pt 8",
                "page-first": "1183",
                "page-last": "1192",
                "page": "1183-1192",
                "journalAbbreviation": "J Cell Sci"
            }
        },
        {
            "20": {
                "citation-number": "21",
                "author": [
                    {
                        "family": "Ellenbroek",
                        "given": "SI"
                    },
                    {
                        "family": "Iden",
                        "given": "S"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 is required for polarized protrusional outgrowth of primary astrocytes by affecting the organization of the microtubule network",
                "container-title": "Small GTPases",
                "RefYear": "2012",
                "volume": "3",
                "issue": "1",
                "page-first": "4",
                "page-last": "14",
                "page": "4-14",
                "journalAbbreviation": "Small GTPases"
            }
        },
        {
            "21": {
                "citation-number": "22",
                "author": [
                    {
                        "family": "Lee",
                        "given": "SH"
                    },
                    {
                        "family": "Kunz",
                        "given": "J"
                    },
                    {
                        "family": "Lin",
                        "given": "SH"
                    },
                    {
                        "family": "Yu-Lee",
                        "given": "LY"
                    }
                ],
                "title": "16-kDa prolactin inhibits endothelial cell migration by down-regulating the Ras-Tiam1-Rac1-Pak1 signaling pathway",
                "container-title": "Cancer Res",
                "RefYear": "2007",
                "volume": "67",
                "issue": "22",
                "page-first": "11045",
                "page-last": "11053",
                "page": "11045-11053",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "22": {
                "citation-number": "23",
                "author": [
                    {
                        "family": "Fantozzi",
                        "given": "A"
                    },
                    {
                        "family": "Gruber",
                        "given": "DC"
                    },
                    {
                        "family": "Pisarsky",
                        "given": "L"
                    }
                ],
                "etal": "et al",
                "title": "VEGF-mediated angiogenesis links EMT-induced cancer stemness to tumor initiation",
                "container-title": "Cancer Res",
                "RefYear": "2014",
                "volume": "74",
                "issue": "5",
                "page-first": "1566",
                "page-last": "1575",
                "page": "1566-1575",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "23": {
                "citation-number": "24",
                "author": [
                    {
                        "family": "Lin",
                        "given": "Z"
                    },
                    {
                        "family": "Bazzaro",
                        "given": "M"
                    },
                    {
                        "family": "Wang",
                        "given": "MC"
                    },
                    {
                        "family": "Chan",
                        "given": "KC"
                    },
                    {
                        "family": "Peng",
                        "given": "S"
                    },
                    {
                        "family": "Roden",
                        "given": "RB"
                    }
                ],
                "title": "Combination of proteasome and HDAC inhibitors for uterine cervical cancer treatment",
                "container-title": "Clin Cancer Res",
                "RefYear": "2009",
                "volume": "15",
                "issue": "2",
                "page-first": "570",
                "page-last": "577",
                "page": "570-577",
                "journalAbbreviation": "Clin Cancer Res"
            }
        },
        {
            "24": {
                "citation-number": "25",
                "author": [
                    {
                        "family": "Brabletz",
                        "given": "T"
                    }
                ],
                "title": "To differentiate or not-routes towards metastasis",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2012",
                "volume": "12",
                "issue": "6",
                "page-first": "425",
                "page-last": "436",
                "page": "425-436",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "25": {
                "citation-number": "26",
                "author": [
                    {
                        "family": "Diepenbruck",
                        "given": "M"
                    },
                    {
                        "family": "Christofori",
                        "given": "G"
                    }
                ],
                "title": "Epithelial-mesenchymal transition (EMT) and metastasis: yes, no, maybe?",
                "container-title": "Curr Opin Cell Biol",
                "RefYear": "2016",
                "volume": "43",
                "page-first": "7",
                "page-last": "13",
                "page": "7-13",
                "journalAbbreviation": "Curr Opin Cell Biol"
            }
        },
        {
            "26": {
                "citation-number": "27",
                "author": [
                    {
                        "family": "Liu",
                        "given": "L"
                    },
                    {
                        "family": "Wu",
                        "given": "B"
                    },
                    {
                        "family": "Cai",
                        "given": "H"
                    }
                ],
                "etal": "et al",
                "title": "Tiam1 promotes thyroid carcinoma metastasis by modulating EMT via Wnt/beta-catenin signaling",
                "container-title": "Exp Cell Res",
                "RefYear": "2018",
                "volume": "362",
                "issue": "2",
                "page-first": "532",
                "page-last": "540",
                "page": "532-540",
                "journalAbbreviation": "Exp Cell Res"
            }
        },
        {
            "27": {
                "citation-number": "28",
                "author": [
                    {
                        "family": "Zhu",
                        "given": "G"
                    },
                    {
                        "family": "Fan",
                        "given": "Z"
                    },
                    {
                        "family": "Ding",
                        "given": "M"
                    }
                ],
                "etal": "et al",
                "title": "An EGFR/PI3K/AKT axis promotes accumulation of the Rac1-GEF Tiam1 that is critical in EGFR-driven tumorigenesis",
                "container-title": "Oncogene",
                "RefYear": "2015",
                "volume": "34",
                "issue": "49",
                "page-first": "5971",
                "page-last": "5982",
                "page": "5971-5982",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "28": {
                "citation-number": "29",
                "author": [
                    {
                        "family": "Liu",
                        "given": "Y"
                    },
                    {
                        "family": "Ding",
                        "given": "Y"
                    },
                    {
                        "family": "Huang",
                        "given": "J"
                    }
                ],
                "etal": "et al",
                "title": "MiR-141 suppresses the migration and invasion of HCC cells by targeting Tiam1",
                "container-title": "PLoS One",
                "RefYear": "2014",
                "volume": "9",
                "issue": "2",
                "page": "e88393",
                "journalAbbreviation": "PLoS One"
            }
        },
        {
            "29": {
                "citation-number": "30",
                "author": [
                    {
                        "family": "Buongiorno",
                        "given": "P"
                    },
                    {
                        "family": "Pethe",
                        "given": "VV"
                    },
                    {
                        "family": "Charames",
                        "given": "GS"
                    },
                    {
                        "family": "Esufali",
                        "given": "S"
                    },
                    {
                        "family": "Bapat",
                        "given": "B"
                    }
                ],
                "title": "Rac1 GTPase and the Rac1 exchange factor Tiam1 associate with Wnt-responsive promoters to enhance beta-catenin/TCF-dependent transcription in colorectal cancer cells",
                "container-title": "Mol Cancer",
                "RefYear": "2008",
                "volume": "7",
                "page-first": "73",
                "page": "73",
                "journalAbbreviation": "Mol Cancer"
            }
        },
        {
            "30": {
                "citation-number": "31",
                "author": [
                    {
                        "family": "Diamantopoulou",
                        "given": "Z"
                    },
                    {
                        "family": "White",
                        "given": "G"
                    },
                    {
                        "family": "Fadlullah",
                        "given": "MZH"
                    }
                ],
                "etal": "et al",
                "title": "TIAM1 Antagonizes TAZ/YAP Both in the Destruction Complex in the Cytoplasm and in the Nucleus to Inhibit Invasion of Intestinal Epithelial Cells",
                "container-title": "Cancer Cell",
                "RefYear": "2017",
                "volume": "31",
                "issue": "5",
                "page-first": "621",
                "page-last": "634 ",
                "page": "621-634 ",
                "journalAbbreviation": "Cancer Cell"
            }
        },
        {
            "31": {
                "citation-number": "32",
                "author": [
                    {
                        "family": "Chen",
                        "given": "G"
                    },
                    {
                        "family": "Lu",
                        "given": "L"
                    },
                    {
                        "family": "Liu",
                        "given": "C"
                    },
                    {
                        "family": "Shan",
                        "given": "L"
                    },
                    {
                        "family": "Yuan",
                        "given": "D"
                    }
                ],
                "title": "MicroRNA-377 suppresses cell proliferation and invasion by inhibiting TIAM1 expression in hepatocellular carcinoma",
                "container-title": "PLoS One",
                "RefYear": "2015",
                "volume": "10",
                "issue": "3",
                "page": "e0117714",
                "journalAbbreviation": "PLoS One"
            }
        },
        {
            "32": {
                "citation-number": "33",
                "author": [
                    {
                        "family": "Huang",
                        "given": "H"
                    },
                    {
                        "family": "Fan",
                        "given": "L"
                    },
                    {
                        "family": "Zhan",
                        "given": "R"
                    },
                    {
                        "family": "Wu",
                        "given": "S"
                    },
                    {
                        "family": "Niu",
                        "given": "W"
                    }
                ],
                "title": "Expression of microRNA-10a, microRNA-342-3p and their predicted target gene TIAM1 in extranodal NK/T-cell lymphoma, nasal type",
                "container-title": "Oncol Lett",
                "RefYear": "2016",
                "volume": "11",
                "issue": "1",
                "page-first": "345",
                "page-last": "351",
                "page": "345-351",
                "journalAbbreviation": "Oncol Lett"
            }
        },
        {
            "33": {
                "citation-number": "34",
                "author": [
                    {
                        "family": "Ellis",
                        "given": "PM"
                    }
                ],
                "title": "Anti-angiogenesis in Personalized Therapy of Lung Cancer",
                "container-title": "Adv Exp Med Biol",
                "RefYear": "2016",
                "volume": "893",
                "page-first": "91",
                "page-last": "126",
                "page": "91-126",
                "journalAbbreviation": "Adv Exp Med Biol"
            }
        },
        {
            "34": {
                "citation-number": "35",
                "author": [
                    {
                        "family": "Maniotis",
                        "given": "AJ"
                    },
                    {
                        "family": "Folberg",
                        "given": "R"
                    },
                    {
                        "family": "Hess",
                        "given": "A"
                    }
                ],
                "etal": "et al",
                "title": "Vascular channel formation by human melanoma cells in vivo and in vitro: vasculogenic mimicry",
                "container-title": "Am J Pathol",
                "RefYear": "1999",
                "volume": "155",
                "issue": "3",
                "page-first": "739",
                "page-last": "752",
                "page": "739-752",
                "journalAbbreviation": "Am J Pathol"
            }
        },
        {
            "35": {
                "citation-number": "36",
                "author": [
                    {
                        "family": "Hendrix",
                        "given": "MJ"
                    },
                    {
                        "family": "Seftor",
                        "given": "EA"
                    },
                    {
                        "family": "Hess",
                        "given": "AR"
                    },
                    {
                        "family": "Seftor",
                        "given": "RE"
                    }
                ],
                "title": "Vasculogenic mimicry and tumour-cell plasticity: lessons from melanoma",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2003",
                "volume": "3",
                "issue": "6",
                "page-first": "411",
                "page-last": "421",
                "page": "411-421",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "36": {
                "citation-number": "37",
                "author": [
                    {
                        "family": "Zhou",
                        "given": "X"
                    },
                    {
                        "family": "Gu",
                        "given": "R"
                    },
                    {
                        "family": "Han",
                        "given": "X"
                    },
                    {
                        "family": "Wu",
                        "given": "G"
                    },
                    {
                        "family": "Liu",
                        "given": "J"
                    }
                ],
                "title": "Cyclin-dependent kinase 5 controls vasculogenic mimicry formation in non-small cell lung cancer via the FAK-AKT signaling pathway",
                "container-title": "Biochem Biophys Res Commun",
                "RefYear": "2017",
                "volume": "492",
                "issue": "3",
                "page-first": "447",
                "page-last": "452",
                "page": "447-452",
                "journalAbbreviation": "Biochem Biophys Res Commun"
            }
        },
        {
            "37": {
                "citation-number": "38",
                "author": [
                    {
                        "family": "Yao",
                        "given": "L"
                    },
                    {
                        "family": "Zhang",
                        "given": "D"
                    },
                    {
                        "family": "Zhao",
                        "given": "X"
                    }
                ],
                "etal": "et al",
                "title": "Dickkopf-1-promoted vasculogenic mimicry in non-small cell lung cancer is associated with EMT and development of a cancer stem-like cell phenotype",
                "container-title": "J Cell Mol Med",
                "RefYear": "2016",
                "volume": "20",
                "issue": "9",
                "page-first": "1673",
                "page-last": "1685",
                "page": "1673-1685",
                "journalAbbreviation": "J Cell Mol Med"
            }
        }
    ],
    "FailedInputs": [
        {
            "0": "Sorry, Input is poorly structured. We were unable to convert the input to JSON."
        }
    ],
    "SuccesfullyValidatedAndResolved": [],
    "InputConvertedToBSJson": [
        {
            "1": {
                "citation-number": "2",
                "author": [
                    {
                        "family": "Auperin",
                        "given": "A"
                    },
                    {
                        "family": "Le Pechoux",
                        "given": "C"
                    },
                    {
                        "family": "Rolland",
                        "given": "E"
                    }
                ],
                "etal": "et al",
                "title": "Meta-analysis of concomitant versus sequential radiochemotherapy in locally advanced non-small-cell lung cancer",
                "container-title": "J Clin Oncol",
                "RefYear": "2010",
                "volume": "28",
                "issue": "13",
                "page-first": "2181",
                "page-last": "2190",
                "PMID": "2190",
                "page": "2181-2190",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "2": {
                "citation-number": "3",
                "author": [
                    {
                        "family": "",
                        "given": ""
                    },
                    {
                        "family": "Paulus",
                        "given": "R"
                    },
                    {
                        "family": "Langer",
                        "given": "CJ"
                    }
                ],
                "etal": "et al",
                "title": "Sequential vs. concurrent chemoradiation for stage III non-small cell lung cancer: randomized phase III trial RTOG 9410",
                "container-title": "J Natl Cancer Inst",
                "RefYear": "2011",
                "volume": "103",
                "issue": "19",
                "page-first": "1452",
                "page-last": "1460",
                "page": "1452-1460",
                "journalAbbreviation": "J Natl Cancer Inst"
            }
        },
        {
            "3": {
                "citation-number": "4",
                "author": [
                    {
                        "family": "Kelly",
                        "given": "K"
                    },
                    {
                        "family": "Chansky",
                        "given": "K"
                    },
                    {
                        "family": "Gaspar",
                        "given": "LE"
                    }
                ],
                "etal": "et al",
                "title": "Phase III trial of maintenance gefitinib or placebo after concurrent chemoradiotherapy and docetaxel consolidation in inoperable stage III non-small-cell lung cancer: SWOG S0023",
                "container-title": "J Clin Oncol",
                "RefYear": "2008",
                "volume": "26",
                "issue": "15",
                "page-first": "2450",
                "page-last": "2456",
                "page": "2450-2456",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "4": {
                "citation-number": "5",
                "author": [
                    {
                        "family": "Ferlay",
                        "given": "J"
                    },
                    {
                        "family": "Soerjomataram",
                        "given": "I"
                    },
                    {
                        "family": "Dikshit",
                        "given": "R"
                    }
                ],
                "etal": "et al",
                "title": "Cancer incidence and mortality worldwide: sources, methods and major patterns in GLOBOCAN 2012",
                "container-title": "Int J Cancer",
                "RefYear": "2015",
                "volume": "136",
                "issue": "5",
                "page-first": "E359",
                "page-last": "386",
                "page": "E359-386",
                "journalAbbreviation": "Int J Cancer"
            }
        },
        {
            "5": {
                "citation-number": "6",
                "author": [
                    {
                        "family": "Wang",
                        "given": "X"
                    },
                    {
                        "family": "Adjei",
                        "given": "AA"
                    }
                ],
                "title": "Lung cancer and metastasis: new opportunities and challenges",
                "container-title": "Cancer Metastasis Rev",
                "RefYear": "2015",
                "volume": "34",
                "issue": "2",
                "page-first": "169",
                "page-last": "171",
                "page": "169-171",
                "journalAbbreviation": "Cancer Metastasis Rev"
            }
        },
        {
            "6": {
                "citation-number": "7",
                "author": [
                    {
                        "family": "Velizheva",
                        "given": "NP"
                    },
                    {
                        "family": "Rechsteiner",
                        "given": "MP"
                    },
                    {
                        "family": "Valtcheva",
                        "given": "N"
                    }
                ],
                "etal": "et al",
                "title": "Targeted next-generation-sequencing for reliable detection of targetable rearrangements in lung adenocarcinoma-a single center retrospective study",
                "container-title": "Pathol Res Pract",
                "RefYear": "2018",
                "volume": "214",
                "issue": "4",
                "page-first": "572",
                "page-last": "578",
                "page": "572-578",
                "journalAbbreviation": "Pathol Res Pract"
            }
        },
        {
            "7": {
                "citation-number": "8",
                "author": [
                    {
                        "family": "Monterisi",
                        "given": "S"
                    },
                    {
                        "family": "Lo Riso",
                        "given": "P"
                    },
                    {
                        "family": "Russo",
                        "given": "K"
                    }
                ],
                "etal": "et al",
                "title": "HOXB7 overexpression in lung cancer is a hallmark of acquired stem-like phenotype",
                "container-title": "Oncogene",
                "RefYear": "2018",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "8": {
                "citation-number": "9",
                "author": [
                    {
                        "family": "Kim",
                        "given": "J"
                    },
                    {
                        "family": "McMillan",
                        "given": "E"
                    },
                    {
                        "family": "Kim",
                        "given": "HS"
                    }
                ],
                "etal": "et al",
                "title": "XPO1-dependent nuclear export is a druggable vulnerability in KRAS-mutant lung cancer",
                "container-title": "Nature",
                "RefYear": "2016",
                "volume": "538",
                "issue": "7623",
                "page-first": "114",
                "page-last": "117",
                "page": "114-117",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "9": {
                "citation-number": "10",
                "author": [
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Scholtes",
                        "given": "EH"
                    },
                    {
                        "family": "Zuydgeest",
                        "given": "D"
                    }
                ],
                "etal": "et al",
                "title": "Identification of an invasion-inducing gene, Tiam-1, that encodes a protein with homology to GDP-GTP exchangers for Rho-like proteins",
                "container-title": "Cell",
                "RefYear": "1994",
                "volume": "77",
                "issue": "4",
                "page-first": "537",
                "page-last": "549",
                "page": "537-549",
                "journalAbbreviation": "Cell"
            }
        },
        {
            "10": {
                "citation-number": "11",
                "author": [
                    {
                        "family": "Michiels",
                        "given": "F"
                    },
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Stam",
                        "given": "JC"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "RA"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "A role for Rac in Tiam1-induced membrane ruffling and invasion",
                "container-title": "Nature",
                "RefYear": "1995",
                "volume": "375",
                "issue": "6529",
                "page-first": "338",
                "page-last": "340",
                "page": "338-340",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "11": {
                "citation-number": "12",
                "author": [
                    {
                        "family": "Heasman",
                        "given": "SJ"
                    },
                    {
                        "family": "Ridley",
                        "given": "AJ"
                    }
                ],
                "title": "Mammalian Rho GTPases: new insights into their functions from in vivo studies",
                "container-title": "Nat Rev Mol Cell Biol",
                "RefYear": "2008",
                "volume": "9",
                "issue": "9",
                "page-first": "690",
                "page-last": "701",
                "page": "690-701",
                "journalAbbreviation": "Nat Rev Mol Cell Biol"
            }
        },
        {
            "12": {
                "citation-number": "13",
                "author": [
                    {
                        "family": "Hall",
                        "given": "A"
                    }
                ],
                "title": "Rho GTPases and the actin cytoskeleton",
                "container-title": "Science",
                "RefYear": "1998",
                "volume": "279",
                "issue": "5350",
                "page-first": "509",
                "page-last": "514",
                "page": "509-514",
                "journalAbbreviation": "Science"
            }
        },
        {
            "13": {
                "citation-number": "14",
                "author": [
                    {
                        "family": "Welch",
                        "given": "HC"
                    }
                ],
                "title": "Regulation and function of P-Rex family Rac-GEFs",
                "container-title": "Small GTPases",
                "RefYear": "2015",
                "volume": "6",
                "issue": "2",
                "page-first": "49",
                "page-last": "70",
                "page": "49-70",
                "journalAbbreviation": "Small GTPases"
            }
        },
        {
            "14": {
                "citation-number": "15",
                "author": [
                    {
                        "family": "Boissier",
                        "given": "P"
                    },
                    {
                        "family": "Huynh-Do",
                        "given": "U"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1: a Janus-faced molecule in cellular signaling",
                "container-title": "Cell Signal",
                "RefYear": "2014",
                "volume": "26",
                "issue": "3",
                "page-first": "483",
                "page-last": "491",
                "page": "483-491",
                "journalAbbreviation": "Cell Signal"
            }
        },
        {
            "15": {
                "citation-number": "16",
                "author": [
                    {
                        "family": "Stebel",
                        "given": "A"
                    },
                    {
                        "family": "Brachetti",
                        "given": "C"
                    },
                    {
                        "family": "Kunkel",
                        "given": "M"
                    },
                    {
                        "family": "Schmidt",
                        "given": "M"
                    },
                    {
                        "family": "Fritz",
                        "given": "G"
                    }
                ],
                "title": "Progression of breast tumors is accompanied by a decrease in expression of the Rho guanine exchange factor Tiam1",
                "container-title": "Oncol Rep",
                "RefYear": "2009",
                "volume": "21",
                "issue": "1",
                "page-first": "217",
                "page-last": "222",
                "page": "217-222",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "16": {
                "citation-number": "17",
                "author": [
                    {
                        "family": "Minard",
                        "given": "ME"
                    },
                    {
                        "family": "Herynk",
                        "given": "MH"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    },
                    {
                        "family": "Gallick",
                        "given": "GE"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1 increases colon carcinoma growth at metastatic sites in an orthotopic nude mouse model",
                "container-title": "Oncogene",
                "RefYear": "2005",
                "volume": "24",
                "issue": "15",
                "page-first": "2568",
                "page-last": "2573",
                "page": "2568-2573",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "17": {
                "citation-number": "18",
                "author": [
                    {
                        "family": "Li",
                        "given": "J"
                    },
                    {
                        "family": "Liang",
                        "given": "S"
                    },
                    {
                        "family": "Jin",
                        "given": "H"
                    },
                    {
                        "family": "Xu",
                        "given": "C"
                    },
                    {
                        "family": "Ma",
                        "given": "D"
                    },
                    {
                        "family": "Lu",
                        "given": "X"
                    }
                ],
                "title": "Tiam1, negatively regulated by miR-22, miR-183 and miR-31, is involved in migration, invasion and viability of ovarian cancer cells",
                "container-title": "Oncol Rep",
                "RefYear": "2012",
                "volume": "27",
                "issue": "6",
                "page-first": "1835",
                "page-last": "1842",
                "page": "1835-1842",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "18": {
                "citation-number": "19",
                "author": [
                    {
                        "family": "Wang",
                        "given": "HM"
                    },
                    {
                        "family": "Wang",
                        "given": "J"
                    }
                ],
                "title": "Expression of Tiam1 in lung cancer and its clinical significance",
                "container-title": "Asian Pac J Cancer Prev",
                "RefYear": "2012",
                "volume": "13",
                "issue": "2",
                "page-first": "613",
                "page-last": "615",
                "page": "613-615",
                "journalAbbreviation": "Asian Pac J Cancer Prev"
            }
        },
        {
            "19": {
                "citation-number": "20",
                "author": [
                    {
                        "family": "Rygiel",
                        "given": "TP"
                    },
                    {
                        "family": "Mertens",
                        "given": "AE"
                    },
                    {
                        "family": "Strumane",
                        "given": "K"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "R"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 prevents keratinocyte apoptosis by controlling ROS-mediated ERK phosphorylation",
                "container-title": "J Cell Sci",
                "RefYear": "2008",
                "volume": "121",
                "issue": "Pt 8",
                "page-first": "1183",
                "page-last": "1192",
                "page": "1183-1192",
                "journalAbbreviation": "J Cell Sci"
            }
        },
        {
            "20": {
                "citation-number": "21",
                "author": [
                    {
                        "family": "Ellenbroek",
                        "given": "SI"
                    },
                    {
                        "family": "Iden",
                        "given": "S"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 is required for polarized protrusional outgrowth of primary astrocytes by affecting the organization of the microtubule network",
                "container-title": "Small GTPases",
                "RefYear": "2012",
                "volume": "3",
                "issue": "1",
                "page-first": "4",
                "page-last": "14",
                "page": "4-14",
                "journalAbbreviation": "Small GTPases"
            }
        },
        {
            "21": {
                "citation-number": "22",
                "author": [
                    {
                        "family": "Lee",
                        "given": "SH"
                    },
                    {
                        "family": "Kunz",
                        "given": "J"
                    },
                    {
                        "family": "Lin",
                        "given": "SH"
                    },
                    {
                        "family": "Yu-Lee",
                        "given": "LY"
                    }
                ],
                "title": "16-kDa prolactin inhibits endothelial cell migration by down-regulating the Ras-Tiam1-Rac1-Pak1 signaling pathway",
                "container-title": "Cancer Res",
                "RefYear": "2007",
                "volume": "67",
                "issue": "22",
                "page-first": "11045",
                "page-last": "11053",
                "page": "11045-11053",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "22": {
                "citation-number": "23",
                "author": [
                    {
                        "family": "Fantozzi",
                        "given": "A"
                    },
                    {
                        "family": "Gruber",
                        "given": "DC"
                    },
                    {
                        "family": "Pisarsky",
                        "given": "L"
                    }
                ],
                "etal": "et al",
                "title": "VEGF-mediated angiogenesis links EMT-induced cancer stemness to tumor initiation",
                "container-title": "Cancer Res",
                "RefYear": "2014",
                "volume": "74",
                "issue": "5",
                "page-first": "1566",
                "page-last": "1575",
                "page": "1566-1575",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "23": {
                "citation-number": "24",
                "author": [
                    {
                        "family": "Lin",
                        "given": "Z"
                    },
                    {
                        "family": "Bazzaro",
                        "given": "M"
                    },
                    {
                        "family": "Wang",
                        "given": "MC"
                    },
                    {
                        "family": "Chan",
                        "given": "KC"
                    },
                    {
                        "family": "Peng",
                        "given": "S"
                    },
                    {
                        "family": "Roden",
                        "given": "RB"
                    }
                ],
                "title": "Combination of proteasome and HDAC inhibitors for uterine cervical cancer treatment",
                "container-title": "Clin Cancer Res",
                "RefYear": "2009",
                "volume": "15",
                "issue": "2",
                "page-first": "570",
                "page-last": "577",
                "page": "570-577",
                "journalAbbreviation": "Clin Cancer Res"
            }
        },
        {
            "24": {
                "citation-number": "25",
                "author": [
                    {
                        "family": "Brabletz",
                        "given": "T"
                    }
                ],
                "title": "To differentiate or not-routes towards metastasis",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2012",
                "volume": "12",
                "issue": "6",
                "page-first": "425",
                "page-last": "436",
                "page": "425-436",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "25": {
                "citation-number": "26",
                "author": [
                    {
                        "family": "Diepenbruck",
                        "given": "M"
                    },
                    {
                        "family": "Christofori",
                        "given": "G"
                    }
                ],
                "title": "Epithelial-mesenchymal transition (EMT) and metastasis: yes, no, maybe?",
                "container-title": "Curr Opin Cell Biol",
                "RefYear": "2016",
                "volume": "43",
                "page-first": "7",
                "page-last": "13",
                "page": "7-13",
                "journalAbbreviation": "Curr Opin Cell Biol"
            }
        },
        {
            "26": {
                "citation-number": "27",
                "author": [
                    {
                        "family": "Liu",
                        "given": "L"
                    },
                    {
                        "family": "Wu",
                        "given": "B"
                    },
                    {
                        "family": "Cai",
                        "given": "H"
                    }
                ],
                "etal": "et al",
                "title": "Tiam1 promotes thyroid carcinoma metastasis by modulating EMT via Wnt/beta-catenin signaling",
                "container-title": "Exp Cell Res",
                "RefYear": "2018",
                "volume": "362",
                "issue": "2",
                "page-first": "532",
                "page-last": "540",
                "page": "532-540",
                "journalAbbreviation": "Exp Cell Res"
            }
        },
        {
            "27": {
                "citation-number": "28",
                "author": [
                    {
                        "family": "Zhu",
                        "given": "G"
                    },
                    {
                        "family": "Fan",
                        "given": "Z"
                    },
                    {
                        "family": "Ding",
                        "given": "M"
                    }
                ],
                "etal": "et al",
                "title": "An EGFR/PI3K/AKT axis promotes accumulation of the Rac1-GEF Tiam1 that is critical in EGFR-driven tumorigenesis",
                "container-title": "Oncogene",
                "RefYear": "2015",
                "volume": "34",
                "issue": "49",
                "page-first": "5971",
                "page-last": "5982",
                "page": "5971-5982",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "28": {
                "citation-number": "29",
                "author": [
                    {
                        "family": "Liu",
                        "given": "Y"
                    },
                    {
                        "family": "Ding",
                        "given": "Y"
                    },
                    {
                        "family": "Huang",
                        "given": "J"
                    }
                ],
                "etal": "et al",
                "title": "MiR-141 suppresses the migration and invasion of HCC cells by targeting Tiam1",
                "container-title": "PLoS One",
                "RefYear": "2014",
                "volume": "9",
                "issue": "2",
                "page": "e88393",
                "journalAbbreviation": "PLoS One"
            }
        },
        {
            "29": {
                "citation-number": "30",
                "author": [
                    {
                        "family": "Buongiorno",
                        "given": "P"
                    },
                    {
                        "family": "Pethe",
                        "given": "VV"
                    },
                    {
                        "family": "Charames",
                        "given": "GS"
                    },
                    {
                        "family": "Esufali",
                        "given": "S"
                    },
                    {
                        "family": "Bapat",
                        "given": "B"
                    }
                ],
                "title": "Rac1 GTPase and the Rac1 exchange factor Tiam1 associate with Wnt-responsive promoters to enhance beta-catenin/TCF-dependent transcription in colorectal cancer cells",
                "container-title": "Mol Cancer",
                "RefYear": "2008",
                "volume": "7",
                "page-first": "73",
                "page": "73",
                "journalAbbreviation": "Mol Cancer"
            }
        },
        {
            "30": {
                "citation-number": "31",
                "author": [
                    {
                        "family": "Diamantopoulou",
                        "given": "Z"
                    },
                    {
                        "family": "White",
                        "given": "G"
                    },
                    {
                        "family": "Fadlullah",
                        "given": "MZH"
                    }
                ],
                "etal": "et al",
                "title": "TIAM1 Antagonizes TAZ/YAP Both in the Destruction Complex in the Cytoplasm and in the Nucleus to Inhibit Invasion of Intestinal Epithelial Cells",
                "container-title": "Cancer Cell",
                "RefYear": "2017",
                "volume": "31",
                "issue": "5",
                "page-first": "621",
                "page-last": "634 ",
                "page": "621-634 ",
                "journalAbbreviation": "Cancer Cell"
            }
        },
        {
            "31": {
                "citation-number": "32",
                "author": [
                    {
                        "family": "Chen",
                        "given": "G"
                    },
                    {
                        "family": "Lu",
                        "given": "L"
                    },
                    {
                        "family": "Liu",
                        "given": "C"
                    },
                    {
                        "family": "Shan",
                        "given": "L"
                    },
                    {
                        "family": "Yuan",
                        "given": "D"
                    }
                ],
                "title": "MicroRNA-377 suppresses cell proliferation and invasion by inhibiting TIAM1 expression in hepatocellular carcinoma",
                "container-title": "PLoS One",
                "RefYear": "2015",
                "volume": "10",
                "issue": "3",
                "page": "e0117714",
                "journalAbbreviation": "PLoS One"
            }
        },
        {
            "32": {
                "citation-number": "33",
                "author": [
                    {
                        "family": "Huang",
                        "given": "H"
                    },
                    {
                        "family": "Fan",
                        "given": "L"
                    },
                    {
                        "family": "Zhan",
                        "given": "R"
                    },
                    {
                        "family": "Wu",
                        "given": "S"
                    },
                    {
                        "family": "Niu",
                        "given": "W"
                    }
                ],
                "title": "Expression of microRNA-10a, microRNA-342-3p and their predicted target gene TIAM1 in extranodal NK/T-cell lymphoma, nasal type",
                "container-title": "Oncol Lett",
                "RefYear": "2016",
                "volume": "11",
                "issue": "1",
                "page-first": "345",
                "page-last": "351",
                "page": "345-351",
                "journalAbbreviation": "Oncol Lett"
            }
        },
        {
            "33": {
                "citation-number": "34",
                "author": [
                    {
                        "family": "Ellis",
                        "given": "PM"
                    }
                ],
                "title": "Anti-angiogenesis in Personalized Therapy of Lung Cancer",
                "container-title": "Adv Exp Med Biol",
                "RefYear": "2016",
                "volume": "893",
                "page-first": "91",
                "page-last": "126",
                "page": "91-126",
                "journalAbbreviation": "Adv Exp Med Biol"
            }
        },
        {
            "34": {
                "citation-number": "35",
                "author": [
                    {
                        "family": "Maniotis",
                        "given": "AJ"
                    },
                    {
                        "family": "Folberg",
                        "given": "R"
                    },
                    {
                        "family": "Hess",
                        "given": "A"
                    }
                ],
                "etal": "et al",
                "title": "Vascular channel formation by human melanoma cells in vivo and in vitro: vasculogenic mimicry",
                "container-title": "Am J Pathol",
                "RefYear": "1999",
                "volume": "155",
                "issue": "3",
                "page-first": "739",
                "page-last": "752",
                "page": "739-752",
                "journalAbbreviation": "Am J Pathol"
            }
        },
        {
            "35": {
                "citation-number": "36",
                "author": [
                    {
                        "family": "Hendrix",
                        "given": "MJ"
                    },
                    {
                        "family": "Seftor",
                        "given": "EA"
                    },
                    {
                        "family": "Hess",
                        "given": "AR"
                    },
                    {
                        "family": "Seftor",
                        "given": "RE"
                    }
                ],
                "title": "Vasculogenic mimicry and tumour-cell plasticity: lessons from melanoma",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2003",
                "volume": "3",
                "issue": "6",
                "page-first": "411",
                "page-last": "421",
                "page": "411-421",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "36": {
                "citation-number": "37",
                "author": [
                    {
                        "family": "Zhou",
                        "given": "X"
                    },
                    {
                        "family": "Gu",
                        "given": "R"
                    },
                    {
                        "family": "Han",
                        "given": "X"
                    },
                    {
                        "family": "Wu",
                        "given": "G"
                    },
                    {
                        "family": "Liu",
                        "given": "J"
                    }
                ],
                "title": "Cyclin-dependent kinase 5 controls vasculogenic mimicry formation in non-small cell lung cancer via the FAK-AKT signaling pathway",
                "container-title": "Biochem Biophys Res Commun",
                "RefYear": "2017",
                "volume": "492",
                "issue": "3",
                "page-first": "447",
                "page-last": "452",
                "page": "447-452",
                "journalAbbreviation": "Biochem Biophys Res Commun"
            }
        },
        {
            "37": {
                "citation-number": "38",
                "author": [
                    {
                        "family": "Yao",
                        "given": "L"
                    },
                    {
                        "family": "Zhang",
                        "given": "D"
                    },
                    {
                        "family": "Zhao",
                        "given": "X"
                    }
                ],
                "etal": "et al",
                "title": "Dickkopf-1-promoted vasculogenic mimicry in non-small cell lung cancer is associated with EMT and development of a cancer stem-like cell phenotype",
                "container-title": "J Cell Mol Med",
                "RefYear": "2016",
                "volume": "20",
                "issue": "9",
                "page-first": "1673",
                "page-last": "1685",
                "page": "1673-1685",
                "journalAbbreviation": "J Cell Mol Med"
            }
        }
    ]
};
exports.expectedOutput5={
    "YetToBeResolved": [
        {
            "1": {
                "citation-number": "2",
                "author": [
                    {
                        "family": "Auperin",
                        "given": "A"
                    },
                    {
                        "family": "Le Pechoux",
                        "given": "C"
                    },
                    {
                        "family": "Rolland",
                        "given": "E"
                    }
                ],
                "etal": "et al",
                "title": "Meta-analysis of concomitant versus sequential radiochemotherapy in locally advanced non-small-cell lung cancer",
                "container-title": "J Clin Oncol",
                "RefYear": "2010",
                "volume": "28",
                "issue": "13",
                "page-first": "2181",
                "page-last": "2190",
                "PMID": "2190",
                "page": "2181-2190",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "2": {
                "citation-number": "3",
                "author": [
                    {
                        "family": "",
                        "given": ""
                    },
                    {
                        "family": "Paulus",
                        "given": "R"
                    },
                    {
                        "family": "Langer",
                        "given": "CJ"
                    }
                ],
                "etal": "et al",
                "title": "Sequential vs. concurrent chemoradiation for stage III non-small cell lung cancer: randomized phase III trial RTOG 9410",
                "container-title": "J Natl Cancer Inst",
                "RefYear": "2011",
                "volume": "103",
                "issue": "19",
                "page-first": "1452",
                "page-last": "1460",
                "page": "1452-1460",
                "journalAbbreviation": "J Natl Cancer Inst"
            }
        },
        {
            "3": {
                "citation-number": "4",
                "author": [
                    {
                        "family": "Kelly",
                        "given": "K"
                    },
                    {
                        "family": "Chansky",
                        "given": "K"
                    },
                    {
                        "family": "Gaspar",
                        "given": "LE"
                    }
                ],
                "etal": "et al",
                "title": "Phase III trial of maintenance gefitinib or placebo after concurrent chemoradiotherapy and docetaxel consolidation in inoperable stage III non-small-cell lung cancer: SWOG S0023",
                "container-title": "J Clin Oncol",
                "RefYear": "2008",
                "volume": "26",
                "issue": "15",
                "page-first": "2450",
                "page-last": "2456",
                "page": "2450-2456",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "4": {
                "citation-number": "5",
                "author": [
                    {
                        "family": "Ferlay",
                        "given": "J"
                    },
                    {
                        "family": "Soerjomataram",
                        "given": "I"
                    },
                    {
                        "family": "Dikshit",
                        "given": "R"
                    }
                ],
                "etal": "et al",
                "title": "Cancer incidence and mortality worldwide: sources, methods and major patterns in GLOBOCAN 2012",
                "container-title": "Int J Cancer",
                "RefYear": "2015",
                "volume": "136",
                "issue": "5",
                "page-first": "E359",
                "page-last": "386",
                "page": "E359-386",
                "journalAbbreviation": "Int J Cancer"
            }
        },
        {
            "5": {
                "citation-number": "6",
                "author": [
                    {
                        "family": "Wang",
                        "given": "X"
                    },
                    {
                        "family": "Adjei",
                        "given": "AA"
                    }
                ],
                "title": "Lung cancer and metastasis: new opportunities and challenges",
                "container-title": "Cancer Metastasis Rev",
                "RefYear": "2015",
                "volume": "34",
                "issue": "2",
                "page-first": "169",
                "page-last": "171",
                "page": "169-171",
                "journalAbbreviation": "Cancer Metastasis Rev"
            }
        },
        {
            "9": {
                "citation-number": "10",
                "author": [
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Scholtes",
                        "given": "EH"
                    },
                    {
                        "family": "Zuydgeest",
                        "given": "D"
                    }
                ],
                "etal": "et al",
                "title": "Identification of an invasion-inducing gene, Tiam-1, that encodes a protein with homology to GDP-GTP exchangers for Rho-like proteins",
                "container-title": "Cell",
                "RefYear": "1994",
                "volume": "77",
                "issue": "4",
                "page-first": "537",
                "page-last": "549",
                "page": "537-549",
                "journalAbbreviation": "Cell"
            }
        },
        {
            "10": {
                "citation-number": "11",
                "author": [
                    {
                        "family": "Michiels",
                        "given": "F"
                    },
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Stam",
                        "given": "JC"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "RA"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "A role for Rac in Tiam1-induced membrane ruffling and invasion",
                "container-title": "Nature",
                "RefYear": "1995",
                "volume": "375",
                "issue": "6529",
                "page-first": "338",
                "page-last": "340",
                "page": "338-340",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "12": {
                "citation-number": "13",
                "author": [
                    {
                        "family": "Hall",
                        "given": "A"
                    }
                ],
                "title": "Rho GTPases and the actin cytoskeleton",
                "container-title": "Science",
                "RefYear": "1998",
                "volume": "279",
                "issue": "5350",
                "page-first": "509",
                "page-last": "514",
                "page": "509-514",
                "journalAbbreviation": "Science"
            }
        },
        {
            "14": {
                "citation-number": "15",
                "author": [
                    {
                        "family": "Boissier",
                        "given": "P"
                    },
                    {
                        "family": "Huynh-Do",
                        "given": "U"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1: a Janus-faced molecule in cellular signaling",
                "container-title": "Cell Signal",
                "RefYear": "2014",
                "volume": "26",
                "issue": "3",
                "page-first": "483",
                "page-last": "491",
                "page": "483-491",
                "journalAbbreviation": "Cell Signal"
            }
        },
        {
            "15": {
                "citation-number": "16",
                "author": [
                    {
                        "family": "Stebel",
                        "given": "A"
                    },
                    {
                        "family": "Brachetti",
                        "given": "C"
                    },
                    {
                        "family": "Kunkel",
                        "given": "M"
                    },
                    {
                        "family": "Schmidt",
                        "given": "M"
                    },
                    {
                        "family": "Fritz",
                        "given": "G"
                    }
                ],
                "title": "Progression of breast tumors is accompanied by a decrease in expression of the Rho guanine exchange factor Tiam1",
                "container-title": "Oncol Rep",
                "RefYear": "2009",
                "volume": "21",
                "issue": "1",
                "page-first": "217",
                "page-last": "222",
                "page": "217-222",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "16": {
                "citation-number": "17",
                "author": [
                    {
                        "family": "Minard",
                        "given": "ME"
                    },
                    {
                        "family": "Herynk",
                        "given": "MH"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    },
                    {
                        "family": "Gallick",
                        "given": "GE"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1 increases colon carcinoma growth at metastatic sites in an orthotopic nude mouse model",
                "container-title": "Oncogene",
                "RefYear": "2005",
                "volume": "24",
                "issue": "15",
                "page-first": "2568",
                "page-last": "2573",
                "page": "2568-2573",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "17": {
                "citation-number": "18",
                "author": [
                    {
                        "family": "Li",
                        "given": "J"
                    },
                    {
                        "family": "Liang",
                        "given": "S"
                    },
                    {
                        "family": "Jin",
                        "given": "H"
                    },
                    {
                        "family": "Xu",
                        "given": "C"
                    },
                    {
                        "family": "Ma",
                        "given": "D"
                    },
                    {
                        "family": "Lu",
                        "given": "X"
                    }
                ],
                "title": "Tiam1, negatively regulated by miR-22, miR-183 and miR-31, is involved in migration, invasion and viability of ovarian cancer cells",
                "container-title": "Oncol Rep",
                "RefYear": "2012",
                "volume": "27",
                "issue": "6",
                "page-first": "1835",
                "page-last": "1842",
                "page": "1835-1842",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "18": {
                "citation-number": "19",
                "author": [
                    {
                        "family": "Wang",
                        "given": "HM"
                    },
                    {
                        "family": "Wang",
                        "given": "J"
                    }
                ],
                "title": "Expression of Tiam1 in lung cancer and its clinical significance",
                "container-title": "Asian Pac J Cancer Prev",
                "RefYear": "2012",
                "volume": "13",
                "issue": "2",
                "page-first": "613",
                "page-last": "615",
                "page": "613-615",
                "journalAbbreviation": "Asian Pac J Cancer Prev"
            }
        },
        {
            "19": {
                "citation-number": "20",
                "author": [
                    {
                        "family": "Rygiel",
                        "given": "TP"
                    },
                    {
                        "family": "Mertens",
                        "given": "AE"
                    },
                    {
                        "family": "Strumane",
                        "given": "K"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "R"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 prevents keratinocyte apoptosis by controlling ROS-mediated ERK phosphorylation",
                "container-title": "J Cell Sci",
                "RefYear": "2008",
                "volume": "121",
                "issue": "Pt 8",
                "page-first": "1183",
                "page-last": "1192",
                "page": "1183-1192",
                "journalAbbreviation": "J Cell Sci"
            }
        },
        {
            "21": {
                "citation-number": "22",
                "author": [
                    {
                        "family": "Lee",
                        "given": "SH"
                    },
                    {
                        "family": "Kunz",
                        "given": "J"
                    },
                    {
                        "family": "Lin",
                        "given": "SH"
                    },
                    {
                        "family": "Yu-Lee",
                        "given": "LY"
                    }
                ],
                "title": "16-kDa prolactin inhibits endothelial cell migration by down-regulating the Ras-Tiam1-Rac1-Pak1 signaling pathway",
                "container-title": "Cancer Res",
                "RefYear": "2007",
                "volume": "67",
                "issue": "22",
                "page-first": "11045",
                "page-last": "11053",
                "page": "11045-11053",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "22": {
                "citation-number": "23",
                "author": [
                    {
                        "family": "Fantozzi",
                        "given": "A"
                    },
                    {
                        "family": "Gruber",
                        "given": "DC"
                    },
                    {
                        "family": "Pisarsky",
                        "given": "L"
                    }
                ],
                "etal": "et al",
                "title": "VEGF-mediated angiogenesis links EMT-induced cancer stemness to tumor initiation",
                "container-title": "Cancer Res",
                "RefYear": "2014",
                "volume": "74",
                "issue": "5",
                "page-first": "1566",
                "page-last": "1575",
                "page": "1566-1575",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "23": {
                "citation-number": "24",
                "author": [
                    {
                        "family": "Lin",
                        "given": "Z"
                    },
                    {
                        "family": "Bazzaro",
                        "given": "M"
                    },
                    {
                        "family": "Wang",
                        "given": "MC"
                    },
                    {
                        "family": "Chan",
                        "given": "KC"
                    },
                    {
                        "family": "Peng",
                        "given": "S"
                    },
                    {
                        "family": "Roden",
                        "given": "RB"
                    }
                ],
                "title": "Combination of proteasome and HDAC inhibitors for uterine cervical cancer treatment",
                "container-title": "Clin Cancer Res",
                "RefYear": "2009",
                "volume": "15",
                "issue": "2",
                "page-first": "570",
                "page-last": "577",
                "page": "570-577",
                "journalAbbreviation": "Clin Cancer Res"
            }
        },
        {
            "24": {
                "citation-number": "25",
                "author": [
                    {
                        "family": "Brabletz",
                        "given": "T"
                    }
                ],
                "title": "To differentiate or not-routes towards metastasis",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2012",
                "volume": "12",
                "issue": "6",
                "page-first": "425",
                "page-last": "436",
                "page": "425-436",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "27": {
                "citation-number": "28",
                "author": [
                    {
                        "family": "Zhu",
                        "given": "G"
                    },
                    {
                        "family": "Fan",
                        "given": "Z"
                    },
                    {
                        "family": "Ding",
                        "given": "M"
                    }
                ],
                "etal": "et al",
                "title": "An EGFR/PI3K/AKT axis promotes accumulation of the Rac1-GEF Tiam1 that is critical in EGFR-driven tumorigenesis",
                "container-title": "Oncogene",
                "RefYear": "2015",
                "volume": "34",
                "issue": "49",
                "page-first": "5971",
                "page-last": "5982",
                "page": "5971-5982",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "30": {
                "citation-number": "31",
                "author": [
                    {
                        "family": "Diamantopoulou",
                        "given": "Z"
                    },
                    {
                        "family": "White",
                        "given": "G"
                    },
                    {
                        "family": "Fadlullah",
                        "given": "MZH"
                    }
                ],
                "etal": "et al",
                "title": "TIAM1 Antagonizes TAZ/YAP Both in the Destruction Complex in the Cytoplasm and in the Nucleus to Inhibit Invasion of Intestinal Epithelial Cells",
                "container-title": "Cancer Cell",
                "RefYear": "2017",
                "volume": "31",
                "issue": "5",
                "page-first": "621",
                "page-last": "634 ",
                "page": "621-634 ",
                "journalAbbreviation": "Cancer Cell"
            }
        },
        {
            "34": {
                "citation-number": "35",
                "author": [
                    {
                        "family": "Maniotis",
                        "given": "AJ"
                    },
                    {
                        "family": "Folberg",
                        "given": "R"
                    },
                    {
                        "family": "Hess",
                        "given": "A"
                    }
                ],
                "etal": "et al",
                "title": "Vascular channel formation by human melanoma cells in vivo and in vitro: vasculogenic mimicry",
                "container-title": "Am J Pathol",
                "RefYear": "1999",
                "volume": "155",
                "issue": "3",
                "page-first": "739",
                "page-last": "752",
                "page": "739-752",
                "journalAbbreviation": "Am J Pathol"
            }
        },
        {
            "35": {
                "citation-number": "36",
                "author": [
                    {
                        "family": "Hendrix",
                        "given": "MJ"
                    },
                    {
                        "family": "Seftor",
                        "given": "EA"
                    },
                    {
                        "family": "Hess",
                        "given": "AR"
                    },
                    {
                        "family": "Seftor",
                        "given": "RE"
                    }
                ],
                "title": "Vasculogenic mimicry and tumour-cell plasticity: lessons from melanoma",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2003",
                "volume": "3",
                "issue": "6",
                "page-first": "411",
                "page-last": "421",
                "page": "411-421",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "37": {
                "citation-number": "38",
                "author": [
                    {
                        "family": "Yao",
                        "given": "L"
                    },
                    {
                        "family": "Zhang",
                        "given": "D"
                    },
                    {
                        "family": "Zhao",
                        "given": "X"
                    }
                ],
                "etal": "et al",
                "title": "Dickkopf-1-promoted vasculogenic mimicry in non-small cell lung cancer is associated with EMT and development of a cancer stem-like cell phenotype",
                "container-title": "J Cell Mol Med",
                "RefYear": "2016",
                "volume": "20",
                "issue": "9",
                "page-first": "1673",
                "page-last": "1685",
                "page": "1673-1685",
                "journalAbbreviation": "J Cell Mol Med"
            }
        }
    ],
    "FailedInputs": [
        {
            "0": "Sorry, Input is poorly structured. We were unable to convert the input to JSON."
        }
    ],
    "SuccesfullyValidatedAndResolved": [
        {
            "6": {
                "title": "Targeted next-generation-sequencing for reliable detection of targetable rearrangements in lung adenocarcinoma-a single center retrospective study.",
                "volume": "214",
                "issue": "4",
                "page": "572-578",
                "container-title": "Pathology, research and practice",
                "container-title-short": "Pathol. Res. Pract.",
                "ISSN": "1618-0631",
                "PMID": "29580750",
                "PMCID": "PMC5899763",
                "DOI": "10.1016/j.prp.2018.02.001",
                "abstract": "Oncogenic rearrangements leading to targetable gene fusions are well-established cancer driver events in lung adenocarcinoma. Accurate and reliable detection of these gene fusions is crucial to select the appropriate targeted therapy for each patient. We compared the targeted next-generation-sequencing Oncomine Focus Assay (OFA; Thermo Fisher Scientific) with conventional ALK FISH and anti-Alk immunohistochemistry in a cohort of 52 lung adenocarcinomas (10 ALK rearranged, 18 non-ALK rearranged, and 24 untested cases). We found a sensitivity and specificity of 100% for detection of ALK rearrangements using the OFA panel. In addition, targeted next generation sequencing allowed us to analyze a set of 23 driver genes in a single assay. Besides EML4-ALK (11/52 cases), we detected EZR-ROS1 (1/52 cases), KIF5B-RET (1/52 cases) and MET-MET (4/52 cases) fusions. All EML4-ALK, EZR-ROS1 and KIF5B-RET fusions were confirmed by multiplexed targeted next generation sequencing assay (Oncomine Solid Tumor Fusion Transcript Kit, Thermo Fisher Scientific). All cases with EML4-ALK rearrangement were confirmed by Alk immunohistochemistry and all but one by ALK FISH. In our experience, targeted next-generation sequencing is a reliable and timesaving tool for multiplexed detection of targetable rearrangements. Therefore, targeted next-generation sequencing represents an efficient alternative to time-consuming single target assays currently used in molecular pathology.",
                "issn": "1618-0631",
                "issued": "{date: [2018, Apr, undefined] }",
                "author": [
                    {
                        "family": "Velizheva",
                        "given": "Nadezda P",
                        "initial": "NP",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Rechsteiner",
                        "given": "Markus P",
                        "initial": "MP",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Valtcheva",
                        "given": "Nadejda",
                        "initial": "N",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Freiberger",
                        "given": "Sandra N",
                        "initial": "SN",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wong",
                        "given": "Christine E",
                        "initial": "CE",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Vrugt",
                        "given": "Bart",
                        "initial": "B",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Zhong",
                        "given": "Qing",
                        "initial": "Q",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wagner",
                        "given": "Ulrich",
                        "initial": "U",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Moch",
                        "given": "Holger",
                        "initial": "H",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Hillinger",
                        "given": "Sven",
                        "initial": "S",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Schmitt-Opitz",
                        "given": "Isabelle",
                        "initial": "I",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Soltermann",
                        "given": "Alex",
                        "initial": "A",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wild",
                        "given": "Peter J",
                        "initial": "PJ",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Tischler",
                        "given": "Verena",
                        "initial": "V",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/29580750",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "7": {
                "title": "HOXB7 overexpression in lung cancer is a hallmark of acquired stem-like phenotype.",
                "volume": "37",
                "issue": "26",
                "page": "3575-3588",
                "container-title": "Oncogene",
                "container-title-short": "Oncogene",
                "ISSN": "1476-5594",
                "PMID": "29576613",
                "DOI": "10.1038/s41388-018-0229-9",
                "abstract": "HOXB7 is a homeodomain (HOX) transcription factor involved in regional body patterning of invertebrates and vertebrates. We previously identified HOXB7 within a ten-gene prognostic signature for lung adenocarcinoma, where increased expression of HOXB7 was associated with poor prognosis. This raises the question of how HOXB7 overexpression can influence the metastatic behavior of lung adenocarcinoma. Here, we analyzed publicly available microarray and RNA-seq lung cancer expression datasets and found that HOXB7-overexpressing tumors are enriched in gene signatures characterizing adult and embryonic stem cells (SC), and induced pluripotent stem cells (iPSC). Experimentally, we found that HOXB7 upregulates several canonical SC/iPSC markers and sustains the expansion of a subpopulation of cells with SC characteristics, through modulation of LIN28B, an emerging cancer gene and pluripotency factor, which we discovered to be a direct target of HOXB7. We validated this new circuit by showing that HOXB7 enhances reprogramming to iPSC with comparable efficiency to LIN28B or its target c-MYC, which is a canonical reprogramming factor.",
                "issn": "1476-5594",
                "issued": "{date: [2018, 06, undefined] }",
                "author": [
                    {
                        "family": "Monterisi",
                        "given": "Simona",
                        "initial": "S",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Lo Riso",
                        "given": "Pietro",
                        "initial": "P",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Russo",
                        "given": "Karin",
                        "initial": "K",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Bertalot",
                        "given": "Giovanni",
                        "initial": "G",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Vecchi",
                        "given": "Manuela",
                        "initial": "M",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Testa",
                        "given": "Giuseppe",
                        "initial": "G",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Di Fiore",
                        "given": "Pier Paolo",
                        "initial": "PP",
                        "Identifier": "http://orcid.org/0000-0002-2252-0950",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Bianchi",
                        "given": "Fabrizio",
                        "initial": "F",
                        "Identifier": "http://orcid.org/0000-0001-7412-8638",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/29576613",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "8": {
                "title": "XPO1-dependent nuclear export is a druggable vulnerability in KRAS-mutant lung cancer.",
                "volume": "538",
                "issue": "7623",
                "page": "114-117",
                "container-title": "Nature",
                "container-title-short": "Nature",
                "ISSN": "1476-4687",
                "PMID": "27680702",
                "PMCID": "PMC5161658",
                "DOI": "10.1038/nature19771",
                "abstract": "The common participation of oncogenic KRAS proteins in many of the most lethal human cancers, together with the ease of detecting somatic KRAS mutant alleles in patient samples, has spurred persistent and intensive efforts to develop drugs that inhibit KRAS activity. However, advances have been hindered by the pervasive inter- and intra-lineage diversity in the targetable mechanisms that underlie KRAS-driven cancers, limited pharmacological accessibility of many candidate synthetic-lethal interactions and the swift emergence of unanticipated resistance mechanisms to otherwise effective targeted therapies. Here we demonstrate the acute and specific cell-autonomous addiction of KRAS-mutant non-small-cell lung cancer cells to receptor-dependent nuclear export. A multi-genomic, data-driven approach, utilizing 106 human non-small-cell lung cancer cell lines, was used to interrogate 4,725 biological processes with 39,760 short interfering RNA pools for those selectively required for the survival of KRAS-mutant cells that harbour a broad spectrum of phenotypic variation. Nuclear transport machinery was the sole process-level discriminator of statistical significance. Chemical perturbation of the nuclear export receptor XPO1 (also known as CRM1), with a clinically available drug, revealed a robust synthetic-lethal interaction with native or engineered oncogenic KRAS both in vitro and in vivo. The primary mechanism underpinning XPO1 inhibitor sensitivity was intolerance to the accumulation of nuclear IκBα (also known as NFKBIA), with consequent inhibition of NFκB transcription factor activity. Intrinsic resistance associated with concurrent FSTL5 mutations was detected and determined to be a consequence of YAP1 activation via a previously unappreciated FSTL5-Hippo pathway regulatory axis. This occurs in approximately 17% of KRAS-mutant lung cancers, and can be overcome with the co-administration of a YAP1-TEAD inhibitor. These findings indicate that clinically available XPO1 inhibitors are a promising therapeutic strategy for a considerable cohort of patients with lung cancer when coupled to genomics-guided patient selection and observation.",
                "issn": "1476-4687",
                "issued": "{date: [2016, Oct, 06] }",
                "author": [
                    {
                        "family": "Kim",
                        "given": "Jimi",
                        "initial": "J",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "McMillan",
                        "given": "Elizabeth",
                        "initial": "E",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Kim",
                        "given": "Hyun Seok",
                        "initial": "HS",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Venkateswaran",
                        "given": "Niranjan",
                        "initial": "N",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Makkar",
                        "given": "Gurbani",
                        "initial": "G",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Rodriguez-Canales",
                        "given": "Jaime",
                        "initial": "J",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Villalobos",
                        "given": "Pamela",
                        "initial": "P",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Neggers",
                        "given": "Jasper Edgar",
                        "initial": "JE",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Mendiratta",
                        "given": "Saurabh",
                        "initial": "S",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wei",
                        "given": "Shuguang",
                        "initial": "S",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Landesman",
                        "given": "Yosef",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Senapedis",
                        "given": "William",
                        "initial": "W",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Baloglu",
                        "given": "Erkan",
                        "initial": "E",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Chow",
                        "given": "Chi-Wan B",
                        "initial": "CB",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Frink",
                        "given": "Robin E",
                        "initial": "RE",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Gao",
                        "given": "Boning",
                        "initial": "B",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Roth",
                        "given": "Michael",
                        "initial": "M",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Minna",
                        "given": "John D",
                        "initial": "JD",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Daelemans",
                        "given": "Dirk",
                        "initial": "D",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wistuba",
                        "given": "Ignacio I",
                        "initial": "II",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Posner",
                        "given": "Bruce A",
                        "initial": "BA",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Scaglioni",
                        "given": "Pier Paolo",
                        "initial": "PP",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "White",
                        "given": "Michael A",
                        "initial": "MA",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/27680702",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "11": {
                "title": "Mammalian Rho GTPases: new insights into their functions from in vivo studies.",
                "volume": "9",
                "issue": "9",
                "page": "690-701",
                "container-title": "Nature reviews. Molecular cell biology",
                "container-title-short": "Nat. Rev. Mol. Cell Biol.",
                "ISSN": "1471-0080",
                "PMID": "18719708",
                "DOI": "10.1038/nrm2476",
                "abstract": "Rho GTPases are key regulators of cytoskeletal dynamics and affect many cellular processes, including cell polarity, migration, vesicle trafficking and cytokinesis. These proteins are conserved from plants and yeast to mammals, and function by interacting with and stimulating various downstream targets, including actin nucleators, protein kinases and phospholipases. The roles of Rho GTPases have been extensively studied in different mammalian cell types using mainly dominant negative and constitutively active mutants. The recent availability of knockout mice for several members of the Rho family reveals new information about their roles in signalling to the cytoskeleton and in development.",
                "issn": "1471-0080",
                "issued": "{date: [2008, Sep, undefined] }",
                "author": [
                    {
                        "family": "Heasman",
                        "given": "Sarah J",
                        "initial": "SJ",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Ridley",
                        "given": "Anne J",
                        "initial": "AJ"
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/18719708",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "13": {
                "title": "Regulation and function of P-Rex family Rac-GEFs.",
                "volume": "6",
                "issue": "2",
                "page": "49-70",
                "container-title": "Small GTPases",
                "container-title-short": "Small GTPases",
                "ISSN": "2154-1256",
                "PMID": "25961466",
                "PMCID": "PMC4601503",
                "DOI": "10.4161/21541248.2014.973770",
                "abstract": "The P-Rex family are Dbl-type guanine-nucleotide exchange factors for Rac family small G proteins. They are distinguished from other Rac-GEFs through their synergistic mode of activation by the lipid second messenger phosphatidyl inositol (3,4,5) trisphosphate and the Gβγ subunits of heterotrimeric G proteins, thus acting as coincidence detectors for phosphoinositide 3-kinase and G protein coupled receptor signaling. Work in genetically-modified mice has shown that P-Rex1 has physiological importance in the inflammatory response and the migration of melanoblasts during development, whereas P-Rex2 controls the dendrite morphology of cerebellar Purkinje neurons as well as glucose homeostasis in liver and adipose tissue. Deregulation of P-Rex1 and P-Rex2 expression occurs in many types of cancer, and P-Rex2 is frequently mutated in melanoma. Both GEFs promote tumor growth or metastasis. This review critically evaluates the P-Rex literature and tools available and highlights exciting recent developments and open questions. ",
                "issn": "2154-1256",
                "issued": "{date: [2015, undefined, undefined] }",
                "author": [
                    {
                        "family": "Welch",
                        "given": "Heidi C E",
                        "initial": "HC",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/25961466",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "20": {
                "title": "The Rac activator Tiam1 is required for polarized protrusional outgrowth of primary astrocytes by affecting the organization of the microtubule network.",
                "volume": "3",
                "issue": "1",
                "page": "4-14",
                "container-title": "Small GTPases",
                "container-title-short": "Small GTPases",
                "ISSN": "2154-1256",
                "PMID": "22710731",
                "PMCID": "PMC3398916",
                "DOI": "10.4161/sgtp.19379",
                "abstract": "Polarized cell migration is a crucial process in the development and repair of tissues, as well as in pathological conditions, including cancer. Recent studies have elucidated important roles for Rho GTPases in the establishment and maintenance of polarity prior to and during cell migration. Here, we show that Tiam1, a specific activator of the small GTPase Rac, is required for the polarized outgrowth of protrusions in primary astrocytes during the initial phase of cell polarization after scratch-wounding monolayers of cells. Tiam1 deficiency delays closure of wounds in confluent monolayers. Lack of Tiam1 impairs adoption of an asymmetrical cell shape as well as microtubule organization within protrusions. Positioning of the centrosome and Golgi apparatus, however, are independent of Tiam1-Rac signaling. We speculate that the function of Tiam1 in polarized outgrowth of astrocyte protrusions involves regulation of microtubule organization, possibly by stabilizing the microtubule cytoskeleton. Our results add Tiam1 as a player to the growing list of proteins involved in polarized outgrowth of protrusions and further elucidate the signaling pathways leading to cell polarization.",
                "issn": "2154-1256",
                "issued": "{date: [2012, undefined, undefined] }",
                "author": [
                    {
                        "family": "Ellenbroek",
                        "given": "Saskia I J",
                        "initial": "SI",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Iden",
                        "given": "Sandra",
                        "initial": "S"
                    },
                    {
                        "family": "Collard",
                        "given": "John G",
                        "initial": "JG"
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/22710731",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "25": {
                "title": "Epithelial-mesenchymal transition (EMT) and metastasis: yes, no, maybe?",
                "volume": "43",
                "page": "7-13",
                "container-title": "Current opinion in cell biology",
                "container-title-short": "Curr. Opin. Cell Biol.",
                "ISSN": "1879-0410",
                "PMID": "27371787",
                "DOI": "10.1016/j.ceb.2016.06.002",
                "abstract": "An epithelial to mesenchymal transition (EMT) is a process of cell remodeling critical during embryonic development and organogenesis. During an EMT, epithelial cells lose their polarized organization and acquire migratory and invasive capabilities. While a plethora of experimental results have indicated that manipulating an EMT also affects cancer metastasis, its reverse process, a mesenchymal to epithelial transition (MET), seems to support metastatic outgrowth in distant organs. Moreover, recent reports investigating cancer cells circulating in the blood stream or employing genetic lineage-tracing have questioned a critical role of an EMT in metastasis formation. Hence, we need to better understand the molecular networks underlying the cell plasticity conferred by an EMT or a MET and its functional contribution to malignant tumor progression.",
                "issn": "1879-0410",
                "issued": "{date: [2016, 12, undefined] }",
                "author": [
                    {
                        "family": "Diepenbruck",
                        "given": "Maren",
                        "initial": "M",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Christofori",
                        "given": "Gerhard",
                        "initial": "G",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/27371787",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "26": {
                "title": "Tiam1 promotes thyroid carcinoma metastasis by modulating EMT via Wnt/β-catenin signaling.",
                "volume": "362",
                "issue": "2",
                "page": "532-540",
                "container-title": "Experimental cell research",
                "container-title-short": "Exp. Cell Res.",
                "ISSN": "1090-2422",
                "PMID": "29277502",
                "DOI": "10.1016/j.yexcr.2017.12.019",
                "abstract": "Aberrant expression of the guanine nucleotide exchange factor Tiam1 is implicated in the invasive phenotype of many cancers. However, its involvement in thyroid carcinoma and downstream molecular events remains largely undefined. Here, we examined the effects of Tiam1 on the invasiveness and metastasis of thyroid carcinoma in vitro and in vivo and explored the underlying mechanisms by investigating the regulation of Tiam1 expression and the downstream pathways affected. Our results showed that Tiam1 knockdown inhibited the migratory and invasive capacity of thyroid cancer cells, suppressed epithelial-mesenchymal transition (EMT), and inhibited Wnt/β-catenin signaling in vitro. Moreover, Tiam1 knockdown suppressed liver metastasis development in vivo. The effects of Tiam1 on metastasis and EMT mediated by the Wnt/β-catenin pathway were reversed by Rac1 silencing, suggesting that the prometastatic effect of Tiam1 is mediated by the activation of Rac1. These results indicate that Tiam1 may be a prognostic factor and potential therapeutic target for the treatment of thyroid cancers.",
                "issn": "1090-2422",
                "issued": "{date: [2018, 01, 15] }",
                "author": [
                    {
                        "family": "Liu",
                        "given": "Lin",
                        "initial": "L",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wu",
                        "given": "Bo",
                        "initial": "B",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Cai",
                        "given": "Haidong",
                        "initial": "H",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Li",
                        "given": "Dan",
                        "initial": "D",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Ma",
                        "given": "Yushui",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Zhu",
                        "given": "Xuchao",
                        "initial": "X",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Lv",
                        "given": "Zhongwei",
                        "initial": "Z",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Fan",
                        "given": "Youben",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Zhang",
                        "given": "Xiaoping",
                        "initial": "X",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/29277502",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "28": {
                "title": "MiR-141 suppresses the migration and invasion of HCC cells by targeting Tiam1.",
                "volume": "9",
                "issue": "2",
                "page": "e88393",
                "container-title": "PloS one",
                "container-title-short": "PLoS ONE",
                "ISSN": "1932-6203",
                "PMID": "24551096",
                "PMCID": "PMC3923786",
                "DOI": "10.1371/journal.pone.0088393",
                "abstract": "We have demonstrated that T lymphoma invasion and metastasis 1 (Tiam1) gene is associated with the poor prognosis of patients with hepatocellular carcinoma (HCC), and we used a computational approach to identify miR-141 as a Tiam1-targeting microRNA (miRNA). Here, we explored the function of miR-141 and the relationship between miR-141 and Tiam1 gene in HCC.",
                "issn": "1932-6203",
                "issued": "{date: [2014, undefined, undefined] }",
                "author": [
                    {
                        "family": "Liu",
                        "given": "Ying",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Ding",
                        "given": "Yi",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Huang",
                        "given": "Jing",
                        "initial": "J",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wang",
                        "given": "Shuang",
                        "initial": "S",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Ni",
                        "given": "Wen",
                        "initial": "W",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Guan",
                        "given": "Jian",
                        "initial": "J",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Li",
                        "given": "Qisheng",
                        "initial": "Q",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Zhang",
                        "given": "Yuqin",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Ding",
                        "given": "Yanqing",
                        "initial": "Y",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Chen",
                        "given": "Bin",
                        "initial": "B",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Chen",
                        "given": "Longhua",
                        "initial": "L",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/24551096",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "29": {
                "title": "Rac1 GTPase and the Rac1 exchange factor Tiam1 associate with Wnt-responsive promoters to enhance beta-catenin/TCF-dependent transcription in colorectal cancer cells.",
                "volume": "7",
                "page": "73",
                "container-title": "Molecular cancer",
                "container-title-short": "Mol. Cancer",
                "ISSN": "1476-4598",
                "PMID": "18826597",
                "PMCID": "PMC2565678",
                "DOI": "10.1186/1476-4598-7-73",
                "abstract": "beta-catenin is a key mediator of the canonical Wnt pathway as it associates with members of the T-cell factor (TCF) family at Wnt-responsive promoters to drive the transcription of Wnt target genes. Recently, we showed that Rac1 GTPase synergizes with beta-catenin to increase the activity of a TCF-responsive reporter. This synergy was dependent on the nuclear presence of Rac1, since inhibition of its nuclear localization effectively abolished the stimulatory effect of Rac1 on TCF-responsive reporter activity. We hypothesised that Rac1 plays a direct role in enhancing the transcription of endogenous Wnt target genes by modulating the beta-catenin/TCF transcription factor complex.",
                "issn": "1476-4598",
                "issued": "{date: [2008, Sep, 30] }",
                "author": [
                    {
                        "family": "Buongiorno",
                        "given": "Pinella",
                        "initial": "P",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Pethe",
                        "given": "Vaijayanti V",
                        "initial": "VV"
                    },
                    {
                        "family": "Charames",
                        "given": "George S",
                        "initial": "GS"
                    },
                    {
                        "family": "Esufali",
                        "given": "Susmita",
                        "initial": "S"
                    },
                    {
                        "family": "Bapat",
                        "given": "Bharati",
                        "initial": "B"
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/18826597",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "31": {
                "title": "MicroRNA-377 suppresses cell proliferation and invasion by inhibiting TIAM1 expression in hepatocellular carcinoma.",
                "volume": "10",
                "issue": "3",
                "page": "e0117714",
                "container-title": "PloS one",
                "container-title-short": "PLoS ONE",
                "ISSN": "1932-6203",
                "PMID": "25739101",
                "PMCID": "PMC4349803",
                "DOI": "10.1371/journal.pone.0117714",
                "abstract": "Increasing evidence has suggested that microRNAs (miRNAs) play an important role in the initiation and progression of hepatocellular carcinoma (HCC). Here, we identified a novel tumor suppressive miRNA, miR-377, and investigated its role in HCC. The expression of miR-377 in HCC tissues and cell lines was detected by real-time reverse-transcription PCR. The effects of miR-377 on HCC cell proliferation and invasion were also investigated. Western blot and luciferase reporter assay were used to identify the direct and functional target of miR-377. The expression of miR-377 was markedly downregulated in human HCC tissues and cell lines. MiR-377 can dramatically inhibit cell growth and invasion in HCC cells. Subsequent investigation revealed that T lymphoma invasion and metastasis 1 (TIAM1) was a direct and functional target of miR-377 in HCC cells. Overexpression of miR-377 impaired TIAM1-induced promotion of proliferation and invasion in HCC cells. Finally, miR-377 is inversely correlated with TIAM1 expression in human HCC tissues. These findings reveal that miR-377 functions as a tumor suppressor and inhibits the proliferation and invasion of HCC cells by targeting TIAM1, which may consequently serve as a therapeutic target for HCC patients. ",
                "issn": "1932-6203",
                "issued": "{date: [2015, undefined, undefined] }",
                "author": [
                    {
                        "family": "Chen",
                        "given": "Guolin",
                        "initial": "G",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Lu",
                        "given": "Lu",
                        "initial": "L",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Liu",
                        "given": "Chang",
                        "initial": "C",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Shan",
                        "given": "Lei",
                        "initial": "L",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Yuan",
                        "given": "Di",
                        "initial": "D",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/25739101",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "32": {
                "title": "Expression of microRNA-10a, microRNA-342-3p and their predicted target gene TIAM1 in extranodal NK/T-cell lymphoma, nasal type.",
                "volume": "11",
                "issue": "1",
                "page": "345-351",
                "container-title": "Oncology letters",
                "container-title-short": "Oncol Lett",
                "ISSN": "1792-1074",
                "PMID": "26870215",
                "PMCID": "PMC4727075",
                "DOI": "10.3892/ol.2015.3831",
                "abstract": "MicroRNAs (miRNAs) may act as oncogenes or tumor suppressor genes in different types of human cancer. T-lymphoma invasion and metastasis inducing factor 1 (TIAM1) participates in the development of several types of human cancer. However, the expression of miRNAs and TIAM1 in extranodal natural killer (NK)/T-cell lymphoma, nasal type (ENKTCL) remains poorly understood. In the present study, the association between the expression levels of miR-10a and miR-342-3p and the protein expression levels of TIAM1 was examined in ENKTCL tissues. The expression levels of miR-10a, miR-22, miR-340, miR-342-3p and miR-590-5p in 15 primary ENKTCL tissues were analyzed using quantitative polymerase chain reaction, and the protein expression levels of TIAM1 in 21 primary ENKTCL tissues were analyzed using immunohistochemistry. The expression levels of miR-10a and miR-342-3p were lower in ENKTCL tissues than in normal NK cells, but no significant differences were observed in the expression levels of miR-22, miR-340 and miR-590-5p in ENKTCL tissues, compared with normal NK cells. The low expression levels of miR-10a detected in the tissues of patients with ENKTCL were inversely correlated with the age of the patients, whereas the low expression levels of miR-342-3p measured in these samples were not correlated with any demographic or clinical features of the patients. The protein expression levels of TIAM1 were higher in ENKTCL tissues than in normal and reactive lymph node hyperplasia tissues, and positively correlated with the Ann Arbor stage and international prognostic index score of the tumors. Furthermore, the expression levels of miRNA-10a and miRNA-342-3p were inversely correlated with the protein expression levels of TIAM1 in ENKTCL tissues. These data suggest that TIAM1 may contribute to the pathogenesis of ENKTCL, and miRNA-10a and miRNA-342-3p may be involved in the development of ENKTCL via the TIAM1 pathway.",
                "issn": "1792-1074",
                "issued": "{date: [2016, Jan, undefined] }",
                "author": [
                    {
                        "family": "Huang",
                        "given": "Haobo",
                        "initial": "H",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Fan",
                        "given": "Liping",
                        "initial": "L",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Zhan",
                        "given": "Rong",
                        "initial": "R",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wu",
                        "given": "Shunquan",
                        "initial": "S",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Niu",
                        "given": "Wenyan",
                        "initial": "W",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/26870215",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "33": {
                "title": "Anti-angiogenesis in Personalized Therapy of Lung Cancer.",
                "volume": "893",
                "page": "91-126",
                "container-title": "Advances in experimental medicine and biology",
                "container-title-short": "Adv. Exp. Med. Biol.",
                "ISSN": "0065-2598",
                "PMID": "26667340",
                "DOI": "10.1007/978-3-319-24223-1_5",
                "abstract": "Upregulation of angiogenesis is a frequent occurrence in lung cancer and is reported to represent a negative prognostic factor. This provides a rationale for the development and evaluation of anti-angiogenic agents. To date bevacizumab, a monoclonal antibody directed against serum VEGF, is the only anti-angiogenic agent that has demonstrated improved overall survival for patients with lung cancer. Meta-analysis of trials of bevacizumab in combination with platinum-based chemotherapy for NSCLC, show a 10% reduction in the risk of death (HR 0.90, 95% CI 0.81-0.99). However, therapy with bevacizumab is limited to NSCLC patients with non-squamous histology, good performance status, no brain metastases and the absence of bleeding or thrombotic disorders. More recently, similar survival was observed in a non bevacizumab containing regimen of carboplatin, pemetrexed and maintenance pemetrexed. Multiple oral anti-angiogenic compounds have been evaluated in NSCLC, both in first-line therapy, or upon disease progression. The majority of agents have shown some evidence of activity, but none have clearly demonstrated improvements in overall survival. Increased toxicities have been observed, including an increased risk of death for some agents, limiting their development. Promising data exist for sunitinib in patients with heavily pre-treated NSCLC, and nintedanib in combination with docetaxel, as second-line therapy for NSCLC. However, these findings require validation. Currently, there is no established role for anti-angiogenic therapy in SCLC, although there is some promise for sunitinib as maintenance therapy following platinum and etoposide chemotherapy. The challenge for anti-angiogenic therapy is to understand whether treatment effects in a subpopulation, are lost among a larger unselected population of patients. There is a need for additional translational research to identify predictive biomarkers for anti-angiogenic therapy.",
                "issn": "0065-2598",
                "issued": "{date: [2016, undefined, undefined] }",
                "author": [
                    {
                        "family": "Ellis",
                        "given": "Peter M",
                        "initial": "PM",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/26667340",
                "id": "Item-1",
                "language": "eng"
            }
        },
        {
            "36": {
                "title": "Cyclin-dependent kinase 5 controls vasculogenic mimicry formation in non-small cell lung cancer via the FAK-AKT signaling pathway.",
                "volume": "492",
                "issue": "3",
                "page": "447-452",
                "container-title": "Biochemical and biophysical research communications",
                "container-title-short": "Biochem. Biophys. Res. Commun.",
                "ISSN": "1090-2104",
                "PMID": "28842255",
                "DOI": "10.1016/j.bbrc.2017.08.076",
                "abstract": "\n            Vasculogenic mimicry (VM), an endothelial-independent tumor vascularization phenomenon representing functional tumor plasticity, might be the culprit behind the poor clinical outcome in classic antiangiogenesis treatment. However, the mechanism underlying VM needs to be elucidated. Cyclin-dependent kinase 5 (CDK5) has been recognized as a key factor in regulating migration and neuronal plasticity. Recently, CDK5 was associated with tumor migration and invasion and its expression levels correlated with poor clinical prognosis, indicating its important role in tumor cell plasticity. In this study, we determined the presence of VM network in the lung cancer cell line A549 by tube formation assay. Selective inhibition of CDK5 expression by roscovitine or siRNA significantly decreased VM formation in A549 cells both in vitro and in vivo and retarded tumor growth. To investigate the possible mechanism, we detected the downstream pathway of CDK5 by Western blotting and immunohistochemistry. We found that CDK5 silencing led to significant decrease in FAK and AKT phosphorylation level. Further studies showed that FAK knockdown impaired VM formation and deregulated cytoskeleton transformation of A549 cells. And these effects caused by FAK silence couldn't be reversed by adding CDK5 recombinant protein. This study indicates that CDK5 kinase activates the FAK/AKT signaling pathway to generate VM in a lung cancer cell line, which can help us develop potential therapeutic strategies against vessel-positive tumors.\n            ",
                "issn": "1090-2104",
                "issued": "{date: [2017, 10, 21] }",
                "author": [
                    {
                        "family": "Zhou",
                        "given": "Xiaoshu",
                        "initial": "X",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Gu",
                        "given": "Runxia",
                        "initial": "R",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Han",
                        "given": "Xiaoming",
                        "initial": "X",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Wu",
                        "given": "Gang",
                        "initial": "G",
                        "AffiliationInfo": "\n              "
                    },
                    {
                        "family": "Liu",
                        "given": "Junli",
                        "initial": "J",
                        "AffiliationInfo": "\n              "
                    }
                ],
                "URL": "https://www.ncbi.nlm.nih.gov/pubmed/28842255",
                "id": "Item-1",
                "language": "eng"
            }
        }
    ],
    "InputConvertedToBSJson": [
        {
            "1": {
                "citation-number": "2",
                "author": [
                    {
                        "family": "Auperin",
                        "given": "A"
                    },
                    {
                        "family": "Le Pechoux",
                        "given": "C"
                    },
                    {
                        "family": "Rolland",
                        "given": "E"
                    }
                ],
                "etal": "et al",
                "title": "Meta-analysis of concomitant versus sequential radiochemotherapy in locally advanced non-small-cell lung cancer",
                "container-title": "J Clin Oncol",
                "RefYear": "2010",
                "volume": "28",
                "issue": "13",
                "page-first": "2181",
                "page-last": "2190",
                "PMID": "2190",
                "page": "2181-2190",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "2": {
                "citation-number": "3",
                "author": [
                    {
                        "family": "",
                        "given": ""
                    },
                    {
                        "family": "Paulus",
                        "given": "R"
                    },
                    {
                        "family": "Langer",
                        "given": "CJ"
                    }
                ],
                "etal": "et al",
                "title": "Sequential vs. concurrent chemoradiation for stage III non-small cell lung cancer: randomized phase III trial RTOG 9410",
                "container-title": "J Natl Cancer Inst",
                "RefYear": "2011",
                "volume": "103",
                "issue": "19",
                "page-first": "1452",
                "page-last": "1460",
                "page": "1452-1460",
                "journalAbbreviation": "J Natl Cancer Inst"
            }
        },
        {
            "3": {
                "citation-number": "4",
                "author": [
                    {
                        "family": "Kelly",
                        "given": "K"
                    },
                    {
                        "family": "Chansky",
                        "given": "K"
                    },
                    {
                        "family": "Gaspar",
                        "given": "LE"
                    }
                ],
                "etal": "et al",
                "title": "Phase III trial of maintenance gefitinib or placebo after concurrent chemoradiotherapy and docetaxel consolidation in inoperable stage III non-small-cell lung cancer: SWOG S0023",
                "container-title": "J Clin Oncol",
                "RefYear": "2008",
                "volume": "26",
                "issue": "15",
                "page-first": "2450",
                "page-last": "2456",
                "page": "2450-2456",
                "journalAbbreviation": "J Clin Oncol"
            }
        },
        {
            "4": {
                "citation-number": "5",
                "author": [
                    {
                        "family": "Ferlay",
                        "given": "J"
                    },
                    {
                        "family": "Soerjomataram",
                        "given": "I"
                    },
                    {
                        "family": "Dikshit",
                        "given": "R"
                    }
                ],
                "etal": "et al",
                "title": "Cancer incidence and mortality worldwide: sources, methods and major patterns in GLOBOCAN 2012",
                "container-title": "Int J Cancer",
                "RefYear": "2015",
                "volume": "136",
                "issue": "5",
                "page-first": "E359",
                "page-last": "386",
                "page": "E359-386",
                "journalAbbreviation": "Int J Cancer"
            }
        },
        {
            "5": {
                "citation-number": "6",
                "author": [
                    {
                        "family": "Wang",
                        "given": "X"
                    },
                    {
                        "family": "Adjei",
                        "given": "AA"
                    }
                ],
                "title": "Lung cancer and metastasis: new opportunities and challenges",
                "container-title": "Cancer Metastasis Rev",
                "RefYear": "2015",
                "volume": "34",
                "issue": "2",
                "page-first": "169",
                "page-last": "171",
                "page": "169-171",
                "journalAbbreviation": "Cancer Metastasis Rev"
            }
        },
        {
            "6": {
                "citation-number": "7",
                "author": [
                    {
                        "family": "Velizheva",
                        "given": "NP"
                    },
                    {
                        "family": "Rechsteiner",
                        "given": "MP"
                    },
                    {
                        "family": "Valtcheva",
                        "given": "N"
                    }
                ],
                "etal": "et al",
                "title": "Targeted next-generation-sequencing for reliable detection of targetable rearrangements in lung adenocarcinoma-a single center retrospective study",
                "container-title": "Pathol Res Pract",
                "RefYear": "2018",
                "volume": "214",
                "issue": "4",
                "page-first": "572",
                "page-last": "578",
                "page": "572-578",
                "journalAbbreviation": "Pathol Res Pract"
            }
        },
        {
            "7": {
                "citation-number": "8",
                "author": [
                    {
                        "family": "Monterisi",
                        "given": "S"
                    },
                    {
                        "family": "Lo Riso",
                        "given": "P"
                    },
                    {
                        "family": "Russo",
                        "given": "K"
                    }
                ],
                "etal": "et al",
                "title": "HOXB7 overexpression in lung cancer is a hallmark of acquired stem-like phenotype",
                "container-title": "Oncogene",
                "RefYear": "2018",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "8": {
                "citation-number": "9",
                "author": [
                    {
                        "family": "Kim",
                        "given": "J"
                    },
                    {
                        "family": "McMillan",
                        "given": "E"
                    },
                    {
                        "family": "Kim",
                        "given": "HS"
                    }
                ],
                "etal": "et al",
                "title": "XPO1-dependent nuclear export is a druggable vulnerability in KRAS-mutant lung cancer",
                "container-title": "Nature",
                "RefYear": "2016",
                "volume": "538",
                "issue": "7623",
                "page-first": "114",
                "page-last": "117",
                "page": "114-117",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "9": {
                "citation-number": "10",
                "author": [
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Scholtes",
                        "given": "EH"
                    },
                    {
                        "family": "Zuydgeest",
                        "given": "D"
                    }
                ],
                "etal": "et al",
                "title": "Identification of an invasion-inducing gene, Tiam-1, that encodes a protein with homology to GDP-GTP exchangers for Rho-like proteins",
                "container-title": "Cell",
                "RefYear": "1994",
                "volume": "77",
                "issue": "4",
                "page-first": "537",
                "page-last": "549",
                "page": "537-549",
                "journalAbbreviation": "Cell"
            }
        },
        {
            "10": {
                "citation-number": "11",
                "author": [
                    {
                        "family": "Michiels",
                        "given": "F"
                    },
                    {
                        "family": "Habets",
                        "given": "GG"
                    },
                    {
                        "family": "Stam",
                        "given": "JC"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "RA"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "A role for Rac in Tiam1-induced membrane ruffling and invasion",
                "container-title": "Nature",
                "RefYear": "1995",
                "volume": "375",
                "issue": "6529",
                "page-first": "338",
                "page-last": "340",
                "page": "338-340",
                "journalAbbreviation": "Nature"
            }
        },
        {
            "11": {
                "citation-number": "12",
                "author": [
                    {
                        "family": "Heasman",
                        "given": "SJ"
                    },
                    {
                        "family": "Ridley",
                        "given": "AJ"
                    }
                ],
                "title": "Mammalian Rho GTPases: new insights into their functions from in vivo studies",
                "container-title": "Nat Rev Mol Cell Biol",
                "RefYear": "2008",
                "volume": "9",
                "issue": "9",
                "page-first": "690",
                "page-last": "701",
                "page": "690-701",
                "journalAbbreviation": "Nat Rev Mol Cell Biol"
            }
        },
        {
            "12": {
                "citation-number": "13",
                "author": [
                    {
                        "family": "Hall",
                        "given": "A"
                    }
                ],
                "title": "Rho GTPases and the actin cytoskeleton",
                "container-title": "Science",
                "RefYear": "1998",
                "volume": "279",
                "issue": "5350",
                "page-first": "509",
                "page-last": "514",
                "page": "509-514",
                "journalAbbreviation": "Science"
            }
        },
        {
            "13": {
                "citation-number": "14",
                "author": [
                    {
                        "family": "Welch",
                        "given": "HC"
                    }
                ],
                "title": "Regulation and function of P-Rex family Rac-GEFs",
                "container-title": "Small GTPases",
                "RefYear": "2015",
                "volume": "6",
                "issue": "2",
                "page-first": "49",
                "page-last": "70",
                "page": "49-70",
                "journalAbbreviation": "Small GTPases"
            }
        },
        {
            "14": {
                "citation-number": "15",
                "author": [
                    {
                        "family": "Boissier",
                        "given": "P"
                    },
                    {
                        "family": "Huynh-Do",
                        "given": "U"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1: a Janus-faced molecule in cellular signaling",
                "container-title": "Cell Signal",
                "RefYear": "2014",
                "volume": "26",
                "issue": "3",
                "page-first": "483",
                "page-last": "491",
                "page": "483-491",
                "journalAbbreviation": "Cell Signal"
            }
        },
        {
            "15": {
                "citation-number": "16",
                "author": [
                    {
                        "family": "Stebel",
                        "given": "A"
                    },
                    {
                        "family": "Brachetti",
                        "given": "C"
                    },
                    {
                        "family": "Kunkel",
                        "given": "M"
                    },
                    {
                        "family": "Schmidt",
                        "given": "M"
                    },
                    {
                        "family": "Fritz",
                        "given": "G"
                    }
                ],
                "title": "Progression of breast tumors is accompanied by a decrease in expression of the Rho guanine exchange factor Tiam1",
                "container-title": "Oncol Rep",
                "RefYear": "2009",
                "volume": "21",
                "issue": "1",
                "page-first": "217",
                "page-last": "222",
                "page": "217-222",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "16": {
                "citation-number": "17",
                "author": [
                    {
                        "family": "Minard",
                        "given": "ME"
                    },
                    {
                        "family": "Herynk",
                        "given": "MH"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    },
                    {
                        "family": "Gallick",
                        "given": "GE"
                    }
                ],
                "title": "The guanine nucleotide exchange factor Tiam1 increases colon carcinoma growth at metastatic sites in an orthotopic nude mouse model",
                "container-title": "Oncogene",
                "RefYear": "2005",
                "volume": "24",
                "issue": "15",
                "page-first": "2568",
                "page-last": "2573",
                "page": "2568-2573",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "17": {
                "citation-number": "18",
                "author": [
                    {
                        "family": "Li",
                        "given": "J"
                    },
                    {
                        "family": "Liang",
                        "given": "S"
                    },
                    {
                        "family": "Jin",
                        "given": "H"
                    },
                    {
                        "family": "Xu",
                        "given": "C"
                    },
                    {
                        "family": "Ma",
                        "given": "D"
                    },
                    {
                        "family": "Lu",
                        "given": "X"
                    }
                ],
                "title": "Tiam1, negatively regulated by miR-22, miR-183 and miR-31, is involved in migration, invasion and viability of ovarian cancer cells",
                "container-title": "Oncol Rep",
                "RefYear": "2012",
                "volume": "27",
                "issue": "6",
                "page-first": "1835",
                "page-last": "1842",
                "page": "1835-1842",
                "journalAbbreviation": "Oncol Rep"
            }
        },
        {
            "18": {
                "citation-number": "19",
                "author": [
                    {
                        "family": "Wang",
                        "given": "HM"
                    },
                    {
                        "family": "Wang",
                        "given": "J"
                    }
                ],
                "title": "Expression of Tiam1 in lung cancer and its clinical significance",
                "container-title": "Asian Pac J Cancer Prev",
                "RefYear": "2012",
                "volume": "13",
                "issue": "2",
                "page-first": "613",
                "page-last": "615",
                "page": "613-615",
                "journalAbbreviation": "Asian Pac J Cancer Prev"
            }
        },
        {
            "19": {
                "citation-number": "20",
                "author": [
                    {
                        "family": "Rygiel",
                        "given": "TP"
                    },
                    {
                        "family": "Mertens",
                        "given": "AE"
                    },
                    {
                        "family": "Strumane",
                        "given": "K"
                    },
                    {
                        "family": "van der Kammen",
                        "given": "R"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 prevents keratinocyte apoptosis by controlling ROS-mediated ERK phosphorylation",
                "container-title": "J Cell Sci",
                "RefYear": "2008",
                "volume": "121",
                "issue": "Pt 8",
                "page-first": "1183",
                "page-last": "1192",
                "page": "1183-1192",
                "journalAbbreviation": "J Cell Sci"
            }
        },
        {
            "20": {
                "citation-number": "21",
                "author": [
                    {
                        "family": "Ellenbroek",
                        "given": "SI"
                    },
                    {
                        "family": "Iden",
                        "given": "S"
                    },
                    {
                        "family": "Collard",
                        "given": "JG"
                    }
                ],
                "title": "The Rac activator Tiam1 is required for polarized protrusional outgrowth of primary astrocytes by affecting the organization of the microtubule network",
                "container-title": "Small GTPases",
                "RefYear": "2012",
                "volume": "3",
                "issue": "1",
                "page-first": "4",
                "page-last": "14",
                "page": "4-14",
                "journalAbbreviation": "Small GTPases"
            }
        },
        {
            "21": {
                "citation-number": "22",
                "author": [
                    {
                        "family": "Lee",
                        "given": "SH"
                    },
                    {
                        "family": "Kunz",
                        "given": "J"
                    },
                    {
                        "family": "Lin",
                        "given": "SH"
                    },
                    {
                        "family": "Yu-Lee",
                        "given": "LY"
                    }
                ],
                "title": "16-kDa prolactin inhibits endothelial cell migration by down-regulating the Ras-Tiam1-Rac1-Pak1 signaling pathway",
                "container-title": "Cancer Res",
                "RefYear": "2007",
                "volume": "67",
                "issue": "22",
                "page-first": "11045",
                "page-last": "11053",
                "page": "11045-11053",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "22": {
                "citation-number": "23",
                "author": [
                    {
                        "family": "Fantozzi",
                        "given": "A"
                    },
                    {
                        "family": "Gruber",
                        "given": "DC"
                    },
                    {
                        "family": "Pisarsky",
                        "given": "L"
                    }
                ],
                "etal": "et al",
                "title": "VEGF-mediated angiogenesis links EMT-induced cancer stemness to tumor initiation",
                "container-title": "Cancer Res",
                "RefYear": "2014",
                "volume": "74",
                "issue": "5",
                "page-first": "1566",
                "page-last": "1575",
                "page": "1566-1575",
                "journalAbbreviation": "Cancer Res"
            }
        },
        {
            "23": {
                "citation-number": "24",
                "author": [
                    {
                        "family": "Lin",
                        "given": "Z"
                    },
                    {
                        "family": "Bazzaro",
                        "given": "M"
                    },
                    {
                        "family": "Wang",
                        "given": "MC"
                    },
                    {
                        "family": "Chan",
                        "given": "KC"
                    },
                    {
                        "family": "Peng",
                        "given": "S"
                    },
                    {
                        "family": "Roden",
                        "given": "RB"
                    }
                ],
                "title": "Combination of proteasome and HDAC inhibitors for uterine cervical cancer treatment",
                "container-title": "Clin Cancer Res",
                "RefYear": "2009",
                "volume": "15",
                "issue": "2",
                "page-first": "570",
                "page-last": "577",
                "page": "570-577",
                "journalAbbreviation": "Clin Cancer Res"
            }
        },
        {
            "24": {
                "citation-number": "25",
                "author": [
                    {
                        "family": "Brabletz",
                        "given": "T"
                    }
                ],
                "title": "To differentiate or not-routes towards metastasis",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2012",
                "volume": "12",
                "issue": "6",
                "page-first": "425",
                "page-last": "436",
                "page": "425-436",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "25": {
                "citation-number": "26",
                "author": [
                    {
                        "family": "Diepenbruck",
                        "given": "M"
                    },
                    {
                        "family": "Christofori",
                        "given": "G"
                    }
                ],
                "title": "Epithelial-mesenchymal transition (EMT) and metastasis: yes, no, maybe?",
                "container-title": "Curr Opin Cell Biol",
                "RefYear": "2016",
                "volume": "43",
                "page-first": "7",
                "page-last": "13",
                "page": "7-13",
                "journalAbbreviation": "Curr Opin Cell Biol"
            }
        },
        {
            "26": {
                "citation-number": "27",
                "author": [
                    {
                        "family": "Liu",
                        "given": "L"
                    },
                    {
                        "family": "Wu",
                        "given": "B"
                    },
                    {
                        "family": "Cai",
                        "given": "H"
                    }
                ],
                "etal": "et al",
                "title": "Tiam1 promotes thyroid carcinoma metastasis by modulating EMT via Wnt/beta-catenin signaling",
                "container-title": "Exp Cell Res",
                "RefYear": "2018",
                "volume": "362",
                "issue": "2",
                "page-first": "532",
                "page-last": "540",
                "page": "532-540",
                "journalAbbreviation": "Exp Cell Res"
            }
        },
        {
            "27": {
                "citation-number": "28",
                "author": [
                    {
                        "family": "Zhu",
                        "given": "G"
                    },
                    {
                        "family": "Fan",
                        "given": "Z"
                    },
                    {
                        "family": "Ding",
                        "given": "M"
                    }
                ],
                "etal": "et al",
                "title": "An EGFR/PI3K/AKT axis promotes accumulation of the Rac1-GEF Tiam1 that is critical in EGFR-driven tumorigenesis",
                "container-title": "Oncogene",
                "RefYear": "2015",
                "volume": "34",
                "issue": "49",
                "page-first": "5971",
                "page-last": "5982",
                "page": "5971-5982",
                "journalAbbreviation": "Oncogene"
            }
        },
        {
            "28": {
                "citation-number": "29",
                "author": [
                    {
                        "family": "Liu",
                        "given": "Y"
                    },
                    {
                        "family": "Ding",
                        "given": "Y"
                    },
                    {
                        "family": "Huang",
                        "given": "J"
                    }
                ],
                "etal": "et al",
                "title": "MiR-141 suppresses the migration and invasion of HCC cells by targeting Tiam1",
                "container-title": "PLoS One",
                "RefYear": "2014",
                "volume": "9",
                "issue": "2",
                "page": "e88393",
                "journalAbbreviation": "PLoS One"
            }
        },
        {
            "29": {
                "citation-number": "30",
                "author": [
                    {
                        "family": "Buongiorno",
                        "given": "P"
                    },
                    {
                        "family": "Pethe",
                        "given": "VV"
                    },
                    {
                        "family": "Charames",
                        "given": "GS"
                    },
                    {
                        "family": "Esufali",
                        "given": "S"
                    },
                    {
                        "family": "Bapat",
                        "given": "B"
                    }
                ],
                "title": "Rac1 GTPase and the Rac1 exchange factor Tiam1 associate with Wnt-responsive promoters to enhance beta-catenin/TCF-dependent transcription in colorectal cancer cells",
                "container-title": "Mol Cancer",
                "RefYear": "2008",
                "volume": "7",
                "page-first": "73",
                "page": "73",
                "journalAbbreviation": "Mol Cancer"
            }
        },
        {
            "30": {
                "citation-number": "31",
                "author": [
                    {
                        "family": "Diamantopoulou",
                        "given": "Z"
                    },
                    {
                        "family": "White",
                        "given": "G"
                    },
                    {
                        "family": "Fadlullah",
                        "given": "MZH"
                    }
                ],
                "etal": "et al",
                "title": "TIAM1 Antagonizes TAZ/YAP Both in the Destruction Complex in the Cytoplasm and in the Nucleus to Inhibit Invasion of Intestinal Epithelial Cells",
                "container-title": "Cancer Cell",
                "RefYear": "2017",
                "volume": "31",
                "issue": "5",
                "page-first": "621",
                "page-last": "634 ",
                "page": "621-634 ",
                "journalAbbreviation": "Cancer Cell"
            }
        },
        {
            "31": {
                "citation-number": "32",
                "author": [
                    {
                        "family": "Chen",
                        "given": "G"
                    },
                    {
                        "family": "Lu",
                        "given": "L"
                    },
                    {
                        "family": "Liu",
                        "given": "C"
                    },
                    {
                        "family": "Shan",
                        "given": "L"
                    },
                    {
                        "family": "Yuan",
                        "given": "D"
                    }
                ],
                "title": "MicroRNA-377 suppresses cell proliferation and invasion by inhibiting TIAM1 expression in hepatocellular carcinoma",
                "container-title": "PLoS One",
                "RefYear": "2015",
                "volume": "10",
                "issue": "3",
                "page": "e0117714",
                "journalAbbreviation": "PLoS One"
            }
        },
        {
            "32": {
                "citation-number": "33",
                "author": [
                    {
                        "family": "Huang",
                        "given": "H"
                    },
                    {
                        "family": "Fan",
                        "given": "L"
                    },
                    {
                        "family": "Zhan",
                        "given": "R"
                    },
                    {
                        "family": "Wu",
                        "given": "S"
                    },
                    {
                        "family": "Niu",
                        "given": "W"
                    }
                ],
                "title": "Expression of microRNA-10a, microRNA-342-3p and their predicted target gene TIAM1 in extranodal NK/T-cell lymphoma, nasal type",
                "container-title": "Oncol Lett",
                "RefYear": "2016",
                "volume": "11",
                "issue": "1",
                "page-first": "345",
                "page-last": "351",
                "page": "345-351",
                "journalAbbreviation": "Oncol Lett"
            }
        },
        {
            "33": {
                "citation-number": "34",
                "author": [
                    {
                        "family": "Ellis",
                        "given": "PM"
                    }
                ],
                "title": "Anti-angiogenesis in Personalized Therapy of Lung Cancer",
                "container-title": "Adv Exp Med Biol",
                "RefYear": "2016",
                "volume": "893",
                "page-first": "91",
                "page-last": "126",
                "page": "91-126",
                "journalAbbreviation": "Adv Exp Med Biol"
            }
        },
        {
            "34": {
                "citation-number": "35",
                "author": [
                    {
                        "family": "Maniotis",
                        "given": "AJ"
                    },
                    {
                        "family": "Folberg",
                        "given": "R"
                    },
                    {
                        "family": "Hess",
                        "given": "A"
                    }
                ],
                "etal": "et al",
                "title": "Vascular channel formation by human melanoma cells in vivo and in vitro: vasculogenic mimicry",
                "container-title": "Am J Pathol",
                "RefYear": "1999",
                "volume": "155",
                "issue": "3",
                "page-first": "739",
                "page-last": "752",
                "page": "739-752",
                "journalAbbreviation": "Am J Pathol"
            }
        },
        {
            "35": {
                "citation-number": "36",
                "author": [
                    {
                        "family": "Hendrix",
                        "given": "MJ"
                    },
                    {
                        "family": "Seftor",
                        "given": "EA"
                    },
                    {
                        "family": "Hess",
                        "given": "AR"
                    },
                    {
                        "family": "Seftor",
                        "given": "RE"
                    }
                ],
                "title": "Vasculogenic mimicry and tumour-cell plasticity: lessons from melanoma",
                "container-title": "Nat Rev Cancer",
                "RefYear": "2003",
                "volume": "3",
                "issue": "6",
                "page-first": "411",
                "page-last": "421",
                "page": "411-421",
                "journalAbbreviation": "Nat Rev Cancer"
            }
        },
        {
            "36": {
                "citation-number": "37",
                "author": [
                    {
                        "family": "Zhou",
                        "given": "X"
                    },
                    {
                        "family": "Gu",
                        "given": "R"
                    },
                    {
                        "family": "Han",
                        "given": "X"
                    },
                    {
                        "family": "Wu",
                        "given": "G"
                    },
                    {
                        "family": "Liu",
                        "given": "J"
                    }
                ],
                "title": "Cyclin-dependent kinase 5 controls vasculogenic mimicry formation in non-small cell lung cancer via the FAK-AKT signaling pathway",
                "container-title": "Biochem Biophys Res Commun",
                "RefYear": "2017",
                "volume": "492",
                "issue": "3",
                "page-first": "447",
                "page-last": "452",
                "page": "447-452",
                "journalAbbreviation": "Biochem Biophys Res Commun"
            }
        },
        {
            "37": {
                "citation-number": "38",
                "author": [
                    {
                        "family": "Yao",
                        "given": "L"
                    },
                    {
                        "family": "Zhang",
                        "given": "D"
                    },
                    {
                        "family": "Zhao",
                        "given": "X"
                    }
                ],
                "etal": "et al",
                "title": "Dickkopf-1-promoted vasculogenic mimicry in non-small cell lung cancer is associated with EMT and development of a cancer stem-like cell phenotype",
                "container-title": "J Cell Mol Med",
                "RefYear": "2016",
                "volume": "20",
                "issue": "9",
                "page-first": "1673",
                "page-last": "1685",
                "page": "1673-1685",
                "journalAbbreviation": "J Cell Mol Med"
            }
        }
    ],
    "status": "succesfully validated."
};