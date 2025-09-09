import { Card, Container } from "../components/ui"
import { FaReact, FaNodeJs, FaGithub } from "react-icons/fa"
import { SiPostgresql, SiExpress } from "react-icons/si"
import { FaDatabase } from "react-icons/fa"
import { motion } from "framer-motion"

function AboutPage() {
  return (
    <Container className="flex justify-center items-center mt-10">
      {/* Contenedor responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">

        {/* Card izquierda - Descripción */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="p-6">
            <h1 className="text-3xl font-bold text-sky-400 mb-4 text-center md:text-left">
              Acerca de ORDENAT
            </h1>
            <p className="text-gray-300 mb-3">
              <strong>ORDENAT</strong> es una plataforma web diseñada para gestionar
              tareas de forma virtual.
            </p>
            <p className="text-gray-300">
              Con una interfaz sencilla y accesible, ORDENAT permite a los usuarios 
              registrar, editar y eliminar tareas, mejorando la organización diaria, 
              reduciendo pérdidas de información y aumentando la productividad.
            </p>
          </Card>
        </motion.div>

        {/* Card derecha - Tecnologías */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-sky-300 mb-4 text-center md:text-left">
              Tecnologías utilizadas
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-200">
              <li className="flex items-center gap-2 hover:text-sky-400 transition">
                <FaReact className="text-sky-400 text-2xl" /> React.js
              </li>
              <li className="flex items-center gap-2 hover:text-green-500 transition">
                <FaNodeJs className="text-green-500 text-2xl" /> Node.js
              </li>
              <li className="flex items-center gap-2 hover:text-gray-300 transition">
                <SiExpress className="text-gray-400 text-2xl" /> Express.js
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition">
                <SiPostgresql className="text-blue-500 text-2xl" /> PostgreSQL
              </li>
              <li className="flex items-center gap-2 hover:text-yellow-400 transition">
                <FaDatabase className="text-yellow-400 text-2xl" /> Base de datos
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <FaGithub className="text-white text-2xl" /> GitHub
              </li>
            </ul>
          </Card>
        </motion.div>

      </div>
    </Container>
  )
}

export default AboutPage
