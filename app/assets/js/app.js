App = Ember.Application.create();

App.Router.map(function() {
  this.route("i", { path: "/i/:img" });
});

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
    Dropzone.options.dropload = {
      paramName: "gifasaurus-upload",
      maxFilesize: 2,
      createImageThumbnails: false
    };
    var dz = new Dropzone("#dropload", { url: "/upload"});
    dz.on('complete', function(f){
      console.log(f.xhr.response);
    });
  }
});
