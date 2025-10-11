// src/screens/CreateDegree/GenericMaster.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
} from "@mui/material";
import SectionHeader from '../SectionHeader';
import Label from '../Label';
import Switch from '../switch'
import Button from '../../components/Button';
import { useFormik } from "formik";
import * as Yup from "yup";
import useInstituteStore from "../../store/instituteStore";
import useAuthStore from '../../store/authStore'
import SmartField from "../SmartField";
import { useLocation } from "react-router-dom";
import { useLayout } from '../../modules/layout/LayoutContext'
import InputFields from "../inputFields";

/** The generic form component to generate form dynamically using a JSON
    The working json can be referred from institute config
    Yup validaion type etc can be handled from sample json
    props defnation:
      - pageTitle?: title of the page
      - schema: Json schema with inputs
      - onSubmit: onSubmit function
*/

const GenericMaster = ({ pageTitle, schema, onSubmit, isEditPerm = false, isEditDisableDflt = false, oInitialValues, isSmartField }) => {
  const [editPerm, setEditPerm] = useState(!isEditDisableDflt);
  const [instDtls, setInstDtls] = useState({ _id: '', insname: '' });
  const [aMultiSelectVal, setAMultiSelectVal] = useState([]);
  const instituteStore = useInstituteStore();
  const { setRouteNm,setActionFields } = useLayout();
  const authStore = useAuthStore();
  const location = useLocation();
  useEffect(() => {
    if (authStore?.user && instituteStore.getInstitute) {
      (async () => {
        const oInstituteDtls = await instituteStore.getLogInIns();
        if (oInstituteDtls && Object.keys(oInstituteDtls).length) {
          setInstDtls(oInstituteDtls);
        }
      })();
    }
  }, [authStore, instituteStore]);

  useEffect(() => {
    if (location.pathname) {
      setRouteNm(location.pathname);
      setActionFields([<Switch checked={editPerm} onChange={() => {
        setEditPerm(prevEditPerm => {
          return !prevEditPerm;
        });
      }} label="Edit mode" />])
    }
  }, [location.pathname]);

  // Build validation schema
  const validationSchema = Yup.object(
    Object.values(schema.fields).flat().reduce((acc, field) => {
      if (field.isNullable) {
          acc[field.name] = field.validation.nullable();
      } else if (field.name && field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {})
  );
  const formik = useFormik({
    initialValues: Object.values(schema.fields)
      .flat()
      .reduce((acc, field) => {
        if (field.name === "insId" && instDtls?._id && instDtls?.insname) {
          acc[field.name] = instDtls?._id;
        } else if (oInitialValues && oInitialValues.hasOwnProperty(field.name)) {
          // Use value from oInitialValues if available
          acc[field.name] = oInitialValues[field.name];
        } else if (field.isNullable) {
          acc[field.name] = null;
        } else if (field.isMulti || field.type === 'file') {
          acc[field.name] = [];
        } else if (field.type === "checkbox") {
          acc[field.name] = false;
        } else if (field.type === "number") {
          acc[field.name] = null;
        } else {
          acc[field.name] = "";
        }
        return acc;
      }, {}),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validationSchema,
  });

  return (
    <div>
      {/* White Card Wrapper */}
      <form
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        {Object.entries(schema.fields).map(([sectionName, fields]) => (
          <Box key={sectionName} mb={4}>
            {/* Section Heading */}
            <div className="generic-master-card">
              <SectionHeader sectionName={sectionName} />
              <div className="fields-row">
                {fields.map((field, index) => {
                  const shouldShow =
                    !field.showWhen ||
                    (field.showWhen && Array.isArray(field.showWhen.value)
                      ? // if showWhen.value is an array, check membership
                      field.showWhen.value.includes(formik.values[field.showWhen.field])
                      : // otherwise, check equality
                      formik.values[field.showWhen.field] === field.showWhen.value
                    );
                  if (!shouldShow) return null;
                  return (
                    <div className="field-wrapper" key={index}>
                      {!field.removeHeader && !isSmartField && (
                        <Label labelName={field.label} required={field.isRequired} />
                      )}
                      {isSmartField ? <SmartField field={field} formik={formik} editPerm={editPerm} /> : (
                      <InputFields
                        field={field}
                        formik={formik}
                        editPerm={editPerm}
                        aMultiSelectVal={aMultiSelectVal}
                        setAMultiSelectVal={setAMultiSelectVal}
                        oInitialValues={oInitialValues}
                        instDtls={instDtls}
                      />
                    )}
                    </div>
                  );
                })}
              </div>
            </div>

          </Box>
        ))}


          {/* Buttons */}
          <div className="generic-form-footer">
            <Box display="flex" justifyContent="flex-end" gap={2} >
              {schema.buttons.map((btn, idx) => {
                return (
                <Button
                  key={idx}
                  className={`btn-${btn?.nature?.toLowerCase()} btn-small`}
                  size={btn.size || "medium"}
                  onClick={btn.name === "Reset" ? formik.handleReset : btn.onClick}
                  type={btn.type ?? 'button'}
                  disabled={btn.isDisabled || (btn.name !== "Cancel" && (!editPerm || btn.isDisabled))}
                  variantType={
                    btn.type === "submit"
                      ? "submit"
                      : btn.name === "Reset"
                        ? "reset"
                        : btn.name === "Cancel"
                          ? "cancel"
                          : "button"
                  }
                >
                  {btn.name}
                </Button>
              )})}
            </Box>
        </div>
      </form>
    </div >
  );
};


export default GenericMaster;
