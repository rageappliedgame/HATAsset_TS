/// Copyright 2016
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

/// <reference path="../RageAssetManager/ILog.ts"/>
/// 
/// <reference path="TwoA.ts"/>
/// <reference path="Misc.ts"/>
///

module TwoAPackage
{
    import Severity = AssetPackage.Severity;

    export class DifficultyAdapter
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const fields
        private static ADAPTER_TYPE: string = "Game difficulty - Player skill";
        private static DEF_DATE: string = "2015-01-01T01:01:01";

        private static DEF_K: number = 0.0075; // [SC] The default value for the K constant when there is no uncertainty
        private static DEF_K_UP: number = 4.0; // [SC] the default value for the upward uncertainty weight
        private static DEF_K_DOWN: number = 0.5; // [SC] The default value for the downward uncertainty weight

        private static DEF_MAX_DELAY: number = 30; // [SC] The default value for the max number of days after which player's or item's undertainty reaches the maximum
        private static DEF_MAX_PLAY: number = 40; // [SC] The default value for the max number of administrations that should result in minimum uncertaint in item's or player's ratings

        private static DEF_THETA: number = 0.01; // [SC][2016.01.07]

        private static DEF_U: number = 1.0; // [SC] The default value for the provisional uncertainty to be assigned to an item or player

        private static TARGET_DISTR_MEAN: number = 0.75;
        private static TARGET_DISTR_SD: number = 0.1;
        private static TARGET_LOWER_LIMIT: number = 0.5;
        private static TARGET_UPPER_LIMIT: number = 1;

        private static TIMESTAMP_FORMAT: string = "s"; // Sortable DateTime as used in XML serializing : 's' -> 'yyyy-mm-ddThh:mm:ss'
        ////// END: const fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields
        private asset: TwoA; // [ASSET]

        private maxDelay: number;        // [SC] set to DEF_MAX_DELAY in the constructor
        private maxPlay: number;         // [SC] set to DEF_MAX_PLAY in the constructor

        private kConst: number;          // [SC] set to DEF_K in the constructor
        private kUp: number;             // [SC] set to DEF_K_UP in the constructor
        private kDown: number;           // [SC] set to DEF_K_DOWN in the constructor

        private provU: number;           // [SC] set to DEF_U in the constructor

        private provDate: string;        // [SC] set to DEF_DATE in the constructor
        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        /// <summary>
        /// Initializes a new instance of the HAT.DifficultyAdapter class.
        /// </summary>
        constructor() { }

        /// <summary>
        /// Assign default values if max play frequency and max non-play delay values
        /// are not provided.
        /// 
        /// Add a reference to the HATAsset so we can use it.
        /// </summary>
        ///
        /// <remarks>
        /// Alternative for the asset parameter would be to ask the AssetManager for
        /// a reference.
        /// </remarks>
        ///
        /// <param name="asset"> The asset. </param>
        public initSettings(p_asset: TwoA): void {
            this.maxPlay = DifficultyAdapter.DEF_MAX_PLAY;
            this.maxDelay = DifficultyAdapter.DEF_MAX_DELAY;

            this.kConst = DifficultyAdapter.DEF_K;
            this.kUp = DifficultyAdapter.DEF_K_UP;
            this.kDown = DifficultyAdapter.DEF_K_DOWN;

            this.provU = DifficultyAdapter.DEF_U;

            this.provDate = DifficultyAdapter.DEF_DATE;

            this.asset = p_asset; // [ASSET]
        }

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties for calculating rating uncertainties

        /// <summary>
        /// Gets the maximum delay.
        /// </summary>
        get MaxDelay(): number {
            return this.maxDelay;
        }

        /// <summary>
        /// Sets the maximum delay.
        /// </summary>
        ///
        /// <value>
        /// The maximum delay.
        /// </value>
        set MaxDelay(p_maxDelay: number) {
            if (p_maxDelay <= 0) {
                this.asset.Log(Severity.Error, "The maximum number of delay days should be higher than 0.");
            } else {
                this.maxDelay = p_maxDelay;
            }
        }

