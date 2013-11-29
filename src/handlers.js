/**
  TODO: analize AngularJS directives and declare api for handlers
   - ngApp
   - ngBind
   - ngChecked
   - ngClass
   - ngClick / ngKeydown
   - ngCloak
   - ngController
   - ngCopy / ngCut
   - ngFocus
   - ngForm
   - ngHide / ngShow
   - ngIf
   - ngInclude
   - ngInit
   - ngList
   - ngModel
   - ngPluralize
   - ngReadonly
   - ngRepeat
   - ngSelected
   - ngSrc / ngSrcset
   - ngStyle
   - ngSubmit
   - ngTransclude

  Questions:
   - If I use functional paradigm, how can I implement drag'n'drop handlers?
   - What about components binding?
*/

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