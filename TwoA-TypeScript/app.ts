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
/// <reference path="TwoA/ScenarioNode.ts"/>
/// <reference path="TwoA/PlayerNode.ts"/>
/// <reference path="TwoA/BaseAdapter.ts"/>
///
/// <reference path="TwoA/KS/KSGenerator.ts"/>
/// <reference path="TwoA/KS/KStructure.ts"/>
/// <reference path="TwoA/KS/KSRank.ts"/>
/// <reference path="TwoA/KS/RankOrder.ts"/>
/// <reference path="TwoA/KS/Rank.ts"/>
/// <reference path="TwoA/KS/PCategory.ts"/>
/// <reference path="TwoA/KS/XML/XMLFactory.ts"/>
///
/// <reference path="Bridge.ts"/>
///

module TestPackage
{
    import AssetManager = AssetManagerPackage.AssetManager;
    import Severity = AssetPackage.Severity;

    import TwoA = TwoAPackage.TwoA;
    import ScenarioNode = TwoAPackage.ScenarioNode;
    import PlayerNode = TwoAPackage.PlayerNode;
    import BaseAdapter = TwoAPackage.BaseAdapter;

    import KSGenerator = TwoAPackage.KSGenerator;
    import KStructure = TwoAPackage.KStructure;
    import KSRank = TwoAPackage.KSRank;
    import RankOrder = TwoAPackage.RankOrder;
    import Rank = TwoAPackage.Rank;
    import PCategory = TwoAPackage.PCategory;
    import XMLFactory = TwoAPackage.XMLFactory;

    import Bridge = MyNameSpace.Bridge;

    let bridge: Bridge = new Bridge();

    window.onload = () => {
        //Tests.testingScenarioAndPlayerSetterAndGetters();

        //////////////////////////////////////////////////////////////

        Tests.testKnowledgeSpaceGeneration();

        //Tests.testingScoreCalculation();

        //Tests.demoAdaptationAndAssessment();

        //Tests.demoAdaptationAndAssessmentElo();
    };

    export class Tests
    {
        private static twoA: TwoA;

