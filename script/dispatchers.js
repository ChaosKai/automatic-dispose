

$(document).ready(function()
{
    ADis_BuildDispatcherInterface();
    setInterval(ADis_UpdateDispatcherMissions, 2000);
    
    ADis_InitDispatcherWorkspace();
    setInterval(ADis_UpdateDispatcherWorkspace, 2000);
});


function ADis_BuildDispatcherInterface()
{
    $("body").append('<div id="adis-dispatcher-overview"></div>');
    $("#adis-dispatcher-overview").load( AutomaticDispose_URL + AutomaticDispose_Branch + "/html/dispatchers.html" );
    
    $("#adis-dispatcher-overview").css({ display: "none", opacity: "0" });
}


function ADis_InitDispatcherWorkspace()
{
    if( localStorage.getItem("ADis-Dispatchers") == "null" )
    {
        var Dispatchers = {};
        
        for( var DispatcherID = 1; DispatcherID <= 11; DispatcherID++ )
        {
            Dispatchers[ DispatcherID ] = {
                "id":       DispatcherID,
                "state":    false,
                "org":      false,
                "mission":  false
            }
        }
        
        localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
    }
}

function ADis_UpdateDispatcherWorkspace()
{
    var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    $.each(Dispatchers, function(DispatcherID, Dispatcher)
    {
        if( Dispatcher.state ) {
            $("#adis_dispatcher_workstation_" + Dispatcher.id).find(".workstation-state").css("color", "#388e3c");
        } else {
            $("#adis_dispatcher_workstation_" + Dispatcher.id).find(".workstation-state").css("color", "#e53935");
        }
        
        if( !Dispatcher.org ) {
            $("#adis_dispatcher_workstation_" + Dispatcher.id).find(".workstation-organization").html("Inaktiv");
        } else {
            $("#adis_dispatcher_workstation_" + Dispatcher.id).find(".workstation-organization").html( Dispatcher.org );
        }
        
        var DispatcherMission = false;
                    
        $.each(Missions, function(SubMissionID, SubMission)
        {
            if( Missions[SubMissionID].dispatcher == DispatcherID )
            {
                DispatcherMission = SubMissionID;
            }
        }); 
        
        if( !DispatcherMission ) {
            $("#adis_dispatcher_workstation_" + Dispatcher.id).find(".workstation-mission").html("Kein Einsatz");
        } else {
            $("#adis_dispatcher_workstation_" + Dispatcher.id).find(".workstation-mission").html( Missions[DispatcherMission].name );
        }
    });
}

function ADis_ToggleDispatcherState( DispatcherID )
{
    var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );
    
    if( Dispatchers[DispatcherID].state ) {
        Dispatchers[DispatcherID].state = false;
    } else {
        Dispatchers[DispatcherID].state = true;
    }
    
    localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
    ADis_UpdateDispatcherWorkspace();
}

function ADis_ToggleDispatcherOrg( DispatcherID )
{
    var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );
    
    if( !Dispatchers[DispatcherID].org ) {
        Dispatchers[DispatcherID].org = "fire_department";
    } else if( Dispatchers[DispatcherID].org == "fire_department" ) {
        Dispatchers[DispatcherID].org = "emergency_medical_service";
    } else if( Dispatchers[DispatcherID].org == "emergency_medical_service" ) {
        Dispatchers[DispatcherID].org = "police_department";
    } else if( Dispatchers[DispatcherID].org == "police_department" ) {
        Dispatchers[DispatcherID].org = "technical_emergency_service";
    } else if( Dispatchers[DispatcherID].org == "technical_emergency_service" ) {
        Dispatchers[DispatcherID].org = "water_rescue";
    } else if( Dispatchers[DispatcherID].org == "water_rescue" ) {
        Dispatchers[DispatcherID].org = false;
    }
    
    localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
    ADis_UpdateDispatcherWorkspace();
}


function ADis_UpdateDispatcherMissions()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    if( Missions == null )
        Missions = {};
    
    $("#adis-dispatcher-missions").find(".mission").each(function()
    {
        if( typeof Missions[ $(this).data("mission") ] === "undefined" )
            $(this).remove();
    });
    
    if( Object.keys(Missions).length == 0 )
    {
        $("#adis-dispatcher-no-mission").show();
    }
    else
    {
        $("#adis-dispatcher-no-mission").hide();
    }
    
    $.each(Missions, function(MissionID, Mission)
    {
        if( $("#adis-dahboard-mission-" + MissionID).length == 0 )
        {
            $("#adis-dispatcher-missions").append('<div id="adis-dahboard-mission-' + MissionID + '" class="mission"></div>');
            $("#adis-dahboard-mission-" + MissionID).append('<div class="name"></div>');
            $("#adis-dahboard-mission-" + MissionID).append('<div class="street"></div>');
            $("#adis-dahboard-mission-" + MissionID).append('<div class="village"></div>');
            $("#adis-dahboard-mission-" + MissionID).append('<div class="countdown"></div>');
        }

        $("#adis-dahboard-mission-" + MissionID).data("mission", MissionID);
        $("#adis-dahboard-mission-" + MissionID).find(".name").html(Mission.name);
        $("#adis-dahboard-mission-" + MissionID).find(".street").html(Mission.street);
        $("#adis-dahboard-mission-" + MissionID).find(".village").html(Mission.village);
        $("#adis-dahboard-mission-" + MissionID).find(".countdown").html( (Mission.next_check - CurrentTime) + "sek.");
    });
}
