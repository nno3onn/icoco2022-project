const functions = require("firebase-functions");
const client = require("../utils/initAlgolia");

module.exports = functions.firestore
  .document("Company/{id}")
  .onWrite((change, context) => {
    try {
      // const { after, before } = change;
      // const afterData = after.data();
      // const beforeData = before.data();
      // if (after.exists) afterData.objectID = context.params.id;
      // console.log(context.params.id);
      // const index = client.initIndex("company");
      // index.saveObject({
      //   ...data,
      //   objectID: id,
      // });
    } catch (err) {
      console.error(err);
    }
  });
