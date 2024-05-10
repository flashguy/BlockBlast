import { _decorator, Component, instantiate, Node, randomRangeInt, Vec2, Vec3 } from 'cc';
import { Cell } from './Honeycomb/Cells/Cell';
import { Grid } from './Honeycomb/Grids/Grid';
import { Shape } from './Honeycomb/Shapes/Shape';
import { CellFromRectangle } from './Honeycomb/Cells/CellFromRectangle';
import { RectangleGrid } from './Honeycomb/Grids/RectangleGrid';
import { ShapeBuilder } from './Honeycomb/Shapes/ShapeBuilder';
import { Position } from './Honeycomb/Geometry/Enumerations';
import { Tile } from './Tile';
import { FieldPanelScript } from './ui/FieldPanelScript';
import { BlocksPrefabs } from './BlocksPrefabs';
const { ccclass, property } = _decorator;

@ccclass('FieldLogic')
export class FieldLogic extends Component
{
    @property(Node)
    private fieldPanel:Node = null;

    @property
    private fieldSize:Vec2 = new Vec2(8, 8);

    @property
    private cellSize:Vec2 = new Vec2(85.5, 85.5);

    @property
    public minBlocksGroup:number = 1;

    @property
    public maxShuffleTry:number = 3;

    @property
    private bombDistance:number = 2;

    private _fieldPanelScript:FieldPanelScript;

    private _cell:Cell;
    private _grid:Grid;
    private _shapeRectangle:Shape;

    private _checkedPositions:Array<Vec2> = new Array<Vec2>();
    private _firstSelectedTile:Tile;
    private _searchStackDepth:number = 0;
    private _offsetNewTile:Map<number, number> = new Map<number, number>();
    
    public get cell():Cell { return this._cell; }
    public get grid():Grid { return this._grid; }
    public get shapeRectangle():Shape { return this._shapeRectangle; }
    public get getFieldSize() { return this.fieldSize; }
    public get getCellSize() { return this.cellSize; }
    
    public tiles:Array<Tile> = new Array<Tile>();
    public selectedTiles:Array<Tile> = new Array<Tile>();

    start()
    {
        this._fieldPanelScript = this.fieldPanel.getComponent(FieldPanelScript);
    }

    public initialize():void
    {
        this._cell = new CellFromRectangle(this.cellSize.x, this.cellSize.y);

        // const originPosition:Vec2 = new Vec2((this.fieldSize.x % 2 == 0 ? 0 : -this._cell.halfWidth), (this.fieldSize.y % 2 == 0 ? 0 : -this._cell.halfHeight));
        const originPosition:Vec2 = new Vec2(-((this.fieldSize.x * this._cell.width) / 2), -((this.fieldSize.y * this._cell.height) / 2));

        this._grid = new RectangleGrid(this._cell, originPosition, new Vec2());
        this._shapeRectangle = ShapeBuilder.getRectangle(new Vec2(), Position.RT, this.fieldSize);

        this.clearTiles();
        this.shapeRectangle.get().forEach((cellPoint) =>
        {
            this.createTile(cellPoint.clone());
        });
    }

    private createTile(cellPoint:Vec2):Tile
    {
        let inScreen:Vec2 = this.grid.gridToScreen(cellPoint);
        let tileType:number = randomRangeInt(0, BlocksPrefabs.getLength());
        // let tileType:number = randomRangeInt(0, 3);
        // let tileType:number = 0;
        let blockPrefab:Node = instantiate(BlocksPrefabs.getBlockPrefabByType(tileType));
        blockPrefab.active = true;
        blockPrefab.setPosition(new Vec3(inScreen.x, inScreen.y, 0));

        this._fieldPanelScript.add(blockPrefab);

        let tile:Tile = new Tile();
        tile.pos = cellPoint;
        tile.node = blockPrefab;
        tile.type = tileType;
        tile.updateLabel(); // INFO: включает отладочную информацию
        tile.init();
        
        this.tiles.push(tile);

        return tile;
    }

    public clearTiles():void
    {
        this.tiles = new Array<Tile>();
    }

    public clearSelectedTiles():void
    {
        this.selectedTiles = new Array<Tile>();
    }

    public getTyleByGridPosition(pos:Vec2):Tile
    {
        for (let i:number = 0; i < this.tiles.length; i++)
        {
            if (this.tiles[i].pos.equals(pos))
                return this.tiles[i];
        }

        return null;
    }

    public getTyleIndexByGridPosition(pos:Vec2):number
    {
        return (pos.y * this.fieldSize.x) + pos.x;
    }

    private isTyleChecked(pos:Vec2):boolean
    {
        for (let i:number = 0; i < this._checkedPositions.length; i++)
        {
            if (pos.equals(this._checkedPositions[i]))
                return true;
        }

        return false;
    }

    public getSimpleClick2(pos:Vec2):void
    {
        this._searchStackDepth = 0;
        this._checkedPositions = new Array<Vec2>();

        this._firstSelectedTile = this.getTyleByGridPosition(pos);
        this.selectedTiles.push(this._firstSelectedTile);

        this.checkNeighbors(pos, null);
    }

    public getSimpleClick(pos:Vec2):void
    {
        this._searchStackDepth = 0;
        this._checkedPositions = new Array<Vec2>();

        this._firstSelectedTile = this.getTyleByGridPosition(pos);
        this.selectedTiles.push(this._firstSelectedTile);

        this.checkNeighbors(pos, null);
    }

