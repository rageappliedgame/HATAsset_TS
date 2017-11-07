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
    /// Represents a category of problems of the same structure and difficulty
    /// </summary>
    export class PCategory
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        private id: string;
        private rating: number;

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties

        /// <summary>
        /// A unique identifier for the problem category.
        /// </summary>
        get Id(): string {
            return this.id;
        }
        set Id(p_id: string) {
            this.id = p_id;
        }

        /// <summary>
        /// Rating of the problem category.
        /// </summary>
        get Rating(): number {
            return this.rating;
        }
        set Rating(p_rating: number) {
            this.rating = p_rating;
        }

        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        /// <summary>
        /// Initializes a new instance of the TwoA.KS.PCategory class.
        /// </summary>
        /// 
        /// <param name="id">       A unique identifier for the problem category. </param>
        /// <param name="rating">   Rating of the problem category. </param>
        constructor(p_id: string, p_rating: number) {
            if (typeof p_rating === 'undefined' || p_rating === null) {
                p_rating = KSGenerator.UNASSIGNED_RATING;
            }

            this.Id = p_id;
            this.Rating = p_rating;
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods

        /// <summary>
        /// Returns true if the Id property was assigned a valid value.
        /// </summary>
        /// 
        /// <returns> boolean value </returns>
        public hasId(): boolean {
            return !Misc.IsNullOrEmpty(this.Id);
        }

        /// <summary>
        /// Returns true if the Rating property was assigned a numerical value.
        /// </summary>
        /// 
        /// <returns> boolean value </returns>
        public hasRating(): boolean {
            return this.Rating !== KSGenerator.UNASSIGNED_RATING;
        }

        /// <summary>
        /// returns true if the category's Id is same as the specified Id
        /// </summary>
        /// 
        /// <param name="p_id">ID to compare to</param>
        /// 
        /// <returns>a boolean value</returns>
        public isSameId(p_id: string): boolean;

        /// <summary>
        /// returns true if this category has the same Id as the category passed as a parameter
        /// </summary>
        /// 
        /// <param name="p_category">another category to compare to</param>
        /// 
        /// <returns>a boolean value</returns>
        public isSameId(p_category: PCategory): boolean;

        /// <summary>
        /// an implementation of isSameId overloads
        /// </summary>
        public isSameId(x): boolean {
            if (typeof x === "string") {
                return this.Id === x;
            } else if (x instanceof PCategory) {
                return this.Id === x.Id;
            } else {
                return false;
            }
        }

        ////// END: methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
} 