JSNode = function () {};
JSNode.prototype = {
  tag: null,
  attrs: {},
  childs: [],
  value: "",
  _symbols: {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
    "\u00A0": "&nbsp;",
  },
  getInnerHTML: function (context) {
    var children = [];
    for (var i = 0; i < this.childs.length; i++) {
      children.push(this.childs[i].getContent(context));
    }
    return children.join("");
  },
  xmlEscape: function (value) {
    var text = value ? value.toString() : "";
    return text.escapeHTML();
  },
};
E = function (tagname, attributes, childnodes) {
  this.tag = tagname;
  if (attributes) this.attrs = attributes;
  if (childnodes) this.childs = childnodes;
};
E.prototype = new JSNode();
E.prototype.getContent = function (context) {
  var html = "<" + this.tag;
  var inner = this.getInnerHTML(context);
  if (inner == "") this.isEmpty = true;
  else this.isEmpty = false;
  for (var i in this.attrs) {
    if (!this.attrs.hasOwnProperty(i)) {
      continue;
    }
    var attrValue = this.attrs[i];
    if (typeof attrValue == "function")
      attrValue = attrValue.call(this, context);
    if (attrValue)
      html +=
        " " +
        (i == "className" ? "class" : i) +
        '="' +
        this.xmlEscape(attrValue) +
        '"';
  }
  html += ">" + inner + "</" + this.tag + ">";
  return html;
};
ET = function (text) {
  this.value = text;
};
ET.prototype.getContent = function (context) {
  var value = this.value;
  if (typeof value == "function") value = value(context);
  if (value && value.getContent) {
    value = value.getContent(context);
  }
  if (value) return value;
  return "";
};
T = function (text) {
  this.value = text;
};
T.prototype = new JSNode();
T.prototype.getContent = function (context) {
  var value = this.value;
  if (typeof value == "function") value = value(context);
  if (value) return this.xmlEscape(value);
  return "";
};
C = function (text) {
  this.value = text;
};
C.prototype.getContent = function (context) {
  return "<!--" + this.value + "-->";
};
D = function (text) {
  this.value = text;
};
D.prototype.getContent = function (context) {
  return "<![CDATA[" + this.value + "]]>";
};
