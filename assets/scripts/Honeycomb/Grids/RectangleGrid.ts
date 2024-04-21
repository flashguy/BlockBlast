import { _decorator, Vec2 } from 'cc';
import { Grid } from './Grid';
import { Cell } from '../Cells/Cell';
import { Position } from '../Geometry/Enumerations';
const { ccclass, property } = _decorator;

@ccclass('RectangleGrid')
export class RectangleGrid extends Grid
{
    constructor(cell:Cell, originPosition:Vec2, gap:Vec2)
    {
        super(cell, originPosition, gap);
        
        this.initialize();
    }

    public override gridToScreen(gridPoint:Vec2):Vec2
    {
        let resultPoint:Vec2 = new Vec2();
        
        resultPoint.x = this._originPosition.x + gridPoint.x * (this._cell.width + this._gap.x);
        resultPoint.y = this._originPosition.y + gridPoint.y * (this._cell.height + this._gap.y);

        return resultPoint;
    }

    public override screenToGrid(screenPoint:Vec2):[Position, Vec2]
    {
        let resultPoint:Vec2 = new Vec2();
        
        resultPoint.x = Math.floor((screenPoint.x - this._originPosition.x) / (this._cell.width + this._gap.x));
        resultPoint.y = Math.floor((screenPoint.y - this._originPosition.y) / (this._cell.height + this._gap.y));
        
        this._position = this.isPointInside(screenPoint, this.gridToScreen(resultPoint));
        // console.log("_position", this._position);
        switch (this._position)
        {
            case Position.IN:
            {
                return [Position.IN, resultPoint];
            }
            case Position.OUT:
            default:
            {
                return [Position.OUT, null];
            }
        }
    }

    protected override setNeighbors():void
    {
        this.neighbors.set(Position.L, new Vec2(-1, 0));
        this.neighbors.set(Position.T, new Vec2(0, 1));
        this.neighbors.set(Position.R, new Vec2(1, 0));
        this.neighbors.set(Position.B, new Vec2(0, -1));
        
        this.diagonals.set(Position.LB, new Vec2(-1, -1));
        this.diagonals.set(Position.LT, new Vec2(-1, 1));
        this.diagonals.set(Position.RT, new Vec2(1, 1));
        this.diagonals.set(Position.RB, new Vec2(1, -1));
    }

    protected override calculateGridSpecificPrameters():void
    {
        
    }

    public override getCellNeighbor(gridCell:Vec2, direction:Position):Vec2
    {
        return this.getNeighbor(gridCell, direction);
    }

    public override getCellNeighbors(gridCell:Vec2):Map<Position, Vec2>
    {
        return this.getNeighbors(gridCell);
    }
}