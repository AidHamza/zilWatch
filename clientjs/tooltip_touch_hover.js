$(document).ready(function () {
    /**
     * when .tooltip-container are mouseover-ed show a tooltip that has an ID where the current element
     * ID 'container' can be replaced by 'tooltip_content'
     */
    $('.tooltip-container').mouseover(function () {
        let currentContainerId = $(this).attr('id');
        let tooltipContentId = currentContainerId.replace("container", "tooltip_content");
        if ($('#' + tooltipContentId).css('display') === 'none') {
            $('#' + tooltipContentId).show();
        }
    });

    /**
     * when .tooltip-container are clicked trigger their mouseover event.
     */
    $('.tooltip-container').click(function () {
        $(this).mouseover();
    });

    /**
     * Remove the tooltip on .tooltip-container mouseout
     */
    $('.tooltip-container').mouseout(function () {
        let currentContainerId = $(this).attr('id');
        let tooltipContentId = currentContainerId.replace("container", "tooltip_content");

        if ($('#' + tooltipContentId).css('display') !== 'none') {
            $('#' + tooltipContentId).hide();
        }
    });
});
