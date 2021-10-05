window.addEventListener('DOMContentLoaded', event => {
    
    // Toggle the side navigation
    $('#pills-price-chart-1h-tab').on('click', function () {
        priceChartStatus.computePriceChartRange('1h');
    });
    $('#pills-price-chart-24h-tab').on('click', function () {
        priceChartStatus.computePriceChartRange('24h');
    });
    $('#pills-price-chart-7d-tab').on('click', function () {
        priceChartStatus.computePriceChartRange('7d');
    });
    $('#pills-price-chart-1m-tab').on('click', function () {
        priceChartStatus.computePriceChartRange('1m');
    });
    $('#pills-price-chart-3m-tab').on('click', function () {
        priceChartStatus.computePriceChartRange('3m');
    });
    $('#pills-price-chart-1y-tab').on('click', function () {
        priceChartStatus.computePriceChartRange('1y');
    });

    $('.list-group-item-action').on('click', function () {
        let tokenSymbol = $(this).attr('tokenSymbol');
        
        // If smaller than 576 px, i.e., phone screen, auto-close the sidebar upon tapping.
        if ($(document).width() < 576) {
            toggleSidebar();
        }
        priceChartStatus.computePriceChartTicker(tokenSymbol);
        $('#pills-price-chart-tab').tab('show');
    });
});