import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../App";
import { signinSchema, SigninSchemaType } from "@0xmishra/common-app";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Signin = () => {
  const navigate = useNavigate();
  const [signinUserInfo, setSigninUserInfo] = useState<SigninSchemaType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");
  const [isSigninLoading, setIsSigninLoading] = useState(false);

  async function signinUserSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const parsedUserInput = signinSchema.safeParse(signinUserInfo);
      if (!parsedUserInput.success) {
        setErrors(parsedUserInput.error.issues[0].path[0].toString());
        return;
      }
      setErrors("");

      setIsSigninLoading(true);
      const res = await axios.post(`${SERVER_URL}/user/signin`, signinUserInfo);
      console.log(res);
      if (res) {
        setIsSigninLoading(false);
        localStorage.setItem("token", res.data.token);
        navigate("/blogs");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setIsSigninLoading(false);
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
          <h1 className="font-bold pt-2 text-3xl">Sign In</h1>
          <p className="text-gray-500 pt-3 text-lg font-semibold max-w-[30ch]">
            Enter your credentials to create an account
          </p>
        </div>

        <div className="w-[100%]">
          <form
            action=""
            onSubmit={(e) => signinUserSubmit(e)}
            className="flex flex-col items-start w-[100%]"
          >
            <label htmlFor="email" className="pt-4 pb-3 font-semibold">
              Email
            </label>
            <input
              type="text"
              className="w-[100%] focus:border-black rounded-md border-[2px] border-solid placeholder:text-gray-500 placeholder:font-semibold border-gray-300 focus:outline-none p-2"
              id="email"
              placeholder="johndoe@example.com"
              value={signinUserInfo.email}
              onClick={() => setErrors("")}
              onChange={(e) => {
                setSigninUserInfo({
                  ...signinUserInfo,
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

            {errors === "user doesn't exist" ? (
              <div className="pt-2 text-sm text-red-600">
                Email isn't registered
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
              value={signinUserInfo.password}
              onChange={(e) => {
                setErrors("");
                setSigninUserInfo({
                  ...signinUserInfo,
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

            {errors === "wrong password" ? (
              <div className="pt-2 text-sm text-red-600">
                Incorrect password
              </div>
            ) : (
              ""
            )}
            <button className="p-2 rounded-md bg-black text-center text-white w-[100%] mt-6 font-semibold hover:bg-white hover:text-black border-[2px] border-solid border-black transition-all ">
              {isSigninLoading ? (
                <AiOutlineLoading3Quarters className="text-white hover:text-black font-semibold" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center pt-6 ">
            Don't have an account?{" "}
            <Link className="underline font-semibold" to={"/signup"}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
