import { describe, beforeEach, it, expect } from "vitest";
import { useProjectStats } from "./useProjectStats";
import { useTaskStore } from "@/stores/taskStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import { createPinia, setActivePinia } from "pinia";
import type { Task, TaskStatus, Space, TaskPriority } from "@/types/database";

function createMockSpace(overrides: Partial<Space> = {}): Space {
  return {
    id: "space-1",
    name: "Space 1",
    icon: null,
    project_id: "project-1",
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Task 1",
    description: null,
    status: "completed" as TaskStatus,
    priority: "medium" as TaskPriority,
    category: null,
    space_id: "space-1",
    professional_id: null,
    estimated_cost: null,
    actual_cost: null,
    estimated_date: null,
    completed_date: null,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

describe("useProjectStats", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("getProjectStats", () => {
    it("returns empty stats when there are no spaces", () => {
      const { getProjectStats } = useProjectStats();
      const stats = getProjectStats("project-1");

      expect(stats.spacesCount).toBe(0);
      expect(stats.tasksCount).toBe(0);
      expect(stats.completedTasks).toBe(0);
      expect(stats.progressPercentage).toBe(0);
    });

    it("calculates stats correctly with real data", () => {
      const spacesStore = useSpacesStore();
      const taskStore = useTaskStore();

      spacesStore.spaces = [
        createMockSpace({ id: "space-1", project_id: "project-1" }),
        createMockSpace({
          id: "space-2",
          name: "Space 2",
          project_id: "project-1",
        }),
      ];

      taskStore.tasks = [
        createMockTask({
          id: "task-1",
          space_id: "space-1",
          status: "completed",
        }),
        createMockTask({
          id: "task-2",
          space_id: "space-1",
          status: "in_progress",
        }),
        createMockTask({
          id: "task-3",
          space_id: "space-2",
          status: "completed",
        }),
      ];

      const { getProjectStats } = useProjectStats();

      const stats = getProjectStats("project-1");

      expect(stats.spacesCount).toBe(2);
      expect(stats.tasksCount).toBe(3);
      expect(stats.completedTasks).toBe(2);
      expect(stats.progressPercentage).toBe(67);
    });
  });

  describe("getSpaceStats", () => {
    it("calculates stats correctly for a single space", () => {
      const taskStore = useTaskStore();

      taskStore.tasks = [
        createMockTask({
          id: "task-1",
          status: "completed",
        }),
        createMockTask({
          id: "task-2",
          status: "in_progress",
        }),
        createMockTask({
          id: "task-3",
          status: "pending",
        }),
      ];

      const { getSpaceStats } = useProjectStats();

      const stats = getSpaceStats("space-1");

      expect(stats.tasksCount).toBe(3);
      expect(stats.completedTasks).toBe(1);
      expect(stats.progressPercentage).toBe(33);
    });

    it("returns zero progress when there are no tasks", () => {
      const { getSpaceStats } = useProjectStats();

      const stats = getSpaceStats("space-1");

      expect(stats.tasksCount).toBe(0);
      expect(stats.completedTasks).toBe(0);
      expect(stats.progressPercentage).toBe(0);
    });
  });
});
