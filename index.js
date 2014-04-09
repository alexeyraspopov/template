/* jshint browser:true */
'use strict';

var bindings = {
	'value': {
		bind: function(element, publish){ element.addEventListener('change', publish); },
		unbind: function(element, publish){ element.removeEventListener('change', publish); },
		routine: function(element, value){ element.value = value; }
	},
	'text': {
		routine: function(element, value){ element.innerText = value; }
	},
	'on-*': {
		bind: function(element, publish, args){  },
		// TODO: save handler
		// TODO: rewrite to use `bind`
		routine: function(element, value, args){ element.addEventListener(args[0], value); }
	},
	'*': { routine: function(element, value, args){ element.setAttribute(args[0], value); } }
};

var adapter = {
	observe: function(object, keypath, callback){
		// implement
	},
	unobserve: function(object, keypath, callback){
		// implement
	},
	get: function(object, key){
		// return object[key];
	},
	set: function(object, key, value){
		// object[key] = value;
	}
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
	this.name = new RegExp(key.replace(/\-/g, '').replace(/\*/g, '(.+)'));
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

		if(handler){
			var args = handler.name.exec(key);

			var keypath = node.dataset[args.splice(0, 1)];

			args = args.map(function(key){
				return key.toLowerCase();
			});

			adapter.observe(model, keypath, function(){
				handler.routine(node, adapter.get(model, keypath), args);
			});

			handler.bind(node, function(){
				adapter.set(model, keypath, node.value);
			}, args);

			handler.routine(node, adapter.get(model, keypath), args);
		}
	});
}

exports.compile = compile;
exports.handlers = bindings;
exports.adapter = adapter;
