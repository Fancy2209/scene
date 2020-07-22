import { DisplayObject } from "../display/DisplayObject";
import { MovieClip } from "../display/MovieClip";
import { IMovieClipAdapter } from "../adapters/IMovieClipAdapter";
import { IDisplayObjectAdapter } from '../adapters/IDisplayObjectAdapter';


interface IInterval {
	f: Function;
	t: number;
	dt: number;
	isTimeout: boolean;
}
interface IScriptQueue {
	queued_mcs: MovieClip[],
	queued_scripts: any[],
	queued_mcs_pass2: MovieClip[],
	queued_scripts_pass2: any[],
	constructors: MovieClip[],
}
export class FrameScriptManager {
	// FrameScript debugging:
	// the first line of a FrameScript should be a comment that represents the functions unique name
	// the exporter creates a js file, containing a object that has the framescripts functions set as properties according to the unique names
	// this object can be set as "frameScriptDebug" in order to enable debug mode


	public static frameScriptDebug: Object = undefined;
	public static useAVM1: boolean = false;


	//queue of objects for disposal
	private static _queued_dispose: DisplayObject[] = [];


	private static _queue: IScriptQueue[] = [];

	private static _active_intervals: Object = new Object(); // maps id to function


	private static _intervalID: number = 0;
	public static setInterval(fun: Function, time: number): number {
		this._intervalID++;
		// make sure we have at least 4ms intervals
		if (time < 4) {
			time = 4;
		}
		this._active_intervals[this._intervalID] = <IInterval>{ "f": fun, "t": time, "dt": 0, "isTimeout": false };
		return this._intervalID
	}
	public static setTimeOut(fun: Function, time: number): number {
		this._intervalID++;
		// make sure we have at least 4ms intervals
		if (time < 4) {
			time = 4;
		}
		this._active_intervals[this._intervalID] = <IInterval>{ "f": fun, "t": time, "dt": 0, "isTimeout": true };
		return this._intervalID
	}

	public static clearInterval(id: number): void {
		delete this._active_intervals[id];
	}

	public static clearTimeout(id: number): void {
		delete this._active_intervals[id];
	}

	public static execute_intervals(dt: number = 0): void {
		var interval: IInterval;
		for (var key in this._active_intervals) {
			interval = this._active_intervals[key];
			interval.dt += dt;
			// keep executing the setInterval for as many times as the dt allows
			// a setInterval can delete itself, so we need to check if it still exists
			while (this._active_intervals[key] && interval.dt >= interval.t) {
				interval.dt -= interval.t;
				interval.f();
				if (interval.isTimeout) {
					delete this._active_intervals[key];
				}
			}
		}
	}

	public static add_child_to_dispose(child: DisplayObject): void {
		this._queued_dispose.push(child);
	}


	public static add_queue() {
		if(FrameScriptManager._queue.length<2){
			FrameScriptManager._queue.push({
				queued_mcs: [],
				queued_scripts: [],
				queued_mcs_pass2: [],
				queued_scripts_pass2: [],
				constructors: [],
			});
			//console.warn("add_queue", FrameScriptManager._queue.length);

		}
	}

	public static get_queue(): IScriptQueue {
		while(FrameScriptManager._queue.length<2){
			FrameScriptManager.add_queue();
		}
		if(FrameScriptManager.queueLevel>0){
			return FrameScriptManager._queue[1];
		}
		return FrameScriptManager._queue[0];
	}
	public static add_script_to_queue(mc: MovieClip, script: any): void {
		//console.log("add_script_to_queue", mc.name);
		let queue = FrameScriptManager.get_queue();
		// whenever we queue scripts of new objects, we first inject the lists of pass2
		var i = queue.queued_mcs_pass2.length;
		while (i > 0) {
			i--;
			queue.queued_mcs.push(queue.queued_mcs_pass2[i]);
			queue.queued_scripts.push(queue.queued_scripts_pass2[i]);
		}
		queue.queued_mcs_pass2.length = 0;
		queue.queued_scripts_pass2.length = 0;
		(<any>mc.adapter).allowScript=true;
		queue.queued_mcs.push(mc);
		queue.queued_scripts.push(script);
	}
	public static add_loaded_action_to_queue(mc: MovieClip): void {
		//console.log("add_loaded_action_to_queue", mc.name);
		let queue = FrameScriptManager.get_queue();
		// whenever we queue scripts of new objects, we first inject the lists of pass2
		/*var i = queue.queued_mcs_pass2.length;
		while (i > 0) {
			i--;
			queue.queued_mcs.push(queue.queued_mcs_pass2[i]);
			queue.queued_scripts.push(queue.queued_scripts_pass2[i]);
		}
		queue.queued_mcs_pass2.length = 0;
		queue.queued_scripts_pass2.length = 0;
		if (queue.queued_mcs[queue.queued_mcs.length - 1] == mc) {
			return;
		}*/
		queue.queued_mcs.push(mc);
		queue.queued_scripts.push(null);
	}

