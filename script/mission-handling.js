
$(document).ready(function()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    MissionID = document.location.pathname.substr( document.location.pathname.lastIndexOf("/") + 1 );
    MissionType = Missions[ MissionID ].type;
    
    AutomaticDispose_CheckMissionAutomatic();
});



var MissionID;
var MissionType;
var CurrentTime = Math.floor( new Date().getTime() / 1000 );



function AutomaticDispose_CheckMissionAutomatic()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    if( typeof Missions[ MissionID ] !== "undefined" )
    {
        AutomaticDispose_GetMissionConfiguration();
    }
}


function AutomaticDispose_GetMissionConfiguration()
{
    $.getJSON( AutomaticDispose_URL + AutomaticDispose_Branch + "/missions/" + MissionType + ".json", function( Response )
    {
        console.log( Response );
    })
    .done( function()
    {
        console.log( "success" );
    })
    .fail( function()
    {
        console.log("  Automatic Dispose: Die Konfiguration für den Einsatz " + MissionType + " ist nicht verfügbar");
        var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
        if( Missions == null )
            Missions = {};

        if( typeof Missions[ MissionID ] !== "undefined" )
        {
            Missions[ MissionID ]["next_update"] = CurrentTime + 300;
        }

        localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
        //window.close();
    });
}


