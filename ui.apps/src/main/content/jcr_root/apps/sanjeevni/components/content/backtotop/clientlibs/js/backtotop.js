$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 500) {
        $('#back2Top').fadeIn().css("display", "flex");;
    } else {
        $('#back2Top').fadeOut();
    }
});

 

$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

 

});