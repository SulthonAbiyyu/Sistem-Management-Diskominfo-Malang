import Header from "../../components/Header";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

const Detailkategori = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [rows, setRows] = useState([]);
  const [kategoriName, setKategoriName] = useState(""); 

  // Fetch subkategori data based on the selected kategori ID
  useEffect(() => {
    const fetchSubkategoriDetail = async () => {
      try {
        const subkategoriResponse = await fetch("${process.env.REACT_APP_API_URL}/subkategori");
        const subkategoriData = await subkategoriResponse.json();

        const filteredData = subkategoriData.filter(sub => sub.kategoriId === parseInt(id));

        const transformedData = filteredData.map((sub) => ({
          id: sub.id,
          subkategori: sub.namasubkategori,
          detailSubkategori: `Detail of ${sub.namasubkategori}`, 
        }));        

        setRows(transformedData);

        const kategoriResponse = await fetch("${process.env.REACT_APP_API_URL}/kategori");
        const kategoriData = await kategoriResponse.json();
        const kategoriItem = kategoriData.find(kat => kat.id === parseInt(id));

        if (kategoriItem) {
          setKategoriName(kategoriItem.namakategori);
        } else {
          setKategoriName("Unknown Category");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSubkategoriDetail();
  }, [id]);

  const handleEdit = (rowId) => {
    const selectedSubkategori = rows.find(row => row.id === rowId);
    if (selectedSubkategori) {
        navigate(`/editsubkategori/${selectedSubkategori.id}`);
    } else {
        console.error("Subkategori not found");
    }
  };

  const handleDelete = async (rowId) => {
    const selectedSubkategori = rows.find(row => row.id === rowId);
    const confirmed = window.confirm("Apakah kamu yakin ingin menghapus subkategori ini?");
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/subkategori/${selectedSubkategori.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setRows(rows.filter(row => row.id !== rowId)); 
          console.log(`Subkategori dengan id ${selectedSubkategori.id} berhasil dihapus`);
        } else {
          console.error(`Gagal menghapus subkategori dengan id ${selectedSubkategori.id}`);
        }
      } catch (error) {
        console.error("Error deleting subkategori:", error);
      }
    }
  };

  const columns = [
    { 
      field: "no", 
      headerName: "No", 
      flex: 1, 
      headerAlign: 'center', 
      align: 'center',
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1 // Urutkan berdasarkan index row
    },
    {
      field: "subkategori",
      headerName: "Sub. Kategori",
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "detailSubkategori",
      headerName: "Detail Sub. Kategori",
      flex: 5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/subkategori/${params.row.id}`)}
        >
          Detail Sub. Kategori
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

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={`Detail Dari kategori - ${kategoriName}`} />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/TambahSubKategori')}
          sx={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            padding: "8px 16px", 
            backgroundColor: theme.palette.mode === 'dark' ? '#347f6b' : '#4cceac',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
            },
          }}
        >
          Tambah Sub Kategori
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
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={100}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Detailkategori;
