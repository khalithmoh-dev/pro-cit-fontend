// App.jsx

import React from 'react';
import GenericTable from '../../common/generic-table';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const columns = [
  { id: 'degreeId', label: 'Degree ID' },
  { id: 'degreeName', label: 'Degree Name' },
  { id: 'description', label: 'Description' },  
  { id: 'institution', label: 'Institution' },
];
const rows= [
  {
    "degreeId": "BCS",
    "degreeName": "Bachelor of Computer Science",
    "description": "Undergraduate program focusing on algorithms, programming, and software development.",
    "institution": "Massachusetts Institute of Technology"
  },
  {
    "degreeId": "MBA",
    "degreeName": "Master of Business Administration",
    "description": "Postgraduate degree emphasizing leadership, strategy, and business management.",
    "institution": "Harvard Business School"
  },
  {
    "degreeId": "BME",
    "degreeName": "Bachelor of Mechanical Engineering",
    "description": "Undergraduate program in design, manufacturing, and thermal engineering.",
    "institution": "Indian Institute of Technology Bombay"
  },
  {
    "degreeId": "MDS",
    "degreeName": "Master of Data Science",
    "description": "Graduate program focusing on big data, AI, and predictive analytics.",
    "institution": "Stanford University"
  },
  {
    "degreeId": "PHDPHY",
    "degreeName": "Doctor of Philosophy in Physics",
    "description": "Research-based doctoral degree in quantum mechanics, astrophysics, and materials science.",
    "institution": "California Institute of Technology"
  },
  {
    "degreeId": "BAPSY",
    "degreeName": "Bachelor of Arts in Psychology",
    "description": "Study of human behavior, mental processes, and social interactions.",
    "institution": "University of California, Berkeley"
  },
  {
    "degreeId": "MPH",
    "degreeName": "Master of Public Health",
    "description": "Graduate degree focusing on epidemiology, health policy, and global health.",
    "institution": "Johns Hopkins University"
  },
  {
    "degreeId": "BCE",
    "degreeName": "Bachelor of Civil Engineering",
    "description": "Program emphasizing structural design, transportation, and environmental engineering.",
    "institution": "National University of Singapore"
  },
  {
    "degreeId": "MAI",
    "degreeName": "Master of Artificial Intelligence",
    "description": "Advanced program on neural networks, natural language processing, and robotics.",
    "institution": "Carnegie Mellon University"
  },
  {
    "degreeId": "BCOM",
    "degreeName": "Bachelor of Commerce",
    "description": "Undergraduate program covering finance, accounting, and business economics.",
    "institution": "University of Melbourne"
  }
];

const DegreeListPage = () =>  {
  return (
    <div style={{ padding: 20 }}>
      <h2>Degrees</h2>
      <div style={{float : "right"}}>
        <Stack direction="row" spacing={2}>
      {/* New Button */}
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={() => alert("New record")}
      >
        New
      </Button>

      {/* Edit Button */}
      <Button 
        variant="outlined" 
        color="secondary" 
        startIcon={<EditIcon />}
        onClick={() => alert("Edit record")}
      >
        Edit
      </Button>
    </Stack>
      </div>
      
      <GenericTable columns={columns} rows={rows} />
    </div>
  );
}

export default DegreeListPage;
