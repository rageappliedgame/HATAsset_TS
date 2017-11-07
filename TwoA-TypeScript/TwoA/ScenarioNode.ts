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
    /// The Scenario node
    /// </summary>
    export class ScenarioNode
    {
        private adaptID: string;
        private gameID: string;
        private scenarioID: string;
        private rating: number = BaseAdapter.INITIAL_RATING;
        private playCount: number = 0;
        private kFct: number = BaseAdapter.INITIAL_K_FCT;
        private uncertainty: number = BaseAdapter.INITIAL_UNCERTAINTY;
        private lastPlayed: string = Misc.GetDateStr();
        private timeLimit: number = BaseAdapter.DEFAULT_TIME_LIMIT;

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
        /// Identifier for the Scenario node.
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
        /// Scenario rating
        /// </summary>
        get Rating(): number {
            return this.rating;
        }
        set Rating(p_rating: number) {
            this.rating = p_rating;
        }

        /// <summary>
        /// Number of times the scenario was played.
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
        /// Scenario's K factor.
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
        /// Uncertainty in scenario's rating.
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
        /// Last time the scenario played.
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
        /// Time limit for completing the scenario.
        /// </summary>
        get TimeLimit(): number {
            return this.timeLimit;
        }
        set TimeLimit(p_timeLimit: number) {
            if (p_timeLimit > 0) {
                this.timeLimit = p_timeLimit;
            }
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_scenarioID">Scenario ID</param>
        constructor(p_adaptID: string, p_gameID: string, p_scenarioID: string) {
            this.AdaptationID = p_adaptID;
            this.GameID = p_gameID;
            this.ScenarioID = p_scenarioID;
        }

        /// <summary>
        /// Makes a shallow clone of this instance.
        /// </summary>
        /// <returns>New instance of ScenarioNode</returns>
        public ShallowClone(): ScenarioNode {
            let newScenarioNode: ScenarioNode = new ScenarioNode(this.AdaptationID, this.GameID, this.ScenarioID);
            newScenarioNode.Rating = this.Rating;
            newScenarioNode.PlayCount = this.PlayCount;
            newScenarioNode.KFactor = this.KFactor;
            newScenarioNode.Uncertainty = this.Uncertainty;
            newScenarioNode.LastPlayed = this.LastPlayed;
            newScenarioNode.TimeLimit = this.TimeLimit;
            return newScenarioNode;
        }
    }
 }