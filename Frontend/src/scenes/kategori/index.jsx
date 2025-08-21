import Header from "../../components/Header";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const Kategori = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]); // State untuk data yang ditampilkan di tabel
  const navigate = useNavigate();

  // Fetch data dari tabel kategori dan subkategori di database
  useEffect(() => {
    const fetchKategoriDanSubkategori = async () => {
      try {
        const kategoriResponse = await fetch(`${process.env.REACT_APP_API_URL}/kategori`);
        const kategoriData = await kategoriResponse.json();

        const subkategoriResponse = await fetch(`${process.env.REACT_APP_API_URL}/subkategori`);
        const subkategoriData = await subkategoriResponse.json();

        // Transformasi data agar setiap baris mewakili satu subkategori
        const transformedData = kategoriData.map((kat) => {
          return {
            id: kat.id,
            kategori: kat.namakategori,
            subkategori: subkategoriData.filter((sub) => sub.kategoriId === kat.id),
          };
        });

        setRows(transformedData); // Set data ke state 'rows'
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchKategoriDanSubkategori();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editkategori/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Apakah kamu yakin ingin menghapus data ini?");
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kategori/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setRows(rows.filter(row => row.id !== id)); // Hapus item dari state
          console.log(`Kategori dengan id ${id} berhasil dihapus`);
        } else {
          console.error(`Gagal menghapus kategori dengan id ${id}`);
        }
      } catch (error) {
        console.error("Error deleting kategori:", error);
      }
    }
  };

  // Generate columns untuk DataGrid
  const columns = [
    { 
      field: "no", 
      headerName: "NO", 
      flex: 1, 
      headerAlign: 'center', 
      align: 'center',
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1 // Generate dynamic row numbers
    },
    {
      field: "kategori",
      headerName: "Kategori",
      flex: 5,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "subkategori",
      headerName: "Sub. Kategori",
      flex: 5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/detailkategori/${params.row.id}`)} // Navigate to subkategori page with category id
        >
          Detail Kategori
        </Button>
      ),
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
              fontWeight:"bold",
              backgroundColor: theme.palette.mode === 'dark' ? '#077f10' : '#00da11',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              "&:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? '#00da11' : '#077f10',
              },
            }}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{
              width: "90px",
              fontSize: "14px",
              padding: "2px 11px",
              fontWeight:"bold",
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

  // Custom Toolbar without Export Button
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="KATEGORI BARANG" />
        <Box>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/tambahkategori")}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#347f6b' : '#4cceac',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: "8px 16px",
              mr: 2,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
              },
            }}
            endIcon={<AddOutlinedIcon/>}
          >
            Tambah
          </Button>
        </Box>
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
            borderRadius:"16px 16px 0 0",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
            borderRadius:"0 0 16px 16px",
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
          rows={rows} // Data dari tabel kategori
          columns={columns}
          components={{ Toolbar: CustomToolbar }} // Use the custom toolbar without the export button
          getRowId={(row) => row.id} // Pastikan setiap row menggunakan 'id' sebagai identifier
          rowHeight={75}
        />
      </Box>
    </Box>
  );
};

export default Kategori;
