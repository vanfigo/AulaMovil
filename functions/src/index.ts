import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  return admin.firestore().doc(`/users/${userRecord.uid}`).set({
    displayName: userRecord.displayName,
    email: userRecord.email,
    photoURL: userRecord.photoURL
  });
});
