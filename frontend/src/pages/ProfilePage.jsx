import { useState, useMemo } from "react";
import { Container, Card, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaEnvelope, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import axios from "../api/axios";

// Estilos y seeds para DiceBear
const styles = ["bottts", "avataaars", "pixel-art", "croodles"];
const seeds = ["sun", "ocean", "forest", "panda", "neo", "sky"];

const makeDiceBear = (style, seed) =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

function ProfilePage() {
  const { user, updateAvatar } = useAuth();

  const miembroDesde = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const baseSeed = (user?.name || user?.email || "ordenat").toLowerCase();

  // Opciones de avatares generados
  const options = useMemo(
    () =>
      styles.flatMap((style) =>
        seeds.map((s) => makeDiceBear(style, `${baseSeed}-${s}`))
      ),
    [baseSeed]
  );

  const [selected, setSelected] = useState(
    user?.avatar_url || user?.gravatar
  );
  const [saving, setSaving] = useState(false);

  // --- NUEVO: estado para correo ---
  const [email, setEmail] = useState(user?.email || "");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAvatar(selected);
      alert("✅ Avatar actualizado con éxito");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  // --- NUEVO: guardar correo en backend ---
  const handleSaveEmail = async () => {
    if (!email) {
      setEmailMsg("El correo no puede estar vacío");
      return;
    }

    try {
      setSavingEmail(true);
      setEmailMsg("");

      const res = await axios.put(
        "/users/me/email",
        { email },
        { withCredentials: true }
      );

      // si el backend devuelve el usuario actualizado, podrías usarlo si lo necesitas
      // por ahora solo actualizamos el estado local de email
      setEmail(res.data.email || email);
      setEmailMsg("✅ Correo actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando correo:", err);
      const msg =
        err?.response?.data?.[0] ||
        err?.response?.data?.message ||
        "Error actualizando correo";
      setEmailMsg(`❌ ${msg}`);
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <Container className="min-h-[calc(100vh-64px)] w-full flex items-start justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-3xl"
      >
        <Card className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Avatar actual */}
            <div className="relative">
              {selected ? (
                <img
                  src={selected}
                  alt="Avatar"
                  className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover ring-2 ring-sky-500/60"
                />
              ) : (
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-sky-500/60">
                  <FaUserCircle className="text-5xl text-zinc-500" />
                </div>
              )}
            </div>

            {/* Nombre + botón guardar avatar */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.name}
              </h1>
              <p className="text-gray-400 mt-1">Mi perfil en ORDENAT</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  {saving ? "Guardando..." : "Guardar avatar"}
                </Button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* --- CORREO EDITABLE --- */}
            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <FaEnvelope className="text-sky-400" />
                <span className="font-semibold">Correo</span>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button
                  onClick={handleSaveEmail}
                  disabled={savingEmail}
                  className="self-start bg-sky-600 hover:bg-sky-700 text-sm px-3 py-1.5"
                >
                  {savingEmail ? "Guardando..." : "Guardar correo"}
                </Button>
                {emailMsg && (
                  <p className="text-xs text-gray-300">{emailMsg}</p>
                )}
              </div>
            </div>

            {/* Miembro desde */}
            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300">
                <FaCalendarAlt className="text-sky-400" />
                <span className="font-semibold">Miembro desde</span>
              </div>
              <p className="mt-1">{miembroDesde}</p>
            </div>
          </div>

          {/* Selector de avatares */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-sky-300">
              Selecciona un avatar
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {options.map((url) => (
                <button
                  key={url}
                  onClick={() => setSelected(url)}
                  className={`p-1 rounded-full ring-2 transition ${
                    selected === url
                      ? "ring-sky-500"
                      : "ring-transparent hover:ring-zinc-600"
                  }`}
                >
                  <img
                    src={url}
                    alt="opción de avatar"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Nota seguridad */}
          <p className="text-xs text-gray-500 mt-6">
            Por seguridad, tu contraseña no se muestra.
          </p>
        </Card>
      </motion.div>
    </Container>
  );
}

export default ProfilePage;
