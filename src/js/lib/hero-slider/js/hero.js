$(document).ready(function () {

    var xHero = {

        /******************************************************
         *                                                     *
         *                    CONFIGURATION                    *
         *                                                     *
         ******************************************************/

        /*
         * To integrate this in a framework just remove
         * encapsulating anonymous function .ready() and
         * xHero.init() at bottom of script and instead
         * call it from your main file.
         * */


        /*
         * Configuration options for slider behavior
         * */
        sleepTimer: 4000,
        animationSpeed: 1500,
        contentHeight: 129,
        minHeight: 0,
        height: 100,
        width: 100,
        /*
         * Path to hero-slider lib
         * */
        path: 'src/js/lib/hero-slider/',
        /*
         * Path to image-catalogue         *
         * */
        filePath: 'src/js/lib/hero-slider/assets/',
        /*
         * Put image-names in array in the order to be displayed in
         * */
        files: ['hero-road', 'hero-lake', 'hero-field'],
        /*
         * Specify file-type on images (all images must be of the same type)
         * */
        fileType: '.jpg',
        /*
         * true: images slides in from the side
         * false: images fade in from behind
         * */
        slideInFomSide: true,
        /*
         * true: pause on hover with whole slider
         * false: pause on hover with controlbar
         * */
        pauseOption: false,

        /******************************************************
         *                                                     *
         *                      FUNCTIONS                      *
         *                                                     *
         ******************************************************/

        // Variables used which are not to be altered
        $window: $(window),
        $container: $('.hero-slider'),
        $list: $('.hero-slides'),
        $elements: $('.hero-slide'),
        $overlay: null,
        $radio: null,
        interval: null,
        current: 0,
        previous: 0,

        // Creating and appending dynamic DOM-elements
        init: function () {
            var $css =
                    $('<link />', {
                        rel: 'stylesheet',
                        type: 'text/css',
                        href: xHero.path + 'css/hero.css'
                    }),
                $label,
                $radio,
                $overlay;
            $overlay = $('<div />', {
                class: 'hero-overlay'
            });
            $('head').append($css);
            xHero.$container.append($overlay);
            for (var i = 0; i < xHero.files.length; i++) {
                $label = $('<label />', {
                    for: 'hero-button-' + i
                }),
                    $radio = $('<input />', {
                        id: 'hero-button-' + i,
                        name: 'hero-radio',
                        type: 'radio',
                        value: i,
                        checked: (i == 0) ? true : false
                    });
                $overlay.append($radio).append($label);
                $('.hero-overlay label').unbind('click');
            }
            xHero.$overlay = $($overlay);
            xHero.$radio = $(xHero.$overlay.find('input'));
            // Setting up correct behavior depending on animationType
            xHero.setup();
            // Starting slider by calling .start() function.
            xHero.start();
        },
        setup: function () {
            // Setting up listeners for user interactions
            xHero.interaction();
            xHero.onResize();
            // Creating behavior for slides and appending images
            xHero.$container.css({
                'min-height': xHero.minHeight,
                'height': xHero.height + '%',
                'width': xHero.width + '%'
            });
            xHero.$overlay.css('margin-top', -50);
            xHero.$list.css('width', xHero.slideInFomSide ? 100 * (xHero.files.length + 1) + '%' :  xHero.width + '%');
            xHero.$elements.css({
                'display': xHero.slideInFomSide ? 'block' : 'none',
                'position': xHero.slideInFomSide ? 'relative' : 'absolute',
                'float': xHero.slideInFomSide ? 'left' : 'none',
                'min-height': xHero.minHeight,
                'height': xHero.slideInFomSide ? 100 + '%' : xHero.height + '%',
                'width': xHero.slideInFomSide ? 100 / (xHero.files.length + 1) + '%' : xHero.width + '%'
            });
            $.each(xHero.files, function(index, image) {
                $('.hero-slide-' + index).css({
                    'background-image': 'url(' + xHero.filePath + image + xHero.fileType + ')',
                    'z-index': xHero.files.length - index
                });
            });
            xHero.$list.find('.hero-slide:first-child').css('display', 'block');
            xHero.$list.find('.last-hero').css('z-index', 0);
        },
        // Running on window resize
        onResize: function() {
            $('.hero-slide > h3').css('margin-top', (xHero.$window.height() / 2) - xHero.contentHeight / 2);
        },
        // function containing all user-interactions
        interaction: function () {
            // If pauseOption = true, pause slider when hovering over slider else only when over controls
            if(xHero.pauseOption)
                xHero.$container.on('mouseenter touchstart', xHero.pause).on('mouseleave touchend', xHero.start);
            else
                xHero.$overlay.on('mouseenter touchstart', xHero.pause).on('mouseleave touchend', xHero.start);
            xHero.$radio.on('click', function () {
                xHero.previous = xHero.current;
                xHero.current = this.value;
                xHero.swap();
            });
            xHero.$window.on('resize', function () {
                xHero.onResize();
            });
        },
        start: function () {
            xHero.interval = setInterval(function () {
                xHero.previous = xHero.current;
                xHero.current++;
                xHero.swap();
            }, xHero.sleepTimer + xHero.animationSpeed);
        },
        pause: function () {
            clearInterval(xHero.interval);
        },
        swap: function () {
            if(xHero.current == xHero.previous)
                return;
            if (xHero.slideInFomSide) {
                xHero.$list.animate({'margin-left': -(xHero.current * 100) + '%'}, xHero.animationSpeed, function() {
                    if (xHero.current == xHero.files.length) {
                        xHero.current = 0;
                        xHero.$list.css('margin-left', 0 + '%');
                    }
                    xHero.$overlay.find('#hero-button-' + xHero.current).prop('checked', true);
                });
            } else {
                // If at last slide set current to first and then swap
                if(xHero.current == xHero.files.length) {
                    xHero.current = 0;
                }
                xHero.$list.find('.hero-slide-' + xHero.current).fadeIn(xHero.animationSpeed, function () {
                    xHero.$overlay.find('#hero-button-' + xHero.current).prop('checked', true);
                });
                xHero.$list.find('.hero-slide-' + xHero.previous).fadeOut(xHero.animationSpeed);
            }
        }
    };
    xHero.init();
});