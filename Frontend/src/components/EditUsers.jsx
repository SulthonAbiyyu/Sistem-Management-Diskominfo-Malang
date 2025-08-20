import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate, useParams } from 'react-router-dom';

const EditUsers = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams(); // Mendapatkan ID user dari URL

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [foto, setFoto] = useState();
  const [fileFoto, setFileFoto] = useState(null);  // Store the file itself

  const fileInputRef = useRef(null);

  // Mengambil data user yang akan diedit
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Pre-fill form dengan data user yang sudah ada
          setName(data.name);
          setLevel(data.level);
          setPassword(data.password); // Idealnya, password seharusnya tidak di pre-fill
          setStatus(data.status);
          setLastSeen(data.lastseen);
          setFoto(data.foto);
        } else {
          alert('User tidak ditemukan.');
          navigate('/users');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error mengambil data user.');
        navigate('/users');
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !level || !password || !status || !lastSeen) {
      alert('Data gagal diperbarui. Semua field harus diisi!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('level', level);
    formData.append('password', password);
    formData.append('status', status);
    formData.append('lastseen', lastSeen);
    if (fileFoto) {
      formData.append('foto', fileFoto);  // Append the file if it's present
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        method: 'PUT',  // Change to PUT for editing existing data
        body: formData,
      });

      if (response.ok) {
        alert('User berhasil diperbarui!');
        navigate('/users'); // Redirect ke halaman daftar users setelah berhasil memperbarui
      } else {
        alert('User gagal diperbarui');
      }
    } catch (error) {
      console.error('Terjadi error saat mencoba memperbarui user:', error);
      alert('Error: Tidak bisa mengirim data.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileFoto(file);  // Store the actual file
      setFoto(file.name);  // Display file name in the UI
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
          <h1 style={{ color: theme.palette.text.primary }}>Edit User</h1>
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
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel id="level-label" style={{ color: theme.palette.text.primary }}>Level</InputLabel>
                <Select
                  labelId="level-label"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                  sx={{
                    color: theme.palette.text.primary,
                    '.MuiSvgIcon-root': { color: theme.palette.text.primary },
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="operator">Operator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                InputProps={{ style: { color: theme.palette.text.primary }, type: "password" }}  // Mask the password here
              />
            </Grid>

          </Grid>
          <Grid container item xs={12} sm={6} direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Status"
                fullWidth
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
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
                  {foto}
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
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  onClick={() => window.history.back()}
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
                  Simpan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditUsers;
