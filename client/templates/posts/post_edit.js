Template.postEdit.created = function() {
  Session.set('postEditErrors', {});
}
Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentPostId = this._id;

		var postProperties = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		}

		Meteor.call('postUpdate', currentPostId, postProperties, function(error, result) {
			// display the error to the user and abort
			if (error)
				throwError(error.reason);

			// show this result but route anyway
			if (result.postExists)
				throwError('This link has already been posted');

			Router.go('postPage', {_id: result._id});
		});
	},

	'click .delete': function(e) {
		e.preventDefault();

		if (confirm("Delete this post?")) {
			var currentPostId = this._id;
			Posts.remove(currentPostId);
			Router.go('postsList');
		}
	}
});
