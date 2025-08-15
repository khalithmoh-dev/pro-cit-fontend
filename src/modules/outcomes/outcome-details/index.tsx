import { useEffect, useState } from "react";
import style from "./outcome-details.module.css";
import useOutcomeStore from "../../../store/outcomeStore";
import { useQuery } from "../../../hooks";
import PODetails from "./PO-details";
import PEODetails from "./PEO-details";

const tabs = ["PO & PSO", "PEO"];

const OutcomeDetails: React.FC = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const { getPO, getPEO } = useOutcomeStore();
    const query = useQuery();

    const tabClickHandler = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (query && query.get("department_id")) {
            const departmentId = query.get("department_id") as string;
            const endYear = new Date().getFullYear();
            const startYear = endYear - 1;
            getPO(departmentId, startYear, endYear);
            getPEO(departmentId);
        }
    }, [getPEO, getPO, query]);

    const renderTabComponent = (): React.ReactNode => {
        switch (activeTab) {
            case "PO & PSO": return <PODetails />;
            case "PEO": return <PEODetails />;
            default: return <PODetails />;
        }
    }

    return (
        <div className={style.container}>
            <div className={style.tabContainer}>
                {tabs.map((tab: string, index: number) => (
                    <div
                        key={index}
                        onClick={() => tabClickHandler(tab)}
                        className={`${style.tabName} ${activeTab === tab ? style.activeTabName : ""}`}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            {renderTabComponent()}
        </div>
    );
};

export default OutcomeDetails;