function script() { // For contentScript of menuItem
  var text = window.getSelection().toString(),
    focusedElement = document.activeElement,
    body = document.body;

  if ( !text && focusedElement && focusedElement.value ) {
    text = focusedElement.value.slice(focusedElement.selectionStart, focusedElement.selectionEnd);
  }

  if ( '%isFromMenuItem%' ) {
    self.postMessage(text);
  }
  else {
    self.port.emit( 'selectedText', text );
  }

  if ( focusedElement && '%isPopupEnabled%' ) {
    var infoDiv = document.createElement("div");
    infoDiv.textContent = "Latinized text has been copied to clipboard";
    infoDiv.style =
      "position: absolute;" +
      "%position%" + //replaced  before set to menuItem contentScript
      "padding: 6px 16px 10px;" +
      "z-index: 1000;" +
      "font-size: 16px;" +
      "opacity: 1;" +
      "transition: all 1.8s cubic-bezier(0.250, 0.250, 0.750, 0.750);" +
      "border: 1px solid #e0e0e0;" +
      "border-radius: 2px;" +
      "background: #eeeeee;";
    body.appendChild(infoDiv);

    setTimeout(function() {
      infoDiv.style.opacity = 0;
      setTimeout(function() {
        body.removeChild(infoDiv)
      }, 2000);
    }, 1000);
  }
};

exports.script = script;
