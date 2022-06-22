const functions = require("firebase-functions");
const admin = require("firebase-admin");
const client = require("../../utils/initAlgolia");

const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Review/{id}")
  .onCreate(async (snap, context) => {
    try {
      const data = snap.data();
      const { id } = context.params;

      const index = client.initIndex("review");
      index.saveObject({
        ...data,
        objectID: id,
      });

      const { type, companyId } = data;
      if (type === "중간" || !companyId) return;

      const document = firestore.doc(`Company/${companyId}`);

      const updated = {
        totalReview: admin.firestore.FieldValue.increment(1),
        totalReviewRate: admin.firestore.FieldValue.increment(
          data.reviewRate || 0
        ),
      };
      await document.update(updated);
    } catch (err) {
      console.error(err);
    }
  });
