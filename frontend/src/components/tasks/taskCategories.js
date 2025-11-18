export const TASK_CATEGORIES = [
  { value: "clientes", label: "Clientes" },
  { value: "pagos_pendientes", label: "Pagos pendientes" },
  { value: "entregas", label: "Entregas" },
  { value: "presupuestos", label: "Presupuestos" },
  { value: "urgente", label: "Urgente" },
  { value: "recordatorio_general", label: "Recordatorio general" },
];

export const DEFAULT_TASK_CATEGORY = "clientes";

// helper para mostrar el texto bonito de la categoría en las tarjetas
export const getCategoryLabel = (value) => {
  const found = TASK_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
};
