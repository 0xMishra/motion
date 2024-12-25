import { signupSchema, SignupSchemaType } from "@0xmishra/common-app";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../App";

export const Signup = () => {
  const navigate = useNavigate();
  const [signupUserInfo, setSignupUserInfo] = useState<SignupSchemaType>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");

  async function signupUserSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const parsedUserInput = signupSchema.safeParse(signupUserInfo);
      if (!parsedUserInput.success) {
        if (signupUserInfo.name === "") setErrors("name");
        else setErrors(parsedUserInput.error.issues[0].path[0].toString());

        return;
      }
      setErrors("");

      const res = await axios.post(`${SERVER_URL}/user/signup`, signupUserInfo);
      if (res) {
        localStorage.setItem("token", res.data.token);
        navigate("/blogs");
      }
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
    }, 5000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, []);

  return (
    <div className="h-[100vh] font-display w-[100vw] flex justify-center items-center bg-gray-400">
      <div className="w-[75vw] p-5 md:px-6 max-w-[400px] bg-white rounded-lg shadow-gray-500 shadow-md">
        <div className="flex flex-col text-center justify-center items-center w-[100%]">
          <h1 className="font-bold pt-2 text-3xl">Sign Up</h1>
          <p className="text-gray-500 pt-3 text-lg font-semibold max-w-[30ch]">
            Enter your information to create an account
          </p>
        </div>

        <div className="w-[100%]">
          <form
            action=""
            onSubmit={(e) => signupUserSubmit(e)}
            className="flex flex-col items-start w-[100%]"
          >
            <label htmlFor="firstName" className="pt-6 pb-3 font-semibold">
              Name
            </label>
            <input
              type="text"
              className="w-[100%] rounded-md border-[2px] border-solid focus:border-black placeholder:text-gray-500 placeholder:font-semibold border-gray-300 focus:outline-none p-2"
              id="firstName"
              placeholder="John"
              value={signupUserInfo.name}
              onClick={() => setErrors("")}
              onChange={(e) => {
                setSignupUserInfo({
                  ...signupUserInfo,
                  name: e.target.value,
                });
              }}
            />
            {errors === "name" ? (
              <div className="pt-2 text-sm text-red-600">
                name should be at least 3 characters long
              </div>
            ) : (
              ""
            )}

            <label htmlFor="email" className="pt-4 pb-3 font-semibold">
              Email
            </label>
            <input
              type="text"
              className="w-[100%] focus:border-black rounded-md border-[2px] border-solid placeholder:text-gray-500 placeholder:font-semibold border-gray-300 focus:outline-none p-2"
              id="email"
              placeholder="johndoe@example.com"
              value={signupUserInfo.email}
              onClick={() => setErrors("")}
              onChange={(e) => {
                setSignupUserInfo({
                  ...signupUserInfo,
                  email: e.target.value,
                });
              }}
            />

            {errors === "email" ? (
              <div className="pt-2 text-sm text-red-600">
                invalid email address
              </div>
            ) : (
              ""
            )}

            {errors === "user already exists" ? (
              <div className="pt-2 text-sm text-red-600">
                This email is already in use
              </div>
            ) : (
              ""
            )}
            <label htmlFor="password" className="pt-4 pb-3 font-semibold">
              Password
            </label>
            <input
              type="password"
              className="w-[100%] focus:border-black rounded-md border-[2px] border-solid placeholder:text-gray-500 placeholder:font-semibold border-gray-300 focus:outline-none p-2"
              id="password"
              value={signupUserInfo.password}
              onChange={(e) => {
                setErrors("");
                setSignupUserInfo({
                  ...signupUserInfo,
                  password: e.target.value,
                });
              }}
            />

            {errors === "password" ? (
              <div className="pt-2 text-sm text-red-600">
                password should be at least 6 characters long
              </div>
            ) : (
              ""
            )}
            <button className="p-2 rounded-md bg-black text-white w-[100%] mt-6 font-semibold hover:bg-white hover:text-black border-[2px] border-solid border-black transition-all ">
              Sign Up
            </button>
          </form>

          <p className="text-center pt-6 ">
            Already have an account?{" "}
            <Link className="underline font-semibold" to={"/signin"}>
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
