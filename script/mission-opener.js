$(document).ready(function()
{
    setInterval( AutomaticDispose_CheckMissionAttention, 2000 );
});


var AutomaticDispose_MissionWindows = {};

function AutomaticDispose_CheckMissionAttention()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    var CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    if( Missions == null )
        Missions = {};
        
    $.each(Missions, function(MissionID, Mission)
    {
        if( Mission.next_check < CurrentTime )
        {
            if( typeof AutomaticDispose_MissionWindows[ Mission.id ] == "undefined" && !AutomaticDispose_MissionWindows[ Mission.id ].closed )
            {
                AutomaticDispose_MissionWindows[ Mission.id ] = window.open("https://www.leitstellenspiel.de/missions/" + Mission.id, "Mission " + Mission.id, "width=256,height=512");
                Missions[ Mission.id ]["last_check"] = CurrentTime;
            }
        }
    });
    
    localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
}
