import { _decorator, Component, Node, Vec2 } from 'cc';
import { CellType, Position } from '../Geometry/Enumerations';
import { Edge } from '../Geometry/Edge';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export abstract class Cell
{
    protected _type:CellType;

    protected _width:number;
    protected _height:number;

    protected _halfWidth:number;
    protected _halfHeight:number;

    protected _center:Vec2 = new Vec2();

    protected vertices:Map<Position, Vec2> = new Map<Position, Vec2>();
    protected edges:Map<Position, Edge> = new Map<Position, Edge>();

    public get type() { return this._type; }
    public get width() { return this._width; }
    public get height() { return this._height; }
    public get halfWidth() { return this._halfWidth; }
    public get halfHeight() { return this._halfHeight; }
    public get center() { return this._center; }

    public getVertex(key:Position)
    {
        return this.vertices[key];
    }

    public getVertices():Map<Position, Vec2>
    {
        return this.vertices;
    }

    public getEdges():Map<Position, Edge>
    {
        return this.edges;
    }

    protected initialize():void
    {
        this._halfWidth = this._width / 2;
        this._halfHeight = this._height / 2;
        this._center.set(0, 0);
        
        this.setVertices();
        this.setEdges();
    }

    protected abstract setVertices():void;
    protected abstract setEdges():void;
}