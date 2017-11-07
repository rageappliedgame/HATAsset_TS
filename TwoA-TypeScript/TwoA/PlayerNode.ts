/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
///     Wim van der Vegt 
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

/// <reference path="Misc.ts"/>
///

module TwoAPackage
{
    /// <summary>
    /// The Player node
    /// </summary>
    export class PlayerNode
    {
        private adaptID: string;
        private gameID: string;
        private playerID: string;
        private rating: number = BaseAdapter.INITIAL_RATING;
        private playCount: number = 0;
        private kFct: number = BaseAdapter.INITIAL_K_FCT;
        private uncertainty: number = BaseAdapter.INITIAL_UNCERTAINTY;
        private lastPlayed: string = Misc.GetDateStr();

        /// <summary>
        /// Identifier for the Adaptation node.
        /// </summary>
        get AdaptationID(): string {
            return this.adaptID;
        }
        set AdaptationID(p_adaptID: string) {
            if (!Misc.IsNullOrEmpty(p_adaptID)) {
                this.adaptID = p_adaptID;
            }
        }

        /// <summary>
        /// Identifier for the Game node.
        /// </summary>
        get GameID(): string {
            return this.gameID;
        }
        set GameID(p_gameID: string) {
            if (!Misc.IsNullOrEmpty(p_gameID)) {
                this.gameID = p_gameID;
            }
        }

        /// <summary>
        /// Identifier for the Player node.
        /// </summary>
        get PlayerID(): string {
            return this.playerID;
        }
        set PlayerID(p_playerID: string) {
            if (!Misc.IsNullOrEmpty(p_playerID)) {
                this.playerID = p_playerID;
            }
        }

        /// <summary>
        /// Player rating
        /// </summary
        get Rating(): number {
            return this.rating;
        }
        set Rating(p_rating: number) {
            this.rating = p_rating;
        }

        /// <summary>
        /// Number of times the player played any scenario.
        /// </summary>
        get PlayCount(): number {
            return this.playCount;
        }
        set PlayCount(p_playCount: number) {
            if (p_playCount >= 0) {
                this.playCount = p_playCount;
            }
        }

        /// <summary>
        /// Player's K factor.
        /// </summary>
        get KFactor(): number {
            return this.kFct;
        }
        set KFactor(p_kFct: number) {
            if (p_kFct > 0) {
                this.kFct = p_kFct;
            }
        }

        /// <summary>
        /// Uncertainty in player's rating.
        /// </summary>
        get Uncertainty(): number {
            return this.uncertainty;
        }
        set Uncertainty(p_uncertainty: number) {
            if (p_uncertainty >= 0 && p_uncertainty <= 1) {
                this.uncertainty = p_uncertainty;
            }
        }

        /// <summary>
        /// Last time the player played.
        /// </summary>
        get LastPlayed(): string {
            return this.lastPlayed;
        }
        set LastPlayed(p_lastPlayed: string) {
            if (!Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.lastPlayed = p_lastPlayed;
            }
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_playerID">Player ID</param>
        constructor(p_adaptID: string, p_gameID: string, p_playerID: string) {
            this.AdaptationID = p_adaptID;
            this.GameID = p_gameID;
            this.PlayerID = p_playerID;
        }

        /// <summary>
        /// Makes a shallow clone of this instance.
        /// </summary>
        /// <returns>New instance of PlayerNode</returns>
        public ShallowClone(): PlayerNode {
            let newPlayerNode: PlayerNode = new PlayerNode(this.AdaptationID, this.GameID, this.PlayerID);
            newPlayerNode.Rating = this.Rating;
            newPlayerNode.PlayCount = this.PlayCount;
            newPlayerNode.KFactor = this.KFactor;
            newPlayerNode.Uncertainty = this.Uncertainty;
            newPlayerNode.LastPlayed = this.LastPlayed;
            return newPlayerNode;
        }
    }
}