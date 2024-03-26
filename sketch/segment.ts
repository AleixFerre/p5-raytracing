namespace Custom {
  export abstract class Segment {
    abstract draw():void 
    abstract intersection(ray:Ray):p5.Vector | null
    abstract reflection(ray:Ray):p5.Vector | null
  }
}
