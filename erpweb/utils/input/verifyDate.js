const date = /^(20)\d{2}.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[0-1])$/;

const verifyDate = (value) => date.test(value);

export default verifyDate;
