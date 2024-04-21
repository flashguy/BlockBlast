import { _decorator, Component, director, EventMouse, input, Input, log, math, Node, Prefab, ProgressBar, SceneAsset, tween, Vec2, Vec3 } from 'cc';
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
import { MovesPaneScript } from './ui/MovesPanelScript';
import { MoneyPanelScript } from './ui/MoneyPanelScript';
import { BonusPanelScript } from './ui/BonusPanelScript';
import { LevelScorePanelScript } from './ui/LevelScorePanelScript';
import { RangeValue } from './RangeValue';
import { RangeVerifier } from './RangeVerifier';
import { BlocksPrefabs } from './BlocksPrefabs';
import { LabelPanelScript } from './ui/LabelPanelScript';
import { BonusItem } from './BonusItem';
import { BonusType } from './GameEnumerations';
const { ccclass, property } = _decorator;

enum GameState
{
    SHOW_LEVEL_WINDOW,
    SHOW_SCORE_WINDOW,
    START_LEVEL,
    CREATE_LEVEL,
    WAIT_SIMPLE_CLICK,
    WAIT_BOMB_CLICK,
    WAIT_SWAP_CLICK,
    SEARCH_TILES,
    REMOVE_SELECTED_TILES,
    CHECK_END_GAME,
    SPAWN_NEW_TILES,
    CHECK_NEED_SHUFFLE,
    WAIT_SWAP,
    FAIL_GAME,
    WIN_LEVEL,
    NO_MOVES,
    PAUSE
}

