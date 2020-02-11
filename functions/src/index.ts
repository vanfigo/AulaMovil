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
