/// <reference path='IAsset.ts' />
/// <reference path='IBridge.ts' />
/// <reference path='Messages.ts' />
/// <reference path='Dictionary.ts' />
/// <reference path='Version.ts' />

/// <summary>
/// An asset manager package.
/// 
/// Note this package has to be setup to 
/// 1) combine code into a single js file,   
/// 2) redirect output the the proof-of concept project  
/// 3) generated declaration files.  
/// </summary>
module AssetManagerPackage {

    import IAsset = AssetPackage.IAsset;
    import IBridge = AssetPackage.IBridge;

    import Asset = AssetPackage.IAsset;
    import Bridge = AssetPackage.IBridge;
    import Dependency = AssetPackage.Dependency;
    import Version = AssetPackage.Version;

    import Messages = MessagesPackage.Messages;

    import Dictionary = AssetManagerPackage.Dictionary;

    import BaseAsset = AssetPackage.BaseAsset;

    /// <summary>
    /// Export the AssetManager.
    /// </summary>
    export class AssetManager {
        private static _instance: AssetManager = null;

        /// <summary>
        /// User to generate uniqueId's for registered assets.
        /// </summary>
        private idGenerator = 0;

        /// <summary>
        /// The assets dictionary (id = object).
        /// </summary>
        private assets: Dictionary = new Dictionary();

        /// <summary>
        /// Initializes a new instance of the AssetManager class.
        /// </summary>
        constructor() {
            if (AssetManager._instance) {
                throw new Error("Error: Instantiation failed: Use AssetManager.getInstance() instead of new.");
            }
            AssetManager._instance = this;
        }

        /// <summary>
        /// Gets the singleton instance.
        /// </summary>
        ///
        /// <returns>
        /// An AssetManager.
        /// </returns>
        public static get Instance(): AssetManager {
            if (AssetManager._instance === null) {
                AssetManager._instance = new AssetManager();
            }

            return AssetManager._instance;
        }

        /// <summary>
        /// Registers the asset instance.
        /// </summary>
        ///
        /// <param name="asset"> The asset. </param>
        /// <param name="claz">  The claz. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        public registerAssetInstance(asset: IAsset, claz: string) {
            var keys = this.assets.keys;

            for (var i = 0; i < keys.length; i++) {
                if (this.assets[keys[i]] === asset) {
                    return keys[i];
                }
            }

            var Id = claz + "_" + (this.idGenerator++).toString(); //assets.length

            this.assets.add(Id, asset);

            return Id;
        }

        /// <summary>
        /// Returns the exact match.
        /// </summary>
        ///
        /// <param name="id"> The identifier. </param>
        ///
        /// <returns>
        /// The found asset by identifier.
        /// </returns>
        public findAssetById(id: string): IAsset {
            return this.assets[id];
        }

