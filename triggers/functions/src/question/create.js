const functions = require("firebase-functions");
const admin = require("firebase-admin");

const client = require("../../utils/initAlgolia");
const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Question/{id}")
  .onCreate(async (snap, context) => {
    try {
      const data = snap.data();
      const { id } = context.params;

      const index = client.initIndex("question");
      index.saveObject({
        ...data,
        objectID: id,
      });

      const { companyId } = data;

      const document = firestore.doc(`Company/${companyId}`);
      await document.update({
        unReadQuestion: admin.firestore.FieldValue.increment(1),
      });
    } catch (err) {
      console.error(err);
    }
  });
