import { ReactNode } from "react";

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
      className={`${props.className} px-4 bg-slate-700 text-xl border-slate-500 text-slate-200 hover:bg-slate-500 transition-all duration-300`}
    >
      {children}
    </button>
  );
};

export default Button;
