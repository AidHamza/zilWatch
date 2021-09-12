const BlockchainStatusNotifyType = Object.freeze({
    "UNKNOWN": 0,
    "GET": 1,
    "WEBSOCKET": 2,
});


/** A class to represent blockchain current status.  */
class BlockchainStatusSocketConnection {

    constructor( /* nullable= */ newBlockListenerFunction) {

        this.newBlockListenerFunction_ = newBlockListenerFunction;

        this.defaultWebSocketRetryTimeoutMs_ = 500;
        this.webSocketRetryTimeoutMs_ = 500;

        // Initialize with a GET query
        this.computeDataRpc();

        // Connect with websocket
        this.connectWebSocket();
    }

    computeDataRpc() {
        if (typeof queryZilliqaApiAjax === 'undefined') {
            // Skip if undefined, this is to cater for test.
            return;
        }

        let self = this;

        queryZilliqaApiAjax(
            /* method= */
            "GetLatestTxBlock",
            /* params= */
            [''],
            /* successCallback= */
            function (data) {
                // Initialize block value if the websocket has not initialized.
                self.onRpcNotifyListener(data);
            },
            /* errorCallback= */
            function () {});

    }

    onRpcNotifyListener(data) {
        try {
            let blockNum = data.result.header.BlockNum;
            this.newBlockListenerFunction_(BlockchainStatusNotifyType.GET, blockNum, []);
        } catch (err) {
            console.log(err);
        }
    }

    connectWebSocket() {
        if (typeof WebSocket === 'undefined') {
            // Skip if undefined, this is to cater for test.
            return;
        }

        let self = this;

        let wsQueryMap = {
            "query": "NewBlock",
        }

        let ws = new WebSocket('wss://api-ws.zilliqa.com');
        ws.onopen = function () {
            // subscribe to some channels
            ws.send(JSON.stringify(wsQueryMap));
        };

        ws.onmessage = function (e) {
            let data = JSON.parse(e.data);
            try {
                if (data.query && data.query === wsQueryMap.query) {
                    self.webSocketRetryTimeoutMs_ = self.defaultWebSocketRetryTimeoutMs_;
                    console.log("WSS subscribe to NewBlock successful");
                    return;
                }
            } catch (err) {
                console.log(data, err);
                return;
            }
            self.onMessageWebSocketNotifyListener(data, wsQueryMap);
        };

        ws.onclose = function (e) {
            self.webSocketRetryTimeoutMs_ += self.webSocketRetryTimeoutMs_;
            console.log('WSS is closed. Reconnect will be attempted in ' + self.webSocketRetryTimeoutMs_ + ' ms.', e.reason);
            setTimeout(function () {
                self.connectWebSocket();
            }, self.webSocketRetryTimeoutMs_);
        };

        ws.onerror = function (err) {
            console.error('WSS encountered error: ', err.message, 'Closing socket');
            ws.close();
        };
    }

    onMessageWebSocketNotifyListener(data, wsQueryMap) {
        if (!data.type || data.type !== 'Notification') {
            return;
        }
        try {
            if (!data.values) {
                return;
            }
            let dataLength = data.values.length;
            for (let i = 0; i < dataLength; i++) {
                if (data.values[i].query === wsQueryMap.query) {
                    let blockNum = data.values[i].value.TxBlock.header.BlockNum;
                    let txHashArr = data.values[i].value.TxHashes;
                    this.newBlockListenerFunction_(BlockchainStatusNotifyType.WEBSOCKET, blockNum, txHashArr);
                }
            }
        } catch (err) {
            console.log(data, err);
        }
    }
}

if (typeof exports !== 'undefined') {
    exports.BlockchainStatusNotifyType = BlockchainStatusNotifyType;
    exports.BlockchainStatusSocketConnection = BlockchainStatusSocketConnection;
}
