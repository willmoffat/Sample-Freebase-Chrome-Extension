// manifest.json must have permission for _all_ these hosts
var API_TOPIC_BLOCK = 'http://www.freebase.com/widget/block';
var API_MQLREAD     = 'http://search.labs.freebase.com/api/service/mqlread';


var fbCache = (function() {
  // url -> Freebase Topic ID
  //        null  --> never looked up
  //        ''    --> not in freebase

  // TODO: expire old items
  
  function clear() {
    window.localStorage.clear();
  }
  function set(url,topic) {
    if (topic && topic.guid) {
      topic.id = topic.guid.replace(/#/,'/guid/'); //TODO: use topic.id once mids go live on prod;
    }
    window.localStorage.setItem(url, JSON.stringify(topic));
  }
  function lookup(url,callback) {
    var query=[{ id:null, guid:null, name:null, "/common/topic/weblink":{ url:url } }];
    $.getJSON(API_MQLREAD,{query:JSON.stringify(query)}, function(resp) {
      var topic = '';
      if (resp.result && resp.result.length) {
        topic = resp.result[0];
      }
      set(url,topic);
      callback(topic);
    });
  }
  function get(url,callback) {
    var topic = window.localStorage.getItem(url);  
    if ( topic !== null) {
      callback(JSON.parse(topic));
    } else {
      lookup(url,callback);
    }
  }
  
  return {get:get, set:set, clear:clear};
}
)();
