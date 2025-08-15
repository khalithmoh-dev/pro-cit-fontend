import { useCallback, useEffect, useState } from "react";
import styles from "./create-question-paper.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "../../../hooks";
import useExamStore from "../../../store/examStore";
import useQuestionPaperStore from "../../../store/questionPaperStore";
import useCOStore from "../../../store/co.store";
import Button from "../../../components/button";
import useSubjectStore from "../../../store/subjectStore";
import useDepartmentStore from "../../../store/departmentStore";
import TextField from "../../../components/textfield";
import MultiSelect from "../../../components/multi-select";
import TextArea from "../../../components/textArea";

type Questions = {
    questionNumber: string; // Editable, auto-incrementing
    text: string | null;
    marks: number | null;
    level: string;
    subquestions: Questions[];
    co: string[];
    image?: string | null; // Added field for image URL
};

type QuestionPaper = {
    department: string;
    semester: string;
    description: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    exam: string;
    maxMarks: number | null;
    type: string;
    questions: Questions[];
    choices: string[][];
};

const CreateQuestionPaperV2: React.FC<{ update?: boolean }> = ({ update }: { update?: boolean }): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const query = useQuery();
    const { subject, getSubject } = useSubjectStore();
    const { getExam, exam } = useExamStore();
    const { getQuestionPaper, createQuestionPaper, updateQuestionPaper, questionPaper } = useQuestionPaperStore();
    const { department, getDepartment } = useDepartmentStore();
    const { getCO, COs } = useCOStore();
    const [questionPaperForm, setQuestionPaper] = useState<QuestionPaper>({
        department: "",
        semester: "",
        description: "",
        subject: "",
        date: "",
        startTime: "",
        endTime: "",
        maxMarks: null,
        type: "Regular",
        questions: [],
        choices: [],
        exam: ""
    });
    const [COOptions, setCOOptions] = useState([]);
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });
    const [choiceSelection, setChoiceSelection] = useState<string[]>([]);

    const handleAddChoiceClick = () => {
        console.log("Choice", choiceSelection);
        if (choiceSelection.length > 1) { // Ensure there is more than one question in the choice
            
            setQuestionPaper((prev) => ({
                ...prev,
                choices: [...prev.choices, [...choiceSelection]]
            }));
            setChoiceSelection(Object.assign([], [])); // Reset choice selection after adding
        }
    };

    const handleRemoveChoice = (index: number) => {
        setQuestionPaper((prev) => ({
            ...prev,
            choices: prev.choices.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const _COOptions = COs.map((CO) => ({ label: CO.co_id, value: CO._id }));
        setCOOptions(Object.assign([], _COOptions));
    }, [COs]);

    const handleAddQuestionClick = () => {
        const nextQuestionNumber = (questionPaperForm.questions.length + 1).toString(); // Increment question number
        setQuestionPaper((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                { questionNumber: nextQuestionNumber, text: "", marks: null, level: "", subquestions: [], co: [], image: null }
            ]
        }));
    };

    const handleAddSubQuestionClick = (index: number) => {
        setQuestionPaper((prev) => {
            const questions = [...prev.questions];
            const nextSubQuestionIdentifier = String.fromCharCode(97 + questions[index].subquestions.length); // 'a' is 97 in ASCII
            questions[index].subquestions.push({ questionNumber: nextSubQuestionIdentifier, text: "", marks: null, level: "", subquestions: [], co: [], image: null });
            return { ...prev, questions };
        });
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        let newValue = ["co", "level"].includes(field) ? value.map((eachValue) => eachValue.value) : value;
        newValue = ["level"].includes(field) ? value[0].value : newValue;

        setQuestionPaper((prev) => {
            const questions = [...prev.questions];
            questions[index] = { ...questions[index], [field]: newValue };
            return { ...prev, questions };
        });
    };

    const handleSubQuestionChange = (questionIdx: number, subIdx: number, field: string, value: any) => {
        let newValue = ["co"].includes(field) ? value.map((eachValue) => eachValue.value) : value;
        newValue = ["level"].includes(field) ? value[0].value : newValue;
        console.log("includes(field)", ["COs", "level"].includes(field))
        console.log("newValue", newValue);
        // let newValue = value;
        setQuestionPaper((prev) => {
            const questions = [...prev.questions];
            questions[questionIdx].subquestions[subIdx] = { ...questions[questionIdx].subquestions[subIdx], [field]: newValue };
            return { ...prev, questions };
        });
    };

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleQuestionChange(index, "image", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteQuestionClickHandler = (index: number) => {
        setQuestionPaper((prev) => {
            const questions = prev.questions.filter((_, idx) => idx !== index);
            return { ...prev, questions };
        });
    };

    const deleteSubQuestionClickHandler = (questionIdx: number, subIdx: number) => {
        setQuestionPaper((prev) => {
            const questions = [...prev.questions];
            questions[questionIdx].subquestions = questions[questionIdx].subquestions.filter((_, idx) => idx !== subIdx);
            return { ...prev, questions };
        });
    };

    useEffect(() => {
        if (department && exam && subject && selectedYearRange) {
            setQuestionPaper((prev) => ({
                ...prev,
                department: department._id,
                semester: prev.semester,
                description: prev.description,
                subject: subject._id,
                date: prev.date,
                startTime: prev.startTime,
                endTime: prev.endTime,
                maxMarks: exam.totalMarks,
                type: "Regular",
                exam: exam._id,
                startYear: selectedYearRange.startYear,
                endYear: selectedYearRange.endYear
            } as any));
        }
    }, [department]);

    useEffect(() => {
        if (subject) {
            getDepartment(subject.department as unknown as string);
        }
    }, [subject]);

    useEffect(() => {
        if (exam) {
            getCO(exam.subject as unknown as string);
            getSubject(exam.subject as unknown as string);
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

    const handleOnCreate = useCallback(async () => {
        if(update) {
            updateQuestionPaper(id, questionPaperForm as any);
        } else {
            createQuestionPaper(questionPaperForm as any);
        }
        navigate(-1);
    }, [questionPaperForm]);

    useEffect(() => {
        if(update) {
            console.log("ue", questionPaper);
            if(questionPaper) {
                setQuestionPaper(Object.assign({}, questionPaper as any));
            }        
        }
    }, [questionPaper]);

    //console.log("questionPaper", questionPaper);

    return (
        <div className={styles.container}>
            <div className={styles.actionContainer}>
                <Button secondary onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button onClick={handleOnCreate}>Submit</Button>
            </div>
            <h2 style={{ textAlign: "center" }}>Exam: {exam?.name}</h2>
            <div className={styles.bodyContainer}>
                <div style={{ width: "100%" }}>
                    <TextField value={department?.name} label="Department" disabled />
                </div>
                <div style={{ width: "100%" }}>
                    <TextField value={"6"} label="Semester" disabled />
                </div>
                <div style={{ width: "100%" }}>
                    <TextField value={subject?.name} label="Subject" disabled />
                </div>
                <div style={{ width: "100%" }}>
                    <TextField value={subject?.subjectCode} label="Sub Code" disabled />
                </div>
                <div style={{ width: "100%" }}>
                    <TextField value={exam?.totalMarks} label="Max Marks" disabled />
                </div>
                <div style={{ width: "100%" }}>
                    <TextField value={"Regular"} label="Type" disabled />
                </div>
            </div>
            <hr style={{ marginTop: 30, marginBottom: 20, borderColor: "#fafafa", borderWidth: "1px" }} />
            <div className={styles.flexRow} style={{ marginBottom: '20px' }}>
                <div style={{ width: "33%", paddingRight: '10px' }}>
                    <TextField
                        type="time"
                        label="Start Time"
                        value={questionPaperForm.startTime}
                        onChange={(e) => setQuestionPaper((prev) => ({ ...prev, startTime: e.target.value }))}
                    />
                </div>
                <div style={{ width: "33%", paddingRight: '10px' }}>
                    <TextField
                        type="time"
                        label="End Time"
                        value={questionPaperForm.endTime}
                        onChange={(e) => setQuestionPaper((prev) => ({ ...prev, endTime: e.target.value }))}
                    />
                </div>
                <div style={{ width: "34%" }}>
                    <TextField
                        label="Date"
                        type="date"
                        value={questionPaperForm.date}
                        onChange={(e) => setQuestionPaper((prev) => ({ ...prev, date: e.target.value }))}
                    />
                </div>
                <div style={{ width: "34%" }}>
                    <TextField
                        label="Description"
                        // type="date"
                        value={questionPaperForm.description}
                        onChange={(e) => setQuestionPaper((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>
            </div>
            {/* Question Section */}
            <div className={styles.questionsContainer}>
                {questionPaperForm.questions.map((question, index) => (
                    <div key={index} className={styles.questionItem}>
                        <h3>Question {question.questionNumber}</h3>

                        {/* Conditional rendering of main question fields */}
                        {question.subquestions.length === 0 && (
                            <>
                                <div className={styles.flexRow}>
                                    <TextField
                                        label="Question Number"
                                        value={question.questionNumber}
                                        onChange={(e) => handleQuestionChange(index, "questionNumber", e.target.value)}
                                    />
                                    <TextField
                                        label="Marks"
                                        value={question.marks?.toString() || ""}
                                        onChange={(e) => handleQuestionChange(index, "marks", Number(e.target.value))}
                                    />
                                    <MultiSelect
                                        label="COs"
                                        options={COOptions}
                                        selectedValues={question.co}
                                        onChange={(value) => handleQuestionChange(index, "co", value)}
                                    />
                                    <MultiSelect
                                        label="Level"
                                        options={[{ label: "Create", value: "Create" }, { label: "Evaluate", value: "Evaluate" }, { label: "Analyze", value: "Analyze" }, { label: "Apply", value: "Apply" }, { label: "Understand", value: "Understand" }, { label: "Remember", value: "Remember" }]}
                                        selectedValues={[question.level]}
                                        onChange={(value) => handleQuestionChange(index, "level", value)}
                                    />
                                </div>
                                <div className={styles.textAreaRow}>
                                    <TextArea
                                        label="Text"
                                        value={question.text || ""}
                                        onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                                    />
                                </div>
                                <div className={styles.flexRow}>
                                    <TextField
                                        type="file"
                                        onChange={(e) => handleImageUpload(index, e)}
                                    />
                                    {/* {question.image && <img src={question.image} alt={`Question ${question.questionNumber}`} style={{ width: '100px', height: '100px', marginLeft: '10px' }} />} */}
                                </div>

                            </>
                        )}

                        <div className={styles.actionContainer}>
                            <Button onClick={() => handleAddSubQuestionClick(index)}>Add Subquestion</Button>
                            <Button secondary onClick={() => deleteQuestionClickHandler(index)}>Delete Question</Button>
                        </div>

                        {question.subquestions.map((subQuestion, sIdx) => (
                            <div key={sIdx} className={styles.subQuestionItem}>
                                <h4>Subquestion {subQuestion.questionNumber}</h4>

                                {/* Image Upload for Subquestion */}

                                <div className={styles.flexRow}>
                                    <TextField
                                        label="Question Number"
                                        value={subQuestion.questionNumber}
                                        onChange={(e) => handleSubQuestionChange(index, sIdx, "questionNumber", e.target.value)}
                                    />
                                    <TextField
                                        label="Marks"
                                        value={subQuestion.marks?.toString() || ""}
                                        onChange={(e) => handleSubQuestionChange(index, sIdx, "marks", Number(e.target.value))}
                                    />
                                    <MultiSelect
                                        label="COs"
                                        options={COOptions}
                                        selectedValues={subQuestion.co}
                                        onChange={(value) => handleSubQuestionChange(index, sIdx, "co", value)}
                                    />
                                    <MultiSelect
                                        label="Level"
                                        options={[{ label: "L1", value: "L1" }, { label: "L2", value: "L2" }]}
                                        selectedValues={[subQuestion.level]}
                                        onChange={(value) => handleSubQuestionChange(index, sIdx, "level", value)}
                                    />
                                </div>
                                <div className={styles.textAreaRow}>
                                    <TextArea
                                        label="Text"
                                        value={subQuestion.text || ""}
                                        onChange={(e) => handleSubQuestionChange(index, sIdx, "text", e.target.value)}
                                    />
                                </div>
                                <div className={styles.flexRow}>
                                    <TextField
                                        type="file"
                                        onChange={(e) => handleImageUpload(index, e)}
                                    />
                                    {/* {subQuestion.image && <img src={subQuestion.image} alt={`Subquestion ${subQuestion.questionNumber}`} style={{ width: '100px', height: '100px', marginLeft: '10px' }} />} */}
                                </div>

                                <div className={styles.actionContainer}>
                                    <Button onClick={() => deleteSubQuestionClickHandler(index, sIdx)}>Delete Subquestion</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <Button onClick={handleAddQuestionClick}>Add Question</Button>
            </div>
            <hr style={{ marginTop: 30, marginBottom: 20, borderColor: "#fafafa", borderWidth: "1px" }} />

            {/* Choice selection UI */}
            <div className={styles.choicesContainer}>
                <h3>Select Choices Between Questions</h3>
                <MultiSelect
                    label="Select Questions for Choice"
                    options={questionPaperForm.questions.map((q) => ({
                        label: `Question ${q.questionNumber}`,
                        value: q.questionNumber
                    }))}
                    selectedValues={[]}
                    onChange={(value) => setChoiceSelection(Object.assign([], value.map((item) => item.value)))}
                />
                <Button onClick={handleAddChoiceClick}>
                    Add Choice
                </Button>

                {/* Display existing choices */}
                <div className={styles.existingChoicesContainer}>
                    <h4>Existing Choices</h4>
                    {questionPaperForm.choices.map((choice, idx) => (
                        <div key={idx} className={styles.choiceItem}>
                            <span>Choice {idx + 1}: {choice.join(", ")}</span>
                            <Button secondary onClick={() => handleRemoveChoice(idx)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateQuestionPaperV2;