export class GameStateToString
{
    public static toString(key:GameState):String
    {
        switch (key)
        {
            case GameState.SHOW_LEVEL_WINDOW:       return "SHOW_LEVEL_WINDOW";
            case GameState.SHOW_SCORE_WINDOW:       return "SHOW_SCORE_WINDOW";
            case GameState.START_LEVEL:             return "START_LEVEL";
            case GameState.CREATE_LEVEL:            return "LOAD_LEVEL";
            case GameState.WAIT_SIMPLE_CLICK:       return "WAIT_SIMPLE_CLICK";
            case GameState.WAIT_BOMB_CLICK:         return "WAIT_BOMB_CLICK";
            case GameState.WAIT_SWAP_CLICK:         return "WAIT_SWAP_CLICK";
            case GameState.SEARCH_TILES:            return "SEARCH_TILES";
            case GameState.REMOVE_SELECTED_TILES:   return "REMOVE_SELECTED_TILES";
            case GameState.CHECK_END_GAME:          return "CHECK_END_GAME";
            case GameState.SPAWN_NEW_TILES:         return "SPAWN_NEW_TILES";
            case GameState.CHECK_NEED_SHUFFLE:      return "CHECK_NEED_SHUFFLE";
            case GameState.WAIT_SWAP:               return "WAIT_SWAP";
            case GameState.FAIL_GAME:               return "FAIL_GAME";
            case GameState.WIN_LEVEL:               return "WIN_LEVEL";
            case GameState.NO_MOVES:                return "NO_MOVES";
            case GameState.PAUSE:                   return "PAUSE";
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
    private labelPanel:Node = null;

    @property(Node)
    private moneyPanel:Node = null;

    @property(Node)
    private levelScorePanel:Node = null;

    @property(Node)
    private bonusPanel:Node = null;

    @property(Node)
    private screenLoaderPanel:Node = null;

    @property(ProgressBar)
    private progressBar:ProgressBar = null;

    @property([Prefab])
    private bloсkPrefabs:Prefab[] = [];

    @property([Level])
    private levels:Level[] = [];

    @property([RangeValue])
    private revardsMoney:RangeValue[] = [];

    @property([RangeValue])
    private revardsScore:RangeValue[] = [];

    @property([BonusItem])
    private bonuses:BonusItem[] = [];

    private _fieldLogic:FieldLogic;
    private _fieldPanelScript:FieldPanelScript;
    private _progressPanelScript:ProgressPanelScript;
    private _scorePanelScript:ScorePanelScript;
    private _levelPanelScript:LevelPanelScript;
    private _pauseButtonPanelScript:PauseButtonPanelScript;
    private _goalsPanelScript:GoalsPanelScript;
    private _movesPanelScript:MovesPaneScript;
    private _labelPanelScript:LabelPanelScript;
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
    private _swapTile:Tile = null;
    private _isPause:boolean = false;

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
        this._labelPanelScript = this.labelPanel.getComponent(LabelPanelScript) as LabelPanelScript;
        this._moneyPanelScript = this.moneyPanel.getComponent(MoneyPanelScript) as MoneyPanelScript;
        this._levelScorePanelScript = this.levelScorePanel.getComponent(LevelScorePanelScript) as LevelScorePanelScript;
        this._bonusPanelScript = this.bonusPanel.getComponent(BonusPanelScript) as BonusPanelScript;

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.setState(GameState.SHOW_LEVEL_WINDOW);
    }

    private setState(state:GameState):void
    {
        if (state != this._currentState)
        {
            // log("New State:", GameStateToString.toString(state));
            this._currentState = state;
            this.onStateChanged();
        }
    }

    private onStateChanged():void
    {
        switch (this._currentState)
        {
            case GameState.SHOW_LEVEL_WINDOW:       this.showLevelWindow();     break;
            case GameState.SHOW_SCORE_WINDOW:       this.showScoreWindow();     break;
            case GameState.START_LEVEL:             this.startLevel();          break;
            case GameState.CREATE_LEVEL:            this.createLevel();         break;
            // case GameState.WAIT_SIMPLE_CLICK:       break;
            // case GameState.WAIT_BOMB_CLICK:         break;
            // case GameState.WAIT_SWAP_CLICK:         break;
            // case GameState.SEARCH_TILES:            break;
            case GameState.REMOVE_SELECTED_TILES:   this.removeSelectedTiles(); break;
            case GameState.CHECK_END_GAME:          this.checkEndGame();        break;
            case GameState.SPAWN_NEW_TILES:         this.spawnNewTiles();       break;
            case GameState.CHECK_NEED_SHUFFLE:      this.checkNeedShuffle();    break;
            // case GameState.WAIT_SWAP:               break;
            case GameState.FAIL_GAME:               this.failGame();            break;
            case GameState.WIN_LEVEL:               this.winLevel();            break;
            case GameState.NO_MOVES:                this.noMoves();             break;
            // case GameState.PAUSE:                   break;
        }
    }

    public pause():void
    {
        this._isPause = !this._isPause;

        if (this._isPause)
        {
            this.setState(GameState.PAUSE);
            
            this._fieldPanelScript.hideWithScale(() => {
                this._labelPanelScript.setLebel("Сделали\nперерывчик?", new math.Color(239, 223, 148, 255), 80);
                this._labelPanelScript.showWithScale();
            });
        }
        else
        {
            this._labelPanelScript.hideWithScale(() => { 
                this._fieldPanelScript.showWithScale(() => {
                    this.setState(GameState.WAIT_SIMPLE_CLICK);
                });
            });
        }
    }

    private gotoMainMenu():void
    {
        this.screenLoaderPanel.active = true;

        director.preloadScene("MainMenuScene", this.onPorogressLoadScreene, (error: null | Error, sceneAsset?: SceneAsset) => {
            let interval:number = setInterval(() => {
                clearInterval(interval);
                this.screenLoaderPanel.active = false;
                director.loadScene("MainMenuScene");
            }, 500);
        });
    }

    private onPorogressLoadScreene = (completedCount:number, totalCount:number, iten:any) =>
    {
        this.progressBar.progress = completedCount / totalCount;
    }

    private showLevelWindow():void
    {
        this._currentLevel++;
        // this._currentLevel = 2;

        if (this._currentLevel < this.levels.length)
        {
            this._currentLevelData = this.levels[this._currentLevel];
            this._levelPanelScript.init(this._currentLevelData, () => { this.setState(GameState.START_LEVEL); });
            this._levelPanelScript.showWithScale();
        }
        else
        {
            this._labelPanelScript.setLebel("Игра пройдена", new math.Color(137, 202, 74, 255), 80);
            this._labelPanelScript.showWithScale();

            let interval:number = setInterval(() => {
                clearInterval(interval);
                
                this._labelPanelScript.hideWithScale(() => {
                    this.gotoMainMenu();
                });
            }, 1000);
        }
    }

    private showScoreWindow():void
    {
        this._scorePanelScript.init(this._currentLevel + 1, this._rewardScore,
            () => { this.setState(GameState.SHOW_LEVEL_WINDOW); },
            () => { this.gotoMainMenu(); });
        this._scorePanelScript.showWithScale();
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

        this._progressPanelScript.setProgress(0, false);
        this._goalsPanelScript.init(this._currentLevelData);
        this._movesPanelScript.setValue(this._currentLevelData.moves);
        this._fieldPanelScript.init(this._fieldLogic.getFieldSize, this._fieldLogic.getCellSize);
        this._levelScorePanelScript.setValue(0);
        this._moneyPanelScript.setValue(0);
        this._bonusPanelScript.init(this.bonuses);
        this._bonusPanelScript.updateBonuses(this._rewardMoney);

        this._progressPanelScript.showWithMove();
        this._pauseButtonPanelScript.showWithMove();
        this._goalsPanelScript.showWithMove();
        this._movesPanelScript.showWithMove();
        this._fieldPanelScript.showWithScale();
        this._levelScorePanelScript.showWithMove();
        this._moneyPanelScript.showWithMove();
        this._bonusPanelScript.showWithMove();

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
        this._fieldLogic.clearSelectedTiles();
        this._fieldLogic.getSimpleClick(pos);
        this.setState(GameState.REMOVE_SELECTED_TILES);
    }

    private bombClickAction(pos:Vec2):void
    {
        this._fieldLogic.clearSelectedTiles();
        this._fieldLogic.selectCircle(pos);
        this.setState(GameState.REMOVE_SELECTED_TILES);
    }

    private swapClickAction(pos:Vec2):void
    {
        let clickedTile:Tile = this._fieldLogic.getTyleByGridPosition(pos);

        if (clickedTile != null)
        {
            if (this._swapTile == null) // кликнули на первый раз
            {
                this._swapTile = clickedTile;
                this._swapTile.setSelected(true);
            }
            else if (this._swapTile.pos.equals(clickedTile.pos)) // кликнули на уже выбранный тайл
            {
                this._swapTile.setSelected(false);
                this._swapTile = null;
            }
            else
            {
                let leftNeighbor:Vec2 = this._fieldLogic.grid.getCellNeighbor(this._swapTile.pos, Position.L);
                let topNeighbor:Vec2 = this._fieldLogic.grid.getCellNeighbor(this._swapTile.pos, Position.T);
                let rightNeighbor:Vec2 = this._fieldLogic.grid.getCellNeighbor(this._swapTile.pos, Position.R);
                let bottomNeighbor:Vec2 = this._fieldLogic.grid.getCellNeighbor(this._swapTile.pos, Position.B);

                if (clickedTile.pos.equals(leftNeighbor)
                    || clickedTile.pos.equals(topNeighbor)
                    || clickedTile.pos.equals(rightNeighbor)
                    || clickedTile.pos.equals(bottomNeighbor))
                {
                    let tempPos:Vec2 = this._swapTile.pos.clone();

                    this._swapTile.setSelected(false);
                    this._swapTile.pos = clickedTile.pos.clone();
                    this._swapTile.updateLabel();
                    clickedTile.pos = tempPos;
                    clickedTile.updateLabel();

                    this.sortTilesAfterSwap();
                    
                    this.moveTileToNewPos(this._swapTile, () => { this.cancelSwapClickAction(); });
                    this.moveTileToNewPos(clickedTile, () => { this.cancelSwapClickAction(); });
                }
            }
        }
    }

    private sortTilesAfterSwap():void
    {
        this._fieldLogic.sortTiles();

        for (let i:number = 0; i < this._fieldLogic.tiles.length; i++)
        {
            let currentTile:Tile = this._fieldLogic.tiles[i];
            currentTile.node.setSiblingIndex(i);
        }
    }

    private moveTileToNewPos(tile:Tile, callback?:Function):void
    {
        this._startedAnimations++;
        let inScreen:Vec2 = this._fieldLogic.grid.gridToScreen(tile.pos);

        tween(tile.node)
        .to(0.8, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'backInOut' })
        .call(() => {
            this._startedAnimations--;

            if (this._startedAnimations == 0)
            {
                if (callback)
                    callback();
            }
        })
        .start();
    }

