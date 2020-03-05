import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const stripe = require('stripe')(functions.config().stripe.testkey);

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  return admin.firestore().doc(`/users/${userRecord.uid}`).set({
    email: userRecord.email
  }).then((result) => {
      return stripe.customers.create({ email: userRecord.email })
        .then((customer: any) => {
          return admin.firestore().doc(`/users/${userRecord.uid}`).update({
            customerId: customer.id
          }).catch(console.error)
        }).catch(console.error);
    }).catch(console.error);
});

exports.addPaymentToCustomer = functions.firestore.document('users/{userUid}/payments/{paymentUid}')
  .onCreate((snapshot, context) => {
  const userRef = snapshot.ref.parent.parent;
  if (userRef) {
    return userRef.get()
      .then((document) => {
        // @ts-ignore
        const {customerId} = document.data();
        return stripe.paymentMethods.attach(context.params.paymentUid, { customer: customerId })
          .catch(console.error);
      }).catch(console.error)
  }
  return null
});

exports.createSubscription = functions.https.onCall((data, context) => {
  if ( !context.auth ) {
    return { err: 'Permission denied!' }
  } else {
    return admin.firestore().doc(`users/${context.auth.uid}`).get()
      .then((snapshot) => {
        // @ts-ignore
        const {customerId} = snapshot.data();
        return stripe.subscriptions.create({
          customer: customerId,
          default_payment_method: data.defaultPaymentId,
          items: [{
            plan: 'prod_GqqLWjEHdHQdhr'
          }]
        }).then((subscription: any) => subscription).catch(console.error);
      }).catch(console.error);
  }
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
