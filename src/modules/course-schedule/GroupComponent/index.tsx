import React, { useState, useMemo, useRef, useCallback } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    IconButton,
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCourseScheduleStore from '../../../store/course-scheduleStore';
import { useToastStore } from '../../../store/toastStore';
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import InputFields from "../../../components/inputFields";
import DynamicForm from "../../../components/generic-form";

interface Course {
    _id: string;
    crsCd: string; // Course code
    crsNm: string; // Course name
    capacity: number;
    isDeleted: boolean;
}

interface ElectiveGroupProps {
    title: string;
    coursesList: Course[];
    setCoursesList: React.Dispatch<React.SetStateAction<Course[]>>;
    checkDuplicate: Course[]; // Courses to check for duplicates against
    isEditPerm: boolean; // Edit permission flag
}

/**
 * ElectiveGroup Component
 * 
 * Displays a group of elective courses with ability to add/remove courses
 * Handles course selection with search and capacity input
 */
const ElectiveGroup: React.FC<ElectiveGroupProps> = ({
    title,
    coursesList,
    setCoursesList,
    checkDuplicate,
    isEditPerm
}) => {
    // State for showing/hiding the course input form
    const [showInputForm, setShowInputForm] = useState(false);
    // State for currently selected course in the form
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    // Loading state for course search
    const [isLoading, setIsLoading] = useState(false);
    // State for search input value
    const [searchInputValue, setSearchInputValue] = useState('');
    // State for available course options from search
    const [courseOptions, setCourseOptions] = useState<Course[]>([]);
    
    // Hooks and refs
    const { searchCoursesByName } = useCourseScheduleStore();
    const { t } = useTranslation();
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    /**
     * Handles showing the course input form
     */
    const handleAddCourses = () => {
        setShowInputForm(true);
    };

    // Initial values for the dynamic form
    const initialFormValues = {
        selectedCourse: '',
        capacity: '',
    }

    /**
     * Saves the newly added course to the courses list
     * @param values - Form values containing capacity
     */
    const saveAddedCourse = (values: { capacity: string }) => {
        if (selectedCourse && values.capacity) {
            // Add new course with parsed capacity to the list
            setCoursesList(prev => [...prev, { 
                ...selectedCourse, 
                capacity: parseInt(values.capacity) 
            }]);
            // Reset form state
            setSelectedCourse(null);
            setSearchInputValue('');
            setCourseOptions([]);
            setShowInputForm(false);
        }
    }

    /**
     * Removes a course from the list by marking it as deleted
     * @param index - Index of the course to remove
     */
    const removeCourse = (index: number) => {
        const updatedCourses = coursesList
            ?.filter(course => !course?.isDeleted)
            .map((course, idx) => 
                idx === index ? { ...course, isDeleted: true } : course
            );
        setCoursesList(updatedCourses);
    }

    /**
     * Fetches courses based on search input with debouncing
     * @param searchQuery - The search string to find courses
     */
    const fetchCourses = async (searchQuery: string) => {
        try {
            if (searchQuery?.length > 2) {
                setIsLoading(true);
                const courses = await searchCoursesByName(searchQuery);
                setCourseOptions(courses as Course[]);
            } else {
                setCourseOptions([]);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Handles search input changes with debouncing
     * @param newInputValue - The new search input value
     * @param rawVal - Raw value object (unused)
     */
    const handleSearchFieldChange = useCallback((newInputValue: string, rawVal: object) => {
        setSearchInputValue(newInputValue);
    
        // Clear existing timeout to implement debouncing
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    
        // Only search if input is longer than 2 characters
        if (newInputValue.length > 2) {
            searchTimeoutRef.current = setTimeout(() => {
                fetchCourses(newInputValue);
            }, 500); // 500ms debounce delay
        }
    }, []);

    /**
     * Handles course selection from dropdown
     * @param selectedValue - The selected course object
     */
    const handleCourseSelection = (selectedValue: Course | null,formik) => {
        if (selectedValue) {
            // Check if course already exists in current list or duplicate check list
            const isDuplicate = (coursesList ?? []).find(course => 
                !course?.isDeleted && course._id === selectedValue._id
            ) || (checkDuplicate ?? []).find(course => 
                !course?.isDeleted && course._id === selectedValue._id
            );
            
            if (isDuplicate) {
                useToastStore.getState().showToast('error', t("COURSE_ALREADY_ADDED"));
                setSelectedCourse(null);
                setSearchInputValue('');
                setCourseOptions([]);
                formik.handleReset();
                return;
            } else {
                setSelectedCourse(selectedValue);
            }
        }
    }

    /**
     * Dynamic form schema configuration
     * Defines form fields and buttons for course addition
     */
    const formSchema = useMemo(() => {
        return {
            fields: {
                "": [
                    {
                        name: "selectedCourse",
                        label: t("COURSE"),
                        type: "select",
                        labelKey: "parsedData",
                        valueKey: "_id",
                        isApi: true, // Flag for API-based search
                        inputValue: searchInputValue,
                        setInputValue: handleSearchFieldChange,
                        onChange: handleCourseSelection,
                        options: courseOptions ?? [],
                        isLoading: isLoading
                    },
                    {
                        name: "capacity",
                        label: t("CAPACITY"),
                        type: "number",
                    }
                ]
            },
            buttons: [
                {
                    name: t("CANCEL"), 
                    variant: "outlined", 
                    nature: "secondary", 
                    onClick: ({_, handleReset}) => {
                        setShowInputForm(false); 
                        handleReset();
                    }
                },
                {
                    name: `${t("ADD")} ${t(title)}`, 
                    variant: "contained", 
                    nature: "primary", 
                    type: "button", 
                    onClick: ({ values, handleReset }) => { 
                        saveAddedCourse(values); 
                        handleReset();
                    }
                }
            ]
        }
    }, [t, searchInputValue, courseOptions, showInputForm, isLoading]);

    return (
        <>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }} className="generic-master-card mb-4">
                {/* Header Section */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                        {/* Course count chip */}
                        <Chip
                            label={`${coursesList?.filter(course => !course?.isDeleted).length} courses`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{
                                borderRadius: "12px",
                                height: 32,
                                "& .MuiChip-label": {
                                    paddingLeft: 1.5,
                                    paddingRight: 1.5,
                                },
                            }}
                        />
                        {/* Add button - only show when form is not visible */}
                        {!showInputForm && (
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    borderRadius: "12px",
                                    height: 32,
                                    textTransform: "none",
                                    paddingLeft: 1.5,
                                    paddingRight: 1.5,
                                }}
                                onClick={handleAddCourses}
                                disabled={!isEditPerm}
                            >
                                Add
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Courses List */}
                {coursesList?.filter(course => !course?.isDeleted).map((course, index) => (
                    <Card
                        key={index}
                        variant="outlined"
                        sx={{
                            mb: 1,
                            borderRadius: 2,
                            backgroundColor: "#f9f9f9",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {course.crsCd}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {course.crsNm}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body2">
                                Capacity <strong>{course.capacity}</strong>
                            </Typography>
                            {/* Remove button */}
                            <IconButton 
                                size="small" 
                                onClick={() => removeCourse(index)}
                                disabled={!isEditPerm}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Card>
                ))}
                {showInputForm && (
                <DynamicForm
                    schema={formSchema}
                    pageTitle={t("CREATE_PROGRAM")}
                    onSubmit={saveAddedCourse}
                    isEditPerm={true}
                    isNotMainForm={true}
                    isEditDisableDflt={false}
                    initialValues={initialFormValues}
                />
            )}
            </Card>

            {/* Dynamic Form for Adding New Course */}
            {/* {showInputForm && (
                <DynamicForm
                    schema={formSchema}
                    pageTitle={t("CREATE_PROGRAM")}
                    onSubmit={saveAddedCourse}
                    isEditPerm={true}
                    isNotMainForm={true}
                    isEditDisableDflt={false}
                    initialValues={initialFormValues}
                />
            )} */}
        </>
    );
};

export default ElectiveGroup;