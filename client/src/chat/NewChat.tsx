import { useMutation, useQuery } from "@tanstack/react-query";
import FullScreenCard from "../components/FullScreenCard";
import { Link } from "../components/Link";
import { FormEvent, useRef } from "react";
import Select, { SelectInstance } from "react-select";
import Input from "../components/Input";
import Button from "../components/Button";
import { useLoggedInAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const NewChat = () => {
  const navigate = useNavigate();
  const { streamChat, user } = useLoggedInAuth();
  const createChat = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string;
      memberIds: string[];
      imageUrl?: string;
    }) => {
      if (streamChat == null) throw Error("Not Connected");

      return streamChat
        .channel("messaging", crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [user.id, ...memberIds],
        })
        .create();
    },
    onSuccess: () => {
      navigate("/");
    },
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const imgUrlRef = useRef<HTMLInputElement>(null);
  const memberIdsRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null);
  const users = useQuery({
    queryKey: ["stream", "users"],
    queryFn: () => streamChat!.queryUsers({ id: { $ne: user.id } }),
    enabled: streamChat != null,
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const imageUrl = imgUrlRef.current?.value;
    const options = memberIdsRef.current?.getValue();
    if (
      name == null ||
      name === "" ||
      options == null ||
      options.length === 0
    ) {
      return;
    }
    createChat.mutate({
      name,
      imageUrl,
      memberIds: options.map((option) => option.value),
    });
  };
  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <h1 className=" text-3xl font-bold mb-8 text-center">
          New Conversation
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
        >
          <label htmlFor="name">Name</label>
          <Input ref={nameRef} id="name" required />
          <label htmlFor="imgUrl">Image Url</label>
          <Input ref={imgUrlRef} id="imgUrl" type="url" />
          <label htmlFor="members">Members</label>
          <Select
            ref={memberIdsRef}
            isMulti
            required
            id="members"
            classNames={{ container: () => "w-full" }}
            isLoading={users?.isLoading}
            options={users.data?.users.map((user) => {
              return { value: user.id, label: user.name || user.id };
            })}
          ></Select>
          <Button type="submit" className="col-span-full">
            {createChat.isPending ? "Loading..." : "Create"}
          </Button>
        </form>
      </FullScreenCard.Body>
      <FullScreenCard.Below>
        <Link to={"/"}>Back</Link>
      </FullScreenCard.Below>
    </FullScreenCard>
  );
};

export default NewChat;
