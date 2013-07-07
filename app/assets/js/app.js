App = Ember.Application.create();

App.Router.map(function() {
  this.route("i", { path: "/i/:img" });
});

App.IRoute = Ember.Route.extend({
  model: function(params) {
    return {
      path: '/img/' + params.img + '.gif'
    };
  }
});

App.IController = Ember.ObjectController.extend({});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return [];
  }
});

App.IndexController = Ember.ObjectController.extend({
  uploadFile: function(file) {
    this.get('model').pushObject(file);
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
    var dz = new Dropzone("#dropload", { url: "/upload"});
    dz.on('addedfile', function(f){
      $('#dropload').addClass('circlize');
    });
    dz.on('complete', function(f){
      $('#dropload').removeClass('circlize');
      var response = JSON.parse(f.xhr.response);
      c.send('uploadFile', response.file);
    }.bind(this));
  }
});
