

var DispatcherTable = {
    "1":
    {
        "id":           1,
        "name":         "Rainer Vogler",
        "occupied":     false
    }
}

$(document).ready(function()
{
    ADis_BuildDispatcherInterface();
    setInterval(ADis_UpdateDispatcherMissions, 1000);
});


function ADis_BuildDispatcherInterface()
{
    $("body").append('<div id="adis-dispatcher-overview"></div>');
    $("#adis-dispatcher-overview").append('<header></header>');
    $("#adis-dispatcher-overview").append('<div class="wrapper"></div>');
    
    $("#adis-dispatcher-overview").css({ display: "none", opacity: "0" });
    
    $("#adis-dispatcher-overview").find("header").append('<div id="adis-dispatcher-overview-title">Disponenten</div>');
    $("#adis-dispatcher-overview").find("header").append('<div id="adis-dispatcher-overview-close"><i class="far fa-times-circle"></a></div>');
    
    $("#adis-dispatcher-overview-close").click(function()
    {
        $("#adis-dispatcher-overview").animate({ opacity: "0" }, 200, function()
        {
            $(this).css("display", "none");
        });
    });
    
    $("#adis-dispatcher-overview").find(".wrapper").append('<div id="adis-dispatcher-missions"></div>');
    $("#adis-dispatcher-overview").find(".wrapper").append('<div id="adis-dispatcher-table"></div>');
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
    
    $.each(Missions, function(MissionID, Mission)
    {
        if( Mission.mode == "semi" || Mission.mode == localStorage.getItem("AutomaticDispose-Mode") )
        {
            if( $("#adis-dahboard-mission-" + MissionID).length == 0 )
            {
                $("#adis-dispatcher-missions").append('<div id="adis-dahboard-mission-' + MissionID + '" class="mission"></div>');
                $("#adis-dahboard-mission-" + MissionID).append('<div class="name"></div>');
                $("#adis-dahboard-mission-" + MissionID).append('<div class="street"></div>');
                $("#adis-dahboard-mission-" + MissionID).append('<div class="valley"></div>');
                $("#adis-dahboard-mission-" + MissionID).append('<div class="countdown"></div>');
            }
            
            $("#adis-dahboard-mission-" + MissionID).data("mission", MissionID);
            $("#adis-dahboard-mission-" + MissionID).find(".name").html(Mission.name);
            $("#adis-dahboard-mission-" + MissionID).find(".street").html(Mission.street);
            $("#adis-dahboard-mission-" + MissionID).find(".street").html(Mission.valley);
            $("#adis-dahboard-mission-" + MissionID).find(".countdown").html( (Mission.next_check - CurrentTime) + "sek.");
        }
        else if( $("#adis-dahboard-mission-" + MissionID).length > 0 )
        {
            $("#adis-dahboard-mission-" + MissionID).remove();
        }
    });
}
