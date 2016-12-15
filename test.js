

function matchText(text){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(text)
    },1100)
  });
}


function* grepText(){
  yield matchText(123);
  yield matchText(456);
}

function run(fn){
  var _grep = fn();
  _grep.next().value.then(function(text){
    console.log("==11==",text);
    _grep.next().value.then(function(text){
      console.log("==22==",text);
    })
  })
}
run(grepText);
