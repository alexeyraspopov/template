text = {
	routine: function(element, value){
		element.textContent = value;
	}
};

model = {
	publish: true,
	bind: function(element, publish){
		element.addEventListener('change', publish);
	},
	value: function(element){
		return element.value;
	},
	routine: function(element, value){
		element.value = value;
	}
};