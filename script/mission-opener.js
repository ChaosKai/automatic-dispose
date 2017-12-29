$(document).ready(function()
{
    setInterval( ADis_AsignMissions, 4900 );
    setInterval( ADis_CheckMissionAttention, 5000 );
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
        
        var SemiAutomatic = localStorage.getItem("ADis-Settings-Semi-Automatic");
        var FullAutomatic = localStorage.getItem("ADis-Settings-Full-Automatic");

        $.each(Missions, function(MissionID, Mission)
        {
            if( typeof ADis_Available_Missions[Missions[MissionID].type] == "undefined" )
            {
                Missions[ MissionID ].dispatcher = false;
                return true;
            }
            
            if( SemiAutomatic == "false" && FullAutomatic == "false" )
            {
                Missions[ MissionID ].dispatcher = false;
                return true;
            }
            
            if( FullAutomatic == "false" && Missions[ MissionID ] == "full" )
            {
                Missions[ MissionID ].dispatcher = false;
                return true;
            }
            
            if( Missions[MissionID].dispatcher != false )
            {
                return true;
            }
            
            $.each(Dispatchers, function(DispatcherID, Dispatcher)
            {
                // count missions with this dispatcher and validate
                var Num_Dispatcher_Missions = 0;

                $.each(Missions, function(SubMissionID, SubMission)
                {
                    if( Missions[SubMissionID].dispatcher == Dispatcher.id )
                        Num_Dispatcher_Missions++;
                });

                if( Num_Dispatcher_Missions == 0 && Dispatchers[DispatcherID].state && ADis_Available_Missions[Missions[MissionID].type].type == Dispatchers[DispatcherID].org && !Missions[MissionID].dispatcher )
                {
                    Missions[ MissionID ].dispatcher = DispatcherID;
                }
            });
            
        });
        
        localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
        localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
    }



function ADis_CheckMissionAttention()
{
    var Dispatchers = JSON.parse( localStorage.getItem("ADis-Dispatchers") );
    var Missions    = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    var SemiAutomatic = localStorage.getItem("ADis-Settings-Semi-Automatic");
    var FullAutomatic = localStorage.getItem("ADis-Settings-Full-Automatic");
    
    $.each(Missions, function(MissionID, Mission)
    {
        if( Mission.next_check > CurrentTime )
            return true;
        
        if( !Missions[MissionID].dispatcher )
            return true;
            
        if( Dispatchers[ Missions[MissionID].dispatcher ].state == false  )
        {
            Missions[ MissionID ].dispatcher = false;
            return true;
        }
        
        
        if( Missions[MissionID].dispatcher != false && $("#adis-mission-frame").attr("mission_id") == "empty" )
        {
            $("#adis-mission-frame").attr("src", "https://www.leitstellenspiel.de/missions/" + Mission.id);
            $("#adis-mission-frame").attr("mission_id", Mission.id);

            MissionFrameWatchDog = setTimeout(function()
            {
                ADis_CloseMission();
            }, 10000);
        }
    });
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
    localStorage.setItem( "ADis-Dispatchers", JSON.stringify(Dispatchers) );
}


function ADis_CloseMission()
{
    $("#adis-mission-frame").attr("src", "");
    $("#adis-mission-frame").attr("mission_id", "empty");
    
    clearTimeout( MissionFrameWatchDog );
}
