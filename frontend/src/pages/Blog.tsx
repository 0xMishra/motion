import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../App";
import ReactQuill from "react-quill";

type Blog = {
  id: string;
  authorId: number;
  content: string;
  createdAt: string;
  published: boolean;
  title: string;
};

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>({
    id: "",
    authorId: 0,
    content: "",
    createdAt: "",
    published: false,
    title: "",
  });
  const [users, setUsers] = useState([{ id: "", name: "" }]);

  const navigate = useNavigate();
  useEffect(() => {
    const timerId = setTimeout(() => {
      localStorage.removeItem("token");
    }, 1000 * 86400);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signup");
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    axios
      .get(`${SERVER_URL}/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBlog(res.data.blog);
        console.log(res.data);
      });
    axios
      .get(`${SERVER_URL}/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data.users);
        setUsers(res.data.users);
      });
  }, []);

  return (
    <section className="w-[100vw] h-[100vh] bg-gray-200 flex justify-center items-start p-5">
      <div className="  bg-white m-3 w-[90vw] max-w-[600px] flex flex-col justify-start items-start p-4">
        <div className="flex flex-col text-center justify-center items-center w-[100%]">
          <h1 className="font-bold pt-2 text-3xl"> {blog.title}</h1>
          <p className="text-gray-500 pt-3 text-lg pb-6 font-semibold max-w-[30ch]">
            <i className="pr-2">Written by:</i>
            {users.find((user: any) => user.id === blog.authorId)?.name}
          </p>
        </div>
        <ReactQuill
          modules={{ toolbar: null }}
          value={blog.content}
          style={{
            cursor: "pointer",
            border: "none",
            width: "100%",
            outline: "none",
            overflowY: "hidden",
            overflowX: "hidden",
          }}
          readOnly
        />
      </div>
    </section>
  );
};

export default Blog;
