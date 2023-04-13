import YouTube from "react-youtube";

const YoutubeEmbed = ({ videoId }) => {
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <YouTube videoId={videoId} className="" opts={opts} />
    </div>
  );
};

export default YoutubeEmbed;
