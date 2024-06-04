export interface IGetObjectDetectionByIdRetDto {
    image_id: string,
    exploration_id: string,
    image_blob: string,
}

export interface IGetObjectDetectionRetDto {
    explorationsImage: IGetObjectDetectionByIdRetDto[],
}

export interface IGetObjectDetectionArgDto {
    exploration_id: string,
}

export interface IPostObjectDetectionArgDto {
    exploration_id: string,
    image_blob: string,
}

export interface IPostObjectDetectionRetDto {
    message: string,
}