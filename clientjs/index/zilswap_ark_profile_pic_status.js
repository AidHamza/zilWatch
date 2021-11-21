/** A class to represent profile pic status from Zilswap ARK.  */
class ZilswapArkProfilePicStatus {

    constructor() {
        // private variable
        this.walletAddressBase16_ = null;
    }

    reset() {
        this.walletAddressBase16_ = null;
        $('.ark-profile-anchor').each(function() {
            this.href = '';
        });
        $('.ark-profile-pic').each(function () {
            this.src = '';
        }).hide();
    }

    isWalletAddressSet() {
        if (this.walletAddressBase16_) {
            return true;
        }
        return false;
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.reset();
        this.walletAddressBase16_ = walletAddressBase16.toLowerCase();
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        beforeRpcCallback();
        if (!this.isWalletAddressSet()) {
            onErrorCallback();
            return;
        }

        let arkUserProfileUrl = CONST_ZILSWAP_ARK_USER_PROFILE_URL.replace(CONST_ZILSWAP_ARK_WALLET_ADDRESS_REPLACE_TAG, this.walletAddressBase16_);
        let arkApiEndpoint = CONST_ZILSWAP_ARK_USER_DETAILS.replace(CONST_ZILSWAP_ARK_WALLET_ADDRESS_REPLACE_TAG, this.walletAddressBase16_);

        let self = this;
        queryUrlGetAjaxWithRetry(
            /* urlToGet= */
            arkApiEndpoint,
            /* successCallback= */
            function (data) {
                try {
                    let profilePicUrl = data.result.model.profileImage.url;
                    self.bindViewProfilePic(profilePicUrl, arkUserProfileUrl);
                    onSuccessCallback();
                    return;
                } catch (err) {
                    console.log('Error querying profile pic from ARK API! ' + err.message);
                }
                onErrorCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            },
            /* maxRetry= */ 0); // No retries, because it could be 404 if user doesn't have ARK account and spamming ARK server.
    }

    bindViewProfilePic(profilePicUrl, arkUserProfileUrl) {
        $('.ark-profile-anchor').each(function() {
            this.href = arkUserProfileUrl;
        });
        $('.ark-profile-pic').each(function () {
            this.src = profilePicUrl;
        }).show();
    }
}