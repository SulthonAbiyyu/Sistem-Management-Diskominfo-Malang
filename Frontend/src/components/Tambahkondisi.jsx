import React, { useState, useRef } from 'react';
import { Box, Button, Grid, TextField, useTheme} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';


const TambahKondisi = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();  
  const firstInputRef = useRef(null); 
  const [kondisiBarang, setKondisiBarang] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kondisiBarang) {
      alert('Data gagal ditambahkan. Kondisi Barang harus diisi!');
      return;
    }

    const data = {
      kondisibarang: kondisiBarang,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/kondisi`, {
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
        
        setKondisiBarang('');

        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }

        navigate('/kondisi');
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
          <h1 style={{ color: theme.palette.text.primary }}>Tambahkan Kondisi Barang</h1>
        </Box>

        <Grid container spacing={3}>
          <Grid container item xs={12} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Kondisi Barang"
                fullWidth
                required
                value={kondisiBarang}
                onChange={(e) => setKondisiBarang(e.target.value)}
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

export default TambahKondisi;
