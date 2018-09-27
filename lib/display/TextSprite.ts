﻿import {AssetEvent, Box, ColorTransform, Point, Matrix3D, Vector3D, Sphere, ProjectionBase} from "@awayjs/core";

import {TraverserBase, IAnimator, IMaterial, Style, IRenderable} from "@awayjs/renderer";

import {Graphics, Shape} from "@awayjs/graphics";

import {Sprite} from "./Sprite";
import { TextField } from './TextField';
import { TesselatedFontTable } from '../text/TesselatedFontTable';
import { TextFieldType } from '../text/TextFieldType';
import {HierarchicalProperties} from "../base/HierarchicalProperties";

/**
 * TextSprite is used for masked text. It is a child of the textfield that is used to render all visible (masked) graphics
 */
export class TextSprite extends Sprite
{
	public parentTextField:TextField;

	
	public _acceptTraverser(traverser:TraverserBase):void
	{
		var tf:TextField=this.parentTextField;
		tf.reConstruct(true);
		
		if(tf._textFormat && !tf._textFormat.font_table.isAsset(TesselatedFontTable) && !tf._textFormat.material ){
			var new_ct:ColorTransform = tf.transform.colorTransform || (tf.transform.colorTransform = new ColorTransform());
			this.transform.colorTransform.color = (tf.textColor!=null) ? tf.textColor : tf._textFormat.color;
			this._invalidateHierarchicalProperties(HierarchicalProperties.COLOR_TRANSFORM);
		}

		/*if(!tf.cursorBlinking &&  tf.isInFocus && tf.cursorShape && tf._type==TextFieldType.INPUT){
			traverser[tf.cursorShape.elements.traverseName](tf.cursorShape);
		}*/

		this._graphics.acceptTraverser(traverser);

		//if(tf.showSelection && tf.isInFocus && tf.bgShapeSelect){
		//	traverser[tf.bgShapeSelect.elements.traverseName](tf.bgShapeSelect);
		//}
		
		//if(tf.bgShape && tf.background){
		//	traverser[tf.bgShape.elements.traverseName](tf.bgShape);
		//}
	}


}