import { useEffect, useRef, useState } from "react";
import styles from "./co-po-pso-mapping.module.css";
import useOutcomeStore from "../../../store/outcomeStore";
import { useParams } from "react-router-dom";
import useSubjectStore from "../../../store/subjectStore";
import { getCurrentAcademicYear } from "../../../utils/functions/current-academic-year";
import useCOStore, { COIF } from "../../../store/co.store";
import Table from "../../../components/table";
import TableHead from "../../../components/table/tableHead";
import TableBody from "../../../components/table/tableBody";
import TableControlBox from "../../../components/table-control-box";

const COHeaders = ["SL NO.", "ID", "Objective"];
const POHeaders = ["SL NO.", "ID", "Outcome"];

const COPOPSOMapping: React.FC = (): JSX.Element => {
    const { getPO, PO } = useOutcomeStore();
    const { subject_id } = useParams();
    const { getSubject, subject } = useSubjectStore();
    const { COs, getCO, addRatings } = useCOStore();
    const [editMode, setEditMode] = useState(false);
    const [matrix, setMatrix] = useState<COIF[]>([]);
    const [editedRatings, setEditedRatings] = useState<{ co: string; po: string; rating: number; justification: string; }[]>([]);
    const ratingRef = useRef<any>(null);
    const justificationRef = useRef<any>(null);
    useEffect(() => {
        if (subject_id) {
            getSubject(subject_id);
            getCO(subject_id);
        }
    }, [getCO, getSubject, subject_id]);

    useEffect(() => {
        if (subject) {
            const { startYear, endYear } = getCurrentAcademicYear();
            getPO(subject.department as unknown as string, startYear, endYear);
        }
    }, [getPO, subject]);

    useEffect(() => {
        // if (COs.length === 0) return;
        setMatrix(Object.assign([], COs));
    }, [COs]);


    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    // Handler for changing rating values
    // const handleRatingChange = (coId, poId, value) => {
    //     const updatedMatrix = matrix.map((co) => {
    //         if (co._id === coId) {
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             let updatedEntries = [...co.matrixEntries] as any[];

    //             const entryIndex = updatedEntries.findIndex((entry) => entry.po === poId);
    //             const newRating = parseInt(value, 10) || 0;

    //             if (entryIndex > -1) {
    //                 // Update the existing entry's rating
    //                 updatedEntries[entryIndex].rating = newRating;

    //                 // Check if the rating has changed, and update the editedRatings state
    //                 if (!editedRatings.some((rating) => rating.co === coId && rating.po === poId && rating.rating === newRating)) {
    //                     const existingRatingIndex = editedRatings.findIndex((rating) => rating.co === coId && rating.po === poId);
    //                     if (existingRatingIndex > -1) {
    //                         // Update existing entry in editedRatings
    //                         editedRatings[existingRatingIndex].rating = newRating;
    //                     } else {
    //                         // Add new entry to editedRatings
    //                         setEditedRatings((prev) => [...prev, { co: coId, po: poId, rating: newRating }]);
    //                     }
    //                 }
    //             } else {
    //                 // Add a new entry if it doesn't exist
    //                 updatedEntries = [...updatedEntries, { po: poId, rating: newRating }];

    //                 // Add to edited ratings
    //                 setEditedRatings((prev) => [...prev, { co: coId, po: poId, rating: newRating }]);
    //             }

    //             return { ...co, matrixEntries: updatedEntries };
    //         }
    //         return co;
    //     });
    //     setMatrix(Object.assign([], updatedMatrix));
    // };

    const handleRatingJustificationChange = (coId, poId, rating, justification) => {
        console.log("rating", rating, "justification", justification);
        const updatedMatrix = matrix.map((co) => {
            if (co._id === coId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let updatedEntries = [...co.matrixEntries] as any[];

                const entryIndex = updatedEntries.findIndex((entry) => entry.po === poId);
                const newRating = parseInt(rating, 10) || 0;
                const newJustification = justification;
                if (entryIndex > -1) {
                    // Update the existing entry's rating
                    updatedEntries[entryIndex].rating = newRating;
                    updatedEntries[entryIndex].justification = newJustification;
                    // Check if the rating has changed, and update the editedRatings state
                    if (!editedRatings.some((rating) => rating.co === coId && rating.po === poId && rating.rating === newRating && rating.justification === newJustification)) {
                        const existingRatingIndex = editedRatings.findIndex((rating) => rating.co === coId && rating.po === poId);
                        if (existingRatingIndex > -1) {
                            // Update existing entry in editedRatings
                            editedRatings[existingRatingIndex].rating = newRating;
                            editedRatings[existingRatingIndex].justification = newJustification;
                        } else {
                            // Add new entry to editedRatings
                            setEditedRatings((prev) => [...prev, { co: coId, po: poId, rating: newRating, justification: newJustification }]);
                        }
                    }
                } else {
                    // Add a new entry if it doesn't exist
                    updatedEntries = [...updatedEntries, { po: poId, rating: newRating, justification: newJustification }];

                    // Add to edited ratings
                    setEditedRatings((prev) => [...prev, { co: coId, po: poId, rating: newRating, justification: newJustification }]);
                }

                return { ...co, matrixEntries: updatedEntries };
            }
            return co;
        });
        setMatrix(Object.assign([], updatedMatrix));
    };
    

    // Function to get rating for each PO and CO combination
    const getRating = (coId: string, poId: string) => {
        console.log("coid", coId, poId)
        const co = matrix.find((co) => co._id === coId); // Find the relevant CO from the updated matrix
        console.log("co", co);
        if (!co) return '';
        const entry = co.matrixEntries.find((e) => e.po._id === poId);
        return entry ? entry.rating : '';
    };

    const getJustification = (coId: string, poId: string) => {
        console.log("coid", coId, poId)
        const co = matrix.find((co) => co._id === coId); // Find the relevant CO from the updated matrix
        console.log("co", co);
        if (!co) return '';
        const entry = co.matrixEntries.find((e) => e.po._id === poId);
        return entry ? entry.justification : '';
    };

    const handleSaveClick = () => {
        console.log("ratings", editedRatings);
        addRatings(editedRatings as any, subject_id as string);
        setEditMode(false);
    }

    const coTableBody = COs?.map((CO, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td>
                {CO.co_id}
            </td>
            <td>{CO.description}</td>
        </tr>
    ));

    const poTableBody = PO?.map((PO, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td>
                {PO.ID}
            </td>
            <td>{PO.outcome}</td>
        </tr>
    ));

    return (
        <div className={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <div><h2>CO/PO Mapping</h2></div>
                <div>
                    <button className={styles["edit-button"]} onClick={!editMode ? handleEditClick : handleSaveClick}>
                        {editMode ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>
            <table className={styles["erp-table"]}>
                <thead>
                    <tr>
                        <th>CO/PO</th>
                        {PO.map((po) => (
                            <th key={po._id}>{po.ID}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((co) => (
                        <tr key={co._id}>
                            <td>{co.co_id}</td>
                            {PO.map((po) => (
                                <td key={po._id}>
                                    {editMode ? (
                                        <>
                                            <input
                                                ref={ratingRef}
                                                placeholder="rating"
                                                // type="number"
                                                defaultValue={getRating(co._id, po._id)}
                                                onChange={(e) => ratingRef.current.value = e.target.value}
                                                onBlur={(e) =>
                                                    handleRatingJustificationChange(co._id, po._id, e.target.value, justificationRef.current.value)
                                                }
                                            />
                                            <input
                                                ref={justificationRef}
                                                placeholder="justification"
                                                // type="number"
                                                onChange={(e) => justificationRef.current.value = e.target.value}
                                                defaultValue={getJustification(co._id, po._id)}
                                                onBlur={(e) =>
                                                    handleRatingJustificationChange(co._id, po._id, ratingRef.current.value, e.target.value)
                                                }
                                            />
                                        </>
                                    ) : (
                                        <div style={{ display: "inline-flex" }}>
                                            <div>{getRating(co._id, po._id) || ''}</div>
                                            <div>&nbsp;-&nbsp;</div>
                                            <div>{getJustification(co._id, po._id) || ''}</div>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: "flex", color: "#6e6e6e", flex: 1, width: "300px", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                    1 - Low*
                </div>
                <div>
                    2 - Medium*
                </div>
                <div>
                    3 - High*
                </div>
            </div>
            <div>
                {/* <TableControlBox tableName="Course Outcomes"><></></TableControlBox> */}
                <h3 style={{ marginTop: "20px", marginBottom: "20px" }}>Course Outcomes</h3>
                <Table>
                    <TableHead tableHead={COHeaders} />
                    <TableBody tableBody={coTableBody} />
                </Table>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <h3 style={{ marginTop: "20px", marginBottom: "20px" }}>PO/PSO</h3>
                <Table>
                    <TableHead tableHead={POHeaders} />
                    <TableBody tableBody={poTableBody} />
                </Table>
            </div>
        </div>
    );
};

export default COPOPSOMapping;