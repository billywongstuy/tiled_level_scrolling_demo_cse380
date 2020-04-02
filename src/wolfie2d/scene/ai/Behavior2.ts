import { AnimatedSprite } from "../sprite/AnimatedSprite";
import { SceneGraph } from "../SceneGraph";
import { TiledLayer } from "../tiles/TiledLayer";
import { Behavior } from "./Behavior";

export class Behavior2 extends Behavior {

    private patrolLength : number;
    private framesToChangeDirection : number;
    private playerSprite : AnimatedSprite;

    public constructor(scene : SceneGraph, animatedSprite : AnimatedSprite, playerSprite : AnimatedSprite) {
        super(scene, animatedSprite);
        this.getAnimatedSprite().setDirection(Math.floor(Math.random() * 4)); //random initial direction of patrol
        this.patrolLength = Math.floor(Math.random() * 50) + 50;
        this.framesToChangeDirection = this.patrolLength;
        this.playerSprite = playerSprite;
    }

    public takeAction() {
        /*
        have them patrol back and forth in place but if the player gets near them the bug will go in the opposite direction until out of range. 
        Use a range of 50 world units (i.e. pixels).
        */

        let x : number = this.getAnimatedSprite().getPosition().getX();
        let y : number = this.getAnimatedSprite().getPosition().getY();
        let direction : number = this.getAnimatedSprite().getDirection();

        let playerX = this.playerSprite.getPosition().getX();
        let playerY = this.playerSprite.getPosition().getY();

        //(x-center_x)^2 + (y - center_y)^2 < radius^2

        if (Math.pow((playerX - (x + 64)), 2 ) + Math.pow((playerY - (y + 64)), 2) < Math.pow(50,2)) { //player in range
            this.getAnimatedSprite().setDirection((this.getAnimatedSprite().getDirection() + 2) % 4);
            direction = this.getAnimatedSprite().getDirection();
            this.framesToChangeDirection = this.patrolLength;
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

            //Change the direction if movement makes the sprite try to move out of bounds and auto-adjust
            if (newX < 0 || newX >= worldWidth || newY < 0 || newY >= worldHeight) {
                this.getAnimatedSprite().setDirection((this.getAnimatedSprite().getDirection() + 2) % 4);
                direction = this.getAnimatedSprite().getDirection();
                newX = x;
                newY = y;
                if (direction % 2 == 0) {
                    newY += (direction - 1) % 2;
                }
                else {
                    newX += (direction - 2) % 2;
                }
                this.framesToChangeDirection = this.patrolLength;
            }
            this.getAnimatedSprite().getPosition().set(newX, newY, 0, 1);
        }
        else {
            if (this.framesToChangeDirection == 0) {
                this.getAnimatedSprite().setDirection((this.getAnimatedSprite().getDirection() + 2) % 4);
                this.framesToChangeDirection = this.patrolLength;
            }
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

            //Change the direction if movement makes the sprite try to move out of bounds and auto-adjust
            if (newX < 0 || newX >= worldWidth || newY < 0 || newY >= worldHeight) {
                this.getAnimatedSprite().setDirection((this.getAnimatedSprite().getDirection() + 2) % 4);
                direction = this.getAnimatedSprite().getDirection();
                newX = x;
                newY = y;
                if (direction % 2 == 0) {
                    newY += (direction - 1) % 2;
                }
                else {
                    newX += (direction - 2) % 2;
                }
                this.framesToChangeDirection = this.patrolLength;
            }
            this.getAnimatedSprite().getPosition().set(newX, newY, 0, 1);
            this.framesToChangeDirection--;
        }
    }
}