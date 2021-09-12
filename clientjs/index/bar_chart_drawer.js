/**
 * A utility class to draw bar charts.
 * Requires google chart library script src='https://www.gstatic.com/charts/loader.js'.
 */
class BarChartDrawer {

    constructor() {
        this.chartColor_ = ['#0094BA', '#71B8EB', '#B9B627', '#E0A955', '#E93E2C', '#88D581', '#3D852D', '#31531B', '#BC6B15', '#DB353F'];
        this.chartColorDarkMode_ = ['#41C6DD', '#8AB1CD', '#D8D0BC', '#C59566', '#B74F4B', '#B4E7B0', '#7FB773', '#5E8644', '#BB661E', '#EA848B'];

        this.fontColor_ = '#212529';
        this.fontColorDarkMode_ = '#d5d9dd';

        this.maxWidthSmallScreen_ = 576;
        this.fontName_ = 'Lato';

        this.fontSize_ = 14;
        this.fontSizeSmallScreen_ = 12; // 0.8
        this.height_ = 100;
        this.heightSmallScreen_ = 80; // 0.8
    }

    drawBarChart(barChartDivId, headerArray, dataArray, /* nullable= */ customChartColor, /* nullable= */ customChartColorDarkMode) {
       
        if (!barChartDivId) {
            return;
        }
        if (!headerArray) {
            return;
        }
        if (!dataArray) {
            return;
        }
        if (headerArray.length !== dataArray.length) {
            console.log("header and data array size mismatch!");
            return;
        }

        let fontColor = this.fontColor_;
        let chartColor = this.chartColor_;
        if (customChartColor) {
            chartColor = customChartColor;
        }
        if ($("html").hasClass("dark-mode")) {
            fontColor = this.fontColorDarkMode_;
            chartColor = this.chartColorDarkMode_;
            if (customChartColorDarkMode) {
                chartColor = customChartColorDarkMode;
            }
        }

        let fontName = this.fontName_;
        let fontSize = this.fontSize_;
        let height = this.height_;

        if ($(document).width() < this.maxWidthSmallScreen_) {
            fontSize = this.fontSizeSmallScreen_;
            height = this.heightSmallScreen_;
        }

        // Wrap the chart drawing in a try catch.
        // So it can quit gracefully if there is any exception (e.g., library not loaded)
        try {
            google.charts.load("current", {
                packages: ["corechart"],
            });

            $('#' + barChartDivId + '_container').show();
            google.charts.setOnLoadCallback(function () {
                let data = google.visualization.arrayToDataTable([
                    headerArray,
                    dataArray,
                ]);

                var options = {
                    height: height,
                    backgroundColor: {
                        fill: 'transparent'
                    },
                    colors: chartColor,
                    chartArea: {
                        top: '50%',
                        width: '100%',
                    },
                    bar: {
                        groupWidth: '70%'
                    },
                    legend: {
                        position: 'top',
                        textStyle: {
                            color: fontColor,
                            fontSize: fontSize,
                            fontName: fontName,
                        },
                        maxLines: 3
                    },
                    isStacked: 'percent',
                    hAxis: {
                        baselineColor: 'none',
                        ticks: []
                    }
                };

                let chart = new google.visualization.BarChart(document.getElementById(barChartDivId));
                chart.draw(data, options);
            });
        } catch (err) {
            console.log('Error in drawing chart! ' + err.message);
            return;
        }
    }
}