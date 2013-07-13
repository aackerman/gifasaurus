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
  click: function() {
    $('.js-upload-input').click();
  },
  didInsertElement: function() {
    $('.js-upload-input').on('change', function(e){
      e.stopPropagation();
      e.preventDefault();
      var files = [].slice.call(e.dataTransfer && e.dataTransfer.files || e.target.files);
      this.uploadFiles(files);
    }.bind(this));
  }
});
