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
/// 
/// <reference path="TwoA.ts"/>
/// <reference path="Misc.ts"/>
///

module TwoAPackage
{
    import Severity = AssetPackage.Severity;

    export class BaseAdapter
    {
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const fields

        public static MIN_K_FCT: number = 0.0075;
        public static INITIAL_K_FCT: number = 0.0375; // [SC] FIDE range for K 40 for new players until 30 completed games, or as long as their rating remains under 2300; K = 20, for players with a rating always under 2400; K = 10, for players with any published rating of at least 2400 and at least 30 games played in previous events. Thereafter it remains permanently at 10.
        public static INITIAL_RATING: number = 0.01;
        public static INITIAL_UNCERTAINTY: number = 1.0;
        public static DEFAULT_TIME_LIMIT: number = 90000; // [SC] in milliseconds
        public static DEFAULT_DATETIME: string = "2015-07-22T11:56:17";

        ////// END: const fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields

        protected asset: TwoA; // [ASSET]

        public static UNASSIGNED_TYPE: string = "UNASSIGNED"; // [SC] any adapter should have a Type unique among adapters oof TwoA
        public static ERROR_CODE: number = -9999;

        public static DISTR_LOWER_LIMIT: number = 0.001;     // [SC] lower limit of any probability value
        public static DISTR_UPPER_LIMIT: number = 0.999;     // [SC] upper limit of any probability value

        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: properties

        /// <summary>
        /// Gets the type of the adapter; It needs to be overriden by inheriting classes
        /// </summary>
        static get Type(): string {
            return BaseAdapter.UNASSIGNED_TYPE;
        }

        /// <summary>
        /// Description of this adapter. It needs to be overriden by inheriting classes
        /// </summary>
        static get Description(): string {
            return BaseAdapter.UNASSIGNED_TYPE;
        }

        /// <summary>
        /// Getter for a code indicating error. 
        /// </summary>
        static get ErrorCode(): number {
            return BaseAdapter.ERROR_CODE;
        }

        /// <summary>
        /// Lower limit of a normal distribution with mean in interval (0, 1)
        /// </summary>
        static get DistrLowerLimit(): number {
            return BaseAdapter.DISTR_LOWER_LIMIT;
        }

        /// <summary>
        /// Upper limit of a normal distribution with mean in interval (0,1)
        /// </summary>
        static get DistrUpperLimit(): number {
            return BaseAdapter.DISTR_UPPER_LIMIT;
        }

        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor

        constructor() { }

        public InitSettings(p_asset: TwoA) {
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