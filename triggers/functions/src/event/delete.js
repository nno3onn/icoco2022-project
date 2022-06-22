const functions = require("firebase-functions");
const client = require("../../utils/initAlgolia");

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Event/{id}")
  .onDelete(async (snap, context) => {
    try {
      const { id } = context.params;

      const index = client.initIndex("event");
      index.deleteObject(id);
    } catch (err) {
      console.error(err);
    }
  });
