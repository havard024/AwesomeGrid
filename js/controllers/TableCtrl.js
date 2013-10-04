var TableCtrl = function($scope) {

    var columns = [{
	label : 'Label 1',
	value : 'Value 1'
    }, {
	label : 'Label 2',
	value : 'Value 2'
    }, {
	label : 'Label 3',
	value : 'Value 3'
    }, {
	label : 'Label 4',
	value : 'Value 4'
    }, {
	label : 'Label 5',
	value : 'Value 5'
    }, {
	label : 'Label 6',
	value : 'Value 6'
    }];

    $scope.columns = columns;
}

TableCtrl.$inject = ['$scope'];
