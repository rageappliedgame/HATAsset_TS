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

/// <reference path="../RageAssetManager/AssetManager.ts"/>
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/IAsset.ts"/>
/// <reference path="../RageAssetManager/IDataStorage.ts"/>
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="DifficultyAdapter.ts"/>
///

module TwoAPackage
{

    import AssetManager = AssetManagerPackage.AssetManager;

    import BaseAsset = AssetPackage.BaseAsset;
    import IAsset = AssetPackage.IAsset;
    import IDataStorage = AssetPackage.IDataStorage;
    import Severity = AssetPackage.Severity;

    import DifficultyAdapter = TwoAPackage.DifficultyAdapter;

    /// <summary>
    /// Export the TwoA asset
    /// </summary>
    export class TwoA extends BaseAsset
    {
        public static DATE_FORMAT: string = "yyyy-MM-ddThh:mm:ss";

        /// <summary>
        /// XML related objects
        /// </summary>
        private parser: DOMParser = new DOMParser();
        private serializer: XMLSerializer = new XMLSerializer();

        /// <summary>
        /// The assessment and adaptation tool
        /// </summary>
        private adapter: DifficultyAdapter;

        /// <summary>
        /// The logfile and the data file names
        /// </summary>
        private gameplayLogsFile: string = "gameplaylogs.xml"
        private adaptFile: string = "HATAssetAppSettings.xml"

        /// <summary>
        /// string representations of two data files
        /// </summary>
        private gameplaydata: Document;
        private adaptData: Document;

        /// <summary>
        /// Initialize the instance of the TwoA asset
        /// <summary>
        constructor() {
            super();
        }

        /// <summary>
        /// load two xml files that store data; the method name may be different than in C# implementation; initializes the adapter
        /// </summary>
        public InitSettings(): void {
            // [SC] Load XML file containing adaptation date
            this.LoadAdaptationData();

            // [SC] Load XML file containing log records of all gameplays
            this.LoadGameplayData();

            // [SC] create the ELO_CAT adapter
            this.adapter = new DifficultyAdapter();
            this.adapter.initSettings(this);
        }

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions to be called from a game

        /// <summary>
        /// Get the Target scenario ID from the adapter.
        /// </summary>
        ///
        /// <param name="adaptID">  Identifier for the adapt. </param>
        /// <param name="gameID">   Identifier for the game. </param>
        /// <param name="playerID"> Identifier for the player. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public TargetScenarioID(p_adaptID: string, p_gameID: string, p_playerID: string): string {
            if (p_adaptID == this.adapter.Type) {
                return this.adapter.TargetScenarioID(p_gameID, p_playerID);
            } else {
                return null; // [TODO]
            }
        }

        /// <summary>
        /// Updates the ratings of the adapter.
        /// </summary>
        ///
        /// <param name="adaptID">          Identifier for the adapt. </param>
        /// <param name="gameID">           Identifier for the game. </param>
        /// <param name="playerID">         Identifier for the player. </param>
        /// <param name="scenarioID">       Identifier for the scenario. </param>
        /// <param name="rt">               The right. </param>
        /// <param name="correctAnswer">    The correct answer. </param>
        /// <param name="updateDatafiles">  Set to true to update adaptation and gameplay logs files. </param>
        public UpdateRatings(p_adaptID: string, p_gameID: string, p_playerID: string, p_scenarioID: string, p_rt: number, p_correctAnswer: number, p_updateDatafiles: boolean): void {
            if (p_adaptID == this.adapter.Type) {
                this.adapter.UpdateRatings(p_gameID, p_playerID, p_scenarioID, p_rt, p_correctAnswer, p_updateDatafiles);
            } else {
                return; // [TODO]
            }
        }

        ////// END: functions to be called from a game
        //////////////////////////////////////////////////////////////////////////////////////
        
