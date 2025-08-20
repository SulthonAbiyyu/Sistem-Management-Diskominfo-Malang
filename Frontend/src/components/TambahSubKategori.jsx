import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Grid, TextField, MenuItem, Select, InputLabel, FormControl, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

const TambahSubKategori = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();  

  const [kategoriId, setKategoriId] = useState(''); 
  const [subKategori, setSubKategori] = useState('');
  const [kategoriList, setKategoriList] = useState([]); 

  const firstInputRef = useRef(null); 

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch('http://localhost:4000/kategori');
        const data = await response.json();
        setKategoriList(data); 
      } catch (error) {
        console.error('Error fetching kategori:', error);
      }
    };
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kategoriId || !subKategori) {
      alert('Data gagal ditambahkan. Semua field harus diisi!');
      return;
    }

    const data = {
      namasubkategori: subKategori,
      kategoriId: parseInt(kategoriId), 
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:4000/subkategori', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Respon server:', result);
        alert('Data berhasil ditambahkan!');
        
        setKategoriId('');
        setSubKategori('');

        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }

        navigate('/kategori');
      } else {
        const result = await response.json();
        console.error('Gagal menambahkan data. Respon:', result);
        alert('Data gagal ditambahkan');
      }
    } catch (error) {
      console.error('Terjadi error saat mencoba menambahkan data:', error);
      alert('Error: Tidak bisa mengirim data.');
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
          <h1 style={{ color: theme.palette.text.primary }}>Tambahkan Data Sub Kategori</h1>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel id="kategori-select-label">Pilih Kategori *</InputLabel>
                <Select
                  labelId="kategori-select-label"
                  value={kategoriId}
                  onChange={(e) => setKategoriId(e.target.value)}
                  required
                >
                  {kategoriList.map((kategori) => (
                    <MenuItem key={kategori.id} value={kategori.id}>
                      {kategori.namakategori}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <TextField
                label="Nama Subkategori"
                fullWidth
                required
                value={subKategori}
                onChange={(e) => setSubKategori(e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
                inputRef={firstInputRef} 
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
                  color="error"
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
                  onClick={() => window.history.back()}
                >
                  <ArrowBackIcon sx={{ marginRight: '5px' }} />
                  Kembali
                </Button>
                <Button
                  variant="contained"
                  color="primary"
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

export default TambahSubKategori;
