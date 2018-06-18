/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

/// <reference path="../../../RageAssetManager/ILog.ts"/>
/// <reference path="../../../RageAssetManager/Dictionary.ts"/>
///
/// <reference path="../RankOrder.ts"/>
/// <reference path="../Rank.ts"/>
/// <reference path="../PCategory.ts"/>
/// <reference path="../KStructure.ts"/>
/// <reference path="../KState.ts"/>
/// <reference path="../KSRank.ts"/>
///
/// <reference path="../../TwoA.ts"/>
///

namespace TwoANS
{
    import Severity = AssetPackage.Severity;
    import Dictionary = AssetManagerPackage.Dictionary;

    import RankOrder = TwoANS.RankOrder;
    import Rank = TwoANS.Rank;
    import PCategory = TwoANS.PCategory;
    import KStructure = TwoANS.KStructure;
    import KState = TwoANS.KState;
    import KSRank = TwoANS.KSRank;

    import TwoA = TwoANS.TwoA;

    /// <summary>
    /// XMLFactory with singleton.
    /// </summary>
    export class XMLFactory
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        /// <summary>
        /// A singleton instance.
        /// </summary>
        private static instance: XMLFactory = null;

        /// <summary>
        /// Instance of the TwoA asset
        /// </summary>
        private twoA: TwoA;

        /// <summary>
        /// XML related objects
        /// </summary>
        private parser: DOMParser = new DOMParser();
        private serializer: XMLSerializer = new XMLSerializer();

        /// <summary>
        /// Default namespace
        /// </summary>
        public static twoaNS: string = "https://github.com/rageappliedgame/HatAsset";
        /// <summary>
        /// Standard XSD namespace to be used with 'id' and 'idref' attributes
        /// </summary>
        public static xsdNS: string = "http://www.w3.org/2001/XMLSchema";

        /// <summary>
        /// XName for XmlElement("TwoA")
        /// </summary>
        public static TWOA_ELEM: string = "TwoA";

        /// <summary>
        /// XName for XmlElement("PCategories")
        /// </summary>
        public static PCATS_ELEM: string = "PCategories";
        /// <summary>
        /// XName for XmlElement("PCategory")
        /// </summary>
        public static PCAT_ELEM: string = "PCategory";
        /// <summary>
        /// XName for XmlElement("Rating")
        /// </summary>
        public static RATING_ELEM: string = "Rating";

        /// <summary>
        /// XName for XmlElement("RankOrder")
        /// </summary>
        public static RANKORDER_ELEM: string = "RankOrder";
        /// <summary>
        /// XName for XmlElement("Params")
        /// </summary>
        public static PARAMS_ELEM: string = "Params";
        /// <summary>
        /// XName for XmlElement(""Threshold"")
        /// </summary>
        public static THRESHOLD_ELEM: string = "Threshold";
        /// <summary>
        /// XName for XmlElement("Ranks")
        /// </summary>
        public static RANKS_ELEM: string = "Ranks";
        /// <summary>
        /// XName for XmlElement("Rank")
        /// </summary>
        public static RANK_ELEM: string = "Rank";

        /// <summary>
        /// XName for XmlElement("KStructure")
        /// </summary>
        public static KSTRUCTURE_ELEM: string = "KStructure";
        /// <summary>
        /// XName for XmlElement("KSRank")
        /// </summary>
        public static KSRANK_ELEM: string = "KSRank";
        /// <summary>
        /// XName for XmlElement("KState")
        /// </summary>
        public static KSTATE_ELEM: string = "KState";
        /// <summary>
        /// XName for XmlElement("PreviousStates")
        /// </summary>
        public static PREV_STATES_ELEM: string = "PreviousStates";
        /// <summary>
        /// XName for XmlElement("NextStates")
        /// </summary>
        public static NEXT_STATES_ELEM: string = "NextStates";

