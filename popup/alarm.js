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

document.getElementById("countdown").addEventListener("click",function()
    {
        chrome.storage.local.set({"default_tab":"countdown"},()=>{
            if(!chrome.runtime.lastError)  
            window.location.replace("main.html");
            
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


function pluszero(str)
{
    str=parseInt(str)
    if(str<10)
    return "0"+str;
    return str;
}

//页面加载
function load(){
    chrome.runtime.sendMessage({"type":"wakeup"},function (response){
            if(response.wakeup=="wakeup")wakeup=1;
            
           
            chrome.runtime.sendMessage({"type":"getAlarms"},function (response){
                if(response.alarmstatus!=1)
                {
                    let hours = new Date().getHours();
                    let min = new Date().getMinutes();
                    document.getElementById('alarmHours').innerHTML=pluszero(hours);
                    document.getElementById('alarmMins').innerHTML=pluszero(min);
                    document.getElementById("stopAlarm").style.display="none";
                }
                else
                {
                    let allElements = document.getElementsByClassName("upAlarms");
                    for(let i = 0;i<allElements.length;i++)
                    {
                        allElements[i].setAttribute("hidden","hidden");
                    }
                    allElements = document.getElementsByClassName("downAlarms");
                    for(let i = 0;i<allElements.length;i++)
                    {
                        allElements[i].setAttribute("hidden","hidden");
                    }
                    let hours = response.hours;
                    let mins = response.mins;
                    let alarmTitle = response.title;
                    document.getElementById('alarmHours').innerHTML=pluszero(hours);
                    document.getElementById('alarmMins').innerHTML=pluszero(mins);
                    document.getElementById('alarmName').innerHTML=alarmTitle;
                    document.getElementById("startAlarm").style.display="none";
                }
                alarmtimer = setInterval(function() {alarmTimer();},100);
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


//
document.getElementById("plusAlarmHour").addEventListener("click",function()
{
    let obj=document.getElementById('alarmHours');
    if(parseInt(obj.innerHTML)>=23)
    {
        obj.innerHTML="00";
    }else{
        obj.innerHTML=pluszero(parseInt(obj.innerHTML)+1);
    }
    
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
document.getElementById("plusAlarmMin").addEventListener("click",function()
{
    let obj='alarmMins';
    plusnumber(obj)
});
document.getElementById("minusAlarmHour").addEventListener("click",function()
{
    let obj=document.getElementById('alarmHours');
    if(parseInt(obj.innerHTML)<=0)
    {
        obj.innerHTML="23";
    }else{
        obj.innerHTML=pluszero(parseInt(obj.innerHTML)-1);
    }    
});
document.getElementById("minusAlarmMin").addEventListener("click",function()
{
    let obj='alarmMins';
    minusnumber(obj)
});
document.getElementById("startAlarm").addEventListener("click",function ()
{
    let min,sec,hour;
    hour=parseInt(document.getElementById("alarmHours").innerHTML);
    min=parseInt(document.getElementById("alarmMins").innerHTML);
    let allElements = document.getElementsByClassName("upAlarms");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    allElements = document.getElementsByClassName("downAlarms");
    for(let i = 0;i<allElements.length;i++)
    {
        allElements[i].setAttribute("hidden","hidden");
    }
    var caption = document.getElementById('alarmName').innerText;
    chrome.runtime.sendMessage({
        "type":"startAlarm",
        "hour":hour,
        "min":min,
        "title":caption
    });
    document.getElementById("startAlarm").style.display="none";
    document.getElementById('stopAlarm').style.display="inline-block";
    document.getElementById("alarmName").removeAttribute("contenteditable");
    alarmtimer = setInterval(function() {alarmTimer();},100);
}
)
document.getElementById("stopAlarm").addEventListener("click",function ()
{
    chrome.runtime.sendMessage({
        "type":"stopAlarm"
    });
}

)
function alarmTimer()
{
    chrome.runtime.sendMessage({"type":"wakeup"},function (response){
        if(response.wakeup=="wakeup")wakeup=1;else wakeup=0;
        chrome.runtime.sendMessage({"type":"getAlarms"},function (response){
            
        if(response.alarmstatus!=1)
        {
            let allElements = document.getElementsByClassName("upAlarms");
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].removeAttribute("hidden");
            }
            allElements = document.getElementsByClassName("downAlarms");
            for(let i = 0;i<allElements.length;i++)
            {
                allElements[i].removeAttribute("hidden");
            }
                document.getElementById('startAlarm').style.display="inline-block";
                document.getElementById("stopAlarm").style.display="none";
                document.getElementById("alarmName").setAttribute("contenteditable","true");
        clearInterval(alarmtimer);
        }
        });
    });
}
function timerTimer()
{
    chrome.runtime.sendMessage({"type":"wakeup"},function (response){
        if(response.wakeup=="wakeup")wakeup=1;
        chrome.runtime.sendMessage({"type":"get_timer"},function (response){
        if(response.status!=-1)
        {
            document.getElementById("timerTimes").innerHTML=""+response.Str;
        }
        else{
            clearInterval(timerStatustimer);
        }
        
    });
});
}
//show the time now(Widnows )
function showNow()
{
    let nowtime = new Date();
    document.getElementById("now").innerHTML=""+nowtime.getFullYear()+"/"+(nowtime.getMonth()+1)+"/"+nowtime.getDate()+" "+nowtime.getHours()+":"+pluszero(nowtime.getMinutes())+":"+pluszero(nowtime.getSeconds());
}
document.addEventListener('contextmenu',
event => event.preventDefault());
document.getElementById("alarmMins").addEventListener("blur",(event)=>
{
    var str = new String(document.getElementById("alarmMins").innerText);
    
    if(str.match(/^\d{1,2}$/)==null)
    {
        document.getElementById("alarmMins").innerText=""+pluszero(focusnumber);
        return;
    }else if(parseInt(str)>59)
    {
        document.getElementById("alarmMins").innerText=59;
    }else if(parseInt(str)<0)
    {
        document.getElementById("alarmMins").innerText=00;
    }
    

})
document.getElementById("alarmMins").addEventListener("focus",(event)=>
{
    focusnumber=parseInt(new String(document.getElementById("alarmMins").innerText));
})
document.getElementById("alarmHours").addEventListener("blur",(event)=>
{
    var str = new String(document.getElementById("alarmHours").innerText);
    
    if(str.match(/^\d{1,2}$/)==null)
    {
        document.getElementById("alarmHours").innerText=""+pluszero(focusnumber);
        return;
    }else if(parseInt(str)>23)
    {
        document.getElementById("alarmHours").innerText=23;
    }else if(parseInt(str)<0)
    {
        document.getElementById("alarmHours").innerText=00;
    }
    

})
document.getElementById("alarmHours").addEventListener("focus",(event)=>
{
    focusnumber=parseInt(new String(document.getElementById("alarmHours").innerText));
})