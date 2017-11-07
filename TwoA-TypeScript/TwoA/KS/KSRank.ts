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

/// <reference path="KState.ts"/>
///

module TwoAPackage
{
    /// <summary>
    /// Represents a rank in a knowledge structure
    /// </summary>
    export class KSRank
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        /// <summary>
        /// Index of the rank in the knowledge structure.
        /// </summary>
        private rankIndex: number;

        /// <summary>
        /// List of state belonging to this rank.
        /// </summary>
        private states: KState[];

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Properties

        /// <summary>
        /// Getter/setter for the index of the rank in the knowledge structure.
        /// </summary>
        get RankIndex(): number {
            return this.rankIndex;
        }
        set RankIndex(p_rankIndex: number) {
            if(p_rankIndex === KSGenerator.UNASSIGNED_RANK || p_rankIndex >= 0) {
                this.rankIndex = p_rankIndex;

                if (p_rankIndex === 0) { // [SC] 0th rank has only the root state
                    this.states.splice(0, this.states.length);
                    let rootState: KState = new KState(null, KSGenerator.ROOT_STATE, null);
                    rootState.Id = KSGenerator.getStateID(p_rankIndex, 1);
                    this.states.push(rootState);
                }
            }
            else {
                throw new RangeError("Rank should be a non-zero positive value.");
            }
        }

        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        /// <summary>
        /// Constructor.
        /// </summary>
        /// 
        /// <param name="p_rankIndex">    Rank index</param>
        /// <param name="p_states">       List of states of this rank</param>
        constructor(p_rankIndex: number, p_states: KState[]) {
            if (typeof p_rankIndex === 'undefined' || p_rankIndex === null) {
                p_rankIndex = KSGenerator.UNASSIGNED_RANK;
            }

            if (typeof p_states === 'undefined' || p_states === null) {
                p_states = new Array<KState>();
            }

            this.states = p_states;
            this.RankIndex = p_rankIndex;
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods

        /// <summary>
        /// Returns the number of states in the rank.
        /// </summary>
        /// 
        /// <returns>state count</returns>
        public getStateCount(): number {
            return this.states.length;
        }

        /// <summary>
        /// Add a specified to this rank.
        /// </summary>
        /// 
        /// <param name="p_state">KState object to add to the rank</param>
        /// 
        /// <returns>True if the state was added successfully</returns>
        public addState(p_state: KState): boolean {
            if (this.RankIndex === 0) {
                return false;
            }

            if (this.RankIndex !== p_state.getCategoryCount()) {
                return false;
            }

            // [SC] verify that the same state does not already exist; verification is done at PCategory reference level
            for(let stateOne of this.states) {
                let subsetFlag: boolean = true;

                if (p_state.getCategoryCount() === stateOne.getCategoryCount()) {
                    for (let category of p_state.getCategories()) {
                        if (stateOne.getCategory(category.Id) === null) {
                            subsetFlag = false;
                            break;
                        }
                    }

                    if (subsetFlag) {
                        return false;
                    }
                }
            }

            this.states.push(p_state);

            return true;
        }

        /// <summary>
        /// Removes the specified state from this rank.
        /// </summary>
        /// 
        /// <param name="p_state">KState object to remove</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        public removeState(p_state: KState): boolean {
            let index: number = this.states.indexOf(p_state, 0);

            if (index < 0) {
                return false; // [TODO] log
            }

            this.states.splice(index, 1);
            return true;
        }

        /// <summary>
        /// Removes a state at the specified index of the list.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if a state was removed successfully</returns>
        public removeStateAt(p_index: number): boolean {
            if (this.RankIndex === 0) {
                return false;
            }

            if (this.getStateCount() > p_index && p_index >= 0) {
                this.states.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        }

        /// <summary>
        /// Retrieve state at the specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KState object, or null if index is out of range</returns>
        public getStateAt(p_index: number): KState {
            if (this.getStateCount() > p_index && p_index >= 0) {
                return this.states[p_index];
            }
            else {
                return null;
            }
        }

        /// <summary>
        /// Retrieve the list of all states
        /// </summary>
        /// 
        /// <returns>List of KState objects</returns>
        public getStates(): KState[] {
            return this.states;
        }

        ////// END: Methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}