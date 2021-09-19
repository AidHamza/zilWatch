var indexJsdom = require('../../index.jsdom.js');
var $ = indexJsdom.$;
var fs = require('fs')

var assert = require('assert');
var SimpleChartStatus = require('../../../clientjs/index/simple_chart_status.js');
var Constants = require('../../../constants.js');

describe('SimpleChartStatus', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
    });

    describe('#constructor()', function () {

        it('create plain object', function () {
            let simpleChartStatus = new SimpleChartStatus.SimpleChartStatus(Constants.zrcTokenPropertiesListMap, /* simpleAllTokensData= */ null);

            assert.deepStrictEqual(simpleChartStatus.chartSeriesList_, []);
            assert.deepStrictEqual(simpleChartStatus.simpleAllTokensData_, {});
        });

        it('create real object', function () {
            let simpleAllTokensData = JSON.parse(fs.readFileSync('./tests/testdata/zilwatch_24h_simple_all_tokens_20210920.txt', 'utf8'));
            let simpleChartStatus = new SimpleChartStatus.SimpleChartStatus(Constants.zrcTokenPropertiesListMap, simpleAllTokensData);

            assert.deepStrictEqual(simpleChartStatus.chartSeriesList_, []);
            assert.deepStrictEqual(simpleChartStatus.simpleAllTokensData_, simpleAllTokensData);
        });
    });
});