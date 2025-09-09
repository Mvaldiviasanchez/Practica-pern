/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "../api/axios";
import PropTypes from "prop-types";

// utils para fallback de avatar
const buildDefaultAvatar = (nameOrEmail = "user") =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    String(nameOrEmail).toLowerCase()
  )}`;

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalizar usuario para siempre tener avatar disponible
  const normalizeUser = (u) => {
    if (!u) return null;
    const fallback = buildDefaultAvatar(u.name || u.email);
    return {
      ...u,
      avatar_url: u.avatar_url || null,
      gravatar: u.avatar_url || fallback, // usamos gravatar en Navbar/Profile
    };
  };

  const signin = async (data) => {
    try {
      const res = await axios.post("/signin", data);
      const nu = normalizeUser(res.data);
      setUser(nu);
      setIsAuth(true);
      return nu;
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signup = async (data) => {
    try {
      const res = await axios.post("/signup", data);
      const nu = normalizeUser(res.data);
      setUser(nu);
      setIsAuth(true);
      return nu;
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signout = async () => {
    await axios.post("/signout");
    setUser(null);
    setIsAuth(false);
  };

  // NUEVO: actualizar avatar
  const updateAvatar = async (avatar_url) => {
    try {
      const res = await axios.put(
        "/users/me/avatar",
        { avatar_url },
        { withCredentials: true }
      );
      const nu = normalizeUser(res.data);
      setUser(nu);
      return nu;
    } catch (error) {
      throw new Error(error.response?.data?.[0] || "Error al actualizar avatar");
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    setLoading(true);
    if (Cookie.get("token")) {
      axios
        .get("/profile")
        .then((res) => {
          const nu = normalizeUser(res.data);
          setUser(nu);
          setIsAuth(true);
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
          setIsAuth(false);
        });
    }
    setLoading(false);
  }, []);

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    const clean = setTimeout(() => {
      setErrors(null);
    }, 5000);
    return () => clearTimeout(clean);
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        errors,
        signup,
        signin,
        signout,
        updateAvatar, // 👈 aquí lo exportamos
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
