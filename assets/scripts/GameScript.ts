import { _decorator, Component, EventMouse, Graphics, input, Input, instantiate, log, Node, Prefab, randomRangeInt, tween, Vec2, Vec3, warn } from 'cc';
import { Cell } from './Honeycomb/Cells/Cell';
import { Grid } from './Honeycomb/Grids/Grid';
import { Shape } from './Honeycomb/Shapes/Shape';
import { CellFromRectangle } from './Honeycomb/Cells/CellFromRectangle';
import { RectangleGrid } from './Honeycomb/Grids/RectangleGrid';
import { ShapeBuilder } from './Honeycomb/Shapes/ShapeBuilder';
import { Position } from './Honeycomb/Geometry/Enumerations';
import { Tile } from './Tile';
import { ProgressPanelScript } from './ui/ProgressPanelScript';
import { ScorePanelScript } from './ui/ScorePanelScript';
import { LevelPanelScript } from './ui/LevelPanelScript';
import { Level } from './Level';
import { FieldPanelScript } from './ui/FieldPanelScript';
const { ccclass, property } = _decorator;

enum GameState
{
    SHOW_LEVEL_WINDOW,
    START_LEVEL,
    CREATE_LEVEL,
    WAIT_SIMPLE_CLICK,
    SEARCH_TILES,
    REMOVE_TILES,
    SPAWN_TILES,
    WAIT_SWAP,
}

export class GameStateToString
{
    public static toString(key:GameState):String
    {
        switch (key)
        {
            case GameState.SHOW_LEVEL_WINDOW:   return "SHOW_LEVEL_WINDOW";
            case GameState.START_LEVEL:         return "START_LEVEL";
            case GameState.CREATE_LEVEL:        return "LOAD_LEVEL";
            case GameState.WAIT_SIMPLE_CLICK:   return "WAIT_SIMPLE_CLICK";
            case GameState.SEARCH_TILES:        return "SEARCH_TILES";
            case GameState.REMOVE_TILES:        return "REMOVE_TILES";
            case GameState.SPAWN_TILES:         return "SPAWN_TILES";
            case GameState.WAIT_SWAP:           return "WAIT_SWAP";
            default: return "В перечислении GameState нет ключа с таким именем '" + key + "'";
        }
    }
}

@ccclass('GameScript')
export class GameScript extends Component
{
    @property(Node)
    private fieldPanel:Node = null;

    @property(Node)
    private progressPanel:Node = null;

    @property(Node)
    private scorePanel:Node = null;

    @property(Node)
    private levelPanel:Node = null;

    @property([Prefab])
    private blokPrefabs:Prefab[] = [];

    @property
    private fieldSize:Vec2 = new Vec2(8, 8);

    @property
    private cellSize:Vec2 = new Vec2(85.5, 85.5);

    @property
    private minBlocksGroup:number = 1;

    @property
    private maxShuffleTry:number = 3;

    @property([Level])
    private levels:Level[] = [];

    private _fieldPanelScript:FieldPanelScript;
    private _progressPanelScript:ProgressPanelScript;
    private _scorePanelScript:ScorePanelScript;
    private _levelPanelScript:LevelPanelScript;

    // private

    private _cell:Cell;
    private _grid:Grid;
    private _shapeRectangle:Shape;

    private _currentState:GameState;

    private _tiles:Array<Tile> = new Array<Tile>();
    private _selectedTiles:Array<Tile> = new Array<Tile>();
    private _checkedPositions:Array<Vec2> = new Array<Vec2>();
    private _firstSelectedTile:Tile;
    private _searchStackDepth:number = 0;
    private _currentShuffleTry:number = 0;
    private _startedAnimations:number = 0;
    private _offsetNewTile:Map<number, number> = new Map<number, number>();
    private _animatedTiles:Array<Tile> = new Array<Tile>();
    private _bombDistance:number = 2;
    private _swapPos:Vec2;

    private _currentLevel:number = -1;
    private _currentLevelData:Level = null;

    onEnable():void
    {
        
    }

    start()
    {
        this._fieldPanelScript = this.fieldPanel.getComponent(FieldPanelScript) as FieldPanelScript;
        this._progressPanelScript = this.progressPanel.getComponent(ProgressPanelScript) as ProgressPanelScript;
        this._scorePanelScript = this.scorePanel.getComponent(ScorePanelScript) as ScorePanelScript;
        this._levelPanelScript = this.levelPanel.getComponent(LevelPanelScript) as LevelPanelScript;

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);