        /// <summary>
        /// XName for XmlAttribute("Index")
        /// </summary>
        public static INDEX_ATTR: string = "Index";
        /// <summary>
        /// XName for XmlAttribute("Type")
        /// </summary>
        public static TYPE_ATTR: string = "Type";
        /// <summary>
        /// XName for XmlAttribute("xsd:id")
        /// </summary>
        public static ID_ATTR: string = "xsd:id";
        /// <summary>
        /// XName for XmlAttribute("xsd:idref")
        /// </summary>
        public static IDREF_ATTR: string = "xsd:idref";

        /// <summary>
        /// XName for XmlAttribute("xmlns")
        /// </summary>
        public static XMLNS_ATTR: string = "xmlns";
        /// <summary>
        /// XName for XmlAttribute("xmlns:xsd")
        /// </summary>
        public static XSD_ATTR: string = "xmlns:xsd";

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Properties

        /// <summary>
        /// Returns a singleton instance.
        /// </summary>
        public static get Instance(): XMLFactory {
            if (XMLFactory.instance === null || typeof XMLFactory.instance === 'undefined') {
                XMLFactory.instance = new XMLFactory;
            }
            return XMLFactory.instance;
        }

        /// <summary>
        /// Instance of the TwoA asset
        /// </summary>
        public get asset(): TwoA {
            return this.twoA;
        }
        public set asset(p_twoA) {
            if (p_twoA !== null && typeof p_twoA !== 'undefined') {
                this.twoA = p_twoA;
            }
        }

        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Constructor

        constructor() {
            if (XMLFactory.instance) {
                throw new Error("Error: Instantiation failed. Use XMLFactory.Instance getter instead of new.");
            }
            XMLFactory.instance = this;
        }

        ////// END: Constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods

