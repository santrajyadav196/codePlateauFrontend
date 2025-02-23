import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Input from "../Utils/Input";
import Password from "../Utils/Password";
import Button from "../Utils/Button";
import { registerUser } from "../../apis/authService";
import showToast from "../Utils/Toast";
import { login } from "../../stores/slices/authSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const validateEmail = (value) => {
    const trimmedValue = value.trim();
    const emailPattern = /^[A-Za-z0-9+._]+@[A-Za-z0-9]+\.[A-Za-z]{2}/i;
    return (
      emailPattern.test(trimmedValue) || "Please enter a valid email address."
    );
  };

  const onSubmit = async (data) => {
    const formData = {
      email: data.email,
      password: data.password,
      phone: data.phone,
      name: data.name,
    };

    try {
      setIsLoading(true);
      const resData = await registerUser(formData);
      dispatch(
        login({
          user: resData?.data?.user,
          accessToken: resData?.data?.accessToken,
        })
      );
      reset();
      setIsLoading(false);
      nevigate("/login");
      showToast(resData.message, "success");
    } catch (error) {
      setIsLoading(false);
      showToast(error?.response?.data?.message || error?.message, "error");
    }
  };

  return (
    <div className="h-fit">
      <h1 className="text-center text-2xl text-font1 font-semibold mb-4">
        Register
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-font2 text-sm flex flex-col gap-[15px]"
      >
        <Input
          className="flex flex-col"
          label="Name"
          errors={errors}
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          {...register("name", {
            required: "This field is required.",
            validate: (value) =>
              value.trim() !== "" || "Field cannot be empty spaces.",
            minLength: {
              value: 3,
              message: "Please enter at least 3 characters.",
            },
            onBlur: (e) => setValue("name", e.target.value.trim()),
          })}
        />

        <Input
          className="flex flex-col"
          label="Email"
          errors={errors}
          type="email"
          id="email"
          name="email"
          placeholder="e.g., john.doe@example.com"
          {...register("email", {
            required: "This field is required.",
            validate: validateEmail,
            onBlur: (e) => setValue("email", e.target.value.trim()),
          })}
        />

        <Input
          className="flex flex-col"
          label="Phone"
          errors={errors}
          type="text"
          id="phone"
          placeholder="e.g., +1-555-555-1234"
          name="phone"
          {...register("phone", {
            required: "This field is required.",
            validate: (value) =>
              value.trim() !== "" || "Field cannot be empty spaces.",
            pattern: {
              value: /^[\d\s-]{8,15}$/,
              message: "Please enter valid phone number.",
            },
            onBlur: (e) => setValue("phone", e.target.value.trim()),
          })}
        />

        <Password
          className="flex flex-col"
          label="Password"
          errors={errors}
          type="password"
          id="password"
          name="password"
          placeholder="e.g., ********"
          {...register("password", {
            required: "This field is required.",
            validate: (value) =>
              value.trim() !== "" || "Field cannot be empty spaces.",
            minLength: {
              value: 6,
              message: "Please enter at least 6 characters.",
            },
            pattern: {
              value:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/i,
              message:
                "Please enter at least minimum six characters, include at least one letter, one number and one special character.",
            },

            onBlur: (e) => setValue("password", e.target.value.trim()),
          })}
        />

        <Button
          disabled={isLoading}
          isLoading={isLoading}
          text="Signup"
          width="w-full"
          size="18px"
          rounded="xl"
          fontWeight="semibold"
        />
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an accoun?
        <Link
          to="/login"
          className="text-blue-600 hover:underline font-medium ps-1"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
