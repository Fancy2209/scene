import { Vector3D } from '@awayjs/core';

import { PickingCollision, PickGroup, PickEntity } from '@awayjs/view';

import { TouchPoint } from '../base/TouchPoint';
import { DisplayObject } from '../display/DisplayObject';
import { KeyboardEvent } from '../events/KeyboardEvent';
import { MouseEvent } from '../events/MouseEvent';
import { FrameScriptManager } from '../managers/FrameScriptManager';

import { Scene } from '../Scene';
import { IInputRecorder } from './IInputRecorder';
import { DisplayObjectContainer } from '../display/DisplayObjectContainer';

const TMP_POINT = { x: 0, y: 0 };
/**
 * MouseManager enforces a singleton pattern and is not intended to be instanced.
 * it provides a manager class for detecting mouse hits on scene objects and sending out mouse events.
 */
export class MouseManager {
	private static _instance: MouseManager;
	public static inputRecorder: IInputRecorder;

	private _pickGroup: PickGroup;
	private _sceneLookup: Array<Scene> = new Array<Scene>();
	private _containerLookup: Array<HTMLElement> = new Array<HTMLElement>();

	public _iActiveScene: Scene;
	public _iUpdateDirty: boolean;
	public _iCollision: PickingCollision;
	public _prevICollision: PickingCollision;

	private _iCollisionEntity: DisplayObject;         // current hit entity
	private _prevICollisionEntity: DisplayObject;     // entity hit on last frame
	private _mouseDragEntity: DisplayObject;     // entity hit on mouse-down
	private _mouseDragPickerEntity: DisplayObject;
	private _mouseDragging: boolean;            // true while mosue is dragged
	private _currentFocusEntity: DisplayObject;       // entity currently in focus

	public allowKeyInput: boolean=true;

	private _collisionIsEnabledButton: boolean=false;

	private _eventBubbling: boolean=true;           //  should events bubble up
	private _allowFocusOnUnfocusable: boolean=true;  // should unfocus-able object steal focus ?

	public _stage: DisplayObject;

	private _showCursor: boolean;

	private _nullVector: Vector3D = new Vector3D();
	private _queuedEvents: Array<MouseEvent> = new Array<MouseEvent>();

	private _mouseMoveEvent;
	private _mouseUp: MouseEvent = new MouseEvent(MouseEvent.MOUSE_UP);
	private _mouseUpOutside: MouseEvent = new MouseEvent(MouseEvent.MOUSE_UP_OUTSIDE);
	private _mouseClick: MouseEvent = new MouseEvent(MouseEvent.CLICK);
	private _mouseOut: MouseEvent = new MouseEvent(MouseEvent.MOUSE_OUT);
	private _dragOut: MouseEvent = new MouseEvent(MouseEvent.DRAG_OUT);
	private _dragOver: MouseEvent = new MouseEvent(MouseEvent.DRAG_OVER);
	private _mouseDown: MouseEvent = new MouseEvent(MouseEvent.MOUSE_DOWN);
	private _mouseMove: MouseEvent = new MouseEvent(MouseEvent.MOUSE_MOVE);
	private _mouseOver: MouseEvent = new MouseEvent(MouseEvent.MOUSE_OVER);
	private _mouseWheel: MouseEvent = new MouseEvent(MouseEvent.MOUSE_WHEEL);
	private _mouseDoubleClick: MouseEvent = new MouseEvent(MouseEvent.DOUBLE_CLICK);
	private _rollOver: MouseEvent = new MouseEvent(MouseEvent.ROLL_OVER);
	private _rollOut: MouseEvent = new MouseEvent(MouseEvent.ROLL_OUT);

	private _dragMove: MouseEvent = new MouseEvent(MouseEvent.DRAG_MOVE);
	private _dragStart: MouseEvent = new MouseEvent(MouseEvent.DRAG_START);
	private _dragStop: MouseEvent = new MouseEvent(MouseEvent.DRAG_STOP);

	private onClickDelegate: (event) => void;
	private onDoubleClickDelegate: (event) => void;
	private onMouseDownDelegate: (event) => void;
	private onMouseMoveDelegate: (event) => void;
	private onMouseUpDelegate: (event) => void;
	private onMouseWheelDelegate: (event) => void;
	private onMouseOverDelegate: (event) => void;
	private onMouseOutDelegate: (event) => void;
	private onKeyDownDelegate: (event) => void;
	private onKeyUpDelegate: (event) => void;

	private _useSoftkeyboard: boolean = false;

	public buttonEnabledDirty: boolean;
	private _isTouch: Boolean;
	private _isAVM1Dragging: Boolean = false;

	public startDragObject(obj: DisplayObject) {
		this._isAVM1Dragging = true;
		if (!this._mouseDragEntity)
			this._mouseDragEntity = obj;
		if (!this._mouseDragPickerEntity)
			this._mouseDragPickerEntity = obj;
	}

