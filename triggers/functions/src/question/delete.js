const functions = require("firebase-functions");
const client = require("../../utils/initAlgolia");

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Question/{id}")
  .onDelete(async (snap, context) => {
    try {
      const { id } = context.params;

      const index = client.initIndex("question");
      index.deleteObject(id);
    } catch (err) {
      console.error(err);
    }
  });
