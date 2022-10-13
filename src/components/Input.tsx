import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
}

const Input: React.FunctionComponent<InputProps> = ({ ...props }) => {
  return (
    <input
      {...props}
      className={`${props.className} px-4 bg-slate-700 outline-none border-2 text-slate-200 border-slate-500 rounded-md caret-transparent`}
    />
  );
};

export default Input;
