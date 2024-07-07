import { AxiosError, AxiosResponse } from "axios";
import { Observable } from "rxjs";

function handleRequest<T>(axiosPromise: Promise<AxiosResponse<T>>): Observable<T> {
    return new Observable<T>(observer => {
      axiosPromise
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(`Error: ${error}`);
        });
    })
  }
  
export default handleRequest;