import { ReactNode } from "react";

type FullScreenCardProps = {
  children: ReactNode;
};
const FullScreenCard = ({ children }: FullScreenCardProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className=" max-w-md w-full">{children}</div>
    </div>
  );
};
FullScreenCard.Body = function ({ children }: FullScreenCardProps) {
  return <div className="bg-white rounded-lg p-6 shadow">{children}</div>;
};

FullScreenCard.Below = function ({ children }: FullScreenCardProps) {
  return <div className="flex justify-center gap-3 mt-2">{children}</div>;
};
export default FullScreenCard;
