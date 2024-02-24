import fs from "fs"

export class LogToFile {
    path: string;
    fileName: string;

    constructor(path: string, fileName: string) {
        this.path = path;
        this.fileName = fileName;
    }

    writeDown(content: any) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(content) + "," + "\n"
            fs.appendFile(this.path + this.fileName, data, err => {
                if (err) {
                    console.error(err);
                } else {
                    // done!
                }
            });
        })
    }

}
