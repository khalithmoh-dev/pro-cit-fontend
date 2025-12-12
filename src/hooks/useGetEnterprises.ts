import React from "react";
import useAuthStore from "../store/authStore";

const useGetEnterprises = () => {
  const { oEnterprises } = useAuthStore();

  /** -----------------------------
   * Convert array of filters → object
   * Example:
   * [{insId: "1"}, {degId: "2"}] 
   * becomes:
   * {insId: "1", degId: "2"}
   * ----------------------------- */
  const mergeFilters = (filters) => {
    if (Array.isArray(filters)) {
      return filters.reduce((acc, obj) => ({ ...acc, ...obj }), {});
    }
    return filters || {};
  };

  /** -----------------------------
   * Generic multi-filter utility
   * Filters = { fieldName: value }
   * Ignores undefined/empty filter values
   * ----------------------------- */
  const multiFilter = (list = [], filters = {}) => {
    const merged = mergeFilters(filters);

    return list.filter((item) =>
      Object.entries(merged).every(([field, value]) => {
        if (value === undefined || value === "") return true;
        return item[field] === value;
      })
    );
  };

  /** ================================
   *  BASIC LIST GETTERS
   *  (No filters)
   * ================================ */
  const getInstitutesList = () => oEnterprises?.aInstitutes ?? [];

  /** ================================
   *  FILTERED GETTERS (Single-Filter)
   *  (Kept for backward compatibility)
   * ================================ */
  const getDegreesListByInsId = (key = "", filterBy = "insId") =>
    multiFilter(oEnterprises?.aDegrees ?? [], { [filterBy]: key });

  const getProgramsListByDegreeId = (key = "", filterBy = "degId") =>
    multiFilter(oEnterprises?.aPrograms ?? [], { [filterBy]: key });

  const getProgramsListByInsId = (key = "", filterBy = "insId") =>
    multiFilter(oEnterprises?.aPrograms ?? [], { [filterBy]: key });

  const getDepartmentListByInsId = (key = "", filterBy = "insId") =>
    multiFilter(oEnterprises?.aDepartments ?? [], { [filterBy]: key });

  const getSemesterListByInsId = (key = "", filterBy = "insId") =>
    multiFilter(oEnterprises?.aSemesters ?? [], { [filterBy]: key });

  /** ================================
   *  UNIVERSAL MULTI-FILTER GETTERS
   * ================================ */

  const getSemestersList = (filters = {}) =>
    multiFilter(oEnterprises?.aSemesters ?? [], filters);

  const getProgramsList = (filters = {}) =>
    multiFilter(oEnterprises?.aPrograms ?? [], filters);

  const getDegreesList = (filters = {}) =>
    multiFilter(oEnterprises?.aDegrees ?? [], filters);

  const getDepartmentsList = (filters = {}) =>
    multiFilter(oEnterprises?.aDepartments ?? [], filters);

  return {
    getInstitutesList,

    // legacy single-filter support
    getDegreesListByInsId,
    getProgramsListByDegreeId,
    getProgramsListByInsId,
    getDepartmentListByInsId,
    getSemesterListByInsId,

    // new multi-filter APIs
    getSemestersList,
    getProgramsList,
    getDegreesList,
    getDepartmentsList,
  };
};

export default useGetEnterprises;
