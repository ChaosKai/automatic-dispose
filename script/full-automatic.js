
var ADis_Available_Missions = {};


$(document).ready(function()
{   
    setInterval( ADis_FullAutomatic_CollectMissions, 10000 );
    setTimeout( ADis_GetAvailableMissions, 1000 );
});


function ADis_GetAvailableMissions()
{
    $.getJSON( "https://automatic-disposer.000webhostapp.com/lss-bridge/available-missions.php", function( Response )
    {
        console.log(Response);
        
        if( Response.status == "success" )
        {
            ADis_Available_Missions = Response.missions;
            localStorage.setItem( "ADis-Available-Mission", JSON.stringify(ADis_Available_Missions) );
        }
    });
}



function ADis_FullAutomatic_CollectMissions()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    if( Missions == null )
        Missions = {};
    
    $("#mission_list").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

        if( typeof Missions[ MissionID ] == "undefined" && typeof ADis_Available_Missions[ MissionType ] != "undefined" )
        {
            AutomaticDispose_AddMission( MissionID, "full" );
        }
    });
    
    $("#mission_list_krankentransporte").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

        if( typeof Missions[ MissionID ] == "undefined" && typeof ADis_Available_Missions[ MissionType ] != "undefined" )
        {
            AutomaticDispose_AddMission( MissionID, "full" );
        }
    });
}
