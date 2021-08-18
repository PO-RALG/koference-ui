export interface TreeNode {
  id: number;
  code: string;
  name: string;
  children: TreeNode[];
}

export interface Selectable {
  id: number;
  code: string;
  name: string;
}
