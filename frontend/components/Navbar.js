import Image from "next/image";
import PorscheLogo from "../public/porsche-logo-compressed.png";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-black lg:px-16">
      <div className="flex items-center space-x-1 sm:space-x-3">
        <Image
          className="object-cover w-16 h-12 sm:w-20 sm:h-24"
          alt="Porsche Logo"
          src={PorscheLogo}
          priority
        />
        <h1 className="text-xl sm:text-2xl text-slate-50">
          &ldquo;Mini-Wiki&rdquo;
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
