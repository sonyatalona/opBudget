export type Category = {
  id: number;
  name: string;
  timesUsed: number;
  createdAt: Date;
  description?: string;
  isParent: boolean;
  parentId?: number;
  children?: Category[];
};
