/**
 * Created by StupidBoy on 2017/3/19.
 */


function setWXTitle(t) {

    var isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
    if(isIOS){
        const i = document.createElement('iframe');
        // i.src = "/favicon.ico";
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function(){
                i.remove();
            }, 99)
        };
        document.body.appendChild(i);
    }
        document.title = t;
}

export  default  setWXTitle;
