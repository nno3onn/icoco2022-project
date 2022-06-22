const today = new Date();

exports.getYear = () => today.getFullYear();
exports.getMonth = () => today.getMonth() + 1; // 1~12
exports.getDate = () => today.getDate();
