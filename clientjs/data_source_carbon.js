const CarbonStakingImplementationAddress = 'zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne';

/** Private async function, to compute ZIL staking balance */
async function computeCarbonStakingBalance(account, onCarbonStakingBalanceLoaded) {
    incrementShowSpinnerStakingBalance();
    computeCarbonStakingBalanceWithRetry(account, onCarbonStakingBalanceLoaded, MAX_RETRY);
}

function computeCarbonStakingBalanceWithRetry(account, onCarbonStakingBalanceLoaded, retryRemaining) {
    if (retryRemaining <= 0) {
        console.log("computeCarbonStakingBalanceWithRetry failed! Out of retries!");
        decrementShowSpinnerStakingBalance();
        return;
    }
    let walletAddressBase16 = account.base16.toLowerCase();

    window.zilPay.blockchain.getSmartContractSubState(CarbonStakingImplementationAddress, "stakers", [walletAddressBase16])
        .then(function (data) {
            if (data.result && data.result.stakers) {
                let stakedCarbonBalance = data.result.stakers[walletAddressBase16];
                if (stakedCarbonBalance) {
                    onCarbonStakingBalanceLoaded(stakedCarbonBalance);
                }
            }
            decrementShowSpinnerStakingBalance();
        })
        .catch(function () {
            console.log("computeCarbonStakingBalanceWithRetry failed! %s", retryRemaining);
            computeCarbonStakingBalanceWithRetry(account, onCarbonStakingBalanceLoaded, retryRemaining - 1);
        });
}