        /// <summary>
        /// Gets the maximum play.
        /// </summary>
        get MaxPlay(): number {
            return this.maxPlay;
        }

        /// <summary>
        /// Sets the maximum play.
        /// </summary>
        ///
        /// <value>
        /// The maximum play.
        /// </value>
        set MaxPlay(p_maxPlay: number) {
            if (p_maxPlay <= 0) {
                this.asset.Log(Severity.Error, "The maximum administration parameter should be higher than 0.");
            } else {
                this.maxPlay = p_maxPlay;
            }
        }

        /// <summary>
        /// Gets the provisional uncertainty.
        /// </summary>
        get ProvU(): number {
            return this.provU;
        }

        /// <summary>
        /// Sets the provisional uncertainty.
        /// </summary>
        ///
        /// <value>
        /// The provisional uncertainty.
        /// </value>
        set ProvU(p_provU: number) {
            if (0 > p_provU || p_provU > 1) {
                this.asset.Log(Severity.Error, "Provisional uncertainty value should be between 0 and 1."); // [SC][2016.01.07] "0 < value" => "0 > value"
            } else {
                this.provU = p_provU;
            }
        }

        /// <summary>
        /// Gets the provisional play date.
        /// </summary>
        get ProvDate(): string {
            return this.provDate;
        }

        ////// END: properties for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties for calculating k factors

        /// <summary>
        /// Getter for the K constant.
        /// </summary>
        get KConst(): number {
            return this.kConst;
        }

        /// <summary>
        /// Setter for the K constant.
        /// </summary>
        ///
        /// <value>
        /// The k constant.
        /// </value>
        set KConst(p_kConst: number) {
            if (p_kConst < 0) {
                this.asset.Log(Severity.Error, "K constant cannot be a negative number.");
            } else {
                this.kConst = p_kConst;
            }
        }

        /// <summary>
        /// Getter for the upward uncertainty weight.
        /// </summary>
        get KUp(): number {
            return this.kUp;
        }

        /// <summary>
        /// Setter for the upward uncertainty weight.
        /// </summary>
        ///
        /// <value>
        /// The upward uncertainty weight.
        /// </value>
        set KUp(p_kUp: number) {
            if (p_kUp < 0) {
                this.asset.Log(Severity.Error, "The upward uncertainty weight cannot be a negative number.");
            } else {
                this.kUp = p_kUp;
            }
        }

        /// <summary>
        /// Getter for the downward uncertainty weight.
        /// </summary>
        get KDown(): number {
            return this.kDown;
        }

        /// <summary>
        /// Setter for the downward uncertainty weight.
        /// </summary>
        ///
        /// <value>
        /// The downward uncertainty weight.
        /// </value>
        set KDown(p_kDown: number) {
            if (p_kDown < 0) {
                this.asset.Log(Severity.Error, "The downwad uncertainty weight cannot be a negative number.");
            } else {
                this.kDown = p_kDown;
            }
        }

        ////// END: properties for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: getters for static properties

        /// <summary>
        /// Gets the prov theta.
        /// </summary>
        private get ProvTheta(): number {
            return DifficultyAdapter.DEF_THETA;
        }

        /// <summary>
        /// Gets target distribution mean.
        /// </summary>
        private get TargetDistributionMean(): number { // [SC][2016.01.07] TargetDistributedMean => TargetDistributionMean
            return DifficultyAdapter.TARGET_DISTR_MEAN;
        }

        /// <summary>
        /// Gets the type of the adapter
        /// </summary>
        get Type(): string {
            return DifficultyAdapter.ADAPTER_TYPE;
        }

        ////// END: getters for static properties
        //////////////////////////////////////////////////////////////////////////////////////

