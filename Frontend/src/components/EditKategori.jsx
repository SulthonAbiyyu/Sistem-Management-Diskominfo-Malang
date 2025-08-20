import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Grid, TextField, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useParams } from 'react-router-dom';

const EditKategori = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [kategori, setKategori] = useState('');

  useEffect(() => {
    const fetchKategoriDetail = async () => {
      try {
        const response = await fetch(`http://localhost:4000/kategori/${id}`);
        const data = await response.json();
        setKategori(data.namakategori);
      } catch (error) {
        console.error("Error fetching kategori detail:", error);
      }
    };

    fetchKategoriDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      namakategori: kategori,
    };

    try {
      const response = await fetch(`http://localhost:4000/kategori/${id}`, {
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
          <h1 style={{ color: theme.palette.text.primary }}>Edit Data Kategori {kategori}</h1>
        </Box>

        <Grid container spacing={3}>
          <Grid container item xs={12} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Nama Kategori"
                fullWidth
                required
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
            </Grid>
            <Grid item>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "130px",
                    fontSize: "18px",
                    padding: "4px 18px",
                    fontWeight:"bold",
                    backgroundColor: theme.palette.mode === 'dark' ? '#ca0128' : '#ff0000',
                    '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#ff0000' : '#ca0128',
                    },
                    color: '#ffffff',
                  }}
                  onClick={() => window.history.back()}
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
                    fontWeight:"bold",
                    backgroundColor: theme.palette.mode === 'dark' ? '#005a5b' : '#009698',
                    color: 'ffffff',
                    "&:hover": {
                      backgroundColor: theme.palette.mode === 'dark' ? '#009698' : '#005a5b',
                    },
                  }}
                >
                  <CheckIcon sx={{ marginRight: '5px' }} />
                  Kirim
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditKategori;
