
    var Windows     = [];
    var WindowQueue = [];

//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//  -
//  -           Mission Windows   |   Initialize
//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    
    $(document).ready( function()
    {
        $("#col_navbar_holder").after(
            $(`<div id="automatic-dispose-windows"></div>`)
        );
        
        for( var WindowIndex = 1; WindowIndex <= 5; WindowIndex++ )
        {
            var Window = $(`<div class="window"></div>`);
            Window.attr("data-window", WindowIndex);
            Window.attr("data-mission", "none");
            Window.attr("data-vehicle", "none");
            Window.attr("data-building", "none");
            Window.append( $("<iframe></iframe>") );
            
            $("#automatic-dispose-windows").append( Window );
            Windows.push( Window );
        }
        
        setInterval( function()
        {
            executeNextQueue();
        }, 1000);
    });



//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//  -
//  -           Mission Windows   |   Queue Functions
//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

    function openVehicleWindow( VehicleId )
    {
        var AlreadyExisting = false;
        
        for( var QueueIndex = 0; QueueIndex < WindowQueue.length; QueueIndex++ )
        {
            if( WindowQueue[QueueIndex].type == "vehicle" && WindowQueue[QueueIndex].vehicle == VehicleId )
            {
                AlreadyExisting = true;
            }
        }
        
        if( !AlreadyExisting )
        {
            WindowQueue.push({
                type    : "vehicle",
                vehicle : VehicleId
            })
        }
    }



    function openMissionWindow( MissionId )
    {
        var AlreadyExisting = false;
        
        for( var QueueIndex = 0; QueueIndex < WindowQueue.length; QueueIndex++ )
        {
            if( WindowQueue[QueueIndex].type == "mission" && WindowQueue[QueueIndex].mission == MissionId )
            {
                AlreadyExisting = true;
            }
        }
        
        if( !AlreadyExisting )
        {
            WindowQueue.push({
                type    : "mission",
                vehicle : MissionId
            })
        }
    }



    function executeNextQueue()
    {
        if( WindowQueue.length == 0 )
        {
            return;
        }
        
        var FreeWindow = -1;
        
        for( var WindowIndex = 0; WindowIndex < Windows.length; WindowIndex++ )
        {
            var Window = $("#automatic-dispose-windows").find(".window").eq(WindowIndex);
            
            if( Window.attr("data-mission") == "none" && 
                Window.attr("data-vehicle") == "none" && 
                Window.attr("data-building") == "none" && 
                FreeWindow < 0 )
            {
                FreeWindow = WindowIndex;
            }
        }
        
        if( FreeWindow > -1 )
        {
            if( WindowQueue[0].type == "mission" )
            {
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).find("iframe").attr("src", `https://www.leitstellenspiel.de/missions/${WindowQueue[0].mission}`);
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).attr("data-mission", `${WindowQueue[0].mission}`);
            }
            
            if( WindowQueue[0].type == "vehicle" )
            {
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).find("iframe").attr("src", `https://www.leitstellenspiel.de/vehicles/${WindowQueue[0].vehicle}`);
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).attr("data-vehicle", `${WindowQueue[0].mission}`);
            }
            
            if( WindowQueue[0].type == "building" )
            {
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).find("iframe").attr("src", `https://www.leitstellenspiel.de/buildings/${WindowQueue[0].vehicle}`);
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).attr("data-building", `${WindowQueue[0].mission}`);
            }
                
            setTimeout( function()
            {
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).find("iframe").attr("src", ``);
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).attr("data-mission", `none`);
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).attr("data-vehicle", `none`);
                $("#automatic-dispose-windows").find(".window").eq(FreeWindow).attr("data-building", `none`);
            }, 5000);
            
            WindowQueue.splice(0, 1);
        }
    }
