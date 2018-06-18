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

/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="Misc.ts"/>
/// <reference path="PlayerNode.ts"/>
/// <reference path="ScenarioNode.ts"/>
/// <reference path="Gameplay.ts"/>
/// <reference path="DifficultyAdapterElo.ts"/>
/// <reference path="DifficultyAdapter.ts"/>
///

namespace TwoANS
{
    import BaseAsset = AssetPackage.BaseAsset;
    import Severity = AssetPackage.Severity;

    /*import PlayerNode = TwoANS.PlayerNode;
    import ScenarioNode = TwoANS.ScenarioNode;
    import Gameplay = TwoANS.Gameplay;
    import DifficultyAdapterElo = TwoANS.DifficultyAdapterElo;
    import DifficultyAdapter = TwoANS.DifficultyAdapter;*/

    /// <summary>
    /// Export the TwoA asset
    /// </summary>
    export class TwoA extends BaseAsset
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        /// <summary>
        /// The adapter based on accuracy only (any value within [0, 1]); uses Elo equation for expected score.
        /// </summary>
        private adapterElo: DifficultyAdapterElo;

        /// <summary>
        /// The adapter based on accuracy (0 or 1) and response time measured in milliseconds.
        /// </summary>
        private adapter: DifficultyAdapter;

        /// <summary>
        /// List of available players.
        /// </summary>
        public players: PlayerNode[];

        /// <summary>
        /// List of available players.
        /// </summary>
        public scenarios: ScenarioNode[];

        /// <summary>
        /// Gameplays
        /// </summary>
        public gameplays: Gameplay[];

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        /// <summary>
        /// Initialize the instance of the TwoA asset
        /// <summary>
        constructor() {
            super();
            this.InitSettings();
        }

        /// <summary>
        /// Initialises the settings.
        /// </summary>
        private InitSettings(): void {
            // [SC] list of available players
            this.players = new Array();

            // [SC] list of available scenarios
            this.scenarios = new Array();

            // [SC] list of gameplays
            this.gameplays = new Array();

            // [SC] create the TwoA adapter
            this.adapter = new DifficultyAdapter();
            this.adapter.InitSettings(this);

            // [SC] create the TwoA-Elo adapter
            this.adapterElo = new DifficultyAdapterElo();
            this.adapterElo.InitSettings(this);
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Misc methods

        /// <summary>
        /// Returns a 2D array with descriptions of available adapters.
        /// The first column contains adapter IDs.
        /// The second column contains adapter descriptions.
        /// </summary>
        /// 
        /// <returns>2D array of strings</returns>
        public AvailableAdapters(): string[][] {
            let descr: string[][] = [
                [this.adapter.Type, this.adapter.Description]
                , [this.adapterElo.Type, this.adapterElo.Description]
            ];

            return descr;
        }

        ////// END: Misc methods
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target scenario retrievals

        /// <summary>
        /// Get the Target scenario ID from the adapter.
        /// </summary>
        ///
        /// <param name="p_playerNode"> Player node. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public TargetScenarioID(p_playerNode: PlayerNode): string {
            let scenarioNode: ScenarioNode = this.TargetScenario(p_playerNode);

            if (typeof scenarioNode === 'undefined' || scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenarioID: Unable to recommend a scenario ID. Returning null.");
                return null;
            }

            return scenarioNode.ScenarioID;
        }

        /// <summary>
        /// Get the Target scenario from the adapter.
        /// </summary>
        ///
        /// <param name="p_playerNode"> Player node. </param>
        ///
        /// <returns>
        /// ScenarioNode of the recommended scenario.
        /// </returns>
        public TargetScenario(p_playerNode: PlayerNode): ScenarioNode {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Null player node object. Returning null.");
                return null;
            }

