export const getCurrentAcademicYear = () => {
    const endYear = new Date().getFullYear();
    const startYear = endYear - 1;

    return { endYear, startYear };
}

