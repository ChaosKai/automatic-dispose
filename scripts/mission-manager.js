
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

        function setMissionList()
        {
            localStorage.setItem("Leitstellenspiel-ChaosKai-MissionList", JSON.stringify(MissionList));
        }
        
        
        
        function getMissionList()
        {
            return JSON.parse( localStorage.getItem("Leitstellenspiel-ChaosKai-MissionList") );
        }
        
        
        
        function collectMissions()
        {
            let UpdatedMissionList  = {};

//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//          -
//          -           Mission Manager   |   Collect Alliance Missions
//          - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

            $("#mission_list").find(".missionSideBarEntry").each(function()
            {
                collectMission( $(this), "emergency" )
            });
            
            $("#mission_list_alliance").find(".missionSideBarEntry").each(function()
            {
                collectMission( $(this), "alliance" )
            });
            
            $("#mission_list_krankentransporte").find(".missionSideBarEntry").each(function()
            {
                collectMission( $(this), "ambulance" )
            });
                
            MissionList = UpdatedMissions;
            setMissionList();
        }
        
        
        
        function collectMission( MissionElement, MissionCategory )
        {
            var Mission = {
                index     : MissionElement.attr("mission_id"),
                type      : MissionElement.attr("mission_type_id"),
                category  : MissionCategory,
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
