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

exports.updateStudentsTotal = functions.firestore.document('users/{userUid}/groups/{groupUid}/students/{studentUid}')
  .onWrite((snapshot, context) => {
    const studentRef = snapshot.after.ref;
    const studentCollection = studentRef.parent;
    if (studentRef.parent.parent) {
      const groupRef = studentRef.parent.parent;
      return studentCollection.listDocuments().then((documents) =>
        groupRef.update({students: documents.length})
      ).catch(console.error);
    }
    return null;
});

exports.updateActivitiesTotal = functions.firestore.document('users/{userUid}/groups/{groupUid}/activities/{activityUid}')
  .onWrite((snapshot, context) => {
    const activityRef = snapshot.after.ref;
    const activitiesCollection = activityRef.parent;
    if (activityRef.parent.parent) {
      const groupRef = activityRef.parent.parent;
      return activitiesCollection.listDocuments().then((documents) =>
        groupRef.update({activities: documents.length})
      ).catch(console.error);
    }
    return null;
  });
