var indexJsdom = require('../index.jsdom.js');
var $ = indexJsdom.$;

var UtilsTheme = require('../../clientjs/utils_theme.js');
var UtilsConstants = require('../../clientjs/utils_constants.js');

var assert = require('assert');

describe('UtilsTheme', function () {

    beforeEach(function (done) {
        indexJsdom.resetHtmlView(done);
        indexJsdom.assertDefaultStateMainContent();
    });

    afterEach(function () {
        indexJsdom.assertDefaultStateMainContent();
    });

    describe('#setTheme()', function () {

        beforeEach(function () {
            assert.strictEqual($('html').hasClass('dark-mode'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), false);
        });

        it('default dark, set light', function () {
            // Act
            UtilsTheme.setThemeLightMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), true);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf(UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.strictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });

        it('default dark, set light 2x', function () {
            // Act
            UtilsTheme.setThemeLightMode();
            UtilsTheme.setThemeLightMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), true);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf(UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.strictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });

        it('default dark, set dark', function () {
            // Act
            UtilsTheme.setThemeDarkMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), false);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf(UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });

        it('default dark, set light, set dark', function () {
            // Act
            UtilsTheme.setThemeLightMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), false);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), true);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf(UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.strictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });

            // Act
            UtilsTheme.setThemeDarkMode();

            // Assert
            assert.strictEqual($('html').hasClass('dark-mode'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-sun-o'), true);
            assert.strictEqual($('#toggle_theme_icon').hasClass('fa-moon-o'), false);
            $("img").each(function () {
                let imgSrc = this.src;
                if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
                    assert.notStrictEqual(imgSrc.indexOf(UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX), -1);
                } else if (imgSrc.toLowerCase().indexOf("cdn.viewblock.io") !== -1) {
                    assert.strictEqual(imgSrc.indexOf("viewblock-light.png"), -1);
                    assert.notStrictEqual(imgSrc.indexOf("viewblock-dark.png"), -1);
                }
            });
        });
    });
});