            // [SC] get available scenario nodes
            let scenarioList: ScenarioNode[] = this.AllScenarios(p_playerNode.AdaptationID, p_playerNode.GameID);
            if (typeof scenarioList === 'undefined' || scenarioList === null || scenarioList.length === 0) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unable to retrieve scenario node list. Returning null.");
                return null;
            }

            return this.TargetScenarioCustom(p_playerNode, scenarioList);
        }

        /// <summary>
        /// Get the Target scenario from the adapter.
        /// </summary>
        /// <param name="p_playerNode">       Player node. </param>
        /// <param name="p_scenarioList">     List of scenario nodes from which to recommend. </param>
        /// <returns>
        /// ScenarioNode of the recommended scenario.
        /// </returns>
        public TargetScenarioCustom(p_playerNode: PlayerNode, p_scenarioList: ScenarioNode[]): ScenarioNode {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Null player node object. Returning null.");
                return null;
            }

            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unable to retrieve scenario node list. Returning null.");
                return null;
            }

            if (p_playerNode.AdaptationID === this.adapter.Type) {
                return this.adapter.TargetScenario(p_playerNode, p_scenarioList);
            }
            else if (p_playerNode.AdaptationID === this.adapterElo.Type) {
                return this.adapterElo.TargetScenario(p_playerNode, p_scenarioList);
            }
            else {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unknown adapter " + p_playerNode.AdaptationID + ". Returning null.");
                return null;
            }
        }

        ////// END: Methods for target scenario retrievals
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target difficulty rating retrieval
        
        /// <summary>
        /// Returns target difficulty rating given a player's skill rating.
        /// </summary>
        /// <param name="p_adaptID">          Adaptation ID.</param>
        /// <param name="p_playerRating">     Player's skill rating.</param>
        /// <returns>Difficulty rating</returns>
        public TargetDifficultyRatingCustom(p_adaptID: string, p_playerRating: number): number {
            if (Misc.IsNullOrEmpty(p_adaptID)) {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Null player node object. Returning 0.");
                return 0;
            }

            if (p_adaptID === this.adapter.Type) {
                return this.adapter.TargetDifficultyRating(p_playerRating);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.TargetDifficultyRating(p_playerRating);
            }
            else {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Unknown adapter '" + p_adaptID + "'. Returning 0.");
                return 0;
            }
        }

        /// <summary>
        /// Returns target difficulty rating given a player's skill rating.
        /// </summary>
        /// <param name="p_playerNode">Player's node</param>
        /// <returns>Difficulty rating</returns>
        public TargetDifficultyRating(p_playerNode: PlayerNode): number {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Null player node object. Returning 0.");
                return 0;
            }

            return this.TargetDifficultyRatingCustom(p_playerNode.AdaptationID, p_playerNode.Rating);
        }

        ////// END: Methods for target difficulty rating retrieval
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for updating ratings

        /// <summary>
        /// Updates the ratings based on player's performance in a scenario.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_scenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_rt">                       Player's response time. </param>
        /// <param name="p_correctAnswer">            Player's accuracy. </param>
        /// <param name="p_updateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_customKfct">               If non-0 value is provided then it is used as a weight to scale changes in player's and scenario's ratings. Otherwise, adapter calculates its own K factors. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        public UpdateRatings(p_playerNode: PlayerNode, p_scenarioNode: ScenarioNode, p_rt: number, p_correctAnswer: number
            , p_updateScenarioRating: boolean, p_customKfct: number): boolean {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Player node is null. No update is done.");
                return false;
            }

            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Scenario node is null. No update is done.");
                return false;
            }

            if (p_playerNode.AdaptationID !== p_scenarioNode.AdaptationID) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Inconsistent adaptation IDs in player and scenario nodes. No update is done.");
                return false;
            }

            if (p_playerNode.GameID !== p_scenarioNode.GameID) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Inconsistent game IDs in player and scenario nodes. No update is done.");
                return false;
            }

            if (p_playerNode.AdaptationID === this.adapter.Type) {
                return this.adapter.UpdateRatings(p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct, p_customKfct);
            }
            else if (p_playerNode.AdaptationID === this.adapterElo.Type) {
                return this.adapterElo.UpdateRatings(p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct, p_customKfct);
            }
            else {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Unknown adapter '" + p_playerNode.AdaptationID + "'. No update is done.");
                return false;
            }
        }

        /// <summary>
        /// Creates new record to the game log.
        /// </summary>
        ///
        /// <param name="p_adaptID">          Identifier for the adapt. </param>
        /// <param name="p_gameID">           Identifier for the game. </param>
        /// <param name="p_playerID">         Identifier for the player. </param>
        /// <param name="p_scenarioID">       Identifier for the scenario. </param>
        /// <param name="p_rt">               The right. </param>
        /// <param name="p_accuracy">         The correct answer. </param>
        /// <param name="p_playerRating">     The player new rating. </param>
        /// <param name="p_scenarioRating">   The scenario new rating. </param>
        /// <param name="p_timestamp">        The current date time. </param>
        public CreateNewRecord(p_adaptID: string, p_gameID: string, p_playerID: string, p_scenarioID: string
            , p_rt: number, p_accuracy: number
            , p_playerRating: number, p_scenarioRating: number, p_timestamp: string): void {

            let newGameplay: Gameplay = new Gameplay();
            newGameplay.AdaptationID = p_adaptID;
            newGameplay.GameID = p_gameID;
            newGameplay.PlayerID = p_playerID;
            newGameplay.ScenarioID = p_scenarioID;
            newGameplay.Timestamp = p_timestamp;
            newGameplay.RT = p_rt;
            newGameplay.Accuracy = p_accuracy;
            newGameplay.PlayerRating = p_playerRating;
            newGameplay.ScenarioRating = p_scenarioRating;

            this.gameplays.push(newGameplay);
        }

        ////// END: Methods for updating ratings
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for calculating scores

        /// <summary>
        /// Calculates a normalized score based on player's performance defined by response time and accuracy.
        /// </summary>
        /// 
        /// <param name="p_correctAnswer">    1 if player provided correct answer and 0 otherwise</param>
        /// <param name="p_responseTime">     Players response time in milliseconds</param>
        /// <param name="p_itemMaxDuration">  Max allowed time in millisecond given to player to solve the problem.</param>
        /// 
        /// <returns>A score within range (-1, 1)</returns>
        public CalculateScore(p_correctAnswer:  number, p_responseTime: number, p_itemMaxDuration: number): number {
            /* SCORE MATRIX
             *              ----------------------------------------------
             *              | Low response  | High response | Time limit |
             *              | time          | time          | reached    |
             * -------------|---------------|---------------|------------|
             * Response = 1 | High positive | Low positive  |     0      |
             *              | score         | score         |            |
             * -------------|---------------|---------------|------------|
             * Response = 0 | High negative | Low negative  |     0      |
             *              | score         | score         |            |
             * ----------------------------------------------------------*/

            return this.adapter.calcActualScore(p_correctAnswer, p_responseTime, p_itemMaxDuration);
        }

        /// <summary>
        /// Calculates player's expected score based on player's skill rating and scenarios difficulty rating.
        /// </summary>
        /// <param name="p_adaptID">          Adaptation ID</param>
        /// <param name="p_playerRating">     Player's skill rating</param>
        /// <param name="p_scenarioRating">   Scenario's difficulty rating</param>
        /// <param name="p_itemMaxDuration">  Max allowed time in millisecond given to player to solve the problem.</param>
        /// <returns>Expected score or error code.</returns>
        public CalculateExpectedScore(p_adaptID: string, p_playerRating: number, p_scenarioRating: number, p_itemMaxDuration: number): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.calcExpectedScore(p_playerRating, p_scenarioRating, p_itemMaxDuration);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.calcExpectedScore(p_playerRating, p_scenarioRating);
            }
            else {
                this.Log(Severity.Error, "In TwoA.CalculateExpectedScore: Unknown adapter '" + p_adaptID
                    + "'. No update is done. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        ////// END: Methods for calculating scores
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for setting adapter parameters

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target distribution

        /// <summary>
        /// Returns the mean, sd, lower and upper limits of target distribution as an array.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        /// <returns>An array with four elements.</returns>
        public GetTargetDistribution(p_adaptID: string): number[] {
            if (p_adaptID === this.adapter.Type) {
                return new Array<number>(this.adapter.TargetDistrMean, this.adapter.TargetDistrSD
                    , this.adapter.TargetLowerLimit, this.adapter.TargetUpperLimit);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return new Array<number>(this.adapterElo.TargetDistrMean, this.adapterElo.TargetDistrSD
                    , this.adapterElo.TargetLowerLimit, this.adapterElo.TargetUpperLimit);
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized. Returning null.");
                return null;
            }
        }

        /// <summary>
        /// Sets the target distribution parameters to custom value.
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID.</param>
        /// <param name="p_mean">         Distribution mean.</param>
        /// <param name="p_sd">           Distribution standard deviation.</param>
        /// <param name="p_lowerLimit">   Distribution lower limit.</param>
        /// <param name="p_upperLimit">   Distribution upper limit.</param>
        public SetTargetDistribution(p_adaptID: string, p_mean: number, p_sd: number, p_lowerLimit: number, p_upperLimit: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setTargetDistribution(p_mean, p_sd, p_lowerLimit, p_upperLimit);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setTargetDistribution(p_mean, p_sd, p_lowerLimit, p_upperLimit);
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the target distribution parameters to default values.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID.</param>
        public SetDefaultTargetDistribution(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultTargetDistribution();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultTargetDistribution();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        }

        ////// END: Methods for target distribution
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for fuzzy intervals

        /// <summary>
        /// Gets the fuzzy interval SD multiplier.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID></param>
        /// <returns>Multiplier value, or 0 if the adapter is not found.</returns>
        public GetFiSDMultiplier(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.FiSDMultiplier;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.FiSDMultiplier;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized. Returning error code '"
                    + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Sets the fuzzy interval SD multiplier
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID.</param>
        /// <param name="p_multiplier">   The value of the multiplier.</param>
        public SetFiSDMultiplier(p_adaptID: string, p_multiplier: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.FiSDMultiplier = p_multiplier;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.FiSDMultiplier = p_multiplier;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the fuzzy interval SD multiplier to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        public SetDefaultFiSDMultiplier(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultFiSDMultiplier();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultFiSDMultiplier();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        }

        ////// END: Methods for fuzzy intervals
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for uncertainty parameters

        /// <summary>
        /// Gets the maximum delay for the uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID"> Adapter ID.</param>
        /// <returns>The number of days as double value, or 0 if adapter is not found</returns>
        public GetMaxDelay(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.MaxDelay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MaxDelay;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetMaxDelay' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Sets the maximum delay for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID.</param>
        /// <param name="p_maxDelay"> Maximum delay in days.</param>
        public SetMaxDelay(p_adaptID: string, p_maxDelay: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.MaxDelay = p_maxDelay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MaxDelay = p_maxDelay;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetMaxDelay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the maximum delay for uncertainty calculation to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        public SetDefaultMaxDelay(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultMaxDelay();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMaxDelay();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultMaxDelay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the maximum play count for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>The number of play counts as double value.</returns>
        public GetMaxPlay(p_adaptID: string) : number{
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.MaxPlay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MaxPlay;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetMaxPlay' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the maximum play count for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_maxPlay">  Max play count</param>
        public SetMaxPlay(p_adaptID: string, p_maxPlay: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.MaxPlay = p_maxPlay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MaxPlay = p_maxPlay;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetMaxPlay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the maximum play count to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        public SetDefaultMaxPlay(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultMaxPlay();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMaxPlay();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultMaxPlay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        ////// END: Methods for uncertainty parameters
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for K factor

        /// <summary>
        /// Get the K constant
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K constant as double value</returns>
        public GetKConst(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KConst;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KConst;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetKConst' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the K constant value
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kConst">   The value of the K constant</param>
        public SetKConst(p_adaptID: string, p_kConst: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KConst = p_kConst;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KConst = p_kConst;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetKConst' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the K constant to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        public SetDefaultKConst(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKConst();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKConst();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultKConst' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the value of the upward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Upward uncertainty weight as double value</returns>
        public GetKUp(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KUp;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KUp;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetKUp' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the value for the upward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kUp">      Weight value</param>
        public SetKUp(p_adaptID: string, p_kUp: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KUp = p_kUp;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KUp = p_kUp;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetKUp' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the upward uncertainty weight to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        public SetDefaultKUp(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKUp();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKUp();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultKUp' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the value of the downward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Weight value as double number</returns>
        public GetKDown(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KDown;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KDown;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetKDown' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the value of the downward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kDown">    Weight value</param>
        public SetKDown(p_adaptID: string, p_kDown: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KDown = p_kDown;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KDown = p_kDown;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetKDown' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the downward uncertainty weight to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        public SetDefaultKDown(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKDown();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKDown();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultKDown' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        ////// END: Methods for K factor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for the calibration params

        /// <summary>
        /// Get the player calibration length
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Calibration length as int</returns>
        public GetPlayerCalLength(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.PlayerCalLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.PlayerCalLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.GetPlayerCalLength' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the player calibration length
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        /// <param name="p_calLength">    The value of the calibration length</param>
        public SetPlayerCalLength(p_adaptID: string, p_calLength: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.PlayerCalLength = p_calLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.PlayerCalLength = p_calLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetPlayerCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the default calibration length for a player
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        public SetDefaultPlayerCalLength(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultPlayerCalLength();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultPlayerCalLength();
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetDefaultPlayerCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the scenario calibration length
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Calibration length as int</returns>
        public GetScenarioCalLength(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.ScenarioCalLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ScenarioCalLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.GetScenarioCalLength' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the scenario calibration length
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        /// <param name="p_calLength">    The value of the calibration length</param>
        public SetScenarioCalLength(p_adaptID: string, p_calLength: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.ScenarioCalLength = p_calLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ScenarioCalLength = p_calLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetScenarioCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the default calibration length for a scenario
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        public SetDefaultScenarioCalLength(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultScenarioCalLength();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultScenarioCalLength();
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetDefaultScenarioCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the scenario and player calibration lengths to the same value
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        /// <param name="p_calLength">    The value of the calibration length</param>
        public SetCalLength(p_adaptID: string, p_calLength: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.CalLength = p_calLength;
            } else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.CalLength = p_calLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets scenario and player calibration lengths to its default values.
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        public SetDefaultCalLength(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultCalLength();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultCalLength();
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetDefaultCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the player calibration K factor
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K factor as double</returns>
        public GetPlayerCalK(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.PlayerCalK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.PlayerCalK;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.GetPlayerCalK' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the player calibration K factor
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_calK">     The value of the calibration K factor</param>
        public SetPlayerCalK(p_adaptID: string, p_calK: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.PlayerCalK = p_calK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.PlayerCalK = p_calK;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetPlayerCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the default calibration K factor for a player
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        public SetDefaultPlayerCalK(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultPlayerCalK();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultPlayerCalK();
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetDefaultPlayerCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the scenario calibration K factor
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K factor as double</returns>
        public GetScenarioCalK(p_adaptID: string): number {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.ScenarioCalK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ScenarioCalK;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.GetScenarioCalK' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the scenario calibration K factor
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_calK">     The value of the calibration K factor</param>
        public SetScenarioCalK(p_adaptID: string, p_calK: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.ScenarioCalK = p_calK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ScenarioCalK = p_calK;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetScenarioCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the default calibration K factor for a scenario
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        public SetDefaultScenarioCalK(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultScenarioCalK();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultScenarioCalK();
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetDefaultScenarioCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the player and scenario calibration K factors
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_calK">     The value of the calibration K factor</param>
        public SetCalK(p_adaptID: string, p_calK: number): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.CalK = p_calK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.CalK = p_calK;
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Set the default calibration K factor for player and scenario
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        public SetDefaultCalK(p_adaptID: string): void {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultCalK();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultCalK();
            }
            else {
                this.Log(AssetPackage.Severity.Error
                    , "In 'TwoA.SetDefaultCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        ////// END: Methods for the calibration params
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for Elo-based expected score params

        /// <summary>
        /// Get the value of the expected score magnifier
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Magnifier as double value</returns>
        public GetExpectScoreMagnifier(p_adaptID: string): number {
            if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ExpectScoreMagnifier;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetExpectScoreMagnifier' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the value of the expected score magnifier.
        /// </summary>
        /// <param name="p_adaptID">              Adapter ID</param>
        /// <param name="p_expectScoreMagnifier"> The value for the magnifier</param>
        public SetExpectScoreMagnifier(p_adaptID: string, p_expectScoreMagnifier: number): void {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ExpectScoreMagnifier = p_expectScoreMagnifier;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetExpectScoreMagnifier' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the expected score magnifier to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        public SetDefaultExpectScoreMagnifier(p_adaptID: string): void {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultExpectScoreMagnifier();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultExpectScoreMagnifier' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Get the value of the magnifier step size.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Magnifier step size as double value</returns>
        public GetMagnifierStepSize(p_adaptID: string): number {
            if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MagnifierStepSize;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.GetMagnifierStepSize' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        }

        /// <summary>
        /// Set the value of teh magnifier step size.
        /// </summary>
        /// <param name="p_adaptID">              Adapter ID</param>
        /// <param name="p_magnifierStepSize">    The value of the magnifier step size</param>
        public SetMagnifierStepSize(p_adaptID: string, p_magnifierStepSize: number): void {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MagnifierStepSize = p_magnifierStepSize;
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetMagnifierStepSize' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        /// <summary>
        /// Sets the magnifier step size to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        public SetDefaultMagnifierStepSize(p_adaptID: string): void {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMagnifierStepSize();
            }
            else {
                this.Log(Severity.Error
                    , "In 'TwoA.SetDefaultMagnifierStepSize' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        }

        ////// END: Methods for Elo-based expected score params
        //////////////////////////////////////////////////////////////////////////////////////

        ////// END: methods for setting adapter parameters
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for player data

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Player param getters

        // [2016.11.14]
        /// <summary>
        /// Get a value of Rating for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// Rating as double value.
        /// </returns>
        public GetPlayerRating(p_adaptID: string, p_gameID: string, p_playerID: string): number {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to get Rating for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.Rating;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of PlayCount for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// PlayCount as double value.
        /// </returns>
        public GetPlayerPlayCount(p_adaptID: string, p_gameID: string, p_playerID: string): number {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to get PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.PlayCount;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of KFactor for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// KFactor as double value.
        /// </returns>
        public GetPlayerKFactor(p_adaptID: string, p_gameID: string, p_playerID: string): number {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to get KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.KFactor;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of Uncertainty for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// Uncertainty as double value.
        /// </returns>
        public GetPlayerUncertainty(p_adaptID: string, p_gameID: string, p_playerID: string): number {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to get Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.Uncertainty;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of LastPlayed for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// LastPlayed as string DateTime object.
        /// </returns>
        public GetPlayerLastPlayed(p_adaptID: string, p_gameID: string, p_playerID: string): string {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to get LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.LastPlayed;
            }
        }

        ////// END: Player param getters
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Player param setters

        /// <summary>
        /// Set a Rating value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_rating">       The value of Rating. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetPlayerRating(p_adaptID: string, p_gameID: string, p_playerID: string, p_rating: number): boolean {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to set Rating for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }

            player.Rating = p_rating;
            return true;
        }

        /// <summary>
        /// Set a PlayCount value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_playCount">    The value of PlayCount. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetPlayerPlayCount(p_adaptID: string, p_gameID: string, p_playerID: string, p_playCount: number): boolean {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to set PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }

            if (!this.IsValidPlayCount(p_playCount)) {
                this.Log(Severity.Error, "Unable to set PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid play count.");
                return false;
            }

            player.PlayCount = p_playCount;
            return true;
        }

        /// <summary>
        /// Set a KFactor value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_kFactor">      The value of KFactor. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetPlayerKFactor(p_adaptID: string, p_gameID: string, p_playerID: string, p_kFactor: number): boolean {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to set KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }

            if (!this.IsValidKFactor(p_kFactor)) {
                this.Log(Severity.Error, "Unable to set KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid K factor.");
                return false;
            }

            player.KFactor = p_kFactor;
            return true;
        }

        /// <summary>
        /// Set an Uncertainty value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_uncertainty">  The value of Uncertainty. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetPlayerUncertainty(p_adaptID: string, p_gameID: string, p_playerID: string, p_uncertainty: number): boolean {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error
                    , "Unable to set Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }

            if (!this.IsValidUncertainty(p_uncertainty)) {
                this.Log(Severity.Error, "Unable to set Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid uncertainty.");
                return false;
            }

            player.Uncertainty = p_uncertainty;
            return true;
        }

        /// <summary>
        /// Set a LastPlayed datetime for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_lastPlayed">   The DateTime object for LastPlayed datetime. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetPlayerLastPlayed(p_adaptID: string, p_gameID: string, p_playerID: string, p_lastPlayed: string): boolean {
            let player: PlayerNode = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to set LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.Log(Severity.Error, "Unable to set LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Null date object.");
                return false;
            }

            player.LastPlayed = p_lastPlayed;
            return true;
        }

        ////// END: Player param setters
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode adders

        /// <summary>
        /// Add a new player node.
        /// </summary>
        /// <param name="p_playerNode">New player node.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        public AddPlayerNode(p_playerNode: PlayerNode): boolean {
            if (Misc.IsNullOrEmpty(p_playerNode.AdaptationID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Adaptation ID is null or empty string.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_playerNode.GameID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Game ID is null or empty string.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_playerNode.PlayerID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Player ID is null or empty string.");
                return false;
            }

            if (this.Player(p_playerNode.AdaptationID, p_playerNode.GameID, p_playerNode.PlayerID, false) !== null) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Player '" + p_playerNode.PlayerID
                    + "' in game '" + p_playerNode.GameID + "' with adaptation '" + p_playerNode.AdaptationID + "' already exists.");
                return false;
            }

            if (!this.IsValidPlayCount(p_playerNode.PlayCount)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid play count.");
                return false;
            }

            if (!this.IsValidKFactor(p_playerNode.KFactor)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid K factor.");
                return false;
            }

            if (!this.IsValidUncertainty(p_playerNode.Uncertainty)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid uncertainty.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_playerNode.LastPlayed)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Null or empty string for last played date.");
                return false;
            }

            this.players.push(p_playerNode);

            return true;
        }

        /// <summary>
        /// Add a new player node with custom parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_playerID">Player ID.</param>
        /// <param name="p_rating">Player's skill rating.</param>
        /// <param name="p_playCount">The number of past games played by the player.</param>
        /// <param name="p_kFactor">Player's K factor.</param>
        /// <param name="p_uncertainty">Player's uncertainty.</param>
        /// <param name="p_lastPlayed">The datetime the player played the last game. Should have 'yyyy-MM-ddThh:mm:ss' format.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        public AddPlayer(p_adaptID: string, p_gameID: string, p_playerID: string
            , p_rating: number, p_playCount: number, p_kFactor: number, p_uncertainty: number, p_lastPlayed: string): PlayerNode {

            let newPlayerNode: PlayerNode = new PlayerNode(p_adaptID, p_gameID, p_playerID);
            newPlayerNode.Rating = p_rating;
            newPlayerNode.PlayCount = p_playCount;
            newPlayerNode.KFactor = p_kFactor;
            newPlayerNode.Uncertainty = p_uncertainty;
            newPlayerNode.LastPlayed = p_lastPlayed;

            if (this.AddPlayerNode(newPlayerNode)) {
                return newPlayerNode;
            } else {
                return null;
            }
        }

        /// <summary>
        /// Add a new player node with default parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_playerID">Player ID.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        public AddPlayerDefault(p_adaptID: string, p_gameID: string, p_playerID: string): PlayerNode {
            return this.AddPlayer(p_adaptID, p_gameID, p_playerID
                , Misc.INITIAL_RATING, 0, Misc.INITIAL_K_FCT, Misc.INITIAL_UNCERTAINTY
                , Misc.DEFAULT_DATETIME);
        }

        ////// END: PlayerNode adders
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode getter

        /// <summary>
        /// Get a PlayerNode with a given player ID.
        /// </summary>
        ///
        /// <param name="p_adaptID">  Identifier for the adapt. </param>
        /// <param name="p_gameID">   Identifier for the game. </param>
        /// <param name="p_playerID"> Identifier for the player. </param>
        ///
        /// <returns>
        /// PlayerNode object, or null if no ID match is found.
        /// </returns>
        public Player(p_adaptID: string, p_gameID: string, p_playerID: string, p_showWarning: boolean = true): PlayerNode {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID) || Misc.IsNullOrEmpty(p_playerID)) {
                if (p_showWarning) {
                    this.Log(Severity.Error
                        , "In TwoA.Player method: one or more parameters are null. Expected string values. Returning null.");
                }
                return null;
            }

            for (let player of this.players) {
                if (player.AdaptationID === p_adaptID && player.GameID === p_gameID && player.PlayerID === p_playerID) {
                    return player;
                }
            }

            if (p_showWarning) {
                this.Log(Severity.Error, "In TwoA.Player method: Player not found. Returning null.");
            }

            return null;
        }

        /// <summary>
        /// Gets a list of all player nodes.
        /// </summary>
        ///
        /// <param name="p_adaptID"> Identifier for the adapt. </param>
        /// <param name="p_gameID">  Identifier for the game. </param>
        ///
        /// <returns>
        /// List of PlayerNode instances.
        /// </returns>
        public AllPlayers(p_adaptID: string, p_gameID: string): PlayerNode[] {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID)) {
                this.Log(Severity.Error
                    , "In TwoA.AllPlayers method: one or more parameters are null. Expected string values. Returning null.");
                return null;
            }

            let matchingPlayers: PlayerNode[] = new Array<PlayerNode>();

            for (let player of this.players) {
                if (player.AdaptationID === p_adaptID && player.GameID === p_gameID) {
                    matchingPlayers.push(player);
                }
            }

            if (matchingPlayers.length === 0) {
                this.Log(Severity.Error, "In TwoA.AllPlayers method: Unable to retrieve players for game '"
                    + p_gameID + "' with adaptation '" + p_adaptID + "'. No matching scenarios.");
                return null;
            }

            return matchingPlayers.sort(
                function (playerOne: PlayerNode, playerTwo: PlayerNode): number {
                    if (playerOne.Rating < playerTwo.Rating) {
                        return -1;
                    } else if (playerOne.Rating > playerTwo.Rating) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );
        }

        ////// END: PlayerNode getter
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode removers

        /// [TODO] rather inefficient
        /// <summary>
        /// Removes a specified player.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_playerID">Player ID</param>
        /// <returns>True if the player was removed, and false otherwise.</returns>
        public RemovePlayer(p_adaptID: string, p_gameID: string, p_playerID: string): boolean {
            return this.RemovePlayerNode(this.Player(p_adaptID, p_gameID, p_playerID, true));
        }

        /// <summary>
        /// Removes a specified player.
        /// </summary>
        /// <param name="playerNode">PlayerNode instance to remove.</param>
        /// <returns>True if player was removed, and false otherwise.</returns>
        public RemovePlayerNode(p_playerNode: PlayerNode): boolean {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.RemovePlayer: Cannot remove player. The playerNode parameter is null.");
                return false;
            }

            let index: number = this.players.indexOf(p_playerNode, 0);
            if (index < 0) {
                this.Log(Severity.Error, "In TwoA.RemovePlayer: Cannot remove player. The playerNode was not found.");
                return false;
            }

            this.players.splice(index, 1);
            return true;
        }

        ////// END: PlayerNode removers
        //////////////////////////////////////////////////////////////////////////////////////

        ////// END: methods for player data
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for scenario data

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Scenario param getters

        // [2016.11.14]
        /// <summary>
        /// Get a value of Rating for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// Rating as double value.
        /// </returns>
        public GetScenarioRating(p_adaptID: string, p_gameID: string, p_scenarioID: string): number {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get Rating for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.Rating;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of PlayCount for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// PlayCount as double value.
        /// </returns>
        public GetScenarioPlayCount(p_adaptID: string, p_gameID: string, p_scenarioID: string): number {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.PlayCount;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of KFactor for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// KFactor as double value.
        /// </returns>
        public GetScenarioKFactor(p_adaptID: string, p_gameID: string, p_scenarioID: string): number {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.KFactor;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of Uncertainty for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// Uncertainty as double value.
        /// </returns>
        public GetScenarioUncertainty(p_adaptID: string, p_gameID: string, p_scenarioID: string): number {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.Uncertainty;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of LastPlayed for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// LastPlayed as DateTime object.
        /// </returns>
        public GetScenarioLastPlayed(p_adaptID: string, p_gameID: string, p_scenarioID: string): string {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.LastPlayed;
            }
        }

        // [2016.11.14]
        /// <summary>
        /// Get a value of TimeLimit for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// TimeLimit as double value.
        /// </returns>
        public GetScenarioTimeLimit(p_adaptID: string, p_gameID: string, p_scenarioID: string): number {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.TimeLimit;
            }
        }

        ////// END: Scenario param getters
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Scenario param setters

        /// <summary>
        /// Set a Rating value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_rating">       The value of Rating. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetScenarioRating(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_rating: number): boolean {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set Rating for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }

            scenario.Rating = p_rating;
            return true;
        }

        /// <summary>
        /// Set a PlayCount value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_playCount">    The value of PlayCount. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetScenarioPlayCount(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_playCount: number): boolean {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }

            if (!this.IsValidPlayCount(p_playCount)) {
                this.Log(Severity.Error, "Unable to set PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid play count.");
                return false;
            }

            scenario.PlayCount = p_playCount;
            return true;
        }

        /// <summary>
        /// Set a KFactor value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_kFactor">      The value of KFactor. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetScenarioKFactor(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_kFactor: number): boolean {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }

            if (!this.IsValidKFactor(p_kFactor)) {
                this.Log(Severity.Error, "Unable to set KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid K factor.");
                return false;
            }

            scenario.KFactor = p_kFactor;
            return true;
        }

        /// <summary>
        /// Set an Uncertainty value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_uncertainty">  The value of Uncertainty. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetScenarioUncertainty(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_uncertainty: number): boolean {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }

            if (!this.IsValidUncertainty(p_uncertainty)) {
                this.Log(Severity.Error, "Unable to set Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid uncertainty.");
                return false;
            }

            scenario.Uncertainty = p_uncertainty;
            return true;
        }

        /// <summary>
        /// Set a LastPlayed datetime for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_lastPlayed">   String value of the date and time of the last play. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetScenarioLastPlayed(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_lastPlayed: string): boolean {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.Log(Severity.Error, "Unable to set LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Null or empty date and time string.");
                return false;
            }

            scenario.LastPlayed = p_lastPlayed;
            return true;
        }

        /// <summary>
        /// Set a TimeLimit for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_timeLimit">    The value of TimeLimit. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        public SetScenarioTimeLimit(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_timeLimit: number): boolean {
            let scenario: ScenarioNode = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }

            if (!this.IsValidTimeLimit(p_timeLimit)) {
                this.Log(Severity.Error, "Unable to set TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid time limit.");
                return false;
            }

            scenario.TimeLimit = p_timeLimit;
            return true;
        }

        ////// END: Scenario param setters
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode adders

        /// <summary>
        /// Add a new scenario node.
        /// </summary>
        /// <param name="p_scenarioNode">New scenario node.</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        public AddScenarioNode(p_scenarioNode: ScenarioNode): boolean {
            if (Misc.IsNullOrEmpty(p_scenarioNode.AdaptationID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Adaptation ID is null or empty string.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_scenarioNode.GameID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Game ID is null or empty string.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_scenarioNode.ScenarioID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Scenario ID is null or empty string.");
                return false;
            }

            if (this.Scenario(p_scenarioNode.AdaptationID, p_scenarioNode.GameID, p_scenarioNode.ScenarioID, false) !== null) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Scenario '" + p_scenarioNode.ScenarioID
                    + "' in game '" + p_scenarioNode.GameID + "' with adaptation '" + p_scenarioNode.AdaptationID + "' already exists.");
                return false;
            }

            if (!this.IsValidPlayCount(p_scenarioNode.PlayCount)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid play count.");
                return false;
            }

            if (!this.IsValidKFactor(p_scenarioNode.KFactor)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid K factor.");
                return false;
            }

            if (!this.IsValidUncertainty(p_scenarioNode.Uncertainty)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid uncertainty.");
                return false;
            }

            if (Misc.IsNullOrEmpty(p_scenarioNode.LastPlayed)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Null or empty string for last played date.");
                return false;
            }

            if (!this.IsValidTimeLimit(p_scenarioNode.TimeLimit)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid time limit.");
                return false;
            }

            this.scenarios.push(p_scenarioNode);

            return true;
        }

        /// <summary>
        /// Add a new scenario node with custom parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_scenarioID">Scenario ID.</param>
        /// <param name="p_rating">Scenario's difficulty rating.</param>
        /// <param name="p_playCount">The number of time the scenario was played to calculate the difficulty rating.</param>
        /// <param name="p_kFactor">Scenario's K factor.</param>
        /// <param name="p_uncertainty">Scenario's uncertainty.</param>
        /// <param name="p_lastPlayed">The datetime the scenario was last played. Should have 'yyyy-MM-ddThh:mm:ss' format.</param>
        /// <param name="p_timeLimit">Time limit to complete the scenario (in milliseconds).</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        public AddScenario(p_adaptID: string, p_gameID: string, p_scenarioID: string
            , p_rating: number, p_playCount: number, p_kFactor: number
            , p_uncertainty: number, p_lastPlayed: string, p_timeLimit: number): ScenarioNode {

            let newScenarioNode: ScenarioNode = new ScenarioNode(p_adaptID, p_gameID, p_scenarioID);
            newScenarioNode.Rating = p_rating;
            newScenarioNode.PlayCount = p_playCount;
            newScenarioNode.KFactor = p_kFactor;
            newScenarioNode.Uncertainty = p_uncertainty;
            newScenarioNode.LastPlayed = p_lastPlayed;
            newScenarioNode.TimeLimit = p_timeLimit;

            if (this.AddScenarioNode(newScenarioNode)) {
                return newScenarioNode;
            } else {
                return null;
            }
        }

        /// <summary>
        /// Add a new scenario node with default parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_scenarioID">Scenario ID.</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        public AddScenarioDefault(p_adaptID: string, p_gameID: string, p_scenarioID: string): ScenarioNode {
            return this.AddScenario(p_adaptID, p_gameID, p_scenarioID
                , Misc.INITIAL_RATING, 0, Misc.INITIAL_K_FCT, Misc.INITIAL_UNCERTAINTY
                , Misc.DEFAULT_DATETIME, Misc.DEFAULT_TIME_LIMIT);
        }

        ////// END: ScenarioNode adders
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode getter

        /// <summary>
        /// Get a ScenarioNode with a given scenario ID.
        /// </summary>
        ///
        /// <param name="p_adaptID">    Identifier for the adapt. </param>
        /// <param name="p_gameID">     Identifier for the game. </param>
        /// <param name="p_scenarioID"> Identifier for the scenario. </param>
        ///
        /// <returns>
        /// ScenarioNode object, or null if no ID match is found.
        /// </returns>
        public Scenario(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_showWarning: boolean = true): ScenarioNode {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID) || Misc.IsNullOrEmpty(p_scenarioID)) {
                if (p_showWarning) {
                    this.Log(Severity.Error, "In TwoA.Scenario method: one or more parameters are null. Expected string values. Returning null.");
                }
                return null;
            }

            for (let scenario of this.scenarios) {
                if (scenario.AdaptationID === p_adaptID && scenario.GameID === p_gameID && scenario.ScenarioID === p_scenarioID) {
                    return scenario;
                }
            }

            if (p_showWarning) {
                this.Log(Severity.Error, "In TwoA.Scenario method: Scenario not found. Returning null.");
            }

            return null;
        }

        /// <summary>
        /// Gets a list of all scenario nodes.
        /// </summary>
        ///
        /// <param name="p_adaptID">    Identifier for the adapt. </param>
        /// <param name="p_gameID">     Identifier for the game. </param>
        ///
        /// <returns>
        /// all scenarios.
        /// </returns>
        public AllScenarios(p_adaptID: string, p_gameID: string): ScenarioNode[] {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID)) {
                this.Log(Severity.Error, "In AllScenarios method: one or more parameters are null. Expected string values. Returning null.");
                return null;
            }

            let matchingScenarios: ScenarioNode[] = new Array<ScenarioNode>();

            for (let scenario of this.scenarios) {
                if (scenario.AdaptationID === p_adaptID && scenario.GameID === p_gameID) {
                    matchingScenarios.push(scenario);
                }
            }

            if (matchingScenarios.length === 0) {
                this.Log(Severity.Error, "In TwoA.AllScenarios method: Unable to retrieve scenarios for game '"
                    + p_gameID + "' with adaptation '" + p_adaptID + "'. No matching scenarios.");
                return null;
            }

            return matchingScenarios.sort(
                function (scenarioOne: ScenarioNode, scenarioTwo: ScenarioNode): number {
                    if (scenarioOne.Rating < scenarioTwo.Rating) {
                        return -1;
                    } else if (scenarioOne.Rating > scenarioTwo.Rating) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            );
        }

        ////// END: ScenarioNode getter
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode removers

        /// <summary>
        /// Removes a specified scenario.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_scenarioID">Scenario ID</param>
        /// <returns>True if scenario was removed, and false otherwise.</returns>
        public RemoveScenario(p_adaptID: string, p_gameID: string, p_scenarioID: string): boolean {
            return this.RemoveScenarioNode(this.Scenario(p_adaptID, p_gameID, p_scenarioID, true));
        }

        /// <summary>
        /// Removes a specified scenario.
        /// </summary>
        /// <param name="p_scenarioNode">ScenarioNode instance to remove.</param>
        /// <returns>True if scenario was removed, and false otherwise.</returns>
        public RemoveScenarioNode(p_scenarioNode: ScenarioNode): boolean {
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.RemoveScenario: Cannot remove scenario. The scenarioNode parameter is null.");
                return false;
            }

            let index: number = this.scenarios.indexOf(p_scenarioNode, 0);
            if (index < 0) {
                this.Log(Severity.Error, "In TwoA.RemoveScenario: Cannot remove scenario. The scenarioNode was not found.");
                return false;
            }

            this.scenarios.splice(index, 1);
            return true;
        }

        ////// END: ScenarioNode removers
        //////////////////////////////////////////////////////////////////////////////////////

        ////// END: methods for scenario data
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for value validity checks

        /// <summary>
        /// Returns true if play count value is valid.
        /// </summary>
        /// <param name="p_playCount">Play count value</param>
        /// <returns>bool</returns>
        public IsValidPlayCount(p_playCount: number): boolean {
            if (p_playCount < 0) {
                this.Log(Severity.Information, "Play count should be equal to or higher than 0.");
                return false;
            }

            return true;
        }

        /// <summary>
        /// Returns true if K factor value is valid.
        /// </summary>
        /// <param name="p_kFactor">K factor value</param>
        /// <returns>bool</returns>
        public IsValidKFactor(p_kFactor: number): boolean {
            if (p_kFactor <= 0) {
                this.Log(Severity.Information, "K factor should be equal to or higher than '" + Misc.MIN_K_FCT + "'.");
                return false;
            }

            return true;
        }

        /// <summary>
        /// Returns true if uncertainty value is valid.
        /// </summary>
        /// <param name="p_uncertainty">Uncertainty value</param>
        /// <returns>bool</returns>
        public IsValidUncertainty(p_uncertainty: number): boolean {
            if (p_uncertainty < 0 || p_uncertainty > 1) {
                this.Log(Severity.Information, "The uncertainty should be within [0, 1].");
                return false;
            }

            return true;
        }

        /// <summary>
        /// Returns true if time limit value is valid.
        /// </summary>
        /// <param name="p_timeLimit">Time limit value</param>
        /// <returns>bool</returns>
        public IsValidTimeLimit(p_timeLimit: number): boolean {
            if (p_timeLimit <= 0) {
                this.Log(Severity.Error, "Time limit should be higher than 0.");
                return false;
            }

            return true;
        }

        ////// END: methods for value validity checks
        //////////////////////////////////////////////////////////////////////////////////////
    }
}