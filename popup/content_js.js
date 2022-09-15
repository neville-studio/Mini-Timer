document.addEventListener('mouseup',()=>{
    //super();
    let selected = window.getSelection().toString();
    let matchString = selected.match("\\d* *分钟");
    if(matchString!=null&&matchString.length>0)
        chrome.runtime.sendMessage({type:"showContextMenu",str:matchString.pop()});

    else {
        chrome.runtime.sendMessage({type:"hideContextMenu"});
    }

     
});