import PropTypes from "prop-types";

import { Card, Button } from "../ui";
import { useTasks } from "../../context/TaskContext";
import { useNavigate } from "react-router-dom";
import { PiTrashSimpleLight } from "react-icons/pi";
import { BiPencil } from "react-icons/bi";

import { getCategoryLabel } from "./taskCategories";

// ----------------------------------------------------
// HELPER PARA FORMATEAR FECHA Y MOSTRAR "Faltan X días"
// + detectar si está vencida
// ----------------------------------------------------
const getReminderInfo = (reminder_at) => {
  if (!reminder_at) return null;

  const date = new Date(reminder_at);
  if (Number.isNaN(date.getTime())) return null;

  const pad = (n) => String(n).padStart(2, "0");

  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());

  const label = `${dd}-${mm}-${yyyy} ${hh}:${mi}`;

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  let status;
  let isOverdue = false;

  if (diffMs <= 0) {
    status = "Vencido";
    isOverdue = true;
  } else if (diffDays === 0) {
    status = "Hoy";
  } else if (diffDays === 1) {
    status = "Mañana";
  } else {
    status = `Faltan ${diffDays} días`;
  }

  return { label, status, isOverdue };
};

// ----------------------------------------------------
// COMPONENTE TASKCARD
// ----------------------------------------------------
function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  const navigate = useNavigate();

  const reminderInfo = getReminderInfo(task.reminder_at);
  const isOverdue = reminderInfo?.isOverdue;

  const cardClasses = `
    px-7 py-4 flex flex-col justify-center
    ${isOverdue ? "border border-red-600 bg-red-950/30" : ""}
  `;

  return (
    <Card key={task.id} className={`${cardClasses} overflow-hidden`}>
      {/* HEADER: título + categoría */}
      <div className="flex items-start justify-between mb-1 gap-3">
        <h1 className="text-2xl font-bold break-words flex-1 min-w-0">
          {task.title}
        </h1>

        {task.category && (
          <span className="text-xs px-2 py-1 rounded-full bg-sky-900 text-sky-200 whitespace-nowrap flex-shrink-0">
            {getCategoryLabel(task.category)}
          </span>
        )}
      </div>

      {/* DESCRIPCIÓN */}
      <p className="text-neutral-300 mb-2 break-words">
        {task.description}
      </p>

      {/* RECORDATORIO */}
      {reminderInfo && (
        <div className="text-xs flex items-center justify-between mt-1 mb-2">
          <span className="text-neutral-300"> {reminderInfo.label}</span>
          <span
            className={`font-semibold ${
              isOverdue ? "text-red-400" : "text-sky-400"
            }`}
          >
            {reminderInfo.status}
          </span>
        </div>
      )}

      {/* PDF adjuntado (solo texto) */}
      {task.attachment_name && (
        <div className="text-xs mt-1 mb-2 text-neutral-300 flex items-center gap-1 max-w-[12rem] truncate">
          <span> PDF adjuntado:</span>
          <span title={task.attachment_name} className="truncate">
            {task.attachment_name}
          </span>
        </div>
      )}

      {/* BOTONES */}
      <div className="mt-2 flex justify-end gap-x-2">
        <Button onClick={() => navigate(`/tasks/${task.id}/edit`)}>
          <BiPencil className="text-white" /> Editar
        </Button>

        <Button
          className="bg-red-700 hover:bg-red-600"
          onClick={async () => {
            if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
              deleteTask(task.id);
            }
          }}
        >
          <PiTrashSimpleLight className="text-white" /> Eliminar
        </Button>
      </div>
    </Card>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    reminder_at: PropTypes.string,
    attachment_path: PropTypes.string,
    attachment_name: PropTypes.string,
  }).isRequired,
};

export default TaskCard;