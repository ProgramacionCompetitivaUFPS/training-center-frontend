import { bindable, bindingMode, inject, observable } from 'aurelia-framework'
import { Date } from 'services/services'

@inject(Date)
export class Clock {
  @bindable({defaultBindingMode: bindingMode.twoWay}) date
  @bindable({defaultBindingMode: bindingMode.twoWay}) dateLoaded
  @bindable({defaultBindingMode: bindingMode.twoWay}) showTimer
  @bindable({defaultBindingMode: bindingMode.twoWay}) startDate
  @bindable({defaultBindingMode: bindingMode.twoWay}) endDate

  constructor(dateService) {
    this.date = null
    this.dateLoaded = false
    this.dateService = dateService
    this.initDate()
  }

  initDate() {
    if(this.date !== null) {
      this.dateLoaded = true
      return
    } else {
      this.dateService.getServerDate()
        .then(data => {
          this.date = new window.Date(data.date)
          this.dateLoaded = true
          this.updateEverySecond()
      }) 
    }
  }

  updateEverySecond() {
    setInterval(() => {
      this.date.setTime(this.date.getTime() + 1000)
      if(this.showTimer) this.showCont()
    }, 1000)
  }  
  
  showCont() {
    if (this.date >= this.startDate && this.date < this.endDate) {
      let millis = this.endDate - this.date
      this.state = 0
      this.hours = 0
      this.seconds = Math.floor(millis / 1000)
      this.minutes = Math.floor(this.seconds / 60)
      this.seconds %= 60
      this.hours = Math.floor(this.minutes / 60)
      this.minutes %= 60
    } else if (this.date < this.startDate) {
      this.state = 1
      let millis = this.startDate - this.date
      this.hours = 0
      this.seconds = Math.floor(millis / 1000)
      this.minutes = Math.floor(this.seconds / 60)
      this.seconds %= 60
      this.hours = Math.floor(this.minutes / 60)
      this.minutes %= 60
    } else {
      this.state = 2
    }
  }
}