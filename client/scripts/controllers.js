angular.module('archanaApp.controllers', []);

angular.module('archanaApp.controllers')
  .controller('HomeCtrl', function ($scope, $window) {
    $scope.$root.appTitle = "Archana - Devotional Hub";

    $scope.$root.sideMenu = [
      {'title': 'Dashboard', 'iconFaCls': 'dashboard', 'sref': 'dashboard'},
      {'title': 'Gods', 'iconFaCls': 'compass', 'sref': 'gods.list'},
      {'title': 'Artists', 'iconFaCls': 'male', 'sref': 'artists.list'},
      {'title': 'Albums', 'iconFaCls': 'headphones', 'sref': 'albums.list'},
      {'title': 'Tracks', 'iconFaCls': 'music', 'sref': 'tracks'},
      {'title': 'Languages', 'iconFaCls': 'edit', 'sref': 'languages.list'}
    ];
    $scope.$root.sideMenuSelected = $scope.$root.sideMenu[0];

    $scope.stateMatches = function (state) {
      var currState = $scope.$root.$state.current.name.split('.')[0];
      var stateStart = state.split('.')[0];

      return (currState === stateStart);
    };

    $scope.$root.currLanguage = {};
    $scope.$root.currGod = {};
    $scope.$root.currArtist = {};
    $scope.$root.currAlbum = {};

  })
  .controller('TestCtrl', function ($scope, $state, TestObj, Upload) {
    $scope.tests = [{'id': '11', 'name': 'hareesh'},
      {'id': '13', 'name': 'karthik'},
      {'id': '14', 'name': 'sunil'},
      {'id': '12', 'name': 'chendil'}];

    $scope.test = $scope.tests[0];

    $scope.language = "telugu";

    $scope.gotoTest = function (obj) {
      $scope.test = obj;
      $state.go('test.detail')
    };
    $scope.edit = function () {
      $state.go('test.edit', {id: $scope.test.id});
    };
    $scope.newTest = function () {
      $scope.test = new TestObj();
      $state.go('test.new');
    }

    $scope.addTest = function () { //POST to /api/<objects>
      $scope.test.$save(function () {
        $alert('created', '', 'success');
      });
    };

  })
  .controller('GodsCtrl', function ($scope, $stateParams, $state, $alert, Gods, GodsT) {
    $scope.gods = [];

    $scope.gods = Gods.query(); //GET all /api/<objects>

    $scope.god = {};
    $scope.god_t = [];

    $scope.deleteGod = function () { //DELETE to /api/<objects>/:id
      async.waterfall([
        function (callback) { //delete God object
          var objectId = $scope.god.objectId;
          $scope.god.$delete(function () {
            callback(null, objectId);// deleted
          });
        }, function (godId, callback) {
          //now delete all Local Texts
          async.each($scope.god_t, function (obj, callback) {
            obj.$delete(function () {
              callback();
            });
          }, function (err) {//after loop
            if (!err)
              callback(null, godId);//texts deleted
          });
        }
      ], function (err, godId) {
        var idx = _.findIndex($scope.gods, function (god) {
          return god.objectId == godId;
        });
        if (idx >= 0)
          $scope.gods.splice(idx, 1);
        $scope.god_t = [];
        $alert('deleted', '', 'success');
        $state.go('gods.list');
      });
    };

    $scope.updateGod = function () { //PUT to /api/<objects>/:id
      async.waterfall([
        function (callback) { //update God
          $scope.god.$update(function (god) {
            callback(null, god);
          });
        }, function (god, callback) {
          async.each($scope.god_t, function (obj, callback) {
            //now save texts
            obj.godId = god.objectId;
            obj.save(function (resObj) {
              resObj.languageId = $scope.$root.getLangById(resObj.languageId);
              callback();//iterate to next
            });
          }, function (err) {
            if (!err)
              callback(null, god);//texts saved
          });
        }
      ], function (err, god) { //finally
        if (!err) {
          var destGod = _.find($scope.gods, function (godI) {
            return godI.objectId == god.objectId;
          });
          if (_.isObject(destGod)) {
            _.extend(destGod, god);
          }
          $alert('saved', '', 'success'); //saved
        }
      });
    };

    $scope.addGod = function () { //POST to /api/<objects>
      async.waterfall([function (callback) {
        //save God object
        $scope.god.$save(function (god) {
          //done saving God object, now save God Local Texts
          callback(null, god);
        })
      }, function (god, callback) {
        //time to save God Local Texts
        async.each($scope.god_t, function (obj, callback) {
          obj.godId = god.objectId;
          obj.save(function () {
            callback();//iterate to next
          });
        }, function (err) {
          if (!err)
            callback(null, god);//texts saved
        });
      }], function (err, god) {//finally saved
        $scope.gods.push(god);
        $state.go('gods.edit', {id: god.objectId});
        $alert('created', '', 'success');
      });
    };

    $scope.loadGod = function (id) { //GET to /api/<objects>/:id
      $scope.god = {};
      $scope.god_t = [];

      $scope.$root.defaultLoading.show();
      async.waterfall([function (callback) {
        Gods.get({id: id}, function (god) {
          callback(null, god);
        });
      }, function (god, callback) {
        GodsT.query({godId: god.objectId}, function (gods_t) {
          async.each(gods_t, function (obj, callback) {
            obj.languageId = $scope.$root.getLangById(obj.languageId);
            callback();
          }, function (err) {
            callback(null, god, gods_t);
          });
        });
      }], function (err, god, gods_t) {
        if (!err) {
          $scope.god = god;
          $scope.god_t = gods_t;
        }
        $scope.$root.defaultLoading.hide();
      });
    };

    $scope.initGod = function () {
      $scope.god = new Gods();
      $scope.god_t = [];
    };

    $scope.newGod = function () {
      $scope.initGod();
      $state.go('gods.new');
    };

    $scope.removeGodT = function (idx) {
      var obj = $scope.god_t[idx];
      if (angular.isDefined(obj.objectId))
        obj.$delete(function () {
          $alert('deleted', '', 'success');
        });
      $scope.god_t.splice(idx, 1);
    };

    $scope.newGodT = function () {
      var godT = new GodsT();
      godT.godId = $scope.god.objectId;
      $scope.god_t.push(godT);
    };

  })
  .controller('ArtistsCtrl', function ($scope, $stateParams, $state, $alert, Artists, ArtistsT) {
    $scope.artists = [];

    $scope.artists = Artists.query(); //GET all /api/<objects>

    $scope.artist = {};
    $scope.artist_t = [];

    $scope.deleteArtist = function () { //DELETE to /api/<objects>/:id
      async.waterfall([
        function (callback) { //delete Artist object
          var objectId = $scope.artist.objectId;
          $scope.artist.$delete(function () {
            callback(null, objectId);// deleted
          });
        }, function (artistId, callback) {
          //now delete all Local Texts
          async.each($scope.artist_t, function (obj, callback) {
            obj.$delete(function () {
              callback();
            });
          }, function (err) {//after loop
            if (!err)
              callback(null, artistId);//texts deleted
          });
        }
      ], function (err, artistId) {
        var idx = _.findIndex($scope.artists, function (artist) {
          return artist.objectId == artistId;
        });
        if (idx >= 0)
          $scope.artists.splice(idx, 1);
        $scope.artist_t = [];
        $alert('deleted', '', 'success');
        $state.go('artists.list');
      });
    };

    $scope.updateArtist = function () { //PUT to /api/<objects>/:id
      async.waterfall([
        function (callback) { //update God
          $scope.artist.$update(function (artist) {
            callback(null, artist);
          });
        }, function (artist, callback) {
          async.each($scope.artist_t, function (obj, callback) {
            //now save texts
            obj.artistId = artist.objectId;
            obj.save(function (resObj) {
              resObj.languageId = $scope.$root.getLangById(resObj.languageId);
              callback();//iterate to next
            });
          }, function (err) {
            if (!err)
              callback(null, artist);//texts saved
          });
        }
      ], function (err, artist) { //finally
        if (!err) {
          var destArtist = _.find($scope.artists, function (artistI) {
            return artistI.objectId == artist.objectId;
          });
          if (_.isObject(destArtist)) {
            _.extend(destArtist, artist);
          }
          $alert('saved', '', 'success'); //saved
        }
      });
    };

    $scope.addArtist = function () { //POST to /api/<objects>
      async.waterfall([function (callback) {
        //save Artist object
        $scope.artist.$save(function (artist) {
          //done saving Artist object, now save Artist Local Texts
          callback(null, artist);
        })
      }, function (artist, callback) {
        //time to save Artist Local Texts
        async.each($scope.artist_t, function (obj, callback) {
          obj.artistId = artist.objectId;
          obj.save(function () {
            callback();//iterate to next
          });
        }, function (err) {
          if (!err)
            callback(null, artist);//texts saved
        });
      }], function (err, artist) {//finally saved
        $scope.artists.push(artist);
        $state.go('artists.edit', {id: artist.objectId});
        $alert('created', '', 'success');
      });
    };

    $scope.loadArtist = function (id) { //GET to /api/<objects>/:id
      $scope.artist = {};
      $scope.artist_t = [];

      $scope.$root.defaultLoading.show();
      async.waterfall([function (callback) {
        Artists.get({id: id}, function (artist) {
          callback(null, artist);
        });
      }, function (artist, callback) {
        ArtistsT.query({artistId: artist.objectId}, function (artists_t) {
          async.each(artists_t, function (obj, callback) {
            obj.languageId = $scope.$root.getLangById(obj.languageId);
            callback();
          }, function (err) {
            callback(null, artist, artists_t);
          });
        });
      }], function (err, artist, artists_t) {
        if (!err) {
          $scope.artist = artist;
          $scope.artist_t = artists_t;
        }
        $scope.$root.defaultLoading.hide();
      });
    };

    $scope.initArtist = function () {
      $scope.artist = new Artists();
      $scope.artist_t = [];
    };

    $scope.newArtist = function () {
      $scope.initArtist();
      $state.go('artists.new');
    };

    $scope.removeArtistT = function (idx) {
      var obj = $scope.artist_t[idx];
      if (angular.isDefined(obj.objectId))
        obj.$delete(function () {
          $alert('deleted', '', 'success');
        });
      $scope.artist_t.splice(idx, 1);
    };

    $scope.newArtistT = function () {
      var artistT = new ArtistsT();
      artistT.artistId = $scope.artist.objectId;
      $scope.artist_t.push(artistT);
    };
  })
  .controller('AlbumsCtrl', function ($scope, $stateParams, $state, $alert, Albums, AlbumsT) {
    $scope.albums = [];

    $scope.albums = Albums.query(); //GET all /api/<objects>

    $scope.album = {};
    $scope.album_t = [];

    $scope.deleteAlbum = function () { //DELETE to /api/<objects>/:id
      async.waterfall([
        function (callback) { //delete Album object
          var objectId = $scope.album.objectId;
          $scope.album.$delete(function () {
            callback(null, objectId);// deleted
          });
        }, function (albumId, callback) {
          //now delete all Local Texts
          async.each($scope.album_t, function (obj, callback) {
            obj.$delete(function () {
              callback();
            });
          }, function (err) {//after loop
            if (!err)
              callback(null, albumId);//texts deleted
          });
        }
      ], function (err, albumId) {
        var idx = _.findIndex($scope.albums, function (album) {
          return album.objectId == albumId;
        });
        if (idx >= 0)
          $scope.albums.splice(idx, 1);
        $scope.album_t = [];
        $alert('deleted', '', 'success');
        $state.go('albums.list');
      });
    };

    $scope.updateAlbum = function () { //PUT to /api/<objects>/:id
      async.waterfall([
        function (callback) { //update God
          $scope.album.$update(function (album) {
            callback(null, album);
          });
        }, function (album, callback) {
          async.each($scope.album_t, function (obj, callback) {
            //now save texts
            obj.albumId = album.objectId;
            obj.save(function (resObj) {
              resObj.languageId = $scope.$root.getLangById(resObj.languageId);
              callback();//iterate to next
            });
          }, function (err) {
            if (!err)
              callback(null, album);//texts saved
          });
        }
      ], function (err, album) { //finally
        if (!err) {
          var destAlbum = _.find($scope.albums, function (albumI) {
            return albumI.objectId == album.objectId;
          });
          if (_.isObject(destAlbum)) {
            _.extend(destAlbum, album);
          }
          $alert('saved', '', 'success'); //saved
        }
      });
    };

    $scope.addAlbum = function () { //POST to /api/<objects>
      async.waterfall([function (callback) {
        //save Album object
        $scope.album.$save(function (album) {
          //done saving Album object, now save Album Local Texts
          callback(null, album);
        })
      }, function (album, callback) {
        //time to save Album Local Texts
        async.each($scope.album_t, function (obj, callback) {
          obj.albumId = album.objectId;
          obj.save(function () {
            callback();//iterate to next
          });
        }, function (err) {
          if (!err)
            callback(null, album);//texts saved
        });
      }], function (err, album) {//finally saved
        $scope.albums.push(album);
        $state.go('albums.edit', {id: album.objectId});
        $alert('created', '', 'success');
      });
    };

    $scope.loadAlbum = function (id) { //GET to /api/<objects>/:id
      $scope.album = {};
      $scope.album_t = [];

      $scope.$root.defaultLoading.show();
      async.waterfall([function (callback) {
        Albums.get({id: id}, function (album) {
          callback(null, album);
        });
      }, function (album, callback) {
        AlbumsT.query({albumId: album.objectId}, function (albums_t) {
          async.each(albums_t, function (obj, callback) {
            obj.languageId = $scope.$root.getLangById(obj.languageId);
            callback();
          }, function (err) {
            callback(null, album, albums_t);
          });
        });
      }], function (err, album, albums_t) {
        if (!err) {
          $scope.album = album;
          $scope.album_t = albums_t;
        }
        $scope.$root.defaultLoading.hide();
      });
    };

    $scope.initAlbum = function () {
      $scope.album = new Albums();
      $scope.album_t = [];
    };

    $scope.newAlbum = function () {
      $scope.initAlbum();
      $state.go('albums.new');
    };

    $scope.removeAlbumT = function (idx) {
      var obj = $scope.album_t[idx];
      if (angular.isDefined(obj.objectId))
        obj.$delete(function () {
          $alert('deleted', '', 'success');
        });
      $scope.album_t.splice(idx, 1);
    };

    $scope.newAlbumT = function () {
      var albumT = new AlbumsT();
      albumT.albumId = $scope.album.objectId;
      $scope.album_t.push(albumT);
    };
  })
  .controller('LanguagesCtrl', function ($scope, Languages, $stateParams, $state, $alert) {

    $scope.$root.languages = Languages.query(); //GET all /api/<objects>

    $scope.language = {};

    $scope.deleteLanguage = function () { //DELETE to /api/<objects>/:id
      var objectId = $scope.language.objectId;
      $scope.language.$delete(function () {
        var idx = _.findIndex($scope.$root.languages, function (language) {
          return language.objectId == objectId;
        });
        if (idx >= 0)
          $scope.$root.languages.splice(idx, 1);
        $alert('deleted', '', 'success');
        $state.go('languages.list');
      });
    };

    $scope.updateLanguage = function () { //PUT to /api/<objects>/:id
      $scope.language.$update(function () {
        var destLanguage = _.find($scope.$root.languages, function (language) {
          return language.objectId == $scope.language.objectId;
        });
        if (_.isObject(destLanguage)) {
          _.extend(destLanguage, $scope.language);
        }
        //$alert(content, title, alertType, placement)
        $alert('saved', '', 'success');
        //$state.go('languages.list');
      });
    };

    $scope.addLanguage = function () { //POST to /api/<objects>
      $scope.language.$save(function () {
        $scope.$root.languages.push($scope.language);
        $state.go('languages.edit', {id: $scope.language.objectId});
        $alert('created', '', 'success');
      });
    };

    $scope.loadLanguage = function (id) { //GET to /api/<objects>/:id
      var language = Languages.get({id: id}, function () {
        $scope.language = language;
      });
    };

    $scope.initLanguage = function () {
      $scope.language = new Languages();
    };

    $scope.newLanguage = function () {
      $scope.initLanguage();
      $state.go('languages.new');
    }
  });