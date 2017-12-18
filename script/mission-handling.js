
$(document).ready(function()
{
    MissionID = document.location.pathname.substr( document.location.pathname.lastIndexOf("/") + 1 );
    setTimeout( checkAutomaticAlert, 1000 );
});



var MissionID;
var MissionType;
var CurrentTime = Math.floor( new Date().getTime() / 1000 );



function AutomaticDispose_GetMissionConfiguration()
{
    $.getJSON( "example.json", function( Response )
    {
        console.log( Response );
    })
    .done( function()
    {
        console.log( "success" );
    })
    .fail( function()
    {
        var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
        if( Missions == null )
            Missions = {};

        if( typeof Missions[ MissionID ] !== "undefined" )
        {
            Missions[ MissionID ]["next_update"] = CurrentTime + 300;
        }

        localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) ); 
    });
}


