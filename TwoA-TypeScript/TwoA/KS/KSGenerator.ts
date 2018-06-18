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

/// <reference path="../../RageAssetManager/ILog.ts"/>
///
/// <reference path="RankOrder.ts"/>
/// <reference path="Rank.ts"/>
/// <reference path="PCategory.ts"/>
/// <reference path="KStructure.ts"/>
/// <reference path="KState.ts"/>
/// <reference path="KSRank.ts"/>
///
/// <reference path="../TwoA.ts"/>
/// 

namespace TwoANS
{
    import Severity = AssetPackage.Severity;

    /*import RankOrder = TwoANS.RankOrder;
    import Rank = TwoANS.Rank;
    import PCategory = TwoANS.PCategory;
    import KStructure = TwoANS.KStructure;
    import KState = TwoANS.KState;
    import KSRank = TwoANS.KSRank;*/

    import TwoA = TwoANS.TwoA;

    /// <summary>
    /// The main class for generating a knowledge structure from diifficulty ratings.
    /// </summary>
    export class KSGenerator
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constants

        /// <summary>
        /// The value is used to indicate that a rating was not assigned a valid value.
        /// </summary>
        public static UNASSIGNED_RATING: number = -9999.99;

        /// <summary>
        /// The value is used to indicate that a rank was not assigned a valid index.
        /// </summary>
        public static UNASSIGNED_RANK: number = -1;

        /// <summary>
        /// The value is used to indicate that a threshold was not assigned a valid value.
        /// </summary>
        public static UNASSIGNED_THRESHOLD: number = -1;

        /// <summary>
        /// A default value for a threshold.
        /// </summary>
        public static DEFAULT_THRESHOLD: number = 0.1;
        /// <summary>
        /// Min valid value of a threshold (inclusive).
        /// </summary>
        public static MIN_THRESHOLD: number = 0;
        /// <summary>
        /// Max valid value of a threshold (exclusive).
        /// </summary>
        public static MAX_THRESHOLD: number = 1;

        /// <summary>
        /// Default sameness probability.
        /// </summary>
        public static DEFAULT_SAME_PROBABILITY: number = 0.5;
        /// <summary>
        /// Min valid sameness probability.
        /// </summary>
        public static MIN_SAME_PROBABILITY: number = 0;
        /// <summary>
        /// Max valid sameness probability.
        /// </summary>
        public static MAX_SAME_PROBABILITY: number = 1;

        /// <summary>
        /// State type: 'root'
        /// </summary>
        public static ROOT_STATE: string = "root";
        /// <summary>
        /// State type: 'core'
        /// </summary>
        public static CORE_STATE: string = "core";
        /// <summary>
        /// State type: 'expanded'
        /// </summary>
        public static EXPANDED_STATE: string = "expanded";

        ////// END: constants
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Fields

        private asset: TwoA; // [SC] refers to the main asset object

        private threshold: number; // [SC] current threshold value used to construct KS
        private sameProbability: number; // [SC] it is strongly advised to use the value DEFAULT_SAME_PROBABILITY

        ////// END: Fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Properties

        /// <summary>
        /// getter/setter for threshold variable
        /// </summary>
        get Threshold(): number {
            return this.threshold;
        }
        set Threshold(p_threshold: number) {
            if (KSGenerator.validThreshold(p_threshold)) {
                this.threshold = p_threshold;
            }
            else {
                throw new RangeError("Threshold value should have range [" + KSGenerator.MIN_THRESHOLD + ", " + KSGenerator.MAX_THRESHOLD + ").");
            }
        }

        /// <summary>
        /// Getter/Setter for sameProbability variable.
        /// It is strongly advised not to change it from the default value. The setter is provide for future uses where a different estimation algorithm might be used.
        /// </summary>
        get SameProbability(): number {
            return this.sameProbability;
        }
        set SameProbability(p_sameProbability: number) {
            if (p_sameProbability >= KSGenerator.MIN_SAME_PROBABILITY && p_sameProbability <= KSGenerator.MAX_SAME_PROBABILITY) {
                this.sameProbability = p_sameProbability;
            }
            else {
                throw new RangeError("Same probability should have range ["
                    + KSGenerator.MIN_SAME_PROBABILITY + ","
                    + KSGenerator.MAX_SAME_PROBABILITY + "].");
            }
        }

