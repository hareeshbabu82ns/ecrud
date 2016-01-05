//http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/
var app = angular.module('archanaApp', [
  'ngSanitize', 'ngAnimate', 'ngQuantum', 'ngQuantum.pageable', 'ui.router',
  'ngFileUpload',
  'archanaApp.services', 'archanaApp.controllers', 'archanaApp.directives']);

app.run(
  ['$rootScope', '$state', '$stateParams', 'Languages', '$loading',
    function ($rootScope, $state, $stateParams, Languages, $loading) {

      pramukhIME.addLanguage(PramukhIndic);

      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.languages = [];
      $rootScope.languages = Languages.query();

      $rootScope.getLangById = function (id) {
        return _.find($rootScope.languages, function (obj) {
          if (obj.objectId === id)
            return obj;
        });
      };

      $rootScope.defaultLoading = new $loading('User Task Running...', 'info');
    }
  ]
);
app.config(function ($stateProvider, $urlRouterProvider, $loadingProvider) {
  var loaderDefaults = {
    timeout: 5000,
    //delayHide: 1150,
    theme: 'info',
    showBar: false
  };
  angular.extend($loadingProvider.defaults, loaderDefaults);

  $urlRouterProvider.otherwise("/");
  $stateProvider.state('home', { // state for showing all entries
    url: '/',
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  }).state('test', {
    abstract: true,
    url: '/test',
    templateUrl: 'partials/list_content_template.html',
    controller: 'TestCtrl'
  }).state('test.list', {
    url: '',
    views: {
      "list": {templateUrl: "partials/test/list.html"},
      "content": {templateUrl: "partials/test/empty.html"}
    },
    //controller: 'TestCtrl'
  }).state('test.new', {
    url: '/new',
    views: {
      "list": {templateUrl: "partials/test/list.html"},
      "content": {templateUrl: "partials/test/new.html"}
    }
  }).state('test.detail', {
    url: '/{id}',
    views: {
      "list": {templateUrl: "partials/test/list.html"},
      "content": {templateUrl: "partials/test/detail.html"}
    }
  }).state('test.edit', {
    url: '/:id/edit',
    views: {
      "list": {templateUrl: "partials/test/list.html"},
      "content": {templateUrl: "partials/test/edit.html"}
    }
  })
    //Gods
    .state('gods', {
      abstract: true,
      url: '/gods',
      templateUrl: 'partials/list_content_template.html',
      controller: 'GodsCtrl'
    }).state('gods.list', {
      url: '',
      views: {
        "list": {templateUrl: "partials/gods/list.html"},
        "content": {templateUrl: "partials/gods/empty.html"}
      },
    }).state('gods.new', {
      url: '/new',
      views: {
        "list": {templateUrl: "partials/gods/list.html"},
        "content": {
          templateUrl: "partials/gods/new.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.initGod();
            }]
        }
      }
    }).state('gods.detail', {
      url: '/{id}',
      views: {
        "list": {templateUrl: "partials/gods/list.html"},
        "content": {
          templateUrl: "partials/gods/detail.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadGod($stateParams.id);
            }]
        }
      }
    }).state('gods.edit', {
      url: '/:id/edit',
      views: {
        "list": {templateUrl: "partials/gods/list.html"},
        "content": {
          templateUrl: "partials/gods/edit.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadGod($stateParams.id);
            }]
        }
      }
    })//Artists
    .state('artists', {
      abstract: true,
      url: '/artists',
      templateUrl: 'partials/list_content_template.html',
      controller: 'ArtistsCtrl'
    }).state('artists.list', {
      url: '',
      views: {
        "list": {templateUrl: "partials/artists/list.html"},
        "content": {templateUrl: "partials/artists/empty.html"}
      },
    }).state('artists.new', {
      url: '/new',
      views: {
        "list": {templateUrl: "partials/artists/list.html"},
        "content": {
          templateUrl: "partials/artists/new.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.initArtist();
            }]
        }
      }
    }).state('artists.detail', {
      url: '/{id}',
      views: {
        "list": {templateUrl: "partials/artists/list.html"},
        "content": {
          templateUrl: "partials/artists/detail.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadArtist($stateParams.id);
            }]
        }
      }
    }).state('artists.edit', {
      url: '/:id/edit',
      views: {
        "list": {templateUrl: "partials/artists/list.html"},
        "content": {
          templateUrl: "partials/artists/edit.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadArtist($stateParams.id);
            }]
        }
      }
    })//Albums
    .state('albums', {
      abstract: true,
      url: '/albums',
      templateUrl: 'partials/list_content_template.html',
      controller: 'AlbumsCtrl'
    }).state('albums.list', {
      url: '',
      views: {
        "list": {templateUrl: "partials/albums/list.html"},
        "content": {templateUrl: "partials/albums/empty.html"}
      },
    }).state('albums.new', {
      url: '/new',
      views: {
        "list": {templateUrl: "partials/albums/list.html"},
        "content": {
          templateUrl: "partials/albums/new.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.initAlbum();
            }]
        }
      }
    }).state('albums.detail', {
      url: '/{id}',
      views: {
        "list": {templateUrl: "partials/albums/list.html"},
        "content": {
          templateUrl: "partials/albums/detail.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadAlbum($stateParams.id);
            }]
        }
      }
    }).state('albums.edit', {
      url: '/:id/edit',
      views: {
        "list": {templateUrl: "partials/albums/list.html"},
        "content": {
          templateUrl: "partials/albums/edit.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadAlbum($stateParams.id);
            }]
        }
      }
    })//Languages
    .state('languages', {
      abstract: true,
      url: '/languages',
      templateUrl: 'partials/list_content_template.html',
      controller: 'LanguagesCtrl'
    }).state('languages.list', {
      url: '',
      views: {
        "list": {templateUrl: "partials/langs/list.html"},
        "content": {templateUrl: "partials/langs/empty.html"}
      },
    }).state('languages.new', {
      url: '/new',
      views: {
        "list": {templateUrl: "partials/langs/list.html"},
        "content": {
          templateUrl: "partials/langs/new.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.initLanguage();
            }]
        }
      }
    }).state('languages.detail', {
      url: '/{id}',
      views: {
        "list": {templateUrl: "partials/langs/list.html"},
        "content": {
          templateUrl: "partials/langs/detail.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadLanguage($stateParams.id);
            }]
        }
      }
    }).state('languages.edit', {
      url: '/:id/edit',
      views: {
        "list": {templateUrl: "partials/langs/list.html"},
        "content": {
          templateUrl: "partials/langs/edit.html",
          controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
              $scope.loadLanguage($stateParams.id);
            }]
        }
      }
    });
})
  .run(function ($state) {
    $state.go('languages.list'); //make a transition to gods state when app starts
  });
