
        var MissionData = {};
        var MissionConfig = {};

//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Handler   |   Index File
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        $(document).ready( function()
        {
            MissionData = getMission( window.location.href.substr(window.location.href.lastIndexOf("/")+1) );
            MissionConfig = getMissionConfig( MissionData.type );
        });
        
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Handler   |   Mission List
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        function setMissionList()
        {
            
        }

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Collect Involved Vehicles & Patients
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    var AD_Vehicles = {};
    var AD_Patients = {};

    function ADis_CollectInvolvedVehicles()
    {
        $("#mission_vehicle_driving tbody").find("tr").each( function()
        {
            var VehicleID = $(this).find("a").first().attr("href").substr( $(this).find("a").first().attr("href").lastIndexOf("/") + 1 );
            var VehicleName = $(this).find("a").first().text();
            var VehicleType = $(this).find("a").first().attr("vehicle_type_id");
            
            AD_Vehicles[ VehicleID ] = {
                "id": VehicleID,
                "name": VehicleName,
                "type": VehicleType
            }
        });
        
        $("#mission_vehicle_at_mission tbody").find("tr").each( function()
        {
            var VehicleID = $(this).find("a").first().attr("href").substr( $(this).find("a").first().attr("href").lastIndexOf("/") + 1 );
            var VehicleName = $(this).find("a").first().text();
            var VehicleType = $(this).find("a").first().attr("vehicle_type_id");
            
            AD_Vehicles[ VehicleID ] = {
                "id": VehicleID,
                "name": VehicleName,
                "type": VehicleType
            }
        });
        
        console.log("  Automatic Dispose: Bereits beteiligte Fahrzeuge:");
        console.log(AD_Vehicles);
    }
        
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//      -
//      -           Mission Handler   |   Mission List
//      - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

        function startAlarmProcess()
        {
            console.log("  Automatic Dispose: Starte Alarmierungsprozess");

            setTimeout(function()       // Process Fire Department
            {
                ADis_PrepareVehicleNeedList();
                ADis_CollectInvolvedVehicles();
                ADis_CollectPatients();
            }, 200);

            setTimeout(function()       // Process Emergency Medical Service
            {
                ADis_ProcessEmergencyMedicalService();
                ADis_ProcessFireDepartment();
                ADis_ProcessPoliceDepartment();
                //ADisfile_ProcessTechnicalEmergencyService();
                ADis_ProcessWaterRescue();
            }, 500);

            setTimeout(function()       // Send Alarm
            {
                var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );

                if( typeof Missions[ MissionID ] !== "undefined" )
                {
                    Missions[ MissionID ]["last_check"] = CurrentTime;
                    if( ADis_CheckNeedMoreVehicles() )    {
                        Missions[ MissionID ]["next_check"] = CurrentTime + 60;
                    } else {
                        Missions[ MissionID ]["next_check"] = CurrentTime + 300;
                    }
                }

                localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );

                $("#mission_alarm_btn").first().click();
            }, 1500);
        }
