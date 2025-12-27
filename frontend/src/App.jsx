import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Investments from './pages/Investments/Investments';
import PiggyBanks from './pages/PiggyBanks/PiggyBanks';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Profile/Profile';
import styled from 'styled-components';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    overflow: visible;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  margin-left: 80px;
  margin-top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 0;
    margin-top: 0;
    height: auto;
    overflow: visible;
  }
`;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContainer>
          <Routes>
            <Route
              path="/login"
              element={
                !localStorage.getItem('token') ? (
                  <Login />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/register"
              element={
                !localStorage.getItem('token') ? (
                  <Register />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <>
                    <Header user={user} onLogout={() => setUser(null)} />
                    <MainContent>
                      <Sidebar />
                      <ContentArea>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/investments" element={<Investments />} />
                          <Route path="/piggybanks" element={<PiggyBanks />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route
                            path="/"
                            element={<Navigate to="/dashboard" />}
                          />
                        </Routes>
                      </ContentArea>
                    </MainContent>
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;

