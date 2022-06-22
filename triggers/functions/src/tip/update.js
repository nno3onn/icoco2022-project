const functions = require("firebase-functions");
const client = require("../../utils/initAlgolia");

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Tip/{id}")
  .onUpdate(async (change, context) => {
    try {
      const { id } = context.params;
      const data = change.after.data();

      const index = client.initIndex("tip");
      index.partialUpdateObject(
        { ...data, objectID: id },
        { createIfNotExists: true }
      );
    } catch (err) {
      console.error(err);
    }
  });
