import { useEffect,useRef,useState } from "react";
import DynamicForm from "../../../../components/generic-form";
import * as Yup from "yup";
import useInstituteStore from "../../../../store/instituteStore";
import useBaseStore from '../../../../store/baseStore';
import useAuthStore from '../../../../store/authStore'
import { useNavigate } from "react-router-dom";

export default function InstiteConfig() {
  const { updateInstitute, getInstitute } = useInstituteStore();
  const { user, permissions } = useAuthStore();
  const { parseFormDataAndUpload } = useBaseStore()
  const [instDtls, setInstDtls] = useState({});
  const navigate = useNavigate();
  
  //form schema
  const schema = {
    fields: {
        General: [
          {
            name: "insname",
            label: "Institution name",
            type: "text",
            validation: Yup.string().required("Institution Name is required"),
            isRequired: true,
          },
          {
            name: "insCode",
            label: "Institution code",
            type: "text",
            validation: Yup.string().required("Institution code is required"),
            isRequired: true
          },
          {
            name: "acrtdBy",
            label: "Accredited By",
            type: "text"
          },
          {
            name: 'insDesc',
            label: "Instiution description",
            type: "Textarea",
          },
          { name: "insLogo", label: "Institute Logo", type: "file", size: '' ,format: 'image' }
    ],
    "Institution contact": [
          {
            name: "addr1",
            label: "Address Line 1",
            type: "text"
          },
        {
            name: "addr2",
            label: "Address Line 2",
            type: "text"
          },
          {
            name: "addr3",
            label: "Address Line 3",
            type: "text"
          },
          {
            name: "pnCd",
            label: "Pincode",
            type: "number"
          },
          {
            name: "cntctNum",
            label: "Contact number",
            type: "number"
          },
          {
            name: "email",
            label: "Email",
            type: "text"
          },
          {
            name: "webSt",
            label: "Website",
            type: "text"
          },

    ],
    "Billing department contact": [
          {
            name: "billCntctNm",
            label: "Contact person name",
            type: "text"
          }, {
            name: "billCntctNum",
            label: "Phone number",
            type: "text"
          }, {
            name: "billCntctMail",
            label: "Email",
            type: "text"
          },
    ],
    "Admission department contact": [
          {
            name: "admCntctNm",
            label: "Contact person name",
            type: "text"
          }, {
            name: "admCntctNum",
            label: "Phone number",
            type: "text"
          }, {
            name: "admCntctMail",
            label: "Email",
            type: "text"
          },
    ],
    "Examination department contact": [
          {
            name: "xmCntctNm",
            label: "Contact person name",
            type: "text"
          }, {
            name: "xmCntctNum",
            label: "Phone number",
            type: "text"
          }, {
            name: "xmCntctMail",
            label: "Email",
            type: "text"
          },
    ],
      "General enquiry": [
          {
            name: "gnCntctNm",
            label: "Contact person name",
            type: "text"
          }, {
            name: "gnCntctNum",
            label: "Phone number",
            type: "text"
          }, {
            name: "gnCntctMail",
            label: "Email",
            type: "text"
          },
    ],
    "Working days": [
      {
        name: 'wrkDys',
        isMulti: true,
        type: "checkbox",
        data: [ 
          { label: "Sunday", value: "SUNDAY" },
          {  label: "Monday", value: "MONDAY"},
          {  label: "Tuesday", value: "TUESDAY"},
          {  label: "Wednesday", value: "WEDNESDAY"},
          {  label: "Thursday", value: "THURSDAY"},
          {  label: "Friday", value: "FRIDAY"},
          {  label: "Saturday", value: "SATURDAY"},]
      }
    ],
    "SMS config": [
      {
            name: "smsUrl",
            label: "Url",
            type: "text"
          },{
            name: "smsPwd",
            label: "Password",
            type: "text"
          },{
            name: "smsUsrId",
            label: "User Id",
            type: "text"
          },{
            name: "smsSndrId",
            label: "Sender Id",
            type: "text"
          },{
            name: "smsApiKey",
            label: "API-key",
            type: "text"
          },
    ],
    "Absent notification": [
    {
      name: 'isAbsNtf',
      validation: Yup.boolean(),
      label: "Can send absent notification",
      type: "checkbox",
      removeHeader: true,
    },
    {
      name: 'absntTmplt',
      label: "Absent notification template",
      type: "Textarea",
      showWhen: {
        field: "isAbsNtf",
        value: true,
      },
      validation: Yup.string().when('isAbsNtf', {
        is: true,
        then: ()=>Yup.string().required('Absent notification template is required'),
        otherwise: ()=>Yup.string(),
      }),
      isRequired: true
    }
  ],

    "Birthday messege": [
          {
            name:"isBdayMsg",
            label: "Can Send Birthday Messege",
            type: "checkbox",
            removeHeader: true
          },
          {
            name: "bDayTmplt",
            label: "Birthday messege template",
            type: "Textarea",
            showWhen: {
              field: "isBdayMsg",
              value: true, 
            },
            validation: Yup.string().when('isBdayMsg', {
              is: true,
              then: ()=>Yup.string().required('Birthday messege template is required'),
              otherwise: ()=>Yup.string(),
            }),
            isRequired: true
          }
    ]
    },
    buttons:[
      {
        name:"Cancel", variant:"outlined", nature:"secondary", onClick:()=>{navigate(-1)}
      },{
        name:"Update", variant:"contained", nature:"primary", type:'submit'
      }
    ]
  };

  //get institute details by institute id
  useEffect(()=>{
    if(user && getInstitute){
      (async()=>{
        const oInstituteDtls = await getInstitute(user?.user?.insId);
        if(oInstituteDtls && Object.keys(oInstituteDtls).length){
          setInstDtls(oInstituteDtls);
        }
      })();
    }
  },[user,getInstitute]);

  //submitting institute form
  const handleFormSubmit = async(values) => {
    try{
      const deepValues =  {...structuredClone(values),_id: instDtls?._id};
      if(values?.insLogo?.length){
        const instLogo = await parseFormDataAndUpload(values?.insLogo);
        if(instLogo?.url){
          deepValues.insLogo = [instLogo.url];
        }
      }
      await updateInstitute(deepValues);
    }catch(err){
      console.error('error while update',err)
    }
  }
  
  return (
    <DynamicForm
      schema={schema}
      pageTitle="Institute config"
      onSubmit={async(values) => {await handleFormSubmit(values)}}
      isEditPerm = {permissions?.['institute-config']?.create}
      oInitialValues={instDtls}
    />
  );
}
