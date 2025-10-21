// src/screens/CreateDegree/GenericMaster.jsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SectionHeader from "../SectionHeader";
import Label from "../Label";
import Switch from "../switch";
import Button from "../../components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import useInstituteStore from "../../store/instituteStore";
import useAuthStore from "../../store/authStore";
import SmartField from "../SmartField";
import { useLocation } from "react-router-dom";
import { useLayout } from "../../modules/layout/LayoutContext";
import InputFields from "../inputFields";
import useCheckPermission from "../../hooks/useCheckPermission";

/**
 * GenericMaster Component
 * --------------------------------
 * A dynamic form builder that generates forms from a JSON schema.
 * It supports Formik + Yup validation and smart fields for dynamic form creation.
 *
 * Props:
 * - pageTitle: Optional form title
 * - schema: JSON schema defining form fields and buttons
 * - onSubmit: Submit handler
 * - isEditPerm: Whether editing is permitted
 * - isEditDisableDflt: Whether to disable edit mode by default
 * - oInitialValues: Default values for fields
 * - isSmartField: Enable SmartField rendering
 * - isNotMainForm: Whether it’s a nested form
 */

const GenericMaster = ({
  pageTitle,
  schema,
  onSubmit,
  isEditPerm = false,
  isEditDisableDflt = false,
  oInitialValues,
  isSmartField,
  isNotMainForm = false
}) => {
  // === Local States ===
  const [isEditEnabled, setIsEditEnabled] = useState(!isEditDisableDflt);
  const [instituteDetails, setInstituteDetails] = useState({ _id: "", insname: "" });
  const [multiSelectValues, setMultiSelectValues] = useState([]);

  // === Store Hooks ===
  const instituteStore = useInstituteStore();
  const authStore = useAuthStore();
  const { setRouteNm, setActionFields } = useLayout();
  const location = useLocation();

  // === Load logged-in institute details ===
  useEffect(() => {
    if (authStore?.user && instituteStore.getInstitute) {
      (async () => {
        const loggedInstitute = await instituteStore.getLogInIns();
        if (loggedInstitute && Object.keys(loggedInstitute).length) {
          setInstituteDetails(loggedInstitute);
        }
      })();
    }
  }, [authStore, instituteStore]);

  // === Setup layout route name & edit mode switch ===
  useEffect(() => {
    if (location.pathname) {
      setRouteNm(location.pathname);
      setActionFields([
        <Switch
          key="editSwitch"
          checked={isEditEnabled}
          onChange={() => setIsEditEnabled((prev) => !prev)}
          label="Edit mode"
        />
      ]);
    }
  }, [location.pathname]);

  // === Build Yup validation schema dynamically from JSON ===
  const validationSchema = Yup.object(
    Object.values(schema.fields)
      .flat()
      .reduce((acc, field) => {
        if (field.name && field.validation) {
          acc[field.name] = field.isNullable
            ? field.validation.nullable()
            : field.validation;
        }
        return acc;
      }, {})
  );

  // === Setup Formik instance ===
  const formik = useFormik({
    initialValues: Object.values(schema.fields)
      .flat()
      .reduce((acc, field) => {
        const name = field.name;
        if (name === "insId" && instituteDetails?._id) {
          acc[name] = instituteDetails._id;
        } else if (oInitialValues?.hasOwnProperty(name)) {
          acc[name] = oInitialValues[name];
        } else if (field.isNullable) {
          acc[name] = null;
        } else if (field.isMulti || field.type === "file") {
          acc[name] = [];
        } else if (field.type === "checkbox") {
          acc[name] = false;
        } else if (field.type === "number") {
          acc[name] = null;
        } else {
          acc[name] = "";
        }
        return acc;
      }, {}),
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema,
    onSubmit: (values) => onSubmit(values)
  });

  console.log("formik", formik);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        {/* === Render Each Schema Section === */}
        {Object.entries(schema.fields).map(([sectionName, fields]) => (
          <Box key={sectionName} mb={4}>
            <div className="generic-master-card">
              {sectionName && <SectionHeader sectionName={sectionName} />}

              <div className="fields-row">
                {fields.map((field, index) => {
                  // Conditional field rendering logic
                  const shouldShow =
                    !field.showWhen ||
                    (Array.isArray(field.showWhen?.value)
                      ? field.showWhen.value.includes(
                          formik.values[field.showWhen.field]
                        )
                      : formik.values[field.showWhen.field] ===
                        field.showWhen?.value);

                  if (!shouldShow) return null;

                  return (
                    <div className="field-wrapper" key={index}>
                      {/* Label */}
                      {!field.removeHeader && !isSmartField && (
                        <Label labelName={field.label} required={field.isRequired} />
                      )}

                      {/* Field Renderer */}
                      {isSmartField ? (
                        <SmartField
                          field={field}
                          formik={formik}
                          editPerm={isEditEnabled}
                        />
                      ) : (
                        <InputFields
                          field={field}
                          formik={formik}
                          editPerm={isEditEnabled}
                          aMultiSelectVal={multiSelectValues}
                          setAMultiSelectVal={setMultiSelectValues}
                          oInitialValues={oInitialValues}
                          instDtls={instituteDetails}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Box>
        ))}

        {/* === Form Buttons === */}
        <div className="generic-form-footer">
          <Box display="flex" justifyContent="flex-end" gap={2}>
            {schema.buttons.map((button, idx) => {
              const isSubmitButton = button.type === "submit";
              const isCancelButton = button.name === "Cancel";
              const isResetButton = button.name === "Reset";

              return (
                <Button
                  key={idx}
                  className={`btn-${button?.nature?.toLowerCase()} btn-small`}
                  size={button.size || "medium"}
                  type={button.type ?? "button"}
                  variantType={
                    isSubmitButton
                      ? "submit"
                      : isResetButton
                      ? "reset"
                      : isCancelButton
                      ? "cancel"
                      : "button"
                  }
                  onClick={
                    isResetButton
                      ? formik.handleReset
                      : () => button.onClick && button.onClick(formik)
                  }
                  disabled={
                    button.isDisabled ||
                    (!isCancelButton &&
                      (!isEditEnabled || !formik.isValid))
                  }
                >
                  {button.name}
                </Button>
              );
            })}
          </Box>
        </div>
      </form>
    </div>
  );
};

export default GenericMaster;
