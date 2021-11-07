// utils_theme.js to handle theme changes in zilwatch

function isCurrentDarkMode() {
    return $("html").hasClass("dark-mode");
}

function isContainsMetaViewBlock(srcUrl) {
    return srcUrl.toLowerCase().indexOf(CONST_META_VIEWBLOCK_IO) !== -1;
}

document.addEventListener("DOMContentLoaded", () => {
    // Get the user's theme preference from local storage, if it's available
    let currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
        setThemeLightMode();
    } else {
        setThemeDarkMode();
    }
});

$("#toggle_theme_btn").on('click', function () {
    let isCurrentDark = isCurrentDarkMode();
    let theme;
    if (isCurrentDark) {
        theme = "light";
        setThemeLightMode();
    } else {
        theme = "dark";
        setThemeDarkMode();
    }
    // Finally, let's save the current preference to localStorage to keep using it
    localStorage.setItem("theme", theme);

    if (typeof onThemeChangeCallback === "function") {
        onThemeChangeCallback();
    }
});

function setThemeLightMode() {
    $("html").removeClass("dark-mode");
    $("#toggle_theme_icon").removeClass("fa-sun-o");
    $("#toggle_theme_icon").addClass("fa-moon-o");
    $("img").each(function () {
        let imgSrc = this.src;
        if (isContainsMetaViewBlock(imgSrc)) {
            let darkQueryIndex = imgSrc.indexOf(CONST_VIEWBLOCK_LOGO_DARK_SUFFIX);
            if (darkQueryIndex !== -1) {
                this.src = imgSrc.substr(0, darkQueryIndex);
            }
        } else if (imgSrc.indexOf("viewblock-dark") !== -1) {
            this.src = imgSrc.replace("viewblock-dark.png", "viewblock-light.png");
        }
    });
}

function setThemeDarkMode() {
    $("html").addClass("dark-mode");
    $("#toggle_theme_icon").removeClass("fa-moon-o");
    $("#toggle_theme_icon").addClass("fa-sun-o");
    $("img").each(function () {
        let imgSrc = this.src;
        if (isContainsMetaViewBlock(imgSrc)) {
            this.src = imgSrc + CONST_VIEWBLOCK_LOGO_DARK_SUFFIX;
        } else if (imgSrc.indexOf("viewblock-light.png") !== -1) {
            this.src = imgSrc.replace("viewblock-light.png", "viewblock-dark.png");
        }
    });
}
if (typeof exports !== 'undefined') {

    if (typeof $ === 'undefined') {
        $ = global.jQuery = require('jquery');
    }

    if (typeof localStorage === 'undefined') {
        MockLocalStorage = require('../tests/mocks/mock_localstorage.js');
        localStorage = new MockLocalStorage.MockLocalStorage();
    }

    if (typeof CONST_META_VIEWBLOCK_IO === 'undefined') {
        UtilsConstants = require('./utils_constants.js');
        CONST_META_VIEWBLOCK_IO = UtilsConstants.CONST_META_VIEWBLOCK_IO;
        CONST_VIEWBLOCK_LOGO_DARK_SUFFIX = UtilsConstants.CONST_VIEWBLOCK_LOGO_DARK_SUFFIX;
    }

    exports.isCurrentDarkMode = isCurrentDarkMode;
    exports.isContainsMetaViewBlock = isContainsMetaViewBlock;
    exports.setThemeLightMode = setThemeLightMode;
    exports.setThemeDarkMode = setThemeDarkMode;
}