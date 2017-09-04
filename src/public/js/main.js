function show(text) {
	var dom = $("<div class= 'prompt-panel'>"+text+"</div>");
	var times = 3000;
	if(!!arguments[1]){
		times = arguments[1];
	}

	$("body").append(dom);
	setTimeout(function(){
		dom.addClass("show");//不加的话 执行太快就不会出现动画效果
	},1);

	setTimeout(function(){
		dom.removeClass("show");
		setTimeout(function(){
			dom.remove();
		},750);
	},times);
}



function addShopCar(obj){
	$.ajax({
		url : "http://datainfo.duapp.com/shopdata/updatecar.php",
		type : "post",
		data : obj,
		success : function(data){
			if(data == 0){
				show("购物车添加失败,请联系管理员");
			}else{
				show("更新购物车成功!");
			}
		}
	});
}


//显示等待画面
function waiting(text) {
	var waitDom = $('<div class="waiting-box"><div class="iconfont icon-loading"></div><p>'+text+'...</p></div>');

	$("body").append(waitDom);

	var finishLoad = function () {
		waitDom.remove();
	}
	return finishLoad;
}

