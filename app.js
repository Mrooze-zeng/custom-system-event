(function() {
  function debounce(func, wait = 0) {
    let timer;
    return function(...args) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function CustomSystemEvent() {
    this.mql = window.matchMedia("(orientation: portrait)");
    this.resizeWindow = window.matchMedia("(max-width:665px)");
    this.isPortrait = this.mql.matches;
    this.isRotated = false;
    this.rect = {
      initalOrientationIsPortrait: this.mql.matches,
      barHeight: 0,
      origin: {
        w: document.body.clientWidth,
        h: window.innerHeight
      },
      rotated: {
        w: 0,
        h: 0
      }
    };
    this.rotation = document.body.clientWidth;
    this.events = {
      "scroll-start": new Event("scroll-start"),
      "scroll-on": new Event("scroll-on"),
      "scroll-stop": new Event("scroll-stop"),
      "device-portrait": new Event("device-portrait"),
      "device-landscape": new Event("device-landscape"),
      rotate: new Event("rotate"),
      "keyboard-raise": new Event("keyboard-raise"),
      "keyboard-down": new Event("keyboard-down")
    };
    this.isScrollStart = true;
    this.timer = null;
    this.resizeListener = this.resizeListener.bind(this);
    this.mqlListener = this.mqlListener.bind(this);
    this.resizeWindowListener = this.resizeWindowListener.bind(this);
    this.focusinListener = this.focusinListener.bind(this);
    this.focusoutListener = this.focusoutListener.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.init();
  }

  CustomSystemEvent.prototype.init = function() {
    window.addEventListener("scroll", this.scrollHandler);
    this.mql.addListener(this.mqlListener);
    this.resizeWindow.addListener(this.resizeWindowListener);
    if (/android/i.test(navigator.userAgent)) {
      window.addEventListener("resize", this.resizeListener);
    }
    if (/ipad|iphone/i.test(navigator.userAgent)) {
      document.addEventListener("focusin", this.focusinListener);
      document.addEventListener("focusout", this.focusoutListener);
    }
  };

  CustomSystemEvent.prototype.destory = function() {
    window.removeListener("scroll", this.scrollHandler);
    this.mql.removeListener(this.mqlListener);
    this.resizeWindow.removeListener(this.resizeWindowListener);
    if (/android/i.test(navigator.userAgent)) {
      window.removeEventListener("resize", this.resizeListener);
    }
    if (/ipad|iphone/i.test(navigator.userAgent)) {
      document.removeEventListener("focusin", this.focusinListener);
      document.removeEventListener("focusout", this.focusoutListener);
    }
  };

  CustomSystemEvent.prototype.scrollHandler = debounce(function(evt) {
    if (this.isScrollStart) {
      window.dispatchEvent(this.events["scroll-start"]);
      this.isScrollStart = false;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      window.dispatchEvent(this.events["scroll-on"]);
    }
    this.timer = setTimeout(() => {
      window.dispatchEvent(this.events["scroll-stop"]);
      this.isScrollStart = true;
    }, 250);
  });

  CustomSystemEvent.prototype.resizeWindowListener = function(evt) {
    if (this.rotation != document.body.clientWidth) {
      window.dispatchEvent(this.events["rotate"]);
      this.rotation = document.body.clientWidth;
    }
  };

  CustomSystemEvent.prototype.mqlListener = function(evt) {
    this.isPortrait = evt.matches;
    this.isRotated = true;
    if (evt.matches) {
      window.dispatchEvent(this.events["device-portrait"]);
    } else {
      window.dispatchEvent(this.events["device-landscape"]);
    }
    if (this.rotation != document.body.clientWidth) {
      window.dispatchEvent(this.events["rotate"]);
      this.rotation = document.body.clientWidth;
    }
  };

  CustomSystemEvent.prototype.focusinListener = debounce(function(evt) {
    if (["input", "textarea"].includes(evt.target.tagName.toLowerCase())) {
      window.dispatchEvent(this.events["keyboard-raise"]);
    }
  });

  CustomSystemEvent.prototype.focusoutListener = debounce(function(evt) {
    if (["input", "textarea"].includes(evt.target.tagName.toLowerCase())) {
      window.dispatchEvent(this.events["keyboard-down"]);
    }
  });

  CustomSystemEvent.prototype.resizeListener = function(evt) {
    if (evt.target instanceof HTMLElement) {
      return;
    }
    if (this.isRotated) {
      this.rect["rotated"] = {
        w: document.body.clientWidth,
        h: window.innerHeight
      };
    }

    if (this.rect["origin"].w == document.body.clientWidth) {
      if (this.rect["origin"].h >= window.innerHeight) {
        window.dispatchEvent(this.events["keyboard-raise"]);
      } else {
        window.dispatchEvent(this.events["keyboard-down"]);
      }
    } else {
      this.rect["barHeight"] = Math.abs(
        this.rect["origin"].h - this.rect["rotated"].w
      );
      if (this.rect.initalOrientationIsPortrait) {
        if (this.rect["origin"].w / 2 >= this.rect["rotated"].h) {
          window.dispatchEvent(this.events["keyboard-raise"]);
        } else {
          window.dispatchEvent(this.events["keyboard-down"]);
        }
      } else {
        if (
          this.rect["origin"].w >=
          this.rect["rotated"].h + this.rect["barHeight"]
        ) {
          window.dispatchEvent(this.events["keyboard-raise"]);
        } else {
          window.dispatchEvent(this.events["keyboard-down"]);
        }
      }
    }
    // console.log(this.rect);
  };
  return new CustomSystemEvent();
})();
