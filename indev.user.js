// ==UserScript==
// @name         MonsterLyrics button
// @namespace    https://github.com/NorbiPeti/
// @version      0.10
// @description  Creates a button that searches for a lyrics video!
// @author       NorbiPeti
// @match        https://www.youtube.com/*
// @include      http://www.youtube.com/*
// @include      https://www.twitch.tv/Monstercat*
// @include      https://live.monstercat.com/*
// @grant        none
// ==/UserScript==

window.lasttitle="";

function loadXMLDoc(url, ondone) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
                var ret = xmlhttp.responseXML; //TODO: Browser extension
                var wrapper= document.createElement('div');
                wrapper.innerHTML= ret;
                ret= wrapper.firstChild;
                ondone(ret);
            }
            else {
                alert('Error while retrieving page! '+xmlhttp.status);
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function AddYouTube(addtries) { //TODO: Handle [Official Lyric Video] (if from a mix, test if there is a lyric video on MC channel, if not, go to ML)
    var namecont=document.getElementById("watch7-user-header");
    if(namecont===null || namecont.innerHTML.indexOf("Monstercat")==-1)
        return;
    var title=document.getElementById("eow-title");
    if(title!==null)
        title=title.title;
    if(title!==null && (title.indexOf("Podcast")!=-1 || title.indexOf("Album")!=-1))
    {
        var text=document.getElementById("eow-description").innerText;
        var regexp=/(\d{1,2}(?::\d{1,2})+) (.+) - (.+)/g;
        var currenttime=document.getElementsByClassName("video-stream html5-main-video")[0].currentTime;
        var match = regexp.exec(text);
        var lastmatch=match;
        var lasttime=0;
        while(match!==null)
        {
            var spl=match[1].split(":");
            var time=0;
            if(spl.length==3)
            {
                time=spl[0]*3600;
                time+=spl[1]*60;
                time+=spl[2]*1;
            }
            else if(spl.length==2)
            {
                time=spl[0]*60;
                time=spl[1]*1;
            }
            //console.log("Time: "+time+" CTime: "+currenttime+" LastTime: "+lasttime+" - "+lastmatch[2]+" - "+lastmatch[3]);
            if(time>currenttime && lasttime<currenttime)
                break;
            lastmatch=match;
            lasttime=time;
            match = regexp.exec(text);
        }
        title=lastmatch[2]+" - "+lastmatch[3]; //TODO
        document.title=title;
    }
    var cont=null;
    if(title!==null)
        window.lasttitle=title;
    cont=document.getElementById("watch7-subscription-container");
    if(cont===null)
        return;
    if(document.getElementById("mlbutton")!==null)
        return;
    cont.innerHTML+="<button type=\"button\" onClick=\"window.showLyrics()\" id=\"mlbutton\" class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-subscribed-branded no-icon-markup yt-uix-subscription-button yt-can-buffer hover-enabled\">Lyrics video</button>";
    //TODO: Show Lyrics button
}

function AddTwitch() {
    var namecontTwitch=document.getElementsByClassName("chat-line");
    var twitchmsg=null;
    for(var i=namecontTwitch.length-1; i>=0; i--) //Reminder: Don't put i++ in a supposedly decrementing loop... It's hard to debug
    {
        if(typeof namecontTwitch[i] != 'undefined' && namecontTwitch[i].getElementsByClassName("from")[0].innerHTML=="Monstercat")
        {
            var msg=namecontTwitch[i].getElementsByClassName("message")[0];
            if(msg.innerHTML.indexOf("Now Playing: ")==-1)
                continue;
            twitchmsg=msg;
            break;
        }
    }
    var cont=document.getElementsByClassName("chat-buttons-container clearfix")[0];
    if(cont===null)
        return;
    if(twitchmsg!==null && twitchmsg!=="")
    {
        var txt=twitchmsg.innerHTML.replace("Now Playing: ", "").replace(/ \- Listen now: .+/g, "").split(" by ");
        window.lasttitle=txt[1]+" - "+txt[0];
    }
    var mlbtn=document.getElementById("mlbutton");
    if(mlbtn!==null)
    {
        if(window.lasttitle!=="" && window.lasttitle!==null)
            mlbtn.disabled=0;
        return;
    }
    cont.innerHTML+="<button type=\"button\" onClick=\"window.showLyrics()\" id=\"mlbutton\" class=\"button button--icon-only float-left\" disabled=\"1\">Lyrics video</button>";
}

function AddIfChanged() //...and update track text
{
    if(window.location.href.indexOf("youtube.com")!=-1)
        window.setTimeout(function(){AddYouTube(0);}, 100);
    else if(window.location.href.indexOf("live.monstercat.com")!=-1 || window.location.href.indexOf("twitch.tv")!=-1)
        window.setTimeout(function(){AddTwitch();}, 100);
} //TODO: Add for every platform, not just YouTube and add tracklist support

(function() {
    'use strict';
    AddIfChanged();
    window.setInterval(AddIfChanged, 1000);
})();

window.showLyrics=function()
{
    var title=window.lasttitle;
    title=encodeURI(title.replace(/\[[^\[\]]+\]/g, "")).replace("&", ""); //Tested on: Pegboard Nerds & NGHTMRE - Superstar (ft. Krewella)
    //window.top.location.href="https://www.youtube.com/user/monstercatmedialyric/search?query="+title;
    loadXMLDoc("https://www.youtube.com/user/monstercatmedialyric/search?query="+title, function(response)
               {
        //response.getElementById("");
        alert("Success!"); //TODO: Check search page for element ID and such
    });
};
