const self = require('sdk/self'),
  clipboard = require('sdk/clipboard'),
  contextMenu = require('sdk/context-menu'),
  Props = require('./libs/props').Props,
  Latinize = require('./libs/latinize').Latinize,
  { Hotkey } = require("sdk/hotkeys"),
  contentScript = require("./content/script").script.toString(),
  tabs = require("sdk/tabs"),
  selection = require("sdk/selection");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
/*function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;*/

var props = new Props(function( props ) {
    menuItem.destroy();
    menuItem = createLatinizedMenuItem();
    latinize = new Latinize( props.getLang() );
    hotKey = Hotkey({
    	combo: props.getShortCut(),
    	onPress: activateMenuItemClick
    });
  }),
  menuItem = createLatinizedMenuItem(),
  latinize = new Latinize( props.getLang() );
  hotKey = Hotkey({
  	combo: props.getShortCut(),
  	onPress: activateMenuItemClick
  }),
  worker = null;

function activateMenuItemClick() {

  if ( worker !== null ) {
    worker.destroy();
  }

  worker = tabs.activeTab.attach({
    contentScript: 'self.port.on("hotkey", ' + getContentScriptString( false ) + ');'
  });

  if ( selection.text ) {
    worker.port.emit("hotkey", null);
    var latinized = latinize.get(selection.text);
    clipboard.set(latinized);
  }

}

function createLatinizedMenuItem() {
  var item = contextMenu.Item({
    label: 'Copy latinized(' + props.getCasualShortCut() + ')',
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", ' + getContentScriptString( true ) + ');',
    onMessage: function (selectionText) {
      var latinized = latinize.get(selectionText);
      clipboard.set(latinized);
    }
  });

  return item;
}

function getContentScriptString( isFromMenuItem ) {
  return contentScript.replace('%position%',props.getPosition())
        .replace('\'%isFromMenuItem%\'', isFromMenuItem.toString() )
        .replace('\'%isPopupEnabled%\'', props.isPopupEnabled().toString() );
}
