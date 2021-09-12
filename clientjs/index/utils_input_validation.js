/** 
 * Check whether a field should be validated
 * i.e., true if the field is neither readonly nor disabled,
 * and has either "pattern", "required" or "aria-invalid"
 */
function shouldBeValidated(field) {
    return (
        !(field.attr("readonly") || field.readonly) &&
        !(field.attr("disabled") || field.disabled) &&
        (field.attr("pattern") || field.attr("required"))
    );
}

/** Field testing and validation function. */
function instantValidation(field) {

    if (shouldBeValidated(field)) {
        // The field is invalid if
        // 1) It's required but the value is empty
        // 2) It has a pattern but the (non-empty) value doesn't pass
        var invalid =
            (field.attr("required") && !field.val()) ||
            (field.attr("pattern") &&
                field.val() &&
                !new RegExp(field.attr("pattern")).test(field.val()));

        // Add or remove the attribute is indicated by
        // The invalid flag and the current attribute state
        if (!invalid && field.attr("aria-invalid")) {
            field.removeAttr("aria-invalid");
        } else if (invalid && !field.attr("aria-invalid")) {
            field.attr("aria-invalid", "true");
        }
        return invalid;
    }
    return false;
}