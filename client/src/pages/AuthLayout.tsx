import { Outlet } from "react-router-dom";
import FullScreenCard from "../components/FullScreenCard";
import { Link } from "../components/Link";
import { useLocation } from "react-router-dom";
const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <Outlet />
      </FullScreenCard.Body>
      <FullScreenCard.Below>
        <Link to={isLogin ? "/signup" : "/login"}>
          {isLogin ? "Create Account" : "Login"}
        </Link>
      </FullScreenCard.Below>
    </FullScreenCard>
  );
};

export default AuthLayout;
