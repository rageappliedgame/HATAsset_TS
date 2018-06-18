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

/// <reference path="../Misc.ts"/>
///
/// <reference path="PCategory.ts"/>
/// <reference path="KSGenerator.ts"/>
///

namespace TwoANS
{
    /*import KSGenerator = TwoANS.KSGenerator;
    import PCategory = TwoANS.PCategory;*/
    
    /// <summary>
    /// Represents a knowledge state
    /// </summary>
    export class KState
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        /// <summary>
        /// ID for the state
        /// </summary>
        private id: string;

        /// <summary>
        /// Type of knowledge state (can be root, core or expanded).
        /// </summary>
        private stateType: string;

        /// <summary>
        /// A list of categories that comprise the knowledge state
        /// </summary>
        private categories: PCategory[];

        /// <summary>
        /// A list of all states that are prerequisite for this state
        /// </summary>
        private prevStates: KState[];
        /// <summary>
        /// A list of all states this state is prerequisite for
        /// </summary>
        private nextStates: KState[];

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties

        /// <summary>
        /// ID for the state
        /// </summary>
        get Id(): string {
            return this.id;
        }
        set Id(p_id: string) {
            this.id = p_id;
        }

        /// <summary>
        /// Getter/setter for the stateType field
        /// </summary>
        get StateType(): string {
            return this.stateType;
        }
        set StateType(p_stateType: string) {
            if (!(p_stateType === KSGenerator.ROOT_STATE
                || p_stateType === KSGenerator.CORE_STATE
                || p_stateType === KSGenerator.EXPANDED_STATE
            )) {
                throw new TypeError("Invalid state type.");
            }
            else {
                this.stateType = p_stateType;

                if (p_stateType === KSGenerator.ROOT_STATE) {
                    // [SC] clearing both arrays
                    this.prevStates.splice(0, this.prevStates.length); // [SC] root state cannot have prerequisite states
                    this.nextStates.splice(0, this.nextStates.length); // [SC] root state is always an empty state
                }
            }
        }

        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        /// <summary>
        /// Private constructor
        /// </summary>
        /// 
        /// <param name="p_id">           A unique ID for the state</param>
        /// <param name="p_stateType">    Type of the state</param>
        /// <param name="p_categories">   A list of ategories that comprise the state</param>
        constructor(p_id: string, p_stateType: string, p_categories: PCategory[]) {
            if (typeof p_stateType === 'undefined' || p_stateType === null) {
                p_stateType = KSGenerator.CORE_STATE;
            }

            if (typeof p_categories === 'undefined' || p_categories === null) {
                p_categories = new Array<PCategory>();
            }

            this.categories = p_categories;

            this.prevStates = new Array<KState>();
            this.nextStates = new Array<KState>();

            this.Id = p_id;
            this.StateType = p_stateType;
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for id

        /// <summary>
        /// Returns true if the Id property was assigned a valid value.
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        public hasId(): boolean {
            return !Misc.IsNullOrEmpty(this.Id);
        }

        /// <summary>
        /// returns true if the state's Id is same as the specified Id
        /// </summary>
        /// 
        /// <param name="p_id">ID to compare to</param>
        /// 
        /// <returns>boolean</returns>
        public isSameId(p_id: string): boolean;

        /// <summary>
        /// returns true if this state has the same Id as the state passed as a parameter.
        /// </summary>
        /// 
        /// <param name="p_state">another state to compare to</param>
        /// 
        /// <returns>boolean</returns>
        public isSameId(p_state: KState): boolean;

        /// <summary>
        /// implementation of isSameId overloads.
        /// </summary>
        public isSameId(x): boolean {
            if (typeof x === "string") {
                return this.Id === x;
            } else if (x instanceof KState) {
                return this.Id === x.Id;
            } else {
                return false;
            }
        }

        ////// END: Methods for id
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for previous states

        /// <summary>
        /// Returns the number of prerequisite states.
        /// </summary>
        /// 
        /// <returns>state count</returns>
        public getPrevStateCount(): number {
            return this.prevStates.length;
        }

        /// <summary>
        /// Adds a specified prerequisite state.
        /// </summary>
        /// 
        /// <param name="p_prevState">The state to be added to the list of prerequisite states</param>
        public addPrevState(p_prevState: KState): void {
            if (this.StateType !== KSGenerator.ROOT_STATE) {
                this.prevStates.push(p_prevState);
            }
        }

        /// <summary>
        /// Removes the specified prerequisite state.
        /// </summary>
        /// 
        /// <param name="p_prevState">A state to be removed from the list of prerequisite states</param>
        /// 
        /// <returns>True if the state was removed successfully.</returns>
        public removePrevState(p_prevState: KState): boolean {
            let index: number = this.prevStates.indexOf(p_prevState, 0);

            if (index < 0) { // [TODO] log
                return false;
            }

            this.prevStates.splice(index, 1);
            return true;
        }

        /// <summary>
        /// Removes the prerequisite state at the specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        public removePrevStateAt(p_index: number): boolean {
            if (this.getPrevStateCount() > p_index && p_index >= 0) {
                this.prevStates.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        }

        /// <summary>
        /// Retrieve the list of all prerequisite states.
        /// </summary>
        /// 
        /// <returns>A list of KState objects</returns>
        public getPrevStates(): KState[] {
            return this.prevStates;
        }

        /// <summary>
        /// Retrieves a prerequisite state at specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KState object, or null if index is out of range</returns>
        public getPrevStateAt(p_index: number): KState {
            if (this.getPrevStateCount() > p_index && p_index >= 0) {
                return this.prevStates[p_index];
            }
            else {
                return null;
            }
        }

        ////// END: Methods for previous states
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for next states

        /// <summary>
        /// Returns the number of succeeding states.
        /// </summary>
        /// 
        /// <returns>integer</returns>
        public getNextStateCount(): number {
            return this.nextStates.length;
        }

        /// <summary>
        /// Adds a specified state to the list of succeeding states.
        /// </summary>
        /// 
        /// <param name="p_nextState">State to be added to the list of succeeding states</param>
        public addNextState(p_nextState: KState): void { 
            this.nextStates.push(p_nextState);
        }

        /// <summary>
        /// Removes the specified state from the list of succeeding states.
        /// </summary>
        /// 
        /// <param name="p_nextState">State to remove</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        public removeNextState(p_nextState: KState): boolean {
            let index: number = this.nextStates.indexOf(p_nextState, 0);

            if (index < 0) { // [TODO] log
                return false;
            }

            this.nextStates.splice(index, 1);
            return true;
        }

