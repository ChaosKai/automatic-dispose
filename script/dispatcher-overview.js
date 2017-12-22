

var DispatcherTable = {
    "1":
    {
        "id":           1,
        "name":         "Rainer Vogler",
        "occupied":     false
    }
}

$(document).ready(function()
{
    
});


function ADis_BuildDispatcherInterface()
{
    $("body").append('<div id="adis-dispatcher-overview"></div>');
    $("#adis-dispatcher-overview").append('<header></header>');
    $("#adis-dispatcher-overview").append('<div class="wrapper"></div>');
    
    $("#adis-dispatcher-overview").find("header").append('<div id="adis-dispatcher-overview-title">Disponenten</div>');
    $("#adis-dispatcher-overview").find("header").append('<div id="adis-dispatcher-overview-close"><i class="far fa-times-circle"></a></div>');
    
    $("#adis-dispatcher-overview").find(".wrapper").append('<div id="adis-dispatcher-dispatcher-table"></div>');
}
