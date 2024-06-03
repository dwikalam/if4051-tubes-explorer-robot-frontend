import { HttpClient } from "../../httpClient";
import { IPostObjectDetectionArgDto, IPostObjectDetectionRetDto } from "../model/VideoStream";

export class StreamRepository extends HttpClient {
    private static repoInstance?: StreamRepository;

    private constructor() {
        super(`${import.meta.env.VITE_SERVER_URL}/image`);
    }

    public static getInstance() {
        if (!this.repoInstance) {
            this.repoInstance = new StreamRepository();
        }
    
        return this.repoInstance;
    }

    public postObjectDetection = async (dto: IPostObjectDetectionArgDto) => {
        const data = await this.instance.post<IPostObjectDetectionRetDto>('/', dto);
        
        return data;
    }
}