        /// <summary>
        /// Returns the first match.
        /// </summary>
        ///
        /// <param name="claz"> The claz. </param>
        ///
        /// <returns>
        /// The found asset by class.
        /// </returns>
        public findAssetByClass(claz: string): IAsset {
            var keys = this.assets.keys;

            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(claz + "_") == 0) {
                    return this.assets[keys[i]];
                }
            }

            return null;
        }

        /// <summary>
        /// Searches for the first assets by class.
        /// </summary>
        ///
        /// <param name="claz"> The claz. </param>
        ///
        /// <returns>
        /// The found assets by class.
        /// </returns>
        public findAssetsByClass(claz: string): IAsset[] {
            var keys = this.assets.keys;
            var results = [];

            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(claz + "_") == 0) {
                    results.push(this.assets[keys[i]]);
                }
            }

            return results;
        }

        /// <summary>
        /// The bridge.
        /// </summary>
        private _bridge: IBridge;

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
        /// Pads String Left or Right with spaces.
        /// </summary>
        ///
        /// <param name="str">     The string to pad. </param>
        /// <param name="pad">     The padding length. </param>
        /// <param name="padLeft"> true to pad left. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        private pad(str: string, pad: number, padLeft: boolean): string {
            return this.padc(str, pad, ' ', padLeft);
        }

        /// <summary>
        /// Pads String Left or Right with a character.
        /// </summary>
        ///
        /// <param name="str">     The string to pad. </param>
        /// <param name="pad">     The padding length. </param>
        /// <param name="padwith"> The padding character. </param>
        /// <param name="padLeft"> true to pad left. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        private padc(str: string, pad: number, padwith: string, padLeft: boolean): string {
            var padding = Array(pad).join(padwith);

            if (typeof str === 'undefined')
                return padding;
            if (padLeft) {
                return (padding + str).slice(-padding.length);
            } else {
                return (str + padding).substring(0, padding.length);
            }
        }

        /// <summary>
        /// Version and dependencies report.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get VersionAndDependenciesReport(): string {
            const col1w: number = 40;
            const col2w: number = 32;

            var report: string = "";

            report += this.pad("Asset", col1w, false);
            report += "Depends on";
            report += "\r\n";

            report += this.padc("", col1w - 1, "-", false);
            report += "+";
            report += this.padc("", col2w, "-", false);
            report += "\r\n";

            var keys = this.assets.keys;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var asset: IAsset = this.assets[key];

                report += this.pad(asset.Class + " v" + asset.Version, col1w - 1, false);

                var cnt: number = 0;

                for (var j = 0; j < asset.Dependencies.length; j++) {
                    var dependency: Dependency = asset.Dependencies[j];
                    //! Better version matches (see Microsoft).
                    // 
                    //! https://msdn.microsoft.com/en-us/library/system.version(v=vs.110).aspx
                    //
                    //! dependency.value has min-max format (inclusive) like:
                    // 
                    //? v1.2.3-*        (v1.2.3 or higher)
                    //? v0.0-*          (all versions)
                    //? v1.2.3-v2.2     (v1.2.3 or higher less than or equal to v2.1)
                    //
                    var vrange: string[] = dependency.versionRange.split('-');

                    var low: string[];
                    var hi: string[];

                    switch (vrange.length) {
                        case 1:
                            low = vrange[0].split('.');
                            hi = low;
                            break;
                        case 2:
                            low = vrange[0].split('.');
                            if (vrange[1] === "*") {
                                hi = "255.255".split('.');
                            }
                            else {
                                hi = vrange[1].split('.');
                            }
                            break;

                        default:
                            break;
                    }

                    var found: boolean = false;

                    if (low != null) {
                        var foundAssets: IAsset[] = this.findAssetsByClass(dependency.Class);
                        for (var dep in foundAssets) {
                            var asset: IAsset = foundAssets[dep];
                            var av = asset.Version.split('.');

                            var loOk = true;
                            for (var i = 0; i < low.length; i++) {
                                if (av.length < i + 1) {
                                    break;
                                } if (low[i] == "*") {
                                    break;
                                } else if (av[i] < low[i]) {
                                    loOk = false;
                                    break;
                                }
                            }
                            var hiOk = true;
                            for (var i = 0; i < hi.length; i++) {
                                if (av.length < i + 1) {
                                    break;
                                } if (hi[i] == "*") {
                                    break;
                                } else if (av[i] > hi[i]) {
                                    hiOk = false;
                                    break;
                                }
                            }

                            found = loOk && hiOk;
                        }

                        report += "|" + dependency.Class + " v" + dependency.versionRange + " [" + (found ? "resolved" : "missing") + "]";
                        report += "\r\n";
                    }
                    else {
                        report += "error";
                        report += "\r\n";
                    }

                    if (j < asset.Dependencies.length - 1) {
                        report += this.pad("", col1w - 1, false);
                    }

                    cnt++;
                }

                if (cnt == 0) {
                    report += "|No dependencies";
                    report += "\r\n";
                }
            }

            report += this.padc("", col1w - 1, "-", false);
            report += "+";
            report += this.padc("", col2w, "-", false);
            report += "\r\n";

            return report;
        }
    }
}
