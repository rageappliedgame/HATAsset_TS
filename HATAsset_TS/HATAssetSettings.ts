/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/ISettings.ts"/>
///
module AssetPackage {

    import ISettings = AssetPackage.ISettings;

    /// <summary>
    /// An asset settings.
    /// </summary>
    export class HATAssetSettings implements ISettings {

        //private _value: number = 0;
        private _mode: HATMode = HATMode.perGame;
        private _players: HATPlayer[] = [];
        private _scenarios: HATScenario[] = [];

        /// <summary>
        /// Initializes a new instance of the AssetSettings class.
        /// </summary>
        ///
        /// <param name="value"> The value. </param>
        constructor(value: number) {
            this._mode = HATMode.perGame;
            this._players = [];
            this._scenarios = [];
        }

        /// <summary>
        /// Gets the mode.
        /// </summary>
        ///
        /// <returns>
        /// A HATMode.
        /// </returns>
        public get Mode(): HATMode {
            return this._mode;
        }

        /// <summary>
        /// Sets Mode to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Mode(value: HATMode) {
            this._mode = value;
        }

        /// <summary>
        /// Gets the players.
        /// </summary>
        ///
        /// <returns>
        /// A HATPlayer[].
        /// </returns>
        public get Players(): HATPlayer[] {
            return this._players;
        }

