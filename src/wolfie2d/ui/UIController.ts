/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"
import { TiledLayer } from "../scene/tiles/TiledLayer";

export class UIController {
    private spriteToDrag : AnimatedSprite;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;

    public constructor(canvasId : string, initScene : SceneGraph) {
        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        document.addEventListener("keydown", this.keyDownHandler);
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        /*
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }
        */
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        /*
        if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }
        */

        if (this.scene.getPlayer() && this.scene.getIsPlayerInControl()) {
            let mouseX : number = event.clientX;
            let mouseY : number = event.clientY;
            let worldX : number = this.scene.getViewport().getX() + mouseX - 64;
            let worldY : number = this.scene.getViewport().getY() + mouseY - 64;
            let playerX : number = this.scene.getPlayer().getPosition().getX();
            let playerY : number = this.scene.getPlayer().getPosition().getY();

            //figure out direction to set
            let angle : number = Math.atan2((worldY - playerY), (worldX - playerX)) * 180 / Math.PI;
            let direction : number = 3;
            direction -= (angle / 180) * 2; // *2 because 180 degrees in direction is 2
            direction %= 4;

            this.scene.getPlayer().setDirection(direction);
            this.scene.getPlayer().getPosition().set(worldX, worldY, 0, 1);
        }
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        //this.spriteToDrag = null;
    }

    public keyDownHandler = (event : KeyboardEvent) : void => {
        let key : String = String.fromCharCode(event.keyCode);

        let world : TiledLayer[] = this.scene.getTiledLayers();
        let worldWidth : number = world[0].getColumns() * world[0].getTileSet().getTileWidth();
        let worldHeight : number = world[0].getRows() * world[0].getTileSet().getTileHeight();

        let playerX = this.scene.getPlayer().getPosition().getX();
        let playerY = this.scene.getPlayer().getPosition().getY();

        if (key == 'W') {
            //console.log("up");
            if (this.scene.getViewport().getY() > 0) {
                this.scene.getViewport().inc(0, -1);
                this.scene.getPlayer().getPosition().set(playerX, playerY - 1, 0, 1);
            }
        }
        if (key == 'A') {
            //console.log("left");
            if (this.scene.getViewport().getX() > 0) {
                this.scene.getViewport().inc(-1, 0);
                this.scene.getPlayer().getPosition().set(playerX - 1, playerY, 0, 1);
            }
        }
        if (key == 'S') {
            //console.log("down");
            if (this.scene.getViewport().getY() <  worldHeight - this.scene.getViewport().getHeight()) {
                this.scene.getViewport().inc(0, 1);
                this.scene.getPlayer().getPosition().set(playerX, playerY + 1, 0, 1);
            }
        }
        if (key == 'D') {
            //console.log("right");
            if (this.scene.getViewport().getX() <  worldWidth - this.scene.getViewport().getWidth()) {
                this.scene.getViewport().inc(1, 0);
                this.scene.getPlayer().getPosition().set(playerX + 1, playerY, 0, 1);
            }
        }
    }
}