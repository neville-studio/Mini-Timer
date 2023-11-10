document.addEventListener('mouseup',()=>{
    //super();
    let selected = window.getSelection().toString();
    let matchString = selected.match("\\d* *分钟");
    if(matchString!=null&&matchString.length>0)
    {
        chrome.runtime.sendMessage({type:"showContextMenu",str:matchString.pop()});
        return;
    }
    matchString = selected.match("\\d* *小时");
    if(matchString!=null&&matchString.length>0)
    {
        chrome.runtime.sendMessage({type:"showContextMenu_Hour",str:matchString.pop()});
        return;
    }
    else {
        chrome.runtime.sendMessage({type:"hideContextMenu"});
        chrome.runtime.sendMessage({type:"hideContextMenu_Hour"});
    }

     
});