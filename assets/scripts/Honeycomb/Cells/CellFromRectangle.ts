import { _decorator, Vec2 } from 'cc';
import { Cell } from './Cell';
import { CellType, Position } from '../Geometry/Enumerations';
import { Edge } from '../Geometry/Edge';
const { ccclass, property } = _decorator;

@ccclass('CellFromRectangle')
export class CellFromRectangle extends Cell
{
    constructor(width:number, height:number)
    {
        super();

        this._type = CellType.RECTANGLE;
        this._width = width;
        this._height = height;
        
        this.initialize();
    }

    protected override setVertices():void
    {
        this.vertices.set(Position.LB, new Vec2(0, 0));                              // !!!!!!!!!!!! неправильные координаты поправить или оставить и задавать Anchor Point (0, 0) и будет как в юнити
        this.vertices.set(Position.RB, new Vec2(this._width, 0));
        this.vertices.set(Position.RT, new Vec2(this._width, this._height));
        this.vertices.set(Position.LT, new Vec2(0, this._height));
    }

    protected override setEdges():void
    {
        // INFO: рёбра нужно указывать против часовой стрелки для корректной работы алгоритма PointToEdgeDistance
        this.edges.set(Position.B, new Edge(this.vertices.get(Position.LB).clone(), this.vertices.get(Position.RB).clone()));
        this.edges.set(Position.R, new Edge(this.vertices.get(Position.RB).clone(), this.vertices.get(Position.RT).clone()));
        this.edges.set(Position.T, new Edge(this.vertices.get(Position.RT).clone(), this.vertices.get(Position.LT).clone()));
        this.edges.set(Position.L, new Edge(this.vertices.get(Position.LT).clone(), this.vertices.get(Position.LB).clone()));
    }
}