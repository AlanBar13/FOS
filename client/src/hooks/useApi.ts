import { useEffect, useState } from 'react';
import { api } from '../utils/apiClient';
import { AxiosRequestConfig } from 'axios';
import { useAlert } from './useAlert';

interface ApiCallContext {
    route: string
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
    body?: any
    config?: AxiosRequestConfig<any>
    mapperFn?: (data: any) => any
}

export function useApi<Source>({route, method, body, config, mapperFn}: ApiCallContext){
    const { showAlert } = useAlert();
    const [data, setData] = useState<Source | null>(null);
    const [statusCode, setSatusCode] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                let responseData: any;
                let resStatusCode: number | null = null;
                switch (method){
                    case 'GET':
                        const getRes = await api.get(route, config);
                        resStatusCode = getRes.status;
                        responseData = getRes.data;
                        break;
                    case 'POST':
                        const postRes = await api.post(route, body, config);
                        resStatusCode = postRes.status;
                        responseData = postRes.data;
                        break;
                    case 'PATCH':
                        const patchRes = await api.patch(route, body, config);
                        resStatusCode = patchRes.status;
                        responseData = patchRes.data;
                        break;
                    case 'PUT':
                        const putRes = await api.put(route, body, config);
                        resStatusCode = putRes.status;
                        responseData = putRes.data;
                        break;
                    case 'DELETE':
                        const delRes = await api.delete(route, config);
                        resStatusCode = delRes.status;
                        responseData = delRes.data;
                        break;
                    default:
                        setError(`Not Implemented Method: ${method}`);
                        showAlert(`Not Implemented Method: ${method}`, 'error')
                        break;
                }
                setSatusCode(resStatusCode);
                if (mapperFn){
                    setData(mapperFn(responseData));
                }else{
                    setData(responseData as Source);
                }
            } catch (error) {
                setData(null);
                setError(`${error}`);
                showAlert(`Error al llamar al server: ${error}`, 'error');
            }
            setIsLoading(false);
        }

        getData();
    }, [route, method]);

    return { data, statusCode, isLoading, error };
}