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

/// <reference path="RankOrder.ts"/>
/// <reference path="KSRank.ts"/>
///

namespace TwoANS
{
    /*import RankOrder = TwoANS.RankOrder;
    import KSRank = TwoANS.KSRank;*/

    /// <summary>
    /// Represents a knowledge structure
    /// </summary>
    export class KStructure
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Fields

        /// <summary>
        /// A rank order from which the knowledge structure is constructed.
        /// </summary>
        private rankorder: RankOrder;

        /// <summary>
        /// The list of ranks in the knowledge structure
        /// </summary>
        private ranks: KSRank[];

        ////// END: Fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Properties

        /// <summary>
        /// A rank order from which the knowledge structure is constructed.
        /// </summary>
        get rankOrder(): RankOrder {
            return this.rankorder;
        }
        set rankOrder(p_rankorder: RankOrder) {
            this.rankorder = p_rankorder;
        }

        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Constructor

        /// <summary>
        /// Constructor initializes an empty list of knowledge structure ranks.
        /// </summary>
        /// 
        /// <param name="p_rankOrder">RankOrder object that is used to construct the knowledge structure</param>
        constructor(p_rankOrder: RankOrder) {
            this.rankOrder = p_rankOrder;
            this.ranks = new Array<KSRank>();
        }

        ////// END: Constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods

        /// <summary>
        /// Returns true if there is a rankOrder with at least one rank.
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        public hasRankOrder(): boolean {
            return !(typeof this.rankOrder === 'undefined' || this.rankOrder === null || this.rankOrder.getRankCount() === 0);
        }

        /// <summary>
        /// Returns true if the knowledge structure has at least one rank
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        public hasRanks(): boolean {
            return !(typeof this.ranks === 'undefined' || this.ranks === null || this.getRankCount() === 0);
        }

        /// <summary>
        /// Returns the number of ranks in the knowledge structure.
        /// </summary>
        /// 
        /// <returns>number of ranks</returns>
        public getRankCount(): number {
            return this.ranks.length;
        }

        /// <summary>
        /// Adds a specified rank into the knowledge structure.
        /// </summary>
        /// 
        /// <param name="p_rank">     KSRank object to add into the knowledge structure</param>
        /// <param name="p_sortFlag"> If true, ranks are sorted by ascending order of rank indices after the new rank is added.</param>
        public addRank(p_rank: KSRank, p_sortFlag: boolean = true): void {
            this.ranks.push(p_rank);
            if (p_sortFlag) {
                this.sortAscending();
            }
        }

        /// <summary>
        /// Removes the specified rank from the knowledge structure.
        /// </summary>
        /// 
        /// <param name="p_rank">     KSRank object to be removed from the knowledge structure.</param>
        /// <param name="p_sortFlag"> If true, ranks are sorted by ascending order of rank indices after the new rank is removed</param>
        /// 
        /// <returns>True if the rank was removed successfully.</returns>
        public removeRank(p_rank: KSRank, p_sortFlag: boolean = true): boolean {
            let index: number = this.ranks.indexOf(p_rank, 0);

            if (index < 0) {
                return false;
            }

            this.ranks.splice(index, 1);
            if (p_sortFlag) {
                this.sortAscending();
            }

            return true;
        }

        /// <summary>
        /// Removes a rank at the specified list index. Note that rank's list index is not necessarily same as the rank's index in a knowledge structure.
        /// </summary>
        /// 
        /// <param name="p_index">    List index of a rank to be removed.</param>
        /// <param name="p_sortFlag"> If true, ranks are sorted by ascending order of rank indices after the new rank is removed.</param>
        /// 
        /// <returns>True if the rank was removed successfully</returns>
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
        /// Retrieve KSRank object at specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KSRank object, or null if index is out of range.</returns>
        public getRankAt(p_index: number): KSRank {
            if (this.getRankCount() > p_index && p_index >= 0) {
                return this.ranks[p_index];
            }
            else {
                return null;
            }
        }

        /// <summary>
        /// Returns the list of all ranks in the knowledge structure.
        /// </summary>
        /// 
        /// <returns>List of KSRank objects</returns>
        public getRanks(): KSRank[] {
            return this.ranks;
        }

        /// <summary>
        /// Sorts ranks in the knowledge structure by ascending order of rank indices.
        /// </summary>
        public sortAscending(): void {
            this.ranks.sort(
                function (rankOne: KSRank, rankTwo: KSRank): number {
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

        ////// END: Methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}