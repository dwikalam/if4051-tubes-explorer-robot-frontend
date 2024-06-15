import { HttpClient } from "../../httpClient";
import { ICreateExplorationArgDto, ICreateExplorationRetDto, IExplorationsRetDto } from "../exploration";

export class ExplorationRepository extends HttpClient {
    private static repoInstance?: ExplorationRepository;

    private constructor() {
        super(`${import.meta.env.VITE_BE_SERVER_URL}/exploration`);
    }

    public static getInstance() {
        if (!this.repoInstance) {
            this.repoInstance = new ExplorationRepository();
        }
    
        return this.repoInstance;
    }

    public getAllExplorations = async () => {
        const data = await this.instance.get<IExplorationsRetDto>('/');
        
        return data;
    }

    public createExploration = async (dto: ICreateExplorationArgDto) => {
        const data = await this.instance.post<ICreateExplorationRetDto>('/', dto);
        
        return data;
    }
}
