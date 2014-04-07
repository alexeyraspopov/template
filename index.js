/* jshint browser:true */
'use strict';
// TODO: one-way binding

function createTreeWalker(root){
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter, false);

	return walker;
}

function compile(root, model, bind){
	var walker = createTreeWalker(root),
		node = walker.currentNode;

	do{
		bind(node, model);
		node = walker.nextNode(); // .nextSibling();
	}while(node);
}

function bind(node, model){
	Object.keys(node.dataset).map(function(key){
		node[key] = model[node.dataset[key]];
	});
}

