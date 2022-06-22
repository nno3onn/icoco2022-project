const functions = require("firebase-functions");
const admin = require("firebase-admin");

const initAdmin = require("../utils/initAdmin");
const dateFormat = require("../utils/getYYYYMMDD");
const getDays = require("../utils/getDays");
const { getYear, getMonth, getDate } = require("../utils/getToday");

initAdmin();
const firestore = admin.firestore();

const today = dateFormat();
const year = getYear();
const month = getMonth();
const day = getDate();
const days = getDays(year, month);

const changeCompanies = async () => {
  const updated = { todayReservation: 0, todaySales: 0 };

  const docs = await firestore.collection("Company").get();
  if (!docs) throw "no company docs";

  docs.forEach(async (doc) => {
    const { staticsReservation, staticsSales } = doc.data();

    if (day === 1) {
      updated.thisMonthReservation = new Array(days).fill(0);
      if (month === 1) {
        updated.staticsReservation = staticsReservation;
        updated.staticsReservation[year] = new Array(12).fill(0);

        updated.staticsSales = staticsSales;
        updated.staticsSales[year] = {
          totalMonthly: new Array(12).fill(0),
          totalYear: 0,
        };
      }
    }
    await firestore.doc(`Company/${doc.id}`).update(updated);
  });
};

const changeStatus = async () => {
  /** reservation, manager status 값 변경 - 예약의 파견기간에 따라
   *
   */
  const now = new Date();
  const yesterday = dateFormat(now.setDate(now.getDate() - 1));

  const docs = await firestore.collection("Reservation").get();

  docs.forEach(async (doc) => {
    const { serviceStartDate, serviceEndDate, managersId } = doc.data();

    if (serviceEndDate === yesterday) {
      await firestore
        .doc(`Reservation/${doc.id}`)
        .update({ status: "서비스종료", userStep: 8 });

      managersId.forEach(async (id) => {
        await firestore.doc(`Manager/${id}`).update({
          status: "대기",
          dispatchStartDate: null,
          dispatchEndDate: null,
        });
      });
    } else if (serviceStartDate === today) {
      await firestore
        .doc(`Reservation/${doc.id}`)
        .update({ status: "파견중", userStep: 7 });
      managersId.forEach(async (id) => {
        await firestore.doc(`Manager/${id}`).update({ status: "파견" });
      });
    }
  });

  //   /** manager status 값 변경 - 관리자가 따로 관리사의 파견기간을 설정한 경우
  //    *
  //    */

  const managers = await firestore.collection("Manager").get();

  managers.forEach(async ({ id }) => {
    const doc = await firestore.doc(`Manager/${id}`).get();

    const { dispatchEndDate } = doc.data();
    if (dispatchEndDate === yesterday) {
      await firestore.doc(`Manager/${id}`).update({
        status: "대기",
        dispatchStartDate: null,
        dispatchEndDate: null,
      });
    }
  });
};

const changeEventStatus = async () => {
  const docs = await firestore.collection("Event").get();

  docs.forEach(async (doc) => {
    const { endDate } = doc.data();

    if (endDate) {
      const endNextDay = new Date(
        new Date(endDate).setDate(new Date(endDate).getDate() + 1)
      );

      if (endNextDay === today) {
        const updated = { status: "종료" };
        await firestore.doc(`Event/${doc.id}`).update(updated);
      }
    }
  });
};

module.exports = functions
  .region("asia-northeast3")
  .pubsub.schedule("every day 00:00")
  .onRun(async () => {
    try {
      await Promise.all([
        changeCompanies(),
        changeStatus(),
        changeEventStatus(),
      ]);
    } catch (err) {
      console.error(err);
    }
  });
