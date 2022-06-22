const functions = require("firebase-functions");
const admin = require("firebase-admin");

const initAdmin = require("../../utils/initAdmin");
const client = require("../../utils/initAlgolia");

initAdmin();

const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Manager/{id}")
  .onDelete(async (snap, context) => {
    try {
      const { id } = context.params;
      const index = client.initIndex("manager");
      index.deleteObject(id);

      const { status, company } = snap.data();

      const updated = {
        totalManager: admin.firestore.FieldValue.increment(-1),
      };
      if (status === "파견") {
        updated.dispatchManager = admin.firestore.FieldValue.increment(-1);
      } else if (status === "휴가") {
        updated.vacationManager = admin.firestore.FieldValue.increment(-1);
      }

      const document = firestore.doc(`Company/${company}`);
      await document.update(updated);
    } catch (err) {
      console.error(err);
    }
  });