	public stopDragObject() {
		this._isAVM1Dragging = false;
	}

	public get showCursor(): boolean {
		return this._showCursor;
	}

	public set showCursor(value: boolean) {
		this._showCursor = value;
	}

	public get eventBubbling(): boolean {
		return this._eventBubbling;
	}

	public set eventBubbling(value: boolean) {
		this._eventBubbling = value;
	}

	/**
	 * Creates a new <code>MouseManager</code> object.
	 */
	constructor(pickGroup: PickGroup) {
		this._pickGroup = pickGroup;
		this.onClickDelegate = (event) => this.onClick(event);
		this.onDoubleClickDelegate = (event) => this.onDoubleClick(event);
		this.onMouseDownDelegate = (event) => this.onMouseDown(event);
		this.onMouseMoveDelegate = (event) => this.onMouseMove(event);
		this.onMouseUpDelegate = (event) => this.onMouseUp(event);
		this.onMouseWheelDelegate = (event) => this.onMouseWheel(event);
		this.onMouseOverDelegate = (event) => this.onMouseOver(event);
		this.onMouseOutDelegate = (event) => this.onMouseOut(event);
		this.onKeyDownDelegate = (event) => this.onKeyDown(event);
		this.onKeyUpDelegate = (event) => this.onKeyUp(event);
		this.buttonEnabledDirty = false;
		this._isTouch = (('ontouchstart' in window) || navigator.msMaxTouchPoints > 0);
		this._showCursor = true;
		this._mouseDragging = false;
	}

	public set useSoftkeyboard(value: boolean) {

		this._useSoftkeyboard = value;
		// todo: improve this, so that we can
		//	- use device-softkeyboard on tablet / mobide
		//	- optionally use a custom softkeyboard
		if (!value) {
			window.addEventListener('keydown', this.onKeyDownDelegate);
			window.addEventListener('keyup', this.onKeyUpDelegate);
		} else if (value) {
			window.removeEventListener('keydown', this.onKeyDownDelegate);
			window.removeEventListener('keyup', this.onKeyUpDelegate);
		}
	}

	public get useSoftkeyboard(): boolean {
		return this._useSoftkeyboard;
	}

	public registerContainer(container: HTMLElement): void {
		if (container && this._containerLookup.indexOf(container) == -1) {
			container.addEventListener('click', this.onClickDelegate);
			container.addEventListener('dblclick', this.onDoubleClickDelegate);
			container.addEventListener('touchstart', this.onMouseDownDelegate);
			container.addEventListener('mousedown', this.onMouseDownDelegate);
			container.addEventListener('touchmove', this.onMouseMoveDelegate);
			container.addEventListener('mousemove', this.onMouseMoveDelegate);
			container.addEventListener('mouseup', this.onMouseUpDelegate);
			container.addEventListener('touchend', this.onMouseUpDelegate);
			container.addEventListener('touchend', this.onClickDelegate);
			container.addEventListener('mousewheel', this.onMouseWheelDelegate);
			container.addEventListener('mouseover', this.onMouseOverDelegate);
			container.addEventListener('mouseout', this.onMouseOutDelegate);
        	window.addEventListener('keydown', this.onKeyDownDelegate);
			window.addEventListener('keyup', this.onKeyUpDelegate);

			this._containerLookup.push(container);
		}
	}

	public unregisterContainer(container: HTMLElement): void {
		if (container && this._containerLookup.indexOf(container) != -1) {
			container.removeEventListener('click', this.onClickDelegate);
			container.removeEventListener('dblclick', this.onDoubleClickDelegate);
			container.removeEventListener('touchstart', this.onMouseDownDelegate);
			container.removeEventListener('mousedown', this.onMouseDownDelegate);
			container.removeEventListener('touchmove', this.onMouseMoveDelegate);
			container.removeEventListener('mousemove', this.onMouseMoveDelegate);
			container.removeEventListener('mouseup', this.onMouseUpDelegate);
			container.removeEventListener('touchend', this.onMouseUpDelegate);
			container.removeEventListener('touchend', this.onClickDelegate);
			container.removeEventListener('mousewheel', this.onMouseWheelDelegate);
			container.removeEventListener('mouseover', this.onMouseOverDelegate);
			container.removeEventListener('mouseout', this.onMouseOutDelegate);
			window.removeEventListener('keydown', this.onKeyDownDelegate);
			window.removeEventListener('keyup', this.onKeyUpDelegate);

			this._containerLookup.splice(this._containerLookup.indexOf(container), 1);
		}
	}

