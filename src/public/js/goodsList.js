getPageInit();

var navBox,navList,goodsBox,goodsList,goodsDataBuff,onGoodsObj={classID:0,pageCode:0};

//页面初始化
function getPageInit(){

	//创建分类列表容器对象
	navBox = {
		l : $(".goods-class.landscape").find("ul"),//横屏状态对象
		p : $(".goods-class.portrait").find("ul")//竖屏状态对象
	}

	//复制获取分类列表单个对象
	navList = {
		l : navBox.l.find("li").clone(false),//横屏
		p : navBox.p.find("li").clone(false)//竖屏
	}


	//创建商品列表容器对象,以及复制单个商品列表对象
	goodsBox = $(".goods-list");
	goodsList = goodsBox.find("li").clone(false);

	//初始化商品列表缓存数组
	goodsDataBuff = [];

	//加载商品分类导航栏
	loadClassNav();

	//加载商品列表
	loadGoodsList();


	$(".page-btn").click(function(){
		// 绑定分页按钮点击事件
		var btnType = $(this).attr("data-type");
		switch(btnType){
			case "back"://上一页
				if(onGoodsObj.pageCode != 0){
					onGoodsObj.pageCode --;
					loadGoodsList(onGoodsObj);
				
				}
				break;
			case "next"://下一页
				onGoodsObj.pageCode ++;
				loadGoodsList(onGoodsObj);
				break;
		}

	});

}


//加载分类导航
function loadClassNav(){
	//页面初始化的时候,获取商品分类列表(分类导航),并渲染到页面当中去
	$.get("http://datainfo.duapp.com/shopdata/getclass.php",function(data){
		data = JSON.parse(data);
		
		//清空横竖屏状态下的导航栏盒子
		navBox.l.empty();
		navBox.p.empty();

		for(var i in data){

			//复制获取横竖屏状态下的dom对象,并集合放到对应对象当中
			var dom = {
				l : navList.l.clone(false),
				p : navList.p.clone(false)
			}

			//横屏状态的商品分类列表数据填充
			dom.l.find(".iconfont").html(data[i].icon);
			dom.l.find(".class-name").text(data[i].className);
			dom.l.attr("data-classID",data[i].classID);
			
			//竖屏状态下的商品分类列表数据填充
			dom.p.find(".iconfont").html(data[i].icon);
			dom.p.attr("data-classID",data[i].classID);

			//将处理好的横竖屏对应列表对象添加到商品容器当中
			navBox.l.append(dom.l);
			navBox.p.append(dom.p);

		}

		//给商品分类绑定点击事件
		$(".goods-class").find("li").click(function(){

			//获取当前被点击的商品分类ID
			var classID = $(this).attr("data-classID");

			//渲染加载相应的列表,默认跳转到第一页
			loadGoodsList({classID:classID,pageCode:0});

			//更新选中样式
			$(".goods-class").find(".active").removeClass("active");

			$(".goods-class").find("li[data-classID='"+classID+"']").addClass("active");

		});

		//设置竖屏状态下,ul的宽度
		var num = data.length;
		
		navBox.p.width(num*0.57+"rem");
	});
}

//加载商品分类列表
function loadGoodsList(obj){

	var ajaxData = "";
	
	if(obj){//有参数的情况

		if(obj.classID){//有分类ID
			ajaxData = "classID=" + obj.classID + "&";
		}else{//没有分类id
			obj.classID = 0;
		}

		if(obj.pageCode != 0 && !!obj.pageCode){//有页面编码
			ajaxData = "pageCode=" + obj.pageCode + "&";
		}else{//没有页面页码
			ajaxData = "pageCode=0&";
			obj.pageCode = 0;
		}

	}else{
		var obj = {
			classID : 0,
			pageCode : 0
		}
	}

	//遍历商品列表缓存数组
	for(var i in goodsDataBuff){

		//数据存在
		if(goodsDataBuff[i].classID == obj.classID){

			var bData = null;

			//对当前商品分类列表对象做遍历,寻找到对应的页数
			for(var j in goodsDataBuff[i].goodsList){
				
				

				//获取将要渲染的数据
				if(goodsDataBuff[i].goodsList[j].pageCode == obj.pageCode){
					// 如果当前列表内存在想要的数据,则赋值
					bData = goodsDataBuff[i].goodsList[j].dataList;
				}
					
				

			}
			// 如果bData为空,则代表没有当前页的数据
			if(!bData){
					//如果不存在想要的数据,则调用请求服务器函数,往缓存数组中添加数据
					
					// 执行向服务器获取数据并添加到缓存列表当中函数;
					addBuff(obj,function(){
						loadGoodsList(obj);//数据添加到缓存当中之后,在回调函数当中,执行递归,再加载一次

					});
					return ;
			}

			

			// 执行渲染数据函数
			addGoodsData(bData);

			

			//一旦执行页面数据渲染,说明商品列表页发生更新,则执行跟新当前页面状态对象动作
			onGoodsObj = obj;

			// console.log(onGoodsObj);

			return;//退出函数
		}
	}

	// 当遍历完成,能够执行到这一步的时候,说明缓存当中并不存在想要的数据
	// 执行向服务器获取数据并添加到缓存列表当中函数;
	addBuff(obj,function(){

		loadGoodsList(obj);//数据添加到缓存当中之后,在回调函数当中,执行递归,再加载一次

	});

}

