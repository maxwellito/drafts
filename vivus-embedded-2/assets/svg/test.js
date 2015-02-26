document.test = function(){
	console.log('test from SVG');
};
var onLoad=function(evt) {
	var target = evt.target;
	var alertFromSVG = function(message){
		alert('called within SVG file with parameter: '+message);
	};
	document._SVG={
		 getElement		: function(){return target;}
		,alertFromSVG	: alertFromSVG
	};
};
/*
The SVG element in this example can be accessed from outside with:
...
<object id="svg_C" type="image/svg+xml" data="svg/lens-with-js.svg" >Your browser does not support SVG</object>
...
(document.getElementById('svg_C')).addEventListener('load', function(e){
		var doc = e.target.contentDocument;
		doc.test();
		doc._SVG.alertFromSVG('test');
	}, false);
...
*/
