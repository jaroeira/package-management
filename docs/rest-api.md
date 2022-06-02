# Package Management REST-API

## Endpoints

### POST /packages/create

- title: string - required
- type: string - firmware | tool - required
- vesion: string - x.x.x ex 1.1.1 - required
- supportedDeviceTypesL array of strings - required
- file: file zip|tar|bin|rar|7z - required

### GET /packages/list

- type: string - firmware | tool - required
- vesion: string - x.x.x ex 1.1.1 - optional
- supportedDeviceTypesL array of strings - optional

### GET packages/get-by-id

- id: string - required

### PUT /packages/update

- packageId: string - required
- title: string - required
- type: string - firmware | tool - required
- vesion: string - x.x.x ex 1.1.1 - required
- supportedDeviceTypesL array of strings - required

### DELETE /packages/delete

- packageId: string - required
