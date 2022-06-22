const admin = require("firebase-admin");

module.exports = checkDuplication = async ({ userName, phone }) => {
  try {
    const docs = await admin
      .firestore()
      .collection("Reservation")
      .where("phone", "==", phone)
      .where("userName", "==", userName)
      .where("status", "!=", "서비스종료")
      .get();

    return docs.size >= 2;
  } catch (err) {
    console.error(err);
  }
};
