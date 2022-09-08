let timerend = 0;
let coutdowntimer;
let alarmtimer;
let wakeup = 0;
let timerStatustimer;
let pageloader;
load();

/* 
 * Title栏变化控件
 * 页面切换准则。
 */
document.getElementById("alarm").addEventListener("click",function()
    {
        
        chrome.storage.local.set({"default_tab":"alarm"},()=>{
            if(!chrome.runtime.lastError)  
                window.location.replace("alarm.html");
        });
    }
);
document.getElementById("countdown").addEventListener("click",function()
    {
        chrome.storage.local.set({"default_tab":"countdown"},()=>{
            if(!chrome.runtime.lastError)  
                {window.location.replace("main.html");
            console.log("successed.");}
                
        });
    }
);
document.getElementById("timer").addEventListener("click",function()
{
    chrome.storage.local.set({"default_tab":"timer"},()=>{
        if(!chrome.runtime.lastError)  
            window.location.replace("timer.html");
    });
}
)





/**
 * Countdown iFrame  UI改变代码
 */
document.getElementById("plusHour").addEventListener("click",function()
{
    let obj='countdownHours';
    plusnumber(obj)
    
});
document.getElementById("plusMin").addEventListener("click",function()
{
    let obj='countdownMins';
    plusnumber(obj)
});
document.getElementById("plusSec").addEventListener("click",function()
{
    let obj='countdownSeconds';
    plusnumber(obj)
});
document.getElementById("minusHour").addEventListener("click",function()
{
    let obj='countdownHours';
    minusnumber(obj)
    
});
document.getElementById("minusMin").addEventListener("click",function()
{
    let obj='countdownMins';
    minusnumber(obj)
});
document.getElementById("minusSec").addEventListener("click",function()
{
    let obj='countdownSeconds';
    minusnumber(obj)
});
function plusnumber (obj)
{
    let changeObj = document.getElementById(obj);
    
    if(obj!='countdownHours'){
    if(parseInt(changeObj.innerHTML)>=59)
    {
        changeObj.innerHTML="00";
    }else{
        changeObj.innerHTML=pluszero(parseInt(changeObj.innerHTML)+1);
    }}else{
        changeObj.innerHTML=pluszero(parseInt(changeObj.innerHTML)+1);
    }
}
function minusnumber (obj)
{
    let changeObj = document.getElementById(obj);
    
    if(obj!='countdownHours'){
    if(parseInt(changeObj.innerHTML)<=0)
    {
        changeObj.innerHTML="59";
    }else{
        changeObj.innerHTML=pluszero(parseInt(changeObj.innerHTML)-1);
    }}else{
        if(parseInt(changeObj.innerHTML)>0)
            changeObj.innerHTML=pluszero(parseInt(changeObj.innerHTML)-1);
        else
            changeObj.innerHTML="00";
    }
}

