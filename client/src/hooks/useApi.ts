import { useEffect, useState } from 'react';
import { api } from '../utils/apiClient';
import { AxiosRequestConfig } from 'axios';

interface ApiCallContext {
    route: string
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
    body?: any
    config?: AxiosRequestConfig<any>
    mapperFn: (data: any) => any
}

export function useApi<Source>({route, method, body, config, mapperFn}: ApiCallContext){
    const [data, setData] = useState<Source | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                let responseData: any;
                switch (method){
                    case 'GET':
                        responseData = (await api.get(route, config)).data;
                        break;
                    case 'POST':
                        responseData = (await api.post(route, body, config)).data;
                        break;
                    case 'PATCH':
                        responseData = (await api.patch(route, body, config)).data;
                        break;
                    case 'PUT':
                        responseData = (await api.put(route, body, config)).data;
                        break;
                    case 'DELETE':
                        responseData = (await api.delete(route, config)).data;
                        break;
                    default:
                        setError(`Not Implemented Method: ${method}`)
                        break;
                }
                setData(mapperFn(responseData));
            } catch (error) {
                setData(null);
                setError(`${error}`);
            }
            setIsLoading(false);
        }

        getData();
    }, [route, method]);

    return { data, isLoading, error };
}