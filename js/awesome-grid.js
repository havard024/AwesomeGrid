angular.module('awesomeGrid', ['awesomeGrid.factories', 'awesomeGrid.directives']);

angular.module('awesomeGrid.factories', [])
.factory('configFactory', [function() {

	var columns, factory, rows;

	// Column configuration
	columns = [{
		id : 'reference',
		label : 'Reference Number',
		search : true,
		create : {},
		read : {},
	}, {
		id : 'first_name',
		label : 'First name',
		create : {},
		read : {},
		update : {}
	}, {
		id : 'last_name',
		label : "Last name",
		create : {
			search : true
		},
		read : {},
		update : {}
	}, {
		id : 'date',
		label : 'Date Hired',
		create : {},
		read : {},
		update : {}
	}, {
		id  : 'email',
		label : 'Email address',
		search : true,
		create : {},
		read : {},
		update : {}
	}];

	jQuery.mockJSON(/mockdata\.json/, {
 		"rows|25-50" : [{ 
			"id|8-8"   : "@LETTER_UPPER@NUMBER@LETTER_LOWER", 
      			"date" : "@DATE_YYYY/@DATE_MM/@DATE_DD",
      			"first_name" : "@MALE_FIRST_NAME",
			"last_name" : "@LAST_NAME",
      			"email" : "@EMAIL",
			"reference|8-8" : "@NUMBER", 
      		}]
   	});

	factory = {
		columns : columns,
		data : {
			//	local : rows
				remote : "mockdata/mockdata.json"
		}
	};

	return factory;
}]).factory('eventFactory', ['$timeout', function($timeout) {
	
	var events = [];
	var removeDelay = 4000;
	var id = 0;

	function getHeader(type) {
		if (type === "create") {
			return "Creating product...";
		} else if (type === "update") {
			return "Updating product...";
		} else if (type === "delete") { 
			return "Deleting product...";
		}
	}

	function Event(conf) {
		this.id = id++;
		this.time = Date.now();
		this.header = conf.status + "!";
		if (conf.status === 'error') { 
			this.msgType = 'danger';
			this.msg = "Failed to " + conf.type + " item.";
		} else {
			this.msgType = 'success'
			this.msg = "Successfully " + conf.type + "d item.";
		}

	}

	var factory = {};
	
	factory.trigger = function(conf) {
	
		var event = new Event(conf);
		events.push(event);

		$timeout(function() {
			angular.forEach(events, function(field, key) {
				if (field.id === event.id) {
					events.splice(key, 1);
					return;
				}
			})
		}, removeDelay)
	}	

	factory.triggerLocalEvent = function(type) {
		events.push(new Event({
			type : type,
			status : 'local',
			msgType : 'info'
		}));
	}

	factory.getEvents = function() {
		return events;
	}

	return factory;
}]).factory('dataFactory', ['configFactory', 'remoteDataFactory', 'localDataFactory', 'eventFactory', function(conf, remote, local, event) {

	var factory;

	init();

	function isLocalData() {
		return conf.data.local;
	}

	function isRemoteData() {
		return conf.data.remote;
	}

	function init() {
		if (isLocalData()) {
			local.store({
				value : conf.data.local, 
				local : true
			});
		} else if (isRemoteData()) {
			getRemote();
		} else {
			throw "Invalid configuration. No remote or local data source specified."
		}
	}
	
	function getRemote() {
		var data = remote.get(conf.data.remote);
		data.remote = true;
		local.store(data);
	}

	factory = {};

	factory.getColumns = function() {
		return conf.columns;
	}

	factory.get = function(refresh) {

		if (refresh) {	
			getRemote();
		} 

		return local.get();
	}

	factory.createItem = function(item) {	
		
		success();
	
		remote.insert(item).then(function() { 
			// Success
		}, function() {
			rollback();
		});
	
		function success() {
			local.insert(item);
		}

		function rollback() {
			local.delete(item);
		}
	}

	factory.updateItem = function(oldItem, newItem) {

		var copy = angular.copy(oldItem);

		success();

		remote.update(copy, newItem).then(function() {
		
		}, function() {
			rollback();
		});	
		
		function success() {
			for (var i = 0; i < conf.columns.length; ++i) {
				var id = conf.columns[i].id;
				oldItem[id].value = newItem[id].value
			}
		}

		function rollback() {
			for (var i = 0; i < conf.columns.length; ++i) {
				var id = conf.columns[i].id;
				oldItem[id].value = copy[id].value;
			}
		}
	}	

	factory.deleteItem = function(item) {

		var key; 

		success();

		remote.delete(item).then(function() {
		 
		}, function() {
			rollback();
		});
		
		function success() {
			key = local.delete(item);
		}

		function rollback() {
			local.insert(item, key);
		}
	}

	return factory;
}]).factory('remoteDataFactory', ['$http', 'eventFactory', '$timeout', '$q', function($http, event, $timeout, $q) {
	
	var factory, data;

	data = {}
	factory = {};

	function valuefy(rows) {
		var i;
		for (i = 0; i < rows.length; ++i) {
			var row = rows[i];
			angular.forEach(row, function(field, key) {
				row[key] = { value : field };
			});
		}
	}

	factory.get = function(url) {

		if (url.indexOf('mockdata') != -1) { 
			var deferred = $q.defer();

			jQuery.getJSON(url, function(ret) {
				deferred.resolve(ret);
			})
		
			deferred.promise.then(function(ret) {
				valuefy(ret.rows);
				data.value = ret.rows;
			}, function(ret) {
				console.log('error', ret)
			});
		} else {
       		        $http.post(url).success(function(ret) {
                	       data.value = ret;
               		}).error(function(ret) {console.log('error', ret)});
		}

		return data;
	}

	function random(start, stop) {
		return Math.floor(Math.random() * stop * 1000) + start * 1000;
	}

	function post(evtConfig) {
		var url = 'google.com';
	
		if (random(0,1) % 2 === 0) {
			url = 'er'; 
		}

		var deferred = $q.defer();

		$timeout(function() {
/*			if (random(0,1) % 2 === 0) {
				deferred.reject();
				evtConfig.status = 'error';
			} else {
*/				deferred.resolve();
				evtConfig.status = 'success';
//			}

			event.trigger(evtConfig);
		}, 300);

	/*
		$timeout(function() {
			$http.post(url).error(function() {
				deferred.reject();
				evtConfig.status = 'error';
				event.trigger(evtConfig);
			}).success(function() {
				deferred.resolve();
				evtConfig.status = 'success';
				event.trigger(evtConfig);
			});
		}, 300);
		*/	
	return deferred.promise;
	}


	factory.insert = function(item, evt) {

		evtConfig = {
			'status' : 'success',
			'type' : 'create',
			data : {
				item : angular.copy(item)
			}
		};

		return post(evtConfig);
	}

	factory.update = function(oldItem, newItem, evt) {

		evtConfig = {
			'status' : 'success',
			'type' : 'update',
			data : {
				from : angular.copy(oldItem),
				to   : angular.copy(newItem)
			}
		};
		
		return post(evtConfig);
	}

	factory.delete = function(item, evt) {

		evtConfig = {
			'status' : 'success',
			'type' : 'delete',
			data : {
				item : angular.copy(item)
			}
		};

		return post(evtConfig);
	}

	return factory;
}]).factory('localDataFactory', [function() {

	var factory, data, id;
	
	id = 0;
	factory = {};

	factory.store = function(d) {
		data = d;
	}

	factory.get = function() {
		return data;
	}

	factory.insert = function(item, key) {
		item.lid = id++;

		if (key) {
			data.value.splice(key, 0, item);
		} else {		
			data.value.unshift(item);
		}
	}

	factory.delete = function(item) {
		
		var ret;

		angular.forEach(data.value, function(field, key) {
			if (field.id === item.id) {
				data.value.splice(key, 1);
				ret = key;
				return;
			}
		});

		return ret;
	}

	return factory;
}]);