function pluszero(str)
{
    str=parseInt(str)
    if(str<10)
    return "0"+str;
    return str;
}
//启动定时器
document.getElementById("start").addEventListener("click",function()
{
    let min,sec,hour;
    hour=parseInt(document.getElementById("countdownHours").innerHTML);
    min=parseInt(document.getElementById("countdownMins").innerHTML);
    sec=parseInt(document.getElementById("countdownSeconds").innerHTML);
    if(hour==0&&min==0&&sec==0)return;
    timerend = new Date().getTime()+hour*3600000+min*60000+sec*1000;
    let allElements = document.getElementsByClassName("upCountdown");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    allElements = document.getElementsByClassName("downCountdown");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    var caption = document.getElementById('countdownName').innerText;
    chrome.runtime.sendMessage({
        "type":"startTimer",
        "endtime" :timerend,
        "timertitle":caption
    });
    document.getElementById("start").style.display="none";
    document.getElementById('startPotatoClock').style.display="none";
    document.getElementById("pause").style.display="inline-block";
    document.getElementById("stop").style.display="inline-block";
    document.getElementById('countdownName').removeAttribute("contenteditable");
    coutdowntimer = setInterval(function() {timer();},100);
});
//来一个番茄钟
document.addEventListener('contextmenu',
event => event.preventDefault());
document.getElementById("startPotatoClock").addEventListener("click",function()
{
    potatoClock();
});
function potatoClock()
{timerend = new Date().getTime()+25*60000;
    let allElements = document.getElementsByClassName("upCountdown");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    allElements = document.getElementsByClassName("downCountdown");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    chrome.runtime.sendMessage({
        "type":"startTimer",
        "endtime" :timerend,
        "timertitle":"番茄钟"
    });
    document.getElementById('countdownName').innerHTML="番茄钟";
    document.getElementById("start").style.display="none";
    document.getElementById('startPotatoClock').style.display="none";
    document.getElementById("pause").style.display="inline-block";
    document.getElementById("stop").style.display="inline-block";
    document.getElementById('countdownName').removeAttribute("contenteditable");
    coutdowntimer = setInterval(function() {timer();},100);

}
//消息接收及修改
function timer(){
    chrome.runtime.sendMessage({"type":"wakeup"},function (response){
        if(response.wakeup=="wakeup")wakeup=1;else wakeup=0;
chrome.runtime.sendMessage({"type":"getTimer"},function (response){
    if(response.timerstatus!=-1){
        document.getElementById("countdownHours").innerHTML = response.hour;
        document.getElementById("countdownMins").innerHTML = response.min;
        document.getElementById("countdownSeconds").innerHTML = response.sec;}
        judgeTimerIsEnd(response.end);
        if(response.end=="end")
        {
            if(response.timerstatus==-1){
            let allElements = document.getElementsByClassName("upCountdown");
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].removeAttribute("hidden");
            }
            allElements = document.getElementsByClassName("downCountdown");
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].removeAttribute("hidden");
            }
            document.getElementById("countdownHours").innerHTML="00";
            document.getElementById("countdownMins").innerHTML="00";
            document.getElementById("countdownSeconds").innerHTML="00";         
            document.getElementById("start").style.display="inline-block";
            document.getElementById('startPotatoClock').style.display="inline-block";
            clearInterval(coutdowntimer);
            document.getElementById("stop").style.display="none";
            document.getElementById("pause").style.display="none";
            document.getElementById("continue").style.display="none";
            document.getElementById('countdownName').setAttribute("contenteditable","true");}
        }
        
});});
}
function judgeTimerIsEnd(end)
{
    if(end!="end")
    {
        let allElements = document.getElementsByClassName("upCountdown");
        for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    allElements = document.getElementsByClassName("downCountdown");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }}
}
//页面加载
function load(){
    chrome.runtime.sendMessage({"type":"wakeup"},function (response){
            if(response.wakeup=="wakeup")wakeup=1;
            chrome.runtime.sendMessage({"type":"getTimer"},function (response){
                if(response.timerstatus!=1)
                    document.getElementById("continue").style.display="none";
                if(response.timerstatus!=-1)
                {
                   
                    let allElements = document.getElementsByClassName("upCountdown");
                    for(let i = 0;i<allElements.length;i++)
                    {
                        allElements[i].setAttribute("hidden","hidden");
                    }
                    allElements = document.getElementsByClassName("downCountdown");
                    for(let i = 0;i<allElements.length;i++)
                    {
                        allElements[i].setAttribute("hidden","hidden");
                    }
                    
                    
                    document.getElementById('countdownName').innerHTML=response.timertitle;
                    document.getElementById('countdownName').removeAttribute("contenteditable");
                    
                    timer();
                    coutdowntimer = setInterval(function() {timer();},100);
                    document.getElementById("start").style.display="none";
                    document.getElementById('startPotatoClock').style.display="none";
                       
                }else
                {
                    document.getElementById('stop').style.display="none";
                }
                if(response.timerstatus!=0)
                {
                    document.getElementById("pause").style.display="none";
                    
                }
            });
        });
    chrome.storage.local.get("default_tab",function (data){
        if(data.default_tab==undefined && window.location.pathname!="/main.html")window.location.replace("main.html");
        if(data.default_tab=="countdown" && window.location.pathname!="/main.html")window.location.replace("main.html");
        if(data.default_tab=="alarm" && window.location.pathname!="/alarm.html")window.location.replace("alarm.html");
        if(data.default_tab=="timer" && window.location.pathname!="/timer.html")window.location.replace("timer.html");
    });
    showNow();
    setInterval(()=>{showNow();},100)
}
//暂停键事件
document.getElementById("pause").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"pauseTimer"});
    this.style.display="none";
    document.getElementById("continue").style.display="inline-block";
});
document.getElementById("continue").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"continueTimer"});
    this.style.display="none";
    document.getElementById("pause").style.display="inline-block";
});
document.getElementById("stop").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"stopTimer"});
    this.style.display="none";
    document.getElementById("pause").style.display="none";
    document.getElementById("continue").style.display="none";
    document.getElementById("start").style.display="inline-block";
    document.getElementById('startPotatoClock').style.display="inline-block";
    
    clearInterval(coutdowntimer);
    let allElements = document.getElementsByClassName("upCountdown");
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].removeAttribute("hidden");
            }
            allElements = document.getElementsByClassName("downCountdown");
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].removeAttribute("hidden");
            }
            allElements = document.getElementsByClassName("numpad")
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].innerHTML="00";
            }
            document.getElementById('countdownName').setAttribute("contenteditable","true");
});

//show the time now(Widnows )
function showNow()
{
    let nowtime = new Date();
    document.getElementById("now").innerHTML=""+nowtime.getFullYear()+"/"+(nowtime.getMonth()+1)+"/"+nowtime.getDate()+" "+nowtime.getHours()+":"+pluszero(nowtime.getMinutes())+":"+pluszero(nowtime.getSeconds());
}