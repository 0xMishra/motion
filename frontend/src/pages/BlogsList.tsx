import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../App";

export const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
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
      .get(`${SERVER_URL}/blog/bulk`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBlogs(res.data.blogs);
        console.log(res.data.blogs);
      });
    axios
      .get(`${SERVER_URL}/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users);
        console.log(res.data);
      });
  }, []);
  return (
    <section className="w-[100vw] h-[100vh] bg-gray-200 flex justify-center items-start p-5">
      <div className="w-[100%] h-[100%] max-w-[600px] flex flex-col justify-start items-start p-2">
        <div className="border-gray-400 border-b-[2px] bg-white rounded-lg pt-2 border-r-none border-l-none border-t-none border-solid px-3 w-[100%] flex justify-between">
          <h1 className="border-black border-b-2 border-r-none border-l-none border-t-none border-solid text-2xl pb-0 font-bold text-black">
            Explore
          </h1>
          <Link
            to={"/blog/create"}
            className="py-2 px-4 mb-1 hover:text-black hover:bg-white text-lg rounded-md bg-black border-black border-[2px] border-solid text-white font-bold cursor-pointer"
          >
            create
          </Link>
        </div>
        {blogs.map((blog) => {
          const { id, createdAt, title, content, authorId } = blog;
          const user = users.find((user) => user.id === authorId) || {
            name: "",
          };
          return (
            <BlogCard
              key={id}
              id={id}
              name={user?.name}
              date={createdAt}
              title={title}
              description={content}
            />
          );
        })}
      </div>
    </section>
  );
};

const BlogCard = ({
  id,
  name,
  date,
  title,
  description,
}: {
  id: string;
  name: string;
  title: string;
  date: string;
  description: string;
}) => {
  return (
    <Link to={`blog/${id}`} className="w-[100%]">
      <div className="border-solid shadow-gray-500 my-2 py-4 px-3 w-[100%] bg-white rounded-lg cursor-pointer mt-3 border-b-[2px] border-gray-400 border-x-none border-t-none">
        <div className=" flex pb-2 items-center">
          <div
            className={`flex items-center justify-center mr-2 bg-black text-white font-bold w-8 h-8 text-lg rounded-full`}
          >
            {name ? name.toString()[0].toUpperCase() : ""}
          </div>
          <div className="font-semibold text-lg pr-2">{name}</div>
          <div className="font-semibold text-lg text-gray-600">
            {new Date(date.toString()).toLocaleString("en-US")}
          </div>
        </div>
        <div className="text-3xl font-bold">{title}</div>
        <div className="text-gray-800 mt-2 pt-1">
          {description ? description.replace(/<[^>]*>/g, "").slice(0, 200) : ""}
        </div>
      </div>
    </Link>
  );
};
