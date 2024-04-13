import { _decorator, Button, Component, director, log, Node, ProgressBar, SceneAsset, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenuScript')
export class MainMenuScript extends Component
{
    @property(Node)
    private mainMenuLogo:Node = null;

    @property(Node)
    private mainMenuPanel:Node = null;

    @property(Node)
    private sceneLoaderPanel:Node = null;

    @property(ProgressBar)
    private progressBar:ProgressBar = null;

    start()
    {
        let logoOldPos:Vec3 = this.mainMenuLogo.getPosition().clone();
        
        this.mainMenuLogo.setPosition(this.mainMenuLogo.getPosition().add(new Vec3(0, 200, 0)));
        
        tween(this.mainMenuLogo)
            .to(1.4, {position: logoOldPos}, { easing: 'elasticOut' })
            .call(() => {
                
            })
            .start();

        this.mainMenuPanel.setScale(new Vec3());

        tween(this.mainMenuPanel)
            .to(1.4, {scale: new Vec3(1, 1, 1)}, { easing: 'elasticOut' })
            .call(() => {
                
            })
            .start();
    }

    public startGame():void
    {
        this.mainMenuLogo.active = false;
        this.mainMenuPanel.active = false;
        this.sceneLoaderPanel.active = true;
        this.progressBar.progress = 0.0;

        director.preloadScene("InGameScene", this.onPorogressLoadScene, (error: null | Error, sceneAsset?: SceneAsset) => {
            director.loadScene("InGameScene");
        });
    }

    private onPorogressLoadScene = (completedCount:number, totalCount:number, iten:any) =>
    {
        this.progressBar.progress = completedCount / totalCount;
    }
}


