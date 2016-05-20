require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var adapters = require("./lib/adapters");
exports.adapters = adapters;
var animators = require("./lib/animators");
exports.animators = animators;
var base = require("./lib/base");
exports.base = base;
var bounds = require("./lib/bounds");
exports.bounds = bounds;
var controllers = require("./lib/controllers");
exports.controllers = controllers;
var display = require("./lib/display");
exports.display = display;
var draw = require("./lib/draw");
exports.draw = draw;
var errors = require("./lib/errors");
exports.errors = errors;
var events = require("./lib/events");
exports.events = events;
var factories = require("./lib/factories");
exports.factories = factories;
var graphics = require("./lib/graphics");
exports.graphics = graphics;
var managers = require("./lib/managers");
exports.managers = managers;
var materials = require("./lib/materials");
exports.materials = materials;
var partition = require("./lib/partition");
exports.partition = partition;
var pick = require("./lib/pick");
exports.pick = pick;
var prefabs = require("./lib/prefabs");
exports.prefabs = prefabs;
var text = require("./lib/text");
exports.text = text;
var textures = require("./lib/textures");
exports.textures = textures;
var utils = require("./lib/utils");
exports.utils = utils;
var View_1 = require("./lib/View");
exports.View = View_1.View;
partition.PartitionBase.registerAbstraction(partition.CameraNode, display.Camera);
partition.PartitionBase.registerAbstraction(partition.DirectionalLightNode, display.DirectionalLight);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Sprite);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Shape);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.MovieClip);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.Billboard);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.LineSegment);
partition.PartitionBase.registerAbstraction(partition.EntityNode, display.TextField);
partition.PartitionBase.registerAbstraction(partition.LightProbeNode, display.LightProbe);
partition.PartitionBase.registerAbstraction(partition.PointLightNode, display.PointLight);
partition.PartitionBase.registerAbstraction(partition.SkyboxNode, display.Skybox);

},{"./lib/View":"awayjs-display/lib/View","./lib/adapters":"awayjs-display/lib/adapters","./lib/animators":"awayjs-display/lib/animators","./lib/base":"awayjs-display/lib/base","./lib/bounds":"awayjs-display/lib/bounds","./lib/controllers":"awayjs-display/lib/controllers","./lib/display":"awayjs-display/lib/display","./lib/draw":"awayjs-display/lib/draw","./lib/errors":"awayjs-display/lib/errors","./lib/events":"awayjs-display/lib/events","./lib/factories":"awayjs-display/lib/factories","./lib/graphics":"awayjs-display/lib/graphics","./lib/managers":"awayjs-display/lib/managers","./lib/materials":"awayjs-display/lib/materials","./lib/partition":"awayjs-display/lib/partition","./lib/pick":"awayjs-display/lib/pick","./lib/prefabs":"awayjs-display/lib/prefabs","./lib/text":"awayjs-display/lib/text","./lib/textures":"awayjs-display/lib/textures","./lib/utils":"awayjs-display/lib/utils"}],"awayjs-display/lib/IRenderer":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/ITraverser":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/View":[function(require,module,exports){
"use strict";
var getTimer_1 = require("awayjs-core/lib/utils/getTimer");
var TouchPoint_1 = require("./base/TouchPoint");
var Scene_1 = require("./display/Scene");
var RaycastPicker_1 = require("./pick/RaycastPicker");
var Camera_1 = require("./display/Camera");
var CameraEvent_1 = require("./events/CameraEvent");
var DisplayObjectEvent_1 = require("./events/DisplayObjectEvent");
var RendererEvent_1 = require("./events/RendererEvent");
var MouseManager_1 = require("./managers/MouseManager");
var View = (function () {
    /*
     ***********************************************************************
     * Disabled / Not yet implemented
     ***********************************************************************
     *
     * private _background:away.textures.Texture2DBase;
     *
     * public _pTouch3DManager:away.managers.Touch3DManager;
     *
     */
    function View(renderer, scene, camera) {
        var _this = this;
        if (scene === void 0) { scene = null; }
        if (camera === void 0) { camera = null; }
        this._width = 0;
        this._height = 0;
        this._time = 0;
        this._deltaTime = 0;
        this._backgroundColor = 0x000000;
        this._backgroundAlpha = 1;
        this._viewportDirty = true;
        this._scissorDirty = true;
        this._mousePicker = new RaycastPicker_1.RaycastPicker();
        this._pTouchPoints = new Array();
        this._onPartitionChangedDelegate = function (event) { return _this._onPartitionChanged(event); };
        this._onProjectionChangedDelegate = function (event) { return _this._onProjectionChanged(event); };
        this._onViewportUpdatedDelegate = function (event) { return _this._onViewportUpdated(event); };
        this._onScissorUpdatedDelegate = function (event) { return _this._onScissorUpdated(event); };
        this.scene = scene || new Scene_1.Scene();
        this.camera = camera || new Camera_1.Camera();
        this.renderer = renderer;
        //make sure document border is zero
        if (document) {
            document.body.style.margin = "0px";
            this._htmlElement = document.createElement("div");
            this._htmlElement.style.position = "absolute";
            document.body.appendChild(this._htmlElement);
        }
        this._mouseManager = MouseManager_1.MouseManager.getInstance();
        this._mouseManager.registerView(this);
        //			if (this._shareContext)
        //				this._mouse3DManager.addViewLayer(this);
    }
    Object.defineProperty(View.prototype, "mouseX", {
        get: function () {
            return this._pMouseX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "mouseY", {
        get: function () {
            return this._pMouseY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "touchPoints", {
        get: function () {
            return this._pTouchPoints;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.getLocalMouseX = function (displayObject) {
        return displayObject.inverseSceneTransform.transformVector(this.unproject(this._pMouseX, this._pMouseY, 1000)).x;
    };
    View.prototype.getLocalMouseY = function (displayObject) {
        return displayObject.inverseSceneTransform.transformVector(this.unproject(this._pMouseX, this._pMouseY, 1000)).y;
    };
    View.prototype.getLocalTouchPoints = function (displayObject) {
        var localPosition;
        var localTouchPoints = new Array();
        var len = this._pTouchPoints.length;
        for (var i = 0; i < len; i++) {
            localPosition = displayObject.inverseSceneTransform.transformVector(this.unproject(this._pTouchPoints[i].x, this._pTouchPoints[i].y, 1000));
            localTouchPoints.push(new TouchPoint_1.TouchPoint(localPosition.x, localPosition.y, this._pTouchPoints[i].id));
        }
        return localTouchPoints;
    };
    Object.defineProperty(View.prototype, "htmlElement", {
        /**
         *
         */
        get: function () {
            return this._htmlElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "renderer", {
        /**
         *
         */
        get: function () {
            return this._pRenderer;
        },
        set: function (value) {
            if (this._pRenderer == value)
                return;
            if (this._pRenderer) {
                this._pRenderer.dispose();
                this._pRenderer.removeEventListener(RendererEvent_1.RendererEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
                this._pRenderer.removeEventListener(RendererEvent_1.RendererEvent.SCISSOR_UPDATED, this._onScissorUpdatedDelegate);
            }
            this._pRenderer = value;
            this._pRenderer.addEventListener(RendererEvent_1.RendererEvent.VIEWPORT_UPDATED, this._onViewportUpdatedDelegate);
            this._pRenderer.addEventListener(RendererEvent_1.RendererEvent.SCISSOR_UPDATED, this._onScissorUpdatedDelegate);
            //reset back buffer
            this._pRenderer._iBackgroundR = ((this._backgroundColor >> 16) & 0xff) / 0xff;
            this._pRenderer._iBackgroundG = ((this._backgroundColor >> 8) & 0xff) / 0xff;
            this._pRenderer._iBackgroundB = (this._backgroundColor & 0xff) / 0xff;
            this._pRenderer._iBackgroundAlpha = this._backgroundAlpha;
            this._pRenderer.width = this._width;
            this._pRenderer.height = this._height;
            this._pRenderer.shareContext = this._shareContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "shareContext", {
        /**
         *
         */
        get: function () {
            return this._shareContext;
        },
        set: function (value) {
            if (this._shareContext == value)
                return;
            this._shareContext = value;
            if (this._pRenderer)
                this._pRenderer.shareContext = this._shareContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "backgroundColor", {
        /**
         *
         */
        get: function () {
            return this._backgroundColor;
        },
        set: function (value) {
            if (this._backgroundColor == value)
                return;
            this._backgroundColor = value;
            this._pRenderer._iBackgroundR = ((value >> 16) & 0xff) / 0xff;
            this._pRenderer._iBackgroundG = ((value >> 8) & 0xff) / 0xff;
            this._pRenderer._iBackgroundB = (value & 0xff) / 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "backgroundAlpha", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._backgroundAlpha;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            if (this._backgroundAlpha == value)
                return;
            this._pRenderer._iBackgroundAlpha = this._backgroundAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "camera", {
        /**
         *
         * @returns {Camera3D}
         */
        get: function () {
            return this._pCamera;
        },
        /**
         * Set camera that's used to render the scene for this viewport
         */
        set: function (value) {
            if (this._pCamera == value)
                return;
            if (this._pCamera)
                this._pCamera.removeEventListener(CameraEvent_1.CameraEvent.PROJECTION_CHANGED, this._onProjectionChangedDelegate);
            this._pCamera = value;
            if (this._pScene)
                this._pScene.partition._iRegisterEntity(this._pCamera);
            this._pCamera.addEventListener(CameraEvent_1.CameraEvent.PROJECTION_CHANGED, this._onProjectionChangedDelegate);
            this._scissorDirty = true;
            this._viewportDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "scene", {
        /**
         *
         * @returns {away.containers.Scene3D}
         */
        get: function () {
            return this._pScene;
        },
        /**
         * Set the scene that's used to render for this viewport
         */
        set: function (value) {
            if (this._pScene == value)
                return;
            if (this._pScene)
                this._pScene.removeEventListener(DisplayObjectEvent_1.DisplayObjectEvent.PARTITION_CHANGED, this._onPartitionChangedDelegate);
            this._pScene = value;
            this._pScene.addEventListener(DisplayObjectEvent_1.DisplayObjectEvent.PARTITION_CHANGED, this._onPartitionChangedDelegate);
            if (this._pCamera)
                this._pScene.partition._iRegisterEntity(this._pCamera);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "deltaTime", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._deltaTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "width", {
        /**
         *
         */
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width == value)
                return;
            this._width = value;
            this._aspectRatio = this._width / this._height;
            this._pCamera.projection._iAspectRatio = this._aspectRatio;
            this._pRenderer.width = value;
            if (this._htmlElement) {
                this._htmlElement.style.width = value + "px";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "height", {
        /**
         *
         */
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height == value)
                return;
            this._height = value;
            this._aspectRatio = this._width / this._height;
            this._pCamera.projection._iAspectRatio = this._aspectRatio;
            this._pRenderer.height = value;
            if (this._htmlElement) {
                this._htmlElement.style.height = value + "px";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "mousePicker", {
        /**
         *
         */
        get: function () {
            return this._mousePicker;
        },
        set: function (value) {
            if (this._mousePicker == value)
                return;
            if (value == null)
                this._mousePicker = new RaycastPicker_1.RaycastPicker();
            else
                this._mousePicker = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "x", {
        /**
         *
         */
        get: function () {
            return this._pRenderer.x;
        },
        set: function (value) {
            if (this._pRenderer.x == value)
                return;
            this._pRenderer.x == value;
            if (this._htmlElement) {
                this._htmlElement.style.left = value + "px";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "y", {
        /**
         *
         */
        get: function () {
            return this._pRenderer.y;
        },
        set: function (value) {
            if (this._pRenderer.y == value)
                return;
            this._pRenderer.y == value;
            if (this._htmlElement) {
                this._htmlElement.style.top = value + "px";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "visible", {
        /**
         *
         */
        get: function () {
            return (this._htmlElement && this._htmlElement.style.visibility == "visible");
        },
        set: function (value) {
            if (this._htmlElement) {
                this._htmlElement.style.visibility = value ? "visible" : "hidden";
            }
            //TODO transfer visible property to associated context (if one exists)
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "renderedFacesCount", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return 0; //TODO
            //return this._pEntityCollector._pNumTriangles;//numTriangles;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Renders the view.
     */
    View.prototype.render = function () {
        this.pUpdateTime();
        //update view and size data
        this._pCamera.projection._iAspectRatio = this._aspectRatio;
        if (this._scissorDirty) {
            this._scissorDirty = false;
            this._pCamera.projection._iUpdateScissorRect(this._pRenderer.scissorRect.x, this._pRenderer.scissorRect.y, this._pRenderer.scissorRect.width, this._pRenderer.scissorRect.height);
        }
        if (this._viewportDirty) {
            this._viewportDirty = false;
            this._pCamera.projection._iUpdateViewport(this._pRenderer.viewPort.x, this._pRenderer.viewPort.y, this._pRenderer.viewPort.width, this._pRenderer.viewPort.height);
        }
        // update picking
        if (!this._shareContext) {
            if (this.forceMouseMove && this._htmlElement == this._mouseManager._iActiveDiv && !this._mouseManager._iUpdateDirty)
                this._mouseManager._iCollision = this.mousePicker.getViewCollision(this._pMouseX, this._pMouseY, this);
            this._mouseManager.fireMouseEvents(this.forceMouseMove);
        }
        //_touch3DManager.updateCollider();
        //render the contents of the scene
        this._pRenderer.render(this._pCamera, this._pScene);
    };
    /**
     *
     */
    View.prototype.pUpdateTime = function () {
        var time = getTimer_1.getTimer();
        if (this._time == 0)
            this._time = time;
        this._deltaTime = time - this._time;
        this._time = time;
    };
    /**
     *
     */
    View.prototype.dispose = function () {
        this._pRenderer.dispose();
        // TODO: imeplement mouseManager / touch3DManager
        this._mouseManager.unregisterView(this);
        //this._touch3DManager.disableTouchListeners(this);
        //this._touch3DManager.dispose();
        this._mouseManager = null;
        //this._touch3DManager = null;
        this._pRenderer = null;
    };
    /**
     *
     * @param e
     */
    View.prototype._onPartitionChanged = function (event) {
        if (this._pCamera)
            this._pScene.partition._iRegisterEntity(this._pCamera);
    };
    /**
     *
     */
    View.prototype._onProjectionChanged = function (event) {
        this._scissorDirty = true;
        this._viewportDirty = true;
    };
    /**
     *
     */
    View.prototype._onViewportUpdated = function (event) {
        this._viewportDirty = true;
    };
    /**
     *
     */
    View.prototype._onScissorUpdated = function (event) {
        this._scissorDirty = true;
    };
    View.prototype.project = function (point3d) {
        var v = this._pCamera.project(point3d);
        v.x = v.x * this._pRenderer.viewPort.width / 2 + this._width * this._pCamera.projection.originX;
        v.y = v.y * this._pRenderer.viewPort.height / 2 + this._height * this._pCamera.projection.originY;
        return v;
    };
    View.prototype.unproject = function (sX, sY, sZ) {
        return this._pCamera.unproject(2 * (sX - this._width * this._pCamera.projection.originX) / this._pRenderer.viewPort.width, 2 * (sY - this._height * this._pCamera.projection.originY) / this._pRenderer.viewPort.height, sZ);
    };
    View.prototype.getRay = function (sX, sY, sZ) {
        return this._pCamera.getRay((sX * 2 - this._width) / this._width, (sY * 2 - this._height) / this._height, sZ);
    };
    /*TODO: implement Background
     public get background():away.textures.Texture2DBase
     {
     return this._background;
     }
     */
    /*TODO: implement Background
     public set background( value:away.textures.Texture2DBase )
     {
     this._background = value;
     this._renderer.background = _background;
     }
     */
    // TODO: required dependency stageGL
    View.prototype.updateCollider = function () {
        if (!this._shareContext) {
            if (this._htmlElement == this._mouseManager._iActiveDiv)
                this._mouseManager._iCollision = this.mousePicker.getViewCollision(this._pMouseX, this._pMouseY, this);
        }
        else {
            var collidingObject = this.mousePicker.getViewCollision(this._pMouseX, this._pMouseY, this);
            if (this.layeredView || this._mouseManager._iCollision == null || collidingObject.rayEntryDistance < this._mouseManager._iCollision.rayEntryDistance)
                this._mouseManager._iCollision = collidingObject;
        }
    };
    return View;
}());
exports.View = View;

},{"./base/TouchPoint":"awayjs-display/lib/base/TouchPoint","./display/Camera":"awayjs-display/lib/display/Camera","./display/Scene":"awayjs-display/lib/display/Scene","./events/CameraEvent":"awayjs-display/lib/events/CameraEvent","./events/DisplayObjectEvent":"awayjs-display/lib/events/DisplayObjectEvent","./events/RendererEvent":"awayjs-display/lib/events/RendererEvent","./managers/MouseManager":"awayjs-display/lib/managers/MouseManager","./pick/RaycastPicker":"awayjs-display/lib/pick/RaycastPicker","awayjs-core/lib/utils/getTimer":undefined}],"awayjs-display/lib/adapters/IDisplayObjectAdapter":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/adapters/IMovieClipAdapter":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/adapters":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/animators/IAnimationSet":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/animators/IAnimator":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/animators/data/ParticleData":[function(require,module,exports){
"use strict";
var ParticleData = (function () {
    function ParticleData() {
    }
    return ParticleData;
}());
exports.ParticleData = ParticleData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticleData;

},{}],"awayjs-display/lib/animators/nodes/AnimationNodeBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
/**
 * Provides an abstract base class for nodes in an animation blend tree.
 */
var AnimationNodeBase = (function (_super) {
    __extends(AnimationNodeBase, _super);
    /**
     * Creates a new <code>AnimationNodeBase</code> object.
     */
    function AnimationNodeBase() {
        _super.call(this);
    }
    Object.defineProperty(AnimationNodeBase.prototype, "stateClass", {
        get: function () {
            return this._pStateClass;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    AnimationNodeBase.prototype.dispose = function () {
    };
    Object.defineProperty(AnimationNodeBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AnimationNodeBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    AnimationNodeBase.assetType = "[asset AnimationNodeBase]";
    return AnimationNodeBase;
}(AssetBase_1.AssetBase));
exports.AnimationNodeBase = AnimationNodeBase;

},{"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/animators":[function(require,module,exports){
"use strict";
var ParticleData_1 = require("./animators/data/ParticleData");
exports.ParticleData = ParticleData_1.ParticleData;
var AnimationNodeBase_1 = require("./animators/nodes/AnimationNodeBase");
exports.AnimationNodeBase = AnimationNodeBase_1.AnimationNodeBase;

},{"./animators/data/ParticleData":"awayjs-display/lib/animators/data/ParticleData","./animators/nodes/AnimationNodeBase":"awayjs-display/lib/animators/nodes/AnimationNodeBase"}],"awayjs-display/lib/base/AlignmentMode":[function(require,module,exports){
"use strict";
/**
 *
 */
var AlignmentMode = (function () {
    function AlignmentMode() {
    }
    /**
     *
     */
    AlignmentMode.REGISTRATION_POINT = "registrationPoint";
    /**
     *
     */
    AlignmentMode.PIVOT_POINT = "pivot";
    return AlignmentMode;
}());
exports.AlignmentMode = AlignmentMode;

},{}],"awayjs-display/lib/base/HierarchicalProperties":[function(require,module,exports){
"use strict";
/**
 *
 */
var HierarchicalProperties = (function () {
    function HierarchicalProperties() {
    }
    /**
     *
     */
    HierarchicalProperties.MOUSE_ENABLED = 1;
    /**
     *
     */
    HierarchicalProperties.VISIBLE = 2;
    /**
     *
     */
    HierarchicalProperties.MASK_ID = 4;
    /**
     *
     */
    HierarchicalProperties.MASKS = 8;
    /**
     *
     */
    HierarchicalProperties.COLOR_TRANSFORM = 16;
    /**
     *
     */
    HierarchicalProperties.SCENE_TRANSFORM = 32;
    /**
     *
     */
    HierarchicalProperties.ALL = 63;
    return HierarchicalProperties;
}());
exports.HierarchicalProperties = HierarchicalProperties;

},{}],"awayjs-display/lib/base/IBitmapDrawable":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/base/IRenderable":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/base/ISurface":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/base/OrientationMode":[function(require,module,exports){
"use strict";
var OrientationMode = (function () {
    function OrientationMode() {
    }
    /**
     *
     */
    OrientationMode.DEFAULT = "default";
    /**
     *
     */
    OrientationMode.CAMERA_PLANE = "cameraPlane";
    /**
     *
     */
    OrientationMode.CAMERA_POSITION = "cameraPosition";
    return OrientationMode;
}());
exports.OrientationMode = OrientationMode;

},{}],"awayjs-display/lib/base/Style":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("awayjs-core/lib/events/EventDispatcher");
var StyleEvent_1 = require("../events/StyleEvent");
/**
 *
 */
var Style = (function (_super) {
    __extends(Style, _super);
    function Style() {
        _super.call(this);
        this._samplers = new Object();
        this._images = new Object();
        this._color = 0xFFFFFF;
    }
    Object.defineProperty(Style.prototype, "sampler", {
        get: function () {
            return this._sampler;
        },
        set: function (value) {
            if (this._sampler == value)
                return;
            this._sampler = value;
            this._invalidateProperties();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "image", {
        get: function () {
            return this._image;
        },
        set: function (value) {
            if (this._image == value)
                return;
            this._image = value;
            this._invalidateProperties();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "uvMatrix", {
        get: function () {
            return this._uvMatrix;
        },
        set: function (value) {
            if (this._uvMatrix == value)
                return;
            this._uvMatrix = value;
            this._invalidateProperties();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "color", {
        /**
         * The diffuse reflectivity color of the surface.
         */
        get: function () {
            return this._color;
        },
        set: function (value) {
            if (this._color == value)
                return;
            this._color = value;
            this._invalidateProperties();
        },
        enumerable: true,
        configurable: true
    });
    Style.prototype.getImageAt = function (texture, index) {
        if (index === void 0) { index = 0; }
        return (this._images[texture.id] ? this._images[texture.id][index] : null) || this._image;
    };
    Style.prototype.getSamplerAt = function (texture, index) {
        if (index === void 0) { index = 0; }
        return (this._samplers[texture.id] ? this._samplers[texture.id][index] : null) || this._sampler;
    };
    Style.prototype.addImageAt = function (image, texture, index) {
        if (index === void 0) { index = 0; }
        if (!this._images[texture.id])
            this._images[texture.id] = new Array();
        this._images[texture.id][index] = image;
    };
    Style.prototype.addSamplerAt = function (sampler, texture, index) {
        if (index === void 0) { index = 0; }
        if (!this._samplers[texture.id])
            this._samplers[texture.id] = new Array();
        this._samplers[texture.id][index] = sampler;
        this._invalidateProperties();
    };
    Style.prototype.removeImageAt = function (texture, index) {
        if (index === void 0) { index = 0; }
        if (!this._images[texture.id])
            return;
        this._images[texture.id][index] = null;
        this._invalidateProperties();
    };
    Style.prototype.removeSamplerAt = function (texture, index) {
        if (index === void 0) { index = 0; }
        if (!this._samplers[texture.id])
            return;
        this._samplers[texture.id][index] = null;
        this._invalidateProperties();
    };
    Style.prototype._invalidateProperties = function () {
        this.dispatchEvent(new StyleEvent_1.StyleEvent(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this));
    };
    return Style;
}(EventDispatcher_1.EventDispatcher));
exports.Style = Style;

},{"../events/StyleEvent":"awayjs-display/lib/events/StyleEvent","awayjs-core/lib/events/EventDispatcher":undefined}],"awayjs-display/lib/base/Timeline":[function(require,module,exports){
"use strict";
var HierarchicalProperties_1 = require("../base/HierarchicalProperties");
var ColorTransform_1 = require("awayjs-core/lib/geom/ColorTransform");
var FrameScriptManager_1 = require("../managers/FrameScriptManager");
var Timeline = (function () {
    function Timeline() {
        this._functions = [];
        this._update_indices = [];
        this.numKeyFrames = 0;
        this.keyframe_indices = [];
        this._potentialPrototypes = [];
        this._labels = {};
        this._framescripts = {};
        this._framescripts_translated = {};
        //cache functions
        this._functions[1] = this.update_mtx_all;
        this._functions[2] = this.update_colortransform;
        this._functions[3] = this.update_masks;
        this._functions[4] = this.update_name;
        this._functions[5] = this.update_button_name;
        this._functions[6] = this.update_visibility;
        this._functions[11] = this.update_mtx_scale_rot;
        this._functions[12] = this.update_mtx_pos;
        this._functions[200] = this.enable_maskmode;
        this._functions[201] = this.remove_masks;
    }
    Timeline.prototype.init = function () {
        if ((this.frame_command_indices == null) || (this.frame_recipe == null) || (this.keyframe_durations == null))
            return;
        this.keyframe_firstframes = [];
        this.keyframe_constructframes = [];
        var frame_cnt = 0;
        var ic = 0;
        var ic2 = 0;
        var keyframe_cnt = 0;
        var last_construct_frame = 0;
        for (ic = 0; ic < this.numKeyFrames; ic++) {
            var duration = this.keyframe_durations[(ic)];
            if (this.frame_recipe[ic] & 1)
                last_construct_frame = keyframe_cnt;
            this.keyframe_firstframes[keyframe_cnt] = frame_cnt;
            this.keyframe_constructframes[keyframe_cnt++] = last_construct_frame;
            for (ic2 = 0; ic2 < duration; ic2++)
                this.keyframe_indices[frame_cnt++] = ic;
        }
    };
    Timeline.prototype.get_framescript = function (keyframe_index) {
        if (this._framescripts[keyframe_index] == null)
            return "";
        if (typeof this._framescripts[keyframe_index] == "string")
            return this._framescripts[keyframe_index];
        else {
            throw new Error("Framescript is already translated to Function!!!");
        }
    };
    Timeline.prototype.add_framescript = function (value, keyframe_index) {
        if (FrameScriptManager_1.FrameScriptManager.frameScriptDebug) {
            // if we are in debug mode, we try to extract the function name from the first line of framescript code,
            // and check if this function is available on the object that is set as frameScriptDebug
            // try to get the functions name (it should be the first line as comment)
            var functionname = value.split(/[\r\n]+/g)[0].split("//")[1];
            if (FrameScriptManager_1.FrameScriptManager.frameScriptDebug[functionname]) {
                this._framescripts[keyframe_index] = FrameScriptManager_1.FrameScriptManager.frameScriptDebug[functionname];
                this._framescripts_translated[keyframe_index] = true;
                return;
            }
            else {
                throw new Error("Framescript could not be found on FrameScriptManager.frameScriptDebug.\n the Object set as FrameScriptmanager.frameScriptDebug should contain a function with the name '" + functionname + "' !!!");
            }
        }
        this._framescripts[keyframe_index] = value;
    };
    Timeline.prototype.regexIndexOf = function (str, regex, startpos) {
        var indexOf = str.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    };
    Timeline.prototype.add_script_for_postcontruct = function (target_mc, keyframe_idx, scriptPass1) {
        if (scriptPass1 === void 0) { scriptPass1 = false; }
        if (this._framescripts[keyframe_idx] != null) {
            if (this._framescripts_translated[keyframe_idx] == null) {
                this._framescripts[keyframe_idx] = target_mc.adapter.evalScript(this._framescripts[keyframe_idx]);
                this._framescripts_translated[keyframe_idx] = true;
            }
            if (scriptPass1)
                FrameScriptManager_1.FrameScriptManager.add_script_to_queue(target_mc, this._framescripts[keyframe_idx]);
            else
                FrameScriptManager_1.FrameScriptManager.add_script_to_queue_pass2(target_mc, this._framescripts[keyframe_idx]);
        }
    };
    Object.defineProperty(Timeline.prototype, "numFrames", {
        get: function () {
            return this.keyframe_indices.length;
        },
        enumerable: true,
        configurable: true
    });
    Timeline.prototype.getPotentialChildPrototype = function (id) {
        return this._potentialPrototypes[id];
    };
    Timeline.prototype.getKeyframeIndexForFrameIndex = function (frame_index) {
        return this.keyframe_indices[frame_index];
    };
    Timeline.prototype.getPotentialChildInstance = function (id) {
        var this_clone = this._potentialPrototypes[id].clone();
        this_clone.name = "";
        return this_clone;
    };
    Timeline.prototype.registerPotentialChild = function (prototype) {
        var id = this._potentialPrototypes.length;
        this._potentialPrototypes[id] = prototype;
    };
    Timeline.prototype.jumpToLabel = function (target_mc, label) {
        var key_frame_index = this._labels[label];
        if (key_frame_index >= 0)
            target_mc.currentFrameIndex = this.keyframe_firstframes[key_frame_index];
    };
    Timeline.prototype.gotoFrame = function (target_mc, value, skip_script) {
        if (skip_script === void 0) { skip_script = false; }
        var current_keyframe_idx = target_mc.constructedKeyFrameIndex;
        var target_keyframe_idx = this.keyframe_indices[value];
        if (current_keyframe_idx == target_keyframe_idx)
            return;
        if (current_keyframe_idx + 1 == target_keyframe_idx) {
            this.constructNextFrame(target_mc, !skip_script, true);
            return;
        }
        var break_frame_idx = this.keyframe_constructframes[target_keyframe_idx];
        //we now have 3 index to keyframes: current_keyframe_idx / target_keyframe_idx / break_frame_idx
        var jump_forward = (target_keyframe_idx > current_keyframe_idx);
        var jump_gap = (break_frame_idx > current_keyframe_idx);
        // in case we jump forward, but not jump a gap, we start at current_keyframe_idx + 1
        // in case we jump back or we jump a gap, we want to start constructing at BreakFrame
        var start_construct_idx = (jump_forward && !jump_gap) ? current_keyframe_idx + 1 : break_frame_idx;
        var i;
        var k;
        if (jump_gap)
            for (i = target_mc.numChildren - 1; i >= 0; i--)
                if (target_mc._children[i]._depthID < 0)
                    target_mc.removeChildAt(i);
        //if we jump back, we want to reset all objects (but not the timelines of the mcs)
        if (!jump_forward)
            target_mc.resetSessionIDs();
        // in other cases, we want to collect the current objects to compare state of targetframe with state of currentframe
        var depth_sessionIDs = target_mc.getSessionIDDepths();
        //pass1: only apply add/remove commands into depth_sessionIDs.
        this.pass1(start_construct_idx, target_keyframe_idx, depth_sessionIDs);
        // check what childs are alive on both frames.
        // childs that are not alive anymore get removed and unregistered
        // childs that are alive on both frames have their properties reset if we are jumping back
        var child;
        for (i = target_mc.numChildren - 1; i >= 0; i--) {
            child = target_mc._children[i];
            if (child._depthID < 0) {
                if (depth_sessionIDs[child._depthID] != child._sessionID) {
                    target_mc.removeChildAt(i);
                }
                else if (!jump_forward) {
                    if (child.adapter) {
                        if (!child.adapter.isBlockedByScript()) {
                            child.transform.clearMatrix3D();
                            child.transform.clearColorTransform();
                            //this.name="";
                            child.masks = null;
                            child.maskMode = false;
                        }
                        if (!child.adapter.isVisibilityByScript()) {
                            child.visible = true;
                        }
                    }
                }
            }
        }
        // now we need to addchild the objects that were added before targetframe first
        // than we can add the script of the targetframe
        // than we can addchild objects added on targetframe
        for (var key in depth_sessionIDs) {
            child = target_mc.getPotentialChildInstance(this.add_child_stream[depth_sessionIDs[key] * 2]);
            if (child._sessionID == -1)
                target_mc._addTimelineChildAt(child, Number(key), depth_sessionIDs[key]);
        }
        if (!skip_script && this.keyframe_firstframes[target_keyframe_idx] == value)
            this.add_script_for_postcontruct(target_mc, target_keyframe_idx, true);
        //pass2: apply update commands for objects on stage (only if they are not blocked by script)
        this.pass2(target_mc);
        target_mc.constructedKeyFrameIndex = target_keyframe_idx;
    };
    Timeline.prototype.pass1 = function (start_construct_idx, target_keyframe_idx, depth_sessionIDs) {
        var i;
        var k;
        this._update_indices.length = 0; // store a list of updatecommand_indices, so we dont have to read frame_recipe again
        var update_cnt = 0;
        var start_index;
        var end_index;
        for (k = start_construct_idx; k <= target_keyframe_idx; k++) {
            var frame_command_idx = this.frame_command_indices[k];
            var frame_recipe = this.frame_recipe[k];
            if (frame_recipe & 2) {
                // remove childs
                start_index = this.command_index_stream[frame_command_idx];
                end_index = start_index + this.command_length_stream[frame_command_idx++];
                for (i = start_index; i < end_index; i++)
                    delete depth_sessionIDs[this.remove_child_stream[i] - 16383];
            }
            if (frame_recipe & 4) {
                start_index = this.command_index_stream[frame_command_idx];
                end_index = start_index + this.command_length_stream[frame_command_idx++];
                // apply add commands in reversed order to have script exeucted in correct order.
                // this could be changed in exporter
                for (i = end_index - 1; i >= start_index; i--)
                    depth_sessionIDs[this.add_child_stream[i * 2 + 1] - 16383] = i;
            }
            if (frame_recipe & 8)
                this._update_indices[update_cnt++] = frame_command_idx; // execute update command later
        }
    };
    Timeline.prototype.pass2 = function (target_mc) {
        var k;
        var len = this._update_indices.length;
        for (k = 0; k < len; k++)
            this.update_childs(target_mc, this._update_indices[k]);
    };
    Timeline.prototype.constructNextFrame = function (target_mc, queueScript, scriptPass1) {
        if (queueScript === void 0) { queueScript = true; }
        if (scriptPass1 === void 0) { scriptPass1 = false; }
        var frameIndex = target_mc.currentFrameIndex;
        var new_keyFrameIndex = this.keyframe_indices[frameIndex];
        if (queueScript && this.keyframe_firstframes[new_keyFrameIndex] == frameIndex)
            this.add_script_for_postcontruct(target_mc, new_keyFrameIndex, scriptPass1);
        if (target_mc.constructedKeyFrameIndex != new_keyFrameIndex) {
            target_mc.constructedKeyFrameIndex = new_keyFrameIndex;
            var frame_command_idx = this.frame_command_indices[new_keyFrameIndex];
            var frame_recipe = this.frame_recipe[new_keyFrameIndex];
            if (frame_recipe & 1) {
                for (var i = target_mc.numChildren - 1; i >= 0; i--)
                    if (target_mc._children[i]._depthID < 0)
                        target_mc.removeChildAt(i);
            }
            else if (frame_recipe & 2) {
                this.remove_childs_continous(target_mc, frame_command_idx++);
            }
            if (frame_recipe & 4)
                this.add_childs_continous(target_mc, frame_command_idx++);
            if (frame_recipe & 8)
                this.update_childs(target_mc, frame_command_idx++);
        }
    };
    Timeline.prototype.remove_childs_continous = function (sourceMovieClip, frame_command_idx) {
        var start_index = this.command_index_stream[frame_command_idx];
        var end_index = start_index + this.command_length_stream[frame_command_idx];
        for (var i = start_index; i < end_index; i++)
            sourceMovieClip.removeChildAt(sourceMovieClip.getDepthIndexInternal(this.remove_child_stream[i] - 16383));
    };
    // used to add childs when jumping between frames
    Timeline.prototype.add_childs_continous = function (sourceMovieClip, frame_command_idx) {
        // apply add commands in reversed order to have script exeucted in correct order.
        // this could be changed in exporter
        var idx;
        var start_index = this.command_index_stream[frame_command_idx];
        var end_index = start_index + this.command_length_stream[frame_command_idx];
        for (var i = end_index - 1; i >= start_index; i--) {
            idx = i * 2;
            sourceMovieClip._addTimelineChildAt(sourceMovieClip.getPotentialChildInstance(this.add_child_stream[idx]), this.add_child_stream[idx + 1] - 16383, i);
        }
    };
    Timeline.prototype.update_childs = function (target_mc, frame_command_idx) {
        var p;
        var props_start_idx;
        var props_end_index;
        var start_index = this.command_index_stream[frame_command_idx];
        var end_index = start_index + this.command_length_stream[frame_command_idx];
        var child;
        for (var i = start_index; i < end_index; i++) {
            child = target_mc.getChildAtSessionID(this.update_child_stream[i]);
            if (child) {
                // check if the child is active + not blocked by script
                this._blocked = Boolean(child.adapter && child.adapter.isBlockedByScript());
                props_start_idx = this.update_child_props_indices_stream[i];
                props_end_index = props_start_idx + this.update_child_props_length_stream[i];
                for (p = props_start_idx; p < props_end_index; p++)
                    this._functions[this.property_type_stream[p]].call(this, child, target_mc, this.property_index_stream[p]);
            }
        }
    };
    Timeline.prototype.update_mtx_all = function (child, target_mc, i) {
        if (this._blocked)
            return;
        i *= 6;
        var new_matrix = child.transform.matrix3D;
        new_matrix.rawData[0] = this.properties_stream_f32_mtx_all[i++];
        new_matrix.rawData[1] = this.properties_stream_f32_mtx_all[i++];
        new_matrix.rawData[4] = this.properties_stream_f32_mtx_all[i++];
        new_matrix.rawData[5] = this.properties_stream_f32_mtx_all[i++];
        new_matrix.rawData[12] = this.properties_stream_f32_mtx_all[i++];
        new_matrix.rawData[13] = this.properties_stream_f32_mtx_all[i];
        child.transform.invalidateComponents();
    };
    Timeline.prototype.update_colortransform = function (child, target_mc, i) {
        if (this._blocked)
            return;
        i *= 8;
        var new_ct = child.transform.colorTransform || (child.transform.colorTransform = new ColorTransform_1.ColorTransform());
        new_ct.redMultiplier = this.properties_stream_f32_ct[i++];
        new_ct.greenMultiplier = this.properties_stream_f32_ct[i++];
        new_ct.blueMultiplier = this.properties_stream_f32_ct[i++];
        new_ct.alphaMultiplier = this.properties_stream_f32_ct[i++];
        new_ct.redOffset = this.properties_stream_f32_ct[i++];
        new_ct.greenOffset = this.properties_stream_f32_ct[i++];
        new_ct.blueOffset = this.properties_stream_f32_ct[i++];
        new_ct.alphaOffset = this.properties_stream_f32_ct[i];
        child.transform.invalidateColorTransform();
    };
    Timeline.prototype.update_masks = function (child, target_mc, i) {
        // an object could have multiple groups of masks, in case a graphic clip was merged into the timeline
        // this is not implmeented in the runtime yet
        // for now, a second mask-groupd would overwrite the first one
        var mask;
        var masks = new Array();
        var numMasks = this.properties_stream_int[i++];
        //mask may not exist if a goto command moves the playhead to a point in the timeline after
        //one of the masks in a mask array has already been removed. Therefore a check is needed.
        for (var m = 0; m < numMasks; m++)
            if ((mask = target_mc.getChildAtSessionID(this.properties_stream_int[i++])))
                masks.push(mask);
        child.masks = masks;
    };
    Timeline.prototype.update_name = function (child, target_mc, i) {
        child.name = this.properties_stream_strings[i];
        target_mc.adapter.registerScriptObject(child);
    };
    Timeline.prototype.update_button_name = function (target, sourceMovieClip, i) {
        target.name = this.properties_stream_strings[i];
        // todo: creating the buttonlistenrs later should also be done, but for icycle i dont think this will cause problems
        target.addButtonListeners();
        sourceMovieClip.adapter.registerScriptObject(target);
    };
    Timeline.prototype.update_visibility = function (child, target_mc, i) {
        if (!child.adapter || !child.adapter.isVisibilityByScript())
            child.visible = Boolean(i);
    };
    Timeline.prototype.update_mtx_scale_rot = function (child, target_mc, i) {
        if (this._blocked)
            return;
        i *= 4;
        var new_matrix = child.transform.matrix3D;
        new_matrix.rawData[0] = this.properties_stream_f32_mtx_scale_rot[i++];
        new_matrix.rawData[1] = this.properties_stream_f32_mtx_scale_rot[i++];
        new_matrix.rawData[4] = this.properties_stream_f32_mtx_scale_rot[i++];
        new_matrix.rawData[5] = this.properties_stream_f32_mtx_scale_rot[i];
        child.transform.invalidateComponents();
        child.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM);
    };
    Timeline.prototype.update_mtx_pos = function (child, target_mc, i) {
        if (this._blocked)
            return;
        i *= 2;
        var new_matrix = child.transform.matrix3D;
        new_matrix.rawData[12] = this.properties_stream_f32_mtx_pos[i++];
        new_matrix.rawData[13] = this.properties_stream_f32_mtx_pos[i];
        child.transform.invalidatePosition();
    };
    Timeline.prototype.enable_maskmode = function (child, target_mc, i) {
        child.maskMode = true;
    };
    Timeline.prototype.remove_masks = function (child, target_mc, i) {
        child.masks = null;
    };
    return Timeline;
}());
exports.Timeline = Timeline;

},{"../base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","../managers/FrameScriptManager":"awayjs-display/lib/managers/FrameScriptManager","awayjs-core/lib/geom/ColorTransform":undefined}],"awayjs-display/lib/base/TouchPoint":[function(require,module,exports){
"use strict";
/**
 *
 */
var TouchPoint = (function () {
    function TouchPoint(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }
    return TouchPoint;
}());
exports.TouchPoint = TouchPoint;

},{}],"awayjs-display/lib/base/Transform":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("awayjs-core/lib/events/EventDispatcher");
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var TransformEvent_1 = require("../events/TransformEvent");
/**
 * The Transform class provides access to color adjustment properties and two-
 * or three-dimensional transformation objects that can be applied to a
 * display object. During the transformation, the color or the orientation and
 * position of a display object is adjusted(offset) from the current values
 * or coordinates to new values or coordinates. The Transform class also
 * collects data about color and two-dimensional matrix transformations that
 * are applied to a display object and all of its parent objects. You can
 * access these combined transformations through the
 * <code>concatenatedColorTransform</code> and <code>concatenatedMatrix</code>
 * properties.
 *
 * <p>To apply color transformations: create a ColorTransform object, set the
 * color adjustments using the object's methods and properties, and then
 * assign the <code>colorTransformation</code> property of the
 * <code>transform</code> property of the display object to the new
 * ColorTransformation object.</p>
 *
 * <p>To apply two-dimensional transformations: create a Matrix object, set
 * the matrix's two-dimensional transformation, and then assign the
 * <code>transform.matrix</code> property of the display object to the new
 * Matrix object.</p>
 *
 * <p>To apply three-dimensional transformations: start with a
 * three-dimensional display object. A three-dimensional display object has a
 * <code>z</code> property value other than zero. You do not need to create
 * the Matrix3D object. For all three-dimensional objects, a Matrix3D object
 * is created automatically when you assign a <code>z</code> value to a
 * display object. You can access the display object's Matrix3D object through
 * the display object's <code>transform</code> property. Using the methods of
 * the Matrix3D class, you can add to or modify the existing transformation
 * settings. Also, you can create a custom Matrix3D object, set the custom
 * Matrix3D object's transformation elements, and then assign the new Matrix3D
 * object to the display object using the <code>transform.matrix</code>
 * property.</p>
 *
 * <p>To modify a perspective projection of the stage or root object: use the
 * <code>transform.matrix</code> property of the root display object to gain
 * access to the PerspectiveProjection object. Or, apply different perspective
 * projection properties to a display object by setting the perspective
 * projection properties of the display object's parent. The child display
 * object inherits the new properties. Specifically, create a
 * PerspectiveProjection object and set its properties, then assign the
 * PerspectiveProjection object to the <code>perspectiveProjection</code>
 * property of the parent display object's <code>transform</code> property.
 * The specified projection transformation then applies to all the display
 * object's three-dimensional children.</p>
 *
 * <p>Since both PerspectiveProjection and Matrix3D objects perform
 * perspective transformations, do not assign both to a display object at the
 * same time. Use the PerspectiveProjection object for focal length and
 * projection center changes. For more control over the perspective
 * transformation, create a perspective projection Matrix3D object.</p>
 */
var Transform = (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        _super.call(this);
        this._matrix3D = new Matrix3D_1.Matrix3D();
        this._rotation = new Vector3D_1.Vector3D();
        this._skew = new Vector3D_1.Vector3D();
        this._scale = new Vector3D_1.Vector3D(1, 1, 1);
        // Cached vector of transformation components used when
        // recomposing the transform matrix in updateTransform()
        this._components = new Array(4);
        this._components[1] = this._rotation;
        this._components[2] = this._skew;
        this._components[3] = this._scale;
    }
    Object.defineProperty(Transform.prototype, "backVector", {
        /**
         *
         */
        get: function () {
            var director = Matrix3DUtils_1.Matrix3DUtils.getForward(this._matrix3D);
            director.negate();
            return director;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "colorTransform", {
        /**
         * A ColorTransform object containing values that universally adjust the
         * colors in the display object.
         *
         * @throws TypeError The colorTransform is null when being set
         */
        get: function () {
            return this._colorTransform;
        },
        set: function (val) {
            if (this._colorTransform == val)
                return;
            this._colorTransform = val;
            this.invalidateColorTransform();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "concatenatedColorTransform", {
        /**
         * A ColorTransform object representing the combined color transformations
         * applied to the display object and all of its parent objects, back to the
         * root level. If different color transformations have been applied at
         * different levels, all of those transformations are concatenated into one
         * ColorTransform object for this property.
         */
        get: function () {
            return this._concatenatedColorTransform; //TODO
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "concatenatedMatrix", {
        /**
         * A Matrix object representing the combined transformation matrixes of the
         * display object and all of its parent objects, back to the root level. If
         * different transformation matrixes have been applied at different levels,
         * all of those matrixes are concatenated into one matrix for this property.
         * Also, for resizeable SWF content running in the browser, this property
         * factors in the difference between stage coordinates and window coordinates
         * due to window resizing. Thus, the property converts local coordinates to
         * window coordinates, which may not be the same coordinate space as that of
         * the Scene.
         */
        get: function () {
            return this._concatenatedMatrix; //TODO
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "downVector", {
        /**
         *
         */
        get: function () {
            var director = Matrix3DUtils_1.Matrix3DUtils.getUp(this._matrix3D);
            director.negate();
            return director;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "forwardVector", {
        /**
         *
         */
        get: function () {
            return Matrix3DUtils_1.Matrix3DUtils.getForward(this._matrix3D);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "leftVector", {
        /**
         *
         */
        get: function () {
            var director = Matrix3DUtils_1.Matrix3DUtils.getRight(this._matrix3D);
            director.negate();
            return director;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "matrix3D", {
        /**
         * Provides access to the Matrix3D object of a three-dimensional display
         * object. The Matrix3D object represents a transformation matrix that
         * determines the display object's position and orientation. A Matrix3D
         * object can also perform perspective projection.
         *
         * <p>If the <code>matrix</code> property is set to a value(not
         * <code>null</code>), the <code>matrix3D</code> property is
         * <code>null</code>. And if the <code>matrix3D</code> property is set to a
         * value(not <code>null</code>), the <code>matrix</code> property is
         * <code>null</code>.</p>
         */
        get: function () {
            if (this._matrix3DDirty)
                this._updateMatrix3D();
            return this._matrix3D;
        },
        set: function (val) {
            for (var i = 0; i < 15; i++)
                this._matrix3D.rawData[i] = val.rawData[i];
            this.invalidateComponents();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "pixelBounds", {
        /**
         * A Rectangle object that defines the bounding rectangle of the display
         * object on the stage.
         */
        get: function () {
            return this._pixelBounds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "position", {
        /**
         * Defines the position of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
         */
        get: function () {
            return this._matrix3D.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "rightVector", {
        /**
         *
         */
        get: function () {
            return Matrix3DUtils_1.Matrix3DUtils.getRight(this.matrix3D);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "rotation", {
        /**
         * Defines the rotation of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
         */
        get: function () {
            if (this._componentsDirty)
                this._updateComponents();
            return this._rotation;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Rotates the 3d object directly to a euler angle
     *
     * @param    ax        The angle in degrees of the rotation around the x axis.
     * @param    ay        The angle in degrees of the rotation around the y axis.
     * @param    az        The angle in degrees of the rotation around the z axis.
     */
    Transform.prototype.rotateTo = function (ax, ay, az) {
        if (this._componentsDirty)
            this._updateComponents();
        this._rotation.x = ax;
        this._rotation.y = ay;
        this._rotation.z = az;
        this.invalidateMatrix3D();
    };
    Object.defineProperty(Transform.prototype, "scale", {
        /**
         * Defines the scale of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
         */
        get: function () {
            if (this._componentsDirty)
                this._updateComponents();
            return this._scale;
        },
        enumerable: true,
        configurable: true
    });
    Transform.prototype.scaleTo = function (sx, sy, sz) {
        if (this._componentsDirty)
            this._updateComponents();
        this._scale.x = sx;
        this._scale.y = sy;
        this._scale.z = sz;
        this.invalidateMatrix3D();
    };
    Object.defineProperty(Transform.prototype, "skew", {
        /**
         * Defines the scale of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
         */
        get: function () {
            if (this._componentsDirty)
                this._updateComponents();
            return this._skew;
        },
        enumerable: true,
        configurable: true
    });
    Transform.prototype.skewTo = function (sx, sy, sz) {
        if (this._componentsDirty)
            this._updateComponents();
        this._skew.x = sx;
        this._skew.y = sy;
        this._skew.z = sz;
        this.invalidateMatrix3D();
    };
    Object.defineProperty(Transform.prototype, "upVector", {
        /**
         *
         */
        get: function () {
            return Matrix3DUtils_1.Matrix3DUtils.getUp(this.matrix3D);
        },
        enumerable: true,
        configurable: true
    });
    Transform.prototype.dispose = function () {
    };
    /**
     * Returns a Matrix3D object, which can transform the space of a specified
     * display object in relation to the current display object's space. You can
     * use the <code>getRelativeMatrix3D()</code> method to move one
     * three-dimensional display object relative to another three-dimensional
     * display object.
     *
     * @param relativeTo The display object relative to which the transformation
     *                   occurs. To get a Matrix3D object relative to the stage,
     *                   set the parameter to the <code>root</code> or
     *                   <code>stage</code> object. To get the world-relative
     *                   matrix of the display object, set the parameter to a
     *                   display object that has a perspective transformation
     *                   applied to it.
     * @return A Matrix3D object that can be used to transform the space from the
     *         <code>relativeTo</code> display object to the current display
     *         object space.
     */
    Transform.prototype.getRelativeMatrix3D = function (relativeTo) {
        return new Matrix3D_1.Matrix3D(); //TODO
    };
    /**
     * Moves the 3d object forwards along it's local z axis
     *
     * @param    distance    The length of the movement
     */
    Transform.prototype.moveForward = function (distance) {
        this.translateLocal(Vector3D_1.Vector3D.Z_AXIS, distance);
    };
    /**
     * Moves the 3d object backwards along it's local z axis
     *
     * @param    distance    The length of the movement
     */
    Transform.prototype.moveBackward = function (distance) {
        this.translateLocal(Vector3D_1.Vector3D.Z_AXIS, -distance);
    };
    /**
     * Moves the 3d object backwards along it's local x axis
     *
     * @param    distance    The length of the movement
     */
    Transform.prototype.moveLeft = function (distance) {
        this.translateLocal(Vector3D_1.Vector3D.X_AXIS, -distance);
    };
    /**
     * Moves the 3d object forwards along it's local x axis
     *
     * @param    distance    The length of the movement
     */
    Transform.prototype.moveRight = function (distance) {
        this.translateLocal(Vector3D_1.Vector3D.X_AXIS, distance);
    };
    /**
     * Moves the 3d object forwards along it's local y axis
     *
     * @param    distance    The length of the movement
     */
    Transform.prototype.moveUp = function (distance) {
        this.translateLocal(Vector3D_1.Vector3D.Y_AXIS, distance);
    };
    /**
     * Moves the 3d object backwards along it's local y axis
     *
     * @param    distance    The length of the movement
     */
    Transform.prototype.moveDown = function (distance) {
        this.translateLocal(Vector3D_1.Vector3D.Y_AXIS, -distance);
    };
    /**
     * Moves the 3d object directly to a point in space
     *
     * @param    dx        The amount of movement along the local x axis.
     * @param    dy        The amount of movement along the local y axis.
     * @param    dz        The amount of movement along the local z axis.
     */
    Transform.prototype.moveTo = function (dx, dy, dz) {
        this._matrix3D.rawData[12] = dx;
        this._matrix3D.rawData[13] = dy;
        this._matrix3D.rawData[14] = dz;
        this.invalidatePosition();
    };
    /**
     * Rotates the 3d object around it's local x-axis
     *
     * @param    angle        The amount of rotation in degrees
     */
    Transform.prototype.pitch = function (angle) {
        this.rotate(Vector3D_1.Vector3D.X_AXIS, angle);
    };
    /**
     * Rotates the 3d object around it's local z-axis
     *
     * @param    angle        The amount of rotation in degrees
     */
    Transform.prototype.roll = function (angle) {
        this.rotate(Vector3D_1.Vector3D.Z_AXIS, angle);
    };
    /**
     * Rotates the 3d object around it's local y-axis
     *
     * @param    angle        The amount of rotation in degrees
     */
    Transform.prototype.yaw = function (angle) {
        this.rotate(Vector3D_1.Vector3D.Y_AXIS, angle);
    };
    /**
     * Rotates the 3d object around an axis by a defined angle
     *
     * @param    axis        The vector defining the axis of rotation
     * @param    angle        The amount of rotation in degrees
     */
    Transform.prototype.rotate = function (axis, angle) {
        this.matrix3D.prependRotation(angle, axis);
        this.invalidateComponents();
    };
    /**
     * Moves the 3d object along a vector by a defined length
     *
     * @param    axis        The vector defining the axis of movement
     * @param    distance    The length of the movement
     */
    Transform.prototype.translate = function (axis, distance) {
        var x = axis.x, y = axis.y, z = axis.z;
        var len = distance / Math.sqrt(x * x + y * y + z * z);
        this.matrix3D.appendTranslation(x * len, y * len, z * len);
        this.invalidatePosition();
    };
    /**
     * Moves the 3d object along a vector by a defined length
     *
     * @param    axis        The vector defining the axis of movement
     * @param    distance    The length of the movement
     */
    Transform.prototype.translateLocal = function (axis, distance) {
        var x = axis.x, y = axis.y, z = axis.z;
        var len = distance / Math.sqrt(x * x + y * y + z * z);
        this.matrix3D.prependTranslation(x * len, y * len, z * len);
        this.invalidatePosition();
    };
    Transform.prototype.clearMatrix3D = function () {
        this._matrix3D.identity();
        this.invalidateComponents();
    };
    Transform.prototype.clearColorTransform = function () {
        if (!this._colorTransform)
            return;
        this._colorTransform.clear();
        this.invalidateColorTransform();
    };
    /**
     * Invalidates the 3D transformation matrix, causing it to be updated upon the next request
     *
     * @private
     */
    Transform.prototype.invalidateMatrix3D = function () {
        this._matrix3DDirty = true;
        this.dispatchEvent(new TransformEvent_1.TransformEvent(TransformEvent_1.TransformEvent.INVALIDATE_MATRIX3D, this));
    };
    Transform.prototype.invalidateComponents = function () {
        this.invalidatePosition();
        this._componentsDirty = true;
    };
    /**
     *
     */
    Transform.prototype.invalidatePosition = function () {
        this._matrix3D.invalidatePosition();
        this.dispatchEvent(new TransformEvent_1.TransformEvent(TransformEvent_1.TransformEvent.INVALIDATE_MATRIX3D, this));
    };
    Transform.prototype.invalidateColorTransform = function () {
        this.dispatchEvent(new TransformEvent_1.TransformEvent(TransformEvent_1.TransformEvent.INVALIDATE_COLOR_TRANSFORM, this));
    };
    /**
     *
     */
    Transform.prototype._updateMatrix3D = function () {
        this._matrix3D.recompose(this._components);
        this._matrix3DDirty = false;
    };
    Transform.prototype._updateComponents = function () {
        var elements = this._matrix3D.decompose();
        var vec;
        vec = elements[1];
        this._rotation.x = vec.x;
        this._rotation.y = vec.y;
        this._rotation.z = vec.z;
        vec = elements[2];
        this._skew.x = vec.x;
        this._skew.y = vec.y;
        this._skew.z = vec.z;
        vec = elements[3];
        this._scale.x = vec.x;
        this._scale.y = vec.y;
        this._scale.z = vec.z;
        this._componentsDirty = false;
    };
    return Transform;
}(EventDispatcher_1.EventDispatcher));
exports.Transform = Transform;

},{"../events/TransformEvent":"awayjs-display/lib/events/TransformEvent","awayjs-core/lib/events/EventDispatcher":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/base":[function(require,module,exports){
"use strict";
var AlignmentMode_1 = require("./base/AlignmentMode");
exports.AlignmentMode = AlignmentMode_1.AlignmentMode;
var HierarchicalProperties_1 = require("./base/HierarchicalProperties");
exports.HierarchicalProperties = HierarchicalProperties_1.HierarchicalProperties;
var OrientationMode_1 = require("./base/OrientationMode");
exports.OrientationMode = OrientationMode_1.OrientationMode;
var Style_1 = require("./base/Style");
exports.Style = Style_1.Style;
var Timeline_1 = require("./base/Timeline");
exports.Timeline = Timeline_1.Timeline;
var TouchPoint_1 = require("./base/TouchPoint");
exports.TouchPoint = TouchPoint_1.TouchPoint;
var Transform_1 = require("./base/Transform");
exports.Transform = Transform_1.Transform;

},{"./base/AlignmentMode":"awayjs-display/lib/base/AlignmentMode","./base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","./base/OrientationMode":"awayjs-display/lib/base/OrientationMode","./base/Style":"awayjs-display/lib/base/Style","./base/Timeline":"awayjs-display/lib/base/Timeline","./base/TouchPoint":"awayjs-display/lib/base/TouchPoint","./base/Transform":"awayjs-display/lib/base/Transform"}],"awayjs-display/lib/bounds/AxisAlignedBoundingBox":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlaneClassification_1 = require("awayjs-core/lib/geom/PlaneClassification");
var ElementsType_1 = require("../graphics/ElementsType");
var BoundingVolumeBase_1 = require("../bounds/BoundingVolumeBase");
var PrimitiveCubePrefab_1 = require("../prefabs/PrimitiveCubePrefab");
/**
 * AxisAlignedBoundingBox represents a bounding box volume that has its planes aligned to the local coordinate axes of the bounded object.
 * This is useful for most sprites.
 */
var AxisAlignedBoundingBox = (function (_super) {
    __extends(AxisAlignedBoundingBox, _super);
    /**
     * Creates a new <code>AxisAlignedBoundingBox</code> object.
     */
    function AxisAlignedBoundingBox(entity) {
        _super.call(this, entity);
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._width = 0;
        this._height = 0;
        this._depth = 0;
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ = 0;
        this._halfExtentsX = 0;
        this._halfExtentsY = 0;
        this._halfExtentsZ = 0;
    }
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.nullify = function () {
        this._x = this._y = this._z = 0;
        this._width = this._height = this._depth = 0;
        this._centerX = this._centerY = this._centerZ = 0;
        this._halfExtentsX = this._halfExtentsY = this._halfExtentsZ = 0;
    };
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.isInFrustum = function (planes, numPlanes) {
        if (this._pInvalidated)
            this._pUpdate();
        for (var i = 0; i < numPlanes; ++i) {
            var plane = planes[i];
            var a = plane.a;
            var b = plane.b;
            var c = plane.c;
            var flippedExtentX = a < 0 ? -this._halfExtentsX : this._halfExtentsX;
            var flippedExtentY = b < 0 ? -this._halfExtentsY : this._halfExtentsY;
            var flippedExtentZ = c < 0 ? -this._halfExtentsZ : this._halfExtentsZ;
            var projDist = a * (this._centerX + flippedExtentX) + b * (this._centerY + flippedExtentY) + c * (this._centerZ + flippedExtentZ) - plane.d;
            if (projDist < 0)
                return false;
        }
        return true;
    };
    AxisAlignedBoundingBox.prototype.rayIntersection = function (position, direction, targetNormal) {
        if (this._pInvalidated)
            this._pUpdate();
        return this._box.rayIntersection(position, direction, targetNormal);
    };
    AxisAlignedBoundingBox.prototype.classifyToPlane = function (plane) {
        var a = plane.a;
        var b = plane.b;
        var c = plane.c;
        var centerDistance = a * this._centerX + b * this._centerY + c * this._centerZ - plane.d;
        if (a < 0)
            a = -a;
        if (b < 0)
            b = -b;
        if (c < 0)
            c = -c;
        var boundOffset = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
        return centerDistance > boundOffset ? PlaneClassification_1.PlaneClassification.FRONT : centerDistance < -boundOffset ? PlaneClassification_1.PlaneClassification.BACK : PlaneClassification_1.PlaneClassification.INTERSECT;
    };
    AxisAlignedBoundingBox.prototype._pUpdate = function () {
        _super.prototype._pUpdate.call(this);
        this._box = this._pEntity.getBox();
        var matrix = this._pEntity.sceneTransform;
        var hx = this._box.width / 2;
        var hy = this._box.height / 2;
        var hz = this._box.depth / 2;
        var cx = this._box.x + hx;
        var cy = this._box.y + hy;
        var cz = this._box.z + hz;
        var raw = matrix.rawData;
        var m11 = raw[0], m12 = raw[4], m13 = raw[8], m14 = raw[12];
        var m21 = raw[1], m22 = raw[5], m23 = raw[9], m24 = raw[13];
        var m31 = raw[2], m32 = raw[6], m33 = raw[10], m34 = raw[14];
        this._centerX = cx * m11 + cy * m12 + cz * m13 + m14;
        this._centerY = cx * m21 + cy * m22 + cz * m23 + m24;
        this._centerZ = cx * m31 + cy * m32 + cz * m33 + m34;
        this._halfExtentsX = Math.abs(hx * m11 + hy * m12 + hz * m13);
        this._halfExtentsY = Math.abs(hx * m21 + hy * m22 + hz * m23);
        this._halfExtentsZ = Math.abs(hx * m31 + hy * m32 + hz * m33);
        if (this._prefab) {
            this._prefab.width = this._box.width;
            this._prefab.height = this._box.height;
            this._prefab.depth = this._box.depth;
            this._pBoundsPrimitive.transform.matrix3D = matrix;
        }
        this._width = this._halfExtentsX * 2;
        this._height = this._halfExtentsY * 2;
        this._depth = this._halfExtentsZ * 2;
        this._x = this._centerX - this._halfExtentsX;
        this._y = this._centerY - this._halfExtentsY;
        this._z = this._centerZ - this._halfExtentsZ;
    };
    AxisAlignedBoundingBox.prototype._pCreateBoundsPrimitive = function () {
        this._prefab = new PrimitiveCubePrefab_1.PrimitiveCubePrefab(null, ElementsType_1.ElementsType.LINE);
        return this._prefab.getNewObject();
    };
    return AxisAlignedBoundingBox;
}(BoundingVolumeBase_1.BoundingVolumeBase));
exports.AxisAlignedBoundingBox = AxisAlignedBoundingBox;

},{"../bounds/BoundingVolumeBase":"awayjs-display/lib/bounds/BoundingVolumeBase","../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitiveCubePrefab":"awayjs-display/lib/prefabs/PrimitiveCubePrefab","awayjs-core/lib/geom/PlaneClassification":undefined}],"awayjs-display/lib/bounds/BoundingSphere":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlaneClassification_1 = require("awayjs-core/lib/geom/PlaneClassification");
var ElementsType_1 = require("../graphics/ElementsType");
var BoundingVolumeBase_1 = require("../bounds/BoundingVolumeBase");
var PrimitiveSpherePrefab_1 = require("../prefabs/PrimitiveSpherePrefab");
var BoundingSphere = (function (_super) {
    __extends(BoundingSphere, _super);
    function BoundingSphere(entity) {
        _super.call(this, entity);
        this._radius = 0;
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ = 0;
    }
    BoundingSphere.prototype.nullify = function () {
        this._centerX = this._centerY = this._centerZ = 0;
        this._radius = 0;
    };
    BoundingSphere.prototype.isInFrustum = function (planes, numPlanes) {
        if (this._pInvalidated)
            this._pUpdate();
        for (var i = 0; i < numPlanes; ++i) {
            var plane = planes[i];
            var flippedExtentX = plane.a < 0 ? -this._radius : this._radius;
            var flippedExtentY = plane.b < 0 ? -this._radius : this._radius;
            var flippedExtentZ = plane.c < 0 ? -this._radius : this._radius;
            var projDist = plane.a * (this._centerX + flippedExtentX) + plane.b * (this._centerY + flippedExtentY) + plane.c * (this._centerZ + flippedExtentZ) - plane.d;
            if (projDist < 0) {
                return false;
            }
        }
        return true;
    };
    BoundingSphere.prototype.rayIntersection = function (position, direction, targetNormal) {
        if (this._pInvalidated)
            this._pUpdate();
        return this._sphere.rayIntersection(position, direction, targetNormal);
    };
    //@override
    BoundingSphere.prototype.classifyToPlane = function (plane) {
        var a = plane.a;
        var b = plane.b;
        var c = plane.c;
        var dd = a * this._centerX + b * this._centerY + c * this._centerZ - plane.d;
        if (a < 0)
            a = -a;
        if (b < 0)
            b = -b;
        if (c < 0)
            c = -c;
        var rr = (a + b + c) * this._radius;
        return dd > rr ? PlaneClassification_1.PlaneClassification.FRONT : dd < -rr ? PlaneClassification_1.PlaneClassification.BACK : PlaneClassification_1.PlaneClassification.INTERSECT;
    };
    BoundingSphere.prototype._pUpdate = function () {
        _super.prototype._pUpdate.call(this);
        this._sphere = this._pEntity.getSphere();
        var matrix = this._pEntity.sceneTransform;
        var cx = this._sphere.x;
        var cy = this._sphere.y;
        var cz = this._sphere.z;
        var r = this._sphere.radius;
        var raw = matrix.rawData;
        var m11 = raw[0], m12 = raw[4], m13 = raw[8], m14 = raw[12];
        var m21 = raw[1], m22 = raw[5], m23 = raw[9], m24 = raw[13];
        var m31 = raw[2], m32 = raw[6], m33 = raw[10], m34 = raw[14];
        this._centerX = cx * m11 + cy * m12 + cz * m13 + m14;
        this._centerY = cx * m21 + cy * m22 + cz * m23 + m24;
        this._centerZ = cx * m31 + cy * m32 + cz * m33 + m34;
        var rx = m11 + m12 + m13;
        var ry = m21 + m22 + m23;
        var rz = m31 + m32 + m33;
        this._radius = r * Math.sqrt((rx * rx + ry * ry + rz * rz) / 3);
        if (this._prefab) {
            this._prefab.radius = r;
            this._pBoundsPrimitive.x = cx;
            this._pBoundsPrimitive.y = cy;
            this._pBoundsPrimitive.z = cz;
            this._pBoundsPrimitive.transform.matrix3D = matrix;
        }
    };
    BoundingSphere.prototype._pCreateBoundsPrimitive = function () {
        this._prefab = new PrimitiveSpherePrefab_1.PrimitiveSpherePrefab(null, ElementsType_1.ElementsType.LINE);
        return this._prefab.getNewObject();
    };
    return BoundingSphere;
}(BoundingVolumeBase_1.BoundingVolumeBase));
exports.BoundingSphere = BoundingSphere;

},{"../bounds/BoundingVolumeBase":"awayjs-display/lib/bounds/BoundingVolumeBase","../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitiveSpherePrefab":"awayjs-display/lib/prefabs/PrimitiveSpherePrefab","awayjs-core/lib/geom/PlaneClassification":undefined}],"awayjs-display/lib/bounds/BoundingVolumeBase":[function(require,module,exports){
"use strict";
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var BoundingVolumeBase = (function () {
    function BoundingVolumeBase(entity) {
        this._pInvalidated = true;
        this._pEntity = entity;
    }
    BoundingVolumeBase.prototype.dispose = function () {
        this._pEntity = null;
        this._pBoundsPrimitive = null;
    };
    Object.defineProperty(BoundingVolumeBase.prototype, "boundsPrimitive", {
        get: function () {
            if (this._pBoundsPrimitive == null) {
                this._pBoundsPrimitive = this._pCreateBoundsPrimitive();
                this._pInvalidated = true;
            }
            if (this._pInvalidated)
                this._pUpdate();
            return this._pBoundsPrimitive;
        },
        enumerable: true,
        configurable: true
    });
    BoundingVolumeBase.prototype.nullify = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    BoundingVolumeBase.prototype.isInFrustum = function (planes, numPlanes) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    BoundingVolumeBase.prototype.clone = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    BoundingVolumeBase.prototype.rayIntersection = function (position, direction, targetNormal) {
        return -1;
    };
    BoundingVolumeBase.prototype.classifyToPlane = function (plane) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    BoundingVolumeBase.prototype._pUpdate = function () {
        this._pInvalidated = false;
    };
    BoundingVolumeBase.prototype.invalidate = function () {
        this._pInvalidated = true;
    };
    BoundingVolumeBase.prototype._pCreateBoundsPrimitive = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    return BoundingVolumeBase;
}());
exports.BoundingVolumeBase = BoundingVolumeBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined}],"awayjs-display/lib/bounds/BoundsType":[function(require,module,exports){
"use strict";
/**
 *
 */
var BoundsType = (function () {
    function BoundsType() {
    }
    /**
     *
     */
    BoundsType.SPHERE = "sphere";
    /**
     *
     */
    BoundsType.AXIS_ALIGNED_BOX = "axisAlignedBox";
    /**
     *
     */
    BoundsType.NULL = "null";
    return BoundsType;
}());
exports.BoundsType = BoundsType;

},{}],"awayjs-display/lib/bounds/NullBounds":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlaneClassification_1 = require("awayjs-core/lib/geom/PlaneClassification");
var BoundingVolumeBase_1 = require("../bounds/BoundingVolumeBase");
var NullBounds = (function (_super) {
    __extends(NullBounds, _super);
    function NullBounds(alwaysIn) {
        if (alwaysIn === void 0) { alwaysIn = true; }
        _super.call(this, null);
        this._alwaysIn = alwaysIn;
    }
    //@override
    NullBounds.prototype.clone = function () {
        return new NullBounds(this._alwaysIn);
    };
    //@override
    NullBounds.prototype.isInFrustum = function (planes, numPlanes) {
        return this._alwaysIn;
    };
    NullBounds.prototype.classifyToPlane = function (plane) {
        return PlaneClassification_1.PlaneClassification.INTERSECT;
    };
    return NullBounds;
}(BoundingVolumeBase_1.BoundingVolumeBase));
exports.NullBounds = NullBounds;

},{"../bounds/BoundingVolumeBase":"awayjs-display/lib/bounds/BoundingVolumeBase","awayjs-core/lib/geom/PlaneClassification":undefined}],"awayjs-display/lib/bounds":[function(require,module,exports){
"use strict";
var AxisAlignedBoundingBox_1 = require("./bounds/AxisAlignedBoundingBox");
exports.AxisAlignedBoundingBox = AxisAlignedBoundingBox_1.AxisAlignedBoundingBox;
var BoundingSphere_1 = require("./bounds/BoundingSphere");
exports.BoundingSphere = BoundingSphere_1.BoundingSphere;
var BoundingVolumeBase_1 = require("./bounds/BoundingVolumeBase");
exports.BoundingVolumeBase = BoundingVolumeBase_1.BoundingVolumeBase;
var BoundsType_1 = require("./bounds/BoundsType");
exports.BoundsType = BoundsType_1.BoundsType;
var NullBounds_1 = require("./bounds/NullBounds");
exports.NullBounds = NullBounds_1.NullBounds;

},{"./bounds/AxisAlignedBoundingBox":"awayjs-display/lib/bounds/AxisAlignedBoundingBox","./bounds/BoundingSphere":"awayjs-display/lib/bounds/BoundingSphere","./bounds/BoundingVolumeBase":"awayjs-display/lib/bounds/BoundingVolumeBase","./bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","./bounds/NullBounds":"awayjs-display/lib/bounds/NullBounds"}],"awayjs-display/lib/controllers/ControllerBase":[function(require,module,exports){
"use strict";
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var ControllerBase = (function () {
    function ControllerBase(targetObject) {
        if (targetObject === void 0) { targetObject = null; }
        this._pAutoUpdate = true;
        this.targetObject = targetObject;
    }
    ControllerBase.prototype.pNotifyUpdate = function () {
        if (this._pTargetObject)
            this._pTargetObject.invalidatePartitionBounds();
    };
    Object.defineProperty(ControllerBase.prototype, "targetObject", {
        get: function () {
            return this._pTargetObject;
        },
        set: function (val) {
            if (this._pTargetObject == val)
                return;
            if (this._pTargetObject && this._pAutoUpdate)
                this._pTargetObject._iController = null;
            this._pTargetObject = val;
            if (this._pTargetObject && this._pAutoUpdate)
                this._pTargetObject._iController = this;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "autoUpdate", {
        get: function () {
            return this._pAutoUpdate;
        },
        set: function (val) {
            if (this._pAutoUpdate == val)
                return;
            this._pAutoUpdate = val;
            if (this._pTargetObject) {
                if (this._pAutoUpdate)
                    this._pTargetObject._iController = this;
                else
                    this._pTargetObject._iController = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    ControllerBase.prototype.update = function (interpolate) {
        if (interpolate === void 0) { interpolate = true; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ControllerBase.prototype.updateController = function () {
        if (this._pControllerDirty && this._pAutoUpdate) {
            this._pControllerDirty = false;
            this.pNotifyUpdate();
        }
    };
    return ControllerBase;
}());
exports.ControllerBase = ControllerBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined}],"awayjs-display/lib/controllers/FirstPersonController":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var ControllerBase_1 = require("../controllers/ControllerBase");
/**
 * Extended camera used to hover round a specified target object.
 *
 * @see    away3d.containers.View3D
 */
var FirstPersonController = (function (_super) {
    __extends(FirstPersonController, _super);
    /**
     * Creates a new <code>HoverController</code> object.
     */
    function FirstPersonController(targetObject, panAngle, tiltAngle, minTiltAngle, maxTiltAngle, steps, wrapPanAngle) {
        if (targetObject === void 0) { targetObject = null; }
        if (panAngle === void 0) { panAngle = 0; }
        if (tiltAngle === void 0) { tiltAngle = 90; }
        if (minTiltAngle === void 0) { minTiltAngle = -90; }
        if (maxTiltAngle === void 0) { maxTiltAngle = 90; }
        if (steps === void 0) { steps = 8; }
        if (wrapPanAngle === void 0) { wrapPanAngle = false; }
        _super.call(this, targetObject);
        this._iCurrentPanAngle = 0;
        this._iCurrentTiltAngle = 90;
        this._panAngle = 0;
        this._tiltAngle = 90;
        this._minTiltAngle = -90;
        this._maxTiltAngle = 90;
        this._steps = 8;
        this._walkIncrement = 0;
        this._strafeIncrement = 0;
        this._wrapPanAngle = false;
        this.fly = false;
        this.panAngle = panAngle;
        this.tiltAngle = tiltAngle;
        this.minTiltAngle = minTiltAngle;
        this.maxTiltAngle = maxTiltAngle;
        this.steps = steps;
        this.wrapPanAngle = wrapPanAngle;
        //values passed in contrustor are applied immediately
        this._iCurrentPanAngle = this._panAngle;
        this._iCurrentTiltAngle = this._tiltAngle;
    }
    Object.defineProperty(FirstPersonController.prototype, "steps", {
        /**
         * Fractional step taken each time the <code>hover()</code> method is called. Defaults to 8.
         *
         * Affects the speed at which the <code>tiltAngle</code> and <code>panAngle</code> resolve to their targets.
         *
         * @see    #tiltAngle
         * @see    #panAngle
         */
        get: function () {
            return this._steps;
        },
        set: function (val) {
            val = (val < 1) ? 1 : val;
            if (this._steps == val)
                return;
            this._steps = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirstPersonController.prototype, "panAngle", {
        /**
         * Rotation of the camera in degrees around the y axis. Defaults to 0.
         */
        get: function () {
            return this._panAngle;
        },
        set: function (val) {
            if (this._panAngle == val)
                return;
            this._panAngle = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirstPersonController.prototype, "tiltAngle", {
        /**
         * Elevation angle of the camera in degrees. Defaults to 90.
         */
        get: function () {
            return this._tiltAngle;
        },
        set: function (val) {
            val = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, val));
            if (this._tiltAngle == val)
                return;
            this._tiltAngle = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirstPersonController.prototype, "minTiltAngle", {
        /**
         * Minimum bounds for the <code>tiltAngle</code>. Defaults to -90.
         *
         * @see    #tiltAngle
         */
        get: function () {
            return this._minTiltAngle;
        },
        set: function (val) {
            if (this._minTiltAngle == val)
                return;
            this._minTiltAngle = val;
            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirstPersonController.prototype, "maxTiltAngle", {
        /**
         * Maximum bounds for the <code>tiltAngle</code>. Defaults to 90.
         *
         * @see    #tiltAngle
         */
        get: function () {
            return this._maxTiltAngle;
        },
        set: function (val) {
            if (this._maxTiltAngle == val)
                return;
            this._maxTiltAngle = val;
            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirstPersonController.prototype, "wrapPanAngle", {
        /**
         * Defines whether the value of the pan angle wraps when over 360 degrees or under 0 degrees. Defaults to false.
         */
        get: function () {
            return this._wrapPanAngle;
        },
        set: function (val) {
            if (this._wrapPanAngle == val)
                return;
            this._wrapPanAngle = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the current tilt angle and pan angle values.
     *
     * Values are calculated using the defined <code>tiltAngle</code>, <code>panAngle</code> and <code>steps</code> variables.
     *
     * @param interpolate   If the update to a target pan- or tiltAngle is interpolated. Default is true.
     *
     * @see    #tiltAngle
     * @see    #panAngle
     * @see    #steps
     */
    FirstPersonController.prototype.update = function (interpolate) {
        if (interpolate === void 0) { interpolate = true; }
        if (this._tiltAngle != this._iCurrentTiltAngle || this._panAngle != this._iCurrentPanAngle) {
            this._pControllerDirty = true;
            if (this._wrapPanAngle) {
                if (this._panAngle < 0) {
                    this._iCurrentPanAngle += this._panAngle % 360 + 360 - this._panAngle;
                    this._panAngle = this._panAngle % 360 + 360;
                }
                else {
                    this._iCurrentPanAngle += this._panAngle % 360 - this._panAngle;
                    this._panAngle = this._panAngle % 360;
                }
                while (this._panAngle - this._iCurrentPanAngle < -180)
                    this._iCurrentPanAngle -= 360;
                while (this._panAngle - this._iCurrentPanAngle > 180)
                    this._iCurrentPanAngle += 360;
            }
            if (interpolate) {
                this._iCurrentTiltAngle += (this._tiltAngle - this._iCurrentTiltAngle) / (this.steps + 1);
                this._iCurrentPanAngle += (this._panAngle - this._iCurrentPanAngle) / (this.steps + 1);
            }
            else {
                this._iCurrentTiltAngle = this._tiltAngle;
                this._iCurrentPanAngle = this._panAngle;
            }
            //snap coords if angle differences are close
            if ((Math.abs(this.tiltAngle - this._iCurrentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._iCurrentPanAngle) < 0.01)) {
                this._iCurrentTiltAngle = this._tiltAngle;
                this._iCurrentPanAngle = this._panAngle;
            }
        }
        this.targetObject.rotationX = this._iCurrentTiltAngle;
        this.targetObject.rotationY = this._iCurrentPanAngle;
        if (this._walkIncrement) {
            if (this.fly) {
                this.targetObject.transform.moveForward(this._walkIncrement);
            }
            else {
                this.targetObject.x += this._walkIncrement * Math.sin(this._panAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
                this.targetObject.z += this._walkIncrement * Math.cos(this._panAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
            }
            this._walkIncrement = 0;
        }
        if (this._strafeIncrement) {
            this.targetObject.transform.moveRight(this._strafeIncrement);
            this._strafeIncrement = 0;
        }
    };
    FirstPersonController.prototype.incrementWalk = function (val) {
        if (val == 0)
            return;
        this._walkIncrement += val;
        this.pNotifyUpdate();
    };
    FirstPersonController.prototype.incrementStrafe = function (val) {
        if (val == 0)
            return;
        this._strafeIncrement += val;
        this.pNotifyUpdate();
    };
    return FirstPersonController;
}(ControllerBase_1.ControllerBase));
exports.FirstPersonController = FirstPersonController;

},{"../controllers/ControllerBase":"awayjs-display/lib/controllers/ControllerBase","awayjs-core/lib/geom/MathConsts":undefined}],"awayjs-display/lib/controllers/FollowController":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HoverController_1 = require("../controllers/HoverController");
/**
 * Controller used to follow behind an object on the XZ plane, with an optional
 * elevation (tiltAngle).
 *
 * @see    away3d.containers.View3D
 */
var FollowController = (function (_super) {
    __extends(FollowController, _super);
    function FollowController(targetObject, lookAtObject, tiltAngle, distance) {
        if (targetObject === void 0) { targetObject = null; }
        if (lookAtObject === void 0) { lookAtObject = null; }
        if (tiltAngle === void 0) { tiltAngle = 45; }
        if (distance === void 0) { distance = 700; }
        _super.call(this, targetObject, lookAtObject, 0, tiltAngle, distance);
    }
    FollowController.prototype.update = function (interpolate) {
        if (interpolate === void 0) { interpolate = true; }
        if (!this.lookAtObject)
            return;
        this.panAngle = this._pLookAtObject.rotationY - 180;
        _super.prototype.update.call(this);
    };
    return FollowController;
}(HoverController_1.HoverController));
exports.FollowController = FollowController;

},{"../controllers/HoverController":"awayjs-display/lib/controllers/HoverController"}],"awayjs-display/lib/controllers/HoverController":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var LookAtController_1 = require("../controllers/LookAtController");
/**
 * Extended camera used to hover round a specified target object.
 *
 * @see    away.containers.View
 */
var HoverController = (function (_super) {
    __extends(HoverController, _super);
    /**
     * Creates a new <code>HoverController</code> object.
     */
    function HoverController(targetObject, lookAtObject, panAngle, tiltAngle, distance, minTiltAngle, maxTiltAngle, minPanAngle, maxPanAngle, steps, yFactor, wrapPanAngle) {
        if (targetObject === void 0) { targetObject = null; }
        if (lookAtObject === void 0) { lookAtObject = null; }
        if (panAngle === void 0) { panAngle = 0; }
        if (tiltAngle === void 0) { tiltAngle = 90; }
        if (distance === void 0) { distance = 1000; }
        if (minTiltAngle === void 0) { minTiltAngle = -90; }
        if (maxTiltAngle === void 0) { maxTiltAngle = 90; }
        if (minPanAngle === void 0) { minPanAngle = null; }
        if (maxPanAngle === void 0) { maxPanAngle = null; }
        if (steps === void 0) { steps = 8; }
        if (yFactor === void 0) { yFactor = 2; }
        if (wrapPanAngle === void 0) { wrapPanAngle = false; }
        _super.call(this, targetObject, lookAtObject);
        this._iCurrentPanAngle = 0;
        this._iCurrentTiltAngle = 90;
        this._panAngle = 0;
        this._tiltAngle = 90;
        this._distance = 1000;
        this._minPanAngle = -Infinity;
        this._maxPanAngle = Infinity;
        this._minTiltAngle = -90;
        this._maxTiltAngle = 90;
        this._steps = 8;
        this._yFactor = 2;
        this._wrapPanAngle = false;
        this._upAxis = new Vector3D_1.Vector3D();
        this.distance = distance;
        this.panAngle = panAngle;
        this.tiltAngle = tiltAngle;
        this.minPanAngle = (minPanAngle != null) ? minPanAngle : -Infinity;
        this.maxPanAngle = (maxPanAngle != null) ? maxPanAngle : Infinity;
        this.minTiltAngle = minTiltAngle;
        this.maxTiltAngle = maxTiltAngle;
        this.steps = steps;
        this.yFactor = yFactor;
        this.wrapPanAngle = wrapPanAngle;
        //values passed in contrustor are applied immediately
        this._iCurrentPanAngle = this._panAngle;
        this._iCurrentTiltAngle = this._tiltAngle;
    }
    Object.defineProperty(HoverController.prototype, "steps", {
        /**
         * Fractional step taken each time the <code>hover()</code> method is called. Defaults to 8.
         *
         * Affects the speed at which the <code>tiltAngle</code> and <code>panAngle</code> resolve to their targets.
         *
         * @see    #tiltAngle
         * @see    #panAngle
         */
        get: function () {
            return this._steps;
        },
        set: function (val) {
            val = (val < 1) ? 1 : val;
            if (this._steps == val)
                return;
            this._steps = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "panAngle", {
        /**
         * Rotation of the camera in degrees around the y axis. Defaults to 0.
         */
        get: function () {
            return this._panAngle;
        },
        set: function (val) {
            val = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, val));
            if (this._panAngle == val)
                return;
            this._panAngle = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "tiltAngle", {
        /**
         * Elevation angle of the camera in degrees. Defaults to 90.
         */
        get: function () {
            return this._tiltAngle;
        },
        set: function (val) {
            val = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, val));
            if (this._tiltAngle == val)
                return;
            this._tiltAngle = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "distance", {
        /**
         * Distance between the camera and the specified target. Defaults to 1000.
         */
        get: function () {
            return this._distance;
        },
        set: function (val) {
            if (this._distance == val)
                return;
            this._distance = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "minPanAngle", {
        /**
         * Minimum bounds for the <code>panAngle</code>. Defaults to -Infinity.
         *
         * @see    #panAngle
         */
        get: function () {
            return this._minPanAngle;
        },
        set: function (val) {
            if (this._minPanAngle == val)
                return;
            this._minPanAngle = val;
            this.panAngle = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, this._panAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "maxPanAngle", {
        /**
         * Maximum bounds for the <code>panAngle</code>. Defaults to Infinity.
         *
         * @see    #panAngle
         */
        get: function () {
            return this._maxPanAngle;
        },
        set: function (val) {
            if (this._maxPanAngle == val)
                return;
            this._maxPanAngle = val;
            this.panAngle = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, this._panAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "minTiltAngle", {
        /**
         * Minimum bounds for the <code>tiltAngle</code>. Defaults to -90.
         *
         * @see    #tiltAngle
         */
        get: function () {
            return this._minTiltAngle;
        },
        set: function (val) {
            if (this._minTiltAngle == val)
                return;
            this._minTiltAngle = val;
            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "maxTiltAngle", {
        /**
         * Maximum bounds for the <code>tiltAngle</code>. Defaults to 90.
         *
         * @see    #tiltAngle
         */
        get: function () {
            return this._maxTiltAngle;
        },
        set: function (val) {
            if (this._maxTiltAngle == val)
                return;
            this._maxTiltAngle = val;
            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "yFactor", {
        /**
         * Fractional difference in distance between the horizontal camera orientation and vertical camera orientation. Defaults to 2.
         *
         * @see    #distance
         */
        get: function () {
            return this._yFactor;
        },
        set: function (val) {
            if (this._yFactor == val)
                return;
            this._yFactor = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HoverController.prototype, "wrapPanAngle", {
        /**
         * Defines whether the value of the pan angle wraps when over 360 degrees or under 0 degrees. Defaults to false.
         */
        get: function () {
            return this._wrapPanAngle;
        },
        set: function (val) {
            if (this._wrapPanAngle == val)
                return;
            this._wrapPanAngle = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the current tilt angle and pan angle values.
     *
     * Values are calculated using the defined <code>tiltAngle</code>, <code>panAngle</code> and <code>steps</code> variables.
     *
     * @param interpolate   If the update to a target pan- or tiltAngle is interpolated. Default is true.
     *
     * @see    #tiltAngle
     * @see    #panAngle
     * @see    #steps
     */
    HoverController.prototype.update = function (interpolate) {
        if (interpolate === void 0) { interpolate = true; }
        if (this._tiltAngle != this._iCurrentTiltAngle || this._panAngle != this._iCurrentPanAngle) {
            this._pControllerDirty = true;
            if (this._wrapPanAngle) {
                if (this._panAngle < 0) {
                    this._iCurrentPanAngle += this._panAngle % 360 + 360 - this._panAngle;
                    this._panAngle = this._panAngle % 360 + 360;
                }
                else {
                    this._iCurrentPanAngle += this._panAngle % 360 - this._panAngle;
                    this._panAngle = this._panAngle % 360;
                }
                while (this._panAngle - this._iCurrentPanAngle < -180)
                    this._iCurrentPanAngle -= 360;
                while (this._panAngle - this._iCurrentPanAngle > 180)
                    this._iCurrentPanAngle += 360;
            }
            if (interpolate) {
                this._iCurrentTiltAngle += (this._tiltAngle - this._iCurrentTiltAngle) / (this.steps + 1);
                this._iCurrentPanAngle += (this._panAngle - this._iCurrentPanAngle) / (this.steps + 1);
            }
            else {
                this._iCurrentPanAngle = this._panAngle;
                this._iCurrentTiltAngle = this._tiltAngle;
            }
            //snap coords if angle differences are close
            if ((Math.abs(this.tiltAngle - this._iCurrentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._iCurrentPanAngle) < 0.01)) {
                this._iCurrentTiltAngle = this._tiltAngle;
                this._iCurrentPanAngle = this._panAngle;
            }
        }
        var pos = (this.lookAtObject) ? this.lookAtObject.transform.position : (this.lookAtPosition) ? this.lookAtPosition : this._pOrigin;
        this.targetObject.x = pos.x + this.distance * Math.sin(this._iCurrentPanAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS) * Math.cos(this._iCurrentTiltAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
        this.targetObject.y = pos.y + this.distance * Math.sin(this._iCurrentTiltAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS) * this.yFactor;
        this.targetObject.z = pos.z + this.distance * Math.cos(this._iCurrentPanAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS) * Math.cos(this._iCurrentTiltAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
        this._upAxis.x = -Math.sin(this._iCurrentPanAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS) * Math.sin(this._iCurrentTiltAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
        this._upAxis.y = Math.cos(this._iCurrentTiltAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
        this._upAxis.z = -Math.cos(this._iCurrentPanAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS) * Math.sin(this._iCurrentTiltAngle * MathConsts_1.MathConsts.DEGREES_TO_RADIANS);
        if (this._pTargetObject) {
            if (this._pLookAtPosition)
                this._pTargetObject.lookAt(this._pLookAtPosition, this._upAxis);
            else if (this._pLookAtObject)
                this._pTargetObject.lookAt(this._pLookAtObject.scene ? this._pLookAtObject.scenePosition : this._pLookAtObject.transform.position, this._upAxis);
        }
    };
    return HoverController;
}(LookAtController_1.LookAtController));
exports.HoverController = HoverController;

},{"../controllers/LookAtController":"awayjs-display/lib/controllers/LookAtController","awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/controllers/LookAtController":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var ControllerBase_1 = require("../controllers/ControllerBase");
var DisplayObjectEvent_1 = require("../events/DisplayObjectEvent");
var LookAtController = (function (_super) {
    __extends(LookAtController, _super);
    function LookAtController(targetObject, lookAtObject) {
        var _this = this;
        if (targetObject === void 0) { targetObject = null; }
        if (lookAtObject === void 0) { lookAtObject = null; }
        _super.call(this, targetObject);
        this._pOrigin = new Vector3D_1.Vector3D(0.0, 0.0, 0.0);
        this._onLookAtObjectChangedDelegate = function (event) { return _this.onLookAtObjectChanged(event); };
        if (lookAtObject)
            this.lookAtObject = lookAtObject;
        else
            this.lookAtPosition = new Vector3D_1.Vector3D();
    }
    Object.defineProperty(LookAtController.prototype, "lookAtPosition", {
        get: function () {
            return this._pLookAtPosition;
        },
        set: function (val) {
            if (this._pLookAtObject) {
                this._pLookAtObject.removeEventListener(DisplayObjectEvent_1.DisplayObjectEvent.SCENETRANSFORM_CHANGED, this._onLookAtObjectChangedDelegate);
                this._pLookAtObject = null;
            }
            this._pLookAtPosition = val;
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LookAtController.prototype, "lookAtObject", {
        get: function () {
            return this._pLookAtObject;
        },
        set: function (val) {
            if (this._pLookAtPosition)
                this._pLookAtPosition = null;
            if (this._pLookAtObject == val)
                return;
            if (this._pLookAtObject)
                this._pLookAtObject.removeEventListener(DisplayObjectEvent_1.DisplayObjectEvent.SCENETRANSFORM_CHANGED, this._onLookAtObjectChangedDelegate);
            this._pLookAtObject = val;
            if (this._pLookAtObject)
                this._pLookAtObject.addEventListener(DisplayObjectEvent_1.DisplayObjectEvent.SCENETRANSFORM_CHANGED, this._onLookAtObjectChangedDelegate);
            this.pNotifyUpdate();
        },
        enumerable: true,
        configurable: true
    });
    //@override
    LookAtController.prototype.update = function (interpolate) {
        if (interpolate === void 0) { interpolate = true; }
        if (this._pTargetObject) {
            if (this._pLookAtPosition)
                this._pTargetObject.lookAt(this._pLookAtPosition);
            else if (this._pLookAtObject)
                this._pTargetObject.lookAt(this._pLookAtObject.scene ? this._pLookAtObject.scenePosition : this._pLookAtObject.transform.position);
        }
    };
    LookAtController.prototype.onLookAtObjectChanged = function (event) {
        this.pNotifyUpdate();
    };
    return LookAtController;
}(ControllerBase_1.ControllerBase));
exports.LookAtController = LookAtController;

},{"../controllers/ControllerBase":"awayjs-display/lib/controllers/ControllerBase","../events/DisplayObjectEvent":"awayjs-display/lib/events/DisplayObjectEvent","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/controllers/SpringController":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var LookAtController_1 = require("../controllers/LookAtController");
/**
 * Uses spring physics to animate the target object towards a position that is
 * defined as the lookAtTarget object's position plus the vector defined by the
 * positionOffset property.
 */
var SpringController = (function (_super) {
    __extends(SpringController, _super);
    function SpringController(targetObject, lookAtObject, stiffness, mass, damping) {
        if (targetObject === void 0) { targetObject = null; }
        if (lookAtObject === void 0) { lookAtObject = null; }
        if (stiffness === void 0) { stiffness = 1; }
        if (mass === void 0) { mass = 40; }
        if (damping === void 0) { damping = 4; }
        _super.call(this, targetObject, lookAtObject);
        /**
         * Offset of spring center from target in target object space, ie: Where the camera should ideally be in the target object space.
         */
        this.positionOffset = new Vector3D_1.Vector3D(0, 500, -1000);
        this.stiffness = stiffness;
        this.damping = damping;
        this.mass = mass;
        this._velocity = new Vector3D_1.Vector3D();
        this._dv = new Vector3D_1.Vector3D();
        this._stretch = new Vector3D_1.Vector3D();
        this._force = new Vector3D_1.Vector3D();
        this._acceleration = new Vector3D_1.Vector3D();
        this._desiredPosition = new Vector3D_1.Vector3D();
    }
    SpringController.prototype.update = function (interpolate) {
        if (interpolate === void 0) { interpolate = true; }
        var offs;
        if (!this._pLookAtObject || !this._pTargetObject)
            return;
        this._pControllerDirty = true;
        offs = this._pLookAtObject.transform.matrix3D.deltaTransformVector(this.positionOffset);
        this._desiredPosition.x = this._pLookAtObject.x + offs.x;
        this._desiredPosition.y = this._pLookAtObject.y + offs.y;
        this._desiredPosition.z = this._pLookAtObject.z + offs.z;
        this._stretch = this._pTargetObject.transform.position.add(this._desiredPosition);
        this._stretch.scaleBy(-this.stiffness);
        this._dv.copyFrom(this._velocity);
        this._dv.scaleBy(this.damping);
        this._force.x = this._stretch.x - this._dv.x;
        this._force.y = this._stretch.y - this._dv.y;
        this._force.z = this._stretch.z - this._dv.z;
        this._acceleration.copyFrom(this._force);
        this._acceleration.scaleBy(1 / this.mass);
        this._velocity.incrementBy(this._acceleration);
        var position = this._pTargetObject.transform.position.add(this._velocity);
        this._pTargetObject.transform.moveTo(position.x, position.y, position.z);
        _super.prototype.update.call(this);
    };
    return SpringController;
}(LookAtController_1.LookAtController));
exports.SpringController = SpringController;

},{"../controllers/LookAtController":"awayjs-display/lib/controllers/LookAtController","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/controllers":[function(require,module,exports){
"use strict";
var ControllerBase_1 = require("./controllers/ControllerBase");
exports.ControllerBase = ControllerBase_1.ControllerBase;
var FirstPersonController_1 = require("./controllers/FirstPersonController");
exports.FirstPersonController = FirstPersonController_1.FirstPersonController;
var FollowController_1 = require("./controllers/FollowController");
exports.FollowController = FollowController_1.FollowController;
var HoverController_1 = require("./controllers/HoverController");
exports.HoverController = HoverController_1.HoverController;
var LookAtController_1 = require("./controllers/LookAtController");
exports.LookAtController = LookAtController_1.LookAtController;
var SpringController_1 = require("./controllers/SpringController");
exports.SpringController = SpringController_1.SpringController;

},{"./controllers/ControllerBase":"awayjs-display/lib/controllers/ControllerBase","./controllers/FirstPersonController":"awayjs-display/lib/controllers/FirstPersonController","./controllers/FollowController":"awayjs-display/lib/controllers/FollowController","./controllers/HoverController":"awayjs-display/lib/controllers/HoverController","./controllers/LookAtController":"awayjs-display/lib/controllers/LookAtController","./controllers/SpringController":"awayjs-display/lib/controllers/SpringController"}],"awayjs-display/lib/display/Billboard":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rectangle_1 = require("awayjs-core/lib/geom/Rectangle");
var DisplayObject_1 = require("../display/DisplayObject");
var BoundsType_1 = require("../bounds/BoundsType");
var RenderableEvent_1 = require("../events/RenderableEvent");
var SurfaceEvent_1 = require("../events/SurfaceEvent");
var DefaultMaterialManager_1 = require("../managers/DefaultMaterialManager");
var StyleEvent_1 = require("../events/StyleEvent");
/**
 * The Billboard class represents display objects that represent bitmap images.
 * These can be images that you load with the <code>flash.Assets</code> or
 * <code>flash.display.Loader</code> classes, or they can be images that you
 * create with the <code>Billboard()</code> constructor.
 *
 * <p>The <code>Billboard()</code> constructor allows you to create a Billboard
 * object that contains a reference to a Image2D object. After you create a
 * Billboard object, use the <code>addChild()</code> or <code>addChildAt()</code>
 * method of the parent DisplayObjectContainer instance to place the bitmap on
 * the display list.</p>
 *
 * <p>A Billboard object can share its Image2D reference among several Billboard
 * objects, independent of translation or rotation properties. Because you can
 * create multiple Billboard objects that reference the same Image2D object,
 * multiple display objects can use the same complex Image2D object without
 * incurring the memory overhead of a Image2D object for each display
 * object instance.</p>
 *
 * <p>A Image2D object can be drawn to the screen by a Billboard object in one
 * of two ways: by using the default hardware renderer with a single hardware surface,
 * or by using the slower software renderer when 3D acceleration is not available.</p>
 *
 * <p>If you would prefer to perform a batch rendering command, rather than using a
 * single surface for each Billboard object, you can also draw to the screen using the
 * <code>drawTiles()</code> or <code>drawTriangles()</code> methods which are
 * available to <code>flash.display.Tilesheet</code> and <code>flash.display.Graphics
 * objects.</code></p>
 *
 * <p><b>Note:</b> The Billboard class is not a subclass of the InteractiveObject
 * class, so it cannot dispatch mouse events. However, you can use the
 * <code>addEventListener()</code> method of the display object container that
 * contains the Billboard object.</p>
 */
var Billboard = (function (_super) {
    __extends(Billboard, _super);
    function Billboard(material, pixelSnapping, smoothing) {
        var _this = this;
        if (pixelSnapping === void 0) { pixelSnapping = "auto"; }
        if (smoothing === void 0) { smoothing = false; }
        _super.call(this);
        this._pIsEntity = true;
        this.onInvalidateTextureDelegate = function (event) { return _this.onInvalidateTexture(event); };
        this._onInvalidatePropertiesDelegate = function (event) { return _this._onInvalidateProperties(event); };
        this.material = material;
        this._updateDimensions();
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.AXIS_ALIGNED_BOX;
    }
    Object.defineProperty(Billboard.prototype, "animator", {
        /**
         * Defines the animator of the sprite. Act on the sprite's geometry. Defaults to null
         */
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Billboard.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return Billboard.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Billboard.prototype, "billboardRect", {
        /**
         *
         */
        get: function () {
            return this._billboardRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Billboard.prototype, "billboardHeight", {
        /**
         *
         */
        get: function () {
            return this._billboardHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Billboard.prototype, "billboardWidth", {
        /**
         *
         */
        get: function () {
            return this._billboardWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Billboard.prototype, "material", {
        /**
         *
         */
        get: function () {
            return this._material;
        },
        set: function (value) {
            if (value == this._material)
                return;
            if (this._material) {
                this._material.iRemoveOwner(this);
                this._material.removeEventListener(SurfaceEvent_1.SurfaceEvent.INVALIDATE_TEXTURE, this.onInvalidateTextureDelegate);
            }
            this._material = value;
            if (this._material) {
                this._material.iAddOwner(this);
                this._material.addEventListener(SurfaceEvent_1.SurfaceEvent.INVALIDATE_TEXTURE, this.onInvalidateTextureDelegate);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     */
    Billboard.prototype._pUpdateBoxBounds = function () {
        _super.prototype._pUpdateBoxBounds.call(this);
        this._pBoxBounds.width = this._billboardRect.width;
        this._pBoxBounds.height = this._billboardRect.height;
    };
    Billboard.prototype.clone = function () {
        var clone = new Billboard(this.material);
        return clone;
    };
    Object.defineProperty(Billboard.prototype, "style", {
        /**
         * The style used to render the current Billboard. If set to null, the default style of the material will be used instead.
         */
        get: function () {
            return this._style;
        },
        set: function (value) {
            if (this._style == value)
                return;
            if (this._style)
                this._style.removeEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._style = value;
            if (this._style)
                this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._onInvalidateProperties();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * //TODO
     *
     * @param shortestCollisionDistance
     * @returns {boolean}
     *
     * @internal
     */
    Billboard.prototype._iTestCollision = function (pickingCollision, pickingCollider) {
        return pickingCollider.testBillboardCollision(this, this.material, pickingCollision);
    };
    /**
     * @private
     */
    Billboard.prototype.onInvalidateTexture = function (event) {
        this._updateDimensions();
    };
    Billboard.prototype._acceptTraverser = function (traverser) {
        traverser.applyRenderable(this);
    };
    Billboard.prototype._updateDimensions = function () {
        var texture = this.material.getTextureAt(0);
        var image = texture ? ((this._style ? this._style.getImageAt(texture) : null) || (this.material.style ? this.material.style.getImageAt(texture) : null) || texture.getImageAt(0)) : null;
        if (image) {
            var sampler = ((this._style ? this._style.getSamplerAt(texture) : null) || (this.material.style ? this.material.style.getSamplerAt(texture) : null) || texture.getSamplerAt(0) || DefaultMaterialManager_1.DefaultMaterialManager.getDefaultSampler());
            if (sampler.imageRect) {
                this._billboardWidth = sampler.imageRect.width * image.width;
                this._billboardHeight = sampler.imageRect.height * image.height;
            }
            else {
                this._billboardWidth = image.rect.width;
                this._billboardHeight = image.rect.height;
            }
            this._billboardRect = sampler.frameRect || new Rectangle_1.Rectangle(0, 0, this._billboardWidth, this._billboardHeight);
        }
        else {
            this._billboardWidth = 1;
            this._billboardHeight = 1;
            this._billboardRect = new Rectangle_1.Rectangle(0, 0, 1, 1);
        }
        this._pInvalidateBounds();
        this.invalidateElements();
    };
    Billboard.prototype.invalidateElements = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_ELEMENTS, this));
    };
    Billboard.prototype.invalidateSurface = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_SURFACE, this));
    };
    Billboard.prototype._onInvalidateProperties = function (event) {
        if (event === void 0) { event = null; }
        this.invalidateSurface();
        this._updateDimensions();
    };
    Billboard.assetType = "[asset Billboard]";
    return Billboard;
}(DisplayObject_1.DisplayObject));
exports.Billboard = Billboard;

},{"../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/DisplayObject":"awayjs-display/lib/display/DisplayObject","../events/RenderableEvent":"awayjs-display/lib/events/RenderableEvent","../events/StyleEvent":"awayjs-display/lib/events/StyleEvent","../events/SurfaceEvent":"awayjs-display/lib/events/SurfaceEvent","../managers/DefaultMaterialManager":"awayjs-display/lib/managers/DefaultMaterialManager","awayjs-core/lib/geom/Rectangle":undefined}],"awayjs-display/lib/display/Camera":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Plane3D_1 = require("awayjs-core/lib/geom/Plane3D");
var ProjectionEvent_1 = require("awayjs-core/lib/events/ProjectionEvent");
var PerspectiveProjection_1 = require("awayjs-core/lib/projections/PerspectiveProjection");
var HierarchicalProperties_1 = require("../base/HierarchicalProperties");
var BoundsType_1 = require("../bounds/BoundsType");
var DisplayObjectContainer_1 = require("../display/DisplayObjectContainer");
var CameraEvent_1 = require("../events/CameraEvent");
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(projection) {
        var _this = this;
        if (projection === void 0) { projection = null; }
        _super.call(this);
        this._viewProjection = new Matrix3D_1.Matrix3D();
        this._viewProjectionDirty = true;
        this._frustumPlanesDirty = true;
        this._pIsEntity = true;
        this._onProjectionMatrixChangedDelegate = function (event) { return _this.onProjectionMatrixChanged(event); };
        this._projection = projection || new PerspectiveProjection_1.PerspectiveProjection();
        this._projection.addEventListener(ProjectionEvent_1.ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
        this._frustumPlanes = [];
        for (var i = 0; i < 6; ++i)
            this._frustumPlanes[i] = new Plane3D_1.Plane3D();
        this.z = -1000;
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.NULL;
    }
    Object.defineProperty(Camera.prototype, "assetType", {
        //@override
        get: function () {
            return Camera.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.onProjectionMatrixChanged = function (event) {
        this._viewProjectionDirty = true;
        this._frustumPlanesDirty = true;
        this.dispatchEvent(event);
    };
    Object.defineProperty(Camera.prototype, "frustumPlanes", {
        get: function () {
            if (this._frustumPlanesDirty)
                this.updateFrustum();
            return this._frustumPlanes;
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.updateFrustum = function () {
        var a, b, c;
        //var d : Number;
        var c11, c12, c13, c14;
        var c21, c22, c23, c24;
        var c31, c32, c33, c34;
        var c41, c42, c43, c44;
        var p;
        var raw = this.viewProjection.rawData;
        var invLen;
        c11 = raw[0];
        c12 = raw[4];
        c13 = raw[8];
        c14 = raw[12];
        c21 = raw[1];
        c22 = raw[5];
        c23 = raw[9];
        c24 = raw[13];
        c31 = raw[2];
        c32 = raw[6];
        c33 = raw[10];
        c34 = raw[14];
        c41 = raw[3];
        c42 = raw[7];
        c43 = raw[11];
        c44 = raw[15];
        // left plane
        p = this._frustumPlanes[0];
        a = c41 + c11;
        b = c42 + c12;
        c = c43 + c13;
        invLen = 1 / Math.sqrt(a * a + b * b + c * c);
        p.a = a * invLen;
        p.b = b * invLen;
        p.c = c * invLen;
        p.d = -(c44 + c14) * invLen;
        // right plane
        p = this._frustumPlanes[1];
        a = c41 - c11;
        b = c42 - c12;
        c = c43 - c13;
        invLen = 1 / Math.sqrt(a * a + b * b + c * c);
        p.a = a * invLen;
        p.b = b * invLen;
        p.c = c * invLen;
        p.d = (c14 - c44) * invLen;
        // bottom
        p = this._frustumPlanes[2];
        a = c41 + c21;
        b = c42 + c22;
        c = c43 + c23;
        invLen = 1 / Math.sqrt(a * a + b * b + c * c);
        p.a = a * invLen;
        p.b = b * invLen;
        p.c = c * invLen;
        p.d = -(c44 + c24) * invLen;
        // top
        p = this._frustumPlanes[3];
        a = c41 - c21;
        b = c42 - c22;
        c = c43 - c23;
        invLen = 1 / Math.sqrt(a * a + b * b + c * c);
        p.a = a * invLen;
        p.b = b * invLen;
        p.c = c * invLen;
        p.d = (c24 - c44) * invLen;
        // near
        p = this._frustumPlanes[4];
        a = c31;
        b = c32;
        c = c33;
        invLen = 1 / Math.sqrt(a * a + b * b + c * c);
        p.a = a * invLen;
        p.b = b * invLen;
        p.c = c * invLen;
        p.d = -c34 * invLen;
        // far
        p = this._frustumPlanes[5];
        a = c41 - c31;
        b = c42 - c32;
        c = c43 - c33;
        invLen = 1 / Math.sqrt(a * a + b * b + c * c);
        p.a = a * invLen;
        p.b = b * invLen;
        p.c = c * invLen;
        p.d = (c34 - c44) * invLen;
        this._frustumPlanesDirty = false;
    };
    Camera.prototype.pInvalidateHierarchicalProperties = function (bitFlag) {
        if (_super.prototype.pInvalidateHierarchicalProperties.call(this, bitFlag))
            return true;
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM) {
            this._viewProjectionDirty = true;
            this._frustumPlanesDirty = true;
        }
        return false;
    };
    Object.defineProperty(Camera.prototype, "projection", {
        /**
         *
         */
        get: function () {
            return this._projection;
        },
        set: function (value) {
            if (this._projection == value)
                return;
            if (!value)
                throw new Error("Projection cannot be null!");
            this._projection.removeEventListener(ProjectionEvent_1.ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
            this._projection = value;
            this._projection.addEventListener(ProjectionEvent_1.ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
            this.dispatchEvent(new CameraEvent_1.CameraEvent(CameraEvent_1.CameraEvent.PROJECTION_CHANGED, this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "viewProjection", {
        /**
         *
         */
        get: function () {
            if (this._viewProjectionDirty) {
                this._viewProjection.copyFrom(this.inverseSceneTransform);
                this._viewProjection.append(this._projection.matrix);
                this._viewProjectionDirty = false;
            }
            return this._viewProjection;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculates the ray in scene space from the camera to the given normalized coordinates in screen space.
     *
     * @param nX The normalised x coordinate in screen space, -1 corresponds to the left edge of the viewport, 1 to the right.
     * @param nY The normalised y coordinate in screen space, -1 corresponds to the top edge of the viewport, 1 to the bottom.
     * @param sZ The z coordinate in screen space, representing the distance into the screen.
     * @return The ray from the camera to the scene space position of the given screen coordinates.
     */
    Camera.prototype.getRay = function (nX, nY, sZ) {
        return this.sceneTransform.deltaTransformVector(this._projection.unproject(nX, nY, sZ));
    };
    /**
     * Calculates the normalised position in screen space of the given scene position.
     *
     * @param point3d the position vector of the scene coordinates to be projected.
     * @return The normalised screen position of the given scene coordinates.
     */
    Camera.prototype.project = function (point3d) {
        return this._projection.project(this.inverseSceneTransform.transformVector(point3d));
    };
    /**
     * Calculates the scene position of the given normalized coordinates in screen space.
     *
     * @param nX The normalised x coordinate in screen space, minus the originX offset of the projection property.
     * @param nY The normalised y coordinate in screen space, minus the originY offset of the projection property.
     * @param sZ The z coordinate in screen space, representing the distance into the screen.
     * @return The scene position of the given screen coordinates.
     */
    Camera.prototype.unproject = function (nX, nY, sZ) {
        return this.sceneTransform.transformVector(this._projection.unproject(nX, nY, sZ));
    };
    Camera.prototype._applyRenderer = function (renderer) {
        // Since this getter is invoked every iteration of the render loop, and
        // the prefab construct could affect the sub-sprites, the prefab is
        // validated here to give it a chance to rebuild.
        if (this._iSourcePrefab)
            this._iSourcePrefab._iValidate();
        //nothing to do here
    };
    Camera.assetType = "[asset Camera]";
    return Camera;
}(DisplayObjectContainer_1.DisplayObjectContainer));
exports.Camera = Camera;

},{"../base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/DisplayObjectContainer":"awayjs-display/lib/display/DisplayObjectContainer","../events/CameraEvent":"awayjs-display/lib/events/CameraEvent","awayjs-core/lib/events/ProjectionEvent":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Plane3D":undefined,"awayjs-core/lib/projections/PerspectiveProjection":undefined}],"awayjs-display/lib/display/DirectionalLight":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var LightBase_1 = require("../display/LightBase");
var HierarchicalProperties_1 = require("../base/HierarchicalProperties");
var BoundsType_1 = require("../bounds/BoundsType");
var DirectionalShadowMapper_1 = require("../materials/shadowmappers/DirectionalShadowMapper");
var DirectionalLight = (function (_super) {
    __extends(DirectionalLight, _super);
    function DirectionalLight(xDir, yDir, zDir) {
        if (xDir === void 0) { xDir = 0; }
        if (yDir === void 0) { yDir = -1; }
        if (zDir === void 0) { zDir = 1; }
        _super.call(this);
        this._pAabbPoints = new Array(24);
        this._pIsEntity = true;
        this.direction = new Vector3D_1.Vector3D(xDir, yDir, zDir);
        this._sceneDirection = new Vector3D_1.Vector3D();
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.NULL;
    }
    Object.defineProperty(DirectionalLight.prototype, "assetType", {
        get: function () {
            return DirectionalLight.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "sceneDirection", {
        get: function () {
            if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM)
                this.pUpdateSceneTransform();
            return this._sceneDirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value;
            if (!this._tmpLookAt)
                this._tmpLookAt = new Vector3D_1.Vector3D();
            this._tmpLookAt.x = this.x + this._direction.x;
            this._tmpLookAt.y = this.y + this._direction.y;
            this._tmpLookAt.z = this.z + this._direction.z;
            this.lookAt(this._tmpLookAt);
        },
        enumerable: true,
        configurable: true
    });
    //@override
    DirectionalLight.prototype.pUpdateSceneTransform = function () {
        _super.prototype.pUpdateSceneTransform.call(this);
        this.sceneTransform.copyColumnTo(2, this._sceneDirection);
        this._sceneDirection.normalize();
    };
    //@override
    DirectionalLight.prototype.pCreateShadowMapper = function () {
        return new DirectionalShadowMapper_1.DirectionalShadowMapper();
    };
    //override
    DirectionalLight.prototype.iGetObjectProjectionMatrix = function (entity, cameraTransform, target) {
        if (target === void 0) { target = null; }
        var raw = Matrix3DUtils_1.Matrix3DUtils.RAW_DATA_CONTAINER;
        var m = new Matrix3D_1.Matrix3D();
        m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
        m.append(this.inverseSceneTransform);
        if (!this._projAABBPoints)
            this._projAABBPoints = [];
        m.transformVectors(this._pAabbPoints, this._projAABBPoints);
        var xMin = Infinity, xMax = -Infinity;
        var yMin = Infinity, yMax = -Infinity;
        var zMin = Infinity, zMax = -Infinity;
        var d;
        for (var i = 0; i < 24;) {
            d = this._projAABBPoints[i++];
            if (d < xMin)
                xMin = d;
            if (d > xMax)
                xMax = d;
            d = this._projAABBPoints[i++];
            if (d < yMin)
                yMin = d;
            if (d > yMax)
                yMax = d;
            d = this._projAABBPoints[i++];
            if (d < zMin)
                zMin = d;
            if (d > zMax)
                zMax = d;
        }
        var invXRange = 1 / (xMax - xMin);
        var invYRange = 1 / (yMax - yMin);
        var invZRange = 1 / (zMax - zMin);
        raw[0] = 2 * invXRange;
        raw[5] = 2 * invYRange;
        raw[10] = invZRange;
        raw[12] = -(xMax + xMin) * invXRange;
        raw[13] = -(yMax + yMin) * invYRange;
        raw[14] = -zMin * invZRange;
        raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
        raw[15] = 1;
        if (!target)
            target = new Matrix3D_1.Matrix3D();
        target.copyRawDataFrom(raw);
        target.prepend(m);
        return target;
    };
    /**
     * //TODO
     *
     * @protected
     */
    DirectionalLight.prototype._pUpdateBoxBounds = function () {
        _super.prototype._pUpdateBoxBounds.call(this);
        //update points
        var minX = this._pBoxBounds.x;
        var minY = this._pBoxBounds.y - this._pBoxBounds.height;
        var minZ = this._pBoxBounds.z;
        var maxX = this._pBoxBounds.x + this._pBoxBounds.width;
        var maxY = this._pBoxBounds.y;
        var maxZ = this._pBoxBounds.z + this._pBoxBounds.depth;
        this._pAabbPoints[0] = minX;
        this._pAabbPoints[1] = minY;
        this._pAabbPoints[2] = minZ;
        this._pAabbPoints[3] = maxX;
        this._pAabbPoints[4] = minY;
        this._pAabbPoints[5] = minZ;
        this._pAabbPoints[6] = minX;
        this._pAabbPoints[7] = maxY;
        this._pAabbPoints[8] = minZ;
        this._pAabbPoints[9] = maxX;
        this._pAabbPoints[10] = maxY;
        this._pAabbPoints[11] = minZ;
        this._pAabbPoints[12] = minX;
        this._pAabbPoints[13] = minY;
        this._pAabbPoints[14] = maxZ;
        this._pAabbPoints[15] = maxX;
        this._pAabbPoints[16] = minY;
        this._pAabbPoints[17] = maxZ;
        this._pAabbPoints[18] = minX;
        this._pAabbPoints[19] = maxY;
        this._pAabbPoints[20] = maxZ;
        this._pAabbPoints[21] = maxX;
        this._pAabbPoints[22] = maxY;
        this._pAabbPoints[23] = maxZ;
    };
    DirectionalLight.assetType = "[light DirectionalLight]";
    return DirectionalLight;
}(LightBase_1.LightBase));
exports.DirectionalLight = DirectionalLight;

},{"../base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/LightBase":"awayjs-display/lib/display/LightBase","../materials/shadowmappers/DirectionalShadowMapper":"awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/display/DisplayObjectContainer":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArgumentError_1 = require("awayjs-core/lib/errors/ArgumentError");
var RangeError_1 = require("awayjs-core/lib/errors/RangeError");
var DisplayObject_1 = require("../display/DisplayObject");
var HierarchicalProperties_1 = require("../base/HierarchicalProperties");
/**
 * The DisplayObjectContainer class is the base class for all objects that can
 * serve as display object containers on the display list. The display list
 * manages all objects displayed in the Flash runtimes. Use the
 * DisplayObjectContainer class to arrange the display objects in the display
 * list. Each DisplayObjectContainer object has its own child list for
 * organizing the z-order of the objects. The z-order is the front-to-back
 * order that determines which object is drawn in front, which is behind, and
 * so on.
 *
 * <p>DisplayObject is an abstract base class; therefore, you cannot call
 * DisplayObject directly. Invoking <code>new DisplayObject()</code> throws an
 * <code>ArgumentError</code> exception.</p>
 * The DisplayObjectContainer class is an abstract base class for all objects
 * that can contain child objects. It cannot be instantiated directly; calling
 * the <code>new DisplayObjectContainer()</code> constructor throws an
 * <code>ArgumentError</code> exception.
 *
 * <p>For more information, see the "Display Programming" chapter of the
 * <i>ActionScript 3.0 Developer's Guide</i>.</p>
 */
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    /**
     * Calling the <code>new DisplayObjectContainer()</code> constructor throws
     * an <code>ArgumentError</code> exception. You <i>can</i>, however, call
     * constructors for the following subclasses of DisplayObjectContainer:
     * <ul>
     *   <li><code>new Loader()</code></li>
     *   <li><code>new Sprite()</code></li>
     *   <li><code>new MovieClip()</code></li>
     * </ul>
     */
    function DisplayObjectContainer() {
        _super.call(this);
        this._mouseChildren = true;
        this._depth_childs = {};
        this._nextHighestDepth = 0;
        this._children = new Array();
    }
    Object.defineProperty(DisplayObjectContainer.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return DisplayObjectContainer.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObjectContainer.prototype, "mouseChildren", {
        /**
         * Determines whether or not the children of the object are mouse, or user
         * input device, enabled. If an object is enabled, a user can interact with
         * it by using a mouse or user input device. The default is
         * <code>true</code>.
         *
         * <p>This property is useful when you create a button with an instance of
         * the Sprite class(instead of using the SimpleButton class). When you use a
         * Sprite instance to create a button, you can choose to decorate the button
         * by using the <code>addChild()</code> method to add additional Sprite
         * instances. This process can cause unexpected behavior with mouse events
         * because the Sprite instances you add as children can become the target
         * object of a mouse event when you expect the parent instance to be the
         * target object. To ensure that the parent instance serves as the target
         * objects for mouse events, you can set the <code>mouseChildren</code>
         * property of the parent instance to <code>false</code>.</p>
         *
         * <p> No event is dispatched by setting this property. You must use the
         * <code>addEventListener()</code> method to create interactive
         * functionality.</p>
         */
        get: function () {
            if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.MOUSE_ENABLED)
                this._updateMouseEnabled();
            return this._mouseChildren;
        },
        set: function (value) {
            if (this._mouseChildren == value)
                return;
            this._mouseChildren = value;
            this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.MOUSE_ENABLED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObjectContainer.prototype, "numChildren", {
        /**
         * Returns the number of children of this object.
         */
        get: function () {
            return this._children.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a child DisplayObject instance to this DisplayObjectContainer
     * instance. The child is added to the front(top) of all other children in
     * this DisplayObjectContainer instance.(To add a child to a specific index
     * position, use the <code>addChildAt()</code> method.)
     *
     * <p>If you add a child object that already has a different display object
     * container as a parent, the object is removed from the child list of the
     * other display object container. </p>
     *
     * <p><b>Note:</b> The command <code>stage.addChild()</code> can cause
     * problems with a published SWF file, including security problems and
     * conflicts with other loaded SWF files. There is only one Stage within a
     * Flash runtime instance, no matter how many SWF files you load into the
     * runtime. So, generally, objects should not be added to the Stage,
     * directly, at all. The only object the Stage should contain is the root
     * object. Create a DisplayObjectContainer to contain all of the items on the
     * display list. Then, if necessary, add that DisplayObjectContainer instance
     * to the Stage.</p>
     *
     * @param child The DisplayObject instance to add as a child of this
     *              DisplayObjectContainer instance.
     * @return The DisplayObject instance that you pass in the <code>child</code>
     *         parameter.
     * @throws ArgumentError Throws if the child is the same as the parent. Also
     *                       throws if the caller is a child(or grandchild etc.)
     *                       of the child being added.
     * @event added Dispatched when a display object is added to the display
     *              list.
     */
    DisplayObjectContainer.prototype.addChild = function (child) {
        return this.addChildAt(child, this._children.length);
    };
    DisplayObjectContainer.prototype.addChildAtDepth = function (child, depth, replace) {
        if (replace === void 0) { replace = true; }
        if (child == null)
            throw new ArgumentError_1.ArgumentError("Parameter child cannot be null.");
        //if child already has a parent, remove it.
        if (child._pParent)
            child._pParent.removeChildAtInternal(child._pParent.getChildIndex(child));
        var index = this.getDepthIndexInternal(depth);
        if (index != -1) {
            if (replace) {
                this.removeChildAt(index);
            }
            else {
                //move depth of existing child up by 1
                this.addChildAtDepth(this._children[index], depth + 1, false);
            }
        }
        if (this._nextHighestDepth < depth + 1)
            this._nextHighestDepth = depth + 1;
        this._depth_childs[depth] = child;
        this._children.push(child);
        child._depthID = depth;
        child.iSetParent(this);
        this._invalidateChildren();
        return child;
    };
    /**
     * Adds a child DisplayObject instance to this DisplayObjectContainer
     * instance. The child is added at the index position specified. An index of
     * 0 represents the back(bottom) of the display list for this
     * DisplayObjectContainer object.
     *
     * <p>For example, the following example shows three display objects, labeled
     * a, b, and c, at index positions 0, 2, and 1, respectively:</p>
     *
     * <p>If you add a child object that already has a different display object
     * container as a parent, the object is removed from the child list of the
     * other display object container. </p>
     *
     * @param child The DisplayObject instance to add as a child of this
     *              DisplayObjectContainer instance.
     * @param index The index position to which the child is added. If you
     *              specify a currently occupied index position, the child object
     *              that exists at that position and all higher positions are
     *              moved up one position in the child list.
     * @return The DisplayObject instance that you pass in the <code>child</code>
     *         parameter.
     * @throws ArgumentError Throws if the child is the same as the parent. Also
     *                       throws if the caller is a child(or grandchild etc.)
     *                       of the child being added.
     * @throws RangeError    Throws if the index position does not exist in the
     *                       child list.
     * @event added Dispatched when a display object is added to the display
     *              list.
     */
    DisplayObjectContainer.prototype.addChildAt = function (child, index) {
        return this.addChildAtDepth(child, (index < this._children.length) ? this._children[index]._depthID : this.getNextHighestDepth(), false);
    };
    DisplayObjectContainer.prototype.addChildren = function () {
        var childarray = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            childarray[_i - 0] = arguments[_i];
        }
        var len = childarray.length;
        for (var i = 0; i < len; i++)
            this.addChild(childarray[i]);
    };
    /**
     *
     */
    DisplayObjectContainer.prototype.clone = function () {
        var newInstance = new DisplayObjectContainer();
        this.copyTo(newInstance);
        return newInstance;
    };
    DisplayObjectContainer.prototype.copyTo = function (newInstance) {
        _super.prototype.copyTo.call(this, newInstance);
        newInstance.mouseChildren = this._mouseChildren;
        var len = this._children.length;
        for (var i = 0; i < len; ++i)
            newInstance.addChild(this._children[i].clone());
    };
    /**
     * Determines whether the specified display object is a child of the
     * DisplayObjectContainer instance or the instance itself. The search
     * includes the entire display list including this DisplayObjectContainer
     * instance. Grandchildren, great-grandchildren, and so on each return
     * <code>true</code>.
     *
     * @param child The child object to test.
     * @return <code>true</code> if the <code>child</code> object is a child of
     *         the DisplayObjectContainer or the container itself; otherwise
     *         <code>false</code>.
     */
    DisplayObjectContainer.prototype.contains = function (child) {
        return this._children.indexOf(child) >= 0;
    };
    /**
     *
     */
    DisplayObjectContainer.prototype.disposeValues = function () {
        for (var i = this._children.length - 1; i >= 0; i--)
            this.removeChild(this._children[i]);
        _super.prototype.disposeValues.call(this);
    };
    DisplayObjectContainer.prototype.getChildAtDepth = function (depth) {
        return this._depth_childs[depth];
    };
    /**
     * Returns the child display object instance that exists at the specified
     * index.
     *
     * @param index The index position of the child object.
     * @return The child display object at the specified index position.
     * @throws RangeError    Throws if the index does not exist in the child
     *                       list.
     */
    DisplayObjectContainer.prototype.getChildAt = function (index) {
        var child = this._children[index];
        if (child == null)
            throw new RangeError_1.RangeError("Index does not exist in the child list of the caller");
        return child;
    };
    /**
     * Returns the child display object that exists with the specified name. If
     * more that one child display object has the specified name, the method
     * returns the first object in the child list.
     *
     * <p>The <code>getChildAt()</code> method is faster than the
     * <code>getChildByName()</code> method. The <code>getChildAt()</code> method
     * accesses a child from a cached array, whereas the
     * <code>getChildByName()</code> method has to traverse a linked list to
     * access a child.</p>
     *
     * @param name The name of the child to return.
     * @return The child display object with the specified name.
     */
    DisplayObjectContainer.prototype.getChildByName = function (name) {
        var len = this._children.length;
        for (var i = 0; i < len; ++i)
            if (this._children[i].name == name)
                return this._children[i];
        return null;
    };
    /**
     * Returns the index position of a <code>child</code> DisplayObject instance.
     *
     * @param child The DisplayObject instance to identify.
     * @return The index position of the child display object to identify.
     * @throws ArgumentError Throws if the child parameter is not a child of this
     *                       object.
     */
    DisplayObjectContainer.prototype.getChildIndex = function (child) {
        var childIndex = this._children.indexOf(child);
        if (childIndex == -1)
            throw new ArgumentError_1.ArgumentError("Child parameter is not a child of the caller");
        return childIndex;
    };
    DisplayObjectContainer.prototype.getNextHighestDepth = function () {
        if (this._nextHighestDepthDirty)
            this._updateNextHighestDepth();
        return this._nextHighestDepth;
    };
    /**
     * Returns an array of objects that lie under the specified point and are
     * children(or grandchildren, and so on) of this DisplayObjectContainer
     * instance. Any child objects that are inaccessible for security reasons are
     * omitted from the returned array. To determine whether this security
     * restriction affects the returned array, call the
     * <code>areInaccessibleObjectsUnderPoint()</code> method.
     *
     * <p>The <code>point</code> parameter is in the coordinate space of the
     * Stage, which may differ from the coordinate space of the display object
     * container(unless the display object container is the Stage). You can use
     * the <code>globalToLocal()</code> and the <code>localToGlobal()</code>
     * methods to convert points between these coordinate spaces.</p>
     *
     * @param point The point under which to look.
     * @return An array of objects that lie under the specified point and are
     *         children(or grandchildren, and so on) of this
     *         DisplayObjectContainer instance.
     */
    DisplayObjectContainer.prototype.getObjectsUnderPoint = function (point) {
        return new Array();
    };
    /**
     * Removes the specified <code>child</code> DisplayObject instance from the
     * child list of the DisplayObjectContainer instance. The <code>parent</code>
     * property of the removed child is set to <code>null</code> , and the object
     * is garbage collected if no other references to the child exist. The index
     * positions of any display objects above the child in the
     * DisplayObjectContainer are decreased by 1.
     *
     * <p>The garbage collector reallocates unused memory space. When a variable
     * or object is no longer actively referenced or stored somewhere, the
     * garbage collector sweeps through and wipes out the memory space it used to
     * occupy if no other references to it exist.</p>
     *
     * @param child The DisplayObject instance to remove.
     * @return The DisplayObject instance that you pass in the <code>child</code>
     *         parameter.
     * @throws ArgumentError Throws if the child parameter is not a child of this
     *                       object.
     */
    DisplayObjectContainer.prototype.removeChild = function (child) {
        if (child == null)
            throw new ArgumentError_1.ArgumentError("Parameter child cannot be null");
        this.removeChildAt(this.getChildIndex(child));
        return child;
    };
    DisplayObjectContainer.prototype.removeChildAtDepth = function (depth) {
        return this.removeChildAt(this.getDepthIndexInternal(depth));
    };
    /**
     * Removes a child DisplayObject from the specified <code>index</code>
     * position in the child list of the DisplayObjectContainer. The
     * <code>parent</code> property of the removed child is set to
     * <code>null</code>, and the object is garbage collected if no other
     * references to the child exist. The index positions of any display objects
     * above the child in the DisplayObjectContainer are decreased by 1.
     *
     * <p>The garbage collector reallocates unused memory space. When a variable
     * or object is no longer actively referenced or stored somewhere, the
     * garbage collector sweeps through and wipes out the memory space it used to
     * occupy if no other references to it exist.</p>
     *
     * @param index The child index of the DisplayObject to remove.
     * @return The DisplayObject instance that was removed.
     * @throws RangeError    Throws if the index does not exist in the child
     *                       list.
     * @throws SecurityError This child display object belongs to a sandbox to
     *                       which the calling object does not have access. You
     *                       can avoid this situation by having the child movie
     *                       call the <code>Security.allowDomain()</code> method.
     */
    DisplayObjectContainer.prototype.removeChildAt = function (index) {
        var child = this.removeChildAtInternal(index);
        child.iSetParent(null);
        this._invalidateChildren();
        return child;
    };
    /**
     * Removes all <code>child</code> DisplayObject instances from the child list
     * of the DisplayObjectContainer instance. The <code>parent</code> property
     * of the removed children is set to <code>null</code>, and the objects are
     * garbage collected if no other references to the children exist.
     *
     * The garbage collector reallocates unused memory space. When a variable or
     * object is no longer actively referenced or stored somewhere, the garbage
     * collector sweeps through and wipes out the memory space it used to occupy
     * if no other references to it exist.
     *
     * @param beginIndex The beginning position. A value smaller than 0 throws a RangeError.
     * @param endIndex The ending position. A value smaller than 0 throws a RangeError.
     * @throws RangeError    Throws if the beginIndex or endIndex positions do
     *                       not exist in the child list.
     */
    DisplayObjectContainer.prototype.removeChildren = function (beginIndex, endIndex) {
        if (beginIndex === void 0) { beginIndex = 0; }
        if (endIndex === void 0) { endIndex = 2147483647; }
        if (beginIndex < 0)
            throw new RangeError_1.RangeError("beginIndex is out of range of the child list");
        if (endIndex > this._children.length)
            throw new RangeError_1.RangeError("endIndex is out of range of the child list");
        for (var i = beginIndex; i < endIndex; i++)
            this.removeChild(this._children[i]);
    };
    /**
     * Changes the position of an existing child in the display object container.
     * This affects the layering of child objects. For example, the following
     * example shows three display objects, labeled a, b, and c, at index
     * positions 0, 1, and 2, respectively:
     *
     * <p>When you use the <code>setChildIndex()</code> method and specify an
     * index position that is already occupied, the only positions that change
     * are those in between the display object's former and new position. All
     * others will stay the same. If a child is moved to an index LOWER than its
     * current index, all children in between will INCREASE by 1 for their index
     * reference. If a child is moved to an index HIGHER than its current index,
     * all children in between will DECREASE by 1 for their index reference. For
     * example, if the display object container in the previous example is named
     * <code>container</code>, you can swap the position of the display objects
     * labeled a and b by calling the following code:</p>
     *
     * <p>This code results in the following arrangement of objects:</p>
     *
     * @param child The child DisplayObject instance for which you want to change
     *              the index number.
     * @param index The resulting index number for the <code>child</code> display
     *              object.
     * @throws ArgumentError Throws if the child parameter is not a child of this
     *                       object.
     * @throws RangeError    Throws if the index does not exist in the child
     *                       list.
     */
    DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
        //TODO
    };
    /**
     * Swaps the z-order (front-to-back order) of the two specified child
     * objects. All other child objects in the display object container remain in
     * the same index positions.
     *
     * @param child1 The first child object.
     * @param child2 The second child object.
     * @throws ArgumentError Throws if either child parameter is not a child of
     *                       this object.
     */
    DisplayObjectContainer.prototype.swapChildren = function (child1, child2) {
        this.swapChildrenAt(this.getChildIndex(child1), this.getChildIndex(child2));
    };
    /**
     * Swaps the z-order(front-to-back order) of the child objects at the two
     * specified index positions in the child list. All other child objects in
     * the display object container remain in the same index positions.
     *
     * @param index1 The index position of the first child object.
     * @param index2 The index position of the second child object.
     * @throws RangeError If either index does not exist in the child list.
     */
    DisplayObjectContainer.prototype.swapChildrenAt = function (index1, index2) {
        var depth = this._children[index2]._depthID;
        var child = this._children[index1];
        this.addChildAtDepth(this._children[index2], this._children[index1]._depthID);
        this.addChildAtDepth(child, depth);
    };
    /**
     * //TODO
     *
     * @protected
     */
    DisplayObjectContainer.prototype._pUpdateBoxBounds = function () {
        _super.prototype._pUpdateBoxBounds.call(this);
        var box;
        var numChildren = this._children.length;
        if (numChildren > 0) {
            var min;
            var max;
            var minX, minY, minZ;
            var maxX, maxY, maxZ;
            for (var i = 0; i < numChildren; ++i) {
                box = this._children[i].getBox(this);
                if (i == 0) {
                    maxX = box.width + (minX = box.x);
                    maxY = box.height + (minY = box.y);
                    maxZ = box.depth + (minZ = box.z);
                }
                else {
                    max = box.width + (min = box.x);
                    if (min < minX)
                        minX = min;
                    if (max > maxX)
                        maxX = max;
                    max = box.height + (min = box.y);
                    if (min < minY)
                        minY = min;
                    if (max > maxY)
                        maxY = max;
                    max = box.depth + (min = box.z);
                    if (min < minZ)
                        minZ = min;
                    if (max > maxZ)
                        maxZ = max;
                }
            }
            this._pBoxBounds.width = maxX - (this._pBoxBounds.x = minX);
            this._pBoxBounds.height = maxY - (this._pBoxBounds.y = minY);
            this._pBoxBounds.depth = maxZ - (this._pBoxBounds.z = minZ);
        }
        else {
            this._pBoxBounds.setBoundIdentity();
        }
    };
    /**
     * @protected
     */
    DisplayObjectContainer.prototype.pInvalidateHierarchicalProperties = function (bitFlag) {
        if (_super.prototype.pInvalidateHierarchicalProperties.call(this, bitFlag))
            return true;
        var len = this._children.length;
        for (var i = 0; i < len; ++i)
            this._children[i].pInvalidateHierarchicalProperties(bitFlag);
        return false;
    };
    /**
     * @internal
     */
    DisplayObjectContainer.prototype._iSetScene = function (value, partition) {
        _super.prototype._iSetScene.call(this, value, partition);
        var len = this._children.length;
        for (var i = 0; i < len; ++i)
            this._children[i]._iSetScene(value, partition);
    };
    /**
     * @private
     *
     * @param child
     */
    DisplayObjectContainer.prototype.removeChildAtInternal = function (index) {
        var child = this._children.splice(index, 1)[0];
        //update next highest depth
        if (this._nextHighestDepth == child._depthID + 1)
            this._nextHighestDepthDirty = true;
        delete this._depth_childs[child._depthID];
        child._depthID = -16384;
        return child;
    };
    DisplayObjectContainer.prototype.getDepthIndexInternal = function (depth) {
        if (!this._depth_childs[depth])
            return -1;
        return this._children.indexOf(this._depth_childs[depth]);
    };
    DisplayObjectContainer.prototype._updateNextHighestDepth = function () {
        this._nextHighestDepthDirty = false;
        this._nextHighestDepth = 0;
        var len = this._children.length;
        for (var i = 0; i < len; i++)
            if (this._nextHighestDepth < this._children[i]._depthID)
                this._nextHighestDepth = this._children[i]._depthID;
        this._nextHighestDepth += 1;
    };
    DisplayObjectContainer.prototype._hitTestPointInternal = function (x, y, shapeFlag, masksFlag) {
        var numChildren = this._children.length;
        for (var i = 0; i < numChildren; i++)
            if (this._children[i].hitTestPoint(x, y, shapeFlag, masksFlag))
                return true;
        return false;
    };
    DisplayObjectContainer.prototype._updateMaskMode = function () {
        if (this.maskMode)
            this.mouseChildren = false;
        _super.prototype._updateMaskMode.call(this);
    };
    DisplayObjectContainer.prototype._invalidateChildren = function () {
        if (this._pIsContainer != Boolean(this._children.length)) {
            if (this._pImplicitPartition)
                this._pImplicitPartition._iUnregisterEntity(this);
            this._pIsContainer = Boolean(this._children.length);
            if (this._pImplicitPartition)
                this._pImplicitPartition._iRegisterEntity(this);
        }
        this._pInvalidateBounds();
    };
    DisplayObjectContainer.assetType = "[asset DisplayObjectContainer]";
    return DisplayObjectContainer;
}(DisplayObject_1.DisplayObject));
exports.DisplayObjectContainer = DisplayObjectContainer;

},{"../base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","../display/DisplayObject":"awayjs-display/lib/display/DisplayObject","awayjs-core/lib/errors/ArgumentError":undefined,"awayjs-core/lib/errors/RangeError":undefined}],"awayjs-display/lib/display/DisplayObject":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Box_1 = require("awayjs-core/lib/geom/Box");
var ColorTransform_1 = require("awayjs-core/lib/geom/ColorTransform");
var Sphere_1 = require("awayjs-core/lib/geom/Sphere");
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var Point_1 = require("awayjs-core/lib/geom/Point");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var HierarchicalProperties_1 = require("../base/HierarchicalProperties");
var BoundsType_1 = require("../bounds/BoundsType");
var AlignmentMode_1 = require("../base/AlignmentMode");
var OrientationMode_1 = require("../base/OrientationMode");
var Transform_1 = require("../base/Transform");
var PickingCollision_1 = require("../pick/PickingCollision");
var DisplayObjectEvent_1 = require("../events/DisplayObjectEvent");
var TransformEvent_1 = require("../events/TransformEvent");
/**
 * The DisplayObject class is the base class for all objects that can be
 * placed on the display list. The display list manages all objects displayed
 * in flash. Use the DisplayObjectContainer class to arrange the
 * display objects in the display list. DisplayObjectContainer objects can
 * have child display objects, while other display objects, such as Shape and
 * TextField objects, are "leaf" nodes that have only parents and siblings, no
 * children.
 *
 * <p>The DisplayObject class supports basic functionality like the <i>x</i>
 * and <i>y</i> position of an object, as well as more advanced properties of
 * the object such as its transformation matrix. </p>
 *
 * <p>DisplayObject is an abstract base class; therefore, you cannot call
 * DisplayObject directly. Invoking <code>new DisplayObject()</code> throws an
 * <code>ArgumentError</code> exception. </p>
 *
 * <p>All display objects inherit from the DisplayObject class.</p>
 *
 * <p>The DisplayObject class itself does not include any APIs for rendering
 * content onscreen. For that reason, if you want create a custom subclass of
 * the DisplayObject class, you will want to extend one of its subclasses that
 * do have APIs for rendering content onscreen, such as the Shape, Sprite,
 * Bitmap, SimpleButton, TextField, or MovieClip class.</p>
 *
 * <p>The DisplayObject class contains several broadcast events. Normally, the
 * target of any particular event is a specific DisplayObject instance. For
 * example, the target of an <code>added</code> event is the specific
 * DisplayObject instance that was added to the display list. Having a single
 * target restricts the placement of event listeners to that target and in
 * some cases the target's ancestors on the display list. With broadcast
 * events, however, the target is not a specific DisplayObject instance, but
 * rather all DisplayObject instances, including those that are not on the
 * display list. This means that you can add a listener to any DisplayObject
 * instance to listen for broadcast events. In addition to the broadcast
 * events listed in the DisplayObject class's Events table, the DisplayObject
 * class also inherits two broadcast events from the EventDispatcher class:
 * <code>activate</code> and <code>deactivate</code>.</p>
 *
 * <p>Some properties previously used in the ActionScript 1.0 and 2.0
 * MovieClip, TextField, and Button classes(such as <code>_alpha</code>,
 * <code>_height</code>, <code>_name</code>, <code>_width</code>,
 * <code>_x</code>, <code>_y</code>, and others) have equivalents in the
 * ActionScript 3.0 DisplayObject class that are renamed so that they no
 * longer begin with the underscore(_) character.</p>
 *
 * <p>For more information, see the "Display Programming" chapter of the
 * <i>ActionScript 3.0 Developer's Guide</i>.</p>
 *
 * @event added            Dispatched when a display object is added to the
 *                         display list. The following methods trigger this
 *                         event:
 *                         <code>DisplayObjectContainer.addChild()</code>,
 *                         <code>DisplayObjectContainer.addChildAt()</code>.
 * @event addedToScene     Dispatched when a display object is added to the on
 *                         scene display list, either directly or through the
 *                         addition of a sub tree in which the display object
 *                         is contained. The following methods trigger this
 *                         event:
 *                         <code>DisplayObjectContainer.addChild()</code>,
 *                         <code>DisplayObjectContainer.addChildAt()</code>.
 * @event enterFrame       [broadcast event] Dispatched when the playhead is
 *                         entering a new frame. If the playhead is not
 *                         moving, or if there is only one frame, this event
 *                         is dispatched continuously in conjunction with the
 *                         frame rate. This event is a broadcast event, which
 *                         means that it is dispatched by all display objects
 *                         with a listener registered for this event.
 * @event exitFrame        [broadcast event] Dispatched when the playhead is
 *                         exiting the current frame. All frame scripts have
 *                         been run. If the playhead is not moving, or if
 *                         there is only one frame, this event is dispatched
 *                         continuously in conjunction with the frame rate.
 *                         This event is a broadcast event, which means that
 *                         it is dispatched by all display objects with a
 *                         listener registered for this event.
 * @event frameConstructed [broadcast event] Dispatched after the constructors
 *                         of frame display objects have run but before frame
 *                         scripts have run. If the playhead is not moving, or
 *                         if there is only one frame, this event is
 *                         dispatched continuously in conjunction with the
 *                         frame rate. This event is a broadcast event, which
 *                         means that it is dispatched by all display objects
 *                         with a listener registered for this event.
 * @event removed          Dispatched when a display object is about to be
 *                         removed from the display list. Two methods of the
 *                         DisplayObjectContainer class generate this event:
 *                         <code>removeChild()</code> and
 *                         <code>removeChildAt()</code>.
 *
 *                         <p>The following methods of a
 *                         DisplayObjectContainer object also generate this
 *                         event if an object must be removed to make room for
 *                         the new object: <code>addChild()</code>,
 *                         <code>addChildAt()</code>, and
 *                         <code>setChildIndex()</code>. </p>
 * @event removedFromScene Dispatched when a display object is about to be
 *                         removed from the display list, either directly or
 *                         through the removal of a sub tree in which the
 *                         display object is contained. Two methods of the
 *                         DisplayObjectContainer class generate this event:
 *                         <code>removeChild()</code> and
 *                         <code>removeChildAt()</code>.
 *
 *                         <p>The following methods of a
 *                         DisplayObjectContainer object also generate this
 *                         event if an object must be removed to make room for
 *                         the new object: <code>addChild()</code>,
 *                         <code>addChildAt()</code>, and
 *                         <code>setChildIndex()</code>. </p>
 * @event render           [broadcast event] Dispatched when the display list
 *                         is about to be updated and rendered. This event
 *                         provides the last opportunity for objects listening
 *                         for this event to make changes before the display
 *                         list is rendered. You must call the
 *                         <code>invalidate()</code> method of the Scene
 *                         object each time you want a <code>render</code>
 *                         event to be dispatched. <code>Render</code> events
 *                         are dispatched to an object only if there is mutual
 *                         trust between it and the object that called
 *                         <code>Scene.invalidate()</code>. This event is a
 *                         broadcast event, which means that it is dispatched
 *                         by all display objects with a listener registered
 *                         for this event.
 *
 *                         <p><b>Note: </b>This event is not dispatched if the
 *                         display is not rendering. This is the case when the
 *                         content is either minimized or obscured. </p>
 */
var DisplayObject = (function (_super) {
    __extends(DisplayObject, _super);
    /**
     * Creates a new <code>DisplayObject</code> instance.
     */
    function DisplayObject() {
        var _this = this;
        _super.call(this);
        this._queuedEvents = new Array();
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
        this._pSceneTransform = new Matrix3D_1.Matrix3D();
        this._pIsEntity = false;
        this._pIsContainer = false;
        this._sessionID = -1;
        this._depthID = -16384;
        this._inverseSceneTransform = new Matrix3D_1.Matrix3D();
        this._scenePosition = new Vector3D_1.Vector3D();
        this._explicitVisibility = true;
        this._explicitMaskId = -1;
        this._pImplicitVisibility = true;
        this._pImplicitMaskId = -1;
        this._pImplicitMaskIds = new Array();
        this._explicitMouseEnabled = true;
        this._pImplicitMouseEnabled = true;
        this._orientationMatrix = new Matrix3D_1.Matrix3D();
        this._inheritColorTransform = false;
        this._maskMode = false;
        //temp vector used in global to local
        this._tempVector3D = new Vector3D_1.Vector3D();
        /**
         *
         */
        this.alignmentMode = AlignmentMode_1.AlignmentMode.REGISTRATION_POINT;
        /**
         *
         */
        this.castsShadows = true;
        /**
         *
         */
        this.orientationMode = OrientationMode_1.OrientationMode.DEFAULT;
        /**
         *
         */
        this.zOffset = 0;
        //creation of associated transform object
        this._transform = new Transform_1.Transform();
        //setup transform listeners
        this._transform.addEventListener(TransformEvent_1.TransformEvent.INVALIDATE_MATRIX3D, function (event) { return _this._onInvalidateMatrix3D(event); });
        this._transform.addEventListener(TransformEvent_1.TransformEvent.INVALIDATE_COLOR_TRANSFORM, function (event) { return _this._onInvalidateColorTransform(event); });
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.AXIS_ALIGNED_BOX;
    }
    Object.defineProperty(DisplayObject.prototype, "adapter", {
        /**
         * adapter is used to provide MovieClip to scripts taken from different platforms
         * setter typically managed by factory
         */
        get: function () {
            return this._adapter;
        },
        set: function (value) {
            this._adapter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "inheritColorTransform", {
        get: function () {
            return this._inheritColorTransform;
        },
        set: function (value) {
            if (this._inheritColorTransform == value)
                return;
            this._inheritColorTransform = value;
            this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.COLOR_TRANSFORM);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "alpha", {
        /**
         * Indicates the alpha transparency value of the object specified. Valid
         * values are 0(fully transparent) to 1(fully opaque). The default value is
         * 1. Display objects with <code>alpha</code> set to 0 <i>are</i> active,
         * even though they are invisible.
         */
        get: function () {
            return this._transform.colorTransform ? this._transform.colorTransform.alphaMultiplier : 1;
        },
        set: function (value) {
            if (!this._transform.colorTransform)
                this._transform.colorTransform = new ColorTransform_1.ColorTransform();
            this._transform.colorTransform.alphaMultiplier = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "boundsType", {
        /**
         *
         */
        get: function () {
            return this._boundsType;
        },
        set: function (value) {
            if (this._boundsType == value)
                return;
            this._boundsType = value;
            this.invalidate();
            this._pInvalidateBounds();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "depth", {
        /**
         * Indicates the depth of the display object, in pixels. The depth is
         * calculated based on the bounds of the content of the display object. When
         * you set the <code>depth</code> property, the <code>scaleZ</code> property
         * is adjusted accordingly, as shown in the following code:
         *
         * <p>Except for TextField and Video objects, a display object with no
         * content (such as an empty sprite) has a depth of 0, even if you try to
         * set <code>depth</code> to a different value.</p>
         */
        get: function () {
            return this.getBox().depth * this.scaleZ;
        },
        set: function (val) {
            if (this._depth == val)
                return;
            this._depth = val;
            this._setScaleZ(val / this.getBox().depth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "eulers", {
        /**
         * Defines the rotation of the 3d object as a <code>Vector3D</code> object containing euler angles for rotation around x, y and z axis.
         */
        get: function () {
            if (!this._eulers)
                this._eulers = new Vector3D_1.Vector3D();
            this._eulers.x = this.rotationX;
            this._eulers.y = this.rotationY;
            this._eulers.z = this.rotationZ;
            return this._eulers;
        },
        set: function (value) {
            this.rotationX = value.x;
            this.rotationY = value.y;
            this.rotationZ = value.z;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "height", {
        /**
         * An indexed array that contains each filter object currently associated
         * with the display object. The flash.filters package contains several
         * classes that define specific filters you can use.
         *
         * <p>Filters can be applied in Flash Professional at design time, or at run
         * time by using ActionScript code. To apply a filter by using ActionScript,
         * you must make a temporary copy of the entire <code>filters</code> array,
         * modify the temporary array, then assign the value of the temporary array
         * back to the <code>filters</code> array. You cannot directly add a new
         * filter object to the <code>filters</code> array.</p>
         *
         * <p>To add a filter by using ActionScript, perform the following steps
         * (assume that the target display object is named
         * <code>myDisplayObject</code>):</p>
         *
         * <ol>
         *   <li>Create a new filter object by using the constructor method of your
         * chosen filter class.</li>
         *   <li>Assign the value of the <code>myDisplayObject.filters</code> array
         * to a temporary array, such as one named <code>myFilters</code>.</li>
         *   <li>Add the new filter object to the <code>myFilters</code> temporary
         * array.</li>
         *   <li>Assign the value of the temporary array to the
         * <code>myDisplayObject.filters</code> array.</li>
         * </ol>
         *
         * <p>If the <code>filters</code> array is undefined, you do not need to use
         * a temporary array. Instead, you can directly assign an array literal that
         * contains one or more filter objects that you create. The first example in
         * the Examples section adds a drop shadow filter by using code that handles
         * both defined and undefined <code>filters</code> arrays.</p>
         *
         * <p>To modify an existing filter object, you must use the technique of
         * modifying a copy of the <code>filters</code> array:</p>
         *
         * <ol>
         *   <li>Assign the value of the <code>filters</code> array to a temporary
         * array, such as one named <code>myFilters</code>.</li>
         *   <li>Modify the property by using the temporary array,
         * <code>myFilters</code>. For example, to set the quality property of the
         * first filter in the array, you could use the following code:
         * <code>myFilters[0].quality = 1;</code></li>
         *   <li>Assign the value of the temporary array to the <code>filters</code>
         * array.</li>
         * </ol>
         *
         * <p>At load time, if a display object has an associated filter, it is
         * marked to cache itself as a transparent bitmap. From this point forward,
         * as long as the display object has a valid filter list, the player caches
         * the display object as a bitmap. This source bitmap is used as a source
         * image for the filter effects. Each display object usually has two bitmaps:
         * one with the original unfiltered source display object and another for the
         * final image after filtering. The final image is used when rendering. As
         * long as the display object does not change, the final image does not need
         * updating.</p>
         *
         * <p>The flash.filters package includes classes for filters. For example, to
         * create a DropShadow filter, you would write:</p>
         *
         * @throws ArgumentError When <code>filters</code> includes a ShaderFilter
         *                       and the shader output type is not compatible with
         *                       this operation(the shader must specify a
         *                       <code>pixel4</code> output).
         * @throws ArgumentError When <code>filters</code> includes a ShaderFilter
         *                       and the shader doesn't specify any image input or
         *                       the first input is not an <code>image4</code> input.
         * @throws ArgumentError When <code>filters</code> includes a ShaderFilter
         *                       and the shader specifies an image input that isn't
         *                       provided.
         * @throws ArgumentError When <code>filters</code> includes a ShaderFilter, a
         *                       ByteArray or Vector.<Number> instance as a shader
         *                       input, and the <code>width</code> and
         *                       <code>height</code> properties aren't specified for
         *                       the ShaderInput object, or the specified values
         *                       don't match the amount of data in the input data.
         *                       See the <code>ShaderInput.input</code> property for
         *                       more information.
         */
        //		public filters:Array<Dynamic>;
        /**
         * Indicates the height of the display object, in pixels. The height is
         * calculated based on the bounds of the content of the display object. When
         * you set the <code>height</code> property, the <code>scaleY</code> property
         * is adjusted accordingly, as shown in the following code:
         *
         * <p>Except for TextField and Video objects, a display object with no
         * content (such as an empty sprite) has a height of 0, even if you try to
         * set <code>height</code> to a different value.</p>
         */
        get: function () {
            return this.getBox().height * this.scaleY;
        },
        set: function (val) {
            if (this._height == val)
                return;
            this._height = val;
            this._setScaleY(val / this.getBox().height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "index", {
        /**
         * Indicates the instance container index of the DisplayObject. The object can be
         * identified in the child list of its parent display object container by
         * calling the <code>getChildByIndex()</code> method of the display object
         * container.
         *
         * <p>If the DisplayObject has no parent container, index defaults to 0.</p>
         */
        get: function () {
            if (this._pParent)
                return this._pParent.getChildIndex(this);
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "inverseSceneTransform", {
        /**
         *
         */
        get: function () {
            if (this._inverseSceneTransformDirty) {
                this._inverseSceneTransform.copyFrom(this.sceneTransform);
                this._inverseSceneTransform.invert();
                this._inverseSceneTransformDirty = false;
            }
            return this._inverseSceneTransform;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "isEntity", {
        /**
         *
         */
        get: function () {
            return this._pIsEntity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "isContainer", {
        /**
         *
         */
        get: function () {
            return this._pIsContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "loaderInfo", {
        /**
         * Returns a LoaderInfo object containing information about loading the file
         * to which this display object belongs. The <code>loaderInfo</code> property
         * is defined only for the root display object of a SWF file or for a loaded
         * Bitmap(not for a Bitmap that is drawn with ActionScript). To find the
         * <code>loaderInfo</code> object associated with the SWF file that contains
         * a display object named <code>myDisplayObject</code>, use
         * <code>myDisplayObject.root.loaderInfo</code>.
         *
         * <p>A large SWF file can monitor its download by calling
         * <code>this.root.loaderInfo.addEventListener(Event.COMPLETE,
         * func)</code>.</p>
         */
        get: function () {
            return this._loaderInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "maskMode", {
        get: function () {
            return this._maskMode;
        },
        set: function (value) {
            if (this._maskMode == value)
                return;
            this._maskMode = value;
            this._explicitMaskId = value ? this.id : -1;
            this._updateMaskMode();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "mouseEnabled", {
        /**
         * Specifies whether this object receives mouse, or other user input,
         * messages. The default value is <code>true</code>, which means that by
         * default any InteractiveObject instance that is on the display list
         * receives mouse events or other user input events. If
         * <code>mouseEnabled</code> is set to <code>false</code>, the instance does
         * not receive any mouse events(or other user input events like keyboard
         * events). Any children of this instance on the display list are not
         * affected. To change the <code>mouseEnabled</code> behavior for all
         * children of an object on the display list, use
         * <code>flash.display.DisplayObjectContainer.mouseChildren</code>.
         *
         * <p> No event is dispatched by setting this property. You must use the
         * <code>addEventListener()</code> method to create interactive
         * functionality.</p>
         */
        get: function () {
            return this._explicitMouseEnabled;
        },
        set: function (value) {
            if (this._explicitMouseEnabled == value)
                return;
            this._explicitMouseEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "mouseX", {
        /**
         * Indicates the x coordinate of the mouse or user input device position, in
         * pixels.
         *
         * <p><b>Note</b>: For a DisplayObject that has been rotated, the returned x
         * coordinate will reflect the non-rotated object.</p>
         */
        get: function () {
            return this._mouseX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "mouseY", {
        /**
         * Indicates the y coordinate of the mouse or user input device position, in
         * pixels.
         *
         * <p><b>Note</b>: For a DisplayObject that has been rotated, the returned y
         * coordinate will reflect the non-rotated object.</p>
         */
        get: function () {
            return this._mouseY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "name", {
        /**
         * Indicates the instance name of the DisplayObject. The object can be
         * identified in the child list of its parent display object container by
         * calling the <code>getChildByName()</code> method of the display object
         * container.
         *
         * @throws IllegalOperationError If you are attempting to set this property
         *                               on an object that was placed on the timeline
         *                               in the Flash authoring tool.
         */
        get: function () {
            return this._pName;
        },
        set: function (value) {
            this._pName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "parent", {
        /**
         * Indicates the DisplayObjectContainer object that contains this display
         * object. Use the <code>parent</code> property to specify a relative path to
         * display objects that are above the current display object in the display
         * list hierarchy.
         *
         * <p>You can use <code>parent</code> to move up multiple levels in the
         * display list as in the following:</p>
         *
         * @throws SecurityError The parent display object belongs to a security
         *                       sandbox to which you do not have access. You can
         *                       avoid this situation by having the parent movie call
         *                       the <code>Security.allowDomain()</code> method.
         */
        get: function () {
            return this._pParent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "partition", {
        /**
         *
         */
        get: function () {
            return this._explicitPartition;
        },
        set: function (value) {
            if (this._explicitPartition == value)
                return;
            this._explicitPartition = value;
            this._iSetScene(this._pScene, this._pParent ? this._pParent._iAssignedPartition : null);
            this.dispatchEvent(new DisplayObjectEvent_1.DisplayObjectEvent(DisplayObjectEvent_1.DisplayObjectEvent.PARTITION_CHANGED, this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "pivot", {
        /**
         * Defines the local point around which the object rotates.
         */
        get: function () {
            return this._pivot;
        },
        set: function (pivot) {
            if (this._pivot && this._pivot.x == pivot.x && this._pivot.y == pivot.y && this._pivot.z == pivot.z)
                return;
            if (!pivot) {
                this._pivot = null;
                this._pivotScale = null;
            }
            else {
                if (!this._pivot)
                    this._pivot = new Vector3D_1.Vector3D();
                this._pivot.x = pivot.x;
                this._pivot.y = pivot.y;
                this._pivot.z = pivot.z;
            }
            this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "root", {
        /**
         * For a display object in a loaded SWF file, the <code>root</code> property
         * is the top-most display object in the portion of the display list's tree
         * structure represented by that SWF file. For a Bitmap object representing a
         * loaded image file, the <code>root</code> property is the Bitmap object
         * itself. For the instance of the main class of the first SWF file loaded,
         * the <code>root</code> property is the display object itself. The
         * <code>root</code> property of the Scene object is the Scene object itself.
         * The <code>root</code> property is set to <code>null</code> for any display
         * object that has not been added to the display list, unless it has been
         * added to a display object container that is off the display list but that
         * is a child of the top-most display object in a loaded SWF file.
         *
         * <p>For example, if you create a new Sprite object by calling the
         * <code>Sprite()</code> constructor method, its <code>root</code> property
         * is <code>null</code> until you add it to the display list(or to a display
         * object container that is off the display list but that is a child of the
         * top-most display object in a SWF file).</p>
         *
         * <p>For a loaded SWF file, even though the Loader object used to load the
         * file may not be on the display list, the top-most display object in the
         * SWF file has its <code>root</code> property set to itself. The Loader
         * object does not have its <code>root</code> property set until it is added
         * as a child of a display object for which the <code>root</code> property is
         * set.</p>
         */
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotationX", {
        /**
         * Indicates the x-axis rotation of the DisplayObject instance, in degrees,
         * from its original orientation relative to the 3D parent container. Values
         * from 0 to 180 represent clockwise rotation; values from 0 to -180
         * represent counterclockwise rotation. Values outside this range are added
         * to or subtracted from 360 to obtain a value within the range.
         */
        get: function () {
            return this._transform.rotation.x * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        },
        set: function (val) {
            if (this.rotationX == val)
                return;
            this._transform.rotation.x = val * MathConsts_1.MathConsts.DEGREES_TO_RADIANS;
            this._transform.invalidateMatrix3D();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotationY", {
        /**
         * Indicates the y-axis rotation of the DisplayObject instance, in degrees,
         * from its original orientation relative to the 3D parent container. Values
         * from 0 to 180 represent clockwise rotation; values from 0 to -180
         * represent counterclockwise rotation. Values outside this range are added
         * to or subtracted from 360 to obtain a value within the range.
         */
        get: function () {
            return this._transform.rotation.y * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        },
        set: function (val) {
            if (this.rotationY == val)
                return;
            this._transform.rotation.y = val * MathConsts_1.MathConsts.DEGREES_TO_RADIANS;
            this._transform.invalidateMatrix3D();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotationZ", {
        /**
         * Indicates the z-axis rotation of the DisplayObject instance, in degrees,
         * from its original orientation relative to the 3D parent container. Values
         * from 0 to 180 represent clockwise rotation; values from 0 to -180
         * represent counterclockwise rotation. Values outside this range are added
         * to or subtracted from 360 to obtain a value within the range.
         */
        get: function () {
            return this._transform.rotation.z * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        },
        set: function (val) {
            if (this.rotationZ == val)
                return;
            this._transform.rotation.z = val * MathConsts_1.MathConsts.DEGREES_TO_RADIANS;
            this._transform.invalidateMatrix3D();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scaleX", {
        /**
         * Indicates the horizontal scale(percentage) of the object as applied from
         * the registration point. The default registration point is(0,0). 1.0
         * equals 100% scale.
         *
         * <p>Scaling the local coordinate system changes the <code>x</code> and
         * <code>y</code> property values, which are defined in whole pixels. </p>
         */
        get: function () {
            return this._transform.scale.x;
        },
        set: function (val) {
            //remove absolute width
            this._width = null;
            this._setScaleX(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scaleY", {
        /**
         * Indicates the vertical scale(percentage) of an object as applied from the
         * registration point of the object. The default registration point is(0,0).
         * 1.0 is 100% scale.
         *
         * <p>Scaling the local coordinate system changes the <code>x</code> and
         * <code>y</code> property values, which are defined in whole pixels. </p>
         */
        get: function () {
            return this._transform.scale.y;
        },
        set: function (val) {
            //remove absolute height
            this._height = null;
            this._setScaleY(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scaleZ", {
        /**
         * Indicates the depth scale(percentage) of an object as applied from the
         * registration point of the object. The default registration point is(0,0).
         * 1.0 is 100% scale.
         *
         * <p>Scaling the local coordinate system changes the <code>x</code>,
         * <code>y</code> and <code>z</code> property values, which are defined in
         * whole pixels. </p>
         */
        get: function () {
            return this._transform.scale.z;
        },
        set: function (val) {
            //remove absolute depth
            this._depth = null;
            this._setScaleZ(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "skewX", {
        /**
         * Indicates the horizontal skew(angle) of the object as applied from
         * the registration point. The default registration point is(0,0).
         */
        get: function () {
            return this._transform.skew.x;
        },
        set: function (val) {
            if (this.skewX == val)
                return;
            this._transform.skew.x = val;
            this._transform.invalidateMatrix3D();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "skewY", {
        /**
         * Indicates the vertical skew(angle) of an object as applied from the
         * registration point of the object. The default registration point is(0,0).
         */
        get: function () {
            return this._transform.skew.y;
        },
        set: function (val) {
            if (this.skewY == val)
                return;
            this._transform.skew.y = val;
            this._transform.invalidateMatrix3D();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "skewZ", {
        /**
         * Indicates the depth skew(angle) of an object as applied from the
         * registration point of the object. The default registration point is(0,0).
         */
        get: function () {
            return this._transform.skew.z;
        },
        set: function (val) {
            if (this.skewZ == val)
                return;
            this._transform.skew.z = val;
            this._transform.invalidateMatrix3D();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scene", {
        /**
         *
         */
        get: function () {
            return this._pScene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "scenePosition", {
        /**
         *
         */
        get: function () {
            if (this._scenePositionDirty) {
                if (this._pivot && this.alignmentMode == AlignmentMode_1.AlignmentMode.PIVOT_POINT) {
                    this._scenePosition = this.sceneTransform.transformVector(this._pivotScale);
                }
                else {
                    this.sceneTransform.copyColumnTo(3, this._scenePosition);
                }
                this._scenePositionDirty = false;
            }
            return this._scenePosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "sceneTransform", {
        get: function () {
            if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM)
                this.pUpdateSceneTransform();
            return this._pSceneTransform;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "shaderPickingDetails", {
        /**
         *
         */
        get: function () {
            return this._shaderPickingDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "debugVisible", {
        /**
         *
         */
        get: function () {
            return this._debugVisible;
        },
        set: function (value) {
            if (value == this._debugVisible)
                return;
            this._debugVisible = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "transform", {
        /**
         * An object with properties pertaining to a display object's matrix, color
         * transform, and pixel bounds. The specific properties  -  matrix,
         * colorTransform, and three read-only properties
         * (<code>concatenatedMatrix</code>, <code>concatenatedColorTransform</code>,
         * and <code>pixelBounds</code>)  -  are described in the entry for the
         * Transform class.
         *
         * <p>Each of the transform object's properties is itself an object. This
         * concept is important because the only way to set new values for the matrix
         * or colorTransform objects is to create a new object and copy that object
         * into the transform.matrix or transform.colorTransform property.</p>
         *
         * <p>For example, to increase the <code>tx</code> value of a display
         * object's matrix, you must make a copy of the entire matrix object, then
         * copy the new object into the matrix property of the transform object:</p>
         * <pre xml:space="preserve"><code> public myMatrix:Matrix =
         * myDisplayObject.transform.matrix; myMatrix.tx += 10;
         * myDisplayObject.transform.matrix = myMatrix; </code></pre>
         *
         * <p>You cannot directly set the <code>tx</code> property. The following
         * code has no effect on <code>myDisplayObject</code>: </p>
         * <pre xml:space="preserve"><code> myDisplayObject.transform.matrix.tx +=
         * 10; </code></pre>
         *
         * <p>You can also copy an entire transform object and assign it to another
         * display object's transform property. For example, the following code
         * copies the entire transform object from <code>myOldDisplayObj</code> to
         * <code>myNewDisplayObj</code>:</p>
         * <code>myNewDisplayObj.transform = myOldDisplayObj.transform;</code>
         *
         * <p>The resulting display object, <code>myNewDisplayObj</code>, now has the
         * same values for its matrix, color transform, and pixel bounds as the old
         * display object, <code>myOldDisplayObj</code>.</p>
         *
         * <p>Note that AIR for TV devices use hardware acceleration, if it is
         * available, for color transforms.</p>
         */
        get: function () {
            return this._transform;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "visible", {
        /**
         * Whether or not the display object is visible. Display objects that are not
         * visible are disabled. For example, if <code>visible=false</code> for an
         * InteractiveObject instance, it cannot be clicked.
         */
        get: function () {
            return this._explicitVisibility;
        },
        set: function (value) {
            if (this._explicitVisibility == value)
                return;
            this._explicitVisibility = value;
            this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.VISIBLE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "masks", {
        get: function () {
            return this._explicitMasks;
        },
        set: function (value) {
            if (this._explicitMasks == value)
                return;
            this._explicitMasks = value;
            //make sure maskMode is set to true for all masks
            if (value != null && value.length) {
                var len = value.length;
                for (var i = 0; i < len; i++)
                    value[i].maskMode = true;
            }
            this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.MASKS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "width", {
        /**
         * Indicates the width of the display object, in pixels. The width is
         * calculated based on the bounds of the content of the display object. When
         * you set the <code>width</code> property, the <code>scaleX</code> property
         * is adjusted accordingly, as shown in the following code:
         *
         * <p>Except for TextField and Video objects, a display object with no
         * content(such as an empty sprite) has a width of 0, even if you try to set
         * <code>width</code> to a different value.</p>
         */
        get: function () {
            return this.getBox().width * this.scaleX;
        },
        set: function (val) {
            if (this._width == val)
                return;
            this._width = val;
            this._setScaleX(val / this.getBox().width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "x", {
        /**
         * Indicates the <i>x</i> coordinate of the DisplayObject instance relative
         * to the local coordinates of the parent DisplayObjectContainer. If the
         * object is inside a DisplayObjectContainer that has transformations, it is
         * in the local coordinate system of the enclosing DisplayObjectContainer.
         * Thus, for a DisplayObjectContainer rotated 90° counterclockwise, the
         * DisplayObjectContainer's children inherit a coordinate system that is
         * rotated 90° counterclockwise. The object's coordinates refer to the
         * registration point position.
         */
        get: function () {
            return this._transform.position.x;
        },
        set: function (val) {
            if (this._transform.position.x == val)
                return;
            this._transform.matrix3D.rawData[12] = val;
            this._transform.invalidatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "y", {
        /**
         * Indicates the <i>y</i> coordinate of the DisplayObject instance relative
         * to the local coordinates of the parent DisplayObjectContainer. If the
         * object is inside a DisplayObjectContainer that has transformations, it is
         * in the local coordinate system of the enclosing DisplayObjectContainer.
         * Thus, for a DisplayObjectContainer rotated 90° counterclockwise, the
         * DisplayObjectContainer's children inherit a coordinate system that is
         * rotated 90° counterclockwise. The object's coordinates refer to the
         * registration point position.
         */
        get: function () {
            return this._transform.position.y;
        },
        set: function (val) {
            if (this._transform.position.y == val)
                return;
            this._transform.matrix3D.rawData[13] = val;
            this._transform.invalidatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "z", {
        /**
         * Indicates the z coordinate position along the z-axis of the DisplayObject
         * instance relative to the 3D parent container. The z property is used for
         * 3D coordinates, not screen or pixel coordinates.
         *
         * <p>When you set a <code>z</code> property for a display object to
         * something other than the default value of <code>0</code>, a corresponding
         * Matrix3D object is automatically created. for adjusting a display object's
         * position and orientation in three dimensions. When working with the
         * z-axis, the existing behavior of x and y properties changes from screen or
         * pixel coordinates to positions relative to the 3D parent container.</p>
         *
         * <p>For example, a child of the <code>_root</code> at position x = 100, y =
         * 100, z = 200 is not drawn at pixel location(100,100). The child is drawn
         * wherever the 3D projection calculation puts it. The calculation is:</p>
         *
         * <p><code>(x~~cameraFocalLength/cameraRelativeZPosition,
         * y~~cameraFocalLength/cameraRelativeZPosition)</code></p>
         */
        get: function () {
            return this._transform.position.z;
        },
        set: function (val) {
            if (this._transform.position.z == val)
                return;
            this._transform.matrix3D.rawData[14] = val;
            this._transform.invalidatePosition();
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    DisplayObject.prototype.addEventListener = function (type, listener) {
        _super.prototype.addEventListener.call(this, type, listener);
        switch (type) {
            case DisplayObjectEvent_1.DisplayObjectEvent.SCENE_CHANGED:
                this._listenToSceneChanged = true;
                break;
            case DisplayObjectEvent_1.DisplayObjectEvent.SCENETRANSFORM_CHANGED:
                this._listenToSceneTransformChanged = true;
                break;
        }
    };
    /**
     *
     */
    DisplayObject.prototype.clone = function () {
        var newInstance = new DisplayObject();
        this.copyTo(newInstance);
        return newInstance;
    };
    DisplayObject.prototype.copyTo = function (newInstance) {
        newInstance.partition = this._explicitPartition;
        newInstance.boundsType = this._boundsType;
        newInstance.pivot = this._pivot;
        newInstance.name = this._pName;
        newInstance.mouseEnabled = this._explicitMouseEnabled;
        newInstance.extra = this.extra;
        newInstance.maskMode = this._maskMode;
        newInstance.castsShadows = this.castsShadows;
        if (this._explicitMasks)
            newInstance.masks = this._explicitMasks;
        if (this._adapter)
            newInstance.adapter = this._adapter.clone(newInstance);
        newInstance._transform.matrix3D = this._transform.matrix3D;
        if (this._transform.colorTransform)
            newInstance.transform.colorTransform = this._transform.colorTransform.clone();
    };
    /**
     *
     */
    DisplayObject.prototype.dispose = function () {
        this.disposeValues();
    };
    DisplayObject.prototype.disposeValues = function () {
        if (this._pParent)
            this._pParent.removeChild(this);
        //if (this._adapter) {
        //	this._adapter.dispose();
        //	this._adapter = null;
        //}
        //this._pos = null;
        //this._rot = null;
        //this._sca = null;
        //this._ske = null;
        //this._transformComponents = null;
        //this._transform.dispose();
        //this._transform = null;
        //
        //this._matrix3D = null;
        //this._pSceneTransform = null;
        //this._inverseSceneTransform = null;
        this._explicitMasks = null;
    };
    /**
     * Returns a rectangle that defines the area of the display object relative
     * to the coordinate system of the <code>targetCoordinateSpace</code> object.
     * Consider the following code, which shows how the rectangle returned can
     * vary depending on the <code>targetCoordinateSpace</code> parameter that
     * you pass to the method:
     *
     * <p><b>Note:</b> Use the <code>localToGlobal()</code> and
     * <code>globalToLocal()</code> methods to convert the display object's local
     * coordinates to display coordinates, or display coordinates to local
     * coordinates, respectively.</p>
     *
     * <p>The <code>getBounds()</code> method is similar to the
     * <code>getRect()</code> method; however, the Rectangle returned by the
     * <code>getBounds()</code> method includes any strokes on shapes, whereas
     * the Rectangle returned by the <code>getRect()</code> method does not. For
     * an example, see the description of the <code>getRect()</code> method.</p>
     *
     * @param targetCoordinateSpace The display object that defines the
     *                              coordinate system to use.
     * @return The rectangle that defines the area of the display object relative
     *         to the <code>targetCoordinateSpace</code> object's coordinate
     *         system.
     */
    DisplayObject.prototype.getBounds = function (targetCoordinateSpace) {
        return this._bounds; //TODO
    };
    /**
     * Returns a rectangle that defines the boundary of the display object, based
     * on the coordinate system defined by the <code>targetCoordinateSpace</code>
     * parameter, excluding any strokes on shapes. The values that the
     * <code>getRect()</code> method returns are the same or smaller than those
     * returned by the <code>getBounds()</code> method.
     *
     * <p><b>Note:</b> Use <code>localToGlobal()</code> and
     * <code>globalToLocal()</code> methods to convert the display object's local
     * coordinates to Scene coordinates, or Scene coordinates to local
     * coordinates, respectively.</p>
     *
     * @param targetCoordinateSpace The display object that defines the
     *                              coordinate system to use.
     * @return The rectangle that defines the area of the display object relative
     *         to the <code>targetCoordinateSpace</code> object's coordinate
     *         system.
     */
    DisplayObject.prototype.getRect = function (targetCoordinateSpace) {
        if (targetCoordinateSpace === void 0) { targetCoordinateSpace = null; }
        return this._bounds; //TODO
    };
    DisplayObject.prototype.getBox = function (targetCoordinateSpace) {
        if (targetCoordinateSpace === void 0) { targetCoordinateSpace = null; }
        if (this._iSourcePrefab)
            this._iSourcePrefab._iValidate();
        //TODO targetCoordinateSpace
        if (this._boxBoundsInvalid) {
            this._pUpdateBoxBounds();
            //scale updates if absolute dimensions are detected
            if (this._width != null)
                this._setScaleX(this._width / this._pBoxBounds.width);
            if (this._height != null)
                this._setScaleY(this._height / this._pBoxBounds.height);
            if (this._depth != null)
                this._setScaleZ(this._depth / this._pBoxBounds.depth);
        }
        if (targetCoordinateSpace == null || targetCoordinateSpace == this)
            return this._pBoxBounds;
        if (targetCoordinateSpace == this._pParent)
            return this._transform.matrix3D.transformBox(this._pBoxBounds);
        else
            return targetCoordinateSpace.inverseSceneTransform.transformBox(this.sceneTransform.transformBox(this._pBoxBounds));
    };
    DisplayObject.prototype.getSphere = function (targetCoordinateSpace) {
        if (targetCoordinateSpace === void 0) { targetCoordinateSpace = null; }
        if (this._iSourcePrefab)
            this._iSourcePrefab._iValidate();
        if (this._sphereBoundsInvalid)
            this._pUpdateSphereBounds();
        return this._pSphereBounds;
    };
    /**
     * Converts the <code>point</code> object from the Scene(global) coordinates
     * to the display object's(local) coordinates.
     *
     * <p>To use this method, first create an instance of the Point class. The
     * <i>x</i> and <i>y</i> values that you assign represent global coordinates
     * because they relate to the origin(0,0) of the main display area. Then
     * pass the Point instance as the parameter to the
     * <code>globalToLocal()</code> method. The method returns a new Point object
     * with <i>x</i> and <i>y</i> values that relate to the origin of the display
     * object instead of the origin of the Scene.</p>
     *
     * @param point An object created with the Point class. The Point object
     *              specifies the <i>x</i> and <i>y</i> coordinates as
     *              properties.
     * @return A Point object with coordinates relative to the display object.
     */
    DisplayObject.prototype.globalToLocal = function (point, target) {
        if (target === void 0) { target = null; }
        this._tempVector3D.setTo(point.x, point.y, 0);
        var pos = this.inverseSceneTransform.transformVector(this._tempVector3D, this._tempVector3D);
        if (!target)
            target = new Point_1.Point();
        target.x = pos.x;
        target.y = pos.y;
        return target;
    };
    /**
     * Converts a two-dimensional point from the Scene(global) coordinates to a
     * three-dimensional display object's(local) coordinates.
     *
     * <p>To use this method, first create an instance of the Vector3D class. The x,
     * y and z values that you assign to the Vector3D object represent global
     * coordinates because they are relative to the origin(0,0,0) of the scene. Then
     * pass the Vector3D object to the <code>globalToLocal3D()</code> method as the
     * <code>position</code> parameter.
     * The method returns three-dimensional coordinates as a Vector3D object
     * containing <code>x</code>, <code>y</code>, and <code>z</code> values that
     * are relative to the origin of the three-dimensional display object.</p>
     *
     * @param point A Vector3D object representing global x, y and z coordinates in
     *              the scene.
     * @return A Vector3D object with coordinates relative to the three-dimensional
     *         display object.
     */
    DisplayObject.prototype.globalToLocal3D = function (position) {
        return this.inverseSceneTransform.transformVector(position);
    };
    /**
     * Evaluates the bounding box of the display object to see if it overlaps or
     * intersects with the bounding box of the <code>obj</code> display object.
     *
     * @param obj The display object to test against.
     * @return <code>true</code> if the bounding boxes of the display objects
     *         intersect; <code>false</code> if not.
     */
    DisplayObject.prototype.hitTestObject = function (obj) {
        var objBox = obj.getBox();
        if (!objBox)
            return false;
        var topLeft = new Point_1.Point(objBox.x, objBox.y);
        var bottomLeft = new Point_1.Point(objBox.x, objBox.y - objBox.height);
        var topRight = new Point_1.Point(objBox.x + objBox.width, objBox.y);
        var bottomRight = new Point_1.Point(objBox.x + objBox.width, objBox.y - objBox.height);
        topLeft = this.globalToLocal(obj.localToGlobal(topLeft));
        bottomLeft = this.globalToLocal(obj.localToGlobal(bottomLeft));
        topRight = this.globalToLocal(obj.localToGlobal(topRight));
        bottomRight = this.globalToLocal(obj.localToGlobal(bottomRight));
        var box = this.getBox();
        if (!box)
            return false;
        //first check all points against targer box
        if (topLeft.x <= box.left && topLeft.x <= box.left && topLeft.y <= box.top && topLeft.y >= box.bottom)
            return true;
        if (bottomLeft.x <= box.left && bottomLeft.x <= box.left && bottomLeft.y <= box.top && bottomLeft.y >= box.bottom)
            return true;
        if (topRight.x <= box.left && topRight.x <= box.left && topRight.y <= box.top && topRight.y >= box.bottom)
            return true;
        if (bottomRight.x <= box.left && bottomRight.x <= box.left && bottomRight.y <= box.top && bottomRight.y >= box.bottom)
            return true;
        //now test against obj box
        var n0x = topRight.y - topLeft.y;
        var n0y = -(topRight.x - topLeft.x);
        var n1x = bottomRight.y - topRight.y;
        var n1y = -(bottomRight.x - topRight.x);
        var n2x = bottomLeft.y - bottomRight.y;
        var n2y = -(bottomLeft.x - bottomRight.x);
        var n3x = topLeft.y - bottomLeft.y;
        var n3y = -(topLeft.x - bottomLeft.x);
        var p0x = box.left - topLeft.x;
        var p0y = box.top - topLeft.y;
        var p1x = box.left - topRight.x;
        var p1y = box.top - topRight.y;
        var p2x = box.left - bottomRight.x;
        var p2y = box.top - bottomRight.y;
        var p3x = box.left - bottomLeft.x;
        var p3y = box.top - bottomLeft.y;
        var dot0 = (n0x * p0x) + (n0y * p0y);
        var dot1 = (n1x * p1x) + (n1y * p1y);
        var dot2 = (n2x * p2x) + (n2y * p2y);
        var dot3 = (n3x * p3x) + (n3y * p3y);
        //check if topLeft is contained
        if (dot0 < 0 && dot1 < 0 && dot2 < 0 && dot3 < 0)
            return true;
        p0x = box.right - topLeft.x;
        p0y = box.top - topLeft.y;
        p1x = box.right - topRight.x;
        p1y = box.top - topRight.y;
        p2x = box.right - bottomRight.x;
        p2y = box.top - bottomRight.y;
        p3x = box.right - bottomLeft.x;
        p3y = box.top - bottomLeft.y;
        dot0 = (n0x * p0x) + (n0y * p0y);
        dot1 = (n1x * p1x) + (n1y * p1y);
        dot2 = (n2x * p2x) + (n2y * p2y);
        dot3 = (n3x * p3x) + (n3y * p3y);
        //check if topRight is contained
        if (dot0 < 0 && dot1 < 0 && dot2 < 0 && dot3 < 0)
            return true;
        p0x = box.left - topLeft.x;
        p0y = box.bottom - topLeft.y;
        p1x = box.left - topRight.x;
        p1y = box.bottom - topRight.y;
        p2x = box.left - bottomRight.x;
        p2y = box.bottom - bottomRight.y;
        p3x = box.left - bottomLeft.x;
        p3y = box.bottom - bottomLeft.y;
        dot0 = (n0x * p0x) + (n0y * p0y);
        dot1 = (n1x * p1x) + (n1y * p1y);
        dot2 = (n2x * p2x) + (n2y * p2y);
        dot3 = (n3x * p3x) + (n3y * p3y);
        //check if bottomLeft is contained
        if (dot0 < 0 && dot1 < 0 && dot2 < 0 && dot3 < 0)
            return true;
        p0x = box.right - topLeft.x;
        p0y = box.bottom - topLeft.y;
        p1x = box.right - topRight.x;
        p1y = box.bottom - topRight.y;
        p2x = box.right - bottomRight.x;
        p2y = box.bottom - bottomRight.y;
        p3x = box.right - bottomLeft.x;
        p3y = box.bottom - bottomLeft.y;
        dot0 = (n0x * p0x) + (n0y * p0y);
        dot1 = (n1x * p1x) + (n1y * p1y);
        dot2 = (n2x * p2x) + (n2y * p2y);
        dot3 = (n3x * p3x) + (n3y * p3y);
        //check if bottomRight is contained
        if (dot0 < 0 && dot1 < 0 && dot2 < 0 && dot3 < 0)
            return true;
        return false; //TODO
    };
    /**
     * Evaluates the display object to see if it overlaps or intersects with the
     * point specified by the <code>x</code> and <code>y</code> parameters. The
     * <code>x</code> and <code>y</code> parameters specify a point in the
     * coordinate space of the Scene, not the display object container that
     * contains the display object(unless that display object container is the
     * Scene).
     *
     * @param x         The <i>x</i> coordinate to test against this object.
     * @param y         The <i>y</i> coordinate to test against this object.
     * @param shapeFlag Whether to check against the actual pixels of the object
     *                 (<code>true</code>) or the bounding box
     *                 (<code>false</code>).
     * @param maskFlag Whether to check against the object when it is used as mask
     *                 (<code>false</code>).
     * @return <code>true</code> if the display object overlaps or intersects
     *         with the specified point; <code>false</code> otherwise.
     */
    DisplayObject.prototype.hitTestPoint = function (x, y, shapeFlag, masksFlag) {
        if (shapeFlag === void 0) { shapeFlag = false; }
        if (masksFlag === void 0) { masksFlag = false; }
        if (!this._pImplicitVisibility)
            return;
        if (this._pImplicitMaskId != -1 && !masksFlag)
            return;
        if (this._explicitMasks) {
            var numMasks = this._explicitMasks.length;
            var maskHit = false;
            for (var i = 0; i < numMasks; i++) {
                if (this._explicitMasks[i].hitTestPoint(x, y, shapeFlag, true)) {
                    maskHit = true;
                    break;
                }
            }
            if (!maskHit)
                return false;
        }
        return this._hitTestPointInternal(x, y, shapeFlag, masksFlag);
    };
    /**
     * Rotates the 3d object around to face a point defined relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
     *
     * @param    target        The vector defining the point to be looked at
     * @param    upAxis        An optional vector used to define the desired up orientation of the 3d object after rotation has occurred
     */
    DisplayObject.prototype.lookAt = function (target, upAxis) {
        if (upAxis === void 0) { upAxis = null; }
        var yAxis;
        var zAxis;
        var xAxis;
        var raw;
        if (upAxis == null)
            upAxis = Vector3D_1.Vector3D.Y_AXIS;
        else
            upAxis.normalize();
        zAxis = target.subtract(this._transform.position);
        zAxis.normalize();
        xAxis = upAxis.crossProduct(zAxis);
        xAxis.normalize();
        if (xAxis.length < 0.05) {
            xAxis.x = upAxis.y;
            xAxis.y = upAxis.x;
            xAxis.z = 0;
            xAxis.normalize();
        }
        yAxis = zAxis.crossProduct(xAxis);
        raw = Matrix3DUtils_1.Matrix3DUtils.RAW_DATA_CONTAINER;
        raw[0] = xAxis.x;
        raw[1] = xAxis.y;
        raw[2] = xAxis.z;
        raw[3] = 0;
        raw[4] = yAxis.x;
        raw[5] = yAxis.y;
        raw[6] = yAxis.z;
        raw[7] = 0;
        raw[8] = zAxis.x;
        raw[9] = zAxis.y;
        raw[10] = zAxis.z;
        raw[11] = 0;
        var m = new Matrix3D_1.Matrix3D();
        m.copyRawDataFrom(raw);
        var vec = m.decompose()[1];
        this.rotationX = vec.x * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        this.rotationY = vec.y * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        this.rotationZ = vec.z * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
    };
    /**
     * Converts the <code>point</code> object from the display object's(local)
     * coordinates to the Scene(global) coordinates.
     *
     * <p>This method allows you to convert any given <i>x</i> and <i>y</i>
     * coordinates from values that are relative to the origin(0,0) of a
     * specific display object(local coordinates) to values that are relative to
     * the origin of the Scene(global coordinates).</p>
     *
     * <p>To use this method, first create an instance of the Point class. The
     * <i>x</i> and <i>y</i> values that you assign represent local coordinates
     * because they relate to the origin of the display object.</p>
     *
     * <p>You then pass the Point instance that you created as the parameter to
     * the <code>localToGlobal()</code> method. The method returns a new Point
     * object with <i>x</i> and <i>y</i> values that relate to the origin of the
     * Scene instead of the origin of the display object.</p>
     *
     * @param point The name or identifier of a point created with the Point
     *              class, specifying the <i>x</i> and <i>y</i> coordinates as
     *              properties.
     * @return A Point object with coordinates relative to the Scene.
     */
    DisplayObject.prototype.localToGlobal = function (point, target) {
        if (target === void 0) { target = null; }
        this._tempVector3D.setTo(point.x, point.y, 0);
        var pos = this.sceneTransform.transformVector(this._tempVector3D, this._tempVector3D);
        if (!target)
            target = new Point_1.Point();
        target.x = pos.x;
        target.y = pos.y;
        return target;
    };
    /**
     * Converts a three-dimensional point of the three-dimensional display
     * object's(local) coordinates to a three-dimensional point in the Scene
     * (global) coordinates.
     *
     * <p>This method allows you to convert any given <i>x</i>, <i>y</i> and
     * <i>z</i> coordinates from values that are relative to the origin(0,0,0) of
     * a specific display object(local coordinates) to values that are relative to
     * the origin of the Scene(global coordinates).</p>
     *
     * <p>To use this method, first create an instance of the Point class. The
     * <i>x</i> and <i>y</i> values that you assign represent local coordinates
     * because they relate to the origin of the display object.</p>
     *
     * <p>You then pass the Vector3D instance that you created as the parameter to
     * the <code>localToGlobal3D()</code> method. The method returns a new
     * Vector3D object with <i>x</i>, <i>y</i> and <i>z</i> values that relate to
     * the origin of the Scene instead of the origin of the display object.</p>
     *
     * @param position A Vector3D object containing either a three-dimensional
     *                position or the coordinates of the three-dimensional
     *                display object.
     * @return A Vector3D object representing a three-dimensional position in
     *         the Scene.
     */
    DisplayObject.prototype.localToGlobal3D = function (position) {
        return this.sceneTransform.transformVector(position);
    };
    /**
     * Moves the local point around which the object rotates.
     *
     * @param    dx        The amount of movement along the local x axis.
     * @param    dy        The amount of movement along the local y axis.
     * @param    dz        The amount of movement along the local z axis.
     */
    DisplayObject.prototype.movePivot = function (dx, dy, dz) {
        if (dx == 0 && dy == 0 && dz == 0)
            return;
        this._pivot.x += dx;
        this._pivot.y += dy;
        this._pivot.z += dz;
        this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM);
    };
    DisplayObject.prototype.reset = function () {
        this.visible = true;
        if (this._transform.matrix3D)
            this._transform.clearMatrix3D();
        if (this._transform.colorTransform)
            this._transform.clearColorTransform();
        //this.name="";
        this.masks = null;
        this.maskMode = false;
    };
    /**
     *
     */
    DisplayObject.prototype.getRenderSceneTransform = function (cameraTransform) {
        if (this.orientationMode == OrientationMode_1.OrientationMode.CAMERA_PLANE) {
            var comps = cameraTransform.decompose();
            var scale = comps[3];
            comps[0].copyFrom(this.scenePosition);
            scale.x = this.scaleX;
            scale.y = this.scaleY;
            scale.z = this.scaleZ;
            this._orientationMatrix.recompose(comps);
            //add in case of pivot
            if (this._pivot && this.alignmentMode == AlignmentMode_1.AlignmentMode.PIVOT_POINT)
                this._orientationMatrix.prependTranslation(-this._pivot.x / this.scaleX, -this._pivot.y / this.scaleY, -this._pivot.z / this.scaleZ);
            return this._orientationMatrix;
        }
        return this.sceneTransform;
    };
    /**
     *
     */
    DisplayObject.prototype.removeEventListener = function (type, listener) {
        _super.prototype.removeEventListener.call(this, type, listener);
        if (this.hasEventListener(type))
            return;
        switch (type) {
            case DisplayObjectEvent_1.DisplayObjectEvent.SCENE_CHANGED:
                this._listenToSceneChanged = false;
                break;
            case DisplayObjectEvent_1.DisplayObjectEvent.SCENETRANSFORM_CHANGED:
                this._listenToSceneTransformChanged = true;
                break;
        }
    };
    Object.defineProperty(DisplayObject.prototype, "_iAssignedPartition", {
        /**
         * @internal
         */
        get: function () {
            return this._pImplicitPartition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "_iPickingCollision", {
        /**
         * @internal
         */
        get: function () {
            if (!this._pickingCollision)
                this._pickingCollision = new PickingCollision_1.PickingCollision(this);
            return this._pickingCollision;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @internal
     */
    DisplayObject.prototype.iSetParent = function (value) {
        this._pParent = value;
        if (value)
            this._iSetScene(value._pScene, value._iAssignedPartition);
        else
            this._iSetScene(null, null);
        this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.ALL);
    };
    DisplayObject.prototype.pInvalidateHierarchicalProperties = function (propDirty) {
        var newPropDirty = (this._hierarchicalPropsDirty ^ propDirty) & propDirty;
        if (!newPropDirty)
            return true;
        this._hierarchicalPropsDirty |= propDirty;
        if (newPropDirty & HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM) {
            this._inverseSceneTransformDirty = true;
            this._scenePositionDirty = true;
            if (this.isEntity)
                this.invalidatePartitionBounds();
            if (this._pParent)
                this._pParent._pInvalidateBounds();
            if (this._listenToSceneTransformChanged)
                this.queueDispatch(this._sceneTransformChanged || (this._sceneTransformChanged = new DisplayObjectEvent_1.DisplayObjectEvent(DisplayObjectEvent_1.DisplayObjectEvent.SCENETRANSFORM_CHANGED, this)));
        }
        return false;
    };
    /**
     * @protected
     */
    DisplayObject.prototype._iSetScene = function (scene, partition) {
        var sceneChanged = this._pScene != scene;
        if (this._pScene && this._pImplicitPartition) {
            //unregister partition from current scene
            this._pScene._iUnregisterPartition(this._pImplicitPartition);
            //unregister entity from current partition
            this._pImplicitPartition._iUnregisterEntity(this);
            //gc abstraction objects
            this.clear();
        }
        // assign parent implicit partition if no explicit one is given
        this._pImplicitPartition = this._explicitPartition || partition;
        //assign scene
        if (sceneChanged)
            this._pScene = scene;
        if (this._pScene && this._pImplicitPartition) {
            //register partition with scene
            this._pScene._iRegisterPartition(this._pImplicitPartition);
            //register entity with new partition
            this._pImplicitPartition._iRegisterEntity(this);
        }
        if (sceneChanged && this._listenToSceneChanged)
            this.queueDispatch(this._sceneChanged || (this._sceneChanged = new DisplayObjectEvent_1.DisplayObjectEvent(DisplayObjectEvent_1.DisplayObjectEvent.SCENE_CHANGED, this)));
    };
    /**
     * @protected
     */
    DisplayObject.prototype.pUpdateSceneTransform = function () {
        if (this._iController)
            this._iController.updateController();
        this._pSceneTransform.copyFrom(this._transform.matrix3D);
        if (this._pivot) {
            if (!this._pivotScale)
                this._pivotScale = new Vector3D_1.Vector3D();
            this._pivotScale.x = this._pivot.x / this._transform.scale.x;
            this._pivotScale.y = this._pivot.y / this._transform.scale.y;
            this._pivotScale.z = this._pivot.z / this._transform.scale.z;
            this._pSceneTransform.prependTranslation(-this._pivotScale.x, -this._pivotScale.y, -this._pivotScale.z);
            if (this.alignmentMode != AlignmentMode_1.AlignmentMode.PIVOT_POINT)
                this._pSceneTransform.appendTranslation(this._pivot.x, this._pivot.y, this._pivot.z);
        }
        if (this._pParent && !this._pParent._iIsRoot)
            this._pSceneTransform.append(this._pParent.sceneTransform);
        this._matrix3DDirty = false;
        this._positionDirty = false;
        this._rotationDirty = false;
        this._skewDirty = false;
        this._scaleDirty = false;
        this._hierarchicalPropsDirty ^= HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM;
    };
    /**
     *
     */
    DisplayObject.prototype._iInternalUpdate = function () {
        if (this._iController)
            this._iController.update();
        // Dispatch all queued events.
        var len = this._queuedEvents.length;
        for (var i = 0; i < len; ++i)
            this.dispatchEvent(this._queuedEvents[i]);
        this._queuedEvents.length = 0;
    };
    /**
     * @internal
     */
    DisplayObject.prototype._iIsVisible = function () {
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.VISIBLE)
            this._updateVisible();
        return this._pImplicitVisibility;
    };
    /**
     * @internal
     */
    DisplayObject.prototype._iAssignedMaskId = function () {
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.MASK_ID)
            this._updateMaskId();
        return this._pImplicitMaskId;
    };
    /**
     * @internal
     */
    DisplayObject.prototype._iAssignedMasks = function () {
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.MASKS)
            this._updateMasks();
        return this._pImplicitMasks;
    };
    DisplayObject.prototype._iMasksConfig = function () {
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.MASKS)
            this._updateMasks();
        return this._pImplicitMaskIds;
    };
    DisplayObject.prototype._iAssignedColorTransform = function () {
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.COLOR_TRANSFORM)
            this._updateColorTransform();
        return this._pImplicitColorTransform;
    };
    /**
     * @internal
     */
    DisplayObject.prototype._iIsMouseEnabled = function () {
        if (this._hierarchicalPropsDirty & HierarchicalProperties_1.HierarchicalProperties.MOUSE_ENABLED)
            this._updateMouseEnabled();
        return this._pImplicitMouseEnabled && this._explicitMouseEnabled;
    };
    DisplayObject.prototype._acceptTraverser = function (collector) {
        //nothing to do here
    };
    /**
     * Invalidates the 3D transformation matrix, causing it to be updated upon the next request
     *
     * @private
     */
    DisplayObject.prototype._onInvalidateMatrix3D = function (event) {
        if (this._matrix3DDirty)
            return;
        this._matrix3DDirty = true;
        this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.SCENE_TRANSFORM);
    };
    /**
     * @private
     */
    DisplayObject.prototype._onInvalidateColorTransform = function (event) {
        this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.COLOR_TRANSFORM);
    };
    DisplayObject.prototype._pInvalidateBounds = function () {
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
        if (this.isEntity)
            this.invalidatePartitionBounds();
        if (this._pParent)
            this._pParent._pInvalidateBounds();
    };
    DisplayObject.prototype._pUpdateBoxBounds = function () {
        this._boxBoundsInvalid = false;
        if (this._pBoxBounds == null)
            this._pBoxBounds = new Box_1.Box();
    };
    DisplayObject.prototype._pUpdateSphereBounds = function () {
        this._sphereBoundsInvalid = false;
        if (this._pSphereBounds == null)
            this._pSphereBounds = new Sphere_1.Sphere();
    };
    DisplayObject.prototype.queueDispatch = function (event) {
        // Store event to be dispatched later.
        this._queuedEvents.push(event);
    };
    DisplayObject.prototype._setScaleX = function (val) {
        if (this.scaleX == val)
            return;
        this._transform.scale.x = val;
        this._transform.invalidateMatrix3D();
    };
    DisplayObject.prototype._setScaleY = function (val) {
        if (this.scaleY == val)
            return;
        this._transform.scale.y = val;
        this._transform.invalidateMatrix3D();
    };
    DisplayObject.prototype._setScaleZ = function (val) {
        if (this.scaleZ == val)
            return;
        this._transform.scale.z = val;
        this._transform.invalidateMatrix3D();
    };
    DisplayObject.prototype._updateMouseEnabled = function () {
        this._pImplicitMouseEnabled = (this._pParent) ? this._pParent.mouseChildren && this._pParent._pImplicitMouseEnabled : true;
        // If there is a parent and this child does not have a picking collider, use its parent's picking collider.
        if (this._pImplicitMouseEnabled && this._pParent && !this.pickingCollider)
            this.pickingCollider = this._pParent.pickingCollider;
        this._hierarchicalPropsDirty ^= HierarchicalProperties_1.HierarchicalProperties.MOUSE_ENABLED;
    };
    DisplayObject.prototype._updateVisible = function () {
        this._pImplicitVisibility = (this._pParent) ? this._explicitVisibility && this._pParent._iIsVisible() : this._explicitVisibility;
        this._hierarchicalPropsDirty ^= HierarchicalProperties_1.HierarchicalProperties.VISIBLE;
    };
    DisplayObject.prototype._updateMaskId = function () {
        this._pImplicitMaskId = (this._pParent && this._pParent._iAssignedMaskId() != -1) ? this._pParent._iAssignedMaskId() : this._explicitMaskId;
        this._hierarchicalPropsDirty ^= HierarchicalProperties_1.HierarchicalProperties.MASK_ID;
    };
    DisplayObject.prototype._updateMasks = function () {
        this._pImplicitMasks = (this._pParent && this._pParent._iAssignedMasks()) ? (this._explicitMasks != null) ? this._pParent._iAssignedMasks().concat([this._explicitMasks]) : this._pParent._iAssignedMasks().concat() : (this._explicitMasks != null) ? [this._explicitMasks] : null;
        this._pImplicitMaskIds.length = 0;
        if (this._pImplicitMasks && this._pImplicitMasks.length) {
            var numLayers = this._pImplicitMasks.length;
            var numChildren;
            var implicitChildren;
            var implicitChildIds;
            for (var i = 0; i < numLayers; i++) {
                implicitChildren = this._pImplicitMasks[i];
                numChildren = implicitChildren.length;
                implicitChildIds = new Array();
                for (var j = 0; j < numChildren; j++)
                    implicitChildIds.push(implicitChildren[j].id);
                this._pImplicitMaskIds.push(implicitChildIds);
            }
        }
        this._hierarchicalPropsDirty ^= HierarchicalProperties_1.HierarchicalProperties.MASKS;
    };
    DisplayObject.prototype._updateColorTransform = function () {
        if (!this._pImplicitColorTransform)
            this._pImplicitColorTransform = new ColorTransform_1.ColorTransform();
        if (this._inheritColorTransform && this._pParent && this._pParent._iAssignedColorTransform()) {
            this._pImplicitColorTransform.copyFrom(this._pParent._iAssignedColorTransform());
            if (this._transform.colorTransform)
                this._pImplicitColorTransform.prepend(this._transform.colorTransform);
        }
        else {
            if (this._transform.colorTransform)
                this._pImplicitColorTransform.copyFrom(this._transform.colorTransform);
            else
                this._pImplicitColorTransform.clear();
        }
        this._hierarchicalPropsDirty ^= HierarchicalProperties_1.HierarchicalProperties.COLOR_TRANSFORM;
    };
    DisplayObject.prototype._updateMaskMode = function () {
        if (this.maskMode)
            this.mouseEnabled = false;
        this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.MASK_ID);
    };
    DisplayObject.prototype.clear = function () {
        _super.prototype.clear.call(this);
        var i;
        this._pImplicitColorTransform = null;
        this._pImplicitMasks = null;
    };
    DisplayObject.prototype.invalidatePartitionBounds = function () {
        this.dispatchEvent(new DisplayObjectEvent_1.DisplayObjectEvent(DisplayObjectEvent_1.DisplayObjectEvent.INVALIDATE_PARTITION_BOUNDS, this));
    };
    DisplayObject.prototype._hitTestPointInternal = function (x, y, shapeFlag, masksFlag) {
        return false;
    };
    return DisplayObject;
}(AssetBase_1.AssetBase));
exports.DisplayObject = DisplayObject;

},{"../base/AlignmentMode":"awayjs-display/lib/base/AlignmentMode","../base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","../base/OrientationMode":"awayjs-display/lib/base/OrientationMode","../base/Transform":"awayjs-display/lib/base/Transform","../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../events/DisplayObjectEvent":"awayjs-display/lib/events/DisplayObjectEvent","../events/TransformEvent":"awayjs-display/lib/events/TransformEvent","../pick/PickingCollision":"awayjs-display/lib/pick/PickingCollision","awayjs-core/lib/geom/Box":undefined,"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Sphere":undefined,"awayjs-core/lib/geom/Vector3D":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/display/IEntity":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/display/LightBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var DisplayObjectContainer_1 = require("../display/DisplayObjectContainer");
var LightEvent_1 = require("../events/LightEvent");
var LightBase = (function (_super) {
    __extends(LightBase, _super);
    function LightBase() {
        _super.call(this);
        this._color = 0xffffff;
        this._colorR = 1;
        this._colorG = 1;
        this._colorB = 1;
        this._ambientColor = 0xffffff;
        this._ambient = 0;
        this._iAmbientR = 0;
        this._iAmbientG = 0;
        this._iAmbientB = 0;
        this._specular = 1;
        this._iSpecularR = 1;
        this._iSpecularG = 1;
        this._iSpecularB = 1;
        this._diffuse = 1;
        this._iDiffuseR = 1;
        this._iDiffuseG = 1;
        this._iDiffuseB = 1;
        this._shadowsEnabled = false;
    }
    Object.defineProperty(LightBase.prototype, "shadowsEnabled", {
        get: function () {
            return this._shadowsEnabled;
        },
        set: function (value) {
            if (this._shadowsEnabled == value)
                return;
            this._shadowsEnabled = value;
            if (value) {
                if (this._shadowMapper == null)
                    this._shadowMapper = this.pCreateShadowMapper();
                this._shadowMapper.light = this;
            }
            else {
                this._shadowMapper.dispose();
                this._shadowMapper = null;
            }
            //*/
            this.dispatchEvent(new LightEvent_1.LightEvent(LightEvent_1.LightEvent.CASTS_SHADOW_CHANGE));
        },
        enumerable: true,
        configurable: true
    });
    LightBase.prototype.pCreateShadowMapper = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    Object.defineProperty(LightBase.prototype, "specular", {
        get: function () {
            return this._specular;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            this._specular = value;
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightBase.prototype, "diffuse", {
        get: function () {
            return this._diffuse;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            this._diffuse = value;
            this.updateDiffuse();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightBase.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            this._colorR = ((this._color >> 16) & 0xff) / 0xff;
            this._colorG = ((this._color >> 8) & 0xff) / 0xff;
            this._colorB = (this._color & 0xff) / 0xff;
            this.updateDiffuse();
            this.updateSpecular();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightBase.prototype, "ambient", {
        get: function () {
            return this._ambient;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            else if (value > 1)
                value = 1;
            this._ambient = value;
            this.updateAmbient();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightBase.prototype, "ambientColor", {
        get: function () {
            return this._ambientColor;
        },
        set: function (value) {
            this._ambientColor = value;
            this.updateAmbient();
        },
        enumerable: true,
        configurable: true
    });
    LightBase.prototype.updateAmbient = function () {
        this._iAmbientR = ((this._ambientColor >> 16) & 0xff) / 0xff * this._ambient;
        this._iAmbientG = ((this._ambientColor >> 8) & 0xff) / 0xff * this._ambient;
        this._iAmbientB = (this._ambientColor & 0xff) / 0xff * this._ambient;
    };
    LightBase.prototype.iGetObjectProjectionMatrix = function (entity, cameraTransform, target) {
        if (target === void 0) { target = null; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    LightBase.prototype.updateSpecular = function () {
        this._iSpecularR = this._colorR * this._specular;
        this._iSpecularG = this._colorG * this._specular;
        this._iSpecularB = this._colorB * this._specular;
    };
    LightBase.prototype.updateDiffuse = function () {
        this._iDiffuseR = this._colorR * this._diffuse;
        this._iDiffuseG = this._colorG * this._diffuse;
        this._iDiffuseB = this._colorB * this._diffuse;
    };
    Object.defineProperty(LightBase.prototype, "shadowMapper", {
        get: function () {
            return this._shadowMapper;
        },
        set: function (value) {
            this._shadowMapper = value;
            this._shadowMapper.light = this;
        },
        enumerable: true,
        configurable: true
    });
    return LightBase;
}(DisplayObjectContainer_1.DisplayObjectContainer));
exports.LightBase = LightBase;

},{"../display/DisplayObjectContainer":"awayjs-display/lib/display/DisplayObjectContainer","../events/LightEvent":"awayjs-display/lib/events/LightEvent","awayjs-core/lib/errors/AbstractMethodError":undefined}],"awayjs-display/lib/display/LightProbe":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SamplerCube_1 = require("awayjs-core/lib/image/SamplerCube");
var ErrorBase_1 = require("awayjs-core/lib/errors/ErrorBase");
var LightBase_1 = require("../display/LightBase");
var BoundsType_1 = require("../bounds/BoundsType");
var LightProbe = (function (_super) {
    __extends(LightProbe, _super);
    function LightProbe(diffuseMap, specularMap) {
        if (specularMap === void 0) { specularMap = null; }
        _super.call(this);
        this.diffuseSampler = new SamplerCube_1.SamplerCube();
        this.specularSampler = new SamplerCube_1.SamplerCube();
        this._pIsEntity = true;
        this.diffuseMap = diffuseMap;
        this.specularMap = specularMap;
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.NULL;
    }
    Object.defineProperty(LightProbe.prototype, "assetType", {
        get: function () {
            return LightProbe.assetType;
        },
        enumerable: true,
        configurable: true
    });
    //@override
    LightProbe.prototype.iGetObjectProjectionMatrix = function (entity, cameraTransform, target) {
        if (target === void 0) { target = null; }
        throw new ErrorBase_1.ErrorBase("Object projection matrices are not supported for LightProbe objects!");
    };
    LightProbe.assetType = "[light LightProbe]";
    return LightProbe;
}(LightBase_1.LightBase));
exports.LightProbe = LightProbe;

},{"../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/LightBase":"awayjs-display/lib/display/LightBase","awayjs-core/lib/errors/ErrorBase":undefined,"awayjs-core/lib/image/SamplerCube":undefined}],"awayjs-display/lib/display/LineSegment":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject_1 = require("../display/DisplayObject");
var BoundsType_1 = require("../bounds/BoundsType");
var RenderableEvent_1 = require("../events/RenderableEvent");
var StyleEvent_1 = require("../events/StyleEvent");
/**
 * A Line Segment primitive.
 */
var LineSegment = (function (_super) {
    __extends(LineSegment, _super);
    /**
     * Create a line segment
     *
     * @param startPosition Start position of the line segment
     * @param endPosition Ending position of the line segment
     * @param thickness Thickness of the line
     */
    function LineSegment(material, startPosition, endPosition, thickness) {
        var _this = this;
        if (thickness === void 0) { thickness = 1; }
        _super.call(this);
        this._onInvalidatePropertiesDelegate = function (event) { return _this._onInvalidateProperties(event); };
        this._pIsEntity = true;
        this.material = material;
        this._startPosition = startPosition;
        this._endPosition = endPosition;
        this._halfThickness = thickness * 0.5;
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.AXIS_ALIGNED_BOX;
    }
    Object.defineProperty(LineSegment.prototype, "animator", {
        /**
         * Defines the animator of the line segment. Act on the line segment's geometry. Defaults to null
         */
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return LineSegment.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "startPostion", {
        /**
         *
         */
        get: function () {
            return this._startPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "startPosition", {
        set: function (value) {
            if (this._startPosition == value)
                return;
            this._startPosition = value;
            this.invalidateElements();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "endPosition", {
        /**
         *
         */
        get: function () {
            return this._endPosition;
        },
        set: function (value) {
            if (this._endPosition == value)
                return;
            this._endPosition = value;
            this.invalidateElements();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "material", {
        /**
         *
         */
        get: function () {
            return this._material;
        },
        set: function (value) {
            if (this.material)
                this.material.iRemoveOwner(this);
            this._material = value;
            if (this.material)
                this.material.iAddOwner(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "thickness", {
        /**
         *
         */
        get: function () {
            return this._halfThickness * 2;
        },
        set: function (value) {
            if (this._halfThickness == value)
                return;
            this._halfThickness = value * 0.5;
            this.invalidateElements();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSegment.prototype, "style", {
        /**
         * The style used to render the current LineSegment. If set to null, the default style of the material will be used instead.
         */
        get: function () {
            return this._style;
        },
        set: function (value) {
            if (this._style == value)
                return;
            if (this._style)
                this._style.removeEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._style = value;
            if (this._style)
                this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this.invalidateSurface();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     */
    LineSegment.prototype._pUpdateBoxBounds = function () {
        _super.prototype._pUpdateBoxBounds.call(this);
        this._pBoxBounds.x = Math.min(this._startPosition.x, this._endPosition.x);
        this._pBoxBounds.y = Math.min(this._startPosition.y, this._endPosition.y);
        this._pBoxBounds.z = Math.min(this._startPosition.z, this._endPosition.z);
        this._pBoxBounds.width = Math.abs(this._startPosition.x - this._endPosition.x);
        this._pBoxBounds.height = Math.abs(this._startPosition.y - this._endPosition.y);
        this._pBoxBounds.depth = Math.abs(this._startPosition.z - this._endPosition.z);
    };
    LineSegment.prototype._pUpdateSphereBounds = function () {
        _super.prototype._pUpdateSphereBounds.call(this);
        this._pUpdateBoxBounds();
        var halfWidth = (this._endPosition.x - this._startPosition.x) / 2;
        var halfHeight = (this._endPosition.y - this._startPosition.y) / 2;
        var halfDepth = (this._endPosition.z - this._startPosition.z) / 2;
        this._pSphereBounds.x = this._startPosition.x + halfWidth;
        this._pSphereBounds.y = this._startPosition.y + halfHeight;
        this._pSphereBounds.z = this._startPosition.z + halfDepth;
        this._pSphereBounds.radius = Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight + halfDepth * halfDepth);
    };
    /**
     * @private
     */
    LineSegment.prototype.invalidateElements = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_ELEMENTS, this)); //TODO improve performance by only using one geometry for all line segments
    };
    LineSegment.prototype.invalidateSurface = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_SURFACE, this));
    };
    LineSegment.prototype._onInvalidateProperties = function (event) {
        this.invalidateSurface();
    };
    /**
     * //TODO
     *
     * @param shortestCollisionDistance
     * @param findClosest
     * @returns {boolean}
     *
     * @internal
     */
    LineSegment.prototype._iTestCollision = function (pickingCollision, pickingCollider) {
        return false; //TODO: detect line collisions
    };
    LineSegment.prototype._acceptTraverser = function (traverser) {
        traverser.applyRenderable(this);
    };
    LineSegment.assetType = "[asset LineSegment]";
    return LineSegment;
}(DisplayObject_1.DisplayObject));
exports.LineSegment = LineSegment;

},{"../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/DisplayObject":"awayjs-display/lib/display/DisplayObject","../events/RenderableEvent":"awayjs-display/lib/events/RenderableEvent","../events/StyleEvent":"awayjs-display/lib/events/StyleEvent"}],"awayjs-display/lib/display/LoaderContainer":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetLibraryBundle_1 = require("awayjs-core/lib/library/AssetLibraryBundle");
var Loader_1 = require("awayjs-core/lib/library/Loader");
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var URLLoaderEvent_1 = require("awayjs-core/lib/events/URLLoaderEvent");
var LoaderEvent_1 = require("awayjs-core/lib/events/LoaderEvent");
var ParserEvent_1 = require("awayjs-core/lib/events/ParserEvent");
var DisplayObjectContainer_1 = require("../display/DisplayObjectContainer");
/**
 * The LoaderContainer class is used to load SWF files or image(JPG, PNG, or GIF)
 * files. Use the <code>load()</code> method to initiate loading. The loaded
 * display object is added as a child of the LoaderContainer object.
 *
 * <p>Use the URLLoader class to load text or binary data.</p>
 *
 * <p>The LoaderContainer class overrides the following methods that it inherits,
 * because a LoaderContainer object can only have one child display object - the
 * display object that it loads. Calling the following methods throws an
 * exception: <code>addChild()</code>, <code>addChildAt()</code>,
 * <code>removeChild()</code>, <code>removeChildAt()</code>, and
 * <code>setChildIndex()</code>. To remove a loaded display object, you must
 * remove the <i>LoaderContainer</i> object from its parent DisplayObjectContainer
 * child array. </p>
 *
 * <p><b>Note:</b> The ActionScript 2.0 MovieClipLoader and LoadVars classes
 * are not used in ActionScript 3.0. The LoaderContainer and URLLoader classes replace
 * them.</p>
 *
 * <p>When you use the LoaderContainer class, consider the Flash Player and Adobe AIR
 * security model: </p>
 *
 * <ul>
 *   <li>You can load content from any accessible source. </li>
 *   <li>Loading is not allowed if the calling SWF file is in a network
 * sandbox and the file to be loaded is local. </li>
 *   <li>If the loaded content is a SWF file written with ActionScript 3.0, it
 * cannot be cross-scripted by a SWF file in another security sandbox unless
 * that cross-scripting arrangement was approved through a call to the
 * <code>System.allowDomain()</code> or the
 * <code>System.allowInsecureDomain()</code> method in the loaded content
 * file.</li>
 *   <li>If the loaded content is an AVM1 SWF file(written using ActionScript
 * 1.0 or 2.0), it cannot be cross-scripted by an AVM2 SWF file(written using
 * ActionScript 3.0). However, you can communicate between the two SWF files
 * by using the LocalConnection class.</li>
 *   <li>If the loaded content is an image, its data cannot be accessed by a
 * SWF file outside of the security sandbox, unless the domain of that SWF
 * file was included in a URL policy file at the origin domain of the
 * image.</li>
 *   <li>Movie clips in the local-with-file-system sandbox cannot script movie
 * clips in the local-with-networking sandbox, and the reverse is also
 * prevented. </li>
 *   <li>You cannot connect to commonly reserved ports. For a complete list of
 * blocked ports, see "Restricting Networking APIs" in the <i>ActionScript 3.0
 * Developer's Guide</i>. </li>
 * </ul>
 *
 * <p>However, in AIR, content in the <code>application</code> security
 * sandbox(content installed with the AIR application) are not restricted by
 * these security limitations.</p>
 *
 * <p>For more information related to security, see the Flash Player Developer
 * Center Topic: <a href="http://www.adobe.com/go/devnet_security_en"
 * scope="external">Security</a>.</p>
 *
 * <p>When loading a SWF file from an untrusted source(such as a domain other
 * than that of the LoaderContainer object's root SWF file), you may want to define a
 * mask for the LoaderContainer object, to prevent the loaded content(which is a child
 * of the LoaderContainer object) from drawing to portions of the Stage outside of that
 * mask, as shown in the following code:</p>
 */
var LoaderContainer = (function (_super) {
    __extends(LoaderContainer, _super);
    /**
     * Creates a Loader object that you can use to load files, such as SWF, JPEG,
     * GIF, or PNG files. Call the <code>load()</code> method to load the asset
     * as a child of the Loader instance. You can then add the Loader object to
     * the display list(for instance, by using the <code>addChild()</code>
     * method of a DisplayObjectContainer instance). The asset appears on the
     * Stage as it loads.
     *
     * <p>You can also use a Loader instance "offlist," that is without adding it
     * to a display object container on the display list. In this mode, the
     * Loader instance might be used to load a SWF file that contains additional
     * modules of an application. </p>
     *
     * <p>To detect when the SWF file is finished loading, you can use the events
     * of the LoaderInfo object associated with the
     * <code>contentLoaderInfo</code> property of the Loader object. At that
     * point, the code in the module SWF file can be executed to initialize and
     * start the module. In the offlist mode, a Loader instance might also be
     * used to load a SWF file that contains components or media assets. Again,
     * you can use the LoaderInfo object event notifications to detect when the
     * components are finished loading. At that point, the application can start
     * using the components and media assets in the library of the SWF file by
     * instantiating the ActionScript 3.0 classes that represent those components
     * and assets.</p>
     *
     * <p>To determine the status of a Loader object, monitor the following
     * events that the LoaderInfo object associated with the
     * <code>contentLoaderInfo</code> property of the Loader object:</p>
     *
     * <ul>
     *   <li>The <code>open</code> event is dispatched when loading begins.</li>
     *   <li>The <code>ioError</code> or <code>securityError</code> event is
     * dispatched if the file cannot be loaded or if an error occured during the
     * load process. </li>
     *   <li>The <code>progress</code> event fires continuously while the file is
     * being loaded.</li>
     *   <li>The <code>complete</code> event is dispatched when a file completes
     * downloading, but before the loaded movie clip's methods and properties are
     * available. </li>
     *   <li>The <code>init</code> event is dispatched after the properties and
     * methods of the loaded SWF file are accessible, so you can begin
     * manipulating the loaded SWF file. This event is dispatched before the
     * <code>complete</code> handler. In streaming SWF files, the
     * <code>init</code> event can occur significantly earlier than the
     * <code>complete</code> event. For most purposes, use the <code>init</code>
     * handler.</li>
     * </ul>
     */
    function LoaderContainer(useAssetLibrary, assetLibraryId) {
        var _this = this;
        if (useAssetLibrary === void 0) { useAssetLibrary = true; }
        if (assetLibraryId === void 0) { assetLibraryId = null; }
        _super.call(this);
        this._useAssetLib = useAssetLibrary;
        this._assetLibId = assetLibraryId;
        this._onAssetCompleteDelegate = function (event) { return _this.onAssetComplete(event); };
        this._onTextureSizeErrorDelegate = function (event) { return _this.onTextureSizeError(event); };
        this._onLoadCompleteDelegate = function (event) { return _this.onLoadComplete(event); };
        this._onLoadErrorDelegate = function (event) { return _this.onLoadError(event); };
        this._onParseErrorDelegate = function (event) { return _this.onParseError(event); };
    }
    Object.defineProperty(LoaderContainer.prototype, "content", {
        /**
         * Contains the root display object of the SWF file or image(JPG, PNG, or
         * GIF) file that was loaded by using the <code>load()</code> or
         * <code>loadBytes()</code> methods.
         *
         * @throws SecurityError The loaded SWF file or image file belongs to a
         *                       security sandbox to which you do not have access.
         *                       For a loaded SWF file, you can avoid this situation
         *                       by having the file call the
         *                       <code>Security.allowDomain()</code> method or by
         *                       having the loading file specify a
         *                       <code>loaderContext</code> parameter with its
         *                       <code>securityDomain</code> property set to
         *                       <code>SecurityDomain.currentDomain</code> when you
         *                       call the <code>load()</code> or
         *                       <code>loadBytes()</code> method.
         */
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cancels a <code>load()</code> method operation that is currently in
     * progress for the Loader instance.
     *
     */
    LoaderContainer.prototype.close = function () {
        if (!this._loader)
            return;
        if (this._useAssetLib) {
            var lib;
            lib = AssetLibraryBundle_1.AssetLibraryBundle.getInstance(this._assetLibId);
            lib.disposeLoader(this._loader);
        }
        this._disposeLoader();
    };
    /**
     * Loads a SWF, JPEG, progressive JPEG, unanimated GIF, or PNG file into an
     * object that is a child of this Loader object. If you load an animated GIF
     * file, only the first frame is displayed. As the Loader object can contain
     * only a single child, issuing a subsequent <code>load()</code> request
     * terminates the previous request, if still pending, and commences a new
     * load.
     *
     * <p><b>Note</b>: In AIR 1.5 and Flash Player 10, the maximum size for a
     * loaded image is 8,191 pixels in width or height, and the total number of
     * pixels cannot exceed 16,777,215 pixels.(So, if an loaded image is 8,191
     * pixels wide, it can only be 2,048 pixels high.) In Flash Player 9 and
     * earlier and AIR 1.1 and earlier, the limitation is 2,880 pixels in height
     * and 2,880 pixels in width.</p>
     *
     * <p>A SWF file or image loaded into a Loader object inherits the position,
     * rotation, and scale properties of the parent display objects of the Loader
     * object. </p>
     *
     * <p>Use the <code>unload()</code> method to remove movies or images loaded
     * with this method, or to cancel a load operation that is in progress.</p>
     *
     * <p>You can prevent a SWF file from using this method by setting the
     * <code>allowNetworking</code> parameter of the the <code>object</code> and
     * <code>embed</code> tags in the HTML page that contains the SWF
     * content.</p>
     *
     * <p>When you use this method, consider the Flash Player security model,
     * which is described in the Loader class description. </p>
     *
     * <p> In Flash Player 10 and later, if you use a multipart Content-Type(for
     * example "multipart/form-data") that contains an upload(indicated by a
     * "filename" parameter in a "content-disposition" header within the POST
     * body), the POST operation is subject to the security rules applied to
     * uploads:</p>
     *
     * <ul>
     *   <li>The POST operation must be performed in response to a user-initiated
     * action, such as a mouse click or key press.</li>
     *   <li>If the POST operation is cross-domain(the POST target is not on the
     * same server as the SWF file that is sending the POST request), the target
     * server must provide a URL policy file that permits cross-domain
     * access.</li>
     * </ul>
     *
     * <p>Also, for any multipart Content-Type, the syntax must be valid
     * (according to the RFC2046 standard). If the syntax appears to be invalid,
     * the POST operation is subject to the security rules applied to
     * uploads.</p>
     *
     * <p>For more information related to security, see the Flash Player
     * Developer Center Topic: <a
     * href="http://www.adobe.com/go/devnet_security_en"
     * scope="external">Security</a>.</p>
     *
     * @param request The absolute or relative URL of the SWF, JPEG, GIF, or PNG
     *                file to be loaded. A relative path must be relative to the
     *                main SWF file. Absolute URLs must include the protocol
     *                reference, such as http:// or file:///. Filenames cannot
     *                include disk drive specifications.
     * @param context A LoaderContext object, which has properties that define
     *                the following:
     *                <ul>
     *                  <li>Whether or not to check for the existence of a policy
     *                file upon loading the object</li>
     *                  <li>The ApplicationDomain for the loaded object</li>
     *                  <li>The SecurityDomain for the loaded object</li>
     *                  <li>The ImageDecodingPolicy for the loaded image
     *                object</li>
     *                </ul>
     *
     *                <p>If the <code>context</code> parameter is not specified
     *                or refers to a null object, the loaded content remains in
     *                its own security domain.</p>
     *
     *                <p>For complete details, see the description of the
     *                properties in the <a
     *                href="../system/LoaderContext.html">LoaderContext</a>
     *                class.</p>
     * @param ns      An optional namespace string under which the file is to be
     *                loaded, allowing the differentiation of two resources with
     *                identical assets.
     * @param parser  An optional parser object for translating the loaded data
     *                into a usable resource. If not provided, Loader will
     *                attempt to auto-detect the file type.
     * @throws IOError               The <code>digest</code> property of the
     *                               <code>request</code> object is not
     *                               <code>null</code>. You should only set the
     *                               <code>digest</code> property of a URLRequest
     *                               object when calling the
     *                               <code>URLLoader.load()</code> method when
     *                               loading a SWZ file(an Adobe platform
     *                               component).
     * @throws IllegalOperationError If the <code>requestedContentParent</code>
     *                               property of the <code>context</code>
     *                               parameter is a <code>Loader</code>.
     * @throws IllegalOperationError If the <code>LoaderContext.parameters</code>
     *                               parameter is set to non-null and has some
     *                               values which are not Strings.
     * @throws SecurityError         The value of
     *                               <code>LoaderContext.securityDomain</code>
     *                               must be either <code>null</code> or
     *                               <code>SecurityDomain.currentDomain</code>.
     *                               This reflects the fact that you can only
     *                               place the loaded media in its natural
     *                               security sandbox or your own(the latter
     *                               requires a policy file).
     * @throws SecurityError         Local SWF files may not set
     *                               LoaderContext.securityDomain to anything
     *                               other than <code>null</code>. It is not
     *                               permitted to import non-local media into a
     *                               local sandbox, or to place other local media
     *                               in anything other than its natural sandbox.
     * @throws SecurityError         You cannot connect to commonly reserved
     *                               ports. For a complete list of blocked ports,
     *                               see "Restricting Networking APIs" in the
     *                               <i>ActionScript 3.0 Developer's Guide</i>.
     * @throws SecurityError         If the <code>applicationDomain</code> or
     *                               <code>securityDomain</code> properties of
     *                               the <code>context</code> parameter are from
     *                               a disallowed domain.
     * @throws SecurityError         If a local SWF file is attempting to use the
     *                               <code>securityDomain</code> property of the
     *                               <code>context</code> parameter.
     * @event asyncError    Dispatched by the <code>contentLoaderInfo</code>
     *                      object if the
     *                      <code>LoaderContext.requestedContentParent</code>
     *                      property has been specified and it is not possible to
     *                      add the loaded content as a child to the specified
     *                      DisplayObjectContainer. This could happen if the
     *                      loaded content is a
     *                      <code>flash.display.AVM1Movie</code> or if the
     *                      <code>addChild()</code> call to the
     *                      requestedContentParent throws an error.
     * @event complete      Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the file has completed loading. The
     *                      <code>complete</code> event is always dispatched
     *                      after the <code>init</code> event.
     * @event httpStatus    Dispatched by the <code>contentLoaderInfo</code>
     *                      object when a network request is made over HTTP and
     *                      Flash Player can detect the HTTP status code.
     * @event init          Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the properties and methods of the loaded
     *                      SWF file are accessible. The <code>init</code> event
     *                      always precedes the <code>complete</code> event.
     * @event ioError       Dispatched by the <code>contentLoaderInfo</code>
     *                      object when an input or output error occurs that
     *                      causes a load operation to fail.
     * @event open          Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the loading operation starts.
     * @event progress      Dispatched by the <code>contentLoaderInfo</code>
     *                      object as data is received while load operation
     *                      progresses.
     * @event securityError Dispatched by the <code>contentLoaderInfo</code>
     *                      object if a SWF file in the local-with-filesystem
     *                      sandbox attempts to load content in the
     *                      local-with-networking sandbox, or vice versa.
     * @event securityError Dispatched by the <code>contentLoaderInfo</code>
     *                      object if the
     *                      <code>LoaderContext.requestedContentParent</code>
     *                      property has been specified and the security sandbox
     *                      of the
     *                      <code>LoaderContext.requestedContentParent</code>
     *                      does not have access to the loaded SWF.
     * @event unload        Dispatched by the <code>contentLoaderInfo</code>
     *                      object when a loaded object is removed.
     */
    LoaderContainer.prototype.load = function (request, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        this._getLoader().load(request, context, ns, parser);
    };
    /**
     * Loads from binary data stored in a ByteArray object.
     *
     * <p>The <code>loadBytes()</code> method is asynchronous. You must wait for
     * the "init" event before accessing the properties of a loaded object.</p>
     *
     * <p>When you use this method, consider the Flash Player security model,
     * which is described in the Loader class description. </p>
     *
     * @param bytes   A ByteArray object. The contents of the ByteArray can be
     *                any of the file formats supported by the Loader class: SWF,
     *                GIF, JPEG, or PNG.
     * @param context A LoaderContext object. Only the
     *                <code>applicationDomain</code> property of the
     *                LoaderContext object applies; the
     *                <code>checkPolicyFile</code> and
     *                <code>securityDomain</code> properties of the LoaderContext
     *                object do not apply.
     *
     *                <p>If the <code>context</code> parameter is not specified
     *                or refers to a null object, the content is loaded into the
     *                current security domain -  a process referred to as "import
     *                loading" in Flash Player security documentation.
     *                Specifically, if the loading SWF file trusts the remote SWF
     *                by incorporating the remote SWF into its code, then the
     *                loading SWF can import it directly into its own security
     *                domain.</p>
     *
     *                <p>For more information related to security, see the Flash
     *                Player Developer Center Topic: <a
     *                href="http://www.adobe.com/go/devnet_security_en"
     *                scope="external">Security</a>.</p>
     * @throws ArgumentError         If the <code>length</code> property of the
     *                               ByteArray object is not greater than 0.
     * @throws IllegalOperationError If the <code>checkPolicyFile</code> or
     *                               <code>securityDomain</code> property of the
     *                               <code>context</code> parameter are non-null.
     * @throws IllegalOperationError If the <code>requestedContentParent</code>
     *                               property of the <code>context</code>
     *                               parameter is a <code>Loader</code>.
     * @throws IllegalOperationError If the <code>LoaderContext.parameters</code>
     *                               parameter is set to non-null and has some
     *                               values which are not Strings.
     * @throws SecurityError         If the provided
     *                               <code>applicationDomain</code> property of
     *                               the <code>context</code> property is from a
     *                               disallowed domain.
     * @throws SecurityError         You cannot connect to commonly reserved
     *                               ports. For a complete list of blocked ports,
     *                               see "Restricting Networking APIs" in the
     *                               <i>ActionScript 3.0 Developer's Guide</i>.
     * @event asyncError    Dispatched by the <code>contentLoaderInfo</code>
     *                      object if the
     *                      <code>LoaderContext.requestedContentParent</code>
     *                      property has been specified and it is not possible to
     *                      add the loaded content as a child to the specified
     *                      DisplayObjectContainer. This could happen if the
     *                      loaded content is a
     *                      <code>flash.display.AVM1Movie</code> or if the
     *                      <code>addChild()</code> call to the
     *                      requestedContentParent throws an error.
     * @event complete      Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the operation is complete. The
     *                      <code>complete</code> event is always dispatched
     *                      after the <code>init</code> event.
     * @event init          Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the properties and methods of the loaded
     *                      data are accessible. The <code>init</code> event
     *                      always precedes the <code>complete</code> event.
     * @event ioError       Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the runtime cannot parse the data in the
     *                      byte array.
     * @event open          Dispatched by the <code>contentLoaderInfo</code>
     *                      object when the operation starts.
     * @event progress      Dispatched by the <code>contentLoaderInfo</code>
     *                      object as data is transfered in memory.
     * @event securityError Dispatched by the <code>contentLoaderInfo</code>
     *                      object if the
     *                      <code>LoaderContext.requestedContentParent</code>
     *                      property has been specified and the security sandbox
     *                      of the
     *                      <code>LoaderContext.requestedContentParent</code>
     *                      does not have access to the loaded SWF.
     * @event unload        Dispatched by the <code>contentLoaderInfo</code>
     *                      object when a loaded object is removed.
     */
    LoaderContainer.prototype.loadData = function (data, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        this._getLoader().loadData(data, '', context, ns, parser);
    };
    LoaderContainer.prototype._getLoader = function () {
        if (this._useAssetLib) {
            var lib = AssetLibraryBundle_1.AssetLibraryBundle.getInstance(this._assetLibId);
            this._loader = lib.getLoader();
        }
        else {
            this._loader = new Loader_1.Loader();
        }
        this._loader.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, this._onLoadCompleteDelegate);
        this._loader.addEventListener(AssetEvent_1.AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
        this._loader.addEventListener(AssetEvent_1.AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
        // Error are handled separately (see documentation for addErrorHandler)
        this._loader._iAddErrorHandler(this._onLoadErrorDelegate);
        this._loader._iAddParseErrorHandler(this._onParseErrorDelegate);
        return this._loader;
    };
    LoaderContainer.prototype._disposeLoader = function () {
        this._loader.removeEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, this._onLoadCompleteDelegate);
        this._loader.removeEventListener(AssetEvent_1.AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
        this._loader.removeEventListener(AssetEvent_1.AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
        if (!this._useAssetLib)
            this._loader.stop();
        this._loader = null;
    };
    /**
     * Removes a child of this Loader object that was loaded by using the
     * <code>load()</code> method. The <code>property</code> of the associated
     * LoaderInfo object is reset to <code>null</code>. The child is not
     * necessarily destroyed because other objects might have references to it;
     * however, it is no longer a child of the Loader object.
     *
     * <p>As a best practice, before you unload a child SWF file, you should
     * explicitly close any streams in the child SWF file's objects, such as
     * LocalConnection, NetConnection, NetStream, and Sound objects. Otherwise,
     * audio in the child SWF file might continue to play, even though the child
     * SWF file was unloaded. To close streams in the child SWF file, add an
     * event listener to the child that listens for the <code>unload</code>
     * event. When the parent calls <code>Loader.unload()</code>, the
     * <code>unload</code> event is dispatched to the child. The following code
     * shows how you might do this:</p>
     * <pre xml:space="preserve"> public closeAllStreams(evt:Event) {
     * myNetStream.close(); mySound.close(); myNetConnection.close();
     * myLocalConnection.close(); }
     * myMovieClip.loaderInfo.addEventListener(Event.UNLOAD,
     * closeAllStreams);</pre>
     *
     */
    LoaderContainer.prototype.unload = function () {
        //TODO
    };
    /**
     * Enables a specific parser.
     * When no specific parser is set for a loading/parsing opperation,
     * loader3d can autoselect the correct parser to use.
     * A parser must have been enabled, to be considered when autoselecting the parser.
     *
     * @param parserClass The parser class to enable.
     * @see away.parsers.Parsers
     */
    LoaderContainer.enableParser = function (parserClass) {
        Loader_1.Loader.enableParser(parserClass);
    };
    /**
     * Enables a list of parsers.
     * When no specific parser is set for a loading/parsing opperation,
     * loader3d can autoselect the correct parser to use.
     * A parser must have been enabled, to be considered when autoselecting the parser.
     *
     * @param parserClasses A Vector of parser classes to enable.
     * @see away.parsers.Parsers
     */
    LoaderContainer.enableParsers = function (parserClasses) {
        Loader_1.Loader.enableParsers(parserClasses);
    };
    LoaderContainer.prototype.onAssetComplete = function (event) {
        this.dispatchEvent(event);
    };
    /**
     * Called when an error occurs during loading
     */
    LoaderContainer.prototype.onLoadError = function (event) {
        if (this.hasEventListener(URLLoaderEvent_1.URLLoaderEvent.LOAD_ERROR)) {
            this.dispatchEvent(event);
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Called when a an error occurs during parsing
     */
    LoaderContainer.prototype.onParseError = function (event) {
        if (this.hasEventListener(ParserEvent_1.ParserEvent.PARSE_ERROR)) {
            this.dispatchEvent(event);
            return true;
        }
        else {
            return false;
        }
    };
    LoaderContainer.prototype.onTextureSizeError = function (event) {
        this.dispatchEvent(event);
    };
    /**
     * Called when the resource and all of its dependencies was retrieved.
     */
    LoaderContainer.prototype.onLoadComplete = function (event) {
        this._content = event.content;
        if (this._content)
            this.addChild(this._content);
        this.dispatchEvent(event);
        this._disposeLoader();
    };
    return LoaderContainer;
}(DisplayObjectContainer_1.DisplayObjectContainer));
exports.LoaderContainer = LoaderContainer;

},{"../display/DisplayObjectContainer":"awayjs-display/lib/display/DisplayObjectContainer","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/events/LoaderEvent":undefined,"awayjs-core/lib/events/ParserEvent":undefined,"awayjs-core/lib/events/URLLoaderEvent":undefined,"awayjs-core/lib/library/AssetLibraryBundle":undefined,"awayjs-core/lib/library/Loader":undefined}],"awayjs-display/lib/display/MovieClip":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var Sprite_1 = require("../display/Sprite");
var TextField_1 = require("../display/TextField");
var MouseEvent_1 = require("../events/MouseEvent");
var Timeline_1 = require("../base/Timeline");
var FrameScriptManager_1 = require("../managers/FrameScriptManager");
var MovieClip = (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip(timeline) {
        var _this = this;
        if (timeline === void 0) { timeline = null; }
        _super.call(this);
        this._isButton = false;
        this._time = 0; // the current time inside the animation
        this._currentFrameIndex = -1; // the current frame
        this._isPlaying = true; // false if paused or stopped
        this._isInit = true;
        this._potentialInstances = [];
        this._depth_sessionIDs = {};
        this._sessionID_childs = {};
        /**
         *
         */
        this.loop = true;
        /**
         * the current index of the current active frame
         */
        this.constructedKeyFrameIndex = -1;
        this._enterFrame = new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.ENTER_FRAME, this);
        this.inheritColorTransform = true;
        this._onMouseOver = function (event) { return _this.currentFrameIndex = 1; };
        this._onMouseOut = function (event) { return _this.currentFrameIndex = 0; };
        this._onMouseDown = function (event) { return _this.currentFrameIndex = 2; };
        this._onMouseUp = function (event) { return _this.currentFrameIndex = _this.currentFrameIndex == 0 ? 0 : 1; };
        this._timeline = timeline || new Timeline_1.Timeline();
    }
    Object.defineProperty(MovieClip.prototype, "adapter", {
        /**
         * adapter is used to provide MovieClip to scripts taken from different platforms
         * setter typically managed by factory
         */
        get: function () {
            return this._adapter;
        },
        set: function (value) {
            this._adapter = value;
        },
        enumerable: true,
        configurable: true
    });
    MovieClip.prototype.dispose = function () {
        this.disposeValues();
        MovieClip._movieClips.push(this);
    };
    MovieClip.prototype.disposeValues = function () {
        _super.prototype.disposeValues.call(this);
        this._potentialInstances = [];
        this._depth_sessionIDs = {};
        this._sessionID_childs = {};
    };
    MovieClip.prototype.reset_textclones = function () {
        if (this.timeline) {
            var len = this._potentialInstances.length;
            for (var i = 0; i < len; i++) {
                if (this._potentialInstances[i] != null) {
                    if (this._potentialInstances[i].isAsset(TextField_1.TextField))
                        this._potentialInstances[i].text = this.timeline.getPotentialChildPrototype(i).text;
                    else if (this._potentialInstances[i].isAsset(MovieClip))
                        this._potentialInstances[i].reset_textclones();
                }
            }
        }
    };
    Object.defineProperty(MovieClip.prototype, "isInit", {
        get: function () {
            return this._isInit;
        },
        set: function (value) {
            this._isInit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MovieClip.prototype, "timeline", {
        get: function () {
            return this._timeline;
        },
        set: function (value) {
            this._timeline = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MovieClip.prototype, "numFrames", {
        get: function () {
            return this._timeline.numFrames;
        },
        enumerable: true,
        configurable: true
    });
    MovieClip.prototype.jumpToLabel = function (label) {
        // the timeline.jumpTolabel will set currentFrameIndex
        this._timeline.jumpToLabel(this, label);
    };
    MovieClip.prototype.reset = function () {
        _super.prototype.reset.call(this);
        // time only is relevant for the root mc, as it is the only one that executes the update function
        this._time = 0;
        if (this.adapter)
            this.adapter.freeFromScript();
        this.constructedKeyFrameIndex = -1;
        for (var i = this.numChildren - 1; i >= 0; i--)
            this.removeChildAt(i);
        this._skipAdvance = MovieClip._skipAdvance;
        var numFrames = this._timeline.keyframe_indices.length;
        this._isPlaying = Boolean(numFrames > 1);
        if (numFrames) {
            this._currentFrameIndex = 0;
            this._timeline.constructNextFrame(this, true, true);
        }
        else {
            this._currentFrameIndex = -1;
        }
    };
    MovieClip.prototype.resetSessionIDs = function () {
        this._depth_sessionIDs = {};
    };
    Object.defineProperty(MovieClip.prototype, "currentFrameIndex", {
        /*
        * Setting the currentFrameIndex will move the playhead for this movieclip to the new position
         */
        get: function () {
            return this._currentFrameIndex;
        },
        set: function (value) {
            //if currentFrame is set greater than the available number of
            //frames, the playhead is moved to the last frame in the timeline.
            //But because the frame specified was not a keyframe, no scripts are
            //executed, even if they exist on the last frame.
            var skip_script = false;
            var numFrames = this._timeline.keyframe_indices.length;
            if (!numFrames)
                return;
            if (value < 0) {
                value = 0;
            }
            else if (value >= numFrames) {
                value = numFrames - 1;
                skip_script = true;
            }
            if (this._currentFrameIndex == value)
                return;
            this._currentFrameIndex = value;
            //changing current frame will ignore advance command for that
            //update's advanceFrame function, unless advanceFrame has
            //already been executed
            this._skipAdvance = MovieClip._skipAdvance;
            this._timeline.gotoFrame(this, value, skip_script);
        },
        enumerable: true,
        configurable: true
    });
    MovieClip.prototype.addButtonListeners = function () {
        this._isButton = true;
        this.stop();
        this.addEventListener(MouseEvent_1.MouseEvent.MOUSE_OVER, this._onMouseOver);
        this.addEventListener(MouseEvent_1.MouseEvent.MOUSE_OUT, this._onMouseOut);
        this.addEventListener(MouseEvent_1.MouseEvent.MOUSE_DOWN, this._onMouseDown);
        this.addEventListener(MouseEvent_1.MouseEvent.MOUSE_UP, this._onMouseUp);
    };
    MovieClip.prototype.removeButtonListeners = function () {
        this.removeEventListener(MouseEvent_1.MouseEvent.MOUSE_OVER, this._onMouseOver);
        this.removeEventListener(MouseEvent_1.MouseEvent.MOUSE_OUT, this._onMouseOut);
        this.removeEventListener(MouseEvent_1.MouseEvent.MOUSE_DOWN, this._onMouseDown);
        this.removeEventListener(MouseEvent_1.MouseEvent.MOUSE_UP, this._onMouseUp);
    };
    MovieClip.prototype.getChildAtSessionID = function (sessionID) {
        return this._sessionID_childs[sessionID];
    };
    MovieClip.prototype.getSessionIDDepths = function () {
        return this._depth_sessionIDs;
    };
    MovieClip.prototype.addChildAtDepth = function (child, depth, replace) {
        if (replace === void 0) { replace = true; }
        //this should be implemented for all display objects
        child.inheritColorTransform = true;
        child.reset(); // this takes care of transform and visibility
        return _super.prototype.addChildAtDepth.call(this, child, depth, replace);
    };
    MovieClip.prototype._addTimelineChildAt = function (child, depth, sessionID) {
        this._depth_sessionIDs[depth] = child._sessionID = sessionID;
        this._sessionID_childs[sessionID] = child;
        return this.addChildAtDepth(child, depth);
    };
    MovieClip.prototype.removeChildAtInternal = function (index) {
        var child = this._children[index];
        if (child.adapter)
            child.adapter.freeFromScript();
        this.adapter.unregisterScriptObject(child);
        //check to make sure _depth_sessionIDs wasn't modified with a new child
        if (this._depth_sessionIDs[child._depthID] == child._sessionID)
            delete this._depth_sessionIDs[child._depthID];
        delete this._sessionID_childs[child._sessionID];
        child._sessionID = -1;
        return _super.prototype.removeChildAtInternal.call(this, index);
    };
    Object.defineProperty(MovieClip.prototype, "assetType", {
        get: function () {
            return MovieClip.assetType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Starts playback of animation from current position
     */
    MovieClip.prototype.play = function () {
        if (this._timeline.keyframe_indices.length > 1)
            this._isPlaying = true;
    };
    /**
     * should be called right before the call to away3d-render.
     */
    MovieClip.prototype.update = function () {
        MovieClip._skipAdvance = true;
        this.advanceFrame();
        MovieClip._skipAdvance = false;
        // after we advanced the scenegraph, we might have some script that needs executing
        FrameScriptManager_1.FrameScriptManager.execute_queue();
        // now we want to execute the onEnter
        this.dispatchEvent(this._enterFrame);
        // after we executed the onEnter, we might have some script that needs executing
        FrameScriptManager_1.FrameScriptManager.execute_queue();
        // now we execute any intervals queued
        FrameScriptManager_1.FrameScriptManager.execute_intervals();
        // finally, we execute any scripts that were added from intervals
        FrameScriptManager_1.FrameScriptManager.execute_queue();
        //execute any disposes as a result of framescripts
        FrameScriptManager_1.FrameScriptManager.execute_dispose();
    };
    MovieClip.prototype.getPotentialChildInstance = function (id) {
        if (!this._potentialInstances[id])
            this._potentialInstances[id] = this._timeline.getPotentialChildInstance(id);
        return this._potentialInstances[id];
    };
    /**
     * Stop playback of animation and hold current position
     */
    MovieClip.prototype.stop = function () {
        this._isPlaying = false;
    };
    MovieClip.prototype.clone = function () {
        var newInstance = (MovieClip._movieClips.length) ? MovieClip._movieClips.pop() : new MovieClip(this._timeline);
        this.copyTo(newInstance);
        return newInstance;
    };
    MovieClip.prototype.copyTo = function (newInstance) {
        _super.prototype.copyTo.call(this, newInstance);
        newInstance.timeline = this._timeline;
        newInstance.loop = this.loop;
    };
    MovieClip.prototype.advanceFrame = function () {
        if (this._isPlaying && !this._skipAdvance) {
            if (this._currentFrameIndex == this._timeline.keyframe_indices.length - 1) {
                if (this.loop)
                    this.currentFrameIndex = 0;
                else
                    this._isPlaying = false;
            }
            else {
                this._currentFrameIndex++;
                this._timeline.constructNextFrame(this);
            }
        }
        var len = this._children.length;
        var child;
        for (var i = 0; i < len; ++i) {
            child = this._children[i];
            if (child.isAsset(MovieClip))
                child.advanceFrame();
        }
        this._skipAdvance = false;
    };
    // DEBUG CODE:
    MovieClip.prototype.logHierarchy = function (depth) {
        if (depth === void 0) { depth = 0; }
        this.printHierarchyName(depth, this);
        var len = this._children.length;
        var child;
        for (var i = 0; i < len; i++) {
            child = this._children[i];
            if (child.isAsset(MovieClip))
                child.logHierarchy(depth + 1);
            else
                this.printHierarchyName(depth + 1, child);
        }
    };
    MovieClip.prototype.printHierarchyName = function (depth, target) {
        var str = "";
        for (var i = 0; i < depth; ++i)
            str += "--";
        str += " " + target.name + " = " + target.id;
        console.log(str);
    };
    MovieClip.prototype.clear = function () {
        //clear out potential instances
        var len = this._potentialInstances.length;
        for (var i = 0; i < len; i++) {
            var instance = this._potentialInstances[i];
            //only dispose instances that are not used in script ie. do not have an instance name
            if (instance && instance.name == "") {
                FrameScriptManager_1.FrameScriptManager.add_child_to_dispose(instance);
                delete this._potentialInstances[i];
            }
        }
        _super.prototype.clear.call(this);
    };
    MovieClip._movieClips = new Array();
    MovieClip.assetType = "[asset MovieClip]";
    return MovieClip;
}(Sprite_1.Sprite));
exports.MovieClip = MovieClip;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MovieClip;

},{"../base/Timeline":"awayjs-display/lib/base/Timeline","../display/Sprite":"awayjs-display/lib/display/Sprite","../display/TextField":"awayjs-display/lib/display/TextField","../events/MouseEvent":"awayjs-display/lib/events/MouseEvent","../managers/FrameScriptManager":"awayjs-display/lib/managers/FrameScriptManager","awayjs-core/lib/events/AssetEvent":undefined}],"awayjs-display/lib/display/PointLight":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var LightBase_1 = require("../display/LightBase");
var BoundsType_1 = require("../bounds/BoundsType");
var CubeMapShadowMapper_1 = require("../materials/shadowmappers/CubeMapShadowMapper");
var PointLight = (function (_super) {
    __extends(PointLight, _super);
    function PointLight() {
        _super.call(this);
        this._pRadius = 90000;
        this._pFallOff = 100000;
        this._pIsEntity = true;
        this._pFallOffFactor = 1 / (this._pFallOff * this._pFallOff - this._pRadius * this._pRadius);
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.SPHERE;
    }
    Object.defineProperty(PointLight.prototype, "assetType", {
        get: function () {
            return PointLight.assetType;
        },
        enumerable: true,
        configurable: true
    });
    PointLight.prototype.pCreateShadowMapper = function () {
        return new CubeMapShadowMapper_1.CubeMapShadowMapper();
    };
    Object.defineProperty(PointLight.prototype, "radius", {
        get: function () {
            return this._pRadius;
        },
        set: function (value) {
            this._pRadius = value;
            if (this._pRadius < 0) {
                this._pRadius = 0;
            }
            else if (this._pRadius > this._pFallOff) {
                this._pFallOff = this._pRadius;
                this._pInvalidateBounds();
            }
            this._pFallOffFactor = 1 / (this._pFallOff * this._pFallOff - this._pRadius * this._pRadius);
        },
        enumerable: true,
        configurable: true
    });
    PointLight.prototype.iFallOffFactor = function () {
        return this._pFallOffFactor;
    };
    Object.defineProperty(PointLight.prototype, "fallOff", {
        get: function () {
            return this._pFallOff;
        },
        set: function (value) {
            this._pFallOff = value;
            if (this._pFallOff < 0)
                this._pFallOff = 0;
            if (this._pFallOff < this._pRadius)
                this._pRadius = this._pFallOff;
            this._pFallOffFactor = 1 / (this._pFallOff * this._pFallOff - this._pRadius * this._pRadius);
            this._pInvalidateBounds();
        },
        enumerable: true,
        configurable: true
    });
    PointLight.prototype._pUpdateSphereBounds = function () {
        _super.prototype._pUpdateSphereBounds.call(this);
        this._pSphereBounds.radius = this._pFallOff;
    };
    PointLight.prototype.iGetObjectProjectionMatrix = function (entity, cameraTransform, target) {
        if (target === void 0) { target = null; }
        var raw = Matrix3DUtils_1.Matrix3DUtils.RAW_DATA_CONTAINER;
        var m = new Matrix3D_1.Matrix3D();
        // todo: do not use lookAt on Light
        m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
        m.append(this._pParent.inverseSceneTransform);
        this.lookAt(m.position);
        m.copyFrom(entity.getRenderSceneTransform(cameraTransform));
        m.append(this.inverseSceneTransform);
        var box = entity.getBox();
        var v1 = m.deltaTransformVector(new Vector3D_1.Vector3D(box.left, box.bottom, box.front));
        var v2 = m.deltaTransformVector(new Vector3D_1.Vector3D(box.right, box.top, box.back));
        var d1 = v1.x * v1.x + v1.y * v1.y + v1.z * v1.z;
        var d2 = v2.x * v2.x + v2.y * v2.y + v2.z * v2.z;
        var d = Math.sqrt(d1 > d2 ? d1 : d2);
        var zMin;
        var zMax;
        var z = m.rawData[14];
        zMin = z - d;
        zMax = z + d;
        raw[5] = raw[0] = zMin / d;
        raw[10] = zMax / (zMax - zMin);
        raw[11] = 1;
        raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[12] = raw[13] = raw[15] = 0;
        raw[14] = -zMin * raw[10];
        if (!target)
            target = new Matrix3D_1.Matrix3D();
        target.copyRawDataFrom(raw);
        target.prepend(m);
        return target;
    };
    PointLight.assetType = "[light PointLight]";
    return PointLight;
}(LightBase_1.LightBase));
exports.PointLight = PointLight;

},{"../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/LightBase":"awayjs-display/lib/display/LightBase","../materials/shadowmappers/CubeMapShadowMapper":"awayjs-display/lib/materials/shadowmappers/CubeMapShadowMapper","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/display/Scene":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectContainer_1 = require("../display/DisplayObjectContainer");
var BasicPartition_1 = require("../partition/BasicPartition");
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene(partition) {
        if (partition === void 0) { partition = null; }
        _super.call(this);
        this._expandedPartitions = new Array();
        this._partitions = new Array();
        this._iCollectionMark = 0;
        this.partition = partition || new BasicPartition_1.BasicPartition();
        this._iIsRoot = true;
        this._pScene = this;
    }
    Scene.prototype.traversePartitions = function (traverser) {
        var i = 0;
        var len = this._partitions.length;
        while (i < len)
            this._partitions[i++].traverse(traverser);
    };
    /**
     * @internal
     */
    Scene.prototype._iRegisterPartition = function (partition) {
        this._expandedPartitions.push(partition);
        //ensure duplicates are not found in partitions array
        if (this._partitions.indexOf(partition) == -1)
            this._partitions.push(partition);
    };
    /**
     * @internal
     */
    Scene.prototype._iUnregisterPartition = function (partition) {
        this._expandedPartitions.splice(this._expandedPartitions.indexOf(partition), 1);
        //if no more partition references found, remove from partitions array
        if (this._expandedPartitions.indexOf(partition) == -1)
            this._partitions.splice(this._partitions.indexOf(partition), 1);
    };
    return Scene;
}(DisplayObjectContainer_1.DisplayObjectContainer));
exports.Scene = Scene;

},{"../display/DisplayObjectContainer":"awayjs-display/lib/display/DisplayObjectContainer","../partition/BasicPartition":"awayjs-display/lib/partition/BasicPartition"}],"awayjs-display/lib/display/Shape":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var Point_1 = require("awayjs-core/lib/geom/Point");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var DisplayObject_1 = require("../display/DisplayObject");
var Graphics_1 = require("../graphics/Graphics");
/**
 * This class is used to create lightweight shapes using the ActionScript
 * drawing application program interface(API). The Shape class includes a
 * <code>graphics</code> property, which lets you access methods from the
 * Graphics class.
 *
 * <p>The Shape class also includes a <code>graphics</code>property, and it
 * includes other features not available to the Shape class. For example, a
 * Shape object is a display object container, whereas a Shape object is not
 * (and cannot contain child display objects). For this reason, Shape objects
 * consume less memory than Shape objects that contain the same graphics.
 * However, a Shape object supports user input events, while a Shape object
 * does not.</p>
 */
var Shape = (function (_super) {
    __extends(Shape, _super);
    /**
     * Create a new Shape object.
     *
     * @param material    [optional]        The material with which to render the Shape.
     */
    function Shape(material) {
        var _this = this;
        if (material === void 0) { material = null; }
        _super.call(this);
        //temp point used in hit testing
        this._tempPoint = new Point_1.Point();
        this._onGraphicsInvalidateDelegate = function (event) { return _this._onGraphicsInvalidate(event); };
        this._graphics = new Graphics_1.Graphics(); //unique graphics object for each Sprite
        this._graphics.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onGraphicsInvalidateDelegate);
        this.material = material;
    }
    Object.defineProperty(Shape.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return Shape.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "graphics", {
        /**
         * Specifies the Graphics object belonging to this Shape object, where
         * drawing commands can occur.
         */
        get: function () {
            if (this._iSourcePrefab)
                this._iSourcePrefab._iValidate();
            return this._graphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "animator", {
        /**
         * Defines the animator of the graphics object.  Default value is <code>null</code>.
         */
        get: function () {
            return this._graphics.animator;
        },
        set: function (value) {
            if (this._graphics.animator)
                this._graphics.animator.removeOwner(this);
            this._graphics.animator = value;
            if (this._graphics.animator)
                this._graphics.animator.addOwner(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "material", {
        /**
         * The material with which to render the Shape.
         */
        get: function () {
            return this._graphics.material;
        },
        set: function (value) {
            this._graphics.material = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "style", {
        /**
         *
         */
        get: function () {
            return this._graphics.style;
        },
        set: function (value) {
            this._graphics.style = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Shape.prototype.bakeTransformations = function () {
        this._graphics.applyTransformation(this.transform.matrix3D);
        this.transform.clearMatrix3D();
    };
    /**
     * @inheritDoc
     */
    Shape.prototype.dispose = function () {
        this.disposeValues();
        Shape._shapes.push(this);
    };
    /**
     * @inheritDoc
     */
    Shape.prototype.disposeValues = function () {
        _super.prototype.disposeValues.call(this);
        this._graphics.dispose();
    };
    /**
     * Clones this Shape instance along with all it's children, while re-using the same
     * material, graphics and animation set. The returned result will be a copy of this shape,
     * containing copies of all of it's children.
     *
     * Properties that are re-used (i.e. not cloned) by the new copy include name,
     * graphics, and material. Properties that are cloned or created anew for the copy
     * include subShapees, children of the shape, and the animator.
     *
     * If you want to copy just the shape, reusing it's graphics and material while not
     * cloning it's children, the simplest way is to create a new shape manually:
     *
     * <code>
     * var clone : Shape = new Shape(original.graphics, original.material);
     * </code>
     */
    Shape.prototype.clone = function () {
        var newInstance = (Shape._shapes.length) ? Shape._shapes.pop() : new Shape();
        this.copyTo(newInstance);
        return newInstance;
    };
    Shape.prototype.copyTo = function (shape) {
        _super.prototype.copyTo.call(this, shape);
        this._graphics.copyTo(shape.graphics);
    };
    /**
     * //TODO
     *
     * @protected
     */
    Shape.prototype._pUpdateBoxBounds = function () {
        _super.prototype._pUpdateBoxBounds.call(this);
        this._pBoxBounds.union(this._graphics.getBoxBounds(), this._pBoxBounds);
    };
    Shape.prototype._pUpdateSphereBounds = function () {
        _super.prototype._pUpdateSphereBounds.call(this);
        var box = this.getBox();
        if (!this._center)
            this._center = new Vector3D_1.Vector3D();
        this._center.x = box.x + box.width / 2;
        this._center.y = box.y + box.height / 2;
        this._center.z = box.z + box.depth / 2;
        this._pSphereBounds = this._graphics.getSphereBounds(this._center, this._pSphereBounds);
    };
    /**
     * //TODO
     *
     * @private
     */
    Shape.prototype._onGraphicsInvalidate = function (event) {
        if (this._pIsEntity != Boolean(this._graphics.count)) {
            if (this._pImplicitPartition)
                this._pImplicitPartition._iUnregisterEntity(this);
            this._pIsEntity = Boolean(this._graphics.count);
            if (this._pImplicitPartition)
                this._pImplicitPartition._iRegisterEntity(this);
        }
        this._pInvalidateBounds();
    };
    /**
     *
     * @param renderer
     *
     * @internal
     */
    Shape.prototype._acceptTraverser = function (traverser) {
        this.graphics.acceptTraverser(traverser);
    };
    Shape.prototype._hitTestPointInternal = function (x, y, shapeFlag, masksFlag) {
        if (this._graphics.count) {
            this._tempPoint.setTo(x, y);
            var local = this.globalToLocal(this._tempPoint, this._tempPoint);
            var box;
            //early out for box test
            if (!(box = this.getBox()).contains(local.x, local.y, 0))
                return false;
            //early out for non-shape tests
            if (!shapeFlag)
                return true;
            //ok do the graphics thing
            if (this._graphics._hitTestPointInternal(local.x, local.y))
                return true;
        }
        return false;
    };
    Shape.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._graphics.clear();
    };
    Shape._shapes = new Array();
    Shape.assetType = "[asset Shape]";
    return Shape;
}(DisplayObject_1.DisplayObject));
exports.Shape = Shape;

},{"../display/DisplayObject":"awayjs-display/lib/display/DisplayObject","../graphics/Graphics":"awayjs-display/lib/graphics/Graphics","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/display/Skybox":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var BlendMode_1 = require("awayjs-core/lib/image/BlendMode");
var DisplayObject_1 = require("../display/DisplayObject");
var BoundsType_1 = require("../bounds/BoundsType");
var RenderableEvent_1 = require("../events/RenderableEvent");
var SurfaceEvent_1 = require("../events/SurfaceEvent");
var SingleCubeTexture_1 = require("../textures/SingleCubeTexture");
var Style_1 = require("../base/Style");
var StyleEvent_1 = require("../events/StyleEvent");
/**
 * A Skybox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
 * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
 * the sky box is always as large as possible without being clipped.
 */
var Skybox = (function (_super) {
    __extends(Skybox, _super);
    /**
     * Create a new Skybox object.
     *
     * @param material	The material with which to render the Skybox.
     */
    function Skybox(image) {
        var _this = this;
        if (image === void 0) { image = null; }
        _super.call(this);
        this._textures = new Array();
        this._pAlphaThreshold = 0;
        this._pBlendMode = BlendMode_1.BlendMode.NORMAL;
        this._curves = false;
        this._imageRect = false;
        this._style = new Style_1.Style();
        this._onTextureInvalidateDelegate = function (event) { return _this.onTextureInvalidate(event); };
        this._onInvalidatePropertiesDelegate = function (event) { return _this._onInvalidateProperties(event); };
        this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
        this._pIsEntity = true;
        this._owners = new Array(this);
        this._style.image = image;
        this.texture = new SingleCubeTexture_1.SingleCubeTexture();
        //default bounds type
        this._boundsType = BoundsType_1.BoundsType.NULL;
    }
    Object.defineProperty(Skybox.prototype, "alphaThreshold", {
        /**
         * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
         * invisible or entirely opaque, often used with textures for foliage, etc.
         * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
         */
        get: function () {
            return this._pAlphaThreshold;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            else if (value > 1)
                value = 1;
            if (this._pAlphaThreshold == value)
                return;
            this._pAlphaThreshold = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "curves", {
        /**
         * Indicates whether skybox should use curves. Defaults to false.
         */
        get: function () {
            return this._curves;
        },
        set: function (value) {
            if (this._curves == value)
                return;
            this._curves = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "imageRect", {
        /**
         * Indicates whether or not the Skybox texture should use imageRects. Defaults to false.
         */
        get: function () {
            return this._imageRect;
        },
        set: function (value) {
            if (this._imageRect == value)
                return;
            this._imageRect = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "lightPicker", {
        /**
         * The light picker used by the material to provide lights to the material if it supports lighting.
         *
         * @see LightPickerBase
         * @see StaticLightPicker
         */
        get: function () {
            return this._pLightPicker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "animationSet", {
        /**
         *
         */
        get: function () {
            return this._animationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "blendMode", {
        /**
         * The blend mode to use when drawing this renderable. The following blend modes are supported:
         * <ul>
         * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
         * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
         * <li>BlendMode.MULTIPLY</li>
         * <li>BlendMode.ADD</li>
         * <li>BlendMode.ALPHA</li>
         * </ul>
         */
        get: function () {
            return this._pBlendMode;
        },
        set: function (value) {
            if (this._pBlendMode == value)
                return;
            this._pBlendMode = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "iOwners", {
        /**
         * A list of the IRenderables that use this material
         *
         * @private
         */
        get: function () {
            return this._owners;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "animator", {
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "texture", {
        /**
        * The cube texture to use as the skybox.
        */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.removeTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.addTexture(this._texture);
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Skybox.prototype.getNumTextures = function () {
        return this._textures.length;
    };
    Skybox.prototype.getTextureAt = function (index) {
        return this._textures[index];
    };
    Object.defineProperty(Skybox.prototype, "style", {
        /**
         *
         */
        get: function () {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skybox.prototype, "assetType", {
        get: function () {
            return Skybox.assetType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
     *
     * @private
     */
    Skybox.prototype.invalidatePasses = function () {
        this.dispatchEvent(new SurfaceEvent_1.SurfaceEvent(SurfaceEvent_1.SurfaceEvent.INVALIDATE_PASSES, this));
    };
    Skybox.prototype.invalidateElements = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_ELEMENTS, this));
    };
    Skybox.prototype.invalidateSurface = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_SURFACE, this));
    };
    Skybox.prototype.addTexture = function (texture) {
        this._textures.push(texture);
        texture.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);
        this.onTextureInvalidate();
    };
    Skybox.prototype.removeTexture = function (texture) {
        this._textures.splice(this._textures.indexOf(texture), 1);
        texture.removeEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);
        this.onTextureInvalidate();
    };
    Skybox.prototype.onTextureInvalidate = function (event) {
        if (event === void 0) { event = null; }
        this.invalidate();
    };
    Skybox.prototype._onInvalidateProperties = function (event) {
        this.invalidatePasses();
    };
    Skybox.prototype._acceptTraverser = function (traverser) {
        traverser.applyRenderable(this);
    };
    /**
     * //TODO
     *
     * @param shortestCollisionDistance
     * @returns {boolean}
     *
     * @internal
     */
    Skybox.prototype._iTestCollision = function (pickingCollision, pickingCollider) {
        return false;
    };
    Skybox.assetType = "[asset Skybox]";
    return Skybox;
}(DisplayObject_1.DisplayObject));
exports.Skybox = Skybox;

},{"../base/Style":"awayjs-display/lib/base/Style","../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../display/DisplayObject":"awayjs-display/lib/display/DisplayObject","../events/RenderableEvent":"awayjs-display/lib/events/RenderableEvent","../events/StyleEvent":"awayjs-display/lib/events/StyleEvent","../events/SurfaceEvent":"awayjs-display/lib/events/SurfaceEvent","../textures/SingleCubeTexture":"awayjs-display/lib/textures/SingleCubeTexture","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/image/BlendMode":undefined}],"awayjs-display/lib/display/Sprite":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var Point_1 = require("awayjs-core/lib/geom/Point");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var Graphics_1 = require("../graphics/Graphics");
var DisplayObjectContainer_1 = require("../display/DisplayObjectContainer");
/**
 * Sprite is an instance of a Graphics, augmenting it with a presence in the scene graph, a material, and an animation
 * state. It consists out of Graphices, which in turn correspond to SubGeometries. Graphices allow different parts
 * of the graphics to be assigned different materials.
 */
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    /**
     * Create a new Sprite object.
     *
     * @param material    [optional]        The material with which to render the Sprite.
     */
    function Sprite(material) {
        var _this = this;
        if (material === void 0) { material = null; }
        _super.call(this);
        //temp point used in hit testing
        this._tempPoint = new Point_1.Point();
        this._onGraphicsInvalidateDelegate = function (event) { return _this._onGraphicsInvalidate(event); };
        this._graphics = new Graphics_1.Graphics(); //unique graphics object for each Sprite
        this._graphics.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onGraphicsInvalidateDelegate);
        this.material = material;
    }
    Object.defineProperty(Sprite.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return Sprite.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "graphics", {
        /**
         * Specifies the Graphics object belonging to this Sprite object, where
         * drawing commands can occur.
         */
        get: function () {
            if (this._iSourcePrefab)
                this._iSourcePrefab._iValidate();
            return this._graphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "animator", {
        /**
         * Defines the animator of the graphics object.  Default value is <code>null</code>.
         */
        get: function () {
            return this._graphics.animator;
        },
        set: function (value) {
            if (this._graphics.animator)
                this._graphics.animator.removeOwner(this);
            this._graphics.animator = value;
            if (this._graphics.animator)
                this._graphics.animator.addOwner(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "material", {
        /**
         * The material with which to render the Sprite.
         */
        get: function () {
            return this._graphics.material;
        },
        set: function (value) {
            this._graphics.material = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "style", {
        /**
         *
         */
        get: function () {
            return this._graphics.style;
        },
        set: function (value) {
            this._graphics.style = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Sprite.prototype.bakeTransformations = function () {
        this._graphics.applyTransformation(this.transform.matrix3D);
        this.transform.clearMatrix3D();
    };
    /**
     * @inheritDoc
     */
    Sprite.prototype.dispose = function () {
        this.disposeValues();
        Sprite._sprites.push(this);
    };
    /**
     * @inheritDoc
     */
    Sprite.prototype.disposeValues = function () {
        _super.prototype.disposeValues.call(this);
        this._graphics.dispose();
    };
    /**
     * Clones this Sprite instance along with all it's children, while re-using the same
     * material, graphics and animation set. The returned result will be a copy of this sprite,
     * containing copies of all of it's children.
     *
     * Properties that are re-used (i.e. not cloned) by the new copy include name,
     * graphics, and material. Properties that are cloned or created anew for the copy
     * include subSpritees, children of the sprite, and the animator.
     *
     * If you want to copy just the sprite, reusing it's graphics and material while not
     * cloning it's children, the simplest way is to create a new sprite manually:
     *
     * <code>
     * var clone : Sprite = new Sprite(original.graphics, original.material);
     * </code>
     */
    Sprite.prototype.clone = function () {
        var newInstance = (Sprite._sprites.length) ? Sprite._sprites.pop() : new Sprite();
        this.copyTo(newInstance);
        return newInstance;
    };
    Sprite.prototype.copyTo = function (sprite) {
        _super.prototype.copyTo.call(this, sprite);
        this._graphics.copyTo(sprite.graphics);
    };
    /**
     * //TODO
     *
     * @protected
     */
    Sprite.prototype._pUpdateBoxBounds = function () {
        _super.prototype._pUpdateBoxBounds.call(this);
        this._pBoxBounds.union(this._graphics.getBoxBounds(), this._pBoxBounds);
    };
    Sprite.prototype._pUpdateSphereBounds = function () {
        _super.prototype._pUpdateSphereBounds.call(this);
        var box = this.getBox();
        if (!this._center)
            this._center = new Vector3D_1.Vector3D();
        this._center.x = box.x + box.width / 2;
        this._center.y = box.y + box.height / 2;
        this._center.z = box.z + box.depth / 2;
        this._pSphereBounds = this._graphics.getSphereBounds(this._center, this._pSphereBounds);
    };
    /**
     * //TODO
     *
     * @private
     */
    Sprite.prototype._onGraphicsInvalidate = function (event) {
        if (this._pIsEntity != Boolean(this._graphics.count)) {
            if (this._pImplicitPartition)
                this._pImplicitPartition._iUnregisterEntity(this);
            this._pIsEntity = Boolean(this._graphics.count);
            if (this._pImplicitPartition)
                this._pImplicitPartition._iRegisterEntity(this);
        }
        this._pInvalidateBounds();
    };
    /**
     *
     * @param renderer
     *
     * @internal
     */
    Sprite.prototype._acceptTraverser = function (traverser) {
        this.graphics.acceptTraverser(traverser);
    };
    Sprite.prototype._hitTestPointInternal = function (x, y, shapeFlag, masksFlag) {
        if (this._graphics.count) {
            this._tempPoint.setTo(x, y);
            var local = this.globalToLocal(this._tempPoint, this._tempPoint);
            var box;
            //early out for box test
            if (!(box = this.getBox()).contains(local.x, local.y, 0))
                return false;
            //early out for non-shape tests
            if (!shapeFlag)
                return true;
            //ok do the graphics thing
            if (this._graphics._hitTestPointInternal(local.x, local.y))
                return true;
        }
        return _super.prototype._hitTestPointInternal.call(this, x, y, shapeFlag, masksFlag);
    };
    Sprite.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._graphics.clear();
    };
    Sprite._sprites = new Array();
    Sprite.assetType = "[asset Sprite]";
    return Sprite;
}(DisplayObjectContainer_1.DisplayObjectContainer));
exports.Sprite = Sprite;

},{"../display/DisplayObjectContainer":"awayjs-display/lib/display/DisplayObjectContainer","../graphics/Graphics":"awayjs-display/lib/graphics/Graphics","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/display/TextField":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesView_1 = require("awayjs-core/lib/attributes/AttributesView");
var Float2Attributes_1 = require("awayjs-core/lib/attributes/Float2Attributes");
var Byte4Attributes_1 = require("awayjs-core/lib/attributes/Byte4Attributes");
var Matrix_1 = require("awayjs-core/lib/geom/Matrix");
var ColorTransform_1 = require("awayjs-core/lib/geom/ColorTransform");
var Sampler2D_1 = require("awayjs-core/lib/image/Sampler2D");
var HierarchicalProperties_1 = require("../base/HierarchicalProperties");
var Style_1 = require("../base/Style");
var TextFieldType_1 = require("../text/TextFieldType");
var Sprite_1 = require("../display/Sprite");
var TriangleElements_1 = require("../graphics/TriangleElements");
/**
 * The TextField class is used to create display objects for text display and
 * input. <ph outputclass="flexonly">You can use the TextField class to
 * perform low-level text rendering. However, in Flex, you typically use the
 * Label, Text, TextArea, and TextInput controls to process text. <ph
 * outputclass="flashonly">You can give a text field an instance name in the
 * Property inspector and use the methods and properties of the TextField
 * class to manipulate it with ActionScript. TextField instance names are
 * displayed in the Movie Explorer and in the Insert Target Path dialog box in
 * the Actions panel.
 *
 * <p>To create a text field dynamically, use the <code>TextField()</code>
 * constructor.</p>
 *
 * <p>The methods of the TextField class let you set, select, and manipulate
 * text in a dynamic or input text field that you create during authoring or
 * at runtime. </p>
 *
 * <p>ActionScript provides several ways to format your text at runtime. The
 * TextFormat class lets you set character and paragraph formatting for
 * TextField objects. You can apply Cascading Style Sheets(CSS) styles to
 * text fields by using the <code>TextField.styleSheet</code> property and the
 * StyleSheet class. You can use CSS to style built-in HTML tags, define new
 * formatting tags, or apply styles. You can assign HTML formatted text, which
 * optionally uses CSS styles, directly to a text field. HTML text that you
 * assign to a text field can contain embedded media(movie clips, SWF files,
 * GIF files, PNG files, and JPEG files). The text wraps around the embedded
 * media in the same way that a web browser wraps text around media embedded
 * in an HTML document. </p>
 *
 * <p>Flash Player supports a subset of HTML tags that you can use to format
 * text. See the list of supported HTML tags in the description of the
 * <code>htmlText</code> property.</p>
 *
 * @event change                    Dispatched after a control value is
 *                                  modified, unlike the
 *                                  <code>textInput</code> event, which is
 *                                  dispatched before the value is modified.
 *                                  Unlike the W3C DOM Event Model version of
 *                                  the <code>change</code> event, which
 *                                  dispatches the event only after the
 *                                  control loses focus, the ActionScript 3.0
 *                                  version of the <code>change</code> event
 *                                  is dispatched any time the control
 *                                  changes. For example, if a user types text
 *                                  into a text field, a <code>change</code>
 *                                  event is dispatched after every keystroke.
 * @event link                      Dispatched when a user clicks a hyperlink
 *                                  in an HTML-enabled text field, where the
 *                                  URL begins with "event:". The remainder of
 *                                  the URL after "event:" is placed in the
 *                                  text property of the LINK event.
 *
 *                                  <p><b>Note:</b> The default behavior,
 *                                  adding the text to the text field, occurs
 *                                  only when Flash Player generates the
 *                                  event, which in this case happens when a
 *                                  user attempts to input text. You cannot
 *                                  put text into a text field by sending it
 *                                  <code>textInput</code> events.</p>
 * @event scroll                    Dispatched by a TextField object
 *                                  <i>after</i> the user scrolls.
 * @event textInput                 Flash Player dispatches the
 *                                  <code>textInput</code> event when a user
 *                                  enters one or more characters of text.
 *                                  Various text input methods can generate
 *                                  this event, including standard keyboards,
 *                                  input method editors(IMEs), voice or
 *                                  speech recognition systems, and even the
 *                                  act of pasting plain text with no
 *                                  formatting or style information.
 * @event textInteractionModeChange Flash Player dispatches the
 *                                  <code>textInteractionModeChange</code>
 *                                  event when a user changes the interaction
 *                                  mode of a text field. for example on
 *                                  Android, one can toggle from NORMAL mode
 *                                  to SELECTION mode using context menu
 *                                  options
 */
var TextField = (function (_super) {
    __extends(TextField, _super);
    /**
     * Creates a new TextField instance. After you create the TextField instance,
     * call the <code>addChild()</code> or <code>addChildAt()</code> method of
     * the parent DisplayObjectContainer object to add the TextField instance to
     * the display list.
     *
     * <p>The default size for a text field is 100 x 100 pixels.</p>
     */
    function TextField() {
        _super.call(this);
        this._text = "";
        this.type = TextFieldType_1.TextFieldType.STATIC;
    }
    Object.defineProperty(TextField.prototype, "assetType", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return TextField.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "bottomScrollV", {
        /**
         * An integer(1-based index) that indicates the bottommost line that is
         * currently visible in the specified text field. Think of the text field as
         * a window onto a block of text. The <code>scrollV</code> property is the
         * 1-based index of the topmost visible line in the window.
         *
         * <p>All the text between the lines indicated by <code>scrollV</code> and
         * <code>bottomScrollV</code> is currently visible in the text field.</p>
         */
        get: function () {
            return this._bottomScrollV;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "caretIndex", {
        /**
         * The index of the insertion point(caret) position. If no insertion point
         * is displayed, the value is the position the insertion point would be if
         * you restored focus to the field(typically where the insertion point last
         * was, or 0 if the field has not had focus).
         *
         * <p>Selection span indexes are zero-based(for example, the first position
         * is 0, the second position is 1, and so on).</p>
         */
        get: function () {
            return this._caretIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "length", {
        /**
         * The number of characters in a text field. A character such as tab
         * (<code>\t</code>) counts as one character.
         */
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The maximum value of <code>scrollH</code>.
     */
    TextField.prototype.maxScrollH = function () {
        return this._maxScrollH;
    };
    /**
     * The maximum value of <code>scrollV</code>.
     */
    TextField.prototype.maxScrollV = function () {
        return this._maxScrollV;
    };
    Object.defineProperty(TextField.prototype, "numLines", {
        /**
         * Defines the number of text lines in a multiline text field. If
         * <code>wordWrap</code> property is set to <code>true</code>, the number of
         * lines increases when text wraps.
         */
        get: function () {
            return this._numLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "selectionBeginIndex", {
        /**
         * The zero-based character index value of the first character in the current
         * selection. For example, the first character is 0, the second character is
         * 1, and so on. If no text is selected, this property is the value of
         * <code>caretIndex</code>.
         */
        get: function () {
            return this._selectionBeginIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "selectionEndIndex", {
        /**
         * The zero-based character index value of the last character in the current
         * selection. For example, the first character is 0, the second character is
         * 1, and so on. If no text is selected, this property is the value of
         * <code>caretIndex</code>.
         */
        get: function () {
            return this._selectionEndIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "text", {
        /**
         * A string that is the current text in the text field. Lines are separated
         * by the carriage return character(<code>'\r'</code>, ASCII 13). This
         * property contains unformatted text in the text field, without HTML tags.
         *
         * <p>To get the text in HTML form, use the <code>htmlText</code>
         * property.</p>
         */
        get: function () {
            return this._text;
        },
        set: function (value) {
            value = value.toString();
            if (this._text == value)
                return;
            this._text = value;
            this._textGraphicsDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textFormat", {
        get: function () {
            return this._textFormat;
        },
        set: function (value) {
            if (this._textFormat == value)
                return;
            this._textFormat = value;
            this._textGraphicsDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "graphics", {
        /**
         * The graphics used by the sprite that provides it with its shape.
         */
        get: function () {
            if (this._textGraphicsDirty)
                this.reConstruct();
            return this._graphics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textColor", {
        get: function () {
            return this._textColor;
        },
        set: function (value) {
            this._textColor = value;
            if (!this.transform.colorTransform)
                this.transform.colorTransform = new ColorTransform_1.ColorTransform();
            this.transform.colorTransform.color = value;
            this.pInvalidateHierarchicalProperties(HierarchicalProperties_1.HierarchicalProperties.COLOR_TRANSFORM);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textInteractionMode", {
        /**
         * The interaction mode property, Default value is
         * TextInteractionMode.NORMAL. On mobile platforms, the normal mode implies
         * that the text can be scrolled but not selected. One can switch to the
         * selectable mode through the in-built context menu on the text field. On
         * Desktop, the normal mode implies that the text is in scrollable as well as
         * selection mode.
         */
        get: function () {
            return this._textInteractionMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textWidth", {
        /**
         * The width of the text in pixels.
         */
        get: function () {
            return this._textWidth;
        },
        set: function (value) {
            this._textWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textHeight", {
        /**
         * The width of the text in pixels.
         */
        get: function () {
            return this._textHeight;
        },
        set: function (value) {
            this._textHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "isEntity", {
        /**
         *
         */
        get: function () {
            return true; //TODO do this better
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype.clear = function () {
        _super.prototype.clear.call(this);
        if (this._textElements)
            this._textElements.clear();
    };
    /**
     * @inheritDoc
     */
    TextField.prototype.dispose = function () {
        this.disposeValues();
        TextField._textFields.push(this);
    };
    /**
     * @inheritDoc
     */
    TextField.prototype.disposeValues = function () {
        _super.prototype.disposeValues.call(this);
        this._textFormat = null;
        this._textGraphic = null;
        if (this._textElements) {
            this._textElements.dispose();
            this._textElements = null;
        }
    };
    /**
     * Reconstructs the Graphics for this Text-field.
     */
    TextField.prototype.reConstruct = function () {
        this._textGraphicsDirty = false;
        if (this._textFormat == null)
            return;
        if (this._textGraphic) {
            this._textGraphic.dispose();
            this._textGraphic = null;
            this._textElements.clear();
            this._textElements.dispose();
            this._textElements = null;
        }
        if (this._text == "")
            return;
        var numVertices = 0;
        var elements;
        var char_scale = this._textFormat.size / this._textFormat.font_table.get_font_em_size();
        var y_offset = 0;
        var prev_char = null;
        var j = 0;
        var k = 0;
        var whitespace_width = (this._textFormat.font_table.get_whitespace_width() * char_scale) + this._textFormat.letterSpacing;
        var textlines = this.text.toString().split("\\n");
        var final_lines_chars = [];
        var final_lines_char_scale = [];
        var final_lines_width = [];
        var final_lines_justify_bool = [];
        var final_lines_justify = [];
        var maxlineWidth = this.textWidth - (4 + this._textFormat.leftMargin + this._textFormat.rightMargin + this._textFormat.indent);
        for (var tl = 0; tl < textlines.length; tl++) {
            final_lines_chars.push([]);
            final_lines_char_scale.push([]);
            final_lines_width.push(0);
            final_lines_justify.push(0);
            final_lines_justify_bool.push(false);
            var words = textlines[tl].split(" ");
            for (var i = 0; i < words.length; i++) {
                var word_width = 0;
                var word_chars = [];
                var word_chars_scale = [];
                var c_cnt = 0;
                for (var w = 0; w < words[i].length; w++) {
                    char_scale = this._textFormat.size / this._textFormat.font_table.get_font_em_size();
                    var this_char = this._textFormat.font_table.getChar(words[i].charCodeAt(w).toString());
                    if (this_char == null) {
                        if (this._textFormat.fallback_font_table) {
                            char_scale = this._textFormat.size / this._textFormat.fallback_font_table.get_font_em_size();
                            this_char = this._textFormat.fallback_font_table.getChar(words[i].charCodeAt(w).toString());
                        }
                    }
                    if (this_char != null) {
                        elements = this_char.elements;
                        if (elements != null) {
                            numVertices += elements.numVertices;
                            // find kerning value that has been set for this char_code on previous char (if non exists, kerning_value will stay 0)
                            var kerning_value = 0;
                            if (prev_char != null) {
                                for (var k = 0; k < prev_char.kerningCharCodes.length; k++) {
                                    if (prev_char.kerningCharCodes[k] == words[i].charCodeAt(w)) {
                                        kerning_value = prev_char.kerningValues[k];
                                        break;
                                    }
                                }
                            }
                            word_width += ((2 + this_char.char_width + kerning_value) * char_scale) + this._textFormat.letterSpacing;
                        }
                        else {
                            // if no char-elements was found, we insert a "space"
                            word_width += whitespace_width;
                        }
                    }
                    else {
                        // if no char-elements was found, we insert a "space"
                        //x_offset += this._textFormat.font_table.get_font_em_size() * char_scale;
                        word_width += whitespace_width;
                    }
                    word_chars_scale[c_cnt] = char_scale;
                    word_chars[c_cnt++] = this_char;
                }
                if (((final_lines_width[final_lines_width.length - 1] + word_width) <= maxlineWidth) || (final_lines_chars[final_lines_chars.length - 1].length == 0)) {
                    // if line can hold this word without breaking the bounds, we can just add all chars
                    for (var fw = 0; fw < word_chars_scale.length; fw++) {
                        final_lines_chars[final_lines_chars.length - 1].push(word_chars[fw]);
                        final_lines_char_scale[final_lines_char_scale.length - 1].push(word_chars_scale[fw]);
                    }
                    final_lines_width[final_lines_width.length - 1] += word_width;
                }
                else {
                    // word does not fit
                    // todo respect autowrapping properties.
                    // right now we just pretend everything has autowrapping and multiline
                    if (final_lines_chars[final_lines_chars.length - 1][final_lines_chars[final_lines_chars.length - 1].length - 1] == null) {
                        final_lines_chars[final_lines_chars.length - 1].pop();
                        final_lines_char_scale[final_lines_char_scale.length - 1].pop();
                        final_lines_width[final_lines_width.length - 1] -= whitespace_width;
                        final_lines_justify[final_lines_justify.length - 1] -= 1;
                    }
                    final_lines_justify_bool[final_lines_justify_bool.length - 1] = true;
                    final_lines_chars.push([]);
                    final_lines_char_scale.push([]);
                    final_lines_width.push(0);
                    final_lines_justify.push(0);
                    final_lines_justify_bool.push(false);
                    for (var fw = 0; fw < word_chars_scale.length; fw++) {
                        final_lines_chars[final_lines_chars.length - 1].push(word_chars[fw]);
                        final_lines_char_scale[final_lines_char_scale.length - 1].push(word_chars_scale[fw]);
                    }
                    final_lines_width[final_lines_width.length - 1] = word_width;
                }
                if (i < (words.length - 1)) {
                    if ((final_lines_width[final_lines_width.length - 1]) <= maxlineWidth) {
                        final_lines_chars[final_lines_chars.length - 1].push(null);
                        final_lines_char_scale[final_lines_char_scale.length - 1].push(char_scale);
                        final_lines_width[final_lines_width.length - 1] += whitespace_width;
                        final_lines_justify[final_lines_justify.length - 1] += 1;
                    }
                }
            }
        }
        y_offset = 2 + (this._textFormat.font_table.ascent - this._textFormat.font_table.get_font_em_size()) * char_scale;
        var vertices = new Float32Array(numVertices * 3);
        for (var i = 0; i < final_lines_chars.length; i++) {
            var x_offset = 2 + this._textFormat.leftMargin + this._textFormat.indent;
            var justify_addion = 0;
            if (this._textFormat.align == "center") {
                x_offset = 2 + this._textFormat.leftMargin + this._textFormat.indent + (maxlineWidth - final_lines_width[i]) / 2;
            }
            else if (this._textFormat.align == "justify") {
                if (final_lines_justify_bool[i]) {
                    justify_addion = ((maxlineWidth) - final_lines_width[i]) / final_lines_justify[i];
                }
            }
            else if (this._textFormat.align == "right") {
                x_offset = (this._textWidth - final_lines_width[i]) - (2 + this._textFormat.rightMargin);
            }
            //console.log("this._textFormat.align="+this._textFormat.align);
            //console.log("this._width="+this._width);
            for (var t = 0; t < final_lines_chars[i].length; t++) {
                var this_char = final_lines_chars[i][t];
                char_scale = final_lines_char_scale[i][t];
                if (this_char != null) {
                    elements = this_char.elements;
                    if (elements != null) {
                        var buffer = new Float32Array(elements.concatenatedBuffer.buffer);
                        for (var v = 0; v < elements.numVertices; v++) {
                            vertices[j++] = buffer[v * 3] * char_scale + x_offset;
                            vertices[j++] = buffer[v * 3 + 1] * char_scale + y_offset;
                            vertices[j++] = buffer[v * 3 + 2];
                        }
                        // find kerning value that has been set for this char_code on previous char (if non exists, kerning_value will stay 0)
                        var kerning_value = 0;
                        if (prev_char != null) {
                            for (var k = 0; k < prev_char.kerningCharCodes.length; k++) {
                                if (prev_char.kerningCharCodes[k] == this._text.charCodeAt(i)) {
                                    kerning_value = prev_char.kerningValues[k];
                                    break;
                                }
                            }
                        }
                        x_offset += ((this_char.char_width + kerning_value) * char_scale) + this._textFormat.letterSpacing;
                    }
                    else {
                        // if no char-elements was found, we insert a "space"
                        x_offset += whitespace_width + justify_addion;
                    }
                }
                else {
                    x_offset += whitespace_width + justify_addion;
                }
            }
            // hack for multiline textfield in icycle.
            y_offset += (this._textFormat.font_table.ascent + this._textFormat.font_table.descent) * char_scale;
            //y_offset+=(this._textFormat.font_table.get_font_em_size()-this._textFormat.font_table.descent)*char_scale;
            y_offset += this._textFormat.leading;
        }
        var attributesView = new AttributesView_1.AttributesView(Float32Array, 3);
        attributesView.set(vertices);
        var vertexBuffer = attributesView.buffer;
        attributesView.dispose();
        this._textElements = new TriangleElements_1.TriangleElements(vertexBuffer);
        this._textElements.setPositions(new Float2Attributes_1.Float2Attributes(vertexBuffer));
        this._textElements.setCustomAttributes("curves", new Byte4Attributes_1.Byte4Attributes(vertexBuffer, false));
        this._textGraphic = this._graphics.addGraphic(this._textElements);
        this.material = this._textFormat.material;
        var sampler = new Sampler2D_1.Sampler2D();
        this.style = new Style_1.Style();
        this.style.addSamplerAt(sampler, this.material.getTextureAt(0));
        this.style.uvMatrix = new Matrix_1.Matrix(0, 0, 0, 0, this._textFormat.uv_values[0], this._textFormat.uv_values[1]);
        this.material.animateUVs = true;
    };
    /**
     * Appends the string specified by the <code>newText</code> parameter to the
     * end of the text of the text field. This method is more efficient than an
     * addition assignment(<code>+=</code>) on a <code>text</code> property
     * (such as <code>someTextField.text += moreText</code>), particularly for a
     * text field that contains a significant amount of content.
     *
     * @param newText The string to append to the existing text.
     */
    TextField.prototype.appendText = function (newText) {
        this._text += newText;
    };
    /**
     * *tells the Textfield that a paragraph is defined completly.
     * e.g. the textfield will start a new line for future added text.
     */
    TextField.prototype.closeParagraph = function () {
        //TODO
    };
    /**
     * Returns a rectangle that is the bounding box of the character.
     *
     * @param charIndex The zero-based index value for the character(for
     *                  example, the first position is 0, the second position is
     *                  1, and so on).
     * @return A rectangle with <code>x</code> and <code>y</code> minimum and
     *         maximum values defining the bounding box of the character.
     */
    TextField.prototype.getCharBoundaries = function (charIndex) {
        return this._charBoundaries;
    };
    /**
     * Returns the zero-based index value of the character at the point specified
     * by the <code>x</code> and <code>y</code> parameters.
     *
     * @param x The <i>x</i> coordinate of the character.
     * @param y The <i>y</i> coordinate of the character.
     * @return The zero-based index value of the character(for example, the
     *         first position is 0, the second position is 1, and so on). Returns
     *         -1 if the point is not over any character.
     */
    TextField.prototype.getCharIndexAtPoint = function (x, y) {
        return this._charIndexAtPoint;
    };
    /**
     * Given a character index, returns the index of the first character in the
     * same paragraph.
     *
     * @param charIndex The zero-based index value of the character(for example,
     *                  the first character is 0, the second character is 1, and
     *                  so on).
     * @return The zero-based index value of the first character in the same
     *         paragraph.
     * @throws RangeError The character index specified is out of range.
     */
    TextField.prototype.getFirstCharInParagraph = function (charIndex /*int*/) {
        return this._firstCharInParagraph;
    };
    /**
     * Returns a DisplayObject reference for the given <code>id</code>, for an
     * image or SWF file that has been added to an HTML-formatted text field by
     * using an <code><img></code> tag. The <code><img></code> tag is in the
     * following format:
     *
     * <p><pre xml:space="preserve"><code> <img src = 'filename.jpg' id =
     * 'instanceName' ></code></pre></p>
     *
     * @param id The <code>id</code> to match(in the <code>id</code> attribute
     *           of the <code><img></code> tag).
     * @return The display object corresponding to the image or SWF file with the
     *         matching <code>id</code> attribute in the <code><img></code> tag
     *         of the text field. For media loaded from an external source, this
     *         object is a Loader object, and, once loaded, the media object is a
     *         child of that Loader object. For media embedded in the SWF file,
     *         it is the loaded object. If no <code><img></code> tag with the
     *         matching <code>id</code> exists, the method returns
     *         <code>null</code>.
     */
    TextField.prototype.getImageReference = function (id) {
        return this._imageReference;
    };
    /**
     * Returns the zero-based index value of the line at the point specified by
     * the <code>x</code> and <code>y</code> parameters.
     *
     * @param x The <i>x</i> coordinate of the line.
     * @param y The <i>y</i> coordinate of the line.
     * @return The zero-based index value of the line(for example, the first
     *         line is 0, the second line is 1, and so on). Returns -1 if the
     *         point is not over any line.
     */
    TextField.prototype.getLineIndexAtPoint = function (x, y) {
        return this._lineIndexAtPoint;
    };
    /**
     * Returns the zero-based index value of the line containing the character
     * specified by the <code>charIndex</code> parameter.
     *
     * @param charIndex The zero-based index value of the character(for example,
     *                  the first character is 0, the second character is 1, and
     *                  so on).
     * @return The zero-based index value of the line.
     * @throws RangeError The character index specified is out of range.
     */
    TextField.prototype.getLineIndexOfChar = function (charIndex /*int*/) {
        return this._lineIndexOfChar;
    };
    /**
     * Returns the number of characters in a specific text line.
     *
     * @param lineIndex The line number for which you want the length.
     * @return The number of characters in the line.
     * @throws RangeError The line number specified is out of range.
     */
    TextField.prototype.getLineLength = function (lineIndex /*int*/) {
        return this._lineLength;
    };
    /**
     * Returns metrics information about a given text line.
     *
     * @param lineIndex The line number for which you want metrics information.
     * @return A TextLineMetrics object.
     * @throws RangeError The line number specified is out of range.
     */
    TextField.prototype.getLineMetrics = function (lineIndex /*int*/) {
        return this._lineMetrics;
    };
    /**
     * Returns the character index of the first character in the line that the
     * <code>lineIndex</code> parameter specifies.
     *
     * @param lineIndex The zero-based index value of the line(for example, the
     *                  first line is 0, the second line is 1, and so on).
     * @return The zero-based index value of the first character in the line.
     * @throws RangeError The line number specified is out of range.
     */
    TextField.prototype.getLineOffset = function (lineIndex /*int*/) {
        return this._lineOffset;
    };
    /**
     * Returns the text of the line specified by the <code>lineIndex</code>
     * parameter.
     *
     * @param lineIndex The zero-based index value of the line(for example, the
     *                  first line is 0, the second line is 1, and so on).
     * @return The text string contained in the specified line.
     * @throws RangeError The line number specified is out of range.
     */
    TextField.prototype.getLineText = function (lineIndex /*int*/) {
        return this._lineText;
    };
    /**
     * Given a character index, returns the length of the paragraph containing
     * the given character. The length is relative to the first character in the
     * paragraph(as returned by <code>getFirstCharInParagraph()</code>), not to
     * the character index passed in.
     *
     * @param charIndex The zero-based index value of the character(for example,
     *                  the first character is 0, the second character is 1, and
     *                  so on).
     * @return Returns the number of characters in the paragraph.
     * @throws RangeError The character index specified is out of range.
     */
    TextField.prototype.getParagraphLength = function (charIndex /*int*/) {
        return this._paragraphLength;
    };
    /**
     * Returns a TextFormat object that contains formatting information for the
     * range of text that the <code>beginIndex</code> and <code>endIndex</code>
     * parameters specify. Only properties that are common to the entire text
     * specified are set in the resulting TextFormat object. Any property that is
     * <i>mixed</i>, meaning that it has different values at different points in
     * the text, has a value of <code>null</code>.
     *
     * <p>If you do not specify values for these parameters, this method is
     * applied to all the text in the text field. </p>
     *
     * <p>The following table describes three possible usages:</p>
     *
     * @return The TextFormat object that represents the formatting properties
     *         for the specified text.
     * @throws RangeError The <code>beginIndex</code> or <code>endIndex</code>
     *                    specified is out of range.
     */
    TextField.prototype.getTextFormat = function (beginIndex, endIndex) {
        if (beginIndex === void 0) { beginIndex = -1; }
        if (endIndex === void 0) { endIndex = -1; }
        return this._textFormat;
    };
    /**
     * Replaces the current selection with the contents of the <code>value</code>
     * parameter. The text is inserted at the position of the current selection,
     * using the current default character format and default paragraph format.
     * The text is not treated as HTML.
     *
     * <p>You can use the <code>replaceSelectedText()</code> method to insert and
     * delete text without disrupting the character and paragraph formatting of
     * the rest of the text.</p>
     *
     * <p><b>Note:</b> This method does not work if a style sheet is applied to
     * the text field.</p>
     *
     * @param value The string to replace the currently selected text.
     * @throws Error This method cannot be used on a text field with a style
     *               sheet.
     */
    TextField.prototype.replaceSelectedText = function (value) {
    };
    /**
     * Replaces the range of characters that the <code>beginIndex</code> and
     * <code>endIndex</code> parameters specify with the contents of the
     * <code>newText</code> parameter. As designed, the text from
     * <code>beginIndex</code> to <code>endIndex-1</code> is replaced.
     *
     * <p><b>Note:</b> This method does not work if a style sheet is applied to
     * the text field.</p>
     *
     * @param beginIndex The zero-based index value for the start position of the
     *                   replacement range.
     * @param endIndex   The zero-based index position of the first character
     *                   after the desired text span.
     * @param newText    The text to use to replace the specified range of
     *                   characters.
     * @throws Error This method cannot be used on a text field with a style
     *               sheet.
     */
    TextField.prototype.replaceText = function (beginIndex /*int*/, endIndex /*int*/, newText) {
    };
    /**
     * Sets as selected the text designated by the index values of the first and
     * last characters, which are specified with the <code>beginIndex</code> and
     * <code>endIndex</code> parameters. If the two parameter values are the
     * same, this method sets the insertion point, as if you set the
     * <code>caretIndex</code> property.
     *
     * @param beginIndex The zero-based index value of the first character in the
     *                   selection(for example, the first character is 0, the
     *                   second character is 1, and so on).
     * @param endIndex   The zero-based index value of the last character in the
     *                   selection.
     */
    TextField.prototype.setSelection = function (beginIndex /*int*/, endIndex /*int*/) {
    };
    /**
     * Applies the text formatting that the <code>format</code> parameter
     * specifies to the specified text in a text field. The value of
     * <code>format</code> must be a TextFormat object that specifies the desired
     * text formatting changes. Only the non-null properties of
     * <code>format</code> are applied to the text field. Any property of
     * <code>format</code> that is set to <code>null</code> is not applied. By
     * default, all of the properties of a newly created TextFormat object are
     * set to <code>null</code>.
     *
     * <p><b>Note:</b> This method does not work if a style sheet is applied to
     * the text field.</p>
     *
     * <p>The <code>setTextFormat()</code> method changes the text formatting
     * applied to a range of characters or to the entire body of text in a text
     * field. To apply the properties of format to all text in the text field, do
     * not specify values for <code>beginIndex</code> and <code>endIndex</code>.
     * To apply the properties of the format to a range of text, specify values
     * for the <code>beginIndex</code> and the <code>endIndex</code> parameters.
     * You can use the <code>length</code> property to determine the index
     * values.</p>
     *
     * <p>The two types of formatting information in a TextFormat object are
     * character level formatting and paragraph level formatting. Each character
     * in a text field can have its own character formatting settings, such as
     * font name, font size, bold, and italic.</p>
     *
     * <p>For paragraphs, the first character of the paragraph is examined for
     * the paragraph formatting settings for the entire paragraph. Examples of
     * paragraph formatting settings are left margin, right margin, and
     * indentation.</p>
     *
     * <p>Any text inserted manually by the user, or replaced by the
     * <code>replaceSelectedText()</code> method, receives the default text field
     * formatting for new text, and not the formatting specified for the text
     * insertion point. To set the default formatting for new text, use
     * <code>defaultTextFormat</code>.</p>
     *
     * @param format A TextFormat object that contains character and paragraph
     *               formatting information.
     * @throws Error      This method cannot be used on a text field with a style
     *                    sheet.
     * @throws RangeError The <code>beginIndex</code> or <code>endIndex</code>
     *                    specified is out of range.
     */
    TextField.prototype.setTextFormat = function (format, beginIndex, endIndex) {
        if (beginIndex === void 0) { beginIndex = -1; }
        if (endIndex === void 0) { endIndex = -1; }
    };
    /**
     * Returns true if an embedded font is available with the specified
     * <code>fontName</code> and <code>fontStyle</code> where
     * <code>Font.fontType</code> is <code>flash.text.FontType.EMBEDDED</code>.
     * Starting with Flash Player 10, two kinds of embedded fonts can appear in a
     * SWF file. Normal embedded fonts are only used with TextField objects. CFF
     * embedded fonts are only used with the flash.text.engine classes. The two
     * types are distinguished by the <code>fontType</code> property of the
     * <code>Font</code> class, as returned by the <code>enumerateFonts()</code>
     * function.
     *
     * <p>TextField cannot use a font of type <code>EMBEDDED_CFF</code>. If
     * <code>embedFonts</code> is set to <code>true</code> and the only font
     * available at run time with the specified name and style is of type
     * <code>EMBEDDED_CFF</code>, Flash Player fails to render the text, as if no
     * embedded font were available with the specified name and style.</p>
     *
     * <p>If both <code>EMBEDDED</code> and <code>EMBEDDED_CFF</code> fonts are
     * available with the same name and style, the <code>EMBEDDED</code> font is
     * selected and text renders with the <code>EMBEDDED</code> font.</p>
     *
     * @param fontName  The name of the embedded font to check.
     * @param fontStyle Specifies the font style to check. Use
     *                  <code>flash.text.FontStyle</code>
     * @return <code>true</code> if a compatible embedded font is available,
     *         otherwise <code>false</code>.
     * @throws ArgumentError The <code>fontStyle</code> specified is not a member
     *                       of <code>flash.text.FontStyle</code>.
     */
    TextField.isFontCompatible = function (fontName, fontStyle) {
        return false;
    };
    TextField.prototype.clone = function () {
        var newInstance = (TextField._textFields.length) ? TextField._textFields.pop() : new TextField();
        this.copyTo(newInstance);
        return newInstance;
    };
    TextField.prototype.copyTo = function (newInstance) {
        _super.prototype.copyTo.call(this, newInstance);
        newInstance.textWidth = this._textWidth;
        newInstance.textHeight = this._textHeight;
        newInstance.textFormat = this._textFormat;
        //newInstance.textColor = this._textColor;
        newInstance.text = this._text;
    };
    TextField._textFields = new Array();
    TextField.assetType = "[asset TextField]";
    return TextField;
}(Sprite_1.Sprite));
exports.TextField = TextField;

},{"../base/HierarchicalProperties":"awayjs-display/lib/base/HierarchicalProperties","../base/Style":"awayjs-display/lib/base/Style","../display/Sprite":"awayjs-display/lib/display/Sprite","../graphics/TriangleElements":"awayjs-display/lib/graphics/TriangleElements","../text/TextFieldType":"awayjs-display/lib/text/TextFieldType","awayjs-core/lib/attributes/AttributesView":undefined,"awayjs-core/lib/attributes/Byte4Attributes":undefined,"awayjs-core/lib/attributes/Float2Attributes":undefined,"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-core/lib/geom/Matrix":undefined,"awayjs-core/lib/image/Sampler2D":undefined}],"awayjs-display/lib/display":[function(require,module,exports){
"use strict";
var Billboard_1 = require("./display/Billboard");
exports.Billboard = Billboard_1.Billboard;
var Camera_1 = require("./display/Camera");
exports.Camera = Camera_1.Camera;
var DirectionalLight_1 = require("./display/DirectionalLight");
exports.DirectionalLight = DirectionalLight_1.DirectionalLight;
var DisplayObject_1 = require("./display/DisplayObject");
exports.DisplayObject = DisplayObject_1.DisplayObject;
var DisplayObjectContainer_1 = require("./display/DisplayObjectContainer");
exports.DisplayObjectContainer = DisplayObjectContainer_1.DisplayObjectContainer;
var LightBase_1 = require("./display/LightBase");
exports.LightBase = LightBase_1.LightBase;
var LightProbe_1 = require("./display/LightProbe");
exports.LightProbe = LightProbe_1.LightProbe;
var LineSegment_1 = require("./display/LineSegment");
exports.LineSegment = LineSegment_1.LineSegment;
var LoaderContainer_1 = require("./display/LoaderContainer");
exports.LoaderContainer = LoaderContainer_1.LoaderContainer;
var MovieClip_1 = require("./display/MovieClip");
exports.MovieClip = MovieClip_1.MovieClip;
var PointLight_1 = require("./display/PointLight");
exports.PointLight = PointLight_1.PointLight;
var Scene_1 = require("./display/Scene");
exports.Scene = Scene_1.Scene;
var Shape_1 = require("./display/Shape");
exports.Shape = Shape_1.Shape;
var Skybox_1 = require("./display/Skybox");
exports.Skybox = Skybox_1.Skybox;
var Sprite_1 = require("./display/Sprite");
exports.Sprite = Sprite_1.Sprite;
var TextField_1 = require("./display/TextField");
exports.TextField = TextField_1.TextField;

},{"./display/Billboard":"awayjs-display/lib/display/Billboard","./display/Camera":"awayjs-display/lib/display/Camera","./display/DirectionalLight":"awayjs-display/lib/display/DirectionalLight","./display/DisplayObject":"awayjs-display/lib/display/DisplayObject","./display/DisplayObjectContainer":"awayjs-display/lib/display/DisplayObjectContainer","./display/LightBase":"awayjs-display/lib/display/LightBase","./display/LightProbe":"awayjs-display/lib/display/LightProbe","./display/LineSegment":"awayjs-display/lib/display/LineSegment","./display/LoaderContainer":"awayjs-display/lib/display/LoaderContainer","./display/MovieClip":"awayjs-display/lib/display/MovieClip","./display/PointLight":"awayjs-display/lib/display/PointLight","./display/Scene":"awayjs-display/lib/display/Scene","./display/Shape":"awayjs-display/lib/display/Shape","./display/Skybox":"awayjs-display/lib/display/Skybox","./display/Sprite":"awayjs-display/lib/display/Sprite","./display/TextField":"awayjs-display/lib/display/TextField"}],"awayjs-display/lib/draw/CapsStyle":[function(require,module,exports){
"use strict";
/**
 * The CapsStyle class is an enumeration of constant values that specify the
 * caps style to use in drawing lines. The constants are provided for use as
 * values in the <code>caps</code> parameter of the
 * <code>flash.display.Graphics.lineStyle()</code> method. You can specify the
 * following three types of caps:
 */
var CapsStyle = (function () {
    function CapsStyle() {
    }
    /**
     * Used to specify round caps in the <code>caps</code> parameter of the
     * <code>flash.display.Graphics.lineStyle()</code> method.
     */
    CapsStyle.ROUND = 1;
    /**
     * Used to specify no caps in the <code>caps</code> parameter of the
     * <code>flash.display.Graphics.lineStyle()</code> method.
     */
    CapsStyle.NONE = 0;
    /**
     * Used to specify square caps in the <code>caps</code> parameter of the
     * <code>flash.display.Graphics.lineStyle()</code> method.
     */
    CapsStyle.SQUARE = 2;
    return CapsStyle;
}());
exports.CapsStyle = CapsStyle;

},{}],"awayjs-display/lib/draw/GradientType":[function(require,module,exports){
"use strict";
/**
 * The GradientType class provides values for the <code>type</code> parameter
 * in the <code>beginGradientFill()</code> and
 * <code>lineGradientStyle()</code> methods of the flash.display.Graphics
 * class.
 */
var GradientType = (function () {
    function GradientType() {
    }
    /**
     * Value used to specify a linear gradient fill.
     */
    GradientType.LINEAR = "linear";
    /**
     * Value used to specify a radial gradient fill.
     */
    GradientType.RADIAL = "radial";
    return GradientType;
}());
exports.GradientType = GradientType;

},{}],"awayjs-display/lib/draw/GraphicsFactoryFills":[function(require,module,exports){
"use strict";
var GraphicsPathCommand_1 = require("../draw/GraphicsPathCommand");
var DefaultMaterialManager_1 = require("../managers/DefaultMaterialManager");
var Point_1 = require("awayjs-core/lib/geom/Point");
var AttributesView_1 = require("awayjs-core/lib/attributes/AttributesView");
var Float3Attributes_1 = require("awayjs-core/lib/attributes/Float3Attributes");
var Float2Attributes_1 = require("awayjs-core/lib/attributes/Float2Attributes");
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var GraphicsFactoryHelper_1 = require("../draw/GraphicsFactoryHelper");
var TriangleElements_1 = require("../graphics/TriangleElements");
/**
 * The Graphics class contains a set of methods that you can use to create a
 * vector shape. Display objects that support drawing include Sprite and Shape
 * objects. Each of these classes includes a <code>graphics</code> property
 * that is a Graphics object. The following are among those helper functions
 * provided for ease of use: <code>drawRect()</code>,
 * <code>drawRoundRect()</code>, <code>drawCircle()</code>, and
 * <code>drawEllipse()</code>.
 *
 * <p>You cannot create a Graphics object directly from ActionScript code. If
 * you call <code>new Graphics()</code>, an exception is thrown.</p>
 *
 * <p>The Graphics class is final; it cannot be subclassed.</p>
 */
var GraphicsFactoryFills = (function () {
    function GraphicsFactoryFills() {
    }
    GraphicsFactoryFills.draw_pathes = function (targetGraphic) {
        var len = targetGraphic.queued_fill_pathes.length;
        var cp = 0;
        for (cp = 0; cp < len; cp++) {
            var one_path = targetGraphic.queued_fill_pathes[cp];
            //one_path.finalizeContour();
            var contour_commands = one_path.commands;
            var contour_data = one_path.data;
            var commands;
            var data;
            var i = 0;
            var k = 0;
            var vert_cnt = 0;
            var data_cnt = 0;
            var draw_direction = 0;
            var contours_vertices = [[]];
            var final_vert_list = [];
            var final_vert_cnt = 0;
            var lastPoint = new Point_1.Point();
            var last_dir_vec = new Point_1.Point();
            var end_point = new Point_1.Point();
            for (k = 0; k < contour_commands.length; k++) {
                contours_vertices.push([]);
                vert_cnt = 0;
                data_cnt = 0;
                commands = contour_commands[k];
                data = contour_data[k];
                draw_direction = 0;
                var new_dir = 0;
                var new_dir_1 = 0;
                var new_dir_2 = 0;
                var dir_delta = 0;
                var last_direction = 0;
                var tmp_dir_point = new Point_1.Point();
                if ((data[0] != data[data.length - 2]) || (data[1] != data[data.length - 1])) {
                    data[data.length] == data[0];
                    data[data.length] == data[1];
                }
                lastPoint.x = data[0];
                lastPoint.y = data[1];
                if (commands[1] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO) {
                    last_dir_vec.x = data[2] - lastPoint.x;
                    last_dir_vec.y = data[3] - lastPoint.y;
                }
                else if (commands[1] == GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO) {
                    last_dir_vec.x = data[4] - lastPoint.x;
                    last_dir_vec.y = data[5] - lastPoint.y;
                }
                data_cnt = 2;
                last_dir_vec.normalize();
                last_direction = Math.atan2(last_dir_vec.y, last_dir_vec.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                for (i = 1; i < commands.length; i++) {
                    end_point = new Point_1.Point(data[data_cnt++], data[data_cnt++]);
                    if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO) {
                        console.log("ERROR ! ONLY THE FIRST COMMAND FOR A CONTOUR IS ALLOWED TO BE A 'MOVE_TO' COMMAND");
                    }
                    else if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO) {
                        end_point = new Point_1.Point(data[data_cnt++], data[data_cnt++]);
                    }
                    //get the directional vector and the direction for this segment
                    tmp_dir_point.x = end_point.x - lastPoint.x;
                    tmp_dir_point.y = end_point.y - lastPoint.y;
                    tmp_dir_point.normalize();
                    new_dir = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                    // get the difference in angle to the last segment
                    dir_delta = new_dir - last_direction;
                    if (dir_delta > 180) {
                        dir_delta -= 360;
                    }
                    if (dir_delta < -180) {
                        dir_delta += 360;
                    }
                    draw_direction += dir_delta;
                    last_direction = new_dir;
                    lastPoint.x = end_point.x;
                    lastPoint.y = end_point.y;
                }
                lastPoint.x = data[0];
                lastPoint.y = data[1];
                data_cnt = 2;
                contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.x;
                contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.y;
                //console.log("Draw directions complete: "+draw_direction);
                for (i = 1; i < commands.length; i++) {
                    switch (commands[i]) {
                        case GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO:
                            console.log("ERROR ! ONLY THE FIRST COMMAND FOR A CONTOUR IS ALLOWED TO BE A 'MOVE_TO' COMMAND");
                            break;
                        case GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO:
                            lastPoint.x = data[data_cnt++];
                            lastPoint.y = data[data_cnt++];
                            contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.x;
                            contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.y;
                            break;
                        case GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO:
                            var control_x = data[data_cnt++];
                            var control_y = data[data_cnt++];
                            var end_x = data[data_cnt++];
                            var end_y = data[data_cnt++];
                            tmp_dir_point.x = control_x - lastPoint.x;
                            tmp_dir_point.y = control_y - lastPoint.y;
                            tmp_dir_point.normalize();
                            new_dir_1 = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                            tmp_dir_point.x = end_x - lastPoint.x;
                            tmp_dir_point.y = end_y - lastPoint.y;
                            tmp_dir_point.normalize();
                            new_dir_2 = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                            // get the difference in angle to the last segment
                            var curve_direction = new_dir_2 - new_dir_1;
                            if (curve_direction > 180) {
                                curve_direction -= 360;
                            }
                            if (curve_direction < -180) {
                                curve_direction += 360;
                            }
                            if ((curve_direction == 0) && (curve_direction == 180) && (curve_direction == -180)) {
                                lastPoint.x = end_x;
                                lastPoint.y = end_y;
                                contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.x;
                                contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.y;
                                break;
                            }
                            var curve_attr_1 = -1;
                            if (draw_direction < 0) {
                                if (curve_direction > 0) {
                                    //convex
                                    //console.log("convex");
                                    curve_attr_1 = 1;
                                    contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_x;
                                    contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_y;
                                }
                                contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_x;
                                contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_y;
                            }
                            else {
                                if (curve_direction < 0) {
                                    //convex
                                    //console.log("convex");
                                    curve_attr_1 = 1;
                                    contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_x;
                                    contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_y;
                                }
                                contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_x;
                                contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_y;
                            }
                            if (GraphicsFactoryHelper_1.GraphicsFactoryHelper.isClockWiseXY(end_x, end_y, control_x, control_y, lastPoint.x, lastPoint.y)) {
                                final_vert_list[final_vert_cnt++] = end_x;
                                final_vert_list[final_vert_cnt++] = end_y;
                                final_vert_list[final_vert_cnt++] = curve_attr_1;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = control_x;
                                final_vert_list[final_vert_cnt++] = control_y;
                                final_vert_list[final_vert_cnt++] = curve_attr_1;
                                final_vert_list[final_vert_cnt++] = 0.5;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = lastPoint.x;
                                final_vert_list[final_vert_cnt++] = lastPoint.y;
                                final_vert_list[final_vert_cnt++] = curve_attr_1;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                            }
                            else {
                                final_vert_list[final_vert_cnt++] = lastPoint.x;
                                final_vert_list[final_vert_cnt++] = lastPoint.y;
                                final_vert_list[final_vert_cnt++] = curve_attr_1;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = control_x;
                                final_vert_list[final_vert_cnt++] = control_y;
                                final_vert_list[final_vert_cnt++] = curve_attr_1;
                                final_vert_list[final_vert_cnt++] = 0.5;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = end_x;
                                final_vert_list[final_vert_cnt++] = end_y;
                                final_vert_list[final_vert_cnt++] = curve_attr_1;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                                final_vert_list[final_vert_cnt++] = 1.0;
                                final_vert_list[final_vert_cnt++] = 0.0;
                            }
                            lastPoint.x = end_x;
                            lastPoint.y = end_y;
                            break;
                        case GraphicsPathCommand_1.GraphicsPathCommand.CUBIC_CURVE:
                            //todo
                            break;
                    }
                }
            }
            var verts = [];
            var all_verts = [];
            var vertIndicess = [];
            var elems = [];
            for (k = 0; k < contours_vertices.length; k++) {
                var vertices = contours_vertices[k];
                //for (i = 0; i < vertices.length / 2; ++i)
                //console.log("vert collected" + i + " = " + vertices[i * 2] + " / " + vertices[i * 2 + 1]);
                var verticesF32 = new Float32Array(vertices);
                //var verticesF32 = new Float32Array([0,0, 100,0, 100,100, 0,100]);
                //console.log("in vertices", vertices);
                //var tess = new TESS();
                if (GraphicsFactoryHelper_1.GraphicsFactoryHelper._tess_obj == null) {
                    console.log("No libtess2 tesselator available.\nMake it available using Graphics._tess_obj=new TESS();");
                    return;
                }
                GraphicsFactoryHelper_1.GraphicsFactoryHelper._tess_obj.addContour(verticesF32, 2, 8, vertices.length / 2);
            }
            GraphicsFactoryHelper_1.GraphicsFactoryHelper._tess_obj.tesselate(0 /*TESS.WINDING_ODD*/, 0 /*TESS.ELEMENT_POLYGONS*/, 3, 2, null);
            //console.log("out vertices", Graphics._tess_obj.getVertices());
            verts = GraphicsFactoryHelper_1.GraphicsFactoryHelper._tess_obj.getVertices();
            elems = GraphicsFactoryHelper_1.GraphicsFactoryHelper._tess_obj.getElements();
            //console.log("out elements", Graphics._tess_obj.getElements());
            var numVerts = verts.length / 2;
            var numElems = elems.length / 3;
            for (i = 0; i < numVerts; ++i)
                all_verts.push(new Point_1.Point(verts[i * 2], verts[i * 2 + 1]));
            for (i = 0; i < numElems; ++i) {
                var p1 = elems[i * 3];
                var p2 = elems[i * 3 + 1];
                var p3 = elems[i * 3 + 2];
                final_vert_list[final_vert_cnt++] = all_verts[p3].x;
                final_vert_list[final_vert_cnt++] = all_verts[p3].y;
                final_vert_list[final_vert_cnt++] = 1;
                final_vert_list[final_vert_cnt++] = 2.0;
                final_vert_list[final_vert_cnt++] = 0.0;
                final_vert_list[final_vert_cnt++] = 1.0;
                final_vert_list[final_vert_cnt++] = 0.0;
                final_vert_list[final_vert_cnt++] = all_verts[p2].x;
                final_vert_list[final_vert_cnt++] = all_verts[p2].y;
                final_vert_list[final_vert_cnt++] = 1;
                final_vert_list[final_vert_cnt++] = 2.0;
                final_vert_list[final_vert_cnt++] = 0.0;
                final_vert_list[final_vert_cnt++] = 1.0;
                final_vert_list[final_vert_cnt++] = 0.0;
                final_vert_list[final_vert_cnt++] = all_verts[p1].x;
                final_vert_list[final_vert_cnt++] = all_verts[p1].y;
                final_vert_list[final_vert_cnt++] = 1;
                final_vert_list[final_vert_cnt++] = 2.0;
                final_vert_list[final_vert_cnt++] = 0.0;
                final_vert_list[final_vert_cnt++] = 1.0;
                final_vert_list[final_vert_cnt++] = 0.0;
            }
            //for (i = 0; i < final_vert_list.length/7; ++i)
            //	console.log("final verts "+i+" = "+final_vert_list[i*7]+" / "+final_vert_list[i*7+1]);
            var attributesView = new AttributesView_1.AttributesView(Float32Array, 7);
            attributesView.set(final_vert_list);
            var attributesBuffer = attributesView.buffer;
            attributesView.dispose();
            var elements = new TriangleElements_1.TriangleElements(attributesBuffer);
            elements.setPositions(new Float2Attributes_1.Float2Attributes(attributesBuffer));
            elements.setCustomAttributes("curves", new Float3Attributes_1.Float3Attributes(attributesBuffer));
            elements.setUVs(new Float2Attributes_1.Float2Attributes(attributesBuffer));
            var material = DefaultMaterialManager_1.DefaultMaterialManager.getDefaultMaterial();
            material.bothSides = true;
            material.useColorTransform = true;
            material.curves = true;
            var thisGraphic = targetGraphic.addGraphic(elements, material);
        }
        targetGraphic.queued_fill_pathes.length = 0;
    };
    return GraphicsFactoryFills;
}());
exports.GraphicsFactoryFills = GraphicsFactoryFills;

},{"../draw/GraphicsFactoryHelper":"awayjs-display/lib/draw/GraphicsFactoryHelper","../draw/GraphicsPathCommand":"awayjs-display/lib/draw/GraphicsPathCommand","../graphics/TriangleElements":"awayjs-display/lib/graphics/TriangleElements","../managers/DefaultMaterialManager":"awayjs-display/lib/managers/DefaultMaterialManager","awayjs-core/lib/attributes/AttributesView":undefined,"awayjs-core/lib/attributes/Float2Attributes":undefined,"awayjs-core/lib/attributes/Float3Attributes":undefined,"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Point":undefined}],"awayjs-display/lib/draw/GraphicsFactoryHelper":[function(require,module,exports){
"use strict";
var CapsStyle_1 = require("../draw/CapsStyle");
var Point_1 = require("awayjs-core/lib/geom/Point");
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
/**
 * The Graphics class contains a set of methods that you can use to create a
 * vector shape. Display objects that support drawing include Sprite and Shape
 * objects. Each of these classes includes a <code>graphics</code> property
 * that is a Graphics object. The following are among those helper functions
 * provided for ease of use: <code>drawRect()</code>,
 * <code>drawRoundRect()</code>, <code>drawCircle()</code>, and
 * <code>drawEllipse()</code>.
 *
 * <p>You cannot create a Graphics object directly from ActionScript code. If
 * you call <code>new Graphics()</code>, an exception is thrown.</p>
 *
 * <p>The Graphics class is final; it cannot be subclassed.</p>
 */
var GraphicsFactoryHelper = (function () {
    function GraphicsFactoryHelper() {
    }
    GraphicsFactoryHelper.isClockWiseXY = function (point1x, point1y, point2x, point2y, point3x, point3y) {
        var num = (point1x - point2x) * (point3y - point2y) - (point1y - point2y) * (point3x - point2x);
        if (num < 0)
            return false;
        return true;
    };
    GraphicsFactoryHelper.getSign = function (ax, ay, cx, cy, bx, by) {
        return (ax - bx) * (cy - by) - (ay - by) * (cx - bx);
    };
    GraphicsFactoryHelper.pointInTri = function (ax, ay, bx, by, cx, cy, xx, xy) {
        var b1 = GraphicsFactoryHelper.getSign(ax, ay, xx, xy, bx, by) > 0;
        var b2 = GraphicsFactoryHelper.getSign(bx, by, xx, xy, cx, cy) > 0;
        var b3 = GraphicsFactoryHelper.getSign(cx, cy, xx, xy, ax, ay) > 0;
        return ((b1 == b2) && (b2 == b3));
    };
    GraphicsFactoryHelper.getControlXForCurveX = function (a, c, b) {
        return c;
    };
    GraphicsFactoryHelper.getControlYForCurveY = function (a, c, b) {
        return c;
    };
    GraphicsFactoryHelper.drawPoint = function (startX, startY, vertices) {
        GraphicsFactoryHelper.addTriangle(startX - 2, startY - 2, startX + 2, startY - 2, startX + 2, startY + 2, 0, vertices);
        GraphicsFactoryHelper.addTriangle(startX - 2, startY - 2, startX - 2, startY + 2, startX + 2, startY + 2, 0, vertices);
    };
    GraphicsFactoryHelper.addTriangle = function (startX, startY, controlX, controlY, endX, endY, tri_type, vertices) {
        var final_vert_cnt = vertices.length;
        if (tri_type == 0) {
            vertices[final_vert_cnt++] = startX;
            vertices[final_vert_cnt++] = startY;
            vertices[final_vert_cnt++] = 1;
            vertices[final_vert_cnt++] = 2.0;
            vertices[final_vert_cnt++] = 0.0;
            vertices[final_vert_cnt++] = controlX;
            vertices[final_vert_cnt++] = controlY;
            vertices[final_vert_cnt++] = 1;
            vertices[final_vert_cnt++] = 2.0;
            vertices[final_vert_cnt++] = 0.0;
            vertices[final_vert_cnt++] = endX;
            vertices[final_vert_cnt++] = endY;
            vertices[final_vert_cnt++] = 1;
            vertices[final_vert_cnt++] = 2.0;
            vertices[final_vert_cnt++] = 0.0;
        }
        else {
            vertices[final_vert_cnt++] = startX;
            vertices[final_vert_cnt++] = startY;
            vertices[final_vert_cnt++] = tri_type;
            vertices[final_vert_cnt++] = 1.0;
            vertices[final_vert_cnt++] = 1.0;
            vertices[final_vert_cnt++] = controlX;
            vertices[final_vert_cnt++] = controlY;
            vertices[final_vert_cnt++] = tri_type;
            vertices[final_vert_cnt++] = 0.5;
            vertices[final_vert_cnt++] = 0.0;
            vertices[final_vert_cnt++] = endX;
            vertices[final_vert_cnt++] = endY;
            vertices[final_vert_cnt++] = tri_type;
            vertices[final_vert_cnt++] = 0.0;
            vertices[final_vert_cnt++] = 0.0;
        }
    };
    GraphicsFactoryHelper.createCap = function (startX, startY, start_le, start_ri, dir_vec, capstyle, cap_position, thickness, vertices) {
        if (capstyle == CapsStyle_1.CapsStyle.ROUND) {
            //console.log("add round cap");
            var tmp1_x = startX + (cap_position * (dir_vec.x * thickness));
            var tmp1_y = startY + (cap_position * (dir_vec.y * thickness));
            tmp1_x = tmp1_x * 2 - start_le.x / 2 - start_ri.x / 2;
            tmp1_y = tmp1_y * 2 - start_le.y / 2 - start_ri.y / 2;
            GraphicsFactoryHelper.addTriangle(start_le.x, start_le.y, tmp1_x, tmp1_y, start_ri.x, start_ri.y, -1, vertices);
        }
        else if (capstyle == CapsStyle_1.CapsStyle.SQUARE) {
            //console.log("add square cap");
            var tmp1_x = start_le.x + (cap_position * (dir_vec.x * thickness));
            var tmp1_y = start_le.y + (cap_position * (dir_vec.y * thickness));
            var tmp2_x = start_ri.x + (cap_position * (dir_vec.x * thickness));
            var tmp2_y = start_ri.y + (cap_position * (dir_vec.y * thickness));
            GraphicsFactoryHelper.addTriangle(tmp2_x, tmp2_y, tmp1_x, tmp1_y, start_le.x, start_le.y, 0, vertices);
            GraphicsFactoryHelper.addTriangle(tmp2_x, tmp2_y, start_le.x, start_le.y, start_ri.x, start_ri.y, 0, vertices);
        }
    };
    GraphicsFactoryHelper.getLineFormularData = function (a, b) {
        var tmp_x = b.x - a.x;
        var tmp_y = b.y - a.y;
        var return_point = new Point_1.Point();
        if ((tmp_x != 0) && (tmp_y != 0))
            return_point.x = tmp_y / tmp_x;
        return_point.y = -(return_point.x * a.x - a.y);
        return return_point;
    };
    GraphicsFactoryHelper.getQuadricBezierPosition = function (t, start, control, end) {
        var xt = 1 - t;
        return xt * xt * start + 2 * xt * t * control + t * t * end;
    };
    GraphicsFactoryHelper.subdivideCurve = function (startx, starty, cx, cy, endx, endy, startx2, starty2, cx2, cy2, endx2, endy2, array_out, array2_out) {
        var angle_1 = Math.atan2(cy - starty, cx - startx) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        var angle_2 = Math.atan2(endy - cy, endx - cx) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
        var angle_delta = angle_2 - angle_1;
        //console.log("angle_delta "+angle_delta);
        if (angle_delta > 180) {
            angle_delta -= 360;
        }
        if (angle_delta < -180) {
            angle_delta += 360;
        }
        if (Math.abs(angle_delta) >= 150) {
            array_out.push(startx, starty, cx, cy, endx, endy);
            array2_out.push(startx2, starty2, cx2, cy2, endx2, endy2);
            return;
        }
        var b1 = false;
        var b2 = false;
        if (angle_delta < 0) {
            // curve is curved to right side. right side is convex
            b1 = GraphicsFactoryHelper.getSign(startx, starty, cx2, cy2, endx, endy) > 0;
            b2 = GraphicsFactoryHelper.getSign(startx, starty, cx, cy, endx, endy) > 0;
            b1 = (((starty - endy) * (cx - startx) + (endx - startx) * (cy - starty)) * ((starty - endy) * (cx2 - startx) + (endx - startx) * (cy2 - starty))) < 0;
        }
        else {
            // curve is curved to left side. left side is convex
            b1 = GraphicsFactoryHelper.getSign(startx2, starty2, cx2, cy2, endx2, endy2) > 0;
            b2 = GraphicsFactoryHelper.getSign(startx2, starty2, cx, cy, endx2, endy2) > 0;
            b1 = (((starty2 - endy) * (cx - startx2) + (endx2 - startx2) * (cy - starty2)) * ((starty2 - endy2) * (cx2 - startx2) + (endx2 - startx2) * (cy2 - starty2))) < 0;
        }
        if (b1) {
            array_out.push(startx, starty, cx, cy, endx, endy);
            array2_out.push(startx2, starty2, cx2, cy2, endx2, endy2);
            return;
        }
        // triangles overlap. we must subdivide:
        var c1x = startx + (cx - startx) * 0.5; // new controlpoint 1.1
        var c1y = starty + (cy - starty) * 0.5;
        var c2x = cx + (endx - cx) * 0.5; // new controlpoint 1.2
        var c2y = cy + (endy - cy) * 0.5;
        var ax = c1x + (c2x - c1x) * 0.5; // new middlepoint 1
        var ay = c1y + (c2y - c1y) * 0.5;
        var c1x2 = startx2 + (cx2 - startx2) * 0.5; // new controlpoint 2.1
        var c1y2 = starty2 + (cy2 - starty2) * 0.5;
        var c2x2 = cx2 + (endx2 - cx2) * 0.5; // new controlpoint 2.2
        var c2y2 = cy2 + (endy2 - cy2) * 0.5;
        var ax2 = c1x2 + (c2x2 - c1x2) * 0.5; // new middlepoint 2
        var ay2 = c1y2 + (c2y2 - c1y2) * 0.5;
        GraphicsFactoryHelper.subdivideCurve(startx, starty, c1x, c1y, ax, ay, startx2, starty2, c1x2, c1y2, ax2, ay2, array_out, array2_out);
        GraphicsFactoryHelper.subdivideCurve(ax, ay, c2x, c2y, endx, endy, ax2, ay2, c2x2, c2y2, endx2, endy2, array_out, array2_out);
    };
    return GraphicsFactoryHelper;
}());
exports.GraphicsFactoryHelper = GraphicsFactoryHelper;

},{"../draw/CapsStyle":"awayjs-display/lib/draw/CapsStyle","awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Point":undefined}],"awayjs-display/lib/draw/GraphicsFactoryStrokes":[function(require,module,exports){
"use strict";
var MathConsts_1 = require("awayjs-core/lib/geom/MathConsts");
var JointStyle_1 = require("../draw/JointStyle");
var GraphicsPathCommand_1 = require("../draw/GraphicsPathCommand");
var DefaultMaterialManager_1 = require("../managers/DefaultMaterialManager");
var Point_1 = require("awayjs-core/lib/geom/Point");
var AttributesView_1 = require("awayjs-core/lib/attributes/AttributesView");
var Float3Attributes_1 = require("awayjs-core/lib/attributes/Float3Attributes");
var Float2Attributes_1 = require("awayjs-core/lib/attributes/Float2Attributes");
var GraphicsFactoryHelper_1 = require("../draw/GraphicsFactoryHelper");
var TriangleElements_1 = require("../graphics/TriangleElements");
/**
 * The Graphics class contains a set of methods that you can use to create a
 * vector shape. Display objects that support drawing include Sprite and Shape
 * objects. Each of these classes includes a <code>graphics</code> property
 * that is a Graphics object. The following are among those helper functions
 * provided for ease of use: <code>drawRect()</code>,
 * <code>drawRoundRect()</code>, <code>drawCircle()</code>, and
 * <code>drawEllipse()</code>.
 *
 * <p>You cannot create a Graphics object directly from ActionScript code. If
 * you call <code>new Graphics()</code>, an exception is thrown.</p>
 *
 * <p>The Graphics class is final; it cannot be subclassed.</p>
 */
var GraphicsFactoryStrokes = (function () {
    function GraphicsFactoryStrokes() {
    }
    GraphicsFactoryStrokes.draw_pathes = function (targetGraphic) {
        var len = targetGraphic.queued_stroke_pathes.length;
        var contour_commands;
        var contour_data;
        var strokeStyle;
        var one_path;
        var commands;
        var data;
        var i = 0;
        var k = 0;
        var vert_cnt = 0;
        var data_cnt = 0;
        var final_vert_list = [];
        var final_vert_cnt = 0;
        var lastPoint = new Point_1.Point();
        var start_point = new Point_1.Point();
        var end_point = new Point_1.Point();
        var start_left = new Point_1.Point();
        var start_right = new Point_1.Point();
        var ctr_left = new Point_1.Point();
        var ctr_right = new Point_1.Point();
        var ctr_left2 = new Point_1.Point();
        var ctr_right2 = new Point_1.Point();
        var end_left = new Point_1.Point();
        var end_right = new Point_1.Point();
        var tmp_point = new Point_1.Point();
        var tmp_point2 = new Point_1.Point();
        var tmp_point3 = new Point_1.Point();
        var closed = false;
        var last_dir_vec = new Point_1.Point();
        var cp = 0;
        for (cp = 0; cp < len; cp++) {
            one_path = targetGraphic.queued_stroke_pathes[cp];
            contour_commands = one_path.commands;
            contour_data = one_path.data;
            strokeStyle = one_path.stroke();
            var tessVerts = [];
            for (k = 0; k < contour_commands.length; k++) {
                commands = contour_commands[k];
                data = contour_data[k];
                vert_cnt = 0;
                data_cnt = 0;
                var new_dir = 0;
                var dir_delta = 0;
                var last_direction = 0;
                var tmp_dir_point = new Point_1.Point();
                closed = true;
                if ((data[0] != data[data.length - 2]) || (data[1] != data[data.length - 1]))
                    closed = false;
                else {
                    last_dir_vec.x = data[data.length - 2] - data[data.length - 4];
                    last_dir_vec.y = data[data.length - 1] - data[data.length - 3];
                    last_dir_vec.normalize();
                    last_direction = Math.atan2(last_dir_vec.y, last_dir_vec.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                }
                data_cnt = 0;
                lastPoint.x = data[data_cnt++];
                lastPoint.y = data[data_cnt++];
                var new_cmds = [];
                var new_pnts = [];
                var new_cmds_cnt = 0;
                var new_pnts_cnt = 0;
                var prev_normal = new Point_1.Point();
                var le_point = new Point_1.Point();
                var curve_end_point = new Point_1.Point();
                var ri_point = new Point_1.Point();
                var ctr_point = new Point_1.Point();
                prev_normal.x = -1 * last_dir_vec.y;
                prev_normal.y = last_dir_vec.x;
                for (i = 1; i < commands.length; i++) {
                    if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO) {
                        console.log("ERROR ! ONLY THE FIRST COMMAND FOR A CONTOUR IS ALLOWED TO BE A 'MOVE_TO' COMMAND");
                        continue;
                    }
                    //console.log("");
                    //console.log("segment "+i+"lastPoint x = "+lastPoint.x+" y = "+lastPoint.y)
                    end_point = new Point_1.Point(data[data_cnt++], data[data_cnt++]);
                    //console.log("segment "+i+"end_point x = "+end_point.x+" y = "+end_point.y)
                    if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO) {
                        curve_end_point = new Point_1.Point(data[data_cnt++], data[data_cnt++]);
                    }
                    //get the directional vector and the direction for this segment
                    tmp_dir_point.x = end_point.x - lastPoint.x;
                    tmp_dir_point.y = end_point.y - lastPoint.y;
                    tmp_dir_point.normalize();
                    new_dir = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                    // get the difference in angle to the last segment
                    dir_delta = new_dir - last_direction;
                    if (dir_delta > 180) {
                        dir_delta -= 360;
                    }
                    if (dir_delta < -180) {
                        dir_delta += 360;
                    }
                    last_direction = new_dir;
                    //console.log("segment "+i+" direction: "+dir_delta);
                    // rotate direction around 90 degree
                    tmp_point.x = -1 * tmp_dir_point.y;
                    tmp_point.y = tmp_dir_point.x;
                    ri_point = new Point_1.Point(lastPoint.x + (tmp_point.x * strokeStyle.half_thickness), lastPoint.y + (tmp_point.y * strokeStyle.half_thickness));
                    le_point = new Point_1.Point(lastPoint.x - (tmp_point.x * strokeStyle.half_thickness), lastPoint.y - (tmp_point.y * strokeStyle.half_thickness));
                    var add_segment = false;
                    // check if this is the first segment, and the path is not closed
                    // in this case, we can just set the points to the contour points
                    if ((i == 1) && (!closed)) {
                        //console.log("segment "+i+"Path is not closed, we can just add the first segment")
                        add_segment = true;
                    }
                    else {
                        // we need to figure out if we need to add a joint or not
                        if ((dir_delta == 0) || (dir_delta == 180)) {
                            // check if this and the prev segment was a line. if yes, than they can be merged
                            if ((i != 1) && (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO) && (new_cmds[new_cmds.length - 1] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO)) {
                                //console.log("straight line can be merged in prev straight line");
                                add_segment = false;
                            }
                            else {
                                add_segment = true;
                            }
                        }
                        if (dir_delta == 180) {
                            console.log("path goes straight back (180�). DO we need to handle this edge case different ? !");
                        }
                        else if (dir_delta != 0) {
                            add_segment = true;
                            var half_angle = (180 - (dir_delta));
                            if (dir_delta < 0) {
                                half_angle = (-180 - (dir_delta));
                            }
                            half_angle = half_angle * -0.5 * MathConsts_1.MathConsts.DEGREES_TO_RADIANS;
                            var distance = strokeStyle.half_thickness / Math.sin(half_angle);
                            tmp_point2.x = tmp_dir_point.x * Math.cos(half_angle) + tmp_dir_point.y * Math.sin(half_angle);
                            tmp_point2.y = tmp_dir_point.y * Math.cos(half_angle) - tmp_dir_point.x * Math.sin(half_angle);
                            tmp_point2.normalize();
                            var merged_pnt_ri = new Point_1.Point(lastPoint.x - (tmp_point2.x * distance), lastPoint.y - (tmp_point2.y * distance));
                            var merged_pnt_le = new Point_1.Point(lastPoint.x + (tmp_point2.x * distance), lastPoint.y + (tmp_point2.y * distance));
                            if (dir_delta > 0) {
                                ri_point = merged_pnt_ri;
                                var contour_le = new Point_1.Point(lastPoint.x - (tmp_point.x * strokeStyle.half_thickness), lastPoint.y - (tmp_point.y * strokeStyle.half_thickness));
                                var contour_prev_le = new Point_1.Point(lastPoint.x - (prev_normal.x * strokeStyle.half_thickness), lastPoint.y - (prev_normal.y * strokeStyle.half_thickness));
                                le_point = contour_le;
                            }
                            else {
                                le_point = merged_pnt_le;
                                var contour_ri = new Point_1.Point(lastPoint.x + (tmp_point.x * strokeStyle.half_thickness), lastPoint.y + (tmp_point.y * strokeStyle.half_thickness));
                                var contour_prev_ri = new Point_1.Point(lastPoint.x + (prev_normal.x * strokeStyle.half_thickness), lastPoint.y + (prev_normal.y * strokeStyle.half_thickness));
                                ri_point = contour_ri;
                            }
                            var addJoints = true;
                            if (strokeStyle.jointstyle == JointStyle_1.JointStyle.MITER) {
                                var distance_miter = (Math.sqrt((distance * distance) - (strokeStyle.half_thickness * strokeStyle.half_thickness)) / strokeStyle.half_thickness);
                                if (distance_miter <= strokeStyle.miter_limit) {
                                    addJoints = false;
                                    ri_point = merged_pnt_ri;
                                    le_point = merged_pnt_le;
                                }
                                else {
                                    if (dir_delta > 0) {
                                        contour_le.x = contour_le.x - (tmp_dir_point.x * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                        contour_le.y = contour_le.y - (tmp_dir_point.y * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                        tmp_point3.x = prev_normal.y * -1;
                                        tmp_point3.y = prev_normal.x;
                                        contour_prev_le.x = contour_prev_le.x - (tmp_point3.x * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                        contour_prev_le.y = contour_prev_le.y - (tmp_point3.y * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                    }
                                    else {
                                        contour_ri.x = contour_ri.x - (tmp_dir_point.x * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                        contour_ri.y = contour_ri.y - (tmp_dir_point.y * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                        tmp_point3.x = prev_normal.y * -1;
                                        tmp_point3.y = prev_normal.x;
                                        contour_prev_ri.x = contour_prev_ri.x - (tmp_point3.x * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                        contour_prev_ri.y = contour_prev_ri.y - (tmp_point3.y * (strokeStyle.miter_limit * strokeStyle.half_thickness));
                                    }
                                }
                            }
                            if (addJoints) {
                                new_cmds[new_cmds_cnt++] = (strokeStyle.jointstyle != JointStyle_1.JointStyle.ROUND) ? GraphicsPathCommand_1.GraphicsPathCommand.BUILD_JOINT : GraphicsPathCommand_1.GraphicsPathCommand.BUILD_ROUND_JOINT;
                                if (dir_delta > 0) {
                                    new_pnts[new_pnts_cnt++] = merged_pnt_ri;
                                    new_pnts[new_pnts_cnt++] = contour_prev_le;
                                    new_pnts[new_pnts_cnt++] = contour_le;
                                }
                                else {
                                    new_pnts[new_pnts_cnt++] = contour_prev_ri;
                                    new_pnts[new_pnts_cnt++] = merged_pnt_le;
                                    new_pnts[new_pnts_cnt++] = contour_ri;
                                }
                                if (strokeStyle.jointstyle == JointStyle_1.JointStyle.ROUND) {
                                    new_pnts[new_pnts_cnt++] = new Point_1.Point(lastPoint.x - (tmp_point2.x * Math.abs(distance)), lastPoint.y - (tmp_point2.y * Math.abs(distance)));
                                    if (dir_delta > 0) {
                                        new_pnts[new_pnts_cnt++] = contour_prev_le;
                                        new_pnts[new_pnts_cnt++] = contour_le;
                                    }
                                    else {
                                        new_pnts[new_pnts_cnt++] = contour_prev_ri;
                                        new_pnts[new_pnts_cnt++] = contour_ri;
                                    }
                                }
                            }
                        }
                    }
                    prev_normal.x = tmp_point.x;
                    prev_normal.y = tmp_point.y;
                    if (add_segment) {
                        if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO) {
                            new_cmds[new_cmds_cnt++] = GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO;
                            new_pnts[new_pnts_cnt++] = ri_point;
                            new_pnts[new_pnts_cnt++] = le_point;
                        }
                        else if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO) {
                            tmp_dir_point.x = curve_end_point.x - end_point.x;
                            tmp_dir_point.y = curve_end_point.y - end_point.y;
                            tmp_dir_point.normalize();
                            new_dir = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                            dir_delta = new_dir - last_direction;
                            last_direction = new_dir;
                            tmp_point.x = -1 * tmp_dir_point.y;
                            tmp_point.y = tmp_dir_point.x;
                            if ((dir_delta != 0) && (dir_delta != 180)) {
                                new_cmds[new_cmds_cnt++] = GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO;
                                new_pnts[new_pnts_cnt++] = ri_point;
                                new_pnts[new_pnts_cnt++] = le_point;
                                new_pnts[new_pnts_cnt++] = new Point_1.Point(lastPoint.x, lastPoint.y);
                                new_pnts[new_pnts_cnt++] = new Point_1.Point(end_point.x, end_point.y);
                                new_pnts[new_pnts_cnt++] = curve_end_point;
                            }
                            else {
                                new_cmds[new_cmds_cnt++] = GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO;
                                new_pnts[new_pnts_cnt++] = ri_point;
                                new_pnts[new_pnts_cnt++] = le_point;
                            }
                            prev_normal.x = tmp_point.x;
                            prev_normal.y = tmp_point.y;
                            lastPoint = curve_end_point;
                        }
                    }
                    if (commands[i] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO) {
                        lastPoint = end_point;
                    }
                    if (i == commands.length - 1) {
                        if (!closed) {
                            new_cmds[new_cmds_cnt++] = GraphicsPathCommand_1.GraphicsPathCommand.NO_OP;
                            new_pnts[new_pnts_cnt++] = new Point_1.Point(lastPoint.x + (tmp_point.x * strokeStyle.half_thickness), lastPoint.y + (tmp_point.y * strokeStyle.half_thickness));
                            new_pnts[new_pnts_cnt++] = new Point_1.Point(lastPoint.x - (tmp_point.x * strokeStyle.half_thickness), lastPoint.y - (tmp_point.y * strokeStyle.half_thickness));
                        }
                        else {
                            new_cmds[new_cmds_cnt++] = GraphicsPathCommand_1.GraphicsPathCommand.NO_OP;
                            new_pnts[new_pnts_cnt++] = new_pnts[0];
                            new_pnts[new_pnts_cnt++] = new_pnts[1];
                        }
                    }
                }
                // first we draw all the curves:
                new_cmds_cnt = 0;
                new_pnts_cnt = 0;
                for (i = 0; i < new_cmds.length; i++) {
                    if (new_cmds[i] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO) {
                        new_pnts_cnt += 2;
                    }
                    else if (new_cmds[i] == GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO) {
                        start_right = new_pnts[new_pnts_cnt++];
                        start_left = new_pnts[new_pnts_cnt++];
                        start_point = new_pnts[new_pnts_cnt++];
                        ctr_point = new_pnts[new_pnts_cnt++];
                        end_point = new_pnts[new_pnts_cnt++];
                        end_right = new_pnts[new_pnts_cnt];
                        end_left = new_pnts[new_pnts_cnt + 1];
                        // get the directional vector for the first part of the curve
                        tmp_dir_point.x = ctr_point.x - start_point.x;
                        tmp_dir_point.y = ctr_point.y - start_point.y;
                        tmp_point3.x = ctr_point.x - start_point.x;
                        tmp_point3.y = ctr_point.y - start_point.y;
                        var length1 = tmp_point3.length;
                        tmp_dir_point.normalize();
                        // get the directional vector for the second part of the curve
                        tmp_point2.x = end_point.x - ctr_point.x;
                        tmp_point2.y = end_point.y - ctr_point.y;
                        var length2 = tmp_point2.length;
                        tmp_point2.normalize();
                        var length_calc = 0.5 - ((length2 - length1) / length1) * 0.5;
                        if (length1 > length2) {
                            length_calc = 0.5 + ((length1 - length2) / length2) * 0.5;
                        }
                        // get angle to positive x-axis for both dir-vectors, than get the difference between those
                        var angle_1 = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                        var angle_2 = Math.atan2(tmp_point2.y, tmp_point2.x) * MathConsts_1.MathConsts.RADIANS_TO_DEGREES;
                        dir_delta = angle_2 - angle_1;
                        if (dir_delta > 180) {
                            dir_delta -= 360;
                        }
                        if (dir_delta < -180) {
                            dir_delta += 360;
                        }
                        if (dir_delta == 0) {
                            console.log("This is not a curve, we can just draw it like a straight line");
                        }
                        //console.log("segment : '"+i+"' direction:"+dir_delta);
                        var dirNumber = 1;
                        if (dir_delta < 0) {
                            dirNumber = -1;
                        }
                        var half_angle = dir_delta * 0.5 * MathConsts_1.MathConsts.DEGREES_TO_RADIANS;
                        var lengthpos = Math.abs(length1 * Math.sin(half_angle));
                        var distance = strokeStyle.half_thickness / Math.sin(half_angle);
                        tmp_point3.x = tmp_point2.x * Math.cos(half_angle) + tmp_point2.y * Math.sin(half_angle);
                        tmp_point3.y = tmp_point2.y * Math.cos(half_angle) - tmp_point2.x * Math.sin(half_angle);
                        tmp_point3.normalize();
                        var merged_pnt_ri = new Point_1.Point(ctr_point.x - (tmp_point3.x * distance), ctr_point.y - (tmp_point3.y * distance));
                        var merged_pnt_le = new Point_1.Point(ctr_point.x + (tmp_point3.x * distance), ctr_point.y + (tmp_point3.y * distance));
                        var curve_x = GraphicsFactoryHelper_1.GraphicsFactoryHelper.getQuadricBezierPosition(0.5, start_point.x, ctr_point.x, end_point.x);
                        var curve_y = GraphicsFactoryHelper_1.GraphicsFactoryHelper.getQuadricBezierPosition(0.5, start_point.y, ctr_point.y, end_point.y);
                        var curve_2x = GraphicsFactoryHelper_1.GraphicsFactoryHelper.getQuadricBezierPosition(0.501, start_point.x, ctr_point.x, end_point.x);
                        var curve_2y = GraphicsFactoryHelper_1.GraphicsFactoryHelper.getQuadricBezierPosition(0.501, start_point.y, ctr_point.y, end_point.y);
                        tmp_point3.x = -1 * (curve_y - curve_2y);
                        tmp_point3.y = curve_x - curve_2x;
                        tmp_point3.normalize();
                        //GraphicsFactoryHelper.drawPoint(curve_x,curve_y, final_vert_list);
                        // move the point on the curve to use correct thickness
                        ctr_right.x = curve_x + (dirNumber * tmp_point3.x * strokeStyle.half_thickness);
                        ctr_right.y = curve_y + (dirNumber * tmp_point3.y * strokeStyle.half_thickness);
                        ctr_left.x = curve_x - (dirNumber * tmp_point3.x * strokeStyle.half_thickness);
                        ctr_left.y = curve_y - (dirNumber * tmp_point3.y * strokeStyle.half_thickness);
                        //GraphicsFactoryHelper.drawPoint(ctr_right.x, ctr_right.y , final_vert_list);
                        //GraphicsFactoryHelper.drawPoint(ctr_left.x, ctr_left.y , final_vert_list);
                        // calculate the actual controlpoints
                        ctr_right.x = ctr_right.x * 2 - start_right.x / 2 - end_right.x / 2;
                        ctr_right.y = ctr_right.y * 2 - start_right.y / 2 - end_right.y / 2;
                        ctr_left.x = ctr_left.x * 2 - start_left.x / 2 - end_left.x / 2;
                        ctr_left.y = ctr_left.y * 2 - start_left.y / 2 - end_left.y / 2;
                        //ctr_right=merged_pnt_ri;
                        //ctr_left=merged_pnt_le;
                        /*
                        // controlpoints version2:
                        tmp_dir_point.x = start_left.x-start_right.x;
                        tmp_dir_point.y = start_left.y-start_right.y;
                        tmp_point2.x = end_left.x-end_right.x;
                        tmp_point2.y = end_left.y-end_right.y;

                        ctr_right.x = ctr_point.x-(tmp_dir_point.x/2);
                        ctr_right.y = ctr_point.y-(tmp_dir_point.y/2);
                        var new_end_ri:Point = new Point(end_point.x+(tmp_dir_point.x/2), end_point.y+(tmp_dir_point.y/2));

                        ctr_left.x = ctr_point.x+(tmp_dir_point.x/2);
                        ctr_left.y = ctr_point.y+(tmp_dir_point.y/2);
                        var new_end_le:Point = new Point(end_point.x-(tmp_dir_point.x/2), end_point.y-(tmp_dir_point.y/2));
                        */
                        /*
                                                GraphicsFactoryHelper.drawPoint(start_right.x, start_right.y , final_vert_list);
                                                GraphicsFactoryHelper.drawPoint(start_left.x, start_left.y , final_vert_list);
                                                GraphicsFactoryHelper.drawPoint(ctr_right.x, ctr_right.y , final_vert_list);
                                                GraphicsFactoryHelper.drawPoint(ctr_left.x, ctr_left.y , final_vert_list);
                                                GraphicsFactoryHelper.drawPoint(end_right.x, end_right.y , final_vert_list);
                                                GraphicsFactoryHelper.drawPoint(end_left.x, end_left.y , final_vert_list);
                        */
                        var subdivided = [];
                        var subdivided2 = [];
                        GraphicsFactoryHelper_1.GraphicsFactoryHelper.subdivideCurve(start_right.x, start_right.y, ctr_right.x, ctr_right.y, end_right.x, end_right.y, start_left.x, start_left.y, ctr_left.x, ctr_left.y, end_left.x, end_left.y, subdivided, subdivided2);
                        if (dir_delta > 0) {
                            for (var sc = 0; sc < subdivided.length / 6; sc++) {
                                // right curved
                                // concave curves:
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided[sc * 6], subdivided[sc * 6 + 1], subdivided[sc * 6 + 2], subdivided[sc * 6 + 3], subdivided[sc * 6 + 4], subdivided[sc * 6 + 5], 1, final_vert_list);
                                // fills
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided2[sc * 6], subdivided2[sc * 6 + 1], subdivided[sc * 6], subdivided[sc * 6 + 1], subdivided[sc * 6 + 2], subdivided[sc * 6 + 3], 0, final_vert_list);
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided2[sc * 6], subdivided2[sc * 6 + 1], subdivided2[sc * 6 + 4], subdivided2[sc * 6 + 5], subdivided[sc * 6 + 2], subdivided[sc * 6 + 3], 0, final_vert_list);
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided2[sc * 6 + 4], subdivided2[sc * 6 + 5], subdivided[sc * 6 + 2], subdivided[sc * 6 + 3], subdivided[sc * 6 + 4], subdivided[sc * 6 + 5], 0, final_vert_list);
                                // convex curves:
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided2[sc * 6], subdivided2[sc * 6 + 1], subdivided2[sc * 6 + 2], subdivided2[sc * 6 + 3], subdivided2[sc * 6 + 4], subdivided2[sc * 6 + 5], -1, final_vert_list);
                            }
                        }
                        else {
                            for (var sc = 0; sc < subdivided.length / 6; sc++) {
                                // left curved
                                // convex curves:
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided[sc * 6], subdivided[sc * 6 + 1], subdivided[sc * 6 + 2], subdivided[sc * 6 + 3], subdivided[sc * 6 + 4], subdivided[sc * 6 + 5], -1, final_vert_list);
                                // fills
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided[sc * 6], subdivided[sc * 6 + 1], subdivided2[sc * 6], subdivided2[sc * 6 + 1], subdivided2[sc * 6 + 2], subdivided2[sc * 6 + 3], 0, final_vert_list);
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided[sc * 6], subdivided[sc * 6 + 1], subdivided[sc * 6 + 4], subdivided[sc * 6 + 5], subdivided2[sc * 6 + 2], subdivided2[sc * 6 + 3], 0, final_vert_list);
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided[sc * 6 + 4], subdivided[sc * 6 + 5], subdivided2[sc * 6 + 2], subdivided2[sc * 6 + 3], subdivided2[sc * 6 + 4], subdivided2[sc * 6 + 5], 0, final_vert_list);
                                // concave curves:
                                GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(subdivided2[sc * 6], subdivided2[sc * 6 + 1], subdivided2[sc * 6 + 2], subdivided2[sc * 6 + 3], subdivided2[sc * 6 + 4], subdivided2[sc * 6 + 5], 1, final_vert_list);
                            }
                        }
                    }
                    else if (new_cmds[i] >= GraphicsPathCommand_1.GraphicsPathCommand.BUILD_JOINT) {
                        new_pnts_cnt += 3;
                        //GraphicsFactoryHelper.addTriangle(start_right.x,  start_right.y,  start_left.x,  start_left.y,  end_right.x,  end_right.y, 0, final_vert_list);
                        if (new_cmds[i] == GraphicsPathCommand_1.GraphicsPathCommand.BUILD_ROUND_JOINT) {
                            end_left = new_pnts[new_pnts_cnt++]; // concave curves:
                            start_right = new_pnts[new_pnts_cnt++];
                            start_left = new_pnts[new_pnts_cnt++];
                            //console.log("add round tri");
                            GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(start_right.x, start_right.y, end_left.x, end_left.y, start_left.x, start_left.y, -1, final_vert_list);
                        }
                    }
                }
                // now we draw all the normal triangles.
                // we do it in 2 steps, to prevent curves cut anything out of underlying normal tris
                new_cmds_cnt = 0;
                new_pnts_cnt = 0;
                for (i = 0; i < new_cmds.length; i++) {
                    if (new_cmds[i] == GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO) {
                        start_right = new_pnts[new_pnts_cnt++];
                        start_left = new_pnts[new_pnts_cnt++];
                        end_right = new_pnts[new_pnts_cnt];
                        end_left = new_pnts[new_pnts_cnt + 1];
                        GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(start_right.x, start_right.y, start_left.x, start_left.y, end_right.x, end_right.y, 0, final_vert_list);
                        GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(start_left.x, start_left.y, end_left.x, end_left.y, end_right.x, end_right.y, 0, final_vert_list);
                    }
                    else if (new_cmds[i] == GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO) {
                        new_pnts_cnt += 5;
                    }
                    else if (new_cmds[i] >= GraphicsPathCommand_1.GraphicsPathCommand.BUILD_JOINT) {
                        end_right = new_pnts[new_pnts_cnt++];
                        start_right = new_pnts[new_pnts_cnt++];
                        start_left = new_pnts[new_pnts_cnt++];
                        GraphicsFactoryHelper_1.GraphicsFactoryHelper.addTriangle(start_right.x, start_right.y, start_left.x, start_left.y, end_right.x, end_right.y, 0, final_vert_list);
                        if (new_cmds[i] == GraphicsPathCommand_1.GraphicsPathCommand.BUILD_ROUND_JOINT) {
                            new_pnts_cnt += 3;
                        }
                    }
                }
                if (!closed) {
                    last_dir_vec.x = data[2] - data[0];
                    last_dir_vec.y = data[3] - data[1];
                    last_dir_vec.normalize();
                    GraphicsFactoryHelper_1.GraphicsFactoryHelper.createCap(data[0], data[1], new_pnts[0], new_pnts[1], last_dir_vec, strokeStyle.capstyle, -1, strokeStyle.half_thickness, final_vert_list);
                    last_dir_vec.x = data[data.length - 2] - data[data.length - 4];
                    last_dir_vec.y = data[data.length - 1] - data[data.length - 3];
                    last_dir_vec.normalize();
                    GraphicsFactoryHelper_1.GraphicsFactoryHelper.createCap(data[data.length - 2], data[data.length - 1], new_pnts[new_pnts.length - 2], new_pnts[new_pnts.length - 1], last_dir_vec, strokeStyle.capstyle, 1, strokeStyle.half_thickness, final_vert_list);
                }
            }
            //console.log("final_vert_cnt "+(final_vert_cnt/5));
            // todo: handle material / submesh settings, and check if a material / submesh already exists for this settings
            var attributesView = new AttributesView_1.AttributesView(Float32Array, 5);
            attributesView.set(final_vert_list);
            var attributesBuffer = attributesView.buffer;
            attributesView.dispose();
            var elements = new TriangleElements_1.TriangleElements(attributesBuffer);
            elements.setPositions(new Float2Attributes_1.Float2Attributes(attributesBuffer));
            elements.setCustomAttributes("curves", new Float3Attributes_1.Float3Attributes(attributesBuffer));
            //elements.setUVs(new Float2Attributes(attributesBuffer));
            //curve_sub_geom.setUVs(new Float2Attributes(attributesBuffer));
            var material = DefaultMaterialManager_1.DefaultMaterialManager.getDefaultMaterial();
            material.bothSides = true;
            material.useColorTransform = true;
            material.curves = true;
            targetGraphic.addGraphic(elements, material);
        }
        targetGraphic.queued_stroke_pathes.length = 0;
    };
    return GraphicsFactoryStrokes;
}());
exports.GraphicsFactoryStrokes = GraphicsFactoryStrokes;

},{"../draw/GraphicsFactoryHelper":"awayjs-display/lib/draw/GraphicsFactoryHelper","../draw/GraphicsPathCommand":"awayjs-display/lib/draw/GraphicsPathCommand","../draw/JointStyle":"awayjs-display/lib/draw/JointStyle","../graphics/TriangleElements":"awayjs-display/lib/graphics/TriangleElements","../managers/DefaultMaterialManager":"awayjs-display/lib/managers/DefaultMaterialManager","awayjs-core/lib/attributes/AttributesView":undefined,"awayjs-core/lib/attributes/Float2Attributes":undefined,"awayjs-core/lib/attributes/Float3Attributes":undefined,"awayjs-core/lib/geom/MathConsts":undefined,"awayjs-core/lib/geom/Point":undefined}],"awayjs-display/lib/draw/GraphicsFillStyle":[function(require,module,exports){
"use strict";
var GraphicsFillStyle = (function () {
    function GraphicsFillStyle(color, alpha) {
        if (color === void 0) { color = 0xffffff; }
        if (alpha === void 0) { alpha = 1; }
        this._color = color;
        this._alpha = alpha;
    }
    Object.defineProperty(GraphicsFillStyle.prototype, "data_type", {
        get: function () {
            return GraphicsFillStyle.data_type;
        },
        enumerable: true,
        configurable: true
    });
    GraphicsFillStyle.data_type = "[graphicsdata FillStyle]";
    return GraphicsFillStyle;
}());
exports.GraphicsFillStyle = GraphicsFillStyle;

},{}],"awayjs-display/lib/draw/GraphicsPathCommand":[function(require,module,exports){
"use strict";
/**
 * Defines the values to use for specifying path-drawing commands.
 * The values in this class are used by the Graphics.drawPath() method,
 *or stored in the commands vector of a GraphicsPath object.
 */
var GraphicsPathCommand = (function () {
    function GraphicsPathCommand() {
    }
    /**
     * Represents the default "do nothing" command.
     */
    GraphicsPathCommand.NO_OP = 0;
    /**
     * Specifies a drawing command that moves the current drawing position
     * to the x- and y-coordinates specified in the data vector.
     */
    GraphicsPathCommand.MOVE_TO = 1;
    /**
     * Specifies a drawing command that draws a line from the current drawing position
     * to the x- and y-coordinates specified in the data vector.
     */
    GraphicsPathCommand.LINE_TO = 2;
    /**
     *  Specifies a drawing command that draws a curve from the current drawing position
     *  to the x- and y-coordinates specified in the data vector, using a control point.
     */
    GraphicsPathCommand.CURVE_TO = 3;
    /**
     *  Specifies a drawing command that draws a curve from the current drawing position
     *  to the x- and y-coordinates specified in the data vector, using a control point.
     */
    GraphicsPathCommand.BUILD_JOINT = 13;
    GraphicsPathCommand.BUILD_ROUND_JOINT = 14;
    /**
     * Specifies a "line to" drawing command,
     * but uses two sets of coordinates (four values) instead of one set.
     */
    GraphicsPathCommand.WIDE_LINE_TO = 4;
    /**
     *   Specifies a "move to" drawing command,
     *   but uses two sets of coordinates (four values) instead of one set.
     */
    GraphicsPathCommand.WIDE_MOVE_TO = 5;
    /**
     * Specifies a drawing command that draws a curve from the current drawing position
     * to the x- and y-coordinates specified in the data vector, using 2 control points.
     */
    GraphicsPathCommand.CUBIC_CURVE = 6;
    return GraphicsPathCommand;
}());
exports.GraphicsPathCommand = GraphicsPathCommand;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GraphicsPathCommand;

},{}],"awayjs-display/lib/draw/GraphicsPathWinding":[function(require,module,exports){
"use strict";
/**
 * The GraphicsPathWinding class provides values for the
 * <code>flash.display.GraphicsPath.winding</code> property and the
 * <code>flash.display.Graphics.drawPath()</code> method to determine the
 * direction to draw a path. A clockwise path is positively wound, and a
 * counter-clockwise path is negatively wound:
 *
 * <p> When paths intersect or overlap, the winding direction determines the
 * rules for filling the areas created by the intersection or overlap:</p>
 */
var GraphicsPathWinding = (function () {
    function GraphicsPathWinding() {
    }
    GraphicsPathWinding.EVEN_ODD = "evenOdd";
    GraphicsPathWinding.NON_ZERO = "nonZero";
    return GraphicsPathWinding;
}());
exports.GraphicsPathWinding = GraphicsPathWinding;

},{}],"awayjs-display/lib/draw/GraphicsPath":[function(require,module,exports){
"use strict";
var GraphicsPathWinding_1 = require("../draw/GraphicsPathWinding");
var GraphicsPathCommand_1 = require("../draw/GraphicsPathCommand");
var GraphicsFillStyle_1 = require("../draw/GraphicsFillStyle");
var GraphicsStrokeStyle_1 = require("../draw/GraphicsStrokeStyle");
var Point_1 = require("awayjs-core/lib/geom/Point");
/**

 * Defines the values to use for specifying path-drawing commands.
 * The values in this class are used by the Graphics.drawPath() method,
 *or stored in the commands vector of a GraphicsPath object.
 */
var GraphicsPath = (function () {
    function GraphicsPath(commands, data, winding_rule) {
        if (commands === void 0) { commands = null; }
        if (data === void 0) { data = null; }
        if (winding_rule === void 0) { winding_rule = GraphicsPathWinding_1.GraphicsPathWinding.EVEN_ODD; }
        this._data = [];
        this._commands = [];
        this._style = null;
        if (commands != null && data != null) {
            this._data[0] = data;
            this._commands[0] = commands;
        }
        else {
            this._data[0] = [];
            this._commands[0] = [];
        }
        this._startPoint = new Point_1.Point();
        this._cur_point = new Point_1.Point();
        this._winding_rule = winding_rule;
        this._winding_directions = [];
    }
    Object.defineProperty(GraphicsPath.prototype, "data_type", {
        get: function () {
            return GraphicsPath.data_type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPath.prototype, "style", {
        get: function () {
            return this._style;
        },
        set: function (value) {
            this._style = value;
        },
        enumerable: true,
        configurable: true
    });
    GraphicsPath.prototype.fill = function () {
        if (this._style == null)
            return null;
        if (this._style.data_type == GraphicsFillStyle_1.GraphicsFillStyle.data_type)
            return this._style;
        return null;
    };
    GraphicsPath.prototype.stroke = function () {
        if (this._style == null)
            return null;
        if (this._style.data_type == GraphicsStrokeStyle_1.GraphicsStrokeStyle.data_type)
            return this._style;
        return null;
    };
    Object.defineProperty(GraphicsPath.prototype, "commands", {
        get: function () {
            return this._commands;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPath.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    GraphicsPath.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
        if (this._commands[this._commands.length - 1].length == 0) {
            // every contour must start with a moveTo command, so we make sure we have correct startpoint
            this._commands[this._commands.length - 1].push(GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO);
            this._data[this._data.length - 1].push(this._cur_point.x);
            this._data[this._data.length - 1].push(this._cur_point.y);
        }
        this._commands[this._commands.length - 1].push(GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO);
        /*
         if(this.isFill){
         this._tmp_point.x=anchorX-this._cur_point.x;
         this._tmp_point.y=anchorY-this._cur_point.y;
         this._tmp_point.normalize();

         var testpoint:Point=new Point(this._tmp_point.x, this._tmp_point.y);
         testpoint.normalize();
         var degree_anchor:number=Math.acos(this._tmp_point.x * this._direction.x + this._tmp_point.y * this._direction.y) * 180 / Math.PI;
         if(degree_anchor>180)degree_anchor-=360;
         //var degree_anchor:number=Math.atan2(this._tmp_point.x, this._tmp_point.y) * 180 / Math.PI;
         this._draw_directions[this._draw_directions.length-1]+=degree_anchor;
         this._tmp_point.x=controlX-this._cur_point.x;
         this._tmp_point.y=controlY-this._cur_point.y;
         this._tmp_point.normalize();
         //angle = atan2( a.x*b.y - a.y*b.x, a.x*b.x + a.y*b.y );
         var degree_control:number=(Math.atan2(this._tmp_point.x* testpoint.y - this._tmp_point.y* testpoint.x, this._tmp_point.x* testpoint.x + this._tmp_point.y* testpoint.y));
         if(degree_control>180)degree_control-=360;
         //var degree_control:number=(Math.atan2(this._tmp_point.x, this._tmp_point.y) * 180 / Math.PI);
         console.log("degree_control "+degree_control);
         console.log("degree_anchor "+degree_anchor);
         console.log("this._draw_directions[this._draw_directions.length-1] "+this._draw_directions[this._draw_directions.length-1]);
         this._direction.x=testpoint.x;
         this._direction.y=testpoint.y;
         if((degree_control)<0)
         this._data[this._data.length-1].push(1);
         else
         this._data[this._data.length-1].push(2);

         }
         else{
         this._data[this._data.length-1].push(1);
         }
         */
        this._data[this._data.length - 1].push(controlX);
        this._data[this._data.length - 1].push(controlY);
        this._data[this._data.length - 1].push(anchorX);
        this._data[this._data.length - 1].push(anchorY);
        this._cur_point.x = anchorX;
        this._cur_point.y = anchorY;
    };
    GraphicsPath.prototype.lineTo = function (x, y) {
        if (this._commands[this._commands.length - 1].length == 0) {
            // every contour must start with a moveTo command, so we make sure we have correct startpoint
            this._commands[this._commands.length - 1].push(GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO);
            this._data[this._data.length - 1].push(this._cur_point.x);
            this._data[this._data.length - 1].push(this._cur_point.y);
        }
        this._commands[this._commands.length - 1].push(GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO);
        this._data[this._data.length - 1].push(x);
        this._data[this._data.length - 1].push(y);
        this._cur_point.x = x;
        this._cur_point.y = y;
    };
    GraphicsPath.prototype.moveTo = function (x, y) {
        // whenever a moveTo command apears, we start a new contour
        if (this._commands[this._commands.length - 1].length > 0) {
            this._commands.push([GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO]);
            this._data.push([x, y]);
        }
        this._startPoint.x = x;
        this._startPoint.y = y;
        this._cur_point.x = x;
        this._cur_point.y = y;
    };
    GraphicsPath.prototype.wideLineTo = function (x, y) {
        // not used
        /*
         this._commands.push(GraphicsPathCommand.WIDE_LINE_TO);
         this._data.push(0);
         this._data.push(0);
         this._data.push(x);
         this._data.push(y);
         */
    };
    GraphicsPath.prototype.wideMoveTo = function (x, y) {
        // not used
        /*
         this._commands.push(GraphicsPathCommand.WIDE_MOVE_TO);
         this._data.push(0);
         this._data.push(0);
         this._data.push(x);
         this._data.push(y);
         */
    };
    GraphicsPath.data_type = "[graphicsdata path]";
    return GraphicsPath;
}());
exports.GraphicsPath = GraphicsPath;

},{"../draw/GraphicsFillStyle":"awayjs-display/lib/draw/GraphicsFillStyle","../draw/GraphicsPathCommand":"awayjs-display/lib/draw/GraphicsPathCommand","../draw/GraphicsPathWinding":"awayjs-display/lib/draw/GraphicsPathWinding","../draw/GraphicsStrokeStyle":"awayjs-display/lib/draw/GraphicsStrokeStyle","awayjs-core/lib/geom/Point":undefined}],"awayjs-display/lib/draw/GraphicsStrokeStyle":[function(require,module,exports){
"use strict";
var JointStyle_1 = require("../draw/JointStyle");
var CapsStyle_1 = require("../draw/CapsStyle");
var GraphicsStrokeStyle = (function () {
    function GraphicsStrokeStyle(color, alpha, thickness, jointstyle, capstyle, miter_limit) {
        if (color === void 0) { color = 0xffffff; }
        if (alpha === void 0) { alpha = 1; }
        if (thickness === void 0) { thickness = 10; }
        if (jointstyle === void 0) { jointstyle = JointStyle_1.JointStyle.ROUND; }
        if (capstyle === void 0) { capstyle = CapsStyle_1.CapsStyle.SQUARE; }
        if (miter_limit === void 0) { miter_limit = 10; }
        this._color = color;
        this._alpha = alpha;
        this._thickness = thickness;
        this._jointstyle = jointstyle;
        this._capstyle = capstyle;
        this._miter_limit = miter_limit;
    }
    Object.defineProperty(GraphicsStrokeStyle.prototype, "data_type", {
        get: function () {
            return GraphicsStrokeStyle.data_type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            this._alpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "half_thickness", {
        get: function () {
            return this._thickness / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "thickness", {
        get: function () {
            return this._thickness;
        },
        set: function (value) {
            this._thickness = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "jointstyle", {
        get: function () {
            return this._jointstyle;
        },
        set: function (value) {
            this._jointstyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "miter_limit", {
        get: function () {
            return this._miter_limit;
        },
        set: function (value) {
            this._miter_limit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsStrokeStyle.prototype, "capstyle", {
        get: function () {
            return this._capstyle;
        },
        set: function (value) {
            this._capstyle = value;
        },
        enumerable: true,
        configurable: true
    });
    GraphicsStrokeStyle.data_type = "[graphicsdata StrokeStyle]";
    return GraphicsStrokeStyle;
}());
exports.GraphicsStrokeStyle = GraphicsStrokeStyle;

},{"../draw/CapsStyle":"awayjs-display/lib/draw/CapsStyle","../draw/JointStyle":"awayjs-display/lib/draw/JointStyle"}],"awayjs-display/lib/draw/IGraphicsData":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/draw/InterpolationMethod":[function(require,module,exports){
"use strict";
/**
 * The InterpolationMethod class provides values for the
 * <code>interpolationMethod</code> parameter in the
 * <code>Graphics.beginGradientFill()</code> and
 * <code>Graphics.lineGradientStyle()</code> methods. This parameter
 * determines the RGB space to use when rendering the gradient.
 */
var InterpolationMethod = (function () {
    function InterpolationMethod() {
    }
    /**
     * Specifies that the RGB interpolation method should be used. This means
     * that the gradient is rendered with exponential sRGB(standard RGB) space.
     * The sRGB space is a W3C-endorsed standard that defines a non-linear
     * conversion between red, green, and blue component values and the actual
     * intensity of the visible component color.
     *
     * <p>For example, consider a simple linear gradient between two colors(with
     * the <code>spreadMethod</code> parameter set to
     * <code>SpreadMethod.REFLECT</code>). The different interpolation methods
     * affect the appearance as follows: </p>
     */
    InterpolationMethod.LINEAR_RGB = "linearRGB";
    /**
     * Specifies that the RGB interpolation method should be used. This means
     * that the gradient is rendered with exponential sRGB(standard RGB) space.
     * The sRGB space is a W3C-endorsed standard that defines a non-linear
     * conversion between red, green, and blue component values and the actual
     * intensity of the visible component color.
     *
     * <p>For example, consider a simple linear gradient between two colors(with
     * the <code>spreadMethod</code> parameter set to
     * <code>SpreadMethod.REFLECT</code>). The different interpolation methods
     * affect the appearance as follows: </p>
     */
    InterpolationMethod.RGB = "rgb";
    return InterpolationMethod;
}());
exports.InterpolationMethod = InterpolationMethod;

},{}],"awayjs-display/lib/draw/JointStyle":[function(require,module,exports){
"use strict";
/**
 * The JointStyle class is an enumeration of constant values that specify the
 * joint style to use in drawing lines. These constants are provided for use
 * as values in the <code>joints</code> parameter of the
 * <code>flash.display.Graphics.lineStyle()</code> method. The method supports
 * three types of joints: miter, round, and bevel, as the following example
 * shows:
 */
var JointStyle = (function () {
    function JointStyle() {
    }
    /**
     * Specifies beveled joints in the <code>joints</code> parameter of the
     * <code>flash.display.Graphics.lineStyle()</code> method.
     */
    JointStyle.BEVEL = 2;
    /**
     * Specifies mitered joints in the <code>joints</code> parameter of the
     * <code>flash.display.Graphics.lineStyle()</code> method.
     */
    JointStyle.MITER = 0;
    /**
     * Specifies round joints in the <code>joints</code> parameter of the
     * <code>flash.display.Graphics.lineStyle()</code> method.
     */
    JointStyle.ROUND = 1;
    return JointStyle;
}());
exports.JointStyle = JointStyle;

},{}],"awayjs-display/lib/draw/LineScaleMode":[function(require,module,exports){
"use strict";
/**
 * The LineScaleMode class provides values for the <code>scaleMode</code>
 * parameter in the <code>Graphics.lineStyle()</code> method.
 */
var LineScaleMode = (function () {
    function LineScaleMode() {
    }
    /**
     * With this setting used as the <code>scaleMode</code> parameter of the
     * <code>lineStyle()</code> method, the thickness of the line scales
     * <i>only</i> vertically. For example, consider the following circles, drawn
     * with a one-pixel line, and each with the <code>scaleMode</code> parameter
     * set to <code>LineScaleMode.VERTICAL</code>. The circle on the left is
     * scaled only vertically, and the circle on the right is scaled both
     * vertically and horizontally.
     */
    LineScaleMode.HORIZONTAL = "horizontal";
    /**
     * With this setting used as the <code>scaleMode</code> parameter of the
     * <code>lineStyle()</code> method, the thickness of the line never scales.
     */
    LineScaleMode.NONE = "none";
    /**
     * With this setting used as the <code>scaleMode</code> parameter of the
     * <code>lineStyle()</code> method, the thickness of the line always scales
     * when the object is scaled(the default).
     */
    LineScaleMode.NORMAL = "normal";
    /**
     * With this setting used as the <code>scaleMode</code> parameter of the
     * <code>lineStyle()</code> method, the thickness of the line scales
     * <i>only</i> horizontally. For example, consider the following circles,
     * drawn with a one-pixel line, and each with the <code>scaleMode</code>
     * parameter set to <code>LineScaleMode.HORIZONTAL</code>. The circle on the
     * left is scaled only horizontally, and the circle on the right is scaled
     * both vertically and horizontally.
     */
    LineScaleMode.VERTICAL = "vertical";
    return LineScaleMode;
}());
exports.LineScaleMode = LineScaleMode;

},{}],"awayjs-display/lib/draw/PixelSnapping":[function(require,module,exports){
"use strict";
/**
 * The PixelSnapping class is an enumeration of constant values for setting
 * the pixel snapping options by using the <code>pixelSnapping</code> property
 * of a Bitmap object.
 */
var PixelSnapping = (function () {
    function PixelSnapping() {
    }
    /**
     * A constant value used in the <code>pixelSnapping</code> property of a
     * Bitmap object to specify that the bitmap image is always snapped to the
     * nearest pixel, independent of any transformation.
     */
    PixelSnapping.ALWAYS = "always";
    /**
     * A constant value used in the <code>pixelSnapping</code> property of a
     * Bitmap object to specify that the bitmap image is snapped to the nearest
     * pixel if it is drawn with no rotation or skew and it is drawn at a scale
     * factor of 99.9% to 100.1%. If these conditions are satisfied, the image is
     * drawn at 100% scale, snapped to the nearest pixel. Internally, this
     * setting allows the image to be drawn as fast as possible by using the
     * vector renderer.
     */
    PixelSnapping.AUTO = "auto";
    /**
     * A constant value used in the <code>pixelSnapping</code> property of a
     * Bitmap object to specify that no pixel snapping occurs.
     */
    PixelSnapping.NEVER = "never";
    return PixelSnapping;
}());
exports.PixelSnapping = PixelSnapping;

},{}],"awayjs-display/lib/draw/SpreadMethod":[function(require,module,exports){
"use strict";
/**
 * The SpreadMethod class provides values for the <code>spreadMethod</code>
 * parameter in the <code>beginGradientFill()</code> and
 * <code>lineGradientStyle()</code> methods of the Graphics class.
 *
 * <p>The following example shows the same gradient fill using various spread
 * methods:</p>
 */
var SpreadMethod = (function () {
    function SpreadMethod() {
    }
    /**
     * Specifies that the gradient use the <i>pad</i> spread method.
     */
    SpreadMethod.PAD = "pad";
    /**
     * Specifies that the gradient use the <i>reflect</i> spread method.
     */
    SpreadMethod.REFLECT = "reflect";
    /**
     * Specifies that the gradient use the <i>repeat</i> spread method.
     */
    SpreadMethod.REPEAT = "repeat";
    return SpreadMethod;
}());
exports.SpreadMethod = SpreadMethod;

},{}],"awayjs-display/lib/draw/TriangleCulling":[function(require,module,exports){
"use strict";
/**
 * Defines codes for culling algorithms that determine which triangles not to
 * render when drawing triangle paths.
 *
 * <p> The terms <code>POSITIVE</code> and <code>NEGATIVE</code> refer to the
 * sign of a triangle's normal along the z-axis. The normal is a 3D vector
 * that is perpendicular to the surface of the triangle. </p>
 *
 * <p> A triangle whose vertices 0, 1, and 2 are arranged in a clockwise order
 * has a positive normal value. That is, its normal points in a positive
 * z-axis direction, away from the current view point. When the
 * <code>TriangleCulling.POSITIVE</code> algorithm is used, triangles with
 * positive normals are not rendered. Another term for this is backface
 * culling. </p>
 *
 * <p> A triangle whose vertices are arranged in a counter-clockwise order has
 * a negative normal value. That is, its normal points in a negative z-axis
 * direction, toward the current view point. When the
 * <code>TriangleCulling.NEGATIVE</code> algorithm is used, triangles with
 * negative normals will not be rendered. </p>
 */
var TriangleCulling = (function () {
    function TriangleCulling() {
    }
    /**
     * Specifies culling of all triangles facing toward the current view point.
     */
    TriangleCulling.NEGATIVE = "negative";
    /**
     * Specifies no culling. All triangles in the path are rendered.
     */
    TriangleCulling.NONE = "none";
    /**
     * Specifies culling of all triangles facing away from the current view
     * point. This is also known as backface culling.
     */
    TriangleCulling.POSITIVE = "positive";
    return TriangleCulling;
}());
exports.TriangleCulling = TriangleCulling;

},{}],"awayjs-display/lib/draw":[function(require,module,exports){
"use strict";
var CapsStyle_1 = require("./draw/CapsStyle");
exports.CapsStyle = CapsStyle_1.CapsStyle;
var GradientType_1 = require("./draw/GradientType");
exports.GradientType = GradientType_1.GradientType;
var GraphicsFactoryFills_1 = require("./draw/GraphicsFactoryFills");
exports.GraphicsFactoryFills = GraphicsFactoryFills_1.GraphicsFactoryFills;
var GraphicsFactoryHelper_1 = require("./draw/GraphicsFactoryHelper");
exports.GraphicsFactoryHelper = GraphicsFactoryHelper_1.GraphicsFactoryHelper;
var GraphicsFactoryStrokes_1 = require("./draw/GraphicsFactoryStrokes");
exports.GraphicsFactoryStrokes = GraphicsFactoryStrokes_1.GraphicsFactoryStrokes;
var GraphicsFillStyle_1 = require("./draw/GraphicsFillStyle");
exports.GraphicsFillStyle = GraphicsFillStyle_1.GraphicsFillStyle;
var GraphicsStrokeStyle_1 = require("./draw/GraphicsStrokeStyle");
exports.GraphicsStrokeStyle = GraphicsStrokeStyle_1.GraphicsStrokeStyle;
var GraphicsPath_1 = require("./draw/GraphicsPath");
exports.GraphicsPath = GraphicsPath_1.GraphicsPath;
var GraphicsPathCommand_1 = require("./draw/GraphicsPathCommand");
exports.GraphicsPathCommand = GraphicsPathCommand_1.GraphicsPathCommand;
var GraphicsPathWinding_1 = require("./draw/GraphicsPathWinding");
exports.GraphicsPathWinding = GraphicsPathWinding_1.GraphicsPathWinding;
var InterpolationMethod_1 = require("./draw/InterpolationMethod");
exports.InterpolationMethod = InterpolationMethod_1.InterpolationMethod;
var JointStyle_1 = require("./draw/JointStyle");
exports.JointStyle = JointStyle_1.JointStyle;
var LineScaleMode_1 = require("./draw/LineScaleMode");
exports.LineScaleMode = LineScaleMode_1.LineScaleMode;
var PixelSnapping_1 = require("./draw/PixelSnapping");
exports.PixelSnapping = PixelSnapping_1.PixelSnapping;
var SpreadMethod_1 = require("./draw/SpreadMethod");
exports.SpreadMethod = SpreadMethod_1.SpreadMethod;
var TriangleCulling_1 = require("./draw/TriangleCulling");
exports.TriangleCulling = TriangleCulling_1.TriangleCulling;

},{"./draw/CapsStyle":"awayjs-display/lib/draw/CapsStyle","./draw/GradientType":"awayjs-display/lib/draw/GradientType","./draw/GraphicsFactoryFills":"awayjs-display/lib/draw/GraphicsFactoryFills","./draw/GraphicsFactoryHelper":"awayjs-display/lib/draw/GraphicsFactoryHelper","./draw/GraphicsFactoryStrokes":"awayjs-display/lib/draw/GraphicsFactoryStrokes","./draw/GraphicsFillStyle":"awayjs-display/lib/draw/GraphicsFillStyle","./draw/GraphicsPath":"awayjs-display/lib/draw/GraphicsPath","./draw/GraphicsPathCommand":"awayjs-display/lib/draw/GraphicsPathCommand","./draw/GraphicsPathWinding":"awayjs-display/lib/draw/GraphicsPathWinding","./draw/GraphicsStrokeStyle":"awayjs-display/lib/draw/GraphicsStrokeStyle","./draw/InterpolationMethod":"awayjs-display/lib/draw/InterpolationMethod","./draw/JointStyle":"awayjs-display/lib/draw/JointStyle","./draw/LineScaleMode":"awayjs-display/lib/draw/LineScaleMode","./draw/PixelSnapping":"awayjs-display/lib/draw/PixelSnapping","./draw/SpreadMethod":"awayjs-display/lib/draw/SpreadMethod","./draw/TriangleCulling":"awayjs-display/lib/draw/TriangleCulling"}],"awayjs-display/lib/errors/CastError":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ErrorBase_1 = require("awayjs-core/lib/errors/ErrorBase");
var CastError = (function (_super) {
    __extends(CastError, _super);
    function CastError(message) {
        _super.call(this, message);
    }
    return CastError;
}(ErrorBase_1.ErrorBase));
exports.CastError = CastError;

},{"awayjs-core/lib/errors/ErrorBase":undefined}],"awayjs-display/lib/errors":[function(require,module,exports){
"use strict";
var CastError_1 = require("./errors/CastError");
exports.CastError = CastError_1.CastError;

},{"./errors/CastError":"awayjs-display/lib/errors/CastError"}],"awayjs-display/lib/events/CameraEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
/**
 * @class away.events.CameraEvent
 */
var CameraEvent = (function (_super) {
    __extends(CameraEvent, _super);
    function CameraEvent(type, camera) {
        _super.call(this, type);
        this._camera = camera;
    }
    Object.defineProperty(CameraEvent.prototype, "camera", {
        get: function () {
            return this._camera;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     * @return An exact duplicate of the current object.
     */
    CameraEvent.prototype.clone = function () {
        return new CameraEvent(this.type, this._camera);
    };
    CameraEvent.PROJECTION_CHANGED = "projectionChanged";
    return CameraEvent;
}(EventBase_1.EventBase));
exports.CameraEvent = CameraEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/DisplayObjectEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var DisplayObjectEvent = (function (_super) {
    __extends(DisplayObjectEvent, _super);
    function DisplayObjectEvent(type, object) {
        _super.call(this, type);
        this._object = object;
    }
    Object.defineProperty(DisplayObjectEvent.prototype, "object", {
        get: function () {
            return this._object;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     * @return An exact duplicate of the current object.
     */
    DisplayObjectEvent.prototype.clone = function () {
        return new DisplayObjectEvent(this.type, this._object);
    };
    /**
     *
     */
    DisplayObjectEvent.VISIBLITY_UPDATED = "visiblityUpdated";
    /**
     *
     */
    DisplayObjectEvent.SCENETRANSFORM_CHANGED = "scenetransformChanged";
    /**
     *
     */
    DisplayObjectEvent.SCENE_CHANGED = "sceneChanged";
    /**
     *
     */
    DisplayObjectEvent.PARTITION_CHANGED = "partitionChanged";
    /**
     *
     */
    DisplayObjectEvent.INVALIDATE_PARTITION_BOUNDS = "invalidatePartitionBounds";
    return DisplayObjectEvent;
}(EventBase_1.EventBase));
exports.DisplayObjectEvent = DisplayObjectEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/ElementsEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
/**
 * Dispatched to notify changes in a sub geometry object's state.
 *
 * @class away.events.ElementsEvent
 * @see away.core.base.Graphics
 */
var ElementsEvent = (function (_super) {
    __extends(ElementsEvent, _super);
    /**
     * Create a new GraphicsEvent
     * @param type The event type.
     * @param attributesView An optional data type of the vertex data being updated.
     */
    function ElementsEvent(type, attributesView) {
        _super.call(this, type);
        this._attributesView = attributesView;
    }
    Object.defineProperty(ElementsEvent.prototype, "attributesView", {
        /**
         * The attributes view of the vertex data.
         */
        get: function () {
            return this._attributesView;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    ElementsEvent.prototype.clone = function () {
        return new ElementsEvent(this.type, this._attributesView);
    };
    /**
     * Dispatched when a Elements's index data has been updated.
     */
    ElementsEvent.INVALIDATE_INDICES = "invalidateIndices";
    /**
     * Dispatched when a Elements's index data has been disposed.
     */
    ElementsEvent.CLEAR_INDICES = "clearIndices";
    /**
     * Dispatched when a Elements's vertex data has been updated.
     */
    ElementsEvent.INVALIDATE_VERTICES = "invalidateVertices";
    /**
     * Dispatched when a Elements's vertex data has been disposed.
     */
    ElementsEvent.CLEAR_VERTICES = "clearVertices";
    return ElementsEvent;
}(EventBase_1.EventBase));
exports.ElementsEvent = ElementsEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/LightEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var LightEvent = (function (_super) {
    __extends(LightEvent, _super);
    function LightEvent(type) {
        _super.call(this, type);
    }
    //@override
    LightEvent.prototype.clone = function () {
        return new LightEvent(this.type);
    };
    LightEvent.CASTS_SHADOW_CHANGE = "castsShadowChange";
    return LightEvent;
}(EventBase_1.EventBase));
exports.LightEvent = LightEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/MouseEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
/**
 * A MouseEvent is dispatched when a mouse event occurs over a mouseEnabled object in View.
 * TODO: we don't have screenZ data, tho this should be easy to implement
 */
var MouseEvent = (function (_super) {
    __extends(MouseEvent, _super);
    /**
     * Create a new MouseEvent object.
     * @param type The type of the MouseEvent.
     */
    function MouseEvent(type) {
        _super.call(this, type);
        // Private.
        this._iAllowedToPropagate = true;
    }
    Object.defineProperty(MouseEvent.prototype, "bubbles", {
        /**
         * @inheritDoc
         */
        get: function () {
            var doesBubble = this._iAllowedToPropagate;
            this._iAllowedToPropagate = true;
            // Don't bubble if propagation has been stopped.
            return doesBubble;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    MouseEvent.prototype.stopPropagation = function () {
        this._iAllowedToPropagate = false;
        if (this._iParentEvent)
            this._iParentEvent.stopPropagation();
    };
    /**
     * @inheritDoc
     */
    MouseEvent.prototype.stopImmediatePropagation = function () {
        this._iAllowedToPropagate = false;
        if (this._iParentEvent)
            this._iParentEvent.stopImmediatePropagation();
    };
    /**
     * Creates a copy of the MouseEvent object and sets the value of each property to match that of the original.
     */
    MouseEvent.prototype.clone = function () {
        var result = new MouseEvent(this.type);
        /* TODO: Debug / test - look into isDefaultPrevented
         if (isDefaultPrevented())
         result.preventDefault();
         */
        result.screenX = this.screenX;
        result.screenY = this.screenY;
        result.view = this.view;
        result.entity = this.entity;
        result.renderable = this.renderable;
        result.material = this.material;
        result.uv = this.uv;
        result.position = this.position;
        result.normal = this.normal;
        result.elementIndex = this.elementIndex;
        result.delta = this.delta;
        result.ctrlKey = this.ctrlKey;
        result.shiftKey = this.shiftKey;
        result._iParentEvent = this;
        result._iAllowedToPropagate = this._iAllowedToPropagate;
        return result;
    };
    Object.defineProperty(MouseEvent.prototype, "scenePosition", {
        /**
         * The position in scene space where the event took place
         */
        get: function () {
            return this.entity.sceneTransform.transformVector(this.position);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseEvent.prototype, "sceneNormal", {
        /**
         * The normal in scene space where the event took place
         */
        get: function () {
            var sceneNormal = this.entity.sceneTransform.deltaTransformVector(this.normal);
            sceneNormal.normalize();
            return sceneNormal;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Defines the value of the type property of a mouseOver3d event object.
     */
    MouseEvent.MOUSE_OVER = "mouseOver3d";
    /**
     * Defines the value of the type property of a mouseOut3d event object.
     */
    MouseEvent.MOUSE_OUT = "mouseOut3d";
    /**
     * Defines the value of the type property of a mouseUp3d event object.
     */
    MouseEvent.MOUSE_UP = "mouseUp3d";
    /**
     * Defines the value of the type property of a mouseDown3d event object.
     */
    MouseEvent.MOUSE_DOWN = "mouseDown3d";
    /**
     * Defines the value of the type property of a mouseMove3d event object.
     */
    MouseEvent.MOUSE_MOVE = "mouseMove3d";
    /**
     * Defines the value of the type property of a rollOver3d event object.
     */
    //		public static ROLL_OVER : string = "rollOver3d";
    /**
     * Defines the value of the type property of a rollOut3d event object.
     */
    //		public static ROLL_OUT : string = "rollOut3d";
    /**
     * Defines the value of the type property of a click3d event object.
     */
    MouseEvent.CLICK = "click3d";
    /**
     * Defines the value of the type property of a doubleClick3d event object.
     */
    MouseEvent.DOUBLE_CLICK = "doubleClick3d";
    /**
     * Defines the value of the type property of a mouseWheel3d event object.
     */
    MouseEvent.MOUSE_WHEEL = "mouseWheel3d";
    return MouseEvent;
}(EventBase_1.EventBase));
exports.MouseEvent = MouseEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/RenderableEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
/**
 * Dispatched to notify changes in a sub geometry object's state.
 *
 * @class away.events.RenderableEvent
 * @see away.core.base.Graphics
 */
var RenderableEvent = (function (_super) {
    __extends(RenderableEvent, _super);
    /**
     * Create a new GraphicsEvent
     * @param type The event type.
     * @param dataType An optional data type of the vertex data being updated.
     */
    function RenderableEvent(type, renderable) {
        _super.call(this, type);
        this._renderable = renderable;
    }
    Object.defineProperty(RenderableEvent.prototype, "renderable", {
        /**
         * The renderobject owner of the renderable owner.
         */
        get: function () {
            return this._renderable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    RenderableEvent.prototype.clone = function () {
        return new RenderableEvent(this.type, this._renderable);
    };
    /**
     * Dispatched when a Renderable owners's render object owner has been updated.
     */
    RenderableEvent.INVALIDATE_SURFACE = "invalidateRenderable";
    /**
     *
     */
    RenderableEvent.INVALIDATE_ELEMENTS = "invalidateElements";
    return RenderableEvent;
}(EventBase_1.EventBase));
exports.RenderableEvent = RenderableEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/RendererEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var RendererEvent = (function (_super) {
    __extends(RendererEvent, _super);
    function RendererEvent(type) {
        _super.call(this, type);
    }
    RendererEvent.VIEWPORT_UPDATED = "viewportUpdated";
    RendererEvent.SCISSOR_UPDATED = "scissorUpdated";
    return RendererEvent;
}(EventBase_1.EventBase));
exports.RendererEvent = RendererEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/ResizeEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var ResizeEvent = (function (_super) {
    __extends(ResizeEvent, _super);
    function ResizeEvent(type, oldHeight, oldWidth) {
        if (oldHeight === void 0) { oldHeight = NaN; }
        if (oldWidth === void 0) { oldWidth = NaN; }
        _super.call(this, type);
        this._oldHeight = oldHeight;
        this._oldWidth = oldWidth;
    }
    Object.defineProperty(ResizeEvent.prototype, "oldHeight", {
        get: function () {
            return this._oldHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizeEvent.prototype, "oldWidth", {
        get: function () {
            return this._oldWidth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    ResizeEvent.prototype.clone = function () {
        return new ResizeEvent(this.type, this._oldHeight, this._oldWidth);
    };
    ResizeEvent.RESIZE = "resize";
    return ResizeEvent;
}(EventBase_1.EventBase));
exports.ResizeEvent = ResizeEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/StyleEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var StyleEvent = (function (_super) {
    __extends(StyleEvent, _super);
    function StyleEvent(type, style) {
        _super.call(this, type);
        this._style = style;
    }
    Object.defineProperty(StyleEvent.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     * @return An exact duplicate of the current object.
     */
    StyleEvent.prototype.clone = function () {
        return new StyleEvent(this.type, this._style);
    };
    /**
     *
     */
    StyleEvent.INVALIDATE_PROPERTIES = "invalidateProperties";
    return StyleEvent;
}(EventBase_1.EventBase));
exports.StyleEvent = StyleEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/SurfaceEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var SurfaceEvent = (function (_super) {
    __extends(SurfaceEvent, _super);
    /**
     * Create a new GraphicsEvent
     * @param type The event type.
     * @param dataType An optional data type of the vertex data being updated.
     */
    function SurfaceEvent(type, surface) {
        _super.call(this, type);
        this._surface = surface;
    }
    Object.defineProperty(SurfaceEvent.prototype, "surface", {
        /**
         * The surface of the renderable.
         */
        get: function () {
            return this._surface;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     *
     * @return An exact duplicate of the current object.
     */
    SurfaceEvent.prototype.clone = function () {
        return new SurfaceEvent(this.type, this._surface);
    };
    SurfaceEvent.INVALIDATE_TEXTURE = "invalidateTexture";
    SurfaceEvent.INVALIDATE_ANIMATION = "invalidateAnimation";
    SurfaceEvent.INVALIDATE_PASSES = "invalidatePasses";
    return SurfaceEvent;
}(EventBase_1.EventBase));
exports.SurfaceEvent = SurfaceEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/TouchEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var TouchEvent = (function (_super) {
    __extends(TouchEvent, _super);
    /**
     * Create a new TouchEvent object.
     * @param type The type of the TouchEvent.
     */
    function TouchEvent(type) {
        _super.call(this, type);
        // Private.
        this._iAllowedToPropagate = true;
    }
    Object.defineProperty(TouchEvent.prototype, "bubbles", {
        /**
         * @inheritDoc
         */
        get: function () {
            var doesBubble = this._iAllowedToPropagate;
            this._iAllowedToPropagate = true;
            // Don't bubble if propagation has been stopped.
            return doesBubble;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    TouchEvent.prototype.stopPropagation = function () {
        this._iAllowedToPropagate = false;
        if (this._iParentEvent)
            this._iParentEvent.stopPropagation();
    };
    /**
     * @inheritDoc
     */
    TouchEvent.prototype.stopImmediatePropagation = function () {
        this._iAllowedToPropagate = false;
        if (this._iParentEvent)
            this._iParentEvent.stopImmediatePropagation();
    };
    /**
     * Creates a copy of the TouchEvent object and sets the value of each property to match that of the original.
     */
    TouchEvent.prototype.clone = function () {
        var result = new TouchEvent(this.type);
        /* TODO: Debug / test - look into isDefaultPrevented
         if (isDefaultPrevented())
         result.preventDefault();
         */
        result.screenX = this.screenX;
        result.screenY = this.screenY;
        result.view = this.view;
        result.entity = this.entity;
        result.renderable = this.renderable;
        result.material = this.material;
        result.uv = this.uv;
        result.position = this.position;
        result.normal = this.normal;
        result.elementIndex = this.elementIndex;
        result.ctrlKey = this.ctrlKey;
        result.shiftKey = this.shiftKey;
        result._iParentEvent = this;
        return result;
    };
    Object.defineProperty(TouchEvent.prototype, "scenePosition", {
        /**
         * The position in scene space where the event took place
         */
        get: function () {
            return this.entity.sceneTransform.transformVector(this.position);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TouchEvent.prototype, "sceneNormal", {
        /**
         * The normal in scene space where the event took place
         */
        get: function () {
            var sceneNormal = this.entity.sceneTransform.deltaTransformVector(this.normal);
            sceneNormal.normalize();
            return sceneNormal;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    TouchEvent.TOUCH_END = "touchEnd3d";
    /**
     *
     */
    TouchEvent.TOUCH_BEGIN = "touchBegin3d";
    /**
     *
     */
    TouchEvent.TOUCH_MOVE = "touchMove3d";
    /**
     *
     */
    TouchEvent.TOUCH_OUT = "touchOut3d";
    /**
     *
     */
    TouchEvent.TOUCH_OVER = "touchOver3d";
    return TouchEvent;
}(EventBase_1.EventBase));
exports.TouchEvent = TouchEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events/TransformEvent":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventBase_1 = require("awayjs-core/lib/events/EventBase");
var TransformEvent = (function (_super) {
    __extends(TransformEvent, _super);
    function TransformEvent(type, transform) {
        _super.call(this, type);
        this._transform = transform;
    }
    Object.defineProperty(TransformEvent.prototype, "transform", {
        get: function () {
            return this._transform;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the event.
     * @return An exact duplicate of the current object.
     */
    TransformEvent.prototype.clone = function () {
        return new TransformEvent(this.type, this._transform);
    };
    /**
     *
     */
    TransformEvent.INVALIDATE_MATRIX3D = "invalidateMatrix3D";
    /**
     *
     */
    TransformEvent.INVALIDATE_COLOR_TRANSFORM = "invalidateColorTransform";
    return TransformEvent;
}(EventBase_1.EventBase));
exports.TransformEvent = TransformEvent;

},{"awayjs-core/lib/events/EventBase":undefined}],"awayjs-display/lib/events":[function(require,module,exports){
"use strict";
var CameraEvent_1 = require("./events/CameraEvent");
exports.CameraEvent = CameraEvent_1.CameraEvent;
var DisplayObjectEvent_1 = require("./events/DisplayObjectEvent");
exports.DisplayObjectEvent = DisplayObjectEvent_1.DisplayObjectEvent;
var ElementsEvent_1 = require("./events/ElementsEvent");
exports.ElementsEvent = ElementsEvent_1.ElementsEvent;
var LightEvent_1 = require("./events/LightEvent");
exports.LightEvent = LightEvent_1.LightEvent;
var MouseEvent_1 = require("./events/MouseEvent");
exports.MouseEvent = MouseEvent_1.MouseEvent;
var RenderableEvent_1 = require("./events/RenderableEvent");
exports.RenderableEvent = RenderableEvent_1.RenderableEvent;
var RendererEvent_1 = require("./events/RendererEvent");
exports.RendererEvent = RendererEvent_1.RendererEvent;
var ResizeEvent_1 = require("./events/ResizeEvent");
exports.ResizeEvent = ResizeEvent_1.ResizeEvent;
var StyleEvent_1 = require("./events/StyleEvent");
exports.StyleEvent = StyleEvent_1.StyleEvent;
var SurfaceEvent_1 = require("./events/SurfaceEvent");
exports.SurfaceEvent = SurfaceEvent_1.SurfaceEvent;
var TouchEvent_1 = require("./events/TouchEvent");
exports.TouchEvent = TouchEvent_1.TouchEvent;
var TransformEvent_1 = require("./events/TransformEvent");
exports.TransformEvent = TransformEvent_1.TransformEvent;

},{"./events/CameraEvent":"awayjs-display/lib/events/CameraEvent","./events/DisplayObjectEvent":"awayjs-display/lib/events/DisplayObjectEvent","./events/ElementsEvent":"awayjs-display/lib/events/ElementsEvent","./events/LightEvent":"awayjs-display/lib/events/LightEvent","./events/MouseEvent":"awayjs-display/lib/events/MouseEvent","./events/RenderableEvent":"awayjs-display/lib/events/RenderableEvent","./events/RendererEvent":"awayjs-display/lib/events/RendererEvent","./events/ResizeEvent":"awayjs-display/lib/events/ResizeEvent","./events/StyleEvent":"awayjs-display/lib/events/StyleEvent","./events/SurfaceEvent":"awayjs-display/lib/events/SurfaceEvent","./events/TouchEvent":"awayjs-display/lib/events/TouchEvent","./events/TransformEvent":"awayjs-display/lib/events/TransformEvent"}],"awayjs-display/lib/factories/ITimelineSceneGraphFactory":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/factories":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/graphics/ElementsBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesView_1 = require("awayjs-core/lib/attributes/AttributesView");
var Float3Attributes_1 = require("awayjs-core/lib/attributes/Float3Attributes");
var Short3Attributes_1 = require("awayjs-core/lib/attributes/Short3Attributes");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var ElementsEvent_1 = require("../events/ElementsEvent");
/**
 * @class away.base.TriangleElements
 */
var ElementsBase = (function (_super) {
    __extends(ElementsBase, _super);
    /**
     *
     */
    function ElementsBase(concatenatedBuffer) {
        if (concatenatedBuffer === void 0) { concatenatedBuffer = null; }
        _super.call(this);
        this._customAttributesNames = new Array();
        this._customAttributes = new Object();
        this._numElements = 0;
        this._numVertices = 0;
        this._verticesDirty = new Object();
        this._invalidateVertices = new Object();
        this._concatenatedBuffer = concatenatedBuffer;
    }
    Object.defineProperty(ElementsBase.prototype, "concatenatedBuffer", {
        get: function () {
            return this._concatenatedBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementsBase.prototype, "indices", {
        /**
         * The raw index data that define the faces.
         */
        get: function () {
            return this._indices;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ElementsBase.prototype.getCustomAtributesNames = function () {
        return this._customAttributesNames;
    };
    /**
     *
     */
    ElementsBase.prototype.getCustomAtributes = function (name) {
        return this._customAttributes[name];
    };
    Object.defineProperty(ElementsBase.prototype, "numElements", {
        /**
         * The total amount of triangles in the TriangleElements.
         */
        get: function () {
            return this._numElements;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementsBase.prototype, "numVertices", {
        get: function () {
            return this._numVertices;
        },
        enumerable: true,
        configurable: true
    });
    ElementsBase.prototype.copyTo = function (elements) {
        if (this.indices)
            elements.setIndices(this.indices.clone());
        for (var name in this._customAttributes)
            elements.setCustomAttributes(name, this.getCustomAtributes(name).clone());
    };
    /**
     *
     */
    ElementsBase.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._indices) {
            this._indices.dispose();
            this._indices = null;
        }
        for (var name in this._customAttributes) {
            this._customAttributes[name].dispose();
            delete this._customAttributes;
        }
    };
    ElementsBase.prototype.setIndices = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values instanceof Short3Attributes_1.Short3Attributes) {
            if (this._indices)
                this.clearIndices();
            this._indices = values;
        }
        else if (values) {
            if (!this._indices)
                this._indices = new Short3Attributes_1.Short3Attributes();
            this._indices.set(values, offset);
        }
        else if (this._indices) {
            this._indices.dispose();
            this._indices = null;
            this.clearIndices();
        }
        if (this._indices) {
            this._numElements = this._indices.count;
            this.invalidateIndicies();
        }
        else {
            this._numElements = 0;
        }
    };
    ElementsBase.prototype.setCustomAttributes = function (name, values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values == this._customAttributes[name])
            return;
        if (values instanceof AttributesView_1.AttributesView) {
            this.clearVertices(this._customAttributes[name]);
            this._customAttributes[name] = values;
        }
        else if (values) {
            if (!this._customAttributes[name])
                this._customAttributes[name] = new Float3Attributes_1.Float3Attributes(this._concatenatedBuffer); //default custom atrributes is Float3
            this._customAttributes[name].set(values, offset);
        }
        else if (this._customAttributes[name]) {
            this.clearVertices(this._customAttributes[name]);
            this._customAttributesNames.splice(this._customAttributesNames.indexOf(name), 1);
            delete this._customAttributes[name];
            return;
        }
        this.invalidateVertices(this._customAttributes[name]);
        this._verticesDirty[this._customAttributes[name].id] = false;
        if (this._customAttributesNames.indexOf(name) == -1)
            this._customAttributesNames.push(name);
    };
    /**
     * Clones the current object
     * @return An exact duplicate of the current object.
     */
    ElementsBase.prototype.clone = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ElementsBase.prototype.applyTransformation = function (transform, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * Scales the geometry.
     * @param scale The amount by which to scale.
     */
    ElementsBase.prototype.scale = function (scale, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ElementsBase.prototype.scaleUV = function (scaleU, scaleV, count, offset) {
        if (scaleU === void 0) { scaleU = 1; }
        if (scaleV === void 0) { scaleV = 1; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ElementsBase.prototype.getBoxBounds = function (target, count, offset) {
        if (target === void 0) { target = null; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ElementsBase.prototype.getSphereBounds = function (center, target, count, offset) {
        if (target === void 0) { target = null; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ElementsBase.prototype.hitTestPoint = function (x, y, z, box, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ElementsBase.prototype.invalidateIndicies = function () {
        if (!this._invalidateIndices)
            this._invalidateIndices = new ElementsEvent_1.ElementsEvent(ElementsEvent_1.ElementsEvent.INVALIDATE_INDICES, this._indices);
        this.dispatchEvent(this._invalidateIndices);
    };
    ElementsBase.prototype.clearIndices = function () {
        this.dispatchEvent(new ElementsEvent_1.ElementsEvent(ElementsEvent_1.ElementsEvent.CLEAR_INDICES, this._indices));
    };
    ElementsBase.prototype.invalidateVertices = function (attributesView) {
        if (!attributesView || this._verticesDirty[attributesView.id])
            return;
        this._verticesDirty[attributesView.id] = true;
        if (!this._invalidateVertices[attributesView.id])
            this._invalidateVertices[attributesView.id] = new ElementsEvent_1.ElementsEvent(ElementsEvent_1.ElementsEvent.INVALIDATE_VERTICES, attributesView);
        this.dispatchEvent(this._invalidateVertices[attributesView.id]);
    };
    ElementsBase.prototype.clearVertices = function (attributesView) {
        if (!attributesView)
            return;
        attributesView.dispose();
        this.dispatchEvent(new ElementsEvent_1.ElementsEvent(ElementsEvent_1.ElementsEvent.CLEAR_VERTICES, attributesView));
        this._verticesDirty[attributesView.id] = null;
        this._invalidateVertices[attributesView.id] = null;
    };
    ElementsBase.prototype._iTestCollision = function (pickingCollider, material, pickingCollision, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    return ElementsBase;
}(AssetBase_1.AssetBase));
exports.ElementsBase = ElementsBase;

},{"../events/ElementsEvent":"awayjs-display/lib/events/ElementsEvent","awayjs-core/lib/attributes/AttributesView":undefined,"awayjs-core/lib/attributes/Float3Attributes":undefined,"awayjs-core/lib/attributes/Short3Attributes":undefined,"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/graphics/ElementsType":[function(require,module,exports){
"use strict";
var ElementsType = (function () {
    function ElementsType() {
    }
    /**
     *
     */
    ElementsType.TRIANGLE = "triangle";
    /**
     *
     */
    ElementsType.LINE = "line";
    return ElementsType;
}());
exports.ElementsType = ElementsType;

},{}],"awayjs-display/lib/graphics/Graphics":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point_1 = require("awayjs-core/lib/geom/Point");
var Box_1 = require("awayjs-core/lib/geom/Box");
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var Graphic_1 = require("../graphics/Graphic");
var ElementsEvent_1 = require("../events/ElementsEvent");
var StyleEvent_1 = require("../events/StyleEvent");
var GraphicsPath_1 = require("../draw/GraphicsPath");
var GraphicsFactoryFills_1 = require("../draw/GraphicsFactoryFills");
var GraphicsFactoryStrokes_1 = require("../draw/GraphicsFactoryStrokes");
var PartialImplementationError_1 = require("awayjs-core/lib/errors/PartialImplementationError");
var JointStyle_1 = require("../draw/JointStyle");
var CapsStyle_1 = require("../draw/CapsStyle");
var GraphicsStrokeStyle_1 = require("../draw/GraphicsStrokeStyle");
var GraphicsFillStyle_1 = require("../draw/GraphicsFillStyle");
/**
 *
 * Graphics is a collection of SubGeometries, each of which contain the actual geometrical data such as vertices,
 * normals, uvs, etc. It also contains a reference to an animation class, which defines how the geometry moves.
 * A Graphics object is assigned to a Sprite, a scene graph occurence of the geometry, which in turn assigns
 * the SubGeometries to its respective TriangleGraphic objects.
 *
 *
 *
 * @see away.core.base.SubGraphics
 * @see away.entities.Sprite
 *
 * @class Graphics
 */
var Graphics = (function (_super) {
    __extends(Graphics, _super);
    /**
     * Creates a new Graphics object.
     */
    function Graphics() {
        var _this = this;
        _super.call(this);
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
        this._graphics = new Array();
        this._current_position = new Point_1.Point();
        this._current_position = new Point_1.Point();
        this._queued_fill_pathes = [];
        this._queued_stroke_pathes = [];
        this._active_fill_path = null;
        this._active_stroke_path = null;
        this._onInvalidatePropertiesDelegate = function (event) { return _this._onInvalidateProperties(event); };
        this._onInvalidateVerticesDelegate = function (event) { return _this._onInvalidateVertices(event); };
    }
    Object.defineProperty(Graphics.prototype, "assetType", {
        get: function () {
            return Graphics.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "count", {
        get: function () {
            return this._graphics.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "animator", {
        /**
         * Defines the animator of the graphics object.  Default value is <code>null</code>.
         */
        get: function () {
            return this._animator;
        },
        set: function (value) {
            this._animator = value;
            var len = this._graphics.length;
            var graphic;
            for (var i = 0; i < len; ++i) {
                graphic = this._graphics[i];
                // cause material to be unregistered and registered again to work with the new animation type (if possible)
                if (graphic.material) {
                    graphic.material.iRemoveOwner(graphic);
                    graphic.material.iAddOwner(graphic);
                }
                //invalidate any existing graphic objects in case they need to pull new elements
                graphic.invalidateElements();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "style", {
        /**
         *
         */
        get: function () {
            return this._style;
        },
        set: function (value) {
            if (this._style == value)
                return;
            if (this._style)
                this._style.removeEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._style = value;
            if (this._style)
                this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._iInvalidateSurfaces();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "queued_stroke_pathes", {
        get: function () {
            return this._queued_stroke_pathes;
        },
        set: function (value) {
            this._queued_stroke_pathes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "queued_fill_pathes", {
        get: function () {
            return this._queued_fill_pathes;
        },
        set: function (value) {
            this._queued_fill_pathes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "material", {
        /**
         * The material with which to render the Graphics.
         */
        get: function () {
            return this._material;
        },
        set: function (value) {
            if (value == this._material)
                return;
            var i;
            var len = this._graphics.length;
            var graphic;
            if (this._material)
                for (i = 0; i < len; i++)
                    if (!(graphic = this._graphics[i])._iGetExplicitMaterial())
                        this._material.iRemoveOwner(graphic);
            this._material = value;
            if (this._material)
                for (i = 0; i < len; i++)
                    if (!(graphic = this._graphics[i])._iGetExplicitMaterial())
                        this._material.iAddOwner(graphic);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a GraphicBase wrapping a Elements.
     *
     * @param elements
     */
    Graphics.prototype.addGraphic = function (elements, material, style, count, offset) {
        if (material === void 0) { material = null; }
        if (style === void 0) { style = null; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        var graphic;
        if (Graphic_1.Graphic._available.length) {
            graphic = Graphic_1.Graphic._available.pop();
            graphic._iIndex = this._graphics.length;
            graphic.parent = this;
            graphic.elements = elements;
            graphic.material = material;
            graphic.style = style;
            graphic.count = count;
            graphic.offset = offset;
        }
        else {
            graphic = new Graphic_1.Graphic(this._graphics.length, this, elements, material, style, count, offset);
        }
        this._graphics.push(graphic);
        graphic.addEventListener(ElementsEvent_1.ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
        this.invalidate();
        return graphic;
    };
    Graphics.prototype.removeGraphic = function (graphic) {
        this._graphics.splice(this._graphics.indexOf(graphic), 1);
        graphic.removeEventListener(ElementsEvent_1.ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
        graphic.elements = null;
        graphic.material = null;
        graphic.style = null;
        graphic.clear();
        this.invalidate();
    };
    Graphics.prototype.getGraphicAt = function (index) {
        return this._graphics[index];
    };
    Graphics.prototype.applyTransformation = function (transform) {
        var len = this._graphics.length;
        for (var i = 0; i < len; ++i)
            this._graphics[i].applyTransformation(transform);
    };
    Graphics.prototype.copyTo = function (graphics) {
        graphics.material = this._material;
        graphics.style = this.style;
        graphics.particles = this.particles;
        graphics.numParticles = this.numParticles;
        var graphic;
        var len = this._graphics.length;
        for (var i = 0; i < len; ++i) {
            graphic = this._graphics[i];
            graphics.addGraphic(graphic.elements, graphic._iGetExplicitMaterial(), graphic._iGetExplicitStyle(), graphic.count, graphic.offset);
        }
        if (this._animator)
            graphics.animator = this._animator.clone();
    };
    Graphics.prototype.clone = function () {
        var newInstance = new Graphics();
        this.copyTo(newInstance);
        return newInstance;
    };
    /**
     * Scales the geometry.
     * @param scale The amount by which to scale.
     */
    Graphics.prototype.scale = function (scale) {
        var len = this._graphics.length;
        for (var i = 0; i < len; ++i)
            this._graphics[i].scale(scale);
    };
    Graphics.prototype.clear = function () {
        for (var i = this._graphics.length - 1; i >= 0; i--) {
            this._graphics[i].clear();
        }
    };
    /**
     * Clears all resources used by the Graphics object, including SubGeometries.
     */
    Graphics.prototype.dispose = function () {
        this.material = null;
        for (var i = this._graphics.length - 1; i >= 0; i--)
            this._graphics[i].dispose();
        if (this._animator)
            this._animator.dispose();
    };
    /**
     * Scales the uv coordinates (tiling)
     * @param scaleU The amount by which to scale on the u axis. Default is 1;
     * @param scaleV The amount by which to scale on the v axis. Default is 1;
     */
    Graphics.prototype.scaleUV = function (scaleU, scaleV) {
        if (scaleU === void 0) { scaleU = 1; }
        if (scaleV === void 0) { scaleV = 1; }
        var len = this._graphics.length;
        for (var i = 0; i < len; ++i)
            this._graphics[i].scaleUV(scaleU, scaleV);
    };
    Graphics.prototype.getBoxBounds = function () {
        if (this._boxBoundsInvalid) {
            this._boxBoundsInvalid = false;
            if (!this._boxBounds)
                this._boxBounds = new Box_1.Box();
            if (this._graphics.length) {
                this._boxBounds.setBoundIdentity();
                var len = this._graphics.length;
                for (var i = 0; i < len; i++)
                    this._boxBounds = this._boxBounds.union(this._graphics[i].getBoxBounds(), this._boxBounds);
            }
            else {
                this._boxBounds.setEmpty();
            }
        }
        return this._boxBounds;
    };
    Graphics.prototype.getSphereBounds = function (center, target) {
        if (target === void 0) { target = null; }
        var len = this._graphics.length;
        for (var i = 0; i < len; i++)
            target = this._graphics[i].getSphereBounds(center, target);
        return target;
    };
    Graphics.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
    };
    Graphics.prototype._iInvalidateSurfaces = function () {
        var len = this._graphics.length;
        for (var i = 0; i < len; ++i)
            this._graphics[i].invalidateSurface();
    };
    Graphics.prototype.invalidateElements = function () {
        var len = this._graphics.length;
        for (var i = 0; i < len; ++i)
            this._graphics[i].invalidateElements();
    };
    Graphics.prototype._hitTestPointInternal = function (x, y) {
        //TODO: handle lines as well
        var len = this._graphics.length;
        for (var i = 0; i < len; i++)
            if (this._graphics[i].hitTestPoint(x, y, 0))
                return true;
        return false;
    };
    Graphics.prototype.acceptTraverser = function (traverser) {
        var len = this._graphics.length;
        for (var i = 0; i < len; i++)
            traverser.applyRenderable(this._graphics[i]);
    };
    Graphics.prototype._onInvalidateProperties = function (event) {
        this._iInvalidateSurfaces();
    };
    Graphics.prototype._onInvalidateVertices = function (event) {
        if (event.attributesView != event.target.positions)
            return;
        this.invalidate();
    };
    Graphics.prototype.draw_fills = function () {
        GraphicsFactoryFills_1.GraphicsFactoryFills.draw_pathes(this);
    };
    Graphics.prototype.draw_strokes = function () {
        GraphicsFactoryStrokes_1.GraphicsFactoryStrokes.draw_pathes(this);
    };
    /**
     * Fills a drawing area with a bitmap image. The bitmap can be repeated or
     * tiled to fill the area. The fill remains in effect until you call the
     * <code>beginFill()</code>, <code>beginBitmapFill()</code>,
     * <code>beginGradientFill()</code>, or <code>beginShaderFill()</code>
     * method. Calling the <code>clear()</code> method clears the fill.
     *
     * <p>The application renders the fill whenever three or more points are
     * drawn, or when the <code>endFill()</code> method is called. </p>
     *
     * @param bitmap A transparent or opaque bitmap image that contains the bits
     *               to be displayed.
     * @param matrix A matrix object(of the flash.geom.Matrix class), which you
     *               can use to define transformations on the bitmap. For
     *               example, you can use the following matrix to rotate a bitmap
     *               by 45 degrees(pi/4 radians):
     * @param repeat If <code>true</code>, the bitmap image repeats in a tiled
     *               pattern. If <code>false</code>, the bitmap image does not
     *               repeat, and the edges of the bitmap are used for any fill
     *               area that extends beyond the bitmap.
     *
     *               <p>For example, consider the following bitmap(a 20 x
     *               20-pixel checkerboard pattern):</p>
     *
     *               <p>When <code>repeat</code> is set to <code>true</code>(as
     *               in the following example), the bitmap fill repeats the
     *               bitmap:</p>
     *
     *               <p>When <code>repeat</code> is set to <code>false</code>,
     *               the bitmap fill uses the edge pixels for the fill area
     *               outside the bitmap:</p>
     * @param smooth If <code>false</code>, upscaled bitmap images are rendered
     *               by using a nearest-neighbor algorithm and look pixelated. If
     *               <code>true</code>, upscaled bitmap images are rendered by
     *               using a bilinear algorithm. Rendering by using the nearest
     *               neighbor algorithm is faster.
     */
    Graphics.prototype.beginBitmapFill = function (bitmap, matrix, repeat, smooth) {
        if (matrix === void 0) { matrix = null; }
        if (repeat === void 0) { repeat = true; }
        if (smooth === void 0) { smooth = false; }
        this.draw_fills();
        // start a new fill path
        this._active_fill_path = new GraphicsPath_1.GraphicsPath();
        // todo: create bitmap fill style
        this._active_fill_path.style = new GraphicsFillStyle_1.GraphicsFillStyle(0xffffff, 1);
        if (this._current_position.x != 0 || this._current_position.y != 0)
            this._active_fill_path.moveTo(this._current_position.x, this._current_position.y);
        this._queued_fill_pathes.push(this._active_fill_path);
    };
    /**
     * Specifies a simple one-color fill that subsequent calls to other Graphics
     * methods(such as <code>lineTo()</code> or <code>drawCircle()</code>) use
     * when drawing. The fill remains in effect until you call the
     * <code>beginFill()</code>, <code>beginBitmapFill()</code>,
     * <code>beginGradientFill()</code>, or <code>beginShaderFill()</code>
     * method. Calling the <code>clear()</code> method clears the fill.
     *
     * <p>The application renders the fill whenever three or more points are
     * drawn, or when the <code>endFill()</code> method is called.</p>
     *
     * @param color The color of the fill(0xRRGGBB).
     * @param alpha The alpha value of the fill(0.0 to 1.0).
     */
    Graphics.prototype.beginFill = function (color /*int*/, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this.draw_fills();
        // start a new fill path
        this._active_fill_path = new GraphicsPath_1.GraphicsPath();
        this._active_fill_path.style = new GraphicsFillStyle_1.GraphicsFillStyle(color, alpha);
        if (this._current_position.x != 0 || this._current_position.y != 0)
            this._active_fill_path.moveTo(this._current_position.x, this._current_position.y);
        this._queued_fill_pathes.push(this._active_fill_path);
    };
    /**
     * Specifies a gradient fill used by subsequent calls to other Graphics
     * methods(such as <code>lineTo()</code> or <code>drawCircle()</code>) for
     * the object. The fill remains in effect until you call the
     * <code>beginFill()</code>, <code>beginBitmapFill()</code>,
     * <code>beginGradientFill()</code>, or <code>beginShaderFill()</code>
     * method. Calling the <code>clear()</code> method clears the fill.
     *
     * <p>The application renders the fill whenever three or more points are
     * drawn, or when the <code>endFill()</code> method is called. </p>
     *
     * @param type                A value from the GradientType class that
     *                            specifies which gradient type to use:
     *                            <code>GradientType.LINEAR</code> or
     *                            <code>GradientType.RADIAL</code>.
     * @param colors              An array of RGB hexadecimal color values used
     *                            in the gradient; for example, red is 0xFF0000,
     *                            blue is 0x0000FF, and so on. You can specify
     *                            up to 15 colors. For each color, specify a
     *                            corresponding value in the alphas and ratios
     *                            parameters.
     * @param alphas              An array of alpha values for the corresponding
     *                            colors in the colors array; valid values are 0
     *                            to 1. If the value is less than 0, the default
     *                            is 0. If the value is greater than 1, the
     *                            default is 1.
     * @param ratios              An array of color distribution ratios; valid
     *                            values are 0-255. This value defines the
     *                            percentage of the width where the color is
     *                            sampled at 100%. The value 0 represents the
     *                            left position in the gradient box, and 255
     *                            represents the right position in the gradient
     *                            box.
     * @param matrix              A transformation matrix as defined by the
     *                            flash.geom.Matrix class. The flash.geom.Matrix
     *                            class includes a
     *                            <code>createGradientBox()</code> method, which
     *                            lets you conveniently set up the matrix for use
     *                            with the <code>beginGradientFill()</code>
     *                            method.
     * @param spreadMethod        A value from the SpreadMethod class that
     *                            specifies which spread method to use, either:
     *                            <code>SpreadMethod.PAD</code>,
     *                            <code>SpreadMethod.REFLECT</code>, or
     *                            <code>SpreadMethod.REPEAT</code>.
     *
     *                            <p>For example, consider a simple linear
     *                            gradient between two colors:</p>
     *
     *                            <p>This example uses
     *                            <code>SpreadMethod.PAD</code> for the spread
     *                            method, and the gradient fill looks like the
     *                            following:</p>
     *
     *                            <p>If you use <code>SpreadMethod.REFLECT</code>
     *                            for the spread method, the gradient fill looks
     *                            like the following:</p>
     *
     *                            <p>If you use <code>SpreadMethod.REPEAT</code>
     *                            for the spread method, the gradient fill looks
     *                            like the following:</p>
     * @param interpolationMethod A value from the InterpolationMethod class that
     *                            specifies which value to use:
     *                            <code>InterpolationMethod.LINEAR_RGB</code> or
     *                            <code>InterpolationMethod.RGB</code>
     *
     *                            <p>For example, consider a simple linear
     *                            gradient between two colors(with the
     *                            <code>spreadMethod</code> parameter set to
     *                            <code>SpreadMethod.REFLECT</code>). The
     *                            different interpolation methods affect the
     *                            appearance as follows: </p>
     * @param focalPointRatio     A number that controls the location of the
     *                            focal point of the gradient. 0 means that the
     *                            focal point is in the center. 1 means that the
     *                            focal point is at one border of the gradient
     *                            circle. -1 means that the focal point is at the
     *                            other border of the gradient circle. A value
     *                            less than -1 or greater than 1 is rounded to -1
     *                            or 1. For example, the following example shows
     *                            a <code>focalPointRatio</code> set to 0.75:
     * @throws ArgumentError If the <code>type</code> parameter is not valid.
     */
    Graphics.prototype.beginGradientFill = function (type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
        if (matrix === void 0) { matrix = null; }
        if (spreadMethod === void 0) { spreadMethod = "pad"; }
        if (interpolationMethod === void 0) { interpolationMethod = "rgb"; }
        if (focalPointRatio === void 0) { focalPointRatio = 0; }
        this.draw_fills();
        // start a new fill path
        this._active_fill_path = new GraphicsPath_1.GraphicsPath();
        // todo: create gradient fill style
        this._active_fill_path.style = new GraphicsFillStyle_1.GraphicsFillStyle(colors[0], alphas[0]);
        if (this._current_position.x != 0 || this._current_position.y != 0)
            this._active_fill_path.moveTo(this._current_position.x, this._current_position.y);
        this._queued_fill_pathes.push(this._active_fill_path);
    };
    /**
     * Copies all of drawing commands from the source Graphics object into the
     * calling Graphics object.
     *
     * @param sourceGraphics The Graphics object from which to copy the drawing
     *                       commands.
     */
    Graphics.prototype.copyFrom = function (sourceGraphics) {
        sourceGraphics.copyTo(this);
    };
    /**
     * Draws a cubic Bezier curve from the current drawing position to the
     * specified anchor point. Cubic Bezier curves consist of two anchor points
     * and two control points. The curve interpolates the two anchor points and
     * curves toward the two control points.
     *
     * The four points you use to draw a cubic Bezier curve with the
     * <code>cubicCurveTo()</code> method are as follows:
     *
     * <ul>
     *   <li>The current drawing position is the first anchor point. </li>
     *   <li>The anchorX and anchorY parameters specify the second anchor point.
     *   </li>
     *   <li>The <code>controlX1</code> and <code>controlY1</code> parameters
     *   specify the first control point.</li>
     *   <li>The <code>controlX2</code> and <code>controlY2</code> parameters
     *   specify the second control point.</li>
     * </ul>
     *
     * If you call the <code>cubicCurveTo()</code> method before calling the
     * <code>moveTo()</code> method, your curve starts at position (0, 0).
     *
     * If the <code>cubicCurveTo()</code> method succeeds, the Flash runtime sets
     * the current drawing position to (<code>anchorX</code>,
     * <code>anchorY</code>). If the <code>cubicCurveTo()</code> method fails,
     * the current drawing position remains unchanged.
     *
     * If your movie clip contains content created with the Flash drawing tools,
     * the results of calls to the <code>cubicCurveTo()</code> method are drawn
     * underneath that content.
     *
     * @param controlX1 Specifies the horizontal position of the first control
     *                  point relative to the registration point of the parent
     *                  display object.
     * @param controlY1 Specifies the vertical position of the first control
     *                  point relative to the registration point of the parent
     *                  display object.
     * @param controlX2 Specifies the horizontal position of the second control
     *                  point relative to the registration point of the parent
     *                  display object.
     * @param controlY2 Specifies the vertical position of the second control
     *                  point relative to the registration point of the parent
     *                  display object.
     * @param anchorX   Specifies the horizontal position of the anchor point
     *                  relative to the registration point of the parent display
     *                  object.
     * @param anchorY   Specifies the vertical position of the anchor point
     *                  relative to the registration point of the parent display
     *                  object.
     */
    Graphics.prototype.cubicCurveTo = function (controlX1, controlY1, controlX2, controlY2, anchorX, anchorY) {
        throw new PartialImplementationError_1.PartialImplementationError("cubicCurveTo");
        /*
         t = 0.5; // given example value
         x = (1 - t) * (1 - t) * p[0].x + 2 * (1 - t) * t * p[1].x + t * t * p[2].x;
         y = (1 - t) * (1 - t) * p[0].y + 2 * (1 - t) * t * p[1].y + t * t * p[2].y;

         this.queued_command_types.push(Graphics.CMD_BEZIER);
         this.queued_command_data.push(controlX1);
         this.queued_command_data.push(controlY1);
         this.queued_command_data.push(controlX2);
         this.queued_command_data.push(controlY2);
         this.queued_command_data.push(anchorX);
         this.queued_command_data.push(anchorY);

         // todo: somehow convert cubic bezier curve into 2 quadric curves...

         this.draw_direction+=0;
         */
    };
    /**
     * Draws a curve using the current line style from the current drawing
     * position to(anchorX, anchorY) and using the control point that
     * (<code>controlX</code>, <code>controlY</code>) specifies. The current
     * drawing position is then set to(<code>anchorX</code>,
     * <code>anchorY</code>). If the movie clip in which you are drawing contains
     * content created with the Flash drawing tools, calls to the
     * <code>curveTo()</code> method are drawn underneath this content. If you
     * call the <code>curveTo()</code> method before any calls to the
     * <code>moveTo()</code> method, the default of the current drawing position
     * is(0, 0). If any of the parameters are missing, this method fails and the
     * current drawing position is not changed.
     *
     * <p>The curve drawn is a quadratic Bezier curve. Quadratic Bezier curves
     * consist of two anchor points and one control point. The curve interpolates
     * the two anchor points and curves toward the control point. </p>
     *
     * @param controlX A number that specifies the horizontal position of the
     *                 control point relative to the registration point of the
     *                 parent display object.
     * @param controlY A number that specifies the vertical position of the
     *                 control point relative to the registration point of the
     *                 parent display object.
     * @param anchorX  A number that specifies the horizontal position of the
     *                 next anchor point relative to the registration point of
     *                 the parent display object.
     * @param anchorY  A number that specifies the vertical position of the next
     *                 anchor point relative to the registration point of the
     *                 parent display object.
     */
    Graphics.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
        if (this._active_fill_path != null) {
            this._active_fill_path.curveTo(controlX, controlY, anchorX, anchorY);
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.curveTo(controlX, controlY, anchorX, anchorY);
        }
        this._current_position.x = anchorX;
        this._current_position.y = anchorY;
    };
    /**
     * Draws a circle. Set the line style, fill, or both before you call the
     * <code>drawCircle()</code> method, by calling the <code>linestyle()</code>,
     * <code>lineGradientStyle()</code>, <code>beginFill()</code>,
     * <code>beginGradientFill()</code>, or <code>beginBitmapFill()</code>
     * method.
     *
     * @param x      The <i>x</i> location of the center of the circle relative
     *               to the registration point of the parent display object(in
     *               pixels).
     * @param y      The <i>y</i> location of the center of the circle relative
     *               to the registration point of the parent display object(in
     *               pixels).
     * @param radius The radius of the circle(in pixels).
     */
    Graphics.prototype.drawCircle = function (x, y, radius) {
        // todo: directly create triangles instead of draw commands ?
        var radius2 = radius * 1.065;
        if (this._active_fill_path != null) {
            this._active_fill_path.moveTo(x - radius, y);
            for (var i = 8; i >= 0; i--) {
                var degree = (i) * (360 / 8) * Math.PI / 180;
                var degree2 = degree + ((360 / 16) * Math.PI / 180);
                this._active_fill_path.curveTo(x - (Math.cos(degree2) * radius2), y + (Math.sin(degree2) * radius2), x - (Math.cos(degree) * radius), y + (Math.sin(degree) * radius));
            }
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.moveTo(x, y + radius);
            var radius2 = radius * 0.93;
            this._active_stroke_path.curveTo(x - (radius2), y + (radius2), x - radius, y);
            this._active_stroke_path.curveTo(x - (radius2), y - (radius2), x, y - radius);
            this._active_stroke_path.curveTo(x + (radius2), y - (radius2), x + radius, y);
            this._active_stroke_path.curveTo(x + (radius2), y + (radius2), x, y + radius);
        }
    };
    /**
     * Draws an ellipse. Set the line style, fill, or both before you call the
     * <code>drawEllipse()</code> method, by calling the
     * <code>linestyle()</code>, <code>lineGradientStyle()</code>,
     * <code>beginFill()</code>, <code>beginGradientFill()</code>, or
     * <code>beginBitmapFill()</code> method.
     *
     * @param x      The <i>x</i> location of the top-left of the bounding-box of
     *               the ellipse relative to the registration point of the parent
     *               display object(in pixels).
     * @param y      The <i>y</i> location of the top left of the bounding-box of
     *               the ellipse relative to the registration point of the parent
     *               display object(in pixels).
     * @param width  The width of the ellipse(in pixels).
     * @param height The height of the ellipse(in pixels).
     */
    Graphics.prototype.drawEllipse = function (x, y, width, height) {
        width /= 2;
        height /= 2;
        if (this._active_fill_path != null) {
            this._active_fill_path.moveTo(x, y + height);
            this._active_fill_path.curveTo(x - (width), y + (height), x - width, y);
            this._active_fill_path.curveTo(x - (width), y - (height), x, y - height);
            this._active_fill_path.curveTo(x + (width), y - (height), x + width, y);
            this._active_fill_path.curveTo(x + (width), y + (height), x, y + height);
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.moveTo(x, y + height);
            this._active_stroke_path.curveTo(x - (width), y + (height), x - width, y);
            this._active_stroke_path.curveTo(x - (width), y - (height), x, y - height);
            this._active_stroke_path.curveTo(x + (width), y - (height), x + width, y);
            this._active_stroke_path.curveTo(x + (width), y + (height), x, y + height);
        }
    };
    /**
     * Submits a series of IGraphicsData instances for drawing. This method
     * accepts a Vector containing objects including paths, fills, and strokes
     * that implement the IGraphicsData interface. A Vector of IGraphicsData
     * instances can refer to a part of a shape, or a complex fully defined set
     * of data for rendering a complete shape.
     *
     * <p> Graphics paths can contain other graphics paths. If the
     * <code>graphicsData</code> Vector includes a path, that path and all its
     * sub-paths are rendered during this operation. </p>
     *
     */
    Graphics.prototype.drawGraphicsData = function (graphicsData) {
        //this.draw_fills();
        /*
         for (var i:number=0; i<graphicsData.length; i++){
         //todo
         if(graphicsData[i].dataType=="beginFill"){

         }
         else if(graphicsData[i].dataType=="endFill"){

         }
         else if(graphicsData[i].dataType=="endFill"){

         }
         else if(graphicsData[i].dataType=="Path"){

         }

         }
         */
    };
    /**
     * Submits a series of commands for drawing. The <code>drawPath()</code>
     * method uses vector arrays to consolidate individual <code>moveTo()</code>,
     * <code>lineTo()</code>, and <code>curveTo()</code> drawing commands into a
     * single call. The <code>drawPath()</code> method parameters combine drawing
     * commands with x- and y-coordinate value pairs and a drawing direction. The
     * drawing commands are values from the GraphicsPathCommand class. The x- and
     * y-coordinate value pairs are Numbers in an array where each pair defines a
     * coordinate location. The drawing direction is a value from the
     * GraphicsPathWinding class.
     *
     * <p> Generally, drawings render faster with <code>drawPath()</code> than
     * with a series of individual <code>lineTo()</code> and
     * <code>curveTo()</code> methods. </p>
     *
     * <p> The <code>drawPath()</code> method uses a uses a floating computation
     * so rotation and scaling of shapes is more accurate and gives better
     * results. However, curves submitted using the <code>drawPath()</code>
     * method can have small sub-pixel alignment errors when used in conjunction
     * with the <code>lineTo()</code> and <code>curveTo()</code> methods. </p>
     *
     * <p> The <code>drawPath()</code> method also uses slightly different rules
     * for filling and drawing lines. They are: </p>
     *
     * <ul>
     *   <li>When a fill is applied to rendering a path:
     * <ul>
     *   <li>A sub-path of less than 3 points is not rendered.(But note that the
     * stroke rendering will still occur, consistent with the rules for strokes
     * below.)</li>
     *   <li>A sub-path that isn't closed(the end point is not equal to the
     * begin point) is implicitly closed.</li>
     * </ul>
     * </li>
     *   <li>When a stroke is applied to rendering a path:
     * <ul>
     *   <li>The sub-paths can be composed of any number of points.</li>
     *   <li>The sub-path is never implicitly closed.</li>
     * </ul>
     * </li>
     * </ul>
     *
     * @param winding Specifies the winding rule using a value defined in the
     *                GraphicsPathWinding class.
     */
    Graphics.prototype.drawPath = function (commands, data, winding) {
        //todo
        /*
         if(this._active_fill_path!=null){
         this._active_fill_path.curveTo(controlX, controlY, anchorX, anchorY);
         }
         if(this._active_stroke_path!=null){
         this._active_stroke_path.curveTo(controlX, controlY, anchorX, anchorY);
         }
         this._current_position.x=anchorX;
         this._current_position.y=anchorY;
         */
    };
    /**
     * Draws a rectangle. Set the line style, fill, or both before you call the
     * <code>drawRect()</code> method, by calling the <code>linestyle()</code>,
     * <code>lineGradientStyle()</code>, <code>beginFill()</code>,
     * <code>beginGradientFill()</code>, or <code>beginBitmapFill()</code>
     * method.
     *
     * @param x      A number indicating the horizontal position relative to the
     *               registration point of the parent display object(in pixels).
     * @param y      A number indicating the vertical position relative to the
     *               registration point of the parent display object(in pixels).
     * @param width  The width of the rectangle(in pixels).
     * @param height The height of the rectangle(in pixels).
     * @throws ArgumentError If the <code>width</code> or <code>height</code>
     *                       parameters are not a number
     *                      (<code>Number.NaN</code>).
     */
    Graphics.prototype.drawRect = function (x, y, width, height) {
        //todo: directly create triangles instead of drawing commands ?
        if (this._active_fill_path != null) {
            this._active_fill_path.moveTo(x, y);
            this._active_fill_path.lineTo(x + width, y);
            this._active_fill_path.lineTo(x + width, y + height);
            this._active_fill_path.lineTo(x, y + height);
            this._active_fill_path.lineTo(x, y);
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.moveTo(x, y);
            this._active_stroke_path.lineTo(x + width, y);
            this._active_stroke_path.lineTo(x + width, y + height);
            this._active_stroke_path.lineTo(x, y + height);
            this._active_stroke_path.lineTo(x, y);
        }
    };
    /**
     * Draws a rounded rectangle. Set the line style, fill, or both before you
     * call the <code>drawRoundRect()</code> method, by calling the
     * <code>linestyle()</code>, <code>lineGradientStyle()</code>,
     * <code>beginFill()</code>, <code>beginGradientFill()</code>, or
     * <code>beginBitmapFill()</code> method.
     *
     * @param x             A number indicating the horizontal position relative
     *                      to the registration point of the parent display
     *                      object(in pixels).
     * @param y             A number indicating the vertical position relative to
     *                      the registration point of the parent display object
     *                     (in pixels).
     * @param width         The width of the round rectangle(in pixels).
     * @param height        The height of the round rectangle(in pixels).
     * @param ellipseWidth  The width of the ellipse used to draw the rounded
     *                      corners(in pixels).
     * @param ellipseHeight The height of the ellipse used to draw the rounded
     *                      corners(in pixels). Optional; if no value is
     *                      specified, the default value matches that provided
     *                      for the <code>ellipseWidth</code> parameter.
     * @throws ArgumentError If the <code>width</code>, <code>height</code>,
     *                       <code>ellipseWidth</code> or
     *                       <code>ellipseHeight</code> parameters are not a
     *                       number(<code>Number.NaN</code>).
     */
    Graphics.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
        if (ellipseHeight === void 0) { ellipseHeight = NaN; }
        //todo: directly create triangles instead of drawing commands ?
        if (!ellipseHeight) {
            ellipseHeight = ellipseWidth;
        }
        if (this._active_fill_path != null) {
            this._active_fill_path.moveTo(x + ellipseWidth, y);
            this._active_fill_path.lineTo(x + width - ellipseWidth, y);
            this._active_fill_path.curveTo(x + width, y, x + width, y + ellipseHeight);
            this._active_fill_path.lineTo(x + width, y + height - ellipseHeight);
            this._active_fill_path.curveTo(x + width, y + height, x + width - ellipseWidth, y + height);
            this._active_fill_path.lineTo(x + ellipseWidth, y + height);
            this._active_fill_path.curveTo(x, y + height, x, y + height - ellipseHeight);
            this._active_fill_path.lineTo(x, y + ellipseHeight);
            this._active_fill_path.curveTo(x, y, x + ellipseWidth, y);
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.moveTo(x + ellipseWidth, y);
            this._active_stroke_path.lineTo(x + width - ellipseWidth, y);
            this._active_stroke_path.curveTo(x + width, y, x + width, y + ellipseHeight);
            this._active_stroke_path.lineTo(x + width, y + height - ellipseHeight);
            this._active_stroke_path.curveTo(x + width, y + height, x + width - ellipseWidth, y + height);
            this._active_stroke_path.lineTo(x + ellipseWidth, y + height);
            this._active_stroke_path.curveTo(x, y + height, x, y + height - ellipseHeight);
            this._active_stroke_path.lineTo(x, y + ellipseHeight);
            this._active_stroke_path.curveTo(x, y, x + ellipseWidth, y);
        }
    };
    //public drawRoundRectComplex(x:Float, y:Float, width:Float, height:Float, topLeftRadius:Float, topRightRadius:Float, bottomLeftRadius:Float, bottomRightRadius:Float):Void;
    /**
     * Renders a set of triangles, typically to distort bitmaps and give them a
     * three-dimensional appearance. The <code>drawTriangles()</code> method maps
     * either the current fill, or a bitmap fill, to the triangle faces using a
     * set of(u,v) coordinates.
     *
     * <p> Any type of fill can be used, but if the fill has a transform matrix
     * that transform matrix is ignored. </p>
     *
     * <p> A <code>uvtData</code> parameter improves texture mapping when a
     * bitmap fill is used. </p>
     *
     * @param culling Specifies whether to render triangles that face in a
     *                specified direction. This parameter prevents the rendering
     *                of triangles that cannot be seen in the current view. This
     *                parameter can be set to any value defined by the
     *                TriangleCulling class.
     */
    Graphics.prototype.drawTriangles = function (vertices, indices, uvtData, culling) {
        if (indices === void 0) { indices = null; }
        if (uvtData === void 0) { uvtData = null; }
        if (culling === void 0) { culling = null; }
        if (this._active_fill_path != null) {
        }
        if (this._active_stroke_path != null) {
        }
    };
    /**
     * Applies a fill to the lines and curves that were added since the last call
     * to the <code>beginFill()</code>, <code>beginGradientFill()</code>, or
     * <code>beginBitmapFill()</code> method. Flash uses the fill that was
     * specified in the previous call to the <code>beginFill()</code>,
     * <code>beginGradientFill()</code>, or <code>beginBitmapFill()</code>
     * method. If the current drawing position does not equal the previous
     * position specified in a <code>moveTo()</code> method and a fill is
     * defined, the path is closed with a line and then filled.
     *
     */
    Graphics.prototype.endFill = function () {
        this.draw_strokes();
        this.draw_fills();
        this._active_fill_path = null;
        this._active_stroke_path = null;
    };
    /**
     * Specifies a bitmap to use for the line stroke when drawing lines.
     *
     * <p>The bitmap line style is used for subsequent calls to Graphics methods
     * such as the <code>lineTo()</code> method or the <code>drawCircle()</code>
     * method. The line style remains in effect until you call the
     * <code>lineStyle()</code> or <code>lineGradientStyle()</code> methods, or
     * the <code>lineBitmapStyle()</code> method again with different parameters.
     * </p>
     *
     * <p>You can call the <code>lineBitmapStyle()</code> method in the middle of
     * drawing a path to specify different styles for different line segments
     * within a path. </p>
     *
     * <p>Call the <code>lineStyle()</code> method before you call the
     * <code>lineBitmapStyle()</code> method to enable a stroke, or else the
     * value of the line style is <code>undefined</code>.</p>
     *
     * <p>Calls to the <code>clear()</code> method set the line style back to
     * <code>undefined</code>. </p>
     *
     * @param bitmap The bitmap to use for the line stroke.
     * @param matrix An optional transformation matrix as defined by the
     *               flash.geom.Matrix class. The matrix can be used to scale or
     *               otherwise manipulate the bitmap before applying it to the
     *               line style.
     * @param repeat Whether to repeat the bitmap in a tiled fashion.
     * @param smooth Whether smoothing should be applied to the bitmap.
     */
    Graphics.prototype.lineBitmapStyle = function (bitmap, matrix, repeat, smooth) {
        if (matrix === void 0) { matrix = null; }
        if (repeat === void 0) { repeat = true; }
        if (smooth === void 0) { smooth = false; }
        // start a new stroke path
        this._active_stroke_path = new GraphicsPath_1.GraphicsPath();
        if (this._current_position.x != 0 || this._current_position.y != 0)
            this._active_stroke_path.moveTo(this._current_position.x, this._current_position.y);
        this._queued_stroke_pathes.push(this._active_stroke_path);
    };
    /**
     * Specifies a gradient to use for the stroke when drawing lines.
     *
     * <p>The gradient line style is used for subsequent calls to Graphics
     * methods such as the <code>lineTo()</code> methods or the
     * <code>drawCircle()</code> method. The line style remains in effect until
     * you call the <code>lineStyle()</code> or <code>lineBitmapStyle()</code>
     * methods, or the <code>lineGradientStyle()</code> method again with
     * different parameters. </p>
     *
     * <p>You can call the <code>lineGradientStyle()</code> method in the middle
     * of drawing a path to specify different styles for different line segments
     * within a path. </p>
     *
     * <p>Call the <code>lineStyle()</code> method before you call the
     * <code>lineGradientStyle()</code> method to enable a stroke, or else the
     * value of the line style is <code>undefined</code>.</p>
     *
     * <p>Calls to the <code>clear()</code> method set the line style back to
     * <code>undefined</code>. </p>
     *
     * @param type                A value from the GradientType class that
     *                            specifies which gradient type to use, either
     *                            GradientType.LINEAR or GradientType.RADIAL.
     * @param colors              An array of RGB hexadecimal color values used
     *                            in the gradient; for example, red is 0xFF0000,
     *                            blue is 0x0000FF, and so on. You can specify
     *                            up to 15 colors. For each color, specify a
     *                            corresponding value in the alphas and ratios
     *                            parameters.
     * @param alphas              An array of alpha values for the corresponding
     *                            colors in the colors array; valid values are 0
     *                            to 1. If the value is less than 0, the default
     *                            is 0. If the value is greater than 1, the
     *                            default is 1.
     * @param ratios              An array of color distribution ratios; valid
     *                            values are 0-255. This value defines the
     *                            percentage of the width where the color is
     *                            sampled at 100%. The value 0 represents the
     *                            left position in the gradient box, and 255
     *                            represents the right position in the gradient
     *                            box.
     * @param matrix              A transformation matrix as defined by the
     *                            flash.geom.Matrix class. The flash.geom.Matrix
     *                            class includes a
     *                            <code>createGradientBox()</code> method, which
     *                            lets you conveniently set up the matrix for use
     *                            with the <code>lineGradientStyle()</code>
     *                            method.
     * @param spreadMethod        A value from the SpreadMethod class that
     *                            specifies which spread method to use:
     * @param interpolationMethod A value from the InterpolationMethod class that
     *                            specifies which value to use. For example,
     *                            consider a simple linear gradient between two
     *                            colors(with the <code>spreadMethod</code>
     *                            parameter set to
     *                            <code>SpreadMethod.REFLECT</code>). The
     *                            different interpolation methods affect the
     *                            appearance as follows:
     * @param focalPointRatio     A number that controls the location of the
     *                            focal point of the gradient. The value 0 means
     *                            the focal point is in the center. The value 1
     *                            means the focal point is at one border of the
     *                            gradient circle. The value -1 means that the
     *                            focal point is at the other border of the
     *                            gradient circle. Values less than -1 or greater
     *                            than 1 are rounded to -1 or 1. The following
     *                            image shows a gradient with a
     *                            <code>focalPointRatio</code> of -0.75:
     */
    Graphics.prototype.lineGradientStyle = function (type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
        if (matrix === void 0) { matrix = null; }
        if (spreadMethod === void 0) { spreadMethod = null; }
        if (interpolationMethod === void 0) { interpolationMethod = null; }
        if (focalPointRatio === void 0) { focalPointRatio = 0; }
        // start a new stroke path
        this._active_stroke_path = new GraphicsPath_1.GraphicsPath();
        if (this._current_position.x != 0 || this._current_position.y != 0)
            this._active_stroke_path.moveTo(this._current_position.x, this._current_position.y);
        this._queued_stroke_pathes.push(this._active_stroke_path);
    };
    /**
     * Specifies a shader to use for the line stroke when drawing lines.
     *
     * <p>The shader line style is used for subsequent calls to Graphics methods
     * such as the <code>lineTo()</code> method or the <code>drawCircle()</code>
     * method. The line style remains in effect until you call the
     * <code>lineStyle()</code> or <code>lineGradientStyle()</code> methods, or
     * the <code>lineBitmapStyle()</code> method again with different parameters.
     * </p>
     *
     * <p>You can call the <code>lineShaderStyle()</code> method in the middle of
     * drawing a path to specify different styles for different line segments
     * within a path. </p>
     *
     * <p>Call the <code>lineStyle()</code> method before you call the
     * <code>lineShaderStyle()</code> method to enable a stroke, or else the
     * value of the line style is <code>undefined</code>.</p>
     *
     * <p>Calls to the <code>clear()</code> method set the line style back to
     * <code>undefined</code>. </p>
     *
     * @param shader The shader to use for the line stroke.
     * @param matrix An optional transformation matrix as defined by the
     *               flash.geom.Matrix class. The matrix can be used to scale or
     *               otherwise manipulate the bitmap before applying it to the
     *               line style.
     */
    //		public lineShaderStyle(shader:Shader, matrix:Matrix = null)
    //		{
    //
    //		}
    /**
     * Specifies a line style used for subsequent calls to Graphics methods such
     * as the <code>lineTo()</code> method or the <code>drawCircle()</code>
     * method. The line style remains in effect until you call the
     * <code>lineGradientStyle()</code> method, the
     * <code>lineBitmapStyle()</code> method, or the <code>lineStyle()</code>
     * method with different parameters.
     *
     * <p>You can call the <code>lineStyle()</code> method in the middle of
     * drawing a path to specify different styles for different line segments
     * within the path.</p>
     *
     * <p><b>Note: </b>Calls to the <code>clear()</code> method set the line
     * style back to <code>undefined</code>.</p>
     *
     * <p><b>Note: </b>Flash Lite 4 supports only the first three parameters
     * (<code>thickness</code>, <code>color</code>, and <code>alpha</code>).</p>
     *
     * @param thickness    An integer that indicates the thickness of the line in
     *                     points; valid values are 0-255. If a number is not
     *                     specified, or if the parameter is undefined, a line is
     *                     not drawn. If a value of less than 0 is passed, the
     *                     default is 0. The value 0 indicates hairline
     *                     thickness; the maximum thickness is 255. If a value
     *                     greater than 255 is passed, the default is 255.
     * @param color        A hexadecimal color value of the line; for example,
     *                     red is 0xFF0000, blue is 0x0000FF, and so on. If a
     *                     value is not indicated, the default is 0x000000
     *                    (black). Optional.
     * @param alpha        A number that indicates the alpha value of the color
     *                     of the line; valid values are 0 to 1. If a value is
     *                     not indicated, the default is 1(solid). If the value
     *                     is less than 0, the default is 0. If the value is
     *                     greater than 1, the default is 1.
     * @param pixelHinting(Not supported in Flash Lite 4) A Boolean value that
     *                     specifies whether to hint strokes to full pixels. This
     *                     affects both the position of anchors of a curve and
     *                     the line stroke size itself. With
     *                     <code>pixelHinting</code> set to <code>true</code>,
     *                     line widths are adjusted to full pixel widths. With
     *                     <code>pixelHinting</code> set to <code>false</code>,
     *                     disjoints can appear for curves and straight lines.
     *                     For example, the following illustrations show how
     *                     Flash Player or Adobe AIR renders two rounded
     *                     rectangles that are identical, except that the
     *                     <code>pixelHinting</code> parameter used in the
     *                     <code>lineStyle()</code> method is set differently
     *                    (the images are scaled by 200%, to emphasize the
     *                     difference):
     *
     *                     <p>If a value is not supplied, the line does not use
     *                     pixel hinting.</p>
     * @param scaleMode   (Not supported in Flash Lite 4) A value from the
     *                     LineScaleMode class that specifies which scale mode to
     *                     use:
     *                     <ul>
     *                       <li> <code>LineScaleMode.NORMAL</code> - Always
     *                     scale the line thickness when the object is scaled
     *                    (the default). </li>
     *                       <li> <code>LineScaleMode.NONE</code> - Never scale
     *                     the line thickness. </li>
     *                       <li> <code>LineScaleMode.VERTICAL</code> - Do not
     *                     scale the line thickness if the object is scaled
     *                     vertically <i>only</i>. For example, consider the
     *                     following circles, drawn with a one-pixel line, and
     *                     each with the <code>scaleMode</code> parameter set to
     *                     <code>LineScaleMode.VERTICAL</code>. The circle on the
     *                     left is scaled vertically only, and the circle on the
     *                     right is scaled both vertically and horizontally:
     *                     </li>
     *                       <li> <code>LineScaleMode.HORIZONTAL</code> - Do not
     *                     scale the line thickness if the object is scaled
     *                     horizontally <i>only</i>. For example, consider the
     *                     following circles, drawn with a one-pixel line, and
     *                     each with the <code>scaleMode</code> parameter set to
     *                     <code>LineScaleMode.HORIZONTAL</code>. The circle on
     *                     the left is scaled horizontally only, and the circle
     *                     on the right is scaled both vertically and
     *                     horizontally:   </li>
     *                     </ul>
     * @param caps        (Not supported in Flash Lite 4) A value from the
     *                     CapsStyle class that specifies the type of caps at the
     *                     end of lines. Valid values are:
     *                     <code>CapsStyle.NONE</code>,
     *                     <code>CapsStyle.ROUND</code>, and
     *                     <code>CapsStyle.SQUARE</code>. If a value is not
     *                     indicated, Flash uses round caps.
     *
     *                     <p>For example, the following illustrations show the
     *                     different <code>capsStyle</code> settings. For each
     *                     setting, the illustration shows a blue line with a
     *                     thickness of 30(for which the <code>capsStyle</code>
     *                     applies), and a superimposed black line with a
     *                     thickness of 1(for which no <code>capsStyle</code>
     *                     applies): </p>
     * @param joints      (Not supported in Flash Lite 4) A value from the
     *                     JointStyle class that specifies the type of joint
     *                     appearance used at angles. Valid values are:
     *                     <code>JointStyle.BEVEL</code>,
     *                     <code>JointStyle.MITER</code>, and
     *                     <code>JointStyle.ROUND</code>. If a value is not
     *                     indicated, Flash uses round joints.
     *
     *                     <p>For example, the following illustrations show the
     *                     different <code>joints</code> settings. For each
     *                     setting, the illustration shows an angled blue line
     *                     with a thickness of 30(for which the
     *                     <code>jointStyle</code> applies), and a superimposed
     *                     angled black line with a thickness of 1(for which no
     *                     <code>jointStyle</code> applies): </p>
     *
     *                     <p><b>Note:</b> For <code>joints</code> set to
     *                     <code>JointStyle.MITER</code>, you can use the
     *                     <code>miterLimit</code> parameter to limit the length
     *                     of the miter.</p>
     * @param miterLimit  (Not supported in Flash Lite 4) A number that
     *                     indicates the limit at which a miter is cut off. Valid
     *                     values range from 1 to 255(and values outside that
     *                     range are rounded to 1 or 255). This value is only
     *                     used if the <code>jointStyle</code> is set to
     *                     <code>"miter"</code>. The <code>miterLimit</code>
     *                     value represents the length that a miter can extend
     *                     beyond the point at which the lines meet to form a
     *                     joint. The value expresses a factor of the line
     *                     <code>thickness</code>. For example, with a
     *                     <code>miterLimit</code> factor of 2.5 and a
     *                     <code>thickness</code> of 10 pixels, the miter is cut
     *                     off at 25 pixels.
     *
     *                     <p>For example, consider the following angled lines,
     *                     each drawn with a <code>thickness</code> of 20, but
     *                     with <code>miterLimit</code> set to 1, 2, and 4.
     *                     Superimposed are black reference lines showing the
     *                     meeting points of the joints:</p>
     *
     *                     <p>Notice that a given <code>miterLimit</code> value
     *                     has a specific maximum angle for which the miter is
     *                     cut off. The following table lists some examples:</p>
     */
    Graphics.prototype.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, capstyle, jointstyle, miterLimit) {
        if (thickness === void 0) { thickness = 0; }
        if (color === void 0) { color = 0; }
        if (alpha === void 0) { alpha = 1; }
        if (pixelHinting === void 0) { pixelHinting = false; }
        if (scaleMode === void 0) { scaleMode = null; }
        if (capstyle === void 0) { capstyle = CapsStyle_1.CapsStyle.NONE; }
        if (jointstyle === void 0) { jointstyle = JointStyle_1.JointStyle.MITER; }
        if (miterLimit === void 0) { miterLimit = 100; }
        // start a new stroke path
        this._active_stroke_path = new GraphicsPath_1.GraphicsPath();
        this._active_stroke_path.style = new GraphicsStrokeStyle_1.GraphicsStrokeStyle(color, alpha, thickness, jointstyle, capstyle, miterLimit);
        if (this._current_position.x != 0 || this._current_position.y != 0)
            this._active_stroke_path.moveTo(this._current_position.x, this._current_position.y);
        this._queued_stroke_pathes.push(this._active_stroke_path);
    };
    /**
     * Draws a line using the current line style from the current drawing
     * position to(<code>x</code>, <code>y</code>); the current drawing position
     * is then set to(<code>x</code>, <code>y</code>). If the display object in
     * which you are drawing contains content that was created with the Flash
     * drawing tools, calls to the <code>lineTo()</code> method are drawn
     * underneath the content. If you call <code>lineTo()</code> before any calls
     * to the <code>moveTo()</code> method, the default position for the current
     * drawing is(<i>0, 0</i>). If any of the parameters are missing, this
     * method fails and the current drawing position is not changed.
     *
     * @param x A number that indicates the horizontal position relative to the
     *          registration point of the parent display object(in pixels).
     * @param y A number that indicates the vertical position relative to the
     *          registration point of the parent display object(in pixels).
     */
    Graphics.prototype.lineTo = function (x, y) {
        if (this._active_fill_path != null) {
            this._active_fill_path.lineTo(x, y);
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.lineTo(x, y);
        }
        this._current_position.x = x;
        this._current_position.y = y;
    };
    /**
     * Moves the current drawing position to(<code>x</code>, <code>y</code>). If
     * any of the parameters are missing, this method fails and the current
     * drawing position is not changed.
     *
     * @param x A number that indicates the horizontal position relative to the
     *          registration point of the parent display object(in pixels).
     * @param y A number that indicates the vertical position relative to the
     *          registration point of the parent display object(in pixels).
     */
    Graphics.prototype.moveTo = function (x, y) {
        if (this._active_fill_path != null) {
            this._active_fill_path.moveTo(x, y);
        }
        if (this._active_stroke_path != null) {
            this._active_stroke_path.moveTo(x, y);
        }
        this._current_position.x = x;
        this._current_position.y = y;
    };
    Graphics.assetType = "[asset Graphics]";
    return Graphics;
}(AssetBase_1.AssetBase));
exports.Graphics = Graphics;

},{"../draw/CapsStyle":"awayjs-display/lib/draw/CapsStyle","../draw/GraphicsFactoryFills":"awayjs-display/lib/draw/GraphicsFactoryFills","../draw/GraphicsFactoryStrokes":"awayjs-display/lib/draw/GraphicsFactoryStrokes","../draw/GraphicsFillStyle":"awayjs-display/lib/draw/GraphicsFillStyle","../draw/GraphicsPath":"awayjs-display/lib/draw/GraphicsPath","../draw/GraphicsStrokeStyle":"awayjs-display/lib/draw/GraphicsStrokeStyle","../draw/JointStyle":"awayjs-display/lib/draw/JointStyle","../events/ElementsEvent":"awayjs-display/lib/events/ElementsEvent","../events/StyleEvent":"awayjs-display/lib/events/StyleEvent","../graphics/Graphic":"awayjs-display/lib/graphics/Graphic","awayjs-core/lib/errors/PartialImplementationError":undefined,"awayjs-core/lib/geom/Box":undefined,"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/graphics/Graphic":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Box_1 = require("awayjs-core/lib/geom/Box");
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var RenderableEvent_1 = require("../events/RenderableEvent");
var StyleEvent_1 = require("../events/StyleEvent");
/**
 * Graphic wraps a Elements as a scene graph instantiation. A Graphic is owned by a Sprite object.
 *
 *
 * @see away.base.ElementsBase
 * @see away.entities.Sprite
 *
 * @class away.base.Graphic
 */
var Graphic = (function (_super) {
    __extends(Graphic, _super);
    /**
     * Creates a new Graphic object
     */
    function Graphic(index, parent, elements, material, style, count, offset) {
        var _this = this;
        if (material === void 0) { material = null; }
        if (style === void 0) { style = null; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        _super.call(this);
        this._iIndex = 0;
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
        this._onInvalidatePropertiesDelegate = function (event) { return _this._onInvalidateProperties(event); };
        this._onInvalidateVerticesDelegate = function (event) { return _this._onInvalidateVertices(event); };
        this._iIndex = index;
        this.parent = parent;
        this.elements = elements;
        this.material = material;
        this.style = style;
        this.count = count;
        this.offset = offset;
    }
    Object.defineProperty(Graphic.prototype, "elements", {
        /**
         * The Elements object which provides the geometry data for this Graphic.
         */
        get: function () {
            return this._elements;
        },
        set: function (value) {
            if (this._elements == value)
                return;
            this._elements = value;
            this.invalidateElements();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphic.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return Graphic.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphic.prototype, "animator", {
        /**
         *
         */
        get: function () {
            return this.parent.animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphic.prototype, "material", {
        //TODO test shader picking
        //		public get shaderPickingDetails():boolean
        //		{
        //
        //			return this.sourceEntity.shaderPickingDetails;
        //		}
        /**
         * The material used to render the current TriangleGraphic. If set to null, its parent Sprite's material will be used instead.
         */
        get: function () {
            return this._material || this.parent.material;
        },
        set: function (value) {
            if (this.material)
                this.material.iRemoveOwner(this);
            this._material = value;
            if (this.material)
                this.material.iAddOwner(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphic.prototype, "style", {
        /**
         * The style used to render the current TriangleGraphic. If set to null, its parent Sprite's style will be used instead.
         */
        get: function () {
            return this._style || this.parent.style;
        },
        set: function (value) {
            if (this._style == value)
                return;
            if (this._style)
                this._style.removeEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._style = value;
            if (this._style)
                this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this.invalidateSurface();
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Graphic.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.parent.removeGraphic(this);
        this.parent = null;
        Graphic._available.push(this);
    };
    Graphic.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
    };
    Graphic.prototype.invalidateElements = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_ELEMENTS, this));
        this._boxBoundsInvalid = true;
        this._sphereBoundsInvalid = true;
    };
    Graphic.prototype.invalidateSurface = function () {
        this.dispatchEvent(new RenderableEvent_1.RenderableEvent(RenderableEvent_1.RenderableEvent.INVALIDATE_SURFACE, this));
    };
    Graphic.prototype._iGetExplicitMaterial = function () {
        return this._material;
    };
    Graphic.prototype._iGetExplicitStyle = function () {
        return this._style;
    };
    Graphic.prototype._onInvalidateProperties = function (event) {
        this.invalidateSurface();
    };
    Graphic.prototype._onInvalidateVertices = function (event) {
        if (event.attributesView != event.target.positions)
            return;
        this.invalidate();
        this.dispatchEvent(event);
    };
    /**
     * //TODO
     *
     * @param shortestCollisionDistance
     * @param findClosest
     * @returns {boolean}
     *
     * @internal
     */
    Graphic.prototype._iTestCollision = function (pickingCollision, pickingCollider) {
        return this._elements._iTestCollision(pickingCollider, this.material, pickingCollision, this.count, this.offset);
    };
    Graphic.prototype.applyTransformation = function (transform) {
        this._elements.applyTransformation(transform, this.count, this.offset);
    };
    Graphic.prototype.hitTestPoint = function (x, y, z) {
        var box;
        //early out for box test
        if (!(box = this.getBoxBounds()).contains(x, y, z))
            return false;
        return this._elements.hitTestPoint(x, y, z, box, this.count, this.offset);
    };
    Graphic.prototype.scale = function (scale) {
        this._elements.scale(scale, this.count, this.offset);
    };
    Graphic.prototype.scaleUV = function (scaleU, scaleV) {
        if (scaleU === void 0) { scaleU = 1; }
        if (scaleV === void 0) { scaleV = 1; }
        this._elements.scaleUV(scaleU, scaleV, this.count, this.offset);
    };
    Graphic.prototype.getBoxBounds = function () {
        if (this._boxBoundsInvalid) {
            this._boxBoundsInvalid = false;
            this._boxBounds = this._elements.getBoxBounds(this._boxBounds || (this._boxBounds = new Box_1.Box()), this.count, this.offset);
        }
        return this._boxBounds;
    };
    Graphic.prototype.getSphereBounds = function (center, target) {
        if (target === void 0) { target = null; }
        return this._elements.getSphereBounds(center, target, this.count, this.offset);
    };
    Graphic._available = new Array();
    Graphic.assetType = "[asset Graphic]";
    return Graphic;
}(AssetBase_1.AssetBase));
exports.Graphic = Graphic;

},{"../events/RenderableEvent":"awayjs-display/lib/events/RenderableEvent","../events/StyleEvent":"awayjs-display/lib/events/StyleEvent","awayjs-core/lib/geom/Box":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/graphics/HitTestCache":[function(require,module,exports){
"use strict";
/**
 * @class away.base.HitTestCache
 */
var HitTestCache = (function () {
    function HitTestCache() {
        /**
         *
         */
        this.cells = new Array();
        /**
         *
         */
        this.lastCollisionIndex = -1;
    }
    return HitTestCache;
}());
exports.HitTestCache = HitTestCache;

},{}],"awayjs-display/lib/graphics/LineElements":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesView_1 = require("awayjs-core/lib/attributes/AttributesView");
var Byte4Attributes_1 = require("awayjs-core/lib/attributes/Byte4Attributes");
var Float1Attributes_1 = require("awayjs-core/lib/attributes/Float1Attributes");
var ElementsBase_1 = require("../graphics/ElementsBase");
var ElementsUtils_1 = require("../utils/ElementsUtils");
/**
 * @class LineElements
 */
var LineElements = (function (_super) {
    __extends(LineElements, _super);
    /**
     *
     */
    function LineElements(concatenatedBuffer) {
        if (concatenatedBuffer === void 0) { concatenatedBuffer = null; }
        _super.call(this, concatenatedBuffer);
        this._positions = new AttributesView_1.AttributesView(Float32Array, 6, concatenatedBuffer);
    }
    Object.defineProperty(LineElements.prototype, "assetType", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return LineElements.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineElements.prototype, "positions", {
        /**
         *
         */
        get: function () {
            return this._positions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineElements.prototype, "thickness", {
        /**
         *
         */
        get: function () {
            return this._thickness;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineElements.prototype, "colors", {
        /**
         *
         */
        get: function () {
            if (!this._colors)
                this.setColors(this._colors);
            return this._colors;
        },
        enumerable: true,
        configurable: true
    });
    LineElements.prototype.getBoxBounds = function (target) {
        if (target === void 0) { target = null; }
        //TODO bounding calculations for lines
        return target;
    };
    LineElements.prototype.getSphereBounds = function (center, target) {
        if (target === void 0) { target = null; }
        //TODO bounding calculations for lines
        return target;
    };
    LineElements.prototype.setPositions = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values instanceof AttributesView_1.AttributesView) {
            this.clearVertices(this._positions);
            this._positions = values;
        }
        else if (values) {
            var i = 0;
            var j = 0;
            var index = 0;
            var positions = new Float32Array(values.length * 4);
            var indices = new Uint16Array(values.length);
            while (i < values.length) {
                if (index / 6 & 1) {
                    positions[index] = values[i + 3];
                    positions[index + 1] = values[i + 4];
                    positions[index + 2] = values[i + 5];
                    positions[index + 3] = values[i];
                    positions[index + 4] = values[i + 1];
                    positions[index + 5] = values[i + 2];
                }
                else {
                    positions[index] = values[i];
                    positions[index + 1] = values[i + 1];
                    positions[index + 2] = values[i + 2];
                    positions[index + 3] = values[i + 3];
                    positions[index + 4] = values[i + 4];
                    positions[index + 5] = values[i + 5];
                }
                index += 6;
                if (++j == 4) {
                    var o = index / 6 - 4;
                    indices.set([o, o + 1, o + 2, o + 3, o + 2, o + 1], i);
                    j = 0;
                    i += 6;
                }
            }
            this._positions.set(positions, offset * 4);
            this.setIndices(indices, offset);
        }
        else {
            this.clearVertices(this._positions);
            this._positions = new AttributesView_1.AttributesView(Float32Array, 6, this._concatenatedBuffer);
        }
        this._numVertices = this._positions.count;
        this.invalidateVertices(this._positions);
        this._verticesDirty[this._positions.id] = false;
    };
    LineElements.prototype.setThickness = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values instanceof Float1Attributes_1.Float1Attributes) {
            this._thickness = values;
        }
        else if (values) {
            if (!this._thickness)
                this._thickness = new Float1Attributes_1.Float1Attributes(this._concatenatedBuffer);
            var i = 0;
            var j = 0;
            var index = 0;
            var thickness = new Float32Array(values.length * 4);
            while (i < values.length) {
                thickness[index] = (Math.floor(0.5 * index + 0.5) & 1) ? -values[i] : values[i];
                if (++j == 4) {
                    j = 0;
                    i++;
                }
                index++;
            }
            this._thickness.set(thickness, offset * 4);
        }
        else if (this._thickness) {
            this._thickness.dispose();
            this._thickness = null;
        }
        this.invalidateVertices(this._thickness);
        this._verticesDirty[this._thickness.id] = false;
    };
    LineElements.prototype.setColors = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values) {
            if (values == this._colors)
                return;
            if (values instanceof Byte4Attributes_1.Byte4Attributes) {
                this.clearVertices(this._colors);
                this._colors = values;
            }
            else {
                if (!this._colors)
                    this._colors = new Byte4Attributes_1.Byte4Attributes(this._concatenatedBuffer);
                var i = 0;
                var j = 0;
                var index = 0;
                var colors = new Uint8Array(values.length * 4);
                while (i < values.length) {
                    if (index / 4 & 1) {
                        colors[index] = values[i + 4];
                        colors[index + 1] = values[i + 5];
                        colors[index + 2] = values[i + 6];
                        colors[index + 3] = values[i + 7];
                    }
                    else {
                        colors[index] = values[i];
                        colors[index + 1] = values[i + 1];
                        colors[index + 2] = values[i + 2];
                        colors[index + 3] = values[i + 3];
                    }
                    if (++j == 4) {
                        j = 0;
                        i += 8;
                    }
                    index += 4;
                }
                this._colors.set(colors, offset * 4);
            }
        }
        else {
            //auto-derive colors
            this._colors = ElementsUtils_1.ElementsUtils.generateColors(this.indices, this._colors, this._concatenatedBuffer, this._numVertices);
        }
        this.invalidateVertices(this._colors);
        this._verticesDirty[this._colors.id] = false;
    };
    /**
     *
     */
    LineElements.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._positions.dispose();
        this._positions = null;
        this._thickness.dispose();
        this._thickness = null;
        this._colors.dispose();
        this._colors = null;
    };
    /**
     * Clones the current object
     * @return An exact duplicate of the current object.
     */
    LineElements.prototype.clone = function () {
        var clone = new LineElements(this._concatenatedBuffer ? this._concatenatedBuffer.clone() : null);
        clone.setIndices(this.indices.clone());
        clone.setPositions(this._positions.clone());
        clone.setThickness(this._thickness.clone());
        clone.setColors(this._colors.clone());
        return clone;
    };
    LineElements.prototype._iTestCollision = function (pickingCollider, material, pickingCollision, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        return pickingCollider.testLineCollision(this, material, pickingCollision, count || this._numVertices, offset);
    };
    LineElements.assetType = "[asset LineElements]";
    return LineElements;
}(ElementsBase_1.ElementsBase));
exports.LineElements = LineElements;

},{"../graphics/ElementsBase":"awayjs-display/lib/graphics/ElementsBase","../utils/ElementsUtils":"awayjs-display/lib/utils/ElementsUtils","awayjs-core/lib/attributes/AttributesView":undefined,"awayjs-core/lib/attributes/Byte4Attributes":undefined,"awayjs-core/lib/attributes/Float1Attributes":undefined}],"awayjs-display/lib/graphics/TriangleElements":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesView_1 = require("awayjs-core/lib/attributes/AttributesView");
var Float3Attributes_1 = require("awayjs-core/lib/attributes/Float3Attributes");
var Float2Attributes_1 = require("awayjs-core/lib/attributes/Float2Attributes");
var ElementsBase_1 = require("../graphics/ElementsBase");
var ElementsUtils_1 = require("../utils/ElementsUtils");
/**
 * @class away.base.TriangleElements
 */
var TriangleElements = (function (_super) {
    __extends(TriangleElements, _super);
    function TriangleElements() {
        _super.apply(this, arguments);
        this._faceNormalsDirty = true;
        this._faceTangentsDirty = true;
        this._autoDeriveNormals = true;
        this._autoDeriveTangents = true;
        //used for hittesting geometry
        this.hitTestCache = new Object();
    }
    Object.defineProperty(TriangleElements.prototype, "assetType", {
        get: function () {
            return TriangleElements.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "useCondensedIndices", {
        /**
         * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
         * by condensing the number of joint index values required per sprite. Only applicable to
         * skeleton animations that utilise more than one sprite object. Defaults to false.
         */
        get: function () {
            return this._useCondensedIndices;
        },
        set: function (value) {
            if (this._useCondensedIndices == value)
                return;
            this._useCondensedIndices = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "jointsPerVertex", {
        /**
         *
         */
        get: function () {
            return this._jointsPerVertex;
        },
        set: function (value) {
            if (this._jointsPerVertex == value)
                return;
            this._jointsPerVertex = value;
            if (this._jointIndices)
                this._jointIndices.dimensions = this._jointsPerVertex;
            if (this._jointWeights)
                this._jointWeights.dimensions = this._jointsPerVertex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "autoDeriveNormals", {
        /**
         * True if the vertex normals should be derived from the geometry, false if the vertex normals are set
         * explicitly.
         */
        get: function () {
            return this._autoDeriveNormals;
        },
        set: function (value) {
            if (this._autoDeriveNormals == value)
                return;
            this._autoDeriveNormals = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "autoDeriveTangents", {
        /**
         * True if the vertex tangents should be derived from the geometry, false if the vertex normals are set
         * explicitly.
         */
        get: function () {
            return this._autoDeriveTangents;
        },
        set: function (value) {
            if (this._autoDeriveTangents == value)
                return;
            this._autoDeriveTangents = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "positions", {
        /**
         *
         */
        get: function () {
            if (!this._positions)
                this.setPositions(new Float3Attributes_1.Float3Attributes(this._concatenatedBuffer));
            return this._positions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "normals", {
        /**
         *
         */
        get: function () {
            if (!this._normals || this._verticesDirty[this._normals.id])
                this.setNormals(this._normals);
            return this._normals;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "tangents", {
        /**
         *
         */
        get: function () {
            if (!this._tangents || this._verticesDirty[this._tangents.id])
                this.setTangents(this._tangents);
            return this._tangents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "faceNormals", {
        /**
         * The raw data of the face normals, in the same order as the faces are listed in the index list.
         */
        get: function () {
            if (this._faceNormalsDirty)
                this.updateFaceNormals();
            return this._faceNormals;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "faceTangents", {
        /**
         * The raw data of the face tangets, in the same order as the faces are listed in the index list.
         */
        get: function () {
            if (this._faceTangentsDirty)
                this.updateFaceTangents();
            return this._faceTangents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "uvs", {
        /**
         *
         */
        get: function () {
            return this._uvs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "jointIndices", {
        /**
         *
         */
        get: function () {
            return this._jointIndices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "jointWeights", {
        /**
         *
         */
        get: function () {
            return this._jointWeights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleElements.prototype, "condensedIndexLookUp", {
        get: function () {
            return this._condensedIndexLookUp;
        },
        enumerable: true,
        configurable: true
    });
    TriangleElements.prototype.getBoxBounds = function (target, count, offset) {
        if (target === void 0) { target = null; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        return ElementsUtils_1.ElementsUtils.getTriangleGraphicsBoxBounds(this.positions, target, count || this._numVertices, offset);
    };
    TriangleElements.prototype.getSphereBounds = function (center, target, count, offset) {
        if (target === void 0) { target = null; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        return ElementsUtils_1.ElementsUtils.getTriangleGraphicsSphereBounds(this.positions, center, target, count || this._numVertices, offset);
    };
    TriangleElements.prototype.hitTestPoint = function (x, y, z, box, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        return ElementsUtils_1.ElementsUtils.hitTestTriangleElements(x, y, 0, box, this, count || this._numVertices, offset);
    };
    TriangleElements.prototype.setPositions = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values == this._positions)
            return;
        if (values instanceof AttributesView_1.AttributesView) {
            this.clearVertices(this._positions);
            this._positions = values;
        }
        else if (values) {
            if (!this._positions)
                this._positions = new Float3Attributes_1.Float3Attributes(this._concatenatedBuffer);
            this._positions.set(values, offset);
        }
        else {
            this.clearVertices(this._positions);
            this._positions = new Float3Attributes_1.Float3Attributes(this._concatenatedBuffer); //positions cannot be null
        }
        this._numVertices = this._positions.count;
        if (this._autoDeriveNormals)
            this.invalidateVertices(this._normals);
        if (this._autoDeriveTangents)
            this.invalidateVertices(this._tangents);
        this.invalidateVertices(this._positions);
        this._verticesDirty[this._positions.id] = false;
    };
    TriangleElements.prototype.setNormals = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (!this._autoDeriveNormals) {
            if (values == this._normals)
                return;
            if (values instanceof Float3Attributes_1.Float3Attributes) {
                this.clearVertices(this._normals);
                this._normals = values;
            }
            else if (values) {
                if (!this._normals)
                    this._normals = new Float3Attributes_1.Float3Attributes(this._concatenatedBuffer);
                this._normals.set(values, offset);
            }
            else if (this._normals) {
                this.clearVertices(this._normals);
                this._normals = null;
                return;
            }
        }
        else {
            this._normals = ElementsUtils_1.ElementsUtils.generateNormals(this.indices, this.faceNormals, this._normals, this._concatenatedBuffer);
        }
        this.invalidateVertices(this._normals);
        this._verticesDirty[this._normals.id] = false;
    };
    TriangleElements.prototype.setTangents = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (!this._autoDeriveTangents) {
            if (values == this._tangents)
                return;
            if (values instanceof Float3Attributes_1.Float3Attributes) {
                this.clearVertices(this._tangents);
                this._tangents = values;
            }
            else if (values) {
                if (!this._tangents)
                    this._tangents = new Float3Attributes_1.Float3Attributes(this._concatenatedBuffer);
                this._tangents.set(values, offset);
            }
            else if (this._tangents) {
                this.clearVertices(this._tangents);
                this._tangents = null;
                return;
            }
        }
        else {
            this._tangents = ElementsUtils_1.ElementsUtils.generateTangents(this.indices, this.faceTangents, this.faceNormals, this._tangents, this._concatenatedBuffer);
        }
        this.invalidateVertices(this._tangents);
        this._verticesDirty[this._tangents.id] = false;
    };
    TriangleElements.prototype.setUVs = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values == this._uvs)
            return;
        if (values instanceof AttributesView_1.AttributesView) {
            this.clearVertices(this._uvs);
            this._uvs = values;
        }
        else if (values) {
            if (!this._uvs)
                this._uvs = new Float2Attributes_1.Float2Attributes(this._concatenatedBuffer);
            this._uvs.set(values, offset);
        }
        else if (this._uvs) {
            this.clearVertices(this._uvs);
            this._uvs = null;
            return;
        }
        this.invalidateVertices(this._uvs);
        this._verticesDirty[this._uvs.id] = false;
    };
    TriangleElements.prototype.setJointIndices = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values == this._jointIndices)
            return;
        if (values instanceof AttributesView_1.AttributesView) {
            this.clearVertices(this._jointIndices);
            this._jointIndices = values;
        }
        else if (values) {
            if (!this._jointIndices)
                this._jointIndices = new AttributesView_1.AttributesView(Float32Array, this._jointsPerVertex, this._concatenatedBuffer);
            if (this._useCondensedIndices) {
                var i = 0;
                var oldIndex;
                var newIndex = 0;
                var dic = new Object();
                this._condensedIndexLookUp = new Array();
                while (i < values.length) {
                    oldIndex = values[i];
                    // if we encounter a new index, assign it a new condensed index
                    if (dic[oldIndex] == undefined) {
                        dic[oldIndex] = newIndex;
                        this._condensedIndexLookUp[newIndex++] = oldIndex;
                    }
                    //reset value to dictionary lookup
                    values[i++] = dic[oldIndex];
                }
            }
            this._jointIndices.set(values, offset);
        }
        else if (this._jointIndices) {
            this.clearVertices(this._jointIndices);
            this._jointIndices = null;
            return;
        }
        this.invalidateVertices(this._jointIndices);
        this._verticesDirty[this._jointIndices.id] = false;
    };
    TriangleElements.prototype.setJointWeights = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        if (values == this._jointWeights)
            return;
        if (values instanceof AttributesView_1.AttributesView) {
            this.clearVertices(this._jointWeights);
            this._jointWeights = values;
        }
        else if (values) {
            if (!this._jointWeights)
                this._jointWeights = new AttributesView_1.AttributesView(Float32Array, this._jointsPerVertex, this._concatenatedBuffer);
            this._jointWeights.set(values, offset);
        }
        else if (this._jointWeights) {
            this.clearVertices(this._jointWeights);
            this._jointWeights = null;
            return;
        }
        this.invalidateVertices(this._jointWeights);
        this._verticesDirty[this._jointWeights.id] = false;
    };
    /**
     *
     */
    TriangleElements.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._positions) {
            this._positions.dispose();
            this._positions = null;
        }
        if (this._normals) {
            this._normals.dispose();
            this._normals = null;
        }
        if (this._tangents) {
            this._tangents.dispose();
            this._tangents = null;
        }
        if (this._uvs) {
            this._uvs.dispose();
            this._uvs = null;
        }
        if (this._jointIndices) {
            this._jointIndices.dispose();
            this._jointIndices = null;
        }
        if (this._jointWeights) {
            this._jointWeights.dispose();
            this._jointWeights = null;
        }
        if (this._faceNormals) {
            this._faceNormals.dispose();
            this._faceNormals = null;
        }
        if (this._faceTangents) {
            this._faceTangents.dispose();
            this._faceTangents = null;
        }
    };
    TriangleElements.prototype.setIndices = function (values, offset) {
        if (offset === void 0) { offset = 0; }
        _super.prototype.setIndices.call(this, values, offset);
        this._faceNormalsDirty = true;
        this._faceTangentsDirty = true;
        if (this._autoDeriveNormals)
            this.invalidateVertices(this._normals);
        if (this._autoDeriveTangents)
            this.invalidateVertices(this._tangents);
    };
    TriangleElements.prototype.copyTo = function (elements) {
        _super.prototype.copyTo.call(this, elements);
        //temp disable auto derives
        var autoDeriveNormals = this._autoDeriveNormals;
        var autoDeriveTangents = this._autoDeriveTangents;
        elements.autoDeriveNormals = this._autoDeriveNormals = false;
        elements.autoDeriveTangents = this._autoDeriveTangents = false;
        elements.setPositions(this.positions.clone());
        if (this.normals)
            elements.setNormals(this.normals.clone());
        if (this.tangents)
            elements.setTangents(this.tangents.clone());
        if (this.uvs)
            elements.setUVs(this.uvs.clone());
        elements.jointsPerVertex = this._jointsPerVertex;
        if (this.jointIndices)
            elements.setJointIndices(this.jointIndices.clone());
        if (this.jointWeights)
            elements.setJointWeights(this.jointWeights.clone());
        //return auto derives to cloned values
        elements.autoDeriveNormals = this._autoDeriveNormals = autoDeriveNormals;
        elements.autoDeriveTangents = this._autoDeriveTangents = autoDeriveTangents;
    };
    /**
     * Clones the current object
     * @return An exact duplicate of the current object.
     */
    TriangleElements.prototype.clone = function () {
        var clone = new TriangleElements(this._concatenatedBuffer ? this._concatenatedBuffer.clone() : null);
        this.copyTo(clone);
        return clone;
    };
    TriangleElements.prototype.scaleUV = function (scaleU, scaleV, count, offset) {
        if (scaleU === void 0) { scaleU = 1; }
        if (scaleV === void 0) { scaleV = 1; }
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        if (this.uvs)
            ElementsUtils_1.ElementsUtils.scaleUVs(scaleU, scaleV, this.uvs, count || this._numVertices, offset);
    };
    /**
     * Scales the geometry.
     * @param scale The amount by which to scale.
     */
    TriangleElements.prototype.scale = function (scale, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        ElementsUtils_1.ElementsUtils.scale(scale, this.positions, count || this._numVertices, offset);
    };
    TriangleElements.prototype.applyTransformation = function (transform, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        ElementsUtils_1.ElementsUtils.applyTransformation(transform, this.positions, this.normals, this.tangents, count || this._numVertices, offset);
    };
    /**
     * Updates the tangents for each face.
     */
    TriangleElements.prototype.updateFaceTangents = function () {
        this._faceTangents = ElementsUtils_1.ElementsUtils.generateFaceTangents(this.indices, this.positions, this.uvs || this.positions, this._faceTangents, this.numElements);
        this._faceTangentsDirty = false;
    };
    /**
     * Updates the normals for each face.
     */
    TriangleElements.prototype.updateFaceNormals = function () {
        this._faceNormals = ElementsUtils_1.ElementsUtils.generateFaceNormals(this.indices, this.positions, this._faceNormals, this.numElements);
        this._faceNormalsDirty = false;
    };
    TriangleElements.prototype._iTestCollision = function (pickingCollider, material, pickingCollision, count, offset) {
        if (count === void 0) { count = 0; }
        if (offset === void 0) { offset = 0; }
        return pickingCollider.testTriangleCollision(this, material, pickingCollision, count || this._numVertices, offset);
    };
    TriangleElements.assetType = "[asset TriangleElements]";
    return TriangleElements;
}(ElementsBase_1.ElementsBase));
exports.TriangleElements = TriangleElements;

},{"../graphics/ElementsBase":"awayjs-display/lib/graphics/ElementsBase","../utils/ElementsUtils":"awayjs-display/lib/utils/ElementsUtils","awayjs-core/lib/attributes/AttributesView":undefined,"awayjs-core/lib/attributes/Float2Attributes":undefined,"awayjs-core/lib/attributes/Float3Attributes":undefined}],"awayjs-display/lib/graphics":[function(require,module,exports){
"use strict";
var ElementsBase_1 = require("./graphics/ElementsBase");
exports.ElementsBase = ElementsBase_1.ElementsBase;
var ElementsType_1 = require("./graphics/ElementsType");
exports.ElementsType = ElementsType_1.ElementsType;
var Graphic_1 = require("./graphics/Graphic");
exports.Graphic = Graphic_1.Graphic;
var Graphics_1 = require("./graphics/Graphics");
exports.Graphics = Graphics_1.Graphics;
var LineElements_1 = require("./graphics/LineElements");
exports.LineElements = LineElements_1.LineElements;
var TriangleElements_1 = require("./graphics/TriangleElements");
exports.TriangleElements = TriangleElements_1.TriangleElements;

},{"./graphics/ElementsBase":"awayjs-display/lib/graphics/ElementsBase","./graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","./graphics/Graphic":"awayjs-display/lib/graphics/Graphic","./graphics/Graphics":"awayjs-display/lib/graphics/Graphics","./graphics/LineElements":"awayjs-display/lib/graphics/LineElements","./graphics/TriangleElements":"awayjs-display/lib/graphics/TriangleElements"}],"awayjs-display/lib/managers/DefaultMaterialManager":[function(require,module,exports){
"use strict";
var Sampler2D_1 = require("awayjs-core/lib/image/Sampler2D");
var BitmapImage2D_1 = require("awayjs-core/lib/image/BitmapImage2D");
var BitmapImageCube_1 = require("awayjs-core/lib/image/BitmapImageCube");
var LineElements_1 = require("../graphics/LineElements");
var Skybox_1 = require("../display/Skybox");
var BasicMaterial_1 = require("../materials/BasicMaterial");
var Single2DTexture_1 = require("../textures/Single2DTexture");
var SingleCubeTexture_1 = require("../textures/SingleCubeTexture");
var Graphic_1 = require("../graphics/Graphic");
var DefaultMaterialManager = (function () {
    function DefaultMaterialManager() {
    }
    DefaultMaterialManager.getDefaultMaterial = function (renderable) {
        if (renderable === void 0) { renderable = null; }
        if (renderable != null && renderable.isAsset(Graphic_1.Graphic) && renderable.elements.isAsset(LineElements_1.LineElements)) {
            if (!DefaultMaterialManager._defaultColorMaterial)
                DefaultMaterialManager.createDefaultColorMaterial();
            return DefaultMaterialManager._defaultColorMaterial;
        }
        if (renderable != null && renderable.isAsset(Skybox_1.Skybox)) {
            if (!DefaultMaterialManager._defaultCubeTextureMaterial)
                DefaultMaterialManager.createDefaultCubeTextureMaterial();
            return DefaultMaterialManager._defaultCubeTextureMaterial;
        }
        if (!DefaultMaterialManager._defaultTextureMaterial)
            DefaultMaterialManager.createDefaultTextureMaterial();
        return DefaultMaterialManager._defaultTextureMaterial;
    };
    DefaultMaterialManager.getDefaultTexture = function (renderable) {
        if (renderable === void 0) { renderable = null; }
        if (renderable != null && renderable.isAsset(Skybox_1.Skybox)) {
            if (!DefaultMaterialManager._defaultCubeTexture)
                DefaultMaterialManager.createDefaultCubeTexture();
            return DefaultMaterialManager._defaultCubeTexture;
        }
        if (!DefaultMaterialManager._defaultTexture)
            DefaultMaterialManager.createDefaultTexture();
        return DefaultMaterialManager._defaultTexture;
    };
    DefaultMaterialManager.getDefaultImage2D = function () {
        if (!DefaultMaterialManager._defaultBitmapImage2D)
            DefaultMaterialManager.createDefaultImage2D();
        return DefaultMaterialManager._defaultBitmapImage2D;
    };
    DefaultMaterialManager.getDefaultImageCube = function () {
        if (!DefaultMaterialManager._defaultBitmapImageCube)
            DefaultMaterialManager.createDefaultImageCube();
        return DefaultMaterialManager._defaultBitmapImageCube;
    };
    DefaultMaterialManager.getDefaultSampler = function () {
        if (!DefaultMaterialManager._defaultSampler2D)
            DefaultMaterialManager.createDefaultSampler2D();
        return DefaultMaterialManager._defaultSampler2D;
    };
    DefaultMaterialManager.createDefaultTexture = function () {
        DefaultMaterialManager._defaultTexture = new Single2DTexture_1.Single2DTexture();
        DefaultMaterialManager._defaultTexture.name = "defaultTexture";
    };
    DefaultMaterialManager.createDefaultCubeTexture = function () {
        DefaultMaterialManager._defaultCubeTexture = new SingleCubeTexture_1.SingleCubeTexture();
        DefaultMaterialManager._defaultCubeTexture.name = "defaultCubeTexture";
    };
    DefaultMaterialManager.createDefaultImageCube = function () {
        if (!DefaultMaterialManager._defaultBitmapImage2D)
            DefaultMaterialManager.createDefaultImage2D();
        var b = new BitmapImageCube_1.BitmapImageCube(DefaultMaterialManager._defaultBitmapImage2D.width);
        for (var i = 0; i < 6; i++)
            b.draw(i, DefaultMaterialManager._defaultBitmapImage2D);
        DefaultMaterialManager._defaultBitmapImageCube = b;
    };
    DefaultMaterialManager.createDefaultImage2D = function () {
        var b = new BitmapImage2D_1.BitmapImage2D(8, 8, false, 0x000000);
        //create chekerboard
        var i, j;
        for (i = 0; i < 8; i++)
            for (j = 0; j < 8; j++)
                if ((j & 1) ^ (i & 1))
                    b.setPixel(i, j, 0XFFFFFF);
        DefaultMaterialManager._defaultBitmapImage2D = b;
    };
    DefaultMaterialManager.createDefaultTextureMaterial = function () {
        if (!DefaultMaterialManager._defaultTexture)
            DefaultMaterialManager.createDefaultTexture();
        DefaultMaterialManager._defaultTextureMaterial = new BasicMaterial_1.BasicMaterial();
        DefaultMaterialManager._defaultTextureMaterial.texture = DefaultMaterialManager._defaultTexture;
        DefaultMaterialManager._defaultTextureMaterial.name = "defaultTextureMaterial";
    };
    DefaultMaterialManager.createDefaultCubeTextureMaterial = function () {
        if (!DefaultMaterialManager._defaultCubeTexture)
            DefaultMaterialManager.createDefaultCubeTexture();
        DefaultMaterialManager._defaultCubeTextureMaterial = new BasicMaterial_1.BasicMaterial();
        DefaultMaterialManager._defaultCubeTextureMaterial.texture = DefaultMaterialManager._defaultCubeTexture;
        DefaultMaterialManager._defaultCubeTextureMaterial.name = "defaultCubeTextureMaterial";
    };
    DefaultMaterialManager.createDefaultColorMaterial = function () {
        DefaultMaterialManager._defaultColorMaterial = new BasicMaterial_1.BasicMaterial(0xFFFFFF);
        DefaultMaterialManager._defaultColorMaterial.name = "defaultColorMaterial";
    };
    DefaultMaterialManager.createDefaultSampler2D = function () {
        DefaultMaterialManager._defaultSampler2D = new Sampler2D_1.Sampler2D();
    };
    return DefaultMaterialManager;
}());
exports.DefaultMaterialManager = DefaultMaterialManager;

},{"../display/Skybox":"awayjs-display/lib/display/Skybox","../graphics/Graphic":"awayjs-display/lib/graphics/Graphic","../graphics/LineElements":"awayjs-display/lib/graphics/LineElements","../materials/BasicMaterial":"awayjs-display/lib/materials/BasicMaterial","../textures/Single2DTexture":"awayjs-display/lib/textures/Single2DTexture","../textures/SingleCubeTexture":"awayjs-display/lib/textures/SingleCubeTexture","awayjs-core/lib/image/BitmapImage2D":undefined,"awayjs-core/lib/image/BitmapImageCube":undefined,"awayjs-core/lib/image/Sampler2D":undefined}],"awayjs-display/lib/managers/FrameScriptManager":[function(require,module,exports){
"use strict";
var FrameScriptManager = (function () {
    function FrameScriptManager() {
    }
    FrameScriptManager.setInterval = function (func) {
        this._intervalID++;
        this._active_intervals[this._intervalID] = func;
        return this._intervalID;
    };
    FrameScriptManager.clearInterval = function (id) {
        delete this._active_intervals[id];
    };
    FrameScriptManager.execute_intervals = function () {
        for (var key in this._active_intervals) {
            this._active_intervals[key].call();
        }
    };
    FrameScriptManager.add_child_to_dispose = function (child) {
        this._queued_dispose.push(child);
    };
    FrameScriptManager.add_script_to_queue = function (mc, script) {
        // whenever we queue scripts of new objects, we first inject the lists of pass2
        var i = this._queued_mcs_pass2.length;
        while (i--) {
            this._queued_mcs.push(this._queued_mcs_pass2[i]);
            this._queued_scripts.push(this._queued_scripts_pass2[i]);
        }
        this._queued_mcs_pass2.length = 0;
        this._queued_scripts_pass2.length = 0;
        this._queued_mcs.push(mc);
        this._queued_scripts.push(script);
    };
    FrameScriptManager.add_script_to_queue_pass2 = function (mc, script) {
        this._queued_mcs_pass2.push(mc);
        this._queued_scripts_pass2.push(script);
    };
    FrameScriptManager.execute_queue = function () {
        if (this._queued_mcs.length == 0 && this._queued_mcs_pass2.length == 0)
            return;
        var i = this._queued_mcs_pass2.length;
        while (i--) {
            this._queued_mcs.push(this._queued_mcs_pass2[i]);
            this._queued_scripts.push(this._queued_scripts_pass2[i]);
        }
        this._queued_mcs_pass2.length = 0;
        this._queued_scripts_pass2.length = 0;
        var mc;
        for (i = 0; i < this._queued_mcs.length; i++) {
            // during the loop we might add more scripts to the queue
            mc = this._queued_mcs[i];
            if (mc.scene != null) {
                var caller = mc.adapter ? mc.adapter : mc;
                //	try {
                this._queued_scripts[i].call(caller);
            }
        }
        // all scripts executed. clear all
        this._queued_mcs.length = 0;
        this._queued_scripts.length = 0;
    };
    FrameScriptManager.execute_dispose = function () {
        var len = this._queued_dispose.length;
        for (var i = 0; i < len; i++)
            this._queued_dispose[i].dispose();
        this._queued_dispose.length = 0;
    };
    // FrameScript debugging:
    // the first line of a FrameScript should be a comment that represents the functions unique name
    // the exporter creates a js file, containing a object that has the framescripts functions set as properties according to the unique names
    // this object can be set as "frameScriptDebug" in order to enable debug mode
    FrameScriptManager.frameScriptDebug = undefined;
    //queue of objects for disposal
    FrameScriptManager._queued_dispose = new Array();
    // queues pass1 of scripts.
    FrameScriptManager._queued_mcs = [];
    FrameScriptManager._queued_scripts = [];
    // queues pass2 of scripts. this will be inserted in reversed order into pass1 queue right before something should be added to pass1
    FrameScriptManager._queued_mcs_pass2 = [];
    FrameScriptManager._queued_scripts_pass2 = [];
    FrameScriptManager._active_intervals = new Object(); // maps id to function
    FrameScriptManager._intervalID = 0;
    return FrameScriptManager;
}());
exports.FrameScriptManager = FrameScriptManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FrameScriptManager;

},{}],"awayjs-display/lib/managers/MouseManager":[function(require,module,exports){
"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var TouchPoint_1 = require("../base/TouchPoint");
var MouseEvent_1 = require("../events/MouseEvent");
var FrameScriptManager_1 = require("../managers/FrameScriptManager");
/**
 * MouseManager enforces a singleton pattern and is not intended to be instanced.
 * it provides a manager class for detecting mouse hits on scene objects and sending out mouse events.
 */
var MouseManager = (function () {
    /**
     * Creates a new <code>MouseManager</code> object.
     */
    function MouseManager() {
        var _this = this;
        this._viewLookup = new Array();
        this._nullVector = new Vector3D_1.Vector3D();
        this._queuedEvents = new Array();
        this._mouseUp = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.MOUSE_UP);
        this._mouseClick = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.CLICK);
        this._mouseOut = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.MOUSE_OUT);
        this._mouseDown = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.MOUSE_DOWN);
        this._mouseMove = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.MOUSE_MOVE);
        this._mouseOver = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.MOUSE_OVER);
        this._mouseWheel = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.MOUSE_WHEEL);
        this._mouseDoubleClick = new MouseEvent_1.MouseEvent(MouseEvent_1.MouseEvent.DOUBLE_CLICK);
        this.onClickDelegate = function (event) { return _this.onClick(event); };
        this.onDoubleClickDelegate = function (event) { return _this.onDoubleClick(event); };
        this.onMouseDownDelegate = function (event) { return _this.onMouseDown(event); };
        this.onMouseMoveDelegate = function (event) { return _this.onMouseMove(event); };
        this.onMouseUpDelegate = function (event) { return _this.onMouseUp(event); };
        this.onMouseWheelDelegate = function (event) { return _this.onMouseWheel(event); };
        this.onMouseOverDelegate = function (event) { return _this.onMouseOver(event); };
        this.onMouseOutDelegate = function (event) { return _this.onMouseOut(event); };
    }
    MouseManager.getInstance = function () {
        if (this._instance)
            return this._instance;
        return (this._instance = new MouseManager());
    };
    MouseManager.prototype.fireMouseEvents = function (forceMouseMove) {
        // If colliding object has changed, queue over/out events.
        if (this._iCollision != this._previousCollidingObject) {
            if (this._previousCollidingObject)
                this.queueDispatch(this._mouseOut, this._mouseMoveEvent, this._previousCollidingObject);
            if (this._iCollision)
                this.queueDispatch(this._mouseOver, this._mouseMoveEvent);
        }
        // Fire mouse move events here if forceMouseMove is on.
        if (forceMouseMove && this._iCollision)
            this.queueDispatch(this._mouseMove, this._mouseMoveEvent);
        var event;
        var dispatcher;
        // Dispatch all queued events.
        var len = this._queuedEvents.length;
        for (var i = 0; i < len; ++i) {
            event = this._queuedEvents[i];
            dispatcher = event.entity;
            // bubble event up the heirarchy until the top level parent is reached
            while (dispatcher) {
                if (dispatcher._iIsMouseEnabled())
                    dispatcher.dispatchEvent(event);
                dispatcher = dispatcher.parent;
            }
            // not totally sure, but i think just calling it is easier and cheaper than any options for that
            // if nothing is queued, the function will return directly anyway
            FrameScriptManager_1.FrameScriptManager.execute_queue();
        }
        this._queuedEvents.length = 0;
        this._previousCollidingObject = this._iCollision;
        this._iUpdateDirty = false;
    };
    //		public addViewLayer(view:View)
    //		{
    //			var stg:Stage = view.stage;
    //
    //			// Add instance to mouse3dmanager to fire mouse events for multiple views
    //			if (!view.stageGL.mouse3DManager)
    //				view.stageGL.mouse3DManager = this;
    //
    //			if (!hasKey(view))
    //				_view3Ds[view] = 0;
    //
    //			_childDepth = 0;
    //			traverseDisplayObjects(stg);
    //			_viewCount = _childDepth;
    //		}
    MouseManager.prototype.registerView = function (view) {
        if (view && view.htmlElement) {
            view.htmlElement.addEventListener("click", this.onClickDelegate);
            view.htmlElement.addEventListener("dblclick", this.onDoubleClickDelegate);
            view.htmlElement.addEventListener("touchstart", this.onMouseDownDelegate);
            view.htmlElement.addEventListener("mousedown", this.onMouseDownDelegate);
            view.htmlElement.addEventListener("touchmove", this.onMouseMoveDelegate);
            view.htmlElement.addEventListener("mousemove", this.onMouseMoveDelegate);
            view.htmlElement.addEventListener("mouseup", this.onMouseUpDelegate);
            view.htmlElement.addEventListener("touchend", this.onMouseUpDelegate);
            view.htmlElement.addEventListener("mousewheel", this.onMouseWheelDelegate);
            view.htmlElement.addEventListener("mouseover", this.onMouseOverDelegate);
            view.htmlElement.addEventListener("mouseout", this.onMouseOutDelegate);
            this._viewLookup.push(view);
        }
    };
    MouseManager.prototype.unregisterView = function (view) {
        if (view && view.htmlElement) {
            view.htmlElement.removeEventListener("click", this.onClickDelegate);
            view.htmlElement.removeEventListener("dblclick", this.onDoubleClickDelegate);
            view.htmlElement.removeEventListener("touchstart", this.onMouseDownDelegate);
            view.htmlElement.removeEventListener("mousedown", this.onMouseDownDelegate);
            view.htmlElement.removeEventListener("touchmove", this.onMouseMoveDelegate);
            view.htmlElement.removeEventListener("mousemove", this.onMouseMoveDelegate);
            view.htmlElement.removeEventListener("touchend", this.onMouseUpDelegate);
            view.htmlElement.removeEventListener("mouseup", this.onMouseUpDelegate);
            view.htmlElement.removeEventListener("mousewheel", this.onMouseWheelDelegate);
            view.htmlElement.removeEventListener("mouseover", this.onMouseOverDelegate);
            view.htmlElement.removeEventListener("mouseout", this.onMouseOutDelegate);
            this._viewLookup.slice(this._viewLookup.indexOf(view), 1);
        }
    };
    // ---------------------------------------------------------------------
    // Private.
    // ---------------------------------------------------------------------
    MouseManager.prototype.queueDispatch = function (event, sourceEvent, collision) {
        if (collision === void 0) { collision = null; }
        // 2D properties.
        if (sourceEvent) {
            event.ctrlKey = sourceEvent.ctrlKey;
            event.altKey = sourceEvent.altKey;
            event.shiftKey = sourceEvent.shiftKey;
            event.screenX = (sourceEvent.clientX != null) ? sourceEvent.clientX : sourceEvent.changedTouches[0].clientX;
            event.screenY = (sourceEvent.clientY != null) ? sourceEvent.clientY : sourceEvent.changedTouches[0].clientY;
        }
        if (collision == null)
            collision = this._iCollision;
        // 3D properties.
        if (collision) {
            // Object.
            event.entity = collision.entity;
            event.renderable = collision.renderable;
            // UV.
            event.uv = collision.uv;
            // Position.
            event.position = collision.position ? collision.position.clone() : null;
            // Normal.
            event.normal = collision.normal ? collision.normal.clone() : null;
            // Face index.
            event.elementIndex = collision.elementIndex;
        }
        else {
            // Set all to null.
            event.uv = null;
            event.entity = null;
            event.position = this._nullVector;
            event.normal = this._nullVector;
            event.elementIndex = 0;
        }
        // Store event to be dispatched later.
        this._queuedEvents.push(event);
    };
    // ---------------------------------------------------------------------
    // Listeners.
    // ---------------------------------------------------------------------
    MouseManager.prototype.onMouseMove = function (event) {
        event.preventDefault();
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseMove, this._mouseMoveEvent = event);
    };
    MouseManager.prototype.onMouseOut = function (event) {
        this._iActiveDiv = null;
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseOut, event);
    };
    MouseManager.prototype.onMouseOver = function (event) {
        this._iActiveDiv = event.target;
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseOver, event);
    };
    MouseManager.prototype.onClick = function (event) {
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseClick, event);
    };
    MouseManager.prototype.onDoubleClick = function (event) {
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseDoubleClick, event);
    };
    MouseManager.prototype.onMouseDown = function (event) {
        event.preventDefault();
        this._iActiveDiv = event.target;
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseDown, event);
    };
    MouseManager.prototype.onMouseUp = function (event) {
        event.preventDefault();
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseUp, event);
    };
    MouseManager.prototype.onMouseWheel = function (event) {
        this.updateColliders(event);
        if (this._iCollision)
            this.queueDispatch(this._mouseWheel, event);
    };
    MouseManager.prototype.updateColliders = function (event) {
        var view;
        var bounds;
        var mouseX = (event.clientX != null) ? event.clientX : event.changedTouches[0].clientX;
        var mouseY = (event.clientY != null) ? event.clientY : event.changedTouches[0].clientY;
        var len = this._viewLookup.length;
        for (var i = 0; i < len; i++) {
            view = this._viewLookup[i];
            view._pTouchPoints.length = 0;
            bounds = view.htmlElement.getBoundingClientRect();
            if (event.touches) {
                var touch;
                var len = event.touches.length;
                for (var i = 0; i < len; i++) {
                    touch = event.touches[i];
                    view._pTouchPoints.push(new TouchPoint_1.TouchPoint(touch.clientX + bounds.left, touch.clientY + bounds.top, touch.identifier));
                }
            }
            if (this._iUpdateDirty)
                continue;
            if (mouseX < bounds.left || mouseX > bounds.right || mouseY < bounds.top || mouseY > bounds.bottom) {
                view._pMouseX = null;
                view._pMouseY = null;
            }
            else {
                view._pMouseX = mouseX + bounds.left;
                view._pMouseY = mouseY + bounds.top;
                view.updateCollider();
                if (view.layeredView && this._iCollision)
                    break;
            }
        }
        this._iUpdateDirty = true;
    };
    return MouseManager;
}());
exports.MouseManager = MouseManager;

},{"../base/TouchPoint":"awayjs-display/lib/base/TouchPoint","../events/MouseEvent":"awayjs-display/lib/events/MouseEvent","../managers/FrameScriptManager":"awayjs-display/lib/managers/FrameScriptManager","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/managers/TouchManager":[function(require,module,exports){
"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var TouchEvent_1 = require("../events/TouchEvent");
var TouchManager = (function () {
    function TouchManager() {
        var _this = this;
        this._updateDirty = true;
        this._nullVector = new Vector3D_1.Vector3D();
        this._queuedEvents = new Array();
        this._touchOut = new TouchEvent_1.TouchEvent(TouchEvent_1.TouchEvent.TOUCH_OUT);
        this._touchBegin = new TouchEvent_1.TouchEvent(TouchEvent_1.TouchEvent.TOUCH_BEGIN);
        this._touchMove = new TouchEvent_1.TouchEvent(TouchEvent_1.TouchEvent.TOUCH_MOVE);
        this._touchEnd = new TouchEvent_1.TouchEvent(TouchEvent_1.TouchEvent.TOUCH_END);
        this._touchOver = new TouchEvent_1.TouchEvent(TouchEvent_1.TouchEvent.TOUCH_OVER);
        this._touchPoints = new Array();
        this._touchPointFromId = new Object();
        TouchManager._iCollisionFromTouchId = new Object();
        TouchManager._previousCollidingObjectFromTouchId = new Object();
        this.onTouchBeginDelegate = function (event) { return _this.onTouchBegin(event); };
        this.onTouchMoveDelegate = function (event) { return _this.onTouchMove(event); };
        this.onTouchEndDelegate = function (event) { return _this.onTouchEnd(event); };
    }
    TouchManager.getInstance = function () {
        if (this._instance)
            return this._instance;
        return (this._instance = new TouchManager());
    };
    // ---------------------------------------------------------------------
    // Interface.
    // ---------------------------------------------------------------------
    TouchManager.prototype.updateCollider = function (forceTouchMove) {
        //if (forceTouchMove || this._updateDirty) { // If forceTouchMove is off, and no 2D Touch events dirty the update, don't update either.
        //	for (var i:number; i < this._numTouchPoints; ++i) {
        //		this._touchPoint = this._touchPoints[ i ];
        //		this._iCollision = this._touchPicker.getViewCollision(this._touchPoint.x, this._touchPoint.y, this._view);
        //		TouchManager._iCollisionFromTouchId[ this._touchPoint.id ] = this._iCollision;
        //	}
        //}
    };
    TouchManager.prototype.fireTouchEvents = function (forceTouchMove) {
        var i;
        for (i = 0; i < this._numTouchPoints; ++i) {
            this._touchPoint = this._touchPoints[i];
            // If colliding object has changed, queue over/out events.
            this._iCollision = TouchManager._iCollisionFromTouchId[this._touchPoint.id];
            this._previousCollidingObject = TouchManager._previousCollidingObjectFromTouchId[this._touchPoint.id];
            if (this._iCollision != this._previousCollidingObject) {
                if (this._previousCollidingObject)
                    this.queueDispatch(this._touchOut, this._touchMoveEvent, this._previousCollidingObject, this._touchPoint);
                if (this._iCollision)
                    this.queueDispatch(this._touchOver, this._touchMoveEvent, this._iCollision, this._touchPoint);
            }
            // Fire Touch move events here if forceTouchMove is on.
            if (forceTouchMove && this._iCollision)
                this.queueDispatch(this._touchMove, this._touchMoveEvent, this._iCollision, this._touchPoint);
        }
        var event;
        var dispatcher;
        // Dispatch all queued events.
        var len = this._queuedEvents.length;
        for (i = 0; i < len; ++i) {
            // Only dispatch from first implicitly enabled object ( one that is not a child of a TouchChildren = false hierarchy ).
            event = this._queuedEvents[i];
            dispatcher = event.entity;
            while (dispatcher && !dispatcher._iIsMouseEnabled())
                dispatcher = dispatcher.parent;
            if (dispatcher)
                dispatcher.dispatchEvent(event);
        }
        this._queuedEvents.length = 0;
        this._updateDirty = false;
        for (i = 0; i < this._numTouchPoints; ++i) {
            this._touchPoint = this._touchPoints[i];
            TouchManager._previousCollidingObjectFromTouchId[this._touchPoint.id] = TouchManager._iCollisionFromTouchId[this._touchPoint.id];
        }
    };
    TouchManager.prototype.registerView = function (view) {
        view.htmlElement.addEventListener("touchstart", this.onTouchBeginDelegate);
        view.htmlElement.addEventListener("touchmove", this.onTouchMoveDelegate);
        view.htmlElement.addEventListener("touchend", this.onTouchEndDelegate);
    };
    TouchManager.prototype.unregisterView = function (view) {
        view.htmlElement.removeEventListener("touchstart", this.onTouchBeginDelegate);
        view.htmlElement.removeEventListener("touchmove", this.onTouchMoveDelegate);
        view.htmlElement.removeEventListener("touchend", this.onTouchEndDelegate);
    };
    // ---------------------------------------------------------------------
    // Private.
    // ---------------------------------------------------------------------
    TouchManager.prototype.queueDispatch = function (event, sourceEvent, collider, touch) {
        // 2D properties.
        event.ctrlKey = sourceEvent.ctrlKey;
        event.altKey = sourceEvent.altKey;
        event.shiftKey = sourceEvent.shiftKey;
        event.screenX = touch.x;
        event.screenY = touch.y;
        event.touchPointID = touch.id;
        // 3D properties.
        if (collider) {
            // Object.
            event.entity = collider.entity;
            event.renderable = collider.renderable;
            // UV.
            event.uv = collider.uv;
            // Position.
            event.position = collider.position ? collider.position.clone() : null;
            // Normal.
            event.normal = collider.normal ? collider.normal.clone() : null;
            // ElementsIndex.
            event.elementIndex = collider.elementIndex;
        }
        else {
            // Set all to null.
            event.uv = null;
            event.entity = null;
            event.position = this._nullVector;
            event.normal = this._nullVector;
            event.elementIndex = 0;
        }
        // Store event to be dispatched later.
        this._queuedEvents.push(event);
    };
    // ---------------------------------------------------------------------
    // Event handlers.
    // ---------------------------------------------------------------------
    TouchManager.prototype.onTouchBegin = function (event) {
        var touch = new TouchPoint();
        //touch.id = event.touchPointID;
        //touch.x = event.stageX;
        //touch.y = event.stageY;
        this._numTouchPoints++;
        this._touchPoints.push(touch);
        this._touchPointFromId[touch.id] = touch;
        //this.updateCollider(event); // ensures collision check is done with correct mouse coordinates on mobile
        this._iCollision = TouchManager._iCollisionFromTouchId[touch.id];
        if (this._iCollision)
            this.queueDispatch(this._touchBegin, event, this._iCollision, touch);
        this._updateDirty = true;
    };
    TouchManager.prototype.onTouchMove = function (event) {
        //var touch:TouchPoint = this._touchPointFromId[ event.touchPointID ];
        //
        //if (!touch) return;
        //
        ////touch.x = event.stageX;
        ////touch.y = event.stageY;
        //
        //this._iCollision = TouchManager._iCollisionFromTouchId[ touch.id ];
        //
        //if (this._iCollision)
        //	this.queueDispatch(this._touchMove, this._touchMoveEvent = event, this._iCollision, touch);
        //
        //this._updateDirty = true;
    };
    TouchManager.prototype.onTouchEnd = function (event) {
        //var touch:TouchPoint = this._touchPointFromId[ event.touchPointID ];
        //
        //if (!touch) return;
        //
        //this._iCollision = TouchManager._iCollisionFromTouchId[ touch.id ];
        //if (this._iCollision)
        //	this.queueDispatch(this._touchEnd, event, this._iCollision, touch);
        //
        //this._touchPointFromId[ touch.id ] = null;
        //this._numTouchPoints--;
        //this._touchPoints.splice(this._touchPoints.indexOf(touch), 1);
        //
        //this._updateDirty = true;
    };
    return TouchManager;
}());
exports.TouchManager = TouchManager;
var TouchPoint = (function () {
    function TouchPoint() {
    }
    return TouchPoint;
}());

},{"../events/TouchEvent":"awayjs-display/lib/events/TouchEvent","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/managers":[function(require,module,exports){
"use strict";
var DefaultMaterialManager_1 = require("./managers/DefaultMaterialManager");
exports.DefaultMaterialManager = DefaultMaterialManager_1.DefaultMaterialManager;
var FrameScriptManager_1 = require("./managers/FrameScriptManager");
exports.FrameScriptManager = FrameScriptManager_1.FrameScriptManager;
var MouseManager_1 = require("./managers/MouseManager");
exports.MouseManager = MouseManager_1.MouseManager;
var TouchManager_1 = require("./managers/TouchManager");
exports.TouchManager = TouchManager_1.TouchManager;

},{"./managers/DefaultMaterialManager":"awayjs-display/lib/managers/DefaultMaterialManager","./managers/FrameScriptManager":"awayjs-display/lib/managers/FrameScriptManager","./managers/MouseManager":"awayjs-display/lib/managers/MouseManager","./managers/TouchManager":"awayjs-display/lib/managers/TouchManager"}],"awayjs-display/lib/materials/BasicMaterial":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Image2D_1 = require("awayjs-core/lib/image/Image2D");
var MaterialBase_1 = require("../materials/MaterialBase");
var Single2DTexture_1 = require("../textures/Single2DTexture");
/**
 * BasicMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var BasicMaterial = (function (_super) {
    __extends(BasicMaterial, _super);
    function BasicMaterial(imageColor, alpha) {
        if (imageColor === void 0) { imageColor = null; }
        if (alpha === void 0) { alpha = 1; }
        _super.call(this, imageColor, alpha);
        this._preserveAlpha = false;
        //set a texture if an image is present
        if (imageColor instanceof Image2D_1.Image2D)
            this.texture = new Single2DTexture_1.Single2DTexture();
    }
    Object.defineProperty(BasicMaterial.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return BasicMaterial.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicMaterial.prototype, "preserveAlpha", {
        /**
         * Indicates whether alpha should be preserved - defaults to false
         */
        get: function () {
            return this._preserveAlpha;
        },
        set: function (value) {
            if (this._preserveAlpha == value)
                return;
            this._preserveAlpha = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicMaterial.prototype, "texture", {
        /**
         * The texture object to use for the albedo colour.
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (this._texture == value)
                return;
            if (this._texture)
                this.removeTexture(this._texture);
            this._texture = value;
            if (this._texture)
                this.addTexture(this._texture);
            this.invalidateTexture();
        },
        enumerable: true,
        configurable: true
    });
    BasicMaterial.assetType = "[materials BasicMaterial]";
    return BasicMaterial;
}(MaterialBase_1.MaterialBase));
exports.BasicMaterial = BasicMaterial;

},{"../materials/MaterialBase":"awayjs-display/lib/materials/MaterialBase","../textures/Single2DTexture":"awayjs-display/lib/textures/Single2DTexture","awayjs-core/lib/image/Image2D":undefined}],"awayjs-display/lib/materials/LightSources":[function(require,module,exports){
"use strict";
/**
 * Enumeration class for defining which lighting types affect the specific material
 * lighting component (diffuse and specular). This can be useful if, for example, you
 * want to use light probes for diffuse global lighting, but want specular reflections from
 * traditional light sources without those affecting the diffuse light.
 *
 * @see away.materials.ColorMaterial.diffuseLightSources
 * @see away.materials.ColorMaterial.specularLightSources
 * @see away.materials.TextureMaterial.diffuseLightSources
 * @see away.materials.TextureMaterial.specularLightSources
 */
var LightSources = (function () {
    function LightSources() {
    }
    /**
     * Defines normal lights are to be used as the source for the lighting
     * component.
     */
    LightSources.LIGHTS = 0x01;
    /**
     * Defines that global lighting probes are to be used as the source for the
     * lighting component.
     */
    LightSources.PROBES = 0x02;
    /**
     * Defines that both normal and global lighting probes  are to be used as the
     * source for the lighting component. This is equivalent to LightSources.LIGHTS | LightSources.PROBES.
     */
    LightSources.ALL = 0x03;
    return LightSources;
}());
exports.LightSources = LightSources;

},{}],"awayjs-display/lib/materials/MaterialBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlendMode_1 = require("awayjs-core/lib/image/BlendMode");
var ImageBase_1 = require("awayjs-core/lib/image/ImageBase");
var ColorTransform_1 = require("awayjs-core/lib/geom/ColorTransform");
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var SurfaceEvent_1 = require("../events/SurfaceEvent");
var Style_1 = require("../base/Style");
var StyleEvent_1 = require("../events/StyleEvent");
/**
 * MaterialBase forms an abstract base class for any material.
 * A material consists of several passes, each of which constitutes at least one render call. Several passes could
 * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
 * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
 * subsurface scattering, or rendering a depth map for specialized self-shadowing).
 *
 * Away3D provides default materials trough SinglePassMaterialBase and TriangleMaterial, which use modular
 * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
 * shaders, or entire new material frameworks.
 */
var MaterialBase = (function (_super) {
    __extends(MaterialBase, _super);
    function MaterialBase(imageColor, alpha) {
        var _this = this;
        if (imageColor === void 0) { imageColor = null; }
        if (alpha === void 0) { alpha = 1; }
        _super.call(this);
        this._textures = new Array();
        this._pUseColorTransform = false;
        this._alphaBlending = false;
        this._alpha = 1;
        this._pAlphaThreshold = 0;
        this._pAnimateUVs = false;
        this._enableLightFallOff = true;
        this._specularLightSources = 0x01;
        this._diffuseLightSources = 0x03;
        this._style = new Style_1.Style();
        this._iBaseScreenPassIndex = 0;
        this._bothSides = false; // update
        /**
         * A list of material owners, renderables or custom Entities.
         */
        this._owners = new Array();
        this._pBlendMode = BlendMode_1.BlendMode.NORMAL;
        this._imageRect = false;
        this._curves = false;
        this._onInvalidatePropertiesDelegate = function (event) { return _this._onInvalidateProperties(event); };
        this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
        if (imageColor instanceof ImageBase_1.ImageBase)
            this._style.image = imageColor;
        else if (imageColor)
            this._style.color = Number(imageColor);
        this.alpha = alpha;
        this._onLightChangeDelegate = function (event) { return _this.onLightsChange(event); };
        this._onTextureInvalidateDelegate = function (event) { return _this.onTextureInvalidate(event); };
        this.alphaPremultiplied = false; //TODO: work out why this is different for WebGL
    }
    Object.defineProperty(MaterialBase.prototype, "alpha", {
        /**
         * The alpha of the surface.
         */
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            if (this._alpha == value)
                return;
            this._alpha = value;
            if (this._colorTransform == null)
                this._colorTransform = new ColorTransform_1.ColorTransform();
            this._colorTransform.alphaMultiplier = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with. Defaults to null.
         */
        get: function () {
            return this._colorTransform;
        },
        set: function (value) {
            this._colorTransform = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "alphaBlending", {
        /**
         * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
         * example when using textures of foliage, consider using alphaThreshold instead.
         */
        get: function () {
            return this._alphaBlending;
        },
        set: function (value) {
            if (this._alphaBlending == value)
                return;
            this._alphaBlending = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "animationSet", {
        /**
         *
         */
        get: function () {
            return this._animationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "lightPicker", {
        /**
         * The light picker used by the material to provide lights to the material if it supports lighting.
         *
         * @see LightPickerBase
         * @see StaticLightPicker
         */
        get: function () {
            return this._pLightPicker;
        },
        set: function (value) {
            if (this._pLightPicker == value)
                return;
            if (this._pLightPicker)
                this._pLightPicker.removeEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onLightChangeDelegate);
            this._pLightPicker = value;
            if (this._pLightPicker)
                this._pLightPicker.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onLightChangeDelegate);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "curves", {
        /**
         * Indicates whether material should use curves. Defaults to false.
         */
        get: function () {
            return this._curves;
        },
        set: function (value) {
            if (this._curves == value)
                return;
            this._curves = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "imageRect", {
        /**
         * Indicates whether or not any used textures should use an atlas. Defaults to false.
         */
        get: function () {
            return this._imageRect;
        },
        set: function (value) {
            if (this._imageRect == value)
                return;
            this._imageRect = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "style", {
        /**
         * The style used to render the current TriangleGraphic. If set to null, its parent Sprite's style will be used instead.
         */
        get: function () {
            return this._style;
        },
        set: function (value) {
            if (this._style == value)
                return;
            if (this._style)
                this._style.removeEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this._style = value;
            if (this._style)
                this._style.addEventListener(StyleEvent_1.StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidatePropertiesDelegate);
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "animateUVs", {
        /**
         * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
         */
        get: function () {
            return this._pAnimateUVs;
        },
        set: function (value) {
            if (this._pAnimateUVs == value)
                return;
            this._pAnimateUVs = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "useColorTransform", {
        /**
         * Specifies whether or not the UV coordinates should be animated using a transformation matrix.
         */
        get: function () {
            return this._pUseColorTransform;
        },
        set: function (value) {
            if (this._pUseColorTransform == value)
                return;
            this._pUseColorTransform = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "enableLightFallOff", {
        /**
         * Whether or not to use fallOff and radius properties for lights. This can be used to improve performance and
         * compatibility for constrained mode.
         */
        get: function () {
            return this._enableLightFallOff;
        },
        set: function (value) {
            if (this._enableLightFallOff == value)
                return;
            this._enableLightFallOff = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "diffuseLightSources", {
        /**
         * Define which light source types to use for diffuse reflections. This allows choosing between regular lights
         * and/or light probes for diffuse reflections.
         *
         * @see away3d.materials.LightSources
         */
        get: function () {
            return this._diffuseLightSources;
        },
        set: function (value) {
            if (this._diffuseLightSources == value)
                return;
            this._diffuseLightSources = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "specularLightSources", {
        /**
         * Define which light source types to use for specular reflections. This allows choosing between regular lights
         * and/or light probes for specular reflections.
         *
         * @see away3d.materials.LightSources
         */
        get: function () {
            return this._specularLightSources;
        },
        set: function (value) {
            if (this._specularLightSources == value)
                return;
            this._specularLightSources = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "bothSides", {
        /**
         * Defines whether or not the material should cull triangles facing away from the camera.
         */
        get: function () {
            return this._bothSides;
        },
        set: function (value) {
            if (this._bothSides = value)
                return;
            this._bothSides = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "blendMode", {
        /**
         * The blend mode to use when drawing this renderable. The following blend modes are supported:
         * <ul>
         * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
         * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
         * <li>BlendMode.MULTIPLY</li>
         * <li>BlendMode.ADD</li>
         * <li>BlendMode.ALPHA</li>
         * </ul>
         */
        get: function () {
            return this._pBlendMode;
        },
        set: function (value) {
            if (this._pBlendMode == value)
                return;
            this._pBlendMode = value;
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "alphaPremultiplied", {
        /**
         * Indicates whether visible textures (or other pixels) used by this material have
         * already been premultiplied. Toggle this if you are seeing black halos around your
         * blended alpha edges.
         */
        get: function () {
            return this._alphaPremultiplied;
        },
        set: function (value) {
            if (this._alphaPremultiplied == value)
                return;
            this._alphaPremultiplied = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaterialBase.prototype, "alphaThreshold", {
        /**
         * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
         * invisible or entirely opaque, often used with textures for foliage, etc.
         * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
         */
        get: function () {
            return this._pAlphaThreshold;
        },
        set: function (value) {
            if (value < 0)
                value = 0;
            else if (value > 1)
                value = 1;
            if (this._pAlphaThreshold == value)
                return;
            this._pAlphaThreshold = value;
            this.invalidatePasses();
        },
        enumerable: true,
        configurable: true
    });
    //
    // MATERIAL MANAGEMENT
    //
    /**
     * Mark an IRenderable as owner of this material.
     * Assures we're not using the same material across renderables with different animations, since the
     * Programs depend on animation. This method needs to be called when a material is assigned.
     *
     * @param owner The IRenderable that had this material assigned
     *
     * @internal
     */
    MaterialBase.prototype.iAddOwner = function (owner) {
        this._owners.push(owner);
        var animationSet;
        var animator = owner.animator;
        if (animator)
            animationSet = animator.animationSet;
        if (owner.animator) {
            if (this._animationSet && animationSet != this._animationSet) {
                throw new Error("A Material instance cannot be shared across material owners with different animation sets");
            }
            else {
                if (this._animationSet != animationSet) {
                    this._animationSet = animationSet;
                    this.invalidateAnimation();
                }
            }
        }
        owner.invalidateSurface();
    };
    /**
     * Removes an IRenderable as owner.
     * @param owner
     *
     * @internal
     */
    MaterialBase.prototype.iRemoveOwner = function (owner) {
        this._owners.splice(this._owners.indexOf(owner), 1);
        if (this._owners.length == 0) {
            this._animationSet = null;
            this.invalidateAnimation();
        }
        owner.invalidateSurface();
    };
    Object.defineProperty(MaterialBase.prototype, "iOwners", {
        /**
         * A list of the IRenderables that use this material
         *
         * @private
         */
        get: function () {
            return this._owners;
        },
        enumerable: true,
        configurable: true
    });
    MaterialBase.prototype.getNumTextures = function () {
        return this._textures.length;
    };
    MaterialBase.prototype.getTextureAt = function (index) {
        return this._textures[index];
    };
    /**
     * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
     *
     * @private
     */
    MaterialBase.prototype.invalidatePasses = function () {
        this.dispatchEvent(new SurfaceEvent_1.SurfaceEvent(SurfaceEvent_1.SurfaceEvent.INVALIDATE_PASSES, this));
    };
    MaterialBase.prototype.invalidateAnimation = function () {
        this.dispatchEvent(new SurfaceEvent_1.SurfaceEvent(SurfaceEvent_1.SurfaceEvent.INVALIDATE_ANIMATION, this));
    };
    MaterialBase.prototype.invalidateSurfaces = function () {
        var len = this._owners.length;
        for (var i = 0; i < len; i++)
            this._owners[i].invalidateSurface();
    };
    /**
     * Called when the light picker's configuration changed.
     */
    MaterialBase.prototype.onLightsChange = function (event) {
        this.invalidate();
    };
    MaterialBase.prototype.invalidateTexture = function () {
        this.dispatchEvent(new SurfaceEvent_1.SurfaceEvent(SurfaceEvent_1.SurfaceEvent.INVALIDATE_TEXTURE, this));
    };
    MaterialBase.prototype.addTextureAt = function (texture, index) {
        var i = this._textures.indexOf(texture);
        if (i == index)
            return;
        else if (i != -1)
            this._textures.splice(i, 1);
        this._textures.splice(index, 0, texture);
        texture.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);
        this.onTextureInvalidate();
    };
    MaterialBase.prototype.addTexture = function (texture) {
        if (this._textures.indexOf(texture) != -1)
            return;
        this._textures.push(texture);
        texture.addEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);
        this.onTextureInvalidate();
    };
    MaterialBase.prototype.removeTexture = function (texture) {
        this._textures.splice(this._textures.indexOf(texture), 1);
        texture.removeEventListener(AssetEvent_1.AssetEvent.INVALIDATE, this._onTextureInvalidateDelegate);
        this.onTextureInvalidate();
    };
    MaterialBase.prototype.onTextureInvalidate = function (event) {
        if (event === void 0) { event = null; }
        this.invalidatePasses();
        //invalidate renderables for number of images getter (in case it has changed)
        this.invalidateSurfaces();
    };
    MaterialBase.prototype._onInvalidateProperties = function (event) {
        this.invalidatePasses();
    };
    return MaterialBase;
}(AssetBase_1.AssetBase));
exports.MaterialBase = MaterialBase;

},{"../base/Style":"awayjs-display/lib/base/Style","../events/StyleEvent":"awayjs-display/lib/events/StyleEvent","../events/SurfaceEvent":"awayjs-display/lib/events/SurfaceEvent","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/geom/ColorTransform":undefined,"awayjs-core/lib/image/BlendMode":undefined,"awayjs-core/lib/image/ImageBase":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/materials/lightpickers/LightPickerBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
/**
 * LightPickerBase provides an abstract base clase for light picker classes. These classes are responsible for
 * feeding materials with relevant lights. Usually, StaticLightPicker can be used, but LightPickerBase can be
 * extended to provide more application-specific dynamic selection of lights.
 *
 * @see StaticLightPicker
 */
var LightPickerBase = (function (_super) {
    __extends(LightPickerBase, _super);
    /**
     * Creates a new LightPickerBase object.
     */
    function LightPickerBase() {
        _super.call(this);
        this._pNumPointLights = 0;
        this._pNumDirectionalLights = 0;
        this._pNumCastingPointLights = 0;
        this._pNumCastingDirectionalLights = 0;
        this._pNumLightProbes = 0;
    }
    /**
     * Disposes resources used by the light picker.
     */
    LightPickerBase.prototype.dispose = function () {
    };
    Object.defineProperty(LightPickerBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return LightPickerBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "numDirectionalLights", {
        /**
         * The maximum amount of directional lights that will be provided.
         */
        get: function () {
            return this._pNumDirectionalLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "numPointLights", {
        /**
         * The maximum amount of point lights that will be provided.
         */
        get: function () {
            return this._pNumPointLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "numCastingDirectionalLights", {
        /**
         * The maximum amount of directional lights that cast shadows.
         */
        get: function () {
            return this._pNumCastingDirectionalLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "numCastingPointLights", {
        /**
         * The amount of point lights that cast shadows.
         */
        get: function () {
            return this._pNumCastingPointLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "numLightProbes", {
        /**
         * The maximum amount of light probes that will be provided.
         */
        get: function () {
            return this._pNumLightProbes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "pointLights", {
        /**
         * The collected point lights to be used for shading.
         */
        get: function () {
            return this._pPointLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "directionalLights", {
        /**
         * The collected directional lights to be used for shading.
         */
        get: function () {
            return this._pDirectionalLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "castingPointLights", {
        /**
         * The collected point lights that cast shadows to be used for shading.
         */
        get: function () {
            return this._pCastingPointLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "castingDirectionalLights", {
        /**
         * The collected directional lights that cast shadows to be used for shading.
         */
        get: function () {
            return this._pCastingDirectionalLights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "lightProbes", {
        /**
         * The collected light probes to be used for shading.
         */
        get: function () {
            return this._pLightProbes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "lightProbeWeights", {
        /**
         * The weights for each light probe, defining their influence on the object.
         */
        get: function () {
            return this._pLightProbeWeights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightPickerBase.prototype, "allPickedLights", {
        /**
         * A collection of all the collected lights.
         */
        get: function () {
            return this._pAllPickedLights;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates set of lights for a given renderable and EntityCollector. Always call super.collectLights() after custom overridden code.
     */
    LightPickerBase.prototype.collectLights = function (entity) {
        this.updateProbeWeights(entity);
    };
    /**
     * Updates the weights for the light probes, based on the renderable's position relative to them.
     * @param renderable The renderble for which to calculate the light probes' influence.
     */
    LightPickerBase.prototype.updateProbeWeights = function (entity) {
        // todo: this will cause the same calculations to occur per TriangleGraphic. See if this can be improved.
        var objectPos = entity.scenePosition;
        var lightPos;
        var rx = objectPos.x, ry = objectPos.y, rz = objectPos.z;
        var dx, dy, dz;
        var w, total = 0;
        var i;
        // calculates weights for probes
        for (i = 0; i < this._pNumLightProbes; ++i) {
            lightPos = this._pLightProbes[i].scenePosition;
            dx = rx - lightPos.x;
            dy = ry - lightPos.y;
            dz = rz - lightPos.z;
            // weight is inversely proportional to square of distance
            w = dx * dx + dy * dy + dz * dz;
            // just... huge if at the same spot
            w = w > .00001 ? 1 / w : 50000000;
            this._pLightProbeWeights[i] = w;
            total += w;
        }
        // normalize
        total = 1 / total;
        for (i = 0; i < this._pNumLightProbes; ++i)
            this._pLightProbeWeights[i] *= total;
    };
    LightPickerBase.assetType = "[asset LightPicker]";
    return LightPickerBase;
}(AssetBase_1.AssetBase));
exports.LightPickerBase = LightPickerBase;

},{"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/materials/lightpickers/StaticLightPicker":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var DirectionalLight_1 = require("../../display/DirectionalLight");
var LightProbe_1 = require("../../display/LightProbe");
var PointLight_1 = require("../../display/PointLight");
var LightEvent_1 = require("../../events/LightEvent");
var LightPickerBase_1 = require("../../materials/lightpickers/LightPickerBase");
/**
 * StaticLightPicker is a light picker that provides a static set of lights. The lights can be reassigned, but
 * if the configuration changes (number of directional lights, point lights, etc), a material recompilation may
 * occur.
 */
var StaticLightPicker = (function (_super) {
    __extends(StaticLightPicker, _super);
    /**
     * Creates a new StaticLightPicker object.
     * @param lights The lights to be used for shading.
     */
    function StaticLightPicker(lights) {
        var _this = this;
        _super.call(this);
        this._onCastShadowChangeDelegate = function (event) { return _this.onCastShadowChange(event); };
        this.lights = lights;
    }
    Object.defineProperty(StaticLightPicker.prototype, "lights", {
        /**
         * The lights used for shading.
         */
        get: function () {
            return this._lights;
        },
        set: function (value) {
            var numPointLights = 0;
            var numDirectionalLights = 0;
            var numCastingPointLights = 0;
            var numCastingDirectionalLights = 0;
            var numLightProbes = 0;
            var light;
            if (this._lights)
                this.clearListeners();
            this._lights = value;
            this._pAllPickedLights = value;
            this._pPointLights = new Array();
            this._pCastingPointLights = new Array();
            this._pDirectionalLights = new Array();
            this._pCastingDirectionalLights = new Array();
            this._pLightProbes = new Array();
            var len = value.length;
            for (var i = 0; i < len; ++i) {
                light = value[i];
                light.addEventListener(LightEvent_1.LightEvent.CASTS_SHADOW_CHANGE, this._onCastShadowChangeDelegate);
                if (light instanceof PointLight_1.PointLight) {
                    if (light.shadowsEnabled)
                        this._pCastingPointLights[numCastingPointLights++] = light;
                    else
                        this._pPointLights[numPointLights++] = light;
                }
                else if (light instanceof DirectionalLight_1.DirectionalLight) {
                    if (light.shadowsEnabled)
                        this._pCastingDirectionalLights[numCastingDirectionalLights++] = light;
                    else
                        this._pDirectionalLights[numDirectionalLights++] = light;
                }
                else if (light instanceof LightProbe_1.LightProbe) {
                    this._pLightProbes[numLightProbes++] = light;
                }
            }
            if (this._pNumDirectionalLights == numDirectionalLights && this._pNumPointLights == numPointLights && this._pNumLightProbes == numLightProbes && this._pNumCastingPointLights == numCastingPointLights && this._pNumCastingDirectionalLights == numCastingDirectionalLights)
                return;
            this._pNumDirectionalLights = numDirectionalLights;
            this._pNumCastingDirectionalLights = numCastingDirectionalLights;
            this._pNumPointLights = numPointLights;
            this._pNumCastingPointLights = numCastingPointLights;
            this._pNumLightProbes = numLightProbes;
            // MUST HAVE MULTIPLE OF 4 ELEMENTS!
            this._pLightProbeWeights = new Array(Math.ceil(numLightProbes / 4) * 4);
            // notify material lights have changed
            this.dispatchEvent(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.INVALIDATE, this));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Remove configuration change listeners on the lights.
     */
    StaticLightPicker.prototype.clearListeners = function () {
        var len = this._lights.length;
        for (var i = 0; i < len; ++i)
            this._lights[i].removeEventListener(LightEvent_1.LightEvent.CASTS_SHADOW_CHANGE, this._onCastShadowChangeDelegate);
    };
    /**
     * Notifies the material of a configuration change.
     */
    StaticLightPicker.prototype.onCastShadowChange = function (event) {
        // TODO: Assign to special caster collections, just append it to the lights in SinglePass
        // But keep seperated in multipass
        var light = event.target;
        if (light instanceof PointLight_1.PointLight)
            this.updatePointCasting(light);
        else if (light instanceof DirectionalLight_1.DirectionalLight)
            this.updateDirectionalCasting(light);
        this.dispatchEvent(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.INVALIDATE, this));
    };
    /**
     * Called when a directional light's shadow casting configuration changes.
     */
    StaticLightPicker.prototype.updateDirectionalCasting = function (light) {
        var dl = light;
        if (light.shadowsEnabled) {
            --this._pNumDirectionalLights;
            ++this._pNumCastingDirectionalLights;
            this._pDirectionalLights.splice(this._pDirectionalLights.indexOf(dl), 1);
            this._pCastingDirectionalLights.push(light);
        }
        else {
            ++this._pNumDirectionalLights;
            --this._pNumCastingDirectionalLights;
            this._pCastingDirectionalLights.splice(this._pCastingDirectionalLights.indexOf(dl), 1);
            this._pDirectionalLights.push(light);
        }
    };
    /**
     * Called when a point light's shadow casting configuration changes.
     */
    StaticLightPicker.prototype.updatePointCasting = function (light) {
        var pl = light;
        if (light.shadowsEnabled) {
            --this._pNumPointLights;
            ++this._pNumCastingPointLights;
            this._pPointLights.splice(this._pPointLights.indexOf(pl), 1);
            this._pCastingPointLights.push(light);
        }
        else {
            ++this._pNumPointLights;
            --this._pNumCastingPointLights;
            this._pCastingPointLights.splice(this._pCastingPointLights.indexOf(pl), 1);
            this._pPointLights.push(light);
        }
    };
    return StaticLightPicker;
}(LightPickerBase_1.LightPickerBase));
exports.StaticLightPicker = StaticLightPicker;

},{"../../display/DirectionalLight":"awayjs-display/lib/display/DirectionalLight","../../display/LightProbe":"awayjs-display/lib/display/LightProbe","../../display/PointLight":"awayjs-display/lib/display/PointLight","../../events/LightEvent":"awayjs-display/lib/events/LightEvent","../../materials/lightpickers/LightPickerBase":"awayjs-display/lib/materials/lightpickers/LightPickerBase","awayjs-core/lib/events/AssetEvent":undefined}],"awayjs-display/lib/materials/shadowmappers/CascadeShadowMapper":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var Rectangle_1 = require("awayjs-core/lib/geom/Rectangle");
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var FreeMatrixProjection_1 = require("awayjs-core/lib/projections/FreeMatrixProjection");
var Camera_1 = require("../../display/Camera");
var DirectionalShadowMapper_1 = require("../../materials/shadowmappers/DirectionalShadowMapper");
var CascadeShadowMapper = (function (_super) {
    __extends(CascadeShadowMapper, _super);
    function CascadeShadowMapper(numCascades) {
        if (numCascades === void 0) { numCascades = 3; }
        _super.call(this);
        this._pScissorRectsInvalid = true;
        if (numCascades < 1 || numCascades > 4)
            throw new Error("numCascades must be an integer between 1 and 4");
        this._numCascades = numCascades;
        this.init();
    }
    CascadeShadowMapper.prototype.getSplitRatio = function (index /*uint*/) {
        return this._splitRatios[index];
    };
    CascadeShadowMapper.prototype.setSplitRatio = function (index /*uint*/, value) {
        if (value < 0)
            value = 0;
        else if (value > 1)
            value = 1;
        if (index >= this._numCascades)
            throw new Error("index must be smaller than the number of cascades!");
        this._splitRatios[index] = value;
    };
    CascadeShadowMapper.prototype.getDepthProjections = function (partition /*uint*/) {
        return this._depthCameras[partition].viewProjection;
    };
    CascadeShadowMapper.prototype.init = function () {
        this._splitRatios = new Array(this._numCascades);
        this._nearPlaneDistances = new Array(this._numCascades);
        var s = 1;
        for (var i = this._numCascades - 1; i >= 0; --i) {
            this._splitRatios[i] = s;
            s *= .4;
        }
        this._texOffsetsX = Array(-1, 1, -1, 1);
        this._texOffsetsY = Array(1, 1, -1, -1);
        this._pScissorRects = new Array(4);
        this._depthLenses = new Array();
        this._depthCameras = new Array();
        for (i = 0; i < this._numCascades; ++i) {
            this._depthLenses[i] = new FreeMatrixProjection_1.FreeMatrixProjection();
            this._depthCameras[i] = new Camera_1.Camera(this._depthLenses[i]);
        }
    };
    CascadeShadowMapper.prototype._pSetDepthMapSize = function (value /*uint*/) {
        _super.prototype._pSetDepthMapSize.call(this, value);
        this.invalidateScissorRects();
    };
    CascadeShadowMapper.prototype.invalidateScissorRects = function () {
        this._pScissorRectsInvalid = true;
    };
    Object.defineProperty(CascadeShadowMapper.prototype, "numCascades", {
        get: function () {
            return this._numCascades;
        },
        set: function (value /*int*/) {
            if (value == this._numCascades)
                return;
            if (value < 1 || value > 4)
                throw new Error("numCascades must be an integer between 1 and 4");
            this._numCascades = value;
            this.invalidateScissorRects();
            this.init();
            this.dispatchEvent(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.INVALIDATE, this));
        },
        enumerable: true,
        configurable: true
    });
    CascadeShadowMapper.prototype.pDrawDepthMap = function (scene, target, renderer) {
        if (this._pScissorRectsInvalid)
            this.updateScissorRects();
        renderer.cullPlanes = this._pCullPlanes;
        renderer._iRenderCascades(this._pOverallDepthCamera, scene, target.image2D, this._numCascades, this._pScissorRects, this._depthCameras);
    };
    CascadeShadowMapper.prototype.updateScissorRects = function () {
        var half = this._pDepthMapSize * .5;
        this._pScissorRects[0] = new Rectangle_1.Rectangle(0, 0, half, half);
        this._pScissorRects[1] = new Rectangle_1.Rectangle(half, 0, half, half);
        this._pScissorRects[2] = new Rectangle_1.Rectangle(0, half, half, half);
        this._pScissorRects[3] = new Rectangle_1.Rectangle(half, half, half, half);
        this._pScissorRectsInvalid = false;
    };
    CascadeShadowMapper.prototype.pUpdateDepthProjection = function (camera) {
        var matrix;
        var projection = camera.projection;
        var projectionNear = projection.near;
        var projectionRange = projection.far - projectionNear;
        this.pUpdateProjectionFromFrustumCorners(camera, camera.projection.frustumCorners, this._pMatrix);
        this._pMatrix.appendScale(.96, .96, 1);
        this._pOverallDepthProjection.matrix = this._pMatrix;
        this.pUpdateCullPlanes(camera);
        for (var i = 0; i < this._numCascades; ++i) {
            matrix = this._depthLenses[i].matrix;
            this._nearPlaneDistances[i] = projectionNear + this._splitRatios[i] * projectionRange;
            this._depthCameras[i].transform.matrix3D = this._pOverallDepthCamera.transform.matrix3D;
            this.updateProjectionPartition(matrix, this._splitRatios[i], this._texOffsetsX[i], this._texOffsetsY[i]);
            this._depthLenses[i].matrix = matrix;
        }
    };
    CascadeShadowMapper.prototype.updateProjectionPartition = function (matrix, splitRatio, texOffsetX, texOffsetY) {
        var raw = Matrix3DUtils_1.Matrix3DUtils.RAW_DATA_CONTAINER;
        var xN, yN, zN;
        var xF, yF, zF;
        var minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, minZ;
        var maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY, maxZ = Number.NEGATIVE_INFINITY;
        var i = 0;
        while (i < 12) {
            xN = this._pLocalFrustum[i];
            yN = this._pLocalFrustum[i + 1];
            zN = this._pLocalFrustum[i + 2];
            xF = xN + (this._pLocalFrustum[i + 12] - xN) * splitRatio;
            yF = yN + (this._pLocalFrustum[i + 13] - yN) * splitRatio;
            zF = zN + (this._pLocalFrustum[i + 14] - zN) * splitRatio;
            if (xN < minX)
                minX = xN;
            if (xN > maxX)
                maxX = xN;
            if (yN < minY)
                minY = yN;
            if (yN > maxY)
                maxY = yN;
            if (zN > maxZ)
                maxZ = zN;
            if (xF < minX)
                minX = xF;
            if (xF > maxX)
                maxX = xF;
            if (yF < minY)
                minY = yF;
            if (yF > maxY)
                maxY = yF;
            if (zF > maxZ)
                maxZ = zF;
            i += 3;
        }
        minZ = 1;
        var w = (maxX - minX);
        var h = (maxY - minY);
        var d = 1 / (maxZ - minZ);
        if (minX < 0)
            minX -= this._pSnap; // because int() rounds up for < 0
        if (minY < 0)
            minY -= this._pSnap;
        minX = Math.floor(minX / this._pSnap) * this._pSnap;
        minY = Math.floor(minY / this._pSnap) * this._pSnap;
        var snap2 = 2 * this._pSnap;
        w = Math.floor(w / snap2 + 1) * snap2;
        h = Math.floor(h / snap2 + 1) * snap2;
        maxX = minX + w;
        maxY = minY + h;
        w = 1 / w;
        h = 1 / h;
        raw[0] = 2 * w;
        raw[5] = 2 * h;
        raw[10] = d;
        raw[12] = -(maxX + minX) * w;
        raw[13] = -(maxY + minY) * h;
        raw[14] = -minZ * d;
        raw[15] = 1;
        raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
        matrix.copyRawDataFrom(raw);
        matrix.appendScale(.96, .96, 1);
        matrix.appendTranslation(texOffsetX, texOffsetY, 0);
        matrix.appendScale(.5, .5, 1);
    };
    Object.defineProperty(CascadeShadowMapper.prototype, "_iNearPlaneDistances", {
        get: function () {
            return this._nearPlaneDistances;
        },
        enumerable: true,
        configurable: true
    });
    return CascadeShadowMapper;
}(DirectionalShadowMapper_1.DirectionalShadowMapper));
exports.CascadeShadowMapper = CascadeShadowMapper;

},{"../../display/Camera":"awayjs-display/lib/display/Camera","../../materials/shadowmappers/DirectionalShadowMapper":"awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper","awayjs-core/lib/events/AssetEvent":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/geom/Rectangle":undefined,"awayjs-core/lib/projections/FreeMatrixProjection":undefined}],"awayjs-display/lib/materials/shadowmappers/CubeMapShadowMapper":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ImageCube_1 = require("awayjs-core/lib/image/ImageCube");
var Camera_1 = require("../../display/Camera");
var ShadowMapperBase_1 = require("../../materials/shadowmappers/ShadowMapperBase");
var SingleCubeTexture_1 = require("../../textures/SingleCubeTexture");
var CubeMapShadowMapper = (function (_super) {
    __extends(CubeMapShadowMapper, _super);
    function CubeMapShadowMapper() {
        _super.call(this);
        this._pDepthMapSize = 512;
        this._needsRender = new Array();
        this.initCameras();
    }
    CubeMapShadowMapper.prototype.initCameras = function () {
        this._depthCameras = new Array();
        this._projections = new Array();
        // posX, negX, posY, negY, posZ, negZ
        this.addCamera(0, 90, 0);
        this.addCamera(0, -90, 0);
        this.addCamera(-90, 0, 0);
        this.addCamera(90, 0, 0);
        this.addCamera(0, 0, 0);
        this.addCamera(0, 180, 0);
    };
    CubeMapShadowMapper.prototype.addCamera = function (rotationX, rotationY, rotationZ) {
        var cam = new Camera_1.Camera();
        cam.rotationX = rotationX;
        cam.rotationY = rotationY;
        cam.rotationZ = rotationZ;
        cam.projection.near = .01;
        var projection = cam.projection;
        projection.fieldOfView = 90;
        this._projections.push(projection);
        cam.projection._iAspectRatio = 1;
        this._depthCameras.push(cam);
    };
    //@override
    CubeMapShadowMapper.prototype.pCreateDepthTexture = function () {
        return new SingleCubeTexture_1.SingleCubeTexture(new ImageCube_1.ImageCube(this._pDepthMapSize));
    };
    //@override
    CubeMapShadowMapper.prototype.pUpdateDepthProjection = function (camera) {
        var light = (this._pLight);
        var maxDistance = light._pFallOff;
        var pos = this._pLight.scenePosition;
        // todo: faces outside frustum which are pointing away from camera need not be rendered!
        for (var i = 0; i < 6; ++i) {
            this._projections[i].far = maxDistance;
            this._depthCameras[i].transform.moveTo(pos.x, pos.y, pos.z);
            this._needsRender[i] = true;
        }
    };
    //@override
    CubeMapShadowMapper.prototype.pDrawDepthMap = function (scene, target, renderer) {
        for (var i = 0; i < 6; ++i)
            if (this._needsRender[i])
                renderer._iRender(this._depthCameras[i], scene, target.imageCube, null, i);
    };
    return CubeMapShadowMapper;
}(ShadowMapperBase_1.ShadowMapperBase));
exports.CubeMapShadowMapper = CubeMapShadowMapper;

},{"../../display/Camera":"awayjs-display/lib/display/Camera","../../materials/shadowmappers/ShadowMapperBase":"awayjs-display/lib/materials/shadowmappers/ShadowMapperBase","../../textures/SingleCubeTexture":"awayjs-display/lib/textures/SingleCubeTexture","awayjs-core/lib/image/ImageCube":undefined}],"awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Image2D_1 = require("awayjs-core/lib/image/Image2D");
var Matrix3D_1 = require("awayjs-core/lib/geom/Matrix3D");
var Matrix3DUtils_1 = require("awayjs-core/lib/geom/Matrix3DUtils");
var FreeMatrixProjection_1 = require("awayjs-core/lib/projections/FreeMatrixProjection");
var Camera_1 = require("../../display/Camera");
var ShadowMapperBase_1 = require("../../materials/shadowmappers/ShadowMapperBase");
var Single2DTexture_1 = require("../../textures/Single2DTexture");
var DirectionalShadowMapper = (function (_super) {
    __extends(DirectionalShadowMapper, _super);
    function DirectionalShadowMapper() {
        _super.call(this);
        this._pLightOffset = 10000;
        this._pSnap = 64;
        this._pCullPlanes = [];
        this._pOverallDepthProjection = new FreeMatrixProjection_1.FreeMatrixProjection();
        this._pOverallDepthCamera = new Camera_1.Camera(this._pOverallDepthProjection);
        this._pLocalFrustum = [];
        this._pMatrix = new Matrix3D_1.Matrix3D();
    }
    Object.defineProperty(DirectionalShadowMapper.prototype, "snap", {
        get: function () {
            return this._pSnap;
        },
        set: function (value) {
            this._pSnap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalShadowMapper.prototype, "lightOffset", {
        get: function () {
            return this._pLightOffset;
        },
        set: function (value) {
            this._pLightOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalShadowMapper.prototype, "iDepthProjection", {
        //@arcane
        get: function () {
            return this._pOverallDepthCamera.viewProjection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectionalShadowMapper.prototype, "depth", {
        //@arcane
        get: function () {
            return this._pMaxZ - this._pMinZ;
        },
        enumerable: true,
        configurable: true
    });
    DirectionalShadowMapper.prototype.iSetDepthMap = function (depthMap) {
        if (this._depthMap == depthMap)
            return;
        _super.prototype.iSetDepthMap.call(this, depthMap);
        if (this._depthMap) {
            this._explicitDepthMap = true;
            this._pDepthMapSize = depthMap.image2D.rect.width;
        }
        else {
            this._explicitDepthMap = false;
        }
    };
    DirectionalShadowMapper.prototype.pCreateDepthTexture = function () {
        return new Single2DTexture_1.Single2DTexture(new Image2D_1.Image2D(this._pDepthMapSize, this._pDepthMapSize));
    };
    //@override
    DirectionalShadowMapper.prototype.pDrawDepthMap = function (scene, target, renderer) {
        renderer.cullPlanes = this._pCullPlanes;
        renderer._iRender(this._pOverallDepthCamera, scene, target.image2D);
    };
    //@protected
    DirectionalShadowMapper.prototype.pUpdateCullPlanes = function (camera) {
        var lightFrustumPlanes = this._pOverallDepthCamera.frustumPlanes;
        var viewFrustumPlanes = camera.frustumPlanes;
        this._pCullPlanes.length = 4;
        this._pCullPlanes[0] = lightFrustumPlanes[0];
        this._pCullPlanes[1] = lightFrustumPlanes[1];
        this._pCullPlanes[2] = lightFrustumPlanes[2];
        this._pCullPlanes[3] = lightFrustumPlanes[3];
        var light = this._pLight;
        var dir = light.sceneDirection;
        var dirX = dir.x;
        var dirY = dir.y;
        var dirZ = dir.z;
        var j = 4;
        for (var i = 0; i < 6; ++i) {
            var plane = viewFrustumPlanes[i];
            if (plane.a * dirX + plane.b * dirY + plane.c * dirZ < 0)
                this._pCullPlanes[j++] = plane;
        }
    };
    //@override
    DirectionalShadowMapper.prototype.pUpdateDepthProjection = function (camera) {
        this.pUpdateProjectionFromFrustumCorners(camera, camera.projection.frustumCorners, this._pMatrix);
        this._pOverallDepthProjection.matrix = this._pMatrix;
        this.pUpdateCullPlanes(camera);
    };
    DirectionalShadowMapper.prototype.pUpdateProjectionFromFrustumCorners = function (camera, corners, matrix) {
        var raw = Matrix3DUtils_1.Matrix3DUtils.RAW_DATA_CONTAINER;
        var dir;
        var x, y, z;
        var minX, minY;
        var maxX, maxY;
        var i;
        var light = this._pLight;
        dir = light.sceneDirection;
        this._pOverallDepthCamera.transform.matrix3D = this._pLight.sceneTransform;
        x = Math.floor((camera.x - dir.x * this._pLightOffset) / this._pSnap) * this._pSnap;
        y = Math.floor((camera.y - dir.y * this._pLightOffset) / this._pSnap) * this._pSnap;
        z = Math.floor((camera.z - dir.z * this._pLightOffset) / this._pSnap) * this._pSnap;
        this._pOverallDepthCamera.x = x;
        this._pOverallDepthCamera.y = y;
        this._pOverallDepthCamera.z = z;
        this._pMatrix.copyFrom(this._pOverallDepthCamera.inverseSceneTransform);
        this._pMatrix.prepend(camera.sceneTransform);
        this._pMatrix.transformVectors(corners, this._pLocalFrustum);
        minX = maxX = this._pLocalFrustum[0];
        minY = maxY = this._pLocalFrustum[1];
        this._pMaxZ = this._pLocalFrustum[2];
        i = 3;
        while (i < 24) {
            x = this._pLocalFrustum[i];
            y = this._pLocalFrustum[i + 1];
            z = this._pLocalFrustum[i + 2];
            if (x < minX)
                minX = x;
            if (x > maxX)
                maxX = x;
            if (y < minY)
                minY = y;
            if (y > maxY)
                maxY = y;
            if (z > this._pMaxZ)
                this._pMaxZ = z;
            i += 3;
        }
        this._pMinZ = 1;
        var w = maxX - minX;
        var h = maxY - minY;
        var d = 1 / (this._pMaxZ - this._pMinZ);
        if (minX < 0)
            minX -= this._pSnap; // because int() rounds up for < 0
        if (minY < 0)
            minY -= this._pSnap;
        minX = Math.floor(minX / this._pSnap) * this._pSnap;
        minY = Math.floor(minY / this._pSnap) * this._pSnap;
        var snap2 = 2 * this._pSnap;
        w = Math.floor(w / snap2 + 2) * snap2;
        h = Math.floor(h / snap2 + 2) * snap2;
        maxX = minX + w;
        maxY = minY + h;
        w = 1 / w;
        h = 1 / h;
        raw[0] = 2 * w;
        raw[5] = 2 * h;
        raw[10] = d;
        raw[12] = -(maxX + minX) * w;
        raw[13] = -(maxY + minY) * h;
        raw[14] = -this._pMinZ * d;
        raw[15] = 1;
        raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
        matrix.copyRawDataFrom(raw);
    };
    return DirectionalShadowMapper;
}(ShadowMapperBase_1.ShadowMapperBase));
exports.DirectionalShadowMapper = DirectionalShadowMapper;

},{"../../display/Camera":"awayjs-display/lib/display/Camera","../../materials/shadowmappers/ShadowMapperBase":"awayjs-display/lib/materials/shadowmappers/ShadowMapperBase","../../textures/Single2DTexture":"awayjs-display/lib/textures/Single2DTexture","awayjs-core/lib/geom/Matrix3D":undefined,"awayjs-core/lib/geom/Matrix3DUtils":undefined,"awayjs-core/lib/image/Image2D":undefined,"awayjs-core/lib/projections/FreeMatrixProjection":undefined}],"awayjs-display/lib/materials/shadowmappers/NearDirectionalShadowMapper":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DirectionalShadowMapper_1 = require("../../materials/shadowmappers/DirectionalShadowMapper");
var NearDirectionalShadowMapper = (function (_super) {
    __extends(NearDirectionalShadowMapper, _super);
    function NearDirectionalShadowMapper(coverageRatio) {
        if (coverageRatio === void 0) { coverageRatio = .5; }
        _super.call(this);
        this.coverageRatio = coverageRatio;
    }
    Object.defineProperty(NearDirectionalShadowMapper.prototype, "coverageRatio", {
        /**
         * A value between 0 and 1 to indicate the ratio of the view frustum that needs to be covered by the shadow map.
         */
        get: function () {
            return this._coverageRatio;
        },
        set: function (value) {
            if (value > 1)
                value = 1;
            else if (value < 0)
                value = 0;
            this._coverageRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    NearDirectionalShadowMapper.prototype.pUpdateDepthProjection = function (camera) {
        var corners = camera.projection.frustumCorners;
        for (var i = 0; i < 12; ++i) {
            var v = corners[i];
            this._pLocalFrustum[i] = v;
            this._pLocalFrustum[i + 12] = v + (corners[i + 12] - v) * this._coverageRatio;
        }
        this.pUpdateProjectionFromFrustumCorners(camera, this._pLocalFrustum, this._pMatrix);
        this._pOverallDepthProjection.matrix = this._pMatrix;
    };
    return NearDirectionalShadowMapper;
}(DirectionalShadowMapper_1.DirectionalShadowMapper));
exports.NearDirectionalShadowMapper = NearDirectionalShadowMapper;

},{"../../materials/shadowmappers/DirectionalShadowMapper":"awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper"}],"awayjs-display/lib/materials/shadowmappers/ShadowMapperBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var ShadowMapperBase = (function (_super) {
    __extends(ShadowMapperBase, _super);
    function ShadowMapperBase() {
        _super.apply(this, arguments);
        this._pDepthMapSize = 2048;
        this._autoUpdateShadows = true;
    }
    Object.defineProperty(ShadowMapperBase.prototype, "autoUpdateShadows", {
        get: function () {
            return this._autoUpdateShadows;
        },
        set: function (value) {
            this._autoUpdateShadows = value;
        },
        enumerable: true,
        configurable: true
    });
    ShadowMapperBase.prototype.updateShadows = function () {
        this._iShadowsInvalid = true;
    };
    ShadowMapperBase.prototype.iSetDepthMap = function (depthMap) {
        if (this._depthMap && !this._explicitDepthMap)
            this._depthMap.dispose();
        this._depthMap = depthMap;
    };
    Object.defineProperty(ShadowMapperBase.prototype, "light", {
        get: function () {
            return this._pLight;
        },
        set: function (value) {
            this._pLight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapperBase.prototype, "depthMap", {
        get: function () {
            if (!this._depthMap)
                this._depthMap = this.pCreateDepthTexture();
            return this._depthMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowMapperBase.prototype, "depthMapSize", {
        get: function () {
            return this._pDepthMapSize;
        },
        set: function (value) {
            if (value == this._pDepthMapSize)
                return;
            this._pSetDepthMapSize(value);
        },
        enumerable: true,
        configurable: true
    });
    ShadowMapperBase.prototype.dispose = function () {
        if (this._depthMap && !this._explicitDepthMap)
            this._depthMap.dispose();
        this._depthMap = null;
    };
    ShadowMapperBase.prototype.pCreateDepthTexture = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ShadowMapperBase.prototype.iRenderDepthMap = function (camera, scene, renderer) {
        this._iShadowsInvalid = false;
        this.pUpdateDepthProjection(camera);
        if (!this._depthMap)
            this._depthMap = this.pCreateDepthTexture();
        this.pDrawDepthMap(scene, this._depthMap, renderer);
    };
    ShadowMapperBase.prototype.pUpdateDepthProjection = function (camera) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ShadowMapperBase.prototype.pDrawDepthMap = function (scene, target, renderer) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    ShadowMapperBase.prototype._pSetDepthMapSize = function (value) {
        this._pDepthMapSize = value;
        if (this._explicitDepthMap) {
            throw Error("Cannot set depth map size for the current renderer.");
        }
        else if (this._depthMap) {
            this._depthMap.dispose();
            this._depthMap = null;
        }
    };
    return ShadowMapperBase;
}(AssetBase_1.AssetBase));
exports.ShadowMapperBase = ShadowMapperBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/materials":[function(require,module,exports){
"use strict";
var LightPickerBase_1 = require("./materials/lightpickers/LightPickerBase");
exports.LightPickerBase = LightPickerBase_1.LightPickerBase;
var StaticLightPicker_1 = require("./materials/lightpickers/StaticLightPicker");
exports.StaticLightPicker = StaticLightPicker_1.StaticLightPicker;
var CascadeShadowMapper_1 = require("./materials/shadowmappers/CascadeShadowMapper");
exports.CascadeShadowMapper = CascadeShadowMapper_1.CascadeShadowMapper;
var CubeMapShadowMapper_1 = require("./materials/shadowmappers/CubeMapShadowMapper");
exports.CubeMapShadowMapper = CubeMapShadowMapper_1.CubeMapShadowMapper;
var DirectionalShadowMapper_1 = require("./materials/shadowmappers/DirectionalShadowMapper");
exports.DirectionalShadowMapper = DirectionalShadowMapper_1.DirectionalShadowMapper;
var NearDirectionalShadowMapper_1 = require("./materials/shadowmappers/NearDirectionalShadowMapper");
exports.NearDirectionalShadowMapper = NearDirectionalShadowMapper_1.NearDirectionalShadowMapper;
var ShadowMapperBase_1 = require("./materials/shadowmappers/ShadowMapperBase");
exports.ShadowMapperBase = ShadowMapperBase_1.ShadowMapperBase;
var BasicMaterial_1 = require("./materials/BasicMaterial");
exports.BasicMaterial = BasicMaterial_1.BasicMaterial;
var LightSources_1 = require("./materials/LightSources");
exports.LightSources = LightSources_1.LightSources;
var MaterialBase_1 = require("./materials/MaterialBase");
exports.MaterialBase = MaterialBase_1.MaterialBase;

},{"./materials/BasicMaterial":"awayjs-display/lib/materials/BasicMaterial","./materials/LightSources":"awayjs-display/lib/materials/LightSources","./materials/MaterialBase":"awayjs-display/lib/materials/MaterialBase","./materials/lightpickers/LightPickerBase":"awayjs-display/lib/materials/lightpickers/LightPickerBase","./materials/lightpickers/StaticLightPicker":"awayjs-display/lib/materials/lightpickers/StaticLightPicker","./materials/shadowmappers/CascadeShadowMapper":"awayjs-display/lib/materials/shadowmappers/CascadeShadowMapper","./materials/shadowmappers/CubeMapShadowMapper":"awayjs-display/lib/materials/shadowmappers/CubeMapShadowMapper","./materials/shadowmappers/DirectionalShadowMapper":"awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper","./materials/shadowmappers/NearDirectionalShadowMapper":"awayjs-display/lib/materials/shadowmappers/NearDirectionalShadowMapper","./materials/shadowmappers/ShadowMapperBase":"awayjs-display/lib/materials/shadowmappers/ShadowMapperBase"}],"awayjs-display/lib/partition/BasicPartition":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NodeBase_1 = require("../partition/NodeBase");
var PartitionBase_1 = require("../partition/PartitionBase");
/**
 * @class away.partition.Partition
 */
var BasicPartition = (function (_super) {
    __extends(BasicPartition, _super);
    function BasicPartition() {
        _super.call(this);
        this._rootNode = new NodeBase_1.NodeBase();
    }
    return BasicPartition;
}(PartitionBase_1.PartitionBase));
exports.BasicPartition = BasicPartition;

},{"../partition/NodeBase":"awayjs-display/lib/partition/NodeBase","../partition/PartitionBase":"awayjs-display/lib/partition/PartitionBase"}],"awayjs-display/lib/partition/CameraNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EntityNode_1 = require("../partition/EntityNode");
/**
 * @class away.partition.CameraNode
 */
var CameraNode = (function (_super) {
    __extends(CameraNode, _super);
    function CameraNode() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritDoc
     */
    CameraNode.prototype.acceptTraverser = function (traverser) {
        // todo: dead end for now, if it has a debug sprite, then sure accept that
    };
    return CameraNode;
}(EntityNode_1.EntityNode));
exports.CameraNode = CameraNode;

},{"../partition/EntityNode":"awayjs-display/lib/partition/EntityNode"}],"awayjs-display/lib/partition/DirectionalLightNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EntityNode_1 = require("../partition/EntityNode");
/**
 * @class away.partition.DirectionalLightNode
 */
var DirectionalLightNode = (function (_super) {
    __extends(DirectionalLightNode, _super);
    function DirectionalLightNode() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritDoc
     */
    DirectionalLightNode.prototype.acceptTraverser = function (traverser) {
        if (traverser.enterNode(this))
            traverser.applyDirectionalLight(this._displayObject);
    };
    /**
     *
     * @returns {boolean}
     */
    DirectionalLightNode.prototype.isCastingShadow = function () {
        return false;
    };
    return DirectionalLightNode;
}(EntityNode_1.EntityNode));
exports.DirectionalLightNode = DirectionalLightNode;

},{"../partition/EntityNode":"awayjs-display/lib/partition/EntityNode"}],"awayjs-display/lib/partition/DisplayObjectNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractionBase_1 = require("awayjs-core/lib/library/AbstractionBase");
var AxisAlignedBoundingBox_1 = require("../bounds/AxisAlignedBoundingBox");
var BoundingSphere_1 = require("../bounds/BoundingSphere");
var BoundsType_1 = require("../bounds/BoundsType");
var NullBounds_1 = require("../bounds/NullBounds");
var DisplayObjectEvent_1 = require("../events/DisplayObjectEvent");
/**
 * @class away.partition.EntityNode
 */
var DisplayObjectNode = (function (_super) {
    __extends(DisplayObjectNode, _super);
    function DisplayObjectNode(displayObject, pool) {
        var _this = this;
        _super.call(this, displayObject, pool);
        this.numEntities = 0;
        this.isSceneGraphNode = false;
        this._boundsDirty = true;
        this._onInvalidatePartitionBoundsDelegate = function (event) { return _this._onInvalidatePartitionBounds(event); };
        this._displayObject = displayObject;
        this._displayObject.addEventListener(DisplayObjectEvent_1.DisplayObjectEvent.INVALIDATE_PARTITION_BOUNDS, this._onInvalidatePartitionBoundsDelegate);
        this._boundsType = this._displayObject.boundsType;
    }
    Object.defineProperty(DisplayObjectNode.prototype, "debugVisible", {
        get: function () {
            return this._displayObject.debugVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObjectNode.prototype, "bounds", {
        /**
         * @internal
         */
        get: function () {
            if (this._boundsDirty)
                this._updateBounds();
            return this._bounds;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @returns {boolean}
     */
    DisplayObjectNode.prototype.isCastingShadow = function () {
        return this._displayObject.castsShadows;
    };
    /**
     *
     * @returns {boolean}
     */
    DisplayObjectNode.prototype.isMask = function () {
        return this._displayObject.maskMode;
    };
    DisplayObjectNode.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._displayObject.removeEventListener(DisplayObjectEvent_1.DisplayObjectEvent.INVALIDATE_PARTITION_BOUNDS, this._onInvalidatePartitionBoundsDelegate);
        this._displayObject = null;
        if (this._bounds)
            this._bounds.dispose();
        this._bounds = null;
    };
    DisplayObjectNode.prototype.onInvalidate = function (event) {
        _super.prototype.onInvalidate.call(this, event);
        if (this._boundsType != this._displayObject.boundsType) {
            this._boundsType = this._displayObject.boundsType;
            this._boundsDirty = true;
        }
    };
    /**
     *
     * @param planes
     * @param numPlanes
     * @returns {boolean}
     */
    DisplayObjectNode.prototype.isInFrustum = function (planes, numPlanes) {
        return true;
    };
    /**
     * @inheritDoc
     */
    DisplayObjectNode.prototype.isIntersectingRay = function (rayPosition, rayDirection) {
        return true;
    };
    /**
     *
     * @returns {boolean}
     */
    DisplayObjectNode.prototype.isRenderable = function () {
        return true;
    };
    /**
     * @inheritDoc
     */
    DisplayObjectNode.prototype.acceptTraverser = function (traverser) {
        // do nothing here
    };
    DisplayObjectNode.prototype._onInvalidatePartitionBounds = function (event) {
        // do nothing here
    };
    DisplayObjectNode.prototype._updateBounds = function () {
        if (this._bounds)
            this._bounds.dispose();
        if (this._boundsType == BoundsType_1.BoundsType.AXIS_ALIGNED_BOX)
            this._bounds = new AxisAlignedBoundingBox_1.AxisAlignedBoundingBox(this._displayObject);
        else if (this._boundsType == BoundsType_1.BoundsType.SPHERE)
            this._bounds = new BoundingSphere_1.BoundingSphere(this._displayObject);
        else if (this._boundsType == BoundsType_1.BoundsType.NULL)
            this._bounds = new NullBounds_1.NullBounds();
        this._boundsDirty = false;
    };
    return DisplayObjectNode;
}(AbstractionBase_1.AbstractionBase));
exports.DisplayObjectNode = DisplayObjectNode;

},{"../bounds/AxisAlignedBoundingBox":"awayjs-display/lib/bounds/AxisAlignedBoundingBox","../bounds/BoundingSphere":"awayjs-display/lib/bounds/BoundingSphere","../bounds/BoundsType":"awayjs-display/lib/bounds/BoundsType","../bounds/NullBounds":"awayjs-display/lib/bounds/NullBounds","../events/DisplayObjectEvent":"awayjs-display/lib/events/DisplayObjectEvent","awayjs-core/lib/library/AbstractionBase":undefined}],"awayjs-display/lib/partition/EntityNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var DisplayObjectNode_1 = require("../partition/DisplayObjectNode");
/**
 * @class away.partition.EntityNode
 */
var EntityNode = (function (_super) {
    __extends(EntityNode, _super);
    function EntityNode(displayObject, partition) {
        _super.call(this, displayObject, partition);
        this.numEntities = 1;
        this._maskPosition = new Vector3D_1.Vector3D();
        this._partition = partition;
    }
    EntityNode.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._partition = null;
    };
    /**
     *
     * @param planes
     * @param numPlanes
     * @returns {boolean}
     */
    EntityNode.prototype.isInFrustum = function (planes, numPlanes) {
        if (!this._displayObject._iIsVisible())
            return false;
        return true; // todo: hack for 2d. attention. might break stuff in 3d.
        //return this._bounds.isInFrustum(planes, numPlanes);
    };
    /**
     * @inheritDoc
     */
    EntityNode.prototype.isIntersectingRay = function (globalRayPosition, globalRayDirection) {
        if (!this._displayObject._iIsVisible() || !this.isIntersectingMasks(globalRayPosition, globalRayDirection, this._displayObject._iAssignedMasks()))
            return false;
        var pickingCollision = this._displayObject._iPickingCollision;
        pickingCollision.rayPosition = this._displayObject.inverseSceneTransform.transformVector(globalRayPosition);
        pickingCollision.rayDirection = this._displayObject.inverseSceneTransform.deltaTransformVector(globalRayDirection);
        if (!pickingCollision.normal)
            pickingCollision.normal = new Vector3D_1.Vector3D();
        var rayEntryDistance = this.bounds.rayIntersection(pickingCollision.rayPosition, pickingCollision.rayDirection, pickingCollision.normal);
        if (rayEntryDistance < 0)
            return false;
        pickingCollision.rayEntryDistance = rayEntryDistance;
        pickingCollision.globalRayPosition = globalRayPosition;
        pickingCollision.globalRayDirection = globalRayDirection;
        pickingCollision.rayOriginIsInsideBounds = rayEntryDistance == 0;
        return true;
    };
    /**
     *
     * @returns {boolean}
     */
    EntityNode.prototype.isRenderable = function () {
        return this._displayObject._iAssignedColorTransform()._isRenderable();
    };
    /**
     * @inheritDoc
     */
    EntityNode.prototype.acceptTraverser = function (traverser) {
        if (traverser.enterNode(this))
            traverser.applyEntity(this._displayObject);
    };
    EntityNode.prototype._onInvalidatePartitionBounds = function (event) {
        this.bounds.invalidate();
        this._partition.iMarkForUpdate(this);
    };
    EntityNode.prototype.isIntersectingMasks = function (globalRayPosition, globalRayDirection, masks) {
        //horrible hack for 2d masks
        if (masks != null) {
            this._maskPosition.x = globalRayPosition.x + globalRayDirection.x * 1000;
            this._maskPosition.y = globalRayPosition.y + globalRayDirection.y * 1000;
            var numLayers = masks.length;
            var children;
            var numChildren;
            var layerHit;
            for (var i = 0; i < numLayers; i++) {
                children = masks[i];
                numChildren = children.length;
                layerHit = false;
                for (var j = 0; j < numChildren; j++) {
                    if (children[j].hitTestPoint(this._maskPosition.x, this._maskPosition.y, true, true)) {
                        layerHit = true;
                        break;
                    }
                }
                if (!layerHit)
                    return false;
            }
        }
        return true;
    };
    return EntityNode;
}(DisplayObjectNode_1.DisplayObjectNode));
exports.EntityNode = EntityNode;

},{"../partition/DisplayObjectNode":"awayjs-display/lib/partition/DisplayObjectNode","awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/partition/IContainerNode":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/partition/IDisplayObjectNode":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/partition/IEntityNodeClass":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/partition/INode":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/partition/LightProbeNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EntityNode_1 = require("../partition/EntityNode");
/**
 * @class away.partition.LightProbeNode
 */
var LightProbeNode = (function (_super) {
    __extends(LightProbeNode, _super);
    function LightProbeNode() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritDoc
     */
    LightProbeNode.prototype.acceptTraverser = function (traverser) {
        if (traverser.enterNode(this))
            traverser.applyLightProbe(this._displayObject);
    };
    /**
     *
     * @returns {boolean}
     */
    LightProbeNode.prototype.isCastingShadow = function () {
        return false;
    };
    return LightProbeNode;
}(EntityNode_1.EntityNode));
exports.LightProbeNode = LightProbeNode;

},{"../partition/EntityNode":"awayjs-display/lib/partition/EntityNode"}],"awayjs-display/lib/partition/NodeBase":[function(require,module,exports){
"use strict";
var NullBounds_1 = require("../bounds/NullBounds");
/**
 * @class away.partition.NodeBase
 */
var NodeBase = (function () {
    /**
     *
     */
    function NodeBase() {
        this._bounds = new NullBounds_1.NullBounds();
        this._pChildNodes = new Array();
        this._pNumChildNodes = 0;
        this.numEntities = 0;
    }
    Object.defineProperty(NodeBase.prototype, "debugVisible", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeBase.prototype, "bounds", {
        /**
         * @internal
         */
        get: function () {
            return this._bounds; //TODO
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param planes
     * @param numPlanes
     * @returns {boolean}
     * @internal
     */
    NodeBase.prototype.isInFrustum = function (planes, numPlanes) {
        return true;
    };
    /**
     *
     * @param rayPosition
     * @param rayDirection
     * @returns {boolean}
     */
    NodeBase.prototype.isIntersectingRay = function (rayPosition, rayDirection) {
        return true;
    };
    /**
     *
     * @returns {boolean}
     */
    NodeBase.prototype.isRenderable = function () {
        return true;
    };
    /**
     *
     * @returns {boolean}
     */
    NodeBase.prototype.isCastingShadow = function () {
        return true;
    };
    /**
     *
     * @returns {boolean}
     */
    NodeBase.prototype.isMask = function () {
        return false;
    };
    NodeBase.prototype.dispose = function () {
        this.parent = null;
        this._pChildNodes = null;
    };
    /**
     *
     * @param traverser
     */
    NodeBase.prototype.acceptTraverser = function (traverser) {
        if (this.numEntities == 0)
            return;
        if (traverser.enterNode(this)) {
            for (var i = 0; i < this._pNumChildNodes; i++)
                this._pChildNodes[i].acceptTraverser(traverser);
        }
    };
    /**
     *
     * @param node
     * @internal
     */
    NodeBase.prototype.iAddNode = function (node) {
        node.parent = this;
        this.numEntities += node.numEntities;
        this._pChildNodes[this._pNumChildNodes++] = node;
        var numEntities = node.numEntities;
        node = this;
        do {
            node.numEntities += numEntities;
        } while ((node = node.parent) != null);
    };
    /**
     *
     * @param node
     * @internal
     */
    NodeBase.prototype.iRemoveNode = function (node) {
        var index = this._pChildNodes.indexOf(node);
        this._pChildNodes[index] = this._pChildNodes[--this._pNumChildNodes];
        this._pChildNodes.pop();
        var numEntities = node.numEntities;
        node = this;
        do {
            node.numEntities -= numEntities;
        } while ((node = node.parent) != null);
    };
    return NodeBase;
}());
exports.NodeBase = NodeBase;

},{"../bounds/NullBounds":"awayjs-display/lib/bounds/NullBounds"}],"awayjs-display/lib/partition/PartitionBase":[function(require,module,exports){
"use strict";
/**
 * @class away.partition.Partition
 */
var PartitionBase = (function () {
    function PartitionBase() {
        this._abstractionPool = new Object();
        this._updatesMade = false;
    }
    PartitionBase.prototype.getAbstraction = function (displayObject) {
        return (this._abstractionPool[displayObject.id] || (this._abstractionPool[displayObject.id] = new PartitionBase._abstractionClassPool[displayObject.assetType](displayObject, this)));
    };
    /**
     *
     * @param image
     */
    PartitionBase.prototype.clearAbstraction = function (displayObject) {
        this._abstractionPool[displayObject.id] = null;
    };
    PartitionBase.prototype.traverse = function (traverser) {
        if (this._updatesMade)
            this.updateEntities();
        if (this._rootNode) {
            this._rootNode.acceptTraverser(traverser);
        }
    };
    PartitionBase.prototype.iMarkForUpdate = function (node) {
        var t = this._updateQueue;
        while (t) {
            if (node == t)
                return;
            t = t._iUpdateQueueNext;
        }
        node._iUpdateQueueNext = this._updateQueue;
        this._updateQueue = node;
        this._updatesMade = true;
    };
    PartitionBase.prototype.iRemoveEntity = function (node) {
        var t;
        if (node.parent) {
            node.parent.iRemoveNode(node);
            node.parent = null;
        }
        if (node == this._updateQueue) {
            this._updateQueue = node._iUpdateQueueNext;
        }
        else {
            t = this._updateQueue;
            while (t && t._iUpdateQueueNext != node)
                t = t._iUpdateQueueNext;
            if (t)
                t._iUpdateQueueNext = node._iUpdateQueueNext;
        }
        node._iUpdateQueueNext = null;
        if (!this._updateQueue)
            this._updatesMade = false;
    };
    /**
     *
     * @param entity
     * @returns {away.partition.NodeBase}
     */
    PartitionBase.prototype.findParentForNode = function (node) {
        return this._rootNode;
    };
    PartitionBase.prototype.updateEntities = function () {
        var node = this._updateQueue;
        while (node) {
            //required for controllers with autoUpdate set to true and queued events
            node._displayObject._iInternalUpdate();
            node = node._iUpdateQueueNext;
        }
        //reset head
        node = this._updateQueue;
        var targetNode;
        var t;
        this._updateQueue = null;
        this._updatesMade = false;
        do {
            targetNode = this.findParentForNode(node);
            if (node.parent != targetNode) {
                if (node.parent)
                    node.parent.iRemoveNode(node);
                targetNode.iAddNode(node);
            }
            t = node._iUpdateQueueNext;
            node._iUpdateQueueNext = null;
        } while ((node = t) != null);
    };
    /**
     * @internal
     */
    PartitionBase.prototype._iRegisterEntity = function (displayObject) {
        if (displayObject.isEntity)
            this.iMarkForUpdate(this.getAbstraction(displayObject));
    };
    /**
     * @internal
     */
    PartitionBase.prototype._iUnregisterEntity = function (displayObject) {
        if (displayObject.isEntity)
            this.iRemoveEntity(this.getAbstraction(displayObject));
    };
    /**
     *
     * @param imageObjectClass
     */
    PartitionBase.registerAbstraction = function (entityNodeClass, assetClass) {
        PartitionBase._abstractionClassPool[assetClass.assetType] = entityNodeClass;
    };
    PartitionBase._abstractionClassPool = new Object();
    return PartitionBase;
}());
exports.PartitionBase = PartitionBase;

},{}],"awayjs-display/lib/partition/PointLightNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EntityNode_1 = require("../partition/EntityNode");
/**
 * @class away.partition.PointLightNode
 */
var PointLightNode = (function (_super) {
    __extends(PointLightNode, _super);
    function PointLightNode() {
        _super.apply(this, arguments);
    }
    /**
     * @inheritDoc
     */
    PointLightNode.prototype.acceptTraverser = function (traverser) {
        if (traverser.enterNode(this))
            traverser.applyPointLight(this._displayObject);
    };
    /**
     *
     * @returns {boolean}
     */
    PointLightNode.prototype.isCastingShadow = function () {
        return false;
    };
    return PointLightNode;
}(EntityNode_1.EntityNode));
exports.PointLightNode = PointLightNode;

},{"../partition/EntityNode":"awayjs-display/lib/partition/EntityNode"}],"awayjs-display/lib/partition/SceneGraphNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectNode_1 = require("../partition/DisplayObjectNode");
/**
 * Maintains scenegraph heirarchy when collecting nodes
 */
var SceneGraphNode = (function (_super) {
    __extends(SceneGraphNode, _super);
    function SceneGraphNode() {
        _super.apply(this, arguments);
        this.isSceneGraphNode = true;
        this._pChildNodes = new Array();
        this._childDepths = new Array();
        this._childMasks = new Array();
    }
    /**
     *
     * @param traverser
     */
    SceneGraphNode.prototype.acceptTraverser = function (traverser) {
        //containers nodes are for ordering only, no need to check enterNode or debugVisible
        if (this.numEntities == 0)
            return;
        var i;
        for (i = 0; i < this._pChildNodes.length; i++)
            this._pChildNodes[i].acceptTraverser(traverser);
        for (i = 0; i < this._childMasks.length; i++)
            this._childMasks[i].acceptTraverser(traverser);
    };
    /**
     *
     * @param node
     * @internal
     */
    SceneGraphNode.prototype.iAddNode = function (node) {
        node.parent = this;
        if (node._displayObject.maskMode) {
            this._childMasks.push(node);
        }
        else {
            var depth = node._displayObject._depthID;
            var len = this._childDepths.length;
            var index = len;
            while (index--)
                if (this._childDepths[index] < depth)
                    break;
            index++;
            if (index < len) {
                this._pChildNodes.splice(index, 0, node);
                this._childDepths.splice(index, 0, depth);
            }
            else {
                this._pChildNodes.push(node);
                this._childDepths.push(depth);
            }
        }
        var numEntities = node.isSceneGraphNode ? node.numEntities : 1;
        node = this;
        do {
            node.numEntities += numEntities;
        } while ((node = node.parent) != null);
    };
    /**
     *
     * @param node
     * @internal
     */
    SceneGraphNode.prototype.iRemoveNode = function (node) {
        if (node._displayObject.maskMode) {
            this._childMasks.splice(this._childMasks.indexOf(node), 1);
        }
        else {
            var index = this._pChildNodes.indexOf(node);
            this._pChildNodes.splice(index, 1);
            this._childDepths.splice(index, 1);
        }
        var numEntities = node.numEntities;
        node = this;
        do {
            node.numEntities -= numEntities;
        } while ((node = node.parent) != null);
    };
    return SceneGraphNode;
}(DisplayObjectNode_1.DisplayObjectNode));
exports.SceneGraphNode = SceneGraphNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SceneGraphNode;

},{"../partition/DisplayObjectNode":"awayjs-display/lib/partition/DisplayObjectNode"}],"awayjs-display/lib/partition/SceneGraphPartition":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SceneGraphNode_1 = require("../partition/SceneGraphNode");
var PartitionBase_1 = require("../partition/PartitionBase");
/**
 * @class away.partition.Partition
 */
var SceneGraphPartition = (function (_super) {
    __extends(SceneGraphPartition, _super);
    function SceneGraphPartition() {
        _super.call(this);
        this._sceneGraphNodePool = new SceneGraphNodePool();
    }
    SceneGraphPartition.prototype.traverse = function (traverser) {
        _super.prototype.traverse.call(this, traverser);
    };
    /**
     *
     * @param entity
     * @returns {away.partition.NodeBase}
     */
    SceneGraphPartition.prototype.findParentForNode = function (node) {
        if (node.isSceneGraphNode && (node._displayObject.partition == this || node._displayObject._iIsRoot)) {
            this._rootNode = node;
            return null;
        }
        if (!node.isSceneGraphNode && node._displayObject.isContainer)
            return this._sceneGraphNodePool.getAbstraction(node._displayObject);
        return this._sceneGraphNodePool.getAbstraction(node._displayObject.parent);
    };
    /**
     * @internal
     */
    SceneGraphPartition.prototype._iRegisterEntity = function (displayObject) {
        _super.prototype._iRegisterEntity.call(this, displayObject);
        if (displayObject.isContainer)
            this.iMarkForUpdate(this._sceneGraphNodePool.getAbstraction(displayObject));
    };
    /**
     * @internal
     */
    SceneGraphPartition.prototype._iUnregisterEntity = function (displayObject) {
        _super.prototype._iUnregisterEntity.call(this, displayObject);
        if (displayObject.isContainer)
            this.iRemoveEntity(this._sceneGraphNodePool.getAbstraction(displayObject));
    };
    return SceneGraphPartition;
}(PartitionBase_1.PartitionBase));
exports.SceneGraphPartition = SceneGraphPartition;
/**
 * @class away.pool.SceneGraphNodePool
 */
var SceneGraphNodePool = (function () {
    function SceneGraphNodePool() {
        this._abstractionPool = new Object();
    }
    /**
     * //TODO
     *
     * @param entity
     * @returns EntityNode
     */
    SceneGraphNodePool.prototype.getAbstraction = function (displayObjectContainer) {
        return (this._abstractionPool[displayObjectContainer.id] || (this._abstractionPool[displayObjectContainer.id] = new SceneGraphNode_1.SceneGraphNode(displayObjectContainer, this)));
    };
    /**
     * //TODO
     *
     * @param entity
     */
    SceneGraphNodePool.prototype.clearAbstraction = function (displayObjectContainer) {
        delete this._abstractionPool[displayObjectContainer.id];
    };
    return SceneGraphNodePool;
}());
exports.SceneGraphNodePool = SceneGraphNodePool;

},{"../partition/PartitionBase":"awayjs-display/lib/partition/PartitionBase","../partition/SceneGraphNode":"awayjs-display/lib/partition/SceneGraphNode"}],"awayjs-display/lib/partition/SkyboxNode":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EntityNode_1 = require("../partition/EntityNode");
/**
 * SkyboxNode is a space partitioning leaf node that contains a Skybox object.
 *
 * @class away.partition.SkyboxNode
 */
var SkyboxNode = (function (_super) {
    __extends(SkyboxNode, _super);
    function SkyboxNode() {
        _super.apply(this, arguments);
    }
    /**
     *
     * @param planes
     * @param numPlanes
     * @returns {boolean}
     */
    SkyboxNode.prototype.isInFrustum = function (planes, numPlanes) {
        if (!this._displayObject._iIsVisible)
            return false;
        //a skybox is always in view unless its visibility is set to false
        return true;
    };
    /**
     *
     * @returns {boolean}
     */
    SkyboxNode.prototype.isCastingShadow = function () {
        return false; //skybox never casts shadows
    };
    return SkyboxNode;
}(EntityNode_1.EntityNode));
exports.SkyboxNode = SkyboxNode;

},{"../partition/EntityNode":"awayjs-display/lib/partition/EntityNode"}],"awayjs-display/lib/partition":[function(require,module,exports){
"use strict";
var BasicPartition_1 = require("./partition/BasicPartition");
exports.BasicPartition = BasicPartition_1.BasicPartition;
var CameraNode_1 = require("./partition/CameraNode");
exports.CameraNode = CameraNode_1.CameraNode;
var DirectionalLightNode_1 = require("./partition/DirectionalLightNode");
exports.DirectionalLightNode = DirectionalLightNode_1.DirectionalLightNode;
var DisplayObjectNode_1 = require("./partition/DisplayObjectNode");
exports.DisplayObjectNode = DisplayObjectNode_1.DisplayObjectNode;
var EntityNode_1 = require("./partition/EntityNode");
exports.EntityNode = EntityNode_1.EntityNode;
var LightProbeNode_1 = require("./partition/LightProbeNode");
exports.LightProbeNode = LightProbeNode_1.LightProbeNode;
var NodeBase_1 = require("./partition/NodeBase");
exports.NodeBase = NodeBase_1.NodeBase;
var PartitionBase_1 = require("./partition/PartitionBase");
exports.PartitionBase = PartitionBase_1.PartitionBase;
var PointLightNode_1 = require("./partition/PointLightNode");
exports.PointLightNode = PointLightNode_1.PointLightNode;
var SceneGraphNode_1 = require("./partition/SceneGraphNode");
exports.SceneGraphNode = SceneGraphNode_1.SceneGraphNode;
var SceneGraphPartition_1 = require("./partition/SceneGraphPartition");
exports.SceneGraphPartition = SceneGraphPartition_1.SceneGraphPartition;
var SkyboxNode_1 = require("./partition/SkyboxNode");
exports.SkyboxNode = SkyboxNode_1.SkyboxNode;

},{"./partition/BasicPartition":"awayjs-display/lib/partition/BasicPartition","./partition/CameraNode":"awayjs-display/lib/partition/CameraNode","./partition/DirectionalLightNode":"awayjs-display/lib/partition/DirectionalLightNode","./partition/DisplayObjectNode":"awayjs-display/lib/partition/DisplayObjectNode","./partition/EntityNode":"awayjs-display/lib/partition/EntityNode","./partition/LightProbeNode":"awayjs-display/lib/partition/LightProbeNode","./partition/NodeBase":"awayjs-display/lib/partition/NodeBase","./partition/PartitionBase":"awayjs-display/lib/partition/PartitionBase","./partition/PointLightNode":"awayjs-display/lib/partition/PointLightNode","./partition/SceneGraphNode":"awayjs-display/lib/partition/SceneGraphNode","./partition/SceneGraphPartition":"awayjs-display/lib/partition/SceneGraphPartition","./partition/SkyboxNode":"awayjs-display/lib/partition/SkyboxNode"}],"awayjs-display/lib/pick/IPicker":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/pick/IPickingCollider":[function(require,module,exports){
"use strict";

},{}],"awayjs-display/lib/pick/JSPickingCollider":[function(require,module,exports){
"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var Point_1 = require("awayjs-core/lib/geom/Point");
/**
 * Pure JS picking collider for display objects. Used with the <code>RaycastPicker</code> picking object.
 *
 * @see away.base.DisplayObject#pickingCollider
 * @see away.pick.RaycastPicker
 *
 * @class away.pick.JSPickingCollider
 */
var JSPickingCollider = (function () {
    /**
     * Creates a new <code>JSPickingCollider</code> object.
     *
     * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
     */
    function JSPickingCollider(findClosestCollision) {
        if (findClosestCollision === void 0) { findClosestCollision = false; }
        this._findClosestCollision = findClosestCollision;
    }
    /**
     * Tests a <code>Billboard</code> object for a collision with the picking ray.
     *
     * @param billboard The billboard instance to be tested.
     * @param pickingCollision The collision object used to store the collision results
     * @param findClosest
     */
    JSPickingCollider.prototype.testBillboardCollision = function (billboard, material, pickingCollision) {
        pickingCollision.renderable = null;
        //if (this._testGraphicCollision(<RenderableBase> this._renderablePool.getItem(billboard), pickingCollision, shortestCollisionDistance)) {
        //	shortestCollisionDistance = pickingCollision.rayEntryDistance;
        //
        //	pickingCollision.renderable = billboard;
        //
        //	return true;
        //}
        return false;
    };
    /**
     * Tests a <code>TriangleElements</code> object for a collision with the picking ray.
     *
     * @param triangleElements
     * @param material
     * @param pickingCollision
     * @returns {boolean}
     */
    JSPickingCollider.prototype.testTriangleCollision = function (triangleElements, material, pickingCollision, count, offset) {
        if (offset === void 0) { offset = 0; }
        var rayPosition = pickingCollision.rayPosition;
        var rayDirection = pickingCollision.rayDirection;
        var t;
        var i0, i1, i2;
        var rx, ry, rz;
        var nx, ny, nz;
        var cx, cy, cz;
        var coeff, u, v, w;
        var p0x, p0y, p0z;
        var p1x, p1y, p1z;
        var p2x, p2y, p2z;
        var s0x, s0y, s0z;
        var s1x, s1y, s1z;
        var nl, nDotV, D, disToPlane;
        var Q1Q2, Q1Q1, Q2Q2, RQ1, RQ2;
        var collisionTriangleIndex = -1;
        var bothSides = material.bothSides;
        var positions = triangleElements.positions.get(count, offset);
        var posDim = triangleElements.positions.dimensions;
        var indices;
        if (triangleElements.indices) {
            indices = triangleElements.indices.get(triangleElements.numElements);
            count = indices.length;
        }
        for (var index = 0; index < count; index += 3) {
            // evaluate triangle indices
            if (indices) {
                i0 = indices[index] * posDim;
                i1 = indices[index + 1] * posDim;
                i2 = indices[index + 2] * posDim;
            }
            else {
                i0 = index * posDim;
                i1 = (index + 1) * posDim;
                i2 = (index + 2) * posDim;
            }
            // evaluate triangle positions
            p0x = positions[i0];
            p1x = positions[i1];
            p2x = positions[i2];
            s0x = p1x - p0x; // s0 = p1 - p0
            s1x = p2x - p0x; // s1 = p2 - p0
            p0y = positions[i0 + 1];
            p1y = positions[i1 + 1];
            p2y = positions[i2 + 1];
            s0y = p1y - p0y;
            s1y = p2y - p0y;
            if (posDim == 3) {
                p0z = positions[i0 + 2];
                p1z = positions[i1 + 2];
                p2z = positions[i2 + 2];
                s0z = p1z - p0z;
                s1z = p2z - p0z;
                // evaluate sides and triangle normal
                nx = s0y * s1z - s0z * s1y; // n = s0 x s1
                ny = s0z * s1x - s0x * s1z;
                nz = s0x * s1y - s0y * s1x;
                nl = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz); // normalize n
                nx *= nl;
                ny *= nl;
                nz *= nl;
            }
            else {
                nx = 0;
                ny = 0;
                nz = 1;
            }
            // -- plane intersection test --
            nDotV = nx * rayDirection.x + ny * +rayDirection.y + nz * rayDirection.z; // rayDirection . normal
            if ((!bothSides && nDotV < 0.0) || (bothSides && nDotV != 0.0)) {
                // find collision t
                D = -(nx * p0x + ny * p0y + nz * p0z);
                disToPlane = -(nx * rayPosition.x + ny * rayPosition.y + nz * rayPosition.z + D);
                t = disToPlane / nDotV;
                // find collision point
                cx = rayPosition.x + t * rayDirection.x;
                cy = rayPosition.y + t * rayDirection.y;
                cz = rayPosition.z + t * rayDirection.z;
                // collision point inside triangle? ( using barycentric coordinates )
                Q1Q2 = s0x * s1x + s0y * s1y + s0z * s1z;
                Q1Q1 = s0x * s0x + s0y * s0y + s0z * s0z;
                Q2Q2 = s1x * s1x + s1y * s1y + s1z * s1z;
                rx = cx - p0x;
                ry = cy - p0y;
                rz = cz - p0z;
                RQ1 = rx * s0x + ry * s0y + rz * s0z;
                RQ2 = rx * s1x + ry * s1y + rz * s1z;
                coeff = 1 / (Q1Q1 * Q2Q2 - Q1Q2 * Q1Q2);
                v = coeff * (Q2Q2 * RQ1 - Q1Q2 * RQ2);
                w = coeff * (-Q1Q2 * RQ1 + Q1Q1 * RQ2);
                if (v < 0)
                    continue;
                if (w < 0)
                    continue;
                u = 1 - v - w;
                if (!(u < 0) && t > 0 && t < pickingCollision.rayEntryDistance) {
                    collisionTriangleIndex = index / 3;
                    pickingCollision.rayEntryDistance = t;
                    pickingCollision.position = new Vector3D_1.Vector3D(cx, cy, cz);
                    pickingCollision.normal = new Vector3D_1.Vector3D(nx, ny, nz);
                    if (triangleElements.uvs) {
                        var uvs = triangleElements.uvs.get(triangleElements.numVertices);
                        var uvDim = triangleElements.uvs.dimensions;
                        var uIndex = indices[index] * uvDim;
                        var uv0 = new Vector3D_1.Vector3D(uvs[uIndex], uvs[uIndex + 1]);
                        uIndex = indices[index + 1] * uvDim;
                        var uv1 = new Vector3D_1.Vector3D(uvs[uIndex], uvs[uIndex + 1]);
                        uIndex = indices[index + 2] * uvDim;
                        var uv2 = new Vector3D_1.Vector3D(uvs[uIndex], uvs[uIndex + 1]);
                        pickingCollision.uv = new Point_1.Point(u * uv0.x + v * uv1.x + w * uv2.x, u * uv0.y + v * uv1.y + w * uv2.y);
                    }
                    pickingCollision.elementIndex = collisionTriangleIndex;
                    // if not looking for best hit, first found will do...
                    if (!this._findClosestCollision)
                        return true;
                }
            }
        }
        if (collisionTriangleIndex >= 0)
            return true;
        return false;
    };
    //
    ///**
    // * Tests a <code>CurveElements</code> object for a collision with the picking ray.
    // *
    // * @param triangleElements
    // * @param material
    // * @param pickingCollision
    // * @returns {boolean}
    // */
    //public testCurveCollision(curveElements:CurveElements, material:MaterialBase, pickingCollision:PickingCollision, shortestCollisionDistance:number):boolean
    //{
    //	var rayPosition:Vector3D = pickingCollision.localRayPosition;
    //	var rayDirection:Vector3D = pickingCollision.localRayDirection;
    //
    //	//project ray onto x/y plane to generate useful test points from mouse coordinates
    //	//this will only work while all points lie on the x/y plane
    //	var plane:Vector3D = new Vector3D(0,0,-1,0);
    //
    //	var result:Vector3D = new Vector3D();
    //	var distance:number = plane.x * rayPosition.x + plane.y * rayPosition.y + plane.z * rayPosition.z + plane.w;//distance(position);
    //	result.x = rayPosition.x - ( plane.x*distance);
    //	result.y = rayPosition.y - ( plane.y*distance);
    //	result.z = rayPosition.z - ( plane.z*distance);
    //	var normal:Vector3D = new Vector3D(plane.x,plane.y,plane.z);
    //	var t:number = -(rayPosition.dotProduct(normal))/(rayDirection.dotProduct(normal));
    //	rayDirection.scaleBy(t);
    //	var p:Vector3D = rayPosition.add(rayDirection);
    //
    //	var indices:Uint16Array = curveElements.indices.get(curveElements.numElements);
    //	var collisionCurveIndex:number = -1;
    //	var bothSides:boolean = material.bothSides;
    //
    //
    //	var positions:Float32Array = curveElements.positions.get(curveElements.numVertices);
    //	var posDim:number = curveElements.positions.dimensions;
    //	var curves:Float32Array = curveElements.curves.get(curveElements.numVertices);
    //	var curveDim:number = curveElements.curves.dimensions;
    //	var uvs:ArrayBufferView = curveElements.uvs.get(curveElements.numVertices);
    //	var uvDim:number = curveElements.uvs.dimensions;
    //	var numIndices:number = indices.length;
    //
    //
    //	for(var index:number = 0; index < numIndices; index+=3)
    //	{
    //		var id0:number = indices[index];
    //		var id1:number = indices[index + 1] * posDim;
    //		var id2:number = indices[index + 2] * posDim;
    //
    //		var ax:number = positions[id0 * posDim];
    //		var ay:number = positions[id0 * posDim + 1];
    //		var bx:number = positions[id1];
    //		var by:number = positions[id1 + 1];
    //		var cx:number = positions[id2];
    //		var cy:number = positions[id2 + 1];
    //
    //		var curvex:number = curves[id0 * curveDim];
    //		var az:number = positions[id0 * posDim + 2];
    //
    //		//console.log(ax, ay, bx, by, cx, cy);
    //
    //		//from a to p
    //		var dx:number = ax - p.x;
    //		var dy:number = ay - p.y;
    //
    //		//edge normal (a-b)
    //		var nx:number = by - ay;
    //		var ny:number = -(bx - ax);
    //
    //		//console.log(ax,ay,bx,by,cx,cy);
    //
    //		var dot:number = (dx * nx) + (dy * ny);
    //		//console.log("dot a",dot);
    //		if (dot > 0)
    //			continue;
    //
    //		dx = bx - p.x;
    //		dy = by - p.y;
    //		nx = cy - by;
    //		ny = -(cx - bx);
    //
    //		dot = (dx * nx) + (dy * ny);
    //		//console.log("dot b",dot);
    //		if (dot > 0)
    //			continue;
    //
    //		dx = cx - p.x;
    //		dy = cy - p.y;
    //		nx = ay - cy;
    //		ny = -(ax - cx);
    //
    //		dot = (dx * nx) + (dy * ny);
    //		//console.log("dot c",dot);
    //		if (dot > 0)
    //			continue;
    //
    //		//check if not solid
    //		if (curvex != 2) {
    //
    //			var v0x:number = bx - ax;
    //			var v0y:number = by - ay;
    //			var v1x:number = cx - ax;
    //			var v1y:number = cy - ay;
    //			var v2x:number = p.x - ax;
    //			var v2y:number = p.y - ay;
    //
    //			var den:number = v0x * v1y - v1x * v0y;
    //			var v:number = (v2x * v1y - v1x * v2y) / den;
    //			var w:number = (v0x * v2y - v2x * v0y) / den;
    //			var u:number = 1 - v - w;
    //
    //			var uu:number = 0.5 * v + w;// (0 * u) + (0.5 * v) + (1 * w);// (lerp(0, 0.5, v) + lerp(0.5, 1, w) + lerp(1, 0, u)) / 1.5;
    //			var vv:number = w;// (0 * u) + (0 * v) + (1 * w);// (lerp(0, 1, w) + lerp(1, 0, u)) / 1;
    //
    //			var d:number = uu * uu - vv;
    //
    //			if ((d > 0 && az == -1) || (d < 0 && az == 1))
    //				continue;
    //		}
    //		//TODO optimize away this pointless check as the distance is always the same
    //		//also this stuff should only be calculated right before the return and not for each hit
    //		if (distance < shortestCollisionDistance) {
    //			shortestCollisionDistance = distance;
    //			collisionCurveIndex = index/3;
    //			pickingCollision.rayEntryDistance = distance;
    //			pickingCollision.localPosition = p;
    //			pickingCollision.localNormal = new Vector3D(0, 0, 1);
    //			pickingCollision.uv = this._getCollisionUV(indices, uvs, index, v, w, u, uvDim);
    //			pickingCollision.index = index;
    //			//						pickingCollision.elementIndex = this.pGetSpriteGraphicIndex(renderable);
    //
    //			// if not looking for best hit, first found will do...
    //			if (!this._findClosestCollision)
    //				return true;
    //		}
    //	}
    //
    //	if (collisionCurveIndex >= 0)
    //		return true;
    //
    //	return false;
    //}
    /**
     * Tests a <code>LineElements</code> object for a collision with the picking ray.
     *
     * @param triangleElements
     * @param material
     * @param pickingCollision
     * @returns {boolean}
     */
    JSPickingCollider.prototype.testLineCollision = function (lineElements, material, pickingCollision, count, offset) {
        if (offset === void 0) { offset = 0; }
        return false;
    };
    return JSPickingCollider;
}());
exports.JSPickingCollider = JSPickingCollider;

},{"awayjs-core/lib/geom/Point":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/pick/PickingCollision":[function(require,module,exports){
"use strict";
/**
 * Value object for a picking collision returned by a picking collider. Created as unique objects on display objects
 *
 * @see away.base.DisplayObject#pickingCollision
 * @see away.core.pick.IPickingCollider
 *
 * @class away.pick.PickingCollision
 */
var PickingCollision = (function () {
    /**
     * Creates a new <code>PickingCollision</code> object.
     *
     * @param entity The entity to which this collision object belongs.
     */
    function PickingCollision(entity) {
        this.entity = entity;
    }
    return PickingCollision;
}());
exports.PickingCollision = PickingCollision;

},{}],"awayjs-display/lib/pick/RaycastPicker":[function(require,module,exports){
"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
/**
 * Picks a 3d object from a view or scene by 3D raycast calculations.
 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
 * then triggers an optional picking collider on individual renderable objects to further determine the precise values of the picking ray collision.
 *
 * @class away.pick.RaycastPicker
 */
var RaycastPicker = (function () {
    /**
     * Creates a new <code>RaycastPicker</code> object.
     *
     * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
     * or simply returns the first collision encountered. Defaults to false.
     */
    function RaycastPicker(findClosestCollision) {
        if (findClosestCollision === void 0) { findClosestCollision = false; }
        this._entities = new Array();
        /**
         * @inheritDoc
         */
        this.onlyMouseEnabled = true;
        this._findClosestCollision = findClosestCollision;
    }
    /**
     * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
     *
     * @param node The Partition3DNode object to frustum-test.
     */
    RaycastPicker.prototype.enterNode = function (node) {
        return node.isIntersectingRay(this._rayPosition, this._rayDirection) && !node.isMask();
    };
    /**
     * @inheritDoc
     */
    RaycastPicker.prototype.getViewCollision = function (x, y, view) {
        this._x = x;
        this._y = y;
        this._view = view;
        //update ray
        var rayPosition = view.unproject(x, y, 0);
        var rayDirection = view.unproject(x, y, 1).subtract(rayPosition);
        return this.getSceneCollision(rayPosition, rayDirection, view.scene);
    };
    /**
     * @inheritDoc
     */
    RaycastPicker.prototype.getSceneCollision = function (rayPosition, rayDirection, scene) {
        this._rayPosition = rayPosition;
        this._rayDirection = rayDirection;
        // collect entities to test
        scene.traversePartitions(this);
        //early out if no collisions detected
        if (!this._entities.length)
            return null;
        var collision = this.getPickingCollision();
        //discard entities
        this._entities.length = 0;
        return collision;
    };
    //		public getEntityCollision(position:Vector3D, direction:Vector3D, entities:Array<IEntity>):PickingCollision
    //		{
    //			this._numRenderables = 0;
    //
    //			var renderable:IEntity;
    //			var l:number = entities.length;
    //
    //			for (var c:number = 0; c < l; c++) {
    //				renderable = entities[c];
    //
    //				if (renderable.isIntersectingRay(position, direction))
    //					this._renderables[this._numRenderables++] = renderable;
    //			}
    //
    //			return this.getPickingCollision(this._raycastCollector);
    //		}
    RaycastPicker.prototype.setIgnoreList = function (entities) {
        this._ignoredEntities = entities;
    };
    RaycastPicker.prototype.isIgnored = function (entity) {
        if (this.onlyMouseEnabled && !entity._iIsMouseEnabled())
            return true;
        if (this._ignoredEntities) {
            var len = this._ignoredEntities.length;
            for (var i = 0; i < len; i++)
                if (this._ignoredEntities[i] == entity)
                    return true;
        }
        return false;
    };
    RaycastPicker.prototype.sortOnNearT = function (entity1, entity2) {
        return entity2._iPickingCollision.rayEntryDistance - entity1._iPickingCollision.rayEntryDistance;
    };
    RaycastPicker.prototype.getPickingCollision = function () {
        // Sort entities from closest to furthest to reduce tests.
        this._entities = this._entities.sort(this.sortOnNearT); // TODO - test sort filter in JS
        // ---------------------------------------------------------------------
        // Evaluate triangle collisions when needed.
        // Replaces collision data provided by bounds collider with more precise data.
        // ---------------------------------------------------------------------
        this._bestCollision = null;
        var entity;
        var len = this._entities.length;
        for (var i = len - 1; i >= 0; i--) {
            entity = this._entities[i];
            this._testCollision = entity._iPickingCollision;
            if (this._bestCollision == null || this._testCollision.rayEntryDistance < this._bestCollision.rayEntryDistance) {
                this._testCollider = entity.pickingCollider;
                if (this._testCollider) {
                    this._testCollision.rayEntryDistance = Number.MAX_VALUE;
                    entity._acceptTraverser(this);
                    // If a collision exists, update the collision data and stop all checks.
                    if (this._bestCollision && !this._findClosestCollision)
                        break;
                }
                else if (!this._testCollision.rayOriginIsInsideBounds) {
                    // A bounds collision with no picking collider stops all checks.
                    // Note: a bounds collision with a ray origin inside its bounds is ONLY ever used
                    // to enable the detection of a corresponsding triangle collision.
                    // Therefore, bounds collisions with a ray origin inside its bounds can be ignored
                    // if it has been established that there is NO triangle collider to test
                    this._bestCollision = this._testCollision;
                    break;
                }
            }
        }
        if (this._bestCollision)
            this.updatePosition(this._bestCollision);
        return this._bestCollision;
    };
    RaycastPicker.prototype.updatePosition = function (pickingCollision) {
        var collisionPos = pickingCollision.position || (pickingCollision.position = new Vector3D_1.Vector3D());
        var rayDir = pickingCollision.rayDirection;
        var rayPos = pickingCollision.rayPosition;
        var t = pickingCollision.rayEntryDistance;
        collisionPos.x = rayPos.x + t * rayDir.x;
        collisionPos.y = rayPos.y + t * rayDir.y;
        collisionPos.z = rayPos.z + t * rayDir.z;
    };
    RaycastPicker.prototype.dispose = function () {
        //TODO
    };
    /**
     *
     * @param entity
     */
    RaycastPicker.prototype.applyEntity = function (entity) {
        if (!this.isIgnored(entity))
            this._entities.push(entity);
    };
    /**
     *
     * @param entity
     */
    RaycastPicker.prototype.applyRenderable = function (renderable) {
        if (renderable._iTestCollision(this._testCollision, this._testCollider))
            this._bestCollision = this._testCollision;
    };
    /**
     *
     * @param entity
     */
    RaycastPicker.prototype.applyDirectionalLight = function (entity) {
        //don't do anything here
    };
    /**
     *
     * @param entity
     */
    RaycastPicker.prototype.applyLightProbe = function (entity) {
        //don't do anything here
    };
    /**
     *
     * @param entity
     */
    RaycastPicker.prototype.applyPointLight = function (entity) {
        //don't do anything here
    };
    /**
     *
     * @param entity
     */
    RaycastPicker.prototype.applySkybox = function (entity) {
        //don't do anything here
    };
    return RaycastPicker;
}());
exports.RaycastPicker = RaycastPicker;

},{"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/pick":[function(require,module,exports){
"use strict";
var JSPickingCollider_1 = require("./pick/JSPickingCollider");
exports.JSPickingCollider = JSPickingCollider_1.JSPickingCollider;
var PickingCollision_1 = require("./pick/PickingCollision");
exports.PickingCollision = PickingCollision_1.PickingCollision;
var RaycastPicker_1 = require("./pick/RaycastPicker");
exports.RaycastPicker = RaycastPicker_1.RaycastPicker;

},{"./pick/JSPickingCollider":"awayjs-display/lib/pick/JSPickingCollider","./pick/PickingCollision":"awayjs-display/lib/pick/PickingCollision","./pick/RaycastPicker":"awayjs-display/lib/pick/RaycastPicker"}],"awayjs-display/lib/prefabs/PrefabBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
/**
 * PrefabBase is an abstract base class for prefabs, which are prebuilt display objects that allow easy cloning and updating
 */
var PrefabBase = (function (_super) {
    __extends(PrefabBase, _super);
    //		public _pBatchObjects:Array<BatchObject> = new Array<BatchObject>();
    /**
     * Creates a new PrefabBase object.
     */
    function PrefabBase() {
        _super.call(this);
        this._pObjects = new Array();
    }
    /**
     * Returns a display object generated from this prefab
     */
    PrefabBase.prototype.getNewObject = function () {
        var object = this._pCreateObject();
        this._pObjects.push(object);
        return object;
    };
    //		public getNewBatchObject():BatchObject
    //		{
    //			var object:BatchObject = this._pCreateBatchObject();
    //
    //			this._pBatchObjects.push(object);
    //
    //			return object;
    //		}
    PrefabBase.prototype._pCreateObject = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    PrefabBase.prototype._iValidate = function () {
        // To be overridden when necessary
    };
    return PrefabBase;
}(AssetBase_1.AssetBase));
exports.PrefabBase = PrefabBase;

},{"awayjs-core/lib/errors/AbstractMethodError":undefined,"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/prefabs/PrimitiveCapsulePrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsType_1 = require("../graphics/ElementsType");
var PrimitivePrefabBase_1 = require("../prefabs/PrimitivePrefabBase");
/**
 * A Capsule primitive sprite.
 */
var PrimitiveCapsulePrefab = (function (_super) {
    __extends(PrimitiveCapsulePrefab, _super);
    /**
     * Creates a new Capsule object.
     * @param radius The radius of the capsule.
     * @param height The height of the capsule.
     * @param segmentsW Defines the number of horizontal segments that make up the capsule. Defaults to 16.
     * @param segmentsH Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven value.
     * @param yUp Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
     */
    function PrimitiveCapsulePrefab(material, elementsType, radius, height, segmentsW, segmentsH, yUp) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (radius === void 0) { radius = 50; }
        if (height === void 0) { height = 100; }
        if (segmentsW === void 0) { segmentsW = 16; }
        if (segmentsH === void 0) { segmentsH = 15; }
        if (yUp === void 0) { yUp = true; }
        _super.call(this, material, elementsType);
        this._numVertices = 0;
        this._radius = radius;
        this._height = height;
        this._segmentsW = segmentsW;
        this._segmentsH = (segmentsH % 2 == 0) ? segmentsH + 1 : segmentsH;
        this._yUp = yUp;
    }
    Object.defineProperty(PrimitiveCapsulePrefab.prototype, "radius", {
        /**
         * The radius of the capsule.
         */
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCapsulePrefab.prototype, "height", {
        /**
         * The height of the capsule.
         */
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCapsulePrefab.prototype, "segmentsW", {
        /**
         * Defines the number of horizontal segments that make up the capsule. Defaults to 16.
         */
        get: function () {
            return this._segmentsW;
        },
        set: function (value) {
            this._segmentsW = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCapsulePrefab.prototype, "segmentsH", {
        /**
         * Defines the number of vertical segments that make up the capsule. Defaults to 15. Must be uneven.
         */
        get: function () {
            return this._segmentsH;
        },
        set: function (value) {
            this._segmentsH = (value % 2 == 0) ? value + 1 : value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCapsulePrefab.prototype, "yUp", {
        /**
         * Defines whether the capsule poles should lay on the Y-axis (true) or on the Z-axis (false).
         */
        get: function () {
            return this._yUp;
        },
        set: function (value) {
            this._yUp = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    PrimitiveCapsulePrefab.prototype._pBuildGraphics = function (target, elementsType) {
        var indices;
        var positions;
        var normals;
        var tangents;
        var i;
        var j;
        var triIndex = 0;
        var index = 0;
        var startIndex;
        var comp1, comp2, t1, t2;
        var numIndices = 0;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            // evaluate target number of vertices, triangles and indices
            this._numVertices = (this._segmentsH + 1) * (this._segmentsW + 1); // segmentsH + 1 because of closure, segmentsW + 1 because of closure
            numIndices = (this._segmentsH - 1) * this._segmentsW * 6; // each level has segmentH quads, each of 2 triangles
            // need to initialize raw arrays or can be reused?
            if (this._numVertices == triangleGraphics.numVertices) {
                indices = triangleGraphics.indices.get(triangleGraphics.numElements);
                positions = triangleGraphics.positions.get(this._numVertices);
                normals = triangleGraphics.normals.get(this._numVertices);
                tangents = triangleGraphics.tangents.get(this._numVertices);
            }
            else {
                indices = new Uint16Array(numIndices);
                positions = new Float32Array(this._numVertices * 3);
                normals = new Float32Array(this._numVertices * 3);
                tangents = new Float32Array(this._numVertices * 3);
                this._pInvalidateUVs();
            }
            for (j = 0; j <= this._segmentsH; ++j) {
                var horangle = Math.PI * j / this._segmentsH;
                var z = -this._radius * Math.cos(horangle);
                var ringradius = this._radius * Math.sin(horangle);
                startIndex = index;
                for (i = 0; i <= this._segmentsW; ++i) {
                    var verangle = 2 * Math.PI * i / this._segmentsW;
                    var x = ringradius * Math.cos(verangle);
                    var offset = j > this._segmentsH / 2 ? this._height / 2 : -this._height / 2;
                    var y = ringradius * Math.sin(verangle);
                    var normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                    var tanLen = Math.sqrt(y * y + x * x);
                    if (this._yUp) {
                        t1 = 0;
                        t2 = tanLen > .007 ? x / tanLen : 0;
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        t1 = tanLen > .007 ? x / tanLen : 0;
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this._segmentsW) {
                        positions[index] = positions[startIndex];
                        positions[index + 1] = positions[startIndex + 1];
                        positions[index + 2] = positions[startIndex + 2];
                        normals[index] = (normals[startIndex] + (x * normLen)) * .5;
                        normals[index + 1] = (normals[startIndex + 1] + (comp1 * normLen)) * .5;
                        normals[index + 2] = (normals[startIndex + 2] + (comp2 * normLen)) * .5;
                        tangents[index] = (tangents[startIndex] + (tanLen > .007 ? -y / tanLen : 1)) * .5;
                        tangents[index + 1] = (tangents[startIndex + 1] + t1) * .5;
                        tangents[index + 2] = (tangents[startIndex + 2] + t2) * .5;
                    }
                    else {
                        // vertex
                        positions[index] = x;
                        positions[index + 1] = (this._yUp) ? comp1 - offset : comp1;
                        positions[index + 2] = (this._yUp) ? comp2 : comp2 + offset;
                        // normal
                        normals[index] = x * normLen;
                        normals[index + 1] = comp1 * normLen;
                        normals[index + 2] = comp2 * normLen;
                        // tangent
                        tangents[index] = tanLen > .007 ? -y / tanLen : 1;
                        tangents[index + 1] = t1;
                        tangents[index + 2] = t2;
                    }
                    if (i > 0 && j > 0) {
                        var a = (this._segmentsW + 1) * j + i;
                        var b = (this._segmentsW + 1) * j + i - 1;
                        var c = (this._segmentsW + 1) * (j - 1) + i - 1;
                        var d = (this._segmentsW + 1) * (j - 1) + i;
                        if (j == this._segmentsH) {
                            positions[index] = positions[startIndex];
                            positions[index + 1] = positions[startIndex + 1];
                            positions[index + 2] = positions[startIndex + 2];
                            indices[triIndex++] = a;
                            indices[triIndex++] = c;
                            indices[triIndex++] = d;
                        }
                        else if (j == 1) {
                            indices[triIndex++] = a;
                            indices[triIndex++] = b;
                            indices[triIndex++] = c;
                        }
                        else {
                            indices[triIndex++] = a;
                            indices[triIndex++] = b;
                            indices[triIndex++] = c;
                            indices[triIndex++] = a;
                            indices[triIndex++] = c;
                            indices[triIndex++] = d;
                        }
                    }
                    index += 3;
                }
            }
            // build real data from raw data
            triangleGraphics.setIndices(indices);
            triangleGraphics.setPositions(positions);
            triangleGraphics.setNormals(normals);
            triangleGraphics.setTangents(tangents);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    /**
     * @inheritDoc
     */
    PrimitiveCapsulePrefab.prototype._pBuildUVs = function (target, elementsType) {
        var i, j;
        var uvs;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            // need to initialize raw array or can be reused?
            if (triangleGraphics.uvs && this._numVertices == triangleGraphics.numVertices) {
                uvs = triangleGraphics.uvs.get(this._numVertices);
            }
            else {
                uvs = new Float32Array(this._numVertices * 2);
            }
            // current uv component index
            var index = 0;
            // surface
            for (j = 0; j <= this._segmentsH; ++j) {
                for (i = 0; i <= this._segmentsW; ++i) {
                    // revolution vertex
                    uvs[index++] = (i / this._segmentsW) * this._scaleU;
                    uvs[index++] = (j / this._segmentsH) * this._scaleV;
                }
            }
            // build real data from raw data
            triangleGraphics.setUVs(uvs);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    return PrimitiveCapsulePrefab;
}(PrimitivePrefabBase_1.PrimitivePrefabBase));
exports.PrimitiveCapsulePrefab = PrimitiveCapsulePrefab;

},{"../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase"}],"awayjs-display/lib/prefabs/PrimitiveConePrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PrimitiveCylinderPrefab_1 = require("../prefabs/PrimitiveCylinderPrefab");
/**
 * A UV Cone primitive sprite.
 */
var PrimitiveConePrefab = (function (_super) {
    __extends(PrimitiveConePrefab, _super);
    /**
     * Creates a new Cone object.
     * @param radius The radius of the bottom end of the cone
     * @param height The height of the cone
     * @param segmentsW Defines the number of horizontal segments that make up the cone. Defaults to 16.
     * @param segmentsH Defines the number of vertical segments that make up the cone. Defaults to 1.
     * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
     */
    function PrimitiveConePrefab(material, elementsType, radius, height, segmentsW, segmentsH, closed, yUp) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (radius === void 0) { radius = 50; }
        if (height === void 0) { height = 100; }
        if (segmentsW === void 0) { segmentsW = 16; }
        if (segmentsH === void 0) { segmentsH = 1; }
        if (closed === void 0) { closed = true; }
        if (yUp === void 0) { yUp = true; }
        _super.call(this, material, elementsType, 0, radius, height, segmentsW, segmentsH, false, closed, true, yUp);
    }
    Object.defineProperty(PrimitiveConePrefab.prototype, "radius", {
        /**
         * The radius of the bottom end of the cone.
         */
        get: function () {
            return this._pBottomRadius;
        },
        set: function (value) {
            this._pBottomRadius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    return PrimitiveConePrefab;
}(PrimitiveCylinderPrefab_1.PrimitiveCylinderPrefab));
exports.PrimitiveConePrefab = PrimitiveConePrefab;

},{"../prefabs/PrimitiveCylinderPrefab":"awayjs-display/lib/prefabs/PrimitiveCylinderPrefab"}],"awayjs-display/lib/prefabs/PrimitiveCubePrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsType_1 = require("../graphics/ElementsType");
var PrimitivePrefabBase_1 = require("../prefabs/PrimitivePrefabBase");
/**
 * A Cube primitive prefab.
 */
var PrimitiveCubePrefab = (function (_super) {
    __extends(PrimitiveCubePrefab, _super);
    /**
     * Creates a new Cube object.
     * @param width The size of the cube along its X-axis.
     * @param height The size of the cube along its Y-axis.
     * @param depth The size of the cube along its Z-axis.
     * @param segmentsW The number of segments that make up the cube along the X-axis.
     * @param segmentsH The number of segments that make up the cube along the Y-axis.
     * @param segmentsD The number of segments that make up the cube along the Z-axis.
     * @param tile6 The type of uv mapping to use. When true, a texture will be subdivided in a 2x3 grid, each used for a single face. When false, the entire image is mapped on each face.
     */
    function PrimitiveCubePrefab(material, elementsType, width, height, depth, segmentsW, segmentsH, segmentsD, tile6) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (width === void 0) { width = 100; }
        if (height === void 0) { height = 100; }
        if (depth === void 0) { depth = 100; }
        if (segmentsW === void 0) { segmentsW = 1; }
        if (segmentsH === void 0) { segmentsH = 1; }
        if (segmentsD === void 0) { segmentsD = 1; }
        if (tile6 === void 0) { tile6 = true; }
        _super.call(this, material, elementsType);
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._segmentsW = segmentsW;
        this._segmentsH = segmentsH;
        this._segmentsD = segmentsD;
        this._tile6 = tile6;
    }
    Object.defineProperty(PrimitiveCubePrefab.prototype, "width", {
        /**
         * The size of the cube along its X-axis.
         */
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCubePrefab.prototype, "height", {
        /**
         * The size of the cube along its Y-axis.
         */
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCubePrefab.prototype, "depth", {
        /**
         * The size of the cube along its Z-axis.
         */
        get: function () {
            return this._depth;
        },
        set: function (value) {
            this._depth = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCubePrefab.prototype, "tile6", {
        /**
         * The type of uv mapping to use. When false, the entire image is mapped on each face.
         * When true, a texture will be subdivided in a 3x2 grid, each used for a single face.
         * Reading the tiles from left to right, top to bottom they represent the faces of the
         * cube in the following order: bottom, top, back, left, front, right. This creates
         * several shared edges (between the top, front, left and right faces) which simplifies
         * texture painting.
         */
        get: function () {
            return this._tile6;
        },
        set: function (value) {
            this._tile6 = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCubePrefab.prototype, "segmentsW", {
        /**
         * The number of segments that make up the cube along the X-axis. Defaults to 1.
         */
        get: function () {
            return this._segmentsW;
        },
        set: function (value) {
            this._segmentsW = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCubePrefab.prototype, "segmentsH", {
        /**
         * The number of segments that make up the cube along the Y-axis. Defaults to 1.
         */
        get: function () {
            return this._segmentsH;
        },
        set: function (value) {
            this._segmentsH = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCubePrefab.prototype, "segmentsD", {
        /**
         * The number of segments that make up the cube along the Z-axis. Defaults to 1.
         */
        get: function () {
            return this._segmentsD;
        },
        set: function (value) {
            this._segmentsD = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    PrimitiveCubePrefab.prototype._pBuildGraphics = function (target, elementsType) {
        var indices;
        var positions;
        var normals;
        var tangents;
        var tl, tr, bl, br;
        var i, j, inc = 0;
        var vidx, fidx; // indices
        var hw, hh, hd; // halves
        var dw, dh, dd; // deltas
        var outer_pos;
        // half cube dimensions
        hw = this._width / 2;
        hh = this._height / 2;
        hd = this._depth / 2;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            var numVertices = ((this._segmentsW + 1) * (this._segmentsH + 1) + (this._segmentsW + 1) * (this._segmentsD + 1) + (this._segmentsH + 1) * (this._segmentsD + 1)) * 2;
            var numIndices = ((this._segmentsW * this._segmentsH + this._segmentsW * this._segmentsD + this._segmentsH * this._segmentsD) * 12);
            if (numVertices == triangleGraphics.numVertices && triangleGraphics.indices != null) {
                indices = triangleGraphics.indices.get(triangleGraphics.numElements);
                positions = triangleGraphics.positions.get(numVertices);
                normals = triangleGraphics.normals.get(numVertices);
                tangents = triangleGraphics.tangents.get(numVertices);
            }
            else {
                indices = new Uint16Array(numIndices);
                positions = new Float32Array(numVertices * 3);
                normals = new Float32Array(numVertices * 3);
                tangents = new Float32Array(numVertices * 3);
                this._pInvalidateUVs();
            }
            vidx = 0;
            fidx = 0;
            // Segment dimensions
            dw = this._width / this._segmentsW;
            dh = this._height / this._segmentsH;
            dd = this._depth / this._segmentsD;
            for (i = 0; i <= this._segmentsW; i++) {
                outer_pos = -hw + i * dw;
                for (j = 0; j <= this._segmentsH; j++) {
                    // front
                    positions[vidx] = outer_pos;
                    positions[vidx + 1] = -hh + j * dh;
                    positions[vidx + 2] = -hd;
                    normals[vidx] = 0;
                    normals[vidx + 1] = 0;
                    normals[vidx + 2] = -1;
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    // back
                    positions[vidx] = outer_pos;
                    positions[vidx + 1] = -hh + j * dh;
                    positions[vidx + 2] = hd;
                    normals[vidx] = 0;
                    normals[vidx + 1] = 0;
                    normals[vidx + 2] = 1;
                    tangents[vidx] = -1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    if (i && j) {
                        tl = 2 * ((i - 1) * (this._segmentsH + 1) + (j - 1));
                        tr = 2 * (i * (this._segmentsH + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;
                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }
            inc += 2 * (this._segmentsW + 1) * (this._segmentsH + 1);
            for (i = 0; i <= this._segmentsW; i++) {
                outer_pos = -hw + i * dw;
                for (j = 0; j <= this._segmentsD; j++) {
                    // top
                    positions[vidx] = outer_pos;
                    positions[vidx + 1] = hh;
                    positions[vidx + 2] = -hd + j * dd;
                    normals[vidx] = 0;
                    normals[vidx + 1] = 1;
                    normals[vidx + 2] = 0;
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    // bottom
                    positions[vidx] = outer_pos;
                    positions[vidx + 1] = -hh;
                    positions[vidx + 2] = -hd + j * dd;
                    normals[vidx] = 0;
                    normals[vidx + 1] = -1;
                    normals[vidx + 2] = 0;
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    if (i && j) {
                        tl = inc + 2 * ((i - 1) * (this._segmentsD + 1) + (j - 1));
                        tr = inc + 2 * (i * (this._segmentsD + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;
                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }
            inc += 2 * (this._segmentsW + 1) * (this._segmentsD + 1);
            for (i = 0; i <= this._segmentsD; i++) {
                outer_pos = hd - i * dd;
                for (j = 0; j <= this._segmentsH; j++) {
                    // left
                    positions[vidx] = -hw;
                    positions[vidx + 1] = -hh + j * dh;
                    positions[vidx + 2] = outer_pos;
                    normals[vidx] = -1;
                    normals[vidx + 1] = 0;
                    normals[vidx + 2] = 0;
                    tangents[vidx] = 0;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = -1;
                    vidx += 3;
                    // right
                    positions[vidx] = hw;
                    positions[vidx + 1] = -hh + j * dh;
                    positions[vidx + 2] = outer_pos;
                    normals[vidx] = 1;
                    normals[vidx + 1] = 0;
                    normals[vidx + 2] = 0;
                    tangents[vidx] = 0;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 1;
                    vidx += 3;
                    if (i && j) {
                        tl = inc + 2 * ((i - 1) * (this._segmentsH + 1) + (j - 1));
                        tr = inc + 2 * (i * (this._segmentsH + 1) + (j - 1));
                        bl = tl + 2;
                        br = tr + 2;
                        indices[fidx++] = tl;
                        indices[fidx++] = bl;
                        indices[fidx++] = br;
                        indices[fidx++] = tl;
                        indices[fidx++] = br;
                        indices[fidx++] = tr;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = br + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tr + 1;
                        indices[fidx++] = bl + 1;
                        indices[fidx++] = tl + 1;
                    }
                }
            }
            triangleGraphics.setIndices(indices);
            triangleGraphics.setPositions(positions);
            triangleGraphics.setNormals(normals);
            triangleGraphics.setTangents(tangents);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
            var lineGraphics = target;
            var numSegments = this._segmentsH * 4 + this._segmentsW * 4 + this._segmentsD * 4;
            var thickness;
            positions = new Float32Array(numSegments * 6);
            thickness = new Float32Array(numSegments);
            vidx = 0;
            fidx = 0;
            //front/back face
            for (i = 0; i < this._segmentsH; ++i) {
                positions[vidx++] = -hw;
                positions[vidx++] = i * this._height / this._segmentsH - hh;
                positions[vidx++] = -hd;
                positions[vidx++] = hw;
                positions[vidx++] = i * this._height / this._segmentsH - hh;
                positions[vidx++] = -hd;
                thickness[fidx++] = 1;
                positions[vidx++] = -hw;
                positions[vidx++] = hh - i * this._height / this._segmentsH;
                positions[vidx++] = hd;
                positions[vidx++] = hw;
                positions[vidx++] = hh - i * this._height / this._segmentsH;
                positions[vidx++] = hd;
                thickness[fidx++] = 1;
            }
            for (i = 0; i < this._segmentsW; ++i) {
                positions[vidx++] = i * this._width / this._segmentsW - hw;
                positions[vidx++] = -hh;
                positions[vidx++] = -hd;
                positions[vidx++] = i * this._width / this._segmentsW - hw;
                positions[vidx++] = hh;
                positions[vidx++] = -hd;
                thickness[fidx++] = 1;
                positions[vidx++] = hw - i * this._width / this._segmentsW;
                positions[vidx++] = -hh;
                positions[vidx++] = hd;
                positions[vidx++] = hw - i * this._width / this._segmentsW;
                positions[vidx++] = hh;
                positions[vidx++] = hd;
                thickness[fidx++] = 1;
            }
            //left/right face
            for (i = 0; i < this._segmentsH; ++i) {
                positions[vidx++] = -hw;
                positions[vidx++] = i * this._height / this._segmentsH - hh;
                positions[vidx++] = -hd;
                positions[vidx++] = -hw;
                positions[vidx++] = i * this._height / this._segmentsH - hh;
                positions[vidx++] = hd;
                thickness[fidx++] = 1;
                positions[vidx++] = hw;
                positions[vidx++] = hh - i * this._height / this._segmentsH;
                positions[vidx++] = -hd;
                positions[vidx++] = hw;
                positions[vidx++] = hh - i * this._height / this._segmentsH;
                positions[vidx++] = hd;
                thickness[fidx++] = 1;
            }
            for (i = 0; i < this._segmentsD; ++i) {
                positions[vidx++] = hw;
                positions[vidx++] = -hh;
                positions[vidx++] = i * this._depth / this._segmentsD - hd;
                positions[vidx++] = hw;
                positions[vidx++] = hh;
                positions[vidx++] = i * this._depth / this._segmentsD - hd;
                thickness[fidx++] = 1;
                positions[vidx++] = -hw;
                positions[vidx++] = -hh;
                positions[vidx++] = hd - i * this._depth / this._segmentsD;
                positions[vidx++] = -hw;
                positions[vidx++] = hh;
                positions[vidx++] = hd - i * this._depth / this._segmentsD;
                thickness[fidx++] = 1;
            }
            //top/bottom face
            for (i = 0; i < this._segmentsD; ++i) {
                positions[vidx++] = -hw;
                positions[vidx++] = -hh;
                positions[vidx++] = hd - i * this._depth / this._segmentsD;
                positions[vidx++] = hw;
                positions[vidx++] = -hh;
                positions[vidx++] = hd - i * this._depth / this._segmentsD;
                thickness[fidx++] = 1;
                positions[vidx++] = -hw;
                positions[vidx++] = hh;
                positions[vidx++] = i * this._depth / this._segmentsD - hd;
                positions[vidx++] = hw;
                positions[vidx++] = hh;
                positions[vidx++] = i * this._depth / this._segmentsD - hd;
                thickness[fidx++] = 1;
            }
            for (i = 0; i < this._segmentsW; ++i) {
                positions[vidx++] = hw - i * this._width / this._segmentsW;
                positions[vidx++] = -hh;
                positions[vidx++] = -hd;
                positions[vidx++] = hw - i * this._width / this._segmentsW;
                positions[vidx++] = -hh;
                positions[vidx++] = hd;
                thickness[fidx++] = 1;
                positions[vidx++] = i * this._width / this._segmentsW - hw;
                positions[vidx++] = hh;
                positions[vidx++] = -hd;
                positions[vidx++] = i * this._width / this._segmentsW - hw;
                positions[vidx++] = hh;
                positions[vidx++] = hd;
                thickness[fidx++] = 1;
            }
            // build real data from raw data
            lineGraphics.setPositions(positions);
            lineGraphics.setThickness(thickness);
        }
    };
    /**
     * @inheritDoc
     */
    PrimitiveCubePrefab.prototype._pBuildUVs = function (target, elementsType) {
        var i, j, index;
        var uvs;
        var u_tile_dim, v_tile_dim;
        var u_tile_step, v_tile_step;
        var tl0u, tl0v;
        var tl1u, tl1v;
        var du, dv;
        var numVertices;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            numVertices = ((this._segmentsW + 1) * (this._segmentsH + 1) + (this._segmentsW + 1) * (this._segmentsD + 1) + (this._segmentsH + 1) * (this._segmentsD + 1)) * 2;
            var triangleGraphics = target;
            if (numVertices == triangleGraphics.numVertices && triangleGraphics.uvs != null) {
                uvs = triangleGraphics.uvs.get(numVertices);
            }
            else {
                uvs = new Float32Array(numVertices * 2);
            }
            if (this._tile6) {
                u_tile_dim = u_tile_step = 1 / 3;
                v_tile_dim = v_tile_step = 1 / 2;
            }
            else {
                u_tile_dim = v_tile_dim = 1;
                u_tile_step = v_tile_step = 0;
            }
            // Create planes two and two, the same way that they were
            // constructed in the buildGraphics() function. First calculate
            // the top-left UV coordinate for both planes, and then loop
            // over the points, calculating the UVs from these numbers.
            // When tile6 is true, the layout is as follows:
            //       .-----.-----.-----. (1,1)
            //       | Bot |  T  | Bak |
            //       |-----+-----+-----|
            //       |  L  |  F  |  R  |
            // (0,0)'-----'-----'-----'
            index = 0;
            // FRONT / BACK
            tl0u = 1 * u_tile_step;
            tl0v = 1 * v_tile_step;
            tl1u = 2 * u_tile_step;
            tl1v = 0 * v_tile_step;
            du = u_tile_dim / this._segmentsW;
            dv = v_tile_dim / this._segmentsH;
            for (i = 0; i <= this._segmentsW; i++) {
                for (j = 0; j <= this._segmentsH; j++) {
                    uvs[index++] = (tl0u + i * du) * this._scaleU;
                    uvs[index++] = (tl0v + (v_tile_dim - j * dv)) * this._scaleV;
                    uvs[index++] = (tl1u + (u_tile_dim - i * du)) * this._scaleU;
                    uvs[index++] = (tl1v + (v_tile_dim - j * dv)) * this._scaleV;
                }
            }
            // TOP / BOTTOM
            tl0u = 1 * u_tile_step;
            tl0v = 0 * v_tile_step;
            tl1u = 0 * u_tile_step;
            tl1v = 0 * v_tile_step;
            du = u_tile_dim / this._segmentsW;
            dv = v_tile_dim / this._segmentsD;
            for (i = 0; i <= this._segmentsW; i++) {
                for (j = 0; j <= this._segmentsD; j++) {
                    uvs[index++] = (tl0u + i * du) * this._scaleU;
                    uvs[index++] = (tl0v + (v_tile_dim - j * dv)) * this._scaleV;
                    uvs[index++] = (tl1u + i * du) * this._scaleU;
                    uvs[index++] = (tl1v + j * dv) * this._scaleV;
                }
            }
            // LEFT / RIGHT
            tl0u = 0 * u_tile_step;
            tl0v = 1 * v_tile_step;
            tl1u = 2 * u_tile_step;
            tl1v = 1 * v_tile_step;
            du = u_tile_dim / this._segmentsD;
            dv = v_tile_dim / this._segmentsH;
            for (i = 0; i <= this._segmentsD; i++) {
                for (j = 0; j <= this._segmentsH; j++) {
                    uvs[index++] = (tl0u + i * du) * this._scaleU;
                    uvs[index++] = (tl0v + (v_tile_dim - j * dv)) * this._scaleV;
                    uvs[index++] = (tl1u + (u_tile_dim - i * du)) * this._scaleU;
                    uvs[index++] = (tl1v + (v_tile_dim - j * dv)) * this._scaleV;
                }
            }
            triangleGraphics.setUVs(uvs);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    return PrimitiveCubePrefab;
}(PrimitivePrefabBase_1.PrimitivePrefabBase));
exports.PrimitiveCubePrefab = PrimitiveCubePrefab;

},{"../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase"}],"awayjs-display/lib/prefabs/PrimitiveCylinderPrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsType_1 = require("../graphics/ElementsType");
var PrimitivePrefabBase_1 = require("../prefabs/PrimitivePrefabBase");
/**
 * A Cylinder primitive sprite.
 */
var PrimitiveCylinderPrefab = (function (_super) {
    __extends(PrimitiveCylinderPrefab, _super);
    /**
     * Creates a new Cylinder object.
     * @param topRadius The radius of the top end of the cylinder.
     * @param bottomRadius The radius of the bottom end of the cylinder
     * @param height The radius of the bottom end of the cylinder
     * @param segmentsW Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
     * @param segmentsH Defines the number of vertical segments that make up the cylinder. Defaults to 1.
     * @param topClosed Defines whether the top end of the cylinder is closed (true) or open.
     * @param bottomClosed Defines whether the bottom end of the cylinder is closed (true) or open.
     * @param yUp Defines whether the cone poles should lay on the Y-axis (true) or on the Z-axis (false).
     */
    function PrimitiveCylinderPrefab(material, elementsType, topRadius, bottomRadius, height, segmentsW, segmentsH, topClosed, bottomClosed, surfaceClosed, yUp) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (topRadius === void 0) { topRadius = 50; }
        if (bottomRadius === void 0) { bottomRadius = 50; }
        if (height === void 0) { height = 100; }
        if (segmentsW === void 0) { segmentsW = 16; }
        if (segmentsH === void 0) { segmentsH = 1; }
        if (topClosed === void 0) { topClosed = true; }
        if (bottomClosed === void 0) { bottomClosed = true; }
        if (surfaceClosed === void 0) { surfaceClosed = true; }
        if (yUp === void 0) { yUp = true; }
        _super.call(this, material, elementsType);
        this._numVertices = 0;
        this._topRadius = topRadius;
        this._pBottomRadius = bottomRadius;
        this._height = height;
        this._pSegmentsW = segmentsW;
        this._pSegmentsH = segmentsH;
        this._topClosed = topClosed;
        this._bottomClosed = bottomClosed;
        this._surfaceClosed = surfaceClosed;
        this._yUp = yUp;
    }
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "topRadius", {
        /**
         * The radius of the top end of the cylinder.
         */
        get: function () {
            return this._topRadius;
        },
        set: function (value) {
            this._topRadius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "bottomRadius", {
        /**
         * The radius of the bottom end of the cylinder.
         */
        get: function () {
            return this._pBottomRadius;
        },
        set: function (value) {
            this._pBottomRadius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "height", {
        /**
         * The radius of the top end of the cylinder.
         */
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "segmentsW", {
        /**
         * Defines the number of horizontal segments that make up the cylinder. Defaults to 16.
         */
        get: function () {
            return this._pSegmentsW;
        },
        set: function (value) {
            this.setSegmentsW(value);
        },
        enumerable: true,
        configurable: true
    });
    PrimitiveCylinderPrefab.prototype.setSegmentsW = function (value) {
        this._pSegmentsW = value;
        this._pInvalidatePrimitive();
        this._pInvalidateUVs();
    };
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "segmentsH", {
        /**
         * Defines the number of vertical segments that make up the cylinder. Defaults to 1.
         */
        get: function () {
            return this._pSegmentsH;
        },
        set: function (value) {
            this.setSegmentsH(value);
        },
        enumerable: true,
        configurable: true
    });
    PrimitiveCylinderPrefab.prototype.setSegmentsH = function (value) {
        this._pSegmentsH = value;
        this._pInvalidatePrimitive();
        this._pInvalidateUVs();
    };
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "topClosed", {
        /**
         * Defines whether the top end of the cylinder is closed (true) or open.
         */
        get: function () {
            return this._topClosed;
        },
        set: function (value) {
            this._topClosed = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "bottomClosed", {
        /**
         * Defines whether the bottom end of the cylinder is closed (true) or open.
         */
        get: function () {
            return this._bottomClosed;
        },
        set: function (value) {
            this._bottomClosed = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveCylinderPrefab.prototype, "yUp", {
        /**
         * Defines whether the cylinder poles should lay on the Y-axis (true) or on the Z-axis (false).
         */
        get: function () {
            return this._yUp;
        },
        set: function (value) {
            this._yUp = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    PrimitiveCylinderPrefab.prototype._pBuildGraphics = function (target, elementsType) {
        var indices;
        var positions;
        var normals;
        var tangents;
        var i;
        var j;
        var x;
        var y;
        var z;
        var vidx;
        var fidx;
        var radius;
        var revolutionAngle;
        var dr;
        var latNormElev;
        var latNormBase;
        var numIndices = 0;
        var comp1;
        var comp2;
        var startIndex = 0;
        var nextVertexIndex = 0;
        var centerVertexIndex = 0;
        var t1;
        var t2;
        // reset utility variables
        this._numVertices = 0;
        // evaluate revolution steps
        var revolutionAngleDelta = 2 * Math.PI / this._pSegmentsW;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            // evaluate target number of vertices, triangles and indices
            if (this._surfaceClosed) {
                this._numVertices += (this._pSegmentsH + 1) * (this._pSegmentsW + 1); // segmentsH + 1 because of closure, segmentsW + 1 because of UV unwrapping
                numIndices += this._pSegmentsH * this._pSegmentsW * 6; // each level has segmentW quads, each of 2 triangles
            }
            if (this._topClosed) {
                this._numVertices += 2 * (this._pSegmentsW + 1); // segmentsW + 1 because of unwrapping
                numIndices += this._pSegmentsW * 3; // one triangle for each segment
            }
            if (this._bottomClosed) {
                this._numVertices += 2 * (this._pSegmentsW + 1);
                numIndices += this._pSegmentsW * 3;
            }
            // need to initialize raw arrays or can be reused?
            if (this._numVertices == triangleGraphics.numVertices) {
                indices = triangleGraphics.indices.get(triangleGraphics.numElements);
                positions = triangleGraphics.positions.get(this._numVertices);
                normals = triangleGraphics.normals.get(this._numVertices);
                tangents = triangleGraphics.tangents.get(this._numVertices);
            }
            else {
                indices = new Uint16Array(numIndices);
                positions = new Float32Array(this._numVertices * 3);
                normals = new Float32Array(this._numVertices * 3);
                tangents = new Float32Array(this._numVertices * 3);
                this._pInvalidateUVs();
            }
            vidx = 0;
            fidx = 0;
            // top
            if (this._topClosed && this._topRadius > 0) {
                z = -0.5 * this._height;
                // central vertex
                if (this._yUp) {
                    t1 = 1;
                    t2 = 0;
                    comp1 = -z;
                    comp2 = 0;
                }
                else {
                    t1 = 0;
                    t2 = -1;
                    comp1 = 0;
                    comp2 = z;
                }
                positions[vidx] = 0;
                positions[vidx + 1] = comp1;
                positions[vidx + 2] = comp2;
                normals[vidx] = 0;
                normals[vidx + 1] = t1;
                normals[vidx + 2] = t2;
                tangents[vidx] = 1;
                tangents[vidx + 1] = 0;
                tangents[vidx + 2] = 0;
                vidx += 3;
                nextVertexIndex += 1;
                for (i = 0; i <= this._pSegmentsW; ++i) {
                    // revolution vertex
                    revolutionAngle = i * revolutionAngleDelta;
                    x = this._topRadius * Math.cos(revolutionAngle);
                    y = this._topRadius * Math.sin(revolutionAngle);
                    if (this._yUp) {
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this._pSegmentsW) {
                        positions[vidx] = positions[startIndex + 3];
                        positions[vidx + 1] = positions[startIndex + 4];
                        positions[vidx + 2] = positions[startIndex + 5];
                    }
                    else {
                        positions[vidx] = x;
                        positions[vidx + 1] = comp1;
                        positions[vidx + 2] = comp2;
                    }
                    normals[vidx] = 0;
                    normals[vidx + 1] = t1;
                    normals[vidx + 2] = t2;
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    if (i > 0) {
                        // add triangle
                        indices[fidx++] = nextVertexIndex - 1;
                        indices[fidx++] = centerVertexIndex;
                        indices[fidx++] = nextVertexIndex;
                    }
                    nextVertexIndex += 1;
                }
            }
            // bottom
            if (this._bottomClosed && this._pBottomRadius > 0) {
                z = 0.5 * this._height;
                startIndex = nextVertexIndex * 3;
                centerVertexIndex = nextVertexIndex;
                // central vertex
                if (this._yUp) {
                    t1 = -1;
                    t2 = 0;
                    comp1 = -z;
                    comp2 = 0;
                }
                else {
                    t1 = 0;
                    t2 = 1;
                    comp1 = 0;
                    comp2 = z;
                }
                if (i > 0) {
                    positions[vidx] = 0;
                    positions[vidx + 1] = comp1;
                    positions[vidx + 2] = comp2;
                    normals[vidx] = 0;
                    normals[vidx + 1] = t1;
                    normals[vidx + 2] = t2;
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                }
                nextVertexIndex += 1;
                for (i = 0; i <= this._pSegmentsW; ++i) {
                    // revolution vertex
                    revolutionAngle = i * revolutionAngleDelta;
                    x = this._pBottomRadius * Math.cos(revolutionAngle);
                    y = this._pBottomRadius * Math.sin(revolutionAngle);
                    if (this._yUp) {
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this._pSegmentsW) {
                        positions[vidx] = positions[startIndex + 3];
                        positions[vidx + 1] = positions[startIndex + 4];
                        positions[vidx + 2] = positions[startIndex + 5];
                    }
                    else {
                        positions[vidx] = x;
                        positions[vidx + 1] = comp1;
                        positions[vidx + 2] = comp2;
                    }
                    normals[vidx] = 0;
                    normals[vidx + 1] = t1;
                    normals[vidx + 2] = t2;
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    if (i > 0) {
                        // add triangle
                        indices[fidx++] = nextVertexIndex - 1;
                        indices[fidx++] = nextVertexIndex;
                        indices[fidx++] = centerVertexIndex;
                    }
                    nextVertexIndex += 1;
                }
            }
            // The normals on the lateral surface all have the same incline, i.e.
            // the "elevation" component (Y or Z depending on yUp) is constant.
            // Same principle goes for the "base" of these vectors, which will be
            // calculated such that a vector [base,elev] will be a unit vector.
            dr = (this._pBottomRadius - this._topRadius);
            latNormElev = dr / this._height;
            latNormBase = (latNormElev == 0) ? 1 : this._height / dr;
            // lateral surface
            if (this._surfaceClosed) {
                var a;
                var b;
                var c;
                var d;
                var na0, na1, naComp1, naComp2;
                for (j = 0; j <= this._pSegmentsH; ++j) {
                    radius = this._topRadius - ((j / this._pSegmentsH) * (this._topRadius - this._pBottomRadius));
                    z = -(this._height / 2) + (j / this._pSegmentsH * this._height);
                    startIndex = nextVertexIndex * 3;
                    for (i = 0; i <= this._pSegmentsW; ++i) {
                        // revolution vertex
                        revolutionAngle = i * revolutionAngleDelta;
                        x = radius * Math.cos(revolutionAngle);
                        y = radius * Math.sin(revolutionAngle);
                        na0 = latNormBase * Math.cos(revolutionAngle);
                        na1 = latNormBase * Math.sin(revolutionAngle);
                        if (this._yUp) {
                            t1 = 0;
                            t2 = -na0;
                            comp1 = -z;
                            comp2 = y;
                            naComp1 = latNormElev;
                            naComp2 = na1;
                        }
                        else {
                            t1 = -na0;
                            t2 = 0;
                            comp1 = y;
                            comp2 = z;
                            naComp1 = na1;
                            naComp2 = latNormElev;
                        }
                        if (i == this._pSegmentsW) {
                            positions[vidx] = positions[startIndex];
                            positions[vidx + 1] = positions[startIndex + 1];
                            positions[vidx + 2] = positions[startIndex + 2];
                            normals[vidx] = na0;
                            normals[vidx + 1] = latNormElev;
                            normals[vidx + 2] = na1;
                            tangents[vidx] = na1;
                            tangents[vidx + 1] = t1;
                            tangents[vidx + 2] = t2;
                        }
                        else {
                            positions[vidx] = x;
                            positions[vidx + 1] = comp1;
                            positions[vidx + 2] = comp2;
                            normals[vidx] = na0;
                            normals[vidx + 1] = naComp1;
                            normals[vidx + 2] = naComp2;
                            tangents[vidx] = -na1;
                            tangents[vidx + 1] = t1;
                            tangents[vidx + 2] = t2;
                        }
                        vidx += 3;
                        // close triangle
                        if (i > 0 && j > 0) {
                            a = nextVertexIndex; // current
                            b = nextVertexIndex - 1; // previous
                            c = b - this._pSegmentsW - 1; // previous of last level
                            d = a - this._pSegmentsW - 1; // current of last level
                            indices[fidx++] = a;
                            indices[fidx++] = b;
                            indices[fidx++] = c;
                            indices[fidx++] = a;
                            indices[fidx++] = c;
                            indices[fidx++] = d;
                        }
                        nextVertexIndex++;
                    }
                }
            }
            // build real data from raw data
            triangleGraphics.setIndices(indices);
            triangleGraphics.setPositions(positions);
            triangleGraphics.setNormals(normals);
            triangleGraphics.setTangents(tangents);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
            var lineGraphics = target;
            var numSegments = this._pSegmentsH * this._pSegmentsW * 2 + this._pSegmentsW;
            positions = new Float32Array(numSegments * 6);
            var thickness = new Float32Array(numSegments);
            vidx = 0;
            fidx = 0;
            var _radius = 50;
            for (j = 0; j <= this._pSegmentsH; ++j) {
                radius = this._topRadius - ((j / this._pSegmentsH) * (this._topRadius - this._pBottomRadius));
                z = -(this._height / 2) + (j / this._pSegmentsH * this._height);
                for (i = 0; i <= this._pSegmentsW; ++i) {
                    // revolution vertex
                    revolutionAngle = i * revolutionAngleDelta;
                    x = radius * Math.cos(revolutionAngle);
                    y = radius * Math.sin(revolutionAngle);
                    if (this._yUp) {
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i > 0) {
                        //horizonal lines
                        positions[vidx++] = x;
                        positions[vidx++] = comp1;
                        positions[vidx++] = comp2;
                        thickness[fidx++] = 1;
                        //vertical lines
                        if (j > 0) {
                            var addx = (j == 1) ? 3 - (6 * (this._pSegmentsW - i) + 12 * i) : 3 - this._pSegmentsW * 12;
                            positions[vidx] = positions[vidx++ + addx];
                            positions[vidx] = positions[vidx++ + addx];
                            positions[vidx] = positions[vidx++ + addx];
                            positions[vidx++] = x;
                            positions[vidx++] = comp1;
                            positions[vidx++] = comp2;
                            thickness[fidx++] = 1;
                        }
                    }
                    //horizonal lines
                    if (i < this._pSegmentsW) {
                        positions[vidx++] = x;
                        positions[vidx++] = comp1;
                        positions[vidx++] = comp2;
                    }
                }
            }
            // build real data from raw data
            lineGraphics.setPositions(positions);
            lineGraphics.setThickness(thickness);
        }
    };
    /**
     * @inheritDoc
     */
    PrimitiveCylinderPrefab.prototype._pBuildUVs = function (target, elementsType) {
        var i;
        var j;
        var x;
        var y;
        var revolutionAngle;
        var uvs;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            // need to initialize raw array or can be reused?
            if (triangleGraphics.uvs && this._numVertices == triangleGraphics.numVertices) {
                uvs = triangleGraphics.uvs.get(this._numVertices);
            }
            else {
                uvs = new Float32Array(this._numVertices * 2);
            }
            // evaluate revolution steps
            var revolutionAngleDelta = 2 * Math.PI / this._pSegmentsW;
            // current uv component index
            var index = 0;
            // top
            if (this._topClosed) {
                uvs[index++] = 0.5 * this._scaleU; // central vertex
                uvs[index++] = 0.5 * this._scaleV;
                for (i = 0; i <= this._pSegmentsW; ++i) {
                    revolutionAngle = i * revolutionAngleDelta;
                    x = 0.5 + 0.5 * -Math.cos(revolutionAngle);
                    y = 0.5 + 0.5 * Math.sin(revolutionAngle);
                    uvs[index++] = x * this._scaleU; // revolution vertex
                    uvs[index++] = y * this._scaleV;
                }
            }
            // bottom
            if (this._bottomClosed) {
                uvs[index++] = 0.5 * this._scaleU; // central vertex
                uvs[index++] = 0.5 * this._scaleV;
                for (i = 0; i <= this._pSegmentsW; ++i) {
                    revolutionAngle = i * revolutionAngleDelta;
                    x = 0.5 + 0.5 * Math.cos(revolutionAngle);
                    y = 0.5 + 0.5 * Math.sin(revolutionAngle);
                    uvs[index++] = x * this._scaleU; // revolution vertex
                    uvs[index++] = y * this._scaleV;
                }
            }
            // lateral surface
            if (this._surfaceClosed) {
                for (j = 0; j <= this._pSegmentsH; ++j) {
                    for (i = 0; i <= this._pSegmentsW; ++i) {
                        // revolution vertex
                        uvs[index++] = (i / this._pSegmentsW) * this._scaleU;
                        uvs[index++] = (j / this._pSegmentsH) * this._scaleV;
                    }
                }
            }
            // build real data from raw data
            triangleGraphics.setUVs(uvs);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    return PrimitiveCylinderPrefab;
}(PrimitivePrefabBase_1.PrimitivePrefabBase));
exports.PrimitiveCylinderPrefab = PrimitiveCylinderPrefab;

},{"../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase"}],"awayjs-display/lib/prefabs/PrimitivePlanePrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsType_1 = require("../graphics/ElementsType");
var PrimitivePrefabBase_1 = require("../prefabs/PrimitivePrefabBase");
/**
 * A Plane primitive sprite.
 */
var PrimitivePlanePrefab = (function (_super) {
    __extends(PrimitivePlanePrefab, _super);
    /**
     * Creates a new Plane object.
     * @param width The width of the plane.
     * @param height The height of the plane.
     * @param segmentsW The number of segments that make up the plane along the X-axis.
     * @param segmentsH The number of segments that make up the plane along the Y or Z-axis.
     * @param yUp Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false).
     * @param doubleSided Defines whether the plane will be visible from both sides, with correct vertex normals.
     */
    function PrimitivePlanePrefab(material, elementsType, width, height, segmentsW, segmentsH, yUp, doubleSided) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (width === void 0) { width = 100; }
        if (height === void 0) { height = 100; }
        if (segmentsW === void 0) { segmentsW = 1; }
        if (segmentsH === void 0) { segmentsH = 1; }
        if (yUp === void 0) { yUp = true; }
        if (doubleSided === void 0) { doubleSided = false; }
        _super.call(this, material, elementsType);
        this._segmentsW = segmentsW;
        this._segmentsH = segmentsH;
        this._yUp = yUp;
        this._width = width;
        this._height = height;
        this._doubleSided = doubleSided;
    }
    Object.defineProperty(PrimitivePlanePrefab.prototype, "segmentsW", {
        /**
         * The number of segments that make up the plane along the X-axis. Defaults to 1.
         */
        get: function () {
            return this._segmentsW;
        },
        set: function (value) {
            this._segmentsW = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePlanePrefab.prototype, "segmentsH", {
        /**
         * The number of segments that make up the plane along the Y or Z-axis, depending on whether yUp is true or
         * false, respectively. Defaults to 1.
         */
        get: function () {
            return this._segmentsH;
        },
        set: function (value) {
            this._segmentsH = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePlanePrefab.prototype, "yUp", {
        /**
         *  Defines whether the normal vector of the plane should point along the Y-axis (true) or Z-axis (false). Defaults to true.
         */
        get: function () {
            return this._yUp;
        },
        set: function (value) {
            this._yUp = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePlanePrefab.prototype, "doubleSided", {
        /**
         * Defines whether the plane will be visible from both sides, with correct vertex normals (as opposed to bothSides on Material). Defaults to false.
         */
        get: function () {
            return this._doubleSided;
        },
        set: function (value) {
            this._doubleSided = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePlanePrefab.prototype, "width", {
        /**
         * The width of the plane.
         */
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePlanePrefab.prototype, "height", {
        /**
         * The height of the plane.
         */
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    PrimitivePlanePrefab.prototype._pBuildGraphics = function (target, elementsType) {
        var indices;
        var x, y;
        var numIndices;
        var base;
        var tw = this._segmentsW + 1;
        var vidx, fidx; // indices
        var xi;
        var yi;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            var numVertices = (this._segmentsH + 1) * tw;
            var positions;
            var normals;
            var tangents;
            if (this._doubleSided)
                numVertices *= 2;
            numIndices = this._segmentsH * this._segmentsW * 6;
            if (this._doubleSided)
                numIndices *= 2;
            if (triangleGraphics.indices != null && numIndices == triangleGraphics.indices.length) {
                indices = triangleGraphics.indices.get(triangleGraphics.numElements);
            }
            else {
                indices = new Uint16Array(numIndices);
                this._pInvalidateUVs();
            }
            if (numVertices == triangleGraphics.numVertices) {
                positions = triangleGraphics.positions.get(numVertices);
                normals = triangleGraphics.normals.get(numVertices);
                tangents = triangleGraphics.tangents.get(numVertices);
            }
            else {
                positions = new Float32Array(numVertices * 3);
                normals = new Float32Array(numVertices * 3);
                tangents = new Float32Array(numVertices * 3);
                this._pInvalidateUVs();
            }
            fidx = 0;
            vidx = 0;
            for (yi = 0; yi <= this._segmentsH; ++yi) {
                for (xi = 0; xi <= this._segmentsW; ++xi) {
                    x = (xi / this._segmentsW - .5) * this._width;
                    y = (yi / this._segmentsH - .5) * this._height;
                    positions[vidx] = x;
                    if (this._yUp) {
                        positions[vidx + 1] = 0;
                        positions[vidx + 2] = y;
                    }
                    else {
                        positions[vidx + 1] = y;
                        positions[vidx + 2] = 0;
                    }
                    normals[vidx] = 0;
                    if (this._yUp) {
                        normals[vidx + 1] = 1;
                        normals[vidx + 2] = 0;
                    }
                    else {
                        normals[vidx + 1] = 0;
                        normals[vidx + 2] = -1;
                    }
                    tangents[vidx] = 1;
                    tangents[vidx + 1] = 0;
                    tangents[vidx + 2] = 0;
                    vidx += 3;
                    // add vertex with same position, but with inverted normal & tangent
                    if (this._doubleSided) {
                        for (var i = vidx; i < vidx + 3; ++i) {
                            positions[i] = positions[i - 3];
                            normals[i] = -normals[i - 3];
                            tangents[i] = -tangents[i - 3];
                        }
                        vidx += 3;
                    }
                    if (xi != this._segmentsW && yi != this._segmentsH) {
                        base = xi + yi * tw;
                        var mult = this._doubleSided ? 2 : 1;
                        indices[fidx++] = base * mult;
                        indices[fidx++] = (base + tw) * mult;
                        indices[fidx++] = (base + tw + 1) * mult;
                        indices[fidx++] = base * mult;
                        indices[fidx++] = (base + tw + 1) * mult;
                        indices[fidx++] = (base + 1) * mult;
                        if (this._doubleSided) {
                            indices[fidx++] = (base + tw + 1) * mult + 1;
                            indices[fidx++] = (base + tw) * mult + 1;
                            indices[fidx++] = base * mult + 1;
                            indices[fidx++] = (base + 1) * mult + 1;
                            indices[fidx++] = (base + tw + 1) * mult + 1;
                            indices[fidx++] = base * mult + 1;
                        }
                    }
                }
            }
            triangleGraphics.setIndices(indices);
            triangleGraphics.setPositions(positions);
            triangleGraphics.setNormals(normals);
            triangleGraphics.setTangents(tangents);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
            var lineGraphics = target;
            var numSegments = (this._segmentsH + 1) + tw;
            var positions;
            var thickness;
            var hw = this._width / 2;
            var hh = this._height / 2;
            positions = new Float32Array(numSegments * 6);
            thickness = new Float32Array(numSegments);
            fidx = 0;
            vidx = 0;
            for (yi = 0; yi <= this._segmentsH; ++yi) {
                positions[vidx++] = -hw;
                positions[vidx++] = 0;
                positions[vidx++] = yi * this._height - hh;
                positions[vidx++] = hw;
                positions[vidx++] = 0;
                positions[vidx++] = yi * this._height - hh;
                thickness[fidx++] = 1;
            }
            for (xi = 0; xi <= this._segmentsW; ++xi) {
                positions[vidx++] = xi * this._width - hw;
                positions[vidx++] = 0;
                positions[vidx++] = -hh;
                positions[vidx++] = xi * this._width - hw;
                positions[vidx++] = 0;
                positions[vidx++] = hh;
                thickness[fidx++] = 1;
            }
            // build real data from raw data
            lineGraphics.setPositions(positions);
            lineGraphics.setThickness(thickness);
        }
    };
    /**
     * @inheritDoc
     */
    PrimitivePlanePrefab.prototype._pBuildUVs = function (target, elementsType) {
        var uvs;
        var numVertices;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            numVertices = (this._segmentsH + 1) * (this._segmentsW + 1);
            if (this._doubleSided)
                numVertices *= 2;
            var triangleGraphics = target;
            if (triangleGraphics.uvs && numVertices == triangleGraphics.numVertices) {
                uvs = triangleGraphics.uvs.get(numVertices);
            }
            else {
                uvs = new Float32Array(numVertices * 2);
                this._pInvalidatePrimitive();
            }
            var index = 0;
            for (var yi = 0; yi <= this._segmentsH; ++yi) {
                for (var xi = 0; xi <= this._segmentsW; ++xi) {
                    uvs[index] = (xi / this._segmentsW) * this._scaleU;
                    uvs[index + 1] = (1 - yi / this._segmentsH) * this._scaleV;
                    index += 2;
                    if (this._doubleSided) {
                        uvs[index] = (xi / this._segmentsW) * this._scaleU;
                        uvs[index + 1] = (1 - yi / this._segmentsH) * this._scaleV;
                        index += 2;
                    }
                }
            }
            triangleGraphics.setUVs(uvs);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    return PrimitivePlanePrefab;
}(PrimitivePrefabBase_1.PrimitivePrefabBase));
exports.PrimitivePlanePrefab = PrimitivePlanePrefab;

},{"../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase"}],"awayjs-display/lib/prefabs/PrimitivePolygonPrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PrimitiveCylinderPrefab_1 = require("../prefabs/PrimitiveCylinderPrefab");
/**
 * A UV RegularPolygon primitive sprite.
 */
var PrimitivePolygonPrefab = (function (_super) {
    __extends(PrimitivePolygonPrefab, _super);
    /**
     * Creates a new RegularPolygon disc object.
     * @param radius The radius of the regular polygon
     * @param sides Defines the number of sides of the regular polygon.
     * @param yUp Defines whether the regular polygon should lay on the Y-axis (true) or on the Z-axis (false).
     */
    function PrimitivePolygonPrefab(material, elementsType, radius, sides, yUp) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (radius === void 0) { radius = 100; }
        if (sides === void 0) { sides = 16; }
        if (yUp === void 0) { yUp = true; }
        _super.call(this, material, elementsType, radius, 0, 0, sides, 1, true, false, false, yUp);
    }
    Object.defineProperty(PrimitivePolygonPrefab.prototype, "radius", {
        /**
         * The radius of the regular polygon.
         */
        get: function () {
            return this._pBottomRadius;
        },
        set: function (value) {
            this._pBottomRadius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePolygonPrefab.prototype, "sides", {
        /**
         * The number of sides of the regular polygon.
         */
        get: function () {
            return this._pSegmentsW;
        },
        set: function (value) {
            this.setSegmentsW(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePolygonPrefab.prototype, "subdivisions", {
        /**
         * The number of subdivisions from the edge to the center of the regular polygon.
         */
        get: function () {
            return this._pSegmentsH;
        },
        set: function (value) {
            this.setSegmentsH(value);
        },
        enumerable: true,
        configurable: true
    });
    return PrimitivePolygonPrefab;
}(PrimitiveCylinderPrefab_1.PrimitiveCylinderPrefab));
exports.PrimitivePolygonPrefab = PrimitivePolygonPrefab;

},{"../prefabs/PrimitiveCylinderPrefab":"awayjs-display/lib/prefabs/PrimitiveCylinderPrefab"}],"awayjs-display/lib/prefabs/PrimitivePrefabBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AttributesBuffer_1 = require("awayjs-core/lib/attributes/AttributesBuffer");
var AbstractMethodError_1 = require("awayjs-core/lib/errors/AbstractMethodError");
var ElementsType_1 = require("../graphics/ElementsType");
var TriangleElements_1 = require("../graphics/TriangleElements");
var LineElements_1 = require("../graphics/LineElements");
var Sprite_1 = require("../display/Sprite");
var PrefabBase_1 = require("../prefabs/PrefabBase");
/**
 * PrimitivePrefabBase is an abstract base class for polytope prefabs, which are simple pre-built geometric shapes
 */
var PrimitivePrefabBase = (function (_super) {
    __extends(PrimitivePrefabBase, _super);
    /**
     * Creates a new PrimitivePrefabBase object.
     *
     * @param material The material with which to render the object
     */
    function PrimitivePrefabBase(material, elementsType) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        _super.call(this);
        this._primitiveDirty = true;
        this._uvDirty = true;
        this._scaleU = 1;
        this._scaleV = 1;
        this._material = material;
        this._elementsType = elementsType;
        if (this._elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleElements = new TriangleElements_1.TriangleElements(new AttributesBuffer_1.AttributesBuffer());
            triangleElements.autoDeriveNormals = false;
            triangleElements.autoDeriveTangents = false;
            this._elements = triangleElements;
        }
        else if (this._elementsType == ElementsType_1.ElementsType.LINE) {
            this._elements = new LineElements_1.LineElements(new AttributesBuffer_1.AttributesBuffer());
        }
    }
    Object.defineProperty(PrimitivePrefabBase.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return PrimitivePrefabBase.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePrefabBase.prototype, "elementsType", {
        /**
         *
         */
        get: function () {
            return this._elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePrefabBase.prototype, "material", {
        /**
         * The material with which to render the primitive.
         */
        get: function () {
            return this._material;
        },
        set: function (value) {
            if (value == this._material)
                return;
            this._material = value;
            var len = this._pObjects.length;
            for (var i = 0; i < len; i++)
                this._pObjects[i].material = this._material;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePrefabBase.prototype, "scaleU", {
        get: function () {
            return this._scaleU;
        },
        set: function (value) {
            if (this._scaleU = value)
                return;
            this._scaleU = value;
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitivePrefabBase.prototype, "scaleV", {
        get: function () {
            return this._scaleV;
        },
        set: function (value) {
            if (this._scaleV = value)
                return;
            this._scaleV = value;
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Builds the primitive's geometry when invalid. This method should not be called directly. The calling should
     * be triggered by the invalidateGraphics method (and in turn by updateGraphics).
     */
    PrimitivePrefabBase.prototype._pBuildGraphics = function (target, elementsType) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * Builds the primitive's uv coordinates when invalid. This method should not be called directly. The calling
     * should be triggered by the invalidateUVs method (and in turn by updateUVs).
     */
    PrimitivePrefabBase.prototype._pBuildUVs = function (target, elementsType) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * Invalidates the primitive, causing it to be updated when requested.
     */
    PrimitivePrefabBase.prototype._pInvalidatePrimitive = function () {
        this._primitiveDirty = true;
    };
    /**
     * Invalidates the primitive's uv coordinates, causing them to be updated when requested.
     */
    PrimitivePrefabBase.prototype._pInvalidateUVs = function () {
        this._uvDirty = true;
    };
    /**
     * Updates the geometry when invalid.
     */
    PrimitivePrefabBase.prototype.updateGraphics = function () {
        this._pBuildGraphics(this._elements, this._elementsType);
        this._primitiveDirty = false;
    };
    /**
     * Updates the uv coordinates when invalid.
     */
    PrimitivePrefabBase.prototype.updateUVs = function () {
        this._pBuildUVs(this._elements, this._elementsType);
        this._uvDirty = false;
    };
    PrimitivePrefabBase.prototype._iValidate = function () {
        if (this._primitiveDirty)
            this.updateGraphics();
        if (this._uvDirty)
            this.updateUVs();
    };
    PrimitivePrefabBase.prototype._pCreateObject = function () {
        var sprite = new Sprite_1.Sprite(this._material);
        sprite.graphics.addGraphic(this._elements);
        sprite._iSourcePrefab = this;
        return sprite;
    };
    PrimitivePrefabBase.assetType = "[asset PrimitivePrefab]";
    return PrimitivePrefabBase;
}(PrefabBase_1.PrefabBase));
exports.PrimitivePrefabBase = PrimitivePrefabBase;

},{"../display/Sprite":"awayjs-display/lib/display/Sprite","../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../graphics/LineElements":"awayjs-display/lib/graphics/LineElements","../graphics/TriangleElements":"awayjs-display/lib/graphics/TriangleElements","../prefabs/PrefabBase":"awayjs-display/lib/prefabs/PrefabBase","awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/errors/AbstractMethodError":undefined}],"awayjs-display/lib/prefabs/PrimitiveSpherePrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsType_1 = require("../graphics/ElementsType");
var PrimitivePrefabBase_1 = require("../prefabs/PrimitivePrefabBase");
/**
 * A UV Sphere primitive sprite.
 */
var PrimitiveSpherePrefab = (function (_super) {
    __extends(PrimitiveSpherePrefab, _super);
    /**
     * Creates a new Sphere object.
     *
     * @param radius The radius of the sphere.
     * @param segmentsW Defines the number of horizontal segments that make up the sphere.
     * @param segmentsH Defines the number of vertical segments that make up the sphere.
     * @param yUp Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
     */
    function PrimitiveSpherePrefab(material, elementsType, radius, segmentsW, segmentsH, yUp) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (radius === void 0) { radius = 50; }
        if (segmentsW === void 0) { segmentsW = 16; }
        if (segmentsH === void 0) { segmentsH = 12; }
        if (yUp === void 0) { yUp = true; }
        _super.call(this, material, elementsType);
        this._radius = radius;
        this._segmentsW = segmentsW;
        this._segmentsH = segmentsH;
        this._yUp = yUp;
    }
    Object.defineProperty(PrimitiveSpherePrefab.prototype, "radius", {
        /**
         * The radius of the sphere.
         */
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveSpherePrefab.prototype, "segmentsW", {
        /**
         * Defines the number of horizontal segments that make up the sphere. Defaults to 16.
         */
        get: function () {
            return this._segmentsW;
        },
        set: function (value) {
            this._segmentsW = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveSpherePrefab.prototype, "segmentsH", {
        /**
         * Defines the number of vertical segments that make up the sphere. Defaults to 12.
         */
        get: function () {
            return this._segmentsH;
        },
        set: function (value) {
            this._segmentsH = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveSpherePrefab.prototype, "yUp", {
        /**
         * Defines whether the sphere poles should lay on the Y-axis (true) or on the Z-axis (false).
         */
        get: function () {
            return this._yUp;
        },
        set: function (value) {
            this._yUp = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    PrimitiveSpherePrefab.prototype._pBuildGraphics = function (target, elementsType) {
        var indices;
        var positions;
        var normals;
        var tangents;
        var i;
        var j;
        var vidx, fidx; // indices
        var comp1;
        var comp2;
        var numVertices;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            numVertices = (this._segmentsH + 1) * (this._segmentsW + 1);
            if (numVertices == triangleGraphics.numVertices && triangleGraphics.indices != null) {
                indices = triangleGraphics.indices.get(triangleGraphics.numElements);
                positions = triangleGraphics.positions.get(numVertices);
                normals = triangleGraphics.normals.get(numVertices);
                tangents = triangleGraphics.tangents.get(numVertices);
            }
            else {
                indices = new Uint16Array((this._segmentsH - 1) * this._segmentsW * 6);
                positions = new Float32Array(numVertices * 3);
                normals = new Float32Array(numVertices * 3);
                tangents = new Float32Array(numVertices * 3);
                this._pInvalidateUVs();
            }
            vidx = 0;
            fidx = 0;
            var startIndex;
            var t1;
            var t2;
            for (j = 0; j <= this._segmentsH; ++j) {
                startIndex = vidx;
                var horangle = Math.PI * j / this._segmentsH;
                var z = -this._radius * Math.cos(horangle);
                var ringradius = this._radius * Math.sin(horangle);
                for (i = 0; i <= this._segmentsW; ++i) {
                    var verangle = 2 * Math.PI * i / this._segmentsW;
                    var x = ringradius * Math.cos(verangle);
                    var y = ringradius * Math.sin(verangle);
                    var normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                    var tanLen = Math.sqrt(y * y + x * x);
                    if (this._yUp) {
                        t1 = 0;
                        t2 = tanLen > .007 ? x / tanLen : 0;
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        t1 = tanLen > .007 ? x / tanLen : 0;
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this._segmentsW) {
                        positions[vidx] = positions[startIndex];
                        positions[vidx + 1] = positions[startIndex + 1];
                        positions[vidx + 2] = positions[startIndex + 2];
                        normals[vidx] = normals[startIndex] + (x * normLen) * .5;
                        normals[vidx + 1] = normals[startIndex + 1] + (comp1 * normLen) * .5;
                        normals[vidx + 2] = normals[startIndex + 2] + (comp2 * normLen) * .5;
                        tangents[vidx] = tanLen > .007 ? -y / tanLen : 1;
                        tangents[vidx + 1] = t1;
                        tangents[vidx + 2] = t2;
                    }
                    else {
                        positions[vidx] = x;
                        positions[vidx + 1] = comp1;
                        positions[vidx + 2] = comp2;
                        normals[vidx] = x * normLen;
                        normals[vidx + 1] = comp1 * normLen;
                        normals[vidx + 2] = comp2 * normLen;
                        tangents[vidx] = tanLen > .007 ? -y / tanLen : 1;
                        tangents[vidx + 1] = t1;
                        tangents[vidx + 2] = t2;
                    }
                    if (i > 0 && j > 0) {
                        var a = (this._segmentsW + 1) * j + i;
                        var b = (this._segmentsW + 1) * j + i - 1;
                        var c = (this._segmentsW + 1) * (j - 1) + i - 1;
                        var d = (this._segmentsW + 1) * (j - 1) + i;
                        if (j == this._segmentsH) {
                            positions[vidx] = positions[startIndex];
                            positions[vidx + 1] = positions[startIndex + 1];
                            positions[vidx + 2] = positions[startIndex + 2];
                            indices[fidx++] = a;
                            indices[fidx++] = c;
                            indices[fidx++] = d;
                        }
                        else if (j == 1) {
                            indices[fidx++] = a;
                            indices[fidx++] = b;
                            indices[fidx++] = c;
                        }
                        else {
                            indices[fidx++] = a;
                            indices[fidx++] = b;
                            indices[fidx++] = c;
                            indices[fidx++] = a;
                            indices[fidx++] = c;
                            indices[fidx++] = d;
                        }
                    }
                    vidx += 3;
                }
            }
            triangleGraphics.setIndices(indices);
            triangleGraphics.setPositions(positions);
            triangleGraphics.setNormals(normals);
            triangleGraphics.setTangents(tangents);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
            var lineGraphics = target;
            var numSegments = this._segmentsH * this._segmentsW * 2 + this._segmentsW;
            var positions = new Float32Array(numSegments * 6);
            var thickness = new Float32Array(numSegments);
            vidx = 0;
            fidx = 0;
            for (j = 0; j <= this._segmentsH; ++j) {
                var horangle = Math.PI * j / this._segmentsH;
                var z = -this._radius * Math.cos(horangle);
                var ringradius = this._radius * Math.sin(horangle);
                for (i = 0; i <= this._segmentsW; ++i) {
                    var verangle = 2 * Math.PI * i / this._segmentsW;
                    var x = ringradius * Math.cos(verangle);
                    var y = ringradius * Math.sin(verangle);
                    if (this._yUp) {
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i > 0) {
                        //horizonal lines
                        positions[vidx++] = x;
                        positions[vidx++] = comp1;
                        positions[vidx++] = comp2;
                        thickness[fidx++] = 1;
                        //vertical lines
                        if (j > 0) {
                            var addx = (j == 1) ? 3 - (6 * (this._segmentsW - i) + 12 * i) : 3 - this._segmentsW * 12;
                            positions[vidx] = positions[vidx++ + addx];
                            positions[vidx] = positions[vidx++ + addx];
                            positions[vidx] = positions[vidx++ + addx];
                            positions[vidx++] = x;
                            positions[vidx++] = comp1;
                            positions[vidx++] = comp2;
                            thickness[fidx++] = 1;
                        }
                    }
                    //horizonal lines
                    if (i < this._segmentsW) {
                        positions[vidx++] = x;
                        positions[vidx++] = comp1;
                        positions[vidx++] = comp2;
                    }
                }
            }
            // build real data from raw data
            lineGraphics.setPositions(positions);
            lineGraphics.setThickness(thickness);
        }
    };
    /**
     * @inheritDoc
     */
    PrimitiveSpherePrefab.prototype._pBuildUVs = function (target, elementsType) {
        var i, j;
        var numVertices = (this._segmentsH + 1) * (this._segmentsW + 1);
        var uvs;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            numVertices = (this._segmentsH + 1) * (this._segmentsW + 1);
            var triangleGraphics = target;
            if (numVertices == triangleGraphics.numVertices && triangleGraphics.uvs != null) {
                uvs = triangleGraphics.uvs.get(numVertices);
            }
            else {
                uvs = new Float32Array(numVertices * 2);
            }
            var index = 0;
            for (j = 0; j <= this._segmentsH; ++j) {
                for (i = 0; i <= this._segmentsW; ++i) {
                    uvs[index++] = (i / this._segmentsW) * this._scaleU;
                    uvs[index++] = (j / this._segmentsH) * this._scaleV;
                }
            }
            triangleGraphics.setUVs(uvs);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    return PrimitiveSpherePrefab;
}(PrimitivePrefabBase_1.PrimitivePrefabBase));
exports.PrimitiveSpherePrefab = PrimitiveSpherePrefab;

},{"../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase"}],"awayjs-display/lib/prefabs/PrimitiveTorusPrefab":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementsType_1 = require("../graphics/ElementsType");
var PrimitivePrefabBase_1 = require("../prefabs/PrimitivePrefabBase");
/**
 * A UV Cylinder primitive sprite.
 */
var PrimitiveTorusPrefab = (function (_super) {
    __extends(PrimitiveTorusPrefab, _super);
    /**
     * Creates a new <code>Torus</code> object.
     * @param radius The radius of the torus.
     * @param tuebRadius The radius of the inner tube of the torus.
     * @param segmentsR Defines the number of horizontal segments that make up the torus.
     * @param segmentsT Defines the number of vertical segments that make up the torus.
     * @param yUp Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
     */
    function PrimitiveTorusPrefab(material, elementsType, radius, tubeRadius, segmentsR, segmentsT, yUp) {
        if (material === void 0) { material = null; }
        if (elementsType === void 0) { elementsType = "triangle"; }
        if (radius === void 0) { radius = 50; }
        if (tubeRadius === void 0) { tubeRadius = 50; }
        if (segmentsR === void 0) { segmentsR = 16; }
        if (segmentsT === void 0) { segmentsT = 8; }
        if (yUp === void 0) { yUp = true; }
        _super.call(this, material, elementsType);
        this._numVertices = 0;
        this._radius = radius;
        this._tubeRadius = tubeRadius;
        this._segmentsR = segmentsR;
        this._segmentsT = segmentsT;
        this._yUp = yUp;
    }
    Object.defineProperty(PrimitiveTorusPrefab.prototype, "radius", {
        /**
         * The radius of the torus.
         */
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveTorusPrefab.prototype, "tubeRadius", {
        /**
         * The radius of the inner tube of the torus.
         */
        get: function () {
            return this._tubeRadius;
        },
        set: function (value) {
            this._tubeRadius = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveTorusPrefab.prototype, "segmentsR", {
        /**
         * Defines the number of horizontal segments that make up the torus. Defaults to 16.
         */
        get: function () {
            return this._segmentsR;
        },
        set: function (value) {
            this._segmentsR = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveTorusPrefab.prototype, "segmentsT", {
        /**
         * Defines the number of vertical segments that make up the torus. Defaults to 8.
         */
        get: function () {
            return this._segmentsT;
        },
        set: function (value) {
            this._segmentsT = value;
            this._pInvalidatePrimitive();
            this._pInvalidateUVs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveTorusPrefab.prototype, "yUp", {
        /**
         * Defines whether the torus poles should lay on the Y-axis (true) or on the Z-axis (false).
         */
        get: function () {
            return this._yUp;
        },
        set: function (value) {
            this._yUp = value;
            this._pInvalidatePrimitive();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    PrimitiveTorusPrefab.prototype._pBuildGraphics = function (target, elementsType) {
        var indices;
        var positions;
        var normals;
        var tangents;
        var i, j;
        var x, y, z, nx, ny, nz, revolutionAngleR, revolutionAngleT;
        var vidx;
        var fidx;
        var numIndices = 0;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            // evaluate target number of vertices, triangles and indices
            this._numVertices = (this._segmentsT + 1) * (this._segmentsR + 1); // segmentsT + 1 because of closure, segmentsR + 1 because of closure
            numIndices = this._segmentsT * this._segmentsR * 6; // each level has segmentR quads, each of 2 triangles
            // need to initialize raw arrays or can be reused?
            if (this._numVertices == triangleGraphics.numVertices) {
                indices = triangleGraphics.indices.get(triangleGraphics.numElements);
                positions = triangleGraphics.positions.get(this._numVertices);
                normals = triangleGraphics.normals.get(this._numVertices);
                tangents = triangleGraphics.tangents.get(this._numVertices);
            }
            else {
                indices = new Uint16Array(numIndices);
                positions = new Float32Array(this._numVertices * 3);
                normals = new Float32Array(this._numVertices * 3);
                tangents = new Float32Array(this._numVertices * 3);
                this._pInvalidateUVs();
            }
            vidx = 0;
            fidx = 0;
            // evaluate revolution steps
            var revolutionAngleDeltaR = 2 * Math.PI / this._segmentsR;
            var revolutionAngleDeltaT = 2 * Math.PI / this._segmentsT;
            var comp1, comp2;
            var t1, t2, n1, n2;
            var startIndex = 0;
            var nextVertexIndex = 0;
            // surface
            var a, b, c, d, length;
            for (j = 0; j <= this._segmentsT; ++j) {
                startIndex = nextVertexIndex * 3;
                for (i = 0; i <= this._segmentsR; ++i) {
                    // revolution vertex
                    revolutionAngleR = i * revolutionAngleDeltaR;
                    revolutionAngleT = j * revolutionAngleDeltaT;
                    length = Math.cos(revolutionAngleT);
                    nx = length * Math.cos(revolutionAngleR);
                    ny = length * Math.sin(revolutionAngleR);
                    nz = Math.sin(revolutionAngleT);
                    x = this._radius * Math.cos(revolutionAngleR) + this._tubeRadius * nx;
                    y = this._radius * Math.sin(revolutionAngleR) + this._tubeRadius * ny;
                    z = (j == this._segmentsT) ? 0 : this._tubeRadius * nz;
                    if (this._yUp) {
                        n1 = -nz;
                        n2 = ny;
                        t1 = 0;
                        t2 = (length ? nx / length : x / this._radius);
                        comp1 = -z;
                        comp2 = y;
                    }
                    else {
                        n1 = ny;
                        n2 = nz;
                        t1 = (length ? nx / length : x / this._radius);
                        t2 = 0;
                        comp1 = y;
                        comp2 = z;
                    }
                    if (i == this._segmentsR) {
                        positions[vidx] = x;
                        positions[vidx + 1] = positions[startIndex + 1];
                        positions[vidx + 2] = positions[startIndex + 2];
                    }
                    else {
                        positions[vidx] = x;
                        positions[vidx + 1] = comp1;
                        positions[vidx + 2] = comp2;
                    }
                    normals[vidx] = nx;
                    normals[vidx + 1] = n1;
                    normals[vidx + 2] = n2;
                    tangents[vidx] = -(length ? ny / length : y / this._radius);
                    tangents[vidx + 1] = t1;
                    tangents[vidx + 2] = t2;
                    vidx += 3;
                    // close triangle
                    if (i > 0 && j > 0) {
                        a = nextVertexIndex; // current
                        b = nextVertexIndex - 1; // previous
                        c = b - this._segmentsR - 1; // previous of last level
                        d = a - this._segmentsR - 1; // current of last level
                        indices[fidx++] = a;
                        indices[fidx++] = b;
                        indices[fidx++] = c;
                        indices[fidx++] = a;
                        indices[fidx++] = c;
                        indices[fidx++] = d;
                    }
                    nextVertexIndex++;
                }
            }
            // build real data from raw data
            triangleGraphics.setIndices(indices);
            triangleGraphics.setPositions(positions);
            triangleGraphics.setNormals(normals);
            triangleGraphics.setTangents(tangents);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    /**
     * @inheritDoc
     */
    PrimitiveTorusPrefab.prototype._pBuildUVs = function (target, elementsType) {
        var i, j;
        var uvs;
        if (elementsType == ElementsType_1.ElementsType.TRIANGLE) {
            var triangleGraphics = target;
            // need to initialize raw array or can be reused?
            if (triangleGraphics.uvs && this._numVertices == triangleGraphics.numVertices) {
                uvs = triangleGraphics.uvs.get(this._numVertices);
            }
            else {
                uvs = new Float32Array(this._numVertices * 2);
            }
            // current uv component index
            var index = 0;
            // surface
            for (j = 0; j <= this._segmentsT; ++j) {
                for (i = 0; i <= this._segmentsR; ++i) {
                    // revolution vertex
                    uvs[index++] = (i / this._segmentsR) * this._scaleU;
                    uvs[index++] = (j / this._segmentsT) * this._scaleV;
                }
            }
            // build real data from raw data
            triangleGraphics.setUVs(uvs);
        }
        else if (elementsType == ElementsType_1.ElementsType.LINE) {
        }
    };
    return PrimitiveTorusPrefab;
}(PrimitivePrefabBase_1.PrimitivePrefabBase));
exports.PrimitiveTorusPrefab = PrimitiveTorusPrefab;

},{"../graphics/ElementsType":"awayjs-display/lib/graphics/ElementsType","../prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase"}],"awayjs-display/lib/prefabs":[function(require,module,exports){
"use strict";
var PrefabBase_1 = require("./prefabs/PrefabBase");
exports.PrefabBase = PrefabBase_1.PrefabBase;
var PrimitiveCapsulePrefab_1 = require("./prefabs/PrimitiveCapsulePrefab");
exports.PrimitiveCapsulePrefab = PrimitiveCapsulePrefab_1.PrimitiveCapsulePrefab;
var PrimitiveConePrefab_1 = require("./prefabs/PrimitiveConePrefab");
exports.PrimitiveConePrefab = PrimitiveConePrefab_1.PrimitiveConePrefab;
var PrimitiveCubePrefab_1 = require("./prefabs/PrimitiveCubePrefab");
exports.PrimitiveCubePrefab = PrimitiveCubePrefab_1.PrimitiveCubePrefab;
var PrimitiveCylinderPrefab_1 = require("./prefabs/PrimitiveCylinderPrefab");
exports.PrimitiveCylinderPrefab = PrimitiveCylinderPrefab_1.PrimitiveCylinderPrefab;
var PrimitivePlanePrefab_1 = require("./prefabs/PrimitivePlanePrefab");
exports.PrimitivePlanePrefab = PrimitivePlanePrefab_1.PrimitivePlanePrefab;
var PrimitivePolygonPrefab_1 = require("./prefabs/PrimitivePolygonPrefab");
exports.PrimitivePolygonPrefab = PrimitivePolygonPrefab_1.PrimitivePolygonPrefab;
var PrimitivePrefabBase_1 = require("./prefabs/PrimitivePrefabBase");
exports.PrimitivePrefabBase = PrimitivePrefabBase_1.PrimitivePrefabBase;
var PrimitiveSpherePrefab_1 = require("./prefabs/PrimitiveSpherePrefab");
exports.PrimitiveSpherePrefab = PrimitiveSpherePrefab_1.PrimitiveSpherePrefab;
var PrimitiveTorusPrefab_1 = require("./prefabs/PrimitiveTorusPrefab");
exports.PrimitiveTorusPrefab = PrimitiveTorusPrefab_1.PrimitiveTorusPrefab;

},{"./prefabs/PrefabBase":"awayjs-display/lib/prefabs/PrefabBase","./prefabs/PrimitiveCapsulePrefab":"awayjs-display/lib/prefabs/PrimitiveCapsulePrefab","./prefabs/PrimitiveConePrefab":"awayjs-display/lib/prefabs/PrimitiveConePrefab","./prefabs/PrimitiveCubePrefab":"awayjs-display/lib/prefabs/PrimitiveCubePrefab","./prefabs/PrimitiveCylinderPrefab":"awayjs-display/lib/prefabs/PrimitiveCylinderPrefab","./prefabs/PrimitivePlanePrefab":"awayjs-display/lib/prefabs/PrimitivePlanePrefab","./prefabs/PrimitivePolygonPrefab":"awayjs-display/lib/prefabs/PrimitivePolygonPrefab","./prefabs/PrimitivePrefabBase":"awayjs-display/lib/prefabs/PrimitivePrefabBase","./prefabs/PrimitiveSpherePrefab":"awayjs-display/lib/prefabs/PrimitiveSpherePrefab","./prefabs/PrimitiveTorusPrefab":"awayjs-display/lib/prefabs/PrimitiveTorusPrefab"}],"awayjs-display/lib/text/AntiAliasType":[function(require,module,exports){
"use strict";
/**
 * The AntiAliasType class provides values for anti-aliasing in the
 * away.text.TextField class.
 */
var AntiAliasType = (function () {
    function AntiAliasType() {
    }
    /**
     * Sets anti-aliasing to advanced anti-aliasing. Advanced anti-aliasing
     * allows font faces to be rendered at very high quality at small sizes. It
     * is best used with applications that have a lot of small text. Advanced
     * anti-aliasing is not recommended for very large fonts(larger than 48
     * points). This constant is used for the <code>antiAliasType</code> property
     * in the TextField class. Use the syntax
     * <code>AntiAliasType.ADVANCED</code>.
     */
    AntiAliasType.ADVANCED = "advanced";
    /**
     * Sets anti-aliasing to the anti-aliasing that is used in Flash Player 7 and
     * earlier. This setting is recommended for applications that do not have a
     * lot of text. This constant is used for the <code>antiAliasType</code>
     * property in the TextField class. Use the syntax
     * <code>AntiAliasType.NORMAL</code>.
     */
    AntiAliasType.NORMAL = "normal";
    return AntiAliasType;
}());
exports.AntiAliasType = AntiAliasType;

},{}],"awayjs-display/lib/text/Font":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var TesselatedFontTable_1 = require("../text/TesselatedFontTable");
/**
 * GraphicBase wraps a TriangleElements as a scene graph instantiation. A GraphicBase is owned by a Sprite object.
 *
 *
 * @see away.base.TriangleElements
 * @see away.entities.Sprite
 *
 * @class away.base.GraphicBase
 */
var Font = (function (_super) {
    __extends(Font, _super);
    //TODO test shader picking
    //		public get shaderPickingDetails():boolean
    //		{
    //
    //			return this.sourceEntity.shaderPickingDetails;
    //		}
    /**
     * Creates a new TesselatedFont object
     */
    function Font() {
        _super.call(this);
        this._font_styles = new Array();
    }
    Object.defineProperty(Font.prototype, "font_styles", {
        get: function () {
            return this._font_styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Font.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return Font.assetType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Font.prototype.dispose = function () {
    };
    /**
     *Get a font-table for a specific name, or create one if it does not exists.
     */
    Font.prototype.get_font_table = function (style_name) {
        var len = this._font_styles.length;
        for (var i = 0; i < len; ++i) {
            if (this._font_styles[i].name == style_name)
                return this._font_styles[i];
        }
        var font_style = new TesselatedFontTable_1.TesselatedFontTable();
        font_style.name = style_name;
        this._font_styles.push(font_style);
        return font_style;
    };
    Font.assetType = "[asset Font]";
    return Font;
}(AssetBase_1.AssetBase));
exports.Font = Font;

},{"../text/TesselatedFontTable":"awayjs-display/lib/text/TesselatedFontTable","awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/text/GridFitType":[function(require,module,exports){
"use strict";
/**
 * The GridFitType class defines values for grid fitting in the TextField class.
 */
var GridFitType = (function () {
    function GridFitType() {
    }
    /**
     * Doesn't set grid fitting. Horizontal and vertical lines in the glyphs are
     * not forced to the pixel grid. This constant is used in setting the
     * <code>gridFitType</code> property of the TextField class. This is often a
     * good setting for animation or for large font sizes. Use the syntax
     * <code>GridFitType.NONE</code>.
     */
    GridFitType.NONE = "none";
    /**
     * Fits strong horizontal and vertical lines to the pixel grid. This constant
     * is used in setting the <code>gridFitType</code> property of the TextField
     * class. This setting only works for left-justified text fields and acts
     * like the <code>GridFitType.SUBPIXEL</code> constant in static text. This
     * setting generally provides the best readability for left-aligned text. Use
     * the syntax <code>GridFitType.PIXEL</code>.
     */
    GridFitType.PIXEL = "pixel";
    /**
     * Fits strong horizontal and vertical lines to the sub-pixel grid on LCD
     * monitors. (Red, green, and blue are actual pixels on an LCD screen.) This
     * is often a good setting for right-aligned or center-aligned dynamic text,
     * and it is sometimes a useful tradeoff for animation vs. text quality. This
     * constant is used in setting the <code>gridFitType</code> property of the
     * TextField class. Use the syntax <code>GridFitType.SUBPIXEL</code>.
     */
    GridFitType.SUBPIXEL = "subpixel";
    return GridFitType;
}());
exports.GridFitType = GridFitType;

},{}],"awayjs-display/lib/text/TesselatedFontChar":[function(require,module,exports){
"use strict";
/**
 * The TextFormat class represents character formatting information. Use the
 * TextFormat class to create specific text formatting for text fields. You
 * can apply text formatting to both static and dynamic text fields. The
 * properties of the TextFormat class apply to device and embedded fonts.
 * However, for embedded fonts, bold and italic text actually require specific
 * fonts. If you want to display bold or italic text with an embedded font,
 * you need to embed the bold and italic variations of that font.
 *
 * <p> You must use the constructor <code>new TextFormat()</code> to create a
 * TextFormat object before setting its properties. When you apply a
 * TextFormat object to a text field using the
 * <code>TextField.defaultTextFormat</code> property or the
 * <code>TextField.setTextFormat()</code> method, only its defined properties
 * are applied. Use the <code>TextField.defaultTextFormat</code> property to
 * apply formatting BEFORE you add text to the <code>TextField</code>, and the
 * <code>setTextFormat()</code> method to add formatting AFTER you add text to
 * the <code>TextField</code>. The TextFormat properties are <code>null</code>
 * by default because if you don't provide values for the properties, Flash
 * Player uses its own default formatting. The default formatting that Flash
 * Player uses for each property(if property's value is <code>null</code>) is
 * as follows:</p>
 *
 * <p>The default formatting for each property is also described in each
 * property description.</p>
 */
var TesselatedFontChar = (function () {
    function TesselatedFontChar(elements) {
        /**
         * the char_codes that this geom has kerning set for
         */
        this.kerningCharCodes = new Array();
        /**
         * the kerning values per char_code
         */
        this.kerningValues = new Array();
        this.elements = elements;
    }
    return TesselatedFontChar;
}());
exports.TesselatedFontChar = TesselatedFontChar;

},{}],"awayjs-display/lib/text/TesselatedFontTable":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
var TesselatedFontChar_1 = require("../text/TesselatedFontChar");
/**
 * GraphicBase wraps a TriangleElements as a scene graph instantiation. A GraphicBase is owned by a Sprite object.
 *
 *
 * @see away.base.TriangleElements
 * @see away.entities.Sprite
 *
 * @class away.base.GraphicBase
 */
var TesselatedFontTable = (function (_super) {
    __extends(TesselatedFontTable, _super);
    //TODO test shader picking
    //		public get shaderPickingDetails():boolean
    //		{
    //
    //			return this.sourceEntity.shaderPickingDetails;
    //		}
    /**
     * Creates a new TesselatedFont object
     */
    function TesselatedFontTable() {
        _super.call(this);
        this._font_chars = new Array();
        this._font_chars_dic = new Object();
        this._ascent = 0;
        this._descent = 0;
    }
    /**
     *
     */
    TesselatedFontTable.prototype.dispose = function () {
    };
    Object.defineProperty(TesselatedFontTable.prototype, "ascent", {
        get: function () {
            return this._ascent;
        },
        set: function (value) {
            this._ascent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TesselatedFontTable.prototype, "descent", {
        get: function () {
            return this._descent;
        },
        set: function (value) {
            this._descent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TesselatedFontTable.prototype, "offset_x", {
        get: function () {
            return this._offset_x;
        },
        set: function (value) {
            this._offset_x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TesselatedFontTable.prototype, "offset_y", {
        get: function () {
            return this._offset_y;
        },
        set: function (value) {
            this._offset_y = value;
        },
        enumerable: true,
        configurable: true
    });
    TesselatedFontTable.prototype.get_font_chars = function () {
        return this._font_chars;
    };
    TesselatedFontTable.prototype.get_font_em_size = function () {
        return this._font_em_size;
    };
    TesselatedFontTable.prototype.set_whitespace_width = function (value) {
        this._whitespace_width = value;
    };
    TesselatedFontTable.prototype.get_whitespace_width = function () {
        return this._whitespace_width;
    };
    TesselatedFontTable.prototype.set_font_em_size = function (font_em_size) {
        this._font_em_size = font_em_size;
    };
    /**
     *
     */
    TesselatedFontTable.prototype.getChar = function (name) {
        return this._font_chars_dic[name];
    };
    /**
     *
     */
    TesselatedFontTable.prototype.setChar = function (name, elements, char_width) {
        var tesselated_font_char = new TesselatedFontChar_1.TesselatedFontChar(elements);
        tesselated_font_char.char_width = char_width;
        elements.name = name;
        this._font_chars.push(tesselated_font_char);
        this._font_chars_dic[name] = tesselated_font_char;
    };
    return TesselatedFontTable;
}(AssetBase_1.AssetBase));
exports.TesselatedFontTable = TesselatedFontTable;

},{"../text/TesselatedFontChar":"awayjs-display/lib/text/TesselatedFontChar","awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/text/TextFieldAutoSize":[function(require,module,exports){
"use strict";
/**
 * The TextFieldAutoSize class is an enumeration of constant values used in
 * setting the <code>autoSize</code> property of the TextField class.
 */
var TextFieldAutoSize = (function () {
    function TextFieldAutoSize() {
    }
    /**
     * Specifies that the text is to be treated as center-justified text. Any
     * resizing of a single line of a text field is equally distributed to both
     * the right and left sides.
     */
    TextFieldAutoSize.CENTER = "center";
    /**
     * Specifies that the text is to be treated as left-justified text, meaning
     * that the left side of the text field remains fixed and any resizing of a
     * single line is on the right side.
     */
    TextFieldAutoSize.LEFT = "left";
    /**
     * Specifies that no resizing is to occur.
     */
    TextFieldAutoSize.NONE = "none";
    /**
     * Specifies that the text is to be treated as right-justified text, meaning
     * that the right side of the text field remains fixed and any resizing of a
     * single line is on the left side.
     */
    TextFieldAutoSize.RIGHT = "right";
    return TextFieldAutoSize;
}());
exports.TextFieldAutoSize = TextFieldAutoSize;

},{}],"awayjs-display/lib/text/TextFieldType":[function(require,module,exports){
"use strict";
/**
 * The TextFieldType class is an enumeration of constant values used in setting the
 * <code>type</code> property of the TextField class.
 *
 * @see away.entities.TextField#type
 */
var TextFieldType = (function () {
    function TextFieldType() {
    }
    /**
     * Used to specify a <code>dynamic</code> TextField.
     */
    TextFieldType.DYNAMIC = "dynamic";
    /**
     * Used to specify an <code>input</code> TextField.
     */
    TextFieldType.INPUT = "input";
    /**
     * Used to specify an <code>static</code> TextField.
     */
    TextFieldType.STATIC = "input";
    return TextFieldType;
}());
exports.TextFieldType = TextFieldType;

},{}],"awayjs-display/lib/text/TextFormatAlign":[function(require,module,exports){
"use strict";
/**
 * The TextFormatAlign class provides values for text alignment in the
 * TextFormat class.
 */
var TextFormatAlign = (function () {
    function TextFormatAlign() {
        /**
         * Constant; centers the text in the text field. Use the syntax
         * <code>TextFormatAlign.CENTER</code>.
         */
        this.CENTER = "center";
        /**
         * Constant; justifies text within the text field. Use the syntax
         * <code>TextFormatAlign.JUSTIFY</code>.
         */
        this.JUSTIFY = "justify";
        /**
         * Constant; aligns text to the left within the text field. Use the syntax
         * <code>TextFormatAlign.LEFT</code>.
         */
        this.LEFT = "left";
        /**
         * Constant; aligns text to the right within the text field. Use the syntax
         * <code>TextFormatAlign.RIGHT</code>.
         */
        this.RIGHT = "right";
    }
    return TextFormatAlign;
}());
exports.TextFormatAlign = TextFormatAlign;

},{}],"awayjs-display/lib/text/TextFormat":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
/**
 * The TextFormat class represents character formatting information. Use the
 * TextFormat class to create specific text formatting for text fields. You
 * can apply text formatting to both static and dynamic text fields. The
 * properties of the TextFormat class apply to device and embedded fonts.
 * However, for embedded fonts, bold and italic text actually require specific
 * fonts. If you want to display bold or italic text with an embedded font,
 * you need to embed the bold and italic variations of that font.
 *
 * <p> You must use the constructor <code>new TextFormat()</code> to create a
 * TextFormat object before setting its properties. When you apply a
 * TextFormat object to a text field using the
 * <code>TextField.defaultTextFormat</code> property or the
 * <code>TextField.setTextFormat()</code> method, only its defined properties
 * are applied. Use the <code>TextField.defaultTextFormat</code> property to
 * apply formatting BEFORE you add text to the <code>TextField</code>, and the
 * <code>setTextFormat()</code> method to add formatting AFTER you add text to
 * the <code>TextField</code>. The TextFormat properties are <code>null</code>
 * by default because if you don't provide values for the properties, Flash
 * Player uses its own default formatting. The default formatting that Flash
 * Player uses for each property(if property's value is <code>null</code>) is
 * as follows:</p>
 *
 * <p>The default formatting for each property is also described in each
 * property description.</p>
 */
var TextFormat = (function (_super) {
    __extends(TextFormat, _super);
    /**
     * Creates a TextFormat object with the specified properties. You can then
     * change the properties of the TextFormat object to change the formatting of
     * text fields.
     *
     * <p>Any parameter may be set to <code>null</code> to indicate that it is
     * not defined. All of the parameters are optional; any omitted parameters
     * are treated as <code>null</code>.</p>
     *
     * @param font        The name of a font for text as a string.
     * @param size        An integer that indicates the size in pixels.
     * @param color       The color of text using this text format. A number
     *                    containing three 8-bit RGB components; for example,
     *                    0xFF0000 is red, and 0x00FF00 is green.
     * @param bold        A Boolean value that indicates whether the text is
     *                    boldface.
     * @param italic      A Boolean value that indicates whether the text is
     *                    italicized.
     * @param underline   A Boolean value that indicates whether the text is
     *                    underlined.
     * @param url         The URL to which the text in this text format
     *                    hyperlinks. If <code>url</code> is an empty string, the
     *                    text does not have a hyperlink.
     * @param target      The target window where the hyperlink is displayed. If
     *                    the target window is an empty string, the text is
     *                    displayed in the default target window
     *                    <code>_self</code>. If the <code>url</code> parameter
     *                    is set to an empty string or to the value
     *                    <code>null</code>, you can get or set this property,
     *                    but the property will have no effect.
     * @param align       The alignment of the paragraph, as a TextFormatAlign
     *                    value.
     * @param leftMargin  Indicates the left margin of the paragraph, in pixels.
     * @param rightMargin Indicates the right margin of the paragraph, in pixels.
     * @param indent      An integer that indicates the indentation from the left
     *                    margin to the first character in the paragraph.
     * @param leading     A number that indicates the amount of leading vertical
     *                    space between lines.
     */
    function TextFormat(font, size, color, bold, italic, underline, url, link_target, align, leftMargin, rightMargin, indent, leading) {
        if (font === void 0) { font = "Times New Roman"; }
        if (size === void 0) { size = 12; }
        if (color === void 0) { color = 0x000000; }
        if (bold === void 0) { bold = false; }
        if (italic === void 0) { italic = false; }
        if (underline === void 0) { underline = false; }
        if (url === void 0) { url = ""; }
        if (link_target === void 0) { link_target = ""; }
        if (align === void 0) { align = "left"; }
        if (leftMargin === void 0) { leftMargin = 0; }
        if (rightMargin === void 0) { rightMargin = 0; }
        if (indent === void 0) { indent = 0; }
        if (leading === void 0) { leading = 0; }
        _super.call(this);
        /**
         * Specifies custom tab stops as an array of non-negative integers. Each tab
         * stop is specified in pixels. If custom tab stops are not specified
         * (<code>null</code>), the default tab stop is 4(average character width).
         */
        //todo: not used with in tesselated-font-table yet
        this.tabStops = new Array();
        this.font_name = font;
        this.size = size;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.url = url;
        this.link_target = link_target;
        this.align = align;
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
        this.indent = indent;
        this.leading = leading;
    }
    Object.defineProperty(TextFormat.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            return TextFormat.assetType;
        },
        enumerable: true,
        configurable: true
    });
    TextFormat.assetType = "[asset TextFormat]";
    return TextFormat;
}(AssetBase_1.AssetBase));
exports.TextFormat = TextFormat;

},{"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/text/TextInteractionMode":[function(require,module,exports){
"use strict";
/**
 * A class that defines the Interactive mode of a text field object.
 *
 * @see away.entities.TextField#textInteractionMode
 */
var TextInteractionMode = (function () {
    function TextInteractionMode() {
    }
    /**
     * The text field's default interaction mode is NORMAL and it varies across
     * platform. On Desktop, the normal mode implies that the text field is in
     * scrollable + selection mode. On Mobile platforms like Android, normal mode
     * implies that the text field can only be scrolled but the text can not be
     * selected.
     */
    TextInteractionMode.NORMAL = "normal";
    /**
     * On mobile platforms like Android, the text field starts in normal mode
     * (which implies scroll and non-selectable mode). The user can switch to
     * selection mode through the in-built context menu of the text field object.
     */
    TextInteractionMode.SELECTION = "selection";
    return TextInteractionMode;
}());
exports.TextInteractionMode = TextInteractionMode;

},{}],"awayjs-display/lib/text/TextLineMetrics":[function(require,module,exports){
"use strict";
/**
 * The TextLineMetrics class contains information about the text position and
 * measurements of a line of text within a text field. All measurements are in
 * pixels. Objects of this class are returned by the
 * <code>away.entities.TextField.getLineMetrics()</code> method.
 */
var TextLineMetrics = (function () {
    /**
     * Creates a TextLineMetrics object. The TextLineMetrics object contains
     * information about the text metrics of a line of text in a text field.
     * Objects of this class are returned by the
     * away.entities.TextField.getLineMetrics() method.
     *
     * @param x           The left position of the first character in pixels.
     * @param width       The width of the text of the selected lines (not
     *                    necessarily the complete text) in pixels.
     * @param height      The height of the text of the selected lines (not
     *                    necessarily the complete text) in pixels.
     * @param ascent      The length from the baseline to the top of the line
     *                    height in pixels.
     * @param descent     The length from the baseline to the bottom depth of
     *                    the line in pixels.
     * @param leading     The measurement of the vertical distance between the
     *                    lines of text.
     */
    function TextLineMetrics(x, width, height, ascent, descent, leading) {
        if (x === void 0) { x = NaN; }
        if (width === void 0) { width = NaN; }
        if (height === void 0) { height = NaN; }
        if (ascent === void 0) { ascent = NaN; }
        if (descent === void 0) { descent = NaN; }
        if (leading === void 0) { leading = NaN; }
    }
    return TextLineMetrics;
}());
exports.TextLineMetrics = TextLineMetrics;

},{}],"awayjs-display/lib/text":[function(require,module,exports){
"use strict";
var AntiAliasType_1 = require("./text/AntiAliasType");
exports.AntiAliasType = AntiAliasType_1.AntiAliasType;
var Font_1 = require("./text/Font");
exports.Font = Font_1.Font;
var GridFitType_1 = require("./text/GridFitType");
exports.GridFitType = GridFitType_1.GridFitType;
var TesselatedFontChar_1 = require("./text/TesselatedFontChar");
exports.TesselatedFontChar = TesselatedFontChar_1.TesselatedFontChar;
var TesselatedFontTable_1 = require("./text/TesselatedFontTable");
exports.TesselatedFontTable = TesselatedFontTable_1.TesselatedFontTable;
var TextFieldAutoSize_1 = require("./text/TextFieldAutoSize");
exports.TextFieldAutoSize = TextFieldAutoSize_1.TextFieldAutoSize;
var TextFieldType_1 = require("./text/TextFieldType");
exports.TextFieldType = TextFieldType_1.TextFieldType;
var TextFormat_1 = require("./text/TextFormat");
exports.TextFormat = TextFormat_1.TextFormat;
var TextFormatAlign_1 = require("./text/TextFormatAlign");
exports.TextFormatAlign = TextFormatAlign_1.TextFormatAlign;
var TextInteractionMode_1 = require("./text/TextInteractionMode");
exports.TextInteractionMode = TextInteractionMode_1.TextInteractionMode;
var TextLineMetrics_1 = require("./text/TextLineMetrics");
exports.TextLineMetrics = TextLineMetrics_1.TextLineMetrics;

},{"./text/AntiAliasType":"awayjs-display/lib/text/AntiAliasType","./text/Font":"awayjs-display/lib/text/Font","./text/GridFitType":"awayjs-display/lib/text/GridFitType","./text/TesselatedFontChar":"awayjs-display/lib/text/TesselatedFontChar","./text/TesselatedFontTable":"awayjs-display/lib/text/TesselatedFontTable","./text/TextFieldAutoSize":"awayjs-display/lib/text/TextFieldAutoSize","./text/TextFieldType":"awayjs-display/lib/text/TextFieldType","./text/TextFormat":"awayjs-display/lib/text/TextFormat","./text/TextFormatAlign":"awayjs-display/lib/text/TextFormatAlign","./text/TextInteractionMode":"awayjs-display/lib/text/TextInteractionMode","./text/TextLineMetrics":"awayjs-display/lib/text/TextLineMetrics"}],"awayjs-display/lib/textures/MappingMode":[function(require,module,exports){
"use strict";
/**


 */
var MappingMode = (function () {
    function MappingMode() {
    }
    /**
     *
     */
    MappingMode.NORMAL = "normal";
    /**
     *
     */
    MappingMode.LINEAR_GRADIENT = "linearGradient";
    /**
     *
     */
    MappingMode.RADIAL_GRADIENT = "radialGradient";
    return MappingMode;
}());
exports.MappingMode = MappingMode;

},{}],"awayjs-display/lib/textures/Single2DTexture":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ErrorBase_1 = require("awayjs-core/lib/errors/ErrorBase");
var ImageUtils_1 = require("awayjs-core/lib/utils/ImageUtils");
var MappingMode_1 = require("../textures/MappingMode");
var TextureBase_1 = require("../textures/TextureBase");
var Single2DTexture = (function (_super) {
    __extends(Single2DTexture, _super);
    function Single2DTexture(image2D) {
        if (image2D === void 0) { image2D = null; }
        _super.call(this);
        this.setNumImages(1);
        this.image2D = image2D;
        this._mappingMode = MappingMode_1.MappingMode.NORMAL;
    }
    Object.defineProperty(Single2DTexture.prototype, "assetType", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return Single2DTexture.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Single2DTexture.prototype, "mappingMode", {
        get: function () {
            return this._mappingMode;
        },
        set: function (value) {
            if (this._mappingMode == value)
                return;
            this._mappingMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Single2DTexture.prototype, "sampler2D", {
        /**
         *
         * @returns {Image2D}
         */
        get: function () {
            return this._samplers[0];
        },
        set: function (value) {
            if (this._samplers[0] == value)
                return;
            this.setSamplerAt(value, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Single2DTexture.prototype, "image2D", {
        /**
         *
         * @returns {Image2D}
         */
        get: function () {
            return this._images[0];
        },
        set: function (value) {
            if (this._images[0] == value)
                return;
            if (!ImageUtils_1.ImageUtils.isImage2DValid(value))
                throw new ErrorBase_1.ErrorBase("Invalid image2DData: Width and height must be power of 2 and cannot exceed 2048");
            this.setImageAt(value, 0);
        },
        enumerable: true,
        configurable: true
    });
    Single2DTexture.assetType = "[texture Single2DTexture]";
    return Single2DTexture;
}(TextureBase_1.TextureBase));
exports.Single2DTexture = Single2DTexture;

},{"../textures/MappingMode":"awayjs-display/lib/textures/MappingMode","../textures/TextureBase":"awayjs-display/lib/textures/TextureBase","awayjs-core/lib/errors/ErrorBase":undefined,"awayjs-core/lib/utils/ImageUtils":undefined}],"awayjs-display/lib/textures/SingleCubeTexture":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TextureBase_1 = require("../textures/TextureBase");
var SingleCubeTexture = (function (_super) {
    __extends(SingleCubeTexture, _super);
    function SingleCubeTexture(imageCube) {
        if (imageCube === void 0) { imageCube = null; }
        _super.call(this);
        this.setNumImages(1);
        this.imageCube = imageCube;
    }
    Object.defineProperty(SingleCubeTexture.prototype, "assetType", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return SingleCubeTexture.assetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleCubeTexture.prototype, "samplerCube", {
        /**
         *
         * @returns {Image2D}
         */
        get: function () {
            return this._samplers[0];
        },
        set: function (value) {
            if (this._samplers[0] == value)
                return;
            this.setSamplerAt(value, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleCubeTexture.prototype, "imageCube", {
        /**
         *
         * @returns {ImageCube}
         */
        get: function () {
            return this._images[0];
        },
        set: function (value) {
            if (this._images[0] == value)
                return;
            this.setImageAt(value, 0);
        },
        enumerable: true,
        configurable: true
    });
    SingleCubeTexture.assetType = "[texture SingleCubeTexture]";
    return SingleCubeTexture;
}(TextureBase_1.TextureBase));
exports.SingleCubeTexture = SingleCubeTexture;

},{"../textures/TextureBase":"awayjs-display/lib/textures/TextureBase"}],"awayjs-display/lib/textures/TextureBase":[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AssetBase_1 = require("awayjs-core/lib/library/AssetBase");
/**
 *
 */
var TextureBase = (function (_super) {
    __extends(TextureBase, _super);
    /**
     *
     */
    function TextureBase() {
        _super.call(this);
        this._numImages = 0;
        this._images = new Array();
        this._samplers = new Array();
    }
    TextureBase.prototype.getNumImages = function () {
        return this._numImages;
    };
    TextureBase.prototype.setNumImages = function (value) {
        if (this._numImages == value)
            return;
        this._numImages = value;
        this._images.length = value;
        this._samplers.length = value;
        this.invalidate();
    };
    TextureBase.prototype.getImageAt = function (index) {
        return this._images[index];
    };
    TextureBase.prototype.setImageAt = function (image, index) {
        this._images[index] = image;
        this.invalidate();
    };
    TextureBase.prototype.getSamplerAt = function (index) {
        return this._samplers[index];
    };
    TextureBase.prototype.setSamplerAt = function (sampler, index) {
        this._samplers[index] = sampler;
        this.invalidate();
    };
    return TextureBase;
}(AssetBase_1.AssetBase));
exports.TextureBase = TextureBase;

},{"awayjs-core/lib/library/AssetBase":undefined}],"awayjs-display/lib/textures":[function(require,module,exports){
"use strict";
var MappingMode_1 = require("./textures/MappingMode");
exports.MappingMode = MappingMode_1.MappingMode;
var Single2DTexture_1 = require("./textures/Single2DTexture");
exports.Single2DTexture = Single2DTexture_1.Single2DTexture;
var SingleCubeTexture_1 = require("./textures/SingleCubeTexture");
exports.SingleCubeTexture = SingleCubeTexture_1.SingleCubeTexture;
var TextureBase_1 = require("./textures/TextureBase");
exports.TextureBase = TextureBase_1.TextureBase;

},{"./textures/MappingMode":"awayjs-display/lib/textures/MappingMode","./textures/Single2DTexture":"awayjs-display/lib/textures/Single2DTexture","./textures/SingleCubeTexture":"awayjs-display/lib/textures/SingleCubeTexture","./textures/TextureBase":"awayjs-display/lib/textures/TextureBase"}],"awayjs-display/lib/utils/Cast":[function(require,module,exports){
"use strict";
var Image2D_1 = require("awayjs-core/lib/image/Image2D");
var ByteArray_1 = require("awayjs-core/lib/utils/ByteArray");
var CastError_1 = require("../errors/CastError");
var Single2DTexture_1 = require("../textures/Single2DTexture");
/**
 * Helper class for casting assets to usable objects
 */
var Cast = (function () {
    function Cast() {
    }
    Cast.string = function (data) {
        if (typeof (data) == 'function')
            data = new data;
        if (typeof (data) == 'string')
            return data;
        return data;
    };
    Cast.byteArray = function (data) {
        if (typeof (data) == 'function')
            data = new data;
        if (data instanceof ByteArray_1.ByteArray)
            return data;
        return data;
    };
    //        public static xml(data:any):XML
    //        {
    //            if (typeof(data) == 'function')
    //                data = new data;
    //
    //            if (data is XML)
    //                return data;
    //
    //            return XML(data);
    //        }
    Cast.isHex = function (str) {
        var length = str.length;
        for (var i = 0; i < length; ++i) {
            if (this._hexChars.indexOf(str.charAt(i)) == -1)
                return false;
        }
        return true;
    };
    Cast.tryColor = function (data) {
        if (typeof (data) == 'number' /*uint*/)
            return Math.floor(data);
        if (typeof (data) == 'string') {
            if (data == "random")
                return Math.floor(Math.random() * 0x1000000);
            if (this._colorNames == null) {
                this._colorNames = new Object();
                this._colorNames["steelblue"] = 0x4682B4;
                this._colorNames["royalblue"] = 0x041690;
                this._colorNames["cornflowerblue"] = 0x6495ED;
                this._colorNames["lightsteelblue"] = 0xB0C4DE;
                this._colorNames["mediumslateblue"] = 0x7B68EE;
                this._colorNames["slateblue"] = 0x6A5ACD;
                this._colorNames["darkslateblue"] = 0x483D8B;
                this._colorNames["midnightblue"] = 0x191970;
                this._colorNames["navy"] = 0x000080;
                this._colorNames["darkblue"] = 0x00008B;
                this._colorNames["mediumblue"] = 0x0000CD;
                this._colorNames["blue"] = 0x0000FF;
                this._colorNames["dodgerblue"] = 0x1E90FF;
                this._colorNames["deepskyblue"] = 0x00BFFF;
                this._colorNames["lightskyblue"] = 0x87CEFA;
                this._colorNames["skyblue"] = 0x87CEEB;
                this._colorNames["lightblue"] = 0xADD8E6;
                this._colorNames["powderblue"] = 0xB0E0E6;
                this._colorNames["azure"] = 0xF0FFFF;
                this._colorNames["lightcyan"] = 0xE0FFFF;
                this._colorNames["paleturquoise"] = 0xAFEEEE;
                this._colorNames["mediumturquoise"] = 0x48D1CC;
                this._colorNames["lightseagreen"] = 0x20B2AA;
                this._colorNames["darkcyan"] = 0x008B8B;
                this._colorNames["teal"] = 0x008080;
                this._colorNames["cadetblue"] = 0x5F9EA0;
                this._colorNames["darkturquoise"] = 0x00CED1;
                this._colorNames["aqua"] = 0x00FFFF;
                this._colorNames["cyan"] = 0x00FFFF;
                this._colorNames["turquoise"] = 0x40E0D0;
                this._colorNames["aquamarine"] = 0x7FFFD4;
                this._colorNames["mediumaquamarine"] = 0x66CDAA;
                this._colorNames["darkseagreen"] = 0x8FBC8F;
                this._colorNames["mediumseagreen"] = 0x3CB371;
                this._colorNames["seagreen"] = 0x2E8B57;
                this._colorNames["darkgreen"] = 0x006400;
                this._colorNames["green"] = 0x008000;
                this._colorNames["forestgreen"] = 0x228B22;
                this._colorNames["limegreen"] = 0x32CD32;
                this._colorNames["lime"] = 0x00FF00;
                this._colorNames["chartreuse"] = 0x7FFF00;
                this._colorNames["lawngreen"] = 0x7CFC00;
                this._colorNames["greenyellow"] = 0xADFF2F;
                this._colorNames["yellowgreen"] = 0x9ACD32;
                this._colorNames["palegreen"] = 0x98FB98;
                this._colorNames["lightgreen"] = 0x90EE90;
                this._colorNames["springgreen"] = 0x00FF7F;
                this._colorNames["mediumspringgreen"] = 0x00FA9A;
                this._colorNames["darkolivegreen"] = 0x556B2F;
                this._colorNames["olivedrab"] = 0x6B8E23;
                this._colorNames["olive"] = 0x808000;
                this._colorNames["darkkhaki"] = 0xBDB76B;
                this._colorNames["darkgoldenrod"] = 0xB8860B;
                this._colorNames["goldenrod"] = 0xDAA520;
                this._colorNames["gold"] = 0xFFD700;
                this._colorNames["yellow"] = 0xFFFF00;
                this._colorNames["khaki"] = 0xF0E68C;
                this._colorNames["palegoldenrod"] = 0xEEE8AA;
                this._colorNames["blanchedalmond"] = 0xFFEBCD;
                this._colorNames["moccasin"] = 0xFFE4B5;
                this._colorNames["wheat"] = 0xF5DEB3;
                this._colorNames["navajowhite"] = 0xFFDEAD;
                this._colorNames["burlywood"] = 0xDEB887;
                this._colorNames["tan"] = 0xD2B48C;
                this._colorNames["rosybrown"] = 0xBC8F8F;
                this._colorNames["sienna"] = 0xA0522D;
                this._colorNames["saddlebrown"] = 0x8B4513;
                this._colorNames["chocolate"] = 0xD2691E;
                this._colorNames["peru"] = 0xCD853F;
                this._colorNames["sandybrown"] = 0xF4A460;
                this._colorNames["darkred"] = 0x8B0000;
                this._colorNames["maroon"] = 0x800000;
                this._colorNames["brown"] = 0xA52A2A;
                this._colorNames["firebrick"] = 0xB22222;
                this._colorNames["indianred"] = 0xCD5C5C;
                this._colorNames["lightcoral"] = 0xF08080;
                this._colorNames["salmon"] = 0xFA8072;
                this._colorNames["darksalmon"] = 0xE9967A;
                this._colorNames["lightsalmon"] = 0xFFA07A;
                this._colorNames["coral"] = 0xFF7F50;
                this._colorNames["tomato"] = 0xFF6347;
                this._colorNames["darkorange"] = 0xFF8C00;
                this._colorNames["orange"] = 0xFFA500;
                this._colorNames["orangered"] = 0xFF4500;
                this._colorNames["crimson"] = 0xDC143C;
                this._colorNames["red"] = 0xFF0000;
                this._colorNames["deeppink"] = 0xFF1493;
                this._colorNames["fuchsia"] = 0xFF00FF;
                this._colorNames["magenta"] = 0xFF00FF;
                this._colorNames["hotpink"] = 0xFF69B4;
                this._colorNames["lightpink"] = 0xFFB6C1;
                this._colorNames["pink"] = 0xFFC0CB;
                this._colorNames["palevioletred"] = 0xDB7093;
                this._colorNames["mediumvioletred"] = 0xC71585;
                this._colorNames["purple"] = 0x800080;
                this._colorNames["darkmagenta"] = 0x8B008B;
                this._colorNames["mediumpurple"] = 0x9370DB;
                this._colorNames["blueviolet"] = 0x8A2BE2;
                this._colorNames["indigo"] = 0x4B0082;
                this._colorNames["darkviolet"] = 0x9400D3;
                this._colorNames["darkorchid"] = 0x9932CC;
                this._colorNames["mediumorchid"] = 0xBA55D3;
                this._colorNames["orchid"] = 0xDA70D6;
                this._colorNames["violet"] = 0xEE82EE;
                this._colorNames["plum"] = 0xDDA0DD;
                this._colorNames["thistle"] = 0xD8BFD8;
                this._colorNames["lavender"] = 0xE6E6FA;
                this._colorNames["ghostwhite"] = 0xF8F8FF;
                this._colorNames["aliceblue"] = 0xF0F8FF;
                this._colorNames["mintcream"] = 0xF5FFFA;
                this._colorNames["honeydew"] = 0xF0FFF0;
                this._colorNames["lightgoldenrodyellow"] = 0xFAFAD2;
                this._colorNames["lemonchiffon"] = 0xFFFACD;
                this._colorNames["cornsilk"] = 0xFFF8DC;
                this._colorNames["lightyellow"] = 0xFFFFE0;
                this._colorNames["ivory"] = 0xFFFFF0;
                this._colorNames["floralwhite"] = 0xFFFAF0;
                this._colorNames["linen"] = 0xFAF0E6;
                this._colorNames["oldlace"] = 0xFDF5E6;
                this._colorNames["antiquewhite"] = 0xFAEBD7;
                this._colorNames["bisque"] = 0xFFE4C4;
                this._colorNames["peachpuff"] = 0xFFDAB9;
                this._colorNames["papayawhip"] = 0xFFEFD5;
                this._colorNames["beige"] = 0xF5F5DC;
                this._colorNames["seashell"] = 0xFFF5EE;
                this._colorNames["lavenderblush"] = 0xFFF0F5;
                this._colorNames["mistyrose"] = 0xFFE4E1;
                this._colorNames["snow"] = 0xFFFAFA;
                this._colorNames["white"] = 0xFFFFFF;
                this._colorNames["whitesmoke"] = 0xF5F5F5;
                this._colorNames["gainsboro"] = 0xDCDCDC;
                this._colorNames["lightgrey"] = 0xD3D3D3;
                this._colorNames["silver"] = 0xC0C0C0;
                this._colorNames["darkgrey"] = 0xA9A9A9;
                this._colorNames["grey"] = 0x808080;
                this._colorNames["lightslategrey"] = 0x778899;
                this._colorNames["slategrey"] = 0x708090;
                this._colorNames["dimgrey"] = 0x696969;
                this._colorNames["darkslategrey"] = 0x2F4F4F;
                this._colorNames["black"] = 0x000000;
                this._colorNames["transparent"] = 0xFF000000;
            }
            if (this._colorNames[data] != null)
                return this._colorNames[data];
            if ((data.length == 6) && this.isHex(data))
                return parseInt("0x" + data);
        }
        return null;
    };
    Cast.color = function (data) {
        var result = this.tryColor(data);
        if (result == null)
            throw new CastError_1.CastError("Can't cast to color: " + data);
        return result;
    };
    Cast.tryClass = function (name) {
        if (this._notClasses[name])
            return name;
        var result = this._classes[name];
        if (result != null)
            return result;
        try {
            result = window[name];
            this._classes[name] = result;
            return result;
        }
        catch (e /*ReferenceError*/) {
        }
        this._notClasses[name] = true;
        return name;
    };
    Cast.image2D = function (data) {
        if (data == null)
            return null;
        if (typeof (data) == 'string')
            data = this.tryClass(data);
        if (typeof (data) == 'function') {
            try {
                data = new data();
            }
            catch (e /*ArgumentError*/) {
                data = new data(0, 0);
            }
        }
        if (data instanceof Image2D_1.Image2D)
            return data;
        if (data instanceof Single2DTexture_1.Single2DTexture)
            data = data.image2D;
        throw new CastError_1.CastError("Can't cast to BitmapImage2D: " + data);
    };
    Cast.bitmapTexture = function (data) {
        if (data == null)
            return null;
        if (typeof (data) == 'string')
            data = this.tryClass(data);
        if (typeof (data) == 'function') {
            try {
                data = new data();
            }
            catch (e /*ArgumentError*/) {
                data = new data(0, 0);
            }
        }
        if (data instanceof Single2DTexture_1.Single2DTexture)
            return data;
        try {
            var bmd = Cast.image2D(data);
            return new Single2DTexture_1.Single2DTexture(bmd);
        }
        catch (e /*CastError*/) {
        }
        throw new CastError_1.CastError("Can't cast to Single2DTexture: " + data);
    };
    Cast._hexChars = "0123456789abcdefABCDEF";
    Cast._notClasses = new Object();
    Cast._classes = new Object();
    return Cast;
}());
exports.Cast = Cast;

},{"../errors/CastError":"awayjs-display/lib/errors/CastError","../textures/Single2DTexture":"awayjs-display/lib/textures/Single2DTexture","awayjs-core/lib/image/Image2D":undefined,"awayjs-core/lib/utils/ByteArray":undefined}],"awayjs-display/lib/utils/ElementsUtils":[function(require,module,exports){
"use strict";
var AttributesBuffer_1 = require("awayjs-core/lib/attributes/AttributesBuffer");
var Float3Attributes_1 = require("awayjs-core/lib/attributes/Float3Attributes");
var Float4Attributes_1 = require("awayjs-core/lib/attributes/Float4Attributes");
var Byte4Attributes_1 = require("awayjs-core/lib/attributes/Byte4Attributes");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var Box_1 = require("awayjs-core/lib/geom/Box");
var Sphere_1 = require("awayjs-core/lib/geom/Sphere");
var HitTestCache_1 = require("../graphics/HitTestCache");
var ElementsUtils = (function () {
    function ElementsUtils() {
    }
    ElementsUtils.generateFaceNormals = function (indexAttributes, positionAttributes, output, count, offset) {
        if (offset === void 0) { offset = 0; }
        var indices = indexAttributes.get(count, offset);
        var positions = positionAttributes.get(positionAttributes.count);
        if (output == null)
            output = new Float4Attributes_1.Float4Attributes(count + offset);
        else if (output.count < count + offset)
            output.count = count + offset;
        var indexDim = indexAttributes.dimensions;
        var positionDim = positionAttributes.dimensions;
        var faceNormals = output.get(count, offset);
        //multiply by dimension to get index length
        count *= indexDim;
        var i = 0;
        var j = 0;
        var index;
        var x1, x2, x3;
        var y1, y2, y3;
        var z1, z2, z3;
        var dx1, dy1, dz1;
        var dx2, dy2, dz2;
        var cx, cy, cz;
        var d;
        if (positionDim == 3) {
            while (i < count) {
                index = indices[i++] * 3;
                x1 = positions[index];
                y1 = positions[index + 1];
                z1 = positions[index + 2];
                index = indices[i++] * 3;
                x2 = positions[index];
                y2 = positions[index + 1];
                z2 = positions[index + 2];
                index = indices[i++] * 3;
                x3 = positions[index];
                y3 = positions[index + 1];
                z3 = positions[index + 2];
                dx1 = x3 - x1;
                dy1 = y3 - y1;
                dz1 = z3 - z1;
                dx2 = x2 - x1;
                dy2 = y2 - y1;
                dz2 = z2 - z1;
                cx = dz1 * dy2 - dy1 * dz2;
                cy = dx1 * dz2 - dz1 * dx2;
                cz = dy1 * dx2 - dx1 * dy2;
                d = Math.sqrt(cx * cx + cy * cy + cz * cz);
                // length of cross product = 2*triangle area
                faceNormals[j++] = cx;
                faceNormals[j++] = cy;
                faceNormals[j++] = cz;
                faceNormals[j++] = d;
            }
        }
        else if (positionDim == 2) {
            while (i < count) {
                faceNormals[j++] = 0;
                faceNormals[j++] = 0;
                faceNormals[j++] = 1;
                faceNormals[j++] = 1;
                i += 3;
            }
        }
        output.set(faceNormals, offset);
        return output;
    };
    ElementsUtils.generateNormals = function (indexAttributes, faceNormalAttributes, output, concatenatedBuffer) {
        var indices = indexAttributes.get(indexAttributes.count);
        var faceNormals = faceNormalAttributes.get(faceNormalAttributes.count);
        if (output == null)
            output = new Float3Attributes_1.Float3Attributes(concatenatedBuffer);
        var indexDim = indexAttributes.dimensions;
        var outputDim = output.dimensions;
        var normals = output.get(output.count);
        var i = 0;
        var len = output.count * outputDim;
        //clear normal values
        while (i < len) {
            normals[i++] = 0;
            normals[i++] = 0;
            normals[i++] = 0;
        }
        i = 0;
        len = indexAttributes.count * indexDim;
        var index;
        var f1 = 0;
        var f2 = 1;
        var f3 = 2;
        //collect face normals
        while (i < len) {
            index = indices[i++] * outputDim;
            normals[index] += faceNormals[f1];
            normals[index + 1] += faceNormals[f2];
            normals[index + 2] += faceNormals[f3];
            index = indices[i++] * outputDim;
            normals[index] += faceNormals[f1];
            normals[index + 1] += faceNormals[f2];
            normals[index + 2] += faceNormals[f3];
            index = indices[i++] * outputDim;
            normals[index] += faceNormals[f1];
            normals[index + 1] += faceNormals[f2];
            normals[index + 2] += faceNormals[f3];
            f1 += 4;
            f2 += 4;
            f3 += 4;
        }
        i = 0;
        len = output.count * outputDim;
        var vx;
        var vy;
        var vz;
        var d;
        //normalise normals collections
        while (i < len) {
            vx = normals[i];
            vy = normals[i + 1];
            vz = normals[i + 2];
            d = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
            normals[i++] = vx * d;
            normals[i++] = vy * d;
            normals[i++] = vz * d;
        }
        output.set(normals);
        return output;
    };
    ElementsUtils.generateFaceTangents = function (indexAttributes, positionAttributes, uvAttributes, output, count, offset, useFaceWeights) {
        if (offset === void 0) { offset = 0; }
        if (useFaceWeights === void 0) { useFaceWeights = false; }
        var indices = indexAttributes.get(count, offset);
        var positions = positionAttributes.get(positionAttributes.count);
        var uvs = uvAttributes.get(uvAttributes.count);
        if (output == null)
            output = new Float3Attributes_1.Float3Attributes(count + offset);
        else if (output.count < count + offset)
            output.count = count + offset;
        var positionDim = positionAttributes.dimensions;
        var uvDim = uvAttributes.dimensions;
        var indexDim = indexAttributes.dimensions;
        var faceTangents = output.get(count, offset);
        var i = 0;
        var index1;
        var index2;
        var index3;
        var v0;
        var v1;
        var v2;
        var dv1;
        var dv2;
        var denom;
        var x0, y0, z0;
        var dx1, dy1, dz1;
        var dx2, dy2, dz2;
        var cx, cy, cz;
        //multiply by dimension to get index length
        count *= indexDim;
        while (i < count) {
            index1 = indices[i];
            index2 = indices[i + 1];
            index3 = indices[i + 2];
            v0 = uvs[index1 * uvDim + 1];
            dv1 = uvs[index2 * uvDim + 1] - v0;
            dv2 = uvs[index3 * uvDim + 1] - v0;
            v0 = index1 * positionDim;
            v1 = index2 * positionDim;
            v2 = index3 * positionDim;
            x0 = positions[v0];
            dx1 = positions[v1] - x0;
            dx2 = positions[v2] - x0;
            cx = dv2 * dx1 - dv1 * dx2;
            y0 = positions[v0 + 1];
            dy1 = positions[v1 + 1] - y0;
            dy2 = positions[v2 + 1] - y0;
            cy = dv2 * dy1 - dv1 * dy2;
            if (positionDim == 3) {
                z0 = positions[v0 + 2];
                dz1 = positions[v1 + 2] - z0;
                dz2 = positions[v2 + 2] - z0;
                cz = dv2 * dz1 - dv1 * dz2;
            }
            else {
                cz = 0;
            }
            denom = 1 / Math.sqrt(cx * cx + cy * cy + cz * cz);
            faceTangents[i++] = denom * cx;
            faceTangents[i++] = denom * cy;
            faceTangents[i++] = denom * cz;
        }
        output.set(faceTangents, offset);
        return output;
    };
    ElementsUtils.generateTangents = function (indexAttributes, faceTangentAttributes, faceNormalAttributes, output, concatenatedBuffer) {
        var indices = indexAttributes.get(indexAttributes.count);
        var faceTangents = faceTangentAttributes.get(faceTangentAttributes.count);
        var faceNormals = faceNormalAttributes.get(faceNormalAttributes.count);
        if (output == null)
            output = new Float3Attributes_1.Float3Attributes(concatenatedBuffer);
        var indexDim = indexAttributes.dimensions;
        var outputDim = output.dimensions;
        var tangents = output.get(output.count);
        var i = 0;
        var len = output.count * outputDim;
        //clear tangent values
        while (i < len) {
            tangents[i++] = 0;
            tangents[i++] = 0;
            tangents[i++] = 0;
        }
        var weight;
        var index;
        var f1 = 0;
        var f2 = 1;
        var f3 = 2;
        var f4 = 3;
        i = 0;
        len = indexAttributes.count * indexDim;
        //collect face tangents
        while (i < len) {
            weight = faceNormals[f4];
            index = indices[i++] * outputDim;
            tangents[index++] += faceTangents[f1] * weight;
            tangents[index++] += faceTangents[f2] * weight;
            tangents[index] += faceTangents[f3] * weight;
            index = indices[i++] * outputDim;
            tangents[index++] += faceTangents[f1] * weight;
            tangents[index++] += faceTangents[f2] * weight;
            tangents[index] += faceTangents[f3] * weight;
            index = indices[i++] * outputDim;
            tangents[index++] += faceTangents[f1] * weight;
            tangents[index++] += faceTangents[f2] * weight;
            tangents[index] += faceTangents[f3] * weight;
            f1 += 3;
            f2 += 3;
            f3 += 3;
            f4 += 4;
        }
        i = 0;
        len = output.count * outputDim;
        var vx;
        var vy;
        var vz;
        var d;
        //normalise tangents collections
        while (i < len) {
            vx = tangents[i];
            vy = tangents[i + 1];
            vz = tangents[i + 2];
            d = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
            tangents[i++] = vx * d;
            tangents[i++] = vy * d;
            tangents[i++] = vz * d;
        }
        output.set(tangents);
        return output;
    };
    ElementsUtils.generateColors = function (indexAttributes, output, concatenatedBuffer, count, offset) {
        if (offset === void 0) { offset = 0; }
        if (output == null)
            output = new Byte4Attributes_1.Byte4Attributes(concatenatedBuffer);
        var index = 0;
        var colors = new Uint8Array(count * 4);
        while (index < count * 4) {
            if (index / 4 & 1) {
                colors[index] = 0xFF;
                colors[index + 1] = 0xFF;
                colors[index + 2] = 0xFF;
                colors[index + 3] = 0xFF;
            }
            else {
                colors[index] = 0xFF;
                colors[index + 1] = 0xFF;
                colors[index + 2] = 0xFF;
                colors[index + 3] = 0xFF;
            }
            index += 4;
        }
        output.set(colors, offset);
        return output;
    };
    ElementsUtils.scaleUVs = function (scaleU, scaleV, output, count, offset) {
        if (offset === void 0) { offset = 0; }
        if (output.count < count + offset)
            output.count = count + offset;
        var outputDim = output.dimensions;
        var uvs = output.get(count, offset);
        var i = 0;
        var j = 0;
        var len = count * outputDim;
        while (i < len) {
            uvs[i++] *= scaleU;
            uvs[i++] *= scaleV;
        }
        output.set(uvs, offset);
    };
    ElementsUtils.scale = function (scale, output, count, offset) {
        if (offset === void 0) { offset = 0; }
        if (output.count < count + offset)
            output.count = count + offset;
        var outputDim = output.dimensions;
        var positions = output.get(count, offset);
        var i = 0;
        var j = 0;
        var len = count * outputDim;
        while (i < len) {
            positions[i++] *= scale;
            positions[i++] *= scale;
            positions[i++] *= scale;
        }
        output.set(positions, offset);
    };
    ElementsUtils.applyTransformation = function (transform, positionAttributes, normalAttributes, tangentAttributes, count, offset) {
        if (offset === void 0) { offset = 0; }
        //todo: make this compatible with 2-dimensional positions
        var positions = positionAttributes.get(count, offset);
        var positionDim = positionAttributes.dimensions;
        var normals;
        var normalDim;
        if (normalAttributes) {
            normals = normalAttributes.get(count, offset);
            normalDim = normalAttributes.dimensions;
        }
        var tangents;
        var tangentDim;
        if (tangentAttributes) {
            tangents = tangentAttributes.get(count, offset);
            tangentDim = tangentAttributes.dimensions;
        }
        var i;
        var i1;
        var i2;
        var vector = new Vector3D_1.Vector3D();
        var invTranspose;
        if (normalAttributes || tangentAttributes) {
            invTranspose = transform.clone();
            invTranspose.invert();
            invTranspose.transpose();
        }
        var vi0 = 0;
        var ni0 = 0;
        var ti0 = 0;
        for (i = 0; i < count; ++i) {
            // bake position
            i1 = vi0 + 1;
            i2 = vi0 + 2;
            vector.x = positions[vi0];
            vector.y = positions[i1];
            vector.z = positions[i2];
            vector = transform.transformVector(vector);
            positions[vi0] = vector.x;
            positions[i1] = vector.y;
            positions[i2] = vector.z;
            vi0 += positionDim;
            if (normals) {
                // bake normal
                i1 = ni0 + 1;
                i2 = ni0 + 2;
                vector.x = normals[ni0];
                vector.y = normals[i1];
                vector.z = normals[i2];
                vector = invTranspose.deltaTransformVector(vector);
                vector.normalize();
                normals[ni0] = vector.x;
                normals[i1] = vector.y;
                normals[i2] = vector.z;
                ni0 += normalDim;
            }
            if (tangents) {
                // bake tangent
                i1 = ti0 + 1;
                i2 = ti0 + 2;
                vector.x = tangents[ti0];
                vector.y = tangents[i1];
                vector.z = tangents[i2];
                vector = invTranspose.deltaTransformVector(vector);
                vector.normalize();
                tangents[ti0] = vector.x;
                tangents[i1] = vector.y;
                tangents[i2] = vector.z;
                ti0 += tangentDim;
            }
        }
        positionAttributes.set(positions, offset);
        if (normalAttributes)
            normalAttributes.set(normals, offset);
        if (tangentAttributes)
            tangentAttributes.set(tangents, offset);
    };
    ElementsUtils.getSubIndices = function (indexAttributes, numVertices, indexMappings, indexOffset) {
        if (indexOffset === void 0) { indexOffset = 0; }
        var buffer = indexAttributes.buffer;
        var numIndices = indexAttributes.length;
        //reset mappings
        indexMappings.length = 0;
        //shortcut for those buffers that fit into the maximum buffer sizes
        if (numIndices < ElementsUtils.LIMIT_INDICES && numVertices < ElementsUtils.LIMIT_VERTS)
            return buffer;
        var i;
        var indices = indexAttributes.get(indexAttributes.count, indexOffset);
        var splitIndices = new Array();
        var indexSwap = ElementsUtils._indexSwap;
        indexSwap.length = numIndices;
        for (i = 0; i < numIndices; i++)
            indexSwap[i] = -1;
        var originalIndex;
        var splitIndex;
        var index = 0;
        var offsetLength = indexOffset * indexAttributes.dimensions;
        // Loop over all triangles
        i = 0;
        while (i < numIndices + offsetLength && i + 1 < ElementsUtils.LIMIT_INDICES && index + 1 < ElementsUtils.LIMIT_VERTS) {
            originalIndex = indices[i];
            if (indexSwap[originalIndex] >= 0) {
                splitIndex = indexSwap[originalIndex];
            }
            else {
                // This vertex does not yet exist in the split list and
                // needs to be copied from the long list.
                splitIndex = index++;
                indexSwap[originalIndex] = splitIndex;
                indexMappings[splitIndex] = originalIndex;
            }
            // Store new index, which may have come from the swap look-up,
            // or from copying a new set of vertex data from the original vector
            splitIndices[i++] = splitIndex;
        }
        buffer = new AttributesBuffer_1.AttributesBuffer(indexAttributes.size * indexAttributes.dimensions, splitIndices.length / indexAttributes.dimensions);
        indexAttributes = indexAttributes.clone(buffer);
        indexAttributes.set(splitIndices);
        return buffer;
    };
    ElementsUtils.getSubVertices = function (vertexBuffer, indexMappings) {
        if (!indexMappings.length)
            return vertexBuffer;
        var stride = vertexBuffer.stride;
        var vertices = vertexBuffer.bufferView;
        var splitVerts = new Uint8Array(indexMappings.length * stride);
        var splitIndex;
        var originalIndex;
        var i = 0;
        var j = 0;
        var len = indexMappings.length;
        for (i = 0; i < len; i++) {
            splitIndex = i * stride;
            originalIndex = indexMappings[i] * stride;
            for (j = 0; j < stride; j++)
                splitVerts[splitIndex + j] = vertices[originalIndex + j];
        }
        vertexBuffer = new AttributesBuffer_1.AttributesBuffer(stride, len);
        vertexBuffer.bufferView = splitVerts;
        return vertexBuffer;
    };
    //TODO - generate this dyanamically based on num tris
    ElementsUtils.hitTestTriangleElements = function (x, y, z, box, triangleElements, count, offset) {
        if (offset === void 0) { offset = 0; }
        var positionAttributes = triangleElements.positions;
        var curveAttributes = triangleElements.getCustomAtributes("curves");
        var posDim = positionAttributes.dimensions;
        var curveDim = curveAttributes.dimensions;
        var positions = positionAttributes.get(count, offset);
        var curves = curveAttributes ? curveAttributes.get(count, offset) : null;
        var id0;
        var id1;
        var id2;
        var ax;
        var ay;
        var bx;
        var by;
        var cx;
        var cy;
        var hitTestCache = triangleElements.hitTestCache[offset] || (triangleElements.hitTestCache[offset] = new HitTestCache_1.HitTestCache());
        var index = hitTestCache.lastCollisionIndex;
        if (index != -1 && index < count) {
            precheck: {
                id0 = index + 2;
                id1 = index + 1;
                id2 = index + 0;
                ax = positions[id0 * posDim];
                ay = positions[id0 * posDim + 1];
                bx = positions[id1 * posDim];
                by = positions[id1 * posDim + 1];
                cx = positions[id2 * posDim];
                cy = positions[id2 * posDim + 1];
                //console.log(ax, ay, bx, by, cx, cy);
                //from a to p
                var dx = ax - x;
                var dy = ay - y;
                //edge normal (a-b)
                var nx = by - ay;
                var ny = -(bx - ax);
                //console.log(ax,ay,bx,by,cx,cy);
                var dot = (dx * nx) + (dy * ny);
                if (dot > 0)
                    break precheck;
                dx = bx - x;
                dy = by - y;
                nx = cy - by;
                ny = -(cx - bx);
                dot = (dx * nx) + (dy * ny);
                if (dot > 0)
                    break precheck;
                dx = cx - x;
                dy = cy - y;
                nx = ay - cy;
                ny = -(ax - cx);
                dot = (dx * nx) + (dy * ny);
                if (dot > 0)
                    break precheck;
                if (curves) {
                    var curvey0 = curves[id0 * curveDim + 2];
                    var curvey1 = curves[id1 * curveDim + 2];
                    var curvey2 = curves[id2 * curveDim + 2];
                    //check if not solid
                    if (curvey0 || curvey1 || curvey2) {
                        var v0x = bx - ax;
                        var v0y = by - ay;
                        var v1x = cx - ax;
                        var v1y = cy - ay;
                        var v2x = x - ax;
                        var v2y = y - ay;
                        var den = v0x * v1y - v1x * v0y;
                        var v = (v2x * v1y - v1x * v2y) / den;
                        var w = (v0x * v2y - v2x * v0y) / den;
                        //var u:number = 1 - v - w;	//commented out as inlined away
                        //here be dragons
                        var uu = 0.5 * v + w;
                        var vv = w;
                        var d = uu * uu - vv;
                        var az = curves[id0 * curveDim];
                        if (d > 0 && az == -128) {
                            break precheck;
                            ;
                        }
                        else if (d < 0 && az == 127) {
                            break precheck;
                            ;
                        }
                    }
                }
                return true;
            }
        }
        //hard coded min vertex count to bother using a grid for
        if (count > 150) {
            var cells = hitTestCache.cells;
            var divisions = cells.length ? hitTestCache.divisions : (hitTestCache.divisions = Math.min(Math.ceil(Math.sqrt(count)), 32));
            var conversionX = divisions / box.width;
            var conversionY = divisions / box.height;
            var minx = box.x;
            var miny = box.y;
            if (!cells.length) {
                //now we have bounds start creating grid cells and filling
                cells.length = divisions * divisions;
                for (var k = 0; k < count; k += 3) {
                    id0 = k + 2;
                    id1 = k + 1;
                    id2 = k + 0;
                    ax = positions[id0 * posDim];
                    ay = positions[id0 * posDim + 1];
                    bx = positions[id1 * posDim];
                    by = positions[id1 * posDim + 1];
                    cx = positions[id2 * posDim];
                    cy = positions[id2 * posDim + 1];
                    //subtractions to push into positive space
                    var min_index_x = Math.floor((Math.min(ax, bx, cx) - minx) * conversionX);
                    var min_index_y = Math.floor((Math.min(ay, by, cy) - miny) * conversionY);
                    var max_index_x = Math.floor((Math.max(ax, bx, cx) - minx) * conversionX);
                    var max_index_y = Math.floor((Math.max(ay, by, cy) - miny) * conversionY);
                    for (var i = min_index_x; i <= max_index_x; i++) {
                        for (var j = min_index_y; j <= max_index_y; j++) {
                            var index = i + j * divisions;
                            var nodes = cells[index] || (cells[index] = new Array());
                            //push in the triangle ids
                            nodes.push(id0, id1, id2);
                        }
                    }
                }
            }
            var index_x = Math.floor((x - minx) * conversionX);
            var index_y = Math.floor((y - miny) * conversionY);
            if ((index_x < 0 || index_x > divisions || index_y < 0 || index_y > divisions))
                return false;
            var nodes = cells[index_x + index_y * divisions];
            if (nodes == null)
                return false;
            var nodeCount = nodes.length;
            for (var k = 0; k < nodeCount; k += 3) {
                id2 = nodes[k + 2];
                if (id2 == index)
                    continue;
                id1 = nodes[k + 1];
                id0 = nodes[k];
                ax = positions[id0 * posDim];
                ay = positions[id0 * posDim + 1];
                bx = positions[id1 * posDim];
                by = positions[id1 * posDim + 1];
                cx = positions[id2 * posDim];
                cy = positions[id2 * posDim + 1];
                //from a to p
                var dx = ax - x;
                var dy = ay - y;
                //edge normal (a-b)
                var nx = by - ay;
                var ny = -(bx - ax);
                var dot = (dx * nx) + (dy * ny);
                if (dot > 0)
                    continue;
                dx = bx - x;
                dy = by - y;
                nx = cy - by;
                ny = -(cx - bx);
                dot = (dx * nx) + (dy * ny);
                if (dot > 0)
                    continue;
                dx = cx - x;
                dy = cy - y;
                nx = ay - cy;
                ny = -(ax - cx);
                dot = (dx * nx) + (dy * ny);
                if (dot > 0)
                    continue;
                if (curves) {
                    var curvey0 = curves[id0 * curveDim + 2];
                    var curvey1 = curves[id1 * curveDim + 2];
                    var curvey2 = curves[id2 * curveDim + 2];
                    //check if not solid
                    if (curvey0 || curvey1 || curvey2) {
                        var v0x = bx - ax;
                        var v0y = by - ay;
                        var v1x = cx - ax;
                        var v1y = cy - ay;
                        var v2x = x - ax;
                        var v2y = y - ay;
                        var den = v0x * v1y - v1x * v0y;
                        var v = (v2x * v1y - v1x * v2y) / den;
                        var w = (v0x * v2y - v2x * v0y) / den;
                        //var u:number = 1 - v - w;	//commented out as inlined away
                        //here be dragons
                        var uu = 0.5 * v + w;
                        var vv = w;
                        var d = uu * uu - vv;
                        var az = curves[id0 * curveDim];
                        if (d > 0 && az == -128)
                            continue;
                        else if (d < 0 && az == 127)
                            continue;
                    }
                }
                hitTestCache.lastCollisionIndex = id2;
                return true;
            }
            return false;
        }
        //brute force
        for (var k = 0; k < count; k += 3) {
            id2 = k + 0;
            if (id2 == index)
                continue;
            id1 = k + 1;
            id0 = k + 2;
            ax = positions[id0 * posDim];
            ay = positions[id0 * posDim + 1];
            bx = positions[id1 * posDim];
            by = positions[id1 * posDim + 1];
            cx = positions[id2 * posDim];
            cy = positions[id2 * posDim + 1];
            //console.log(ax, ay, bx, by, cx, cy);
            //from a to p
            var dx = ax - x;
            var dy = ay - y;
            //edge normal (a-b)
            var nx = by - ay;
            var ny = -(bx - ax);
            //console.log(ax,ay,bx,by,cx,cy);
            var dot = (dx * nx) + (dy * ny);
            if (dot > 0)
                continue;
            dx = bx - x;
            dy = by - y;
            nx = cy - by;
            ny = -(cx - bx);
            dot = (dx * nx) + (dy * ny);
            if (dot > 0)
                continue;
            dx = cx - x;
            dy = cy - y;
            nx = ay - cy;
            ny = -(ax - cx);
            dot = (dx * nx) + (dy * ny);
            if (dot > 0)
                continue;
            if (curves) {
                var curvey0 = curves[id0 * curveDim + 2];
                var curvey1 = curves[id1 * curveDim + 2];
                var curvey2 = curves[id2 * curveDim + 2];
                //check if not solid
                if (curvey0 || curvey1 || curvey2) {
                    var v0x = bx - ax;
                    var v0y = by - ay;
                    var v1x = cx - ax;
                    var v1y = cy - ay;
                    var v2x = x - ax;
                    var v2y = y - ay;
                    var den = v0x * v1y - v1x * v0y;
                    var v = (v2x * v1y - v1x * v2y) / den;
                    var w = (v0x * v2y - v2x * v0y) / den;
                    //var u:number = 1 - v - w;	//commented out as inlined away
                    //here be dragons
                    var uu = 0.5 * v + w;
                    var vv = w;
                    var d = uu * uu - vv;
                    var az = curves[id0 * curveDim];
                    if (d > 0 && az == -128) {
                        continue;
                    }
                    else if (d < 0 && az == 127) {
                        continue;
                    }
                }
            }
            hitTestCache.lastCollisionIndex = id2;
            return true;
        }
        return false;
    };
    ElementsUtils.getTriangleGraphicsBoxBounds = function (positionAttributes, output, count, offset) {
        if (offset === void 0) { offset = 0; }
        var positions = positionAttributes.get(count, offset);
        var posDim = positionAttributes.dimensions;
        var pos;
        var minX = 0, minY = 0, minZ = 0;
        var maxX = 0, maxY = 0, maxZ = 0;
        var len = count * posDim;
        for (var i = 0; i < len; i += posDim) {
            if (i == 0) {
                maxX = minX = positions[i];
                maxY = minY = positions[i + 1];
                maxZ = minZ = (posDim == 3) ? positions[i + 2] : 0;
            }
            else {
                pos = positions[i];
                if (pos < minX)
                    minX = pos;
                else if (pos > maxX)
                    maxX = pos;
                pos = positions[i + 1];
                if (pos < minY)
                    minY = pos;
                else if (pos > maxY)
                    maxY = pos;
                if (posDim == 3) {
                    pos = positions[i + 2];
                    if (pos < minZ)
                        minZ = pos;
                    else if (pos > maxZ)
                        maxZ = pos;
                }
            }
        }
        if (output == null)
            output = new Box_1.Box();
        output.x = minX;
        output.y = minY;
        output.z = minZ;
        output.right = maxX;
        output.bottom = maxY;
        output.back = maxZ;
        return output;
    };
    ElementsUtils.getTriangleGraphicsSphereBounds = function (positionAttributes, center, output, count, offset) {
        if (offset === void 0) { offset = 0; }
        var positions = positionAttributes.get(count, offset);
        var posDim = positionAttributes.dimensions;
        var maxRadiusSquared = 0;
        var radiusSquared;
        var len = count * posDim;
        var distanceX;
        var distanceY;
        var distanceZ;
        for (var i = 0; i < len; i += posDim) {
            distanceX = positions[i] - center.x;
            distanceY = positions[i + 1] - center.y;
            distanceZ = (posDim == 3) ? positions[i + 2] - center.z : -center.z;
            radiusSquared = distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;
            if (maxRadiusSquared < radiusSquared)
                maxRadiusSquared = radiusSquared;
        }
        if (output == null)
            output = new Sphere_1.Sphere();
        output.x = center.x;
        output.y = center.y;
        output.z = center.z;
        output.radius = Math.sqrt(maxRadiusSquared);
        return output;
    };
    ElementsUtils.tempFloat32x4 = new Float32Array(4);
    ElementsUtils.LIMIT_VERTS = 0xffff;
    ElementsUtils.LIMIT_INDICES = 0xffffff;
    ElementsUtils._indexSwap = new Array();
    return ElementsUtils;
}());
exports.ElementsUtils = ElementsUtils;

},{"../graphics/HitTestCache":"awayjs-display/lib/graphics/HitTestCache","awayjs-core/lib/attributes/AttributesBuffer":undefined,"awayjs-core/lib/attributes/Byte4Attributes":undefined,"awayjs-core/lib/attributes/Float3Attributes":undefined,"awayjs-core/lib/attributes/Float4Attributes":undefined,"awayjs-core/lib/geom/Box":undefined,"awayjs-core/lib/geom/Sphere":undefined,"awayjs-core/lib/geom/Vector3D":undefined}],"awayjs-display/lib/utils":[function(require,module,exports){
"use strict";
var Cast_1 = require("./utils/Cast");
exports.Cast = Cast_1.Cast;
var ElementsUtils_1 = require("./utils/ElementsUtils");
exports.ElementsUtils = ElementsUtils_1.ElementsUtils;

},{"./utils/Cast":"awayjs-display/lib/utils/Cast","./utils/ElementsUtils":"awayjs-display/lib/utils/ElementsUtils"}]},{},[1])
//# sourceMappingURL=awayjs-display.js.map
