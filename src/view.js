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
		node = walker.nextNode(); // or nextSibling()
	}while(node);
};

View.prototype.createBindings = function(node){
	// TODO: create Binding contructor for each case of binding
	Object.keys(node.dataset).filter(function(key){
		return !!window[key];
	}).map(function(key){
		return window[key] instanceof Function ? { routine: window[key] } : window[key];
	}).forEach(function(handler){
		// set binding type (dataset key)
		this.bindings.push(new Binding(node, this.scope, handler));
	}, this);
};

View.prototype.bind = function(){
	this.bindings.forEach(function(binding){
		binding.bind();
	});
};