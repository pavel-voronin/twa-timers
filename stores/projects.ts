export type Project = {
  id: number;
  name: string;
};

export const useProjectsStore = defineStore("projects", () => {
  const projects = useLocalStorage<Project[]>("projects", [
    { id: 1, name: "default" },
    { id: 2, name: "qwerty" },
  ]);
  const currentProjectId = useLocalStorage<number | null>(
    "current_project_id",
    null,
    {
      serializer: {
        read: (v) => (v !== null ? Number(v) : null), // Convert string to number if not null
        write: (v) => String(v), // Store as string in localStorage
      },
    }
  );

  const currentProject = computed(() => {
    return projects.value.find(
      (project) => project.id === currentProjectId.value
    );
  });

  const quitProject = () => {
    currentProjectId.value = null;
  };
  const selectProject = (project?: Project) => {
    currentProjectId.value = project ? project.id : null;
  };

  return {
    currentProject,
    projects,
    selectProject,
    quitProject,
  };
});
