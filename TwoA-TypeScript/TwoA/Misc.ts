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

namespace Misc
{
    //////////////////////////////////////////////////////////////////////////////////////
    ////// START: const fields

    export const DATE_FORMAT: string = "yyyy-MM-ddThh:mm:ss";

    export const MIN_K_FCT: number = 0.0075;
    export const INITIAL_K_FCT: number = 0.0375; // [SC] FIDE range for K 40 for new players until 30 completed games, or as long as their rating remains under 2300; K = 20, for players with a rating always under 2400; K = 10, for players with any published rating of at least 2400 and at least 30 games played in previous events. Thereafter it remains permanently at 10.
    export const INITIAL_RATING: number = 0.01;
    export const INITIAL_UNCERTAINTY: number = 1.0;
    export const DEFAULT_TIME_LIMIT: number = 90000; // [SC] in milliseconds
    export const DEFAULT_DATETIME: string = "2015-07-22T11:56:17";

    export const UNASSIGNED_TYPE: string = "UNASSIGNED"; // [SC] any adapter should have a Type unique among adapters oof TwoA
    export const ERROR_CODE: number = -9999;

    export const DISTR_LOWER_LIMIT: number = 0.001;     // [SC] lower limit of any probability value
    export const DISTR_UPPER_LIMIT: number = 0.999;     // [SC] upper limit of any probability value

    ////// END: const fields
    //////////////////////////////////////////////////////////////////////////////////////

    export function IsNullOrEmpty(p_string: string): boolean {
        if (typeof p_string !== 'undefined' && p_string) {
            return false;
        } else {
            return true;
        }
    }

    // [SC] returns a random integer between [p_min, p_max]
    export function GetRandomInt(p_min, p_max) {
        //return p_min + Math.round(Math.random() * (p_max - p_min));
        return Math.floor(Math.random() * (p_max - p_min + 1) + p_min);
    }

    export function DaysElapsed(p_pastDateStr: string): number {
        // The number of milliseconds in one day
        let ONE_DAY: number = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        let date1_ms: number = new Date().getTime();
        let date2_ms: number = Date.parse(p_pastDateStr);

        // Calculate the difference in milliseconds
        let difference_ms: number = Math.abs(date1_ms - date2_ms);

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY);
    }

    export function GetDateStr(): string {
        return new Date().toJSON().slice(0, 19);
    }

    export function GetNormal(p_mean: number, p_stdev: number): number {
        let y2: number;
        let use_last: boolean = false;

        let y1: number;
        if (use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            let x1: number, x2: number, w: number;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        let retval: number = p_mean + p_stdev * y1;
        if (retval > 0) {
            return retval;
        }
        return -retval;
    }

    export function GetNormalOneSide(p_mean: number, p_stdev: number, p_left: boolean) {
        let value = GetNormal(p_mean, p_stdev);

        if (p_left && value > p_mean) {
            value = p_mean - (value - p_mean);
        }
        else if (!p_left && value < p_mean) {
            value = p_mean + (p_mean - value);
        }

        return value;
    }
} 