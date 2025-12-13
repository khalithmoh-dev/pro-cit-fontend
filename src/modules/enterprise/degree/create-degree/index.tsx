import DynamicForm from "../../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useDegreeStore, { createDegreePayload } from "../../../../store/degreeStore";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToastStore } from "../../../../store/toastStore";

export default function CreateDegree() {
  const navigate = useNavigate();
  const degreeStore = useDegreeStore();
  const { id } = useParams();
  const [editValues, setEditValues] = useState({});
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);

  //form schema
  const schema = useMemo(() => {
    return (
      {
        fields: {
          General: [
            {
              name: "insId",
              label: t("INSTITUTION_NAME"),
              type: "select",
              validation: Yup.string().required(t("INSTITUTION_NAME_IS_REQUIRED")),
              isRequired: true,
              isDisabled: true
            },
            {
              name: "degCd",
              label: t("DEGREE_ID"),
              type: "text",
              validation: Yup.string().required(t("DEGREE_ID_IS_REQUIRED")),
              isDisabled: Boolean(id),
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
            name: t("CANCEL"), variant: "outlined", nature: "secondary", onClick: () => { navigate(-1) }
          }, ...(!id ? [{
            name: t("RESET"), variant: "outlined", nature: "warning", onClick: () => { }
          }] : []), {
            name: id ? t("UPDATE") : t("SAVE"), variant: "contained", nature: "primary", type: "submit"
          }
        ]
      }
    )
  }, [t, navigate, id])

  //to get degree data by id for update
  useEffect(() => {
    if (id) {
    (async () => {
        const oDegree = await degreeStore.getDegree(id)
        setEditValues(oDegree);
      })()
    }
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
        showToast('success', id ? t("DEGREE_UPDATED_SUCCESSFULLY") : t("DEGREE_CREATED_SUCCESSFULLY"));
        navigate(-1)
      }
    } catch (err) {
      if(err.message === "Duplicate_Found"){
        showToast('error', t("DEGREE_ID_ALREADY_EXISTS"));
      }else{
        showToast('error', t("UNKNOWN_ERROR_OCCURED"));
      }
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
