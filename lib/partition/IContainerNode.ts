import INode						= require("awayjs-display/lib/partition/INode");

/**
 * IDisplayObjectNode is an interface for the constructable class definition EntityNode that is used to
 * create node objects in the partition pipeline that represent the contents of a Entity
 *
 * @class away.pool.IDisplayObjectNode
 */
interface IContainerNode extends INode
{
	numEntities:number;

	iAddNode(node:INode);

	iRemoveNode(node:INode);
}

export = IContainerNode;