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

module Misc
{
    export function DaysElapsed(p_pastDateStr): number {
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
} 