import { _decorator, Component, EventMouse, input, Input, log, Node, Prefab, tween, Vec2, Vec3, warn } from 'cc';
import { Position } from './Honeycomb/Geometry/Enumerations';
import { Tile } from './Tile';
import { ProgressPanelScript } from './ui/ProgressPanelScript';
import { ScorePanelScript } from './ui/ScorePanelScript';
import { LevelPanelScript } from './ui/LevelPanelScript';
import { Level } from './Level';
import { FieldPanelScript } from './ui/FieldPanelScript';
import { FieldLogic } from './FieldLogic';
import { PauseButtonPanelScript } from './ui/PauseButtonPanelScript';
import { GoalsPanelScript } from './ui/GoalsPanelScript';
import { EndGamePanelScript } from './ui/EndGamePanelScript';
import { MovesPaneScript } from './ui/MovesPanelScript';
import { MoneyPanelScript } from './ui/MoneyPanelScript';
import { BonusPanelScript } from './ui/BonusPanelScript';
import { LevelScorePanelScript } from './ui/LevelScorePanelScript';
import { RangeValue } from './RangeValue';
import { RangeVerifier } from './RangeVerifier';
import { BlocksPrefabs } from './BlocksPrefabs';
const { ccclass, property } = _decorator;

enum GameState
{
    SHOW_LEVEL_WINDOW,
    START_LEVEL,
    CREATE_LEVEL,
    WAIT_SIMPLE_CLICK,
    SEARCH_TILES,
    REMOVE_SELECTED_TILES,
    CHECK_END_GAME,
    SPAWN_NEW_TILES,
    CHECK_NEED_SHUFFLE,
    WAIT_SWAP,
    FAIL_GAME
}

