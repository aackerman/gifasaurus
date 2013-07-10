App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return App.File.findAll();
  }
});

App.ApplicationController = Ember.ArrayController.extend({
  uploadFile: function(file) {
    this.get('model').pushObject(App.File.create(file));
  }
});

App.File = Ember.Model.extend({
  id: Ember.attr(),
  filepath: Ember.attr()
});

App.File.url = '/files';
App.File.adapter = Ember.RESTAdapter.create({
  find: function(record, id) {
    return $.getJSON('/files/' + id)
     .then(function(data){
      this.set('model', data.file);
     }.bind(this));
  },
  findAll: function(klass, records) {
    return $.getJSON('/files')
     .then(function(data){
      records.load(klass, data.files);
     }.bind(this));
  }
});

App.Router.map(function() {
  this.route("i", { path: "/i/:i_id" });
});

App.IRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find(params.i_id);
  },
  setupController: function (controller, model) {
    controller.set("model", model);
  }
});

App.ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var c = this.get('controller');

    // TODO handle this in the controller
    Dropzone.options.dropload = {
      maxFilesize: 2,
      createImageThumbnails: false
    };
    var dz = new Dropzone("#dropload", { url: "/upload" });
    dz.on('addedfile', function(f){
      $('#dropload').addClass('circlize');
    });
    dz.on('complete', function(f){
      $('#dropload').removeClass('circlize');
      var response = JSON.parse(f.xhr.response);
      c.send('uploadFile', response);
    }.bind(this));
  }
});
