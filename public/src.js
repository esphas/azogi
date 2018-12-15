
const Azogi = require('../src/index');

(function() {
  // initialize
  var output = document.querySelector('#output');
  var input = document.querySelector('#input');
  input.setAttribute('contentEditable', 'true');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');
  // azogi
  var azogi = new Azogi();
  /**
   * 1. read current state
   *   a) read text segments from input field
   *   b) find selection anchor and focus
   * 2. parse infomation
   *   a) text segments -> string
   *   b) re-calculate selection anchor and focus
   * 3. render and restore selection
   * 4. process input to produce output
   */
  function updateInput() {
    function getTextSegments(element) {
      var segments = [];
      Array.from(element.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          segments.push({ text: node.nodeValue, node });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          segments.splice(segments.length, 0, ...getTextSegments(node));
        }
      });
      return segments;
    }
    function renderText(text) {
      function getType(char) {
        if (azogi.depots.hasOwnProperty(char)) {
          return 'keyword';
        }
        if (char === char.toLowerCase()) {
          return 'warning';
        }
        return 'normal';
      }
      var units = Array.from(text).map((char) => {
        return { char, type: getType(char) }
      });
      var mergedUnits = [];
      var char = null;
      var type = null;
      units.forEach((unit) => {
        if (type == null) {
          char = unit.char;
          type = unit.type;
        } else if (type === unit.type) {
          char += unit.char;
        } else {
          mergedUnits.push({ char, type });
          char = unit.char;
          type = unit.type;
        }
      });
      if (type != null) {
        mergedUnits.push({ char, type });
      }
      var nodes = mergedUnits.map((unit) => {
        var node = document.createElement('span');
        node.classList.add(unit.type);
        node.appendChild(document.createTextNode(unit.char));
        return node;
      });
      return nodes;
    }
    // 1
    var segments = getTextSegments(input);
    var selection = window.getSelection();
    // 2
    var pattern = segments.map((segment) => segment.text).join('').replace(' ', '\u00A0');
    var absoluteAnchorIndex = null;
    var absoluteFocusIndex = null;
    var currentIndex = 0;
    segments.forEach((segment) => {
      if (segment.node === selection.anchorNode) {
        absoluteAnchorIndex = currentIndex + selection.anchorOffset;
      }
      if (segment.node === selection.focusNode) {
        absoluteFocusIndex = currentIndex + selection.focusOffset;
      }
      currentIndex += segment.text.length;
    });
    // 3
    var textNodes = renderText(pattern);
    while (input.firstChild) {
      input.removeChild(input.firstChild);
    }
    textNodes.forEach((node) => {
      input.appendChild(node);
    });
    var anchorNode = input;
    var anchorIndex = 0;
    var focusNode = input;
    var focusIndex = 0;
    currentIndex = 0;
    segments = getTextSegments(input);
    segments.forEach((segment) => {
      var start = currentIndex;
      var end = currentIndex + segment.text.length;
      if (start <= absoluteAnchorIndex && absoluteAnchorIndex <= end) {
        anchorNode = segment.node;
        anchorIndex = absoluteAnchorIndex - start;
      }
      if (start <= absoluteFocusIndex && absoluteFocusIndex <= end) {
        focusNode = segment.node;
        focusIndex = absoluteFocusIndex - start;
      }
      currentIndex += segment.text.length;
    });
    selection.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
    // 4
    var results = azogi.next(pattern);
    if (results === '') {
      results = 'Azogi';
    }
    results = results[0].toUpperCase() + results.slice(1).toLowerCase();
    output.textContent = results;
  }
  input.addEventListener('input', updateInput);
})();