export class GameStateToString
{
    public static toString(key:GameState):String
    {
        switch (key)
        {
            case GameState.SHOW_LEVEL_WINDOW:       return "SHOW_LEVEL_WINDOW";
            case GameState.START_LEVEL:             return "START_LEVEL";
            case GameState.CREATE_LEVEL:            return "LOAD_LEVEL";
            case GameState.WAIT_SIMPLE_CLICK:       return "WAIT_SIMPLE_CLICK";
            case GameState.SEARCH_TILES:            return "SEARCH_TILES";
            case GameState.REMOVE_SELECTED_TILES:   return "REMOVE_SELECTED_TILES";
            case GameState.CHECK_END_GAME:          return "CHECK_END_GAME";
            case GameState.SPAWN_NEW_TILES:         return "SPAWN_NEW_TILES";
            case GameState.CHECK_NEED_SHUFFLE:      return "CHECK_NEED_SHUFFLE";
            case GameState.WAIT_SWAP:               return "WAIT_SWAP";
            case GameState.FAIL_GAME:               return "FAIL_GAME";
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

    @property(Node)
    private pausePanel:Node = null;

    @property(Node)
    private goalsPanel:Node = null;

    @property(Node)
    private mavesPanel:Node = null;

    @property(Node)
    private endGamePanel:Node = null;

    @property(Node)
    private moneyPanel:Node = null;

    @property(Node)
    private levelScorePanel:Node = null;

    @property(Node)
    private bonusPanel:Node = null;

    @property([Prefab])
    private bloсkPrefabs:Prefab[] = [];

    @property([Level])
    private levels:Level[] = [];

    @property([RangeValue])
    private revardsMoney:RangeValue[] = [];

    @property([RangeValue])
    private revardsScore:RangeValue[] = [];

    private _fieldLogic:FieldLogic;
    private _fieldPanelScript:FieldPanelScript;
    private _progressPanelScript:ProgressPanelScript;
    private _scorePanelScript:ScorePanelScript;
    private _levelPanelScript:LevelPanelScript;
    private _pauseButtonPanelScript:PauseButtonPanelScript;
    private _goalsPanelScript:GoalsPanelScript;
    private _movesPanelScript:MovesPaneScript;
    private _endGamePanelScript:EndGamePanelScript;
    private _moneyPanelScript:MoneyPanelScript;
    private _levelScorePanelScript:LevelScorePanelScript;
    private _bonusPanelScript:BonusPanelScript;

    private _currentState:GameState;

    private _currentLevel:number = -1;
    private _currentLevelData:Level = null;
    private _movesLeft:number;
    private _lastDeletedBlocksCount:number = 0;
    private _rewardMoney:number = 0;
    private _rewardScore:number = 0;
    private _maxLevelBlocksProgress:number = 0;
    private _currentLevelBlocksProgress:number = 0;
    private _goalsBlock:Map<number, number> = new Map<number, number>();

    
    
    
    private _currentShuffleTry:number = 0;
    private _startedAnimations:number = 0;
    
    private _bombDistance:number = 2;
    private _swapPos:Vec2;

    onEnable():void
    {
        
    }

    start()
    {
        BlocksPrefabs.setPrefabs(this.bloсkPrefabs);

        this._fieldLogic = this.node.getComponent(FieldLogic) as FieldLogic;
        this._fieldPanelScript = this.fieldPanel.getComponent(FieldPanelScript) as FieldPanelScript;
        this._progressPanelScript = this.progressPanel.getComponent(ProgressPanelScript) as ProgressPanelScript;
        this._scorePanelScript = this.scorePanel.getComponent(ScorePanelScript) as ScorePanelScript;
        this._levelPanelScript = this.levelPanel.getComponent(LevelPanelScript) as LevelPanelScript;
        this._pauseButtonPanelScript = this.pausePanel.getComponent(PauseButtonPanelScript) as PauseButtonPanelScript;
        this._goalsPanelScript = this.goalsPanel.getComponent(GoalsPanelScript) as GoalsPanelScript;
        this._movesPanelScript = this.mavesPanel.getComponent(MovesPaneScript) as MovesPaneScript;
        this._endGamePanelScript = this.endGamePanel.getComponent(EndGamePanelScript) as EndGamePanelScript;
        this._moneyPanelScript = this.moneyPanel.getComponent(MoneyPanelScript) as MoneyPanelScript;
        this._levelScorePanelScript = this.levelScorePanel.getComponent(LevelScorePanelScript) as LevelScorePanelScript;
        this._bonusPanelScript = this.bonusPanel.getComponent(BonusPanelScript) as BonusPanelScript;

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
            case GameState.SHOW_LEVEL_WINDOW:       this.showLevelWindow();     break;
            case GameState.START_LEVEL:             this.startLevel();          break;
            case GameState.CREATE_LEVEL:            this.createLevel();         break;
            case GameState.WAIT_SIMPLE_CLICK:       break;
            case GameState.SEARCH_TILES:            break;
            case GameState.REMOVE_SELECTED_TILES:   this.removeSelectedTiles(); break;
            case GameState.CHECK_END_GAME:          this.checkEndGame();        break;
            case GameState.SPAWN_NEW_TILES:         this.spawnNewTiles();       break;
            case GameState.CHECK_NEED_SHUFFLE:      this.checkNeedShuffle();    break;
            case GameState.WAIT_SWAP:               break;
            case GameState.FAIL_GAME:               this.failGame();             break;
        }
    }

    public pause():void
    {
        
    }

    private showLevelWindow():void
    {
        this._currentLevel++;
        // this._currentLevel = 2;

        if (this._currentLevel < this.levels.length)
        {
            this._currentLevelData = this.levels[this._currentLevel];
            this._levelPanelScript.show(this._currentLevelData, () => { this.setState(GameState.START_LEVEL); });
        }
    }

    private startLevel():void
    {
        this._movesLeft = this._currentLevelData.moves;
        this._lastDeletedBlocksCount = 0;
        this._rewardMoney = 0;
        this._rewardScore = 0;
        this._maxLevelBlocksProgress = 0;
        this._currentLevelBlocksProgress = 0;
        this._goalsBlock = new Map<number, number>();

        for (let i = 0; i < this._currentLevelData.goals.length; i++)
        {
            let type:number = this._currentLevelData.goals[i].type;
            let quantity:number = this._currentLevelData.goals[i].quantity;
           
            this._goalsBlock.set(type, quantity);
            this._maxLevelBlocksProgress += quantity;
        }
        
        this._currentLevelBlocksProgress = this._maxLevelBlocksProgress;

        this._progressPanelScript.show();
        this._progressPanelScript.setProgress(0, false);
        this._pauseButtonPanelScript.show();
        this._goalsPanelScript.show(this._currentLevelData);
        this._movesPanelScript.show(this._currentLevelData.moves);
        this._fieldPanelScript.show(this._fieldLogic.getFieldSize, this._fieldLogic.getCellSize);
        this._levelScorePanelScript.setValue(0);
        this._levelScorePanelScript.show();
        this._moneyPanelScript.setValue(0);
        this._moneyPanelScript.show();

        this.setState(GameState.CREATE_LEVEL);
    }

    private createLevel():void
    {
        this._currentShuffleTry = 0;
        this._fieldPanelScript.clear();

        this._fieldLogic.initialize();
        
        this.setState(GameState.WAIT_SIMPLE_CLICK);
    }

    // Проверка рядом стоящих тайлов после клика
    private simpleClickAction(pos:Vec2):void
    {
        log("$$$ simpleClickAction 00 >>>>");
        this._fieldLogic.getSimpleClick(pos);
        log("$$$ simpleClickAction 01 <<<<");
        this.setState(GameState.REMOVE_SELECTED_TILES);
    }

    private removeSelectedTiles():void
    {
        if (this._fieldLogic.selectedTiles.length >= this._fieldLogic.minBlocksGroup)
        {
            this._lastDeletedBlocksCount = this._fieldLogic.selectedTiles.length;

            for (let i:number = 0; i < this._fieldLogic.selectedTiles.length; i++)
            {
                let type:number = this._fieldLogic.selectedTiles[i].type;

                if (this._goalsBlock.has(type))
                {
                    this._currentLevelBlocksProgress--;
                    this._goalsBlock.set(type, this._goalsBlock.get(type) - 1);
                }

                this._fieldLogic.tiles.splice(this._fieldLogic.tiles.indexOf(this._fieldLogic.selectedTiles[i]), 1);
                this._fieldPanelScript.remove(this._fieldLogic.selectedTiles[i].node);
            }

            this.setState(GameState.CHECK_END_GAME);
        }
        else
        {
            this.setState(GameState.WAIT_SIMPLE_CLICK);
        }
        
        this._fieldLogic.clearSelectedTiles();
    }

    private checkEndGame():void
    {
        this._movesLeft--;
        this._movesPanelScript.setValue(this._movesLeft);
        
        for (let i = 0; i < this.revardsMoney.length; i++)
        {
            if (RangeVerifier.verify(this._lastDeletedBlocksCount, this.revardsMoney[i]))
            {
                this._rewardMoney += this.revardsMoney[i].reward;
                this._moneyPanelScript.setValue(this._rewardMoney);
            }
        }

        for (let i = 0; i < this.revardsScore.length; i++)
        {
            if (RangeVerifier.verify(this._lastDeletedBlocksCount, this.revardsScore[i]))
            {
                this._rewardScore += this.revardsScore[i].reward;
                this._levelScorePanelScript.setValue(this._rewardScore);
            }
        }

        this._goalsPanelScript.updateValues(this._goalsBlock);
        this._progressPanelScript.setProgress(100 - (this._currentLevelBlocksProgress * 100) / this._maxLevelBlocksProgress, true);
        
        if (this._movesLeft == 0 && this._currentLevelBlocksProgress > 0)
        {
            log("END FAIL_GAME!")
            this._currentLevel--;
            this.setState(GameState.FAIL_GAME);
        }
        else if (this._currentLevelBlocksProgress == 0)
        {
            log("WIN!")
        }
        else
        {
            this.setState(GameState.SPAWN_NEW_TILES);
        }
    }

    private spawnNewTiles():void
    {
        this._fieldLogic.spawnNewTiles();

        for (let i:number = 0; i < this._fieldLogic.selectedTiles.length; i++)
        {
            // linear | bounceOut
            let currentTile:Tile = this._fieldLogic.selectedTiles[i];
            let inScreen:Vec2 = this._fieldLogic.grid.gridToScreen(currentTile.pos);
            let distance:number = Math.max(Math.abs(currentTile.node.getPosition().x - inScreen.x), Math.abs(currentTile.node.getPosition().y - inScreen.y));
            let moveSpeed:number = 700;
            let duration:number = distance / moveSpeed;
            
            tween(currentTile.node)
            .to(duration, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'linear' })
            .to(0.1, {position: new Vec3(inScreen.x, inScreen.y + 3, 0)}, { easing: 'linear' })
            .to(0.1, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'linear' })
            .call(() => {
                this._fieldLogic.selectedTiles.splice(0, 1);
                if (this._fieldLogic.selectedTiles.length == 0)
                {
                    this.setState(GameState.CHECK_NEED_SHUFFLE);
                }
            })
            .start();
        }
    }

    private checkNeedShuffle():void
    {
        // log("ПРОВЕРКА ХОДОВ. ПОПЫТКА:", this._currentShuffleTry);

        if (this._fieldLogic.checkNeedShuffle())
        {
            if (this._currentShuffleTry == this._fieldLogic.maxShuffleTry)
            {
                warn("НЕТ ХОДОВ. ПРОИГРЫШ :(");
            }
            else
            {
                // warn("НЕТ ХОДОВ");
                this._currentShuffleTry++;
                this.shuffle();
            }
        }
        else
        {
            this.setState(GameState.WAIT_SIMPLE_CLICK);
        }
    }

    private shuffle():void
    {
        log("ПЕРЕМЕШИВАНИЕ");
        this._fieldLogic.shuffle();

        for (let i:number = 0; i < this._fieldLogic.tiles.length; i++)
        {
            this._startedAnimations++;
            let currentTile:Tile = this._fieldLogic.tiles[i];
            currentTile.node.setSiblingIndex(i);
            
            let inScreen:Vec2 = this._fieldLogic.grid.gridToScreen(currentTile.pos);
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

    private failGame():void
    {
        this._endGamePanelScript.show();

        let interval:number = setInterval(() => {
            clearInterval(interval);
            
            this._progressPanelScript.hide();
            this._pauseButtonPanelScript.hide();
            this._goalsPanelScript.hide();
            this._movesPanelScript.hide();
            this._fieldPanelScript.hide();
            this._levelScorePanelScript.hide();
            this._moneyPanelScript.hide();
            this._endGamePanelScript.hide();

            this.setState(GameState.SHOW_LEVEL_WINDOW);
        }, 2000);
    }

    private onMouseDown(event:EventMouse):void
    {
        log("this._currentState =", GameStateToString.toString(this._currentState));
        if (this._currentState == GameState.SHOW_LEVEL_WINDOW
            || this._currentState == GameState.START_LEVEL
            || this._currentState == GameState.CREATE_LEVEL)
            return;

        log("=========== onMouseDown ===========");
        let screenPoint3D:Vec3 = new Vec3(event.getLocationX(), event.getLocationY(), 0).subtract(this.node.parent.getPosition());
        let screenPoint2D:Vec2 = new Vec2(screenPoint3D.x, screenPoint3D.y);
        let inGrid:[Position, Vec2] = this._fieldLogic.grid.screenToGrid(screenPoint2D);

        if (inGrid[0] == Position.IN && this._fieldLogic.shapeRectangle.isInShape(inGrid[1]))
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







    /*private getBomb(pos:Vec2):void
    {
        let shapeCircle:Shape = ShapeBuilder.getMidpointCircle(pos, this._bombDistance);
        
        shapeCircle.get().forEach((cellPoint) =>
        {
            if (this._shapeRectangle.isInShape(cellPoint))
            {
                this._selectedTiles.push(this.getTyleByGridPosition(cellPoint));
            }
        });

        this.setState(GameState.REMOVE_SELECTED_TILES);
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
    }*/
}