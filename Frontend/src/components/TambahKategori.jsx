import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Grid, TextField, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

const TambahKategori = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();  

  const [kategori, setKategori] = useState('');  
  const [nextId, setNextId] = useState(1); // State untuk ID kategori selanjutnya
  const firstInputRef = useRef(null);

  // Fetch untuk mendapatkan kategori dan menghitung ID selanjutnya
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/kategori`);
        const data = await response.json();

        // Dapatkan ID terbesar dan tentukan ID berikutnya
        if (data.length > 0) {
          const maxId = Math.max(...data.map(k => k.id));
          setNextId(maxId + 1);
        } else {
          setNextId(1); // Jika tidak ada data, mulai dari 1
        }
      } catch (error) {
        console.error('Error fetching kategori:', error);
      }
    };

    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kategori) {
      alert('Data gagal ditambahkan. Field kategori harus diisi!');
      return;
    }

    const data = {
      id: nextId, // Menambahkan ID yang berurutan
      namakategori: kategori,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/kategori`, {
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
        
        setKategori('');
        setNextId(nextId + 1); // Increment ID untuk kategori berikutnya

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
          <h1 style={{ color: theme.palette.text.primary }}>Tambahkan Data Kategori</h1>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Nama Kategori"
                fullWidth
                required
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
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

export default TambahKategori;
