import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { config as APIconfig } from "@/config/ytmusic-api";

export type request_method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export default async function request(method: 'GET' | 'DELETE', path: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any> | null | false>;
export default async function request(method: request_method, path: string, config?: AxiosRequestConfig<any>, data?: any): Promise<AxiosResponse<any, any> | null | false> {
    if (
        !( method === 'POST' || method === 'DELETE' ) &&
        data
    ) throw new Error('Overload not supported');

    const endpoint = `${APIconfig.YTMUSIC_API_HOST}${APIconfig.YTMUSIC_API_PORT?':'+APIconfig.YTMUSIC_API_PORT:''}`
    const url = `http://${endpoint}/${path}`
    const req =
          method === 'GET' ? await axios.get(url, config)
        : method === 'POST' ? await axios.post(url, data, config)
        : method === 'PATCH' ? await axios.patch(url, data, config)
        : method === 'DELETE' ? await axios.delete(url, config)
        : false
    
    if ( !req ) return false;

    return req;
}