import { _decorator } from 'cc'
import { EVENT_ENUM, PLAYER_CTRL_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums/index';
import EventManager from '../runtime/EventManager';
import { EntityManager } from '../base/EntityManager';
import DataManager from '../runtime/DataManager';
import { IEntity } from '../levels/index';
const { ccclass, property } = _decorator

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
    async init(params: IEntity) {
        super.init(params)

        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)

        this.onChangeDirection(true)
    }

    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
        EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
    }

    onChangeDirection(isInit: boolean = false) {
        if (this.state == ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) { return }
        let { x: playerX, y: playerY } = DataManager.Instance.player
        playerY = Math.abs(playerY)
        const disX = Math.abs(this.x - playerX)
        const disY = Math.abs(this.y - playerY)

        if (disX == disY && !isInit) {
            return
        }

        if (playerX >= this.x && playerY <= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
        }
        if (playerX <= this.x && playerY <= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
        }
        if (playerX <= this.x && playerY >= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
        }
        if (playerX >= this.x && playerY >= this.y) {
            this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
        }
    }

    onDead(id: string) {
        if (this.state == ENTITY_STATE_ENUM.DEATH) { return }
        if (id == this.id) { this.state = ENTITY_STATE_ENUM.DEATH }
    }
}

