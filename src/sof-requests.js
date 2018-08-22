var state = {
	isRequested: false
};
var requests = [];

module.exports.abort = function() {
	requests.forEach(function(req) {
		req.abort('manually');
	});
	
	state.isRequested = false;
	requests = [];
}

module.exports.getQuestions = (function() {
	var $ = require('jquery');
	
	return function(site,page,pageSize) {
		var deferred = $.Deferred();
		var promise;
		
		if(page !== undefined && pageSize !== undefined && state.isRequested === false) {
			state.isRequested = true;
			promise = $.ajax({
				method: 'GET',
				url: 'https://api.stackexchange.com/2.2/questions?key=U4DMV*8nvpm3EOpvf69Rxw((&site='+site+'&page='+page+'&pagesize='+pageSize+'&order=desc&sort=creation&filter=withbody',
				success: function(resp) {
					console.log('Список: ',resp);
					state.isRequested = false;
					deferred.resolve(resp);
				},
				error: function(resp) {
					if(resp.statusText !== 'manually')
						alert('Ошибка запроса');
					
					state.isRequested = false;
					deferred.reject(resp);
				}
			});
			
			requests.push(promise);
		}
		
		return deferred.promise();
	}
})();