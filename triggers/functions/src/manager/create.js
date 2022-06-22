const functions = require("firebase-functions");
const admin = require("firebase-admin");

const initAdmin = require("../../utils/initAdmin");
const client = require("../../utils/initAlgolia");

initAdmin();

const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Manager/{id}")
  .onCreate(async (snap, context) => {
    try {
      const data = snap.data();
      const { id } = context.params;

      const index = client.initIndex("manager");
      index.saveObject({
        ...data,
        objectID: id,
      });

      const companyId = data.company;
      const updated = { totalManager: admin.firestore.FieldValue.increment(1) };

      const document = firestore.doc(`Company/${companyId}`);
      await document.update(updated);
    } catch (err) {
      console.error(err);
    }
  });