        /// <summary>
        /// creates an XML document object from a given KStructure object
        /// </summary>
        /// 
        /// <param name="p_kStructure">KStructure object with a rank order and knowledge structure</param>
        /// 
        /// <returns>XmlDocument object</returns>
        public createXml(p_kStructure: KStructure): Document {

            // [SC] verifying that KStructure object is not null
            if (p_kStructure === null || typeof p_kStructure === "undefined") {
                this.Log(Severity.Error, "Unable to transform knowledge structure into XML format. kStructure parameter is null. Returning null.");
                return null;
            }

            // [SC] create xml document object
            let doc: Document = this.parser.parseFromString(""
                + "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>"
                + "<TwoA xmlns=\"https://github.com/rageappliedgame/HatAsset\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" />"
                , "text/xml"
            );

            let twoAElem: Element = doc.getElementsByTagName(XMLFactory.TWOA_ELEM)[0];

            // [SC] create a list of categories and a rank order
            if (p_kStructure.hasRankOrder()) {
                let rankOrder: RankOrder = p_kStructure.rankOrder;
                rankOrder.sortAscending();

                // [SC] add 'TwoA/PCategories' list element
                let pcatsElem = doc.createElement(XMLFactory.PCATS_ELEM);
                twoAElem.appendChild(pcatsElem);

                // [SC] add 'TwoA/RankOrder' element
                let rankOrderElem = doc.createElement(XMLFactory.RANKORDER_ELEM);
                twoAElem.appendChild(rankOrderElem);

                // [SC] add 'TwoA/RankOrder/Params' list element
                let rankParamsElem = doc.createElement(XMLFactory.PARAMS_ELEM);
                rankOrderElem.appendChild(rankParamsElem);

                // [SC] add 'TwoA/RankOrder/Params/Threshold' element
                let thresholdElem = doc.createElement(XMLFactory.THRESHOLD_ELEM);
                rankParamsElem.appendChild(thresholdElem);
                thresholdElem.textContent = "" + rankOrder.Threshold;

                // [SC] create 'TwoA/RankOrder/Ranks' list element
                let ranksElem = doc.createElement(XMLFactory.RANKS_ELEM);
                rankOrderElem.appendChild(ranksElem);

                // [SC] iterate through ranks and create correspoinding XML elements
                for (let rankCounter = 0; rankCounter < rankOrder.getRankCount(); rankCounter++) {
                    let rank: Rank = rankOrder.getRankAt(rankCounter);

                    // [SC] add 'TwoA/RankOrder/Ranks/Rank' element
                    let rankElem = doc.createElement(XMLFactory.RANK_ELEM);
                    ranksElem.appendChild(rankElem);
                    // [SC] add 'TwoA/RankOrder/Ranks/Rank@Index' attribute to the 'Rank' element
                    let indexAttr = doc.createAttribute(XMLFactory.INDEX_ATTR);
                    indexAttr.nodeValue = "" + rank.RankIndex;
                    rankElem.setAttributeNode(indexAttr);

                    // [SC] interate through categories in the rank and create corresponding XML element and reference to it
                    for (let catCounter = 0; catCounter < rank.getCategoryCount(); catCounter++) {
                        let pcat: PCategory = rank.getCategoryAt(catCounter);

                        // [SC] add 'TwoA/PCategories/PCategory' element with 'xsd:id' attribute
                        let pcatElem = doc.createElement(XMLFactory.PCAT_ELEM);
                        pcatsElem.appendChild(pcatElem);
                        // [SC] add 'TwoA/PCategories/PCategory@xsd:id' attribute
                        let idAttr = doc.createAttribute(XMLFactory.ID_ATTR);
                        idAttr.nodeValue = "" + pcat.Id;
                        pcatElem.setAttributeNode(idAttr);
                        // [SC] add 'TwoA/PCategories/PCategory/Rating' element
                        let ratingElem = doc.createElement(XMLFactory.RATING_ELEM);
                        pcatElem.appendChild(ratingElem);
                        ratingElem.textContent = "" + pcat.Rating;

                        // [SC] add 'TwoA/RankOrder/Ranks/Rank/PCategory' element with 'xsd:idref' attribute
                        let pcatRefElem = doc.createElement(XMLFactory.PCAT_ELEM);
                        rankElem.appendChild(pcatRefElem);
                        // [SC] add 'TwoA/RankOrder/Ranks/Rank/PCategory@xsd:idref' attribute
                        let idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                        idrefAttr.nodeValue = "" + pcat.Id;
                        pcatRefElem.setAttributeNode(idrefAttr);
                    }
                }
            }
            else {
                this.Log(Severity.Warning, "Rank order is missing while transforming KStructure object into XML format.");
            }

            // [SC] creates elements for 'KStructure'
            if (p_kStructure.hasRanks()) {
                p_kStructure.sortAscending();

                // [SC] add 'TwoA/KStructure' element
                let kStructureElem = doc.createElement(XMLFactory.KSTRUCTURE_ELEM);
                twoAElem.appendChild(kStructureElem);

                // [SC] iterate through KSRanks and create corresponding XML elements
                for (let rankCounter = 0; rankCounter < p_kStructure.getRankCount(); rankCounter++) {
                    let rank: KSRank = p_kStructure.getRankAt(rankCounter);

                    // [SC] add 'TwoA/KStructure/KSRank' element
                    let ksRankElem = doc.createElement(XMLFactory.KSRANK_ELEM);
                    kStructureElem.appendChild(ksRankElem);
                    // [SC] add 'TwoA/KStructure/KSRank@Index' attribute
                    let indexAttr = doc.createAttribute(XMLFactory.INDEX_ATTR);
                    indexAttr.nodeValue = "" + rank.RankIndex;
                    ksRankElem.setAttributeNode(indexAttr);

                    // [SC] iterate through states and add corresponding XML elements
                    for (let stateCounter = 0; stateCounter < rank.getStateCount(); stateCounter++) {
                        let state: KState = rank.getStateAt(stateCounter);

                        // [SC] add 'TwoA/KStructure/KSRank/KState' element with 'xsd:id' attribute
                        let stateElem = doc.createElement(XMLFactory.KSTATE_ELEM);
                        ksRankElem.appendChild(stateElem);
                        // [SC] add 'TwoA/KStructure/KSRank/KState@xsd:id' attribute
                        let idAttr = doc.createAttribute(XMLFactory.ID_ATTR);
                        idAttr.nodeValue = "" + state.Id;
                        stateElem.setAttributeNode(idAttr);
                        // [SC] add 'TwoA/KStructure/KSRank/KState@Type' attribute
                        let typeAttr = doc.createAttribute(XMLFactory.TYPE_ATTR);
                        typeAttr.nodeValue = "" + state.StateType;
                        stateElem.setAttributeNode(typeAttr);

                        // [SC] add 'TwoA/KStructure/KSRank/KState/PCategories' list element
                        let pcatsElem = doc.createElement(XMLFactory.PCATS_ELEM);
                        stateElem.appendChild(pcatsElem);

                        // [SC] iterate through categories in the state
                        for (let catCounter = 0; catCounter < state.getCategoryCount(); catCounter++) {
                            let pcat: PCategory = state.getCategoryAt(catCounter);

                            // [SC] add 'TwoA/KStructure/KSRank/KState/PCategories/PCategory' element with 'xsd:idref' attribute
                            let pcatElem = doc.createElement(XMLFactory.PCAT_ELEM);
                            pcatsElem.appendChild(pcatElem);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/PCategories/PCategory@xsd:idref' attribute
                            let idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                            idrefAttr.nodeValue = "" + pcat.Id;
                            pcatElem.setAttributeNode(idrefAttr);
                        }

                        // [SC] add 'TwoA/KStructure/KSRank/KState/PreviousStates' list element
                        let prevStatesElem = doc.createElement(XMLFactory.PREV_STATES_ELEM);
                        stateElem.appendChild(prevStatesElem);

                        // [SC] iterate through immediate prerequisite states in the gradient
                        for (let prevStateCounter = 0; prevStateCounter < state.getPrevStateCount(); prevStateCounter++) {
                            let prevState: KState = state.getPrevStateAt(prevStateCounter);

                            // [SC] add 'TwoA/KStructure/KSRank/KState/PreviousStates/KState' element with 'xsd:idref' attribute
                            let prevStateElem = doc.createElement(XMLFactory.KSTATE_ELEM);
                            prevStatesElem.appendChild(prevStateElem);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/PreviousStates/KState@xsd:idref' attribute
                            let idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                            idrefAttr.nodeValue = "" + prevState.Id;
                            prevStateElem.setAttributeNode(idrefAttr);
                        }

                        // [SC] add 'TwoA/KStructure/KSRank/KState/NextStates' list element
                        let nextStatesElem = doc.createElement(XMLFactory.NEXT_STATES_ELEM);
                        stateElem.appendChild(nextStatesElem);

                        // [SC] iterate through immediate next states in the gradient
                        for (let nextStateCounter = 0; nextStateCounter < state.getNextStateCount(); nextStateCounter++) {
                            let nextState: KState = state.getNextStateAt(nextStateCounter);

                            // [SC] add 'TwoA/KStructure/KSRank/KState/NextStates/KState' element with 'xsd:idref' attribute
                            let nextStateElem = doc.createElement(XMLFactory.KSTATE_ELEM);
                            nextStatesElem.appendChild(nextStateElem);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/NextStates/KState@xsd:idref' attribute
                            let idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                            idrefAttr.nodeValue = "" + nextState.Id;
                            nextStateElem.setAttributeNode(idrefAttr);
                        }
                    }
                }
            }
            else {
                this.Log(Severity.Warning, "Knowledge structure is missing while transforming KStructure object into XML format.");
            }

            return doc;
        }

