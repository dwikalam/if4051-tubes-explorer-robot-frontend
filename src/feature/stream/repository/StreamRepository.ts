import { HttpClient } from "../../httpClient";
import { IGetObjectDetectionArgDto, IGetObjectDetectionRetDto, IPostObjectDetectionArgDto, IPostObjectDetectionRetDto } from "../model/VideoStream";

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

    public getObjectDetection = async (dto: IGetObjectDetectionArgDto) => {
        const data = await this.instance.get<IGetObjectDetectionRetDto>(`/?exploration_id=${dto.exploration_id}`);
        
        return data;
    }

    public postObjectDetection = async (dto: IPostObjectDetectionArgDto) => {
        const data = await this.instance.post<IPostObjectDetectionRetDto>('/', dto);
        
        return data;
    }
}
