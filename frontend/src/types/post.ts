export type Post = {
    id: number;
    display_name: string;
    description: string;
    location: number[];
    tags: string[];
    picture?: string;
    price_range: number;
}