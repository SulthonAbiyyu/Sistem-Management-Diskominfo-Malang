import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useParams } from 'react-router-dom';

const EditSubKategori = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();  

  const [kategoriId, setKategoriId] = useState('');
  const [subkategori, setSubKategori] = useState('');
  const [kategoriList, setKategoriList] = useState([]);
  const isDarkMode = theme.palette.mode === 'dark';

  // Fetch detail subkategori berdasarkan ID
  useEffect(() => {
    const fetchSubKategoriDetail = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/subkategori/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setKategoriId(data.kategoriId); // Set kategoriId dari hasil fetch
            setSubKategori(data.namasubkategori); // Set nama subkategori dari hasil fetch
        } catch (error) {
            console.error("Error fetching subkategori detail:", error);
        }
    };

    if (id) {
        fetchSubKategoriDetail();
    }
  }, [id]);

  // Fetch semua kategori
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kategori`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setKategoriList(data);
      } catch (error) {
        console.error("Error fetching kategori:", error);
      }
    };
    fetchKategori();
  }, []);

  // Handle submit update subkategori
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      namasubkategori: subkategori,
      kategoriId: parseInt(kategoriId, 10),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/subkategori/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Data berhasil disimpan!');
        navigate('/kategori');
      } else {
        const result = await response.json();
        console.error('Gagal menyimpan data. Respon:', result);
        alert('Data gagal disimpan');
      }
    } catch (error) {
      console.error('Terjadi error saat mencoba menyimpan data:', error);
      alert('Error: Tidak bisa menyimpan data.');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={isDarkMode ? "#0A1929" : "#f4f6f9"}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '600px'
        }}
      >
        <Box mb={3} textAlign="center">
          <h1 style={{ color: theme.palette.text.primary }}>Edit Data Sub Kategori {subkategori}</h1>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nama Subkategori"
              fullWidth
              required
              value={subkategori || ''}
              onChange={(e) => setSubKategori(e.target.value)}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
              InputProps={{ style: { color: theme.palette.text.primary } }}
              sx={{ margin: '0 auto', display: 'block' }} // Center the TextField
            />
          </Grid>


          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleBackClick}
                sx={{
                  width: "130px",
                  fontSize: "18px",
                  padding: "4px 18px",
                  fontWeight: "bold",
                  backgroundColor: isDarkMode ? '#ca0128' : '#ff0000',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#ff0000' : '#ca0128',
                  },
                  color: '#ffffff',
                }}
              >
                <ArrowBackIcon sx={{ marginRight: '5px' }} />
                Kembali
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  width: "110px",
                  fontSize: "18px",
                  padding: "4px 18px",
                  fontWeight: "bold",
                  backgroundColor: isDarkMode ? '#005a5b' : '#009698',
                  color: '#ffffff',
                  "&:hover": {
                    backgroundColor: isDarkMode ? '#009698' : '#005a5b',
                  },
                }}
              >
                <CheckIcon sx={{ marginRight: '5px' }} />
                Simpan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditSubKategori;
