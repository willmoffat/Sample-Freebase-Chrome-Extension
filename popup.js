var bgPage = chrome.extension.getBackgroundPage();

function getTopicBlocks(tab,callback) {
  bgPage.fbCache.get(tab.url,function(topic) {
    if (!topic) {
      callback(null);     // doesn't exist in Freebase
    } else {
      var url = bgPage.API_TOPIC_BLOCK + topic.id;
      $.getJSON(url,callback);
    }    
  });
}

function showTopicBlocks() {
  var $output = $('#output');
  chrome.tabs.getSelected(null, function(tab) {
    bgPage.updateBadge(tab); // update required if we manually added or removed topic tag
    getTopicBlocks(tab,function(resp) {
      $output.empty();
      if (!resp) {
        $('#tagThisPage').show();
      } else {
        resp.forEach(function(topicblock) {
          $output.append(topicblock.html);
        });
      }
    });
  });
}

function debug() {
  console.log('debugging...');
  showTopicBlocks();
}

$(function() {

  ////////////////////////
  // F8 toggles dev bar //
  ////////////////////////
  $(document).keydown(function(e) {
    if (e.which===119) { $('#dev').toggle(); }
  }); 
  $('#debug').click(debug);
  $('#clear').click(function() { bgPage.fbCache.clear(); showTopicBlocks(); });

  //////////////////////////
  // make links clickable //
  ///////////////////////////
  $('a').live('click',function() {
    chrome.tabs.create({url:this.href});
    window.close();
  });

  //////////////////////////////
  // wire up Freebase Suggest //
  //////////////////////////////
  $("#myinput").suggest({
    flyout:'bottom'
  }).bind("fb-select", function(e, topic) {
    bgPage.setCurrentTopic(topic,function() {
      showTopicBlocks();
    });
  });

  /////////
  // run //
  /////////
  showTopicBlocks();
});
