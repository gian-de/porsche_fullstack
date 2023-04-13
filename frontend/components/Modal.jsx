import { motion } from "framer-motion";
import ImageSlider from "./ImageSlider";
import YoutubeEmbed from "./YoutubeEmbed";

const Modal = ({ selectedViewMore, setSelectedViewMore }) => {
  if (!selectedViewMore) {
    return null;
  }
  // destructure images from that data object
  const { images } = selectedViewMore;
  // get all the paths where the type is !== "Main"
  const imagesSrc = images
    ?.filter((img) => img.type !== "Main")
    .map((img) => img.path);
  // get the "Main" image path from inside the 'images' const above^^
  const mainImgSrc = images?.find((img) => img.type === "Main").path;

  // spread MainImgSrc and rest of 'images' into array for a image slider
  const imagesArray = [mainImgSrc, ...imagesSrc];

  console.log("item data maybe", selectedViewMore);

  // extract just the "id" from the 'youtube_link'
  const youtubeUrl = selectedViewMore?.youtube_link;
  const videoId = youtubeUrl.split("v=").pop().split("&")[0];

  return (
    <div
      onClick={() => setSelectedViewMore(null)}
      /* black overlay when modal is true */
      className="fixed inset-0 z-20 overflow-y-scroll text-gray-800 cursor-pointer bg-black/80"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-[80%] md:w-[85%] max-w-5xl px-10 mx-auto my-14 bg-slate-100 cursor-default"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
      >
        <div className="flex flex-col">
          <ImageSlider
            imagesArray={imagesArray}
            selectedViewMore={selectedViewMore}
          />
        </div>
        <article className="mt-14 ">
          <div className="flex items-center justify-between sm:flex-col sm:items-center">
            <div className="flex flex-col text-xl bg-red-200 sm:flex-row sm:text-center sm:space-x-3 sm:items-center sm:text-3xl">
              <p className="flex font-light sm:font-normal sm:justify-center sm:text-3xl">
                {selectedViewMore.make}
              </p>
              <div className="flex items-center space-x-3 text-start">
                <p>{selectedViewMore.model_name}</p>
                <p>{selectedViewMore.trim_name}</p>
                <p className="text-base sm:text-xl">
                  ({selectedViewMore.generation})
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2 bg-blue-200 sm:space-y-0 text-end sm:flex-row sm:w-60 sm:items-center sm:justify-between sm:mt-8">
              <p className="sm:text-2xl">{selectedViewMore.year}</p>
              <p className="sm:text-2xl">
                {selectedViewMore.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
          {/* youtube video starts here with more info */}
          <div className="mt-10">
            <YoutubeEmbed videoId={videoId} />
          </div>
        </article>
        <div className="w-full py-20 mt-10 bg-red-200">spacing</div>
      </motion.div>
    </div>
  );
};

export default Modal;
