import { _decorator, Vec2 } from 'cc';
import { Cell } from '../Cells/Cell';
import { CellType, Position } from '../Geometry/Enumerations';
import { Edge } from '../Geometry/Edge';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export abstract class Grid
{
    protected _cell:Cell;
    protected _originPosition:Vec2;
    protected _gap:Vec2;

    protected readonly neighbors:Map<Position, Vec2> = new Map<Position, Vec2>();
    protected readonly diagonals:Map<Position, Vec2> = new Map<Position, Vec2>();
    
    protected readonly neighborsShifted:Map<Position, Vec2> = new Map<Position, Vec2>();
    protected readonly diagonalsShifted:Map<Position, Vec2> = new Map<Position, Vec2>();

    protected _position:Position;

    private _tempPoint:Vec2 = new Vec2();
    private _tempEdge:Edge = new Edge();
    
    private _tempOvalHit:number;

    constructor(cell:Cell, originPosition:Vec2, gap:Vec2)
    {
        this._cell = cell;
        this._originPosition = originPosition;
        this._gap = gap;
    }

    public abstract gridToScreen(gridPoint:Vec2):Vec2;
    public abstract screenToGrid(screenPoint:Vec2):[Position, Vec2];
    public abstract getCellNeighbor(gridCell:Vec2, direction:Position):Vec2;
    public abstract getCellNeighbors(gridCell:Vec2):Map<Position, Vec2>;

    // public abstract getDistance(gridCellStart:Vec2, gridCellEnd:Vec2):number;
    // public abstract offsetToCube(offset:Vec2):Vec2;
    // public abstract cubeToOffset(cube:Vec2):Vec2;

    protected abstract setNeighbors():void;
    protected abstract calculateGridSpecificPrameters():void;

    protected initialize():void
    {
        this.setNeighbors();
        this.calculateGridSpecificPrameters();
        // SetIntersectionEdges();
    }

    protected isPointInside(screenPoint:Vec2, gridToScreenPoint:Vec2, defineQuadrant:boolean = false):Position
    {
        if (this._cell.type == CellType.OVAL)
        {
            return this.checkOval(screenPoint, gridToScreenPoint, defineQuadrant);
        }
        else
        {
            return this.checkEdges(screenPoint, gridToScreenPoint);
        }
    }

    public defineQuadrant(screenPoint:Vec2, centerPoint:Vec2):Position
    {
        if (screenPoint.x <= centerPoint.x)
        {
            return screenPoint.y >= centerPoint.y ? Position.LT : Position.LB;
        }
        else
        {
            return screenPoint.y >= centerPoint.y ? Position.RT : Position.RB;
        }
    }

    protected checkOval(screenPoint:Vec2, gridToScreenPoint:Vec2, defineQuadrant:boolean = false):Position
    {
        this._tempPoint.x = this._cell.center.x;
        this._tempPoint.y = this._cell.center.y;
        this._tempPoint.add(gridToScreenPoint);

        this._tempOvalHit = Math.pow(screenPoint.x - this._tempPoint.x, 2) / Math.pow(this._cell.halfWidth, 2)
                        + Math.pow(screenPoint.y - this._tempPoint.y, 2) / Math.pow(this._cell.halfHeight, 2);
            
        if (this._tempOvalHit > 1) // _tempOvalHit > 1 находимся за эллипсом
        {
            return defineQuadrant ? this.defineQuadrant(screenPoint, this._tempPoint) : Position.OUT;
        }
        else if (this._tempOvalHit <= 1) // _tempOvalHit == 1 находимся на краю эллипса _tempOvalHit < 1 находимся внутри эллипса
        {
            return Position.IN;
        }
        else
        {
            return defineQuadrant ? this.defineQuadrant(screenPoint, this._tempPoint) : Position.OUT;
        }
    }

    protected checkEdges(screenPoint:Vec2, gridToScreenPoint:Vec2):Position
    {
        /*for (let [key, value] of map) {
            console.log(key, value.toString());
        }*/

        this._cell.getEdges().forEach((value:Edge, key:Position) => {
            // console.log(PositionToString.toString(key), value.toString());
            this._tempEdge.set(value);
            this._tempEdge.add(gridToScreenPoint);
            // console.log(this._tempEdge.pointToEdgeDistance(screenPoint), gridToScreenPoint.toString());
            if (this._tempEdge.pointToEdgeDistance(screenPoint) < 0)
                return key;
        });
        
        return Position.IN;
    }

    protected getNeighbor(gridCell:Vec2, direction:Position):Vec2
    {
        let resultCell:Vec2 = gridCell.clone();
        
        if (this.neighbors.has(direction))
        {
            return resultCell.add(this.neighbors.get(direction));
        }
        else
        {
            return null;
        }
    }

    protected getNeighborShifted(gridCell:Vec2, direction:Position, notFromShifted:boolean):Vec2
    {
        let resultCell:Vec2 = gridCell.clone();
        
        if (notFromShifted)
        {
            return resultCell.add(this.neighbors.get(direction));
        }
        else
        {
            return resultCell.add(this.neighborsShifted.get(direction));
        }
    }

    protected getNeighborShiftedByX(gridCell:Vec2, direction:Position):Vec2
    {
        return this.getNeighborShifted(gridCell, direction, gridCell.x % 2 == 0);
    }

    protected getNeighborShiftedByY(gridCell:Vec2, direction:Position):Vec2
    {
        return this.getNeighborShifted(gridCell, direction, gridCell.y % 2 == 0);
    }
    
    protected getNeighbors(gridCell:Vec2):Map<Position, Vec2>
    {
        return this.neighbors;
    }

    protected getNeighborsShifted(notFromShifted:boolean):Map<Position, Vec2>
    {
        if (notFromShifted)
        {
            return this.neighbors;
        }
        else
        {
            return this.neighborsShifted;
        }
    }

    protected getNeighborsShiftedByX(gridCell:Vec2):Map<Position, Vec2>
    {
        return this.getNeighborsShifted(gridCell.x % 2 == 0);
    }
    
    protected getNeighborsShiftedByY(gridCell:Vec2):Map<Position, Vec2>
    {
        return this.getNeighborsShifted(gridCell.y % 2 == 0);
    }
}