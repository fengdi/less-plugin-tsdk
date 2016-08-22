
var iconv = require('iconv-lite');



function TaobaoSDK(options){
	this.options = options;
}

TaobaoSDK.prototype = {
	install : function(less, pluginManager){

		
		var preProcess = {
			
			rTplPath : /(\/|\\)modules(\/|\\)(.*)(\/|\\)assets(\/|\\)stylesheets(\/|\\)(.*)\.less$/,

			isTaoBaoSDKDir : function(path){
				var m = this.rTplPath.exec(path);
				if(m && m.length > 6){
					//文件名
					var filename = m[7].replace(/\.[^\.]*$/,"");
					
					//模块ID
					var moduleId = m[3];

					//样式所在路径
					var dirpath = path.replace(/(\\|\/)[^\\\/]*$/,"");

					//全局less文件
					var globalLessPath = "../../../../assets/stylesheets/"+filename+"/g.less";
					var globalLess = dirpath+"/"+globalLessPath;

					return {
						filename: filename,
						dirpath : dirpath,
						moduleId : moduleId,
						globalLessPath : globalLessPath,
						globalLess : globalLess
					};

				}else{
					return false;
				}
			
			}

		};

		pluginManager.addPostProcessor({
			process : function(css, extra){
				var options = extra.options;
				var filename = options.filename;
				var data = null;
				if(data = preProcess.isTaoBaoSDKDir(filename)){
					//console.log(extra);
					return iconv.encode(css, 'gbk');
				}
				return css;
			}
		});



		pluginManager.addPreProcessor({
			process : function(less, extra){
				var fileInfo = extra.fileInfo;
				var filename = fileInfo.filename;
				var data = null;

				if(data = preProcess.isTaoBaoSDKDir(filename)){
					//extra.globalVars = {
					//	"@fileName" : data.filename,
					//	"@moduleId" : data.moduleId,
					//	"@module"   : data.moduleId,
					//	"@dirPath"  : data.dirpath
					//};

					var initCode = '';
					initCode+="@fileName:~'"+data.filename+"';\r\n";
					initCode+="@moduleId:~'"+data.moduleId+"';\r\n";
					initCode+="@dirPath:~'"+data.dirpath+"';\r\n";
					initCode+="@module:~\".@{moduleId}\";\r\n";
					initCode+="@import '"+data.globalLessPath+"';\r\n";
					
					less = initCode + less;

				}

				return less;
			}
		});

	},
	printUsage : function(){
		console.log('usage');
	},
	setOptions : function(options){
		this.options = options;
		console.log('options', options);
	},
	minVersion : [2,0,0]
};

module.exports = TaobaoSDK;





