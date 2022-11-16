import { _decorator, UITransform } from 'cc';
import { EVENT_ENUM, PLAYER_CTRL_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums/index';
import EventManager from '../runtime/EventManager';
import { EntityManager } from '../base/EntityManager';
import DataManager from '../runtime/DataManager';
import { BurstStateMachine } from './BurstStateMachine';
import { WIDTH, HEIGHT } from '../map/TileManager';
import { IEntity } from '../levels/index';
const { ccclass, property } = _decorator

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(BurstStateMachine)
        await this.fsm.init()

        super.init(params)

        const uiTransform = this.getComponent(UITransform)
        uiTransform.setContentSize(WIDTH, HEIGHT)

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
    }

    update() {
        this.node.setPosition(this.x * WIDTH, this.y * HEIGHT)
    }

    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst)
    }

    onBurst() {
        if (this.state == ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) { return }
        let { x: playerX, y: playerY } = DataManager.Instance.player
        if (this.x == playerX && this.y == playerY && this.state == ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK
        } else if (this.state == ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH
            if (this.x == playerX && this.y == playerY) {
                EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
            }
        }
    }
}
