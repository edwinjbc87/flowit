export interface ApiResponse<T> {
    success: boolean;
    value?: T;
    message?: string;
}