import { HttpClient } from "../../httpClient";
import { ResponseType } from "../../response";
import { IImagesRetDTO } from "../image";

export class ImageRepository extends HttpClient {
    private static repoInstance? : ImageRepository;

    private constructor() {
        super(import.meta.env.VITE_SERVER_URL);
    }

    public static getInstance() {
        if (!this.repoInstance) {
            this.repoInstance = new ImageRepository();
        }
    
        return this.repoInstance;
    }

    public getAllImages = async () => {
        const data = await this.instance.get<ResponseType<IImagesRetDTO>>('image');
        
        return data;
    }
}
