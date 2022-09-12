let timerend = 0;
let coutdowntimer;
let alarmtimer;
let wakeup = 0;
let timerStatustimer;
let pageloader;
load();
function pluszero(str)
{
    str=parseInt(str)
    if(str<10)
    return "0"+str;
    return str;
}
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
//页面加载
function load(){
    chrome.runtime.sendMessage({"type":"wakeup"},function (response){
            if(response.wakeup=="wakeup")wakeup=1;
            
           
        chrome.runtime.sendMessage({"type":"get_timer"},function (response){
            
            if(response.status!=-1)
            {
                document.getElementById("timerTimes").innerHTML=""+response.Str;
                timerStatustimer = setInterval(function() {timerTimer();},10);
            }
            if(response.status==1)
            {
                
                document.getElementById('startTimer').style.display="none";
                document.getElementById('pauseTimer').style.display="inline-block";
                document.getElementById('continueTimer').style.display="none";
                document.getElementById("stopTimer").style.display="inline-block";
                document.getElementById("clearTimer").style.display="none";
            }
            else if(response.status==0)
            {
                
                document.getElementById('startTimer').style.display="none";
                document.getElementById('pauseTimer').style.display="none";
                document.getElementById('continueTimer').style.display="inline-block";
                document.getElementById("stopTimer").style.display="inline-block";
                document.getElementById("clearTimer").style.display="none";
            }
            else if(response.status==-1)
            {
                document.getElementById('startTimer').style.display="inline-block";
                document.getElementById('pauseTimer').style.display="none";
                document.getElementById('continueTimer').style.display="none";
                document.getElementById("stopTimer").style.display="none";
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
document.getElementById("startTimer").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"start_Timer"});
    timerStatustimer = setInterval(function() {timerTimer();},10);
    
    document.getElementById('startTimer').style.display="none";
    document.getElementById('pauseTimer').style.display="inline-block";
    document.getElementById('continueTimer').style.display="none";
    document.getElementById("stopTimer").style.display="inline-block";
    document.getElementById("clearTimer").style.display="none";
}
);
document.getElementById("pauseTimer").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"pause_Timer"});
    document.getElementById('startTimer').style.display="none";
    document.getElementById('pauseTimer').style.display="none";
    document.getElementById('continueTimer').style.display="inline-block";
    document.getElementById("stopTimer").style.display="inline-block";
    document.getElementById("clearTimer").style.display="none";
    
}
);
document.getElementById("continueTimer").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"continue_Timer"});
    document.getElementById('startTimer').style.display="none";
    document.getElementById('pauseTimer').style.display="inline-block";
    document.getElementById('continueTimer').style.display="none";
    document.getElementById("stopTimer").style.display="inline-block";
    document.getElementById("clearTimer").style.display="none";
}
);
document.getElementById("stopTimer").addEventListener("click",function()
{
    chrome.runtime.sendMessage({"type":"stop_Timer"});
    document.getElementById('startTimer').style.display="inline-block";
    document.getElementById('pauseTimer').style.display="none";
    document.getElementById('continueTimer').style.display="none";
    document.getElementById("stopTimer").style.display="none";
    document.getElementById("clearTimer").style.display="inline-block";
    
}
);

document.getElementById("clearTimer").addEventListener("click",function()
{
    document.getElementById("timerTimes").innerHTML="0:00:00.00";
}
);
//show the time now(Widnows )
function showNow()
{
    let nowtime = new Date();
    document.getElementById("now").innerHTML=""+nowtime.getFullYear()+"/"+(nowtime.getMonth()+1)+"/"+nowtime.getDate()+" "+nowtime.getHours()+":"+pluszero(nowtime.getMinutes())+":"+pluszero(nowtime.getSeconds());
}
document.addEventListener('contextmenu',
event => event.preventDefault());