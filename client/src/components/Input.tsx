import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from "react";
const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, ...rest }, ref) => {
  return (
    <input
      className={`${className} py-1 px-2 border border-gray-400 focus:border-blue-500 rounded w-full outline-none`}
      {...rest}
      ref={ref}
    />
  );
});

export default Input;
