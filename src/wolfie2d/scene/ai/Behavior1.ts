import { AnimatedSprite } from "../sprite/AnimatedSprite";
import { SceneGraph } from "../SceneGraph";
import { TiledLayer } from "../tiles/TiledLayer";
import { Behavior } from "./Behavior";

export class Behavior1 extends Behavior {
    private framesToChangeDirection : number;

    public constructor(scene : SceneGraph, animatedSprite : AnimatedSprite) {
        super(scene, animatedSprite);
        this.framesToChangeDirection = 0;
    }

    public takeAction() : void {
        let x : number = this.getAnimatedSprite().getPosition().getX();
        let y : number = this.getAnimatedSprite().getPosition().getY();
        let direction : number = this.getAnimatedSprite().getDirection();
        if (this.framesToChangeDirection == 0) {
            this.getAnimatedSprite().setDirection(Math.floor(Math.random() * 4));
            this.framesToChangeDirection = Math.floor(Math.random() * 100);    
        }

        direction = this.getAnimatedSprite().getDirection();
        let newX : number = x;
        let newY : number = y;
        if (direction % 2 == 0) {
            newY += (direction - 1) % 2;
        }
        else {
            newX += (direction - 2) % 2;
        }

        let world : TiledLayer[] = this.getScene().getTiledLayers();
        let worldWidth : number = world[0].getColumns() * world[0].getTileSet().getTileWidth();
        let worldHeight : number = world[0].getRows() * world[0].getTileSet().getTileHeight();

        //Change the direction while movement makes the sprite try to move out of bounds
        while (newX < 0 || newX >= worldWidth || newY < 0 || newY >= worldHeight) {
            this.getAnimatedSprite().setDirection(Math.floor(Math.random() * 4));
            direction = this.getAnimatedSprite().getDirection();
            this.framesToChangeDirection = Math.floor(Math.random() * 100); 
            newX = x;
            newY = y;
            if (direction % 2 == 0) {
                newY += (direction - 1) % 2;
            }
            else {
                newX += (direction - 2) % 2;
            }
        }

        this.getAnimatedSprite().getPosition().set(newX, newY, 0, 1);
        this.framesToChangeDirection--;

    }
};