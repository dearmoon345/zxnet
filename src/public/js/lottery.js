function lottery() {
	var isRun = false;
			var status = "acc";//"slo","scu"
			
			$(".btn").click(function(){
				if(!isRun){
					run(7);				
				}
			})
			
			function run(level){
				var quan = 7;//剩余圈数
				var time = 1000;//运行间隔
				
				isRun = true;
				if(!!arguments[1] || arguments[1] == 0){//第二个参数存在的情况下
					quan = arguments[1];//剩余圈数等于传进来的参数
				}
				
				if(!!arguments[2]){//第三个参数存在的情况下
					time = arguments[2];//执行时间间隔等于传进来的参数
				}
				
				
				if(time > 200 && status == "acc"){//必须是加速状态,才能进行加速动作
					time -= 100;
				}else if(status == "acc" && quan <= 0){
					time = 100;
					status = "slo";//速度达到巅峰状态,并且是出于加速状态的时候,进行状态转变,变成减速
				}
				
				if(time < 1000 && status == "slo"){//必须是减速状态,才能开始减速
					time += 100;
				}else if(status == "slo"){//速度将为最低,并且状态为减速的时候,进行状态转变,变成速度稳定
					time = 1000;
					status = "scu";
				}
				
				console.log(quan);
				setTimeout(function(){
					//获取当前奖项
					var index = $(".active").attr("data-id");
					//奖项+1
					index++;
					
					if(index > 8){
						index = 1;
						quan --;
					}
					
					$(".active").removeClass("active");
					$("#m-"+index).addClass("active");
					console.log(status);
					if(index != level || quan > 0 || status != "scu"){
						run(level,quan,time);
					}else{
						isRun = false;
					}
				},time);
			}
}
lottery();