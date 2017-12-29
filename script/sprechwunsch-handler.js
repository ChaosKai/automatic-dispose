
var Hospitals = [];

$(document).ready(function()
{
    if( document.location.href.indexOf("/patient/") == -1 )
    {
        setTimeout(function()
        {
            ADis_Check_Call_Active();
        }, 500);
    }
});



function ADis_Check_Call_Active()
{
    if( $("h4:contains('Eigene Krankenhäuser')").length > 0 || $("h4:contains('Verbandskrankenhäuser')").length > 0 )
    {
        ADis_Collect_Hospitals();
    }
}



function ADis_Collect_Hospitals()
{
    if( $("h4:contains('Eigene Krankenhäuser')").length > 0 )
    {
        $("h4:contains('Eigene Krankenhäuser')").next("table").find("tbody").find("tr").each(function()
        {
            var HospitalID = $(this).find("a:contains('Anfahren')").attr("id").replace("btn_approach_", "");
            var HospitalDistance = parseInt( $(this).find("td").eq("1").text() );
            var HospitalFreeBeds = parseInt( $(this).find("td").eq("2").text() );
            
            var HospitalValue = HospitalDistance * 400 * -1;
            
            if( $("this").find(".label:contains('Ja')").length > 0 ) {
                var HospitalSpecialDepartment = true;
                HospitalValue += 2000;
            } else {
                var HospitalSpecialDepartment = false;
            }
            
            if( HospitalFreeBeds > 0 )
            {
                Hospitals.push({
                    "id": HospitalID,
                    "value": HospitalValue,
                    "distance": HospitalDistance
                });
            }
        });
    }
    
    if( $("h4:contains('Verbandskrankenhäuser')").length > 0 )
    {
        $("h4:contains('Verbandskrankenhäuser')").next("table").find("tbody").find("tr").each(function()
        {
            var HospitalID = $(this).find("a").attr("href").substr( $(this).find("a").attr("href").lastIndexOf("/") + 1 );
            var HospitalDistance = parseInt( $(this).find("td").eq("1").text() );
            var HospitalFreeBeds = parseInt( $(this).find("td").eq("2").text() );
            var HospitalTaxes    = parseInt( $(this).find("td").eq("3").text() );
            
            // Add Button-ID to Alliance-Hospital
            $(this).find("a").attr("id", "btn_approach_" + HospitalID);
            
            var HospitalValue = HospitalDistance * 1000 * -1;
            
            if( $("this").find(".label:contains('Ja')").length > 0 ) {
                var HospitalSpecialDepartment = true;
                HospitalValue += 2000;
            } else {
                var HospitalSpecialDepartment = false;
            }
            
            if( HospitalTaxes == 0 ) {
                HospitalValue += 2000;
            } else if( HospitalTaxes > 0 && HospitalTaxes <= 10 ) {
                HospitalValue += 1000;
            } else if( HospitalTaxes > 10 && HospitalTaxes <= 20 ) {
                HospitalValue += 0;
            } else {
                HospitalValue -= 5000;
            }
            
            if( HospitalID.indexOf("?") == -1 && HospitalFreeBeds > 0 )
            {
                Hospitals.push({
                    "id": HospitalID,
                    "value": HospitalValue,
                    "taxes": HospitalTaxes,
                    "distance": HospitalDistance
                });
            }
        });
    }
    
    Hospitals.sort(function(a, b) {
        return a.value - b.value;
    });

    Hospitals.reverse();
    
    ADis_Send_Vehicle_To_Hospital()
}


function ADis_Send_Vehicle_To_Hospital()
{
    var HospitalID = Hospitals[0].id;
    
    if( localStorage.getItem("ADis-Settings-Sprechwunsch-Automatic") == "true" )
    {
        document.location.href = document.location.href + "/patient/" + HospitalID;
    }
    else
    {
        $("#btn_approach" + HospitalID).removeClass("btn-success").addClass("btn-warning");
    }
}