        /// <summary>
        /// Updates the ratings.
        /// </summary>
        ///
        /// <param name="gameID">               Identifier for the game. </param>
        /// <param name="playerID">             Identifier for the player. </param>
        /// <param name="scenarioID">           Identifier for the scenario. </param>
        /// <param name="rt">                   The right. </param>
        /// <param name="correctAnswer">        The correct answer. </param>
        /// /// <param name="updateDatafiles">  Set to true to update adaptation and gameplay logs files. </param>
        public UpdateRatings(p_gameID: string, p_playerID: string, p_scenarioID: string
                            , p_rt: number, p_correctAnswer: number, p_updateDatafiles: boolean): void {

            // [SC] getting player data
            let playerRating: number;
            let playerPlayCount: number;
            let playerUncertainty: number;
            let playerLastPlayed: string;

            try {
                playerRating = +this.asset.getPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "Rating");
                playerPlayCount = +this.asset.getPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "PlayCount");
                playerUncertainty = +this.asset.getPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "Uncertainty");
                playerLastPlayed = this.asset.getPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "LastPlayed");
            } catch (err) {
                let errorStr: string = "Cannot calculate new ratings. Player data is missing: " + err;
                this.asset.Log(Severity.Error, errorStr);
                return;
            }

            // [SC] getting scenario data
            let scenarioRating: number;
            let scenarioPlayCount: number;
            let scenarioUncertainty: number;
            let scenarioTimeLimit: number;
            let scenarioLastPlayed: string;

            try {
                // [ASSET]
                scenarioRating = +this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "Rating");
                scenarioPlayCount = +this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "PlayCount");
                scenarioUncertainty = +this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "Uncertainty");
                scenarioTimeLimit = +this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "TimeLimit");
                scenarioLastPlayed = this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "LastPlayed");
            }
            catch (err) {
                let errorStr: string = "Cannot calculate new ratings. Scenario data is missing: " + err;
                this.asset.Log(Severity.Error, errorStr);
                return;
            }

            let currDateTimeStr: string = Misc.GetDateStr();

            // [SC] parsing player data
            let playerLastPlayedDays: number = Misc.DaysElapsed(playerLastPlayed);
            if (playerLastPlayedDays > DifficultyAdapter.DEF_MAX_DELAY) {
                playerLastPlayedDays = this.maxDelay;
            }

            // [SC] parsing scenario data
            let scenarioLastPlayedDays: number = Misc.DaysElapsed(scenarioLastPlayed);
            if (scenarioLastPlayedDays > DifficultyAdapter.DEF_MAX_DELAY) {
                scenarioLastPlayedDays = this.maxDelay;
            }

            // [SC] calculating actual and expected scores
            let actualScore: number = this.calcActualScore(p_correctAnswer, p_rt, scenarioTimeLimit);
            let expectScore: number = this.calcExpectedScore(playerRating, scenarioRating, scenarioTimeLimit);

            // [SC] calculating player and scenario uncertainties
            let playerNewUncertainty: number = this.calcThetaUncertainty(playerUncertainty, playerLastPlayedDays);
            let scenarioNewUncertainty: number = this.calcBetaUncertainty(scenarioUncertainty, scenarioLastPlayedDays);

            // [SC] calculating player and sceario K factors
            let playerNewKFct: number = this.calcThetaKFctr(playerNewUncertainty, scenarioNewUncertainty);
            let scenarioNewKFct: number = this.calcBetaKFctr(playerNewUncertainty, scenarioNewUncertainty);

            // [SC] calculating player and scenario ratings
            let playerNewRating: number = this.calcTheta(playerRating, playerNewKFct, actualScore, expectScore);
            let scenarioNewRating: number = this.calcBeta(scenarioRating, scenarioNewKFct, actualScore, expectScore);

            // [SC] updating player and scenario play counts
            let playerNewPlayCount: number = playerPlayCount + 1;
            let scenarioNewPlayCount: number = scenarioPlayCount + 1;

            // [SC] storing updated player data
            // [ASSET]
            this.asset.setPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "Rating", "" + playerNewRating);
            this.asset.setPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "PlayCount", "" + playerNewPlayCount);
            this.asset.setPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "KFactor", "" + playerNewKFct);
            this.asset.setPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "Uncertainty", "" + playerNewUncertainty);
            this.asset.setPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "LastPlayed", currDateTimeStr);

            // [SC] storing updated scenario data
            // [ASSET]
            this.asset.setScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "Rating", "" + scenarioNewRating);
            this.asset.setScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "PlayCount", "" + scenarioNewPlayCount);
            this.asset.setScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "KFactor", "" + scenarioNewKFct);
            this.asset.setScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "Uncertainty", "" + scenarioNewUncertainty);
            this.asset.setScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_scenarioID, "LastPlayed", currDateTimeStr);

            // [SC] save changes to local XML file
            if (p_updateDatafiles) {
                this.asset.SaveAdaptationData(); // [ASSET]
            }

            // [SC] creating game log
            this.asset.CreateNewRecord(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, p_scenarioID, p_rt, p_correctAnswer
                , playerNewRating, scenarioNewRating, currDateTimeStr, p_updateDatafiles); // [ASSET]
        }


        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating matching scenario

        /// <summary>
        /// Calculates expected beta for target scenario. Returns ID of a scenario with beta closest to the target beta.
        /// If two more scenarios match then scenario that was least played is chosen.  
        /// </summary>
        ///
        /// <param name="gameID">   Identifier for the game. </param>
        /// <param name="playerID"> Identifier for the player. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public TargetScenarioID(p_gameID: string, p_playerID: string): string { // [SC][2016.03.14] CalculateTargetScenarioID => TargetScenarioID
            // [SC] get player rating.
            let playerRating: number = +this.asset.getPlayerParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, p_playerID, "Rating"); // [ASSET]

            // [SC] get IDs of available scenarios
            let scenarioIDList: string[] = this.asset.AllScenariosIDs(DifficultyAdapter.ADAPTER_TYPE, p_gameID); // [ASSET]
            if (scenarioIDList.length == 0) {
                let errorStr: string = "No scenarios found for adaptation " + DifficultyAdapter.ADAPTER_TYPE + " in game " + p_gameID;
                this.asset.Log(Severity.Critical, errorStr);
                throw errorStr;
            }

            let targetScenarioRating: number = this.calcTargetBeta(playerRating);
            let minDistance: number = 0;
            let minDistanceScenarioID: string = null;
            let minPlayCount: number = 0;

            for (let scenarioIndex = 0; scenarioIndex < scenarioIDList.length; scenarioIndex++) {
                let scenarioID: string = scenarioIDList[scenarioIndex];

                if (scenarioID == null || scenarioID == undefined) {
                    let errorStr: string = "Null scenario ID found for adaptation " + DifficultyAdapter.ADAPTER_TYPE + " in game " + p_gameID;
                    this.asset.Log(Severity.Critical, errorStr);
                    throw errorStr;
                }

                let scenarioPlayCount: number = +this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, scenarioID, "PlayCount"); // [ASSET]
                let scenarioRating: number = +this.asset.getScenarioParam(DifficultyAdapter.ADAPTER_TYPE, p_gameID, scenarioID, "Rating"); // [ASSET]

                let distance: number = Math.abs(scenarioRating - targetScenarioRating);
                if (minDistanceScenarioID == null || distance < minDistance) {
                    minDistance = distance;
                    minDistanceScenarioID = scenarioID;
                    minPlayCount = scenarioPlayCount;
                }
                else if (distance == minDistance && scenarioPlayCount < minPlayCount) {
                    minDistance = distance;
                    minDistanceScenarioID = scenarioID;
                    minPlayCount = scenarioPlayCount;
                }
            }

            return minDistanceScenarioID;
        }

        /// <summary>
        /// Calculates target beta.
        /// </summary>
        ///
        /// <param name="theta"> The theta. </param>
        ///
        /// <returns>
        /// A double.
        /// </returns>
        private calcTargetBeta(p_theta: number): number { // [SC][2016.01.07] "TargetBeta" => "calcTargetBeta"
            let randomNum: number;
            do {
                randomNum = Misc.GetNormal(DifficultyAdapter.TARGET_DISTR_MEAN, DifficultyAdapter.TARGET_DISTR_SD);
            } while (randomNum <= DifficultyAdapter.TARGET_LOWER_LIMIT
                || randomNum >= DifficultyAdapter.TARGET_UPPER_LIMIT
                || randomNum == 1 || randomNum == 0); // [SC][2016.03.14] || randomNum == 1 || randomNum == 0
            return p_theta + Math.log(randomNum / (1 - randomNum));
        }

        ////// END: functions for calculating matching scenario
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating expected and actual scores

        /// <summary>
        /// Calculates actual score given success/failure outcome and response time.
        /// </summary>
        ///
        /// <param name="correctAnswer">   should be either 0, for failure,
        ///                                         or 1 for success. </param>
        /// <param name="responseTime">    a response time in milliseconds. </param>
        /// <param name="itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer. </param>
        ///
        /// <returns>
        /// actual score as a double.
        /// </returns>
        private calcActualScore(p_correctAnswer: number, p_responseTime: number, p_itemMaxDuration: number): number {
            this.validateResponseTime(p_responseTime);
            this.validateItemMaxDuration(p_itemMaxDuration);

            let discrParam: number = this.getDiscriminationParam(p_itemMaxDuration);
            return (((2 * p_correctAnswer) - 1) * ((discrParam * p_itemMaxDuration) - (discrParam * p_responseTime)));
        }

        /// <summary>
        /// Calculates expected score given player's skill rating and item's
        /// difficulty rating.
        /// </summary>
        ///
        /// <param name="playerTheta">     player's skill rating. </param>
        /// <param name="itemBeta">        item's difficulty rating. </param>
        /// <param name="itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer. </param>
        ///
        /// <returns>
        /// expected score as a double.
        /// </returns>
        private calcExpectedScore(p_playerTheta: number, p_itemBeta: number, p_itemMaxDuration: number): number {
            this.validateItemMaxDuration(p_itemMaxDuration);

            let weight: number = this.getDiscriminationParam(p_itemMaxDuration) * p_itemMaxDuration;

            let ratingDifference: number = p_playerTheta - p_itemBeta; // [SC][2016.01.07]
            if (ratingDifference == 0) {
                ratingDifference = 0.001; // [SC][2016.01.07]
            }

            let expFctr: number = Math.exp(2.0 * weight * ratingDifference); // [SC][2016.01.07]

            return (weight * ((expFctr + 1.0) / (expFctr - 1.0))) - (1.0 / ratingDifference); // [SC][2016.01.07]
        }

        /// <summary>
        /// Calculates discrimination parameter a_i necessary to calculate expected
        /// and actual scores.
        /// </summary>
        ///
        /// <param name="itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer; should be
        ///                                 player. </param>
        ///
        /// <returns>
        /// discrimination parameter a_i as double number.
        /// </returns>
        private getDiscriminationParam(p_itemMaxDuration: number): number {
            return (1.0 / p_itemMaxDuration);
        }

        ////// END: functions for calculating expected and actual scores
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating rating uncertainties

        /// <summary>
        /// Calculates a new uncertainty for the theta rating.
        /// </summary>
        ///
        /// <param name="currThetaU">       current uncertainty value for theta
        ///                                 rating. </param>
        /// <param name="currDelayCount">   the current number of consecutive days
        ///                                 the player has not played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for theta rating.
        /// </returns>
        private calcThetaUncertainty(p_currThetaU: number, p_currDelayCount: number): number {
            let newThetaU: number = p_currThetaU - (1.0 / this.maxPlay) + (p_currDelayCount / this.maxDelay);
            if (newThetaU < 0) {
                newThetaU = 0.0;
            } else if (newThetaU > 1) {
                newThetaU = 1.0;
            }
            return newThetaU;
        }

        /// <summary>
        /// Calculates a new uncertainty for the beta rating.
        /// </summary>
        ///
        /// <param name="currBetaU">        current uncertainty value for the beta
        ///                                 rating. </param>
        /// <param name="currDelayCount">   the current number of consecutive days
        ///                                 the item has not beein played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for the beta rating.
        /// </returns>
        private calcBetaUncertainty(p_currBetaU: number, p_currDelayCount: number): number {
            let newBetaU: number = p_currBetaU - (1.0 / this.maxPlay) + (p_currDelayCount / this.maxDelay);
            if (newBetaU < 0) {
                newBetaU = 0.0;
            } else if (newBetaU > 1) {
                newBetaU = 1.0;
            }
            return newBetaU;
        }

        ////// END: functions for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating k factors

        /// <summary>
        /// Calculates a new K factor for theta rating
        /// </summary>
        /// <param name="currThetaU">current uncertainty for the theta rating</param>
        /// <param name="currBetaU">current uncertainty for the beta rating</param>
        /// <returns>a double value of a new K factor for the theta rating</returns>
        private calcThetaKFctr(p_currThetaU: number, p_currBetaU: number): number {
            return this.kConst * (1 + (this.kUp * p_currThetaU) - (this.kDown * p_currBetaU));
        }

        /// <summary>
        /// Calculates a new K factor for the beta rating
        /// </summary>
        /// <param name="currThetaU">current uncertainty fot the theta rating</param>
        /// <param name="currBetaU">current uncertainty for the beta rating</param>
        /// <returns>a double value of a new K factor for the beta rating</returns>
        private calcBetaKFctr(p_currThetaU: number, p_currBetaU: number): number {
            return this.kConst * (1 + (this.kUp * p_currBetaU) - (this.kDown * p_currThetaU));
        }

        ////// END: functions for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating theta and beta ratings

        /// <summary>
        /// Calculates a new theta rating.
        /// </summary>
        ///
        /// <param name="currTheta">   current theta rating. </param>
        /// <param name="thetaKFctr">  K factor for the theta rating. </param>
        /// <param name="actualScore"> actual performance score. </param>
        /// <param name="expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for the new theta rating.
        /// </returns>
        private calcTheta(p_currTheta: number, p_thetaKFctr: number, p_actualScore: number, p_expectScore: number): number {
            return p_currTheta + (p_thetaKFctr * (p_actualScore - p_expectScore));
        }

        /// <summary>
        /// Calculates a new beta rating.
        /// </summary>
        ///
        /// <param name="currBeta">    current beta rating. </param>
        /// <param name="betaKFctr">   K factor for the beta rating. </param>
        /// <param name="actualScore"> actual performance score. </param>
        /// <param name="expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for new beta rating.
        /// </returns>
        private calcBeta(p_currBeta: number, p_betaKFctr: number, p_actualScore: number, p_expectScore: number): number {
            return p_currBeta + (p_betaKFctr * (p_expectScore - p_actualScore));
        }

        ////// END: functions for calculating theta and beta ratings
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: tester functions

        /// <summary>
        /// Tests the validity of the value representing the response time.
        /// </summary>
        ///
        /// <param name="responseTime"> . </param>
        private validateResponseTime(p_responseTime: number): void {
            if (p_responseTime == 0) {
                let errorStr: string = "p_responseTime parameter in validateResponseTime function cannot be 0.";
                this.asset.Log(Severity.Critical, errorStr);
                throw errorStr;
            }
            if (p_responseTime < 0) {
                let errorStr: string = "p_responseTime parameter in validateResponseTime function cannot be negative.";
                this.asset.Log(Severity.Critical, errorStr);
                throw errorStr;
            }
        }

        /// <summary>
        /// Tests the validity of the value representing the max amount of time to
        /// respond.
        /// </summary>
        ///
        /// <exception cref="ArgumentException">    Thrown when one or more arguments
        ///                                         have unsupported or illegal values. </exception>
        ///
        /// <param name="itemMaxDuration"> . </param>
        private validateItemMaxDuration(p_itemMaxDuration: number): void {
            if (p_itemMaxDuration == 0) {
                let errorStr: string = "p_itemMaxDuration parameter in validateItemMaxDuration function cannot be 0.";
                this.asset.Log(Severity.Critical, errorStr);
                throw errorStr;
            }
            if (p_itemMaxDuration < 0) {
                let errorStr: string = "p_itemMaxDuration parameter in validateItemMaxDuration function cannot be negative.";
                this.asset.Log(Severity.Critical, errorStr);
                throw errorStr;
            }
        }

        ////// END: tester functions
        //////////////////////////////////////////////////////////////////////////////////////
    }
}