import Item, { rawItemToItem } from './Item'
import { Trait } from './Otto'

export interface ForgeFormula {
  id: number
  result: Item
  materials: Item[]
  amounts: number[]
  title: string
  description: string
  startTime: Date
  endTime: Date
  bgImage: string
  leftImage: string
  rightImage: string
}

export interface RawForgeFormula {
  id: number
  result: Trait
  materials: Trait[]
  amounts: number[]
  title: string
  description: string
  start_time: Date
  end_time: Date
  bg_img: string
  left_img: string
  right_img: string
}

export const rawForgeToForge = (raw: RawForgeFormula): ForgeFormula => {
  return {
    id: raw.id,
    result: rawItemToItem('', raw.result),
    materials: raw.materials.map(rawItem => rawItemToItem('', rawItem)),
    amounts: raw.amounts,
    title: raw.title,
    description: raw.description,
    startTime: new Date(raw.start_time),
    endTime: new Date(raw.end_time),
    bgImage: raw.bg_img,
    leftImage: raw.left_img,
    rightImage: raw.right_img,
  }
}
