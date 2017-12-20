

var MissionID;
var MissionType;
var MissionConfig;
var CurrentTime;


$(document).ready(function()
{
    var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
    
    MissionID   = document.location.pathname.substr( document.location.pathname.lastIndexOf("/") + 1 );
    MissionType = $("#mission_help").attr("href").substr( $("#mission_help").attr("href").lastIndexOf("/") + 1 );
    CurrentTime = Math.floor( new Date().getTime() / 1000 );
    
    setTimeout(function()
    {
        ADis_CheckMissionAutomatic();
    }, 100);
});



//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Grab Mission-Configuration from GitHub
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function ADis_CheckMissionAutomatic()
    {
        var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );
        
        if( typeof Missions[MissionID] != "undefined" && Missions[MissionID].next_check < CurrentTime )
        {
            AD_GetMissionConfiguration();
        }
        else
        {
            window.parent.ADis_CloseMission();
        }
    }


    function AD_GetMissionConfiguration()
    {
        console.log("  Automatic Dispose: Lade Einsatzkonfiguration aus GitHub...");
        
        $.getJSON( AutomaticDispose_URL + AutomaticDispose_Branch + "/missions/" + MissionType + ".json", function( Response )
        {
            MissionConfig = Response;
        })
        .done( function()
        {
            console.log("  Automatic Dispose: Einsatzkonfiguration erfolgreich geladen.");
            AD_StartAlarmProcess();
        })
        .fail( function()
        {
            console.log("  Automatic Dispose: Die Konfiguration für den Einsatz " + MissionType + " ist nicht verfügbar!");
            var Missions = JSON.parse( localStorage.getItem("AutomaticDispose-Missions") );

            if( typeof Missions[ MissionID ] !== "undefined" )
            {
                Missions[ MissionID ]["last_check"] = CurrentTime;
                Missions[ MissionID ]["next_check"] = CurrentTime + 300;
            }
            
            localStorage.setItem( "AutomaticDispose-Missions", JSON.stringify(Missions) );
            window.parent.ADis_CloseMission();
        });
    }


    function AD_StartAlarmProcess()
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


    function ADis_CollectPatients()
    {
        var PatientCounter = 0;
        
        $(".mission_patient").each(function()
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
        
        console.log("  Automatic Dispose: Patientenliste:");
        console.log(AD_Patients);
    }

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Process Emergency_Medical_Service
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function ADis_ProcessEmergencyMedicalService()
    {
        
//      -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
//      -
//      -               Emergency Medical Service: Vehicles
//      -
//      -                   38:     KTW
//      -                   28:     RTW
//      -                   28:     NEF
//      -                   74:     NAW
//      -                   73:     GRTW
//      -
//      -                   58:     (SEG) KTW Typ B
//      -                   59:     (SEG) ELW 1
//      -                   60:     (SEG) GW-San
//      -
//      -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
        
        if( typeof MissionConfig.emergency_medical_service == "object" )            // Wenn der EMS-Block in der Config definiert ist
        {
            $.each(AD_Patients, function(Key, Patient)
            {
                if( MissionConfig.emergency_medical_service.use_KTW )
                {
                    if( !Patient.need_RTW && !Patient.need_NEF && !Patient.need_RTH )
                        ADis_VehiclesNeed["38"]++;
                }
                
                if( MissionConfig.emergency_medical_service.use_RTW )
                    ADis_VehiclesNeed["28"]++;
                
                if( MissionConfig.emergency_medical_service.use_NEF )
                    ADis_VehiclesNeed["29"]++;
            });
            
            var VehicleTable;
            
            if( $("#vehicle_show_table_body_all").length > 0 )
            {
                VehicleTable = $("#vehicle_show_table_body_all");
            }
            else
            {
                VehicleTable = $("#vehicle_show_table_body_rett");
            }
            
            VehicleTable.find(".vehicle_select_table_tr").each( function()
            {
                var VehicleID = $(this).attr("id").replace("vehicle_element_content_", "");
                var VehicleDistanceTime = $("#vehicle_sort_" + VehicleID).attr("sortvalue");
                
                if( $(this).attr("vehicle_type") == "KTW" && ADis_VehiclesNeed["38"] > 0 )
                {
                    console.log("  Automatic Dispose: Fahrzeug " + VehicleID + " " + $(this).attr("vehicle_type") + " markiert");
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["38"]--;
                }
                else if( $(this).attr("vehicle_type") == "NAW" && ADis_VehiclesNeed["28"] > 0  && ADis_VehiclesNeed["29"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["74"]--;
                    ADis_VehiclesNeed["28"]--;
                    ADis_VehiclesNeed["29"]--;
                }
                else if( $(this).attr("vehicle_type") == "RTW" && ADis_VehiclesNeed["28"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["28"]--;
                }
                else if( $(this).attr("vehicle_type") == "NEF" && ADis_VehiclesNeed["29"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["29"]--;
                }
            });
        }
    }

//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Process Fire_Department
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function ADis_ProcessFireDepartment()
    {
        
//      -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
//      -
//      -               Fire Department: Vehicles
//      -
//      -                    0:     LF 20
//      -                    1:     LF 10
//      -                    6:     LF 8/6
//      -                    7:     LF 20/16
//      -                    8:     LF 10/6
//      -                    9:     LF 16-TS
//      -                   30:     HLF 20
//      -                   37:     TSF-W
//      -
//      -                   17:     TLF 2000
//      -                   18:     TLF 3000
//      -                   19:     TLF 8/8
//      -                   20:     TLF 8/18
//      -                   21:     TLF 16/24-Tr
//      -                   22:     TLF 16/25
//      -                   23:     TLF 16/45
//      -                   24:     TLF 20/40
//      -                   25:     TLF 20/40-SL
//      -                   26:     TLF 16
//      -
//      -                    2:     DLK 23
//      -                    3:     ELW 1
//      -                   34:     ELW 2
//      -                   36:     MTW
//      -                   57:     Kran
//      -
//      -                    4:     RW
//      -                    5:     GW-A
//      -                   10:     GW-Öl
//      -                   12:     GW-Mess
//      -                   53:     GW-Dekon-P
//      -                   27:     GW-Gefahrgut
//      -                   33:     GW-Höhenrettung
//      -
//      -                   11:     GW-L2-Wasser
//      -                   13:     SW 1000
//      -                   14:     SW 2000
//      -                   15:     SW 2000-Tr
//      -                   16:     SW KatS
//      -
//      -                   46:     WLF
//      -                   47:     AB-Rüst
//      -                   48:     AB-Atemschutz
//      -                   49:     AB-Öl
//      -                   54:     AB-Dekon-P
//      -                   62:     AB-Schlauch
//      -
//      -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
        
        if( typeof MissionConfig.fire_department == "object" )            // Wenn der FD-Block in der Config definiert ist
        {
            ADis_VehiclesNeed["0"]  += MissionConfig.fire_department.num_LF;
            ADis_VehiclesNeed["3"]  += MissionConfig.fire_department.num_ELW_1;
            ADis_VehiclesNeed["34"] += MissionConfig.fire_department.num_ELW_2;
            ADis_VehiclesNeed["2"]  += MissionConfig.fire_department.num_DLK;
            ADis_VehiclesNeed["4"]  += MissionConfig.fire_department.num_RW;
            ADis_VehiclesNeed["57"] += MissionConfig.fire_department.num_FwK;
            ADis_VehiclesNeed["5"]  += MissionConfig.fire_department.num_GW_A;
            ADis_VehiclesNeed["27"] += MissionConfig.fire_department.num_GW_G;
            ADis_VehiclesNeed["10"] += MissionConfig.fire_department.num_GW_Oel;
            ADis_VehiclesNeed["12"] += MissionConfig.fire_department.num_GW_Mess;
            ADis_VehiclesNeed["11"] += MissionConfig.fire_department.num_SW;
            ADis_VehiclesNeed["33"] += MissionConfig.fire_department.num_GW_Hoeh;
            ADis_VehiclesNeed["53"] += MissionConfig.fire_department.num_Dekon_P;
            
            $("#vehicle_show_table_body_all").find(".vehicle_select_table_tr").each( function()
            {
                var VehicleID = $(this).attr("id").replace("vehicle_element_content_", "");
                var VehicleDistanceTime = $("#vehicle_sort_" + VehicleID).attr("sortvalue");
                
                if( ( $(this).attr("vehicle_type") == "LF 20" || $(this).attr("vehicle_type") == "LF 10" ||
                      $(this).attr("vehicle_type") == "LF 8/6" || $(this).attr("vehicle_type") == "LF 20/16" ||
                      $(this).attr("vehicle_type") == "LF 10/6" || $(this).attr("vehicle_type") == "LF 16-TS" || 
                      $(this).attr("vehicle_type") == "HLF 20" || $(this).attr("vehicle_type") == "TSF-W" || 
                      $(this).attr("vehicle_type") == "TLF 2000" || $(this).attr("vehicle_type") == "TLF 3000" ||
                      $(this).attr("vehicle_type") == "TLF 8/8" || $(this).attr("vehicle_type") == "TLF 8/18" ||
                      $(this).attr("vehicle_type") == "TLF 16/24-Tr" || $(this).attr("vehicle_type") == "TLF 16/25" ||
                      $(this).attr("vehicle_type") == "TLF 16/45" || $(this).attr("vehicle_type") == "TLF 20/40" ||
                      $(this).attr("vehicle_type") == "TLF 20/40-SL" || $(this).attr("vehicle_type") == "TLF 16" ) &&
                      ADis_VehiclesNeed["0"] > 0 )
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["0"]--;
                }
                else if( $(this).attr("vehicle_type") == "DLK 23" && ADis_VehiclesNeed["2"] > 0 )                   // DLK 23
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["2"]--;
                }
                else if( $(this).attr("vehicle_type") == "ELW 1" && ADis_VehiclesNeed["3"] > 0 )                    // ELW 1
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["3"]--;
                }
                else if( $(this).attr("vehicle_type") == "ELW 2" && ADis_VehiclesNeed["34"] > 0 )                   // ELW 2
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["34"]--;
                }
                else if( $(this).attr("vehicle_type") == "MTW" && ADis_VehiclesNeed["36"] > 0 )                     // MTW
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["36"]--;
                }
                else if( $(this).attr("vehicle_type") == "FwK" && ADis_VehiclesNeed["57"] > 0 )                     // FwK
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["57"]--;
                }
                else if( ($(this).attr("vehicle_type") == "RW" ||
                          $(this).attr("vehicle_type") == "AB-Rüst") &&
                        ADis_VehiclesNeed["4"] > 0 )                                                                // RW
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["4"]--;
                }
                else if( ($(this).attr("vehicle_type") == "GW-A" ||
                          $(this).attr("vehicle_type") == "AB-Atemschutz") &&
                        ADis_VehiclesNeed["5"] > 0 )                                                                // GW-A
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["5"]--;
                }
                else if( ($(this).attr("vehicle_type") == "GW-Öl" ||
                          $(this).attr("vehicle_type") == "AB-Öl") &&
                        ADis_VehiclesNeed["10"] > 0 )                                                               // GW-Öl
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["10"]--;
                }
                else if( $(this).attr("vehicle_type") == "GW-Messtechnik" && ADis_VehiclesNeed["12"] > 0 )          // FwK
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["12"]--;
                }
                else if( ($(this).attr("vehicle_type") == "GW-L2-Wasser" ||
                          $(this).attr("vehicle_type") == "SW 1000" ||
                          $(this).attr("vehicle_type") == "SW 2000" ||
                          $(this).attr("vehicle_type") == "SW 2000-Tr" ||
                          $(this).attr("vehicle_type") == "SW Kats") &&
                        ADis_VehiclesNeed["11"] > 0 )                                                               // SW
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["11"]--;
                }
                else if( $(this).attr("vehicle_type") == "GW-Höhenrettung" && ADis_VehiclesNeed["33"] > 0 )         // GW-Höhenrettung
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["33"]--;
                }
                else if( ($(this).attr("vehicle_type") == "Dekon-P" ||
                          $(this).attr("vehicle_type") == "AB-Dekon-P") &&
                        ADis_VehiclesNeed["53"] > 0 )                                                               // Dekon-P
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["53"]--;
                }
            });
            
        }
    }



