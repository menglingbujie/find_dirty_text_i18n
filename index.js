
var fs = require("fs");
var path = require("path");
const spawn = require("child_process").spawn;
const cp = require("child_process");
var langPath = __dirname+"/i18n/";
var projectPath = __dirname+"/webapp/";
var viewPath = __dirname+"/views/";

var gUnuseI18n = {};//未使用的词条
var gSameI18n = {};//相同的词条

//去工程里匹配
function* matchI18n(_,text,flat,plat){
  var _findProjectPath = projectPath+plat+"/";
  var _findViewPath = viewPath+plat+"/";
  var _key = "\"LangClient.i18n.."+ text.replace(/\.$/,"") +"..\"";
  var _pt = _findProjectPath+"js";
  cp.execFile("./shell/grep_i18n.sh",[_key,_pt],function(err,data){
    if(err){
      return;
    }
    if(!data){
      if(!data.replace(/\s+/,"")||data=="null"){
        gUnuseI18n[flat]=_key.replace(/..(.*)../,"$1");
      }
    }
  });
  yield _;
  cp.execFile(__dirname+"/shell/grep_i18n.sh",[_key,_findViewPath],function(err,data){
    if(err){
      return;
    }
    if(!data.replace(/\s+/,"")||data=="null"){
      if(!gUnuseI18n[flat]){
        gUnuseI18n[flat]={text:_key.replace(/..(.*)../,"$1")};
      }else{
        gUnuseI18n[flat]={same:_key.replace(/..(.*)../,"$1")}
      }
    }
  });
  yield _;
}

//读取语言文件
function readI18nFile(file,s){
  var _symbol = s.replace(/lang_(.*\.[pc|mobile]*)\..*/,"$1");
  var _platform = s.replace(/lang_.*\.([pc|mobile]*)\..*/,"$1");
  var _text=require(file);

  //读取其中一个语言文件并去工程目录去查找。找不到就记录一条
  for (var i in _text.__flat){
    var _matchI18n = matchI18n("_",i,_symbol,_platform);
    while(!_matchI18n.next().done){}
  }
}
//遍历语言目录
function loopI18n(path){
  fs.readdir(path,(err,pdir)=>{
    if(!pdir||pdir.length<0){return;}
    for(var i of pdir){
      var _langPath = path+i;
      var _stat = fs.statSync(_langPath);
      if(i=="index.js"){continue;}
      if(_stat.isDirectory()){
        loopI18n(_langPath+"/");
      }else{
        if(_langPath.match(/props/)){continue;}
        if(_langPath.match(/legal/)){continue;}
        readI18nFile(_langPath,i);
      }
    }
  })
}

loopI18n(langPath);
