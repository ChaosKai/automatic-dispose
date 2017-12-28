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




function AutomaticDispose_SwitchMode()
{
    if( localStorage.getItem("AutomaticDispose-Mode") == "semi" ) {
        AutomaticDispose_SetMode("full");
    } else {
        AutomaticDispose_SetMode("semi");
    }
}

function AutomaticDispose_SetMode( Mode )
{
    if( Mode == "full" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "full");
        $("#adis-open-button").find("img").attr("src", AutomaticDispose_URL + AutomaticDispose_Branch + "/images/full-automatic.svg");
        $("#adis-dashboard-switch-mode-button").html("Voll-Automatik");
    }
    else
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
        $("#adis-open-button").find("img").attr("src", AutomaticDispose_URL + AutomaticDispose_Branch + "/images/semi-automatic.svg");
        $("#adis-dashboard-switch-mode-button").html("Halb-Automatik");
    }
}
