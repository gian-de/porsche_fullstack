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

  // extract just the "id" from the 'youtube_link'
  const youtubeUrl = selectedViewMore?.youtube_link;
  const videoId = youtubeUrl.split("v=").pop().split("&")[0];
  // parse description
  const parsedData = JSON.parse(
    selectedViewMore.description.replace(/“/g, '"').replace(/”/g, '"')
  );

  return (
    <div
      onClick={() => setSelectedViewMore(null)}
      /* black overlay when modal is true */
      className="fixed inset-0 z-20 overflow-y-scroll text-gray-800 cursor-pointer bg-black/80"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-[80%] md:w-[85%] max-w-5xl px-10 mx-auto my-14 bg-slate-100 cursor-default"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
      >
        <div className="flex flex-col">
          <ImageSlider
            imagesArray={imagesArray}
            selectedViewMore={selectedViewMore}
          />
        </div>
        <article className="mt-14 ">
          <div className="flex flex-col sm:items-center">
            <div className="flex flex-col space-y-1 text-xl sm:flex-row sm:text-center sm:space-y-0 sm:space-x-3 sm:items-center sm:text-3xl">
              <p className="text-xl font-medium sm:text-2xl">
                {selectedViewMore.year}
              </p>
              <p className="flex font-light sm:justify-center sm:text-3xl">
                {selectedViewMore.make}
              </p>
              <div className="flex items-center space-x-3 text-2xl font-medium sm:text-4xl text-start">
                <p>
                  {selectedViewMore.model_name === "Carrera GT"
                    ? null
                    : selectedViewMore.model_name}
                </p>
                <p>{selectedViewMore.trim_name}</p>
                <p className="text-base font-light sm:text-xl">
                  ({selectedViewMore.generation})
                </p>
              </div>
            </div>
          </div>
          {/* start of "MORE INFO" */}
          <div className="flex flex-col mt-6 space-y-2 sm:w-fit sm:mx-auto sm:pl-16">
            <p>
              horsepower:
              <span className="pl-4 text-xl font-medium">
                {selectedViewMore.horsepower}hp
              </span>
            </p>
            <p>
              0 - 60 mph:
              <span className="pl-4 text-xl font-medium">
                {selectedViewMore.zero_to_sixty}s
              </span>
            </p>
            <div>
              <p className="flex space-x-4">
                drivetrain:
                <span className="pl-4 text-xl font-medium">
                  {selectedViewMore.drivetrain}
                </span>
                <span className="text-xl font-medium">
                  {selectedViewMore.engine_layout}
                </span>
              </p>
            </div>
            <p className="text-xl font-medium sm:text-2xl">
              {selectedViewMore.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          {/* youtube video starts here with more info */}
          <div className="mt-20">
            <p className="pb-2 text-sm md:text-base">
              YouTube channel:
              <span className="pl-2 text-lg font-medium md:text-xl">
                {selectedViewMore.youtube_channel}
              </span>
            </p>
            <YoutubeEmbed videoId={videoId} />
          </div>

          {parsedData && (
            <section className="px-4 py-12 mt-20 sm:px-10 bg-slate-200">
              <p className="text-4xl text-center">Review</p>
              <div className="flex flex-col mt-8 lg:px-20">
                <p>
                  author:
                  <span className="pl-2 text-lg font-medium">
                    {selectedViewMore?.author_credited}
                  </span>
                </p>
                <div className="flex flex-col mt-2 space-y-6">
                  {parsedData?.map((paragraph, idx) => (
                    <p key={idx} className="text-lg sm:text-xl">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <a
                  className="mt-4 text-lg font-semibold text-blue-600 underline transition duration-150 ease-in-out w-fit md:text-xl hover:text-yellow-700"
                  href={selectedViewMore?.author_page_link}
                  target="_blank"
                >
                  go to article
                </a>
              </div>
            </section>
          )}
          {/* div below is for styling purposes */}
          <div className="h-10 mt-12"></div>
        </article>
      </motion.div>
    </div>
  );
};

export default Modal;
