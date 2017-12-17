//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
//  -
//  -           Automatic Dispose - Autoloader
//  -
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

        var AutomaticDispose_Branch = "master";

//      -
//      -           Google Font
//      -

        var styleElement = document.createElement("link");
        styleElement.rel = "stylesheet";
        styleElement.href = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700";
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
        }
        
//      -
//      -           Mission Catcher
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/mission-catcher.js";
            document.body.appendChild(scriptElement);
        }
        
//      -
//      -           Vehicle Alert
//      -
        
        if (window.location.pathname.indexOf("/missions/") !== -1)
        {
            var scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/script/vehicle-alert.js";
            document.body.appendChild(scriptElement);
        }

//      -
//      -           Load Style
//      -
        
        if (window.location.pathname === "/" || window.location.pathname === "/#")
        {
            var styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.type = "text/css";
            styleElement.media = "screen";
            styleElement.href = "https://rawgit.com/ChaosKai/automatic-dispose/" + AutomaticDispose_Branch + "/style/interface.css";
            document.body.appendChild(styleElement);
        }
