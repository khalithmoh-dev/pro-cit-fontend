import React, { useContext, createContext, useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
interface LayoutContextI {
    routeNm: string;
    setRouteNm: (route: string) => void;
    actionFields: React.ReactElement[];
    setActionFields: (actions: React.ReactElement[]) => void;
}

const LayoutContext = createContext<LayoutContextI | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { routeInfo } = useAuthStore();
    const [routeNm, setRouterNm] = useState("Dashboard");
    const [actionFields, setActionFields] = useState<React.ReactElement[]>([]);
    const setRouteNm = (routePath: string) => {

        // Clear action fields first
        setActionFields([]);

        if (routeInfo[routePath]) {
            setRouterNm(routeInfo[routePath].name);
        }
    }

    return (
        <LayoutContext.Provider value={{ routeNm, setRouteNm, actionFields, setActionFields }}>
            {children}
        </LayoutContext.Provider>
    );
};
