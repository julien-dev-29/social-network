interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string | null;
    updatedAt: string | null;
}