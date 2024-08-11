const convertToOriginalFormat = (isoDate) => {
  const date = new Date(isoDate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};
export default convertToOriginalFormat;
// Example usage:
//   const originalDate = convertToOriginalFormat('2026-07-11');
//   console.log(originalDate); // Output: July 11, 2026
