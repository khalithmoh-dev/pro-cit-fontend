import { useNavigate, useParams } from 'react-router-dom';
import useDepartmentStore, { createDepartmentPayloadIF } from '../../../store/departmentStore';
import useEmployeeStore from '../../../store/employeeStore';
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useToastStore } from '../../../store/toastStore';

interface PropsIF {
  update?: boolean;
}

const CreateDepartmentPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const employeeStore = useEmployeeStore();
  const [editValues, setEditValues] = useState({});
  const { updateDepartment, createDepartment, getDepartment } = useDepartmentStore();
  const [baseData, setBaseData] = useState({ employee: [] });
  const [stfInptVal, setStfInptVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!id) return;
    (async () => {
      if (id) {
        const oDepartment = await getDepartment(id);
        if (oDepartment) setEditValues(oDepartment);
        if (oDepartment?.hod?.length) {
          const staffDtls = await employeeStore.getStfsByIds(oDepartment.hod);
          // setStfInptVal(oDepartment.hod?.length ? staffDtls.map((stf: any) => stf.empName).join(', ') : '');
          setBaseData({ employee: staffDtls });
        }
      }
    })()
  }, [id]);

  // Fixed searchStaff function
  const searchStaff = useCallback(async (searchValue: string) => {
    try {
      if (searchValue?.length > 2) {
        setIsLoading(true);
        const staffDtls = await employeeStore.getStfsForSrch(searchValue);
        setBaseData({
          employee: staffDtls
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [employeeStore]);

  // Debounced input handler
  const handleInputChange = useCallback((newInputValue: string) => {
    setStfInptVal(newInputValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (newInputValue.length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchStaff(newInputValue);
      }, 500);
    }
  }, [searchStaff]);

  const schema = useMemo(() => {
    return (
      {
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
              isMulti: true,
              isApi: true,
              inputValue: stfInptVal,
              setInputValue: handleInputChange,
              options: baseData?.employee ?? [],
              isLoading: isLoading
            }
          ]
        },
        buttons: [
          {
            name: t("CANCEL"), variant: "outlined", nature: "secondary", onClick: () => { navigate(-1) }
          }, ...(!id ? [{
            name: t("RESET"), variant: "outlined", nature: "warning", onClick: () => { }
          }] : []), {
            name: id ? t("UPDATE") : t("SAVE"), variant: "contained", nature: "primary", type: "submit"
          }
        ]
      }
    )
  }, [id, t, stfInptVal, handleInputChange, baseData, isLoading, navigate]);

  const handleDepartmentSubmit = async (values: createDepartmentPayloadIF) => {
    try {
      const departmentRes = id && update ? await updateDepartment(values, id) : await createDepartment(values);
      showToast('success', id ? t("DEPARTMENT_UPDATED_SUCCESSFULLY") : t("DEPARTMENT_CREATED_SUCCESSFULLY"));
      if (departmentRes) {
        navigate(-1);
      }
    } catch (err) {
      if(err.message === "Duplicate_Found"){
        showToast('error', t("DEPARTMENT_ID_ALREADY_EXISTS"));
      }else{
        showToast('error', t("UNKNOWN_ERROR_OCCURRED"));
      }
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
