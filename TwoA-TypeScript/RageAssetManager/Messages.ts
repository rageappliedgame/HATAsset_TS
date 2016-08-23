/// <summary>
/// A Message Broadcast package.
/// </summary>
module MessagesPackage {
    /* 
     * todo error checks on nil/undefined objects (as func in subscribers[len].func(message, parameters) ?).
     * todo add sender in broadcast (or is parameters enough)?
     * todo add some more bookkeeping (like list messages).
     * todo use the hash table from AssetManager instead (so rewrite this code)?
     * 
     * done strongly typed all parameters and return types.
     */

    /// <summary>
    /// Interface for event callback.
    /// </summary>
    export interface MessagesEventCallback {
        (message: string,
            parameters: Object): void;
    }

    /// <summary>
    /// A static Broastcast Messages class.
    /// </summary>
    export class Messages {

        /// <summary>
        /// The messages is a dictionary of lists (a list of subscribers per broadcast message).
        /// </summary>
        private static messages = {};

        /// <summary>
        /// The subscription ID generator.
        /// </summary>
        private static idGenerator = -1;

        /// <summary>
        /// Defines a new Message.
        /// </summary>
        ///
        /// <param name="message"> The message. </param>
        ///
        /// <returns>
        /// true if newly defined, false if already defined.
        /// </returns>
        static define(message: string): boolean {
            if (!this.messages[message]) {
                this.messages[message] = [];

                return true;
            }

            return false;
        }

        static broadcaster(message: string, subscribers: any[], parameters: Object) {
            //var subscribers = this.messages[message];
            var len: number = subscribers ? subscribers.length : 0;

            for (var subscriber in subscribers) {
                var tmp: any = subscribers[subscriber];
                if (tmp.func) {
                    tmp.func(message, parameters);
                }

                //! This code fails to compile in the latest TypeScript version ('func' not found on type string).
                // 
                //if (subscriber.func) {
                //    subscriber.func(message, parameters);
                //}
            }
        }

        /// <summary>
        /// Broadcast a message.
        /// </summary>
        ///
        /// <param name="message">    The message to broadcast. </param>
        /// <param name="parameters"> The (optional) arguments. </param>
        ///
        /// <returns>
        /// true if the message exists else false.
        /// </returns>
        static broadcast(message: string, parameters: Object): boolean {
            if (!this.messages[message]) {
                return false;
            }

            setTimeout(this.broadcaster, 0, message, this.messages[message], parameters);
            //{
            //    broadcaster(
            //    var subscribers = this.messages[message];
            //    var len: number = subscribers ? subscribers.length : 0;

            //    for (var subscriber in subscribers) {
            //        var tmp: any = subscriber;
            //        if (tmp.func) {
            //            tmp.func(message, parameters);
            //        }

            //        //! This code fails to compile in the latest TypeScript version ('func' not found on type string).
            //        // 
            //        //if (subscriber.func) {
            //        //    subscriber.func(message, parameters);
            //        //}
            //    }
            //}, 0, message, this.messages[message]);

            return true;
        }

        /// <summary>
        /// Subscribe to a broadcast.
        /// </summary>
        ///
        /// <remarks>
        /// if the message does not exist yet it's created on-the-fly.
        /// </remarks>
        ///
        /// <param name="message">  The message. </param>
        /// <param name="callback"> The callback function. </param>
        ///
        /// <returns>
        /// the broadcast subscription id.
        /// </returns>
        static subscribe(message: string, callback: MessagesEventCallback): string {
            if (!this.messages[message]) {
                this.messages[message] = [];
            }

            /// <summary>
            /// Identifier for the subscription.
            /// </summary>
            var subscriptionId: string = (++this.idGenerator).toString();
            this.messages[message].push({
                token: subscriptionId,
                func: callback
            });

            return subscriptionId;
        }

        /// <summary>
        /// Unsubscribes the given broadcast subscription id.
        /// </summary>
        ///
        /// <param name="subscriptionId"> The broadcast subscription id. </param>
        ///
        /// <returns>
        /// true if unsubscribed else false.
        /// </returns>
        static unsubscribe(subscriptionId: string): boolean {
            for (var m in this.messages) {
                if (this.messages[m]) {
                    for (var i = 0, j = this.messages[m].length; i < j; i++) {
                        if (this.messages[m][i].token === subscriptionId) {
                            this.messages[m].splice(i, 1);

                            return true;
                        }
                    }
                }
            }

            return false;
        }
    }
}