
    $(document).ready(function()
    {
        if( document.location.href.indexOf("/patient/") == -1 )
        {
            setTimeout(function()
            {
                if( $(".alert-info:contains('Unser Patient muss in ein Krankenhaus transportiert werden.')").length > 0 )
                {
                    // Krankenhäuser bewerten
                    var Hospitals = scoreHospitals();
                    
                    if( Hospitals.length == 0 )
                    {
                        return;
                    }
                    
                    // Auswahl absenden
                    document.location.href = document.location.href + "/patient/" + Hospitals[0].id;
                }
            }, 500);
        }
    });


//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
//  -
//  -           Call Manager   |   Score Hospitals
//  - --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

    function scoreHospitals()
    {
        var Hospitals = [];

        if( $("h4:contains('Eigene Krankenhäuser')").length > 0 )
        {
            $("h4:contains('Eigene Krankenhäuser')").next("table").find("tbody").find("tr").each(function()
            {
                var HospitalID = $(this).find("a:contains('Anfahren')").attr("id").replace("btn_approach_", "");
                var HospitalDistance = parseInt( $(this).find("td").eq("1").text() );
                var HospitalFreeBeds = parseInt( $(this).find("td").eq("2").text() );

                var HospitalValue = HospitalDistance * 400 * -1;

                if( $("this").find(".label:contains('Ja')").length > 0 )
                {
                    HospitalValue += 2000;
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
                    HospitalValue += 2000;
                }

                if( HospitalTaxes == 0 ) {
                    HospitalValue += 2000;
                } else if( HospitalTaxes > 0 && HospitalTaxes <= 10 ) {
                    HospitalValue += 500;
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
            return b.value - a.value;
        });
        
        return Hospitals;
    }
