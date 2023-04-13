import { motion } from "framer-motion";

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
  console.log("images maybe", images);
  console.log("images paths", imagesSrc);
  console.log("MAIN", mainImgSrc);

  return (
    <div
      onClick={() => setSelectedViewMore(null)}
      /* black overlay when modal is true */
      className="fixed inset-0 z-20 overflow-y-scroll text-5xl cursor-pointer text-slate-50 bg-black/70"
    >
      <motion.div
        layoutId={`${selectedViewMore.id}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl px-8 mx-auto my-10 bg-blue-200 cursor-default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
      >
        <div className="flex flex-col">
          <img className="object-contain h-40 w-60" src={mainImgSrc} alt="" />
          <div className="flex space-x-2">
            {imagesArray.map((img, idx) => (
              <img src={img} key={idx} />
            ))}
          </div>
        </div>
        <div className="max-w-sm">
          <h3>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            provident optio repellat eveniet impedit dolor maiores culpa, veniam
            laboriosam! Corporis ab quod minima veritatis nisi repellendus
            perferendis autem laudantium aperiam?
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
