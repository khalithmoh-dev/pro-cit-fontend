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

  //form schema
  const schema = {
    fields: {
      General: [
        {
          name: "insId",
          label: t("INSTITUITION_NAME"),
          type: "select",
          validation: Yup.string().required(t("INSTITUITION_NAME_IS_REQUIRED")),
          isRequired: true,
          isDisabled: true
        },
        {
          name: "degCd",
          label: t("DEGREE_ID"),
          type: "text",
          validation: Yup.string().required(t("DEGREE_ID_IS_REQUIRED")),
          isRequired: true
        },
        {
          name: "degNm",
          label: t("DEGREE_NAME"),
          type: "text",
          validation: Yup.string().required(t("DEGREE_NAME_IS_REQUIRED")),
          isRequired: true
        },
        {
          name: "desc",
          label: t("DESCRIPTION"),
          type: "text"
        }
      ]
    },
    buttons: [
      {
        name: t("CANCEL"), variant: "outlined", color: "secondary", onClick: () => { navigate(-1) }
      }, ...(id ? [{
        name: t("RESET"), variant: "outlined", color: "warning", onClick: () => { }
      }] : []), {
        name: id ? t("UPDATE") : t("SAVE"), variant: "contained", color: "primary", type: "submit"
      }
    ]
  };

  //to get degree data by id for update
  useEffect(() => {
    (async () => {
      if (id) {
        const oDegree = await degreeStore.getDegree(id)
        setEditValues(oDegree);
      }
    })()
  }, [id])

  // to handle submssion of form
  const handleDegreeSubmit = async (values: createDegreePayload) => {
    let isSuccess = false
    try {
      if (!id) {
        isSuccess = await degreeStore.createDegree(values);
      } else {
        const oUpdtPayload = {
          ...values,
          _id: id
        }
        isSuccess = await degreeStore.updateDegree(oUpdtPayload);
      }
      if(isSuccess){
        navigate(-1)
      }
    } catch (err) {
      console.log('in to errorrrrrrrr')
      console.error(err)
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={t("CREATE_DEGREE")}
        onSubmit={handleDegreeSubmit}
        isEditPerm={true}
        isEditDisableDflt={Boolean(id)}
        oInitialValues={id ? editValues : ""}
      />
    </>
  );
}
