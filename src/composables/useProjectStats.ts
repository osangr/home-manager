import { useSpacesStore } from "@/stores/spaceStorage";
import { useTaskStore } from "@/stores/taskStore";

export function useProjectStats() {
  const spaceStore = useSpacesStore();
  const taskStore = useTaskStore();

  const calculateProgress = (total: number, completed: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getProjectSpaces = (projectId: string) => {
    return spaceStore.spaces.filter((s) => s.project_id === projectId);
  };

  const getTasksFromSpaces = (spaces: Array<{ id: string }>) => {
    const spaceIds = new Set(spaces.map((s) => s.id));
    return taskStore.tasks.filter((t) => spaceIds.has(t.space_id));
  };

  const getSpaceTasks = (spaceId: string) => {
    return taskStore.tasks.filter((t) => t.space_id === spaceId);
  };

  const countCompleted = (tasks: Array<{ status: string }>) => {
    return tasks.filter((t) => t.status === "completed").length;
  };

  const getProjectStats = (projectId: string) => {
    const spaces = getProjectSpaces(projectId);
    const tasks = getTasksFromSpaces(spaces);
    const completed = countCompleted(tasks);

    return {
      spacesCount: spaces.length,
      tasksCount: tasks.length,
      completedTasks: completed,
      progressPercentage: calculateProgress(tasks.length, completed),
    };
  };

  const getSpaceStats = (spaceId: string) => {
    const tasks = getSpaceTasks(spaceId);
    const completed = countCompleted(tasks);

    return {
      tasksCount: tasks.length,
      completedTasks: completed,
      progressPercentage: calculateProgress(tasks.length, completed),
    };
  };

  return {
    getProjectStats,
    getSpaceStats,
  };
}
