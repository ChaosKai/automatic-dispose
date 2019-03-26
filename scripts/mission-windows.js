
    var MissionWindows = [];

//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//  -
//  -           Mission Windows   |   Initialize
//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    
    $(document).ready( function()
    {
        $("#col_navbar_holder").after(
            $(`<div id="automatic-dispose-mission-windows"></div>`)
        );
        
        for( var missionWindowIndex = 1; missionWindowIndex <= 5; missionWindowIndex++ )
        {
            var MissionWindow = $(`<div class="mission-window"></div>`);
            MissionWindow.attr("data-window", missionWindowIndex);
            MissionWindow.attr("data-mission", "none");
            MissionWindow.attr("data-vehicle", "none");
            MissionWindow.attr("data-building", "none");
            MissionWindow.append( $("<iframe></iframe>") );
            
            $("#alliance-vehicle-alert").append(MissionWindow);
            MissionWindows.push( MissionWindow );
        }
    });