	public static add_script_to_queue_pass2(mc: MovieClip, script: any): void {
		
		//console.log("add_script_to_queue_pass2", mc.name);
		let queue = FrameScriptManager.get_queue();
		(<any>mc.adapter).allowScript=true;
		queue.queued_mcs_pass2.push(mc);
		queue.queued_scripts_pass2.push(script);
	}
	public static _constructor_queue: MovieClip[][] = [];
	public static _constructor_queues: MovieClip[][] = [];
	public static _constructor_queues_dyn: MovieClip[][] = [];
	public static _constructor_queueLevel: number = 0;
	public static queue_as3_constructor(mc: MovieClip): void {
		if(FrameScriptManager.useAVM1)
			return;
		while(FrameScriptManager._constructor_queue.length<=FrameScriptManager._constructor_queueLevel){
			FrameScriptManager._constructor_queue.push([]);
		}
		FrameScriptManager._constructor_queue[FrameScriptManager._constructor_queueLevel].push(mc);

	}


	public static execute_as3_constructors(): void {

		let mc: MovieClip = null;
		let queues = [[]];
		let k;
		let constructor_queue;
		let constructor_queues=FrameScriptManager._constructor_queues;
		if(FrameScriptManager._constructor_queue.length>1){
			constructor_queue=FrameScriptManager._constructor_queue.pop();
			FrameScriptManager._constructor_queueLevel--;
			constructor_queues=FrameScriptManager._constructor_queues_dyn;
		}
		else if (FrameScriptManager._constructor_queue.length==1){
			constructor_queue=FrameScriptManager._constructor_queue[0].concat();
			FrameScriptManager._constructor_queue[0].length=0;
		}
		else{
			return;
		}

		//let names = FrameScriptManager._constructor_queue.length+" :";
		let constrCnt=constructor_queue.length;
		for (let k = 0; k < constrCnt; k++) {
			mc = constructor_queue.shift();				
			//names+=mc.name+" - ";
			queues[queues.length - 1].push(mc);
			if (FrameScriptManager.queueLevel>0 || mc.isAVMScene || !mc.parent || mc.parent.isAVMScene || k == constrCnt - 1)
				queues.push([]);
		}		
		//console.log("FrameScriptManager._constructor_queue", names)
		k = queues.length;
		while (k > 0) {
			k--;
			if (queues[k].length > 0)
			constructor_queues.unshift(queues[k]);
		}

		if (constructor_queues.length == 0) {
			return;
		}
		while (constructor_queues.length > 0) {
			let queue = constructor_queues.shift();
			/*let names = "";
			for(let k=0; k<queue.length; k++){
				names+=queue[k].name+" - ";
			}*/
			//console.log("execute_as3_constructors", names)
			for (let k = 0; k < queue.length; k++) {
				let mc: MovieClip = queue[k];
				//if (!mc.parent)
				//	continue;

				let mcadapter = mc.adapter;
				let constructorFunc = (<IDisplayObjectAdapter>mcadapter).executeConstructor;
				if (constructorFunc) {
					(<IDisplayObjectAdapter>mcadapter).executeConstructor = null;
					//console.log(randomVal, "call constructor for ", mc.parent.name, mc.name);
					constructorFunc();
				}

				// if mc was created by timeline, instanceID!=""
				if ((<any>mc).just_added_to_timeline && mc.instanceID != "" && mcadapter && (<any>mcadapter).dispatchStaticEvent) {

					(<any>mcadapter).dispatchStaticEvent("added", mcadapter);
					(<any>mc).just_added_to_timeline = false;
					mc.hasDispatchedAddedToStage = mc.isOnDisplayList();
					if (mc.hasDispatchedAddedToStage)
						(<any>mcadapter).dispatchStaticEvent("addedToStage", mcadapter);
				}
				// 	todo: this does not dispatch ADDED and ADDED_TO_STAGE on timeline-SHAPE, 
				//	because in awayjs timeline those are Sprite without any as3-adapter


			}
		}


	}
	public static queueLevel:number=0;

