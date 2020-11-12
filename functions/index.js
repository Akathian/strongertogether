const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.countGeneralBlogs = functions.database.ref(`/blog/general`).onWrite((change, context) => {
    const data = change.after.val();
    const count = Object.keys(data).length;
    return change.after.ref('/blog/num-general').set(count);
});

exports.countEventBlogs = functions.database.ref(`/blog/events`).onWrite((change, context) => {
    const data = change.after.val();
    const count = Object.keys(data).length;
    return change.after.ref('/blog/num-events').set(count);
});


exports.countPodcastBlogs = functions.database.ref(`/blog/podcasts`).onWrite((change, context) => {
    const data = change.after.val();
    const count = Object.keys(data).length;
    return change.after.ref('/blog/num-podcasts').set(count);
});