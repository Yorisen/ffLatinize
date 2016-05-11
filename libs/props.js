function Props(onPropsChangeFunc) {
  const preferences = require("sdk/simple-prefs"),
    that = this;

  this.prefs = preferences.prefs;
  this.onPropsChangeFunc = onPropsChangeFunc;

  preferences.on( "", function() {
    that.onPropsChangeFunc( that );
  });
}

Props.prototype = {
  getPosition: function() {
  	var position;

    if ( this.prefs.position === "top_right" ) {
      position = "top: 3px; right: 3px;";
    }
    else if ( this.prefs.position === "bottom_left" ) {
      position = "bottom: 3px; left: 3px;";
    }
    else if ( this.prefs.position === "bottom_right" ) {
      position = "bottom: 3px; right: 3px;";
    }
    else {
      position = "top: 3px; left: 3px;";
    }

  	return position;
  },
  isPopupEnabled: function() {
    return this.prefs.popup_enabled;
  },
  getLang: function() {
    var langArr = [];

    if ( this.prefs.russian ) {
      langArr.push("ru");
    }
    if ( this.prefs.accents ) {
      langArr.push("lat");
    }

    return langArr;
  },
  getShortCut: function() {
  	var shortCut = "";

  	if ( this.prefs.isAccel ) {
  		shortCut += "accel-";
  	}
  	if ( this.prefs.isAlt ) {
  		shortCut += "alt-";
  	}
  	if ( this.prefs.isShift ) {
  		shortCut += "shift-";
  	}
  	if ( shortCut.length > 0 && this.prefs.shortCut !== undefined ) {
  		shortCut += this.prefs.shortCut;
  	}
  	else {
  		shortCut = "accel-shift-o";
  	}

  	return shortCut;
  },
  getCasualShortCut: function() {
  	var casualShortCut = this.getShortCut();

  	casualShortCut = this._replaceAll( casualShortCut, "-", "+" );
  	casualShortCut = this._replaceAll( casualShortCut, "accel", "ctrl" );
  	casualShortCut = casualShortCut.toUpperCase();

  	return casualShortCut;
  },
  _replaceAll: function(str, search, replace) {
    return str.split(search).join(replace);
  }
};

exports.Props = Props;