        /// <summary>
        /// Gets a list containing all scenarios IDs.
        /// </summary>
        ///
        /// <param name="adaptID"> Identifier for the adapt. </param>
        /// <param name="gameID">  Identifier for the game. </param>
        ///
        /// <returns>
        /// returns array of string values OR a null value if no scenarios are available
        /// </returns>
        public AllScenariosIDs(p_adaptID: string, p_gameID: string): string[] {
            let scenarioList: string[] = [];

            // [SC] verify availablity of adaptation data
            if (this.adaptData != null && this.adaptData != undefined) {

                // [SC] verify that the adaptation exists
                let adaptNodeList = this.adaptData.documentElement.getElementsByTagName("Adaptation");
                for (let adaptIndex = 0; adaptIndex < adaptNodeList.length; adaptIndex++) {
                    if (adaptNodeList[adaptIndex].getAttribute("AdaptationID") == p_adaptID) {

                        // [SC] verify that the game exists
                        let gameNodeList = adaptNodeList[adaptIndex].getElementsByTagName("Game");
                        for (let gameIndex = 0; gameIndex < gameNodeList.length; gameIndex++) {
                            if (gameNodeList[gameIndex].getAttribute("GameID") == p_gameID) {

                                let scenarioNodeList = gameNodeList[gameIndex].getElementsByTagName("ScenarioData")[0].getElementsByTagName("Scenario");
                                if (scenarioNodeList.length > 0) {
                                    for (let scenarioIndex = 0; scenarioIndex < scenarioNodeList.length; scenarioIndex++) {
                                        scenarioList[scenarioIndex] = scenarioNodeList[scenarioIndex].getAttribute("ScenarioID");
                                    }
                                } else {
                                    this.Log(Severity.Warning, "Empty scenario list for the game " + +p_gameID + " with adaptation " + p_adaptID);
                                }

                                return scenarioList;
                            }
                        }

                        break;
                    }
                }
            }

            let errorStr: string = "Unable to retrieve scenario IDs for game " + p_gameID + " with adaptation " + p_adaptID + ".";
            this.Log(Severity.Error, errorStr);
            return scenarioList;
        }