        this.setState(GameState.SHOW_LEVEL_WINDOW);
    }

    update(deltaTime:number)
    {
        
    }

    lateUpdate(dt:number):void
    {
        
    }

    onDisable():void
    {
        
    }

    onDestroy():void
    {
        
    }

    private onMouseDown(event:EventMouse):void
    {
        log("=========== onMouseDown ===========");
        let screenPoint3D:Vec3 = new Vec3(event.getLocationX(), event.getLocationY(), 0).subtract(this.node.parent.getPosition());
        let screenPoint2D:Vec2 = new Vec2(screenPoint3D.x, screenPoint3D.y);
        let inGrid:[Position, Vec2] = this._grid.screenToGrid(screenPoint2D);

        if (inGrid[0] == Position.IN && this._shapeRectangle.isInShape(inGrid[1]))
        {
            log("==== >>> In Griid <<< ====");
            
            if (event.getButton() == 0)
            {
                switch (this._currentState)
                {
                    case GameState.WAIT_SIMPLE_CLICK: this.simpleClickAction(inGrid[1]); break;
                }
            }
        }
        else
        {
            log("==== >>> Out Of Griid <<< ====");
        }

        // this._progressPanelScript.setProgress(this._progressPanelScript.getProgress() + 10, true);
        // this.getBomb(inGrid[1]); // взрыв

        // if (this._currentState == GameState.WAIT_SWAP)
        // {
        //     if (inGrid[0] == Position.IN && this._shapeRectangle.isInShape(inGrid[1]))
        //     {
        //         this._searchStackDepth = 0;
        //         this._checkedPositions = new Array<Vec2>();

        //         this._firstSelectedTile = this.getTyleByGridPosition(inGrid[1]);
        //         this._selectedTiles.push(this._firstSelectedTile);

        //         this.checkSwap(inGrid[1]);
        //     }
        // }

        
        // тестовый if
        if (event.getButton() == 1)
        {
            // if (inGrid[0] == Position.IN && this._shapeRectangle.isInShape(inGrid[1]))
            // {
            //     console.log(inGrid[1].toString());
            //     console.log("In Griid", this.getTyleByGridPosition(inGrid[1]));
            // }
            // else
            // {
            //     console.log("Out Of Griid");
            // }
        }

        // тестовый if
        if (event.getButton() == 2)
        {
            this.setState(GameState.CREATE_LEVEL);
        }

        // тестовый if
        if (event.getButton() == 3)
        {
            this.shuffle();
        }
    }

    private setState(state:GameState):void
    {
        if (state != this._currentState)
        {
            log("New State:", GameStateToString.toString(state));
            this._currentState = state;
            this.onStateChanged();
        }
    }

    private onStateChanged():void
    {
        switch (this._currentState)
        {
            case GameState.SHOW_LEVEL_WINDOW:   this.showLevelWindow();     break;
            case GameState.START_LEVEL:         this.startLevel();          break;
            case GameState.CREATE_LEVEL:        this.createLevel();         break;
            case GameState.REMOVE_TILES:        this.removeSelectedTiles(); break;
            case GameState.SPAWN_TILES:         this.spawnNewTiles();       break;
        }
    }

    private showLevelWindow():void
    {
        this._currentLevel++;

        if (this._currentLevel < this.levels.length)
        {
            this._currentLevelData = this.levels[this._currentLevel];
            this._levelPanelScript.show(this._currentLevelData, () => { this.setState(GameState.START_LEVEL); });
        }
    }

    private startLevel():void
    {
        this._progressPanelScript.show();
        this._progressPanelScript.setProgress(0, false);

        this._fieldPanelScript.show(this.fieldSize, this.cellSize);

        this.setState(GameState.CREATE_LEVEL);
    }

    private createLevel():void
    {
        this._tiles = new Array<Tile>();

        this._fieldPanelScript.clear();

        this._cell = new CellFromRectangle(this.cellSize.x, this.cellSize.y);
        this._grid = new RectangleGrid(this._cell, new Vec2((this.fieldSize.x % 2 == 0 ? 0 : -this._cell.halfWidth), (this.fieldSize.y % 2 == 0 ? 0 : -this._cell.halfHeight)), new Vec2());
        this._shapeRectangle = ShapeBuilder.getRectangle(new Vec2(), Position.C, this.fieldSize);

        this._shapeRectangle.get().forEach((cellPoint) =>
        {
            this.createTile(cellPoint.clone());
        });

        this.setState(GameState.WAIT_SIMPLE_CLICK);
    }

