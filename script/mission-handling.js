
$(document).ready(function()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    MissionID = document.location.pathname.substr( document.location.pathname.lastIndexOf("/") + 1 );
    MissionType = Missions[ MissionID ].type;
    
    AutomaticDispose_CheckMissionAutomatic();
});



var MissionID;
var MissionType;
var MissionConfig;
var CurrentTime = Math.floor( new Date().getTime() / 1000 );

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Grab Mission-Configuration from GitHub
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function AutomaticDispose_CheckMissionAutomatic()
    {
        var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );

        if( typeof Missions[ MissionID ] !== "undefined" )
        {
            AutomaticDispose_GetMissionConfiguration();
        }
    }


    function AutomaticDispose_GetMissionConfiguration()
    {
        $.getJSON( AutomaticDispose_URL + AutomaticDispose_Branch + "/missions/" + MissionType + ".json", function( Response )
        {
            MissionConfig = Response;
        })
        .done( function()
        {
            console.log( "success" );
        })
        .fail( function()
        {
            console.log("  Automatic Dispose: Die Konfiguration für den Einsatz " + MissionType + " ist nicht verfügbar");
            var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );

            if( Missions == null )
                Missions = {};

            if( typeof Missions[ MissionID ] !== "undefined" )
            {
                Missions[ MissionID ]["last_check"] = CurrentTime;
                Missions[ MissionID ]["next_check"] = CurrentTime + 300;
            }
            
            localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
            window.close();
        });
    }


    function AD_StartAlarmProcess()
    {
        setTimeout(function()       // Process Emergency Medical Service
        {
            AD_ProcessEmergencyMedicalService();
        }, 100);
        
        setTimeout(function()       // Process Fire Department
        {
            //AD_ProcessFireDepartment();
        }, 100);
        
        setTimeout(function()       // Process Police Department
        {
            //AD_ProcessPoliceDepartment();
        }, 100);
        
        setTimeout(function()       // Process Technical Emergency Service
        {
            //AD_ProcessTechnicalEmergencyService();
        }, 100);
        
        setTimeout(function()       // Send Alarm
        {
            var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );

            if( typeof Missions[ MissionID ] !== "undefined" )
            {
                Missions[ MissionID ]["last_check"] = CurrentTime;
                Missions[ MissionID ]["next_check"] = CurrentTime + 300;
            }
            
            localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
            
            $("#mission_alarm_btn").first().click();
        }, 500);
    }

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Collect Involved Vehicles & Patients
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    var AD_Vehicles = {};
    var AD_Patients = {};

    function AD_CollectInvolvedVehicles()
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
    }


    function AD_CollectPatients()
    {
        var PatientCounter = 0;
        
        $(".mission-patient").each(function()
        {
            var PatientName = $(this).text();
            var PatientNeedRTW = false;
            var PatientNeedNEF = false;
            var PatientNeedRTH = false;
            
            if( $(this).find(".alert-danger").length > 0 && $(this).find(".alert-danger").text().indexOf("Wir benötigen ein NEF") != -1 )
            {
                PatientNeedNEF = true;
            }
            
            AD_Patients[ PatientCounter ] = {
                "name":     PatientName,
                "need_RTW": PatientNeedRTW,
                "need_NEF": PatientNeedNEF,
                "need_RTH": PatientNeedRTH
            }
            
            PatientCounter++;
        });
    }

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Process Emergency_Medical_Service
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function AD_ProcessEmergencyMedicalService()
    {
        var VehiclesNeed = {
            "38": 0 - AD_CountInvolvedVehiclesOfType("38"),      // KTW
            "28": 0 - AD_CountInvolvedVehiclesOfType("28"),      // RTW
            "29": 0 - AD_CountInvolvedVehiclesOfType("29"),      // NEF
            "74": 0 - AD_CountInvolvedVehiclesOfType("74"),      // NAW
            "73": 0 - AD_CountInvolvedVehiclesOfType("73"),      // GRTW
            "58": 0 - AD_CountInvolvedVehiclesOfType("58"),      // (SEG) KTW Typ B
            "59": 0 - AD_CountInvolvedVehiclesOfType("59"),      // (SEG) ELW 1
            "60": 0 - AD_CountInvolvedVehiclesOfType("60")       // (SEG) GW-San
        };

        
        if( typeof MissionConfig.emergency_medical_service == "object" )            // Wenn der EMS-Block in der Config definiert ist
        {
            
            $.each(AD_Patients, function(Key, Patient)
            {
                if( MissionConfig.emergency_medical_service.use_KTW )
                {
                    if( !Patient.need_RTW && !Patient.need_NEF && !Patient.need_RTH )
                        VehiclesNeed.38++;
                }
                
                if( MissionConfig.emergency_medical_service.use_RTW )
                    VehiclesNeed.28++;
                
                if( MissionConfig.emergency_medical_service.use_NEF )
                    VehiclesNeed.29++;
            });
            
            
            $("#vehicle_show_table_body_all").find(".vehicle_select_table_tr").each( function()
            {
                var VehicleID = $(this).attr("id").replace("vehicle_element_content_", "");
                var VehicleDistanceTime = $("#vehicle_sort_" + VehicleID).attr("sortvalue");
                
                if( $(this).attr("vehicle_type") == "38" && VehiclesNeed["38"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    VehiclesNeed["38"]--;
                }
                else if( $(this).attr("vehicle_type") == "74" && VehiclesNeed["28"] > 0  && VehiclesNeed["29"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    VehiclesNeed["74"]--;
                }
                else if( $(this).attr("vehicle_type") == "28" && VehiclesNeed["28"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    VehiclesNeed["28"]--;
                }
                else if( $(this).attr("vehicle_type") == "29" && VehiclesNeed["29"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    VehiclesNeed["29"]--;
                }
                else if( $(this).attr("vehicle_type") == "29" && VehiclesNeed["29"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    VehiclesNeed["29"]--;
                }
            });
            
        }
    }






    function AD_CountInvolvedVehiclesOfType( VehicleType )
    {
        var CountedVehicles = 0;
        
        $.each(AutomaticDispose_Vehicles, function( VehicleID, Vehicle )
        {
            if( Vehicle.type == VehicleType )
                CountedVehicles++;
        });
        
        return CountedVehicles;
    }
