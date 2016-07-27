declare module AssetPackage {
    interface IBridge {
    }
}
declare module AssetPackage {
    interface ISettings {
    }
}
declare module AssetPackage {
    interface IAsset {
        Class: string;
        Id: string;
        Bridge: IBridge;
        Maturity: string;
        Settings: ISettings;
        Version: string;
        Dependencies: Dependency[];
    }
}
declare module MessagesPackage {
    interface MessagesEventCallback {
        (message: string, parameters: Object): void;
    }
    class Messages {
        private static messages;
        private static idGenerator;
        static define(message: string): boolean;
        static broadcaster(message: string, subscribers: any[], parameters: Object): void;
        static broadcast(message: string, parameters: Object): boolean;
        static subscribe(message: string, callback: MessagesEventCallback): string;
        static unsubscribe(subscriptionId: string): boolean;
    }
}
declare module AssetManagerPackage {
    class Dictionary {
        private keys_;
        constructor();
        add(key: string, value: any): void;
        remove(key: string): void;
        keys: string[];
        values: any[];
        containsKey(key: string): boolean;
    }
}
declare module AssetPackage {
    class Version {
        Major: string;
        Minor: string;
        Build: string;
        Revision: string;
        Maturity: string;
        Dependencies: Dependency[];
        constructor(major: string, minor: string, build: string, revision: string, maturity: string);
    }
    class Dependency {
        Class: string;
        minVersion: string;
        maxVersion: string;
        versionRange: string;
        private isEmpty(str);
        constructor(Class: string, minVersion: string, maxVersion: string);
    }
}
declare module AssetManagerPackage {
    import IAsset = AssetPackage.IAsset;
    import IBridge = AssetPackage.IBridge;
    class AssetManager {
        private static _instance;
        private idGenerator;
        private assets;
        constructor();
        static Instance: AssetManager;
        registerAssetInstance(asset: IAsset, claz: string): string;
        findAssetById(id: string): IAsset;
        findAssetByClass(claz: string): IAsset;
        findAssetsByClass(claz: string): IAsset[];
        private _bridge;
        Bridge: IBridge;
        private pad(str, pad, padLeft);
        private padc(str, pad, padwith, padLeft);
        VersionAndDependenciesReport: string;
    }
}
declare module AssetPackage {
    import ISettings = AssetPackage.ISettings;
    class AssetSettings implements ISettings {
        private _value;
        constructor(value: number);
        TheAnswerToAll: number;
    }
}
declare module AssetPackage {
    interface IDataStorage {
        Delete(fileId: string): boolean;
        Exists(fileId: string): boolean;
        Files(): string[];
        Load(fileId: string): string;
        Save(fieldId: string, fileData: string): void;
    }
}
declare module AssetPackage {
    interface IDefaultSettings {
        HasDefaultSettings(Class: string, Id: string): boolean;
        LoadDefaultSettings(Class: string, Id: string): string;
        SaveDefaultSettings(Class: string, Id: string, fileData: string): void;
    }
}
declare module AssetPackage {
    interface ILog {
        Log(severity: Severity, msg: string): void;
    }
    enum Severity {
        Critical = 1,
        Error = 2,
        Warning = 4,
        Information = 8,
        Verbose = 16,
    }
    enum LogLevel {
        Critical = 1,
        Error = 3,
        Warn = 7,
        Info = 15,
        All = 31,
    }
}
declare module AssetPackage {
    import AssetManager = AssetManagerPackage.AssetManager;
    class BaseAsset implements IAsset {
        protected versionInfo: string;
        assetManager: AssetManager;
        private _sId;
        private _sClass;
        private _bridge;
        private _settings;
        constructor();
        Class: string;
        Id: string;
        private setId(id);
        Version: string;
        Maturity: string;
        Dependencies: Dependency[];
        Bridge: IBridge;
        Settings: ISettings;
        hasSettings: boolean;
        LoadDefaultSettings(): boolean;
        LoadSettings(filename: string): boolean;
        SaveDefaultSettings(force: boolean): boolean;
        SaveSettings(filename: string): boolean;
        SettingsFromJson(json: string): ISettings;
        SettingsToJson(): string;
        Log(severity: Severity, format: string, ...args: any[]): void;
        protected getMethods(obj: any): any[];
        protected getInterfaceMethod(methodName: string): any;
        private isEmpty(str);
    }
}
declare module AssetPackage {
    interface ILogger {
        prefix: string;
        doLog(msg: string): void;
    }
}
declare module AssetPackage {
    import BaseAsset = AssetPackage.BaseAsset;
    class Logger extends BaseAsset {
        protected versionInfo: string;
        constructor();
        log(msg: string): void;
    }
}
declare module MyNameSpace {
    import IBridge = AssetPackage.IBridge;
    import ILog = AssetPackage.ILog;
    import Severity = AssetPackage.Severity;
    import IDataStorage = AssetPackage.IDataStorage;
    import IDefaultSettings = AssetPackage.IDefaultSettings;
    class Bridge implements IBridge, ILog, IDataStorage, IDefaultSettings {
        Log(severity: Severity, msg: string): void;
        Delete(fileId: string): boolean;
        Exists(fileId: string): boolean;
        Files(): string[];
        Load(fileId: string): string;
        Save(fieldId: string, fileData: string): void;
        private DeriveAssetName(Class, Id);
        HasDefaultSettings(Class: string, Id: string): boolean;
        LoadDefaultSettings(Class: string, Id: string): string;
        SaveDefaultSettings(Class: string, Id: string, fileData: string): void;
        Archive(fileId: string): boolean;
    }
}
declare module AssetPackage {
    import ISettings = AssetPackage.ISettings;
    class HATAssetSettings implements ISettings {
        private _mode;
        private _players;
        private _scenarios;
        constructor(value: number);
        Mode: HATMode;
        Players: HATPlayer[];
        Scenarios: HATScenario[];
    }
    enum HATMode {
        perTurn = 0,
        perGame = 1,
    }
    class HATPlayer {
        private _adaptionID;
        private _gameID;
        private _kfactor;
        private _lastplayed;
        private _playcount;
        private _rating;
        private _playerID;
        private _uncertainty;
        constructor();
        AdaptationID: string;
        GameID: string;
        KFactor: number;
        LastPlayed: Date;
        PlayCount: number;
        Rating: number;
        PlayerID: string;
        Uncertainty: number;
    }
    class HATScenario {
        private _adaptionID;
        private _gameID;
        private _kfactor;
        private _lastplayed;
        private _playcount;
        private _rating;
        private _scenarioID;
        private _timelimit;
        private _uncertainty;
        constructor();
        AdaptationID: string;
        GameID: string;
        KFactor: number;
        LastPlayed: Date;
        PlayCount: number;
        Rating: number;
        ScenarioID: string;
        TimeLimit: number;
        Uncertainty: number;
    }
}
declare module AssetPackage {
    import BaseAsset = AssetPackage.BaseAsset;
    class HATAsset extends BaseAsset {
        protected versionInfo: string;
        constructor();
        publicMethod(msg: string): void;
    }
}
declare module HATAsset_TS {
}
