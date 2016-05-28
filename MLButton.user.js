// ==UserScript==
// @name         MonsterLyrics button
// @namespace    https://github.com/NorbiPeti/LINK
// @version      0.1
// @description  Creates a button that searches for a lyrics video!
// @author       NorbiPeti
// @match        https://www.youtube.com/
// @include      http://www.youtube.com/watch
// @include      https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

window.lasturl="";

function AddIfChanged()
{
    if(window.location.href==window.lasturl)
        return;
    var cont=document.getElementById("watch7-subscription-container");
    if(cont===null)
        return;
    cont.innerHTML+="<button type=\"button\" onClick=\"window.showLyrics()\" class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-default\">Show lyrics</button>";
    window.lasturl=window.location.href;
}

(function() {
    'use strict';

    // Your code here...
    var namecont=document.getElementById("watch7-user-header");
    if(namecont.innerHTML.indexOf("Monstercat")==-1)
        return;
    AddIfChanged();
    window.setTimeout(AddIfChanged, 1000);
})();

window.showLyrics=function()
{
    var title=document.getElementById("eow-title").title;
    title=encodeURI(title.replace(/\[[^\[\]]+\]/g, "")).replace("&", ""); //Tested on: Pegboard Nerds & NGHTMRE - Superstar (ft. Krewella)
    window.location.href="https://www.youtube.com/user/monstercatmedialyric/search?query="+title;
};
