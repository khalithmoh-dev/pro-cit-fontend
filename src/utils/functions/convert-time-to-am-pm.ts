const convertToAmPm = (time24: string): string => {
  // Split the input string by ":"
  const [hourStr, minute] = time24.split(':');

  // Convert hour to number
  let hour = parseInt(hourStr);

  // Determine AM or PM
  const period = hour >= 12 ? 'PM' : 'AM';

  // Convert hour to 12-hour format
  hour = hour % 12 || 12;

  // Format the time as 12-hour format with leading zero for minutes if needed
  return `${hour}:${minute} ${period}`;
};

export default convertToAmPm;
