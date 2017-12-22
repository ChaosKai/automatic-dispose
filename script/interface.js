$(document).ready(function()
{
    ADis_CreateNavbarItem();
    ADis_CreateDashboard();

    console.log("  Automatic Dispose: UI geladen");
    
    setInterval(function()
    {
        ADis_UpdateDashboardMissionList();
    }, 1000);
});


function ADis_CreateNavbarItem()
{
    $('#news_li').before('<li id="adis-nav-item"></li>');
    $('#adis-nav-item').append('<a id="adis-open-button" href="#"><img class="navbar-icon" src="" title="Automatische Disposition"></a>');
}


function ADis_CreateDashboard()
{
    var DashboardContent = '';
    DashboardContent += '<div id="adis-dashboard">';
    DashboardContent += '    <header>';
    DashboardContent += '        Autom. Disposition (ADis)';
    DashboardContent += '        <a id="adis-dashboard-close-button">';
    DashboardContent += '            <img src="https://tableau.eagledev.de/userscript/close.svg">';
    DashboardContent += '        </a>';
    DashboardContent += '    </header>';
    DashboardContent += '    <section>';
    DashboardContent += '        <a id="adis-dashboard-switch-mode-button">';
    DashboardContent += '            Modus';
    DashboardContent += '        </a>';
    DashboardContent += '        <a id="adis-dashboard-open-dispatcher-button">';
    DashboardContent += '            Disponenten';
    DashboardContent += '        </a>';
    DashboardContent += '    </section>';
    DashboardContent += '    <section id="adis-dashboard-mission-list">';
    
    DashboardContent += '    </section>';
    DashboardContent += '    <section id="adis-dashboard-mission-frame">';
    DashboardContent += '        <iframe id="adis-mission-frame" data-mission="empty">';
    DashboardContent += '        </iframe>';
    DashboardContent += '    </section>';
    DashboardContent += '</div>';

    $("#adis-nav-item").append(DashboardContent);
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

function ADis_UpdateDashboardMissionList()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    if( Missions == null )
        Missions = {};
    
    $("#adis-dashboard-mission-list").find(".mission").each(function()
    {
        if( typeof Missions[ $(this).data("mission") ] === "undefined" )
            $(this).remove();
    });
    
    $.each(Missions, function(MissionID, Mission)
    {
        if( Mission.mode == "semi" || Mission.mode == localStorage.getItem("AutomaticDispose-Mode") )
        {
            if( $("#adis-dahboard-mission-" + MissionID).length == 0 )
            {
                $("#adis-dashboard-mission-list").append('<div id="adis-dahboard-mission-' + MissionID + '" class="mission"></div>');
                $("#adis-dahboard-mission-" + MissionID).append('<div class="name"></div>');
                $("#adis-dahboard-mission-" + MissionID).append('<div class="countdown"></div>');
            }
            
            $("#adis-dahboard-mission-" + MissionID).data("mission", MissionID);
            $("#adis-dahboard-mission-" + MissionID).find(".name").html(Mission.name);
            $("#adis-dahboard-mission-" + MissionID).find(".countdown").html( (Mission.next_check - CurrentTime) + "sek.");
        }
        else if( $("#adis-dahboard-mission-" + MissionID).length > 0 )
        {
            $("#adis-dahboard-mission-" + MissionID).remove();
        }
    });

    
}