	public dispose() {
		this._stage = null;
		this.onClickDelegate = null;
		this.onDoubleClickDelegate = null;
		this.onMouseDownDelegate = null;
		this.onMouseMoveDelegate = null;
		this.onMouseUpDelegate = null;
		this.onMouseWheelDelegate = null;
		this.onMouseOverDelegate = null;
		this.onMouseOutDelegate = null;
		this.onKeyDownDelegate = null;
		this.onKeyUpDelegate = null;

		this._mouseMoveEvent = null;
		this._mouseUp = null;
		this._mouseUpOutside = null;
		this._mouseClick = null;
		this._mouseOut = null;
		this._dragOut = null;
		this._dragOver = null;
		this._mouseDown = null;
		this._mouseMove = null;
		this._mouseOver = null;
		this._mouseWheel = null;
		this._mouseDoubleClick = null;
		this._dragMove = null;
		this._dragStart = null;
		this._dragStop = null;

	}

	public static clearInstance() {
		if (this._instance) {
			this._instance.dispose();
			this._instance = null;

		}
	}

	public static getInstance(pickGroup: PickGroup): MouseManager {
		if (this._instance)
			return this._instance;

		//  todo: this is only needed due to MW react-lesson-player requesting a MouseManager with pickGroup=null
		//  can be removed once the MW code is adjusted
		if (!pickGroup)
			return new MouseManager(pickGroup);

		return (this._instance = new MouseManager(pickGroup));
	}

	public setFocus(obj: DisplayObject) {
		if (this._currentFocusEntity == obj) {
			return;
		}
		if (this._currentFocusEntity) {
			this._currentFocusEntity.setFocus(false, false);
		}
		this._currentFocusEntity = obj;

		if (this._currentFocusEntity) {
			this._currentFocusEntity.setFocus(true, false);
		}
	}

	public getFocus() {
		return this._currentFocusEntity;
	}

	public focusNextTab() {
		if (this._sceneLookup.length == 0)
			return;
		const newFocus: DisplayObject = <DisplayObject> this._sceneLookup[0].tabPicker.getNextTabEntity(this._currentFocusEntity);
		if (newFocus == this._currentFocusEntity)
			return;
		if (this._currentFocusEntity)
			this._currentFocusEntity.setFocus(false, false);
		this._currentFocusEntity = newFocus;
		this._currentFocusEntity.setFocus(true, false);
	}

	public focusPreviousTab() {
		if (this._sceneLookup.length == 0)
			return;
		const newFocus: DisplayObject = <DisplayObject> this._sceneLookup[0].tabPicker.getPrevTabEntity(this._currentFocusEntity);
		if (newFocus == this._currentFocusEntity)
			return;
		if (this._currentFocusEntity)
			this._currentFocusEntity.setFocus(false, false);
		this._currentFocusEntity = newFocus;
		this._currentFocusEntity.setFocus(true, false);
	}

	private dispatchEvent(event: MouseEvent, dispatcher: DisplayObject) {
		if (!this._eventBubbling) {
			if (dispatcher) {
				dispatcher.dispatchEvent(event);
				FrameScriptManager.execute_queue();
			}
			return;
		}

		while (dispatcher) {
			if (event.commonAncestor && dispatcher == event.commonAncestor) {
				return;
			}
			if (dispatcher._iIsMouseEnabled()) {
				dispatcher.dispatchEvent(event);
				FrameScriptManager.execute_queue();
			}
			if (!event._iAllowedToPropagate) {
				dispatcher = null;
			} else {
				dispatcher = dispatcher.parent;
			}
		}
	}

	private setupAndDispatchEvent(event: MouseEvent, sourceEvent, collision: PickingCollision) {
		event = this.setUpEvent(event, sourceEvent, collision);
		this.dispatchEvent(event, event.pickerEntity);
	}

