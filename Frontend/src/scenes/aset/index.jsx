import Header from "../../components/Header";
import { Box, Button, Modal, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import React from "react";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import GetAppIcon from '@mui/icons-material/GetApp'; 
import * as XLSX from 'xlsx'; // Import library xlsx
import { SearchContext } from '../../components/SearchContext';


const CustomToolbar = ({ onExport }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
      <GridToolbarFilterButton sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
      <GridToolbarDensitySelector sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1 }} onClick={onExport}>
        <GetAppIcon sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }} />
        <Typography sx={{ color: isDarkMode ? '#ffffff' : 'inherit', ml: 0.5 }}>Export</Typography>
      </Box>
    </GridToolbarContainer>
  );
};

const Aset = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [aset, setAset] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [subkategoriList, setSubkategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useContext(SearchContext); 
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBeritaAcara, setSelectedBeritaAcara] = useState(null);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };

    const fetchData = async () => {
      try {
        const [asetResponse, kategoriResponse, subkategoriResponse] = await Promise.all([
          fetch("${process.env.REACT_APP_API_URL}/aset"),
          fetch("${process.env.REACT_APP_API_URL}/kategori"),
          fetch("${process.env.REACT_APP_API_URL}/subkategori")
        ]);
        
        if (!asetResponse.ok || !kategoriResponse.ok || !subkategoriResponse.ok) {
          throw new Error("Terjadi kesalahan saat mengambil data.");
        }

        const asetData = await asetResponse.json();
        const kategoriData = await kategoriResponse.json();
        const subkategoriData = await subkategoriResponse.json();

        setAset(asetData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Mengurutkan data terbaru di atas
        setKategoriList(kategoriData);
        setSubkategoriList(subkategoriData);
        setLoading(false);
      } catch (error) {
        setError("Gagal mengambil data dari server.");
        setLoading(false);
      }
    };
    fetchUser(); 
    fetchData();
  }, []);

  const getKategoriName = (kategoriId) => {
    const kategoriItem = kategoriList.find(item => item.id === parseInt(kategoriId));
    return kategoriItem ? kategoriItem.namakategori : 'Tidak ada kategori';
  };

  const getSubkategoriName = (subkategoriId) => {
    if (!subkategoriId || subkategoriId === "null") return 'Tidak ada subkategori';
    const subkategoriItem = subkategoriList.find(item => item.id === parseInt(subkategoriId));
    return subkategoriItem ? subkategoriItem.namasubkategori : 'Tidak ada subkategori';
  };

  const handleAcara = () => {
    navigate("/berita"); // Mengarahkan ke halaman berita atau halaman cetak yang diinginkan
  }

  const handleEdit = (id) => {
    navigate(`/editaset/${id}`);
  };

  const handleDelete = async (id) => {
    if (!user || user.level !== "admin") {
      alert("Hanya admin yang dapat menghapus aset.");
      return;
    }
    const confirmed = window.confirm("Apakah kamu yakin ingin menghapus data ini?");
    if (confirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/aset/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setAset(aset.filter(item => item.id !== id));
        } else {
          console.error(`Gagal menghapus aset dengan id ${id}`);
        }
      } catch (error) {
        console.error("Error deleting aset:", error);
      }
    }
  };

  const handleViewDokumentasi = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleViewBeritaAcara = (fileUrl) => {
    if (fileUrl.endsWith('.pdf')) {
      // Open the PDF in a new tab
      window.open(fileUrl, '_blank');
    } else {
      // For images, display them in the modal
      setSelectedImage(fileUrl);
      setSelectedBeritaAcara(null);
      setOpen(true);
    }
  };
  

  const handleUploadBeritaAcara = async (id) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf, .jpg, .jpeg, .png";  // Menerima file PDF atau gambar
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("beritaacara", file);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/aset/${id}/beritaacara`, {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          const updatedAset = await response.json();
          setAset(aset.map(item => (item.id === id ? updatedAset : item)));
        } else {
          console.error(`Gagal mengupload berita acara untuk aset id ${id}`);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    input.click();
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedImage(null);
    setSelectedBeritaAcara(null);
  };

  const handleExport = () => {
    const asetWithNumbering = aset.map((item, index) => {
        const { id, kategori, subkategori, createdAt, dokumentasi, ...rest } = item;
        return {
            no: index + 1,
            namabarang: item.namabarang,
            kategori: getKategoriName(kategori),
            subkategori: getSubkategoriName(subkategori),
            ...rest
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(asetWithNumbering);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Aset");

    XLSX.writeFile(workbook, "Daftar_Aset.xlsx");
};


  const columns = [
    { 
      field: "no", 
      headerName: "NO", 
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1
    },
    {
      field: "namabarang",
      headerName: "Nama Barang",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "kategori",
      headerName: "Kategori",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => getKategoriName(params.row.kategori)
    },
    {
      field: "subkategori",
      headerName: "Sub. Kategori",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => getSubkategoriName(params.row.subkategori)
    },
    {
      field: "noseri",
      headerName: "No. Seri",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "tanggalmasuk",
      headerName: "Tanggal Masuk",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "tanggalkeluar",
      headerName: "Tanggal Keluar",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "lokasi",
      headerName: "Lokasi",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "dokumentasi",
      headerName: "Dokumentasi",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const imageUrl = params.value.startsWith("/uploads/")
          ? `${process.env.REACT_APP_API_URL}${params.value}`
          : `${process.env.REACT_APP_API_URL}/uploads/${params.value}`;

        return (
          <Box
            component="img"
            sx={{
              height: 50,
              width: 50,
              borderRadius: 1,
              objectFit: "cover",
              cursor: "pointer",
            }}
            src={imageUrl}
            alt="Dokumentasi"
            onClick={() => handleViewDokumentasi(imageUrl)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/fallback-image-url.jpg";
            }}
          />
        );
      },
    },
    {
      field: "kondisibarang",
      headerName: "Kondisi Barang",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "beritaacara",
      headerName: "Berita Acara",
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
              backgroundColor: theme.palette.mode === 'dark' ? '#347f6b' : '#4cceac',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              "&:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
              },
            }}
            onClick={() => handleUploadBeritaAcara(params.row.id)}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              width: "90px",
              fontSize: "14px",
              padding: "2px 11px",
              fontWeight:"bold",
              backgroundColor: theme.palette.mode === 'dark' ? '#005a5b' : '#009698',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              "&:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? '#009698' : '#005a5b',
              },
            }}
            onClick={() => handleViewBeritaAcara(params.row.beritaacara)}
            disabled={!params.row.beritaacara}
          >
            View
          </Button>
        </Box>
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
          {user && user.level === "admin" && ( // Hanya tampilkan tombol delete jika level user adalah admin
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
          )}
        </Box>
      ),
    },
  ];

  // Filter aset berdasarkan searchQuery
  const filteredAset = aset.filter(item =>
    item.namabarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Header title="DAFTAR ASET" className="custom-header" />
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            mt: 2, // memberi margin top
          }}
        >
          Total Daftar Aset : {filteredAset.length}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2} gap={2}>
        <Button
          variant="contained"
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
          onClick={handleAcara}
          endIcon={<PostAddOutlinedIcon />}
        >
          Berita Acara
        </Button>
        <Button
          variant="contained"
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
          onClick={() => navigate("/tambahaset")}
          endIcon={<AddOutlinedIcon/>}
        >
          Tambah 
        </Button>

      </Box>
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            lineHeight: "1.5 !important",
            paddingTop: "10px",
            paddingBottom: "10px",
            textAlign: 'center',
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .name-column--cell": {
            color: theme.palette.mode === 'dark' ? 'white' : 'black', 
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
            borderBottom: "none",
            borderRadius:"16px 16px 0 0",
            textAlign: 'center',
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.bgcolor[200],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: theme.palette.mode === "dark" ? colors.grey[1100] : colors.grey[700],
            borderRadius:"0 0 16px 16px",
            textAlign: 'center',
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
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
          rows={filteredAset}
          columns={columns}
          components={{ Toolbar: CustomToolbar }} // Menggunakan CustomToolbar
          getRowId={(row) => row.id}
          rowHeight={75}
          componentsProps={{
            toolbar: { onExport: handleExport } // Mengirimkan handleExport ke CustomToolbar
          }}
        />
      </Box>

      <Modal
        open={open}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ outline: 'none' }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Dokumentasi"
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            />
          )}
          {selectedBeritaAcara && (
            <>
              {selectedBeritaAcara.endsWith('.pdf') ? (
                <object
                  src={selectedBeritaAcara}
                  type="application/pdf"
                  width="80%"
                  height="600px"
                  style={{ border: "1px solid #ccc" }}
                  >
                <p>It appears you don't have a PDF plugin for this browser. You can <a href={selectedBeritaAcara}>click here to download the PDF file.</a></p>
                </object>
              ) : (
                <img
                  src={selectedBeritaAcara}
                  alt="Berita Acara"
                  style={{ maxHeight: "90vh", maxWidth: "90vw" }}
                />
              )}
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Aset;
