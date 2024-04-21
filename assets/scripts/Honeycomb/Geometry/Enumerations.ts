import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

export enum Position
{
    // Direction - направление
    // Position - позиция
    // Place - место
    
    // LT -- T -- RT
    // |     |     |
    // L  -- C --  R
    // |     |     |
    // LB -- B -- RB
    
    OUT = 1, // OUTSIDE
    IN,  // INSIDE
    
    C,   // CENTER
    
    L,   // LEFT
    T,   // TOP
    R,   // RIGHT
    B,   // BOTTOM
    
    LB,  // LEFT BOTTOM
    LT,  // LEFT TOP
    RT,  // RIGHT TOP
    RB,  // RIGHT BOTTOM
    
    UP,   // UP
    DOWN  // DOWN
}

export enum CellType
{
    RECTANGLE,
    OVAL,
    RHOMB,
    PARALLELOGRAM,
    HEXAGON,
    ISOMETRIC_HEXAGON
}

export class PositionToString
{
    public static toString(key:Position):String
    {
        switch (key)
        {
            case Position.OUT:  return "OUT";
            case Position.IN:  return "IN";
            case Position.C:  return "C";
            case Position.L:  return "L";
            case Position.T:  return "T";
            case Position.R:  return "R";
            case Position.B:  return "B";
            case Position.LB:  return "LB";
            case Position.LT:  return "LT";
            case Position.RT:  return "RT";
            case Position.RB:  return "RB";
            case Position.UP:  return "UP";
            case Position.DOWN:  return "DOWN";
            default: return "В перечислении Position нет ключа с таким именем '" + key + "'";
        }
    }
}