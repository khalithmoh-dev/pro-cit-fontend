function isIncorrectEmail(emailAdress: string) {
  // Checking email address
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
  if (emailAdress.match(regex)) {
    return false;
  }
  // if(emailAdress.startsWith("https://") || emailAdress.startsWith("http://"))return false;
  else return true;
}
function isIncorrectUrl(emailAdress: string) {
  // if(emailAdress.startsWith("https://") || emailAdress.startsWith("http://"))return false;
  const regex =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
  if (regex.test(emailAdress)) return false;
  else return true;
}
function containsOnlyLettersWithSingleSpace(input: string): boolean {
  // Regular expression to match only letters with a single space between words, or an empty string
  const letterAndSingleSpaceRegex = /^[A-Za-z]+( [A-Za-z]+)*$|^$/;
  return letterAndSingleSpaceRegex.test(input);
}
function containsOnlyLettersAndNumbers(input: string): boolean {
  // Regular expression to match only letters and numbers, no spaces allowed
  const letterAndNumberRegex = /^[A-Za-z0-9]*$/;
  return letterAndNumberRegex.test(input);
}

export { isIncorrectUrl, isIncorrectEmail, containsOnlyLettersWithSingleSpace, containsOnlyLettersAndNumbers };
