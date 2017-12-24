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
    $('#adis-nav-item').load( AutomaticDispose_URL + AutomaticDispose_Branch + "/html/navbar.html" );
    $("#adis-dashboard").css({ display: "none", opacity: "0" });

    $("#adis-open-button").click(function()
    {
        $("#adis-dashboard").css("display", "flex");
        $("#adis-dashboard").animate( { opacity: 1 }, 200 );
    });

    $("#adis-dashboard-close-button").click(function()
    {
        $("#adis-dashboard").animate( { opacity: 0 }, 200, function()
        {
            $(this).css("display", "none");
        });
    });

    $("#adis-dashboard-switch-mode-button").click(function()
    {
        AutomaticDispose_SwitchMode();
    });

    $("#adis-dashboard-open-dispatcher-button").click(function()
    {
        $("#adis-dispatcher-overview").css("display", "flex");
        $("#adis-dispatcher-overview").animate({ opacity: 1 }, 200);
    });
}
