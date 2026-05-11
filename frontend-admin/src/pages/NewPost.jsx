import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const {currentUser} = useSelector((state) => state.user);
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ktsRequest.post("/posts", { title, content });
      toast.success("Post created successfully");
      setTitle("");
      setContent("");
    } catch (error) {
      toast.error("Failed to create post");
    }  
    