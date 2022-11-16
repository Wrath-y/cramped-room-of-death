import { _decorator } from 'cc'
import { EVENT_ENUM, PLAYER_CTRL_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums/index';
import EventManager from '../runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../base/EntityManager';
import DataManager from '../runtime/DataManager';
import { IEntity } from '../levels/index';
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    targetX: number = 0
    targetY: number = 0
    isMoving: boolean = false
    private moveSpeed: number = 0.1

    async init(params: IEntity) {
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()

        super.init(params)
        this.targetX = this.x
        this.targetY = this.y

        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDeath, this)
    }

    update() {
        this.updateXY()
        super.update()
    }

    updateXY() {
        if (this.targetX < this.x) {
            this.x -= this.moveSpeed
        }
        if (this.targetX > this.x) {
            this.x += this.moveSpeed
        }
        if (this.targetY < this.y) {
            this.y -= this.moveSpeed
        }
        if (this.targetY > this.y) {
            this.y += this.moveSpeed
        }

        if (this.isMoving && Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
            this.isMoving = false
            this.x = this.targetX
            this.y = this.targetY
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }

    onDeath(type: ENTITY_STATE_ENUM) {
        this.state = type
    }

    inputHandle(cmd: PLAYER_CTRL_ENUM) {
        if (this.isMoving) {
            return
        }
        if (this.state == ENTITY_STATE_ENUM.DEATH || this.state == ENTITY_STATE_ENUM.AIRDEATH || this.state == ENTITY_STATE_ENUM.ATTACK) {
            return
        }
        const id = this.willAttack(cmd)
        if (id) {
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
            EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
            return
        }
        if (this.willBlock(cmd)) {
            return
        }
        this.move(cmd)
    }

    move(cmd: PLAYER_CTRL_ENUM) {
        switch (cmd) {
            case PLAYER_CTRL_ENUM.UP:
                this.targetY += 1
                this.isMoving = true
                break
            case PLAYER_CTRL_ENUM.DOWN:
                this.targetY -= 1
                this.isMoving = true
                break
            case PLAYER_CTRL_ENUM.LEFT:
                this.targetX -= 1
                this.isMoving = true
                break
            case PLAYER_CTRL_ENUM.RIGHT:
                this.targetX += 1
                this.isMoving = true
                break
            case PLAYER_CTRL_ENUM.TURNLEFT:
                switch (this.direction) {
                    case DIRECTION_ENUM.TOP:
                        this.direction = DIRECTION_ENUM.LEFT
                        break
                    case DIRECTION_ENUM.LEFT:
                        this.direction = DIRECTION_ENUM.BOTTOM
                        break
                    case DIRECTION_ENUM.BOTTOM:
                        this.direction = DIRECTION_ENUM.RIGHT
                        break
                    case DIRECTION_ENUM.RIGHT:
                        this.direction = DIRECTION_ENUM.TOP
                        break
                }
                this.state = ENTITY_STATE_ENUM.TURNLEFT
                EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
                break
        }
    }

    willAttack(cmd: PLAYER_CTRL_ENUM): string {
        const enemies = DataManager.Instance.enemies.filter(v => v.state != ENTITY_STATE_ENUM.DEATH)
        for (let i = 0; i < enemies.length; i++) {
            const { x: enemyX, y: enemyY, id: enemyId } = enemies[i]
            if (cmd == PLAYER_CTRL_ENUM.UP && this.direction == DIRECTION_ENUM.TOP && enemyX == this.x && enemyY == this.targetY + 2) {
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }
        }
        return ''
    }

    willBlock(cmd: PLAYER_CTRL_ENUM): boolean {
        let { targetX: x, targetY: y, direction } = this
        const { tileInfo } = DataManager.Instance
        let { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
        const enemies = DataManager.Instance.enemies.filter(v => v.state != ENTITY_STATE_ENUM.DEATH)
        const bursts = DataManager.Instance.bursts.filter(v => v.state != ENTITY_STATE_ENUM.DEATH)

        y = Math.abs(y)
        doorY = Math.abs(doorY)
        if (cmd === PLAYER_CTRL_ENUM.UP) {
            const playerNextY = y - 1
            if (direction === DIRECTION_ENUM.TOP) {
                if (playerNextY < 0) {
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                const weaponNextY = y - 2
                const playerTile = tileInfo[x]?.[playerNextY]
                const weaponTile = tileInfo[x]?.[weaponNextY]

                if (doorState != ENTITY_STATE_ENUM.DEATH && x == doorX && (playerNextY == doorY || weaponNextY == doorY)) {
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }

                for (let i = 0; i < enemies.length; i++) {
                    let { x: enemyX, y: enemyY, state: enemyState } = enemies[i]
                    enemyY = Math.abs(enemyY)
                    if (enemyState != ENTITY_STATE_ENUM.DEATH && x == enemyX && (playerNextY == enemyY || weaponNextY == enemyY)) {
                        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                        return true
                    }
                }

                for (let i = 0; i < bursts.length; i++) {
                    let { x: burstX, y: burstY } = bursts[i]
                    burstY = Math.abs(burstY)
                    if (x == burstX && playerNextY == burstY && (!weaponTile || weaponTile.turnAble)) {
                        return false
                    }
                }

                if (playerTile && playerTile.moveAble && (!weaponTile || weaponTile.turnAble)) {

                } else {
                    this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }
        }

        // TODO

        if (cmd == PLAYER_CTRL_ENUM.TURNLEFT) {
            let nextX
            let nextY
            if (direction == DIRECTION_ENUM.TOP) {
                nextX = x - 1
                nextY = y - 1
            }
            if (direction == DIRECTION_ENUM.BOTTOM) {
                nextX = x + 1
                nextY = y + 1
            }
            if (direction == DIRECTION_ENUM.LEFT) {
                nextX = x - 1
                nextY = y + 1
            }
            if (direction == DIRECTION_ENUM.RIGHT) {
                nextX = x + 1
                nextY = y - 1
            }

            if (doorState != ENTITY_STATE_ENUM.DEATH && ((x == doorX && nextY == doorY) || (nextX == doorX && y == doorY) || (nextX == doorX && nextY == doorY))) {
                return true
            }

            for (let i = 0; i < enemies.length; i++) {
                let { x: enemyX, y: enemyY, state: enemyState } = enemies[i];
                enemyY = Math.abs(enemyY)
                if (enemyState != ENTITY_STATE_ENUM.DEATH && ((x == enemyX && nextY == enemyY) || (nextX == enemyX && y == enemyY) || (nextX == enemyX && nextY == enemyY))) {
                    return true
                }
            }

            if (
                (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY]?.turnAble) &&
                (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y]?.turnAble) &&
                (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY]?.turnAble)
            ) {

            } else {
                this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }
        }


        return false
    }
}

