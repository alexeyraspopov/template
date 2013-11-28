text = function(element, scope, attrs){
	observe(scope, attrs.text, function(value){
		element.textContent = value;
	});
};

model = {
	routine: function(element, scope, attrs){

		observe(scope, attrs.model, function(value){
			element.value = value;
		});
	},
	bind: function(element, scope, attrs){

		element.addEventListener('change', function(){
			// TODO: work with nested keypath
			scope[attrs.model] = this.value;
		});
	}
};