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
  createRecord: function(record) {
    var fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('size', file.size);
    $.post('/files')
  },
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

Droppable = Ember.Namespace.create();

Droppable.cancel = function(event) {
    event.preventDefault();
    return false;
};

Droppable.Drop = Ember.Mixin.create({
    dragEnter: Droppable.cancel,
    dragOver: Droppable.cancel,
    drop: function(e) {
      e.preventDefault();
      (e.dataTransfer.files || e.target.files).map(App.File.createRecord);
    }
});

App.UploadView = Ember.View.extend(Droppable.Drop);
