App = Ember.Application.create();

App.Router.map(function() {
  this.route("files", { path: "/files/" });
  this.route("i", { path: "/i/:i_id" });
});
