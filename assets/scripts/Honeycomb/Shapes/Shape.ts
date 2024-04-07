import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shape')
// TODO: Shape это отдельные классы со своими методами сделать методы находится ли на линии.
// А в ShapeBuilder уже создавать от этого абстрактный класс Rect и т.д.
export class Shape
{
    private readonly _positions:Array<Vec2> = new Array<Vec2>();
    private _lb:Vec2 = null;
    private _rt:Vec2 = null;

    public get lb() { return this._lb; }
    public set lb(value:Vec2) { this._lb = value; }
    public get rt() { return this._rt; }
    public set rt(value:Vec2) { this._rt = value; }
    
    public add(position:Vec2):void
    {
        this._positions.push(position);
    }

    public insert(index:number, position:Vec2):void
    {
        this._positions.splice(index, 0, position);
    }

    public addIfNot(position:Vec2):void
    {
        // TODO: !!!!!! не работает indexOf как в C# нужно переделать на проверку в цикле
        if (this._positions.indexOf(position) == -1)
        {
            this._positions.push(position);
        }
    }

    public addRow(startCell:Vec2, x:number, y:number):void
    {
        for (let i:number = -x; i <= x; i++)
        {
            this._positions.push(new Vec2(startCell.x + i, startCell.y + y));
        }
    }

    public get():Array<Vec2>
    {
        return this._positions;
    }

    public getSize():number
    {
        return this._positions.length;
    }

    public isInShape(gridPoin:Vec2):boolean
    {
        // return this._positions.in != -1;
        return (gridPoin.x >= this._lb.x) && (gridPoin.x <= this._rt.x) && (gridPoin.y >= this._lb.y) && (gridPoin.y <= this._rt.y);
    }
}