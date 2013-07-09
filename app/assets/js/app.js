App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  renderTemplate: function() {
    console.log('called ApplicationRoute');
    this.render();
    this.render('sidebar', {
      outlet: 'sidebar',
      into: 'application'
    });
  }
});

App.File = Ember.Model.extend({
  id: Ember.attr(),
  filepath: Ember.attr()
});

App.File.url = '/files';
App.File.adapter = Ember.RESTAdapter.create({
  findAll: function(klass, records) {
    $.getJSON('/files')
     .then(function(data){
      records.load(klass, data.files);
    });
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

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return [];
  }
});

App.IndexController = Ember.ArrayController.extend({
  uploadFile: function(file) {
    this.get('model').pushObject(App.File.create(file));
  }
});

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
    var c = this.get('controller');
    Dropzone.options.dropload = {
      paramName: "gifasaurus-upload",
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
