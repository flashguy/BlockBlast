import { _decorator, Vec2 } from 'cc';
import { Shape } from './Shape';
import { Position } from '../Geometry/Enumerations';
const { ccclass, property } = _decorator;

@ccclass('ShapeBuilder')
export class ShapeBuilder
{
    public static getRectangle(startCell:Vec2, directionTo:Position, shapeSize:Vec2):Shape
    {
        let shape:Shape = new Shape();
        let columns:number = shapeSize.x;
        let rows:number = shapeSize.y;
        let size:number = columns * rows;
        let gridCell:Vec2 = startCell.clone();
        let multiplierX:number = 1;
        let multiplierY:number = 1;

        // Direction определяет построение фигуры относительно начальной ячейки и центра координат
        // TODO: добавить RM, LM, TC, BC!!!!!!
        switch (directionTo)
        {
            case Position.C:
            {
                gridCell.set(startCell.x - Math.floor(columns / 2), startCell.y - Math.floor(rows / 2));

                shape.lb = new Vec2(gridCell);
                shape.rt = new Vec2(gridCell.clone().add(shapeSize.clone().subtract2f(1, 1)));
                break;
            }
            case Position.RT:
            {
                shape.lb = new Vec2(gridCell);
                shape.rt = new Vec2(gridCell.clone().add(shapeSize.clone().subtract2f(1, 1)));
                break;
            }
            case Position.RB:
            {
                multiplierY = -1;

                shape.lb = new Vec2(gridCell.x, gridCell.y - shapeSize.y + 1);
                shape.rt = new Vec2(gridCell.x + shapeSize.x - 1, gridCell.y);
                break;
            }
            case Position.LT:
            {
                multiplierX = -1;

                shape.lb = new Vec2(gridCell.x - shapeSize.x + 1, gridCell.y);
                shape.rt = new Vec2(gridCell.x, gridCell.y + shapeSize.y - 1);
                break;
            }
            case Position.LB:
            {
                multiplierX = -1;
                multiplierY = -1;

                shape.lb = new Vec2(gridCell.x - shapeSize.x + 1, gridCell.y - shapeSize.y + 1);
                shape.rt = new Vec2(gridCell);
                break;
            }
        }
        // TODO: Проверка если 3D то задавать "Y" если 2D, то "Z"
        // Сначало инкрементируем колонки а потом строки или слева направо и снизу вверх
        for (let i:number = 0; i < size; i++)
        {
            shape.add(new Vec2(gridCell.x + (i % columns) * multiplierX, gridCell.y + Math.floor(i / columns) * multiplierY));
        }

        // if (shape.lb && shape.rt)
        //     console.log("Shape lb, rt:", shape.lb.toString(), shape.rt.toString());
        return shape;
    }

    public static getMidpointCircle(centerCell:Vec2, distance:number):Shape
    {
        let shape:Shape = new Shape();

        if (distance == 0)
        {
            shape.add(centerCell.clone());
        }
        else
        {
            let xt:Array<number> = Array.from(Array(distance + 1).keys());
            let x:number = 0;
            let y:number = distance;
            let d:number = 1 - distance;

            xt[y] = x;
            xt[x] = y;

            while (y > x)
            {
                if (d < 0)
                {
                    d += 2 * x + 3;
                }
                else
                {
                    d += 2 * (x - y) + 5;
                    y--;
                }

                x++;

                if (x > xt[y])
                    xt[y] = x;

                if (y > xt[x])
                    xt[x] = y;
            }

            for (y = distance; y >= 1; y--)
            {
                shape.addRow(centerCell.clone(), xt[y], -y);
            }

            shape.addRow(centerCell.clone(), xt[0], 0);

            for (y = 1; y <= distance; y++)
            {
                shape.addRow(centerCell.clone(), xt[y], y);
            }
        }
        
        return shape;
    }
}