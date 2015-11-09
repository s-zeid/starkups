/*
 ####  #####   ###   ####   ####   #   #   ####  #  #   ####  #  #  #  #   #   #
#        #    #   #  #   #  #   #  #   #  #      # #   #      #  #  #  #  ##   #
 ###     #    #####  ####   ####   #   #  #      ##     ###   #  #  #  #   #   #
    #    #    #   #  #  #   #   #  #   #  #      # #       #               #    
####     #    #   #  #   #  ####    ###    ####  #  #  ####   #  #  #  #  ###  #
*/

var debug = (typeof(window) == "object") ? window : {};
debug.viewer = exports;

var $ = debug.$ = require("jquery");
var markdown = debug.markdown = require("markdown").markdown;
var starkups = debug.starkups = require("../../starkups.js");


var CAN_OPEN_FILES = ["function", "object"].indexOf($.type(FileReader)) >= 0;
var CAN_SAVE_FILES = ["function", "object"].indexOf($.type(Blob)) >= 0;

var STATIC_NAME_PLACEHOLDER = "__SKP"+"_"+"INSERT_NAME_HERE__";
var STATIC_DATA_PLACEHOLDER = "__SKP"+"_"+"INSERT_DATA_HERE__";
var STATIC_TEMPLATE = "";
debug.getStaticTemplate = function() { return STATIC_TEMPLATE; };


var StarkupsViewer = exports.StarkupsViewer = function StarkupsViewer(root, doc) {
 if (!(this instanceof StarkupsViewer))
  return new StarkupsViewer(root, doc);
 
 var self = this;
 var $$ = make$(root);

 self.root = root;
 self.doc = doc;
 
 self.isStatic = $$(".skp-file").text().length != 0;
 self.starkups = null;
 
 var isDefaultFile = false;

 function init() {
  if (!CAN_OPEN_FILES) {
   if (!self.isStatic)
    $$(".skp-subtitle").text("Your browser doesn't support HTML5 file uploads.  I can't continue, sorry.  :(");
   $$(".skp-open").hide();
  }
  $$(".skp-open").click(function(e) {
   self.open();
   e.preventDefault();
  });
  $$(".skp-save").hide();
  $$(".skp-save").click(function(e) {
   if ($(this).attr("href") == "#")
    e.preventDefault();
  });
  $$(".skp-scrollable").scroll(function() {
   var scrollable = $$(".skp-scrollable");
   if (scrollable.hasClass("ready") && scrollable.scrollTop() <= 32) {
    var pos = scrollable.scrollTop();
    self.render(20, function(item) {
     pos += $$(".skp-main").children().first().outerHeight();
     scrollable.scrollTop(pos);
    });
   }
  });
  if (self.isStatic) {
   self.render();
  } else {
   isDefaultFile = true;
   $$(".skp-file").attr("title", "starkups");
   $$(".skp-file").text(trimString($$(".skp-default").text()));
   self.render();
   isDefaultFile = false;
  }
 }
 
 self.open = function() {
  var input = $("<input type='file'/>");
  input.click();
  input.change(function() {
   var files = input[0].files;
   if ($.type(files.length) === "number" && files.length) {
    readFile(files[0], function(e, info) {
     $$(".skp-file").attr("title", info.name);
     $$(".skp-file").text(info.data);
     self.starkups = null;
     self.render();
    }, "UTF-8");
   }
  });
 };
 
 self.render = function(n, itemCallback, endCallback) {
  if (n == null) n = 20;
  
  var skp;
  if (self.starkups == null) {
   // initial rendering
   skp = self.starkups = new starkups.Starkups($$(".skp-file").text(), true);
   
   $$(".skp-open").hide();
   $$(".skp-save").hide();
   $$(".skp-scrollable").removeClass("ready");
   $$(".skp-main").empty().removeClass("skp-empty");
   
   $$(".skp-title").html(pToDiv(starkups.mdToHtml(skp.title)));
   $$(".skp-subtitle").html(pToDiv(starkups.mdToHtml(skp.subtitle)));
   if (typeof(doc) == "object" && !isDefaultFile)
    doc.title = $$(".skp-title").text();
   self.render(n, function(item) {
    $$(".skp-scrollable").scrollTop($$(".skp-main").innerHeight());
   }, function(items) {
    if (!self.isStatic) {
     $$(".skp-open").show();
     if (CAN_SAVE_FILES && STATIC_TEMPLATE)
      $$(".skp-save").show();
    } else {
     if (!skp.subtitle)
      $$(".skp-toolbar").hide();
    }
    var dlA = $$(".skp-save"), dlData, dlName;
    if (isDefaultFile) {
     dlData = STATIC_DATA_PLACEHOLDER;
     dlName = STATIC_NAME_PLACEHOLDER;
     dlA.attr("title", "Download Starkups");
     dlA.find("span").text("Download Starkups");
     dlA.find("i").text("file_download");
    } else {
     dlData = $$(".skp-file").text();
     dlName = $$(".skp-file").attr("title");
     dlA.attr("title", "Save as HTML");
     dlA.find("span").text("Save as HTML");
     dlA.find("i").text("save");
    }
    dlA.attr("href", makeStaticPage(dlData, dlName));
    dlA.attr("download", ((isDefaultFile)?$$(".skp-file").attr("title"):dlName)+".html");
    if (!isDefaultFile) {
     setTimeout(function() {  // setTimeout -> HACK HACK HACK (static load didn't scroll)
      $$(".skp-scrollable").scrollTop($$(".skp-main").innerHeight());
     }, 500);
    }
    $$(".skp-scrollable").addClass("ready");
   });
  } else {
   // rendering scrolled-in items
   skp = self.starkups;
   
   $$(".skp-scrollable").removeClass("ready");
   var cardTemplate = $$(".skp-templates > .skp-item");
   self.starkups.items(n, function(item) {
    var card = cardTemplate.clone(true, true);
    var $$$ = make$(card);
    card.addClass((item.important) ? "important" : "not-important");
    $$$(".skp-slug").html(pToSpan(starkups.mdToHtml(item.slug)));
    $$$(".skp-summary").html(pToSpan(starkups.mdToHtml(item.summary)));
    $$$(".skp-body").html(item.bodyToHTML());
    $$$(".skp-body a").each(function() {
     $(this).attr("target", "_blank");
    });
    card.prependTo($$(".skp-main"));
    if (itemCallback)
     itemCallback(item);
   }, function(items) {
    if (endCallback)
     endCallback(items);
    $$(".skp-scrollable").addClass("ready");
   });
  }
 };
 
 init();
}


