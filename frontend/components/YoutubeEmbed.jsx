import YouTube from "react-youtube";
import { useMediaQuery } from "react-responsive";

const YoutubeEmbed = ({ videoId }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });
  const opts = {
    height: isMobile ? "220" : "400",
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
