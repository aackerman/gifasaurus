
App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find();
  }
});

App.FRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find();
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
    return $.ajax({
      type: 'post',
      url: '/files',
      processData: false,
      contentType: false,
      cache: false,
      data: fd
    })
    .then(function(data){
      Ember.run(function() {
        record.load(data.file.id, data.file);
        record.didCreateRecord();
      });
    }.bind(this));
  },
  find: function(record, id) {
    return $.getJSON('/files/' + id)
     .then(function(data){
      Ember.run(function() {
        record.load(id, data.file);
      });
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
  this.route("f", { path: "/f/" });
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
