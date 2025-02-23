import React, { useState, forwardRef } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Password = forwardRef(
  (
    {
      type = "password",
      label = "",
      placeholder = "Enter your password",
      value = "",
      onChange,
      name,
      errors,
      className = "",
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible((prev) => !prev);
    };

    const hasError = errors?.[name];

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          {/* Input Field */}
          <input
            id={name}
            type={isPasswordVisible ? "text" : "password"}
            placeholder={placeholder}
            defaultValue={value}
            onChange={onChange}
            name={name}
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              bg-gray-100 text-gray-900 placeholder-gray-500 leading-[1.6]
              ${
                hasError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              } pr-12`} // Adjust padding for icon
            {...rest}
          />

          {/* Eye Icon */}
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
          >
            {isPasswordVisible ? <FaEye size={22} /> : <FaEyeSlash size={22} />}
          </span>
        </div>

        {/* Error Message */}
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="mt-1 text-sm text-red-600">{message}</p>
          )}
        />
      </div>
    );
  }
);

export default Password;
