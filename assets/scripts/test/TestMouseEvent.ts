import { _decorator, Component, director, Event, EventMouse, Input, input, instantiate, log, Node, Prefab, PrefabLink, random, randomRangeInt, Sprite, SpriteFrame, Texture2D, Vec2, Vec3 } from 'cc';
import { Cell } from '../Honeycomb/Cells/Cell';
import { CellFromRectangle } from '../Honeycomb/Cells/CellFromRectangle';
import { Grid } from '../Honeycomb/Grids/Grid';
import { RectangleGrid } from '../Honeycomb/Grids/RectangleGrid';
import { Shape } from '../Honeycomb/Shapes/Shape';
import { ShapeBuilder } from '../Honeycomb/Shapes/ShapeBuilder';
import { Position } from '../Honeycomb/Geometry/Enumerations';
const { ccclass, property } = _decorator;

@ccclass('TestMouseEvent')
export class TestMouseEvent extends Component
{
    @property([Prefab])
    private prefabs:Prefab[] = [];

    @property([SpriteFrame])
    private spriteFrames:SpriteFrame[] = [];

    @property
    private label = '';

    private cell:Cell;
    private grid:Grid;
    private shape:Shape;

    onEnable(): void {
        
    }

    start(): void
    {
        // this.node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    update(dt: number): void {
        
    }

    lateUpdate(dt: number): void {
        
    }

    onDisable(): void {
        
    }

    onDestroy(): void {
        
    }

    private onMouseMove(event:EventMouse):void
    {
        // TODO: реализовать метод который определяет попадаем ли мы в Shape в который тыкаем реализовать это в шейпе метод isInShape()
        if (event.getButton() == 0)
        {
            if (this.grid != null)
            {
                let screenPoint3D:Vec3 = new Vec3(event.getLocationX(), event.getLocationY(), 0).subtract(this.node.parent.getPosition());
                let screenPoint2D:Vec2 = new Vec2(screenPoint3D.x, screenPoint3D.y);
                let inGrid:[Position, Vec2] = this.grid.screenToGrid(screenPoint2D);
                
                console.log(inGrid[1].toString(), screenPoint2D.toString());
            }
        }
    }

    private onMouseDown(event:EventMouse):void
    {
        /*console.log("=================================");
        console.log(event.getLocationX(), event.getLocationY());
        console.log(event.getLocationInView().toString());
        let block:Node = instantiate(this.pref);
        block.active = true;
        block.setScale(new Vec3(0.5, 0.5, 1));
        // block.setWorldPosition(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        block.setPosition(new Vec3(event.getLocationX(), event.getLocationY(), 0).subtract(this.node.parent.getPosition()));
        console.log(block.getPosition().toString());
        console.log(block.getWorldPosition().toString());
        // block.parent = director.getScene();
        this.node.addChild(block);
        // this.node.parent.addChild(block);
        // director.getScene().addChild(block);
        */

        if (event.getButton() == 2)
        {
            this.node.removeAllChildren();

            this.cell = new CellFromRectangle(85.5, 96);
            this.grid = new RectangleGrid(this.cell, new Vec2(), new Vec2());
            this.shape = ShapeBuilder.getRectangle(new Vec2(), Position.C, new Vec2(5, 5));

            console.log("================================= ", event.getButton().toString());
            this.shape.get().forEach((cellPoint) =>
            {
                let inScreen = this.grid.gridToScreen(cellPoint);
                console.log(cellPoint.toString(), inScreen.toString(), randomRangeInt(0, this.prefabs.length));
                
                let block:Node = instantiate(this.prefabs[randomRangeInt(0, this.prefabs.length)]);
                block.active = true;
                block.setScale(new Vec3(0.5, 0.5, 1));
                block.setPosition(new Vec3(inScreen.x, inScreen.y, 0));
                this.node.addChild(block);

                // (block.getComponent("cc.Sprite") as Sprite).spriteFrame = this.spriteFrames[0];
                // let sprite:Sprite = block.getComponent("cc.Sprite") as Sprite;
                // sprite.spriteFrame = this.spriteFrames[randomRangeInt(0, this.spriteFrames.length)];
                // console.log("Sprite: ", (block.getComponent("cc.Sprite") as Sprite).spriteFrame);
                console.log("Sprite: ", block.getComponent(Sprite).spriteFrame);
                console.log("spriteFrames: ", this.spriteFrames.length);
                console.log("prefabs: ", this.prefabs.length);

                // block.getComponent(Sprite).spriteFrame = this.spriteFrames[0] as SpriteFrame;
            });
        }
    }
}


