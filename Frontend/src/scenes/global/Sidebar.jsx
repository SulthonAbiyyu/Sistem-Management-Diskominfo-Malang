import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import DoorFrontOutlinedIcon from "@mui/icons-material/DoorFrontOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

// Fungsi untuk Item Menu
const Item = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  hasDropdown,
  dropdownItems,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setSelected(title);
  };

  return (
    <div>
      <MenuItem
        active={selected === title}
        onClick={handleClick}
        icon={icon}
        style={{
          color: colors.grey[100], // Text color
          backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700], // Background color
        }}
      >
        <Typography style={{ fontWeight: 600 }}>
          {title}
          {hasDropdown && (
            <span style={{ marginLeft: "8px" }}>
              {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </span>
          )}
        </Typography>
        {!hasDropdown && <Link to={to} />}
      </MenuItem>

      {hasDropdown && isOpen && (
        <Box pl={4}>
          {dropdownItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => setSelected(item.title)}
              style={{
                color: colors.grey[100],
                backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700],
              }}
            >
              <Typography>{item.title}</Typography>
              <Link to={item.to} />
            </MenuItem>
          ))}
        </Box>
      )}
    </div>
  );
};

// Fungsi Komponen Sidebar
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  // Ambil user dari localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const userId = user ? user.id : null;

  // Variable untuk menyimpan teks sesuai level user
  const userRoleText = user && user.level === 'admin' ? 'ADMIN' : 'OPERATOR';

  // State untuk menyimpan lebar window saat ini
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // State untuk menyimpan jumlah request reset sandi yang belum ditangani
  const [unhandledRequestCount, setUnhandledRequestCount] = useState(0);

  // Fungsi untuk mengambil data request reset sandi yang belum ditangani
  useEffect(() => {
    const fetchUnhandledRequests = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/requestsandi`);
        const data = await response.json();
        setUnhandledRequestCount(data.length); // Set jumlah permintaan yang belum ditangani
      } catch (error) {
        console.error('Gagal mengambil data request reset sandi:', error);
      }
    };
  
    fetchUnhandledRequests();
    
    // Menambahkan WebSocket connection
    const socket = new WebSocket(process.env.REACT_APP_WS_URL);
  
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Pesan WebSocket diterima:', message); // Cek pesan yang diterima dari server
  
      if (message.type === 'requestsandi_update') {
        if (message.action === 'create') {
          setUnhandledRequestCount(prevCount => prevCount + 1);
        } else if (message.action === 'delete') {
          setUnhandledRequestCount(prevCount => Math.max(prevCount - 1, 0));
        }
      }
    };
  
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  
    // Clean up
    return () => {
      socket.close();
    };
  }, []);
  

  // Fungsi untuk menangani perubahan ukuran window
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsCollapsed(windowWidth > 768 ? false : true);
  }, [windowWidth]);

  const handleLogout = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/logout/${userId}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            localStorage.removeItem('currentUser');
            alert('Logout successful');
            navigate('/login'); 
        } else {
            alert('Failed to update user status.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout');
    }
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700], // Background color for the sidebar
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: theme.palette.mode === "dark" ? colors.blueAccent[400] : colors.blueAccent[1100] + " !important", // Hover color
        },
        "& .pro-menu-item.active": {
          color: theme.palette.mode === "dark" ? colors.blueAccent[500] : colors.blueAccent[1100] + " !important", // Active menu item color
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700], // Background color
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {/* Ubah teks menjadi dinamis berdasarkan role user */}
                <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                  {userRoleText}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && user && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  alt="profile-user"
                  src={user.foto ? `${process.env.REACT_APP_API_URL}${user.foto}` : "/assets/pp-petek.jpg"}
                  sx={{ width: 100, height: 100, cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.name}
                </Typography>
                <Typography variant="h5" color={user.status === "online" ? colors.greenAccent[500] : colors.redAccent[500]}>
                  {user.status === "online" ? "ONLINE" : "OFFLINE"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Beranda"
              to="/"
              icon={<FormatIndentIncreaseIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Daftar Aset"
              to="/aset"
              icon={<Inventory2OutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          
            {user.level === 'admin' && ( // Conditional rendering for admin items
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Spesial Menu Admin
                </Typography>
                <Item
                  title="Admin Area"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  hasDropdown={true}
                  dropdownItems={[
                    { title: " • Kategori Barang", to: "/kategori" },
                    { title: " • Kondisi Barang", to: "/kondisi" },
                    { title: " • Manajemen user", to: "/users" },
                    { 
                      title: (
                        <>
                          {" • Reset Sandi"}
                          {unhandledRequestCount > 0 && (
                            <span
                              style={{
                                backgroundColor: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '0 8px',
                                marginLeft: '8px',
                                fontWeight: 'bold'
                              }}
                            >
                              {unhandledRequestCount}
                            </span>
                          )}
                        </>
                      ),
                      to: "/resetsandi" 
                    },
                  ]}
                  userLevel={user.level}
                />
              </>
            )}
            <>
              <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
              >
                  LogOut
              </Typography>
              <MenuItem
                  active={selected === "LogOut"}
                  style={{
                      color: colors.grey[100],
                      fontWeight:'bold',
                      fontSize:'18px',
                      backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700],
                  }}
                  icon={<DoorFrontOutlinedIcon fontSize="medium" />}
                  onClick={() => {
                      setSelected("LogOut");
                      handleLogout(); // Panggil fungsi logout
                  }}
              >
                  LogOut
              </MenuItem>
            </>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
