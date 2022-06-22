const checkObjectFull = (value) => {
  if (!value) {
    return false;
  }

  let ck = true;
  Object.values(value).forEach((v) => {
    v.forEach((e) => {
      if (!e) ck = false;
    });
  });
  return ck;
};

export default checkObjectFull;
