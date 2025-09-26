import DynamicForm from "../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useSectionStore, { createSectionPayload } from "../../../store/sectionStore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateSection() {
  const navigate = useNavigate();
  const sectionStore = useSectionStore();
  const { id } = useParams();
  const [editValues, setEditValues] = useState({});
  const { t } = useTranslation();

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
          name: "secCd",
          label: t("SECTION_CODE"),
          type: "text",
          validation: Yup.string().required(t("SECTION_CODE_IS_REQUIRED")),
          isDisabled: Boolean(id),
          isRequired: true
        },
        {
          name: "secNm",
          label: t("SECTION_NAME"),
          type: "text",
          validation: Yup.string().required(t("SECTION_NAME_IS_REQUIRED")),
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
      }, ...(!id ? [{
        name: t("RESET"), variant: "outlined", color: "warning", onClick: () => { }
      }] : []), {
        name: id ? t("UPDATE") : t("SAVE"), variant: "contained", color: "primary", type: "submit"
      }
    ]
  };


  //to get section data by id for update
  useEffect(() => {
    (async () => {
      if (id) {
        const oSection = await sectionStore.getSection(id)
        setEditValues(oSection);
      }
    })()
  }, [id])

  const handleSectionSubmit = async (values: createSectionPayload) => {
    try {
      delete values.sectionCode;
      if (!id) {
        await sectionStore.createSection(values);
      } else {
        const oUpdtPayload = {
          ...values,
          _id: id
        }
        await sectionStore.updateSection(oUpdtPayload);
      }
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={t("CREATE_SECTION")}
        onSubmit={handleSectionSubmit}
        isEditPerm={true}
        isEditDisableDflt={Boolean(id)}
        oInitialValues={id ? editValues : ""}
      />
    </>
  );
}
