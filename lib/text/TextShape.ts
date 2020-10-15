import { Shape, TriangleElements } from '@awayjs/graphics';

import { MaterialBase } from '@awayjs/materials';

import { TextFormat } from './TextFormat';

export class TextShape {

	public verts: number[];
	public format: TextFormat;
	public shape: Shape;
	public fntMaterial: MaterialBase;
	public elements: TriangleElements;
	constructor() {
		this.verts = [];
	}
}