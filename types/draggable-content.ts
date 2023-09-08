export default interface DraggableContent {
    id: number;
    name: string;
    children?: DraggableContent[];
    [key: string]: unknown; // Index signature for unknown properties
}