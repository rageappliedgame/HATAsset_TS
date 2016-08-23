/// <reference path="AssetManager.ts"/>
/// <reference path="IAsset.ts"/>
/// <reference path="IBridge.ts"/>
/// <reference path="IDataStorage.ts"/>
/// <reference path="IDefaultSettings.ts"/>
/// <reference path="ILog.ts"/>
/// <reference path="Version.ts"/>
///
module AssetPackage {

    import AssetManager = AssetManagerPackage.AssetManager;

    /// <summary>
    /// Export the Asset.
    /// </summary>
    export class BaseAsset implements IAsset {

        /// <summary>
        /// Information describing the protected version.
        /// </summary>
        /// 
        /// <remarks>
        /// Commas after the last member and \r\n are not allowed.
        /// </remarks>
        protected versionInfo: string =
        '{' +
        '  "Major":"1", ' +
        '  "Minor":"2", ' +
        '  "Build":"3" ' +
        '}';

        /// <summary>
        /// Manager for asset.
        /// 
        /// Note: should be protected (ie. only visible in derived assets).
        /// </summary>
        public assetManager = AssetManager.Instance;

        private _sId: string = "";
        private _sClass: string = "";
        private _bridge: IBridge;
        private _settings: ISettings;

        /// <summary>
        /// Initializes a new instance of the Asset class.
        /// Sets the ClassName property/
        /// </summary>
        constructor() {
            var funcNameRegex = /function (.{1,})\(/;
            var code = (this).constructor.toString();
            var results = (funcNameRegex).exec(code);
            this._sClass = (results && results.length > 1) ? results[1] : "";

            this.setId(this.assetManager.registerAssetInstance(this, this.Class));
        }

        /// <summary>
        /// Gets the class.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get Class(): string {
            return this._sClass;
        }

        /// <summary>
        /// Gets the identifier.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get Id(): string {
            return this._sId;
        }

