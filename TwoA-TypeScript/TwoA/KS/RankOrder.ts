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

/// <reference path="Rank.ts"/>
/// <reference path="KSGenerator.ts"/>
///

namespace TwoANS
{
    /*import Rank = TwoANS.Rank;
    import KSGenerator = TwoANS.KSGenerator;*/

    /// <summary>
    /// Represents a rank order from which a knowledge structure can be constructed
    /// </summary>
    export class RankOrder
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        /// <summary>
        /// A list of ranks in this rank order.
        /// </summary>
        private ranks: Rank[];

        /// <summary>
        /// The value of the threshold used to create the ranked order.
        /// </summary>
        private threshold: number;

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties

        /// <summary>
        /// Getter/setter for the threshold field.
        /// </summary>
        get Threshold(): number {
            return this.threshold;
        }
        set Threshold(p_threshold: number) {
            if (KSGenerator.validThreshold(p_threshold)) {
                this.threshold = p_threshold;
            }
            else {
                throw new RangeError("Cannot set Threshold value in RankOrder. The value is invalid.");
            }
        }

        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructors

        /// <summary>
        /// Constructor
        /// </summary>
        /// 
        /// <param name="p_threshold">threshold used to construct this rank order</param>
        constructor(p_threshold: number) {
            if (typeof p_threshold === 'undefined' || p_threshold === null) {
                p_threshold = KSGenerator.UNASSIGNED_THRESHOLD;
            }

            this.ranks = new Array<Rank>();
            this.Threshold = p_threshold;
        }

        ////// END: constructors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods

        /// <summary>
        /// Returns true if threshold was explicitly set to a value.
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        public hasThreshold(): boolean {
            return this.Threshold !== KSGenerator.UNASSIGNED_THRESHOLD;
        }

        /// <summary>
        /// Returns the number of ranks in the rank order.
        /// </summary>
        /// 
        /// <returns>interger value</returns>
        public getRankCount(): number {
            return this.ranks.length;
        }

        /// <summary>
        /// Adds a new rank to the rank order.
        /// </summary>
        /// 
        /// <param name="p_rank">     Rank object to be added to the rank order.</param>
        /// <param name="p_sortFlag"> If set to true then ranks are sorted by indices in a ascending order after the new rank was added.</param>
        public addRank(p_rank: Rank, p_sortFlag: boolean = true): void {
            this.ranks.push(p_rank);
            if (p_sortFlag) {
                this.sortAscending();
            }
        }

        /// <summary>
        /// Remove a given rank object from the rank order.
        /// </summary>
        /// 
        /// <param name="p_rank">     Rank object to be removed.</param>
        /// <param name="p_sortFlag"> If set to true then ranks are sorted by indices in a ascending order after the new rank was removed.</param>
        /// 
        /// <returns>True if Rank object was removed successfully.</returns>
        public removeRank(p_rank: Rank, p_sortFlag: boolean = true): boolean {
            let index: number = this.ranks.indexOf(p_rank, 0);

            if (index < 0) { // [TODO] log
                return false;
            }

            this.ranks.splice(index, 1);
            if (p_sortFlag) {
                this.sortAscending();
            }

            return true;
        }

        /// <summary>
        /// Removes a rank with a specified list index. Note that rank's list index is not necessarily same as the rank's index in rank order.
        /// </summary>
        /// 
        /// <param name="p_index">    List index of a rank to be removed.</param>
        /// <param name="p_sortFlag"> If set to true then ranks are sorted by indices in a ascending order after the new rank was removed.</param>
        /// 
        /// <returns>True if a rank was successfully removed.</returns>
        public removeRankAt(p_index: number, p_sortFlag: boolean = true): boolean {
            if (this.getRankCount() > p_index && p_index >= 0) {
                this.ranks.splice(p_index, 1);

                if (p_sortFlag) {
                    this.sortAscending();
                }

                return true;
            }
            else {
                return false;
            }
        }

        /// <summary>
        /// Retrieve Rank object at specified position in a list (list index).
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>Rank object, or null if index is out of range.</returns>
        public getRankAt(p_index: number): Rank {
            if (this.getRankCount() > p_index && p_index >= 0) {
                return this.ranks[p_index];
            }
            else {
                return null;
            }
        }

        /// <summary>
        /// Retrieve the list of all ranks in the rank order.
        /// </summary>
        /// 
        /// <returns>List of all rank objects.</returns>
        public getRanks(): Rank[] {
            return this.ranks;
        }

        /// <summary>
        /// Sorts ranks by rank indices in an ascending order.
        /// </summary>
        public sortAscending(): void {
            this.ranks.sort(
                function (rankOne: Rank, rankTwo: Rank): number {
                    if (rankOne.RankIndex < rankTwo.RankIndex) {
                        return -1;
                    } else if (rankOne.RankIndex > rankTwo.RankIndex) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );
        }

        ////// END: methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}