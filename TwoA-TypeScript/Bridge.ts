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

/// <reference path="RageAssetManager/IBridge.ts"/>
/// <reference path="RageAssetManager/IDataStorage.ts"/>
/// <reference path="RageAssetManager/ILog.ts"/>
///

module TestPackage
{
    import IBridge = AssetPackage.IBridge;
    import IDataStorage = AssetPackage.IDataStorage;

    import ILog = AssetPackage.ILog;
    import Severity = AssetPackage.Severity;

    /// <summary>
    /// Export the Asset.
    /// </summary>
    export class Bridge implements IBridge, IDataStorage, ILog {
        private DeriveAssetName(Class: string, Id: string): string {
            return Class + "AppSettings";
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

                for (let j = 0; j < localStorage.length; j++) {
                    if (localStorage.key(j) == fileId) {
                        return true;
                    }
                }

                return false;
            } else {
                // Sorry! No Web Storage support..
                window.alert("Exists function: Sorry! No Web Storage support.");
            }

            return false;
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
                window.alert("Load function: Sorry! No Web Storage support.");
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
                window.alert("Save function: Sorry! No Web Storage support.");
            }
        }

        /// <summary>
        /// Gets the files.
        /// </summary>
        ///
        /// <returns>
        /// A string[].
        /// </returns>
        Files(): string[] {
            let files: string[] = [];

            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.

                for (let j = 0; j < localStorage.length; j++) {
                    files.push(localStorage.key(j));
                }
            } else {
                // Sorry! No Web Storage support..
            }

            return files;
        }

        /// <summary>
        /// Deletes the file.
        /// </summary>
        ///
        /// <param name="fileId">  Identifier for the field. </param>
        ///
        /// <returns>
        /// boolean
        /// </returns>
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
        /// Executes the log operation.
        ///
        /// Implement this in Game Engine Code.
        /// </summary>
        ///
        /// <param name="msg">The message.</param>
        Log(severity: Severity, msg: string): void {
            console.log(severity + ": " + msg);
        }
    }
}
