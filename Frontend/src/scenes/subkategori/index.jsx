import Header from "../../components/Header";
import { Box, Modal } from "@mui/material"; // Menghapus Button karena tidak digunakan
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

const SubkategoriDetail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams(); // Get subkategori id from the URL params

  const [rows, setRows] = useState([]);
  const [subkategoriName, setSubkategoriName] = useState(""); // State for subkategori name
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [selectedImage, setSelectedImage] = useState(""); // State for selected image

  // Handle modal open
  const handleOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Fetch data from the 'aset' table and 'subkategori' table
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch aset data filtered by subkategoriId
        const asetResponse = await fetch(`http://localhost:4000/aset?subkategoriId=${id}`);
        const asetData = await asetResponse.json();

        // Fetch subkategori data
        const subkategoriResponse = await fetch(`http://localhost:4000/subkategori`);
        const subkategoriData = await subkategoriResponse.json();

        // Create a map to convert subkategori ID to subkategori name
        const subkategoriMap = subkategoriData.reduce((map, subkategori) => {
          map[subkategori.id] = subkategori.namasubkategori;
          return map;
        }, {});

        // Check if data exists and map the subkategori name
        if (asetData.length > 0) {
          // Transform data to include subkategori name
          const transformedData = asetData.map(aset => ({
            id: aset.id,
            noseri: aset.noseri,
            subkategori: subkategoriMap[aset.subkategori] || 'Unknown', // Get the subkategori name from the map
            dokumentasi: aset.dokumentasi,
            kondisibarang: aset.kondisibarang
          }));

          setRows(transformedData);
        } else {
          setRows([]); // Clear rows if no data is available
        }

        // Fetch the subkategori name to set in the header
        const subkategoriItem = subkategoriData.find(sub => sub.id === parseInt(id));
        if (subkategoriItem) {
          setSubkategoriName(subkategoriItem.namasubkategori);
        } else {
          setSubkategoriName("Unknown Subkategori");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);


  // Columns for the DataGrid
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
      field: "noseri",
      headerName: "No. Seri",
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "subkategori",
      headerName: "Sub. Kategori",
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "dokumentasi",
      headerName: "Dokumentasi",
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img
          src={`http://localhost:4000${params.value}`}
          alt="dokumentasi"
          style={{
            width: "75px",
            height: "75px",
            cursor: "pointer",
            margin: "5px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
          }}
          onClick={() => handleOpenModal(`http://localhost:4000${params.value}`)}
        />
      )
    },
    {
      field: "kondisibarang",
      headerName: "Kondisi",
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={`Detail Subkategori - ${subkategoriName}`} />
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
          rowHeight={100} // Increase row height for better image display
          getRowId={(row) => row.id}
        />
      </Box>

      {/* Modal for image preview */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflow: 'auto',
            textAlign: 'center'
          }}
        >
          <img src={selectedImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default SubkategoriDetail;
