import { Contact } from "./db-contact-interface";

interface Tasks {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    status: 'To Do' | 'In Progress' | 'await Feedback' | 'Done';
    assignedTo: Contact[];
    subtasks: Subtask[];
    createdAt: Date;
}

interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
}