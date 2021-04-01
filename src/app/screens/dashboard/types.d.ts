type Board = {
  id?: string;
  uid?: string;
  title?: string;
  priority: number;
  limit?: number;
  tasks: Task[];
};
type Task = {
  description: string;
  label: 'yellow' | 'blue' | 'red' | 'green' ;
};
