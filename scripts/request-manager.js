
    $(document).ready( function()
    {
        setInterval( function()
        {
            collectSpeakingRequests();
        }, 5000);
    });

//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//  -
//  -           Request Manager   |   Collect Speaking Requests
//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

    function collectSpeakingRequests()
    {
        $("#building_list").find(".building_list_li").each( function()
        {
            $(this).find(".building_list_vehicle_element").each( function()
            {
                var Vehicle = {
                    index : $(this).attr("vehicle_id"),
                    status : $(this).find(".building_list_fms").text()
                }
                
                if( Vehicle.status == "5" )
                {
                    openVehicleWindow( Vehicle.index );
                }
            });
        });
    }
