export interface IImagesRetDTO {
    explorationsImage: IImageByIdRetDTO[],
}

interface IImageByIdRetDTO {
    image_id: string,
    exploration_id: string,
    image_blob: string,
}