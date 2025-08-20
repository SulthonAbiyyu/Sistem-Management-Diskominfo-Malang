import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Avatar, IconButton, useTheme } from '@mui/material';
import { PhotoCamera, ArrowBack, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const SettingAkun = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('/assets/default-profile.jpg');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // New state for file selection

  const navigate = useNavigate();
  const theme = useTheme();

  // Mengambil data user yang login dari localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id) {
      fetch(`http://localhost:4000/users/${currentUser.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setProfilePicture(data.foto || '/assets/default-profile.jpg');
        })
        .catch((error) => console.error('Gagal mengambil data user:', error));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Save the selected file
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    const formData = new FormData(); // Create FormData to handle file uploads
    if (password) {
      formData.append('password', password);
    }
    if (selectedFile) {
      formData.append('foto', selectedFile); // Append the new profile picture
    }

    fetch(`http://localhost:4000/users/${user.id}`, {
      method: 'PUT',
      body: formData, // Send FormData
    })
      .then((response) => response.json())
      .then(() => {
        setIsEditing(false);
        alert('Perubahan telah disimpan!');
        navigate(-1); // Kembali ke halaman sebelumnya
      })
      .catch((error) => console.error('Gagal memperbarui akun:', error));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSaveChanges(); // Simpan perubahan ketika tombol "Enter" ditekan
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
      p={3}
    >
      <Box
        bgcolor={theme.palette.background.paper}
        p={5}
        borderRadius="15px"
        boxShadow={`0px 0px 15px ${theme.palette.grey[500]}`}
        width="100%"
        maxWidth="500px"
        position="relative"
      >
        <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 20, left: 20 }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h4" fontWeight="bold" align="center" mb={3}>
          Pengaturan Akun
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar 
            src={profilePicture} 
            alt="Profile Picture" 
            sx={{ width: 100, height: 100 }}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{
              position: 'absolute',
              marginTop: '75px',
              marginLeft: '-30px',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '50%',
              boxShadow: `0px 0px 5px ${theme.palette.grey[400]}`,
            }}
          >
            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            <PhotoCamera />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Nama"
          variant="outlined"
          value={user.name} // Tampilkan nama user
          disabled
          sx={{ mb: 3 }}
          InputProps={{
            style: { borderRadius: '15px' },
          }}
        />

        <TextField
          fullWidth
          label="Password Lama"
          variant="outlined"
          value={user.password} // Tampilkan password lama
          disabled
          sx={{ mb: 3 }}
          InputProps={{
            style: { borderRadius: '15px' },
          }}
        />

        <TextField
          fullWidth
          label="Password Baru"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleEnter} // Tambahkan navigasi saat Enter ditekan
          disabled={!isEditing}
          sx={{ mb: 3 }}
          InputProps={{
            style: { borderRadius: '15px' },
          }}
        />

        {isEditing ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              width: "420px",
              fontSize: "20px",
              padding: "6px 18px",
              fontWeight:"bold",
              borderRadius:"50px",
              backgroundColor: theme.palette.mode === 'dark' ? '#005a5b' : '#009698',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              "&:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? '#009698' : '#005a5b',
              },
            }}
            onClick={handleSaveChanges}
          >
            Simpan Perubahan
          </Button>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            sx={{
              width: "420px",
              fontSize: "20px",
              padding: "6px 18px",
              fontWeight:"bold",
              borderRadius:"50px",
              backgroundColor: theme.palette.mode === 'dark' ? '#347f6b' : '#4cceac',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              "&:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? '#4cceac' : '#347f6b',
              },
            }}
            onClick={handleEdit}
            startIcon={<EditIcon />}
          >
            Edit Akun
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SettingAkun;
