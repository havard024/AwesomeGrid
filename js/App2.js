angular.module('App2', [])
	.directive('awesomeGridEvents', function() {
		return {
			restrict: 'C',
			templateUrl: 'templates/events.html',
			controller: function($scope, awesomeGridEventFactory) {
				$scope.getEvents = function() {
					return awesomeGridEventFactory.events;
				}	
			}
		}
	})
	.factory('awesomeGridEventFactory', function($timeout) {

		var events = [];

		function registerEvent(event) {
			event.visible = true;
			$timeout(function() {
		//		events.pop();
				event.visible = false;
			}, 8000);

			events.push(event);
		}

		function addSampleEvents() {

			var sampleEvents = [];
			sampleEvents.push({
				timestamp : Date.now(),
				msg : { type : 'success', value : 'Hurray, you did something good! *random sample message*' },
				data : 'Some details about your good deed.'
			});

			sampleEvents.push({
				timestamp : Date.now(),
				msg : { type : 'error', value : 'Oh noes, something failed :( *random sample message*' },
				data : 'No connection to the server?'
			});

			sampleEvents.push({
				timestamp : Date.now(),
				msg : { type : 'warning', value : 'You\'re about to do something that you might not want to do. *random sample message*' },	
				data : 'Something bad might happen if you follow through.'
			});

			sampleEvents.push({
				timestamp : Date.now(),
				msg : { type : 'info', value : 'Information message just for you! *random sample message*' },
				data : 'I don\'t think this kind of message is needed, too much spam.'
			})

			function addRandomEvent() {
				registerEvent(angular.copy(sampleEvents[Math.floor(Math.random() * 4)]));
				$timeout(addRandomEvent, Math.floor(Math.random() * 15 * 1000) + 3000);
			}

			$timeout(addRandomEvent, 6000);
		}

		addSampleEvents();
		function registerUpdateEvent(event) {
			event.msg.value = "Succsessfully updated item!";
		}

		function registerCreateEvent(event) {
			event.msg.value = "Successfully created item!"
		}

		function registerDeleteEvent(event) {
			event.msg.value = "Successfully removed item!"
		}

		var factory = {};
		factory.events = events;
		factory.registerEvent = function(event) {
	
			if (event.type === 'update') {
				registerUpdateEvent(event);
			} else if (event.type === 'create') {
				registerCreateEvent(event);
			} else if (event.type === 'delete') {
				registerDeleteEvent(event);
			} else {
				throw "Unknown event type. Expected update/create/delete, got: " + event.type;
			}

			registerEvent(event);
		}

		return factory;
	}) 
    .filter('crudFilter', function() {
	return function(input, type) {
		var ret = [];
		angular.forEach(input, function(field, key) {
			if (field[type]) {
				ret.push(field);
			}
		});
		return ret;
	}
	
}).factory('awesomeGridData', function() {

   var config = {
	columns : [{
	    id : "1",
	    label : 'Label 1',
  		create : {},
		read : {}, 
		update : {}
	}, {
	    id : "2",
            label : 'Label 2',
  		create : {},
		read : {}, 
		update : {}
	}, {
	    id : "3",
            label : 'Label 3',
  		create : {},
		read : {}, 
		update : {}
	}, {
	    id : "4",
            label : 'Label 4',
  		create : {},
		read : {}, 
		update : {}
	}, {
	    id : "5",
            label : 'Label 5',
  		create : {},
		read : {}, 
		update : {}
	}, {
	    id : "6",
            label : 'Label 6',
  		create : {},
		read : {}, 
		update : {}
	}]
    };

    var rows = [{
	"1" : {
	    value : "Value 1"
	}, 
	"2" : {
	    value : "Value 2"
	}, 
	"3" : {
	    value : "Value 3"
	}, 
	"4" : {
	    value : "Value 4"
	}, 
	"5" : {
	    value : "Value 5"
	}, 
	"6" : {
	    value : "Value 6"
	}
    }, {
	"1" : {
	    value : "Value 7"
	}, 
	"2" : {
	    value : "Value 8"
	}, 
	"3" : {
	    value : "Value 9"
	}, 
	"4" : {
	    value : "Value 10"
	}, 
	"5" : {
	    value : "Value 11"
	}, 
	"6" : {
	    value : "Value 12"
	}
    }, {
	"1" : {
	    value : "Value 13"
	}, 
	"2" : {
	    value : "Value 14"
	}, 
	"3" : {
	    value : "Value 15"
	}, 
	"4" : {
	    value : "Value 16"
	}, 
	"5" : {
	    value : "Value 17"
	}, 
	"6" : {
	    value : "Value 18"
	}
    }, {
	"1" : {
	    value : "Value 19"
	}, 
	"2" : {
	    value : "Value 20"
	}, 
	"3" : {
	    value : "Value 21"
	}, 
	"4" : {
	    value : "Value 22"
	}, 
	"5" : {
	    value : "Value 23"
	}, 
	"6" : {
	    value : "Value 24"
	}
    }];

	factory = {};
	factory.config = config;
	factory.rows = rows;

	return factory;
}).factory('awesomeGridConfig', ['awesomeGridData', function(data) {

	var factory = {};

	factory.getRows = function() {
	    return data.rows;
	}

	factory.getColumns = function() {
	    return data.config.columns;
	}

	factory.getValue = function(col, row) {
	    return row[col.id].value;
	}

	factory.addRow = function(row) {
		data.rows.unshift(angular.copy(row));
	}
	
	return factory;
}]).factory('awesomeGridFormFactory', function(awesomeGridConfig, awesomeGridEventFactory) {
	

	var editFormVisible, newFormVisible;
	var activeRow = {
		value : {},
		oldValue : {}
	};
	
	editFormVisible = newFormVisible = false;

	var factory = {};

	function openEditForm(row) {

		activeRow.oldValue = row;
		activeRow.value = angular.copy(row);
		editFormVisible = true;
	}

	function openNewForm() {
		newFormVisible = true;
	}

	function closeEditForm() {
		editFormVisible = false;
	}

	function closeNewForm() {
		newFormVisible = false;
	}

	factory.closeEditForm = function() {
		closeEditForm();
	}

	factory.closeNewForm = function() {
		closeNewForm();
	}

	factory.saveEditForm = function() {

		awesomeGridEventFactory.registerEvent({ 
			type : 'update',
			msg : { 
				type : 'success'
				},
			data : {
				from : angular.copy(activeRow.oldValue),
				to   : angular.cop(yactiveRow.value)
			}
		});

		for (var v in activeRow.value) {
			activeRow.oldValue[v].value = activeRow.value[v].value; 
			activeRow.value[v].value = undefined;
		}
		closeEditForm();
	}

	factory.saveNewForm = function() {

		console.log(activeRow);
		awesomeGridEventFactory.registerEvent({ 
			type : 'create',
			msg : {
				type : 'success'
				},
			data : {
				value : angular.copy(activeRow.value)
			}
		 });

		awesomeGridConfig.addRow(angular.copy(activeRow.value));
		for (var v in activeRow.value) {
			activeRow.value[v].value = undefined;
		}
		closeNewForm();
	}
	
	factory.getActiveRow = function() {
		return activeRow;
	}

	factory.isVisible = function(type) {
		if (type === 'new') {
			return newFormVisible;
		} else if (type === 'edit') {
			return editFormVisible;
		} else {
			throw "Unknown type. Expected new/edit, got: " + type;
		}
	}

	factory.showForm = function(type, row) {
		if (type === 'new') {
			openNewForm();
		} else if (type === 'edit') {
			openEditForm(row);
		} else {
			throw "Unknown type. Expected new/edit, got: " + type;
		}
	}

	factory.closeForm = function(type) {
		if (type === 'new') {
			closeNewForm();	
		} else if (type === 'edit') {
			closeEditForm();
		} else {
			throw "Unknown type. Expected new/edit, got: " + type;
		}
	}

	factory.getAnimationDelay = function(type) {
		if (type === 'new' && editFormVisible || type === 'edit' && newFormVisible) {
			 return "-webkit-animation-delay: 0.8s;" 
		}
	}

	return factory;
}).controller('awesomeGridFormCtrl', function($scope, awesomeGridFormFactory) {

	function isEditForm(type) {
		return type === 'edit';
	}

	function isNewForm(type) {
		return type === 'new';
	}	

	$scope.activeRow = awesomeGridFormFactory.getActiveRow();

	$scope.closeForm = function(type) {

		if (isNewForm(type)) {
			awesomeGridFormFactory.closeNewForm(type);
		} else if (isEditForm(type)) {
			awesomeGridFormFactory.closeEditForm(type);
		} else {
			throw "Unknown type. Expected new/edit, got: " + type;
		}
	}

	$scope.formIsVisible = function(type) {
		return awesomeGridFormFactory.isVisible(type);
	}

	$scope.getAnimationDelay = function(type) {
		return awesomeGridFormFactory.getAnimationDelay(type);
	}

	$scope.saveForm = function(type) {

		if (isNewForm(type)) {
			awesomeGridFormFactory.saveNewForm();
		} else if (isEditForm(type)) {
			awesomeGridFormFactory.saveEditForm();
		} else {
			throw "Unknown type. Expected new/edit, got: " + type;
		}
	}


}).directive('awesomeGridNewForm', function(awesomeGridConfig) {
	return {
		restrict: 'C',
		scope : true,
		templateUrl : 'templates/form-with-templates.html',
		controller: function($scope) {
				
			$scope.title = "New Form";
			$scope.type = 'create';
			var type = 'new';
			$scope.saveForm = function() {
				$scope.$parent.saveForm(type);
			}
			$scope.closeForm = function() {
				$scope.$parent.closeForm(type);
			}
		}
	};		
}).directive('awesomeGridEditForm', function(awesomeGridConfig) {
	return {
		restrict: 'C',
		scope : true,
		templateUrl : 'templates/form-with-templates.html',
		required : 'ngModel',
		controller: function($scope) {
			$scope.title =  'Edit Form';
			$scope.type = 'update';
			var type = 'edit';

			$scope.saveForm = function() {
				$scope.$parent.saveForm(type);
			}
			$scope.closeForm = function() {
				$scope.$parent.closeForm(type);
			}
		}
	};		
}).directive('awesomeGrid', function(awesomeGridConfig, awesomeGridFormFactory, $timeout) {
	return {
		restrict: 'C',
		scope : false,
		require : ['^awesomeGridConfig', '^awesomeGridForm', '^awesomeGridFormFactory'],
		templateUrl : 'templates/table-with-templates.html',

		controller : function($scope) {

			$scope.rows = awesomeGridConfig.getRows();
			$scope.columns = awesomeGridConfig.getColumns();
			$scope.getValue = function(col, row) {
	    			return awesomeGridConfig.getValue(col, row);
			}

			$scope.activeRow = awesomeGridFormFactory.getActiveRow();

			$scope.showEditForm = function(row) {
		
				var closeType = awesomeGridFormFactory.isVisible('new') ? 'new' : (awesomeGridFormFactory.isVisible('edit') ? 'edit' : undefined);		
		
				var delay = closeType ? 700 : 0;
		
				if (closeType) awesomeGridFormFactory.closeForm(closeType)
			
				$timeout(function() { awesomeGridFormFactory.showForm('edit', row); }, delay);
			}

			$scope.showNewForm = function() {
				
				var closeType = awesomeGridFormFactory.isVisible('new') ? 'new' : (awesomeGridFormFactory.isVisible('edit') ? 'edit' : undefined);		
		
				var delay = closeType ? 700 : 0;

				if (closeType) awesomeGridFormFactory.closeForm(closeType)

				$timeout(function() { awesomeGridFormFactory.showForm('new'); }, delay);
			}

			var deleted = [];
			$scope.deleteRow = function(id) {
				deleted.push($scope.rows[id]);
				$scope.rows.splice(id, 1);
			}

			function closeForm(type) {
				awesomeGridFormFactory.closeForm(type);
			}

			$scope.hasDeletedRows = function() {
				return deleted.length > 0;
			}

			$scope.undoDelete = function() {
				$scope.rows.push(deleted.pop());
			}
		}	
	}
});
