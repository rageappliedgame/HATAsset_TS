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

/// <reference path="RageAssetManager/AssetManager.ts"/>
/// <reference path="RageAssetManager/Messages.ts"/>
/// 
/// <reference path="TwoA/TwoA.ts"/>
///
/// <reference path="Bridge.ts"/>
///

module TestPackage
{
    import AssetManager = AssetManagerPackage.AssetManager;
    import Severity = AssetPackage.Severity;

    import TwoA = TwoAPackage.TwoA;

    let bridge: Bridge = new Bridge();

    window.onload = () => {
        Tests.doTest();
    };

    export class Tests {
        private static twoA: TwoA;

        public static doTest(): void {
            bridge.Log(Severity.Information, "Test_05_Setup start");

            // [SC] instantiate the TwoA asset
            this.twoA = new TwoA();
            // [SC] give asset its own bridge
            this.twoA.Bridge = bridge;
            // [SC] creating custom XML files
            this.twoA.InitSettings();

            this.LoadDataTest();

            let adaptID: string = "Game difficulty - Player skill";
            let gameID: string = "TileZero";
            let playerID: string = "Noob"; // [SC] using this player as an example
            let scenarioID: string = "Hard AI"; // [SC] using this scenario as an example

            // [SC] set this variable to true if you want changes saved to "HATAssetAppSettings.xml" and "gameplaylogs.xml" files
            let updateDatafiles: boolean = false;

            ////////////////////////////////////////////////////////////////

            bridge.Log(Severity.Information, "Example player parameters: ");
            this.printPlayerData(this.twoA, adaptID, gameID, playerID);

            ////////////////////////////////////////////////////////////////

            bridge.Log(Severity.Information, "Example scenario parameters: ");
            this.printScenarioData(this.twoA, adaptID, gameID, scenarioID);

            ////////////////////////////////////////////////////////////////

            bridge.Log(Severity.Information, "Ask 10 time for a recommended scenarios for the player " + playerID);
            for (let count = 0; count < 10; count++) {
                bridge.Log(Severity.Information, "    Request " + count + ": " + this.twoA.TargetScenarioID(adaptID, gameID, playerID));
            }

            ////////////////////////////////////////////////////////////////

            bridge.Log(Severity.Information, "First simulated gameplay. Player performed well. Player rating increases and scenario rating decreases: ");
            this.twoA.UpdateRatings(adaptID, gameID, playerID, scenarioID, 120000, 1, updateDatafiles);
            this.printPlayerData(this.twoA, adaptID, gameID, playerID);
            bridge.Log(Severity.Information, "");
            this.printScenarioData(this.twoA, adaptID, gameID, scenarioID);

            bridge.Log(Severity.Information, "Second simulated gameplay. Player performed well again. Player rating increases and scenario rating decreases: ");
            this.twoA.UpdateRatings(adaptID, gameID, playerID, scenarioID, 230000, 1, updateDatafiles);
            this.printPlayerData(this.twoA, adaptID, gameID, playerID);
            bridge.Log(Severity.Information, "");
            this.printScenarioData(this.twoA, adaptID, gameID, scenarioID);

            bridge.Log(Severity.Information, "Third simulated gameplay. Player performed poorly. Player rating decreass and scenario rating increases: ");
            this.twoA.UpdateRatings(adaptID, gameID, playerID, scenarioID, 12000, 0, updateDatafiles);
            this.printPlayerData(this.twoA, adaptID, gameID, playerID);
            bridge.Log(Severity.Information, "");
            this.printScenarioData(this.twoA, adaptID, gameID, scenarioID);

            ////////////////////////////////////////////////////////////////

            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "Test_05_Setup end");
        }

        public static printPlayerData(twoA: TwoA, adaptID: string, gameID: string, playerID: string): void {
            bridge.Log(Severity.Information, "    PlayerID: " + playerID);
            bridge.Log(Severity.Information, "    Rating: " + this.twoA.getPlayerParam(adaptID, gameID, playerID, "Rating"));
            bridge.Log(Severity.Information, "    PlayCount: " + this.twoA.getPlayerParam(adaptID, gameID, playerID, "PlayCount"));
            bridge.Log(Severity.Information, "    KFactor: " + this.twoA.getPlayerParam(adaptID, gameID, playerID, "KFactor"));
            bridge.Log(Severity.Information, "    Uncertainty: " + this.twoA.getPlayerParam(adaptID, gameID, playerID, "Uncertainty"));
            bridge.Log(Severity.Information, "    LastPlayed: " + this.twoA.getPlayerParam(adaptID, gameID, playerID, "LastPlayed"));
        }

