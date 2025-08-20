import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, CardActions, Avatar, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import updateUserStatus from '../../App.js'

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const message = JSON.stringify({ type: 'data', payload: 'some data' });
  updateUserStatus(message);

  useEffect(() => {
    // WebSocket connection to the server on port 4000
    const socket = new WebSocket('ws://localhost:4000');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message received from WebSocket:', message); // Log message from WebSocket
      if (message.type === 'status') {
        // Update status user di state frontend berdasarkan data yang diterima
        setUsers((prevUsers) => 
          prevUsers.map((user) =>
            user.id === message.user.id
            ? { ...user, status: message.user.status, lastseen: message.user.lastseen }
            : user 
          )
        );
      }
    };

    // Log any error during the WebSocket connection
  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      console.error('WebSocket closed unexpectedly');
      setTimeout(() => {
        console.log('Reconnecting WebSocket...');
      }, 5000); 
    }
  };
  

    // Fetch users from the server at the beginning
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    fetchUsers();

    // Update users' status periodically every 10 seconds
    const interval = setInterval(fetchUsers, 10000);
    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  const handleEdit = (id) => {
    navigate(`/editusers/${id}`); // Mengarahkan ke halaman edit dengan ID user
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  

  
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Admin Area > Manajemen User" />
        <Button
          onClick={() => navigate("/tambahusers")}
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
          endIcon={<AddOutlinedIcon />}
        >
          Tambah
        </Button>
      </Box>

      <Box mt={4}>
        <Grid container spacing={4}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <Card sx={{
                bgcolor: theme.palette.mode === 'dark' ? colors.grey[1000] : colors.grey[700],
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}>
                <Box display="flex" justifyContent="center" p={1}>
                  <Avatar
                    src={user.foto ? `http://localhost:4000${user.foto}` : ''}
                    sx={{
                      width: 100,
                      height: 100,
                      backgroundColor: colors.grey[600],
                    }}
                  >
                    {!user.foto && (
                      <PersonIcon sx={{ fontSize: 50, color: colors.grey[100] }} />
                    )}
                  </Avatar>
                </Box>
                <CardContent>
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" align="center">
                      Level: {user.level === 'admin' ? 'Admin' : 'Operator'}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color={user.status === "online" ? colors.greenAccent[500] : colors.redAccent[500]}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mt={1}
                    >
                      {user.status === "online" ? (
                        <>
                          <CheckCircleIcon fontSize="small" sx={{ marginRight: '5px' }} />
                          Online
                        </>
                      ) : (
                        <>
                          <RadioButtonUncheckedIcon fontSize="small" sx={{ marginRight: '5px' }} />
                          {user.lastseen ? `Last seen: ${new Date(user.lastseen).toLocaleString()}` : "Last seen: Unknown"}
                        </>
                      )}
                    </Typography>
                  </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(user.id)}  // Gunakan user.id di sini
                    sx={{ marginRight: '8px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(user.id)}
                  >
                    Hapus
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Users;
