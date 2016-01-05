var services = angular.module('archanaApp.services', ['ngResource']);

services.factory('TestObj', function ($resource) {
  return $resource('/api/tests/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  })
}).factory('Gods', function ($resource) {
  var res = $resource('/api/gods/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  });
  res.prototype.save = function (done) {
    if (angular.isObject(this.languageId))
      this.languageId = this.languageId.objectId;
    if (angular.isDefined(this.objectId))
      return this.$update(done);
    else
      return this.$save(done);
  };
  return res;
}).factory('GodsT', function ($resource) {
  var res = $resource('/api/gods_t/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  });
  res.prototype.save = function (done) {
    if (angular.isObject(this.languageId))
      this.languageId = this.languageId.objectId;
    if (angular.isDefined(this.objectId))
      return this.$update(done);
    else
      return this.$save(done);
  };
  return res;
}).factory('Artists', function ($resource) {
  var res = $resource('/api/artists/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  });
  res.prototype.save = function (done) {
    if (angular.isObject(this.languageId))
      this.languageId = this.languageId.objectId;
    if (angular.isDefined(this.objectId))
      return this.$update(done);
    else
      return this.$save(done);
  };
  return res;
}).factory('ArtistsT', function ($resource) {
  var res = $resource('/api/artists_t/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  });
  res.prototype.save = function (done) {
    if (angular.isObject(this.languageId))
      this.languageId = this.languageId.objectId;
    if (angular.isDefined(this.objectId))
      return this.$update(done);
    else
      return this.$save(done);
  };
  return res;
}).factory('Albums', function ($resource) {
  var res = $resource('/api/albums/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  });
  res.prototype.save = function (done) {
    if (angular.isObject(this.languageId))
      this.languageId = this.languageId.objectId;
    if (angular.isDefined(this.objectId))
      return this.$update(done);
    else
      return this.$save(done);
  };
  return res;
}).factory('AlbumsT', function ($resource) {
  var res = $resource('/api/albums_t/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  });
  res.prototype.save = function (done) {
    if (angular.isObject(this.languageId))
      this.languageId = this.languageId.objectId;
    if (angular.isDefined(this.objectId))
      return this.$update(done);
    else
      return this.$save(done);
  };
  return res;
}).factory('Languages', function ($resource) {
  return $resource('/api/languages/:id', {id: '@objectId'}, {
    query: {method: 'GET', isArray: true},
    show: {method: 'GET'},
    create: {method: 'POST'},
    update: {method: 'PUT'}
  })
});