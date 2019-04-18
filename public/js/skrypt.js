/* menu dropdown */
function menuFunction() {
    var x = document.getElementById("menu");
    if (x.className === "menubar") {
        x.className += " responsive";
    } else {
        x.className = "menubar";
    }
}



/* form alert */

function alertMessage(){
    alert("Login/Register operation");
    window.location.href = 'calendar.html';
}


/* scroll down to login */
/*
$("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#about").offset().top
    }, 2000);
});
*/

/* scroll to top of the page after clicking the footer */
$("#press").click(function() {
    $('html, body').animate({
        scrollTop: $("#ScrUp").offset().top
    }, 2000);
});
