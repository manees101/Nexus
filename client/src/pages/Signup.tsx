import { useRef, FormEvent } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
const Signup = () => {
  const { signup } = useAuth();
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imgUrlRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (signup.isPending) return;
    const name = nameRef.current?.value;
    const username = usernameRef.current?.value;
    const image = imgUrlRef.current?.value;
    if (username == null || username == "" || name == "" || name == null)
      return;

    signup.mutate({ id: username, name, image });
  }
  return (
    <>
      <h1 className=" text-3xl font-bold mb-8 text-center">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
      >
        <label htmlFor="username">Username</label>
        <Input pattern="\S*" ref={usernameRef} id="username" required />
        <label htmlFor="name">Name</label>
        <Input ref={nameRef} id="name" required />
        <label htmlFor="imgUrl">Image Url</label>
        <Input ref={imgUrlRef} id="imgUrl" type="url" />
        <Button
          type="submit"
          className="col-span-full"
          disabled={signup.isPending}
        >
          {signup.isPending ? "Loading..." : "Sign Up"}
        </Button>
      </form>
    </>
  );
};

export default Signup;
