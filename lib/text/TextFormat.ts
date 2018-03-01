import {AssetBase} from "@awayjs/core";

import {IMaterial} from "@awayjs/renderer";

import {IFontTable} from "./IFontTable";
import {Font} from "./Font";
import {TesselatedFontTable} from "./TesselatedFontTable";
import {DefaultFontManager} from "../managers/DefaultFontManager";

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
export class TextFormat extends AssetBase
{
	public static assetType:string = "[asset TextFormat]";

	/**
	 * Indicates the alignment of the paragraph. Valid values are TextFormatAlign
	 * constants.
	 *
	 * @default TextFormatAlign.LEFT
	 * @throws ArgumentError The <code>align</code> specified is not a member of
	 *                       flash.text.TextFormatAlign.
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro offers this as paragraph-properties)
	public align:string;


	/**
	 * Indicates the block indentation in pixels. Block indentation is applied to
	 * an entire block of text; that is, to all lines of the text. In contrast,
	 * normal indentation(<code>TextFormat.indent</code>) affects only the first
	 * line of each paragraph. If this property is <code>null</code>, the
	 * TextFormat object does not specify block indentation(block indentation is
	 * 0).
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro offers this as paragraph-properties)
	public blockIndent:number;

	/**
	 * Specifies whether the text is boldface. The default value is
	 * <code>null</code>, which means no boldface is used. If the value is
	 * <code>true</code>, then the text is boldface.
	 */
	//todo: this is not used when working with tesselated-font-table, because this is property need a own  tesselated-font-table.
	public bold:boolean;

	/**
	 * Indicates that the text is part of a bulleted list. In a bulleted list,
	 * each paragraph of text is indented. To the left of the first line of each
	 * paragraph, a bullet symbol is displayed. The default value is
	 * <code>null</code>, which means no bulleted list is used.
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro does not output this directly)
	public bullet:boolean;

	/**
	 * Indicates the color of the text. A number containing three 8-bit RGB
	 * components; for example, 0xFF0000 is red, and 0x00FF00 is green. The
	 * default value is <code>null</code>, which means that Flash Player uses the
	 * color black(0x000000).
	 */
	//todo: not used with in tesselated-font-table because color must be defined my material + uv-values
	public color:number;


	/**
	 * The material to use for texturing geometry generated for this text-format. this material will be used by the  TextField
	 */
	public material:IMaterial;

	/**
	 * The uv-values of the colors in textureatlas.
	 * The lenght migth be 4 in future to support bitmap-fills and gradients, but for now it will should always be 2
	 */
	public uv_values:Array<number>;

	/**
	 * The name of the font for text in this text format, as a string.
	 * To be valid, for use with curve-rendering, the textFormat must have a Font-table assigned.
	 * The font-name can be used to get a Font-object from the AssetLibrary.
	 * A Font object provides a list of Font-table, corresponding to font-table names.
	 */
	public _font_name:string;
	public _font:Font;
	public get font_name():string{
		return this._font_name;
	}
	public set font_name(value:string){
		var newFont=DefaultFontManager.getFont(value);
		if(newFont){
			this._font=newFont;
			this.font_table=<TesselatedFontTable>newFont.get_font_table("regular", TesselatedFontTable.assetType);
			if(!this.font_table){
				console.log("could not find font-table on font", value, this._font);
			}
			this._font_name=value;

		}
		else{

			console.log("could not find font for name ", value);
		}


	}
	public get font():Font{
		return this._font;
	}
	public set font(value:Font){
		this._font_name=value.name;
		this._font=value;

	}

	/**
	 * The name of the font-style for text in this text format, as a string.
	 * To be valid, for use with curve-rendering, the textFormat must have a Font-table assigned.
	 * The font-style can be used to get a Font-table, from a Font-object.
	 */
	public font_style:string;
	/**
	 * The font-table that provides the subgeos for the chars
	 */
	public font_table:IFontTable;

	/**
	 * The font-table that provides the subgeos for the chars
	 */
	public fallback_font_table:IFontTable;

	/**
	 * Indicates the indentation from the left margin to the first character in
	 * the paragraph. The default value is <code>null</code>, which indicates
	 * that no indentation is used.
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro offers this as paragraph-properties)
	public indent:number;

	/**
	 * Indicates whether text in this text format is italicized. The default
	 * value is <code>null</code>, which means no italics are used.
	 */
	//todo: this is not used when working with tesselated-font-table, because this is property need a own tesselated-font-table.
	public italic:boolean;

	/**
	 * A Boolean value that indicates whether kerning is enabled
	 * (<code>true</code>) or disabled(<code>false</code>). Kerning adjusts the
	 * pixels between certain character pairs to improve readability, and should
	 * be used only when necessary, such as with headings in large fonts. Kerning
	 * is supported for embedded fonts only.
	 *
	 * <p>Certain fonts such as Verdana and monospaced fonts, such as Courier
	 * New, do not support kerning.</p>
	 *
	 * <p>The default value is <code>null</code>, which means that kerning is not
	 * enabled.</p>
	 */
	//todo: kerning values are not yet stored with Font-table. soon to come. (also: flash-pro only outputs very few kerning pairs per font-table)
	public kerning:boolean;