angular.module('awesomeGrid.directives', [])
.directive('agAwesomeGrid', ['dataFactory', function(data) {
	return {
		restrict : 'C',
		templateUrl : 'templates/awesome-grid-2/table.html',
		controller : function($scope) {

			var formIsOpen = false;

			$scope.rows = data.get();
			$scope.columns = data.getColumns();
			$scope.emptyRow = {};

			angular.forEach($scope.columns, function(field, key) {
				$scope.emptyRow[field.id] = {};
			});	

			$scope.activeRow = {
				copy : {},
				curr : {}
			}	
	
			$scope.getLabel = function(col) {
				return col.label;
			}	

			$scope.getValue = function(col, row) {
				return row[col.id].value;	
			}

			function getRowId(row) {
				return row.id || row.lid;
			}

			$scope.openForm = function(row, type) {
				$scope.activeRow.copy = angular.copy(row);
				$scope.activeRow.curr = row;
				formIsOpen = true;
				$scope.type = type;
			}

			$scope.closeForm = function() {
				formIsOpen = false;
			}

			$scope.saveForm = function() {
				var copy = $scope.activeRow.copy;
				var curr = $scope.activeRow.curr;

				if (getRowId(copy)) {
					data.updateItem($scope.activeRow.curr, $scope.activeRow.copy)
				} else {
					data.createItem(copy)
				}

				$scope.closeForm();
			}

			$scope.showForm = function() {
				return formIsOpen;
			}

			$scope.delete = function(row) {
				data.deleteItem(row);
			}

			$scope.formColumnFilter = function(val) {

				var text, column;

				text = $scope.formSearchText;
				column = $scope.formSearchColumn;
				
				if (formIsOpen && text !== undefined && column !== undefined && text.length > 0 && column.length > 0 && val[column].value) {
					return val[column].value.indexOf(text) != -1;
				}				
			
				return true;
			}

			$scope.readFilter = function(val) {
				return val.read;
			}

			$scope.crudFilter = function(val) {
				return val[$scope.type];
			}
		}
	}
}]).directive('agForm', function() {
	return {
		restrict : 'C',
		templateUrl : 'templates/awesome-grid-2/form.html',
		controller : function($scope) {
			$scope.search = function(col) {
				if (col.search || col[$scope.type].search) {
					$scope.formSearchText = $scope.activeRow.copy[col.id].value;
					$scope.formSearchColumn = col.id;
				}
			}
		}
	}
}).directive('agEvents', ['eventFactory', function(event) {
	return {
		restrict : 'C',
		templateUrl : 'templates/awesome-grid-2/events.html',
		controller : function($scope) {
			$scope.events = event.getEvents();
		}
	}
}]).directive('agSearch', [function() {
	return {
		restrict : 'C',
		templateUrl : 'templates/awesome-grid-2/search.html',
		controller : function($scope) {
			
		}
	}
}]);
