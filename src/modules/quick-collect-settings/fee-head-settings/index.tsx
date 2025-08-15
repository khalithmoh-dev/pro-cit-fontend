
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Tab from "../Tab"
import FeeHead from '../fine-head';
import ConcessionType from '../ConcessionType/Index';
import ScholarshipHead from '../ScholarshipHead';
import ParentHead from '../ParentHead';
import HeadGroups from '../Headgroup';
import PaymentMode from '../PaymentMode';
import ReceiptSeries from '../ReceiptSeries';
import BankAccount from '../BankAccount';
import FineHead from '../fee-head';
const QuickCollectSettingsListPage: React.FC = () => {
  // Declare a state variable
  const [activeTab, setActiveTab] = useState(0); // Active tab state

  const handleTabClick = (index: React.SetStateAction<number>) => {
    setActiveTab(index);
  };

  return (
    <div >
      <span style={{ fontSize: "24px", gap: "18px", display: "flex", alignItems: "center", marginLeft: "22px", marginBottom: "20px", marginTop: "20px" }}>Settings <Link style={{ fontSize: "14px", }} to={''} >
        Previous Version</Link></span>
      <div style={{ display: "flex", marginLeft: "22px" }}>
        <div className="tabs">
          <Tab isActive={activeTab === 0} onClick={() => handleTabClick(0)} label="Fine Head" />
          <Tab isActive={activeTab === 9} onClick={() => handleTabClick(9)} label="Fee Head" />
          <Tab isActive={activeTab === 1} onClick={() => handleTabClick(1)} label="Concession Type" />
          <Tab isActive={activeTab === 3} onClick={() => handleTabClick(3)} label="Scholarship Head" />
          <Tab isActive={activeTab === 4} onClick={() => handleTabClick(4)} label="Parent Head" />
          <Tab isActive={activeTab === 5} onClick={() => handleTabClick(5)} label="Head Groups" />
          <Tab isActive={activeTab === 6} onClick={() => handleTabClick(6)} label="Receipt Series" />
          <Tab isActive={activeTab === 7} onClick={() => handleTabClick(7)} label="Payment Mode" />
          <Tab isActive={activeTab === 8} onClick={() => handleTabClick(8)} label="Bank Account" />
        </div>
        <div style={{ width: 'calc(100% - 250px)' }}>
          {activeTab === 0 && <div><FeeHead /></div>}
          {activeTab === 1 && <div><ConcessionType /></div>}
          {activeTab === 3 && <div><ScholarshipHead /></div>}
          {activeTab === 4 && <div><ParentHead /></div>}
          {activeTab === 5 && <div><HeadGroups /></div>}
          {activeTab === 7 && <div><PaymentMode /></div>}
          {activeTab === 6 && <div><ReceiptSeries /></div>}
          {activeTab === 8 && <div><BankAccount /></div>}
          {activeTab === 9 && <div><FineHead /></div>}
        </div>
      </div>
    </div>
  );
}

export default QuickCollectSettingsListPage;