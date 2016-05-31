// ==UserScript==
// @name         MonsterLyrics button
// @namespace    https://github.com/NorbiPeti/
// @version      0.2
// @description  Creates a button that searches for a lyrics video!
// @author       NorbiPeti
// @match        https://www.youtube.com/
// @include      http://www.youtube.com/*
// @include      https://www.youtube.com/*
// @grant        none
// ==/UserScript==

window.lasturl="";

function AddIfChanged()
{
    var namecont=document.getElementById("watch7-user-header");
    if(namecont===null || namecont.innerHTML.indexOf("Monstercat")==-1)
        return;
    if(window.location.href==window.lasturl)
        return;
    var cont=document.getElementById("watch7-subscription-container");
    if(cont===null)
        return;
    window.setTimeout(function() { //TODO: Check for video title change every 100 ms
    if(window.location.href==window.lasturl)
        return;
        var cont=document.getElementById("watch7-subscription-container");
        if(cont===null)
            return;
        cont.innerHTML+="<button type=\"button\" onClick=\"window.showLyrics()\" class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-subscribed-branded no-icon-markup yt-uix-subscription-button yt-can-buffer hover-enabled\">Show lyrics</button>";
        window.lasturl=window.location.href;
    }, 2000); //TODO: Detect page load finish
} //TODO: Add for every platform, not just YouTube

(function() {
    'use strict';

    // Your code here...
    AddIfChanged();
    window.setInterval(AddIfChanged, 1000);
})();

window.showLyrics=function()
{
    var title=document.getElementById("eow-title").title;
    title=encodeURI(title.replace(/\[[^\[\]]+\]/g, "")).replace("&", ""); //Tested on: Pegboard Nerds & NGHTMRE - Superstar (ft. Krewella)
    window.location.href="https://www.youtube.com/user/monstercatmedialyric/search?query="+title;
};
