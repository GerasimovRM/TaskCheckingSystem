
export enum IAttachmentTaskTypeName {
    INPUT_OUTPUT = "input_output",
    IMAGE = "image"
}

interface IAttachmentTaskInputOutputData {
    input: string[];
    output: string[];
}

interface IAttachmentTaskImageData {
    url: string;
}

export interface IAttachmentTaskInputOutput {
    attachment_type: IAttachmentTaskTypeName.INPUT_OUTPUT;
    data: IAttachmentTaskInputOutputData;
}

export interface IAttachmentTaskImage {
    attachment_type: IAttachmentTaskTypeName.IMAGE;
    data: IAttachmentTaskImageData;
}

export type IAttachmentTask = IAttachmentTaskImage | IAttachmentTaskInputOutput