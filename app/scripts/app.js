'use strict';

angular.module('cellautoApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'navbar': {
                        templateUrl : 'views/navbar.html'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'IndexController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }

            })

            // route for Conway's Game of Life
            .state('app.conway', {
                url: 'conway',
                views: {
                    'content@': {
                        templateUrl : 'views/conway.html',
                        controller  : 'ConwayController'
                    }
                }
            })

            // route for Neighbourhoods
            .state('app.neighbourhoods', {
                url: 'neighbourhoods',
                views: {
                    'content@': {
                        templateUrl : 'views/neighbourhoods.html',
                        controller  : 'NeighbourhoodsController'
                    }
                }
            })

            ;

        $urlRouterProvider.otherwise('/');
    })
;
