export class ActionTimer {
	private startTime: number = 0;
	private funcName: string = "";

	constructor(funcName: string) {
		this.funcName = funcName;
	}

	start() {
		this.startTime = +(new Date());
	//	console.log(`function "${this.funcName}" started`);
	}

	stop() {
		const duration:number = (+(new Date()) - this.startTime) / 1000;
//console.log(`function" ${this.funcName}" done in -- ${duration} sec`);
	}
}

// Ниже функции для тестирования и как пример работы

function sleep(milliseconds:number) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

const testClass= ()=>{
	const timer = new ActionTimer("testClass");
	timer.start();
	sleep(5000);
	timer.stop();
};

const  asyncTestClass= async()=>{
	const timer = new ActionTimer("asyncTestClass");
	timer.start();
	await new Promise(resolve => setTimeout(resolve, 1000));
	timer.stop();
};

// testClass();
// asyncTestClass();
// sleep(5000);

