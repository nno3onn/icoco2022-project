const functions = require("firebase-functions");
const admin = require("firebase-admin");

const client = require("../../utils/initAlgolia");
const initAdmin = require("../../utils/initAdmin");

initAdmin();

const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Manager/{id}")
  .onUpdate(async (change, context) => {
    try {
      const { id } = context.params;
      const newData = change.after.data();
      const companyId = newData.company;

      const index = client.initIndex("manager");
      index.partialUpdateObject(
        { ...newData, objectID: id },
        { createIfNotExists: true }
      );

      const updated = {};
      const oldStatus = change.before.data().status;
      const newStatus = newData.status;

      if (oldStatus === newStatus) return;

      if (oldStatus === "파견") {
        updated.dispatchManager = admin.firestore.FieldValue.increment(-1);
      } else if (oldStatus === "휴가") {
        updated.vacationManager = admin.firestore.FieldValue.increment(-1);
      } else if (oldStatus === "파견예정") {
        updated.expectedManager = admin.firestore.FieldValue.increment(-1);
      }

      if (newStatus === "파견") {
        updated.dispatchManager = admin.firestore.FieldValue.increment(1);
      } else if (newStatus === "휴가") {
        updated.vacationManager = admin.firestore.FieldValue.increment(1);
      } else if (newStatus === "파견예정") {
        updated.expectedManager = admin.firestore.FieldValue.increment(1);
      }

      const document = firestore.doc(`Company/${companyId}`);
      await document.update(updated);
    } catch (err) {
      console.error(err);
    }
  });