        /// <summary>
        /// Set the Players the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Players(value: HATPlayer[]) {
            this._players = value;
        }

        /// <summary>
        /// Gets the scenarios.
        /// </summary>
        ///
        /// <returns>
        /// A HATScenario[].
        /// </returns>
        public get Scenarios(): HATScenario[] {
            return this._scenarios;
        }

        /// <summary>
        /// set the Scenarios the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Scenarios(value: HATScenario[]) {
            this._scenarios = value;
        }
    }

    /// <summary>
    /// Values that represent hat modes.
    /// </summary>
    export enum HATMode {
        /// <summary>
        /// An enum constant representing the per turn option.
        /// </summary>
        perTurn,

        /// <summary>
        /// An enum constant representing the per game option.
        /// </summary>
        perGame,
    }

    /// <summary>
    /// A hat player.
    /// </summary>
    export class HATPlayer {
        private _adaptionID: string = "";
        private _gameID: string = "";
        private _kfactor: number = 0.0075;
        private _lastplayed: Date = new Date(2015, 1, 1);
        private _playcount: number = 0;
        private _rating: number = 0.75;
        private _playerID: string = "";
        private _uncertainty: number = 1.0;

        /// <summary>
        /// Constructor.
        /// </summary>
        constructor() {
            this._adaptionID = "";
            this._gameID = "";
            this._kfactor = 0.0075;
            this._lastplayed = new Date(2015, 1, 1);
            this._playcount = 0;
            this._rating = 0.75;
            this._playerID = "";
            this._uncertainty = 1.0;
        }

        /// <summary>
        /// Adaptation identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get AdaptationID(): string {
            return this._adaptionID;
        }

        /// <summary>
        /// Sets the Adaptation identifier to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set AdaptationID(value: string) {
            this._adaptionID = value;
        }

        /// <summary>
        /// Game identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get GameID(): string {
            return this._gameID;
        }

        /// <summary>
        /// Sets the Game identifier to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set GameID(value: string) {
            this._gameID = value;
        }

        /// <summary>
        /// Gets the factor.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get KFactor(): number {
            return this._kfactor;
        }

        /// <summary>
        /// Sets the Factors the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set KFactor(value: number) {
            this._kfactor = value;
        }

        /// <summary>
        /// Last played date.
        /// </summary>
        ///
        /// <returns>
        /// A Date.
        /// </returns>
        public get LastPlayed(): Date {
            return this._lastplayed;
        }

        /// <summary>
        /// Set thge Last played date to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set LastPlayed(value: Date) {
            this._lastplayed = value;
        }

        /// <summary>
        /// Play count.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get PlayCount(): number {
            return this._playcount;
        }

        /// <summary>
        /// Set the Play count to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set PlayCount(value: number) {
            this._playcount = value;
        }

        /// <summary>
        /// Gets the rating.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get Rating(): number {
            return this._rating;
        }

        /// <summary>
        /// Sets the Rating to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Rating(value: number) {
            this._rating = value;
        }

        /// <summary>
        /// Player identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get PlayerID(): string {
            return this._playerID;
        }

        /// <summary>
        /// Sets Player identifier to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set PlayerID(value: string) {
            this._playerID = value;
        }

        /// <summary>
        /// Gets the uncertainty.
        /// </summary>
        public get Uncertainty(): number {
            return this._uncertainty;
        }

        /// <summary>
        /// Sets Uncertainty to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Uncertainty(value: number) {
            this._uncertainty = value;
        }
    }

    /// <summary>
    /// A hat scenario.
    /// </summary>
    export class HATScenario {
        private _adaptionID: string = "";
        private _gameID: string = "";
        private _kfactor: number = 0.0075;
        private _lastplayed: Date = new Date(2015, 1, 1);
        private _playcount: number = 0;
        private _rating: number = 0.75;
        private _scenarioID: string = "";
        private _timelimit: number = 900000;
        private _uncertainty: number = 1.0;

        /// <summary>
        /// Constructor.
        /// </summary>
        constructor() {
            this._adaptionID = "";
            this._gameID = "";
            this._kfactor = 0.0075;
            this._lastplayed = new Date(2015, 1, 1);
            this._playcount = 0;
            this._rating = 0.75;
            this._scenarioID = "";
            this._timelimit = 900000;
            this._uncertainty = 1.0;
        }

        /// <summary>
        /// Adaptation identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get AdaptationID(): string {
            return this._adaptionID;
        }

        /// <summary>
        /// Sets the Adaptation identifier to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set AdaptationID(value: string) {
            this._adaptionID = value;
        }

        /// <summary>
        /// Game identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get GameID(): string {
            return this._gameID;
        }

        /// <summary>
        /// Sets the Game identifier to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set GameID(value: string) {
            this._gameID = value;
        }

        /// <summary>
        /// Gets the factor.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get KFactor(): number {
            return this._kfactor;
        }

        /// <summary>
        /// Sets the Factors the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set KFactor(value: number) {
            this._kfactor = value;
        }

        /// <summary>
        /// Last played date.
        /// </summary>
        ///
        /// <returns>
        /// A Date.
        /// </returns>
        public get LastPlayed(): Date {
            return this._lastplayed;
        }

        /// <summary>
        /// Set thge Last played date to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set LastPlayed(value: Date) {
            this._lastplayed = value;
        }

        /// <summary>
        /// Play count.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get PlayCount(): number {
            return this._playcount;
        }

        /// <summary>
        /// Set the Play count to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set PlayCount(value: number) {
            this._playcount = value;
        }

        /// <summary>
        /// Gets the rating.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get Rating(): number {
            return this._rating;
        }

        /// <summary>
        /// Sets the Rating to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Rating(value: number) {
            this._rating = value;
        }

        /// <summary>
        /// Scenario identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get ScenarioID(): string {
            return this._scenarioID;
        }

        /// <summary>
        /// Sets Scenario identifier to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set ScenarioID(value: string) {
            this._scenarioID = value;
        }

        /// <summary>
        /// Gets the timelimit.
        /// </summary>
        ///
        /// <returns>
        /// A number.
        /// </returns>
        public get TimeLimit(): number {
            return this._timelimit;
        }

        /// <summary>
        /// Sets the TimeLimit to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set TimeLimit(value: number) {
            this._timelimit = value;
        }

        /// <summary>
        /// Gets the uncertainty.
        /// </summary>
        public get Uncertainty(): number {
            return this._uncertainty;
        }

        /// <summary>
        /// Sets Uncertainty to the given value.
        /// </summary>
        ///
        /// <param name="value">    The value. </param>
        public set Uncertainty(value: number) {
            this._uncertainty = value;
        }
    }
}