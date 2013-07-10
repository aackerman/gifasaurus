
App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return App.File.findAll();
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
    fd.append('file', record.file, record.file.name);
    fd.append('size', record.file.size);
    $.ajax({
      type: 'post',
      url: '/files',
      processData: false,
      contentType: false,
      cache: false,
      data: fd
    })
    .then(function(response){
      record.load(response.file);
    }.bind(this));
  },
  find: function(record, id) {
    return $.getJSON('/files/' + id)
     .then(function(data){
      record.load(data.file);
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
      var files = [].slice.call(e.dataTransfer.files || e.target.files);
      App.File.create({ file: files[0] }).save();
    }
});

App.UploadView = Ember.View.extend(Droppable.Drop);
