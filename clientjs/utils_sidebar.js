function toggleSidebar() {
    let isSidebarShown = $(document.body).hasClass('sidenav-shown');
    if (isSidebarShown) {
        $(document.body).removeClass('sidenav-shown');
    } else {
        $(document.body).addClass('sidenav-shown');
    }
    localStorage.setItem('is_sidenav_shown', !isSidebarShown);

    if (typeof onScreenResizeCallback === "function") {
        // The screen size will change after the animation ends, i.e., after 200ms
        setTimeout(onScreenResizeCallback, 210);
        setTimeout(onScreenResizeCallback, 310);
    }
}

window.addEventListener('DOMContentLoaded', event => {
    // Get the user's sidebar preference from local storage, if it's available
    let isSideBarShownLocalStorage = localStorage.getItem("is_sidenav_shown");
    // If it's set to false, hide sidebar, by default it's shown
    if (isSideBarShownLocalStorage === 'false') {
        $(document.body).removeClass('sidenav-shown');
    } else {
        $(document.body).addClass('sidenav-shown');
    }
    if (typeof onScreenResizeCallback === "function") {
        // The screen size will change after the animation ends, i.e., after 200ms
        setTimeout(onScreenResizeCallback, 210);
        setTimeout(onScreenResizeCallback, 310);
    }

    // Toggle the side navigation
    $('.sidebar-toggler').each(function () {
        $(this).on('click', function () {
            toggleSidebar();
        });
    });
});