import { useNavigate, useParams } from 'react-router-dom';
import useDepartmentStore, { createDepartmentPayloadIF } from '../../../store/departmentStore';
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import useBaseStore from './../../../store/baseStore';


interface PropsIF {
  update?: boolean;
}

const CreateDepartmentPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const baseStore = useBaseStore();
  const [editValues, setEditValues] = useState({});
  const { updateDepartment, createDepartment, getDepartment } = useDepartmentStore();
  const [baseData, setBaseData] = useState({ employee: [] });

  useEffect(() => {
    if (!id) return;
    (async () => {
      if (id) {
        const oCourse = await getDepartment(id);
        if(oCourse) setEditValues(oCourse);
      }
    })()
  }, [id]);

  //to get the initial base data eg: program data and degree data
  useEffect(() => {
    try {
      if (baseStore) {
        (async () => {
          const aReq = ['employee'];
          const oBaseData = await baseStore.getBaseData(aReq);
          setBaseData(oBaseData);
        })();
      }
    } catch (err) {
      console.error(err)
    }
  }, [baseStore]);

  const schema = {
    fields: {
      General: [
        {
          name: "insId",
          label: t("INSTITUITION_NAME"),
          type: "select",
          validation: Yup.string().required(t("INSTITUITION_NAME_IS_REQUIRED")),
          isRequired: true,
          isDisabled: true
        },
        {
          name: "deptCd",
          label: t("DEPARTMENT_CODE"),
          type: "text",
          validation: Yup.string().required(t("DEPARTMENT_CODE_IS_REQUIRED")),
          isRequired: true
        },
        {
          name: "deptNm",
          label: t("DEPARTMENT_NAME"),
          type: "text",
          validation: Yup.string().required(t("DEPARTMENT_NAME_IS_REQUIRED")),
          isRequired: true
        },
        {
          name: "desc",
          label: t("DESCRIPTION"),
          type: "text"
        },
        {
          name: "maxmStgth",
          label: t("MAXIMUM_STRENGTH"),
          type: "number"
        },
        {
          name: "hod",
          label: t("HEAD_OF_THE_DEPARTMENT"),
          type: "select",
          labelKey: "empName",
          valueKey: "_id",
          options: baseData?.employee ?? []
        }
      ]
    },
    buttons: [
      {
        name: t("CANCEL"), variant: "outlined", color: "secondary", onClick: () => { navigate(-1) }
      }, ...(!id ? [{
        name: t("RESET"), variant: "outlined", color: "warning", onClick: () => { }
      }] : []), {
        name: id ? t("UPDATE") : t("SAVE"), variant: "contained", color: "primary", type: "submit"
      }
    ]
  };

  const handleDepartmentSubmit = async (values: createDepartmentPayloadIF) => {
    const res = id && update ? await updateDepartment(values, id) : await createDepartment(values);
    if (res) {
      navigate(-1);
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={update ? t('UPDATE_DEPARTMENT') : t('CREATE_DEPARTMENT')}
        onSubmit={handleDepartmentSubmit}
        isEditPerm={true}
        isEditDisableDflt={Boolean(id)}
        oInitialValues={id ? editValues : ""}
      />
    </>
  );
};

export default CreateDepartmentPage;
