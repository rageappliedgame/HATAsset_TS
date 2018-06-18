/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
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

/// <reference path="../RageAssetManager/ILog.ts"/>
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
///
/// <reference path="Misc.ts"/>
///

namespace TwoANS
{
    import Severity = AssetPackage.Severity;
    import BaseAsset = AssetPackage.BaseAsset;

    export class BaseAdapter
    {

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        protected asset: BaseAsset; // [ASSET]

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties

        /// <summary>
        /// Gets the type of the adapter; It needs to be overriden by inheriting classes
        /// </summary>
        static get Type(): string {
            return Misc.UNASSIGNED_TYPE;
        }

        /// <summary>
        /// Description of this adapter. It needs to be overriden by inheriting classes
        /// </summary>
        static get Description(): string {
            return Misc.UNASSIGNED_TYPE;
        }

        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        constructor() { }

        public InitSettings(p_asset: BaseAsset) {
            this.asset = p_asset; // [ASSET]
        }

        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: misc methods

        /// <summary>
        /// Logs a message using assets's Log method
        /// </summary>
        /// 
        /// <param name="severity"> Message type</param>
        /// <param name="msg">      A message to be logged</param>
        public log(severity: Severity, msg: string): void {
            if (typeof this.asset !== 'undefined' && this.asset !== null) {
                this.asset.Log(severity, msg);
            }
        }

        ////// END: misc methods
        //////////////////////////////////////////////////////////////////////////////////////
    }
}