(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var deps, recording;

function record(cell){
	if(recording && deps.indexOf(cell) < 0){
		deps.push(cell);
	}
}

function startRecord(){
	deps = [];
	recording = true;
}

function getDeps(){
	recording = false;

	return deps;
}

exports.observable = function(value){
	var cell, subscribers;

	cell = function(newValue){
		var changed;

		if(arguments.length){
			changed = cell.comparator(value, newValue);
			value = newValue;

			if(changed){
				cell.notify(value);
			}
		}

		record(cell);

		return value;
	};

	cell.comparator = function(value, newValue){
		return value !== newValue;
	};

	subscribers = [];

	cell.subscribe = function(fn){
		if(subscribers.indexOf(fn) < 0){
			subscribers.push(fn);
		}
	};

	cell.unsubscribe = function(fn){
		var index = subscribers.indexOf(fn);

		if(index > -1){
			subscribers.splice(index, 1);
		}
	};

	cell.notify = function(data){
		subscribers.forEach(function(fn){
			fn(data);
		});
	};

	cell.extend = function(options){
		Object.keys(options).filter(function(key){
			return exports.extenders.hasOwnProperty(key);
		}).forEach(function(key){
			exports.extenders[key](cell, options[key]);
		});

		return cell;
	};

	return cell;
};

exports.computed = function(read){
	var data = exports.observable();

	startRecord();
	data(read());

	getDeps().forEach(function(cell){
		cell.subscribe(function(){
			data(read());
		});
	});

	return data;
};

exports.extenders = {
	notify: function(cell, option){
		cell.comparator = option === 'always' ? function(){
			return true;
		} : cell.comparator;
	}
};

},{}],2:[function(require,module,exports){
/* jshint browser:true */
'use strict';

var bindings = {
	'value': {
		bind: function(element, publish){ element.addEventListener('change', publish); },
		unbind: function(element, publish){ element.removeEventListener('change', publish); },
		routine: function(element, key, value){ element[key] = value; }
	},
	'on-*': {
		bind: function(element, publish, args){ console.log(this, element, args[0].toLowerCase()); },
		// TODO: save handler
		// TODO: rewrite to use `bind`
		routine: function(element, key, value, args){
			element.addEventListener(args[0].toLowerCase(), value);
		}
	},
	// TODO: use .setAttribute
	'*': { routine: function(element, key, value){ element[key] = value; } }
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
	// TODO: [A-Z] -> fuck this out
	this.name = new RegExp('(' + key.replace(/\-/g, '').replace(/\*/g, '(.+)') + ')');
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
			var originalKey = args[0]; // is it necessary?
			var keypath = node.dataset[originalKey];

			adapter.observe(model, keypath, function(){
				handler.routine(node, originalKey, adapter.get(model, keypath));
			});

			handler.bind(node, function(){
				adapter.set(model, keypath, node.value);
			}, args.slice(2));

			handler.routine(node, originalKey, adapter.get(model, keypath), args.slice(2));
		}
	});
}

exports.compile = compile;
exports.handlers = bindings;
exports.adapter = adapter;

},{}],3:[function(require,module,exports){
var reactive = require('../bower_components/reactive/index.js'),
	template = require('../index.js');


function getTarget(source, keypath){
	return keypath.split('.').reduce(function(source, key){
		return source[key];
	}, source);
}

template.adapter.observe = function(object, keypath, callback){
	getTarget(object, keypath).subscribe(callback);
};

template.adapter.unobserve = function(object, keypath, callback){
	getTarget(object, keypath).unsubscribe(callback);
};

template.adapter.get = function(object, keypath){
	return getTarget(object, keypath)();
};

template.adapter.set = function(object, keypath, value){
	getTarget(object, keypath)(value);
};

template.compile(viewport, {
	name: reactive.observable('Alex'),
	// TODO: remove wrapper; unwrapObservable??
	click: reactive.observable(function(){
		console.log(arguments);
	})
});

},{"../bower_components/reactive/index.js":1,"../index.js":2}]},{},[3])