        /// <summary>
        /// Sets an identifier.
        /// </summary>
        ///
        /// <param name="id"> The identifier. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        private setId(id: string) {
            if (this._sId.length == 0) {
                this._sId = id;
            }
        }

        /// <summary>
        /// Gets the version.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get Version(): string {
            var _version: Version = JSON.parse(this.versionInfo);

            return _version.Major + "." + _version.Minor + "." + _version.Build +
                (this.isEmpty(_version.Revision) ? "" : "." + _version.Revision);
        }

        /// <summary>
        /// Gets the maturity.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get Maturity(): string {
            var _version: Version = JSON.parse(this.versionInfo);

            return _version.Maturity;
        }

        /// <summary>
        /// The dependencies.
        /// </summary>
        public get Dependencies(): Dependency[] {
            var _version: Version = JSON.parse(this.versionInfo);

            // Fixup for missing versionRange property/method in Dependency by re-creating them properly.
            if (_version.Dependencies) {
                for (var j = 0; j < _version.Dependencies.length; j++) {
                    var _dep: Dependency = _version.Dependencies[j];

                    _version.Dependencies[j] = new Dependency(_dep.Class, _dep.minVersion, _dep.maxVersion);
                }

                return _version.Dependencies;
            } else {
                return [];
            }
        }

        /// <summary>
        /// Gets the bridge.
        /// </summary>
        ///
        /// <returns>
        /// A get.
        /// </returns>
        public get Bridge(): IBridge {
            return this._bridge;
        }

        /// <summary>
        /// Bridges the given value.
        /// </summary>
        ///
        /// <param name="val"> The value. </param>
        ///
        /// <returns>
        /// A set.
        /// </returns>
        public set Bridge(val: IBridge) {
            this._bridge = val;
        }

        /// <summary>
        /// Gets the settings.
        /// </summary>
        ///
        /// <returns>
        /// The ISettings.
        /// </returns>
        public get Settings(): ISettings {
            return this._settings;
        }

        /// <summary>
        /// Settings the given value.
        /// </summary>
        ///
        /// <param name="val"> The value. </param>
        ///
        /// <returns>
        /// A set.
        /// </returns>
        public set Settings(val: ISettings) {
            this._settings = val;
        }

        /// <summary>
        /// Query if this object has settings.
        /// </summary>
        ///
        /// <returns>
        /// true if settings, false if not.
        /// </returns>
        public get hasSettings(): boolean {
            return this.Settings != null;
        }

        /// <summary>
        /// Loads default settings.
        /// </summary>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        public LoadDefaultSettings(): boolean {
            var ds: IDefaultSettings = this.getInterfaceMethod("LoadDefaultSettings");

            if (ds && this.hasSettings && ds.HasDefaultSettings(this.Class, this.Id)) {
                var Json: string = ds.LoadDefaultSettings(this.Class, this.Id);

                this.Settings = JSON.parse(Json);

                return true;
            }

            return false;
        }

        /// <summary>
        /// Loads the settings.
        /// </summary>
        ///
        /// <param name="filename"> Filename of the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        public LoadSettings(filename: string): boolean {
            var ds: IDataStorage = this.getInterfaceMethod("Load");

            if (ds) {
                // TODO TEST CODE
                // this.Settings = JSON.parse("[1, 2, 3, 4]");

                // ds.Save(filename, JSON.stringify(this.Settings));

                var json: string = ds.Load(filename);

                this.Settings = JSON.parse(json);

                return true;
            }

            return false;
        }

        /// <summary>
        /// Saves the default settings.
        /// </summary>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        public SaveDefaultSettings(force: boolean): boolean {
            var ds: IDefaultSettings = this.getInterfaceMethod("SaveDefaultSettings");

            if (ds && this.hasSettings && (force || !ds.HasDefaultSettings(this.Class, this.Id))) {
                ds.SaveDefaultSettings(this.Class, this.Id, JSON.stringify(this.Settings));

                return true;
            }

            return false;
        }

        /// <summary>
        /// Saves the settings.
        /// </summary>
        ///
        /// <param name="filename"> Filename of the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        public SaveSettings(filename: string): boolean {
            var ds: IDataStorage = this.getInterfaceMethod("Save");

            if (ds) {
                ds.Save(filename, JSON.stringify(this.Settings));

                return true;
            }

            return false;
        }

        /// <summary>
        /// Settings from JSON.
        /// </summary>
        ///
        /// <param name="json"> The JSON. </param>
        ///
        /// <returns>
        /// The ISettings.
        /// </returns>
        public SettingsFromJson(json: string): ISettings {
            // TODO Test
            // 
            return JSON.parse(json);
        }

        /// <summary>
        /// Settings to JSON.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public SettingsToJson(): string {
            // TODO Test
            // 
            return JSON.stringify(this.Settings);
        }

        /// <summary>
        /// Logs.
        /// </summary>
        ///
        /// <param name="severity"> The severity. </param>
        /// <param name="format">   Describes the format to use. </param>
        /// <param name="args">     A variable-length parameters list containing
        ///                         arguments. </param>
        public Log(severity: Severity, format: string, ...args): void {
            var ds: ILog = this.getInterfaceMethod("Log");

            if (ds != null) {
                var result: string = format;

                for (var i = 0; i < args.length; i++) {
                    result = result.replace("{" + i + "}", args[i]);
                }

                //this.Log(severity, result);
                ds.Log(severity, result);
            }
        }

        ///// <summary>
        ///// Logs.
        ///// </summary>
        /////
        ///// <param name="severity"> The severity. </param>
        ///// <param name="msg">      The message. </param>
        //public Log(severity: Severity, msg: string): void {
        //    var ds: ILog = this.getInterfaceMethod("Log");

        //    if (ds != null) {
        //        ds.Log(severity, msg);
        //    }
        //}

        /// <summary>
        /// Gets the methods.
        /// </summary>
        ///
        /// <param name="obj"> The object. </param>
        ///
        /// <returns>
        /// An array of any.
        /// </returns>
        protected getMethods(obj: any): any[] {
            var methods = [];
            // console.log("Methods:");
            for (var m in obj) {
                if (typeof obj[m] == "function") {
                    // console.log(m);
                    methods.push(m)
                }
            }
            return methods;
        }

        /// <summary>
        /// Gets interface method.
        /// </summary>
        ///
        /// <param name="methodName"> Name of the method. </param>
        ///
        /// <returns>
        /// The interface method.
        /// </returns>
        protected getInterfaceMethod(methodName: string): any {
            //var methods: any[] = this.getMethods(new T());
            if (this.Bridge != null) {

                // Check if method is present on Asset Bridge!
                // 
                var methods: string[] = this.getMethods(this.Bridge);
                for (var m in methods) {
                    // console.log(methods[m]);
                    if (methods[m] == methodName &&
                        (eval("typeof this.Bridge." + methodName) === 'function')) {
                        return this.Bridge;
                    }
                }
            } else if (AssetManager.Instance.Bridge != null) {

                // Check if method is present on AssetManager Bridge!
                // 
                var methods: string[] = this.getMethods(AssetManager.Instance.Bridge);
                for (var m in methods) {
                    // console.log(methods[m]);
                    if (methods[m] == methodName &&
                        (eval("typeof AssetManager.Instance.Bridge." + methodName) === 'function')) {
                        return AssetManager.Instance.Bridge;
                    }
                }
            }

            return null;
        }

        /// <summary>
        /// Query if 'str' is empty.
        /// </summary>
        ///
        /// <param name="str"> The string. </param>
        ///
        /// <returns>
        /// true if empty, false if not.
        /// </returns>
        private isEmpty(str: string): boolean {
            return (!str || 0 === str.length);
        }

    }
}