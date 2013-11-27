function View(root, model){
	this.element = root;
	this.model = model;

	this.compile();
}

View.prototype.compile = function(){
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(this.element, NodeFilter.SHOW_ELEMENT, filter, false),
		node = walker.currentNode;

	do{
		console.log(node, node.dataset);
		node = walker.nextNode(); // or nextSibling()
	}while(node);
};