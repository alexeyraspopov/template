/* jshint browser:true */
'use strict';

var bindings = {
	'value': {
		bind: function(element, publish){ element.addEventListener('change', publish); },
		unbind: function(element, publish){ element.removeEventListener('change', publish); },
		routine: function(element, value){ element.value = value; }
	},
	'text': { routine: function(element, value){ element.innerText = value; } },
	'html': { routine: function(element, value){ element.innerHTML = value; } },

	// TODO: what if handler was changed? Should I remove prev listener?
	'on-*': { routine: function(element, value, args){ element.addEventListener(args[0], value); } },
	'*': { routine: function(element, value, args){ element.setAttribute(args[0], value); } }
};

var adapter = {
	// object, keypath, callback
	observe: function(){},

	// object, keypath, callback
	unobserve: function(){},

	// object, key
	get: function(){},

	// object, key, value
	set: function(){}
};

function createTreeWalker(root){
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter, false);

	return walker;
}

function Binder(key, binder){
	this.name = new RegExp(key.replace(/\-/g, '').replace(/\*/g, '(.+)'));

	Object.keys(binder).forEach(function(key){
		this[key] = binder[key];
	}, this);
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
	var bindings = getBindings(),
		walk = require('dom-walker');

	walk(root, function(node, next){
		bind(node, model, bindings);
		next();
	});
}

function bind(node, model, bindings){
	Object.keys(node.dataset).forEach(function(key){
		var handler = bindings.find(function(handler){
			return handler.name.test(key);
		});

		if(handler){
			handle(node, key, model, handler);
		}
	});
}

function handle(node, type, model, handler){
	var args = handler.name.exec(type),
		keypath = node.dataset[args.splice(0, 1)];

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

exports.compile = compile;
exports.handlers = bindings;
exports.adapter = adapter;
