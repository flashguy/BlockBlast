import { _decorator, Component, director, Node, ProgressBar, SceneAsset, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenuScript')
export class MainMenuScript extends Component
{
    @property(Node)
    private mainMenuLogo:Node = null;

    @property(Node)
    private mainMenuPanel:Node = null;

    @property(Node)
    private screenLoaderPanel:Node = null;

    @property(ProgressBar)
    private progressBar:ProgressBar = null;

    start()
    {
        let logoOldPos:Vec3 = this.mainMenuLogo.getPosition().clone();
        
        this.mainMenuLogo.setScale(new Vec3(1, 1, 1));
        this.mainMenuLogo.setPosition(this.mainMenuLogo.getPosition().add(new Vec3(0, 200, 0)));
        
        tween(this.mainMenuLogo)
            .to(0.4, {position: logoOldPos}, { easing: 'backOut' })
            .call(() => {
                
            })
            .start();

        this.mainMenuPanel.setScale(new Vec3());

        tween(this.mainMenuPanel)
            .to(0.4, {scale: new Vec3(1, 1, 1)}, { easing: 'backOut' })
            .call(() => {
                
            })
            .start();
    }

    public startGame():void
    {
        tween(this.mainMenuLogo)
            .to(0.4, {scale: new Vec3(0, 0, 1)}, { easing: 'backIn' })
            .call(() => {
                
            })
            .start();

        tween(this.mainMenuPanel)
            .to(0.4, {scale: new Vec3(0, 0, 1)}, { easing: 'backIn' })
            .call(() => {
                this.screenLoaderPanel.active = true;
                this.progressBar.progress = 0.0;

                director.preloadScene("InGameScene", this.onPorogressLoadScreene, (error: null | Error, sceneAsset?: SceneAsset) => {
                    let interval:number = setInterval(() => {
                        clearInterval(interval);
                        this.screenLoaderPanel.active = false;
                        director.loadScene("InGameScene");
                    }, 500);
                });
            })
            .start();
    }

    private onPorogressLoadScreene = (completedCount:number, totalCount:number, iten:any) =>
    {
        this.progressBar.progress = completedCount / totalCount;
    }
}