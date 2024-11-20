import logo from "../assets/logo.jpg";
import owner from "../assets/owner.png";
import admin from "../assets/admin.svg";
import logout from "../assets/logout.svg";
import Role from "../types/role";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Link, useNavigate } from "react-router-dom";

export default function Header(): JSX.Element {
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("authData")!);

  useClickAway(ref, () => setShowLogout(false));

  function handleLogout(): void {
    localStorage.removeItem("authData");
    navigate("/auth");
  }

  return (
    <div className="flex items-center justify-between bg-black w-full px-28 py-3">
      <Link to="/">
        <img src={logo} className="size-20" />
      </Link>

      <div
        ref={ref}
        className="relative flex flex-col gap-x-2 items-center text-white"
      >
        <div
          onClick={() => setShowLogout(true)}
          className="cursor-pointer hover:opacity-80"
        >
          <img
            src={authData.role === Role.OWNER ? owner : admin}
            className="w-10 mx-auto"
            title={
              authData.role === Role.OWNER
                ? "Dono"
                : authData.role === Role.SUPERADMIN
                ? "Super Administrador"
                : "Administrador"
            }
          />
          <p>{authData.email}</p>
        </div>

        {showLogout && (
          <div
            className="absolute flex top-full mt-2 w-28 bg-white text-black p-2 rounded shadow-lg cursor-pointer hover:bg-slate-200"
            onClick={handleLogout}
          >
            <img src={logout} className="mr-1" />
            <p className="flex">Sair</p>
          </div>
        )}
      </div>
    </div>
  );
}
