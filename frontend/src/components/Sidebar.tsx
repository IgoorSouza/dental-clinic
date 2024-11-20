import { Link, useLocation } from "react-router-dom";
import Role from "../types/role";
import customer from "../assets/customer.svg";
import schedule from "../assets/schedule.svg";
import professional from "../assets/professional.svg";
import user from "../assets/user.svg";
import { useState } from "react";

export default function Sidebar(): JSX.Element {
  const [expand, setExpand] = useState<boolean>(false);
  const location = useLocation();
  const authData = JSON.parse(localStorage.getItem("authData")!);

  return (
    <div
      className={`flex flex-col gap-y-2 bg-slate-900 text-white pt-5 transition-all duration-300 ${
        expand ? "w-56" : "w-[84px]"
      }`}
      onMouseEnter={() => setExpand(true)}
      onMouseLeave={() => setExpand(false)}
    >
      <Link
        className={`flex items-center gap-x-3 px-6 py-4 hover:bg-gray-700 cursor-pointer ${
          location.pathname === "/" && "bg-gray-700"
        }`}
        to="/"
      >
        <img src={schedule} className="size-8" />
        {expand && "Horários"}
      </Link>

      <Link
        className={`flex items-center gap-x-3 px-6 py-4 hover:bg-gray-700 cursor-pointer ${
          location.pathname === "/customers" && "bg-gray-700"
        }`}
        to="/customers"
      >
        <img src={customer} className="size-8" />
        {expand && "Clientes"}
      </Link>

      <Link
        className={`flex items-center gap-x-3 px-6 py-4 hover:bg-gray-700 cursor-pointer ${
          location.pathname === "/professionals" && "bg-gray-700"
        }`}
        to="/professionals"
      >
        <img src={professional} className="size-8" />
        {expand && "Profissionais"}
      </Link>

      {authData.role !== Role.ADMIN && (
        <Link
          className={`flex items-center gap-x-3 px-6 py-4 hover:bg-gray-700 cursor-pointer ${
            location.pathname === "/users" && "bg-gray-700"
          }`}
          to="/users"
        >
          <img src={user} className="size-8" />
          {expand && "Usuários"}
        </Link>
      )}
    </div>
  );
}
