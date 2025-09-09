import { Link } from 'react-router-dom'
import { Card, Container } from '../components/ui'
import { FaTasks } from 'react-icons/fa'

function HomePage() {
  return (
    <Container className="flex justify-center items-center mt-10">
      <Card className="p-10 text-center max-w-2xl">
        {/* Ícono de tareas */}
        <FaTasks className="text-sky-400 text-7xl mb-6 mx-auto" />

        {/* Título grande */}
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400 mb-4">
          Bienvenido a ORDENAT
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-gray-300 mb-6">
          Organiza tus tareas de forma simple, digital y accesible.
        </p>

        {/* Botón call-to-action */}
        <Link
          to="/register"
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Comenzar ahora
        </Link>
      </Card>
    </Container>
  )
}

export default HomePage
