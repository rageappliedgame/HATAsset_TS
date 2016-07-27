/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/AssetManager.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAssetManager/Messages.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAsset/AssetSettings.ts"/>
/// <reference path="../../asset-proof-of-concept-demo_TypeScript/RageAsset/Logger.ts"/>
/// 
/// <reference path="Bridge.ts"/>
/// <reference path="./HATAsset.ts"/>
/// <reference path="./HATAssetSettings.ts"/>
///
module HATAsset_TS {
    // Import and alias the Asset*.
    // 
    import AssetManager = AssetManagerPackage.AssetManager;
    import BaseAsset = AssetPackage.BaseAsset;
    import Dependency = AssetPackage.Dependency;

    import HATAsset = AssetPackage.HATAsset;
    import HATAssetSettings = AssetPackage.HATAssetSettings;
    import AssetSettings = AssetPackage.AssetSettings;
    import Logger = AssetPackage.Logger;

    import Bridge = MyNameSpace.Bridge;

    import Messages = MessagesPackage.Messages;

    window.onload = () => {
        var hat: HATAsset = new HATAsset();
        hat.Bridge = new Bridge();
        hat.Settings = new HATAssetSettings(15);

        hat.publicMethod("test");
    };
}