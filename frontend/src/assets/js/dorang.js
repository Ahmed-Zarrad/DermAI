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
        $('html, body').addClass('light-theme').removeClass('dark-theme');
        window.localStorage.setItem('data-theme', 'light');
    });
    $('.dark').click(function(){
        $('html, body').addClass('dark-theme').removeClass('light-theme');
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
  var isLightTheme = window.localStorage.getItem('data-theme') === 'light';
  if(isLightTheme) {
    $('html, body').addClass('light-theme').removeClass('dark-theme');
  } else {
    $('html, body').addClass('dark-theme').removeClass('light-theme');
  }
});
