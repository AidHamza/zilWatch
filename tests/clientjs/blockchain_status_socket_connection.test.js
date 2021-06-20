var fs = require('fs')
var assert = require('assert');
var BlockchainStatusSocketConnection = require('../../clientjs/blockchain_status_socket_connection.js');

describe('BlockchainStatusSocketConnection', function () {

    describe('#constructor()', function () {

        it('create empty object', function () {
            let blockchainStatusSocketConnection = new BlockchainStatusSocketConnection.BlockchainStatusSocketConnection(null);
        });

        it('create object and invoke GET listener', function () {
            let calledBlockchainStatusNotifyType = null;
            let calledBlockNum = null;
            let calledTxHashArr = null;

            let latestTxBlockData = JSON.parse(fs.readFileSync('./tests/clientjs/latest_tx_block_20210620.txt', 'utf8'));

            let blockchainStatusSocketConnection = new BlockchainStatusSocketConnection.BlockchainStatusSocketConnection(
                function (blockchainStatusNotifyType, blockNum, txHashArr) {
                    calledBlockchainStatusNotifyType = blockchainStatusNotifyType;
                    calledBlockNum = blockNum;
                    calledTxHashArr = txHashArr;
                }
            );

            // Act
            blockchainStatusSocketConnection.onRpcNotifyListener(latestTxBlockData);

            // Assert
            assert.strictEqual(calledBlockchainStatusNotifyType, BlockchainStatusSocketConnection.BlockchainStatusNotifyType.GET);
            assert.strictEqual(calledBlockNum, "1234170");
            assert.deepStrictEqual(calledTxHashArr, []);
        });


        it('create object and invoke GET listener, invalid data, listener not invoked', function () {
            let calledBlockchainStatusNotifyType = null;
            let calledBlockNum = null;
            let calledTxHashArr = null;

            let blockchainStatusSocketConnection = new BlockchainStatusSocketConnection.BlockchainStatusSocketConnection(
                function (blockchainStatusNotifyType, blockNum, txHashArr) {
                    calledBlockchainStatusNotifyType = blockchainStatusNotifyType;
                    calledBlockNum = blockNum;
                    calledTxHashArr = txHashArr;
                }
            );

            // Suppress log
            console.log = (msg) => {};

            // Act
            blockchainStatusSocketConnection.onRpcNotifyListener({});

            // Assert
            assert.strictEqual(calledBlockchainStatusNotifyType, null);
            assert.strictEqual(calledBlockNum, null);
            assert.deepStrictEqual(calledTxHashArr, null);
        });


        it('create object and invoke WEBSOCKET listener', function () {
            let expectedTxHashArr = [
                [
                    "0950f28195d31c89fed52a01e0b369c452344c001e58984f02f3cca0f5108087",
                    "0f6af508e1ffed903053cea196f1a68bbd3749ed67702ce96dd5c460805f3a4b",
                    "1c3cd22c33798af1ed75255b7b4c5b42c312c0e07d2806314738fad299c6fc80",
                    "42cffc696e800484a1988bb6e95f1e44ba76ef79ef0c6acf5aba0434a1a02de6",
                    "5554a37224a3482573037898e247836ee87b59358efce030108877951450d00a",
                    "564519af3b1949e8d047932af7d6b2354ffaf1f4814c344f67533471fcb50e35",
                    "59eaeb393dea879f4bb748e2d2101272539a327a499c9a8e5bade069d0479001",
                    "6080d34215e1dc1211c5e85026661e8ec0e38e1df7515eff0460749b3625e4a3",
                    "8a65f4f2facc7b0c6b5d3f695fb1bd271b28d35ddf679e1cc61b7f62f2d560f0",
                    "a289ed66f03e1025a73eb93083076b579a96a9ae9745bffa4063f1b95fe702f3",
                    "c2da5905f99d781f9ca61984b1aa6563d4a5f3ae846cdb58f7981444373a2b4e",
                    "cc295aced414c6a530557e8e269b95b6a64f8574007d658aa303c9dd2e5844a8",
                    "ec6d0887effbd71d3ba531485fd3f55127065c0d940b2d94a82d13cde8d64d8d",
                    "f148cad98d8cb07a013013b9d4efe7bd2f75d60b5e2cafdf3726dddd42e09ab4"
                ],
                [
                    "0b51f4263e629f020a1a64aa926bbca2a99bf3e07e6ba3bbb1082870453c85c2",
                    "182929e32c448c6b5494cbc900b0ad27a89f79415e151a51858d9247fdf64df2",
                    "328681bf448061294530cbb72318a145edd697a363332d6f1cfc2e1e7b3f48d5",
                    "3e2099d096f72bf170f58360a0b7dcd20b02812a13fa382bbd24c53397fd1d1b",
                    "4ccccfc69385e2f396c579104cb76fd38875060e980ce9509643c2b7a98f5b0b",
                    "71df8ba0456178bb7d963a5f6fc0df7856da1c8d688cd7291ab72d7c271e8f7f",
                    "77e2c7a95d0e0283665e997dc0093f2ec6e6294c315392ed8d83fa495b10f1fb",
                    "89dc60a5d0faefa994748d68a37579357bf93ef98d596717ab79758c3b4de030",
                    "8da4ff4aa0bba22a3f3567497c4488d67395312e7dbcdf2b4464fdbc13007ab2",
                    "b364a3779ed14a19d32bf7f81d94a69a5c9af7c70db92d8a151dc9a1cf263fb4",
                    "bd4e7bec7e5b77bf1f10d07dcabe177015ca7702ee22e9bdfe2d67931e963f4f",
                    "fefbe7d4158c13b5f36f05f4734615e8d03d47236cf70a8bd760fd938581ae2d"
                ],
                [
                    "f028770a4fc8bb204e721817c85189070772195d2592219f949fcd8670b8212d",
                    "feebf3ec84db7793ccd930db98685c3c76d3b6f6f26ba9bf0f652894b648fcd5",
                    "0938d786422d195fd8fd87222fb03bc38e8181af0fc9749a04bc6034cc398cb0",
                    "1b65c24d4112483d8871a6581dae1104d81b38d4aff30c7818640081e647555e",
                    "30da8e62e34a8f62dfca7886af6f4f38ecf4aa7f42e41756fd15ab9b3af9b586",
                    "47de8c544572ff55cbe196d3cf7f2eae4411968b58eb78259f5a04fa0f26ab04",
                    "83f1d769c0373cee061afed3f3435058c88b71445e4abe4780ba29933aa0e489",
                    "ff1ec8ef7bc72373e736df553611b68365ad17be71c5c769d518986ea5365c1f"
                ],
                [
                    "974319fb66ec59bdb6f47e4b75a354de91724a200aa5c8dca0497373c282b6a2",
                    "22f383f56760e6251642c00177e84e75e681950e3ee0e0c5d69716d2bae263e2",
                    "79be9e4783e8aa8cb4a342159f34fc7335d163c80139a9a0cbd3b00c89ba914f",
                    "9de5add925b52f37303993e1be25f87b106ed7f5864509d4c530ffb7d0937f13",
                    "3dd3ff91294983b390f1b78d6096cfbac7282ff9c33b746290cb056b54f677f4",
                    "b24ba6e01fe734d31153d4f89a1427e7d47c11349b3fd8907d9c603e185245ac",
                    "0b8ee6ef1d81ce92181995886be7ddb90c46c8044ead11b61e1a278b9935d323",
                    "863e85e2c5922a6e22286524c076a38b5e036809cd1bfe9b42d5a479d488bbb2",
                    "2fac17cfc59b809e29f00751829dff4a0272aca12e1049c554e8b766cdc475fb",
                    "6aaee0f616cc30df66afd674acb13d21a31ed54cfe11c03b20346b7aacccd3e9",
                    "d7e614fce770a2b4e14f9d716e88a68fc137526d7af0699a8393d8815b3435c8",
                    "89c8bad26639c4e0157a38422db7d660b03b8641c2f9a46111c4efcf713654b3",
                    "50924aa9968155c8ae581da7506624af0f1c0443a325ed52ca7c4b965092b7a0",
                    "857b411096cf8d412cb8e790c95879ee2e6dc16d2648d8211f0cc746e7bbcce2"
                ]
            ];

            let calledBlockchainStatusNotifyType = null;
            let calledBlockNum = null;
            let calledTxHashArr = null;

            let latestWebsocketNewBlockNotificationData = JSON.parse(fs.readFileSync('./tests/clientjs/websocket_new_block_notification_20210619.txt', 'utf8'));

            let wsQueryMap = {
                "query": "NewBlock",
            }
            let blockchainStatusSocketConnection = new BlockchainStatusSocketConnection.BlockchainStatusSocketConnection(
                function (blockchainStatusNotifyType, blockNum, txHashArr) {
                    calledBlockchainStatusNotifyType = blockchainStatusNotifyType;
                    calledBlockNum = blockNum;
                    calledTxHashArr = txHashArr;
                }
            );

            // Act
            blockchainStatusSocketConnection.onMessageWebSocketNotifyListener(latestWebsocketNewBlockNotificationData, wsQueryMap);

            // Assert
            assert.strictEqual(calledBlockchainStatusNotifyType, BlockchainStatusSocketConnection.BlockchainStatusNotifyType.WEBSOCKET);
            assert.strictEqual(calledBlockNum, "1231504");
            assert.deepStrictEqual(calledTxHashArr, expectedTxHashArr);
        });


        it('create object and invoke WEBSOCKET listener, invalid data, listener not invoked', function () {
            let calledBlockchainStatusNotifyType = null;
            let calledBlockNum = null;
            let calledTxHashArr = null;

            let wsQueryMap = {
                "query": "NewBlock",
            }
            let blockchainStatusSocketConnection = new BlockchainStatusSocketConnection.BlockchainStatusSocketConnection(
                function (blockchainStatusNotifyType, blockNum, txHashArr) {
                    calledBlockchainStatusNotifyType = blockchainStatusNotifyType;
                    calledBlockNum = blockNum;
                    calledTxHashArr = txHashArr;
                }
            );

            // Act
            blockchainStatusSocketConnection.onMessageWebSocketNotifyListener(wsQueryMap, wsQueryMap);

            // Assert
            assert.strictEqual(calledBlockchainStatusNotifyType, null);
            assert.strictEqual(calledBlockNum, null);
            assert.deepStrictEqual(calledTxHashArr, null);

            // Act
            blockchainStatusSocketConnection.onMessageWebSocketNotifyListener({}, wsQueryMap);

            // Assert
            assert.strictEqual(calledBlockchainStatusNotifyType, null);
            assert.strictEqual(calledBlockNum, null);
            assert.deepStrictEqual(calledTxHashArr, null);
        });
    });
});