const functions = require("firebase-functions");
const admin = require("firebase-admin");

const client = require("../../utils/initAlgolia");
const initAdmin = require("../../utils/initAdmin");
const dateFormat = require("../../utils/getYYYYMMDD");

const year = new Date().getFullYear();
const month = new Date().getMonth();
const today = dateFormat();

initAdmin();

const firestore = admin.firestore();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Reservation/{id}")
  .onDelete(async (snap, context) => {
    try {
      const { id } = context.params;

      const index = client.initIndex("reservation");
      index.deleteObject(id);

      const { date, chosenCompany, managersId } = snap.data();

      const document = firestore.doc(`Company/${chosenCompany}`);

      const doc = await document.get();

      const companyData = doc.data();
      const { staticsReservation, thisMonthReservation } = companyData;

      const dateYear = new Date(date).getFullYear();
      const dateMonth = new Date(date).getMonth();
      const dateDay = new Date(date).getDate();

      const updated = {
        totalReservation: admin.firestore.FieldValue.increment(-1),
      };

      staticsReservation[dateYear][dateMonth - 1]--;
      updated.staticsReservation = staticsReservation;

      if (dateYear === year && dateMonth === month) {
        thisMonthReservation[dateDay - 1]--;
        updated.thisMonthReservation = thisMonthReservation;
      }
      if (date === today) {
        updated.todayReservation = admin.firestore.FieldValue.increment(-1);
      }

      await updateDoc(ref, updated);

      // 매니저들의 파견기간=null
      managersId.forEach(async (id) => {
        const managerDocument = firstore.doc(`Manager/${id}`);
        await managerDocument.update({
          dispatchStartDate: null,
          dispatchEndDate: null,
          reservationNumber: null,
        });
      });
    } catch (err) {
      console.error(err);
    }
  });
