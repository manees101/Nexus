import { forwardRef, DetailedHTMLProps, ButtonHTMLAttributes } from "react";
const Button = forwardRef<
  HTMLButtonElement,
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({ className, children, ...rest }, ref) => {
  return (
    <button
      className={`${className} rounded bg-blue-600 focus:bg-blue-400 hover:bg-blue-500 border-2
     border-gray-900 p-2 w-full text-white font-bold transition-colors disabled:bg-gray-500`}
      {...rest}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default Button;
