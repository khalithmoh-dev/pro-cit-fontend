import { useEffect, useMemo, useState } from 'react';
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useSemesterStore, { createSemesterPayload } from "../../../store/semesterStore";
import useBaseStore from '../../../store/baseStore';
import { useParams } from 'react-router-dom';
import { t } from 'i18next';
import { useToastStore } from '../../../store/toastStore';

export default function CreateSemester() {
  const navigate = useNavigate();
  const baseStore = useBaseStore();
  const semesterStore = useSemesterStore();
  const [baseData, setBaseData] = useState({ degree: [], program: [] });
  const { id } = useParams();
  const [editValues, setEditValues] = useState({});
  const [aSemGroup, setSemGroup] = useState([{}])
  const { showToast } = useToastStore();
  //to get the initial base data eg: program data and degree data
  useEffect(() => {
    try {
      if (baseStore) {
        (async () => {
          const aReq = ['degree', 'program'];
          const result = await baseStore.getBaseData(aReq)
          setBaseData(result);
        })();
      }
    } catch (err) {
      console.error(err)
    }
  }, [baseStore]);

  //to get semester group data for select with add field
  useEffect(() => {
    (async () => {
      const aSemGroupBase = await semesterStore.getSemesterGroup();
      if (Array.isArray(aSemGroupBase)) {
        setSemGroup(aSemGroupBase);
      }
    })()
  }, []);

  //to get semester data by id for update
  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const oSemester = await semesterStore.getSemesterById(id)
          setEditValues(oSemester);
        } catch (err) {
          showToast('error', t('FAILED_TO_FETCH_SEMESTER_DETAILS'));
        }
      }
    })()
  }, [id])

  const handleAddSemesterGroup = async (value) => {
    try {
      await semesterStore.createSemesterGroup({ value });
    } catch (err) {
      showToast('error', t('FAILED_TO_ADD_SEMESTER_GROUP'));
    }
  }

  //form schema
  const schema = useMemo(() => {
    return {
      fields: {
        General: [
          {
            name: "insId",
            label: t("INSTITUTION"),
            type: "select",
            validation: Yup.string().required(t('INSTITUTION_IS_REQUIRED')),
            isRequired: true,
            isDisabled: true
          },
          {
            name: "degId",
            label: t("DEGREE"),
            type: "select",
            options: (baseData?.degree ?? []),
            validation: Yup.string().required(t("DEGREE_IS_REQUIRED")),
            isRequired: true,
            labelKey: 'degNm',
            valueKey: '_id'
          },
          {
            name: "prgId",
            label: t("PROGRAM"),
            type: "select",
            options: (baseData?.program ?? []),
            labelKey: "prgNm",
            valueKey: '_id',
            validation: Yup.string().required(t("PROGRAM_IS_REQUIRED")),
            isRequired: true,
          },
          {
            name: "semId",
            label: t("SEMESTER_ID"),
            type: "text",
            validation: Yup.string().required(t("SEMESTER_ID_IS_REQUIRED")),
            isRequired: true
          },
          {
            name: "semNm",
            label: t("SEMESTER_NAME"),
            type: "text",
            validation: Yup.string().required(t("SEMESTER_NAME_IS_REQUIRED")),
            isRequired: true
          },
          {
            name: "desc",
            label: t("DESCRIPTION"),
            type: "text"
          },
          {
            type: "selectWithAdd",
            name: "semGrpId",
            label: t("SEMESTER_GROUP"),
            addOption: handleAddSemesterGroup,
            labelKey: "semGrpNm",
            valueKey: "_id",
            options: aSemGroup
          }

        ]
      },
      buttons: [
        {
          name: "Cancel",
          variant: "outlined",
          nature: "secondary",
          onClick: () => {
            navigate(-1);
          }
        },
        ...(!id
          ? [
            {
              name: "Reset",
              variant: "outlined",
              nature: "warning",
              onClick: () => { }
            }
          ]
          : []),
        {
          name: id ? "Update" : "Save",
          variant: "contained",
          nature: "primary",
          type: "submit"
        }
      ]
    };
  },[baseData, navigate, id, aSemGroup]);

  //To handle submission of semester for both create and update
  const handleSemesterSubmit = async (values: createSemesterPayload) => {
    if (!id) {
      try {
        await semesterStore.createSemester(values);
        showToast('success', t('SEMESTER_CREATED_SUCCESSFULLY'));
      } catch (err) {
        if (err.message === "Duplicate_Found") {
          showToast('error', `${t('SEMESTER_ID')} ${t("ALREADY_EXISTS")}`);
        } else {
          showToast('error', t('FAILED_TO_CREATE_SEMESTER'));
        }
      }
    } else {
      try {
        const oUpdtPayload = {
          ...values,
          _id: id
        }
        await semesterStore.updateSemester(oUpdtPayload);
        showToast('success', t('SEMESTER_UPDATED_SUCCESSFULLY'));
      } catch (err) {
        if (err.message === "Duplicate_Found") {
          showToast('error', `${t('SEMESTER_ID')} ${t("ALREADY_EXISTS")}`);
        } else {
          showToast('error', t('FAILED_TO_UPDATE_SEMESTER'));
        }
      }
    }
    navigate(-1);
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={`${t("CREATE_SEMESTER")}`}
        onSubmit={handleSemesterSubmit}
        isEditPerm={true}
        isEditDisableDflt={Boolean(id)}
        oInitialValues={id ? editValues : ""}
      />
    </>
  );
}
