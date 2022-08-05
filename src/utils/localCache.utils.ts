import { existsSync, promises, writeFileSync } from 'fs'

export const readWriteRequest = (folderPath: string, fileName: string, data: JSON) => {
    if (existsSync(folderPath)) {
        promises.readFile(folderPath+fileName)
    } else {
        promises.mkdir(folderPath, { recursive: true }).then(() =>
            writeFileSync(folderPath + '/' + fileName + '.json', JSON.stringify(data))
        );
    }
}