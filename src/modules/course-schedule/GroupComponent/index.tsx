import React, { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCourseScheduleStore from '../../../store/course-scheduleStore';
import { useToastStore } from '../../../store/toastStore';
import { useTranslation } from "react-i18next";

interface Course {
    _id: string;
    crsId: string;
    crsNm: string;
    capacity: number;
    isDeleted: boolean;
}

interface ElectiveGroupProps {
    title: string;
    coursesList: Course[];
    setCoursesList: React.Dispatch<React.SetStateAction<Course[]>>;
    checkDuplicate: Course[];
    isEditPerm: boolean;
}


const ElectiveGroup: React.FC<ElectiveGroupProps> = ({
    title,
    coursesList,
    setCoursesList,
    checkDuplicate,
    isEditPerm
}) => {
    const [showInput, setShowInput] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [capacity, setCapacity] = useState("");
    const [errors, setErrors] = useState({ course: false, capacity: false });
    const [crsOptions, setCrsOptions] = useState([]);
    const { searchCoursesByName } = useCourseScheduleStore();
    const { t } = useTranslation();

    const handlAddCourses = () => {
        setShowInput(true);
    };

    const saveAddedCourse = () => {
        const newErrors = {
            course: !selectedCourse,
            capacity: !capacity || Number(capacity) <= 0,
        };
        setErrors(newErrors);
        if (selectedCourse && capacity) {
            setCoursesList(prev => [...prev, { ...selectedCourse, capacity: parseInt(capacity) }]);
            setSelectedCourse(null);
            setCapacity("");
            setShowInput(false);
        }
    }

    const removeCourse = (index: number) => {
        const updatedCourses = coursesList?.filter(crs => !crs?.isDeleted).map((crs, idx) => idx === index ? { ...crs, isDeleted: true } : crs);
        setCoursesList(updatedCourses);
    }

    const fetchCourses = async (newInputValue: string) => {
        try {
            if (newInputValue?.length > 2) {
                setIsLoading(true);
                const courses = await searchCoursesByName(newInputValue);
                setCrsOptions(courses as any);
            } else {
                setCrsOptions([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleOnSelectCourse = (newValue: any) => {
        if (newValue) {
            if (coursesList.find(crs => !crs?.isDeleted && crs._id === newValue._id) || checkDuplicate.find(crs => !crs?.isDeleted && crs._id === newValue._id)) {
                useToastStore.getState().showToast('error', t("COURSE_ALREADY_ADDED"));
                setSelectedCourse(null);
                return;
            } else {
                setSelectedCourse(newValue);
            }
        }
    }


    return (
        <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }} className="generic-master-card mb-4">
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
                    <Chip
                        label={`${coursesList?.filter(crs => !crs?.isDeleted).length} courses`}
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
                    {!showInput && <Button
                        variant="contained"
                        size="small"
                        sx={{
                            borderRadius: "12px",
                            height: 32,
                            textTransform: "none",
                            paddingLeft: 1.5,
                            paddingRight: 1.5,
                        }}
                        onClick={handlAddCourses}
                        disabled={!isEditPerm}
                    >
                        Add
                    </Button>}
                </Box>
            </Box>

            {coursesList?.filter(crs => !crs?.isDeleted).map((course, idx) => (
                <Card
                    key={idx}
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
                            {course.crsId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {course.crsNm}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2">
                            Capacity <strong>{course.capacity}</strong>
                        </Typography>
                        <IconButton size="small" onClick={() => removeCourse(idx)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Card>
            ))}
            {showInput && (
                <Box mt={1} display="flex" gap={1}>
                    <Autocomplete
                        options={crsOptions.length ? crsOptions : []}
                        getOptionLabel={(option) => option.crsId ? `${option.crsId} - ${option.crsNm}` : ""}
                        value={selectedCourse}
                        onChange={(event, newValue) => handleOnSelectCourse(newValue)}
                        onInputChange={(_, newInputValue) => {
                            fetchCourses(newInputValue);
                        }}
                        loading={isLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Course"
                                size="small"
                                error={errors.course}
                                helperText={errors.course ? "Course is required" : ""}
                            />
                        )}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Capacity"
                        type="number"
                        size="small"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        sx={{ flex: 1 }}
                        error={errors.capacity}
                        helperText={errors.capacity ? "Capacity is required" : ""}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        sx={{ height: 40, borderRadius: 2 }}
                        onClick={() => {
                            setShowInput(false);
                            setSelectedCourse(null);
                            setCapacity("");
                            setErrors({ course: false, capacity: false });
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={saveAddedCourse} sx={{ height: 40, borderRadius: 2 }}>
                        Save
                    </Button>
                </Box>
            )}

        </Card>
    );
};

export default ElectiveGroup;
