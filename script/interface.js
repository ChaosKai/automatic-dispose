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
