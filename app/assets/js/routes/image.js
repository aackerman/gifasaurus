App.IRoute = Ember.Route.extend({
  model: function(params) {
    return App.File.find(params.i_id);
  },
  setupController: function (controller, model) {
    controller.set("model", model);
  }
});
