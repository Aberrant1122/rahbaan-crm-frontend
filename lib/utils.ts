import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined, includeTime: boolean = false): string {
    if (!date) return 'N/A';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
        return 'N/A';
    }

    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat('en-US', options).format(d);
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function getStatusColor(status: string): string {
    const statusMap: Record<string, string> = {
        'New Leads': 'slate',
        'Contacted': 'blue',
        'Qualified': 'emerald',
        'Proposal': 'indigo',
        'Second Wing': 'amber',
        'Closed Won': 'green',
        'Closed Lost': 'rose',
    };
    return statusMap[status] || 'slate';
}

export function getPriorityColor(priority: string): string {
    const priorityMap: Record<string, string> = {
        'High': 'rose',
        'Medium': 'amber',
        'Low': 'slate',
    };
    return priorityMap[priority] || 'slate';
}

export function getTaskStatusColor(status: string): string {
    const statusMap: Record<string, string> = {
        'Completed': 'emerald',
        'In Progress': 'blue',
        'Pending': 'slate',
    };
    return statusMap[status] || 'slate';
}
