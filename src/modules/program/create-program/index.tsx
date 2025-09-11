import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../../store/authStore';
import useProgramStore, { createProgramPayload } from "../../../store/programStore";

export default function CreateProgram() {
  const navigate = useNavigate();
  const { user, permissions } = useAuthStore();
  const { createProgram } = useProgramStore();

  const schema = {
  fields: {
      General: [        
        {
          name: "institutionName",
          label: "Institution name",
          type: "text",
          isEdit: false
        },
        {
          name: "programId",
          label: "Program Id",
          type: "text",
          validation: Yup.string().required("Program Id is required"),
          isRequired: true
        },
         {
          name: "programName",
          label: "Program name",
          type: "text",
          validation: Yup.string().required("Program name is required"),
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
      name:"Save", variant:"contained", color:"primary", onClick:()=>{onSubmit}
    },{
      name:"Next", variant:"contained", color:"primary", onClick:()=>{}
    }
  ]
};

const onSubmit = async (values: createProgramPayload) => {
    const res = await createProgram(values);
    if (res) {
    
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle="Create Program"
        onSubmit={(values) => console.log("Form Submitted:", values)}
        isEditPerm = {true}
        oInitialValues = ""
      />
    </>
  );
}
