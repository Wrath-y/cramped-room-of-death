import { _decorator, Component, Node } from 'cc';
import { createUINode } from '../utils/index';
import Levels, { ILevel } from '../levels/index';
import DataManager from '../runtime/DataManager';
import EventManager from '../runtime/EventManager';
import { EVENT_ENUM, ENTITY_TYPE_ENUM, ENTITY_STATE_ENUM, DIRECTION_ENUM } from '../enums/index';
import { PlayerManager } from '../player/PlayerManager';
import { WoodenSkeletonManager } from '../woodenSkeleton/WoodenSkeletonManager';
import { TileMapManager } from '../map/TileMapManager';
import { HEIGHT, WIDTH } from '../map/TileManager';
import { DoorManager } from '../door/DoorManager';
import { IronSkeletonManager } from '../ironSkeleton/IronSkeletonManager';
import { BurstManager } from '../burst/BurstManager';
import { SpikesManager } from '../spikes/SpikesManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel = null
    stage: Node = null

    onLoad() {
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
    }

    start() {
        this.generateStage()
        this.initLevel()
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    }

    initLevel() {
        const level = Levels[`level${DataManager.Instance.levelIndex}`]
        if (!level) {
            console.error("level not found")
            return
        }
        this.clearLevel()
        this.level = level
        DataManager.Instance.mapInfo = this.level.mapInfo
        DataManager.Instance.mapRowNumber = this.level.mapInfo.length || 0
        DataManager.Instance.mapColNumber = this.level.mapInfo[0].length || 0
        this.generateTileMap()
        this.generateBursts()
        this.generateSpikes()
        this.generatePlayer()
        this.generateEnemies()
        this.generateDoor()
    }

    nextLevel() {
        DataManager.Instance.levelIndex++
        this.initLevel()
    }

    clearLevel() {
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }

    generateStage() {
        this.stage = createUINode()
        this.stage.setParent(this.node)
    }

    async generateTileMap() {
        if (!this.stage) {
            console.error("stage not created")
            return
        }
        const tileMap = createUINode()
        tileMap.setParent(this.stage)
        const tileMapManager = tileMap.addComponent(TileMapManager)
        await tileMapManager.init()

        this.adaptPos()
    }

    async generatePlayer() {
        const player = createUINode()
        player.setParent(this.stage)
        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init(this.level.player)
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }

    async generateEnemies() {
        const promises = []
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            const node = createUINode()
            node.setParent(this.stage)
            const Manager = enemy.type == ENTITY_TYPE_ENUM.WOODEN_SKELETON ? WoodenSkeletonManager : IronSkeletonManager
            const manager = node.addComponent(Manager)
            promises.push(manager.init(enemy))
            DataManager.Instance.enemies.push(manager)
        }

        await Promise.all(promises)
    }

    async generateDoor() {
        const door = createUINode()
        door.setParent(this.stage)
        const woodenSkeletonManager = door.addComponent(DoorManager)
        await woodenSkeletonManager.init(this.level.door)
        DataManager.Instance.door = woodenSkeletonManager
    }

    async generateBursts() {
        const promises = []
        for (let i = 0; i < this.level.bursts.length; i++) {
            const burst = this.level.bursts[i];
            const node = createUINode()
            node.setParent(this.stage)
            const burstManager = node.addComponent(BurstManager)
            promises.push(burstManager.init(burst))
            DataManager.Instance.bursts.push(burstManager)
        }

        await Promise.all(promises)
    }

    async generateSpikes() {
        const promises = []
        for (let i = 0; i < this.level.spikes.length; i++) {
            const spike = this.level.spikes[i];
            const node = createUINode()
            node.setParent(this.stage)
            const spikesManager = node.addComponent(SpikesManager)
            promises.push(spikesManager.init(spike))
            DataManager.Instance.spikes.push(spikesManager)
        }
    }

    checkArrived() {
        const { x: playerX, y: playerY } = DataManager.Instance.player
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door
        if (doorState == ENTITY_STATE_ENUM.DEATH && doorX == playerX && doorY == playerY) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }
    }

    adaptPos() {
        const { mapRowNumber, mapColNumber } = DataManager.Instance
        const x = WIDTH * mapRowNumber / 2
        const y = HEIGHT * mapColNumber / 2
        this.stage.setPosition(-x, y + 80)
    }
}

