import CONST from '../../constants.js'
import { countColumns, countRows, randomInt } from '../../helpers.js'

export default class Stroke {
  constructor(p, color, size, y) {
    this.p = p
    this.size = size
    this.color = color
    this.startX = 0
    this.startY = y

    this.easing_ = new p5.Ease()
    this.init()
  }

  init() {
    this.fall_ = false
    this.timer_ = 0.
    this.speed_ = 0.01
    this.reachedDest_ = false
    this.rows_ = countRows(this.p.height, CONST.CELL_SIZE)
    this.currentX_ = this.startX
    this.currentY_ = this.startY
    this.currentDX_ = this.startX
    this.currentDY_ = this.startY
    this.destX_ = this.rows_ - this.startY + 1
    this.destY_ = this.rows_ + 1
    this.lastFrame_ = this.p.frameCount
  }

  draw() {
    const offset = this.size / 2
    this.p.stroke(this.color)
    this.p.strokeWeight(this.size)
    this.p.strokeCap(this.p.ROUND)
    this.p.line(this.currentX_ - CONST.CELL_SIZE, (this.currentY_ - 1)*CONST.CELL_SIZE, this.currentDX_*CONST.CELL_SIZE, this.currentDY_*CONST.CELL_SIZE)

    this.animateStroke()
  }

  animateStroke() {
    const q = this.easing_.linear(this.timer_, this.p) // play around with diff easings

    if (!this.reachedDest_) {
      if (this.fall_) {
        this.currentX_ = this.p.map(q, 0., 1., this.currentX_, this.destX_)
        this.currentY_ = this.p.map(q, 0., 1., this.currentY_, this.destY_)
        this.timer_+=this.speed_

        if (this.currentX_ == this.destX_ && this.currentY_ == this.destY_) {
          this.timer_ = 0.
          this.reachedDest_ = true
          this.lastFrame_ = this.p.frameCount
        }
      } else {
        this.currentDX_ = this.p.map(q, 0., 1., this.currentDX_, this.destX_)
        this.currentDY_ = this.p.map(q, 0., 1., this.currentDY_, this.destY_)
        this.timer_+=this.speed_

        if (this.currentDX_ == this.destX_ && this.currentDY_ == this.destY_) {
          this.timer_ = 0.
          this.fall_ = true
        }
      }
    } else {
      // repeat every 80 frames
      if ((this.lastFrame_ - this.p.frameCount) % 80 == 0) {
        this.currentX_ = this.startX
        this.currentY_ = this.startY
        this.currentDX_ = this.startX
        this.currentDY_ = this.startY
        this.fall_ = false
        this.reachedDest_ = false
      }
    }
  }
 }
