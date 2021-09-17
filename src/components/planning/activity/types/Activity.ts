import { Project } from "@/components/setup/project/types/Project";
import { SubBudgetClass } from "@/components/setup/sub-budget-class/types/SubBudgetClass";

export interface Activity {
  id: number;
  code: string;
  description: string;
  project_id: number;
  sub_budget_class_id: number;
  project: Project;
  sub_budget_class:SubBudgetClass
}
