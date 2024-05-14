import { HttpClient } from "../../httpClient";
import { ResponseType } from "../../response";
import { IExplorationsRetDTO } from "../exploration";

export class ExplorationRepository extends HttpClient {
    private static repoInstance? : ExplorationRepository;

    private constructor() {
        super(import.meta.env.VITE_SERVER_URL);
    }

    public static getInstance() {
        if (!this.repoInstance) {
            this.repoInstance = new ExplorationRepository();
        }
    
        return this.repoInstance;
    }

    public getAllExplorations = async () => {
        const data = await this.instance.get<ResponseType<IExplorationsRetDTO>>('exploration');
        
        return data;
    }
}
