//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Automatic Dispose - Autoloader
//  -
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        var AutomaticDispose_Branch = "master";
        var AutomaticDispose_URL    = "https://rawgit.com/ChaosKai/automatic-dispose/";

//      -
//      -           Google Font
//      -

        var styleElement = document.createElement("link");
        styleElement.rel = "stylesheet";
        styleElement.href = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700";
        document.body.appendChild(styleElement);
       
//      -
//      -           FontAwesome 5
//      -

        var styleElement = document.createElement("link");
        styleElement.rel = "stylesheet";
        styleElement.href = "https://use.fontawesome.com/releases/v5.0.2/js/all.js";
        document.body.appendChild(styleElement);

//      -
//      -           Navbar Dashboard
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/interface.js";
            document.body.appendChild(scriptElement);
            
            
            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.type = "text/css";
            styleElement.media = "screen";
            styleElement.href = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/style/interface.css";
            document.body.appendChild(styleElement);
        }
        
//      -
//      -           Load Automatic Modes
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/semi-automatic.js";
            document.body.appendChild(scriptElement);
                
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/full-automatic.js";
            document.body.appendChild(scriptElement);
        }
        
//      -
//      -           Load Mission Opener
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/mission-opener.js";
            document.body.appendChild(scriptElement);
        }
        
//      -
//      -           Load Dispatcher Overview
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/dispatcher-overview.js";
            document.body.appendChild(scriptElement);
            
            
            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.type = "text/css";
            styleElement.media = "screen";
            styleElement.href = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/style/dispatcher-overview.css";
            document.body.appendChild(styleElement);
        }
        
//      -
//      -           Vehicle Alert
//      -
        
        if (window.location.pathname.indexOf("/missions/") !== -1)
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/mission-handling.js";
            document.body.appendChild(scriptElement);
        }
