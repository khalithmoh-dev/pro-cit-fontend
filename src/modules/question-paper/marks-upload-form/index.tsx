import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form";
import TextField from "../../../components/textfield";
import style from "./marks-upload-form.module.css";
import CloseIcon from "../../../icon-components/CloseIcon";
import { useCallback, useEffect, useState } from "react";
import Button from "../../../components/button";
import useQuestionPaperStore from "../../../store/questionPaperStore";
import * as XLSX from 'xlsx';
import useMarksStore, { CreateMarksPayloadIF } from "../../../store/marksStore";

const MarksUploadForm: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getQuestionPaper, questionPaper } = useQuestionPaperStore();
    const { createMark } = useMarksStore();
    const [file, setFile] = useState<File | null>(null);

    const parseExcelFile = useCallback((file: File) => {
        return new Promise<any[]>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert worksheet to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                resolve(jsonData);
            };

            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }, []);

    const transformToPayload = useCallback((jsonData: any[][]): any[] => {
        if (!questionPaper) return [];

        const headers = jsonData[0]; // Assuming first row is header
        const questionHeaders = headers.slice(3); // Assuming first 2 columns are for Student Name and USN

        // Create a map of question number to question object ID
        const questionMap: Record<string, string> = questionPaper.questions.reduce((map, question) => {
            map[`Q${question.questionNumber}`] = question["_id"] as any; // Assuming "Q{questionNumber}" format in Excel headers
            return map;
        }, {});

        return jsonData.slice(1).map((row: any) => {
            const studentName = row[1];
            const studentUSN = row[0].replace("\"", "").replace("\"", "");
            const marks = questionHeaders.map((qHeader, index) => {
                const questionNumber = qHeader.split(' ')[0]; // Extract "Q{questionNumber}" from header
                const questionId = questionMap[questionNumber]; // Get the corresponding question object ID

                return {
                    question: questionId || '', // Use questionId, if not found, set as empty string (handle validation)
                    obtainedMarks: row[3 + index] || '0', // Handle undefined/null cases for marks
                };
            });

            return {
                questionPaper: id!, // Use question paper ID from params
                student: studentUSN, // Assuming USN uniquely identifies students
                isAbsent: marks.every(mark => mark.obtainedMarks === '0'), // Mark as absent if all marks are zero
                marks,
            };
        });
    }, [id, questionPaper]);

    const fileChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        setFile(files && files[0]);
    }, []);

    const onSubmit = useCallback(async () => {
        if (!file) return;

        try {
            const jsonData = await parseExcelFile(file);
            const payload: CreateMarksPayloadIF[] = transformToPayload(jsonData);

            console.log('Payload to send:', payload);

            createMark(payload);
            // Send the JSON data to the backend
            //await axios.post('/api/marks/upload', payload);

            alert('Marks uploaded successfully!');
            //navigate('/some-path'); // Redirect after upload
        } catch (error) {
            console.error('Error uploading marks:', error);
            alert('Failed to upload marks');
        }
    }, [createMark, file, parseExcelFile, transformToPayload]);

    useEffect(() => {
        getQuestionPaper(id as string);
    }, [getQuestionPaper, id]);

    console.log("file", file);

    return (
        <div className={style.container}>
            <div
                className={`${style.dialogContainer} ${style.samll}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={style.headerContainer}>
                    Upload Marks
                    <span className={style.closeIcon} onClick={() => navigate(-1)}>
                        <CloseIcon />
                    </span>
                </div>
                <div className={style.bodyContainer}>
                    <div
                        className={`${style.fieldBox}  ${style.small}`}
                    >
                        <TextField type="file" onChange={fileChangeHandler} />
                    </div>
                </div>
                <div className={style.actionContainer}>
                    <Button secondary onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>Submit</Button>
                </div>
            </div>
        </div>
    );
};

export default MarksUploadForm;

