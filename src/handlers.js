text = function(element, value){
	element.textContent = value;
};

model = {
	routine: function(element, value){
		element.value = value;
	},
	bind: function(element, scope, attrs){
		element.addEventListener('change', function(){
			// TODO: work with nested keypath
			scope[attrs.model] = this.value;
		});
	}
};