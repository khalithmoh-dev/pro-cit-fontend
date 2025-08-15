import React, { useEffect, useState } from 'react';
import { FaCircle, FaPen } from 'react-icons/fa';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { MdDelete } from 'react-icons/md';

const getDayOfYear = (date: Date): number => {
  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
};
const ReceiptSeries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editConcessionId, setEditConcessionId] = useState<string | null>(null); // To track which concession to edit
  const [parentHeadName, setParentHeadName] = useState('');
  const [description, setDescription] = useState('');
  const [amountType, setAmountType] = useState('');
  const [amount, setAmount] = useState<any>();
  const [series_preview, setSeriesPreview] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { createReceiptSeries, getReceiptSeries, ReceiptSeries, updateReceiptSeries, deletefeereceipt }: any = useDepartmentStore();


  useEffect(() => {
    if (!editConcessionId) {
      setParentHeadName('')
      setDescription('')
      setAmount('')
      setSeriesPreview('')
    }
  }, [editConcessionId])

  useEffect(() => {
    const fetchParentHeads = async () => {
      try {
        await getReceiptSeries(filterStatus); // Fetch receipt series on component load
      } catch (error) {
        console.error("Error fetching receipt series", error);
      }
    };
    fetchParentHeads();
  }, [getReceiptSeries, filterStatus]);

  useEffect(() => {
    const fetchParentHeads = async () => {
      try {
        await getReceiptSeries(filterStatus);
      } catch (error) {
        console.error("Error fetching receipt series", error);
      }
    };
    fetchParentHeads();
  }, [getReceiptSeries, filterStatus]);

  useEffect(() => {
    const generateSeriesPreview = () => {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const yearFull = today.getFullYear();
      const yearShort = yearFull.toString().slice(2);
      const weekNumber = Math.ceil((today.getDate() + 6 - today.getDay()) / 7);
      const weekDay = today.getDay();
      const dayOfYear = getDayOfYear(today);


      const dateMap: { [key: string]: string } = {
        d: day,
        j: today.getDate().toString(),
        m: month,
        n: (today.getMonth() + 1).toString(),
        Y: yearFull.toString(),
        y: yearShort,
        W: weekNumber.toString(),
        N: (weekDay === 0 ? 7 : weekDay).toString(),
        w: weekDay.toString(),
        z: dayOfYear.toString(),
      };


      const formattedDate = description.split('').map((char) => dateMap[char] || char).join('');


      const formattedAmount = parseInt(amount, 10) || 0;
      const receiptNumber = (formattedAmount - amount + 1).toString().padStart(formattedAmount, '0');

      const preview = `${parentHeadName}${formattedDate}${receiptNumber}`;
      setSeriesPreview(preview);
    };


    if (parentHeadName && description && amount) {
      generateSeriesPreview();
    }
  }, [parentHeadName, description, amount]);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEditClick = (row: any) => {
    setIsModalOpen(true); // Open modal when editing
    setEditConcessionId(row._id); // Set the ID of the selected receipt series
    setParentHeadName(row.receipt_series_text);
    setDescription(row.date_format);
    setSeriesPreview(row.series_preview);
    setAmount(row.num_of_preceding_zeroes.toString());  // Ensure it's a string for the input field
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
    setEditConcessionId(null); // Reset edit state
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Ensure the value is a valid positive number
    if (newValue === '' || (parseFloat(newValue) >= 0 && !isNaN(parseFloat(newValue)))) {
      setAmount(newValue);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsedAmount = parseFloat(amount);

    const payload = {
      receipt_series_text: parentHeadName,
      date_format: description,
      series_preview: series_preview,
      num_of_preceding_zeroes: parsedAmount, // Amount as a number
      status: "Active", // Default status set to Active
    };

    try {
      if (editConcessionId) {
        // Update existing receipt series
        const result = await updateReceiptSeries(editConcessionId, payload);
        if (result) {
          console.log("Receipt series updated successfully");
          // Update the ReceiptSeries array to reflect the changes
          const updatedSeries = ReceiptSeries.map((item: any) =>
            item._id === editConcessionId ? { ...item, ...payload } : item
          );
          // Update the state with the updated list
          getReceiptSeries(updatedSeries);
          handleCancelClick(); // Close the modal after success
        } else {
          console.error("Error updating receipt series");
        }
      } else {
        // Create new receipt series
        const result = await createReceiptSeries(payload);
        if (result) {
          console.log("Receipt series created successfully");
          handleCancelClick();  // Close the modal after success
        } else {
          console.error("Error creating receipt series");
        }
      }
    } catch (error) {
      console.error("API call failed", error);
    }
  };


  const [searchQuery, setSearchQuery] = useState('');

  // Handle the change in search query
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter the ReceiptSeries based on the search query
  const filteredReceiptSeries = ReceiptSeries?.filter((row: any) => {
    // Check for the filterStatus first
    let statusCondition = true;
    if (filterStatus === "Active") {
      statusCondition = row.status === "Active";  // Only show active status
    } else if (filterStatus === "Inactive") {
      statusCondition = row.status === "Inactive";  // Only show Inactive status
    }

    // Now check if the searchQuery is included in receipt_series_text (case insensitive)
    const searchCondition = row.receipt_series_text.toLowerCase().includes(searchQuery.toLowerCase());

    // Return row if both conditions (status and search) are met
    return statusCondition && searchCondition;
  });

  const handleDelete = (row: any) => {
    // Show confirmation or directly delete


    deletefeereceipt(row._id); // Make sure row has an id to delete

  };

  return (
    <div>
      <div style={{ margin: '0 3rem' }}>
        <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Receipt Series</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div>  <input className='academySelect' placeholder='Search by receipt text'
              value={searchQuery}
              onChange={handleSearch} /></div>
            <div> </div></div>
          <select className='academySelect' style={{ width: 'max-content' }} value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value=''>Select Status</option>
            <option value='Active'>Active</option>
            <option value='Inactive'>InActive</option>
          </select>
          <span onClick={openModal} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
            + Add receipt series
          </span>
        </div>
        <div >
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <div style={{ backgroundColor: "#0465ac", padding: "14px", color: "white", display: "flex", justifyContent: "space-between" }}>
                  Add Receipt Series <span onClick={closeModal}>X</span>
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ padding: "16px", borderRadius: "7px", backgroundColor: "#fff3d4", boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>  <p className='notecontant'>Note</p>
                    <div className='notespan'><span className='notecontant'> <FaCircle size={6} />
                      Series Text:</span > Enter the text to be used for the receipt series. Example: "COMP"</div>
                    <div className='notespan' ><span className='notecontant'> <FaCircle size={6} />Payment Date Format: </span> Copy below letters and paste it in a sequence in the input box to create payment date format as per your requirement</div>
                    <table style={{ width: '100%', marginTop: '20px', textAlign: 'left' }}>

                      <tbody>
                        <tr style={{ fontSize: "13px", fontWeight: "300" }}>
                          <td> <span style={{ fontWeight: "600" }}>d</span>  The day of the month (from 01 to 31)</td>
                          <td><span style={{ fontWeight: "600" }}>W</span>   The ISO-8601 week number of year (weeks starting on Monday)</td>

                        </tr>
                        <tr style={{ fontSize: "13px", fontWeight: "300" }}>
                          <td><span style={{ fontWeight: "600" }}>j</span>  The day of the month without leading zeros (1 to 31)</td>
                          <td> <span style={{ fontWeight: "600" }}>m</span>  A numeric representation of a month (from 01 to 12)</td>

                        </tr>
                        <tr style={{ fontSize: "13px", fontWeight: "300" }}>
                          <td><span style={{ fontWeight: "600" }}>N</span>  The ISO-8601 numeric representation of a day (1 for Monday, 7 for Sunday)</td>
                          <td><span style={{ fontWeight: "600" }}>n</span>   A numeric representation of a month, without leading zeros (1 to 12)</td>

                        </tr>

                        <tr style={{ fontSize: "13px", fontWeight: "300" }}>
                          <td><span style={{ fontWeight: "600" }}>w</span>  A numeric representation of the day (0 for Sunday, 6 for Saturday)</td>
                          <td> <span style={{ fontWeight: "600" }}>Y</span> A four digit representation of a year (2024)</td>

                        </tr>
                        <tr style={{ fontSize: "13px", fontWeight: "300" }}>
                          <td><span style={{ fontWeight: "600" }}>z</span> The day of the year (from 0 through 365)</td>
                          <td><span style={{ fontWeight: "600" }}>y</span>  A two digit representation of a year (24)</td>

                        </tr>
                      </tbody>
                    </table>
                    <div className='notespan'><span className='notecontant'><FaCircle size={6} /> Preceding Zeroes: </span> Enter the number of preceding zeroes for the first receipt number. The receipt count will get incremented for the next receipts.Example: If set to "4," the receipt number will be ".</div>
                    <div className='notespan' style={{ marginLeft: "10px" }}>formatted as "0001".</div>
                    <div className='notespan'><FaCircle size={6} /> The preview will display <span style={{ fontWeight: "600" }}>"COMP150220240001"</span> for a receipt issued on February 15, 2024.</div>
                  </div>
                  <div style={{ display: "flex", gap: '38px', marginTop: "15px" }}>
                    <div>
                      <label className="parentGroup"> Enter Receipt Series Text<span style={{ color: "red" }}>*</span></label>
                      <input className='academySelect' placeholder='Enter Receipt Series Text'
                        id="name"
                        value={parentHeadName}
                        onChange={(e) => setParentHeadName(e.target.value)} />
                      <span style={{ fontSize: "12px" }}>Maximum 50 characters are allowed.</span>
                    </div>
                    <div>
                      <label className="parentGroup"> Payment Date Format<span style={{ color: "red" }}>*</span></label>
                      <input className='academySelect' placeholder='Enter Payment Date Format'
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                      <label className="parentGroup"> Number of Preceding Zeroes<span style={{ color: "red" }}>*</span></label>
                      <input className='academySelect' placeholder='Enter Number of Preceding Zeroes'
                        id="amount"
                        type='number'
                        value={amount}


                        onChange={handleAmountChange}
                        required

                        min="0" />
                    </div>
                  </div>
                  <div>
                    <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}>Series Preview<span style={{ color: "red" }}>*</span></label>
                    <input className='academySelect' placeholder='Enter Series Preview'
                      id='series_preview'
                      value={series_preview}
                      onChange={(e) => setSeriesPreview(e.target.value)} />
                  </div>
                  <div className='buttonnote'>
                    <button className="cancel" onClick={handleCancelClick}>Cancel</button>
                    <button className="add" onClick={handleSubmit}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <table style={{ width: '100%', marginTop: '20px', textAlign: 'left', }}>
            <thead>
              <tr style={{ fontSize: "13px", fontWeight: "400", backgroundColor: "#f5f7fb" }}>
                <th>Receipt Series Text</th>
                <th>Receipt Series Preview</th>
                <th>Payment Date Format</th>
                <th>Number of Preceding Zeros</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceiptSeries?.map((row: any, index: any) => (
                <tr key={index} style={{ fontSize: "13px", fontWeight: "300" }}>
                  <td>{row.receipt_series_text}</td>
                  <td>{row.series_preview}</td>
                  <td>{row.date_format}</td>
                  <td>{row.num_of_preceding_zeroes}</td>
                  <td>{row.status}</td>
                  <td>
                    <FaPen style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClick(row)}  // Trigger edit function with the row data

                    />
                    <MdDelete size={16} onClick={() => handleDelete(row)} style={{ marginLeft: '10px', cursor: 'pointer', color: "red" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceiptSeries;
