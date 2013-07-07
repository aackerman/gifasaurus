App = Ember.Application.create();

App.Router.map(function() {
  this.route("i", { path: "/i/:img" });
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return [];
  }
});

App.ApplicationController = Ember.ObjectController.extend({
  uploadFile: function(file) {
    this.get('model').pushObject(file);
  }
});

App.ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var c = this.get('controller');
    Dropzone.options.dropload = {
      paramName: "gifasaurus-upload",
      maxFilesize: 2,
      createImageThumbnails: false
    };
    var dz = new Dropzone("#dropload", { url: "/upload"});
    dz.on('complete', function(f){
      var response = JSON.parse(f.xhr.response);
      c.send('uploadFile', response.file);
    }.bind(this));
  }
});
