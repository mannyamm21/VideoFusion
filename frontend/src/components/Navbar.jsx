import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import styled1 from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Upload from "./Upload";
import axios from "axios";
import { logout } from "../Context/userSlice";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { purple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const Container = styled1.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bg};
  height: 56px;
  
`;

const Wrapper = styled1.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
  
`;

const Search = styled1.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  
`;

const Input = styled1.input`
  border: none;
  width: 100%;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const User = styled1.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled1.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[800],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await axios.post("/auth/sign-out");
      dispatch(logout());
      navigate("/sign-in"); // Redirect to sign-in page or homepage after logout
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
            />
            <SearchOutlinedIcon
              onClick={() => navigate(`/search?q=${q}`)}
              onKeyPress={(e) => e.key === "Enter"}
            />
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
              <NotificationsNoneIcon />
              <Link to={currentUser?._id ? `/profile/${currentUser._id}` : "#"}>
                <Avatar src={currentUser?.avatar || "/default-avatar.png"} />
              </Link>
              <ColorButton variant="contained" onClick={handleSignOut}>
                Sign Out
              </ColorButton>
            </User>
          ) : (
            <Link to="sign-in" style={{ textDecoration: "none" }}>
              <ColorButton variant="contained">
                <AccountCircleOutlinedIcon />
                {"  +  "}SIGN IN
              </ColorButton>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
}
