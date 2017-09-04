$("#reg-btn").click(function () {
	var infoData = {
		status : "login",
		userID : $("#userName").val(),
		password : $("#password").val()
	}
	
	if(!infoData.userID) {
		show("请输入账户名");
	}else if(!infoData.password) {
		show("请输入密码");
	}else{
		$.ajax({
			url:"http://datainfo.duapp.com/shopdata/userinfo.php",
			type:"post",
			data:infoData,
			success:function (data) {
				// console.log(data);
			
				if(data == "0"||data=="2") {
					switch(data){
					case "0":
						show("用户名不存在,请先注册");
						break;
					
					case "2":
						show("用户名密码不符");
						break;
					}
				}else {
					show("登录成功,正在跳转首页");
					sessionStorage.setItem("loginName",infoData.userID);
					setTimeout(function () {
						location.href = "index.html";
					},2000);
					
					//data = JSON.parse(data);
					console.log(data);
				}
				
			}
		});
	}
});
var onOff = true;
$(".pas1 input").change(function () {
	if(onOff){
		$("#password").attr("type","text");
	}else {
		$("#password").attr("type","password");
	}
	onOff = !onOff
});
	
