import { _decorator } from 'cc'
import { EVENT_ENUM, PLAYER_CTRL_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums/index';
import EventManager from '../runtime/EventManager';
import DataManager from '../runtime/DataManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { EnemyManager } from '../base/EnemyManager';
import { IEntity } from '../levels/index';
const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine)
        await this.fsm.init()

        super.init(params)

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
    }

    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
    }

    onAttack() {
        if (this.state == ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) { return }
        let { x: playerX, y: playerY } = DataManager.Instance.player

        if (
            (this.x == playerX && Math.abs(this.y - playerY) <= 1) ||
            (this.y == playerY && Math.abs(this.x - playerX) <= 1)
        ) {
            this.state = ENTITY_STATE_ENUM.ATTACK
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
        } else {
            this.state = ENTITY_STATE_ENUM.IDLE
        }
    }
}

