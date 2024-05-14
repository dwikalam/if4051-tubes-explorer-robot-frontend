import { HttpClient } from "../../httpClient";
import { IImagesRetDTO } from "../image";

export class ImageRepository extends HttpClient {
    private static repoInstance? : ImageRepository;

    private constructor() {
        super(`${import.meta.env.VITE_SERVER_URL}/image`);
    }

    public static getInstance() {
        if (!this.repoInstance) {
            this.repoInstance = new ImageRepository();
        }
    
        return this.repoInstance;
    }

    public getAllImages = async () => {
        const data = await this.instance.get<IImagesRetDTO>('/');
        
        return data;
    }
}
