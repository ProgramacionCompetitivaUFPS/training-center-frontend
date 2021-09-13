import Swiper from 'swiper/swiper-bundle.min.js';


export class Home {
    
    constructor() {
        var swiper = new Swiper('.mySwiper', {
            pagination: {
              el: '.swiper-pagination',
            },
          });
    }
}
