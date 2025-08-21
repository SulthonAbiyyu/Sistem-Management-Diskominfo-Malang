import React, { useState, useRef } from 'react';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate } from 'react-router-dom';

const TambahUsers = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [password, setPassword] = useState('');
  const [foto, setFoto] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !level || !password || !foto) {
      alert('Data gagal ditambahkan. Semua field harus diisi!');
      return;
    }
    const createdAt = new Date().toISOString();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('level', level);
    formData.append('password', password);
    formData.append('foto', foto);
    formData.append('createdAt', createdAt);  // Tambahkan createdAt ke formData


    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Data berhasil ditambahkan!');
        resetForm();
      } else {
        alert('Data gagal ditambahkan');
      }
    } catch (error) {
      console.error('Terjadi error saat mencoba menambahkan data:', error);
      alert('Error: Tidak bisa mengirim data.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
    }
  };

  const resetForm = () => {
    setName('');
    setLevel('');
    setPassword('');
    setFoto(null);
    navigate('/users');
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
          <h1 style={{ color: theme.palette.text.primary }}>Tambahkan User Baru</h1>
        </Box>

        <Grid container spacing={3}>
          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Nama"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDarkMode ? 'white' : 'black',
                  },
                }}
              />
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel 
                  id="level-label"
                  sx={{
                    color: isDarkMode ? 'white' : 'black',
                  }}
                >
                  Level
                </InputLabel>
                <Select
                  labelId="level-label"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : 'black',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : 'black',
                    },
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="operator">Operator</MenuItem>
                </Select>
              </FormControl>
              
              
              <Button
                  variant="contained"
                  sx={{
                    width: "130px",
                    fontSize: "18px",
                    padding: "4px 18px",
                    fontWeight:"bold",
                    marginTop:"15px",
                    backgroundColor: theme.palette.mode === 'dark' ? '#ca0128' : '#ff0000',
                    '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#ff0000' : '#ca0128',
                    },
                    color: '#ffffff',
                  }}  
                  onClick={() => window.history.back()}
                >
                  <ArrowBackIcon sx={{ marginRight: '5px'}} />
                  Kembali
                </Button>
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <TextField
                 label="Password"
                 fullWidth
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     '& fieldset': {
                       borderColor: isDarkMode ? 'white' : 'black',
                     },
                     '&:hover fieldset': {
                       borderColor: isDarkMode ? 'white' : 'black',
                     },
                     '&.Mui-focused fieldset': {
                       borderColor: isDarkMode ? 'white' : 'black',
                     },
                   },
                   '& .MuiInputLabel-root': {
                     color: isDarkMode ? 'white' : 'black',
                   },
                   '& .MuiInputLabel-root.Mui-focused': {
                     color: isDarkMode ? 'white' : 'black',
                   },
                 }}
              />
            </Grid>
 
            <Grid item>
              <Box 
                display="flex" 
                alignItems="center"
              >
                <InputLabel style={{ color: theme.palette.text.primary, marginRight: '10px' }}>
                  Foto
                </InputLabel>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    borderColor: isDarkMode ? 'white' : 'black',
                    color: isDarkMode ? 'white' : 'black',
                    maxWidth: '200px',
                  }}
                >
                  <AttachFileIcon sx={{ marginRight: '5px' }} />
                  {foto ? foto.name : 'Pilih File'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </Button>


              </Box>
            </Grid>
            <Grid item>
              <Box
                display="flex"
                justifyContent="flex-end"
              >

                <Button
                  variant="contained"
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
                  type="submit"
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

export default TambahUsers;
