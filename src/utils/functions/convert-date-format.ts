const convertDateFormat = (date: string) => {
  const convertedDate = new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
  return convertedDate;
};
export default convertDateFormat;
