module AssetPackage {

    /// <summary>
    /// Interface for bridge.
    /// </summary>
    export interface ILog {
        Log(severity: Severity, msg: string): void;
    }

    /// <summary>
    /// Values that represent log severity.
    /// <br/>
    ///      See
    /// <a href="https://msdn.microsoft.com/en-us/library/office/ff604025(v=office.14).aspx">Trace
    /// and Event Log Severity Levels</a>
    /// </summary>
    export enum Severity {
        /// <summary>
        /// An enum constant representing the critical option.
        /// </summary>
        Critical = 1,

        /// <summary>
        /// An enum constant representing the error option.
        /// </summary>
        Error = 2,

        /// <summary>
        /// An enum constant representing the warning option.
        /// </summary>
        Warning = 4,

        /// <summary>
        /// An enum constant representing the information option.
        /// </summary>
        Information = 8,

        /// <summary>
        /// An enum constant representing the verbose option.
        /// </summary>
        Verbose = 16
    }

    export enum LogLevel {
        /// <summary>
        /// An enum constant representing the critical option.
        /// </summary>
        Critical = Severity.Critical,

        /// <summary>
        /// An enum constant representing the error option.
        /// </summary>
        Error = Critical | Severity.Error,

        /// <summary>
        /// An enum constant representing the warning option.
        /// </summary>
        Warn = Error | Severity.Warning,

        /// <summary>
        /// An enum constant representing the information option.
        /// </summary>
        Info = Warn | Severity.Information,

        /// <summary>
        /// An enum constant representing all option.
        /// </summary>
        All = Severity.Critical | Severity.Error | Severity.Warning | Severity.Information | Severity.Verbose,
    }
}