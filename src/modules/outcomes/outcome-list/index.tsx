import { useEffect, useState } from "react";
import useOutcomeStore from "../../../store/outcomeStore";
import { useToastStore } from "../../../store/toastStore";
import style from "./outcome-list.module.css";
import TableControlBox from "../../../components/table-control-box";
import OutcomeTable from "./outcome-table";
const OutcomeListPage: React.FC = (): JSX.Element => {
  const { outcomeCount, getOutcomeCount } = useOutcomeStore();
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();
  const [yearRange, setYearRange] = useState<{ startYear: null | number; endYear: null | number }>({
    startYear: null,
    endYear: null
  })

  const onRefresh = async () => {
    setLoading(true)
    const res = await getOutcomeCount(yearRange.startYear as number, yearRange.endYear as number);
    if (res) {
      setShowCacheMessage(false);
      showToast("success", "Outcomes refreshed successfully");
      setLoading(false)
    } else {
      showToast("error", "Failed to refresh outcomes");
      setLoading(false)
    }
  };


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    setYearRange(Object.assign({
      startYear: lastYear,
      endYear: currentYear
    }));
  }, []);

  useEffect(() => {
    if (yearRange.startYear && yearRange.endYear) {
      getOutcomeCount(yearRange.startYear as number, yearRange.endYear as number);
    }
  }, [yearRange]);

  return (
    <div className={style.container}>
      <TableControlBox tableName="Outcomes">
        <></>
      </TableControlBox>
      <OutcomeTable />
    </div>
  );
};

export default OutcomeListPage;