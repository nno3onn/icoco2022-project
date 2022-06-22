const verifyFileSize = (file) => {
  if (!file) return;

  const maxSize = 1024 * 1024 * 2;

  return file.size < maxSize;
};

export default verifyFileSize;
