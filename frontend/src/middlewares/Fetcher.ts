import { Fetch } from "./Axios";

export const fetcher = (url: string) => Fetch.get(url).then(res => res.data)
