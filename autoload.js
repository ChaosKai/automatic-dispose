//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Automatic Dispose - Autoloader
//  -
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        var AutomaticDispose_Branch = "master";
        var AutomaticDispose_URL    = "https://rawgit.com/ChaosKai/automatic-dispose/";

//      -
//      -           Settings
//      -

        if( localStorage.getItem("ADis-Settings-Semi-Automatic") == "null" )
        {
            localStorage.setItem("ADis-Settings-Semi-Automatic", false);
        }

        if( localStorage.getItem("ADis-Settings-Full-Automatic") == "null" )
        {
            localStorage.setItem("ADis-Settings-Full-Automatic", false);
        }

        if( localStorage.getItem("ADis-Settings-Sprechwunsch-Automatic") == "null" )
        {
            localStorage.setItem("ADis-Settings-Sprechwunsch-Automatic", false);
        }

        if( localStorage.getItem("ADis-Settings-Alliance-Automatic") == "null" )
        {
            localStorage.setItem("ADis-Settings-Alliance-Automatic", false);
        }

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

        var scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src = "https://use.fontawesome.com/releases/v5.0.2/js/all.js";
        document.body.appendChild(scriptElement);

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
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/mission-manager.js";
            document.body.appendChild(scriptElement);
        }
        
//      -
//      -           Load Dispatcher Overview
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/dispatchers.js";
            document.body.appendChild(scriptElement);
            
            
            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.type = "text/css";
            styleElement.media = "screen";
            styleElement.href = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/style/dispatcher-overview.css";
            document.body.appendChild(styleElement);
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
//      -           Load Sprechwunsch Opener
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/sprechwunsch-opener.js";
            document.body.appendChild(scriptElement);
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
        
//      -
//      -           Sprechwunsch Handler
//      -
        
        if (window.location.pathname.indexOf("/vehicles/") !== -1)
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/sprechwunsch-handler.js";
            document.body.appendChild(scriptElement);
        }
