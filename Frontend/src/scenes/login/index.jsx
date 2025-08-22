import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { TextField, Button, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Chat as ChatIcon } from '@mui/icons-material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
        // credentials: 'include' // aktifkan ini hanya jika kamu pakai cookie di server
      });

      // aman-kan parsing json
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        return alert(result?.message || `Login gagal (${response.status})`);
      }

      // result.success di-backend sudah kita pasang
      if (!result?.success) {
        return alert(result?.message || 'Login gagal');
      }

      localStorage.setItem('currentUser', JSON.stringify(result.user));
      login();
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Terjadi error saat login. Coba lagi.');
    }
  };


  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      color="white"
      backgroundColor="white"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      sx={{
        backgroundImage: "url('/assets/iconic_mlg_nonbg.png')", // URL gambar
        backgroundSize: 'cover', // Atur ukuran gambar agar menutupi seluruh area
        backgroundPosition: 'center', // Posisikan gambar di tengah
        backgroundRepeat: 'no-repeat',
       
      }}
    >
      <Box
        bgcolor="rgba(50, 50, 50, 0.8)" 
        borderRadius="15px"
        padding="40px"
        width="400px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        boxShadow="0px 0px 15px rgba(0,0,0,0.2)"
        border="3px solid white"
      >
        <img src="/assets/login.png" alt="Diskominfo" width="80" />
        <Typography 
          variant="body1" 
          gutterBottom 
          color="#FFFFFF" 
          fontWeight="bold" 
          mt={2}
          style={{ textAlign: 'center', color: '#FFFFFF', fontSize: '18px', marginBottom: '1px', textTransform: 'uppercase' }}
        >
          SISTEM MANAJEMEN ASET
        </Typography>
        <Typography 
          variant="body1" 
          color="#FFFFFF"
          fontWeight="bold"
          style={{ textAlign: 'center', color: '#FFFFFF', fontSize: '18px', textTransform: 'uppercase' }}
        >
          INTERNAL BIDANG APTIKA
        </Typography>
        <Typography 
          variant="h6" 
          color="#FFFFFF"
          fontWeight="bold"
          style={{ textAlign: 'center', color: '#FFFFFF', fontSize: '18px', textTransform: 'uppercase' }}
        >
          DISKOMINFO
        </Typography>
        <Typography 
          variant="body1" 
          color="#FFFFFF"
          fontWeight="bold"
          style={{ textAlign: 'center', color: '#FFFFFF', fontSize: '18px', textTransform: 'uppercase' }}
        >
          KOTA MALANG
        </Typography>

        <Box component="form" onSubmit={handleLogin} width="100%" mt={3}>
          <Typography variant="body2" color="#FFFFFF" style={{marginBottom: '5px',fontSize: '17px' }}>
            Username
          </Typography>
          <TextField
            fullWidth
            autoComplete='off'
            placeholder="Masukkan Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            InputProps={{
              style: { 
                borderRadius: 20, 
                backgroundColor: 'white', 
                color: 'black',
                paddingLeft: 20,
                fontFamily: 'Arial, sans-serif', 
                fontWeight: 500, 
                fontSize: '16px', 
                margin: '0 0 10px',
              },
            }}
            InputLabelProps={{
              style: { paddingLeft: 20 },
            }}
            style={{ marginBottom: '20px' }}
          />
          <Typography variant="body2" color="#FFFFFF" style={{ fontSize: '17px', marginBottom: '5px'}}>
            Password
          </Typography>
          <TextField
            fullWidth
            autoComplete='off'
            placeholder="Masukkan Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              style: { 
                borderRadius: 20, 
                backgroundColor: 'white', 
                color: 'black',
                paddingLeft: 20,
                fontFamily: 'Arial, sans-serif', 
                fontWeight: 500, 
                fontSize: '16px', 
                margin: '0 0 15px 0',
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ paddingRight: 2, color: '#31363F' }} 
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { paddingLeft: 20 },
            }}
          />

          <Typography variant="body2" color="#FFFFFF" style={{ fontSize: '15px', marginTop: '10px'}}>
            Lupa Password? {''} 
            <Link to="/tambahresetsandi" style={{ color: '#33A858', textDecoration: 'none', fontWeight:'bold'}}>
              KLIK DISINI
            </Link>
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              marginTop: '20px',
              backgroundColor: '#33A858',
              color: 'white',
              borderRadius: 50,
              padding: '10px 0',
              boxShadow: 'none'
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography 
          variant="body2" 
          color="#31363F"
          style={{ textShadow: '1px 1px 2px #000000' }}
        >
          © 2024 Diskominfo Kota Malang - All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
