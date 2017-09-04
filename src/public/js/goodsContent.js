 
 var bannerBox,bannerSlide,imgBox,contentBox;
 pageInit();
 function pageInit() {
 	//获取幻灯片容器 以及单位幻灯片模板对象
 	var goodsID = sessionStorage.getItem("goodsID");
// 	console.log(1);
	addShopcart(goodsID);
 	bannerBox = $(".goods-content-banner").find(".swiper-wrapper");
 	bannerSlide = bannerBox.find(".swiper-slide").clone(false);
 	
 	imgBox = $(".img-box");
 	
 	contentBox = $(".goods-content-text");

	getContentData(goodsID);

 }
//获取数据
function getContentData(goodsID) {
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		type:"post",
		data:"goodsID="+goodsID,
		dataType:"JSONP",
		success:function (data){
//			console.log(data);
			loadPageContent(data);
		}
	});
}
function loadPageContent(data){
	data = data[0];
//商品详情图片数组
	var imgList = JSON.parse(data.imgsUrl);
	var bannerList = JSON.parse(data.goodsBenUrl);//幻灯片数组
	var goodsName = data.goodsName;//商品名
	var price = data.price;//价格
	var discount = data.discount;//折扣
	var oldPrice = price;//原价
	var number = data.buynumber;//购买人数
	var contentList = data.detail.split("。");//商品描述数组

	if(discount != 0){
		discount = discount*1;
		oldPrice = price*1/(discount/10);
	}
	
	oldPrice = (oldPrice*1).toFixed(2);

	//清空幻灯片容器
	bannerBox.empty();
	//清空商品详情图片容器
	imgBox.empty();
	//清空商品详情文字容器
	contentBox.empty();


	for(var bi in bannerList){
		var bannerDom = bannerSlide.clone(false);
		bannerDom.find("img").attr("src",bannerList[bi]);

		bannerBox.append(bannerDom);
	}

	$(".goods-name").text(goodsName);
	$(".price").find("span").text("¥"+price);
	$(".price").find("del").text(oldPrice);
	$(".shop-number").find("span").text(number);
	
	for(var ii in imgList){
		var imgDom = $("<img />");
		imgDom.attr("src",imgList[ii]);

		imgBox.append(imgDom);
	}

	var mySwiper = new Swiper(".swiper-container",{
		pagination : '.swiper-pagination',
		paginationClickable :true,
		autoplay: 2000,
		loop : true
	});

	for(var ci in contentList){
		var conDom = $("<li></li>");
		conDom.text(contentList[ci]);

		contentBox.append(conDom);
	}

}
function addShopcart(goodsID) {
	
	$(".bottom-btn-box").find(".btn").click(function(){
		sessionStorage.setItem("goodsID",goodsID);
		show("加入购物车成功");
	});
	}
		
