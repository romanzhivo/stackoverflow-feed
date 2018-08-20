module.exports.scrollInit = function(getQuestions) {
	var $ = require('jquery');
	
	$(window).on('scroll', function() {
		var docEl = $(document);
		var windowElRaw = window;
		var docHeight = docEl.height();
		var windowHeight = windowElRaw.innerHeight;
		var scrollTop = docEl.scrollTop();
		var maxScrollTop = docHeight - windowHeight;
		
		console.log('docHeight',docHeight);
		console.log('scrollTop',docEl.scrollTop());
		console.log('delta',docHeight-docEl.scrollTop());
		console.log('maxScrollTop',maxScrollTop);
		
		if(scrollTop >= maxScrollTop*0.9)
			getQuestions();
	});
}