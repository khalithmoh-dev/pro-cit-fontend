import { useState } from "react";
import COConfig from "./co-config";
import CoAttainment from "./co-attainment";
import style from "./attainment.module.css";

const tabs = ["CO Config", "CO Attainment", "PO Attainment"];

const Attainment: React.FC = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const tabClickHandler = (tab: string) => {
        setActiveTab(tab);
    };


    const renderTabComponent = (): React.ReactNode => {
        switch (activeTab) {
            case "CO Config": return <COConfig />;
            case "CO Attainment": return <CoAttainment />;
            default: return <COConfig />;
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

export default Attainment;