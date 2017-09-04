var bannerBox,bannerSlide,indexGoodsBox,indexGoodsLi,searchGoodsBox,searchGoodsLi;
 pageInit();
 function pageInit() {
 	//获取幻灯片容器 以及单位幻灯片模板对象
// 	console.log(1);
 	bannerBox = $(".index-banner").find(".swiper-wrapper");
 	bannerSlide = bannerBox.find(".swiper-slide").clone(false);
 	
 	indexGoodsBox = $(".index-goods-list");
 	indexGoodsLi = indexGoodsBox.find("li").clone(false);
 	
 	//获取搜索结果列表盒子对象,以及模板对象
 	searchGoodsBox = $(".search-list");
 	searchGoodsLi = searchGoodsBox.find("li").clone(false);
 	getGoodsData();

 	$(".search-bar").find("input").change(function () {
 		var text = $(this).val();
 		if(!text){
 			$(".index-search").removeClass("show");
 		}
 	});
 	$(".search-btn").click(function() {
 		var wa = waiting("正在搜索");
 		var text = $(".search-bar").find("input").val();

 		$.ajax({
			url : "http://datainfo.duapp.com/shopdata/selectGoodes.php",
			type : "post",
			dataType : "JSONP",
			data : "selectText="+text,
			success : function(data){
				wa();
				console.log(data);
				if(data == 0){
					$(".search-list").css("display","none");
					$(".index-search").find("p").remove();
					var none = $("<p>没有找到相关商品</p>");
					$(".index-search").append(none);
				}else{
					$(".search-list").css("display","block");
					$(".index-search").find("p").remove();
					loadSearchList(data);
				}
					$(".index-search").addClass("show");
			}
		});
 	});
 }
//获取数据
function getGoodsData() {
	var dd = waiting("正在加载页面");

	var banr = false,lit = false;
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		type:"post",
		dataType:"JSONP",
		success:function (data){
//			console.log(data);
			loadIndexList(data);
			lit = true;
			if(banr){
				dd();
			}
		}
	});
	//获取幻灯片
	$.ajax({
		url : "http://datainfo.duapp.com/shopdata/getBanner.php",
		type : "post",
		dataType : "JSONP",
		success : function(data){
			loadBanner(data);

			banr = true;

			if(lit){
				dd();
			}
		}
	});
}
function loadBanner(data){
	bannerBox.empty();
	for(var i in data){
		var dom = bannerSlide.clone(false);

		var goodsID = data[i].goodsID;
		var imgSrc = JSON.parse(data[i].goodsBenUrl)[0];

		dom.find("a").attr("data-goodsID",goodsID);
		dom.find("img").attr("src",imgSrc);

		bannerBox.append(dom);
	}

	var mySwiper = new Swiper(".swiper-container",{
		autoplay : 3000,
		loop : true
	});

	console.log(data);
	
	}
//渲染首页商品列表
function loadIndexList(data){
	indexGoodsBox.empty();

	for(var i in data){
		var dom = indexGoodsLi.clone(false);

		var imgSrc = data[i].goodsListImg;
		var goodsName = data[i].goodsName;
		var price = data[i].price*1;
		var discount = data[i].discount*1;
		var oldPrice = price;
		var goodsID = data[i].goodsID;

		dom.find(".discount").find("span").text(discount);
		if(discount != 0){
			discount = discount/10;
			oldPrice = price/discount;
		}

		oldPrice = oldPrice.toFixed(2);

		dom.find("img").attr("src",imgSrc);
		dom.find(".goods-name").text(goodsName);
		dom.find(".price-box").find("span").text("¥"+price);
		dom.find(".price-box").find("del").text("¥"+oldPrice);
		var cart = $('<a class="iconfont icon-gouwuche"></a>');
		dom.find(".content-box").append(cart);
		dom.find(".content-box").find("a").attr("data-type-ID",goodsID);
		dom.attr("data-goodsID",goodsID);
		dom.find("img").click(function(){
			var gdID =  $(this).closest("li").attr("data-goodsID");
			sessionStorage.setItem("goodsID",gdID);


			location.href="goodscontent.html";

		});
		dom.find(".goods-name").click(function(){
			var gdID =  $(this).closest("li").attr("data-goodsID");
			sessionStorage.setItem("goodsID",gdID);


			location.href="goodscontent.html";

		});
		dom.find(".content-box").find("a").click(function () {
			var gdID = $(this).attr("data-type-ID");
			sessionStorage.setItem("goods-ID",gdID);
			_goodsID = sessionStorage.getItem("goods-ID");
			var loginName = sessionStorage.getItem("loginName");
			addShopCar({userID:"loginName",goodsID:_goodsID,number:1});
		});
		indexGoodsBox.append(dom);
		
	}
}
// 渲染搜索页搜索列表
function loadSearchList(data){
	searchGoodsBox.empty();

	for(var i in data){
		var dom = searchGoodsLi.clone(false);
		var goodsID = data[i].goodsID;
		var imgSrc = data[i].goodsListImg;
		var goodsName = data[i].goodsName;
		var price = data[i].price*1;
		var discount = data[i].discount*1;
		var oldPrice = price;

		if(discount != 0){
			discount = discount/10;
			oldPrice = price/discount;
		}

		oldPrice = oldPrice.toFixed(2);
		
		dom.find("img").attr("src",imgSrc);
		dom.find(".goods-name").text(goodsName);
		dom.find(".price-box").find("span").text("¥"+price);
		dom.find(".price-box").find("del").text("¥"+oldPrice);
		dom.find(".discount").find("span").text(discount);
		dom.attr("data-goodsID",goodsID);

		dom.click(function(){
			var gdID =  $(this).attr("data-goodsID");
			sessionStorage.setItem("goodsID",gdID);

			location.href="goodscontent.html";

		});

		searchGoodsBox.append(dom);
	}

}

