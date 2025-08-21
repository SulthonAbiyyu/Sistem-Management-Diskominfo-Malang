import Header from "../../components/Header";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

// Custom Toolbar without Export Button
const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const Kondisi = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [kondisi, setKondisi] = useState([]);

  // Fetch data from the 'kondisi' table in the database
  useEffect(() => {
    const fetchKondisi = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kondisi`);
        const data = await response.json();
        setKondisi(data);
      } catch (error) {
        console.error("Error fetching kondisi:", error);
      }
    };

    fetchKondisi();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Apakah kamu yakin ingin menghapus data ini?");
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kondisi/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setKondisi(kondisi.filter(item => item.id !== id));
          console.log(`Item dengan id ${id} berhasil dihapus`);
        } else {
          console.error(`Gagal menghapus kondisi dengan id ${id}`);
        }
      } catch (error) {
        console.error("Error deleting kondisi:", error);
      }
    }
  };

  // Generate columns for the DataGrid
  const columns = [
    {
      field: "no",
      headerName: "NO",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1
    },
    {
      field: "kondisibarang",
      headerName: "Kondisi Barang",
      flex: 2.5,
      cellClassName: "name-column--cell",
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "aksi",
      headerName: "Aksi",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" gap={0.5} alignItems="center">
          <Button
            variant="contained"
            size="small"
            sx={{
              width: "90px",
              fontSize: "14px",
              padding: "2px 11px",
              fontWeight: "bold",
              backgroundColor: theme.palette.mode === 'dark' ? '#ca0128' : '#ff0000',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#ff0000' : '#ca0128',
              },
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            }}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="KONDISI BARANG" />
        <Button
          variant="contained"
          onClick={() => navigate("/tambahkondisi")}
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            padding: "8px 16px",
            backgroundColor: theme.palette.mode === 'dark' ? '#347f6b' : '#4cceac',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
            },
            '&:active': {
              bgcolor: colors.greenAccent[1000],
            },
            mb: 2
          }}
          endIcon={<AddOutlinedIcon />}
        >
          Tambah
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        width="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            lineHeight: "1.5 !important",
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .name-column--cell": {
            color: theme.palette.mode === 'dark' ? 'white' : 'black',
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
            borderBottom: "none",
            borderRadius: "16px 16px 0 0",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
            borderRadius: "0 0 16px 16px",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.grey[100],
          },
          "& .MuiDataGrid-toolbarContainer": {
            color: "black !important",
          },
        }}
      >
        <DataGrid
          rows={kondisi}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          getRowId={(row) => row.id}
          rowHeight={75}
        />
      </Box>
    </Box>
  );
};

export default Kondisi;
