import calcDate from 'utils/time/calcDate';

const getExpectedManagerList = async (list, setter) => {
  try {
    if (!setter) return;

    const filtered = list.filter((el) => {
      const day = calcDate(el.dispatchStartDate);
      return el.status === '파견예정' && el.dispatchStartDate && day <= 3;
    });

    filtered.sort((a, b) => {
      const prev = calcDate(a.dispatchStartDate);
      const next = calcDate(b.dispatchStartDate);
      return prev - next;
    });

    setter(filtered);
  } catch (err) {
    console.error(err);
  }
};

export default getExpectedManagerList;
