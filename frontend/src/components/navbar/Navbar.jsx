import { Link, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./navigation";
import { Container } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";
import { BiLogOut } from "react-icons/bi";

function Navbar() {
  const location = useLocation();
  const { isAuth, signout, user } = useAuth();

  return (
    <nav className="bg-zinc-950">
      <Container className="flex justify-between items-center py-3">
        {/* Logo / Brand */}
        <Link to="/">
          <h1 className="font-bold text-2xl text-sky-400 hover:text-sky-300 transition">
            ORDENAT
          </h1>
        </Link>

        <ul className="flex items-center md:gap-x-1">
          {isAuth ? (
            <>
              {/* Rutas privadas */}
              {privateRoutes.map(({ path, name, icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={twMerge(
                      "text-slate-300 flex items-center px-3 py-1 gap-x-1 hover:text-white transition",
                      location.pathname === path && "bg-sky-500 text-white rounded-md"
                    )}
                  >
                    {icon}
                    <span className="hidden sm:block">{name}</span>
                  </Link>
                </li>
              ))}

              {/* Botón cerrar sesión */}
              <li
                className="text-slate-300 flex items-center px-3 py-1 gap-x-1 hover:cursor-pointer hover:text-red-400 transition"
                onClick={signout}
              >
                <BiLogOut className="w-5 h-5" />
                <span className="hidden sm:block">Cerrar sesión</span>
              </li>

              {/* Avatar + nombre */}
              <li className="flex gap-x-2 items-center px-3">
                <img
                  src={user?.gravatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full ring-2 ring-sky-500 object-cover"
                />
                <span className="font-medium hidden sm:block">
                  {user?.name}
                </span>
              </li>
            </>
          ) : (
            /* Rutas públicas (cuando no hay sesión) */
            publicRoutes.map(({ path, name }) => (
              <li
                key={path}
                className={twMerge(
                  "text-slate-300 flex items-center px-3 py-1 hover:text-white transition",
                  location.pathname === path && "bg-sky-500 text-white rounded-md"
                )}
              >
                <Link to={path}>{name}</Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </nav>
  );
}

export default Navbar;
