import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
}

const Input: React.FunctionComponent<InputProps> = ({ ...props }) => {
  return (
    <input
      {...props}
      className={twMerge(
        `px-4 bg-slate-700 outline-none border-2 text-slate-200 border-slate-500 rounded-md caret-transparent ${props.className}`
      )}
    />
  );
};

export default Input;
