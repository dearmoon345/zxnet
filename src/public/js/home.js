var mySwiper = new Swiper(".home-page",{
	pagination:".swiper-pagination",
	onInit: function(swiper){
		var index = swiper.activeIndex;
		index++;
		$(".banner"+index).removeClass('anm');
	},
	onSlideChangeStart: function(swiper){
    	$(".swiper-slide").each(function() {
    		$(this).addClass("anm");
    	});
    	var index = swiper.activeIndex;
		index ++;
		$(".banner"+index).removeClass("anm");
    }
   
});