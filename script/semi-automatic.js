$(document).ready(function()
{
    if( typeof localStorage.getItem("AutomaticDispose-Mode") != "undefined" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Halb-Automatik");
    }

    setInterval( AutomaticDispose_CollectMissions, 1000 );
});



function AutomaticDispose_SwitchMode()
{
    if( localStorage.getItem("AutomaticDispose-Mode") == "semi" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "full");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Voll-Automatik");
    }
    else
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Halb-Automatik");
    }
}



function AddMission( ID, Mode )
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
}



function AutomaticDispose_CollectMissions()
{
    $("#mission_list").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

        if( $("#AutomaticDispose-Button-AddMission-" + MissionID).length == 0 )
        {
            $(this).find(".panel-heading").append('<a id="AutomaticDispose-Button-AddMission-' + MissionID + '" class="btn btn-default btn-xs">AD+</a>');
            
            $("#AutomaticDispose-Button-AddMission-" + MissionID).click(function()
            {
                AddMission( MissionID, "semi" );
            });
        }
    });
}
