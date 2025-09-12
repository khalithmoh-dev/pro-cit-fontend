import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../../store/authStore';
import useDegreeStore, { createDegreePayload } from "../../../store/degreeStore";

export default function CreateDegree() {
  const navigate = useNavigate();
  const { user, permissions } = useAuthStore();
  const { createDegree } = useDegreeStore();

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
          name: "degreeId",
          label: "Degree Id",
          type: "text",
          validation: Yup.string().required("Degree Id is required"),
          isRequired: true
        },
         {
          name: "degreeName",
          label: "Degree name",
          type: "text",
          validation: Yup.string().required("Degree name is required"),
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

const handleDegreeSubmit = async (values: createDegreePayload) => {
  console.log('inn for creating degree',values)
    const res = await createDegree(values);
    if (res) {
    
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle="Create Degree"
        onSubmit={handleDegreeSubmit}
        isEditPerm = {true}
        oInitialValues = ""
      />
    </>
  );
}
