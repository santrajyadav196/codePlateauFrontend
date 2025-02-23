import React, { forwardRef } from "react";
import { ErrorMessage } from "@hookform/error-message";

const Input = forwardRef(
  (
    {
      type = "text",
      label = "",
      placeholder = "Enter your input",
      value = "",
      onChange,
      name,
      errors,
      className = "",
      ...rest
    },
    ref
  ) => {
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

        <div className="relative">
          <input
            id={name}
            type={type}
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
              }`}
            {...rest}
          />
        </div>

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

export default Input;
