var gulp = require("gulp"),
	less = require("gulp-less"),
	cssmin = require("gulp-clean-css"),
	htmlmin = require("gulp-htmlmin"),
	jsmin = require("gulp-uglify"),
	connect = require("gulp-connect");


gulp.task("default",["server","watch"]);

gulp.task("init",["css","html","js"]);


gulp.task("css",function(){
	gulp.src(["src/public/less/*.less","!src/public/less/ba.less"]).pipe(less()).pipe(cssmin()).pipe(gulp.dest("dest/public/css"));
	gulp.src("src/public/css/*.css").pipe(cssmin()).pipe(gulp.dest("dest/public/css"));
});

gulp.task("js",function(){

	var jsData = {
		mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
	};

	gulp.src(["src/public/js/*.js","!src/public/js/jquer*.js"]).pipe(jsmin(jsData)).pipe(gulp.dest("dest/public/js"));
	// gulp.src("src/public/js/jquer*.js").pipe(gulp.dest("dest/public/js"));
});

gulp.task("html",function(){
	var htmlData = {
		removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
	}

	gulp.src("src/html/*.html").pipe(htmlmin(htmlData)).pipe(gulp.dest("dest/html"));
});

gulp.task("server",function(){
	connect.server({
		root : "dest",
		port : 8005,
		livereload : true
	});
});

gulp.task("htmlReload",function(){
	gulp.src("dest/html/*.html").pipe(connect.reload());
});

gulp.task("watch",function(){
	gulp.watch("src/html/*.html",["html","htmlReload"]);
	gulp.watch("src/public/less/*.less",["css","htmlReload"]);
	gulp.watch("src/public/js/*.js",["js","htmlReload"]);
});