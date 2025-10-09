import { useEffect,useState } from 'react';
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useSemesterStore, { createSemesterPayload } from "../../../store/semesterStore";
import useBaseStore from '../../../store/baseStore';
import { useParams } from 'react-router-dom';
import { t } from 'i18next';

export default function CreateSemester() {
  const navigate = useNavigate();
  const baseStore = useBaseStore();
  const semesterStore = useSemesterStore();
  const [baseData,setBaseData] = useState({degree: []});
  const { id } = useParams();
  const [editValues,setEditValues] = useState({});
  
  //to get the initial base data eg: program data and degree data
  useEffect(()=> {
    try{
      if(baseStore){
        (async()=>{
            const aReq = ['degree', 'program'];
            setBaseData(await baseStore.getBaseData(aReq));
        })();
      }
    } catch(err){
      console.error(err)
    }
  },[baseStore]);

  //to get semester data by id for update
  useEffect(()=>{
    (async()=>{
      if(id){
      const oSemester = await semesterStore.getSemesterById(id)
      setEditValues(oSemester);
    }
    })()
  },[id])

  //form schema
  const schema = {
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
              options:(baseData?.degree ?? []),
              validation: Yup.string().required(t("DEGREE_IS_REQUIRED")),
              isRequired: true,
              labelKey: 'degreeName',
              valueKey: '_id'
            },
            {
              name: "prgCd",
              label: t("PROGRAM"),
              type: "select",
              // validation: Yup.string().required("Program Name is required"),
              // isRequired: true,
            },
            {
              name: "semId",
              label: t("SEMESTER_ID"),
              type: "text",
              validation: Yup.string().required("SEMESTER_ID_IS_REQUIRED"),
              isRequired: true
            },
            {
              name: "semNm",
              label: t("SEMESTER_NAME"),
              type: "text",
              validation: Yup.string().required("SEMESTER_NAME_IS_REQUIRED"),
              isRequired: true
            },
            {
              name: "desc",
              label: t("DESCRIPTION"),
              type: "text"
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
            onClick: () => {}
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

  //To handle submission of semester for both create and update
const handleSemesterSubmit = async (values: createSemesterPayload) => {
  try{
    delete values.prgCd; //--------------TEMP: HAVE TO REMOVE ONCE PROGRAM IS DONE--------------------------
    if(!id){
      await semesterStore.createSemester(values);
    }else{
      const oUpdtPayload = {
        ...values,
        _id:id
      }
      await semesterStore.updateSemester(oUpdtPayload);
    }
    navigate(-1)
  }catch(err){
    console.error(err)
  }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={`${t("CREATE_SEMESTER")}`}
        onSubmit={handleSemesterSubmit}
        isEditPerm = {true}
        isEditDisableDflt = {Boolean(id)}
        oInitialValues = {id ? editValues :""}
      />
    </>
  );
}
