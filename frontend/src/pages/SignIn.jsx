import styled1 from "styled-components";
import Button from "@mui/material/Button";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../Context/userSlice";
import { auth, provider } from "../lib/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const Container = styled1.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled1.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled1.h1`
  font-size: 24px;
`;

const SubTitle = styled1.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled1.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const More = styled1.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled1.div`
  margin-left: 50px;
`;

const Link = styled1.span`
  margin-left: 30px;
`;

const VisuallyHiddenInput = styled1.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[800],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export default function SignIn() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Changed from string to file object
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/sign-in", {
        email: email || null,
        username: username || null,
        password,
      });
      dispatch(loginSuccess(res.data.data));
      navigate("/"); // Assuming res.data.data contains the user object
      console.log(res.data);
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("http://localhost:5000/api/v1/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res);
            dispatch(loginSuccess(res.data.data)); // Assuming res.data.data contains the user object
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginFailure());
      });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const handleSignUp = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await axios.post("/auth/sign-up", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(loginSuccess(res.data.data));
      navigate("/"); // Assuming res.data.data contains the user object
      console.log(res.data);
    } catch (error) {
      dispatch(loginFailure());
      console.error("Failed to sign up:", error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <h4>Forgot Password?</h4>
        <ColorButton variant="contained" onClick={handleLogin}>
          Sign In
        </ColorButton>
        <Button variant="outlined" onClick={signInWithGoogle}>
          Sign In with Google
        </Button>
        <SubTitle>If you don't have the account</SubTitle>
        <Input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Avatar Image
          <VisuallyHiddenInput
            type="file"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </Button>
        <ColorButton variant="contained" onClick={handleSignUp}>
          Sign Up
        </ColorButton>
        <More>
          English(USA)
          <Links>
            <Link>Help</Link>
            <Link>Privacy</Link>
            <Link>Terms</Link>
          </Links>
        </More>
      </Wrapper>
    </Container>
  );
}
