$(document).ready(function()
{   
    if( typeof localStorage.getItem("AutomaticDispose-Missions") == "undefined" )
    {
        localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify({}) );
    }

    setInterval( AutomaticDispose_CollectMissions, 1000 );
});



function AutomaticDispose_AddMission( ID, Mode )
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    if( Missions == null )
        Missions = {};
    
    if( typeof Missions[ ID ] == "undefined" )
    {
        var MissionElement = $("#mission_" + ID);
        
        var MissionID = MissionElement.attr("mission_id");
        var MissionType = MissionElement.attr("mission_type_id");
        var MissionName = MissionElement.find(".map_position_mover").text().split(",")[0];
        var MissionStreet = MissionElement.find(".map_position_mover").text().split(",")[1];
        var MissionVillage = MissionElement.find(".map_position_mover").text().split(",")[2];
        
        if( typeof ADis_Available_Missions[ MissionType ] != "undefined" )
        {
            Missions[ ID ] = {
                "id":           MissionID,
                "type":         MissionType,
                "name":         MissionName,
                "street":       MissionStreet,
                "village":      MissionVillage,
                "available":    false,
                "mode":         Mode,
                "dispatcher":   false,
                "last_check":   Math.floor( new Date().getTime() / 1000 ),
                "next_check":   Math.floor( new Date().getTime() / 1000 ) + 1
            }
        }
    }
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) ); 
}



function AutomaticDispose_CollectMissions()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    if( Missions == null )
        Missions = {};
    
    $.each(Missions, function(MissionID, Mission)
    {
        if( $("#mission_" + Mission.id).length < 1 )
        {
            delete Missions[ Mission.id ];
        }
        else
        {
            if( $("#mission_" + Mission.id).css("display") == "none" )
                delete Missions[ Mission.id ];
            
            $("#mission_" + Mission.id).animate({opacity: 0.32}, 500);
        }
    });
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
    
    $("#mission_list").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

        if( $("#AutomaticDispose-Button-AddMission-" + MissionID).length == 0 )
        {
            $(this).find(".panel-heading").prepend('<a id="AutomaticDispose-Button-AddMission-' + MissionID + '" class="btn btn-default btn-xs">AD+</a>');
            
            $("#AutomaticDispose-Button-AddMission-" + MissionID).click(function()
            {
                AutomaticDispose_AddMission( MissionID, "semi" );
            });
        }
    });
    
    $("#mission_list_krankentransporte").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

        if( $("#AutomaticDispose-Button-AddMission-" + MissionID).length == 0 )
        {
            $(this).find(".panel-heading").prepend('<a id="AutomaticDispose-Button-AddMission-' + MissionID + '" class="btn btn-default btn-xs">AD+</a>');
            
            $("#AutomaticDispose-Button-AddMission-" + MissionID).click(function()
            {
                AutomaticDispose_AddMission( MissionID, "semi" );
            });
        }
    });
}
