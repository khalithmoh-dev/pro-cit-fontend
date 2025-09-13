import { useEffect,useState } from 'react';
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useSemesterStore, { createSemesterPayload } from "../../../store/semesterStore";
import useBaseStore from '../../../store/baseStore';
import { useParams } from 'react-router-dom';
import { sanitizePayload } from '../../../utils'

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
              label: "Institution",
              type: "select",
              validation: Yup.string().required("Institution is required"),
              isRequired: true,
              isDisabled: true
            },
            {
              name: "degId",
              label: "Degree",
              type: "select",
              options:(baseData?.degree ?? []),
              validation: Yup.string().required("Degree is required"),
              isRequired: true,
              labelKey: 'degreeName',
              valueKey: '_id'
            },
            {
              name: "prgId",
              label: "Program",
              type: "select",
              // validation: Yup.string().required("Institution Name is required"),
              // isRequired: true,
            },
            {
              name: "semId",
              label: "Semester Id",
              type: "text",
              validation: Yup.string().required("Semester Id is required"),
              isRequired: true
            },
            {
              name: "semNm",
              label: "Semester name",
              type: "text",
              validation: Yup.string().required("Semester name is required"),
              isRequired: true
            },
            {
              name: "desc",
              label: "Description",
              type: "text"
            }
      ]
    },
     buttons: [
    {
      name: "Cancel",
      variant: "outlined",
      color: "secondary",
      onClick: () => {
        navigate(-1);
      }
    },
    ...(!id
      ? [
          {
            name: "Reset",
            variant: "outlined",
            color: "warning",
            onClick: () => {}
          }
        ]
      : []),
    {
      name: id ? "Update" : "Save",
      variant: "contained",
      color: "primary",
      type: "submit"
    }
  ]
  };

const handleSemesterSubmit = async (values: createSemesterPayload) => {
  try{
    delete values.prgId;
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
        pageTitle="Create Semester"
        onSubmit={handleSemesterSubmit}
        isEditPerm = {true}
        isEditDisableDflt = {Boolean(id)}
        oInitialValues = {id ? editValues :""}
      />
    </>
  );
}
