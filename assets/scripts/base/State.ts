import { animation, AnimationClip, SpriteFrame, Sprite } from 'cc';
import ResourceManager from '../runtime/ResourceManager';
import { StateMachine } from './StateMachine';
import { sortSpriteFrame } from '../utils/index';

const ANIMATION_SPACE = 1 / 8

export default class State {
    private animationClip: AnimationClip

    constructor(private fsm: StateMachine, private resPath: string, private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
        this.init()
    }

    async init() {
        const promise = ResourceManager.Instance.loadDir(this.resPath)
        this.fsm.waitingList.push(promise)

        const spriteFrames = await promise
        this.animationClip = new AnimationClip()
        this.animationClip.duration = spriteFrames.length * ANIMATION_SPACE // 整个动画剪辑的周期
        const track = new animation.ObjectTrack() // 创建一个向量轨道
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
        const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, i) => [ANIMATION_SPACE * i, item])
        track.channel.curve.assignSorted(frames)
        // 最后将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track)
        this.animationClip.name = this.resPath
        this.animationClip.wrapMode = this.wrapMode
    }

    run() {
        if (this.fsm.animationComponent?.defaultClip?.name == this.animationClip.name) { return }
        this.fsm.animationComponent.defaultClip = this.animationClip
        this.fsm.animationComponent.play()
    }
}