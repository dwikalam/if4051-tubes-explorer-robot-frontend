import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

declare module 'axios' {
    interface AxiosResponse<T> extends Promise<T> {}
  }
export abstract class HttpClient{
    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string){
        this.instance = axios.create({
            baseURL,
        })

        this._initializeResponseInterceptor();
        this._initializeRequestInterceptor();
    }

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponseOnSuccess,
            this._handleResponseOnError,
        )
    }

    private _initializeRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleRequestOnSuccess,
            this._handleRequestOnError,
        )
    }

    private _handleResponseOnSuccess = (response: AxiosResponse) => {
        return response.data;
    }

    private _handleResponseOnError = (error: Error | AxiosError) => {
        return Promise.reject(error);
    }

    private _handleRequestOnSuccess = (config: InternalAxiosRequestConfig) => {
        return config;
    }

    private _handleRequestOnError = (error: Error) => {
        return Promise.reject(error);
    }
}