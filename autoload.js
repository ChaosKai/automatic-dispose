//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Automatic Dispose - Autoloader
//  -
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        var AutomaticDispose_URL    = "https://chaoskai.github.io/automatic-dispose/";

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
//      -           Load Mission Windows
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = AutomaticDispose_URL + "/scripts/mission-windows.js";
            document.body.appendChild(scriptElement);
            
            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.href = AutomaticDispose_URL + "/styles/mission-windows.css";
            document.body.appendChild(styleElement);
        }
        
//      -
//      -           Load Mission Manager
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = AutomaticDispose_URL + "/scripts/mission-manager.js";
            document.body.appendChild(scriptElement);
        }
        
//      -
//      -           Load Call Handler
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = AutomaticDispose_URL + "/scripts/call-manager.js";
            document.body.appendChild(scriptElement);
        }

        if (document.location.href.indexOf("/vehicle/") > -1)
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = AutomaticDispose_URL + "/scripts/call-handler.js";
            document.body.appendChild(scriptElement);
        }
        
//      -
//      -           Vehicle Alert
//      -
        
        if (window.location.pathname.indexOf("/missions/") !== -1)
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = AutomaticDispose_URL + "/scripts/mission-handler.js";
            document.body.appendChild(scriptElement);
        }
