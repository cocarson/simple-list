Template.posts.created = function() {

    // 1. Initialization
  
    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(5);
    instance.ready = new ReactiveVar(false);
  
    // will re-run when the "limit" reactive variables changes
    this.autorun(function() {
  	    // get the limit
  	    var limit = instance.limit.get();

  	    console.log("Asking for "+limit+" posts…")

        // subscribe to the posts publication
        var subscription = Meteor.subscribe('posts', limit);

        // if saubscription is ready, set limit to newLimit
        if (subscription.ready()) {
        	console.log("> Received "+limit+" posts. \n\n")
        	instance.loaded.set(limit);
        	instance.ready.set(true);
        } else {
        	instance.ready.set(false);
        	console.log("> Subscription is not ready yet. \n\n");
        }
	});

    instance.posts = function() { 
    	return Posts.find({}, {limit: instance.loaded.get()});
	}
};	

Template.posts.events({
	'click .load-more': function(event, instance) {
		event.preventDefault();

		var limit = instance.limit.get();

		limit += 5;
		instance.limit.set(limit);
	}
});

Template.posts.helpers({
    // the posts cursor
    posts: function () {
    	return Template.instance().posts();
    },
    // the subscription handle
    isReady: function () {
    	return Template.instance().ready.get();
    },
    // are there more posts to show?
    hasMorePosts: function () {
    	return Template.instance().posts().count() >= Template.instance().limit.get();
    }
});