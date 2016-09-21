
var carousel = function() {
	function id(name) {return document.getElementById(name);}
	//遍历函数
	function each(arr, callback) {
		if (arr.forEach) {arr.forEach(callback);} 
		else { for (var i = 0, len = arr.length; i < len; i++) callback.call(this, arr[i], i, arr);}
	}
	function fadeIn(elem) {
		setOpacity(elem, 0);
		for ( var i = 0; i < 20; i++) {
			(function() {
				var pos = i * 5;
				setTimeout(function() {
					setOpacity(elem, pos)
				}, i * 25);
			})(i);
		}
	}
	function fadeOut(elem) {
		for ( var i = 0; i <= 20; i++) {
			(function() {
				var pos = 100 - i * 5;
				setTimeout(function() {
					setOpacity(elem, pos)
				}, i * 25);
			})(i);
		}
	}
	// 设置透明度
	function setOpacity(elem, level) {
		if (elem.filters) {
			elem.style.filter = "alpha(opacity=" + level + ")";
		} else {
			elem.style.opacity = level / 100;
		}
	}

	return {
		//count:图片数量，wrapId:包裹图片的DIV,ulId:按钮DIV
		scroll : function(count,wrapId,ulId) {
			var self=this;
			var targetIdx=0;      //目标图片序号
			var curIndex=0;       //现在图片序号
			//添加Li按钮
			var frag=document.createDocumentFragment();
			this.num=[];    //存储各个li的应用，为下面的添加事件做准备
			
			for(var i=0;i<count;i++){
				//给li加上数字显示
				// (this.num[i]=frag.appendChild(document.createElement("li"))).innerHTML=i+1; 
				(this.num[i]=frag.appendChild(document.createElement("li"))).innerHTML;
			}
			id(ulId).appendChild(frag);
			
			//初始化信息
			this.img = id(wrapId).getElementsByTagName("a");
			
			this.num[0].className="on";
			//将除了第一张外的所有图片设置为透明
			each(this.img,function(elem,idx,arr){
				if (idx!=0) setOpacity(elem,0);
			});
			
			//为所有的li添加点击事件
			each(this.num,function(elem,idx,arr){
				elem.onmouseover=function(){
					self.fade(idx,curIndex);
					curIndex=idx;
					targetIdx=idx;
				}
			});
			//设置自动播放
			function loop(){
				if(targetIdx<self.num.length-1){
					targetIdx++;
				}else{
					targetIdx=0;
				}
				self.fade(targetIdx,curIndex);
				curIndex=targetIdx;
			}
			//自动轮播效果
			var timer=setInterval(loop,5000);
			var moveover=function(){ clearInterval(timer);};
			var moveout=function(){timer=setInterval(loop,5000);};
			id(ulId).onmouseover=moveover;
			id(wrapId).onmouseover=moveover;
			id(ulId).onmouseout = moveout;
			id(wrapId).onmouseout = moveout;
		},
		//跑马灯效果
		scrollMqr : function(wrapId) {
			var oDiv = id(wrapId);
			var oUl = oDiv.getElementsByTagName("ul")[0];
            var oLi = oUl.getElementsByTagName("li");
            var timer = null;
            var iSpeed=-2;　// 滚动速度，数字越大，滚动越快！
			oUl.innerHTML+=oUl.innerHTML;
			oUl.style.width=(oLi[0].offsetWidth+5)*oLi.length+"px";

			//设置跑马灯
            function mqrquee(){
                oUl.style.left=oUl.offsetLeft+iSpeed+"px";
                if(oUl.offsetLeft<-oUl.offsetWidth/2){
                    oUl.style.left="0px";
                }
                else if(oUl.offsetLeft >0){
                    oUl.style.left=-oUl.offsetWidth/2+"px";
                };
            }
            timer=setInterval(mqrquee,30);
            oDiv.onmouseover=function(){clearInterval(timer);}
            oDiv.onmouseout=function(){timer=setInterval(mqrquee,30);}
		},
		fade:function(idx,lastIdx){
			if(idx==lastIdx) return;
			var self=this;
			fadeOut(self.img[lastIdx]);
			fadeIn(self.img[idx]);
			each(self.num,function(elem,elemidx,arr){
				if (elemidx!=idx) {
					self.num[elemidx].className="";
				}else{
					self.num[elemidx].className="on";
					}
			});
			
		}
	}
}();
