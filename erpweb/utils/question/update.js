import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const updateAnswer = async ({ questionId, answer, date }) => {
  try {
    if (!questionId) return console.error('no company id');

    if (!answer) return console.error('no answer');

    const updated = {
      answer,
      answerDate: date,
      isAnswered: true,
    };

    const db = getFirestore();
    const docRef = doc(db, 'Question', questionId);
    await updateDoc(docRef, updated);
  } catch (err) {
    console.error(err);
  }
};

export default updateAnswer;
