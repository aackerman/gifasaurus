App.ApplicationRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find();
  }
});
