$(document).ready(function()
{
    setInterval( ADis_CollectSprechwuensche, 10000 );
    setInterval( ADis_OpenNextSprechwunsch, 10000 );
});


var VehicleFrameWatchDog;

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Assign & Unassign Missions to Dispatchers
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function ADis_CollectSprechwuensche()
    {
        var Sprechwuensche = JSON.parse( localStorage.getItem("ADis-Sprechwuensche") );
        
        if( Sprechwuensche == "null" )
            Sprechwuensche = {};
        
        if( localStorage.getItem("ADis-Settings-Sprechwunsch-Automatic") == "true" )
        {
            $.each(Sprechwuensche, function(VehicleID)
            {
                if( $("#vehicle_list_" + VehicleID).find(".building_list_fms").text() != "5" )
                {
                    ADis_RemoveSprechwunschFromQueue( VehicleID );
                }
            });

            $("#building_list").find(".building_list_vehicle_element").each(function()
            {
                var VehicleStatus = $(this).find(".building_list_fms").text();
                var VehicleType   = $(this).find("a").attr("vehicle_type_id");
                var VehicleID     = $(this).attr("vehicle_id");

                if( ( VehicleType == "28" || VehicleType == "74" ) && VehicleStatus == "5" )
                {
                    ADis_AddSprechwunschToQueue( VehicleID );
                }
            });
        }
        else
        {
            localStorage.setItem( "ADis-Sprechwuensche", "{}" );
        }
    }





    function ADis_OpenNextSprechwunsch(  )
    {
        var Sprechwuensche = JSON.parse( localStorage.getItem("ADis-Sprechwuensche") );
        
        $.each(Sprechwuensche, function(VehicleID)
        {
            if( $("#adis-sprechwunsch-frame").attr("vehicle_id") == "empty" )
            {
                $("#adis-sprechwunsch-frame").attr("src", "https://www.leitstellenspiel.de/vehicles/" + VehicleID);
                $("#adis-sprechwunsch-frame").attr("vehicle_id", VehicleID);
                
                VehicleFrameWatchDog = setTimeout(function()
                {
                    ADis_RemoveSprechwunschFromQueue( $("#adis-sprechwunsch-frame").attr("vehicle_id") );
                    
                    $("#adis-sprechwunsch-frame").attr("src", "");
                    $("#adis-sprechwunsch-frame").attr("vehicle_id", "empty");
                }, 6000); 
            }
        });
    }




    
    function ADis_AddSprechwunschToQueue( VehicleID )
    {
        var Sprechwuensche = JSON.parse( localStorage.getItem("ADis-Sprechwuensche") );
        
        if( typeof Sprechwuensche[VehicleID] == "undefined" )
        {
            Sprechwuensche[VehicleID] = true;
        }
        
        localStorage.setItem( "ADis-Sprechwuensche", JSON.stringify(Sprechwuensche) );
    }
    
    function ADis_RemoveSprechwunschFromQueue( VehicleID )
    {
        var Sprechwuensche = JSON.parse( localStorage.getItem("ADis-Sprechwuensche") );
        
        if( typeof Sprechwuensche[VehicleID] == "undefined" )
        {
            delete Sprechwuensche[VehicleID];
        }
        
        localStorage.setItem( "ADis-Sprechwuensche", JSON.stringify(Sprechwuensche) );
    }