function generateStaticTemplate($headCloned, $bodyCloned) {
 var page = "<!DOCTYPE html><!-- vim: set fdm=marker: --><html>";
 var $head = $headCloned.clone(); // in case someone passed an original
 var $body = $bodyCloned.clone(); // instead of a clone
 $head.children("script[src*='analytics']").remove();
 $head.children(".start-crap-trap").each(function() {
  // trap and remove crap added by browser extensions
  var el = $(this);
  while (el.next().length) {
   if (el.next().hasClass("end-crap-trap"))
    break;
   el.next().remove();
  }
 });
 page += "<head>\n  " + trimString($head.html()) + "\n </head>";
 $body.find(".skp-file").text(STATIC_DATA_PLACEHOLDER);
 $body.find(".skp-file").attr("title", STATIC_NAME_PLACEHOLDER);
 //page += "\n <body class=\"" + htmlEscape($body.attr("class"), true) + "\">\n  "
 page += "\n <body>\n  "
         + trimString($body.html());
 //page = page.replace(/\xC2\xA9|\u00A9/gi, "&copy;");
 //page = page.replace(/#/g, "\x2523");
 //page = page.replace(/&/g, "\x2526");
 ///*del*/
 //page = page.replace(/\/\*del\*\/(.|\n)*?\/\*\/del\*\//g, "");
 ///*/del*/return page.replace(/\x0D\x0A|\x0D|\x0A/g, "\x250A");
 page += "\n \n\n</body></html>";
 STATIC_TEMPLATE = page;
}


function htmlEscape(s, quotes) {
 if (typeof(quotes) === "undefined") quotes = true;
 s = s.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
 if (quotes)
  s = s.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
 return s;
}


function makeStaticPage(data, name) {
 if (STATIC_TEMPLATE) {
  var page = STATIC_TEMPLATE;
  page = page.replace(STATIC_DATA_PLACEHOLDER, function(){return htmlEscape(data, false)});
  page = page.replace(STATIC_NAME_PLACEHOLDER, function(){return htmlEscape(name)});
  var blob = new Blob([page], {"type": "text/html"});
  var url = URL.createObjectURL(blob);
  return url;
 }
}
 

function make$(el) {
 return function() { return el.find.apply(el, arguments); };
};


function pToX(s, x) {
 var container = $("<div></div>");
 container.html(s);
 container.find("p").replaceWith(function() {
  return $("<" + x + "></" + x + ">").html($(this).html());
 });
 return container.html();
}


function pToDiv(s) {
 return pToX(s, "div");
}


function pToSpan(s) {
 return pToX(s, "span");
}


function readFile(file, onload, encoding) {
 var reader = new FileReader();
 reader.onload = function(e) {
  var info = {
   name: file.name, size: file.size, type: file.type,
   data: e.target.result, dom: file
  };
  onload(e, info);
 }
 if (encoding === "data:")
  reader.readAsDataURL(file);
 else if ($.type(encoding) === "string")
  reader.readAsText(file, encoding);
 else if (encoding === null)
  reader.readAsBinaryString(file);
 else
  reader.readAsText(file, "UTF-8");
 return reader;
}


function trimString(s) {
 return s.replace(/^[\r\n\t\0 ]+/g, "").replace(/[\r\n\t\0 ]+$/g, "")
}


function main() {
 var isStatic = false;
 $(".skp-file").each(function() {
  var nStatic = 2;
  var $this = $(this);
  if ($this.attr("title") == STATIC_NAME_PLACEHOLDER) {
   $this.attr("title", "");
   nStatic -= 1;
  }
  if ($this.html() == STATIC_DATA_PLACEHOLDER) {
   $this.html("");
   nStatic -= 1;
  }
  if (nStatic)
   isStatic = true;
 });
 
 if (!isStatic)
  generateStaticTemplate($(document.head).clone(), $(document.body).clone());

 debug.skp = new StarkupsViewer($(".skp-root"), document);
}


main()