    private checkNeighbors(pos:Vec2, excludededParent:Position):void
    {
        this._searchStackDepth++;
        this._checkedPositions.push(pos);

        if (excludededParent != Position.L)
        {
            this.checkNeighbor(pos, Position.L, Position.R);
        }

        if (excludededParent != Position.T)
        {
            this.checkNeighbor(pos, Position.T, Position.B);
        }

        if (excludededParent != Position.R)
        {
            this.checkNeighbor(pos, Position.R, Position.L);
        }

        if (excludededParent != Position.B)
        {
            this.checkNeighbor(pos, Position.B, Position.T);
        }

        this._searchStackDepth--;

        if (this._searchStackDepth == 0)
        {
            
        }
    }

    private checkNeighbor(pos:Vec2, direction:Position, excludededParent:Position):void
    {
        let tempTile:Tile;
        let tempPos:Vec2;

        tempPos = this._grid.getCellNeighbor(pos, direction);

        if (this._shapeRectangle.isInShape(tempPos) && !this.isTyleChecked(tempPos))
        {
            tempTile = this.getTyleByGridPosition(tempPos);

            if (tempTile != null && this._firstSelectedTile.type == tempTile.type)
            {
                this.selectedTiles.push(tempTile);
                this.checkNeighbors(tempTile.pos, excludededParent);
            }
        }
    }

    public spawnNewTiles():void
    {
        this.clearSelectedTiles();
        this._offsetNewTile.clear();
        let loop:boolean = true;
        
        while (loop)
        {
            loop = false;

            this.shapeRectangle.get().forEach((cellPoint) =>
            {
                if (this.getTyleByGridPosition(cellPoint) == null)
                {
                    if (cellPoint.y == this.shapeRectangle.rt.y)
                    {
                        let newTile:Tile = this.createTile(cellPoint.clone());

                        if (this._offsetNewTile.get(cellPoint.x))
                            this._offsetNewTile.set(cellPoint.x, this._offsetNewTile.get(cellPoint.x) + 1);
                        else
                            this._offsetNewTile.set(cellPoint.x, 1);

                        let newPos:Vec2 = cellPoint.clone();
                        newPos.y += this._offsetNewTile.get(cellPoint.x);
                        let inScreen:Vec2 = this.grid.gridToScreen(newPos);
                        newTile.node.setPosition(new Vec3(inScreen.x, inScreen.y, 0));

                        this.selectedTiles.push(newTile);
                    }
                    else
                    {
                        let upPos:Vec2 = this.grid.getCellNeighbor(cellPoint, Position.T);
                        let upTile:Tile = this.getTyleByGridPosition(upPos);
                        
                        if (upTile != null)
                        {
                            upTile.pos = cellPoint.clone();
                            upTile.updateLabel();
                            
                            this.selectedTiles.push(upTile);
                        }
                    }

                    loop = true;
                }
            });
        }
    }

    public checkNeedShuffle():boolean
    {
        let isShuffleNeed:boolean = true;

        for (let i:number = 0; i < this.tiles.length; i++)
        {
            let currentTile:Tile = this.tiles[i];
            let leftTile:Tile = this.getTyleByGridPosition(this._grid.getCellNeighbor(currentTile.pos, Position.L));
            let topTile:Tile = this.getTyleByGridPosition(this._grid.getCellNeighbor(currentTile.pos, Position.T));
            let rightTile:Tile = this.getTyleByGridPosition(this._grid.getCellNeighbor(currentTile.pos, Position.R));
            let bottomTile:Tile = this.getTyleByGridPosition(this._grid.getCellNeighbor(currentTile.pos, Position.B));

            if (leftTile != null && leftTile.type == currentTile.type)
            {
                isShuffleNeed = false;
                break;
            }

            if (topTile != null && topTile.type == currentTile.type)
            {
                isShuffleNeed = false;
                break;
            }

            if (rightTile != null && rightTile.type == currentTile.type)
            {
                isShuffleNeed = false;
                break;
            }

            if (bottomTile != null && bottomTile.type == currentTile.type)
            {
                isShuffleNeed = false;
                break;
            }
        }

        return isShuffleNeed;
    }

    public sortTiles():void
    {
        this.tiles.sort((a, b) =>
        {
            if (a.pos.y < b.pos.y)
            {
                return -1;
            }
            else if (a.pos.y > b.pos.y)
            {
                return 1;
            }
            else
            {
                if (a.pos.x < b.pos.x)
                {
                    return -1;
                }
                else if (a.pos.x > b.pos.x)
                {
                    return 1;
                }
                
                return 0;
            }
        });
    }

    public shuffle():void
    {
        for (let i = this.tiles.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1)); 
            let leftTile:Tile = this.tiles[j];
            let rightTile:Tile = this.tiles[i];
            let tempPos:Vec2 = leftTile.pos.clone();
            
            leftTile.pos = rightTile.pos.clone();
            leftTile.updateLabel();

            rightTile.pos = tempPos.clone();
            rightTile.updateLabel();
        }

        this.sortTiles();
    }

    public selectCircle(pos:Vec2):void
    {
        let shapeCircle:Shape = ShapeBuilder.getMidpointCircle(pos, this.bombDistance);
        
        shapeCircle.get().forEach((cellPoint) =>
        {
            if (this._shapeRectangle.isInShape(cellPoint))
            {
                this.selectedTiles.push(this.getTyleByGridPosition(cellPoint));
            }
        });
    }
}