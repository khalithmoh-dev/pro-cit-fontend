import DynamicForm from "../../../../components/generic-form";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from '../../../../store/authStore';
import useProgramStore, { createProgramPayload } from "../../../../store/programStore";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useBaseStore from '../../../../store/baseStore';
import { useToastStore } from "../../../../store/toastStore";

/**
 * CreateProgram Component
 *
 * Manages creation and updating of academic program records.
 *
 * Features:
 * - Create new program with institution and degree association
 * - Update existing program details
 * - Program code and name validation
 * - Duplicate detection for program IDs
 * - Form validation with Yup schema
 *
 * @component
 */
export default function CreateProgram() {
  const navigate = useNavigate();
  const programStore = useProgramStore();
  const { id } = useParams();
  const [editValues, setEditValues] = useState({});
  const { t } = useTranslation();
  const baseStore = useBaseStore();
  const [baseData, setBaseData] = useState<{degree?: any[]}>({ degree: [] });
  const showToast = useToastStore((state) => state.showToast);

  /**
   * Fetch degree options for dropdown on component mount
   */
  useEffect(() => {
    try {
      if (baseStore) {
        (async () => {
          const aReq = ['degree'];
          const oBaseData = await baseStore.getBaseData(aReq);
          setBaseData(oBaseData);
        })();
      }
    } catch (err) {
      showToast('error', t("UNKNOWN_ERROR_OCCURED"));
    }
  }, [baseStore]);

  /**
   * Dynamic form schema defining fields, validation, and buttons
   */
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
              name: "degId",
              label: t("DEGREE"),
              type: "select",
              labelKey: "degNm",
              valueKey: "_id",
              validation: Yup.string().required(t("DEGREE_NAME_IS_REQUIRED")),
              isRequired: true,
              isDisabled: Boolean(id),
              options: baseData?.degree ?? []
            },
            {
              name: "prgCd",
              label: t("PROGRAM_ID"),
              type: "text",
              validation: Yup.string().required(t("PROGRAM_ID_IS_REQUIRED")),
              isDisabled: Boolean(id),
              isRequired: true
            },
            {
              name: "prgNm",
              label: t("PROGRAM_NAME"),
              type: "text",
              validation: Yup.string().required(t("PROGRAM_NAME_IS_REQUIRED")),
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
  }, [t, navigate, baseData, id]);

  /**
   * Fetch program data by ID when in edit mode
   */
  useEffect(() => {
    try {
      (async () => {
        if (id) {
          const oProgram = await programStore.getProgram(id)
          setEditValues(oProgram);
        }
      })()
    } catch (err) {
      showToast('error', t("UNKNOWN_ERROR_OCCURED"));
    }
  }, [id])

  /**
   * Handles program form submission for create/update operations
   * Includes duplicate detection and error handling
   */
  const handleProgramSubmit = async (values: createProgramPayload) => {
    try {
      if (!id) {
        await programStore.createProgram(values);
      } else {
        const oUpdtPayload = {
          ...values,
          _id: id
        }
        await programStore.updateProgram(oUpdtPayload, id);
      }
      showToast('success', id ? t("PROGRAM_UPDATED_SUCCESSFULLY") : t("PROGRAM_CREATED_SUCCESSFULLY"));
      navigate(-1)
    } catch (err) {
      if (err.message === "Duplicate_Found") {
        showToast('error', t("PROGRAM_ID_ALREADY_EXISTS"));
      } else {
        showToast('error', t("UNKNOWN_ERROR_OCCURED"));
      }
    }
  };

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={t("CREATE_PROGRAM")}
        onSubmit={handleProgramSubmit}
        isEditPerm={true}
        isEditDisableDflt={Boolean(id)}
        oInitialValues={id ? editValues : ""}
      />
    </>
  );
}
