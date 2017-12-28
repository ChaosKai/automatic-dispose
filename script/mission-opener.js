$(document).ready(function()
{
    setInterval( ADis_AsignMissions, 1600 );
    setInterval( ADis_CheckMissionAttention, 2000 );
});


var MissionFrameWatchDog = {};

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Assign & Unassign Missions to Dispatchers
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function ADis_AsignMissions()
    {
        var Missions    = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
        var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );

        console.log("-------------------------------------------------------------------------------");
        console.log("    ADis - Asign Missions to Dispatchers");
        console.log("");

        $.each(Missions, function(MissionID, Mission)
        {
            if( Missions[MissionID].dispatcher != false && !Dispatchers[ Missions[MissionID].dispatcher ].state  )
            {
                console.log("      Mission: " + Mission.id + " " + Mission.name + ":");
                console.log("      - wird freigestellt");
                
                Missions[ MissionID ].dispatcher = false;
            }
            
            if( !Missions[MissionID].dispatcher )
            {
                console.log("      Mission: " + Mission.id + " " + Mission.name + ":");
                console.log("      - wird vermittelt...");
                $.each(Dispatchers, function(DispatcherID, Dispatcher)
                {
                    // count missions with this dispatcher and validate
                    var Num_Dispatcher_Missions = 0;
                    
                    $.each(Missions, function(SubMissionID, SubMission)
                    {
                        if( Missions[SubMissionID].dispatcher == Dispatcher.id )
                        {
                            Num_Dispatcher_Missions++;
                        }
                    });
                    
                    console.log("      - Anzahl der Disponenten: " + Num_Dispatcher_Missions);

                    if( Num_Dispatcher_Missions == 0 && Dispatchers[DispatcherID].state && ADis_Available_Missions[Missions[MissionID].type].type == Dispatchers[DispatcherID].org && !Missions[MissionID].dispatcher )
                    {
                        Missions[ MissionID ].dispatcher = DispatcherID;
                        console.log("      - an Dispontent " + DispatcherID + " übergeben");
                    }
                });
            }
        });
        
        localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
        localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
    }



function ADis_CheckMissionAttention()
{
    var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );
    var Missions    = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    console.log("-------------------------------------------------------------------------------");
    console.log("    ADis - Check Mission Attention");
    console.log("");
       
    $.each(Missions, function(MissionID, Mission)
    {
        if( Mission.next_check > CurrentTime )
            return true;
        
        console.log("      Mission: " + Mission.id + " " + Mission.name + ":");
        
        if( $("#mission_" + MissionID).length == 0 || Mission.mode != localStorage.getItem("AutomaticDispose-Mode") || typeof ADis_Available_Missions[Missions[MissionID].type] === "undefined" )
        {
            delete Missions[MissionID]
            console.log("      - gelöscht");
        }
        else if( Mission.next_check < CurrentTime )
        {
            console.log("      - braucht aufmerksamkeit");
            if( Missions[MissionID].dispatcher != false && $("#adis_dispatcher_workstation_" + Missions[MissionID].dispatcher).find("iframe").data("mission") == "empty" )
            {
                console.log("      - bereits disponiert");
                console.log("      - öffnen zum alarmieren");
                
                $("#adis_dispatcher_workstation_" + Missions[MissionID].dispatcher).find("iframe").attr("src", "https://www.leitstellenspiel.de/missions/" + Mission.id);
                $("#adis_dispatcher_workstation_" + Missions[MissionID].dispatcher).find("iframe").data("mission", Mission.id);
                
                MissionFrameWatchDog[MissionID] = setTimeout(function()
                {
                    ADis_CloseMission( MissionID );
                }, 10000);
            }
        }
    });
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
    localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
}


function ADis_CloseMission( MissionID )
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    $("#adis_dispatcher_workstation_" + Missions[MissionID].dispatcher).find("iframe").attr("src", "");
    $("#adis_dispatcher_workstation_" + Missions[MissionID].dispatcher).find("iframe").data("mission", "empty");
    
    clearTimeout( MissionFrameWatchDog[MissionID] );
}
