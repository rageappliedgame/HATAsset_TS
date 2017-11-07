module AssetPackage {

    /// <summary>
    /// Interface for settings.
    /// </summary>
    export interface IDefaultSettings {

        /// <summary>
        /// Query if 'Class' has default settings.
        /// </summary>
        ///
        /// <param name="Class"> The class. </param>
        /// <param name="Id">    The identifier. </param>
        ///
        /// <returns>
        /// true if default settings, false if not.
        /// </returns>
        HasDefaultSettings(Class: string, Id: string): boolean;

        /// <summary>
        /// Loads default settings.
        /// </summary>
        ///
        /// <param name="Class"> The class. </param>
        /// <param name="Id">    The identifier. </param>
        ///
        /// <returns>
        /// The default settings.
        /// </returns>
        LoadDefaultSettings(Class: string, Id: string): string;

        /// <summary>
        /// Saves a default settings.
        /// </summary>
        ///
        /// <param name="Class">    The class. </param>
        /// <param name="Id">       The identifier. </param>
        /// <param name="fileData"> The file data. </param>
        SaveDefaultSettings(Class: string, Id: string, fileData: string): void;
    }
}