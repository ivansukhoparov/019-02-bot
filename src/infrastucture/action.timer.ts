export class ActionTimer {
    private startTime: number = 0;
    private processName: string = "";

constructor(funcName: string) {
    this.processName = funcName;
}

start(processName?:string) {
    if (processName) this.processName = processName
    this.startTime = +(new Date());
//	console.log(`function "${this.funcName}" started`);
}

stop() {
    const duration:number = (+(new Date()) - this.startTime) / 1000;
    console.log(`function" ${this.processName}" done in -- ${duration} sec`);
}
}