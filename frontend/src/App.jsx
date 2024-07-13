import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./lib/utils/Theme";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Video from "./pages/Video";
import axios from "axios";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import Categories from "./pages/Categories";
import SavedVideo from "./components/SavedVideo";

<<<<<<< HEAD
axios.defaults.baseURL = "http://localhost:5000/api/v1"; //http://localhost:5000/api/v1
=======
axios.defaults.baseURL = "https://videofusion-backendd.onrender.com/api/v1";   //http://localhost:5000/api/v1
>>>>>>> 5dedf22595c456d001515d8bd2a1d79c7e4620c5
axios.defaults.withCredentials = true;

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="trend" element={<Home type="trend" />} />
                  <Route path="sub" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="category/:category" element={<Categories />} />
                  <Route path="savedVideos/:userId" element={<SavedVideo />} />
                  <Route
                    path="sign-in"
                    element={currentUser ? <Home /> : <SignIn />}
                  />
                  <Route path="video/:id" element={<Video />} />
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