//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -                   Process Police_Department
//  -
//  - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    function ADis_ProcessPoliceDepartment()
    {
        
//      -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
//      -
//      -               Fire Department: Vehicles
//      -
//      -                   32:     FuStW
//      -                   35:     leBefKw
//      -                   50:     GruKw
//      -                   51:     FüKw
//      -                   52:     GefKw
//      -                   72:     WaWe
//      -                   61:     Polizeihubschrauber
//      -
//      -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
        
        if( typeof MissionConfig.police_department == "object" )            // Wenn der FD-Block in der Config definiert ist
        {
            ADis_VehiclesNeed["32"] += MissionConfig.police_department.num_FuStW;
            ADis_VehiclesNeed["35"] += MissionConfig.police_department.num_leBefKw;
            ADis_VehiclesNeed["50"] += MissionConfig.police_department.num_GruKw;
            ADis_VehiclesNeed["51"] += MissionConfig.police_department.num_FueKw;
            ADis_VehiclesNeed["52"] += MissionConfig.police_department.num_GefKw;
            ADis_VehiclesNeed["72"] += MissionConfig.police_department.num_WaWe;
            ADis_VehiclesNeed["61"] += MissionConfig.police_department.num_PHu;
            
            $("#vehicle_show_table_body_all").find(".vehicle_select_table_tr").each( function()
            {
                var VehicleID = $(this).attr("id").replace("vehicle_element_content_", "");
                var VehicleDistanceTime = $("#vehicle_sort_" + VehicleID).attr("sortvalue");
                
                if( $(this).attr("vehicle_type") == "FuStW" && ADis_VehiclesNeed["32"] > 0 )                        // FuStW
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["32"]--;
                }
                else if( $(this).attr("vehicle_type") == "leBefKw" && ADis_VehiclesNeed["35"] > 0 )                 // leBefKw
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["35"]--;
                }
                else if( $(this).attr("vehicle_type") == "GruKw" && ADis_VehiclesNeed["50"] > 0 )                   // GruKw
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["50"]--;
                }
                else if( $(this).attr("vehicle_type") == "FüKw" && ADis_VehiclesNeed["51"] > 0 )                    // FüKw
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["51"]--;
                }
                else if( $(this).attr("vehicle_type") == "GefKw" && ADis_VehiclesNeed["52"] > 0 )                   // GefKw
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["52"]--;
                }
                else if( $(this).attr("vehicle_type") == "WaWe 10" && ADis_VehiclesNeed["72"] > 0 )                 // WaWe 10
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["72"]--;
                }
                else if( $(this).attr("vehicle_type") == "Polizeihubschrauber" && ADis_VehiclesNeed["61"] > 0 )     // PHu
                {
                    $("#vehicle_checkbox_" + VehicleID).click();
                    ADis_VehiclesNeed["33"]--;
                }
            });
            
        }
    }








    
    var ADis_VehiclesNeed = {};

    function ADis_PrepareVehicleNeedList()
    {
        for( VehicleTypeID = 0; VehicleTypeID <= 74; VehicleTypeID++ )
        {
            ADis_VehiclesNeed[VehicleTypeID] = 0 - ADis_CountInvolvedVehiclesOfType( VehicleTypeID );
        }
    }

    function ADis_CountInvolvedVehiclesOfType( VehicleType )
    {
        var CountedVehicles = 0;
        
        $.each(AD_Vehicles, function( VehicleID, Vehicle )
        {
            if( Vehicle.type == VehicleType )
                CountedVehicles++;
        });
        
        $("#mission_vehicle_driving tbody, #mission_vehicle_at_mission tbody").find("tr").each( function()
        {
            if( $(this).find("a").first().attr("vehicle_type_id") == VehicleType )
                CountedVehicles++;
        });
        
        return CountedVehicles;
    }

    function ADis_CountAvailableVehiclesOfType( VehicleType )
    {
        var CountedVehicles = 0;
        
        
        
        return CountedVehicles;
    }



    function ADis_CheckNeedMoreVehicles(  )
    {
        var NeedMoreVehicles = false;
        
        $.each(ADis_VehiclesNeed, function( VehicleTypeID, VehicleCount )
        {
            if( VehicleCount > 0 )
                NeedMoreVehicles = true;
        });
        
        return NeedMoreVehicles;
    }
