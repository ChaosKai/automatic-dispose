$(document).ready(function()
{
    setInterval( ADis_CheckMissionAttention, 2000 );
});


var MissionFrameWatchDog = {};

function ADis_CheckMissionAttention()
{
    var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );
    var Missions    = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    $.each(Dispatchers, function(DispatcherID, Dispatcher)
    {
        if( !Dispatcher.state )
        {
            if( Dispatchers[DispatcherID].mission != false )
                Missions[ Dispatchers[DispatcherID].mission ].dispatcher = false;
            
            Dispatchers[DispatcherID].mission = false;
        }
        
        if( typeof Missions[Dispatcher.mission] == "undefined" )
            Dispatchers[DispatcherID].mission = false;
    });
    
    
        
    $.each(Missions, function(MissionID, Mission)
    {
        if( $("#mission_" + MissionID).length == 0 )
        {
            delete Missions[MissionID]
        }
        else if( Mission.next_check < CurrentTime )
        {
            if( !Mission.dispatcher )
            {
                $.each(Dispatchers, function(DispatcherID, Dispatcher)
                {
                    if( Dispatcher.state && !Dispatcher.mission && ADis_Available_Missions[Mission.type].type == Dispatcher.org )
                    {
                        Dispatchers[DispatcherID].mission = MissionID;
                        Missions[ Dispatchers[DispatcherID].mission ].dispatcher = Dispatcher.id;
                    }
                });
            }
            
            if( Missions[MissionID].dispatcher != false && $("#adis_dispatcher_workstation_" + Missions[MissionID].dispatcher).find("iframe").data("mission") == "empty" )
            {
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
