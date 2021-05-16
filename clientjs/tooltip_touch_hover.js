$(document).ready(function () {
    $('.tooltip-container').on('touchstart mouseover', function (e) {
        e.preventDefault();
        
        // This is for the bottom section, the tables
        $('.tooltip-content').hide();
        // This is for the top section, the Net Worth, etc
        $('.tooltip-content-plain').hide();

        $('.tooltip-container').removeClass('hover-effect');
        $(this).toggleClass('hover-effect');

        let currentContainerId = $(this).attr('id');
        let tooltipContentId = currentContainerId.replace("container", "tooltip_content");
        if ($('#' + tooltipContentId).css('display') === 'none') {
            $('#' + tooltipContentId).show();
        }
    });
});
