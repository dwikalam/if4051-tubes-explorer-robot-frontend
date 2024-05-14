export interface IExplorationsRetDto {
    explorationsData: IExplorationByIdRetDto[],
}

export interface IExplorationByIdRetDto {
    id: string,
    name: string,
}