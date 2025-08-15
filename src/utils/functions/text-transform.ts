function capitalizeText(text: string): string {
  const words: string[] = text.split(' ');

  const capitalizedWords: string[] = words.map((word: string) => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });

  return capitalizedWords.join(' ');
}
export { capitalizeText };
