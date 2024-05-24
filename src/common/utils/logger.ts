import fs from "fs"

export class Logger {
    private path: string;
    private logId: string | number = ""
    private logData: { [K: string]: any } = {}

    constructor(path: string) {
        this.path = path;
        // this.logData.id = logId
        // this.logId = logId
    }


    writeDownTestData(key: string, value: any){
        this.logData[key] = value;
        this.writeDownLogToFile()
    }

    writeToLog(key: string, value: any) {
        this.logData[key] = value;
        this.logData[key + "Timestamp"] = +(new Date());
    }

    startNewLog(logId: number | string) {
        this.logId = logId;
        this.logData = {id: logId};
        this.logData["startTimestamp"] = +(new Date());
    }

    catchTime(event: number | string) {
        this.logData[event + "Timestamp"] = +(new Date());
    }

    clearLog() {
        this.logData = {}
    }

    flushFile() {
        fs.open(this.path, 'w', (err) => {
            if (err) throw err;
        });
        fs.writeFile(this.path, '',  (err)=> {
            if (err) throw err;
        });
    }

    writeDownLogToFile() {
        this.logData["endTimestamp"] = +(new Date());
        new Promise((resolve, reject) => {
            const data = JSON.stringify(this.logData) + "," + "\n"
            fs.appendFile(this.path, data, err => {
                if (err) {
                    console.error(err);
                } else {
                    // done!
                }
            });
        })
        this.clearLog()
    }
}