	public fireMouseEvents(scene: Scene): void {
		//forceMouseMove move only makes sense for non-touch interaction
		if (scene.forceMouseMove && !this._isTouch && !this._iUpdateDirty)
			this._iCollision = scene.getViewCollision(scene._mouseX, scene._mouseY);

		this._rollOut.commonAncestor = null;
		this._rollOver.commonAncestor = null;

		this._iCollisionEntity = <DisplayObject> ((this._iCollision) ? this._iCollision.pickerEntity : null);

		if (this._iCollisionEntity != this._prevICollisionEntity) {

			//  If colliding object has changed, queue OVER and OUT events.
			//  If the mouse is dragged (mouse-down is hold), use DRAG_OVER and DRAG_OUT instead of MOUSE_OVER MOUSE_OUT
			//  DRAG_OVER and DRAG_OUT are only dispatched on the object that was hit on the mouse-down (_mouseDragEntity)

			//  Store the info if the collision is a enabled Button (_collisionIsEnabledButton)

			if (this._prevICollisionEntity) {
				if (!this._isTouch && !this._mouseDragging)
					this.queueDispatch(this._mouseOut, this._mouseMoveEvent, this._prevICollision);
				else if (this._mouseDragging && this._mouseDragPickerEntity && this._mouseDragPickerEntity == this._prevICollisionEntity)
					this.queueDispatch(this._dragOut, this._mouseMoveEvent, this._prevICollision);
			}

			if (!this._prevICollisionEntity && this._iCollisionEntity) {
				// rollout / rollover easy case, can just bubble up
				this.queueDispatch(this._rollOut, this._mouseMoveEvent, this._prevICollision);
				this.queueDispatch(this._rollOver, this._mouseMoveEvent, this._iCollision);
			}
			if (this._prevICollisionEntity && !this._iCollisionEntity) {
				// rollout / rollover easy case, can just bubble up
				this.queueDispatch(this._rollOut, this._mouseMoveEvent, this._prevICollision);
				this.queueDispatch(this._rollOver, this._mouseMoveEvent, this._iCollision);
			}
			if (this._prevICollisionEntity && this._iCollisionEntity) {
				// rollout / rollover find common ancester and only bubble up to that point
				const parentsPrev: DisplayObject[] = [];
				let parent: DisplayObject = this._prevICollisionEntity;
				while (parent && !parent.isAVMScene) {
					parentsPrev.push(parent);
					parent = parent.parent;
				}
				let commonAncestor: DisplayObject = null;
				parent = this._iCollisionEntity;
				while (parent && !parent.isAVMScene) {
					const oldParentIdx = parentsPrev.indexOf(parent);
					if (oldParentIdx == -1) {
						parent = parent.parent;
					} else {
						commonAncestor = parent;
						parent = null;
					}
				}
				if (commonAncestor != this._prevICollisionEntity)
					this.queueDispatch(this._rollOut, this._mouseMoveEvent, this._prevICollision, commonAncestor);

				if (commonAncestor != this._iCollisionEntity)
					this.queueDispatch(this._rollOver, this._mouseMoveEvent, this._iCollision, commonAncestor);

			}

			this._collisionIsEnabledButton = this._iCollisionEntity ? (<any> this._iCollisionEntity).buttonEnabled : false;

			if (this._iCollisionEntity) {
				if (!this._isTouch && !this._mouseDragging)
					this.queueDispatch(this._mouseOver, this._mouseMoveEvent, this._iCollision);
				else if (this._mouseDragging && this._mouseDragPickerEntity && this._mouseDragPickerEntity == this._iCollisionEntity)
					this.queueDispatch(this._dragOver, this._mouseMoveEvent, this._iCollision);
			}

			this._prevICollision = this._iCollision;
			this._prevICollisionEntity = this._iCollisionEntity;
		} else {
			//  colliding object has not changed
			//  Check if we need to send any MOUSE_OVER/DRAG_OVER event to handle the case when a Button has become active while under the mouse.
			const isActiveButton = this._iCollisionEntity ? (<any> this._iCollisionEntity).buttonEnabled : false;

			if (this._collisionIsEnabledButton != isActiveButton && isActiveButton) {
				if (!this._isTouch)
					this.queueDispatch(this._mouseOver, this._mouseMoveEvent, this._iCollision);
				else if (this._mouseDragPickerEntity && this._mouseDragPickerEntity == this._iCollisionEntity)
					this.queueDispatch(this._dragOver, this._mouseMoveEvent, this._iCollision);
			}

			this._collisionIsEnabledButton = isActiveButton;
		}

		// set cursor if not dragging mouse
		if (!this._mouseDragging)
			document.body.style.cursor = this._showCursor ? (this._iCollisionEntity ? this._iCollisionEntity.getMouseCursor() : 'initial') : 'none';

		let event: MouseEvent;
		let dispatcher: DisplayObject;
		const len: number = this._queuedEvents.length;
		// Dispatch all queued events.
		/*var logEvents="";
        for (var i: number = 0; i < len; ++i) {
            logEvents+= " / "+this._queuedEvents[i].type;
        }
        console.log(logEvents);*/
		for (let i: number = 0; i < len; ++i) {
			event = this._queuedEvents[i];
			dispatcher = event.pickerEntity;

			if (event.type == MouseEvent.MOUSE_DOWN) {
				this._mouseDragging = true;

				// no event-bubbling. dispatch on stage first
				if (!this._eventBubbling && this._stage)
					this._stage.dispatchEvent(event);

				// todo: at this point the object under the mouse might have been changed, so we need to recheck the collision

				// on Touch dispatch mouseOver Command
				if (this._isTouch)
					this.setupAndDispatchEvent(this._mouseOver, this._mouseMoveEvent, this._iCollision);

				this._mouseDragEntity = event.entity;
				this._mouseDragPickerEntity = event.pickerEntity;

				if (dispatcher) {
					//console.log("onPress", dispatcher)
					this.dispatchEvent(event, dispatcher);
				} else if (this._eventBubbling && this._stage)
					this._stage.dispatchEvent(event);

				//  in FP6, a mouseclick on non focus-able object still steal the focus
				//  in newer FP they only steal the focus if the the new hit is focusable
				if (this._allowFocusOnUnfocusable || (this._mouseDragPickerEntity && this._mouseDragPickerEntity.tabEnabled)) {
					if (this._currentFocusEntity)
						this._currentFocusEntity.setFocus(false, true);

					this._currentFocusEntity = this._mouseDragPickerEntity;

					if (this._currentFocusEntity)
						this._currentFocusEntity.setFocus(true, true);
				}

				if (this._mouseDragEntity)
					this.setupAndDispatchEvent(this._dragStart, event, (<PickEntity> this._mouseDragEntity.getAbstraction(this._pickGroup, PickEntity)).pickingCollision);

			} else if (event.type == MouseEvent.MOUSE_UP) {

				// no event-bubbling. dispatch on stage first
				if (!this._eventBubbling && this._stage)
					this._stage.dispatchEvent(event);

				// todo: at this point the object under the mouse might have been changed, so we need to recheck the collision

				let upEntity: DisplayObject = null;
				let upPickerEntity: DisplayObject = null;
				if (this._isAVM1Dragging && this._mouseDragPickerEntity) {
					// avm1dragging is in process, dispatch the mouse-up on this._mouseDragEntity instead of the current collision
					upPickerEntity = this._mouseDragPickerEntity;
					upEntity = this._mouseDragEntity;
				} else if (this._mouseDragging && this._mouseDragPickerEntity && this._mouseDragPickerEntity != dispatcher) {
					// no avm1dragging is in process, but current collision is not the same as collision that appeared on mouse-down,
					// need to dispatch a MOUSE_UP_OUTSIDE on _mouseDragEntity
					if ((<any> this._mouseDragPickerEntity).buttonEnabled)
						this.setupAndDispatchEvent(this._mouseOut, event, (<PickEntity> this._mouseDragEntity.getAbstraction(this._pickGroup, PickEntity)).pickingCollision);
					if (!this._eventBubbling) {
						this.setupAndDispatchEvent(this._mouseUpOutside, event, (<PickEntity> this._mouseDragEntity.getAbstraction(this._pickGroup, PickEntity)).pickingCollision);
					}
				} else if (this._mouseDragging && this._mouseDragPickerEntity && this._mouseDragPickerEntity == dispatcher) {
					// no avm1dragging is in process, but current collision is not the same as collision that appeared on mouse-down,
					// need to dispatch a MOUSE_UP_OUTSIDE on _mouseDragEntity
					upPickerEntity = this._mouseDragPickerEntity;
					upEntity = this._mouseDragEntity;
				}

				if (this._mouseDragging && dispatcher)
					this.setupAndDispatchEvent(this._mouseOver, event, this._iCollision);

				if (this._isTouch && upEntity)
					this.setupAndDispatchEvent(this._mouseOut, this._mouseMoveEvent, (<PickEntity> upEntity.getAbstraction(this._pickGroup, PickEntity)).pickingCollision);

				if (upPickerEntity) {
					//console.log("onRelease", upPickerEntity)
					this.dispatchEvent(event, upPickerEntity);
				} else if (this._eventBubbling && dispatcher)
					this.dispatchEvent(event, dispatcher);
				else if (this._eventBubbling && this._stage)
					this._stage.dispatchEvent(event);

				if (upEntity)
					this.setupAndDispatchEvent(this._dragStop, event, (<PickEntity> upEntity.getAbstraction(this._pickGroup, PickEntity)).pickingCollision);

				this._mouseDragPickerEntity = null;
				this._mouseDragEntity = null;
				this._mouseDragging = false;
				this._isAVM1Dragging = false;

			} else if (event.type == MouseEvent.MOUSE_MOVE) {
				// no event-bubbling. dispatch on stage first
				if (!this._eventBubbling) {
					if (this._stage)
                    	this._stage.dispatchEvent(event);
				} else {
					if (event.pickerEntity)
                    	this.dispatchEvent(event, event.pickerEntity);
					else if (this._stage)
						this._stage.dispatchEvent(event);

				}

				if (this._mouseDragEntity)
					this.setupAndDispatchEvent(this._dragMove, event, (<PickEntity> this._mouseDragEntity.getAbstraction(this._pickGroup, PickEntity)).pickingCollision);
			} else {
				// MouseEvent.MOUSE_OVER / MouseEvent.MOUSE_OUT / MouseEvent.DRAG_OVER / MouseEvent.DRAG_OUT
				this.dispatchEvent(event, dispatcher);
			}
		}
		this._queuedEvents.length = 0;

		this._iUpdateDirty = false;
	}

