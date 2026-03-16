// Simple global store for passing data between screens
let selectedExerciseData: any = null;
let selectionAction: 'add' | 'replace' | null = null;
let selectionTargetId: string | null = null;

export const SelectionStore = {
  setData: (data: any, action: 'add' | 'replace', targetId?: string) => {
    selectedExerciseData = data;
    selectionAction = action;
    selectionTargetId = targetId || null;
  },
  getData: () => {
    return {
      data: selectedExerciseData,
      action: selectionAction,
      targetId: selectionTargetId
    };
  },
  clear: () => {
    selectedExerciseData = null;
    selectionAction = null;
    selectionTargetId = null;
  }
};
