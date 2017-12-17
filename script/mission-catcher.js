$(document).ready(function()
{
    if( typeof localStorage.getItem("AutomaticDispose-Mode") != "undefined" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Halb-Automatik");
    }

    setInterval( collectMissions, 1000 );
});



function switchMode()
{
    if( localStorage.getItem("AutomaticDispose-Mode") == "semi" )
    {
        localStorage.setItem("AutomaticDispose-Mode", "full");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Voll-Automatik");
    }
    else
    {
        localStorage.setItem("AutomaticDispose-Mode", "semi");
        $("#automatic-dispose-dashboard-switch-mode-button").html("Halb-Automatik");
    }
}

AllianceMissions = {};

function collectMissions()
{
    var UpdatedMissions = {};

    $("#mission_list").find(".missionSideBarEntry").each(function()
    {
        var MissionID = $(this).attr("mission_id");
        var MissionType = $(this).attr("mission_type_id");
        var MissionName = $(this).find(".map_position_mover").text();

        UpdatedMissions[MissionID] = {
            "id":    MissionID,
            "type":  MissionType,
            "name":  MissionName
        };
    });

    $.each(UpdatedMissions, function(Key, Mission)
    {
        if( typeof AllianceMissions[Mission.id] != "undefined" )
        {
            if( AllianceMissions[Mission.id].state != Mission.state && Mission.state == "green" )
            {
                var notification = new Notification("Einsatz " + Mission.name + " beginnt", { body: "Der Einsatz startet. Schicke schnell ein Fahrzeug." });
                
                var MissionsReady = JSON.parse(localStorage.getItem("AllianceVehicleAlert-MissionsReady"));
                MissionsReady.push(Mission.id);
                localStorage.setItem( "AllianceVehicleAlert-MissionsReady", JSON.stringify(MissionsReady) );
                
                var MissionPopup = window.open("https://www.leitstellenspiel.de/missions/" + Mission.id, "AllianceVehicleAlert", "width=101,height=101");
                setTimeout( function()
                {
                    MissionPopup.close();
                }, 5000);
            }
        }
    });

    AllianceMissions = UpdatedMissions;
}
