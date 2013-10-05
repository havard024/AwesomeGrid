angular.module('App', []) 
    .factory('awesomeGridConfig', function() {

    var config = {
	columns : [{
	    id : "1",
	    label : 'Label 1'
	}, {
	    id : "2",
            label : 'Label 2',
	}, {
	    id : "3",
            label : 'Label 3',
	}, {
	    id : "4",
            label : 'Label 4',
	}, {
	    id : "5",
            label : 'Label 5',
	}, {
	    id : "6",
            label : 'Label 6',
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

	var factory = {};

	factory.getRows = function() {
	    return rows;
	}

	factory.getColumns = function() {
	    return config.columns;
	}

	factory.getValue = function(col, row) {
	    return row[col.id].value;
	}
	
	return factory;
    })
    .controller('TableCtrl', function($scope, awesomeGridConfig) {

	$scope.rows = awesomeGridConfig.getRows();
	$scope.columns = awesomeGridConfig.getColumns();
	$scope.getValue = function(col, row) {
	    return awesomeGridConfig.getValue(col, row);
	}

	var backup;

	$scope.remove = function(id) {
	    $scope.rows.splice(id, 1);
	}

	$scope.update = function(row) {
	    backup = angular.copy(row);
	}

	$scope.save = function(row) {
	    
	}

	$scope.undo = function(row) {
	    for (var v in backup) {
		row[v] = backup[v]
	    }
//	    row = angular.copy(backup);
	}

	$scope.reset = function(copy) {
	    for (var v in copy) {
		copy[v] = {}
	    }
	}

	$scope.add = function(copy) {
	    var row = angular.copy(copy);
	    $scope.rows.unshift(row);
	    $scope.reset(copy);
	}
}).directive('awesomeGridInline', function(awesomeGridConfig, $http, $templateCache) {
	return {
		restrict: 'C',
		scope : false,
		require : ['^awesomeGridConfig'],
	templateUrl : 'templates/table.html',

		controller : function($scope) {

	$scope.rows = awesomeGridConfig.getRows();
	$scope.columns = awesomeGridConfig.getColumns();
	$scope.getValue = function(col, row) {
	    return awesomeGridConfig.getValue(col, row);
	}

	var backup;

	$scope.remove = function(id) {
	    $scope.rows.splice(id, 1);
	}

	$scope.update = function(row) {
	    backup = angular.copy(row);
	}

	$scope.save = function(row) {
	    
	}

	$scope.undo = function(row) {
	    for (var v in backup) {
		row[v] = backup[v]
	    }
//	    row = angular.copy(backup);
	}

	$scope.reset = function(copy) {
	    for (var v in copy) {
		copy[v] = {}
	    }
	}

	$scope.add = function(copy) {
	    var row = angular.copy(copy);
	    $scope.rows.unshift(row);
	    $scope.reset(copy);
	}

	}	
}}).directive('awesomeGrid', function(awesomeGridConfig, $http, $templateCache) {
	return {
		restrict: 'C',
		scope : false,
		require : ['^awesomeGridConfig'],
	templateUrl : 'templates/table.html',

		controller : function($scope) {

	$scope.rows = awesomeGridConfig.getRows();
	$scope.columns = awesomeGridConfig.getColumns();
	$scope.getValue = function(col, row) {
	    return awesomeGridConfig.getValue(col, row);
	}

	var backup;

	$scope.remove = function(id) {
	    $scope.rows.splice(id, 1);
	}

	$scope.update = function(row) {
	    backup = angular.copy(row);
	}

	$scope.save = function(row) {
	    
	}

	$scope.undo = function(row) {
	    for (var v in backup) {
		row[v] = backup[v]
	    }
//	    row = angular.copy(backup);
	}

	$scope.reset = function(copy) {
	    for (var v in copy) {
		copy[v] = {}
	    }
	}

	$scope.add = function(copy) {
	    var row = angular.copy(copy);
	    $scope.rows.unshift(row);
	    $scope.reset(copy);
	}

	}	
}});;
