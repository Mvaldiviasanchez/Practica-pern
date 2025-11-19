// src/pages/TaskFormPage.jsx
import {
  Card,
  Input,
  Textarea,
  Label,
  Button,
  Container,
} from "../components/ui";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { motion } from "framer-motion";
import {
  TASK_CATEGORIES,
  DEFAULT_TASK_CATEGORY,
} from "../components/tasks/taskCategories";

// helper para formatear a 'YYYY-MM-DDTHH:MM' para <input type="datetime-local">
const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      category: DEFAULT_TASK_CATEGORY,
      reminder_at: "",
    },
  });

  const navigate = useNavigate();
  const { createTask, updateTask, loadTask, errors: tasksErrors } = useTasks();
  const params = useParams();

  // 📎 archivo nuevo seleccionado
  const [attachment, setAttachment] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  // 📎 archivo que ya tenía la tarea (cuando estamos editando)
  const [existingAttachmentName, setExistingAttachmentName] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    let task;

    // Armamos siempre un FormData (crear y editar)
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("category", data.category || DEFAULT_TASK_CATEGORY);

    if (data.reminder_at) {
      formData.append("reminder_at", data.reminder_at);
    }

    // Si hay archivo nuevo seleccionado, lo mandamos
    // Si no hay, NO mandamos "attachment" => el backend mantiene el antiguo
    if (attachment) {
      formData.append("attachment", attachment);
    }

    if (!params.id) {
      // CREAR
      task = await createTask(formData);
    } else {
      // EDITAR
      task = await updateTask(params.id, formData);
    }

    if (task) navigate("/tasks");
  });

  useEffect(() => {
    if (params.id) {
      loadTask(params.id).then((task) => {
        if (!task) return;
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("category", task.category || DEFAULT_TASK_CATEGORY);
        setValue("reminder_at", formatDateTimeLocal(task.reminder_at));

        // guardamos el nombre del archivo ya adjunto (si existe)
        setExistingAttachmentName(task.attachment_name || "");
      });
    }
  }, []);

  // Texto que se muestra al lado del botón de archivo
  const fileLabelText = (() => {
    if (selectedFileName) return `Archivo seleccionado: ${selectedFileName}`;
    if (existingAttachmentName && params.id) {
      return `Archivo actual: ${existingAttachmentName}`;
    }
    return "Ningún archivo seleccionado";
  })();

  return (
    <Container className="min-h-[calc(100vh-64px)] w-full flex items-start justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-sm -translate-y-6"
      >
        <Card className="w-full min-h-[360px] flex flex-col justify-center p-6 md:p-8 shadow-lg shadow-black/40">
          {tasksErrors.map((error, i) => (
            <p className="text-red-500" key={i}>
              {error}
            </p>
          ))}

          <h1 className="text-3xl md:text-4xl font-bold my-2 text-center">
            {params.id ? "Editar tarea" : "Crear tarea"}
          </h1>

          {/* IMPORTANTE: para archivos, no hace falta poner encType aquí
              porque lo maneja el fetch/axios, pero no molesta si lo agregas */}
          <form onSubmit={onSubmit}>
            {/* TÍTULO */}
            <Label htmlFor="title">Título</Label>
            <Input
              type="text"
              placeholder="Ingresa el título"
              autoFocus
              {...register("title", { required: true })}
            />
            {errors.title && (
              <p className="text-red-500">El título es obligatorio</p>
            )}

            {/* DESCRIPCIÓN */}
            <Label htmlFor="description">Ingresa la descripción</Label>
            <Textarea
              placeholder="Ingresa la descripción"
              rows={3}
              {...register("description")}
            />

            {/* CATEGORÍA */}
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              {...register("category", { required: true })}
              className="
                w-full mb-4
                rounded-md border border-neutral-700
                bg-[#111827] text-sm text-white
                px-3 py-2
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
              "
            >
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500">La categoría es obligatoria</p>
            )}

            {/* FECHA Y HORA DE RECORDATORIO */}
            <Label htmlFor="reminder_at">Recordatorio (fecha y hora)</Label>
            <input
              id="reminder_at"
              type="datetime-local"
              {...register("reminder_at")}
              className="
                w-full mb-4 mt-1
                rounded-md border border-neutral-700
                bg-[#111827] text-sm text-white
                px-3 py-2
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
              "
            />

            {/* 📎 ARCHIVO ADJUNTO */}
            <Label htmlFor="attachment">Archivo adjunto (PDF o imagen)</Label>
            <div className="mb-4 mt-1">
              {/* Input real oculto */}
              <input
                id="attachment"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setAttachment(file || null);
                  setSelectedFileName(file ? file.name : "");
                }}
              />
              <div className="flex items-center gap-3">
                {/* Botón custom en español y con color similar al de “Editar tarea” */}
                <label
                  htmlFor="attachment"
                  className="
                    inline-flex items-center justify-center
                    px-4 py-2 rounded-md
                    text-sm font-semibold
                    cursor-pointer
                    bg-indigo-600 hover:bg-indigo-700
                    transition-colors
                  "
                >
                  Elegir archivo
                </label>
                <span className="text-xs sm:text-sm text-gray-300">
                  {fileLabelText}
                </span>
              </div>
            </div>

            <Button className="w-full">
              {params.id ? "Editar tarea" : "Crear tarea"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </Container>
  );
}

export default TaskFormPage;