    private cancelSwapClickAction():void
    {
        this._swapTile = null;
        this.setState(GameState.WAIT_SIMPLE_CLICK);
    }

    private removeSelectedTiles():void
    {
        if (this._fieldLogic.selectedTiles.length >= this._fieldLogic.minBlocksGroup)
        {
            this._lastDeletedBlocksCount = this._fieldLogic.selectedTiles.length;

            for (let i:number = 0; i < this._fieldLogic.selectedTiles.length; i++)
            {
                let currentTile:Tile = this._fieldLogic.selectedTiles[i];

                if (this._goalsBlock.has(currentTile.type))
                {
                    let blockCount:number = this._goalsBlock.get(currentTile.type);

                    if (blockCount > 0)
                    {
                        this._goalsBlock.set(currentTile.type, blockCount - 1);
                        this._currentLevelBlocksProgress--;
                    }
                }

                this._fieldLogic.tiles.splice(this._fieldLogic.tiles.indexOf(currentTile), 1);

                this._startedAnimations++;
                let tileCenterPos:Vec2 = this._fieldLogic.grid.gridToScreen(currentTile.pos);
                tileCenterPos.add(this._fieldLogic.cell.center);

                let burnTween = tween;
                burnTween(currentTile.node)
                .parallel(
                    burnTween().to(0.2, {scale: new Vec3(0, 0, 1)}, { easing: 'backIn' }),
                    burnTween().to(0.2, {position: new Vec3(tileCenterPos.x, tileCenterPos.y, 0)}, { easing: 'backIn' })
                )
                .call(() => {
                    this._startedAnimations--;

                    this._fieldPanelScript.remove(currentTile.node);

                    if (this._startedAnimations == 0)
                    {
                        this.setState(GameState.CHECK_END_GAME);
                    }
                })
                .start();
            }
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
                this._bonusPanelScript.updateBonuses(this._rewardMoney);
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
            this.setState(GameState.FAIL_GAME);
        }
        else if (this._currentLevelBlocksProgress == 0)
        {
            // INFO: ПОБЕДА
            this.setState(GameState.WIN_LEVEL);
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
        if (this._fieldLogic.checkNeedShuffle())
        {
            if (this._currentShuffleTry == this._fieldLogic.maxShuffleTry)
            {
                // INFO: ЗАКОНЧИЛИСЬ ПОПЫТКИ ПЕРЕМЕШИВАНИЯ. ИГРА ОКОНЧЕНА.
                this.setState(GameState.NO_MOVES);
            }
            else
            {
                // INFO: НЕТ ХОДОВ
                this._labelPanelScript.setLebel("Нет ходов", new math.Color(218, 56, 84, 255), 80);
                this._labelPanelScript.showWithScale();
                
                let interval:number = setInterval(() => {
                    clearInterval(interval);
                    
                    this._labelPanelScript.hideWithScale(() => {
                        this._currentShuffleTry++;
                        this.shuffle();
                    });
                }, 800);
            }
        }
        else
        {
            this.setState(GameState.WAIT_SIMPLE_CLICK);
        }
    }

    private shuffle():void
    {
        this._labelPanelScript.setLebel("Тасуем", new math.Color(239, 223, 148, 255), 80);
        this._labelPanelScript.showWithScale();
        
        let interval:number = setInterval(() => {
            clearInterval(interval);
            
            this._fieldLogic.shuffle();

            for (let i:number = 0; i < this._fieldLogic.tiles.length; i++)
            {
                this._startedAnimations++;
                let currentTile:Tile = this._fieldLogic.tiles[i];
                currentTile.node.setSiblingIndex(i);
                
                let inScreen:Vec2 = this._fieldLogic.grid.gridToScreen(currentTile.pos);
                tween(currentTile.node)
                .to(0.8, {position: new Vec3(inScreen.x, inScreen.y, 0)}, { easing: 'backInOut' })
                .call(() => {
                    this._startedAnimations--;

                    if (this._startedAnimations == 0)
                    {
                        this._labelPanelScript.hideWithScale(() => {
                            this.checkNeedShuffle();
                        });
                    }
                })
                .start();
            }
        }, 100);
    }

    private failGame():void
    {
        this._currentLevel--;
        this._labelPanelScript.setLebel("Эх, Ещё бы чуть-чуть", new math.Color(220, 59, 87, 255), 60);
        this._labelPanelScript.showWithScale();

        let interval:number = setInterval(() => {
            clearInterval(interval);
            this.hideAllPanelsAndShowScoreWindow();
        }, 1000);
    }

    private winLevel():void
    {
        this._labelPanelScript.setLebel("Победа", new math.Color(137, 202, 74, 255), 80);
        this._labelPanelScript.showWithScale();

        let interval:number = setInterval(() => {
            clearInterval(interval);
            this.hideAllPanelsAndShowScoreWindow();
        }, 1000);
    }

    private noMoves():void
    {
        this._currentLevel--;
        this._labelPanelScript.setLebel("Увы, больше\nходов нет", new math.Color(83, 176, 246, 255), 80);
        this._labelPanelScript.showWithScale();

        let interval:number = setInterval(() => {
            clearInterval(interval);
            
            this._labelPanelScript.hideWithScale(() => {
                this._labelPanelScript.setLebel("конец игры", new math.Color(220, 59, 87, 255), 80);
                this._labelPanelScript.showWithScale();

                let interval:number = setInterval(() => {
                    clearInterval(interval);
                    this.hideAllPanelsAndShowScoreWindow();
                }, 1000);
            });
        }, 1000);
    }

    private hideAllPanelsAndShowScoreWindow():void
    {
        this._labelPanelScript.hideWithScale(() => {
            this._progressPanelScript.hideWithMove();
            this._pauseButtonPanelScript.hideWithMove();
            this._goalsPanelScript.hideWithMove();
            this._movesPanelScript.hideWithMove();
            this._fieldPanelScript.hideWithScale();
            this._levelScorePanelScript.hideWithMove();
            this._bonusPanelScript.hideWithMove();
            this._moneyPanelScript.hideWithMove(() => {
                this.setState(GameState.SHOW_SCORE_WINDOW);
            });
        });
    }

    private bonusButtonPressed(bonusItem:BonusItem):void
    {
        switch (bonusItem.type)
        {
            case BonusType.BOMB:
            {
                this._rewardMoney -= bonusItem.price;
                this._moneyPanelScript.setValue(this._rewardMoney);
                this._bonusPanelScript.updateBonuses(this._rewardMoney);

                this.setState(GameState.WAIT_BOMB_CLICK);
                break;
            }
            case BonusType.SWAP:
            {
                this._rewardMoney -= bonusItem.price;
                this._moneyPanelScript.setValue(this._rewardMoney);
                this._bonusPanelScript.updateBonuses(this._rewardMoney);

                this.setState(GameState.WAIT_SWAP_CLICK);
                break;
            }
            default:
                break;
        }
    }

    private onMouseDown(event:EventMouse):void
    {
        if (this._currentState != GameState.WAIT_SIMPLE_CLICK
            && this._currentState != GameState.WAIT_BOMB_CLICK
            && this._currentState != GameState.WAIT_SWAP_CLICK)
            return;
        
        let screenPoint3D:Vec3 = this._fieldPanelScript.getContentXY(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        let screenPoint2D:Vec2 = new Vec2(screenPoint3D.x, screenPoint3D.y);
        let inGrid:[Position, Vec2] = this._fieldLogic.grid.screenToGrid(screenPoint2D);

        if (inGrid[0] == Position.IN && this._fieldLogic.shapeRectangle.isInShape(inGrid[1]))
        {
            // log("==== >>> In Griid <<< ====");
            
            if (event.getButton() == 0)
            {
                switch (this._currentState)
                {
                    case GameState.WAIT_SIMPLE_CLICK:   this.simpleClickAction(inGrid[1]); break;
                    case GameState.WAIT_BOMB_CLICK:     this.bombClickAction(inGrid[1]); break;
                    case GameState.WAIT_SWAP_CLICK:     this.swapClickAction(inGrid[1]); break;
                }
            }
        }
        else
        {
            // log("==== >>> Out Of Griid <<< ====");
        }
        
        // INFO: средняя кнопка мыши тестовое перемешивание
        if (event.getButton() == 1)
        {
            this.shuffle();
        }

        // INFO: правая кнопка мыши тестовое пересоздание уровня без сброса прогресса
        if (event.getButton() == 2)
        {
            this.setState(GameState.CREATE_LEVEL);
        }
    }

    private onMouseMove(event:EventMouse):void
    {
        if (this._currentState != GameState.WAIT_BOMB_CLICK)
            return;
        
        let screenPoint3D:Vec3 = this._fieldPanelScript.getContentXY(new Vec3(event.getLocationX(), event.getLocationY(), 0));
        let screenPoint2D:Vec2 = new Vec2(screenPoint3D.x, screenPoint3D.y);
        let inGrid:[Position, Vec2] = this._fieldLogic.grid.screenToGrid(screenPoint2D);

        if (inGrid[0] == Position.IN && this._fieldLogic.shapeRectangle.isInShape(inGrid[1]))
        {
            this.selectTiles(false);
            this._fieldLogic.clearSelectedTiles();
            this._fieldLogic.selectCircle(inGrid[1]);
            this.selectTiles(true);
        }
        else
        {
            this.selectTiles(false);
            this._fieldLogic.clearSelectedTiles();
        }
    }

    private selectTiles(select:boolean):void
    {
        for (let i:number = 0; i < this._fieldLogic.selectedTiles.length; i++)
        {
            let currentTile:Tile = this._fieldLogic.selectedTiles[i];
            currentTile.setSelected(select);
        }
    }
}