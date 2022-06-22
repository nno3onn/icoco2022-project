const today = new Date();

export const getYear = () => today.getFullYear();
export const getMonth = () => today.getMonth() + 1; // 1~12
export const getDate = () => today.getDate();