        /// <summary>
        /// Creates new record to the game log.
        /// </summary>
        ///
        /// <param name="adaptID">        Identifier for the adapt. </param>
        /// <param name="gameID">         Identifier for the game. </param>
        /// <param name="playerID">       Identifier for the player. </param>
        /// <param name="scenarioID">     Identifier for the scenario. </param>
        /// <param name="rt">             The right. </param>
        /// <param name="accuracy">       The correct answer. </param>
        /// <param name="playerRating">     The player new rating. </param>
        /// <param name="scenarioRating"> The scenario new rating. </param>
        /// <param name="timestamp">      The current date time. </param>
        /// <param name="updateDatafiles">  Set to true to update adaptation and gameplay logs files. </param>
        public CreateNewRecord(p_adaptID: string, p_gameID: string, p_playerID: string, p_scenarioID: string
                                , p_rt: number, p_accuracy: number
                                , p_playerRating: number, p_scenarioRating: number, p_timestamp: string, p_updateDatafiles: boolean): void {

            if (this.gameplaydata != null && this.gameplaydata != undefined) {

                let adaptNodeList = this.gameplaydata.documentElement.getElementsByTagName("Adaptation");
                for (let adaptIndex = 0; adaptIndex < adaptNodeList.length; adaptIndex++) {
                    if (adaptNodeList[adaptIndex].getAttribute("AdaptationID") == p_adaptID) {

                        let gameNodeList = adaptNodeList[adaptIndex].getElementsByTagName("Game");
                        for (let gameIndex = 0; gameIndex < gameNodeList.length; gameIndex++) {
                            if (gameNodeList[gameIndex].getAttribute("GameID") == p_gameID) {

                                // [SC] creating a Gameplay node
                                let gameplayNode = this.gameplaydata.createElement("Gameplay");

                                // [SC] creating PlayerID attribute
                                let playerIDAttr = this.gameplaydata.createAttribute("PlayerID");
                                playerIDAttr.nodeValue = p_playerID;
                                gameplayNode.setAttributeNode(playerIDAttr);

                                // [SC] creating ScenarioID attribute
                                let scenarioIDAttr = this.gameplaydata.createAttribute("ScenarioID");
                                scenarioIDAttr.nodeValue = p_scenarioID;
                                gameplayNode.setAttributeNode(scenarioIDAttr);

                                // [SC] creating Timestamp attribute
                                let timestampAttr = this.gameplaydata.createAttribute("Timestamp");
                                timestampAttr.nodeValue = p_timestamp;
                                gameplayNode.setAttributeNode(timestampAttr);

                                // [SC] creating RT node
                                let rtNode = this.gameplaydata.createElement("RT");
                                rtNode.textContent = "" + p_rt;
                                gameplayNode.appendChild(rtNode);

                                // [SC] creating Accuracy node
                                let accuracyNode = this.gameplaydata.createElement("Accuracy");
                                accuracyNode.textContent = "" + p_accuracy;
                                gameplayNode.appendChild(accuracyNode);

                                // [SC] creating PlayerRating node
                                let playerRatingNode = this.gameplaydata.createElement("PlayerRating");
                                playerRatingNode.textContent = "" + p_playerRating;
                                gameplayNode.appendChild(playerRatingNode);

                                // [SC] creating ScenarioRating node
                                let scenarioRatingNode = this.gameplaydata.createElement("ScenarioRating");
                                scenarioRatingNode.textContent = "" + p_scenarioRating;
                                gameplayNode.appendChild(scenarioRatingNode);

                                // [SC] appeding the new Gameplay node into the Game node
                                gameNodeList[gameIndex].appendChild(gameplayNode);

                                // [SC] save the modified date into local XML file
                                if (p_updateDatafiles) {
                                    this.SaveGameplayData();
                                }

                                return;
                            }
                        }

                        break;
                    }
                }
            }

            let errorStr: string = "Unable to log a gameplay record for player " + p_playerID + " playing scenario " + p_scenarioID
                + " with adaptation " + p_adaptID + " in game " + p_gameID;
            this.Log(Severity.Error, errorStr);
        }


        /// <summary>
        /// Get a Property of the Player setting.
        /// </summary>
        ///
        /// <typeparam name="T"> Generic type parameter. </typeparam>
        /// <param name="adaptID">  Identifier for the adapt. </param>
        /// <param name="gameID">   Identifier for the game. </param>
        /// <param name="playerID"> Identifier for the player. </param>
        /// <param name="item">     The item. </param>
        ///
        /// <returns>
        /// A string value or null.
        /// </returns>
        public getPlayerParam(p_adaptID: string, p_gameID: string, p_playerID: string, p_item: string): string {
            if (this.adaptData != null && this.adaptData != undefined) {

                let adaptNodeList = this.adaptData.documentElement.getElementsByTagName("Adaptation");
                for (let adaptIndex = 0; adaptIndex < adaptNodeList.length; adaptIndex++) {
                    if (adaptNodeList[adaptIndex].getAttribute("AdaptationID") == p_adaptID) {

                        let gameNodeList = adaptNodeList[adaptIndex].getElementsByTagName("Game");
                        for (let gameIndex = 0; gameIndex < gameNodeList.length; gameIndex++) {
                            if (gameNodeList[gameIndex].getAttribute("GameID") == p_gameID) {

                                let playerNodeList = gameNodeList[gameIndex].getElementsByTagName("PlayerData")[0].getElementsByTagName("Player");
                                for (let playerIndex = 0; playerIndex < playerNodeList.length; playerIndex++) {
                                    if (playerNodeList[playerIndex].getAttribute("PlayerID") == p_playerID) {
                                        return playerNodeList[playerIndex].getElementsByTagName(p_item)[0].childNodes[0].nodeValue;
                                    }
                                }

                                break;
                            }
                        }

                        break;
                    }
                }
            }

            let errorStr: string = "Unable to get " + p_item + " for player " + p_playerID + " for adaptation " + p_adaptID + " in game " + p_gameID + ".";
            this.Log(Severity.Critical, errorStr);
            throw errorStr;
        }

