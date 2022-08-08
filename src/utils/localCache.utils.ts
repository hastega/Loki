import { existsSync, promises, writeFileSync } from 'fs'

export const readWriteRequest = async (folderPath: string, fileName: string, data: JSON) => {
    if (existsSync(folderPath)) {
        await promises.readFile(folderPath+'/'+fileName+'.json').then((res) => {
            data = JSON.parse(res.toString())
        })
    } else {
        promises.mkdir(folderPath, { recursive: true }).then(() =>
            writeFileSync(folderPath + '/' + fileName + '.json', JSON.stringify(data))
        );
    }
}