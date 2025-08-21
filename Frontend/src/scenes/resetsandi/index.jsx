import Header from "../../components/Header";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";

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

const Resetsandi = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [requestresetsandi, setRequestResetSandi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the 'requestresetsandi' table in the database
  const fetchRequestResetSandi = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/requestsandi`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data reset sandi.");
      }
      const data = await response.json();
      setRequestResetSandi(data);
      setLoading(false); // Selesaikan loading saat data berhasil diambil
    } catch (error) {
      setError(error.message);
      setLoading(false); // Selesaikan loading meskipun ada error
    }
  };

  // Mengambil data pertama kali ketika komponen dimuat
  useEffect(() => {
    fetchRequestResetSandi();

    // Menambahkan WebSocket connection
    const socket = new WebSocket(process.env.REACT_APP_WS_URL);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Pesan WebSocket diterima:', message); // Cek pesan yang diterima dari server

      if (message.type === 'requestsandi_update') {
        if (message.action === 'create') {
          setRequestResetSandi(prevData => [...prevData, message.requestsandi]);
        } else if (message.action === 'delete') {
          setRequestResetSandi(prevData => prevData.filter(item => item.id !== message.id));
        }
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Polling untuk menarik data setiap 10 detik
    const intervalId = setInterval(fetchRequestResetSandi, 10000);

    // Clean up: menutup WebSocket dan menghapus interval polling
    return () => {
      socket.close();
      clearInterval(intervalId);
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Apakah kamu yakin ingin menghapus data ini?");
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/requestsandi/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Gagal menghapus request dengan id ${id}`);
        }
        setRequestResetSandi(requestresetsandi.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  // Generate columns for the DataGrid
  const columns = [
    {
      field: "no",
      headerName: "NO",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1, // Generate row number
    },
    {
      field: "requestresetsandi",
      headerName: "Daftar Permintaan",
      flex: 2.5,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt", // New column for the date
      headerName: "Tanggal Permintaan",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' });
      },
    },
    {
      field: "aksi",
      headerName: "Aksi",
      flex: 1,
      headerAlign: "center",
      align: "center",
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
              backgroundColor: theme.palette.mode === "dark" ? "#ca0128" : "#ff0000",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "#ff0000" : "#ca0128",
              },
              color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            }}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Display loading or error state if needed
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <h2>Loading...</h2>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <h2>Error: {error}</h2>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Permintaan Reset Sandi" />
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
            color: theme.palette.mode === "dark" ? "white" : "black",
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
          rows={requestresetsandi}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          getRowId={(row) => row.id} // Use 'id' as a unique identifier
          rowHeight={75}
        />
      </Box>
    </Box>
  );
};

export default Resetsandi;
