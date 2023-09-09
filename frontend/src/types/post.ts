export type Post = {
    id: number;
    display_name: string;
    description: string;
    location: number[];
    tags: string[];
    price_rating: number[];
    picture?: string;
}