	public static isOnStage(mc:DisplayObject):boolean{
		let parent = mc;
		while (parent && !parent.isAVMScene){
			parent=parent.parent;
		}
		if(parent && parent.isAVMScene)
			return true;
		return false;

	}
	public static execute_avm1_constructors(): void {
		
		//console.log("execute_queue", FrameScriptManager.queueLevel);
		let queue = FrameScriptManager.get_queue();

		if (queue.queued_mcs.length == 0 && queue.queued_mcs_pass2.length == 0)
			return;

		//while (queue.queued_mcs.length > 0 || queue.queued_mcs_pass2.length > 0) {

			var i = queue.queued_mcs_pass2.length;
			while (i > 0) {
				i--;
				queue.queued_mcs.push(queue.queued_mcs_pass2[i]);
				queue.queued_scripts.push(queue.queued_scripts_pass2[i]);
			}
			queue.queued_mcs_pass2.length = 0;
			queue.queued_scripts_pass2.length = 0;

			var queues_tmp: any[] = queue.queued_mcs;

			//console.log("execute queue",queue.queued_scripts);

			var mc: MovieClip;

			if(FrameScriptManager.useAVM1){
				for (var i = 0; i < queues_tmp.length; i++) {
					mc = queues_tmp[i];
					if(!FrameScriptManager.isOnStage(mc))
						continue;
					// onClipEvent (initialize)
					if ((<any>mc).onInitialize) {
						let myFunc = (<any>mc).onInitialize;
						(<any>mc).onInitialize = null;
						myFunc();
					}
				}
				for (i = 0; i < queues_tmp.length; i++) {
					mc = queues_tmp[i];	
					if(!FrameScriptManager.isOnStage(mc))
						continue;
					// onClipEvent (construct) comes before class-constructor
					if ((<any>mc).onConstruct) {
						let myFunc = (<any>mc).onConstruct;
						(<any>mc).onConstruct = null;
						myFunc();
					}					
					// class-constructor
					let constructorFunc = (<IDisplayObjectAdapter>mc.adapter).executeConstructor;
					if (constructorFunc) {
						(<IDisplayObjectAdapter>mc.adapter).executeConstructor = null;
						//console.log(randomVal, "call constructor for ", mc.parent.name, mc.name);
						constructorFunc();
					}
				}
			}
		
	}
	public static execute_queue(): void {
		
		//console.log("execute_queue", FrameScriptManager.queueLevel);
		let queue = FrameScriptManager.get_queue();

		if (queue.queued_mcs.length == 0 && queue.queued_mcs_pass2.length == 0)
			return;

		while (queue.queued_mcs.length > 0 || queue.queued_mcs_pass2.length > 0) {

			var queues_tmp: any[] = queue.queued_mcs.concat();
			var queues_scripts_tmp: any[] = queue.queued_scripts.concat();
			queue.queued_mcs.length = 0;
			queue.queued_scripts.length = 0;

			var i = queue.queued_mcs_pass2.length;
			while (i > 0) {
				i--;
				queues_tmp.push(queue.queued_mcs_pass2[i]);
				queues_scripts_tmp.push(queue.queued_scripts_pass2[i]);
			}
			queue.queued_mcs_pass2.length = 0;
			queue.queued_scripts_pass2.length = 0;

			//console.log("execute queue",queue.queued_scripts);

			var mc: MovieClip;

			if(FrameScriptManager.useAVM1){
				for (i = 0; i < queues_tmp.length; i++) {
					mc = queues_tmp[i];
					if(!FrameScriptManager.isOnStage(mc))
						continue;
					// onClipEvent (initialize)
					if ((<any>mc).onInitialize) {
						let myFunc = (<any>mc).onInitialize;
						(<any>mc).onInitialize = null;
						myFunc();
					}
				}
				for (i = 0; i < queues_tmp.length; i++) {
					mc = queues_tmp[i];	
					if(!FrameScriptManager.isOnStage(mc))
						continue;
					// onClipEvent (construct) comes before class-constructor
					if ((<any>mc).onConstruct) {
						let myFunc = (<any>mc).onConstruct;
						(<any>mc).onConstruct = null;
						myFunc();
					}					
					// class-constructor
					let constructorFunc = (<IDisplayObjectAdapter>mc.adapter).executeConstructor;
					if (constructorFunc) {
						(<IDisplayObjectAdapter>mc.adapter).executeConstructor = null;
						//console.log(randomVal, "call constructor for ", mc.parent.name, mc.name);
						constructorFunc();
					}
				}
			}
			
			for (i = 0; i < queues_tmp.length; i++) {
				mc = queues_tmp[i];	
				//console.log("scriptqueue", mc.name);
				if(FrameScriptManager.useAVM1){
					if(!FrameScriptManager.isOnStage(mc))
						continue;
					if ((<any>mc).onLoaded) {
						let myFunc = (<any>mc).onLoaded;
						(<any>mc).onLoaded = null;
						myFunc();
					}
					if(!(<any>mc.adapter).hasOnLoadExecuted){
						(<any>mc.adapter).hasOnLoadExecuted=true;
						let func=(<any>mc.adapter).alGet("onLoad");
						if(func){
							func.alCall(mc.adapter);
						}
					}
				}
				if (queues_scripts_tmp[i] != null) {
					mc = queues_tmp[i];
					//console.log("execute script", mc.name, queues_scripts_tmp[i]);
					if (mc && mc.adapter && (<IMovieClipAdapter>mc.adapter).executeScript)
						(<IMovieClipAdapter>mc.adapter).executeScript(queues_scripts_tmp[i]);
				}

			}
		}
	}


	public static execute_dispose(): void {
		var len: number = this._queued_dispose.length;
		for (var i: number = 0; i < len; i++)
			this._queued_dispose[i].dispose();

		this._queued_dispose.length = 0;
	}
}
export default FrameScriptManager;