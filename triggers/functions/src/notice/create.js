const functions = require("firebase-functions");
const client = require("../../utils/initAlgolia");

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Notice/{id}")
  .onCreate(async (snap, context) => {
    try {
      const { id } = context.params;
      const data = snap.data();

      const index = client.initIndex("notice");
      index.saveObject({
        ...data,
        objectID: id,
      });
    } catch (err) {
      console.error(err);
    }
  });
