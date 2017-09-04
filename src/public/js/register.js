$("#reg-btn").click(function () {
	var infoData = {
		status : "register",
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
				console.log(data);
			
			
				switch(data){
					case "0":
						show("用户名重名,请修改用户名!");
						break;
					case "1":
						show("恭喜,注册成功");
						break;
					case "2":
						show("sorry!服务器出错,请联系管理员!");
						break;
				}
			}
		});
	}
});

$("#userName").change(function () {
	$.ajax({
		url:"http://datainfo.duapp.com/shopdata/userinfo.php",
		type:"post",
		data:{status : "login",userID : $("#userName").val(),password : ""},
		success:function (data) {
			if(data==0) {
				$("#userName").css("border","1px solid #11d32d");
				$(".user-name").text("该用户名可以使用");
			}else {
				$("#userName").css("border","1px solid #a90506");
				$(".user-name").text("该用户名已存在,请重新输入!");
			}
		}
	
	});
});

$("#password2").change(function () {
	var pw1 = $("#password").val();
	var pw2 = $("#password2").val();
	
	if(!pw1){
		$("#password").css("border","1px solid #a90506");
		$(".password").text("请输入密码");
	}else if(pw2 != pw1){
		$("#password2").css("border","1px solid #a90506");
		$(".password2").text("两次密码不符,请重新输入");
	}else{
		$("#password1").css("border","1px solid #11d32d");
		$("#password2").css("border","1px solid #11d32d");
		$(".password1").empty();
		$(".password2").empty();
	}
});
