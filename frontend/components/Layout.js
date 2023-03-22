import Sidebar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="relative">{children}</main>
    </div>
  );
};

export default Layout;
