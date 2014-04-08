/* jshint browser:true */
'use strict';

var bindings = {
	'value': {
		bind: function(element, publish){ element.addEventListener('change', publish); },
		unbind: function(element, publish){ element.removeEventListener('change', publish); },
		routine: function(element, key, value){ element[key] = value; }
	},
	'*': { routine: function(element, key, value){ element[key] = value; } }
};

function createTreeWalker(root){
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter, false);

	return walker;
}

// use sindresorhus/object-assign
function mixin(target, source, keys){
	keys = keys || Object.keys(source);

	keys.forEach(function(key){
		target[key] = source[key];
	});

	return target;
}

function Binder(key, binder){
	this.name = new RegExp('(' + key.replace(/\*/g, '.+') + ')');
	mixin(this, binder);
}

Binder.prototype.routine = function(){};
Binder.prototype.bind = function(){};
Binder.prototype.unbind = function(){};

function getBindings(){
	return Object.keys(bindings).map(function(key){
		return new Binder(key, bindings[key]);
	});
}

function compile(root, model){
	var walker = createTreeWalker(root),
		node = walker.currentNode,
		bindings = getBindings();

	do{
		bind(node, model, bindings);
		node = walker.nextNode(); // .nextSibling();
	}while(node);
}

function bind(node, model, bindings){
	Object.keys(node.dataset).forEach(function(key){
		var handler = bindings.find(function(handler){
			return handler.name.test(key);
		});

		// TODO: subscribe value mutation
		// TODO: use sightglass
		if(handler){
			var originalKey = handler.name.exec(key)[0];
			var value = model[node.dataset[originalKey]];
			// handler.bind(node, function(){ console.log(1); });
			handler.routine(node, originalKey, value);
		}
	});
}

