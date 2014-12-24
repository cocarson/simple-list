// dummy content using anti:fake package
Meteor.startup(function() {
	Posts.remove({});
	if (Posts.find().count() == 0) {
		for (var i = 0; i < 7; i++) {
			Posts.insert({
				title: Fake.sentence(6),
				body: Fake.paragraph(3)
			});
		}
	}
});

// publish posts 
Meteor.publish('posts', function(limit) {
	//Meteor._sleepForMs(2000);
	return Posts.find({}, {limit: limit});
});