	//		public addSceneLayer(scene:Scene)
	//		{
	//			var stg:Stage = scene.stage;
	//
	//			// Add instance to mouse3dmanager to fire mouse events for multiple scenes
	//			if (!scene.stageGL.mouse3DManager)
	//				scene.stageGL.mouse3DManager = this;
	//
	//			if (!hasKey(scene))
	//				_scene3Ds[scene] = 0;
	//
	//			_childDepth = 0;
	//			traverseDisplayObjects(stg);
	//			_sceneCount = _childDepth;
	//		}

	public registerScene(scene: Scene): void {
		if (scene)
			this._sceneLookup.push(scene);
	}

	public unregisterScene(scene: Scene): void {
		if (scene)
			this._sceneLookup.splice(this._sceneLookup.indexOf(scene), 1);
	}

	public addEventsForSceneBinary(touchMessage: ArrayBuffer, sceneIdx: number = 0): void {

		const newTouchEvent: any = {};
		newTouchEvent.clientX = null;// we get the x position from the active touch
		newTouchEvent.clientY = null;// we get the y position from the active touch
		newTouchEvent.touches = [];
		newTouchEvent.changedTouches = [];
		newTouchEvent.preventDefault = function () { };
		const messageScene: Float32Array = new Float32Array(touchMessage);
		// transfer touches to event
		let i = 0;
		let cnt = 0;
		const touchCnt = 0;
		cnt++;//we temporary added 1 float to transfer fps from java to js. skip this
		const numTouches = messageScene[cnt++];
		const touchtype = messageScene[cnt++];
		const activeTouchID = messageScene[cnt++];
		let x: number = 0;
		let y: number = 0;
		if ((touchtype != 1) && (touchtype != 6) && (touchtype != 12) && (touchtype != 262) && (touchtype != 518)) {
			// if this is not a UP command, we add all touches
			for (i = 0; i < numTouches; i++) {
				var newTouch: any = {};
				newTouch.identifier = messageScene[cnt++];
				newTouch.clientX = messageScene[cnt++];
				newTouch.clientY = messageScene[cnt++];
				newTouchEvent.touches[i] = newTouch;
				//newTouchEvent.changedTouches[i] = newTouch;
			}
			newTouchEvent.changedTouches[0] = newTouchEvent.touches[activeTouchID];
			x = newTouchEvent.changedTouches[0].clientX;
			y = newTouchEvent.changedTouches[0].clientY;
		} else {
			// if this is a UP command, we add all touches, except the active one
			if (numTouches == 1) {

				var newTouch: any = {};
				newTouch.identifier = messageScene[cnt++];
				newTouch.clientX = messageScene[cnt++];
				newTouch.clientY = messageScene[cnt++];
				newTouchEvent.clientX = newTouch.clientX;
				newTouchEvent.clientY = newTouch.clientY;
				x = newTouchEvent.clientX;
				y = newTouchEvent.clientY;
			} else {
				for (i = 0; i < numTouches; i++) {
					var newTouch: any = {};
					newTouch.identifier = messageScene[cnt++];
					newTouch.clientX = messageScene[cnt++];
					newTouch.clientY = messageScene[cnt++];
					if (i != activeTouchID) {
						newTouchEvent.touches[touchCnt] = newTouch;
						//newTouchEvent.changedTouches[touchCnt++] = newTouch;
					} else {
						newTouchEvent.clientX = newTouch.clientX;
						newTouchEvent.clientY = newTouch.clientY;
						x = newTouchEvent.clientX;
						y = newTouchEvent.clientY;
					}
				}
			}
		}

		//console.log("Touch ID:"+touchtype+" activeTouchID "+activeTouchID+" numTouches "+numTouches+" x"+x+" y"+y);
		/*
		 public static final int ACTION_DOWN = 0;
		 public static final int ACTION_POINTER_1_DOWN = 5;
		 public static final int ACTION_POINTER_DOWN = 5;
		 public static final int ACTION_BUTTON_PRESS = 11;
		 public static final int ACTION_POINTER_2_DOWN = 261;
		 public static final int ACTION_POINTER_3_DOWN = 517;

		 public static final int ACTION_UP = 1;
		 public static final int ACTION_POINTER_1_UP = 6;
		 public static final int ACTION_POINTER_UP = 6;
		 public static final int ACTION_BUTTON_RELEASE = 12;
		 public static final int ACTION_POINTER_2_UP = 262;
		 public static final int ACTION_POINTER_3_UP = 518;

		 public static final int ACTION_MOVE = 2;

		 */
		if ((touchtype == 0) || (touchtype == 5) || (touchtype == 11) || (touchtype == 261) || (touchtype == 517)) {
			this.onMouseDown(newTouchEvent);
		} else if ((touchtype == 1) || (touchtype == 6) || (touchtype == 12) || (touchtype == 262) || (touchtype == 518)) {
			this.onMouseUp(newTouchEvent);
		} else if (touchtype == 2) {
			this.onMouseMove(newTouchEvent);
		} else {
			console.log('recieved unknown touch event-type: ' + touchtype);
		}
	}

