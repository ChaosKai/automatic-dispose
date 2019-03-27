

//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Configs   |   Index File
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        $(document).ready( function()
        {
            if( localStorage.getItem("Leitstellenspiel-ChaosKai-MissionConfigsUpdate") == "null" )
            {
                setMissionConfigs();
            }
            
            setInterval( function()
            {
                if( parseInt( localStorage.getItem("Leitstellenspiel-ChaosKai-MissionConfigsUpdate") ) + 3600000 > Date.now() )
                {
                    setMissionConfigs();
                }
            }, 10000);
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
                    localStorage.setItem( "Leitstellenspiel-ChaosKai-MissionConfigsUpdate", Date.now() );
                }
            });
        }
        
        function getMissionConfig( MissionTypeId )
        {
            var MissionConfigs = JSON.parse( localStorage.getItem("Leitstellenspiel-ChaosKai-MissionConfigs") );
            
            if( typeof MissionConfigs[MissionTypeId] == "undefined" )
            {
                return false;
            }
            
            return MissionConfigs[MissionTypeId];
        }
        
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Configs   |   Get Required Vehicles
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        function getRequiredVehiclesFromConfig( MissionId )
        {
            var MissionList = getMissionList();
            var MissionConfigs = getMissionConfigs();
            
            if( typeof MissionList[MissionId] == "undefined" )
            {
                return false;
            }
            
            if( typeof MissionConfigs[ MissionList[MissionId].type ] == "undefined" )
            {
                return false;
            }
        }
