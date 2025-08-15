export const generateYearRanges = (startYear: number, endYear: number) => {
    const yearRanges = [];
  
    for (let i = startYear; i > endYear; i--) {
      yearRanges.push({label: `${i} - ${i - 1}`});
    }
  
    return yearRanges;
}

export const generateYearRangeOptions = (startYear: number, endYear: number) => {
    const yearRanges = [];
  
    for (let i = startYear; i > endYear; i--) {
      yearRanges.push({label: `${i} - ${i - 1}`, value: `${i} - ${i - 1}`});
    }
  
    return yearRanges;
}