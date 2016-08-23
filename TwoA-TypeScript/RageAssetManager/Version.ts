/// <reference path='Dictionary.ts' />

module AssetPackage {

    import Dictionary = AssetManagerPackage.Dictionary;

    export class Version {

        /// <summary>
        /// The private major.
        /// </summary>
        public Major: string = "0";

        /// <summary>
        /// The private minor.
        /// </summary>
        public Minor: string = "0";

        /// <summary>
        /// The private build.
        /// </summary>
        public Build: string = "0";

        /// <summary>
        /// The private revision.
        /// </summary>
        public Revision: string = "0";

        /// <summary>
        /// The public maturity.
        /// </summary>
        public Maturity: string = "";

        /// <summary>
        /// The public dependencies.
        /// </summary>
        public Dependencies: Dependency[] = [];

        /// <summary>
        /// Initializes a new instance of the version class.
        /// </summary>
        constructor(major: string, minor: string, build: string, revision: string, maturity: string) {
            this.Major = major;
            this.Minor = minor;
            this.Build = build;
            this.Revision = revision;
            this.Maturity = maturity;
            this.Dependencies = [];

            // this.Dependencies.push(new Dependency("Logger", "1.2.3", "*"));

            // Output of JSON.stringify(this)
            // {
            //        "Major":"1",
            //        "Minor":"0",
            //        "Revision":"15"
            //        "Build":"22",
            //        "Revision":"15"
            //        "Maturity":"Alpha"
            //        "Dependencies":[
            //          {"Class":"Logger","minVersion":"1.2.3","maxVersion":"*"}
            //          ]
            // }
        
            // console.log(JSON.stringify(this));
        }
    }

    /// <summary>
    /// A dependency.
    /// </summary>
    export class Dependency {

        /// <summary>
        /// The public class.
        /// </summary>
        public Class: string = "";

        /// <summary>
        /// The public minimum version.
        /// </summary>
        public minVersion: string = "";

        /// <summary>
        /// The public maximum version.
        /// </summary>
        public maxVersion: string = "";

        /// <summary>
        /// Version range.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        public get versionRange(): string {
            var minV: string = this.isEmpty(this.minVersion) ? "0.0" : this.minVersion;
            var maxV: string = this.isEmpty(this.maxVersion) ? "*" : this.maxVersion;

            return minV + "-" + maxV;
        };

        /// <summary>
        /// Query if 'str' is empty.
        /// </summary>
        ///
        /// <param name="str"> The string. </param>
        ///
        /// <returns>
        /// true if empty, false if not.
        /// </returns>
        private isEmpty(str: string): boolean {
            return (!str || 0 === str.length);
        }

        /// <summary>
        /// Initializes a new instance of the version class.
        /// </summary>
        ///
        /// <param name="Class">      The class. </param>
        /// <param name="minVersion"> The minimum version. </param>
        /// <param name="maxVersion"> The maximum version. </param>
        constructor(Class: string, minVersion: string, maxVersion: string) {
            this.Class = Class;
            this.minVersion = minVersion;
            this.maxVersion = maxVersion;
        }
    }
}