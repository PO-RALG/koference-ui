import { Project } from "@/components/coa/project/types/Project";
import { SubBudgetClass } from "@/components/coa/sub-budget-class/types/SubBudgetClass";

export interface Activity {
  id: number;
  code: string;
  description: string;
  project_id: number;
  sub_budget_class_id: number;
  project: Project;
  sub_budget_class: SubBudgetClass;
}
