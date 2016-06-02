// ==UserScript==
// @name         MonsterLyrics button
// @namespace    https://github.com/NorbiPeti/
// @version      0.5
// @description  Creates a button that searches for a lyrics video!
// @author       NorbiPeti
// @match        https://www.youtube.com/watch*
// @include      http://www.youtube.com/watch*
// @include      https://www.twitch.tv/Monstercat*
// @include      https://live.monstercat.com/*
// @grant        none
// ==/UserScript==

window.lasttitle="";
window.addtries=0;
window.twitchmsg="";

function Add() {
    var title=document.getElementById("eow-title");
    if(title!==null)
        title=title.title;
    if(title!==null)
        window.lasttitle=title;
    if(document.getElementById("mlbutton")!==null)
        return;
    var cont=null;
    if(window.location.href.indexOf("youtube.com")!=-1)
    {
        if(title==lasttitle && window.lasttries<10)
        {
            window.addtries++;
            window.setTimeout(Add, 100);
            return;
        }
        cont=document.getElementById("watch7-subscription-container");
    }
    if(cont===null)
        cont=window.twitchmsg;
    if(cont===null)
        return;
    if(window.twitchmsg!==null && window.twitchmsg!=="")
        window.lasttitle=window.twitchmsg.innerHTML.replace("Now Playing: ", "").replace(/ \- Listen now: .+/g, "");
    cont.innerHTML+="<button type=\"button\" onClick=\"window.showLyrics()\" id=\"mlbutton\" class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-subscribed-branded no-icon-markup yt-uix-subscription-button yt-can-buffer hover-enabled\">Lyrics video</button>";
    console.log("!");
    //window.lasturl=window.location.href; //TODO: Show Lyrics button
}

function AddIfChanged()
{
    var namecont=document.getElementById("watch7-user-header");
    var namecontTwitch=document.getElementsByClassName("chat-line");
    var Twitch=null;
    for(var i=namecontTwitch.length-1; i>=0; i--) //Reminder: Don't put i++ in a supposedly decrementing loop... It's hard to debug
    {
        if(typeof namecontTwitch[i] != 'undefined' && namecontTwitch[i].getElementsByClassName("from")[0].innerHTML=="Monstercat")
        {
            Twitch=namecontTwitch[i].getElementsByClassName("message")[0];
            break;
        }
    }
    if((namecont===null || namecont.innerHTML.indexOf("Monstercat")==-1) && (Twitch===null))
        return;
    if(window.location.href==window.lasturl)
        return;
    if(document.getElementById("mlbutton")!==null)
        return;
    window.twitchmsg=Twitch;
    var cont=document.getElementById("watch7-subscription-container");
    if(cont===null && Twitch===null)
        return;
    window.setTimeout(Add, 100);
} //TODO: Add for every platform, not just YouTube and add tracklist support

(function() {
    'use strict';

    AddIfChanged();
    window.setInterval(AddIfChanged, 1000);
})();

window.showLyrics=function()
{
    //var title=document.getElementById("eow-title").title;
    var title=window.lasttitle;
    title=encodeURI(title.replace(/\[[^\[\]]+\]/g, "")).replace("&", ""); //Tested on: Pegboard Nerds & NGHTMRE - Superstar (ft. Krewella)
    window.location.href="https://www.youtube.com/user/monstercatmedialyric/search?query="+title;
};
