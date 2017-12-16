// ==UserScript==
// @name            LSS - Automatische Disposition
// @namespace       Leitstellenspiel
// @description     Disponiert die Einsätze ein einer Semi- bzw Vollautomatik
// @downloadURL     https://github.com/ChaosKai/alliance_vehicle_alert/raw/master/userscript.user.js
// @include         http*://www.leitstellenspiel.de/*
// @version         1.0
// @author          ChaosKai93
// @grant           none
// ==/UserScript==

var scriptElement = document.createElement("script");
scriptElement.type = "text/javascript";
scriptElement.src = "https://rawgit.com/ChaosKai/automatic-dispose/master/autoload.js";
document.body.appendChild(scriptElement);
