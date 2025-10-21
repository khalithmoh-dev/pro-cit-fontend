import React from "react";
import { Box, Button, Typography, IconButton, Select, MenuItem } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomPagination = ({
  page,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const visiblePages = 5; // how many page buttons to show
  const startPage = Math.max(1, page - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
        px: 2,
        mt: 2,
        borderRadius: 3,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      {/* Rows per page selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{
          marginTop: '2px'
        }
        }>Rows per page:</Typography>
        <Select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          size="small"
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Previous button */}
      <IconButton
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <ChevronLeft />
      </IconButton>

      {/* Page numbers */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {startPage > 1 && <Typography sx={{ px: 1 }}>...</Typography>}
        {pages.map((p) => (
          <Button
            key={p}
            onClick={() => onPageChange(p)}
            sx={{
              minWidth: 32,
              height: 32,
              borderRadius: "50%",
              px: 0,
              color: p === page ? "#fff" : "#1976d2",
              backgroundColor: p === page ? "#1976d2" : "transparent",
              "&:hover": {
                backgroundColor: p === page ? "#1565c0" : "rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            {p}
          </Button>
        ))}
        {endPage < totalPages && <Typography sx={{ px: 1 }}>...</Typography>}
      </Box>

      {/* Next button */}
      <IconButton
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default CustomPagination;
