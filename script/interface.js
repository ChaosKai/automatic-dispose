$(document).ready(function()
{
    ADis_CreateDashboard();
    
    console.log("  Automatic Dispose: UI geladen");
});


function ADis_CreateDashboard()
{
    $('#news_li').before('<li id="adis-nav-item"></li>');
    $('#adis-nav-item').load( AutomaticDispose_URL + AutomaticDispose_Branch + "/html/navbar.html", function() {
        $("#adis-dashboard").css({ display: "none", opacity: "0" });
    } );
}
