import React, { useEffect, useState } from "react";
import { validateFields } from "./components/validateFields";
import style from "./render-formbuilder.module.css";
import fieldTypes from "./components/fieldTypes";
import Button from "../button";
import { FeeFieldGroup, FieldIF, RenderFormbuilderFormIF } from "../../interface/component.interface";
import httpRequest from "../../utils/functions/http-request";
import useFormStore from "../../store/formStore";
import Spinner from "../spinner";
import CloseIcon from "../../icon-components/CloseIcon";
import addFeeStructure from "../../store/addFeeStructure";
import { AiFillInfoCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import useFeeCategoryStore from "../../store/feeCategoryStore";

import useDepartmentStore from "../../store/quickcollectsettingStore";





const RenderFormbuilderForm: React.FC<RenderFormbuilderFormIF> = ({
  large,
  extraLarge,
  small,
  formName,
  onSubmit,
  existingForm,
  goBack,
  formHeader,
  dynamicOptions,
  update,
  loading,
  onChange
}) => {
  const [fields, setFields] = useState<FieldIF[]>([]);
  const [loadingForm, setLoadingForm] = useState<boolean>(true);
  const { getForms, forms } = useFormStore();
  const [count, setcount] = useState(0);
  const { feeStructure, getFeeStructure, createFeeStructure, updateFeeStructure, studentfeestructure, getAllFeeStructure }: any = addFeeStructure();
  const { feeStructures, getFeeStructures } = useFeeCategoryStore();
  console.log(feeStructures, "feeStructures")


  useEffect(() => {
    getAllFeeStructure();
    getFeeStructures()
  }, [getAllFeeStructure, getFeeStructures]);

  const { id } = useParams()
  // const [feeDetails, setFeeDetails] = useState(null);

  // useEffect(() => {
  //   // Find the fee structure by ID from the response data
  //   const fee = responseData.find((item) => item._id === id);
  //   setFeeDetails(fee);
  // }, [id]);

  const fee = studentfeestructure?.find((item: { _id: string; }) => item._id === id);


  // If a matching fee structure is found, you can extract the fee details
  if (fee) {
    const feeDetails = fee?.fees?.map((fee: { category_name: string; amount: number; }) => ({
      category: fee.category_name,
      amount: fee.amount
    }));

    console.log("Fee Details: ", feeDetails);
  } else {
    console.log("No fee structure found for the given ID.");
  }
  const { getfeeSturatureReceiptSeries, ReceiptSeries }: any = useDepartmentStore();
  useEffect(() => {
    const fetchFeeStructure = async () => {
      try {
        await getFeeStructure();  // Call the API function to get fee structure
      } catch (error) {
        console.error("Error fetching fee structure:", error);
      }
    };

    fetchFeeStructure();
  }, [getFeeStructure]);

  useEffect(() => {
    const fetchParentHeads = async () => {
      try {
        await getfeeSturatureReceiptSeries();
      } catch (error) {
        console.error("Error fetching receipt series", error);
      }
    };
    fetchParentHeads();
  }, [getfeeSturatureReceiptSeries]);

  const [formData, setFormData]: any = useState({
    facility: '',
    fee_structure_title: '',
    display_name: '',
    default_receipt_series: '',
    academic_year: '',
    admission_year: '',
    payment_category: [],
    student_type: '',
  });

  useEffect(() => {
    if ( fee) {
      setFormData({
        facility: fee?.facility,
        fee_structure_title: fee?.fee_structure_title,
        display_name: fee?.display_name,
        default_receipt_series: fee?.default_receipt_series,
        academic_year: fee?.academic_year,
        payment_category: fee?.payment_category,
        student_type: fee?.student_type,
        admission_year: fee?.admission_year,
        // fees: fee?.fees

      })

    }
  }, [ fee])

  const [selectedOptions, setSelectedOptions]: any = useState([]);
  const [selectedname, setSelectedName]: any = useState([]);

  const FeeTypes = ['CET FREE',
    'CET PAYMENT',
    'Mgmt KOD A',
    'Mgmt KOD B',
    'Mgmt KOD C',
    'Mgmt KOD D',
    'Mgmt KOD E',
    'Mgmt KOD F',
    'Mgmt KOD G',
    'Mgmt KOD H',
    'Mgmt KOD I',
    'Mgmt KOD J',
    'Mgmt KAR A',
    'Mgmt KAR B',
    'Mgmt KAR C',
    'Mgmt KAR D',
    'Mgmt NKA A',
    'Mgmt NKA B',
    'Mgmt NKA C',
    'Diploma Mgt A',
    'Mgmt KAR J',
    'DIPLOMA CET',
    'Mgmt KAR A - CV',
    'Mgmt KAR I',
    'Mgmt KAR A - ME',
    'Mgmt KOD A - ME',
    'Mgmt KOD B - ME',
    'Mgmt KAR A - CS',
    'Mgmt KOD E - ME',
    'Mgmt KAR B - CS',
    'Mgmt KAR J - CS',
    'Mgmt KOD A - CS',
    'Mgmt KOD B - CS',
    'Mgmt KOD C - CS',
    'Mgmt KOD E - CS',
    'Mgmt KOD G - CS',
    'Mgmt NKA A - CS',
    'Mgmt NKA B - CS',
    'Mgmt NKA C - CS',
    'Diploma(PYMT)',
    'Mgmt KAR E CS',
    'Mgmt KAR E',
    'Mgmt KAR F',
    'Mgmt NKA D',
    'Hostel', 'Transport', 'Hostel', 'Other'];

  const currentYear = new Date().getFullYear();
  const startYear = 2001;
  const endYear = currentYear + 6;

  const academicYears = [];
  for (let year = startYear; year <= endYear; year++) {
    const nextYear = year + 1;
    academicYears.push(`${year}-${nextYear.toString().slice(-2)}`);
  }

  // Handle change in dropdown and input fields
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox selection for Payment Categories
  const handleCheckboxChange = (e: any) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedOptions(value);

      setFormData((prev: any) => ({
        ...prev,
        payment_category: value, // Only one selected option is stored
      }));
    } else {
      // If unchecked, clear the selection
      setSelectedOptions('');
      setFormData((prev: any) => ({
        ...prev,
        payment_category: '', // Clear the payment category when unchecked
      }));
    }
  };

  const handleYearGroupChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    department: { _id: string }
  ) => {
    const selectedYearGroup = e.target.value;

    setFormData((prev: { department: any[] }) => {
      const updatedDepartments = prev.department.map((dept) => {
        if (dept.department_id === department._id) {
          return { ...dept, yearGroup: selectedYearGroup }; // Update the yearGroup
        }
        return dept;
      });

      return { ...prev, department: updatedDepartments };
    });
  };


  // Handle checkbox selection for Departments
  const handleCheckboxChanges = (
    e: React.ChangeEvent<HTMLInputElement>,
    department: { _id: string; name: string }
  ) => {
    const { checked } = e.target;
    const selectedYearGroup = formData?.department?.find(
      (dept) => dept.department_id === department._id
    )?.yearGroup || ""; // Get the yearGroup for this department

    setFormData((prev: { department: any[] }) => {
      const currentDepartments = Array.isArray(prev.department) ? prev.department : [];

      if (checked) {
        // When checked, add the department along with the selected yearGroup
        return {
          ...prev,
          department: [
            ...currentDepartments,
            { department_id: department._id, yearGroup: selectedYearGroup },
          ],
        };
      } else {
        // When unchecked, remove the department
        return {
          ...prev,
          department: currentDepartments.filter(
            (dept: { department_id: string }) => dept.department_id !== department._id
          ),
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (id) {
      // If an ID is present, attempt to update
      try {
        const success = await updateFeeStructure({ ...formData, id });

        if (success && success.success) {
          alert('Fee Structure updated successfully!');
        } else {
          // Check if the response indicates the structure was not found
          alert(success?.message || 'Failed to update Fee Structure.');
        }
      } catch (error) {
        console.error('Error updating fee structure:', error);
        alert('An error occurred while updating.');
      }
    } else {
      // If no ID, attempt to create a new fee structure
      try {
        const success = await createFeeStructure(formData);

        if (success) {
          goBack();
          alert('Fee Structure created successfully!');
        } else {
          alert('Failed to create Fee Structure.');
        }
      } catch (error) {
        console.error('Error creating fee structure:', error);
        alert('An error occurred while creating.');
      }
    }
  };



  useEffect(() => {
    if (!loadingForm && onChange && count < 4) {
      setcount((count) => count + 1);
      onChange(fields);
    }
  }, [fields]);

  // State to manage dynamic fee field groups
  const [feeFieldGroups, setFeeFieldGroups] = useState<FeeFieldGroup[]>([
    { category_name: "", amount: 0, duration_type: "One-Time", is_mandatory: false, applicable_year: [] }
  ]);
  const [feeFieldErrors, setFeeFieldErrors] = useState<Array<{
    category_name?: string;
    amount?: string;
    duration_type?: string;
    applicable_year?: string;
  }>>([]);

  // State to track visibility of the "Remove Category" button for each group
  const [showRemoveMenu, setShowRemoveMenu] = useState<boolean[]>([]);

  const getFormbuilderFormByName = async (formName: string) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/name`, { name: formName });
      const form = res.data?.form;
      const updatedData = form.map((field: FieldIF) => {
        if (existingForm !== null) {
          field.value = existingForm[field.keyName]
            ? existingForm[field.keyName]
            : field.type === "checkbox"
              ? false
              : "";
        }
        return field;
      });

      setFields(updatedData);
      setLoadingForm(false);

      if (existingForm && existingForm.fees && Array.isArray(existingForm.fees)) {

        setFeeFieldGroups(existingForm.fees);
      }
    } catch (error) {
      console.error('Error:Failed to fetch api', error);
    }
  };

  useEffect(() => {
    const getForm = () => {
      if (formName) {
        const formsCopy = [...JSON.parse(JSON.stringify(forms))];
        const searchResult = formsCopy.find((form) => form.name === formName);
        if (searchResult) {
          const updatedData = searchResult.form.map((field: FieldIF) => {
            if (existingForm !== null) {
              field.value = existingForm[field.keyName]
                ? existingForm[field.keyName]
                : field.type === "checkbox"
                  ? false
                  : "";
            }
            return field;
          });

          setFields(updatedData);
          setLoadingForm(false);

          if (existingForm && existingForm.fees && Array.isArray(existingForm.fees)) {
            setFeeFieldGroups(existingForm.fees);
          }
        } else {
          console.warn("Form not found in the store, fetching from API...");
          getForms();
          getFormbuilderFormByName(formName);
        }
      }
    };
    getForm();
  }, [formName, existingForm]);

  const submitClickHandler = () => {
    const { isValid, updatedFields } = validateFields(fields);


    if (formName === "Create Fee Form") {

      let allFieldsValid = true;
      const updatedErrors = feeFieldGroups.map((group) => {
        const errors: {
          category_name?: string;
          amount?: string;
          duration_type?: string;
          applicable_year?: string;
        } = {};

        // Validate each field
        if (!group.category_name.trim()) {
          errors.category_name = "Category Is Required.";
          allFieldsValid = false;
        }
        if (!group.amount || group.amount <= 0) {
          errors.amount = "Amount Is Required.";
          allFieldsValid = false;
        }
        if (!group.duration_type.trim()) {
          errors.duration_type = "Duration Type Is Required.";
          allFieldsValid = false;
        }
        if (!group.applicable_year || group.applicable_year.length === 0) {
          errors.applicable_year = " Applicable Year Is Required.";
          allFieldsValid = false;
        }
        return errors;
      });


      if (!allFieldsValid) {
        setFeeFieldErrors(updatedErrors);
        return;
      }
    }

    if (!isValid) {
      setFields(updatedFields);
      return;
    }

    const requestBody: {
      [key: string]: string | Array<{
        category_name: string;
        amount: string;
        duration_type: string;
        is_mandatory: boolean;
        applicable_year: number[];
      }>;
    } = {};

    updatedFields.map((field: FieldIF) => {
      requestBody[field.keyName] = field.value;
    });

    requestBody['fees'] = feeFieldGroups.map(group => ({
      category_name: group.category_name,
      amount: group.amount.toString(),
      duration_type: group.duration_type,
      is_mandatory: group.is_mandatory,
      applicable_year: group.applicable_year,
    }));

    onSubmit(requestBody);
  };

  const addFeeFieldGroup = () => {
    setFeeFieldGroups([
      ...feeFieldGroups,
      { category_name: "", amount: 0, duration_type: "One-Time", is_mandatory: false, applicable_year: [] }
    ]);
    setShowRemoveMenu([...showRemoveMenu, false]);
  };

  const toggleRemoveMenu = (index: number) => {
    const updatedShowRemoveMenu = [...showRemoveMenu];

    updatedShowRemoveMenu[index] = !updatedShowRemoveMenu[index];

    setShowRemoveMenu(updatedShowRemoveMenu);
  };

  const handleRemoveFeeFieldGroup = (index: number) => {
    const updatedFeeFields = feeFieldGroups.filter((_, i) => i !== index);

    setFeeFieldGroups(updatedFeeFields);

    const updatedShowRemoveMenu = showRemoveMenu.filter((_, i) => i !== index);

    setShowRemoveMenu(updatedShowRemoveMenu);
  };

  const handleFeeFieldChange = (index: number, field: string, value: string | boolean) => {
    const updatedFeeFields = feeFieldGroups.map((group, i) => {
      if (i === index) {
        return { ...group, [field]: value };
      }
      return group;
    });
    const updatedErrors = feeFieldErrors.map((error: any, i) => {
      if (i === index) {
        return {
          ...error,
          [field]: field === 'applicable_year' && Array.isArray(value) && value.length > 0 ? "" : error[field]
        };
      }
      return error;
    });

    setFeeFieldGroups(updatedFeeFields);
    setFeeFieldErrors(updatedErrors);

  };

  const [semesterInputs, setSemesterInputs] = useState<string[]>(feeFieldGroups.map(() => "")); // State for the semester input

  const handleAddSemester = (index: number) => {
    const semesterNumber = parseInt(semesterInputs[index].trim(), 10); // Use the respective input value

    if (semesterNumber >= 1 && semesterNumber <= 10 && !feeFieldGroups[index].applicable_year.includes(semesterNumber)) {
      const updatedFeeFields = feeFieldGroups.map((group, i) => {
        if (i === index) {
          return { ...group, applicable_year: [...group.applicable_year, semesterNumber] };
        }
        return group;
      });

      const updatedErrors = feeFieldErrors.map((error, i) => {
        if (i === index) {
          return { ...error, applicable_year: "" }; // Clear the error
        }
        return error;
      });
      setFeeFieldErrors(updatedErrors);

      setFeeFieldGroups(updatedFeeFields);
      setSemesterInputs((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
    }
  };


  const handleSemesterInputChange = (index: number, value: string) => {
    const updatedSemesterInputs = [...semesterInputs];
    updatedSemesterInputs[index] = value; // Update the specific index for the input
    setSemesterInputs(updatedSemesterInputs);
  };

  const handleRemoveSemester = (index: number, semester: number) => {
    // Remove a semester from the applicable year array
    const updatedFeeFields = feeFieldGroups.map((group, i) => {
      if (i === index) {
        return { ...group, applicable_year: group.applicable_year?.filter(sem => sem !== semester) };
      }
      return group;
    });
    setFeeFieldGroups(updatedFeeFields);
  };

  return (
    <div className={style.container} onClick={goBack}>
      {loading || loadingForm ? (
        <Spinner />
      ) : (
        <div
          className={`${style.dialogContainer} ${large ? style.large : extraLarge ? style.extraLarge : small ? style.small : ""
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={style.headerContainer}>
            {formHeader}
            <span className={style.closeIcon} onClick={goBack}>
              <CloseIcon />
            </span>
          </div>
          <div className={style.bodyContainer}>
            {formName === "Create Module Form" && (
              <><>
                {fields?.map((field: FieldIF, index: number) => {
                  const Element = fieldTypes.get(field?.type);
                  const isHeader = field?.type === "sectionHeader";

                  return Element ? (
                    <div
                      className={`${style.fieldBox} ${large ? style.fieldBox50 : extraLarge ? style.fieldBox25 : ""} ${isHeader ? style.fieldBox100 : ""} ${field.hide ? style.hide : ""}`}
                      key={`${field.type}_${index}`}
                    >
                      <Element
                        update={update}
                        selectedValue={field.type === "singleSelect" && update
                          ? ""
                          : field.value?._id || field.value}
                        dynamicOptions={dynamicOptions}
                        form={fields}
                        setForm={setFields}
                        index={index}
                        onChange={(value: any) => {
                          handleFeeFieldChange(index, field.keyName, value);
                          if (onChange) onChange(fields);
                        }} />
                    </div>
                  ) : (
                    <div>null</div>
                  );
                })}
              </><div className={style.actionContainer}>
                  <Button onClick={goBack} secondary>
                    Cancel
                  </Button>
                  <Button className={style.submitButton} onClick={submitClickHandler}>
                    {loading ? <Spinner /> : "Submit"}
                  </Button>
                </div></>
            )}

            {/* Fee Fields Section */}

            {formName === 'Create Fee Form' && (
              <div className={style.Generatechallan}>
                <div>
                  <div>
                    <label className={style.generatetext}>
                      Facility <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={style?.inputError}>
                      <select
                        className={style.academySelect}
                        name="facility"
                        onChange={handleInputChange}
                        value={formData.facility}
                      >
                        <option value="" selected>
                          Select Facility
                        </option>
                        <option value="Academic">Academic</option>
                        <option value="Transport">Transport</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={style.generatetext}>
                      Fee Structure Title <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={style?.inputError}>
                      <input
                        type="text"
                        className={style.academySelect}
                        placeholder="Enter Fee Structure Title"
                        name="fee_structure_title"
                        maxLength={250}
                        value={formData.fee_structure_title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className={style.maxigenerate}>(Maximum 250 characters are allowed)</p>
                  </div>

                  <div className={style.generatetext}>
                    <label>
                      Display Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={style?.inputError}>
                      <input
                        type="text"
                        className={style.academySelect}
                        placeholder="Enter fee structure display name"
                        name="display_name"
                        maxLength={30}
                        value={formData.display_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className={style.maxigenerate}>(Maximum 30 characters are allowed)</p>
                  </div>

                  <div>
                    <label className={style.generatetext}>
                      Default Receipt Series <span style={{ color: 'red' }}>*</span>{' '}
                      <span style={{ color: 'black' }}>
                        <AiFillInfoCircle />
                      </span>
                    </label>
                    <div className={style?.inputError}>
                      <select
                        className={style.academySelect}
                        name="default_receipt_series"
                        onChange={handleInputChange}
                        value={formData.default_receipt_series}
                      >
                        <option value="" selected>
                          Select Receipt Series
                        </option>
                        {ReceiptSeries?.map((row: any, index: number) => (
                          <option value={row?.series_preview} key={index}>{row.series_preview}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={style.generatetext}>
                      Academic Year <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={style?.inputError}>
                      <select
                        className={style.academySelect}
                        name="academic_year"
                        onChange={handleInputChange}
                        value={formData.academic_year}
                      >
                        <option value="" selected>
                          Select Academic Year
                        </option>
                        {academicYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className={style.generatetext}>
                    Payment Category <span style={{ color: 'red' }}>*</span>{' '}
                    <span style={{ color: 'black' }}>
                      <AiFillInfoCircle />
                    </span>
                  </label>
                  <form style={{ height: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                    {FeeTypes.map((fee, index) => (
                      <div key={index}>
                        <label
                          style={{
                            gap: '10px',
                            display: 'flex',
                            marginBottom: '5px',
                          }}
                        >
                          <input
                            type="checkbox"
                            value={fee}
                            checked={selectedOptions === fee} // Only check the box if it matches the selected option
                            onChange={handleCheckboxChange} // Handle checkbox change event
                          />
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{fee}</span>
                        </label>
                      </div>
                    ))}
                  </form>

                  <div>
                    <label className={style.generatetext}>
                      Student Type <span style={{ color: 'red' }}>*</span>{' '}
                      <span style={{ color: 'black' }}>
                        <AiFillInfoCircle />
                      </span>
                    </label>
                    <div className={style?.inputError}>
                      <select
                        className={style.academySelect}
                        name="student_type"
                        onChange={handleInputChange}
                        value={formData.student_type}
                      >
                        <option value="" selected>
                          Select Regular / Detain / Direct
                        </option>
                        <option value="REGULAR">REGULAR</option>
                        <option value="DETAIN">DETAIN</option>
                        <option value="Direct Second Year">Direct Second Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={style.generatetext}>
                      Admission Year <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className={style?.inputError}>
                      <select
                        className={style.academySelect}
                        name="admission_year"
                        onChange={handleInputChange}
                        value={formData.admission_year}
                      >
                        <option value="" selected>
                          Select Admission Year
                        </option>
                        {academicYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontWeight: '600' }}>Department and Parent Group</span>
                    <form style={{ height: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                      {feeStructure && Array.isArray(feeStructure) && feeStructure.length > 0 ? (
                        feeStructure.map((department) => (
                          <div key={department?.id} className={style.departmentMain}>
                            <label style={{ gap: '10px', display: 'flex', marginBottom: '5px' }}>
                              <input
                                type="checkbox"
                                value={department?._id}  // Use _id if it exists; otherwise use id
                                checked={formData.department?.some((dept: { department_id: any; }) => dept.department_id === department?._id)}
                                onChange={(e) => handleCheckboxChanges(e, department)}
                              />
                              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {department?.name}
                              </span>
                            </label>
                            {formData?.department?.some((dept: any) => dept.department_id === department._id) && (
                              <div style={{ marginLeft: "20px" }}>
                                <select
                                  id={`year-${department._id}`}
                                  name={`year-${department._id}`}
                                  style={{ padding: '5px', marginLeft: '10px' }}
                                  value={formData?.department?.find((dept) => dept.department_id === department._id)?.yearGroup || ""}
                                  onChange={(e) => handleYearGroupChange(e, department)}
                                >
                                  <option value="">Select Parent Group</option>
                                  {[...Array(department.totalSemesters / 2).keys()].map((yearIndex) => (
                                    <option key={yearIndex} value={yearIndex === 0 ? 'FIRST YEAR' :
                                      yearIndex === 1 ? 'SECOND YEAR' :
                                        yearIndex === 2 ? 'THIRD YEAR' :
                                          yearIndex === 3 ? 'FOURTH YEAR' : 'FIFTH YEAR'}>
                                      {yearIndex === 0 ? 'FIRST YEAR' : yearIndex === 1 ? `SECOND YEAR` : yearIndex === 2 ? "THIRD YEAR" : yearIndex === 3 ? "FOURTH YEAR" : "FIFTH YEAR"}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div>No fee structures available</div>
                      )}
                    </form>
                  </div>


                </div>
              </div>
            )}
            {formName === 'Create Fee Form' && (
              <>
                <div style={{ display: "flex", gap: "12px" }}><button style={{ backgroundColor: "#1a81c1", color: "#fff", border: "none", padding: "8px", borderRadius: "6px" }} className="btn" onClick={handleSubmit}>
                {fee ? 'Update' : 'Add'}

                </button><Button onClick={goBack} secondary>
                    Cancel
                  </Button></div>
              </>
            )}

            

          </div>


        </div>
      )}
    </div>
  );
};

export default RenderFormbuilderForm;
