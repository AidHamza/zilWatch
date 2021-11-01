/** A class to obtain NFT related status.  */
class NftCollectionStatus {

    constructor(nftTokenPropertiesListMap) {
        // Private variable
        this.nftTokenPropertiesListMap_ = nftTokenPropertiesListMap; // Refer to constants.js for definition

        // private variable
        this.walletAddressBase16_ = null;

        // A dict of NFTs that the wallet owns
        this.walletNftAttributesMap_ = null;
    }

    setWalletAddressBase16(walletAddressBase16) {
        // Need to reset the attributes when wallet is changed.
        this.resetPersonal();
        this.walletAddressBase16_ = walletAddressBase16;
    }

    resetPersonal() {
        this.walletNftAttributesMap_ = null;
        for (let nftTicker in this.nftTokenPropertiesListMap_) {
            $('#' + nftTicker + '_content_list').empty();
            $('#' + nftTicker + '_container').hide();
        }
        $('#empty_nft_container').show();
    }

    computeAndBindViewAllNfts() {
        if (!this.walletNftAttributesMap_) {
            return;
        }
        for (let nftTicker in this.walletNftAttributesMap_) {
            let currNftOwnedList = this.walletNftAttributesMap_[nftTicker];

            for (let i = 0; i < currNftOwnedList.length; i++) {
                let singleNftAttr = currNftOwnedList[i];
                this.computeAndBindViewSingleNft(nftTicker, singleNftAttr);
            }
        }
    }

    computeAndBindViewSingleNft(nftTicker, singleNftAttr) {
        let imageDictPathArr = this.nftTokenPropertiesListMap_[nftTicker].image_dict_path;
        if (imageDictPathArr.length === 0) {
            this.bindViewSingleNft(nftTicker, singleNftAttr, singleNftAttr.uri);
        } else {
            this.computeSingleNftImageRpc(nftTicker, singleNftAttr, imageDictPathArr);
        }
    }

    bindViewSingleNft(nftTicker, singleNftAttr, nftImageSrc) {
        if ('image_url_replace_from' in this.nftTokenPropertiesListMap_[nftTicker] && 'image_url_replace_to' in this.nftTokenPropertiesListMap_[nftTicker]) {
            nftImageSrc = nftImageSrc.replace(this.nftTokenPropertiesListMap_[nftTicker].image_url_replace_from, this.nftTokenPropertiesListMap_[nftTicker].image_url_replace_to);
        }

        let zilswapHref = CONST_ZILSWAP_ARK_ROOT_URL + '/' + this.nftTokenPropertiesListMap_[nftTicker].address + '/' + singleNftAttr.id;
        let viewblockHref = CONST_VIEWBLOCK_ROOT_URL + '/' + this.nftTokenPropertiesListMap_[nftTicker].address + '/?' + CONST_VIEWBLOCK_SUFFIX_PARAM_NFT_ID + singleNftAttr.id;
        let singleNftAttributesHref = null;
        let nftTokenLogo = null;
        if ('website_nft_attributes_prefix' in this.nftTokenPropertiesListMap_[nftTicker]) {
            singleNftAttributesHref = this.nftTokenPropertiesListMap_[nftTicker].website_nft_attributes_prefix + "/" + singleNftAttr.id;
            nftTokenLogo = this.nftTokenPropertiesListMap_[nftTicker].logo_url;
        }
        let singleNftTemplate = this.getSingleNftHtmlTemplate(nftTicker, singleNftAttr.id, nftImageSrc, viewblockHref, zilswapHref, singleNftAttributesHref, nftTokenLogo);
        $('#' + nftTicker + '_content_list').append(singleNftTemplate)

        $('#empty_nft_container').hide();
        $('#' + nftTicker + '_container').show();
    }

    getSingleNftHtmlTemplate(nftTicker, nftId, nftImageSrc, viewblockHref, zilswapHref, singleNftAttributesHref, nftTokenLogo) {
        let htmlTemplate = "<div class='col-6 col-lg-4 col-xl-3' style='padding: 0.35rem;' >" +
            "<div class='card' >" +
            "<img class='card-img-top' src='" + nftImageSrc + "' alt='NFT_picture' loading='lazy' />" +
            "<div class='card-body' >" +
            "<div class='card-title'>" +
            "<span class='h5 font-weight-bold'>" + nftTicker + " #" + nftId + "</span>";
        if (singleNftAttributesHref && nftTokenLogo) {
            htmlTemplate += "<a class='mini-button-box ml-2' href='" + singleNftAttributesHref + "' target='_blank' style='color: var(--text-color);') >" +
                "<i class='fa fa-external-link ml-1 mr-1'></i>" +
                "</a>";
        }
        htmlTemplate += "</div>" +
            "<a class='mini-button-box' href='" + viewblockHref + "' target='_blank' style='color: var(--text-color);') >" +
            "<img height='20' src='https://cdn.viewblock.io/viewblock-light.png' alt='ViewBlock logo' />" +
            "<i class='fa fa-external-link ml-2 mr-1'></i>" +
            "</a>" +
            "<a class='mini-button-box ml-1' href='" + zilswapHref + "' target='_blank' style='color: var(--text-color);') >" +
            "<img height='20' src='https://meta.viewblock.io/ZIL.zil1p5suryq6q647usxczale29cu3336hhp376c627/logo' alt='ZilSwap logo' />" +
            "<i class='fa fa-external-link ml-2 mr-1'></i>" +
            "</a>";
            "</div>" +
            "</div>" +
            "</div>";
        return htmlTemplate;
    }

    computeDataRpc(beforeRpcCallback, onSuccessCallback, onErrorCallback) {
        if (!this.walletAddressBase16_) {
            return;
        }

        let walletAddressBase16Lower = this.walletAddressBase16_.toLowerCase();

        beforeRpcCallback();
        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            CONST_ZILWATCH_ROOT_URL + "/api/nft" + "?wallet_address=" + walletAddressBase16Lower + "&requester=zilwatch_dashboard",
            /* successCallback= */
            function (data) {
                if (!data) {
                    onErrorCallback();
                    return;
                }
                self.walletNftAttributesMap_ = data;
                self.computeAndBindViewAllNfts();

                onSuccessCallback();
            },
            /* errorCallback= */
            function () {
                onErrorCallback();
            });
    }

    computeSingleNftImageRpc(nftTicker, singleNftAttr, imageDictPathArr) {
        let self = this;
        queryUrlGetAjax(
            /* urlToGet= */
            singleNftAttr.uri,
            /* successCallback= */
            function (data) {
                if (!data) {
                    return;
                }
                let tempDict = data;
                for (let i = 0; i < imageDictPathArr.length; i++) {
                    tempDict = tempDict[imageDictPathArr[i]];
                }
                self.bindViewSingleNft(nftTicker, singleNftAttr, tempDict);
            },
            /* errorCallback= */
            function () {});
    }
}