import { useEffect,useState } from 'react';
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../../store/authStore';
import useDegreeStore, { createDegreePayload } from "../../../store/degreeStore";
import useBaseStore from '../../../store/baseStore';
export default function CreateDegree() {
  const navigate = useNavigate();
  const { user, permissions } = useAuthStore();
  const baseStore = useBaseStore();
  const { createDegree } = useDegreeStore();
  const [baseData,setBaseData] = useState({})
  useEffect(()=> {
    (async()=>{
        const aReq = ['degree', 'program'];
        setBaseData(await baseStore.getBaseData(aReq));
    })();
  },[]);

  const schema = {
  fields: {
      General: [        
        {
          name: "insname",
          label: "Institution name",
          type: "select",
          validation: Yup.string().required("Institution Name is required"),
          isRequired: true,
          isDisabled: true
        },
        {
          name: "afgsa",
          label: "Degree",
          type: "select",
          validation: Yup.string().required("Institution Name is required"),
          isRequired: true,
          isDisabled: true
        },
        {
          name: "agrwg",
          label: "Program",
          type: "select",
          validation: Yup.string().required("Institution Name is required"),
          isRequired: true,
          isDisabled: true
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
          name: "description",
          label: "Description",
          type: "text"
        }
  ]
},
  buttons:[
    {
      name:"Cancel", variant:"outlined", color:"secondary", onClick:()=>{navigate(-1)}
    },{
      name:"Reset", variant:"outlined", color:"warning", onClick:()=>{}
    },{
      name:"Save", variant:"contained", color:"primary", type: "submit"
    },{
      name:"Next", variant:"contained", color:"primary", onClick:()=>{}
    }
  ]
};

const handleSemesterSubmit = async (values: createDegreePayload) => {
  console.log('inn for creating degree',values)
    const res = await createDegree(values);
    if (res) {
    
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle="Create Semester"
        onSubmit={handleSemesterSubmit}
        isEditPerm = {true}
        oInitialValues = ""
      />
    </>
  );
}
