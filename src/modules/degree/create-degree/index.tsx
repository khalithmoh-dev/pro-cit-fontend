import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useDegreeStore, { createDegreePayload } from "../../../store/degreeStore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateDegree() {
  const navigate = useNavigate();
  const degreeStore = useDegreeStore();
  const { id } = useParams();
  const [editValues, setEditValues] = useState({});
  const { t } = useTranslation();

  const schema = {
  fields: {
      General: [        
        {
          name: "insname",
          label: t("INSTITUITION_NAME"),
          type: "select",
          validation: Yup.string().required(t("INSTITUITION_NAME_IS_REQUIRED")),
          isRequired: true,
          isDisabled: true
        },
        {
          name: "degreeId",
          label: t("DEGREE_ID"),
          type: "text",
          validation: Yup.string().required(t("DEGREE_ID_IS_REQUIRED")),
          isRequired: true
        },
         {
          name: "degreeName",
          label: t("DEGREE_NAME"),
          type: "text",
          validation: Yup.string().required(t("DEGREE_NAME_IS_REQUIRED")),
          isRequired: true
        },
         {
          name: "description",
          label:  t("DESCRIPTION"),
          type: "text"
        }
  ]
},
  buttons:[
    {
      name:t("CANCEL"), variant:"outlined", color:"secondary", onClick:()=>{navigate(-1)}
    },{
      name:t("RESET"), variant:"outlined", color:"warning", onClick:()=>{}
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
        const oDegree = await degreeStore.getDegree(id)
        setEditValues(oDegree);
      }
      })()
    },[id])

  const handleDegreeSubmit = async (values: createDegreePayload) => {
    try{
      delete values.degreeId;
      if(!id){
        await degreeStore.createDegree(values);
      }else{
        const oUpdtPayload = {
          ...values,
          _id:id
        }
        await degreeStore.updateDegree(oUpdtPayload);
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
        pageTitle={t("CREATE_DEGREE")}
        onSubmit={handleDegreeSubmit} 
        isEditPerm = {true}
        isEditDisableDflt = {Boolean(id)}
        oInitialValues = {id ? editValues :""}
      />
    </>
  );
}
