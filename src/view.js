function View(root, scope){
	this.element = root;
	this.scope = scope;
	this.bindings = [];

	this.compile();
	// IDEA: use fastdom for bind handlers
	this.bind();
}

View.prototype.compile = function(){
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(this.element, NodeFilter.SHOW_ELEMENT, filter, false),
		node = walker.currentNode;

	do{
		this.createBindings(node);
		node = walker.nextNode(); // or nextSibling() if currentNode is block
	}while(node);
};

View.prototype.createBindings = function(node){
	// TODO: change handlers location
	// TODO: use simple function for handlers with only one method 'routine'
	Object.keys(node.dataset).filter(function(type){
		return !!window[type];
	}).forEach(function(type){
		this.bindings.push(new Binding(type, node, this.scope, window[type]));
	}, this);
};

View.prototype.bind = function(){
	this.bindings.forEach(function(binding){
		binding.bind();
	});
};