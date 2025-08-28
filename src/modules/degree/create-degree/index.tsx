import RenderFormbuilderForm from "../../../components/render-formbuilder-form";
import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export default function CreateDegree() {
  const navigate = useNavigate();

  const schema = {
  fields: {
      General: [
        // {
        //   name: "company",
        //   label: "Company name",
        //   type: "text",
        //   options: [
        //     { label: "Support Warehouse LTD", value: "swltd" },
        //     { label: "Other Company", value: "other" },
        //   ],
        //   validation: Yup.string().required("Company is required"),
        // },
        // {
        //   name: "vendor",
        //   label: "Vendor name",
        //   type: "select",
        //   options: [
        //     { label: "Hewlett Packard Enterprise", value: "hpe" },
        //     { label: "Dell", value: "dell" },
        //   ],
        // },
        {
          name: "Insname",
          label: "Institution name",
          type: "text",
          isEdit: true
        },
        {
          name: "code",
          label: "Degree Id",
          type: "text",
          validation: Yup.string().required("Degree Id is required"),
          isRequired: true
        },
         {
          name: "name",
          label: "Degree name",
          type: "text",
          validation: Yup.string().required("Degree name is required"),
          isRequired: true
        },
         {
          name: "desc",
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
      name:"Save", variant:"contained", color:"primary", onClick:()=>{}
    },{
      name:"Next", variant:"contained", color:"primary", onClick:()=>{}
    }
  ]
};

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle="Create Degree"
        onSubmit={(values) => console.log("Form Submitted:", values)}
        onCancel={() => console.log("Cancelled")}
      />
    </>
  );
}
