const functions = require("firebase-functions");
const admin = require("firebase-admin");

const client = require("../../utils/initAlgolia");
const initAdmin = require("../../utils/initAdmin");
const checkDuplication = require("../../utils/duplicate");
const { getYear, getMonth } = require("../../utils/getToday");

initAdmin();

const firestore = admin.firestore();
const year = getYear();
const month = getMonth();

module.exports = functions
  .region("asia-northeast3")
  .firestore.document("Reservation/{id}")
  .onUpdate(async (change, context) => {
    try {
      const { id } = context.params;
      const oldStatus = change.before.data().status;
      const newData = change.after.data();

      const index = client.initIndex("reservation");
      index.partialUpdateObject(
        { ...newData, objectID: id },
        { createIfNotExists: true }
      );

      const {
        status,
        totalCost,
        chosenCompany,
        serviceStartDate,
        serviceEndDate,
        managersId,
        reservationRoute,
        userName,
        phone,
      } = newData;
      if (
        status === "서비스종료" &&
        oldStatus !== status &&
        oldStatus !== "서비스취소"
      ) {
        const document = firestore.doc(`Company/${chosenCompany}`);
        const doc = await document.get();

        const { staticsSales } = doc.data();

        if (reservationRoute === "전화") {
          const check = await checkDuplication({ userName, phone });
          if (!check) {
            staticsSales[year].totalYear += totalCost;
            staticsSales[year].totalMonthly[month - 1] += totalCost;
            const companyUpdated = {
              todaySales: admin.firestore.FieldValue.increment(totalCost),
            };
            companyUpdated.staticsSales = staticsSales;

            await document.update(companyUpdated);
          }
        }
      }

      // 매니저 파견기간 변경
      const managerUpdated = {
        dispatchStartDate: serviceStartDate,
        dispatchEndDate: serviceEndDate,
      };

      managersId.forEach(
        async (id) =>
          await firestore.doc(`Manager/${id}`).update(managerUpdated)
      );
    } catch (err) {
      console.error(err);
    }
  });
