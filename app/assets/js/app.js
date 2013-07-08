App = Ember.Application.create();

App.Router.map(function() {
  this.route("i", { path: "/i/:i_id" });
});

App.IRoute = Ember.Route.extend({
  model: function(params) {
    return Ember.Object.create({
      id: params.i_id,
      path: '/img/' + params.i_id + '.gif'
    });
  },
  setupController: function (controller, model) {
    model.set('path', '/img/' + model.get('id')  + '.gif');
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
    file = Ember.Object.create(file);
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