        /// <summary>
        /// Deserializes XML into KStructure object
        /// </summary>
        /// 
        /// <param name="xmlString">XML string</param>
        /// 
        /// <returns>KStructure object</returns>
        public createKStructure(p_xmlString: string): KStructure;

        /// <summary>
        /// Deserializes XML into KStructure object
        /// </summary>
        /// 
        /// <param name="doc">XDocument instance</param>
        /// 
        /// <returns>KStructure object</returns>
        public createKStructure(doc: Document): KStructure;

        /// <summary>
        /// iimplementations of createKStructure overloads
        /// </summary>
        public createKStructure(x): KStructure {
            let doc: Document = null;

            if (typeof x === "string") {
                x = this.parser.parseFromString(x, "text/xml");
            } else if (x instanceof Document) {
                doc = x;
            } else {
                return null;
            }

            if (doc === null || typeof doc === "undefined") {
                return null;
            }

            let nodeNames: string[];

            // [SC] a hash table of all categories
            let categories: Dictionary = new Dictionary();

            // [SC] a hash table of all states
            let states: Dictionary = new Dictionary();

            // [SC] iterate through 'TwoA/PCategories/PCategory' elements
            nodeNames = new Array(XMLFactory.PCATS_ELEM, XMLFactory.PCAT_ELEM);
            for (let categoryElem of this.SelectNodes(doc.documentElement, nodeNames)) {
                // [SC] get the value of 'TwoA/PCategories/PCategory@xsd:id' attribute
                let id: string = categoryElem.getAttribute(XMLFactory.ID_ATTR);

                // [SC] get the value of 'TwoA/PCategories/PCategory/Rating' element
                let rating: number = parseFloat(this.SelectSingleNode(categoryElem, new Array(XMLFactory.RATING_ELEM)).textContent);
                if (isNaN(rating)) {
                    this.Log(Severity.Error, "createKStructure: unable to parse rating for category " + id + ". Returning null.");
                    return null; // [TODO] no need due to schema check?
                }

                let category: PCategory = new PCategory(id, rating);

                categories.add(id, category);
            }

            let rankOrder: RankOrder = new RankOrder(null);

            // [SC] parse the value of 'TwoA/RankOrder/Params/Threshold' element
            nodeNames = new Array(XMLFactory.RANKORDER_ELEM, XMLFactory.PARAMS_ELEM, XMLFactory.THRESHOLD_ELEM);
            let threshold: number = parseFloat(this.SelectSingleNode(doc.documentElement, nodeNames).textContent);
            if (isNaN(threshold)) {
                this.Log(Severity.Error, "createKStructure: unable to parse the threshold value. Returning null value. Returning null.");
                return null; // [TODO] no need due to schema check?
            }
            else {
                rankOrder.Threshold = threshold;
            }

            // [SC] iterate through 'TwoA/RankOrder/Ranks/Rank' elements
            nodeNames = new Array(XMLFactory.RANKORDER_ELEM, XMLFactory.RANKS_ELEM, XMLFactory.RANK_ELEM);
            for (let rankElem of this.SelectNodes(doc.documentElement, nodeNames)) {
                let rank: Rank = new Rank(null, null);

                // [SC] parse the value of 'TwoA/RankOrder/Ranks/Rank@Index' attribute
                let rankIndex: number = parseInt(rankElem.getAttribute(XMLFactory.INDEX_ATTR));
                if (isNaN(rankIndex)) {
                    this.Log(Severity.Error, "createKStructure: unable to parse the index of a rank in the rank order. Returning null.");
                    return null; // [TODO] no need due to schema check?
                }
                else {
                    rank.RankIndex = rankIndex;
                }

                // [SC] iterate through 'TwoA/RankOrder/Ranks/Rank/PCategory' elements
                for (let categoryElem of this.SelectNodes(rankElem, new Array<string>(XMLFactory.PCAT_ELEM))) {
                    // [SC] parse 'TwoA/RankOrder/Ranks/Rank/PCategory@xsd:idref' attribute
                    let id: string = categoryElem.getAttribute(XMLFactory.IDREF_ATTR);
                    if (!id) {
                        this.Log(Severity.Error, "createKStructure: unable to parse ID for a category in rank "
                            + rankIndex + " of the rank order. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }

                    // [SC] retrieve PCategory object by its id and add it to the rank object
                    let category: PCategory = categories[id];
                    if (typeof category === "undefined" || category === null) {
                        this.Log(Severity.Error, "createKStructure: category " + id + " from rank "
                            + rankIndex + " of rank order is not found in the list of categories. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    rank.addCategory(category);
                }

                rankOrder.addRank(rank);
            }

            let kStructure: KStructure = new KStructure(rankOrder);

            // [SC] iterate through 'TwoA/KStructure/KSRank' elements
            nodeNames = new Array(XMLFactory.KSTRUCTURE_ELEM, XMLFactory.KSRANK_ELEM);
            for (let ksrankElem of this.SelectNodes(doc.documentElement, nodeNames)) {
                let ksrank: KSRank = new KSRank(null, null);

                // [SC] parse the value of 'TwoA/KStructure/KSRank@Index' attribute
                let rankIndex: number = parseInt(ksrankElem.getAttribute(XMLFactory.INDEX_ATTR));
                if (isNaN(rankIndex)) {
                    this.Log(Severity.Error, "createKStructure: unable to parse index of a rank in the knowledge structure. Returning null.");
                    return null; // [TODO] no need due to schema check?
                }
                else {
                    ksrank.RankIndex = rankIndex;
                }

                if (rankIndex === 0) {
                    let rootStateElem: Element = this.SelectSingleNode(ksrankElem, new Array<string>(XMLFactory.KSTATE_ELEM));

                    // [SC] parse 'TwoA/KStructure/KSRank/KState@xsd:id' attribute
                    let id: string = rootStateElem.getAttribute(XMLFactory.ID_ATTR);
                    if (!id) {
                        this.Log(Severity.Error, "createKStructure: unable to parse ID of the root state in the knowledge structure. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    ksrank.getStateAt(0).Id = id;

                    states.add(ksrank.getStateAt(0).Id, ksrank.getStateAt(0));

                    kStructure.addRank(ksrank);

                    continue;
                }

                // [SC] iterate through 'TwoA/KStructure/KSRank/KState' elements
                for (let stateElem of this.SelectNodes(ksrankElem, new Array<string>(XMLFactory.KSTATE_ELEM))) {
                    let kstate: KState = new KState(null, null, null);

                    // [SC] parse 'TwoA/KStructure/KSRank/KState@xsd:id' attribute
                    let id: string = stateElem.getAttribute(XMLFactory.ID_ATTR);
                    if (!id) {
                        this.Log(Severity.Error, "createKStructure: unable to parse ID of a state in the rank "
                            + rankIndex + " of the knowledge structure. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    kstate.Id = id;

                    // [SC] parse 'TwoA/KStructure/KSRank/KState@Type' attribute
                    let stateType: string = stateElem.getAttribute(XMLFactory.TYPE_ATTR);
                    if (!stateType) {
                        this.Log(Severity.Error, "createKStructure: unable to parse state type in the rank "
                            + rankIndex + " of the knowledge structure. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    kstate.StateType = stateType;

                    // [SC] iterate through 'TwoA/KStructure/KSRank/KState/PCategories/PCategory' elements
                    nodeNames = new Array(XMLFactory.PCATS_ELEM, XMLFactory.PCAT_ELEM);
                    for (let categoryElem of this.SelectNodes(stateElem, nodeNames)) {
                        // [SC] parse 'TwoA/KStructure/KSRank/KState/PCategories/PCategory@xsd:idref' attribute
                        let statePcatId = categoryElem.getAttribute(XMLFactory.IDREF_ATTR);
                        if (!statePcatId) {
                            this.Log(Severity.Error, "createKStructure: unable to parse ID of a category in the state "
                                + kstate.Id + ". Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }

                        // [SC] retrieve PCategory object by its id and add it to the rank object
                        let category: PCategory = categories[statePcatId];
                        if (category === null || typeof category === "undefined") {
                            this.Log(Severity.Error, "createKStructure: category " + statePcatId + " from the state "
                                + kstate.Id + " is not found in the list of categories. Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }
                        kstate.addCategory(category);
                    }

                    // [SC] iterate through 'TwoA/KStructure/KSRank/KState/PreviousStates/KState' elements
                    nodeNames = new Array(XMLFactory.PREV_STATES_ELEM, XMLFactory.KSTATE_ELEM);
                    for (let prevStateElem of this.SelectNodes(stateElem, nodeNames)) {
                        // [SC] parse 'TwoA/KStructure/KSRank/KState/PreviousStates/KState@xsd:idref' attribute
                        let prevStateId = prevStateElem.getAttribute(XMLFactory.IDREF_ATTR);
                        if (!prevStateId) {
                            this.Log(Severity.Error, "createKStructure: unable to parse ID of a previous state for a state "
                                + kstate.Id + ". Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }

                        // [SC] retrieve prev state object by its id and add it to the current state object
                        let prevState: KState = states[prevStateId];
                        if (prevState === null || typeof prevState === "undefined") {
                            this.Log(Severity.Error, "createKStructure: unable to find previously created state object with id '"
                                + prevStateId + "'. Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }
                        kstate.addPrevState(prevState);
                        prevState.addNextState(kstate);
                    }

                    states.add(kstate.Id, kstate);
                    ksrank.addState(kstate);
                }

                kStructure.addRank(ksrank);
            }

            return kStructure;
        }

        /// <summary>
        /// A helper function that emulates xPath-like method for selecting a list of xml child nodes by name
        /// </summary>
        /// 
        /// <param name="p_startNode">    Parent node</param>
        /// <param name="p_nodeNames">    Contains a path to destination child nodes which is the last item in the array</param>
        /// 
        /// <returns>A list of target child nodes, or empty list if child node is not found.</returns>
        public SelectNodes(p_startNode: Element, p_nodeNames: string[]): Array<Element> {
            let result: Array<Element> = new Array<Element>();;
            if (p_nodeNames === null || typeof p_nodeNames === "undefined") { return result; }
            if (p_nodeNames.length === 0) { return result; }

            for (let index = 0; index < p_nodeNames.length; index++) {
                if (p_startNode === null || typeof p_startNode === "undefined") { return result; }

                if (index === p_nodeNames.length - 1) {
                    let directChildren: NodeList = p_startNode.childNodes;
                    for (let nodeIndex = 0; nodeIndex < directChildren.length; nodeIndex++) {
                        let childNode: Node = directChildren[nodeIndex];
                        if (childNode.nodeName === p_nodeNames[index]) {
                            result.push(childNode as Element);
                        }
                    }
                }
                else {
                    let directChildren: NodeList = p_startNode.childNodes;
                    for (let nodeIndex = 0; nodeIndex < directChildren.length; nodeIndex++) {
                        let childNode: Node = directChildren[nodeIndex];
                        if (childNode.nodeName === p_nodeNames[index]) {
                            p_startNode = childNode as Element;
                        }
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// A helper function that emulates xPath-like method for selecting a single xml node by its name
        /// </summary>
        /// 
        /// <param name="p_startNode">    Parent node</param>
        /// <param name="p_nodeNames">    Contains a path to destination child nodes which is the last item in the array</param>
        /// 
        /// <returns>Child node, or null if the node is not found</returns>
        public SelectSingleNode(p_startNode: Element, p_nodeNames: string[]): Element {
            let nodes: Array<Element> = this.SelectNodes(p_startNode, p_nodeNames);
            if (nodes === null || typeof nodes === "undefined" || nodes.length == 0) {
                return null;
            }
            else {
                return nodes[0];
            }
        }

        /// <summary>
        /// A helper function that serializes XDocument object into a formatted string.
        /// </summary>
        /// 
        /// <param name="p_doc">XDocument to be serialized</param>
        /// 
        /// <returns>string</returns>
        public serialize(p_doc: Document): string {
            return this.serializer.serializeToString(p_doc);
        }

        /// <summary>
        /// Sends a log message to the asset
        /// </summary>
        /// 
        /// <param name="p_severity"> Message severity type</param>
        /// <param name="p_logStr">   Log message</param>
        public Log(p_severity: Severity, p_logStr: string): void {
            if (this.asset !== null && typeof this.asset !== "undefined") {
                this.asset.Log(p_severity, p_logStr);
            }
        }

        ////// END: Methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}