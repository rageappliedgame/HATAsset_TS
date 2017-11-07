/// <summary>
/// A Dictionary class.
/// </summary>
module AssetManagerPackage {

    /// <summary>
    /// A simple Dictionary.
    /// </summary>
    export class Dictionary {
        private keys_: string[] = new Array<string>();

        /// <summary>
        /// Initializes a new instance of the Dictionary class.
        /// </summary>
        public constructor() {
            // Nothing
        }

        /// <summary>
        /// Adds key.
        /// </summary>
        ///
        /// <param name="key">   The key. </param>
        /// <param name="value"> The value. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        public add(key: string, value: any) {
            this[key] = value;
            this.keys_.push(key);
        }

        /// <summary>
        /// Removes the given key.
        /// </summary>
        ///
        /// <param name="key"> The key to remove. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        public remove(key: string) {
            var index: number = this.keys_.indexOf(key, 0);
            this.keys_.splice(index, 1);

            delete this[key];
        }

        /// <summary>
        /// Gets the keys.
        /// </summary>
        ///
        /// <returns>
        /// A string[].
        /// </returns>
        public get keys(): string[] {
            var arr = new Array<any>()
            for (var key in this.keys_) {
                arr.push(this.keys_[key]);
            }
            return arr;
        }

        /// <summary>
        /// Gets the values.
        /// </summary>
        ///
        /// <returns>
        /// An any[].
        /// </returns>
        public get values(): any[] {
            var arr = new Array<any>()
            for (var key in this.keys_) {
                arr.push(this[key]);
            }
            return arr;
        }

        /// <summary>
        /// Contains key.
        /// </summary>
        ///
        /// <param name="key"> The key. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        public containsKey(key: string) {
            return (typeof this[key] === "undefined") ? false : true;
        }
    }
}