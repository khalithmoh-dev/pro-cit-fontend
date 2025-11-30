import React, { useState } from "react";
import Popup from "../../../../components/modal";
import { useTranslation } from "react-i18next";
import FileUpload from '../../../../components/fileupload';
import useCourseStore from "../../../../store/courseStores";
import Button from '../../../../components/ButtonMui';
import useBaseStore from "../../../../store/baseStore";
import './ChildInstitutes.css';
const ViewInstitutes = ({ isModalOpen, aChildIns, setIsModalOpen }) => {
    const { t } = useTranslation();
    const actions = [{
        size: 'sm',
        onClick: () => { },
        type: 'button',
        disabled: false,
        variant: 'primary',
        label: t('ADD_INSTITUTIONS')
    }];

    return (
        <Popup
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={t('UPLOAD_COURSE')}
            maxWidth="md"
            actions={actions}
        >
            {aChildIns.length > 0 ?
                <div className="institution-table-wrapper">
                    <table className="institution-table">
                        <thead>
                            <tr>
                                <th>{t("INSTITUTION_NAME")}</th>
                                <th>{t("INSTITUTION_CODE")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aChildIns.map((inst) => (
                                <tr key={inst.code}>
                                    <td>{inst.name}</td>
                                    <td>{inst.code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                : <p className="text-center my-3">{t('NO_CHILD_INSTITUTES')}</p>}
        </Popup>
    )
}
export default ViewInstitutes;