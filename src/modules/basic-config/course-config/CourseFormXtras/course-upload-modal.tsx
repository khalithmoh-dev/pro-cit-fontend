import React, { useState } from "react";
import Popup from "../../../../components/modal";
import { useTranslation } from "react-i18next";
import FileUpload from '../../../../components/fileupload';
import useCourseStore from "../../../../store/courseStores";
import Button from '../../../../components/ButtonMui';
import useBaseStore from "../../../../store/baseStore";
const CourseUploadModal = ({ isModalOpen, setIsModalOpen }) => {
    const { t } = useTranslation();
    const [uploadedFile, setUploadedFile] = useState({});
    const { downloadSampleExcel } = useBaseStore();
    const { uploadCourses } = useCourseStore();

    // to save the uploaded file
    const handleModalUpload = () => {
        try {
            uploadCourses(uploadedFile)
        } catch (err) {
            console.error(err)
        }
    }

    // model file actions
    const popupActions = [
        {
            label: t('CANCEL'),
            onClick: () => setIsModalOpen(false),
            variant: 'cancel',
            color: 'primary',
        },
        {
            label: t('UPLOAD'),
            onClick: handleModalUpload,
            variant: 'primary',
            color: 'primary',
        }
    ];

    return (
        <Popup
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={t('UPLOAD_COURSE')}
            actions={popupActions}
        >
            <FileUpload
                maxSize={1 * 1024 * 1024}
                accept={'xlsx, .xls, .csv'}
                onFileSelect={([File] = []) => {
                    setUploadedFile(File)
                }}
                onFileRemove={() => {
                    setUploadedFile({})
                }}
            />
            <div style={{ marginTop: '1rem' }}>
                <Button variantType="text" onClick={(e)=>downloadSampleExcel('COURSE_UPLOAD')}>Click to download sample format</Button>
            </div>
        </Popup>
    )
}
export default CourseUploadModal;