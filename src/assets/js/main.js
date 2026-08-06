(function ($) {
    "use strict";

    if (!$) return;

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);

    // Initiate wowjs safely
    if (typeof WOW !== 'undefined') {
        try {
            new WOW().init();
        } catch (e) {
            console.warn('WOW.js init error:', e);
        }
    }

    $(document).ready(function() {
        // Sticky Navbar
        $(window).scroll(function () {
            if ($(this).scrollTop() > 45) {
                $('.nav-bar').addClass('sticky-top shadow-sm');
            } else {
                $('.nav-bar').removeClass('sticky-top shadow-sm');
            }
        });

        // Owl Carousels safely
        if ($.fn && $.fn.owlCarousel) {
            try {
                if ($(".header-carousel").length) {
                    $(".header-carousel").owlCarousel({
                        items: 1,
                        autoplay: true,
                        smartSpeed: 2000,
                        center: false,
                        dots: false,
                        loop: true,
                        margin: 0,
                        nav : true,
                        navText : [
                            '<i class="bi bi-arrow-left"></i>',
                            '<i class="bi bi-arrow-right"></i>'
                        ]
                    });
                }

                if ($(".productList-carousel").length) {
                    $(".productList-carousel").owlCarousel({
                        autoplay: true,
                        smartSpeed: 2000,
                        dots: false,
                        loop: true,
                        margin: 25,
                        nav : true,
                        navText : [
                            '<i class="fas fa-chevron-left"></i>',
                            '<i class="fas fa-chevron-right"></i>'
                        ],
                        responsiveClass: true,
                        responsive: {
                            0:{ items:1 },
                            576:{ items:1 },
                            768:{ items:2 },
                            992:{ items:2 },
                            1200:{ items:3 }
                        }
                    });
                }

                if ($(".productImg-carousel").length) {
                    $(".productImg-carousel").owlCarousel({
                        autoplay: true,
                        smartSpeed: 1500,
                        dots: false,
                        loop: true,
                        items: 1,
                        margin: 25,
                        nav : true,
                        navText : [
                            '<i class="bi bi-arrow-left"></i>',
                            '<i class="bi bi-arrow-right"></i>'
                        ]
                    });
                }

                if ($(".single-carousel").length) {
                    $(".single-carousel").owlCarousel({
                        autoplay: true,
                        smartSpeed: 1500,
                        dots: true,
                        dotsData: true,
                        loop: true,
                        items: 1,
                        nav : true,
                        navText : [
                            '<i class="bi bi-arrow-left"></i>',
                            '<i class="bi bi-arrow-right"></i>'
                        ]
                    });
                }

                if ($(".related-carousel").length) {
                    $(".related-carousel").owlCarousel({
                        autoplay: true,
                        smartSpeed: 1500,
                        dots: false,
                        loop: true,
                        margin: 25,
                        nav : true,
                        navText : [
                            '<i class="fas fa-chevron-left"></i>',
                            '<i class="fas fa-chevron-right"></i>'
                        ],
                        responsiveClass: true,
                        responsive: {
                            0:{ items:1 },
                            576:{ items:1 },
                            768:{ items:2 },
                            992:{ items:3 },
                            1200:{ items:4 }
                        }
                    });
                }
            } catch (e) {
                console.warn('Owl Carousel init warning:', e);
            }
        }

        // Product Quantity
        $(document).on('click', '.quantity button', function () {
            var button = $(this);
            var oldValue = button.parent().parent().find('input').val();
            var newVal = 0;
            if (button.hasClass('btn-plus')) {
                newVal = parseFloat(oldValue || 0) + 1;
            } else {
                if (oldValue > 0) {
                    newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 0;
                }
            }
            button.parent().parent().find('input').val(newVal);
        });

        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({scrollTop: 0}, 1000);
            return false;
        });
    });

})(typeof jQuery !== 'undefined' ? jQuery : null);