        /// <summary>
        /// Set a Property of the Player setting.
        /// </summary>
        ///
        /// <typeparam name="T"> Generic type parameter. </typeparam>
        /// <param name="adaptID">  Identifier for the adapt. </param>
        /// <param name="gameID">   Identifier for the game. </param>
        /// <param name="playerID"> Identifier for the player. </param>
        /// <param name="item">     The item. </param>
        /// <param name="value">    The value. </param>
        public setPlayerParam(p_adaptID: string, p_gameID: string, p_playerID: string, p_item: string, p_value: string): void {
            if (this.adaptData != null && this.adaptData != undefined) {

                let adaptNodeList = this.adaptData.documentElement.getElementsByTagName("Adaptation");
                for (let adaptIndex = 0; adaptIndex < adaptNodeList.length; adaptIndex++) {
                    if (adaptNodeList[adaptIndex].getAttribute("AdaptationID") == p_adaptID) {

                        let gameNodeList = adaptNodeList[adaptIndex].getElementsByTagName("Game");
                        for (let gameIndex = 0; gameIndex < gameNodeList.length; gameIndex++) {
                            if (gameNodeList[gameIndex].getAttribute("GameID") == p_gameID) {

                                let playerNodeList = gameNodeList[gameIndex].getElementsByTagName("PlayerData")[0].getElementsByTagName("Player");
                                for (let playerIndex = 0; playerIndex < playerNodeList.length; playerIndex++) {
                                    if (playerNodeList[playerIndex].getAttribute("PlayerID") == p_playerID) {
                                        playerNodeList[playerIndex].getElementsByTagName(p_item)[0].childNodes[0].nodeValue = p_value;
                                        return;
                                    }
                                }

                                break;
                            }
                        }

                        break;
                    }
                }
            }

            let errorStr: string = "Unable to set value to " + p_item + " for player " + p_playerID + " for adaptation " + p_adaptID + " in game " + p_gameID + ".";
            this.Log(Severity.Error, errorStr);
        }


        /// <summary>
        /// Get a Property of the Scenario setting.
        /// </summary>
        ///
        /// <typeparam name="T"> Generic type parameter. </typeparam>
        /// <param name="adaptID">    Identifier for the adapt. </param>
        /// <param name="gameID">     Identifier for the game. </param>
        /// <param name="scenarioID"> Identifier for the scenario. </param>
        /// <param name="item">       The item. </param>
        ///
        /// <returns>
        /// A string value.
        /// </returns>
        public getScenarioParam(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_item: string): string {
            if (this.adaptData != null && this.adaptData != undefined) {

                let adaptNodeList = this.adaptData.documentElement.getElementsByTagName("Adaptation");
                for (let adaptIndex = 0; adaptIndex < adaptNodeList.length; adaptIndex++) {
                    if (adaptNodeList[adaptIndex].getAttribute("AdaptationID") == p_adaptID) {

                        let gameNodeList = adaptNodeList[adaptIndex].getElementsByTagName("Game");
                        for (let gameIndex = 0; gameIndex < gameNodeList.length; gameIndex++) {
                            if (gameNodeList[gameIndex].getAttribute("GameID") == p_gameID) {

                                let scenarioNodeList = gameNodeList[gameIndex].getElementsByTagName("ScenarioData")[0].getElementsByTagName("Scenario");
                                for (let scenarioIndex = 0; scenarioIndex < scenarioNodeList.length; scenarioIndex++) {
                                    if (scenarioNodeList[scenarioIndex].getAttribute("ScenarioID") == p_scenarioID) {
                                        return scenarioNodeList[scenarioIndex].getElementsByTagName(p_item)[0].childNodes[0].nodeValue;
                                    }
                                }

                                break;
                            }
                        }

                        break;
                    }
                }
            }

            let errorStr: string = "Unable to get " + p_item + " for scenario " + p_scenarioID + " for adaptation " + p_adaptID + " in game " + p_gameID + ".";
            this.Log(Severity.Critical, errorStr);
            throw errorStr;
        }