        /// <summary>
        /// Getter/setter for the instance of the TwoA asset
        /// </summary>
        get Asset(): TwoA {
            return this.asset;
        }
        set Asset(p_asset: TwoA) {
            this.asset = p_asset;
        }

        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Constructors

        /// <summary>
        /// Initializes a new instance of the TwoA.KSGenerator class with a custom threshold.
        /// </summary>
        /// 
        /// <param name="p_asset">        The asset. </param>
        /// <param name="p_threshold">    A custom threshold value. </param>
        constructor(p_asset: TwoA, p_threshold: number) {
            if (typeof p_threshold === 'undefined' || p_threshold === null) {
                p_threshold = KSGenerator.DEFAULT_THRESHOLD;
            }

            this.asset = p_asset;
            this.Threshold = p_threshold;
            this.SameProbability = KSGenerator.DEFAULT_SAME_PROBABILITY;
        }

        ////// END: Constructors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for creating a knowledge structure

        /// <summary>
        /// Expands the specified knowledge structure with new states by applying Rule 2.
        /// </summary>
        /// 
        /// <param name="p_ks">Knowledge structure to be expanded with new states.</param>
        /// 
        /// <returns>Expanded knowledge structure</returns>
        public createExpandedKStructure(p_ks: KStructure): void {
            // Implements Rule 2:  Given a set GR of problems with a rank R and a set GR-1 of problems with rank R-1, 
            // a union of any subset of GR with any knowledge state KR-1 containing at least one problem from GR-1 is a state.

            // [SC] make sure the knowledge structure object is not null
            if (typeof p_ks === 'undefined' && p_ks === null) {
                this.Log(AssetPackage.Severity.Error, "createExpandedKStructure: KStructure object is null. Returning from method.");
                return;
            }

            // [SC] make sure the rank order of categories is available
            if (!p_ks.hasRankOrder()) {
                this.Log(Severity.Error, "createExpandedKStructure: KStructure object contains no rank order. Returning from method.");
                return;
            }

            // [SC] make sure the knowledge structure has ranks
            if (!p_ks.hasRanks()) {
                this.Log(Severity.Error, "createExpandedKStructure: KStructure object contains no ranks with states. Returning from method.");
                return;
            }

            let prevRank: Rank = null;
            for(let rank of p_ks.rankOrder.getRanks()) {
                if (prevRank !== null) {
                    // [SC] getting all unique subsets of categories in this rank
                    let subsets: PCategory[][] = rank.getSubsets();

                    // [SC] retrieve all KS ranks with minimum required state size
                    let ksRanks: KSRank[] = new Array<KSRank>();
                    for (let ksRank of p_ks.getRanks()) {
                        if (ksRank.RankIndex >= prevRank.RankIndex) {
                            ksRanks.push(ksRank);
                        }
                    }

                    if (ksRanks.length === 0) {
                        continue;
                    }

                    // [SC] this list contains all relevant states that contain any category from GR-1
                    let states: KState[] = new Array<KState>();
                    for (let ksRank of ksRanks) {

                        // [SC] From given KS rank, retrieve all states that contain at least one problem from GR-1 and add them to the common list
                        for (let kState of ksRank.getStates()) {
                            for (let category of kState.getCategories()) {
                                if (prevRank.getCategory(category.Id) !== null) {
                                    states.push(kState);
                                    break;
                                }
                            }
                        }
                    }

                    if (states.length == 0) {
                        continue;
                    }

                    // [SC] iterate through subsets of GR
                    for(let subset of subsets) { // [SC] subset: PCategory[]
                        for (let state of states) { // [SC] state: KState

                            // [SC] if state already contains the entire subset then skip it
                            let skipStateFlag: boolean = true;
                            for (let categoryOne of state.getCategories()) {
                                let containsFlag: boolean = false;
                                for (let categoryTwo of subset) {
                                    if (categoryOne.Id === categoryTwo.Id) {
                                        containsFlag = true;
                                        break;
                                    }
                                }

                                if (!containsFlag) {
                                    skipStateFlag = false;
                                    break;
                                }
                            }
                            if (skipStateFlag) {
                                continue;
                            }

                            // [SC] creating a new state
                            let newState: KState = new KState(null, KSGenerator.EXPANDED_STATE, null);
                            for (let category of state.getCategories()) { // [SC] category: PCategory
                                newState.addCategory(category);
                            }
                            for (let category of subset) { // [SC] category: PCategory
                                newState.addCategory(category);
                            }

                            // [SC] add the new state to the respective rank
                            let newStateRank: KSRank;
                            for (let ksRank of p_ks.getRanks()) { // [SC] ksRank: KSRank
                                if (ksRank.RankIndex === newState.getCategoryCount()) {
                                    newStateRank = ksRank;
                                    break;
                                }
                            }
                            if (newStateRank.addState(newState)) {
                                newState.Id = KSGenerator.getStateID(newStateRank.RankIndex, newStateRank.getStateCount());

                                // [SC] find immediate lower and higher ranks
                                let prevStateRank: KSRank = null;
                                let nextStateRank: KSRank = null;
                                for (let ksRank of p_ks.getRanks()) {
                                    if (ksRank.RankIndex === newState.getCategoryCount() - 1) {
                                        prevStateRank = ksRank;
                                    } else if (ksRank.RankIndex === newState.getCategoryCount() + 1) {
                                        nextStateRank = ksRank;
                                    }

                                    if (prevStateRank !== null && nextStateRank !== null) {
                                        break;
                                    }
                                }

                                // [SC] link the new state with previous states of lower rank
                                if  (prevStateRank !== null) {
                                    for (let prevState of prevStateRank.getStates()) { // [SC] prevState: KState
                                        if (prevState.isSubsetOf(newState)) {
                                            prevState.addNextState(newState);
                                            newState.addPrevState(prevState);
                                        }
                                    }
                                }

                                // [SC] link the new state with next states of higher rank
                                if (nextStateRank !== null) {
                                    for (let nextState of nextStateRank.getStates()) { // [SC] nextState: KState
                                        if (newState.isSubsetOf(nextState)) {
                                            nextState.addPrevState(newState);
                                            newState.addNextState(nextState);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                prevRank = rank;
            }
        }

        /// <summary>
        /// Generates a knowledge structure (KStructure object) from a ranked order (RankOrder object) by applying Rule 1.
        /// </summary>
        /// 
        /// <param name="p_rankOrder">RankOrder object that is used to generate a knowledge structure.</param>
        /// 
        /// <returns>KStructure object, or null if error occured.</returns>
        public createKStructure(p_rankOrder: RankOrder): KStructure {
            // Implements Rule 1: Given a set GR of problems with a rank R and a set G<R of problems of lower ranks, 
            // a union of any subset of GR with G<R is a knowledge state.

            // [SC] make sure the rankOrder object is not null
            if (typeof p_rankOrder === 'undefined' || p_rankOrder === null) {
                this.Log(Severity.Error, "createKStructure: Null object is passed as RankOrder parameter. Returning null.");
                return null;
            }

            // [SC] make sure there is at least one rank in the rank order
            if (p_rankOrder.getRankCount() === 0) {
                this.Log(Severity.Error, "createKStructure: rank order has no ranks. Returning null.");
                return null;
            }

            // [SC] make sure the ranks are sorted in an ascending order
            p_rankOrder.sortAscending();

            // [SC] creating knowledge states
            let allStates: KState[] = new Array<KState>();
            let prevCategories: PCategory[] = new Array<PCategory>();
            for (let rank of p_rankOrder.getRanks()) { // [SC] rank: Rank
                // [SC] getting all unique subsets of categories in this rank
                let subsets: PCategory[][] = rank.getSubsets();

                // [SC] for each subset, create a knowledge state by combining with all categories of lower ranks
                for (let subset of subsets) { // [SC] subset: PCategory[]
                    let state: KState = new KState(null, null, null);
                    for (let category of prevCategories) { // [SC] category: PCategory
                        state.addCategory(category);
                    }
                    for(let category of subset) { // [SC] category: PCategory
                        state.addCategory(category);
                    }
                    allStates.push(state);
                }

                for (let category of rank.getCategories()) { // [SC] category: PCategory
                    prevCategories.push(category);
                }
            }

            // [SC] sort states by their sizes in an ascending order
            allStates.sort(
                function (stateOne: KState, stateTwo: KState): number {
                    if (stateOne.getCategoryCount() < stateTwo.getCategoryCount()) {
                        return -1;
                    } else if (stateOne.getCategoryCount() > stateTwo.getCategoryCount()) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );

            // [SC] creating an empty knowledge structure object
            let ks: KStructure = new KStructure(p_rankOrder);

            // [SC] creating 0th rank with an empty root state
            let rankIndex: number = 0;
            let stateCounter: number = 0; // [SC] used to generate an ID for each state
            let prevRank: KSRank = null;
            let currRank: KSRank = new KSRank(rankIndex, null);  // [SC] the root rank will automatically add an empty root state
            ks.addRank(currRank);

            // [SC] adding all states in respective ranks
            for (let state of allStates) { // [SC] state: KState
                if (state.getCategoryCount() > rankIndex) {
                    stateCounter = 0;
                    prevRank = currRank;
                    currRank = new KSRank(++rankIndex, null);
                    ks.addRank(currRank);
                }

                if (currRank.addState(state)) {
                    state.Id = KSGenerator.getStateID(rankIndex, ++stateCounter);

                    for (let prevState of prevRank.getStates()) { // [SC] prevState: KState
                        if (prevState.isSubsetOf(state)) {
                            prevState.addNextState(state);
                            state.addPrevState(prevState);
                        }
                    }
                }
            }

            return ks;
        }

        ////// END: Methods for creating a knowledge structure
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for creating a rank order

        /// <summary>
        /// Creates a rank order from an array of difficulty ratings. Category IDs are auto generated.
        /// </summary>
        /// 
        /// <param name="p_ratings">Array of difficulty ratings to be used for generating a rank order.</param>
        /// 
        /// <returns>RankOrder object</returns>
        public createRankOrder(p_ratings: number[]): RankOrder {
            let categories: PCategory[] = new Array<PCategory>();

            let counter: number = 0;
            for (let betaVal of p_ratings) {
                categories.push(new PCategory("" + (++counter), betaVal));
            }

            return this.createRankOrderFromCats(categories);
        }

        /// <summary>
        /// Creates a rank order from a list of categories with difficulty ratings.
        /// </summary>
        /// 
        /// <param name="p_categories">List of categories.</param>
        /// 
        /// <returns>RankOrder object</returns>
        public createRankOrderFromCats(p_categories: PCategory[]): RankOrder {
            for (let category of p_categories) { // [SC] category: PCategory
                if (!category.hasId()) {
                    this.Log(Severity.Error, "createRankOrder: Cannot create a rank order. Category ID  is missing. Returning null.");
                    return null;
                }
            }

            // [SC] sorting by an ascending order of ID
            p_categories.sort(
                function (catOne: PCategory, catTwo: PCategory): number {
                    if (catOne.Id < catTwo.Id) {
                        return -1;
                    } else if (catOne.Id > catTwo.Id) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );

            let prevCat: PCategory = null;
            for (let category of p_categories) { // [SC] category: PCategory
                if (!category.hasRating()) {
                    this.Log(Severity.Error, "createRankOrder: Cannot create a rank order. Rating for category '"
                        + category.Id + "' is missing. Returning null.");
                    return null;
                }

                if (prevCat !== null && prevCat.isSameId(category)) {
                    this.Log(Severity.Error, "createRankOrder: Cannot create a rank order. Duplicate category ID is found: '"
                        + category.Id + "'. Returning null.");
                    return null;
                }

                prevCat = category;
            }

            // [SC] sorting by an ascending order of ratings
            p_categories.sort(
                function (catOne: PCategory, catTwo: PCategory): number {
                    if (catOne.Rating < catTwo.Rating) {
                        return -1;
                    } else if (catOne.Rating > catTwo.Rating) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );

            // [SC] building ranks
            let rankOrder: RankOrder = new RankOrder(this.Threshold);
            let rankIndex: number = 0;
            let rank: Rank = null;
            let firstCat: PCategory = null;
            while (p_categories.length > 0) {
                let nextCat: PCategory = p_categories[0];

                if (firstCat === null || this.isSignificantlyDifferent(firstCat.Rating, nextCat.Rating)) {
                    rank = new Rank(++rankIndex, null);
                    rankOrder.addRank(rank);

                    firstCat = nextCat;
                }

                rank.addCategory(nextCat);

                let index: number = p_categories.indexOf(nextCat, 0);
                if (index > -1) {
                    p_categories.splice(index, 1);
                }
            }

            return rankOrder;
        }

        /// <summary>
        /// returns true if two difficulty ratings are significantly diffferent
        /// </summary>
        /// 
        /// <param name="p_betaOne">first difficulty rating</param>
        /// <param name="p_betaTwo">second difficulty rating</param>
        /// 
        /// <returns>boolean</returns>
        private isSignificantlyDifferent(p_betaOne: number, p_betaTwo: number): boolean {
            let observedProbability: number = this.calcDifferenceProbability(p_betaOne, p_betaTwo);

            return Math.abs(this.SameProbability - observedProbability) >= this.Threshold;
        }

        /// <summary>
        /// Calculates probability of difference of two difficulty ratings.
        /// </summary>
        /// 
        /// <param name="p_betaOne">first difficulty rating</param>
        /// <param name="p_betaTwo">second difficulty rating</param>
        /// 
        /// <returns>a value in range [0, 0.5) indicating probability in difficulty difference</returns>
        private calcDifferenceProbability(p_betaOne: number, p_betaTwo: number): number {
            return 1 / (Math.exp(p_betaOne - p_betaTwo) + 1);
        }

        ////// END: Methods for creating a rank order
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Helper methods

        /// <summary>
        /// Generates a knowledge state ID based on its rank index and the number of existing states in the same rank
        /// </summary>
        /// 
        /// <param name="p_rankIndex">states rank index</param>
        /// <param name="p_stateCounter">the number of existing states in the same rank</param>
        /// 
        /// <returns>state ID as string</returns>
        public static getStateID(p_rankIndex: number, p_stateCounter: number): string{
            return "S" + p_rankIndex + "." + p_stateCounter;
        }

        /// <summary>
        /// Returns true if threshold value has a valid range, and false otherwise.
        /// </summary>
        /// 
        /// <param name="p_threshold">threshold value to be verified</param>
        /// 
        /// <returns>boolean</returns>
        public static validThreshold(p_threshold: number): boolean {
            if ((p_threshold >= KSGenerator.MIN_THRESHOLD && p_threshold < KSGenerator.MAX_THRESHOLD)
                || p_threshold === KSGenerator.UNASSIGNED_THRESHOLD) {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Sends a log message to the asset
        /// </summary>
        /// 
        /// <param name="p_severity"> Message severity type</param>
        /// <param name="p_logStr">   Log message</param>
        public Log(p_severity: Severity, p_logStr: string): void {
            if (typeof this.asset !== 'undefined' && this.asset !== null) {
                this.asset.Log(p_severity, p_logStr);
            }
        }

        ////// END: Helper methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}
