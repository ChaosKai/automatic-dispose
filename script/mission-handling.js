
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
                Missions[ MissionID ]["next_update"] = CurrentTime + 300;
            }
console.log(Missions);
            localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
            //window.close();
        });
    }

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Collect Involved Vehicles & Patients
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    var AutomaticDispose_Vehicles = {};
    var AutomaticDispose_Patients = {};

    function AutomaticDispose_CollectInvolvedVehicles()
    {
        $("#mission_vehicle_driving tbody").find("tr").each( function()
        {
            var VehicleID = $(this).find("a").first().attr("href").substr( $(this).find("a").first().attr("href").lastIndexOf("/") + 1 );
            var VehicleName = $(this).find("a").first().text();
            var VehicleType = $(this).find("a").first().attr("vehicle_type_id");
            
            InvolvedVehicles[ VehicleID ] = {
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
            
            AutomaticDispose_Vehicles[ VehicleID ] = {
                "id": VehicleID,
                "name": VehicleName,
                "type": VehicleType
            }
        });
    }


    function AutomaticDispose_CollectPatients()
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
            
            AutomaticDispose_Patients[ PatientCounter ] = {
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

    var AutomaticDispose_EmergencyMedicalService_VehiclesNeed = {
        "38": 0,        // KTW
        "28": 0,        // RTW
        "29": 0,        // NEF
        "74": 0,        // NAW
        "73": 0,        // GRTW
        "58": 0,        // (SEG) KTW Typ B
        "59": 0,        // (SEG) ELW 1
        "60": 0,        // (SEG) GW-San
    };

    function AutomaticDispose_ProcessEmergencyMedicalService()
    {
        if( typeof MissionConfig.emergency_medical_service == "object" )            // Wenn der EMS-Block in der Config definiert ist
        {
            
            $.each(AutomaticDispose_Patients, function(Key, Patient)
            {
                if( MissionConfig.emergency_medical_service.use_KTW )
                {
                    if( !Patient.need_RTW && !Patient.need_NEF && !Patient.need_RTH )
                        AutomaticDispose_EmergencyMedicalService_VehiclesNeed["38"] += 1;
                }
                
                if( MissionConfig.emergency_medical_service.use_RTW )
                    AutomaticDispose_EmergencyMedicalService_VehiclesNeed["28"] += 1;
                
                if( MissionConfig.emergency_medical_service.use_NEF )
                    AutomaticDispose_EmergencyMedicalService_VehiclesNeed["29"] += 1;
            });
            
            
            
            //if(  )
            
        }
    }