//向页面渲染数据
function addGoodsData(data){

	//清空商品列表容器
	goodsBox.empty();

	//遍历
	for(var i in data){

		//创建将要添加到商品列表当中的dom对象
		var dom = goodsList.clone(false);


		//获取数据
		var imgSrc = data[i].goodsListImg;
		var goodsName = data[i].goodsName;
		var price = data[i].price*1;
		var discount = data[i].discount/10;
		var oldPrice = price;
		var goodsID = data[i].goodsID;
		if(discount != 0){
			oldPrice = price/(data[i].discount/10);
		}
		oldPrice = oldPrice.toFixed(2);

		//数据渲染
		dom.find("img").attr("src",imgSrc);
		dom.find(".goods-name").text(goodsName);
		dom.find(".text").find("span").text("¥ "+price);
		dom.find(".text").find("del").text("¥ "+oldPrice);
		dom.attr("data-goodsID",goodsID);

		//把标签加入到页面对应的dom当中去
		goodsBox.append(dom);
		
		dom.click(function() {
			var gdID = $(this).attr("data-goodsID");
			sessionStorage.setItem("goodsID",gdID);
			
			location.href = "goodscontent.html";
		})
	}
}

//向服务器发送请求,将获取到的数据添加到缓存对象当中,参数为对象,包含有classID,pageCode
function addBuff(obj,callBack){

	var ajaxData = "";

	if(obj){//有参数的情况

		if(obj.classID){//有分类ID
			ajaxData = "classID=" + obj.classID + "&";
		}else{//没有分类id
			obj.classID = 0;
		}

		if(obj.pageCode != 0){//有页面编码
			ajaxData = ajaxData + "pageCode=" + obj.pageCode + "&";
		}else{//没有页面页码
			ajaxData = ajaxData + "pageCode=0&";
			obj.pageCode = 0;
		}

	}else{
		var obj = {
			classID : 0,
			pageCode : 0
		}
	}

	$.ajax({
		url : "http://datainfo.duapp.com/shopdata/getGoods.php",
		type : "post",
		data : ajaxData,
		dataType : "JSONP",
		success : function(data){
			//如果有值,则往缓存中添加,没有值,不做任何变化
			if(data != 0){
				//遍历缓存对象,查找当前想要添加的商品列表是否已经存在于商品缓存列表当中
				for(var i in goodsDataBuff){
					//已存在
					if(goodsDataBuff[i].classID == obj.classID){

						//新建列表对象,添加到当前商品列表的列表属性当中
						var listObj = {
							pageCode : obj.pageCode,
							dataList : data
						}

						goodsDataBuff[i].goodsList.push(listObj);

						//如果有回调函数,则执行回调函数
						if(callBack)callBack();

						return;//退出函数
					}
				}

				//遍历完成没有退出函数,说明商品列表当中不存在当前商品

				//商品列表对象
				var buffObj = {
					classID : obj.classID,//商品分类id
					goodsList : [{//商品列表数组
							pageCode : obj.pageCode,//当前第几页
							dataList : data//当前页的列表数据
						}]
				}

				goodsDataBuff.push(buffObj);


				//若有回调函数,则执行回调函数
				if(callBack)callBack();
			}else{
				onGoodsObj.pageCode --;
			}

		}
	});
}

// 执行翻页
function goPage(a){
	if(a>0) {
		
	}else {
		
	}
}
touche();
function touche() {
	var dom = $("article"),startX,startY;
	
	dom.on("touchstart",function (e) {
		dom.removeClass("anm");
		startX = e.originalEvent.targetTouches[0].pageX;
		startY = e.originalEvent.targetTouches[0].pageY;
	});
	
	dom.on("touchmove",function (e) {
		mX = e.originalEvent.targetTouches[0].pageX - startX;
		mY = e.originalEvent.targetTouches[0].pageY - startY;
		
		var x = -mX;
		var s = 180/150;
		
		if(Math.abs(mX) > Math.abs(mY)*4) {
			if(mX>0) {
				if(Math.abs(mX)<150){
					$(".text.left").find(".iconfont").css("transform","rotate("+(x*s)+"deg)");
					dom.css("transform","translateX("+mX+"px)");
				}else {
					dom.trigger("touchend");
					goPage(mX);
				}
				
			}else {
				if(Math.abs(mX)<150){
					$(".text.right").find(".iconfont").css("transform","rotate("+(x*s)+"deg)");
					dom.css("transform","translateX("+mX+"px)");
				}else {
					dom.trigger("touched");
					goPage(mX);
				}
			}
		}
	});
	dom.on("touchend",function(e) {
		dom.addClass("anm");
		dom.css("transform","translateX(0px)")
	})
}
