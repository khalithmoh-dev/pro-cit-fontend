import { useEffect, useRef, useState } from "react";
import DynamicForm from "../../../../components/generic-form";
import * as Yup from "yup";
import useInstituteStore from "../../../../store/instituteStore";
import useBaseStore from '../../../../store/baseStore';
import useAuthStore from '../../../../store/authStore'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToastStore } from "../../../../store/toastStore";

export default function InstiteConfig() {

  interface InstituteDetails {
  _id?: string;
  insLogo?: string[];
  [key: string]: any; // optional, for dynamic form fields
}

  const { updateInstitute, getInstitute } = useInstituteStore();
  const { user, permissions } = useAuthStore();
  const { parseFormDataAndUpload } = useBaseStore()
  const [instDtls, setInstDtls] = useState<InstituteDetails>({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);

  //form schema
  const schema = {
    fields: {
      "GENERAL": [
        {
          name: "insname",
          label: t('INSTITUTION_NAME'),
          type: "text",
          validation: Yup.string().required(t('INSTITUTION_NAME_REQUIRED')),
          isRequired: true,
        },
        {
          name: "insCode",
          label: t('INSTITUTION_CODE'),
          type: "text",
          validation: Yup.string().required(t('INSTITUTION_CODE_IS_REQUIRED')),
          isRequired: true
        },
        {
          name: "acrtdBy",
          label: t('ACCREDITED_BY'),
          type: "text"
        },
        {
          name: 'insDesc',
          label: t('INSTITUTION_DESCRIPTION'),
          type: "Textarea",
        },
        { name: "insLogo", label: t('INSTITUTION_LOGO'), type: "file", size: '', format: 'image' }
      ],
      "INSTITUTION_CONTACT": [
        {
          name: "addr1",
          label: `${t('ADDRESS_LINE')} 1`,
          type: "text"
        },
        {
          name: "addr2",
          label: `${t('ADDRESS_LINE')} 2`,
          type: "text"
        },
        {
          name: "addr3",
          label: `${t('ADDRESS_LINE')} 3`,
          type: "text"
        },
        {
          name: "pnCd",
          label: t('PINCODE'),
          type: "number"
        },
        {
          name: "cntctNum",
          label: t('CONTACT_NUMBER'),
          type: "number"
        },
        {
          name: t("EMAIL"),
          label: t('EMAIL'),
          type: "text"
        },
        {
          name: "webSt",
          label: t("WEBSITE"),
          type: "text"
        },

      ],
      "BILLING_DEPARTMENT_CONTACT": [
        {
          name: "billCntctNm",
          label: t('CONTACT_PERSON_NAME'),
          type: "text"
        }, {
          name: "billCntctNum",
          label: t("PHONE_NUMBER"),
          type: "text"
        }, {
          name: "billCntctMail",
          label: t("EMAIL"),
          type: "text"
        },
      ],
      "ADMISSION_DEPARTMENT_CONTACT": [
        {
          name: "admCntctNm",
          label: t('CONTACT_PERSON_NAME'),
          type: "text"
        }, {
          name: "admCntctNum",
          label: t("PHONE_NUMBER"),
          type: "text"
        }, {
          name: "admCntctMail",
          label: t("EMAIL"),
          type: "text"
        },
      ],
      "EXAMINATION_DEPARTMENT_CONTACT": [
        {
          name: "xmCntctNm",
          label: t('CONTACT_PERSON_NAME'),
          type: "text"
        }, {
          name: "xmCntctNum",
          label: t("PHONE_NUMBER"),
          type: "text"
        }, {
          name: "xmCntctMail",
          label: t("EMAIL"),
          type: "text"
        },
      ],
      "GENERAL_ENQUIRY": [
        {
          name: "gnCntctNm",
          label: t('CONTACT_PERSON_NAME'),
          type: "text"
        }, {
          name: "gnCntctNum",
          label: t("PHONE_NUMBER"),
          type: "text"
        }, {
          name: "gnCntctMail",
          label: t("EMAIL"),
          type: "text"
        },
      ],
      "WORKING_DAYS": [
        {
          name: 'wrkDys',
          isMulti: true,
          type: "checkbox",
          data: [
            { label: t("SUNDAY"), value: "SUNDAY" },
            { label: t("MONDAY"), value: "MONDAY" },
            { label: t("TUESDAY"), value: "TUESDAY" },
            { label: t("WEDNESDAY"), value: "WEDNESDAY" },
            { label: t("THURSDAY"), value: "THURSDAY" },
            { label: t("FRIDAY"), value: "FRIDAY" },
            { label: t("SATURDAY"), value: "SATURDAY" },]
        }
      ],
      "SMS_CONFIGURATION": [
        {
          name: "smsUrl",
          label: t("URL"),
          type: "text"
        }, {
          name: "smsPwd",
          label: t("PASSWORD"),
          type: "text"
        }, {
          name: "smsUsrId",
          label: t("USER_ID"),
          type: "text"
        }, {
          name: "smsSndrId",
          label: t("SENDER_ID"),
          type: "text"
        }, {
          name: "smsApiKey",
          label: t("API_KEY"),
          type: "text"
        },
      ],
      "ABSENT_NOTIFICATION": [
        {
          name: 'isAbsNtf',
          validation: Yup.boolean(),
          label: t("CAN_SEND_ABSENT_NOTIFICATION"),
          type: "checkbox",
          removeHeader: true,
        },
        {
          name: 'absntTmplt',
          label: t('ABSENT_NOTIFICATION_TEMPLATE'),
          type: "Textarea",
          showWhen: {
            field: "isAbsNtf",
            value: true,
          },
          validation: Yup.string().when('isAbsNtf', {
            is: true,
            then: () => Yup.string().required(t('ABSENT_NOTIFICATION_TEMPLATE_IS_REQUIRED')),
            otherwise: () => Yup.string(),
          }),
          isRequired: true
        }
      ],

      "BIRTHDAY_MESSAGE": [
        {
          name: "isBdayMsg",
          label: t("CAN_SEND_BIRTHDAY_MESSAGE"),
          type: "checkbox",
          removeHeader: true
        },
        {
          name: "bDayTmplt",
          label: t('BIRTHDAY_MESSAGE_TEMPLATE'),
          type: "Textarea",
          showWhen: {
            field: "isBdayMsg",
            value: true,
          },
          validation: Yup.string().when('isBdayMsg', {
            is: true,
            then: () => Yup.string().required(t('BIRTHDAY_MESSAGE_TEMPLATE_IS_REQUIRED')),
            otherwise: () => Yup.string(),
          }),
          isRequired: true
        }
      ]
    },
    buttons: [
      {
        name: "Cancel", variant: "outlined", nature: "secondary", onClick: () => { navigate(-1) }
      }, {
        name: "Update", variant: "contained", nature: "primary", type: 'submit'
      }
    ]
  };

  //get institute details by institute id
  useEffect(() => {
    if (user && getInstitute) {
      (async () => {
        try {
          const oInstituteDtls = await getInstitute(user?.user?.insId);
          if (oInstituteDtls && Object.keys(oInstituteDtls).length) {
            setInstDtls(oInstituteDtls);
          }
        } catch (err) {
          showToast('error', `${t("FAILED_TO_FETCH")} ${t('INSTITUTION')} ${t('DETAILS')}`);
        }
      })();
    }
  }, [user, getInstitute]);

  //submitting institute form
  const handleFormSubmit = async (values) => {
    try {
      const deepValues = { ...structuredClone(values), _id: instDtls?._id };
      if (values?.insLogo?.length && values.insLogo[0] !== instDtls?.insLogo?.[0]) {
        try {
          const instLogo = await parseFormDataAndUpload(values?.insLogo);
          if (instLogo?.url) {
            deepValues.insLogo = [instLogo.url];
          }
        } catch (err) {
          showToast('error', `${t("FAILED_TO_UPLOAD")} ${t('INSTITUTE_LOGO')}`);
        }
      }
      await updateInstitute(deepValues);
      showToast('success', `${t('INSTITUTION')} ${t('DETAILS')} ${t("UPDATED_SUCCESSFULLY")}`);
    } catch (err) {
      showToast('error', `${t("FAILED_TO_UPDATE")} ${t('INSTITUTION')} ${t('DETAILS')}`);
    }
  }

  return (
    <DynamicForm
      schema={schema}
      pageTitle="Institute config"
      onSubmit={async (values) => { await handleFormSubmit(values) }}
      isEditPerm={permissions?.['institute-config']?.create}
      oInitialValues={instDtls}
    />
  );
}
