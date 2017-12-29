$(document).ready(function()
{
    ADis_CreateDashboard();
    ADis_CreateIframes();
    
    console.log("  Automatic Dispose: UI geladen");
});


function ADis_CreateDashboard()
{
    $('#news_li').before('<li id="adis-nav-item"></li>');
    $('#adis-nav-item').load( AutomaticDispose_URL + AutomaticDispose_Branch + "/html/navbar.html", function() {
        $("#adis-dashboard").css({ display: "none", opacity: "0" });
    } );
}

function ADis_CreateIframes()
{
    $("body").append('<div id="adis-frame-container"></div>');
    $("#adis-frame-container").load( AutomaticDispose_URL + AutomaticDispose_Branch + "/html/iframes.html" );
    
    $("#adis-frame-container").css({ display: "none", opacity: "0" });
}
