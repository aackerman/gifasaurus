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
