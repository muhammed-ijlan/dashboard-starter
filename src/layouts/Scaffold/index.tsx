import { Outlet } from "react-router-dom";

const Scaffold = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Outlet />
    </div>
  );
};

export default Scaffold;
