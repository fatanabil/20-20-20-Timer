import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | ReactNode;
}

const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge(
        `px-4 bg-slate-700 text-xl border-slate-500 text-slate-200 hover:bg-slate-500 transition-all duration-300 ${props.className}`
      )}
    >
      {children}
    </button>
  );
};

export default Button;