        public static demoAdaptationAndAssessmentElo(): void {
            let adaptID: string = "SkillDifficultyElo"; // [SC] Make sure to change the adaptation ID
            let gameID: string = "TileZero";
            let playerID: string = "Noob"; // [SC] using this player as an example
            let scenarioID: string = "Hard AI"; // [SC] using this scenario as an example
            let updateScenarioRatings: boolean = true;  // [SC] alwyas update scenario ratings
            let lastPlayed: string = BaseAdapter.DEFAULT_DATETIME;

            // [SC] instantiate the TwoA asset
            this.twoA = new TwoA();
            // [SC] setting bridge for logging purposes
            this.twoA.Bridge = bridge;

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Examples of adding scenario data into TwoA

            // [SC] Adding scenario data
            this.twoA.AddScenario(adaptID, gameID, "Very Easy AI", 1.2, 100, 0.0075, 0.01, lastPlayed, 900000);
            this.twoA.AddScenario(adaptID, gameID, "Easy AI", 1.4, 100, 0.0075, 0.01, lastPlayed, 900000);
            this.twoA.AddScenario(adaptID, gameID, "Medium Color AI", 1.6, 100, 0.0075, 0.01, lastPlayed, 900000);
            this.twoA.AddScenario(adaptID, gameID, "Medium Shape AI", 1.6, 100, 0.0075, 0.01, lastPlayed, 900000);
            let scenarioNode: ScenarioNode = this.twoA.AddScenario(adaptID, gameID, scenarioID, 6, 100, 0.0075, 0.01, lastPlayed, 900000); // [SC] Hard AI
            this.twoA.AddScenario(adaptID, gameID, "Very Hard AI", 10, 100, 0.0075, 0.01, lastPlayed, 900000);

            Tests.printMsg("\nExample scenario parameters:");
            Tests.printScenario(scenarioNode);

            ////// END: Examples of adding scenario data into TwoA
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Examples of adding player data into TwoA

            // [SC] adding a new player node
            let playerNode: PlayerNode = this.twoA.AddPlayer(adaptID, gameID, playerID, 5.5, 100, 0.0075, 0.01, lastPlayed);

            Tests.printMsg("\nExample player parameters:");
            Tests.printPlayer(playerNode);

            ////// END: Examples of adding player data into TwoA
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Demo of methods for requesting a recommended scenario

            Tests.printMsg("\nAsk 10 times for a recommended scenarios for the player " + playerID + "; P = 0.75: ");
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));                        // Case 1: directly return scenario ID
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));                        // Case 2: directly return scenario ID
            Tests.printMsg("    " + this.twoA.TargetScenario(playerNode).ScenarioID);               // Case 3: returns ScenarioNode
            Tests.printMsg("    " + this.twoA.TargetScenario(playerNode).ScenarioID);               // Case 4: returns ScenarioNode
            Tests.printMsg("    " + this.twoA.TargetScenarioCustom(playerNode, this.twoA.scenarios).ScenarioID);      // Case 5: provide a custom list of scenarios from which to choose; returns ScenarioNode
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));

            // [SC] Changing the success rate to P = 0.1. Player has only 10% chance of succeeding.
            // [SC] For more details on the success rate, refer to the "Methods for controlling success rate parameter." section in the API manual.
            // [SC] TwoA should recommend Very Hard AI in some cases.
            this.twoA.SetTargetDistribution(adaptID, 0.1, 0.05, 0.01, 0.35);
            Tests.printMsg("\nAsk 10 times for a recommended scenarios for the player " + playerID + "; P = 0.5: ");
            for (let i = 0; i < 10; i++) {
                Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            }

            ////// END: Demo of methods for requesting a recommended scenario
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Demo for requesting a recommended difficulty rating

            // [SC] set target success rate to P = 0.75
            this.twoA.SetTargetDistribution(adaptID, 0.75, 0.1, 0.5, 1.0); // [SC] this is the same as twoA.SetDefaultTargetDistribution(adaptID)
            let targetDifficultyRating: number = this.twoA.TargetDifficultyRating(playerNode);
            Tests.printMsg("\nRecommended difficulty rating " + targetDifficultyRating
                + " for player rating " + playerNode.Rating + " and success rate " + this.twoA.GetTargetDistribution(adaptID)[0]);

            // [SC] set target success rate to P = 0.1
            this.twoA.SetTargetDistribution(adaptID, 0.1, 0.05, 0.01, 0.35);
            targetDifficultyRating = this.twoA.TargetDifficultyRating(playerNode);
            Tests.printMsg("Recommended difficulty rating " + targetDifficultyRating
                + " for player rating " + playerNode.Rating + " and success rate " + this.twoA.GetTargetDistribution(adaptID)[0]);

            ////// END: Demo for requesting a recommended difficulty rating
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Demo for requesting a recommended difficulty rating

            let expectScore: number = this.twoA.CalculateExpectedScore(adaptID, playerNode.Rating, scenarioNode.Rating, 0);
            Tests.printMsg("\n1st simulated gameplay. Player's accuracy is 1.0. Expected accuracy is "
                + expectScore + ". Player rating increases and scenario rating decreases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 0, 1.0, updateScenarioRatings, 0); // [SC] any value of rt is automatically ignored
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            expectScore = this.twoA.CalculateExpectedScore(adaptID, playerNode.Rating, scenarioNode.Rating, 0);
            Tests.printMsg("\n2nd simulated gameplay. Player's accuracy is 0.75. Expected accuracy is "
                + expectScore + ". Player rating increases and scenario rating decreases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 0, 0.75, updateScenarioRatings, 0); // [SC] any value of rt is automatically ignored
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            expectScore = this.twoA.CalculateExpectedScore(adaptID, playerNode.Rating, scenarioNode.Rating, 0);
            Tests.printMsg("\n3rd simulated gameplay. Player's accuracy is 0.5. Expected accuracy is "
                + expectScore + ". Player rating increases slightly and scenario rating decreases slightly: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 0, 0.5, updateScenarioRatings, 0); // [SC] any value of rt is automatically ignored
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            expectScore = this.twoA.CalculateExpectedScore(adaptID, playerNode.Rating, scenarioNode.Rating, 0);
            Tests.printMsg("\n4th simulated gameplay. Player's accuracy is 0.25. Expected accuracy is "
                + expectScore + ". Player rating decreass and scenario rating increases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 0, 0.25, updateScenarioRatings, 0); // [SC] any value of rt is automatically ignored
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            expectScore = this.twoA.CalculateExpectedScore(adaptID, playerNode.Rating, scenarioNode.Rating, 0);
            Tests.printMsg("\n5th simulated gameplay. Player's accuracy is 0.0. Expected accuracy is "
                + expectScore + ". Player rating decreass and scenario rating increases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 0, 0.0, updateScenarioRatings, 0); // [SC] any value of rt is automatically ignored
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            Tests.printMsg("\n6th simulated gameplay. Using custom K factor to scale rating changes. Player rating increases and scenario rating decreases: ");
            let clonePlayerNode: PlayerNode = playerNode.ShallowClone();
            let cloneScenarioNode: ScenarioNode = scenarioNode.ShallowClone();
            this.twoA.UpdateRatings(playerNode, scenarioNode, 0, 0.75, updateScenarioRatings, 0); // [SC] as a contrast, use no custom K factor
            this.twoA.UpdateRatings(clonePlayerNode, cloneScenarioNode, 0, 0.75, updateScenarioRatings, 1); // [SC] use K factor of 10 for both player and scenario
            Tests.printMsg("    Player ID: " + playerNode.PlayerID);
            Tests.printMsg("    Rating: " + playerNode.Rating);
            Tests.printMsg("    K factor: " + playerNode.KFactor);
            Tests.printMsg("");
            Tests.printMsg("    Player ID (custom K factor): " + clonePlayerNode.PlayerID);
            Tests.printMsg("    Rating: " + clonePlayerNode.Rating);
            Tests.printMsg("    K factor: " + clonePlayerNode.KFactor);
            Tests.printMsg("");
            Tests.printMsg("    ScenarioID: " + scenarioNode.ScenarioID);
            Tests.printMsg("    Rating: " + scenarioNode.Rating);
            Tests.printMsg("    K factor: " + scenarioNode.KFactor);
            Tests.printMsg("");
            Tests.printMsg("    ScenarioID (custom K factor): " + cloneScenarioNode.ScenarioID);
            Tests.printMsg("    Rating: " + cloneScenarioNode.Rating);
            Tests.printMsg("    K factor: " + cloneScenarioNode.KFactor);

            ////// END: Demo for requesting a recommended difficulty rating
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Example output
            //Example scenario parameters:
            //    ScenarioID: Hard AI
            //    Rating: 6
            //    Play count: 100
            //    K factor: 0.0075
            //    Uncertainty: 0.01
            //    Last played: 2015 - 07 - 22T11: 56:17
            //    Time limit: 900000
            //
            //Example player parameters:
            //    PlayerID: Noob
            //    Rating: 5.5
            //    Play count: 100
            //    K factor: 0.0075
            //    Uncertainty: 0.01
            //    Last played: 2015 - 07 - 22T11: 56:17
            //
            //Ask 10 times for a recommended scenarios for the player Noob; P = 0.75:
            //    Medium Color AI
            //    Hard AI
            //    Medium Shape AI
            //    Medium Shape AI
            //    Very Easy AI
            //    Hard AI
            //    Hard AI
            //    Medium Color AI
            //    Hard AI
            //    Hard AI
            //
            //Ask 10 times for a recommended scenarios for the player Noob; P = 0.5: 
            //    Hard AI
            //    Hard AI
            //    Very Hard AI
            //    Very Hard AI
            //    Very Hard AI
            //    Very Hard AI
            //    Hard AI
            //    Very Hard AI
            //    Very Hard AI
            //    Hard AI
            //
            //Recommended difficulty rating 4.40138771133189 for player rating 5.5 and success rate 0.75
            //Recommended difficulty rating 7.69722457733622 for player rating 5.5 and success rate 0.1
            //
            //1st simulated gameplay.Player's accuracy is 1.0. Expected accuracy is 0.3775400516846862. Player rating increases and scenario rating decreases:
            //    PlayerID: Noob
            //    Rating: 5.520762929650993
            //    Play count: 101
            //    K factor: 0.03335625
            //    Uncertainty: 0.985
            //    Last played: 2017 - 11 - 06T09: 28:41
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.979237070349007
            //    Play count: 101
            //    K factor: 0.03335625
            //    Uncertainty: 0.985
            //    Last played: 2017 - 11 - 06T09: 28:41
            //    Time limit: 900000
            //
            //2nd simulated gameplay.Player's accuracy is 0.75. Expected accuracy is 0.3873472910477033. Player rating increases and scenario rating decreases:
            //    PlayerID: Noob
            //    Rating: 5.532621673233733
            //    Play count: 102
            //    K factor: 0.03269999999999999
            //    Uncertainty: 0.96
            //    Last played: 2017 - 11 - 06T09: 28:41
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.967378326766267
            //    Play count: 102
            //    K factor: 0.03269999999999999
            //    Uncertainty: 0.96
            //    Last played: 2017 - 11 - 06T09: 28:41
            //    Time limit: 900000
            //
            //3rd simulated gameplay.Player's accuracy is 0.5. Expected accuracy is 0.39299051581039013. Player rating increases slightly and scenario rating decreases slightly:
            //    PlayerID: Noob
            //    Rating: 5.5360506583927345
            //    Play count: 103
            //    K factor: 0.032043749999999996
            //    Uncertainty: 0.9349999999999999
            //    Last played: 2017 - 11 - 06T09: 28:41
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.9639493416072655
            //    Play count: 103
            //    K factor: 0.032043749999999996
            //    Uncertainty: 0.9349999999999999
            //    Last played: 2017 - 11 - 06T09: 28:41
            //    Time limit: 900000
            //
            //4th simulated gameplay.Player's accuracy is 0.25. Expected accuracy is 0.39462768121280367. Player rating decreass and scenario rating increases:
            //    PlayerID: Noob
            //    Rating: 5.5315111570486675
            //    Play count: 104
            //    K factor: 0.0313875
            //    Uncertainty: 0.9099999999999999
            //    Last played: 2017 - 11 - 06T09: 28:41
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.9684888429513325
            //    Play count: 104
            //    K factor: 0.0313875
            //    Uncertainty: 0.9099999999999999
            //    Last played: 2017 - 11 - 06T09: 28:41
            //    Time limit: 900000
            //
            //5th simulated gameplay.Player's accuracy is 0.0. Expected accuracy is 0.3924608141563093. Player rating decreass and scenario rating increases:
            //    PlayerID: Noob
            //    Rating: 5.519450345653627
            //    Play count: 105
            //    K factor: 0.030731249999999995
            //    Uncertainty: 0.8849999999999999
            //    Last played: 2017 - 11 - 06T09: 28:41
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.980549654346373
            //    Play count: 105
            //    K factor: 0.030731249999999995
            //    Uncertainty: 0.8849999999999999
            //    Last played: 2017 - 11 - 06T09: 28:41
            //    Time limit: 900000
            //
            //6th simulated gameplay.Using custom K factor to scale rating changes.Player rating increases and scenario rating decreases:
            //    Player ID: Noob
            //    Rating: 5.530375856455682
            //    K factor: 0.030074999999999998
            //
            //    Player ID (custom K factor): Noob
            //    Rating: 5.88272585029387
            //    K factor: 1
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.969624143544318
            //    K factor: 0.030074999999999998
            //
            //    ScenarioID(custom K factor): Hard AI
            //    Rating: 5.61727414970613
            //    K factor: 1
            //
            ////// END: Example output
            //////////////////////////////////////////////////////////////////////////////////////
        }

        public static demoAdaptationAndAssessment(): void {
            let adaptID: string = "Game difficulty - Player skill";
            let gameID: string = "TileZero";
            let playerID: string = "Noob"; // [SC] using this player as an example
            let scenarioID: string = "Hard AI"; // [SC] using this scenario as an example
            let updateScenarioRatings: boolean = true;  // [SC] alwyas update scenario ratings
            let lastPlayed: string = BaseAdapter.DEFAULT_DATETIME;

            // [SC] instantiate the TwoA asset
            this.twoA = new TwoA();
            // [SC] setting bridge for logging purposes
            this.twoA.Bridge = bridge;

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Examples of adding scenario data into TwoA

            // [SC] Scenario data is strored in 'TwoA.scenarios: ScenarioNode[]'. It has a public access modifier.
            // [SC] Each ScenarioNode instance contains data for a single scenario.
            // [SC] TwoA also provides predefined methods for adding new scenarios.
            // [SC] Methods in TwoA (cases 1 - 3) ensure that all values are valid and ID combination is unique to the scenario.
            // [SC] Excercise care if you add new scenario by directly accessing the 'TwoA.scenarios' variable. Make sure a combination of adapID, gameID, scenarioID is unique.

            // [SC] Adding scenario data, Case 1
            let scenarioOne: ScenarioNode = new ScenarioNode(adaptID, gameID, "Very Easy AI");
            scenarioOne.Rating = 1.2;
            scenarioOne.PlayCount = 100;
            scenarioOne.KFactor = 0.0075;
            scenarioOne.Uncertainty = 0.01;
            scenarioOne.LastPlayed = lastPlayed;
            scenarioOne.TimeLimit = 900000;
            if (this.twoA.AddScenarioNode(scenarioOne)) {
                Tests.printMsg("Very Easy AI was added successfully");
            }

            // [SC] Adding scenario data, Case 2:
            let scenarioTwo: ScenarioNode = this.twoA.AddScenario(adaptID, gameID, "Easy AI", 1.4, 100, 0.0075, 0.01, lastPlayed, 900000);
            let scenarioThree: ScenarioNode = this.twoA.AddScenario(adaptID, gameID, "Medium Color AI", 1.6, 100, 0.0075, 0.01, lastPlayed, 900000);

            // [SC] Adding scenario data, Case 3: scenario parameters will be assigned default values
            // [SC] Changing the default values
            let scenarioFour: ScenarioNode = this.twoA.AddScenarioDefault(adaptID, gameID, "Medium Shape AI");
            scenarioFour.Rating = 1.6;
            scenarioFour.PlayCount = 100;
            scenarioFour.KFactor = 0.0075;
            scenarioFour.Uncertainty = 0.01;
            scenarioFour.LastPlayed = lastPlayed;
            scenarioFour.TimeLimit = 900000;

            // [SC] Adding scenario data, Case 4:
            this.twoA.AddScenarioDefault(adaptID, gameID, scenarioID); // [SC] Hard AI
            this.twoA.SetScenarioRating(adaptID, gameID, scenarioID, 6);
            this.twoA.SetScenarioPlayCount(adaptID, gameID, scenarioID, 100);
            this.twoA.SetScenarioKFactor(adaptID, gameID, scenarioID, 0.0075);
            this.twoA.SetScenarioUncertainty(adaptID, gameID, scenarioID, 0.01);
            this.twoA.SetScenarioLastPlayed(adaptID, gameID, scenarioID, lastPlayed);
            this.twoA.SetScenarioTimeLimit(adaptID, gameID, scenarioID, 900000);

            // [SC] Adding scenario data, Case 5:
            let scenarioSix: ScenarioNode = new ScenarioNode(adaptID, gameID, "Very Hard AI");
            scenarioSix.Rating = 10;
            scenarioSix.PlayCount = 100;
            scenarioSix.KFactor = 0.0075;
            scenarioSix.Uncertainty = 0.01;
            scenarioSix.LastPlayed = lastPlayed;
            scenarioSix.TimeLimit = 900000;
            this.twoA.scenarios.push(scenarioSix);

            // [SC] Retrieveing a scenario node by scenario ID
            let scenarioNode: ScenarioNode = this.twoA.Scenario(adaptID, gameID, scenarioID);
            Tests.printMsg("\nExample scenario parameters:");
            Tests.printScenario(scenarioNode);

            ////// END: Examples of adding scenario data into TwoA
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Examples of adding player data into TwoA

            // [SC] Player data is strored in 'TwoA.players'. Its datatype is List<PlayerNode>. It has a public access modifier.
            // [SC] Similar to scenarios, predefined methods 'AddPlayer' are provided by the TwoA class.

            // [SC] adding a new player node
            this.twoA.AddPlayer(adaptID, gameID, playerID, 5.5, 100, 0.0075, 0.01, lastPlayed);

            // [SC] Retrieveing a player node by player ID
            let playerNode: PlayerNode = this.twoA.Player(adaptID, gameID, playerID);
            Tests.printMsg("\nExample player parameters:");
            Tests.printPlayer(playerNode);

            ////// END: Examples of adding player data into TwoA
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Demo of methods for requesting a recommended scenario

            // [SC] Demo of different methods for requesting a recommended scenario
            // [SC] By default, the success rate P = 0.75, this means that TwoA will recommend a scenario where player's probability of completing the scenario is 75%. 
            // [SC] For more details on the success rate, refer to the "Methods for controlling success rate parameter." section in the API manual.
            // [SC] Asking for the recommendations for the player 'Noob'.
            // [SC] Among 10 requests, the most frequent recommendation should be the scenario 'Hard AI'.
            // [SC] 'Hard AI' scenario is recommended since it has a rating closest to the player's rating
            Tests.printMsg("\nAsk 10 times for a recommended scenarios for the player " + playerID + "; P = 0.75: ");
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));                        // Case 1: directly return scenario ID
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));                        // Case 2: directly return scenario ID
            Tests.printMsg("    " + this.twoA.TargetScenario(playerNode).ScenarioID);               // Case 3: returns ScenarioNode
            Tests.printMsg("    " + this.twoA.TargetScenario(playerNode).ScenarioID);               // Case 4: returns ScenarioNode
            Tests.printMsg("    " + this.twoA.TargetScenarioCustom(playerNode, this.twoA.scenarios).ScenarioID);      // Case 5: provide a custom list of scenarios from which to choose; returns ScenarioNode
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));

            // [SC] Changing the success rate to P = 0.1. Player has only 10% chance of succeeding.
            // [SC] For more details on the success rate, refer to the "Methods for controlling success rate parameter." section in the API manual.
            // [SC] TwoA should recommend Very Hard AI in some cases.
            this.twoA.SetTargetDistribution(adaptID, 0.1, 0.05, 0.01, 0.35);
            Tests.printMsg("\nAsk 10 times for a recommended scenarios for the player " + playerID + "; P = 0.5: ");
            for (let i = 0; i < 10; i++) {
                Tests.printMsg("    " + this.twoA.TargetScenarioID(playerNode));
            }

            ////// END: Demo of methods for requesting a recommended scenario
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Demo for requesting a recommended difficulty rating

            // [SC] set target success rate to P = 0.75
            this.twoA.SetTargetDistribution(adaptID, 0.75, 0.1, 0.5, 1.0); // [SC] this is the same as twoA.SetDefaultTargetDistribution(adaptID)
            let targetDifficultyRating: number = this.twoA.TargetDifficultyRating(playerNode);
            Tests.printMsg("\nRecommended difficulty rating " + targetDifficultyRating
                + " for player rating " + playerNode.Rating + " and success rate " + this.twoA.GetTargetDistribution(adaptID)[0]);

            // [SC] set target success rate to P = 0.1
            this.twoA.SetTargetDistribution(adaptID, 0.1, 0.05, 0.01, 0.35);
            targetDifficultyRating = this.twoA.TargetDifficultyRating(playerNode);
            Tests.printMsg("Recommended difficulty rating " + targetDifficultyRating
                + " for player rating " + playerNode.Rating + " and success rate " + this.twoA.GetTargetDistribution(adaptID)[0]);

            ////// END: Demo for requesting a recommended difficulty rating
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Demo of methods for reassessing player and scenario ratings

            Tests.printMsg("\nFirst simulated gameplay. Player performed well. Player rating increases and scenario rating decreases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 120000, 1, updateScenarioRatings, 0); // [SC] passing PlayerNode and ScenarioNode instances
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            Tests.printMsg("\nSecond simulated gameplay. Player performed well again. Player rating increases and scenario rating decreases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 230000, 1, updateScenarioRatings, 0);
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            Tests.printMsg("\nThird simulated gameplay. Player performed poorly. Player rating decreass and scenario rating increases: ");
            this.twoA.UpdateRatings(playerNode, scenarioNode, 12000, 0, updateScenarioRatings, 0);
            Tests.printPlayer(playerNode);
            Tests.printMsg("");
            Tests.printScenario(scenarioNode);

            Tests.printMsg("\nFourth simulated gameplay. Using custom K factor to scale rating changes. Player rating increases and scenario rating decreases: ");
            let clonePlayerNode: PlayerNode = playerNode.ShallowClone();
            let cloneScenarioNode: ScenarioNode = scenarioNode.ShallowClone();
            this.twoA.UpdateRatings(playerNode, scenarioNode, 12000, 1, updateScenarioRatings, 0); // [SC] as a contrast, use no custom K factor
            this.twoA.UpdateRatings(clonePlayerNode, cloneScenarioNode, 12000, 1, updateScenarioRatings, 1); // [SC] use K factor of 10 for both player and scenario
            Tests.printMsg("    Player ID: " + playerNode.PlayerID);
            Tests.printMsg("    Rating: " + playerNode.Rating);
            Tests.printMsg("    K factor: " + playerNode.KFactor);
            Tests.printMsg("");
            Tests.printMsg("    Player ID (custom K factor): " + clonePlayerNode.PlayerID);
            Tests.printMsg("    Rating: " + clonePlayerNode.Rating);
            Tests.printMsg("    K factor: " + clonePlayerNode.KFactor);
            Tests.printMsg("");
            Tests.printMsg("    ScenarioID: " + scenarioNode.ScenarioID);
            Tests.printMsg("    Rating: " + scenarioNode.Rating);
            Tests.printMsg("    K factor: " + scenarioNode.KFactor);
            Tests.printMsg("");
            Tests.printMsg("    ScenarioID (custom K factor): " + cloneScenarioNode.ScenarioID);
            Tests.printMsg("    Rating: " + cloneScenarioNode.Rating);
            Tests.printMsg("    K factor: " + cloneScenarioNode.KFactor);

            ////// END: Demo of methods for reassessing player and scenario ratings
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: example output
            //Very Easy AI was added successfully
            //
            //Example scenario parameters:
            //    ScenarioID: Hard AI
            //    Rating: 6
            //    Play count: 100
            //    K factor: 0.0075
            //    Uncertainty: 0.01
            //    Last played: 2015 - 07 - 22T11: 56:17
            //    Time limit: 900000
            //
            //Example player parameters:
            //    PlayerID: Noob
            //    Rating: 5.5
            //    Play count: 100
            //    K factor: 0.0075
            //    Uncertainty: 0.01
            //    Last played: 2015 - 07 - 22T11: 56:17
            //
            //Ask 10 times for a recommended scenarios for the player Noob; P = 0.75:
            //    Hard AI
            //    Medium Shape AI
            //    Hard AI
            //    Hard AI
            //    Hard AI
            //    Hard AI
            //    Hard AI
            //    Hard AI
            //    Medium Shape AI
            //    Hard AI
            //
            //Ask 10 times for a recommended scenarios for the player Noob; P = 0.5:
            //    Very Hard AI
            //    Hard AI
            //    Very Hard AI
            //    Very Hard AI
            //    Hard AI
            //    Very Hard AI
            //    Very Hard AI
            //    Hard AI
            //    Hard AI
            //    Very Hard AI
            //
            //Recommended difficulty rating 4.40138771133189 for player rating 5.5 and success rate 0.75
            //Recommended difficulty rating 7.69722457733622 for player rating 5.5 and success rate 0.1
            //
            //First simulated gameplay.Player performed well.Player rating increases and scenario rating decreases:
            //    PlayerID: Noob
            //    Rating: 5.53437762105702
            //    Play count: 101
            //    K factor: 0.03335625
            //    Uncertainty: 0.985
            //    Last played: 2017 - 11 - 06T09: 49:15
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.96562237894298
            //    Play count: 101
            //    K factor: 0.03335625
            //    Uncertainty: 0.985
            //    Last played: 2017 - 11 - 06T09: 49:15
            //    Time limit: 900000
            //
            //Second simulated gameplay.Player performed well again.Player rating increases and scenario rating decreases:
            //    PlayerID: Noob
            //    Rating: 5.563364257332085
            //    Play count: 102
            //    K factor: 0.03269999999999999
            //    Uncertainty: 0.96
            //    Last played: 2017 - 11 - 06T09: 49:15
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.936635742667915
            //    Play count: 102
            //    K factor: 0.03269999999999999
            //    Uncertainty: 0.96
            //    Last played: 2017 - 11 - 06T09: 49:15
            //    Time limit: 900000
            //
            //Third simulated gameplay.Player performed poorly.Player rating decreass and scenario rating increases:
            //    PlayerID: Noob
            //    Rating: 5.535698213671098
            //    Play count: 103
            //    K factor: 0.032043749999999996
            //    Uncertainty: 0.9349999999999999
            //    Last played: 2017 - 11 - 06T09: 49:15
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.964301786328902
            //    Play count: 103
            //    K factor: 0.032043749999999996
            //    Uncertainty: 0.9349999999999999
            //    Last played: 2017 - 11 - 06T09: 49:15
            //    Time limit: 900000
            //
            //Fourth simulated gameplay.Using custom K factor to scale rating changes.Player rating increases and scenario rating decreases:
            //    Player ID: Noob
            //    Rating: 5.571097504420522
            //    K factor: 0.0313875
            //
            //    Player ID (custom K factor): Noob
            //    Rating: 6.663513132011972
            //    K factor: 1
            //
            //    ScenarioID: Hard AI
            //    Rating: 5.928902495579478
            //    K factor: 0.0313875
            //
            //    ScenarioID(custom K factor): Hard AI
            //    Rating: 4.836486867988028
            //    K factor: 1
            ////// END: example output
            //////////////////////////////////////////////////////////////////////////////////////
        }

        public static testingScoreCalculation(): void {
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

            // [SC] instantiate the TwoA asset
            this.twoA = new TwoA();
            // [SC] setting bridge for logging purposes
            this.twoA.Bridge = bridge;

            let maxItemDuration: number = 600000; // [SC] a player has max 10 min to solve a problem

            let responseTime: number = 30000; // [SC] assume the player spend only 30 seconds on the problem
            let correctAnswer: number = 1; // [SC] assume the player provided a correct response
            Tests.printMsg(
                "RT = " + responseTime + "; Response = " + correctAnswer + "; Score = " + this.twoA.CalculateScore(correctAnswer, responseTime, maxItemDuration)
            );

            responseTime = 540000; // [SC] assume the player spend 9 minutes to provide a correct response
            Tests.printMsg(
                "RT = " + responseTime + "; Response = " + correctAnswer + "; Score = " + this.twoA.CalculateScore(correctAnswer, responseTime, maxItemDuration)
            );

            correctAnswer = 0; // [SC] assume the player spent 9 minutes to provided an incorrect response
            Tests.printMsg(
                "RT = " + responseTime + "; Response = " + correctAnswer + "; Score = " + this.twoA.CalculateScore(correctAnswer, responseTime, maxItemDuration) 
            );

            responseTime = 30000; // [SC] assume the player spend only 30 seconds and provided incorrect response
            Tests.printMsg(
                "RT = " + responseTime + "; Response = " + correctAnswer + "; Score = " + this.twoA.CalculateScore(correctAnswer, responseTime, maxItemDuration)
            );

            responseTime = 600000; // [SC] assume time limit was reached
            correctAnswer = 0; // [SC] answer does not matter
            Tests.printMsg(
                "RT = " + responseTime + "; Response = " + correctAnswer + "; Score = " + this.twoA.CalculateScore(correctAnswer, responseTime, maxItemDuration)
            );
            correctAnswer = 1; // [SC] answer does not matter
            Tests.printMsg(
                "RT = " + responseTime + "; Response = " + correctAnswer + "; Score = " + this.twoA.CalculateScore(correctAnswer, responseTime, maxItemDuration)
            );

            ////////////////////////////////////////////////////////////////////
            // [SC] expected output at Console and Debug window
            //
            // RT = 30000;  Response = 1; Score = 0.95.
            // RT = 540000; Response = 1; Score = 0.1. (approximately or 0.09999999999999998)
            // RT = 540000; Response = 0; Score = -0.1. (approximately or -0.09999999999999998)
            // RT = 30000;  Response = 0; Score = -0.95.
            //
            // RT = 600000; Response = 0; Score = 0.
            // RT = 600000; Response = 1; Score = 0.
        }

        public static testKnowledgeSpaceGeneration(): void {
            // [SC] instantiate the TwoA asset
            this.twoA = new TwoA();
            // [SC] setting bridge for logging purposes
            this.twoA.Bridge = bridge;

            // [SC] creating an instance of knowledge structure generator
            let ksg: KSGenerator = new KSGenerator(null, 0.4);

            // [SC] creating a list of rated categories that will be used to generate a knowledge structure
            // [SC] a category represents a set of problems/scenarios that have same difficulty and structure
            let categories: PCategory[] = new Array<PCategory>();
            categories.push(new PCategory("a", 3.391156));
            categories.push(new PCategory("b", 24.182423));
            categories.push(new PCategory("c", 24.313351));
            categories.push(new PCategory("d", 32.193103));
            categories.push(new PCategory("e", 35.618040));
            categories.push(new PCategory("f", 37.046992));
            categories.push(new PCategory("g", 45.166948));

            // [SC] first step is to create a rank order from the list of categories
            let ro: RankOrder = ksg.createRankOrderFromCats(categories);

            // [SC] second step is to create a knowledge structure using previsouly created rank order
            let ks: KStructure = ksg.createKStructure(ro);

            // [SC] third optional step is to create an expanded knowledge structure by identifying additional knowledge states
            let ksExpand: KStructure = ksg.createKStructure(ro);
            ksg.createExpandedKStructure(ksExpand);

            //////////////////////////////////////////////////////////////////////////////////////////////
            // [SC] note that KStructure object can be serialized into an XML format
            
            // [SC] first, create XML factory singleton
            let xmlFct: XMLFactory = XMLFactory.Instance;
            xmlFct.asset = this.twoA;
            // [SC] next, creating XML document from KStructue object
            let xmlDoc: Document = xmlFct.createXml(ks);
            // [SC] XML document can be further serialized into a string (e.g., to store in a file)
            let xmlTxt: string = xmlFct.serialize(xmlDoc);
            // [SC] finally, XML document can be deserialized into a KStructure object
            let deserKS: KStructure = xmlFct.createKStructure(xmlDoc);
            
            //////////////////////////////////////////////////////////////////////////////////////////////
            // [SC] to visualize results, printing RankOrder, KStructure and XML objects into console diagnostic window

            // [SC] printing the rank order
            Tests.printMsg("======================================");
            Tests.printMsg("Traversing ranks in rank order:\n");
            for (let rankCounter = 0; rankCounter < ro.getRankCount(); rankCounter++) {
                let rank: Rank = ro.getRankAt(rankCounter);

                Tests.printMsg("Current rank: " + rank.RankIndex);

                for (let catCounter = 0; catCounter < rank.getCategoryCount(); catCounter++) {
                    let category: PCategory = rank.getCategoryAt(catCounter);

                    Tests.printMsg("   Category: " + category.Id + "; Rating: " + category.Rating);
                }
            }

            // [SC] printing the knowledge structure
            // [SC] note that all knowledge states in unexpanded knowledge structure have the type of 'core'
            Tests.printMsg("\n======================================");
            Tests.printMsg("Traversing knowledge states in the unexpanded knowledge structure:\n");
            for(let rank of ks.getRanks()) {
                Tests.printMsg("Rank " + rank.RankIndex);
                for(let state of rank.getStates()) {
                    Tests.printMsg("    Current state: " + state.ToString() + "; State type: " + state.StateType + "; State ID: " + state.Id);
                    for(let prevState of state.getPrevStates()) {
                        Tests.printMsg("        Prev state: " + prevState.ToString());
                    }
                    for(let nextState of state.getNextStates()) {
                        Tests.printMsg("        Next state: " + nextState.ToString());
                    }
                }
            }

            // [SC] printing the expanded knowledge structure
            // [SC] note that all new states added to the expanded structure have the type of 'expanded'
            Tests.printMsg("\n======================================");
            Tests.printMsg("Traversing knowledge states in the expanded knowledge structure:\n");
            for(let rank of ksExpand.getRanks()) {
                Tests.printMsg("Rank " + rank.RankIndex);
                for(let state of rank.getStates()) {
                    Tests.printMsg("    Current state: " + state.ToString() + "; State type: " + state.StateType + "; State ID: " + state.Id);
                    for(let prevState of state.getPrevStates()) {
                        Tests.printMsg("        Prev state: " + prevState.ToString());
                    }
                    for(let nextState of state.getNextStates()) {
                        Tests.printMsg("        Next state: " + nextState.ToString());
                    }
                }
            }

            // [SC] printing the xml document
            // [SC] the XML document consists of three main elements:
            //  - PCategories: this element contains a list of rated categories
            //  - RankOrder: this element contains deserialization of the RankOrder object that was used to create the knowledge structure
            //  - KStructure: this element contains the deserialization of the knowledge structure
            Tests.printMsg("\n======================================");
            Tests.printMsg("The XML document:\n");
            Tests.printMsg(xmlTxt);

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: example output
            //======================================
            //Traversing ranks in rank order:
            //
            //Current rank: 1
            //   Category: a; Rating: 3.391156
            //Current rank: 2
            //   Category: b; Rating: 24.182423
            //   Category: c; Rating: 24.313351
            //Current rank: 3
            //   Category: d; Rating: 32.193103
            //Current rank: 4
            //   Category: e; Rating: 35.61804
            //   Category: f; Rating: 37.046992
            //Current rank: 5
            //   Category: g; Rating: 45.166948
            //
            //======================================
            //Traversing knowledge states in the unexpanded knowledge structure:
            //
            //Rank 0
            //    Current state: (); State type: root; State ID: S0.1
            //        Next state: (a)
            //Rank 1
            //    Current state: (a); State type: core; State ID: S1.1
            //        Prev state: ()
            //        Next state: (a,b)
            //        Next state: (a,c)
            //Rank 2
            //    Current state: (a,b); State type: core; State ID: S2.1
            //        Prev state: (a)
            //        Next state: (a,b,c)
            //    Current state: (a,c); State type: core; State ID: S2.2
            //        Prev state: (a)
            //        Next state: (a,b,c)
            //Rank 3
            //    Current state: (a,b,c); State type: core; State ID: S3.1
            //        Prev state: (a,b)
            //        Prev state: (a,c)
            //        Next state: (a,b,c,d)
            //Rank 4
            //    Current state: (a,b,c,d); State type: core; State ID: S4.1
            //        Prev state: (a,b,c)
            //        Next state: (a,b,c,d,e)
            //        Next state: (a,b,c,d,f)
            //Rank 5
            //    Current state: (a,b,c,d,e); State type: core; State ID: S5.1
            //        Prev state: (a,b,c,d)
            //        Next state: (a,b,c,d,e,f)
            //    Current state: (a,b,c,d,f); State type: core; State ID: S5.2
            //        Prev state: (a,b,c,d)
            //        Next state: (a,b,c,d,e,f)
            //Rank 6
            //    Current state: (a,b,c,d,e,f); State type: core; State ID: S6.1
            //        Prev state: (a,b,c,d,e)
            //        Prev state: (a,b,c,d,f)
            //        Next state: (a,b,c,d,e,f,g)
            //Rank 7
            //    Current state: (a,b,c,d,e,f,g); State type: core; State ID: S7.1
            //        Prev state: (a,b,c,d,e,f)
            //
            //======================================
            //Traversing knowledge states in the expanded knowledge structure:
            //Rank 0
            //    Current state: (); State type: root; State ID: S0.1
            //        Next state: (a)
            //Rank 1
            //    Current state: (a); State type: core; State ID: S1.1
            //        Prev state: ()
            //        Next state: (a,b)
            //        Next state: (a,c)
            //Rank 2
            //    Current state: (a,b); State type: core; State ID: S2.1
            //        Prev state: (a)
            //        Next state: (a,b,c)
            //        Next state: (a,b,d)
            //    Current state: (a,c); State type: core; State ID: S2.2
            //        Prev state: (a)
            //        Next state: (a,b,c)
            //        Next state: (a,c,d)
            //Rank 3
            //    Current state: (a,b,c); State type: core; State ID: S3.1
            //        Prev state: (a,b)
            //        Prev state: (a,c)
            //        Next state: (a,b,c,d)
            //    Current state: (a,b,d); State type: expanded; State ID: S3.2
            //        Prev state: (a,b)
            //        Next state: (a,b,c,d)
            //        Next state: (a,b,d,e)
            //        Next state: (a,b,d,f)
            //    Current state: (a,c,d); State type: expanded; State ID: S3.3
            //        Prev state: (a,c)
            //        Next state: (a,b,c,d)
            //        Next state: (a,c,d,e)
            //        Next state: (a,c,d,f)
            //Rank 4
            //    Current state: (a,b,c,d); State type: core; State ID: S4.1
            //        Prev state: (a,b,c)
            //        Prev state: (a,b,d)
            //        Prev state: (a,c,d)
            //        Next state: (a,b,c,d,e)
            //        Next state: (a,b,c,d,f)
            //    Current state: (a,b,d,e); State type: expanded; State ID: S4.2
            //        Prev state: (a,b,d)
            //        Next state: (a,b,c,d,e)
            //        Next state: (a,b,d,e,f)
            //        Next state: (a,b,d,e,g)
            //    Current state: (a,c,d,e); State type: expanded; State ID: S4.3
            //        Prev state: (a,c,d)
            //        Next state: (a,b,c,d,e)
            //        Next state: (a,c,d,e,f)
            //        Next state: (a,c,d,e,g)
            //    Current state: (a,b,d,f); State type: expanded; State ID: S4.4
            //        Prev state: (a,b,d)
            //        Next state: (a,b,c,d,f)
            //        Next state: (a,b,d,e,f)
            //        Next state: (a,b,d,f,g)
            //    Current state: (a,c,d,f); State type: expanded; State ID: S4.5
            //        Prev state: (a,c,d)
            //        Next state: (a,b,c,d,f)
            //        Next state: (a,c,d,e,f)
            //        Next state: (a,c,d,f,g)
            //Rank 5
            //    Current state: (a,b,c,d,e); State type: core; State ID: S5.1
            //        Prev state: (a,b,c,d)
            //        Prev state: (a,b,d,e)
            //        Prev state: (a,c,d,e)
            //        Next state: (a,b,c,d,e,f)
            //        Next state: (a,b,c,d,e,g)
            //    Current state: (a,b,c,d,f); State type: core; State ID: S5.2
            //        Prev state: (a,b,c,d)
            //        Prev state: (a,b,d,f)
            //        Prev state: (a,c,d,f)
            //        Next state: (a,b,c,d,e,f)
            //        Next state: (a,b,c,d,f,g)
            //    Current state: (a,b,d,e,f); State type: expanded; State ID: S5.3
            //        Prev state: (a,b,d,e)
            //        Prev state: (a,b,d,f)
            //        Next state: (a,b,c,d,e,f)
            //        Next state: (a,b,d,e,f,g)
            //    Current state: (a,c,d,e,f); State type: expanded; State ID: S5.4
            //        Prev state: (a,c,d,e)
            //        Prev state: (a,c,d,f)
            //        Next state: (a,b,c,d,e,f)
            //        Next state: (a,c,d,e,f,g)
            //    Current state: (a,b,d,e,g); State type: expanded; State ID: S5.5
            //        Prev state: (a,b,d,e)
            //        Next state: (a,b,c,d,e,g)
            //        Next state: (a,b,d,e,f,g)
            //    Current state: (a,c,d,e,g); State type: expanded; State ID: S5.6
            //        Prev state: (a,c,d,e)
            //        Next state: (a,b,c,d,e,g)
            //        Next state: (a,c,d,e,f,g)
            //    Current state: (a,b,d,f,g); State type: expanded; State ID: S5.7
            //        Prev state: (a,b,d,f)
            //        Next state: (a,b,c,d,f,g)
            //        Next state: (a,b,d,e,f,g)
            //    Current state: (a,c,d,f,g); State type: expanded; State ID: S5.8
            //        Prev state: (a,c,d,f)
            //        Next state: (a,b,c,d,f,g)
            //        Next state: (a,c,d,e,f,g)
            //Rank 6
            //    Current state: (a,b,c,d,e,f); State type: core; State ID: S6.1
            //        Prev state: (a,b,c,d,e)
            //        Prev state: (a,b,c,d,f)
            //        Prev state: (a,b,d,e,f)
            //        Prev state: (a,c,d,e,f)
            //        Next state: (a,b,c,d,e,f,g)
            //    Current state: (a,b,c,d,e,g); State type: expanded; State ID: S6.2
            //        Prev state: (a,b,c,d,e)
            //        Prev state: (a,b,d,e,g)
            //        Prev state: (a,c,d,e,g)
            //        Next state: (a,b,c,d,e,f,g)
            //    Current state: (a,b,c,d,f,g); State type: expanded; State ID: S6.3
            //        Prev state: (a,b,c,d,f)
            //        Prev state: (a,b,d,f,g)
            //        Prev state: (a,c,d,f,g)
            //        Next state: (a,b,c,d,e,f,g)
            //    Current state: (a,b,d,e,f,g); State type: expanded; State ID: S6.4
            //        Prev state: (a,b,d,e,f)
            //        Prev state: (a,b,d,e,g)
            //        Prev state: (a,b,d,f,g)
            //        Next state: (a,b,c,d,e,f,g)
            //    Current state: (a,c,d,e,f,g); State type: expanded; State ID: S6.5
            //        Prev state: (a,c,d,e,f)
            //        Prev state: (a,c,d,e,g)
            //        Prev state: (a,c,d,f,g)
            //        Next state: (a,b,c,d,e,f,g)
            //Rank 7
            //    Current state: (a,b,c,d,e,f,g); State type: core; State ID: S7.1
            //        Prev state: (a,b,c,d,e,f)
            //        Prev state: (a,b,c,d,e,g)
            //        Prev state: (a,b,c,d,f,g)
            //        Prev state: (a,b,d,e,f,g)
            //        Prev state: (a,c,d,e,f,g)
            //
            //======================================
            //The XML document:
            //
            //<?xml version="1.0" encoding="utf-8" standalone="yes"?>
            //<TwoA xmlns="https://github.com/rageappliedgame/HatAsset" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            //  <PCategories xmlns="">
            //      <PCategory xsd:id="a">
            //          <Rating>3.391156</Rating>
            //      </PCategory>
            //      <PCategory xsd:id="b">
            //          <Rating>24.182423</Rating>
            //      </PCategory>
            //      <PCategory xsd:id="c">
            //          <Rating>24.313351</Rating>
            //      </PCategory>
            //      <PCategory xsd:id="d">
            //          <Rating>32.193103</Rating>
            //      </PCategory>
            //      <PCategory xsd:id="e">
            //          <Rating>35.61804</Rating>
            //      </PCategory>
            //      <PCategory xsd:id="f">
            //          <Rating>37.046992</Rating>
            //      </PCategory>
            //      <PCategory xsd:id="g">
            //          <Rating>45.166948</Rating>
            //      </PCategory>
            //  </PCategories>
            //  <RankOrder xmlns="">
            //      <Params>
            //          <Threshold>0.4</Threshold>
            //      </Params>
            //      <Ranks>
            //          <Rank Index="1">
            //              <PCategory xsd:idref="a"/>
            //          </Rank>
            //          <Rank Index="2">
            //              <PCategory xsd:idref="b"/>
            //              <PCategory xsd:idref="c"/>
            //          </Rank>
            //          <Rank Index="3">
            //              <PCategory xsd:idref="d"/>
            //          </Rank>
            //          <Rank Index="4">
            //              <PCategory xsd:idref="e"/>
            //              <PCategory xsd:idref="f"/>
            //          </Rank>
            //          <Rank Index="5">
            //              <PCategory xsd:idref="g"/>
            //          </Rank>
            //      </Ranks>
            //  </RankOrder>
            //  <KStructure xmlns="">
            //      <KSRank Index="0">
            //          <KState xsd:id="S0.1" Type="root">
            //              <PCategories/>
            //              <PreviousStates/>
            //              <NextStates>
            //                  <KState xsd:idref="S1.1"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="1">
            //          <KState xsd:id="S1.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S0.1"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S2.1"/>
            //                  <KState xsd:idref="S2.2"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="2">
            //          <KState xsd:id="S2.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S1.1"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S3.1"/>
            //              </NextStates>
            //          </KState>
            //          <KState xsd:id="S2.2" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="c"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S1.1"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S3.1"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="3">
            //          <KState xsd:id="S3.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //                  <PCategory xsd:idref="c"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S2.1"/>
            //                  <KState xsd:idref="S2.2"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S4.1"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="4">
            //          <KState xsd:id="S4.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //                  <PCategory xsd:idref="c"/>
            //                  <PCategory xsd:idref="d"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S3.1"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S5.1"/>
            //                  <KState xsd:idref="S5.2"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="5">
            //          <KState xsd:id="S5.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //                  <PCategory xsd:idref="c"/>
            //                  <PCategory xsd:idref="d"/>
            //                  <PCategory xsd:idref="e"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S4.1"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S6.1"/>
            //              </NextStates>
            //          </KState>
            //          <KState xsd:id="S5.2" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //                  <PCategory xsd:idref="c"/>
            //                  <PCategory xsd:idref="d"/>
            //                  <PCategory xsd:idref="f"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S4.1"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S6.1"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="6">
            //          <KState xsd:id="S6.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //                  <PCategory xsd:idref="c"/>
            //                  <PCategory xsd:idref="d"/>
            //                  <PCategory xsd:idref="e"/>
            //                  <PCategory xsd:idref="f"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S5.1"/>
            //                  <KState xsd:idref="S5.2"/>
            //              </PreviousStates>
            //              <NextStates>
            //                  <KState xsd:idref="S7.1"/>
            //              </NextStates>
            //          </KState>
            //      </KSRank>
            //      <KSRank Index="7">
            //          <KState xsd:id="S7.1" Type="core">
            //              <PCategories>
            //                  <PCategory xsd:idref="a"/>
            //                  <PCategory xsd:idref="b"/>
            //                  <PCategory xsd:idref="c"/>
            //                  <PCategory xsd:idref="d"/>
            //                  <PCategory xsd:idref="e"/>
            //                  <PCategory xsd:idref="f"/>
            //                  <PCategory xsd:idref="g"/>
            //              </PCategories>
            //              <PreviousStates>
            //                  <KState xsd:idref="S6.1"/>
            //              </PreviousStates>
            //              <NextStates/>
            //          </KState>
            //      </KSRank>
            //  </KStructure>
            //</TwoA>
            ////// END: example output
            //////////////////////////////////////////////////////////////////////////////////////
        }

        public static testingScenarioAndPlayerSetterAndGetters(): void {
            let adaptID: string = "Game difficulty - Player skill";
            let gameID: string = "TileZero";
            let playerID: string = "Noob"; // [SC] using this player as an example
            let scenarioID: string = "Hard AI"; // [SC] using this scenario as an example
            let updateScenarioRatings: boolean = true;  // [SC] alwyas update scenario ratings
            let lastPlayed: string = BaseAdapter.DEFAULT_DATETIME;

            // [SC] instantiate the TwoA asset
            this.twoA = new TwoA();
            // [SC] setting bridge for logging purposes
            this.twoA.Bridge = bridge;

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Examples of adding player data into TwoA

            // [SC] Adding player data, Case 1
            let playerOne: PlayerNode = new PlayerNode(adaptID, gameID, "Very Easy Player");
            playerOne.Rating = 1;
            playerOne.PlayCount = 11;
            playerOne.KFactor = 0.0111;
            playerOne.Uncertainty = 0.1111;
            playerOne.LastPlayed = "1111.11.11";
            if (this.twoA.AddPlayerNode(playerOne)) {
                Tests.printMsg("Very Easy Player was added successfully");
            }

            // [SC] Adding player data, Case 2:
            let playerTwo: PlayerNode = this.twoA.AddPlayer(adaptID, gameID, "Easy Player", 2, 22, 0.0222, 0.2222, "2222.22.22");
            let playerThree: PlayerNode = this.twoA.AddPlayer(adaptID, gameID, "Medium Color Player", 3, 33, 0.0333, 0.3333, "3333.33.33");

            // [SC] Adding player data, Case 3: player parameters will be assigned default values
            // [SC] Changing the default values
            let playerFour: PlayerNode = this.twoA.AddPlayerDefault(adaptID, gameID, "Medium Shape Player");
            playerFour.Rating = 4;
            playerFour.PlayCount = 44;
            playerFour.KFactor = 0.0444;
            playerFour.Uncertainty = 0.4444;
            playerFour.LastPlayed = "4444.44.44";

            // [SC] Adding player data, Case 4:
            this.twoA.AddPlayerDefault(adaptID, gameID, playerID); // [SC] Hard Player
            this.twoA.SetPlayerRating(adaptID, gameID, playerID, 5);
            this.twoA.SetPlayerPlayCount(adaptID, gameID, playerID, 55);
            this.twoA.SetPlayerKFactor(adaptID, gameID, playerID, 0.0555);
            this.twoA.SetPlayerUncertainty(adaptID, gameID, playerID, 0.5555);
            this.twoA.SetPlayerLastPlayed(adaptID, gameID, playerID, "5555.55.55");

            // [SC] Adding player data, Case 5:
            let playerSix: PlayerNode = new PlayerNode(adaptID, gameID, "Very Hard Player");
            playerSix.Rating = 6;
            playerSix.PlayCount = 666;
            playerSix.KFactor = 0.0666;
            playerSix.Uncertainty = 0.6666;
            playerSix.LastPlayed = "6666.66.66";
            this.twoA.players.push(playerSix);

            // [SC] trying to add a player node with invalid values
            let playerSeven: PlayerNode = new PlayerNode(adaptID, gameID, "Invalid player");
            playerSeven.Rating = 999;
            playerSeven.PlayCount = 0;
            playerSeven.KFactor = -0.99;
            playerSeven.Uncertainty = -0.99;
            playerSeven.LastPlayed = "";
            this.twoA.AddPlayerNode(playerSeven);

            // [SC] Retrieveing a player node by player ID
            let tPlayerNode: PlayerNode = this.twoA.Player(adaptID, gameID, playerID);
            Tests.printPlayer(tPlayerNode);

            Tests.printMsg("============= Player listing start");
            let players: PlayerNode[] = this.twoA.AllPlayers(adaptID, gameID);
            for (let tPlayer of players) {
                Tests.printPlayer(tPlayer);
            }
            Tests.printMsg("============= Player listing end");

            // [SC] testing if invalid values can be assigned to players
            playerSix.PlayCount = -1;
            playerSix.KFactor = -0.0666;
            playerSix.Uncertainty = -0.6666;
            playerSix.LastPlayed = "";
            Tests.printPlayer(playerSix);

            playerSix.PlayCount = -1;
            playerSix.KFactor = -0.0666;
            playerSix.Uncertainty = -0.6666;
            playerSix.LastPlayed = null;
            Tests.printPlayer(playerSix);

            // [SC] testing TwoA player getters
            Tests.printMsg("TwoA player getter tests:");
            Tests.printMsg("    Rating: " + this.twoA.GetPlayerRating(adaptID, gameID, playerID));
            Tests.printMsg("    Play count: " + this.twoA.GetPlayerPlayCount(adaptID, gameID, playerID));
            Tests.printMsg("    K factor: " + this.twoA.GetPlayerKFactor(adaptID, gameID, playerID));
            Tests.printMsg("    Uncertainty: " + this.twoA.GetPlayerUncertainty(adaptID, gameID, playerID));
            Tests.printMsg("    Last played: " + this.twoA.GetPlayerLastPlayed(adaptID, gameID, playerID));

            // [SC] testing TwoA player setters with valid values
            Tests.printMsg("TwoA player setter tests with valid values:");
            this.twoA.SetPlayerRating(adaptID, gameID, playerID, 7);
            this.twoA.SetPlayerPlayCount(adaptID, gameID, playerID, 77);
            this.twoA.SetPlayerKFactor(adaptID, gameID, playerID, 0.777);
            this.twoA.SetPlayerUncertainty(adaptID, gameID, playerID, 0.7777);
            this.twoA.SetPlayerLastPlayed(adaptID, gameID, playerID, "7777.77.77");
            Tests.printPlayerById(adaptID, gameID, playerID);

            // [SC] testing TwoA player setters with invalid values
            Tests.printMsg("TwoA player setter tests with invalid values:");
            this.twoA.SetPlayerRating(adaptID, gameID, playerID, -1);
            this.twoA.SetPlayerKFactor(adaptID, gameID, playerID, -0.777);
            this.twoA.SetPlayerUncertainty(adaptID, gameID, playerID, -0.7777);
            this.twoA.SetPlayerLastPlayed(adaptID, gameID, playerID, "");
            this.twoA.SetPlayerLastPlayed(adaptID, gameID, playerID, null);
            Tests.printPlayerById(adaptID, gameID, playerID);

            // [SC] player getter calls with invalid params
            this.twoA.Player(adaptID, gameID, "dsagdjahsdgahsd");
            this.twoA.Player(adaptID, "dasd", playerID);
            this.twoA.Player("dsadsadsa", gameID, playerID);
            this.twoA.Player("", gameID, playerID);
            this.twoA.Player(adaptID, gameID, null);

            // [SC] all players getter call with invalid params
            this.twoA.AllPlayers("dsadasd", gameID);
            this.twoA.AllPlayers(adaptID, null);

            // [SC] remove invalid player node
            Tests.printMsg("Removing invalid player node.");
            this.twoA.RemovePlayerNode(playerSeven);
            Tests.printMsg("============= Player listing start");
            players = this.twoA.AllPlayers(adaptID, gameID);
            for (let tPlayer of players) {
                Tests.printPlayer(tPlayer);
            }
            Tests.printMsg("============= Player listing end");

            // [SC] remove very easy player node
            Tests.printMsg("Removing very easy player node.");
            this.twoA.RemovePlayerNode(playerOne);
            Tests.printMsg("============= Player listing start");
            players = this.twoA.AllPlayers(adaptID, gameID);
            for (let tPlayer of players) {
                Tests.printPlayer(tPlayer);
            }
            Tests.printMsg("============= Player listing end");

            ////// END: Examples of adding player data into TwoA
            //////////////////////////////////////////////////////////////////////////////////////

            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Examples of adding scenario data into TwoA

            // [SC] Scenario data is strored in 'TwoA.scenarios: ScenarioNode[]'. It has a public access modifier.
            // [SC] Each ScenarioNode instance contains data for a single scenario.
            // [SC] TwoA also provides predefined methods for adding new scenarios.
            // [SC] Methods in TwoA (cases 1 - 3) ensure that all values are valid and ID combination is unique to the scenario.
            // [SC] Excercise care if you add new scenario by directly accessing the 'TwoA.scenarios' variable. Make sure a combination of adapID, gameID, scenarioID is unique.

            // [SC] Adding scenario data, Case 1
            let scenarioOne: ScenarioNode = new ScenarioNode(adaptID, gameID, "Very Easy AI");
            scenarioOne.Rating = 1;
            scenarioOne.PlayCount = 11;
            scenarioOne.KFactor = 0.0111;
            scenarioOne.Uncertainty = 0.1111;
            scenarioOne.LastPlayed = "1111.11.11";
            scenarioOne.TimeLimit = 11111;
            if (this.twoA.AddScenarioNode(scenarioOne)) {
                Tests.printMsg("Very Easy AI was added successfully");
            }

            // [SC] Adding scenario data, Case 2:
            let scenarioTwo: ScenarioNode = this.twoA.AddScenario(adaptID, gameID, "Easy AI", 2, 22, 0.0222, 0.2222, "2222.22.22", 22222);
            let scenarioThree: ScenarioNode = this.twoA.AddScenario(adaptID, gameID, "Medium Color AI", 3, 33, 0.0333, 0.3333, "3333.33.33", 33333);

            // [SC] Adding scenario data, Case 3: scenario parameters will be assigned default values
            // [SC] Changing the default values
            let scenarioFour: ScenarioNode = this.twoA.AddScenarioDefault(adaptID, gameID, "Medium Shape AI");
            scenarioFour.Rating = 4;
            scenarioFour.PlayCount = 44;
            scenarioFour.KFactor = 0.0444;
            scenarioFour.Uncertainty = 0.4444;
            scenarioFour.LastPlayed = "4444.44.44";
            scenarioFour.TimeLimit = 44444;

            // [SC] Adding scenario data, Case 4:
            this.twoA.AddScenarioDefault(adaptID, gameID, scenarioID); // [SC] Hard AI
            this.twoA.SetScenarioRating(adaptID, gameID, scenarioID, 5);
            this.twoA.SetScenarioPlayCount(adaptID, gameID, scenarioID, 55);
            this.twoA.SetScenarioKFactor(adaptID, gameID, scenarioID, 0.0555);
            this.twoA.SetScenarioUncertainty(adaptID, gameID, scenarioID, 0.5555);
            this.twoA.SetScenarioLastPlayed(adaptID, gameID, scenarioID, "5555.55.55");
            this.twoA.SetScenarioTimeLimit(adaptID, gameID, scenarioID, 55555);

            // [SC] Adding scenario data, Case 5:
            let scenarioSix: ScenarioNode = new ScenarioNode(adaptID, gameID, "Very Hard AI");
            scenarioSix.Rating = 6;
            scenarioSix.PlayCount = 666;
            scenarioSix.KFactor = 0.0666;
            scenarioSix.Uncertainty = 0.6666;
            scenarioSix.LastPlayed = "6666.66.66";
            scenarioSix.TimeLimit = 66666;
            this.twoA.scenarios.push(scenarioSix);

            // [SC] trying to add a scenario node with invalid values
            let scenarioSeven: ScenarioNode = new ScenarioNode(adaptID, gameID, "Invalid scenario");
            scenarioSeven.Rating = 999;
            scenarioSeven.PlayCount = 0;
            scenarioSeven.KFactor = -0.99;
            scenarioSeven.Uncertainty = -0.99;
            scenarioSeven.LastPlayed = "";
            scenarioSeven.TimeLimit = -1;
            this.twoA.AddScenarioNode(scenarioSeven);

            // [SC] Retrieveing a scenario node by scenario ID
            let tScenarioNode: ScenarioNode = this.twoA.Scenario(adaptID, gameID, scenarioID);
            Tests.printScenario(tScenarioNode);

            let scenarios: ScenarioNode[] = this.twoA.AllScenarios(adaptID, gameID);
            for (let tScenario of scenarios) {
                Tests.printScenario(tScenario);
            }

            // [SC] testing if invalid values can be assigned to scenarios
            scenarioSix.PlayCount = -1;
            scenarioSix.KFactor = -0.0666;
            scenarioSix.Uncertainty = -0.6666;
            scenarioSix.LastPlayed = "";
            scenarioSix.TimeLimit = 0;
            Tests.printScenario(scenarioSix);

            scenarioSix.PlayCount = -1;
            scenarioSix.KFactor = -0.0666;
            scenarioSix.Uncertainty = -0.6666;
            scenarioSix.LastPlayed = null;
            scenarioSix.TimeLimit = -1;
            Tests.printScenario(scenarioSix);

            // [SC] testing TwoA scenario getters
            Tests.printMsg("TwoA scenario getter tests:");
            Tests.printMsg("    Rating: " + this.twoA.GetScenarioRating(adaptID, gameID, scenarioID));
            Tests.printMsg("    Play count: " + this.twoA.GetScenarioPlayCount(adaptID, gameID, scenarioID));
            Tests.printMsg("    K factor: " + this.twoA.GetScenarioKFactor(adaptID, gameID, scenarioID));
            Tests.printMsg("    Uncertainty: " + this.twoA.GetScenarioUncertainty(adaptID, gameID, scenarioID));
            Tests.printMsg("    Last played: " + this.twoA.GetScenarioLastPlayed(adaptID, gameID, scenarioID));
            Tests.printMsg("    Time limit: " + this.twoA.GetScenarioTimeLimit(adaptID, gameID, scenarioID));

            // [SC] testing TwoA scenario setters with valid values
            Tests.printMsg("TwoA scenario setter tests with valid values:");
            this.twoA.SetScenarioRating(adaptID, gameID, scenarioID, 7);
            this.twoA.SetScenarioPlayCount(adaptID, gameID, scenarioID, 77);
            this.twoA.SetScenarioKFactor(adaptID, gameID, scenarioID, 0.777);
            this.twoA.SetScenarioUncertainty(adaptID, gameID, scenarioID, 0.7777);
            this.twoA.SetScenarioLastPlayed(adaptID, gameID, scenarioID, "7777.77.77");
            this.twoA.SetScenarioTimeLimit(adaptID, gameID, scenarioID, 77777);
            Tests.printScenarioById(adaptID, gameID, scenarioID);

            // [SC] testing TwoA scenario setters with invalid values
            Tests.printMsg("TwoA scenario setter tests with invalid values:");
            this.twoA.SetScenarioPlayCount(adaptID, gameID, scenarioID, -1);
            this.twoA.SetScenarioKFactor(adaptID, gameID, scenarioID, -0.777);
            this.twoA.SetScenarioUncertainty(adaptID, gameID, scenarioID, -0.7777);
            this.twoA.SetScenarioLastPlayed(adaptID, gameID, scenarioID, "");
            this.twoA.SetScenarioTimeLimit(adaptID, gameID, scenarioID, 0);
            this.twoA.SetScenarioLastPlayed(adaptID, gameID, scenarioID, null);
            this.twoA.SetScenarioTimeLimit(adaptID, gameID, scenarioID, -1);
            Tests.printScenarioById(adaptID, gameID, scenarioID);

            // [SC] scenario getter calls with invalid params
            this.twoA.Scenario(adaptID, gameID, "dsagdjahsdgahsd");
            this.twoA.Scenario(adaptID, "dasd", scenarioID);
            this.twoA.Scenario("dsadsadsa", gameID, scenarioID);
            this.twoA.Scenario("", gameID, scenarioID);
            this.twoA.Scenario(adaptID, gameID, null);

            // [SC] all scenario getter call with invalid params
            this.twoA.AllScenarios("dsadasd", gameID);
            this.twoA.AllScenarios(adaptID, null);

            // [SC] remove invalid scenario node
            Tests.printMsg("Removing invalid scenario node.");
            this.twoA.RemoveScenarioNode(scenarioSeven);
            scenarios = this.twoA.AllScenarios(adaptID, gameID);
            for (let tScenario of scenarios) {
                Tests.printScenario(tScenario);
            }

            // [SC] remove very easy scenario node
            Tests.printMsg("Removing very easy scenario node.");
            this.twoA.RemoveScenarioNode(scenarioOne);
            scenarios = this.twoA.AllScenarios(adaptID, gameID);
            for (let tScenario of scenarios) {
                Tests.printScenario(tScenario);
            }
            
            ////// END: Examples of adding scenario data into TwoA
            //////////////////////////////////////////////////////////////////////////////////////
        }

        public static printScenarioById(p_adaptID: string, p_gameID: string, p_scenarioID: string) {
            Tests.printScenario(this.twoA.Scenario(p_adaptID, p_gameID, p_scenarioID));
        }

        public static printScenario(p_scenario: ScenarioNode): void {
            //Tests.printMsg("    AdaptationID: " + p_scenario.AdaptationID);
            //Tests.printMsg("    GameID: " + p_scenario.GameID);
            Tests.printMsg("    ScenarioID: " + p_scenario.ScenarioID);
            Tests.printMsg("    Rating: " + p_scenario.Rating);
            Tests.printMsg("    Play count: " + p_scenario.PlayCount);
            Tests.printMsg("    K factor: " + p_scenario.KFactor);
            Tests.printMsg("    Uncertainty: " + p_scenario.Uncertainty);
            Tests.printMsg("    Last played: " + p_scenario.LastPlayed);
            Tests.printMsg("    Time limit: " + p_scenario.TimeLimit);
        }

        public static printPlayerById(p_adaptID: string, p_gameID: string, p_playerID: string) {
            Tests.printPlayer(this.twoA.Player(p_adaptID, p_gameID, p_playerID));
        }

        public static printPlayer(p_player: PlayerNode): void {
            //Tests.printMsg("    AdaptationID: " + p_player.AdaptationID);
            //Tests.printMsg("    GameID: " + p_player.GameID);
            Tests.printMsg("    PlayerID: " + p_player.PlayerID);
            Tests.printMsg("    Rating: " + p_player.Rating);
            Tests.printMsg("    Play count: " + p_player.PlayCount);
            Tests.printMsg("    K factor: " + p_player.KFactor);
            Tests.printMsg("    Uncertainty: " + p_player.Uncertainty);
            Tests.printMsg("    Last played: " + p_player.LastPlayed);
        }

        public static printMsg(msg: string): void {
            bridge.Log(Severity.Information, msg);
        }
    }
}