        /// <summary>
        /// Removes a state at specified index in the list of succeeding states.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        public removeNextStateAt(p_index: number): boolean {
            if (this.getNextStateCount() > p_index && p_index >= 0) {
                this.nextStates.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        }

        /// <summary>
        /// Retrieve the list of all states succeding this state.
        /// </summary>
        /// 
        /// <returns>A list of KState objects</returns>
        public getNextStates(): KState[] {
            return this.nextStates;
        }

        /// <summary>
        /// Retrieve a succeeding state at the specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KState object, or null if index is out of range</returns>
        public getNextStateAt(p_index: number): KState {
            if (this.getNextStateCount() > p_index && p_index >= 0) {
                return this.nextStates[p_index];
            }
            else {
                return null;
            }
        }

        ////// END: Methods for next states
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for categories

        /// <summary>
        /// Get the number of categories in the knowledge state.
        /// </summary>
        /// 
        /// <returns>state count</returns>
        public getCategoryCount(): number {
            return this.categories.length;
        }

        /// <summary>
        /// Add a new category to the knowledge state.
        /// </summary>
        /// 
        /// <param name="p_newCategory">PCategory objectt</param>
        /// 
        /// <returns>true if category was added; false if a category with the same ID already exists in the list</returns>
        public addCategory(p_newCategory: PCategory): boolean {
            // [SC] a root state is always an empty state
            if (this.StateType === KSGenerator.ROOT_STATE) {
                return false;
            }

            // [SC] verifying if a category with the same ID already exists
            for (let category of this.categories) {
                if (category.isSameId(p_newCategory)) {
                    return false;
                }
            }

            this.categories.push(p_newCategory);
            return true;
        }

        /// <summary>
        /// Remove a give category object.
        /// </summary>
        /// 
        /// <param name="p_category">category object</param>
        /// 
        /// <returns>true if the category was removed</returns>
        public removeCategory(p_category: PCategory): boolean;

        /// <summary>
        /// Remove category by its ID.
        /// </summary>
        /// 
        /// <param name="p_id">category ID</param>
        /// 
        /// <returns>true if a category was removed</returns>
        public removeCategory(p_id: string): boolean;

        /// <summary>
        /// Implementation of removeCategory overloads.
        /// </summary>
        public removeCategory(x): boolean {
            let index: number = -1;

            if (typeof x === "string") {
                for (let tempIndex = 0; tempIndex < this.categories.length; tempIndex++) {
                    if (this.categories[tempIndex].isSameId(x)) {
                        index = tempIndex;
                        break;
                    }
                }
            } else if (x instanceof PCategory) {
                index = this.categories.indexOf(x, 0);
            } else {
                return false; // [TODO] unknown type log
            }

            if (index < 0) {
                return false; // [TODO] log
            }

            this.categories.splice(index, 1);
            return true;
        }

        /// <summary>
        /// Remove category by its list index.
        /// </summary>
        /// 
        /// <param name="p_index">index in a list</param>
        /// 
        /// <returns>true if a category was removed</returns>
        public removeCategoryAt(p_index: number): boolean {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                this.categories.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        }

        /// <summary>
        /// Get the list of all categories in the knowledge state.
        /// </summary>
        /// 
        /// <returns>List of PCategory objects</returns>
        public getCategories(): PCategory[] {
            return this.categories;
        }

        /// <summary>
        /// Get a category by its list index.
        /// </summary>
        /// 
        /// <param name="p_index">index in a list</param>
        /// 
        /// <returns>PCategory object, or null if index is out of range</returns>
        public getCategoryAt(p_index: number): PCategory {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                return this.categories[p_index];
            }
            else {
                return null;
            }
        }

        /// <summary>
        /// Get a category by it ID.
        /// </summary>
        /// 
        /// <param name="p_id">category ID</param>
        /// 
        /// <returns>PCategory object or null</returns>
        public getCategory(p_id: string): PCategory {
            for (let category of this.categories) {
                if (category.isSameId(p_id)) {
                    return category;
                }
            }

            return null;
        }

        ////// END: Methods for categories
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Other methods

        /// <summary>
        /// Returns a string representation of this state.
        /// </summary>
        /// 
        /// <returns>string</returns>
        public ToString(): string {
            let name: string = "(";
            let sepFlag: boolean = false;
            for(let cat of this.categories) {
                if (sepFlag) {
                    name += ",";
                }
                else {
                    sepFlag = true;
                }
                name += cat.Id;
            }
            return name + ")";
        }

        /// <summary>
        /// Returns true if the state is subset of a state specified as parameter
        /// </summary>
        /// 
        /// <param name="p_state">KState object</param>
        /// 
        /// <returns>boolean</returns>
        public isSubsetOf(p_state: KState): boolean {
            for (let category of this.categories) {
                if (p_state.getCategory(category.Id) === null) {
                    return false;
                }
            }

            return true;
        }

        ////// END: Other methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}