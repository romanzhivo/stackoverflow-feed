module.exports.getQuestions = (function(page,pageSize) {
	var $ = require('jquery');
	var state = {
		isRequested: false
	};
	
	return function(site,page,pageSize) {
		var deferred = $.Deferred();
		
		if(page !== undefined && pageSize !== undefined && state.isRequested === false) {
			state.isRequested = true;
			$.get('https://api.stackexchange.com/2.2/questions?key=U4DMV*8nvpm3EOpvf69Rxw((&site='+site+'&page='+page+'&pagesize='+pageSize+'&order=desc&sort=creation&filter=withbody').then(
				function(resp) {
					console.log('Список: ',resp);
					state.isRequested = false;
					deferred.resolve(resp);
				},
				function(resp) {
					alert('Ошибка запроса');
					state.isRequested = false;
				}
			)
		}
		
		return deferred.promise();
	}
})();