angular.module('awesomeGrid', ['awesomeGrid.factories', 'awesomeGrid.directives']);

angular.module('awesomeGrid.factories', [])
.factory('configFactory', [function() {

	var columns, factory, rows;

	// Column configuration
	columns = [{
		id : 'column1',
		label : 'Searchable in update/create',
		search : true,
		create : {},
		read : {},
		update : {}
	}, {
		id : 'column2',
		label : 'Searchable in create',
		create : {
			search : true
		},
		read : {},
		update : {}
	}, {
		id  : 'column3',
		label : 'Searchable in update',
		create : {},
		read : {},
		update : {
			search : true
		}
	}, {
		id : 'column4',
		label : 'Only readable',
		read : {}
	}, {
		id : 'column5',
		label : 'Only updateable',
		update : {}
	}, {
		id : 'column6',
		label : 'Only creatable',
		create : {}
	}];

	var rows = [{
		"id" : {
			"value" : "row1"
		},
		"column1" : {
			"value" : "value 1"
		},
		"column2" : {
			"value" : "value 2"
		},
		"column3" : {
			"value" : "value 3"
		},
		"column4" : {
			"value" : "Only readable 1"
		},
		"column5" : {
			"value" : "Only updateable 1"
		}, 
		"column6" : {
			"value" : "Only creatable 1"
		}
	}, {
		"id" : {
			"value" : "row1"
		},
		"column1" : {
			"value" : "value 4"
		},
		"column2" : {
			"value" : "value 5"
		},
		"column3" : {
			"value" : "value 6"
		},
		"column4" : {
			"value" : "Only readable 2"
		},
		"column5" : {
			"value" : "Only updateable 2"
		}, 
		"column6" : {
			"value" : "Only creatable 2"
		}
	}, {
		"id" : {
			"value" : "row1"
		},
		"column1" : {
			"value" : "value 7"
		},
		"column2" : {
			"value" : "value 8"
		},
		"column3" : {
			"value" : "value 9"
		},
		"column4" : {
			"value" : "Only readable 3"
		},
		"column5" : {
			"value" : "Only updateable 3"
		}, 
		"column6" : {
			"value" : "Only creatable 3"
		}
	}] 
	factory = {
		columns : columns,
		data : {
				local : rows
				//remote : "data.json"
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
		
	//	var evt = event.triggerLocalEvent('create');

		remote.insert(item).then(function() { 
			local.insert(item);
		}, function() {
			//	local.delete(item);
		});
	}

	factory.updateItem = function(oldItem, newItem) {

	//	var evt = event.triggerLocalEvent('update');
		var copy = angular.copy(oldItem);
	
		remote.update(copy, newItem).then(function() {
		
			for (var i = 0; i < conf.columns.length; ++i) {
				var id = conf.columns[i].id;
				oldItem[id].value = newItem[id].value
			}

		}, function() {
			/*
			for (var i = 0; i < conf.columns.length; ++i) {
				var id = conf.columns[i].id;
				oldItem[id].value = copy[id].value;
			}
			*/
		});	
	}	

	factory.deleteItem = function(item) {

	//	var evt = event.triggerLocalEvent('delete');

		remote.delete(item).then(function() {
			local.delete(item);
		 }, function() {
			//	local.insert(item);
		})
	}

	return factory;
}]).factory('remoteDataFactory', ['$http', 'eventFactory', '$timeout', '$q', function($http, event, $timeout, $q) {
	
	var factory, data;

	data = {}
	factory = {};

	factory.get = function(url) {
		$http.post(url).success(function(ret) {
			data.value = ret;
		}).error(function(ret) {console.log('error', ret)});

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
			if (random(0,1) % 2 === 0) {
				deferred.reject();
				evtConfig.status = 'error';
			} else {
				deferred.resolve();
				evtConfig.status = 'success';
			}

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

	var factory, data;
	
	factory = {};

	factory.store = function(d) {
		data = d;
	}

	factory.get = function() {
		return data;
	}

	factory.insert = function(item) {
		item.lid = 'make unique lid';
		data.value.unshift(item);
	}

	factory.delete = function(item) {
		console.log('local', 'delete', item);
		angular.forEach(data.value, function(field, key) {
			if (field.id === item.id) {
				data.value.splice(key, 1);
				return;
			}
		});
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
				console.log(row.id || row.lid);
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
				console.log('save form', $scope.activeRow)
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
				
				if (formIsOpen && text !== undefined && column !== undefined && text.length > 0 && column.length > 0) {
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
