/**
* 封装库文件：cookie,ajax
*/
//获取节点对象
function id(name) {return document.getElementById(name);}
//封装js添加删除事件兼容方法
var Event = {
    addHandler: function (oElement, sEvent, fnHandler) {
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler);
    },
    removeHandler: function (oElement, sEvent, fnHandler) {
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler);
    }
}
//className获取兼容
function getElementsByClassName(root,className){
        //检测是否支持
        if(root.getElementsByClassName){
            return root.getElementsByClassName(className);
        }else{
            //获取所有后代元素
            var elements=root.getElementsByTagName("*");
            var result=[];
            var element,
                classNameStr,
                flag;
            className=className.split(' ');
            for(var i=0;element=elements[i];i++){
                //获取包含指定类名的元素
                classNameStr=' '+element.className+' ';
                flag =true;
                for(var j=0,name;name=className[j];j++){
                        if(classNameStr.indexOf(' '+name+' ')==-1){
                            flag=false;
                            break;
                        }
                    }
                if(flag){
                    result.push(element);
                }
            }
            return result;
        }
    }

//生成cookie
function setCookie(cname,cvalue,exdays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
//检测提示cookie
function checkHeaderCookie(name,name2){
    var oName=id(name);
    var oc=id(name2);
    var cookieName=getCookie(name);
    //1 表示已存在cookie,非1表示不存在cookie
    if(cookieName!=1){
        oName.style.display="block";
    }else {
        oName.style.display="none";
    }
    oc.onclick=function(){
        setCookie(name,1,365);
        oName.style.display="none";
    }
}
//检测登陆cookie
function checkLoginCookie(attention,attentioned,fans,popup,loginPop,closeLogin){
    var oAtt=id(attention); //关注按钮
    var oAtted=id(attentioned); //已关注按钮
    var oFans=id(fans); //粉丝按钮
    var oPop=id(popup); //获取全屏遮罩
    var oLpop=id(loginPop); //获取登陆窗口
    var ocloseL=id(closeLogin); //窗口关闭按钮
    var cookieName=getCookie("followSuc");
    oAtt.onclick=function(){
        if(cookieName!=""){
            oAtt.style.display="none";
            oAtted.style.display="block";
            oFans.style.display="block";
        }else {
            //打开遮罩和登陆窗口
            oPop.style.display="block";
            oLpop.style.display="block";
            //关闭登陆窗口和遮罩
            ocloseL.onclick=function(){
                oPop.style.display="none";
                oLpop.style.display="none";
            }
        }
    }
}

//封装ajax
function ajax(obj) {
    var xhr = (function () {
        /*创建XMLHttpRequest对象*/
        if (typeof XMLHttpRequest != 'undefined') {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            // code for IE6, IE5
            var version = [
                'MSXML2.XMLHttp.6.0',
                'MSXML2.XMLHttp.3.0',
                'MSXML2.XMLHttp'
            ];
            for (var i = 0; version.length; i ++) {
                try {
                    return new ActiveXObject(version[i]);
                } catch (e) {
                    //跳过
                }
            }
        } else {
            throw new Error('您的系统或浏览器不支持XHR对象！');
        }
    })();
    /*url加随机参数，防止缓存*/
    obj.url = obj.url + '?rand=' + Math.random();
    /*请求参数格式化，encodeURIComponent编码参数可以出现&*/
    obj.data = (function (data) {
        var arr = [];
        for (var i in data) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        return arr.join('&');
    })(obj.data);
    if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
    if (obj.async === true) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callback();
            }
        };
    }

    xhr.open(obj.method, obj.url, obj.async);
    if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);
    } else {
        xhr.send(null);
    }
    if (obj.async === false) {
        callback();
    }
    function callback() {
        if (xhr.status == 200) {
            obj.success(xhr.responseText);            //回调传递参数
        } else {
            alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
        }
    }
}