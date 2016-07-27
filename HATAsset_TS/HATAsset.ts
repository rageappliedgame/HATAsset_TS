/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/AssetManager.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/BaseAsset.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/IAsset.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/IDataStorage.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/ILog.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/Messages.ts"/>
/// <reference path='../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/Dictionary.ts' />
/// 
/// <reference path="HATAssetSettings.ts"/>
///
module AssetPackage {

    // Setup Aliases.
    import AssetManager = AssetManagerPackage.AssetManager;
    import BaseAsset = AssetPackage.BaseAsset;
    import IAsset = AssetPackage.IAsset;
    import ILog = AssetPackage.ILog;
    import IDataStorage = AssetPackage.IDataStorage;
    import Messages = MessagesPackage.Messages;
    import Dictionary = AssetManagerPackage.Dictionary;
    import AssetSettings = AssetPackage.AssetSettings;

    /// <summary>
    /// Export the HATAsset.
    /// </summary>
    export class HATAsset extends BaseAsset {

        /// <summary>
        /// Information describing the protected version.
        /// </summary>
        ///
        /// <remarks>
        /// Commas after the last member and \r\n are not allowed.
        /// </remarks>
        protected versionInfo: string =
        '{ ' +
        '  "Major":"1", ' +
        '  "Minor":"2", ' +
        '  "Build":"3", ' +
        '  "Maturity":"Alpha", ' +
        '  "Dependencies": [ ' +
        '        { ' +
        '           "Class": "HATAsset", ' +
        '           "minVersion": "1.2.4", ' +
        '           "maxVersion": "1.*" ' +
        '        } ' +
        '   ] ' +
        '} ';

        /// <summary>
        /// Initializes a new instance of the Asset class. Sets the ClassName property.
        /// </summary>
        constructor() {
            super();

            // Somehow Settings cannot be applied here (so must be set in the calling program).
            // this.Settings = new AssetSettings();
        }

        /// <summary>
        /// Public method. Enumerates all available Loggers and uses them to emit the msg.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        public publicMethod(msg: string): void {
            this.Log(Severity.Information, "{0} {1}", "Hello", "World");
        }
    }
}