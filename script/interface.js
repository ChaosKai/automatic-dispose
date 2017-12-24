$(document).ready(function()
{
    ADis_CreateDashboard();
    
    if( typeof localStorage.getItem("AutomaticDispose-Mode") == "undefined" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
    }
    
    setTimeout(function()
    {
        AutomaticDispose_SetMode( localStorage.getItem("AutomaticDispose-Mode") );
    }, 1000);
    
    console.log("  Automatic Dispose: UI geladen");
});


function ADis_CreateDashboard()
{
    $('#news_li').before('<li id="adis-nav-item"></li>');
    $('#adis-nav-item').load( AutomaticDispose_URL + AutomaticDispose_Branch + "/html/navbar.html", function() {
        $("#adis-dashboard").css({ display: "none", opacity: "0" });
    } );
}
