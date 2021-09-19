window.addEventListener('DOMContentLoaded', event => {

    // Get the user's sidebar preference from local storage, if it's available
    let isSideBarShownLocalStorage = localStorage.getItem("is_sidenav_shown");
    // If it's set to false, hide sidebar, by default it's shown
    if (isSideBarShownLocalStorage === 'false') {
        $(document.body).removeClass('sidenav-shown');
    } else {
        $(document.body).addClass('sidenav-shown');
    }

    // Toggle the side navigation
    $('.sidebar-toggler').each(function () {
        $(this).on('click', function () {
            let isSidebarShown = $(document.body).hasClass('sidenav-shown');
            if (isSidebarShown) {
                $(document.body).removeClass('sidenav-shown');
            } else {
                $(document.body).addClass('sidenav-shown');
            }
            localStorage.setItem('is_sidenav_shown', !isSidebarShown);
        });
    });
});