import { useRef, FormEvent } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
const Login = () => {
  const { login, user } = useAuth();

  if (user != null) return <Navigate to={"/"} />;

  const usernameRef = useRef<HTMLInputElement>(null);
  //user login handler
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (login.isPending) return;

    const username = usernameRef.current?.value;
    if (username == null || username == "") return;

    login.mutate(username);
  }
  return (
    <>
      <h1 className=" text-3xl font-bold mb-8 text-center">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
      >
        <label htmlFor="username">Username</label>
        <Input ref={usernameRef} id="username" required />
        <Button
          type="submit"
          className="col-span-full"
          disabled={login.isPending}
        >
          {login.isPending ? "Loading..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default Login;
