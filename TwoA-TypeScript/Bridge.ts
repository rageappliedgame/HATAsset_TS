/// <reference path="RageAssetManager/IBridge.ts"/>
/// <reference path="RageAssetManager/IDataStorage.ts"/>
/// <reference path="RageAssetManager/IDefaultSettings.ts"/>
/// <reference path="RageAssetManager/ILog.ts"/>
/// 

module MyNameSpace {

    import IBridge = AssetPackage.IBridge;
    import ILog = AssetPackage.ILog;
    import Severity = AssetPackage.Severity;
    import IDataStorage = AssetPackage.IDataStorage;
    import IDefaultSettings = AssetPackage.IDefaultSettings;

    /// <summary>
    /// Export the Asset.
    /// </summary>
    export class Bridge implements IBridge, ILog, IDataStorage, IDefaultSettings {

        /// <summary>
        /// Executes the log operation.
        /// 
        /// Implement this in Game Engine Code.
        /// </summary>
        ///
        /// <param name="msg"> The message. </param>
        Log(severity: Severity, msg: string): void {
            console.log(severity + ": " + msg);
        }

        Delete(fileId: string): boolean {
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.

                if (this.Exists(fileId)) {
                    localStorage.removeItem(fileId);

                    return true;
                }

                return false;
            } else {
                // Sorry! No Web Storage support..
            }

            return false;
        }

        /// <summary>
        /// Determine if 'fileId' exists.
        /// </summary>
        ///
        /// <param name="fileId"> Identifier for the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        Exists(fileId: string): boolean {
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.

                for (var j = 0; j < localStorage.length; j++) {
                    if (localStorage.key(j) == fileId) {
                        return true;
                    }
                }

                return false;
            } else {
                // Sorry! No Web Storage support..
            }

            return false;
        }

        /// <summary>
        /// Gets the files.
        /// </summary>
        ///
        /// <returns>
        /// A string[].
        /// </returns>
        Files(): string[] {
            var files: string[] = [];

            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.

                for (var j = 0; j < localStorage.length; j++) {
                    files.push(localStorage.key(j));
                }
            } else {
                // Sorry! No Web Storage support..
            }

            return files;
        }

        /// <summary>
        /// Loads the given file.
        /// </summary>
        ///
        /// <param name="fileId"> The file identifier to load. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        Load(fileId: string): string {
            // See http://www.w3schools.com/HTML/html5_webstorage.asp
            // 
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                // 
                return localStorage.getItem(fileId);
            } else {
                // Sorry! No Web Storage support..
            }

            return null;
        }

        /// <summary>
        /// Saves.
        /// </summary>
        ///
        /// <param name="fieldId">  Identifier for the field. </param>
        /// <param name="fileData"> Information describing the file. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Save(fieldId: string, fileData: string): void {
            // See http://www.w3schools.com/HTML/html5_webstorage.asp
            // 
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                // 
                localStorage.setItem(fieldId, fileData);
            } else {
                // Sorry! No Web Storage support..
            }
        }

        private DeriveAssetName(Class: string, Id: string): string {
            return Class + "AppSettings";
        }

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
        HasDefaultSettings(Class: string, Id: string): boolean {
            // Note, a very simple implementation returning the same value for all classes!
            // 
            return true;

            // if (typeof (Storage) !== "undefined") {

            // Code for localStorage/sessionStorage.
            // 
            // return typeof (localStorage.getItem(this.DeriveAssetName(Class, Id))) !== "undefined";
            //} else {
            // Sorry! No Web Storage support..
            //}

            // return false;
        }

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
        LoadDefaultSettings(Class: string, Id: string): string {
            // Note, a very simple implementation returning the same settings for all classes!
            // 
            return '{ "type": "org.celstec.arlearn2.beans.run.Run", "gameId": 1, "title": "my run" }';

            // if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            // 
            // return localStorage.getItem(this.DeriveAssetName(Class, Id));
            // } else {
            // Sorry! No Web Storage support..
            // }

            //return null;
        }

        /// <summary>
        /// Saves a default settings.
        /// </summary>
        ///
        /// <param name="Class">    The class. </param>
        /// <param name="Id">       The identifier. </param>
        /// <param name="fileData"> The file data. </param>
        SaveDefaultSettings(Class: string, Id: string, fileData: string): void {
            // Note, a very simple implementation ignoring saving for all classes!
            // 
            //if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            // 
            // localStorage.setItem(this.DeriveAssetName(Class, Id), fileData);
            //} else {
            // Sorry! No Web Storage support..
            //}
        }

        Archive(fileId: string): boolean {
            if (typeof (Storage) !== "undefined") {
                if (this.Exists(fileId)) {

                    // Code for localStorage/sessionStorage.
                    // 
                    var dot: number = fileId.lastIndexOf(".");
                    var fn = dot > 0 ? fileId.slice(0, dot) : fileId;
                    var ext = dot == 0 ? fileId : fileId.slice(fn.length, fileId.length);
                    var now = new Date();
                    var stamp =
                        now.getFullYear() + "-" +
                        now.getMonth() + "-" +
                        now.getDate() + " [" +
                        now.getHours() + " " +
                        now.getMinutes() + " " +
                        now.getSeconds() + " " +
                        now.getMilliseconds() + "]";

                    //tring("yyyy-MM-dd [HH mm ss fff]"),
                    localStorage.setItem(fn + "-" + stamp + ext, localStorage[fileId]);

                    return true;
                }
            } else {
                // Sorry! No Web Storage support..
            }

            return false;
        }
    }
}
