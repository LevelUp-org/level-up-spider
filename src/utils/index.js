function removeLinebreak(str) {
  if (!str) return '';
  let temp = replaceAll(str, '\n', '');
  temp = replaceAll(temp, '\r', '');
  return replaceAll(temp, '\t', '');
}

function replaceAll(str, s1, s2) {
  return str.replace(new RegExp(s1, "gm"), s2);
}

module.exports = {
  removeLinebreak,
  replaceAll,
};