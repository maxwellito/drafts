document.test = function(){
	console.log('test from SVG');
};
document.Vivus = null;
var onLoad=function(evt) {
	var target = evt.target;
	var alertFromSVG = function(message){
		alert('called within SVG file with parameter: '+message);
	};
	var setStrokeColor = function(hexColorAsString){ // like '#fe0' or '#3366ae'
		if ( typeof hexColorAsString === 'undefined' ){
			hexColorAsString = '#'+Math.floor(Math.random()*16777215).toString(16);
		}
		if ( document.Vivus ) {
			document.Vivus.setStrokeColor(hexColorAsString);
		}
		else {
			var children = document.getElementById('group').childNodes;
			for (var i = 0; i < children.length; i++){
				switch ( children[i].nodeName.toLowerCase() ) {
					case 'circle':
					case 'line':
					case 'ellipse':
						children[i].setAttribute('stroke',hexColorAsString);
						break;
					default:
				}
			}
		}		
	};
	document._SVG={
		 getElement		: function(){return target;}
		,alertFromSVG	: alertFromSVG
		,setStrokeColor	: setStrokeColor
	};
	var myCallback=function(){ console.log('ready'); };
	document.Vivus = new Vivus(target, {type: 'delayed', duration: 200, start:'manual'}, myCallback);
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
