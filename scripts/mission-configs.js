

//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Configs   |   Index File
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        $(document).ready( function()
        {
            setMissionConfigs();
        });
        
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Configs   |   Mission Configuration List
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        function setMissionConfigs()
        {
            $.getJSON( "https://automatic-disposer.000webhostapp.com/lss-bridge/available-missions.php", function( Response )
            {
                if( Response.status == "success" )
                {
                    localStorage.setItem( "Leitstellenspiel-ChaosKai-MissionConfigs", JSON.stringify(Response.missions) );
                }
            });
        }
        
        
        
        function getMissionConfigs()
        {
            return JSON.parse( localStorage.getItem("Leitstellenspiel-ChaosKai-MissionConfigs") );
        }
