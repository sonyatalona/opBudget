export type Category = {
  id: number;
  name: string;
  timesUsed: number;
  createdAt: string;
  description?: string;
  isParent: boolean;
  parentId?: number;
  children?: Category[];
};
