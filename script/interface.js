$(document).ready(function()
{
    AutomaticDispose_CreateNavbarItem();
    AutomaticDispose_CreateDashboard();

    console.log("Automatic Dispose UI geladen");
});


function AutomaticDispose_CreateNavbarItem()
{
    $('#news_li').before('<li id="automatic-dispose-nav-item"></li>');
    $('#automatic-dispose-nav-item').append('<a id="automatic-dispose-open-button" href="#"><img class="navbar-icon" title="Automatische Disposition"></a>');
}


function AutomaticDispose_CreateDashboard()
{
    var DashboardContent = '';
    DashboardContent += '<div id="automatic-dispose-dashboard">';
    DashboardContent += '    <header>';
    DashboardContent += '        Autom. Disposition';
    DashboardContent += '        <a id="automatic-dispose-dashboard-close-button">';
    DashboardContent += '            <img src="https://tableau.eagledev.de/userscript/close.svg">';
    DashboardContent += '        </a>';
    DashboardContent += '    </header>';
    DashboardContent += '    <section>';
    DashboardContent += '        <a id="automatic-dispose-dashboard-switch-mode-button">';
    DashboardContent += '            Modus';
    DashboardContent += '        </a>';
    DashboardContent += '    </section>';
    DashboardContent += '</div>';

    $("#automatic-dispose-nav-item").append(DashboardContent);
    $("#automatic-dispose-dashboard").css({ display: "none", opacity: "0" });


    $("#automatic-dispose-open-button").click(function()
    {
        $("#automatic-dispose-dashboard").css("display", "flex");
        $("#automatic-dispose-dashboard").animate( { opacity: 1 }, 200 );
    });

    $("#automatic-dispose-dashboard-close-button").click(function()
    {
        $("#automatic-dispose-dashboard").animate( { opacity: 0 }, 200, function()
        {
            $(this).css("display", "none");
        });
    });

    $("#automatic-dispose-dashboard-switch-mode-button").click(function()
    {
        AutomaticDispose_SwitchMode();
    });
}