	public fireEventsForSceneFromString(touchMessage: String, sceneIdx: number = 0): void {

		const newTouchEvent: any = {};
		newTouchEvent.clientX = null;// set the x position from the active touch
		newTouchEvent.clientY = null;// set the y position from the active touch
		newTouchEvent.preventDefault = function () { };
		const touchesFromMessage = touchMessage.split(',');
		// transfer touches to event
		let i = 0;
		let cnt = 0;
		const numTouches = parseInt(touchesFromMessage[cnt++]);
		const touchtype = parseInt(touchesFromMessage[cnt++]);
		const activeTouch = parseInt(touchesFromMessage[cnt++]);
		newTouchEvent.touches = [];
		newTouchEvent.changedTouches = [];
		if ((touchtype != 1) && (touchtype != 6)) {
			for (i = 0; i < numTouches; i++) {
				var newTouch: any = {};
				newTouch.identifier = touchesFromMessage[cnt++];
				newTouch.clientX = touchesFromMessage[cnt++];
				newTouch.clientY = touchesFromMessage[cnt++];
				newTouchEvent.touches[i] = newTouch;
				newTouchEvent.changedTouches[i] = newTouch;
			}
			newTouchEvent.changedTouches[i] = newTouchEvent.touches[activeTouch];
		} else {
			for (i = 0; i < numTouches; i++) {
				if (i != activeTouch) {
					var newTouch: any = {};
					newTouch.identifier = touchesFromMessage[cnt++];
					newTouch.clientX = touchesFromMessage[cnt++];
					newTouch.clientY = touchesFromMessage[cnt++];
					newTouchEvent.touches[i] = newTouch;
					newTouchEvent.changedTouches[i] = newTouch;
				} else {
					newTouchEvent.clientX = touchesFromMessage[cnt++];
					newTouchEvent.clientY = touchesFromMessage[cnt++];
					cnt++;
				}
			}

		}
		if (touchtype == 0) {//mousedown
			this.onMouseDown(newTouchEvent);
		} else if (touchtype == 1) {//mouseup
			this.onMouseUp(newTouchEvent);
		} else if (touchtype == 2) {//mousemove
			this.onMouseMove(newTouchEvent);

		} else if (touchtype == 261) {//mousedownPointer
			this.onMouseDown(newTouchEvent);

		} else if (touchtype == 6) {//mouseupPointer
			this.onMouseUp(newTouchEvent);
		}
	}