// this._scorePanelScript.show(10, 222);

    // Проверка рядом стоящих тайлов после клика
    private simpleClickAction(pos:Vec2):void
    {
        this._searchStackDepth = 0;
        this._checkedPositions = new Array<Vec2>();

        this._firstSelectedTile = this.getTyleByGridPosition(pos);
        this._selectedTiles.push(this._firstSelectedTile);

        this.checkNeighbors(pos, null);
    }














    private createTile(cellPoint:Vec2):Tile
    {
        let inScreen:Vec2 = this._grid.gridToScreen(cellPoint);
        // let tileType:number = randomRangeInt(0, this.blokPrefabs.length);
        let tileType:number = randomRangeInt(0, 3);
        let prefab:Node = instantiate(this.blokPrefabs[tileType]);
        prefab.active = true;
        prefab.setScale(new Vec3(0.5, 0.5, 1));
        prefab.setPosition(new Vec3(inScreen.x, inScreen.y, 0));

        this._fieldPanelScript.add(prefab);

        let tile:Tile = new Tile();
        tile.pos = cellPoint;
        tile.node = prefab;
        tile.type = tileType;
        tile.updateLabel();
        
        this._tiles.push(tile);

        return tile;
    }

    private getTyleByGridPosition(pos:Vec2):Tile
    {
        for (let i:number = 0; i < this._tiles.length; i++)
        {
            if (this._tiles[i].pos.equals(pos))
                return this._tiles[i];
        }

        return null;
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
                this._selectedTiles.push(tempTile);
                this.checkNeighbors(tempTile.pos, excludededParent);
            }
        }
    }
    
    private checkNeighbors(pos:Vec2, excludededParent:Position):void
    {
        this._searchStackDepth++;
        // console.log(">>>", this._searchStackDepth);
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
        // console.log("<<<", this._searchStackDepth);

        if (this._searchStackDepth == 0)
        {
            this.setState(GameState.REMOVE_TILES);
        }
    }

    private removeSelectedTiles():void
    {
        if (this._selectedTiles.length >= this.minBlocksGroup)
        {
            for (let i:number = 0; i < this._selectedTiles.length; i++)
            {
                this._tiles.splice(this._tiles.indexOf(this._selectedTiles[i]), 1);
                this._fieldPanelScript.remove(this._selectedTiles[i].node);
            }

            this.setState(GameState.SPAWN_TILES);
        }
        else
        {
            this.setState(GameState.WAIT_SIMPLE_CLICK);
        }

        this._selectedTiles = new Array<Tile>();
    }

    private spawnNewTiles():void
    {
        let loop:boolean = true;
        
        while (loop)
        {
            loop = false;

            this._shapeRectangle.get().forEach((cellPoint) =>
            {
                if (this.getTyleByGridPosition(cellPoint) == null)
                {
                    if (cellPoint.y == this._shapeRectangle.rt.y)
                    {
                        let newTile:Tile = this.createTile(cellPoint.clone());

                        if (this._offsetNewTile.get(cellPoint.x))
                            this._offsetNewTile.set(cellPoint.x, this._offsetNewTile.get(cellPoint.x) + 1);
                        else
                            this._offsetNewTile.set(cellPoint.x, 1);

                        let newPos:Vec2 = cellPoint.clone();
                        newPos.y += this._offsetNewTile.get(cellPoint.x);
                        let inScreen:Vec2 = this._grid.gridToScreen(newPos);
                        newTile.node.setPosition(new Vec3(inScreen.x, inScreen.y, 0));

                        this._animatedTiles.push(newTile);
                    }
                    else
                    {
                        let upPos:Vec2 = this._grid.getCellNeighbor(cellPoint, Position.T);
                        let upTile:Tile = this.getTyleByGridPosition(upPos);
                        
                        if (upTile != null)
                        {
                            upTile.pos = cellPoint.clone();
                            upTile.updateLabel();
                            
                            this._animatedTiles.push(upTile);
                        }
                    }

                    loop = true;
                }
            });
        }

        for (let i:number = 0; i < this._animatedTiles.length; i++)
        {
            // linear | bounceOut
            let currentTile:Tile = this._animatedTiles[i];
            let inScreen:Vec2 = this._grid.gridToScreen(currentTile.pos);
            let distance:number = Math.max(Math.abs(currentTile.node.getPosition().x - inScreen.x), Math.abs(currentTile.node.getPosition().y - inScreen.y));
            let moveSpeed:number = 700;
            let duration:number = distance / moveSpeed;
            
            tween(currentTile.node)
            .to(duration, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'linear' })
            .to(0.1, {position: new Vec3(inScreen.x, inScreen.y + 3, 0)}, { easing: 'linear' })
            .to(0.1, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'linear' })
            .call(() => {
                this._animatedTiles.splice(0, 1);
                if (this._animatedTiles.length == 0)
                {
                    this._offsetNewTile.clear();
                    this._currentShuffleTry = 0;
                    this.checkNeedShuffle();
                }
            })
            .start();
        }

        // this._animatedTiles = new Array<Tile>();
        // this._offsetNewTile.clear();
        // this._currentShuffleTry = 0;
        // this.needShuffle();
    }

    private checkNeedShuffle():void
    {
        log("ПРОВЕРКА ХОДОВ. ПОПЫТКА", this._currentShuffleTry);
        let isShuffleNeed:boolean = true;

        for (let i:number = 0; i < this._tiles.length; i++)
        {
            let currentTile:Tile = this._tiles[i];
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

        if (isShuffleNeed)
        {
            if (this._currentShuffleTry == this.maxShuffleTry)
            {
                warn("НЕТ ХОДОВ. ПРОИГРЫШ :(");
            }
            else
            {
                warn("НЕТ ХОДОВ");
                this._currentShuffleTry++;
                this.shuffle();
            }
        }
        else
        {
            this.setState(GameState.WAIT_SIMPLE_CLICK);
        }
    }

    private sortTiles():void
    {
        this._tiles.sort((a, b) => {
            if (a.pos.y < b.pos.y)
                return -1;
            else if (a.pos.y > b.pos.y)
                return 1;
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

    private shuffle():void
    {
        log("ПЕРЕМЕШИВАНИЕ");
        for (let i = this._tiles.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1)); 
            let leftTile:Tile = this._tiles[j];
            let rightTile:Tile = this._tiles[i];
            let tempPos:Vec2 = leftTile.pos.clone();
            
            leftTile.pos = rightTile.pos.clone();
            leftTile.updateLabel();

            rightTile.pos = tempPos.clone();
            rightTile.updateLabel();
        }

        this.sortTiles();

        for (let i:number = 0; i < this._tiles.length; i++)
        {
            this._startedAnimations++;
            let currentTile:Tile = this._tiles[i];
            currentTile.node.setSiblingIndex(i);
            
            let inScreen:Vec2 = this._grid.gridToScreen(currentTile.pos);
            tween(currentTile.node)
            .to(0.4, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'linear' })
            .call(() => {
                this._startedAnimations--;
                if (this._startedAnimations == 0)
                    this.checkNeedShuffle();
            })
            .start();
        }
    }

    private getBomb(pos:Vec2):void
    {
        let shapeCircle:Shape = ShapeBuilder.getMidpointCircle(pos, this._bombDistance);
        
        shapeCircle.get().forEach((cellPoint) =>
        {
            if (this._shapeRectangle.isInShape(cellPoint))
            {
                this._selectedTiles.push(this.getTyleByGridPosition(cellPoint));
            }
        });

        this.setState(GameState.REMOVE_TILES);
    }

    private checkSwap(pos:Vec2)
    {
        if (this._swapPos == null)
        {
            this._swapPos = pos.clone();
        }
        else
        {
            let leftNeighbor:Vec2 = this._grid.getCellNeighbor(this._swapPos, Position.L);
            let topNeighbor:Vec2 = this._grid.getCellNeighbor(this._swapPos, Position.T);
            let rightNeighbor:Vec2 = this._grid.getCellNeighbor(this._swapPos, Position.R);
            let bottomNeighbor:Vec2 = this._grid.getCellNeighbor(this._swapPos, Position.B);

            if (pos.equals(leftNeighbor) || pos.equals(topNeighbor) || pos.equals(rightNeighbor) || pos.equals(bottomNeighbor))
            {
                log("ЭТО СОСЕД");
                let leftTile:Tile = this.getTyleByGridPosition(this._swapPos);
                let rightTile:Tile = this.getTyleByGridPosition(pos);
                let tempPos:Vec2 = leftTile.pos.clone();
                
                leftTile.pos = rightTile.pos.clone();
                leftTile.updateLabel();

                rightTile.pos = tempPos.clone();
                rightTile.updateLabel();

                this.sortTiles();

                for (let i:number = 0; i < this._tiles.length; i++)
                {
                    let currentTile:Tile = this._tiles[i];
                    currentTile.node.setSiblingIndex(i);
                }

                this._startedAnimations = 2;

                let inScreen1:Vec2 = this._grid.gridToScreen(leftTile.pos);
                tween(leftTile.node)
                .to(0.4, {position: new Vec3(inScreen1.x, inScreen1.y, 0)}, { easing: 'linear' })
                .call(() => {
                    this.checkAnimationFinish();
                })
                .start();

                let inScreen2:Vec2 = this._grid.gridToScreen(rightTile.pos);
                tween(rightTile.node)
                .to(0.4, {position: new Vec3(inScreen2.x, inScreen2.y, 0)}, { easing: 'linear' })
                .call(() => {
                    this.checkAnimationFinish();
                })
                .start();
            }
            else
            {
                log("ЭТО НЕ СОСЕД");
            }
        }
    }

    private checkAnimationFinish():void
    {
        this._startedAnimations--;

        if (this._startedAnimations == 0)
        {
            switch (this._currentState)
            {
                case GameState.WAIT_SWAP:
                {
                    log("OK OK OK");
                    this._swapPos = null;
                    this.setState(GameState.WAIT_SIMPLE_CLICK);
                    break;
                }
            }
        }
    }
}