
        var MissionList = {};

//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Manager   |   Index File
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        if( window.location.pathname === "/" || window.location.pathname === "/#" )
        {
            
        }
        
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Manager   |   Mission File
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        if( window.location.pathname.indexOf("/missions/") !== -1 )
        {
            
        }
        
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Manager   |   Mission List
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        function setMissionList( updatedMissionList )
        {
            localStorage.setItem("Leitstellenspiel-ChaosKai-MissionList", JSON.stringify(updatedMissionList));
        }
        
        
        
        function getMissionList()
        {
            return JSON.parse( localStorage.getItem("Leitstellenspiel-ChaosKai-MissionList") );
        }
        
        
        
        function getMission( MissionId )
        {
            var MissionList = getMissionList();
            
            if( typeof MissionList[MissionId] == "undefined" )
            {
                return false;
            }
            
            return MissionList[MissionId];
        }
        
        
        
        function collectMissions()
        {
            let updatedMissionList  = {};

//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//          -
//          -           Mission Manager   |   Collect Emergency Missions
//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

            $("#mission_list").find(".missionSideBarEntry").each(function()
            {
                var collectedMission = collectMission( $(this), "emergency" );
                updatedMissionList[collectedMission.id] = collectedMission;
            });
                
//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//          -
//          -           Mission Manager   |   Collect Alliance Missions
//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
            
            $("#mission_list_alliance").find(".missionSideBarEntry").each(function()
            {
                var collectedMission = collectMission( $(this), "alliance" );
                updatedMissionList[collectedMission.id] = collectedMission;
            });
                
//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//          -
//          -           Mission Manager   |   Collect Medical Services
//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
            
            $("#mission_list_krankentransporte").find(".missionSideBarEntry").each(function()
            {
                var collectedMission = collectMission( $(this), "ambulance" );
                updatedMissionList[collectedMission.id] = collectedMission;
            });
                
            setMissionList( updatedMissionList );
        }
        
        
        
        function collectMission( MissionElement, MissionCategory )
        {
            var Mission = {
                index     : MissionElement.attr("mission_id"),
                type      : MissionElement.attr("mission_type_id"),
                category  : MissionCategory,
                config    : {},
                vehicles  : {
                    involved : {},
                    required : {}
                },
                name      : MissionElement.find(".map_position_mover").text(),
                state     : "red",
                actions   : [],
                entered   : Date.now(),
                processed : Date.now()
            }
            
            Mission.name = Mission.name.replace("[Verband] ", "");
            Mission.name = Mission.name.replace("[Event] ", "");
            
            if( typeof MissionList[Mission.index] == "object" )
            {
                Mission.name      = MissionList[Mission.index].name;
                Mission.actions   = MissionList[Mission.index].actions;
                Mission.entered   = MissionList[Mission.index].entered;
                Mission.processed = MissionList[Mission.index].processed;
                
                Mission.vehicles.involved = MissionList[Mission.index].vehicles.involved;
                Mission.vehicles.required = MissionList[Mission.index].vehicles.required;
            }

            if( MissionElement.children("div").hasClass("mission_panel_green") )
            {
                Mission.state = "green";
            }
            else if( MissionElement.children("div").hasClass("mission_panel_yellow") )
            {
                Mission.state = "yellow";
            }
            else
            {
                Mission.state = "red";
            }
            
            return Mission;
        }
