import React, { useState, useEffect } from "react";
import Table from "../../../../components/table";
import TableHead from "../../../../components/table/tableHead";
import TableBody from "../../../../components/table/tableBody";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import DeleteIcon from "../../../../icon-components/DeleteIcon";
import useFeeCategoryStore from "../../../../store/feeCategoryStore";
import addFeeStructure from "../../../../store/addFeeStructure";
import { Link, useNavigate } from "react-router-dom";
import convertDateFormat from "../../../../utils/functions/convert-date-format";
import style from '../fee-category.module.css';

// Import Modal Component
import ScholarshipModal from "./ScholarshipModal";
import CloseIcon from "../../../../icon-components/CloseIcon";
import DialogBody from "../../../../components/dialog/dialog-body";
import Dialog from "../../../../components/dialog";
import ArrowLeftIcon from "../../../../icon-components/ArrowLeftIcon";
import ArrowRightIcon from "../../../../icon-components/ArrowRightIcon";

const FeeCategoryTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { feeStructures, getFeeStructures, loading } = useFeeCategoryStore();
  const { studentfeestructure, getAllFeeStructure, deleteFeeStructure }: any = addFeeStructure();

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scholarshipData, setScholarshipData] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage]: any = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // You can adjust rows per page if needed

  useEffect(() => {
    getFeeStructures();
    getAllFeeStructure();
  }, [getFeeStructures, getAllFeeStructure]);

  // Calculate paginated data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = studentfeestructure?.slice(indexOfFirstRow, indexOfLastRow);

  // Handler for deleting a fee category
  const deleteHandler = async (id: string, categoryName: string) => {
    const res = await deleteFeeStructure(id, categoryName);
    if (res) {
      // Re-fetch the fee structures after successful deletion
      getFeeStructures();  // This will update the fee structure list

      // Reset the modal data or close the modal if open
      if (isModalOpen) {
        setScholarshipData(null);  // Clear scholarship data
        setIsModalOpen(false);     // Close the modal
      }
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle opening modal
  const openModal = (data: any) => {
    setScholarshipData(data);
    setIsModalOpen(true);
  };

  // Table headers
  const tableHead = [
    <input
      type="checkbox"
      onChange={() => {
        // Select all rows or deselect them
        if (selectedRows.size === studentfeestructure?.length) {
          setSelectedRows(new Set());
        } else {
          setSelectedRows(new Set(studentfeestructure?.map((fee) => fee._id)));
        }
      }}
      checked={selectedRows.size === studentfeestructure?.length}
    />,
    "SL NO.",
    "Title",
    "Display Name",
    "Facility",
    "Department",
    "Academic Year",
    "Student Type",
    "Admission Year",
    "Total Amount",
    "Head Count",
    "Assigned Student Count",
    "Default Receipt Series",
    "Consider for Optional Payment",
    "Last Modified",
    "ACTION"
  ];

  // Table body
  const tableBody = currentRows?.map((feeCategory: any, index: number) => (
    <tr key={feeCategory._id}>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.has(feeCategory._id)}
          onChange={() => handleCheckboxChange(feeCategory._id)}
        />
      </td>
      <td>{index + 1}</td>
      <td>{feeCategory.fee_structure_title}</td>
      <td>{feeCategory.display_name}</td>
      <td>{feeCategory.facility}</td>

      <td>{Array.isArray(feeCategory.department_names) ? feeCategory.department_names.join(", ") : "N/A"}</td>
      <td>{feeCategory.academic_year}</td>
      <td>{feeCategory.student_type}</td>
      <td>{feeCategory.admission_year}</td>
      <td>{feeCategory?.total_fee}</td>
      <td>
        <ul>
          <Link onClick={() => openModal(feeCategory)} to={""}> Fee({feeCategory.fees.length}) | Fine (0) | Scholarship ()</Link>
        </ul>
      </td>
      <td>{feeCategory.studentCount}</td>
      <td>{feeCategory?.default_receipt_series}</td>
      <td>{convertDateFormat(feeCategory?.createdAt)}</td>
      <td>{convertDateFormat(feeCategory?.updatedAt)}</td>
      <td>
        <span onClick={() => navigate(`/feescategory/update/${feeCategory._id}`)}>
          <RichEditorIcon />
        </span>
        <span onClick={() => deleteHandler(feeCategory._id, feeCategory.display_name)}>
          <DeleteIcon />
        </span>
      </td>
    </tr>
  ));

  // Pagination Controls
  const totalPages = Math.ceil(studentfeestructure?.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <Table loading={loading}>
        <TableHead tableHead={tableHead} />
        <TableBody tableBody={tableBody} />
      </Table>

      {/* Pagination */}
      <ul className={style.pagination}>
        <div 
          className={`${style.actionButton} ${currentPage === 1 ? style.disabledArrow : ''}`} 
          onClick={() => handlePageChange(currentPage - 1)} 
          style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
        >
          <ArrowLeftIcon />
        </div>
        
        <div style={{ gap: "5px", display: "flex" }}>
          <span 
            className={`${style.paginationbutton} ${currentPage === 1 ? style.activeButton : ''}`} >
            {currentPage}
          </span>
          <span 
            className={`${style.paginationbutton} ${currentPage === totalPages ? style.activeButton : ''}`} >
            {totalPages}
          </span>
        </div>
        
        <div 
          className={`${style.actionButton} ${currentPage === totalPages ? style.disabledArrow : ''}`} 
          onClick={() => handlePageChange(currentPage + 1)} 
          style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
        >
          <ArrowRightIcon />
        </div>
      </ul>

      {/* Modal component */}
      <Dialog isOpen={isModalOpen} small={true} wide={true} medium={false} fullHeight={true} onClose={() => setIsModalOpen(false)}>
        <div>
          Assign Fee Structure
          <span onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </span>
        </div>
        <DialogBody>
          <div>
            <ScholarshipModal
              scholarshipData={scholarshipData}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default FeeCategoryTableComponent;
