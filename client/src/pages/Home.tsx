import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useLoggedInAuth } from "../context/AuthContext";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelListMessengerProps,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
  useChatContext,
} from "stream-chat-react";

const Home = () => {
  const { user, streamChat } = useLoggedInAuth();
  if (!streamChat) return <LoadingIndicator />;

  return (
    <Chat client={streamChat}>
      <ChannelList
        List={Channels}
        sendChannelsToList
        filters={{ members: { $in: [user.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};
function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const { logout } = useLoggedInAuth();
  const navigate = useNavigate();
  const { setActiveChannel, channel: activeChannel } = useChatContext();

  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <Button onClick={() => navigate("/channel/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map((channel) => {
            const isActive = channel === activeChannel;
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-500";

            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                className={`flex gap-3 rounded-lg items-center p-4 ${extraClasses}`}
                key={channel.id}
              >
                {channel.data?.image && (
                  <img
                    src={channel.data?.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className=" text-ellipsis overflow-hidden whitespace-nowrap">
                  {channel.data?.name ? channel.data.name : channel.id}
                </div>
              </button>
            );
          })
        : "No Conversations"}
      <hr className="border-gray-500 mt-auto" />
      <Button
        className=""
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        Logout
      </Button>
    </div>
  );
}
export default Home;