        /// <summary>
        /// Set a Property of the Scenario setting.
        /// </summary>
        ///
        /// <typeparam name="T"> Generic type parameter. </typeparam>
        /// <param name="adaptID">    Identifier for the adapt. </param>
        /// <param name="gameID">     Identifier for the game. </param>
        /// <param name="scenarioID"> Identifier for the scenario. </param>
        /// <param name="item">       The item. </param>
        /// <param name="value">      The value. </param>
        public setScenarioParam(p_adaptID: string, p_gameID: string, p_scenarioID: string, p_item: string, p_value: string): void {
            if (this.adaptData != null && this.adaptData != undefined) {

                let adaptNodeList = this.adaptData.documentElement.getElementsByTagName("Adaptation");
                for (let adaptIndex = 0; adaptIndex < adaptNodeList.length; adaptIndex++) {
                    if (adaptNodeList[adaptIndex].getAttribute("AdaptationID") == p_adaptID) {

                        let gameNodeList = adaptNodeList[adaptIndex].getElementsByTagName("Game");
                        for (let gameIndex = 0; gameIndex < gameNodeList.length; gameIndex++) {
                            if (gameNodeList[gameIndex].getAttribute("GameID") == p_gameID) {

                                let scenarioNodeList = gameNodeList[gameIndex].getElementsByTagName("ScenarioData")[0].getElementsByTagName("Scenario");
                                for (let scenarioIndex = 0; scenarioIndex < scenarioNodeList.length; scenarioIndex++) {
                                    if (scenarioNodeList[scenarioIndex].getAttribute("ScenarioID") == p_scenarioID) {
                                        scenarioNodeList[scenarioIndex].getElementsByTagName(p_item)[0].childNodes[0].nodeValue = p_value; // [TEST]
                                        return;
                                    }
                                }

                                break;
                            }
                        }

                        break;
                    }
                }
            }

            let errorStr: string = "Unable to set value to " + p_item + " for scenario " + p_scenarioID + " for adaptation " + p_adaptID + " in game " + p_gameID + ".";
            this.Log(Severity.Error, errorStr);
        }

        /// <summary>
        /// loads adaptation data
        /// </summary>
        public LoadAdaptationData(): void {
            let existsMethod: IDataStorage = this.getInterfaceMethod("Exists");
            let loadMethod: IDataStorage = this.getInterfaceMethod("Load");

            let strVal: string;
            if (existsMethod && loadMethod && existsMethod.Exists(this.adaptFile)) {
                strVal = loadMethod.Load(this.adaptFile);
                this.Log(Severity.Information, "Loading an existing adaptation file.");
            } else {
                strVal = ""
                    + "<?xml version= \"1.0\" encoding= \"UTF-8\"?>"
                    + "<AdaptationData>"
                    + "    <Adaptation AdaptationID=\"Game difficulty - Player skill\"/>"
                    + "</AdaptationData>";
                this.Log(Severity.Warning, "No existing adaptation datafile. Loading default adaptation data.");
            }

            this.adaptData = this.parser.parseFromString(strVal, "text/xml");
        }

        /// <summary>
        /// sets adaptation data from a custom string value
        /// </summary>
        public SetAdaptationData(p_strData: string): void {
            if (!p_strData) {
                let errorStr: string = "Invalid string value passed as adaptation data in setAdaptationData function.";
                this.Log(Severity.Error, errorStr);
                return;
            }

            this.adaptData = this.parser.parseFromString(p_strData, "text/xml");
        }

        /// <summary>
        /// gets adaptation data as string
        /// </summary>
        public GetAdaptationDataStr(): string {
            return this.serializer.serializeToString(this.adaptData);
        }

