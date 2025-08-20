import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from "../../components/SearchContext"; // Import Search Context

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  // State untuk menyimpan nilai input pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const { setSearchQuery: setGlobalSearchQuery } = useContext(SearchContext); // Ambil setter dari SearchContext

  // Fungsi untuk menangani pencarian secara otomatis saat pengguna mengetik
  useEffect(() => {
    setGlobalSearchQuery(searchQuery); // Kirim query pencarian ke context global
  }, [searchQuery, setGlobalSearchQuery]);

  // Fungsi untuk menangani pencarian dengan tombol Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setGlobalSearchQuery(searchQuery);
    }
  };

  // Reset search ketika input dikosongkan
  useEffect(() => {
    if (searchQuery === "") {
      setGlobalSearchQuery("");
    }
  }, [searchQuery, setGlobalSearchQuery]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor={colors.bgcolor.topbar}
      className="box-topbar"
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700]}
        borderRadius="16px"
        className="search"
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update state saat mengetik
          onKeyDown={handleKeyDown} // Trigger pencarian dengan Enter
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS + LOGO */}
      <Box display="flex" alignItems="center" className="logo">
        <Box
          component="img"
          src={theme.palette.mode === "dark" ? "/assets/logo-dark.png" : "/assets/logo-light.png"}
          alt="Logo"
          sx={{ height: "40px", marginRight: "15px" }}
        />
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton
          sx={{
            ml: 1,
            backgroundColor: "transparant",
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? colors.grey[600] : colors.grey[600],
            },
            borderRadius: "50px",
          }}
          onClick={() => navigate("/SettingAkun")}
        >
          <ManageAccountsIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
