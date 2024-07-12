import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const DeleteButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/find/${comment?.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [comment.userId]);

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
    } catch (error) {
      console.log("Error deleting comment:", error);
    }
  };

  return (
    <Container>
      <Link to={`/profile/${channel?._id}`}>
        <Avatar src={channel?.avatar} />
      </Link>
      <Details>
        <Link to={`/profile/${channel?._id}`}>
          <Name>{channel?.username}</Name>
        </Link>
        <DateText>1 day ago</DateText>
        <Text>{comment.desc}</Text>
      </Details>
      {currentUser._id === channel._id && (
        <DeleteButton onClick={handleDeleteComment}>
          <DeleteOutlineIcon style={{ width: "20px", height: "20px" }} />
        </DeleteButton>
      )}
    </Container>
  );
};

export default Comment;