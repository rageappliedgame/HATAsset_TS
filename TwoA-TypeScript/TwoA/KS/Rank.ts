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

module TwoAPackage
{
    /// <summary>
    /// Represents a rank in a rank order
    /// </summary>
    export class Rank
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        /// <summary>
        /// Rank index indicating rank's position in a rank order.
        /// </summary>
        private rankIndex: number;

        /// <summary>
        /// List of categories that were assigned this rank.
        /// </summary>
        private categories: PCategory[];

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties

        /// <summary>
        /// Getter/setter for rankIndex field.
        /// </summary>
        get RankIndex(): number {
            return this.rankIndex;
        }
        set RankIndex(p_rankIndex: number) {
            if (p_rankIndex === KSGenerator.UNASSIGNED_RANK || p_rankIndex > 0) {
                this.rankIndex = p_rankIndex;
            }
            else {
                throw new RangeError("Rank should be a non-zero positive value.");
            }
        }

        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// 
        /// <param name="p_rankIndex">    Rank index</param>
        /// <param name="p_categories">   List of categories assigned to this rank</param>
        constructor(p_rankIndex: number, p_categories: PCategory[]) {
            if (typeof p_rankIndex === 'undefined' || p_rankIndex === null) {
                p_rankIndex = KSGenerator.UNASSIGNED_RANK;
            }

            if (typeof p_categories === 'undefined' || p_categories === null) {
                p_categories = new Array<PCategory>();
            }

            this.categories = p_categories;
            this.RankIndex = p_rankIndex;
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods

        /// <summary>
        /// Returns the number of categories in the rank.
        /// </summary>
        /// 
        /// <returns>Number of categories</returns>
        public getCategoryCount(): number {
            return this.categories.length;
        }

        /// <summary>
        /// Adds the specified category into the rank.
        /// </summary>
        /// 
        /// <param name="p_category">PCategory object to add to the rank</param>
        public addCategory(p_category: PCategory): void {
            this.categories.push(p_category);
        }

        /// <summary>
        /// Removes the specified PCategory object from the rank.
        /// </summary>
        /// 
        /// <param name="p_category">PCategory object to remove.</param>
        /// 
        /// <returns>True if the category was removed successfully.</returns>
        public removeCategory(p_category: PCategory): boolean;

        /// <summary>
        /// Removes from the rank the category with specified ID.
        /// </summary>
        /// 
        /// <param name="p_id">ID of the category to remove</param>
        /// 
        /// <returns>True if the category was removed successfully.</returns>
        public removeCategory(p_id: string): boolean;

        /// <summary>
        /// implementation of removeCategory overloads.
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

            if (index < 0) { // [TODO] log
                return false;
            }

            this.categories.splice(index, 1);
            return true;
        }

        /// <summary>
        /// Removes the category at specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if a category was removed successfully.</returns>
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
        /// Get category at specified index.
        /// </summary>
        /// 
        /// <param name="p_index">index indicating category position</param>
        /// 
        /// <returns></returns>
        public getCategoryAt(p_index: number): PCategory {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                return this.categories[p_index];
            }
            else {
                return null;
            }
        }

        /// <summary>
        /// Returns the list of all categories in the rank.
        /// </summary>
        /// 
        /// <returns>List of categories</returns>
        public getCategories(): PCategory[] {
            return this.categories;
        }

        /// <summary>
        /// Retrieve category with specified ID.
        /// </summary>
        /// 
        /// <param name="p_id">Category ID</param>
        /// 
        /// <returns>PCategory object</returns>
        public getCategory(p_id: string): PCategory {
            for (let category of this.categories) {
                if (category.isSameId(p_id)) {
                    return category;
                }
            }

            return null;
        }

        /// <summary>
        /// A function that finds all unique subsets categories in the rank.
        /// </summary>
        /// 
        /// <returns>List of lists of categories</returns>
        public getSubsets(): PCategory[][] {
            let subsets: PCategory[][] = [];

            let baseList: PCategory[] = new Array<PCategory>();

            this.getSubsetsRecursive(baseList, this.categories, subsets);

            return subsets;
        }

        /// <summary>
        /// A recursive function that finds all unique subsets (2^|List|) from a given sourceList.
        /// </summary>
        /// 
        /// <param name="p_baseList">     Initially an empty list.</param>
        /// <param name="p_sourceList">   Initially a list of all items to divided into subsets.</param>
        /// <param name="p_subsets">      Contains all identified subsets.</param>
        public getSubsetsRecursive(p_baseList: PCategory[], p_sourceList: PCategory[], p_subsets: PCategory[][]): void {
            for (let index = 0; index < p_sourceList.length; index++) {

                let newBaseList: PCategory[] = new Array<PCategory>();
                for (let category of p_baseList) {
                    newBaseList.push(category);
                }
                newBaseList.push(p_sourceList[index]);
                p_subsets.push(newBaseList);

                if (index + 1 < p_sourceList.length) {
                    let newSourceList: PCategory[] = new Array<PCategory>();
                    for (let indexTwo = index + 1; indexTwo < p_sourceList.length; indexTwo++) {
                        newSourceList.push(p_sourceList[indexTwo]);
                    }

                    this.getSubsetsRecursive(newBaseList, newSourceList, p_subsets);
                }
            }
        }

        ////// END: methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}