/*!
=========================================================
* Dorang Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

 // toggle
$(document).ready(function(){

    $('.search-toggle').click(function(){
        $('.search-wrapper').toggleClass('show');
    });

    $('.modal-toggle').click(function(){
        $('.modalBox').toggleClass('show');
    })

    $('.modalBox').click(function(){
        $(this).removeClass('show');
    });

    $('.spinner').click(function(){
        $(".theme-selector").toggleClass('show');
    });
    $('.light').click(function(){
        $('html').addClass('light-theme');
        $('html').removeClass('dark-theme');
        $('body').addClass('light-theme');
        $('body').removeClass('dark-theme');
        window.localStorage.setItem('data-theme', 'light');
    });
    $('.dark').click(function(){
        $('html').toggleClass('dark-theme');
        $('html').removeClass('light-theme');
        $('body').toggleClass('dark-theme');
        $('body').removeClass('light-theme');
        window.localStorage.setItem('data-theme', 'dark');
    });
});



// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        }
    });
});
$(document).ready(function() {
  var isDarkTheme = window.localStorage.getItem('data-theme') === 'dark';

  $('html').toggleClass('dark-theme', isDarkTheme);
  $('html').toggleClass('light-theme', !isDarkTheme);
  $('body').toggleClass('dark-theme', isDarkTheme);
  $('body').toggleClass('light-theme', !isDarkTheme);
});
