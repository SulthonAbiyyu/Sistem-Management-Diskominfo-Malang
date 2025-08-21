import { createContext, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; 
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode, tokens } from "./theme";
import Aset from "./scenes/aset";
import Kategori from "./scenes/kategori";
import Kondisi from "./scenes/kondisi";
import Users from "./scenes/users";
import TambahAset from "./components/TambahAset";
import TambahUsers from "./components/TambahUsers";
import EditAset from "./components/EditAset";
import EditUsers from "./components/EditUsers";
import EditKategori from "./components/EditKategori";
import TambahKategori from "./components/TambahKategori";
import Tambahkondisi from "./components/Tambahkondisi";
import TambahSubKategori from "./components/TambahSubKategori";
import BeritaAcara from "./scenes/berita";
import BeritaAcaraSerahTerima from "./scenes/kertas";
import LoginPage from "./scenes/login";
import Detailkategori from "./scenes/detailkategori";
import Subkategori from "./scenes/subkategori";
import EditSubKategori from "./components/EditSubKategori";
import { useAuth } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import SettingAkun from "./components/SettingAkun";
import Resetsandi from "./scenes/resetsandi";
import TambahResetSandi from "./components/TambahResetSandi.jsx";
import { SearchProvider } from "./components/SearchContext"; 

// Membuat WebSocket Context
export const WebSocketContext = createContext();

function App() {
  const [ws, setWs] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
  const [asetData, setAsetData] = useState([]);
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation(); 
  const isLoginPage = location.pathname === "/login" || location.pathname === "/tambahresetsandi"; 
  const colors = tokens(theme.palette.mode); // Extract colors based on theme mode
  const { isLoggedIn } = useAuth(); // Ambil status login dari konteks


  // Inisialisasi URL WebSocket di luar useEffect agar tidak dijadikan dependensi.
  const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL || process.env.REACT_APP_WS_URL;

  useEffect(() => {
    let reconnectAttempts = 0;

    const connectWebSocket = () => {
      if (websocketUrl) {
        const websocket = new WebSocket(websocketUrl);

        websocket.onopen = () => {
          console.log("WebSocket connection established");
          reconnectAttempts = 0; // Reset reconnect attempts saat koneksi berhasil
        };

        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Message received from server:", data);

          if (data.type === 'userStatus') {
            setUserStatuses((prevStatuses) => ({
              ...prevStatuses,
              [data.payload.userId]: data.payload,
            }));
          }

          if (data.type === 'dataUpdate') {
            setAsetData(data.payload);
          }
        };

        websocket.onclose = () => {
          console.log("WebSocket connection closed, reconnecting...");

          if (reconnectAttempts < 5) { // Membatasi jumlah reconnect hingga 5 kali
            setTimeout(connectWebSocket, 5000); // Coba reconnect setelah 5 detik
            reconnectAttempts += 1;
          } else {
            console.error("WebSocket connection failed after 5 attempts");
          }
        };

        websocket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        setWs(websocket);
      } else {
        console.log("WebSocket URL is not set. Skipping WebSocket connection.");
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [websocketUrl]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  };

  const updateUserStatus = (userStatusData) => {
    const { userId, status, lastSeen } = userStatusData;
    const userElement = document.getElementById(`user-${userId}-status`);
    if (userElement) {
      if (status === 'online') {
        userElement.textContent = 'Online';
      } else {
        userElement.textContent = `Offline (Last seen: ${lastSeen})`;
      }
    }
  };

  const updatePageData = (dataUpdate) => {
    // Implementasi update data real-time di halaman
  };



  return (
  <WebSocketContext.Provider value={{ ws, userStatuses, asetData }}>
    <SearchProvider> {/* Wrap entire app with SearchProvider */}
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {/* Hanya tampilkan Sidebar jika user sudah login dan bukan di halaman login atau tambahresetsandi */}
            {!isLoginPage && isLoggedIn && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              {/* Hanya tampilkan Topbar jika user sudah login dan bukan di halaman login atau tambahresetsandi */}
              {!isLoginPage && isLoggedIn && <Topbar setIsSidebar={setIsSidebar} />}
              <Routes>
                {/* Protected routes using PrivateRoute */}
                <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route
                  path="/aset"
                  element={
                    <PrivateRoute>
                      <Aset />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/kategori"
                  element={
                    <PrivateRoute>
                      <Kategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/kondisi"
                  element={
                    <PrivateRoute>
                      <Kondisi />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/resetsandi"
                  element={
                    <PrivateRoute>
                      <Resetsandi />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <PrivateRoute>
                      <Users />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/beritaacaraserahterima"
                  element={
                    <PrivateRoute>
                      <BeritaAcaraSerahTerima />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/berita"
                  element={
                    <PrivateRoute>
                      <BeritaAcara />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tambahaset"
                  element={
                    <PrivateRoute>
                      <TambahAset />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tambahusers"
                  element={
                    <PrivateRoute>
                      <TambahUsers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tambahkategori"
                  element={
                    <PrivateRoute>
                      <TambahKategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tambahkondisi"
                  element={
                    <PrivateRoute>
                      <Tambahkondisi />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tambahsubkategori"
                  element={
                    <PrivateRoute>
                      <TambahSubKategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/editaset/:id"
                  element={
                    <PrivateRoute>
                      <EditAset />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/editkategori/:id"
                  element={
                    <PrivateRoute>
                      <EditKategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/editusers/:id"
                  element={
                    <PrivateRoute>
                      <EditUsers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/subkategori/:id"
                  element={
                    <PrivateRoute>
                      <Subkategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/editsubkategori/:id"
                  element={
                    <PrivateRoute>
                      <EditSubKategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/detailkategori/:id"
                  element={
                    <PrivateRoute>
                      <Detailkategori />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settingakun/"
                  element={
                    <PrivateRoute>
                      <SettingAkun />
                    </PrivateRoute>
                  }
                />
                {/* Login page does not need to be protected */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/tambahresetsandi" element={<TambahResetSandi />} />
              </Routes>
            </main>
          </div>
          <footer
            className="footer"
            style={{
              backgroundColor: theme.palette.mode === "dark" ? colors.grey[1300] : colors.grey[700],
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
            }}
          >
            <span>Copyright &copy; 2024 Aptika All rights reserved.</span>
            <b style={{ marginLeft: "10px" }}>DISKOMINFO X UMSIDA</b>
          </footer>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SearchProvider>
    </WebSocketContext.Provider> 
  );
}

export default App;
