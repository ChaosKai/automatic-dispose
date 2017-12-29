$(document).ready(function()
{   
    setInterval( ADis_CollectMissions, 5000 );
    
    setTimeout( ADis_GetAvailableMissions, 100 );       // get availabla missions after page ready
    setInterval( ADis_GetAvailableMissions, 300000 );   // update availabla missions every 5 minutes
});





function ADis_GetAvailableMissions()
{
    $.getJSON( "https://automatic-disposer.000webhostapp.com/lss-bridge/available-missions.php", function( Response )
    {
        if( Response.status == "success" )
        {
            ADis_Available_Missions = Response.missions;
            localStorage.setItem( "ADis-Available-Missions", JSON.stringify(ADis_Available_Missions) );
        }
    });
}





function ADis_CollectMissions()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    var SemiAutomatic = localStorage.getItem("ADis-Settings-Semi-Automatic");
    var FullAutomatic = localStorage.getItem("ADis-Settings-Full-Automatic");


    
    $.each(Missions, function(MissionID, Mission)
    {
        if( $("#mission_" + Mission.id).length < 1 )
        {
            delete Missions[ Mission.id ];
            return true;
        }
        
        if( $("#mission_" + Mission.id).css("display") == "none" )
        {
            delete Missions[ Mission.id ];
            return true;
        }
        
        if( typeof ADis_Available_Missions[ Mission.type ] == "undefined" )
        {
            delete Missions[ Mission.id ];
            $("#mission_" + Mission.id).animate({opacity: 1.0}, 500);
            return true;
        }
        
        if( SemiAutomatic == "false" && FullAutomatic == "false" )
        {
            delete Missions[ Mission.id ];
            $("#mission_" + Mission.id).animate({opacity: 1.0}, 500);
            return true;
        }
        
        if( SemiAutomatic == "true" && FullAutomatic == "false" && Mission.mode == "full" )
        {
            delete Missions[ Mission.id ];
            $("#mission_" + Mission.id).animate({opacity: 1.0}, 500);
            return true;
        }
            
        $("#mission_" + Mission.id).animate({opacity: 0.32}, 500);
    });
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
    
    
    
    $("#mission_list").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//      -
//      -           Emergency Missions  |  Semi-Automatic
//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        if( $("#AutomaticDispose-Button-AddMission-" + MissionID).length == 0 )
        {
            $(this).find(".panel-heading").prepend('<a id="AutomaticDispose-Button-AddMission-' + MissionID + '" class="btn btn-default btn-xs">AD+</a>');
            
            $("#AutomaticDispose-Button-AddMission-" + MissionID).click(function()
            {
                ADis_AddMission( MissionID, "semi" );
            });
        }

//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//      -
//      -           Emergency Missions  |  Full-Automatic
//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        if( FullAutomatic == "true" )
        {
            ADis_AddMission( MissionID, "full" );
        }
    });

    $("#mission_list_krankentransporte").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//      -
//      -           Ambulance Service  |  Semi-Automatic
//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        if( $("#AutomaticDispose-Button-AddMission-" + MissionID).length == 0 )
        {
            $(this).find(".panel-heading").prepend('<a id="AutomaticDispose-Button-AddMission-' + MissionID + '" class="btn btn-default btn-xs">AD+</a>');
            
            $("#AutomaticDispose-Button-AddMission-" + MissionID).click(function()
            {
                ADis_AddMission( MissionID, "semi" );
            });
        }

//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//      -
//      -           Ambulance Service  |  Full-Automatic
//      - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        if( FullAutomatic == "true" )
        {
            ADis_AddMission( MissionID, "full" );
        }
    });
}





function ADis_AddMission( ID, Mode )
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
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
