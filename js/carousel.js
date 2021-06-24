class Carousel {
   constructor(p) {
      let settings = (() => 
                        ({...{containerID: '#carousel', slide: '.slide', isPlaying: true, interval: 5000}, ...p}))();
      this.container = document.querySelector(settings.containerID);
      this.slides = this.container.querySelectorAll(settings.slide);
      this.isPlaying = settings.isPlaying;
      this.interval = settings.interval;
   }

   _initProps() {
      this.slidesCount = this.slides.length;
      this.currentSlide = 0;
      
      this.SPACE = ' ';
      this.LEFT_ARROW = 'ArrowLeft';
      this.RIGHT_ARROW = 'ArrowRight';
      this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
      this.FA_PLAY = '<i class="far fa-play-circle"></i>';
      this.FA_PREV = '<i class="fas fa-angle-left"></i>';
      this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
   }
   
   _initControls() {
      const controls = document.createElement('div');
      const pause = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
      const prev = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
      const next = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;
   
   
      controls.setAttribute('class', 'controls');
      controls.innerHTML = pause + prev + next;
   
      this.container.appendChild(controls);
   
      this.pauseBtn = this.container.querySelector('#pause-btn');
      this.prevBtn = this.container.querySelector('#prev-btn');
      this.nextBtn = this.container.querySelector('#next-btn');
   }
   
   _initIndicators() {
      const indicators = document.createElement('ol');
   
      indicators.setAttribute('class', 'indicators');
   
      for (let i = 0, n = this.slidesCount; i < n; i++) {
         const indicator = document.createElement('li');
   
         indicator.setAttribute('class', 'indicator');
         indicator.dataset.slideTo = `${i}`;
         i === 0 && indicator.classList.add('active');
   
         indicators.appendChild(indicator);
      }
   
      this.container.appendChild(indicators);
   
      this.indContainer = this.container.querySelector('.indicators');
      this.indItems = this.container.querySelectorAll('.indicator');
   }
   
   _initListeners() {
      this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
      this.prevBtn.addEventListener('click', this.prev.bind(this));
      this.nextBtn.addEventListener('click', this.next.bind(this));
      this.indContainer.addEventListener('click', this._indicate.bind(this));
      document.addEventListener('keydown', this._pressKey.bind(this));
   }
   
   _goToSlide (n){
      this.slides[this.currentSlide].classList.toggle('active');
      this.indItems[this.currentSlide].classList.toggle('active');
      this.currentSlide = (n + this.slidesCount) % this.slidesCount;
      this.slides[this.currentSlide].classList.toggle('active');
      this.indItems[this.currentSlide].classList.toggle('active');
   }
   
   _prevSlide() {
      this._goToSlide(this.currentSlide - 1);
   }
   
   _nextSlide() {
      this._goToSlide(this.currentSlide + 1);
   }

   _indicate(e){
      let target = e.target;
      if (target && target.classList.contains('indicator')){
         this.pause();
         this._goToSlide(+target.dataset.slideTo);
      }
   }
   
   _pressKey (e){
      if (e.key === this.LEFT_ARROW) this.prev();
      if (e.key === this.RIGHT_ARROW) this.next();
      if (e.key === this.SPACE) this.pausePlay();
   }
   
   pause(){
      if (this.isPlaying){
         clearInterval(this.timerID);
         this.isPlaying = false;
         this.pauseBtn.innerHTML = this.FA_PLAY;
      }
   }
   
   play(){
      if (!this.isPlaying) {
         this.timerID = setInterval(() => this._nextSlide(), this.interval);
         this.isPlaying = true;
         this.pauseBtn.innerHTML = this.FA_PAUSE;
       }
   }
   
   pausePlay() {
      this.isPlaying ? this.pause() : this.play();
   }
   
   prev(){
      this.pause();
      this._prevSlide();
   }
   
   next(){
      this.pause();
      this._nextSlide();
   }
   
   init() {
      this._initProps();
      this._initControls();
      this._initIndicators();
      this._initListeners();
      if(this.isPlaying) this.timerID = setInterval(() => this._nextSlide(), this.interval);
   }
}

class SwipeCarousel extends Carousel {
   _swipeStart(e) {
      this.swipeStartX = e.changedTouches[0].pageX;
   };

   _swipeEnd(e) {
      this.swipeEndX = e.changedTouches[0].pageX;

      if(this.swipeStartX - this.swipeEndX < 100) this.prev();
      if(this.swipeStartX - this.swipeEndX > -100) this.next();
   };

   _initListeners() {
      super._initListeners();
      this.container.addEventListener('touchstart', this._swipeStart.bind(this));
      this.container.addEventListener('touchend', this._swipeEnd.bind(this));
   }
}