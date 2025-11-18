import { useEffect, useState } from "react";
import TaskCard from "../components/tasks/TaskCard";
import { useTasks } from "../context/TaskContext";
import { TASK_CATEGORIES } from "../components/tasks/taskCategories";

function TasksPage() {
  const { tasks, loadTasks } = useTasks();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks =
    selectedCategory === "all"
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  // 👉 Ordenar por fecha de recordatorio (las más próximas primero)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aHasReminder = !!a.reminder_at;
    const bHasReminder = !!b.reminder_at;

    // Si ninguno tiene recordatorio, mantener orden original
    if (!aHasReminder && !bHasReminder) return 0;

    // Las que tienen reminder van antes que las que no
    if (aHasReminder && !bHasReminder) return -1;
    if (!aHasReminder && bHasReminder) return 1;

    // Ambos tienen reminder: ordenar por fecha ascendente
    const dateA = new Date(a.reminder_at).getTime();
    const dateB = new Date(b.reminder_at).getTime();
    return dateA - dateB;
  });

  return (
    <div className="min-h-[calc(100vh-10rem)] px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Título */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Tareas</h1>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-sm border 
              ${
                selectedCategory === "all"
                  ? "bg-sky-600 border-sky-500 text-white"
                  : "bg-transparent border-neutral-700 text-neutral-200 hover:bg-neutral-800"
              }`}
          >
            Todas
          </button>

          {TASK_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-full text-sm border 
                ${
                  selectedCategory === cat.value
                    ? "bg-sky-600 border-sky-500 text-white"
                    : "bg-transparent border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de tareas filtradas y ordenadas */}
        {sortedTasks.length === 0 ? (
          <div className="flex justify-center items-center h-[calc(100vh-14rem)]">
            {tasks.length === 0 ? (
              <h1 className="text-2xl font-bold">Aún no tienes tareas</h1>
            ) : (
              <h1 className="text-xl font-semibold">
                No hay tareas para esta categoría
              </h1>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
