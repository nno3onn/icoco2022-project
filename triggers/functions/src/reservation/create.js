const functions = require("firebase-functions");
const admin = require("firebase-admin");

const client = require("../../utils/initAlgolia");
const initAdmin = require("../../utils/initAdmin");
const { getYear, getMonth, getDate } = require("../../utils/getToday");

const firestore = admin.firestore();
initAdmin();
const year = getYear();
const month = getMonth();
const day = getDate();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Reservation/{id}")
  .onCreate(async (snap, context) => {
    try {
      const data = snap.data();
      const { id } = context.params;

      const index = client.initIndex("reservation");
      index.saveObject({
        ...data,
        objectID: id,
      });

      const companyId = data.chosenCompany;

      const document = firestore.doc(`Company/${companyId}`);
      const doc = await document.get();

      const { staticsReservation, thisMonthReservation } = doc.data();
      staticsReservation[year][month - 1] += 1;
      thisMonthReservation[day - 1] += 1;

      const updated = {
        totalReservation: admin.firestore.FieldValue.increment(1),
        todayReservation: admin.firestore.FieldValue.increment(1),
        unReadReservation: admin.firestore.FieldValue.increment(1),
        staticsReservation,
        thisMonthReservation,
      };

      await document.update(updated);
    } catch (err) {
      console.error(err);
    }
  });
