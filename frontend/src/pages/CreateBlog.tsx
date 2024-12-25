import { blogCreationSchema } from "@0xmishra/common-app";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../App";

export const CreateBlog = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");

  async function createBlogSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      console.log(title, content);
      const parsedInput = blogCreationSchema.safeParse({
        title: title,
        content: content.toString(),
      });
      if (!parsedInput.success) {
        setErrors(parsedInput.error.issues[0].path[0].toString());
        console.log(parsedInput.error.issues[0].path[0].toString());
        return;
      }
      const token = localStorage.getItem("token") || "";
      const jwtPayload = jwtDecode(token);

      const payload = {
        title: title,
        content: content,
        authorId: jwtPayload.userId,
      };

      const res = await axios.post(`${SERVER_URL}/blog/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res) {
        console.log(res);
        navigate("/blogs");
      }
      setErrors("");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) setErrors(error.response.data.msg);
        if (error.response?.data) console.log(error.response.data.msg);
      }
    }
  }
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
  return (
    <section className="w-[100vw] h-[100vh] bg-gray-200 flex justify-center items-center p-5">
      <div className="  bg-white m-3 w-[90vw] max-w-[600px] flex flex-col justify-start items-start p-4">
        <div className="flex flex-col text-center justify-center items-center w-[100%]">
          <h1 className="font-bold pt-2 text-3xl">Create a blog</h1>
          <p className="text-gray-500 pt-3 text-lg font-semibold max-w-[30ch]">
            Fill in the contents of your blog
          </p>
        </div>
        <form
          action=""
          onSubmit={(e) => createBlogSubmit(e)}
          className="flex flex-col items-start w-[100%]"
        >
          <label htmlFor="email" className="pt-4 pb-3 font-semibold">
            Title
          </label>
          <input
            type="text"
            className="w-[100%] focus:border-black rounded-md border-[2px] border-solid placeholder:text-gray-500 placeholder:font-semibold border-gray-300 focus:outline-none p-2"
            id="title"
            placeholder="Title of the blog"
            onClick={() => setErrors("")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {errors === "title" ? (
            <div className="pt-2 text-lg text-red-600">
              Title should be of minimum 3 characters long
            </div>
          ) : (
            ""
          )}

          <label htmlFor="email" className="pt-4 pb-3 font-semibold">
            Content
          </label>
          <BlogEditor
            value={content}
            setValue={setContent}
            setErrors={setErrors}
          />

          {errors === "content" ? (
            <div className="pt-2 mt-2 text-lg text-red-600">
              content should be at least 6 characters long
            </div>
          ) : (
            ""
          )}

          <button className="p-2 rounded-md bg-black text-white w-[100%] mt-6 font-semibold hover:bg-white hover:text-black border-[2px] border-solid border-black transition-all ">
            Create blog
          </button>
        </form>
      </div>
    </section>
  );
};

const BlogEditor = ({
  value,
  setValue,
  setErrors,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setErrors: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="w-[100%]">
      <ReactQuill
        onFocus={() => setErrors("")}
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "1rem",
          marginBottom: "2rem",
          height: "400px",
        }}
        placeholder="Content of the blog"
        theme="snow"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};
