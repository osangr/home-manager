export type Project = {
  id: string;
  name: string;
  description: string | null;
  total_budget: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Space = {
  id: string;
  name: string;
  icon: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
};

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  space_id: string;
  professional_id: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  estimated_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
};

// Tipos para crear (sin id, created_at, updated_at)
export type CreateProject = Omit<Project, "id" | "created_at" | "updated_at">;
export type CreateSpace = Omit<Space, "id" | "created_at" | "updated_at">;
export type CreateTask = Omit<Task, "id" | "created_at" | "updated_at">;

// Tipos para actualizar (todo opcional excepto id)
export type UpdateProject = Partial<
  Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
>;
export type UpdateSpace = Partial<
  Omit<Space, "id" | "created_at" | "updated_at">
>;
export type UpdateTask = Partial<
  Omit<Task, "id" | "created_at" | "updated_at">
>;
