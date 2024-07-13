import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";

const Button1 = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  width: 100%;
`;

const VisuallyHiddenInput = styled.input`
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

const EditProfile = ({ setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data and populate form fields
    const fetchUserData = async () => {
      try {
        const userId = currentUser?._id;
        const url = `/users/find/${userId}`;
        const response = await axios.get(url);
        const userData = response.data; // Assuming response.data contains user details

        // Populate form data
        setFormData({
          name: userData.name,
          username: userData.username,
          email: userData.email,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarFileName(file.name); // Update avatar file name for display
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    setCoverFileName(file.name); // Update cover file name for display
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const userId = currentUser?._id;
      const url = `/users/${userId}`;
      const data = { ...formData };

      // Update avatar image if selected
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        await axios.patch(`/users/avatar/${userId}`, avatarFormData);
      }

      // Update cover image if selected
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("coverImage", coverFile);
        await axios.patch(`/users/coverImage/${userId}`, coverFormData);
      }

      // Update user details (name, username, email)
      const response = await axios.put(url, data);
      console.log("Profile updated:", response.data);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Title>Edit Your Profile</Title>
          <Close onClick={() => setOpen(false)}>X</Close>
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            <VisuallyHiddenInput
              type="file"
              onChange={handleAvatarChange}
              accept="image/*"
            />
            {avatarFileName || "Select Avatar Image"}
          </Button>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            <VisuallyHiddenInput
              type="file"
              onChange={handleCoverChange}
              accept="image/*"
            />
            {coverFileName || "Select Cover Image"}
          </Button>
          <Button1 onClick={handleSubmit} variant="contained">
            Save
          </Button1>
        </Wrapper>
      </Container>
    </>
  );
};

export default EditProfile;
