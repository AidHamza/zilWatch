// utils_theme.js to handle theme changes in zilwatch

function isCurrentDarkMode() {
    return $("html").hasClass("dark-mode");
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
        if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
            let darkQueryIndex = imgSrc.indexOf("?t=dark");
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
        if (imgSrc.toLowerCase().indexOf("meta.viewblock.io") !== -1) {
            this.src = imgSrc + "?t=dark";
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

    exports.setThemeLightMode = setThemeLightMode;
    exports.setThemeDarkMode = setThemeDarkMode;
}