$(document).ready(function () {

    var xHero = {

    /******************************************************
    *                                                     *
    *                    CONFIGURATION                    *
    *                                                     *
    ******************************************************/

        sleepTimer: 8000,
        animationSpeed: 1500,
        contentHeight: 129,
        minHeight: 0,
        height: 100,
        width: 100,
        path: 'src/js/lib/hero-slider/',
        filePath: 'src/js/lib/hero-slider/assets/',
        files: ['hero-road', 'hero-lake', 'hero-field'],
        fileType: '.jpg',
        slideInFomSide: false,

    /******************************************************
    *                                                     *
    *                      FUNCTIONS                      *
    *                                                     *
    ******************************************************/

        $window: $(window),
        $container: $('.hero-slider'),
        $list: $('.hero-slides'),
        $elements: $('.hero-slide'),
        $overlay: null,
        $radio: null,
        AUTO: 1,
        interval: null,
        current: 0,

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
            xHero.setup();
            xHero.start();
        },
        setup: function () {
            xHero.interaction();
            xHero.onResize();
            xHero.$container.css({
                'min-height': xHero.minHeight,
                'height': xHero.height + '%',
                'width': xHero.width + '%'
            });
            xHero.$overlay.css('margin-top', -50);
            xHero.$list.css('width', xHero.slideInFomSide ? 100 * (xHero.files.length + 1) + '%' :  xHero.width + '%');
            xHero.$elements.css({
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
            xHero.$list.find('.last-hero').css('z-index', 0);
        },
        onResize: function() {
            $('.hero-slide > h3').css('margin-top', (xHero.$window.height() / 2) - xHero.contentHeight / 2);
        },
        interaction: function () {
            if(xHero.slideInFomSide)
                xHero.$container.on('mouseenter touchstart', xHero.pause).on('mouseleave touchend', xHero.start);
            else
                xHero.$overlay.on('mouseenter touchstart', xHero.pause).on('mouseleave touchend', xHero.start);
            xHero.$radio.on('click', function () {
                xHero.current = this.value;
                xHero.swap(null);
            });
            xHero.$window.on('resize', function () {
                xHero.onResize();
            });
        },
        start: function () {
            xHero.interval = setInterval(function () {
                xHero.swap(xHero.AUTO);
            }, xHero.sleepTimer);
        },
        pause: function () {
            clearInterval(xHero.interval);
        },
        swap: function (type) {
            if (xHero.slideInFomSide) {
                xHero.$list.animate({'margin-left': (type == xHero.AUTO) ?
                '-=' + 100 + '%' : -(xHero.current * 100) + '%'}, xHero.animationSpeed, function() {
                    if(type == xHero.AUTO)
                        xHero.current++;
                    if (xHero.current == xHero.files.length) {
                        xHero.$list.css('margin-left', 0 + '%');
                        xHero.current = 0;
                    }
                    xHero.$overlay.find('#hero-button-' + xHero.current).prop('checked', true);
                });
            } else {
                if(type != xHero.AUTO) {
                    $.each(xHero.$elements, function(index, slide) {
                        if(Math.abs($(slide).css('z-index') - xHero.files.length) < xHero.current) {
                            $(this).fadeOut(xHero.animationSpeed);
                        } else {
                            $(this).fadeIn(xHero.animationSpeed);
                        }
                    });
                    return;
                }
                xHero.$list.find('.hero-slide-' + xHero.current).fadeOut(xHero.animationSpeed).promise().done(function() {
                    if(xHero.current == 0)
                        xHero.$list.find('.last-hero').show();
                    xHero.current++;
                    if(xHero.current == xHero.files.length) {
                        xHero.current = 0;
                        xHero.$elements.show();
                    }
                    xHero.$overlay.find('#hero-button-' + xHero.current).prop('checked', true);
                });
            }
        }
    };
    xHero.init();
});