        /// <summary>
        /// deletes adaptation data
        /// </summary>
        public DeleteAdaptationData() {
            let existsMethod: IDataStorage = this.getInterfaceMethod("Exists");
            let deleteMethod: IDataStorage = this.getInterfaceMethod("Delete");

            if (!existsMethod || !deleteMethod) {
                let errorStr: string = "Unable to delete adaptation datafile. The IDataStorage interface is not implemented.";
                this.Log(Severity.Error, errorStr);
                return;
            }

            if (!existsMethod.Exists(this.adaptFile)) {
                let errorStr: string = "Unable to delete adaptation datafile. The file does not exist.";
                this.Log(Severity.Error, errorStr);
                return;
            }

            deleteMethod.Delete(this.adaptFile);
        }

        /// <summary>
        /// Saves AdaptationData to local XML file. Needs IDataStorage interface from RAGE architecture */
        /// </summary>
        public SaveAdaptationData(): void {
            let saveMethod: IDataStorage = this.getInterfaceMethod("Save");

            if (saveMethod) {
                let strVal: string = this.serializer.serializeToString(this.adaptData);
                saveMethod.Save(this.adaptFile, strVal);
            } else {
                // [TODO]
            }
        }

        /// <summary>
        /// Loads gameplay data
        /// </summary>
        public LoadGameplayData(): void {
            let existsMethod: IDataStorage = this.getInterfaceMethod("Exists");
            let loadMethod: IDataStorage = this.getInterfaceMethod("Load");

            let strVal: string;
            if (existsMethod && loadMethod && existsMethod.Exists(this.gameplayLogsFile)) {
                strVal = loadMethod.Load(this.gameplayLogsFile);
                this.Log(Severity.Information, "Loading an existing gameplay file.");
            } else {
                strVal = ""
                    + "<?xml version= \"1.0\" encoding= \"UTF-8\"?>"
                    + "<GameplaysData>"
                    + "    <Adaptation AdaptationID=\"Game difficulty - Player skill\"/>"
                    + "</GameplaysData>";
                this.Log(Severity.Warning, "No gameplay datafile found. Loading default gameplay data.");
            }

            this.gameplaydata = this.parser.parseFromString(strVal, "text/xml");
        }

        /// <summary>
        /// sets gameplay data from a custom string value
        /// </summary>
        public SetGameplayData(p_strData): void {
            if (!p_strData) {
                let errorStr: string = "Invalid string value passed as gameplay data to SetGameplayData function.";
                this.Log(Severity.Error, errorStr);
                return;
            }

            this.gameplaydata = this.parser.parseFromString(p_strData, "text/xml");
        }

        /// <summary>
        /// gets gameplay data as string
        /// </summary>
        public GetGameplayDataStr(): string {
            return this.serializer.serializeToString(this.gameplaydata);
        }

        /// <summary>
        /// deletes gameplay data
        /// </summary>
        public DeleteGameplayData(): void {
            let existsMethod: IDataStorage = this.getInterfaceMethod("Exists");
            let deleteMethod: IDataStorage = this.getInterfaceMethod("Delete");

            if (!existsMethod || !deleteMethod) {
                let errorStr: string = "Unable to delete gameplays datafile. The IDataStorage interface is not implemented.";
                this.Log(Severity.Error, errorStr);
                return;
            }

            if (!existsMethod.Exists(this.gameplayLogsFile)) {
                let errorStr: string = "Unable to delete gameplays datafile. The file does not exist.";
                this.Log(Severity.Error, errorStr);
                return;
            }

            deleteMethod.Delete(this.gameplayLogsFile);
        }

        /// <summary>
        /// Saves GameplaysData to local XML file. Needs IDataStorage interface from RAGE architecture */
        /// </summary>
        public SaveGameplayData(): void {
            let saveMethod: IDataStorage = this.getInterfaceMethod("Save");

            if (saveMethod) {
                let strVal: string = this.serializer.serializeToString(this.gameplaydata);
                saveMethod.Save(this.gameplayLogsFile, strVal); 
            } else {
                // [TODO]
            }
        }
    }
}