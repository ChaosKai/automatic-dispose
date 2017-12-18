$(document).ready(function()
{
    if( typeof localStorage.getItem("AutomaticDispose-Mode") == "undefined" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
    }
    
    AutomaticDispose_SetMode( localStorage.getItem("AutomaticDispose-Mode") );
    
    if( typeof localStorage.getItem("AutomaticDispose-Missions") == "undefined" )
    {
        localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify({}) );
    }

    setInterval( AutomaticDispose_CollectMissions, 1000 );
});



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
        $("#automatic-dispose-open-button").find("img").attr("src", AutomaticDispose_URL + AutomaticDispose_Branch + "/images/full-automatic.svg");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Voll-Automatik");
    }
    else
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
        $("#automatic-dispose-open-button").find("img").attr("src", AutomaticDispose_URL + AutomaticDispose_Branch + "/images/semi-automatic.svg");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Halb-Automatik");
    }
}



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
        var MissionName = MissionElement.find(".map_position_mover").text();
        
        Missions[ ID ] = {
            "id": MissionID,
            "type": MissionType,
            "name": MissionName,
            "mode": Mode,
            "last_check": Math.floor( new Date().getTime() / 1000 ),
            "next_check": Math.floor( new Date().getTime() / 1000 ) + 1
        }
    }
    else
    {
        Missions[ ID ]["mode"] = Mode;
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
}
