export interface Retrospective {
    id: string;
    date: string;
    title: string;
    category: 'keep' | 'stop' | 'start' | 'improve';
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface RetrospectiveStats {
    total: number;
    byCategory: {
        keep: number;
        stop: number;
        start: number;
        improve: number;
    };
    lastUpdated: Date;
}
