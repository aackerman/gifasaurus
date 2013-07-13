
App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find();
  }
});

App.FilesRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find();
  }
});

App.Router.map(function() {
  this.route("files", { path: "/files/" });
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

Droppable = Ember.Namespace.create();

Droppable.cancel = function(event) {
    event.preventDefault();
    return false;
};

Droppable.Drop = Ember.Mixin.create({
    dragEnter: Droppable.cancel,
    dragOver: Droppable.cancel,
    uploadFiles: function(files) {
      App.File.create({ file: files[0] }).save();
    },
    drop: function(e) {
      e.preventDefault();
      var files = [].slice.call(e.dataTransfer.files || e.target.files);
      this.uploadFiles(files);
    }
});

App.UploadView = Ember.View.extend(Droppable.Drop, {
  templateName: 'upload-view',
  didInsertElement: function() {
    $('.js-upload-input').trigger('click');
    $('.js-upload-input').on('change', function(e){
      var files = [].slice.call(e.dataTransfer.files || e.target.files);
      this.uploadFiles(e);
    }.bind(this));
  }
});
