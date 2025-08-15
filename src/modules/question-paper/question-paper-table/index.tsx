import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useQuestionPaperStore, { QuestionPaperIF } from "../../../store/questionPaperStore";
import RichEditorIcon from "../../../icon-components/RichEditor";
import DeleteIcon from "../../../icon-components/DeleteIcon";
import Table from "../../../components/table";
import TableHead from "../../../components/table/tableHead";
import TableBody from "../../../components/table/tableBody";
import useMarksStore from "../../../store/marksStore";
import Button from "../../../components/button";
import FileDownloadIcon from "../../../icon-components/FileDownloadIcon";
import SendIcon from "../../../icon-components/SendIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface QuestionPaperTableProps {
    selectedExam: string;
    selectedYearRange: {
        startYear: null | number;
        endYear: null | number;
    }
}

const tableHead = ["SL NO.", "DESCRIPTION", "MARKS", "ACTION"];

const QuestionPaperTable: React.FC<QuestionPaperTableProps> = ({ selectedExam, selectedYearRange }: QuestionPaperTableProps): JSX.Element => {
    const navigate = useNavigate();
    const { deleteQuestionPaper, questionPapers } = useQuestionPaperStore();
    const { getMarksTemplate } = useMarksStore();

    const handleViewClick = useCallback((id: string) => {
        navigate(`/question-paper/edit/${id}?examId=${selectedExam}&&startYear=${selectedYearRange.startYear}&&endYear=${selectedYearRange.endYear}`);
    }, [navigate, selectedExam, selectedYearRange.endYear, selectedYearRange.startYear]);

    const handleDeleteClick = useCallback((id: string, questionPaper: QuestionPaperIF) => {
        const userChoice = confirm("Are you sure you want to delete this CO?");
        if (userChoice) {
            // const filter = {
            //     startYear: questionPaper.startYear,
            //     endYear: questionPaper.endYear,
            //     exam: questionPaper.exam
            // }
            deleteQuestionPaper(id as string, questionPaper.exam);
        }
    }, [deleteQuestionPaper]);

    const handleDownloadTemplate = useCallback((id: string) => {
        getMarksTemplate({ questionPaper: id });
    }, [getMarksTemplate]);

    function formatDateToDDMMYYYY(dateInput) {
        const date = new Date(dateInput); // Convert input to a Date object
      
        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad
        const year = date.getFullYear(); // Get year
      
        // Return formatted date string
        return `${day}/${month}/${year}`;
      }
      
      // Example usage:
      const date1 = new Date(); // Current date
      console.log(formatDateToDDMMYYYY(date1)); // Output: e.g., "30/10/2024"
      
      const date2 = '2023-05-15'; // ISO format date string
      console.log(formatDateToDDMMYYYY(date2)); // Output: "15/05/2023"
      

    const handleDownloadClick = useCallback((questionPaper) => {
        console.log("questionPaper", questionPaper)
        const doc = new jsPDF();

        // Add header content
        doc.setFontSize(14);
        doc.text(`Exam: ${questionPaper.exam.name}`, 10, 10);

        // Add details below the header
        doc.text(" ", 10, 20); // Just for spacing

        // Define table headers and data
        const tableHeaders = ["Dept", "Semester", "Subject", "Sub Code"];
        const tableData = [
            [
                `Dept: ${questionPaper.subject.department.name}`,
                "Semester: 6", // Assuming the semester is static; adjust if dynamic
                `Sub: ${questionPaper.subject.name}`,
                `Code: ${questionPaper.subject.subjectCode}`,
            ],
            [
                `Date: ${formatDateToDDMMYYYY(questionPaper.date)}`,
                `Time: ${questionPaper.startTime} – ${questionPaper.endTime}`,
                `Max Marks: ${questionPaper.exam.totalMarks}`,
                "Regular", // Assuming the type is static; adjust if dynamic
            ],
        ];

        autoTable(doc, {
            head: [],
            body: tableData,
            startY: 30, // Start below the header
            theme: 'grid',
            styles: {
                cellPadding: 3,
                fontSize: 10,
                halign: 'left',
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
            },
        });

        // Add a line break for spacing
        doc.text(" ", 10, 40); // Just for spacing

        // Add "Answer the following" line
        doc.text("Answer the following", 10, 70);

        // Add question table header
        const headers = ["Question No.", "Questions", "Marks", "RBT", "CO’s"];
        const data = [];

        // Populate table data
        questionPaper.questions.forEach(q => {
            // Main question row (if subquestions exist, we leave the question text empty)
            if(q.subquestions.length === 0) {
                const mainQuestionRow = [
                    q.questionNumber,
                    q.subquestions.length > 0 ? '' : q.text,
                    q.subquestions.length > 0 ? '' : (q.marks !== null ? q.marks : ''),
                    q.subquestions.length > 0 ? '' : q.level,
                    q.subquestions.length > 0 ? '' : (q.co.length > 0 ? q.co.map((qco) => qco.co_id).join(',') : '')
                ];

                data.push(mainQuestionRow);
            }

            // Subquestions rows
            q.subquestions.forEach(subq => {
                const subQuestionRow = [
                    `${q.questionNumber}.${subq.questionNumber}`,
                    subq.text,
                    subq.marks,
                    subq.level,
                    subq.co.map((qco) => qco.co_id).join(',')
                ];
                data.push(subQuestionRow);
            });
        });

        // Add the table to the PDF using autoTable
        autoTable(doc, {
            head: [headers],
            body: data,
            startY: 80, // Start below the text
            theme: 'grid',
            styles: {
                cellPadding: 3,
                fontSize: 10,
                halign: 'left',
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0]
            }
        });

        const footerTableData = [
            [
                `Faculty Sign: `,
                "Signature of Course Coordinator", // Assuming the semester is static; adjust if dynamic
                "HOD"
            ],
        ]

        autoTable(doc, {
            head: [],
            body: footerTableData,
            startY: 150, // Start below the header
            theme: 'grid',
            styles: {
                cellPadding: 3,
                fontSize: 10,
                halign: 'left',
            },
            headStyles: {
                // fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
            },
        });


        // Add prepared by section
        // doc.text("Prepared by: Thimmaiah A G", 10, doc.lastAutoTable.finalY + 20);
        // doc.text("Faculty Sign: _____________________", 10, doc.lastAutoTable.finalY + 30);
        // doc.text("Signature of Course Coordinator: _____________________", 10, doc.lastAutoTable.finalY + 40);
        // doc.text("HOD: _____________________", 10, doc.lastAutoTable.finalY + 50);

        // Save the PDF
        doc.save("question-paper.pdf");
    }, []); 

    const tableBody = questionPapers.map((questionPaper, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td>
                {questionPaper.description}
            </td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", display: "flex", gap: "5px" }}>
                <div>
                    <Button small endIcon={<FileDownloadIcon />} onClick={() => handleDownloadTemplate(questionPaper._id)}>Download</Button>
                </div>
                <div>
                    <Button small endIcon={<SendIcon />} onClick={() => navigate(`/question-paper/marks-upload/${questionPaper._id}`)}>Upload</Button>
                </div>
            </td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", gap: "5px" }}>
                <span onClick={() => navigate(`/question-paper/edit/${questionPaper._id}?examId=${selectedExam}&&startYear=${selectedYearRange.startYear}&&endYear=${selectedYearRange.endYear}`)}>
                    <RichEditorIcon />
                </span>
                <span onClick={() => handleDeleteClick(questionPaper._id, questionPaper)}>
                    <DeleteIcon />
                </span>
                <span onClick={() => handleDownloadClick(questionPaper)}>
                    <DeleteIcon />
                </span>
            </td>
        </tr>
    ));

    return (
        <div>
            <Table>
                <TableHead tableHead={tableHead} />
                <TableBody tableBody={tableBody} />
            </Table>
        </div>
    );
}

export default QuestionPaperTable;