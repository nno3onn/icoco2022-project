const functions = require("firebase-functions");
const admin = require("firebase-admin");
const client = require("../../utils/initAlgolia");

const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Review/{id}")
  .onUpdate(async (change, context) => {
    try {
      const { id } = context.params;
      const data = change.after.data();

      const index = client.initIndex("review");
      index.partialUpdateObject(
        { ...data, objectID: id },
        { createIfNotExists: true }
      );

      const { type, companyId } = data;
      if (type === "중간" || !companyId) return;

      const document = firestore.doc(`Company/${companyId}`);

      const beforeReviewRate = change.before.data().reviewRate || 0;

      const updated = {
        totalReviewRate: admin.firestore.FieldValue.increment(
          data.reviewRate - beforeReviewRate
        ),
      };
      await document.update(updated);
    } catch (err) {
      console.error(err);
    }
  });
