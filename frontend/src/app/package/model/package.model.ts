export interface Package {
  id?: string;
  title: string;
  type: string;
  version: string;
  supportedDevices: string[];
  fileName: string;
  file?: File;
  updated?: Date | null;
  created?: Date;
}

export function transformFromJson(data: any): Package {
  return {
    id: data._id,
    title: data.title,
    type: data.type,
    version: data.version,
    supportedDevices: data.supportedDeviceTypes,
    fileName: data.fileName,
    updated: data?.updated ? new Date(data.updated) : null,
    created: new Date(data.created),
  };
}
