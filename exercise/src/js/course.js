/**
 * 课程和排行榜获取
*/
var oUl=document.getElementById('courseUl');
function getCourse(pageNo,psize,type){
	ajax({
		method:'get',
		url:'http://study.163.com/webDev/couresByCategory.htm',
		data:{
			'pageNo':pageNo,
			'psize':psize,
			'type':type
		},
		success:function(data){	
			var data = JSON.parse(data)
			var course=data.list;
			var courseHtml='';
			for(var i=0,len=course.length; i<len; i++){
				if(!course[i].categoryName){
					course[i].categoryName='无';
				}
				course[i].price==0?course[i].price='免费':course[i].price='￥'+course[i].price.toFixed(2);
					//课程内容
				courseHtml+='<li class="m-course-list"><a href="'+course[i].providerLink+'"><img src="'+course[i].middlePhotoUrl+'" alt="'+course[i].name+'"/><p class="courseName">'+course[i].name+'</p><p class="courseType">'+course[i].categoryName+'</p><strong class="nums">'+course[i].learnerCount+'</strong><strong class="price">'+course[i].price+'</strong><div class="project-popup"><div class="popInfo"><img src="'+course[i].middlePhotoUrl+'" alt="'+course[i].name+'"/><div class="info"><label>'+course[i].name+'</label><span class="number">'+course[i].learnerCount +'人在学</span><p class="publisher">发布者：'+course[i].provider+'</p><p class="type">分类：'+course[i].categoryName+'</p></div></div><div class="description"><p>'+course[i].description+'</p></div></div></a></li>';
				oUl.innerHTML=courseHtml;
			}
		},
		async : true
	});
}
//翻页
/*
tab切换
1、获取相应节点
2、默认选中tab1，显示tab1的课程
2、点击tab2，获取tab2的课程，再点击tab1,获取tab1的课程
翻页
1、默认第一页，选择第2页，加载第2页的内容，宽屏20，小屏15
*/
var oPage=document.getElementById("m-course-page");
var oPageLi=oPage.getElementsByTagName("li");
var oUp=document.getElementById("page-up");
var oDown=document.getElementById("page-down");
var oDesign=document.getElementById("design");
var oProgram=document.getElementById("program");
function coursePage(page,type){
	var page=0; //存储翻页的页码
	for(var i=0;i<oPageLi.length;i++){
		oPageLi[i].index=i; //自定index,存储li对应页数的索引值，用来绑定点击li加载对应页码的内容
		oPageLi[0].className="active"; //默认显示第一页
		oPageLi[i].className=""; //初始化li，清空li选中状态
		//添加li点击事件
		oPageLi[i].onclick=function(){
			var type=10,
				psize=20;
			//点击时，先将li设置为未选中状态
			for(var i=0;i<oPageLi.length;i++){
				oPageLi[i].className="";
			}
			//将用户点击当前的li设置active选中状态
			this.className="active";
			//判断当前tab是哪个类型，再获取对应类型的课程内容
			oDesign.className=="active"?type=10:type=20;
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
			getCourse(this.index+1,psize,type);
			return page=this.index; //将现点的页码传给翻页，这样用户在再左右翻页时才会接着现在的页码做翻页
		}
		oDown.onclick=function(){
			page++;
			//li全不选中
			for(var i=0;i<oPageLi.length;i++){
				oPageLi[i].className="";
			}
			//显示页码
			if(page>=oPageLi.length-1){
				oPageLi[oPageLi.length-1].className="active";
				//page=7;
			}else{
				oPageLi[page].className="active";
			}
			oDesign.className=="active"?type=10:type=20;
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
			getCourse(page+1,psize,type);
			//console.log(page);
		}
		oUp.onclick=function(){
			page--;
			for(var i=0;i<oPageLi.length;i++){
				oPageLi[i].className="";
			}
			if(page<0){
				oPageLi[0].className="active";
				page=0;
			}else{
				oPageLi[page].className="active";
			}
			oDesign.className=="active"?type=10:type=20;
			document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
			getCourse(page+1,psize,type);
			//console.log(page);
		}
	}
}
coursePage();
//切换课程
function switchTab(obj1,obj2,page,psize,type){
	getCourse(page,psize,type);
	coursePage(page,type);
	obj1.className='active';
	obj2.className='';
}
oDesign.onclick=function(){
	document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
	switchTab(oDesign,oProgram,1,psize,10);
	}
oProgram.onclick=function(){
	document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
	switchTab(oProgram,oDesign,1,psize,20);
}

//视频
var oVideo=document.getElementsByClassName('videopic');
var oVideoPop=document.getElementsByClassName('videoPop');
var oVideoClose=document.getElementsByClassName('closeVideo');
var oPop=document.getElementById('popup');
var oVideoE=document.getElementsByTagName('video')[0];
function playVideo(){
	oVideo[0].onclick=function(){
		oPop.style.display="block";
		oVideoPop[0].style.display="block";
	}
	oVideoClose[0].onclick=function(){
		oVideoPop[0].style.display="none";
		oPop.style.display="none";
		oVideoE.pause();
	}
}
playVideo();
//热销课程
function courseRank(){
	ajax({
		method:'get',
		url:'http://study.163.com/webDev/hotcouresByCategory.htm',
		success:function(text){
			var data=JSON.parse(text);
			var psize=10,
				tag=0;
			var rankList='';
			var oUl=document.getElementById('rank-content');
			function getCourseRank(){
				for(var i=tag;i<psize;i++){
					rankList+='<li class="rank-list"><a href="'+data[i].providerLink+'"><img src="'+data[i].smallPhotoUrl+'" alt="'+data[i].name+'"/><p>'+data[i].name+'</p><span>'+data[i].learnerCount+'</span></a></li>';
					oUl.innerHTML=rankList;
				}
				tag++;
				psize++;
			}
			getCourseRank();
			setInterval(function(){
				if(tag>10){
					tag=0;
					psize=10;
				}
				rankList='';
				getCourseRank();
			}, 2000);
		},
		async:true
	});
}

courseRank();
document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;
getCourse(1, psize, 10);