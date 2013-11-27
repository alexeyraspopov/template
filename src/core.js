function View(root, model){
	this.element = root;
	this.model = model;

	this.compile();
}

View.prototype.compile = function(){
	// TODO: perf test tree walker vs simple elements list
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(this.element, NodeFilter.SHOW_ELEMENT, filter, false),
		node = walker.currentNode;

	do{
		this.bind(node);
		node = walker.nextNode(); // or nextSibling()
	}while(node);
};

View.prototype.bind = function(node){
	// TODO: create Binding contructor for each case of binding
	Object.keys(node.dataset).filter(function(key){
		return !!window[key];
	}).map(function(key){
		return window[key];
	}).forEach(function(handler){
		handler(node, this.model, node.dataset);
	}, this);
};