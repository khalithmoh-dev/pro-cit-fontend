import { useNavigate } from "react-router-dom";
import Table from "../../../../components/table";
import TableBody from "../../../../components/table/tableBody";
import TableHead from "../../../../components/table/tableHead";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import { useCallback } from "react";
import DeleteIcon from "../../../../icon-components/DeleteIcon";
import useExamStore, { ExamIF } from "../../../../store/examStore";
interface ExamTableProps {
    subjectId: string;
    selectedYearRange: {
        startYear: null | number;
        endYear: null | number;
    }
}

const tableHead = ["SL NO.", "Exam", "Term", "ACTION"];

const ExamTable: React.FC<ExamTableProps> = ({ subjectId, selectedYearRange }: ExamTableProps): JSX.Element => {
    const navigate = useNavigate();
    const { exams, selectedExam, deleteExam } = useExamStore();

    const handleViewClick = useCallback((id: string) => {
        navigate(`/exam/edit/${id}?subjectId=${subjectId}&&startYear=${selectedYearRange.startYear}&&endYear=${selectedYearRange.endYear}`);
    }, [navigate, selectedYearRange.endYear, selectedYearRange.startYear, subjectId]);

    const handleDeleteClick = useCallback((id: string, exam: ExamIF) => {
        const userChoice = confirm("Are you sure you want to delete this CO?");
        if (userChoice) {
            const filter = {
                startYear: exam.startYear,
                endYear: exam.endYear,
                subject: exam.subject
            }
            deleteExam(selectedExam?._id as string, filter);
        }
    }, [deleteExam, selectedExam?._id]);

    const tableBody = exams.map((exam, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td>
                {exam.name}
            </td>
            <td>{exam.term}</td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", display: "flex", gap: "5px" }}>
                <span onClick={() => handleViewClick(exam._id)}>
                    <RichEditorIcon />
                </span>
                <span onClick={() => handleDeleteClick(exam._id, exam)}>
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

export default ExamTable;