	private mapContainerToView(x: number, y: number, out: {x: number, y: number} = { x: 0, y: 0 }) {
		let rect;
		const container = <HTMLCanvasElement> this._containerLookup[0];
		// IE 11 fix
		if (!container.parentElement) {
			rect = { x: 0, y: 0, width: 0, height: 0 };
		} else {
			rect = container.getBoundingClientRect();
		}

		out.x = (x - rect.left) * container.clientWidth / rect.width;
		out.y = (y - rect.top) * container.clientHeight / rect.height;

		return out;
	}

	// ---------------------------------------------------------------------
	// Private.
	// ---------------------------------------------------------------------
	private setUpEvent(event: MouseEvent, sourceEvent, collision: PickingCollision, commonAncestor: DisplayObject = null): MouseEvent {
		event._iAllowedToImmediatlyPropagate = true;
		event._iAllowedToPropagate = true;
		// 2D properties.
		if (sourceEvent) {
			const x = (sourceEvent.clientX != null) ? sourceEvent.clientX : sourceEvent.changedTouches ? sourceEvent.changedTouches[0].clientX : 0;
			const y = (sourceEvent.clientY != null) ? sourceEvent.clientY : sourceEvent.changedTouches ? sourceEvent.changedTouches[0].clientY : 0;
			const point = this.mapContainerToView(x, y, TMP_POINT);

			event.delta = sourceEvent.wheelDelta;
			event.ctrlKey = sourceEvent.ctrlKey;
			event.altKey = sourceEvent.altKey;
			event.shiftKey = sourceEvent.shiftKey;
			event.screenX = point.x;
			event.screenY = point.y;
		}
		//console.log("event", event, collisionEntity, collisionEntity);

		// 3D properties.
		if (collision) {
			event.entity = <DisplayObject> collision.entity;

			event.pickerEntity = <DisplayObject> collision.pickerEntity;
			// Object.
			event.traversable = collision.traversable;
			// UV.
			event.uv = collision.uv;
			// Position.
			event.position = collision.position ? collision.position.clone() : null;
			// Normal.
			event.normal = collision.normal ? collision.normal.clone() : null;
			// Face index.
			event.elementIndex = collision.elementIndex;
		} else {
			// Set all to null.
			event.entity = null;
			event.pickerEntity = null;
			event.traversable = null;
			event.uv = null;
			event.position = this._nullVector;
			event.normal = this._nullVector;
			event.elementIndex = 0;
		}
		event.commonAncestor = commonAncestor;
		return event;

	}

	private queueDispatch(event: MouseEvent, sourceEvent, collision: PickingCollision, commonAncestor: DisplayObject = null): void {
		// Store event to be dispatched later.
		this._queuedEvents.push(this.setUpEvent(event, sourceEvent, collision, commonAncestor));

	}

