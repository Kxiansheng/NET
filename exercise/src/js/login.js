//登陆信息验证
var uname=document.getElementById("username");
var pword=document.getElementById("password");
var oAtt=document.getElementById("attention");
var oAtted=document.getElementById("attentioned");
var oFans=document.getElementById("fans");
var loginBtn=document.getElementById("submit");
var oPop=document.getElementById("popup");
var oLpop=document.getElementById("loginPop");
function login(){
    checkLoginCookie("attention","attentioned","fans","popup","loginPop","closeLogin");
   // checkLoginCookie(attention,attentioned,fans,popup,loginPop,closeLogin);
    loginBtn.onclick=function(){
        if(uname.value==""||pword.value==""){
            alert("请输入用户名和密码！");
            return false;
        }else {
            ajax({
                method:"get",
                url:"http://study.163.com/webDev/login.htm",
                async:true,
                data:{userName:MD5(uname.value),password:MD5(pword.value)},
                success:function(msg){
                    if(msg=='1'){
                        setCookie("login",1,365);
                        oAtt.style.display="none";
                        ajax({
                            method:"get",
                            url:"http://study.163.com/webDev/attention.htm",
                            async:true,
                            success:function(msg){
                                setCookie("followSuc","1",365);
                                oAtted.style.display="block";
                            }
                        });
                        oFans.style.display="block";
                        oPop.style.display="none";
                        oLpop.style.display="none";
                    }else {
                        alert("用户名或密码有误，请重新输入！");
                        uname.value="";
                        pword.value="";
                        return false;
                    }
                }
            });
        }
    }
}
