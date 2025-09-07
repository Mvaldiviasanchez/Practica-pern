import { useAuth } from '../context/AuthContext'
import { Card } from '../components/ui'
function HomePage() {
    const data = useAuth()
    console.log(data)
    return (
        <div>

            <Card>
                <h1 className='text-3xl font-bold my-4'>Página principal</h1>
                <p>Bienvenido a la aplicación de tareas ORDENAT</p>
            </Card>
        </div>
    )
}

export default HomePage;
