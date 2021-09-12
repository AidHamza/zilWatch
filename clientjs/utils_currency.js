// utils_currency.js to handle currency changes in zilwatch

document.addEventListener("DOMContentLoaded", () => {
    let currentCurrencyCode = localStorage.getItem("currency");
    if (!currentCurrencyCode) {
        currentCurrencyCode = "usd";
    }

    if (typeof onCurrencyChangeCallback === "function") {
        onCurrencyChangeCallback(currentCurrencyCode);
    }

    // Required to initialize currencyMap in pug views.
    let currencySymbol = currencyMap[currentCurrencyCode];
    $("#currency_selector").val(currentCurrencyCode);
    $(".currency_symbol").text(currencySymbol);

});

$("#currency_selector").on('change', function () {
    let currencyCode = $(this).val();
    localStorage.setItem("currency", currencyCode);

    if (typeof onCurrencyChangeCallback === "function") {
        onCurrencyChangeCallback(currencyCode);
    }
});