	/**
	 * An integer representing the amount of vertical space(called
	 * <i>leading</i>) between lines. The default value is <code>null</code>,
	 * which indicates that the amount of leading used is 0.
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro offers this as paragraph-properties)
	public leading:number;

	/**
	 * The left margin of the paragraph, in pixels. The default value is
	 * <code>null</code>, which indicates that the left margin is 0 pixels.
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro offers this as paragraph-properties)
	public leftMargin:number;

	/**
	 * A number representing the amount of space that is uniformly distributed
	 * between all characters. The value specifies the number of pixels that are
	 * added to the advance after each character. The default value is
	 * <code>null</code>, which means that 0 pixels of letter spacing is used.
	 * You can use decimal values such as <code>1.75</code>.
	 */
	public letterSpacing:number;

	/**
	 * The right margin of the paragraph, in pixels. The default value is
	 * <code>null</code>, which indicates that the right margin is 0 pixels.
	 */
	//todo: not used with in tesselated-font-table yet (flash-pro offers this as paragraph-properties)
	public rightMargin:number;

	/**
	 * The size in pixels of text in this text format. The default value is
	 * <code>null</code>, which means that a size of 12 is used.
	 */
	private _size:number;
	public get size():number{
		return this._size;
	}
	public set size(value:number){
		this._size=value;
	}
	/**
	 * Specifies custom tab stops as an array of non-negative integers. Each tab
	 * stop is specified in pixels. If custom tab stops are not specified
	 * (<code>null</code>), the default tab stop is 4(average character width).
	 */
	//todo: not used with in tesselated-font-table yet
	public tabStops:Array<number /*int*/> = [];

	/**
	 * Indicates the target window where the hyperlink is displayed. If the
	 * target window is an empty string, the text is displayed in the default
	 * target window <code>_self</code>. You can choose a custom name or one of
	 * the following four names: <code>_self</code> specifies the current frame
	 * in the current window, <code>_blank</code> specifies a new window,
	 * <code>_parent</code> specifies the parent of the current frame, and
	 * <code>_top</code> specifies the top-level frame in the current window. If
	 * the <code>TextFormat.url</code> property is an empty string or
	 * <code>null</code>, you can get or set this property, but the property will
	 * have no effect.
	 */
	//todo: not used with in tesselated-font-table yet
	public link_target:string;

	/**
	 * Indicates whether the text that uses this text format is underlined
	 * (<code>true</code>) or not(<code>false</code>). This underlining is
	 * similar to that produced by the <code><U></code> tag, but the latter is
	 * not true underlining, because it does not skip descenders correctly. The
	 * default value is <code>null</code>, which indicates that underlining is
	 * not used.
	 */
	//todo: not used with in tesselated-font-table yet
	public underline:boolean;

	/**
	 * Indicates the target URL for the text in this text format. If the
	 * <code>url</code> property is an empty string, the text does not have a
	 * hyperlink. The default value is <code>null</code>, which indicates that
	 * the text does not have a hyperlink.
	 *
	 * <p><b>Note:</b> The text with the assigned text format must be set with
	 * the <code>htmlText</code> property for the hyperlink to work.</p>
	 */
	//todo: not used with in tesselated-font-table yet
	public url:string;

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
	constructor(font:string = "Times New Roman", size:number = 12, color:number /*int*/ = 0x000000, bold:boolean = false, italic:boolean = false, underline:boolean = false, url:string = "", link_target:string = "", align:string = "left", leftMargin:number = 0, rightMargin:number = 0, indent:number = 0, leading:number = 0)
	{
		super();
		this.font_name = font;
		this.size = size;
		this.color = color;
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
		this.letterSpacing = 0;
		// todo: implement a way to supply a default fonttable / font to formats
		this.font_table=DefaultFontManager.getDefaultFontTable();
	}
	public clone():TextFormat{
		var clonedFormat:TextFormat=new TextFormat();
		clonedFormat.font_name = this.font_name;
		clonedFormat.font = this.font;
		clonedFormat.size = this.size;
		clonedFormat.color = this.color;
		clonedFormat.bold = this.bold;
		clonedFormat.italic = this.italic;
		clonedFormat.underline = this.underline;
		clonedFormat.url = this.url;
		clonedFormat.link_target = this.link_target;
		clonedFormat.align = this.align;
		clonedFormat.leftMargin = this.leftMargin;
		clonedFormat.rightMargin = this.rightMargin;
		clonedFormat.indent = this.indent;
		clonedFormat.leading = this.leading;
		clonedFormat.letterSpacing = 0;;
		clonedFormat.font_table = this.font_table;
		return clonedFormat;

	}
	public getBoldVersion():TextFormat{
		if(this.bold){
			return this;
		}
		var clonedFormat:TextFormat=this.clone();
		clonedFormat.bold=true;
		clonedFormat.font_table=clonedFormat.font.get_font_table("bold", TesselatedFontTable.assetType);
		return clonedFormat;
	}

	public applyFormat(format:TextFormat){
		if(format.size!=null)
			this.size=format.size;
		if(format.color!=null)
			this.color=format.color;
		if(format.bold!=null)
			this.bold=format.bold;
		if(format.italic!=null)
			this.italic=format.italic;
		if(format.underline!=null)
			this.underline=format.underline;
		if(format.url!=null)
			this.url=format.url;
		if(format.align!=null)
			this.align=format.align;
		if(format.leftMargin!=null)
			this.leftMargin=format.leftMargin;
		if(format.rightMargin!=null)
			this.rightMargin=format.rightMargin;
		if(format.indent!=null)
			this.indent=format.indent;
		if(format.leading!=null)
			this.leading=format.leading;
		if(format.letterSpacing!=null)
			this.letterSpacing=format.letterSpacing;
		if(format.link_target!=null)
			this.link_target=format.link_target;

	}

	/**
	 *
	 */
	public get assetType():string
	{
		return TextFormat.assetType;
	}
}