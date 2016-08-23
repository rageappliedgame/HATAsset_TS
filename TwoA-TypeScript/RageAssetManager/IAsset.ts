/// <reference path="IBridge.ts"/>
/// <reference path="ISettings.ts"/>

module AssetPackage {

    /// <summary>
    /// Interface for asset.
    /// </summary>
    export interface IAsset {

        /// <summary>
        /// The class.
        /// </summary>
        Class: string;

        /// <summary>
        /// The identifier.
        /// </summary>
        Id: string;

        /// <summary>
        /// The bridge.
        /// </summary>
        Bridge: IBridge;

        /// <summary>
        /// The maturity.
        /// </summary>
        Maturity: string;

        /// <summary>
        /// Options for controlling the operation.
        /// </summary>
        Settings: ISettings;

        /// <summary>
        /// The version.
        /// </summary>
        Version: string;

        /// <summary>
        /// The dependencies.
        /// </summary>
        Dependencies: Dependency[];
    }
}