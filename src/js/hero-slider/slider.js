$(document).ready(function() {

    var cssLocation = 'src/js/hero-slider/slider.css',
        imageLocation = 'src/js/hero-slider/img/',
        assetsLocation = 'src/js/hero-slider/assets/',
        sliderWidth,
        myInterval,
        currentSlide = 0,
        i,
        $window = $(window),
        $body = $('body'),
        $slider = $body.find('.hero-slider'),
        $slidesContainer = $slider.find('.hero-slides'),
        $slides = $slidesContainer.find('.hero-slide'),
        $overlay = $slider.find('.hero-overlay');

    // Appending custom CSS to page
    $('head').append('<link rel="stylesheet" type="text/css" href="' + cssLocation + '" />');

    /**************************************  Configuration **************************************/

        // [true] = sliding [false] = fading
        animationType = false,
        // If animationType == true set height of slider here
        sliderHeight = 500,
        // imageSlides to be included in slider (order does matter)
        imageSlides = ['hero1.jpg', 'hero2.jpg', 'hero3.jpg'],
        // Speed of animation, Time to sleep between slides
        sleep = 6000,
        speed = 1500,
        // Higher value means faster swap (1 = normal speed)
        swapSpeed = 2,
        textPosition = 2.5;



    // Starting slider
    CreateHero();

    // Events
    $window.on('resize', function() {
        SetDimensions();
    });
    if(animationType)
        $slider.on('mouseenter', PauseHero).on('mouseleave', StartSlider);
    else
        $overlay.on('mouseenter', PauseHero).on('mouseleave', StartFader);
    function CreateHero() {
        // Setting up Slider by calling the necessary functions
        SetDimensions();
        AddimageSlides();
        CreateOverlay();
        ChangeSlide();
        // Call function depending on slide-option
        if(animationType)
            StartSlider();
        else {
            StartFader();
        }
    }
    function PauseHero() {
        // Pausing slider by resetting myInterval
        clearInterval(myInterval);
    }
    function ChangeSlide() {
        // Change slide when user interacts with radio- or browse-buttons
        $overlay.find('input').on('click', function() {
            currentSlide = this.value;
            // User is using the sliding option. Show the appropriate slide
            if(animationType)
                $slidesContainer.animate({'margin-left':  -(currentSlide * 100) + '%'}, speed / swapSpeed);
            else {
                $.each($slides, function(index, slide) {
                    if(Math.abs($(slide).css('z-index') - imageSlides.length) < currentSlide) {
                        $(this).fadeOut(speed);
                    } else {
                        $(this).fadeIn(speed);
                    }
                });
            }
        });
    }
    function StartSlider() {
        // Setting myInterval to sleep the specified amount of time before executing animation
        myInterval = setInterval(function() {
            // Sliding imageSlides to the left until until copy of first slide is showing then reset positions
            $slidesContainer.animate({'margin-left': '-=' + 100 + '%'}, speed, function() {
                currentSlide++;
                // Reset all slides to their default state and reset counter
                if(currentSlide == imageSlides.length) {
                    $slidesContainer.css('margin-left', 0 + '%');
                    currentSlide = 0;
                }
                $overlay.find('#hero-button-' + currentSlide).prop('checked', true);
            });
        }, sleep);
    }
    function StartFader() {
        // Setting myInterval to sleep the specified amount of time before executing animation
        myInterval = setInterval(function() {
            // Fading out the shown image until copy of first slide is showing then set all to display
            $slidesContainer.find('.slide-' + currentSlide).fadeOut(speed).promise().done(function() {
                // Copy of first slide disappears at first switch therefore set it to show again
                if(currentSlide == 0)
                    $slidesContainer.find('.last-hero').show();
                currentSlide++;
                // Current slide is showing reset all slides to their original state and reset counter
                if(currentSlide == imageSlides.length) {
                    currentSlide = 0;
                    $slides.show();
                }
                $overlay.find('#hero-button-' + currentSlide).prop('checked', true);
            });
        }, sleep);
    }
    function AddimageSlides() {
        // Adding all imageSlides/slides specified in imageSlides(array) to DOM-tree as background-imageSlides to li-elements
        // Z-index is specified if user choose to use the fade-option to stack them properly on one another
        $.each(imageSlides, function(index, image) {
            $('.slide-' + index).css({
                'background-image': 'url(' + imageLocation + image + ')',
                'z-index': imageSlides.length - index
            });
        });
        $slidesContainer.find('.last-hero').css('z-index', 0);
    }
    function SetSliderHeight() {
        // Setting height automatically if fade is chosen to 100% of window, if sliding use specified height
        if(!animationType) {
            sliderHeight = $window.height();
        }
        $slider.css('height', sliderHeight);
        $slides.css('height', sliderHeight);
        // Positioning the controls for the slides at the bottom of the page
        $overlay.css('margin-top', sliderHeight - 50);
        $slides.find('h3').css('margin-top', sliderHeight / textPosition)
    }
    function SetSliderWidth() {
        // Depending the chosen animationStyle set width accordingly
        sliderWidth = $body.width();
        $slider.css('width', sliderWidth);
        // If sliding in from side
        if(animationType) {
            $slides.css('width', sliderWidth);
            $slidesContainer.css('width', sliderWidth * (imageSlides.length + 1));
            //If fading out
        } else {
            $slides.css({
                'position': 'absolute',
                'float': 'none',
                'width': sliderWidth
            });
            $slidesContainer.css('width', sliderWidth);
        }
    }
    function SetDimensions() {
        // Calling functions to set appropriate height and width for slider
        SetSliderHeight();
        SetSliderWidth();
    }
    function CreateOverlay() {
        // Creating the amount of radio-buttons needed for the slider
        for(i = 0; i < imageSlides.length; i++) {
            var $label = $('<label />', {
                    for: 'hero-button-' + i
                }),
                $radio = $('<input />', {
                    id: 'hero-button-' + i,
                    name: 'hero-radio',
                    type: 'radio',
                    value: i,
                    checked: (i == 0) ? true : false
                });
            // Appending custom radio-button .hero-overlay in DOM-tree
            $overlay.append($radio).append($label);
            // Unbind click-event from label to prevent it from firing simultaneous as click event on input
            $overlay.find('label').unbind('click');
        }
    }


});