        public static printScenarioData(twoA: TwoA, adaptID: string, gameID: string, scenarioID: string): void {
            bridge.Log(Severity.Information, "    ScenarioID: " + scenarioID);
            bridge.Log(Severity.Information, "    Rating: " + this.twoA.getScenarioParam(adaptID, gameID, scenarioID, "Rating"));
            bridge.Log(Severity.Information, "    PlayCount: " + this.twoA.getScenarioParam(adaptID, gameID, scenarioID, "PlayCount"));
            bridge.Log(Severity.Information, "    KFactor: " + this.twoA.getScenarioParam(adaptID, gameID, scenarioID, "KFactor"));
            bridge.Log(Severity.Information, "    Uncertainty: " + this.twoA.getScenarioParam(adaptID, gameID, scenarioID, "Uncertainty"));
            bridge.Log(Severity.Information, "    LastPlayed: " + this.twoA.getScenarioParam(adaptID, gameID, scenarioID, "LastPlayed"));
            bridge.Log(Severity.Information, "    TimeLimit: " + this.twoA.getScenarioParam(adaptID, gameID, scenarioID, "TimeLimit"));
        }

        public static LoadDataTest(): void {
            let strVal: string = ""
                + "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<AdaptationData>"
                + "    <Adaptation AdaptationID=\"Game difficulty - Player skill\">"
                + "        <Game GameID=\"TileZero\">"
                + "            <ScenarioData>"
                + "                <Scenario ScenarioID=\"Very Easy AI\">"
                + "                    <Rating>1.2</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-03-14T12:59:59</LastPlayed>"
                + "                    <TimeLimit>900000</TimeLimit>"
                + "                </Scenario>"
                + "                <Scenario ScenarioID=\"Easy AI\">"
                + "                    <Rating>1.4</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-03-14T12:59:59</LastPlayed>"
                + "                    <TimeLimit>900000</TimeLimit>"
                + "                </Scenario>"
                + "                <Scenario ScenarioID=\"Medium Color AI\">"
                + "                    <Rating>1.6</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-03-14T12:59:59</LastPlayed>"
                + "                    <TimeLimit>900000</TimeLimit>"
                + "                </Scenario>"
                + "                <Scenario ScenarioID=\"Medium Shape AI\">"
                + "                    <Rating>1.8</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-03-14T12:59:59</LastPlayed>"
                + "                    <TimeLimit>900000</TimeLimit>"
                + "                </Scenario>"
                + "                <Scenario ScenarioID=\"Hard AI\">"
                + "                    <Rating>6</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-08-20T15:04:11</LastPlayed>"
                + "                    <TimeLimit>900000</TimeLimit>"
                + "                </Scenario>"
                + "                <Scenario ScenarioID=\"Very Hard AI\">"
                + "                    <Rating>10</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-03-14T12:59:59</LastPlayed>"
                + "                    <TimeLimit>900000</TimeLimit>"
                + "                </Scenario>"
                + "            </ScenarioData>"
                + "            <PlayerData>"
                + "                <Player PlayerID=\"Noob\">"
                + "                    <Rating>5.5</Rating>"
                + "                    <PlayCount>100</PlayCount>"
                + "                    <KFactor>0.0075</KFactor>"
                + "                    <Uncertainty>0.01</Uncertainty>"
                + "                    <LastPlayed>2016-08-20T15:04:11</LastPlayed>"
                + "                </Player>"
                + "            </PlayerData>"
                + "        </Game>"
                + "    </Adaptation>"
                + "</AdaptationData>";
            this.twoA.SetAdaptationData(strVal);

            strVal = ""
                + "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                + "<GameplaysData>"
                + "    <Adaptation AdaptationID=\"Game difficulty - Player skill\">"
                + "        <Game GameID=\"TileZero\" />"
                + "    </Adaptation>"
                + "</GameplaysData>";
            this.twoA.SetGameplayData(strVal);
        }

        public static printAdaptData(): void {
            let strVal: string = this.twoA.GetAdaptationDataStr();
            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "ADAPTATION DATA================================");
            bridge.Log(Severity.Information, strVal);
        }

        public static printGameplayData(): void {
            let strVal: string = this.twoA.GetGameplayDataStr();
            bridge.Log(Severity.Information, "");
            bridge.Log(Severity.Information, "GAMEPLAY DATA================================");
            bridge.Log(Severity.Information, strVal);
        }
    }
}