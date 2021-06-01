var assert = require('assert');
var StakingCarbonStatus = require('../../clientjs/staking_carbon_status.js');

describe('StakingCarbonStatus', function () {

    describe('#constructor()', function () {

        it('create plain object', function () {
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus('ziladdress', '0xaddress');

            assert.strictEqual(stakingCarbonStatus.walletAddressBech32_, 'ziladdress');
            assert.strictEqual(stakingCarbonStatus.walletAddressBase16_, '0xaddress');
            assert.strictEqual(stakingCarbonStatus.carbonBalance, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceFormattedString, null);
        });
    });

    describe('#methods()', function () {
        it('set proper data', function () {
            // Arrange
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus('ziladdress', '0x278598f13a4cb142e44dde38aba8d8c0190bcb85');

            let dataString = '{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}';
            let dataObject = JSON.parse(dataString);

            // Act
            stakingCarbonStatus.setCarbonBalanceFromData(dataObject);

            // Assert
            assert.strictEqual(stakingCarbonStatus.carbonBalance, 90.36430995);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceFormattedString, "90.36");
        });

        it('set proper data, 0 value', function () {
            // Arrange
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus('ziladdress', '0x278598f13a4cb142e44dde38aba8d8c0190bcb85');

            let dataString = '{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"0"}}}';
            let dataObject = JSON.parse(dataString);

            // Act
            stakingCarbonStatus.setCarbonBalanceFromData(dataObject);

            // Assert
            assert.strictEqual(stakingCarbonStatus.carbonBalance, 0);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceFormattedString, null);
        });

        it('set proper data, wallet not found', function () {
            // Arrange
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus('ziladdress', '0xaddress');

            let dataString = '{"id":"1","jsonrpc":"2.0","result":{"stakers":{"0x278598f13a4cb142e44dde38aba8d8c0190bcb85":"9036430995"}}}';
            let dataObject = JSON.parse(dataString);

            // Act
            stakingCarbonStatus.setCarbonBalanceFromData(dataObject);

            // Assert
            assert.strictEqual(stakingCarbonStatus.carbonBalance, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceFormattedString, null);
        });

        it('set empty stakers', function () {
            // Arrange
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus('ziladdress', '0x278598f13a4cb142e44dde38aba8d8c0190bcb85');

            let dataString = '{"id":"1","jsonrpc":"2.0","result":{"stakers":{}}}';
            let dataObject = JSON.parse(dataString);

            // Act
            stakingCarbonStatus.setCarbonBalanceFromData(dataObject);

            // Assert
            assert.strictEqual(stakingCarbonStatus.carbonBalance, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceFormattedString, null);
        });

        it('set empty data', function () {
            // Arrange
            let stakingCarbonStatus = new StakingCarbonStatus.StakingCarbonStatus('ziladdress', '0x278598f13a4cb142e44dde38aba8d8c0190bcb85');

            let dataObject = '';

            // Act
            stakingCarbonStatus.setCarbonBalanceFromData(dataObject);

            // Assert
            assert.strictEqual(stakingCarbonStatus.carbonBalance, null);
            assert.strictEqual(stakingCarbonStatus.carbonBalanceFormattedString, null);
        });
    });
});