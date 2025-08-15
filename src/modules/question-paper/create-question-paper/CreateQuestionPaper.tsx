import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "../../../hooks";
import useQuestionPaperStore, { CreateQuestionPaperPayloadIF, Question } from "../../../store/questionPaperStore";
import style from "./create-question-paper.module.css";
import CloseIcon from "../../../icon-components/CloseIcon";
import Button from "../../../components/button";
import TextField from "../../../components/textfield";
import DeleteIcon from "../../../icon-components/DeleteIcon";
import useExamStore from "../../../store/examStore";
import useCOStore, { COIF } from "../../../store/co.store";
import MultiSelect from "../../../components/multi-select";
import { SelectOptionIF } from "../../../interface/component.interface";

interface CreateExamProps {
    update?: boolean
}

const CreateQuestionPaper: React.FC<CreateExamProps> = ({ update }: CreateExamProps): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const query = useQuery();
    const { getExam, exam } = useExamStore();
    const { getQuestionPaper, createQuestionPaper, updateQuestionPaper } = useQuestionPaperStore();
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });
    const { getCO, COs } = useCOStore();
    const [COOptions, setCOOptions] = useState([]);
    const [questionDesc, setQuestionDesc] = useState<string>();
    const [questions, setQuestions] = useState<Question[]>([]);

    const addClickHandler = useCallback(() => {
        const _questions = questions;
        _questions.push({
            question: "",
            questionNumber: "",
            co: [],
            maxMarks: 0
        });
        setQuestions(Object.assign([], _questions));
    }, [questions]);

    const deleteClickHandler = (idx: number) => {
        setQuestions((prevQuestions) => {
            return prevQuestions.filter((_, index) => index !== idx);
        });
    }

    const onChangehandler = useCallback((event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const { name, value } = event.target;
        const _questions = questions;
        _questions[idx][name as keyof Question] = value as never;
        setQuestions(Object.assign([], _questions));
    }, [questions]);

    const coClickHandler = useCallback((options: SelectOptionIF[], idx) => {
        const COIds = options.map((option) => option.value);
        const _questions = questions;
        _questions[idx].co = [...COIds] as unknown as COIF[];
        setQuestions(Object.assign([], _questions));
    }, [questions]);

    const onSubmit = useCallback(() => {
        console.log("hjvgh", selectedExam)
        if (!selectedExam) return;
        const payload: CreateQuestionPaperPayloadIF = {
            questions,
            description: questionDesc as string,
            startYear: Number(selectedYearRange.startYear),
            endYear: Number(selectedYearRange.endYear),
            exam: selectedExam
        }
        if (update) {
            updateQuestionPaper(id as string, payload);
        } else {
            createQuestionPaper(payload);
        }
        navigate(-1);
    }, [createQuestionPaper, id, navigate, questionDesc, questions, selectedExam, selectedYearRange.endYear, selectedYearRange.startYear, update, updateQuestionPaper]);

    useEffect(() => {
        const _COOptions = COs.map((CO) => ({ label: CO.co_id, value: CO._id }));
        setCOOptions(Object.assign([], _COOptions));
    }, [COs]);

    useEffect(() => {
        if (exam) {
            getCO(exam.subject as unknown as string);
        }
    }, [exam, getCO]);

    useEffect(() => {
        if (selectedYearRange.startYear && selectedYearRange.endYear && selectedExam) {
            getExam(selectedExam);
        }
    }, [selectedYearRange, selectedExam, getExam])

    useEffect(() => {
        if (query && query.get("startYear") && query.get("endYear") && query.get("examId")) {
            setSelectedYearRange(Object.assign({
                startYear: Number(query.get("startYear")),
                endYear: Number(query.get("endYear"))
            }));
            setSelectedExam(query.get("examId"));
            console.log("jn", query.get("exmaId"), query.get("startYear"))
        }
        if (update && id) {
            getQuestionPaper(id);
        }
    }, [getQuestionPaper, id, query, update]);

    console.log("selev", selectedExam)

    return (
        <div className={style.container}>
            <div
                className={`${style.dialogContainer} ${style.samll}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={style.headerContainer}>
                    {update ? "Update Question Paper" : "Create Question Paper"}
                    <span className={style.closeIcon} onClick={() => navigate(-1)}>
                        <CloseIcon />
                    </span>
                </div>
                <div className={style.bodyContainer}>
                    <div
                        className={`${style.fieldBox}  ${style.small}`}
                    >
                        <TextField
                            // error={field.errorMessage || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestionDesc(e.target.value)}
                            // onBlur={onBlur}
                            value={questionDesc}
                            label="Question Description*"
                        />
                        {questions.map((question, idx) => {
                            return (
                                <div key={idx}>
                                    <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                        <TextField
                                            name="questionNumber"
                                            // error={field.errorMessage || ""}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangehandler(e, idx)}
                                            // onBlur={onBlur}
                                            value={questions[idx].questionNumber}
                                            label="Question No."
                                        />
                                        <div style={{ marginTop: 7 }}>
                                            <MultiSelect
                                                label={"CO*"}
                                                options={COOptions}
                                                onChange={(e) => coClickHandler(e, idx)}
                                            />
                                        </div>
                                        <TextField
                                            name="maxMarks"
                                            type="number"
                                            // error={field.errorMessage || ""}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangehandler(e, idx)}
                                            // onBlur={onBlur}
                                            value={String(questions[idx].maxMarks)}
                                            label="Max Marks*"
                                        />
                                        <span onClick={() => deleteClickHandler(idx)}>
                                            <DeleteIcon />
                                        </span>
                                    </div>
                                    <TextField
                                        name="question"
                                        // error={field.errorMessage || ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangehandler(e, idx)}
                                        // onBlur={onBlur}
                                        value={questions[idx].question}
                                        label="Question"
                                    />
                                </div>
                            );
                        })}
                        <div className={style.actionContainer}>
                            <Button onClick={addClickHandler}>Add Question</Button>
                        </div>
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
    )
}

export default CreateQuestionPaper;