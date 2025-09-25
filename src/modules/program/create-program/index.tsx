import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from '../../../store/authStore';
import useProgramStore, { createProgramPayload } from "../../../store/programStore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateProgram() {
  const navigate = useNavigate();
  const programStore = useProgramStore();
  const { id } = useParams();
  const [editValues, setEditValues] = useState({});
  const { t } = useTranslation();

  const { user, permissions } = useAuthStore();
  const { createProgram } = useProgramStore();
  const schema = {
  fields: {
      General: [        
        {
          name: "institutionName",
          label: t("INSTITUITION_NAME"),
          validation: Yup.string().required(t("INSTITUITION_NAME_IS_REQUIRED")),
          type: "text",
          isEdit: false
        },
        {
          name: "programId",
          label: t("PROGRAM_ID"),
          type: "text",
          validation: Yup.string().required(t("PROGRAM_ID_IS_REQUIRED")),
          isRequired: true
        },
         {
          name: "programName",
          label: t("PROGRAM_NAME"),
          type: "text",
          validation: Yup.string().required(t("PROGRAM_NAME_IS_REQUIRED")),
          isRequired: true
        },
         {
          name: "description",
          label: t("DESCRIPTION"),
          type: "text"
        }
  ]
},
  buttons:[
    {
      name:t("CANCEL"), variant:"outlined", color:"secondary", onClick:()=>{navigate(-1)}
    },{
      name:t("RESET"),  variant:"outlined", color:"warning", onClick:()=>{}
    },{
      name: id ? t("UPDATE") : t("SAVE"), variant:"contained", color:"primary", type: "submit"
    },{
     name:t("NEXT"), variant:"contained", color:"primary", onClick:()=>{}
    }
  ]
};

 //to get degree data by id for update
    useEffect(()=>{
      (async()=>{
        if(id){
        const oProgram = await programStore.getProgram(id)
        setEditValues(oProgram);
      }
      })()
    },[id])

  const handleProgramSubmit = async (values: createProgramPayload) => {
    try{
      delete values.programId;
      if(!id){
        await programStore.createProgram(values);
      }else{
        const oUpdtPayload = {
          ...values,
          _id:id
        }
        await programStore.updateProgram(oUpdtPayload);
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
        pageTitle={t("CREATE_PROGRAM")}
        onSubmit={handleProgramSubmit} 
        isEditPerm = {true}
        isEditDisableDflt = {Boolean(id)}
        oInitialValues = {id ? editValues :""}
      />
    </>
  );
}
