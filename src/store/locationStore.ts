import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

// Campus Interfaces
export interface CreateCampusPayload {
    campusNm: string;
    parentCampus?: string;
    desc?: string;
    _id?: string;
}

interface CampusIF {
    _id: string;
    campusNm: string;
    parentCampus?: string;
    parentCampusNm?: string;
    desc?: string;
}

// Facility Interfaces
export interface CreateFacilityPayload {
    campusId: string;
    facilityNm: string;
    desc?: string;
    _id?: string;
}

interface FacilityIF {
    _id: string;
    campusId: string;
    facilityNm: string;
    campusNm?: string;
    desc?: string;
}

// Location Interfaces
export interface CreateLocationPayload {
    campusId: string;
    facilityId: string;
    locationNm: string;
    capacity?: number;
    locationType?: string;
    desc?: string;
    _id?: string;
}

interface LocationIF {
    _id: string;
    campusId: string;
    facilityId: string;
    locationNm: string;
    capacity?: number;
    locationType?: string;
    campusNm?: string;
    facilityNm?: string;
    desc?: string;
}

interface LocationState {
    // Campus
    campusList: CampusIF[];
    createCampus: (payload: CreateCampusPayload) => Promise<{ success: boolean; error?: string }>;
    getCampusById: (id: string) => Promise<CampusIF | boolean>;
    getCampuses: () => Promise<{ data: CampusIF[] } | boolean>;
    getCampusesByCampusId: (campusId: string) => Promise<{ data: CampusIF[] } | boolean>;
    updateCampus: (payload: CreateCampusPayload) => Promise<{ success: boolean; error?: string }>;

    // Facility
    facilityList: FacilityIF[];
    createFacility: (payload: CreateFacilityPayload) => Promise<{ success: boolean; error?: string }>;
    getFacilityById: (id: string) => Promise<FacilityIF | boolean>;
    getFacilities: () => Promise<{ data: FacilityIF[] } | boolean>;
    getFacilitiesByCampusId: (campusId: string) => Promise<{ data: FacilityIF[] } | boolean>;
    updateFacility: (payload: CreateFacilityPayload) => Promise<{ success: boolean; error?: string }>;

    // Location
    locationList: LocationIF[];
    createLocation: (payload: CreateLocationPayload) => Promise<{ success: boolean; error?: string }>;
    getLocationById: (id: string) => Promise<LocationIF | boolean>;
    getLocations: () => Promise<{ data: LocationIF[] } | boolean>;
    getLocationsByFacilityId: (facilityId: string) => Promise<{ data: LocationIF[] } | boolean>;
    updateLocation: (payload: CreateLocationPayload) => Promise<{ success: boolean; error?: string }>;
}

// Location Store to handle Campus, Facility, and Location CRUD operations
const useLocationStore = create<LocationState>((set, get) => ({
    // Campus State & Actions
    campusList: [],

    createCampus: async (oPayload) => {
        try {
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/campus/create`, oPayload);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.message || error?.message || 'Failed to create campus'
            };
        }
    },

    getCampusById: async (id = '') => {
        try {
            return (await httpRequest('GET', `${import.meta.env.VITE_API_URL}/campus/get-by-id/${id}`))?.data;
        } catch {
            return false;
        }
    },

    getCampuses: async () => {
        try {
            const aCampusList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/campus/get-all-campuses`);
            return aCampusList?.data;
        } catch {
            return false;
        }
    },

    getCampusesByCampusId: async (campusId = '') => {
        try {
            const aCampusList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/campus/get-by-campus-id/${campusId}`);
            return aCampusList?.data;
        } catch {
            return false;
        }
    },

    updateCampus: async (oPayload) => {
        try {
            const id = oPayload._id;
            delete oPayload._id;
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/campus/update/${id}`, oPayload);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.message || error?.message || 'Failed to update campus'
            };
        }
    },

    // Facility State & Actions
    facilityList: [],

    createFacility: async (oPayload) => {
        try {
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/facility/create`, oPayload);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.message || error?.message || 'Failed to create facility'
            };
        }
    },

    getFacilityById: async (id = '') => {
        try {
            return (await httpRequest('GET', `${import.meta.env.VITE_API_URL}/facility/get-by-id/${id}`))?.data;
        } catch {
            return false;
        }
    },

    getFacilities: async () => {
        try {
            const aFacilityList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/facility/get-all-facilities`);
            return aFacilityList?.data;
        } catch {
            return false;
        }
    },

    getFacilitiesByCampusId: async (campusId = '') => {
        try {
            const aFacilityList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/facility/get-by-campus-id/${campusId}`);
            return aFacilityList?.data;
        } catch {
            return false;
        }
    },

    updateFacility: async (oPayload) => {
        try {
            const id = oPayload._id;
            delete oPayload._id;
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/facility/update/${id}`, oPayload);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.message || error?.message || 'Failed to update facility'
            };
        }
    },

    // Location State & Actions
    locationList: [],

    createLocation: async (oPayload) => {
        try {
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/location/create`, oPayload);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.message || error?.message || 'Failed to create location'
            };
        }
    },

    getLocationById: async (id = '') => {
        try {
            return (await httpRequest('GET', `${import.meta.env.VITE_API_URL}/location/get-by-id/${id}`))?.data;
        } catch {
            return false;
        }
    },

    getLocations: async () => {
        try {
            const aLocationList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/location/get-all-locations`);
            return aLocationList?.data;
        } catch {
            return false;
        }
    },

    getLocationsByFacilityId: async (facilityId = '') => {
        try {
            const aLocationList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/location/get-by-facility-id/${facilityId}`);
            return aLocationList?.data;
        } catch {
            return false;
        }
    },

    updateLocation: async (oPayload) => {
        try {
            const id = oPayload._id;
            delete oPayload._id;
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/location/update/${id}`, oPayload);
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.response?.data?.message || error?.message || 'Failed to update location'
            };
        }
    }
}));

export default useLocationStore;
