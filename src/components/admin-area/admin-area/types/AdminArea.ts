export interface AdminArea {
  id: number;
  name: string;
  code: string;
  description: string;
  parent_id: number;
  level_id: number;
  active: boolean;
}
