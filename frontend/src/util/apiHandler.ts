import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

export const API_URL = 'https://chrissytopher.com/backend'

export async function GET(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse> {
    return fetch('GET', url, config);
}

export async function POST(url: string, data: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse> {
    return fetch('POST', url, {...config, data});
}

export async function fetch(method: string, url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse> {
    try {
        var res = await axios.request({
            ...config, 
            method: method, 
            url: `${API_URL}${url}`
        });
        if (res.data.success === false) throw new ApiError(res.data.error || res.statusText || "Unknown error", res.status);
        return res;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response)
                throw new ApiError(error.response?.data?.error || error.response?.statusText || "Unknown error", error.response?.status || 500);
            else
                throw new ApiError(error.message, 500);
        } else {
            throw error;
        }
    }
}

class ApiError extends Error {

    status: number
    
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}