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
    /// A TwoA gameplay.
    /// </summary>
    export class Gameplay
    {
        private adaptID: string;
        private gameID: string;
        private playerID: string;
        private scenarioID: string;
        private timestamp: string;
        private rt: number;
        private accuracy: number;
        private playerRating: number;
        private scenarioRating: number;

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
        /// Identifier for the player.
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
        /// Identifier for the scenario.
        /// </summary>
        get ScenarioID(): string {
            return this.scenarioID;
        }
        set ScenarioID(p_scenarioID: string) {
            if (!Misc.IsNullOrEmpty(p_scenarioID)) {
                this.scenarioID = p_scenarioID;
            }
        }

        /// <summary>
        /// The timestamp.
        /// </summary>
        get Timestamp(): string {
            return this.timestamp;
        }
        set Timestamp(p_timestamp: string) {
            if (!Misc.IsNullOrEmpty(p_timestamp)) {
                this.timestamp = p_timestamp;
            }
        }

        /// <summary>
        /// The RT.
        /// </summary>
        get RT(): number {
            return this.rt;
        }
        set RT(p_rt: number) {
            this.rt = p_rt;
        }

        /// <summary>
        /// The accuracy.
        /// </summary>
        get Accuracy(): number {
            return this.accuracy;
        }
        set Accuracy(p_accuracy: number) {
            this.accuracy = p_accuracy;
        }

        /// <summary>
        /// The player rating.
        /// </summary>
        get PlayerRating(): number {
            return this.playerRating;
        }
        set PlayerRating(p_playerRating: number) {
            this.playerRating = p_playerRating;
        }

        /// <summary>
        /// The scenario rating.
        /// </summary>
        get ScenarioRating(): number {
            return this.scenarioRating;
        }
        set ScenarioRating(p_scenarioRating: number) {
            this.scenarioRating = p_scenarioRating;
        }

        /// <summary>
        /// Constructor.
        /// </summary>
        constructor() {}
    }
}