	// ---------------------------------------------------------------------
	// Listeners.
	// ---------------------------------------------------------------------

	public onKeyDown(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);

		//console.log("Keydown", event);
		if (this.allowKeyInput) {
			event.preventDefault();
			if (this._currentFocusEntity || this._stage) {
				//console.log("dispatch keydown on ", this._currentFocusEntity);
				const newEvent: KeyboardEvent = new KeyboardEvent(KeyboardEvent.KEYDOWN, event.key, event.code);
				newEvent.isShift = event.shiftKey;
				newEvent.isCTRL = event.ctrlKey;
				newEvent.isAlt = event.altKey;
				(<any>newEvent).keyCode = event.keyCode;
				if (this._currentFocusEntity)
					this._currentFocusEntity.dispatchEvent(newEvent);
				if (this._stage)
					this._stage.dispatchEvent(newEvent);
			}
		}

	}

	public onKeyUp(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);

		//console.log("Keyup", event);
		if (this.allowKeyInput) {
			event.preventDefault();

			if (this._currentFocusEntity || this._stage) {
				//console.log("dispatch keydown on ", this._currentFocusEntity);
				const newEvent: KeyboardEvent = new KeyboardEvent(KeyboardEvent.KEYUP, event.key, event.code);
				newEvent.isShift = event.shiftKey;
				newEvent.isCTRL = event.ctrlKey;
				newEvent.isAlt = event.altKey;
				(<any>newEvent).keyCode = event.keyCode;
				if (this._currentFocusEntity)
					this._currentFocusEntity.dispatchEvent(newEvent);
				if (this._stage)
					this._stage.dispatchEvent(newEvent);
			}
		}

	}

	public onMouseMove(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this._isTouch = (event.type != 'mousemove');

		this.updateColliders(event);

		this.queueDispatch(this._mouseMove, this._mouseMoveEvent = event, this._iCollision);
	}

	public onMouseOut(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this.updateColliders(event);

		this.queueDispatch(this._mouseOut, event, this._iCollision);
	}

	public onMouseOver(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this.updateColliders(event);

		this.queueDispatch(this._mouseOver, event, this._iCollision);
	}

	public onClick(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this.updateColliders(event);

		this.queueDispatch(this._mouseClick, event, this._iCollision);
	}

	public onDoubleClick(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this.updateColliders(event);

		this.queueDispatch(this._mouseDoubleClick, event, this._iCollision);
	}

	private _isDown: boolean = false;

	public onMouseDown(event): void {
		this._isTouch = (event.type != 'mousedown');
		if (this._isDown) {
			return;
		}
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this._isDown = true;

		this.updateColliders(event);

		//console.log("this._iCollisionEntity", this._iCollisionEntity);
		if (this._isTouch) {
			event.preventDefault();
			for (const key in this._containerLookup) {
				this._containerLookup[key].focus();

			}
		}
		this.queueDispatch(this._mouseDown, event, this._iCollision);
	}

	public onMouseUp(event): void {
		if (!this._isDown) {
			return;
		}
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this._isDown = false;

		this.updateColliders(event);

		if (this._isTouch) {
			event.preventDefault();
			for (const key in this._containerLookup) {
				this._containerLookup[key].focus();

			}
		}
		this.queueDispatch(this._mouseUp, event, this._iCollision);
	}

	public onMouseWheel(event): void {
		!MouseManager.inputRecorder || MouseManager.inputRecorder.recordEvent(event);
		this.updateColliders(event);

		this.queueDispatch(this._mouseWheel, event, this._iCollision);
	}

	private updateColliders(event): void {
		let scene: Scene;

		let mouseX: number = (event.clientX != null) ? event.clientX : event.changedTouches[0].clientX;
		let mouseY: number = (event.clientY != null) ? event.clientY : event.changedTouches[0].clientY;

		let point = this.mapContainerToView(mouseX, mouseY, TMP_POINT);
		mouseX = point.x;
		mouseY = point.y;

		const len: number = this._sceneLookup.length;

		for (let i: number = 0; i < len; i++) {
			scene = this._sceneLookup[i];
			scene._touchPoints.length = 0;

			if (event.touches) {
				var touch;
				const len_touches: number = event.touches.length;
				for (let t: number = 0; t < len_touches; t++) {
					touch = event.touches[t];

					point = this.mapContainerToView(touch.clientX, touch.clientY, TMP_POINT);

					scene._touchPoints.push(new TouchPoint(point.x, point.y, touch.identifier));
				}
			}

			if (this._iUpdateDirty)
				continue;

			scene._mouseX = mouseX;
			scene._mouseY = mouseY;

			if (!scene.disableMouseEvents)
				this._iCollision = scene.getViewCollision(scene._mouseX, scene._mouseY);

			if (scene.layeredView && this._iCollision)
				break;

		}

		this._iUpdateDirty = true;
	}
}