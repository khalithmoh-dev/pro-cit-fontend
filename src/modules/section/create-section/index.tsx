import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useSectionStore, { createSectionPayload } from "../../../store/sectionStore";

export default function CreateSection() {
  const navigate = useNavigate();
  const { createSection } = useSectionStore();

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
          name: "sectionCode",
          label: "Section Code",
          type: "text",
          validation: Yup.string().required("Section Code is required"),
          isRequired: true
        },
         {
          name: "sectionName",
          label: "Section name",
          type: "text",
          validation: Yup.string().required("Section name is required"),
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

const handleSectionSubmit = async (values: createSectionPayload) => {
  console.log('inn for creating section',values)
    const res = await createSection(values);
    if (res) {
    
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle="Create Section"
        onSubmit={handleSectionSubmit}
        isEditPerm = {true}
        oInitialValues = ""
      />
    </>
  );
}
