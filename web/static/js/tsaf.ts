/// <reference path="angular.d.ts" />
/// <reference path="angular-route.d.ts" />

var tsafApp = angular.module('tsafApp', [
	'ngRoute',
	'tsafControllers',
]);

tsafApp.config(['$routeProvider', '$locationProvider', function($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.
		when('/', {
			templateUrl: 'partials/dashboard.html',
			controller: 'DashboardCtrl',
		}).
		when('/items', {
			templateUrl: 'partials/items.html',
			controller: 'ItemsCtrl',
		}).
		when('/expr', {
			templateUrl: 'partials/expr.html',
			controller: 'ExprCtrl',
		}).
		otherwise({
			redirectTo: '/',
		});
}]);

var tsafControllers = angular.module('tsafControllers', []);

/* For reference only: not hydrating yet.
class Alert {
	Name: string;
	Crit: string;
	Warn: string;
	Vars: {[key: string]: string};
}

class Schedule {
	Alerts: Alert[];
	Freq: number;
	Status: {[key: string]: Status};
}

class HistoryEvent {
	Status: string;
	Time: string;
}

class Status {
	Expr: string;
	Emailed: boolean;
	Group: {[key: string]: string};
	History: HistoryEvent[];
	Touched: string;

	Last() {
		return this.History[this.History.length-1];
	}
}
*/

interface IDashboardScope extends ng.IScope {
	schedule: any;
	last: (history: any[]) => any;
}

tsafControllers.controller('DashboardCtrl', ['$scope', '$http', function($scope: IDashboardScope, $http: ng.IHttpService) {
	$http.get('/api/alerts').success(data => {
		$scope.schedule = data;
	});
	$scope.last = (history: any[]) => {
		return history[history.length-1];
	}
}]);

interface IItemsScope extends ng.IScope {
	metrics: string[];
	hosts: string[];
	status: string;
}

tsafControllers.controller('ItemsCtrl', ['$scope', '$http', function($scope: IItemsScope, $http: ng.IHttpService){
	$http.get('/api/metric')
		.success(function (data: string[]) {
			$scope.metrics = data;
		})
		.error(function (error) {
			$scope.status = 'Unable to fetch metrics: ' + error;
		});
	$http.get('/api/tagv/host')
		.success(function (data: string[]) {
			$scope.hosts = data;
		})
		.error(function (error) {
			$scope.status = 'Unable to fetch hosts: ' + error;
		});
}]);

interface IExprScope extends ng.IScope {
	expr: string;
	eval: () => void;
	error: string;
	running: string;
	result: any;
	json: (v: any) => string;
}

tsafControllers.controller('ExprCtrl', ['$scope', '$http', function($scope: IExprScope, $http: ng.IHttpService){
	$scope.expr = 'avg(q("avg:os.cpu{host=*}", "5m"))';
	$scope.eval = () => {
		$scope.error = '';
		$scope.running = $scope.expr;
		$scope.result = {};
		$http.get('/api/expr?q=' + encodeURIComponent($scope.expr))
			.success((data) => {
				$scope.result = data;
				$scope.running = '';
			})
			.error((error) => {
				$scope.error = error;
				$scope.running = '';
			});
	};
	$scope.json = (v: any) => {
		return JSON.stringify(v, null, '  ');
	};
}]);