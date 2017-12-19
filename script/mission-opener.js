$(document).ready(function()
{
    setInterval( ADis_CheckMissionAttention, 2000 );
});


var MissionFrameWatchDog;

function ADis_CheckMissionAttention()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    if( Missions == null )
        Missions = {};
        
    $.each(Missions, function(MissionID, Mission)
    {
        if( $("#mission_" + MissionID).length == 0 )
        {
            delete Missions[MissionID]
        }
        else if( Mission.next_check < CurrentTime )
        {
            //if( typeof AutomaticDispose_MissionWindows[ Mission.id ] === "undefined" || AutomaticDispose_MissionWindows[ Mission.id ].closed )
            if( $("#adis-mission-frame").data("mission") == "empty" )
            {
                $("#adis-mission-frame").attr("src", "https://www.leitstellenspiel.de/missions/" + Mission.id);
                $("#adis-mission-frame").data("mission", Mission.id);
                
                MissionFrameWatchDog = setTimeout(function()
                {
                    ADis_CloseMission();
                }, 10000);
            }
        }
    });
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
}


function ADis_CloseMission()
{
    $("#adis-mission-frame").attr("src", "");
    $("#adis-mission-frame").data("mission", "empty");
    
    clearTimeout(MissionFrameWatchDog);
}
