import { Layers, Node, UITransform, SpriteFrame, Vec2 } from 'cc';

const getUIMaskNumber = () => 1 << Layers.nameToLayer('UI_2D')

export const createUINode = (name: string = '') => {
    const node = new Node(name)
    node.layer = getUIMaskNumber()
    const transform = node.addComponent(UITransform)
    transform.anchorPoint = new Vec2(0, 1)

    return node
}

export const randomByLen = (len: number) => Array.from({ length: len }).reduce<string>((total, item) => total + Math.floor(Math.random() * 10), '')

export const randomByRange = (start: number, end: number) => Math.floor(start + (end - start) * Math.random())

const reg = /\((\d+)\)/

const getNumberWithinString = (str: string) => parseInt(str.match(reg)[1] || '0')

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) => spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))