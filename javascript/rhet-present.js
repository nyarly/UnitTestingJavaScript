/*
 * RhetButler presentation Javascript (version 0.5
 * Build date: 12-05-2013
 *
 * Copyright 2013 Judson Lester (@judsonlester)
 *
 * Inspired by impress.js by
 *   Bartek Szopka (@bartaz)
 *
 * Released under the MIT and GPL Licenses.
 */
var rhetButler = {};
(function() {
  var b = rhetButler;
  b.arrayify = function(a) {
    return[].slice.call(a)
  };
  b.$$ = function(a, b) {
    b = b || document;
    return this.arrayify(b.querySelectorAll(a))
  };
  b.byId = function(a) {
    return document.getElementById(a)
  };
  b.triggerEvent = function(a, b, d) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent(b, !0, !0, d);
    a.dispatchEvent(e)
  };
  var a = "Webkit webkit moz Moz o O ms khtml Khtml".split(" ");
  b.pfx = function() {
    var c = window.getComputedStyle(document.createElement("dummy")), b = {};
    return function(d) {
      if("undefined" === typeof b[d]) {
        var e, f;
        e = d.replace(/-[a-z]/g, function(a) {
          return a.slice(-1)[0].toUpperCase()
        });
        f = [d, e];
        e = e.replace(/^[a-z]/, function(a) {
          return a.toUpperCase()
        });
        var h = a.forEach(function(a) {
          f.push(a + d);
          f.push(a + e);
          f.push(a + "-" + d);
          f.push(a + "-" + e);
          f.push("-" + a + "-" + d);
          f.push("-" + a + "-" + e)
        });
        f = f.concat(h);
        b[d] = null;
        for(var k in f) {
          if(h = c.getPropertyValue(f[k]), null !== h && void 0 !== h) {
            b[d] = f[k];
            break
          }
        }
      }
      return b[d]
    }
  }()
})();
rhetButler.Step = function(b) {
  this.element = b;
  this.groups = [];
  this.steps = []
};
(function() {
  var b = rhetButler.Step.prototype;
  b.toString = function() {
    return"A Step " + this.element.id
  };
  b.setup = function(a, c) {
    this.element = a;
    this.children = [];
    this.indexes = {};
    this.childrenById = {};
    for(field in c) {
      this.indexes[field] = c[field]
    }
    this.element.classList.add("future");
    this.nextItem = this.prevItem = this.lastItem = this.firstItem = this.nextSlide = this.prevSlide = this.lastSlide = this.firstSlide = null
  };
  b.treeFinished = function() {
  };
  b.addClass = function(a) {
    this.element.classList.add(a)
  };
  b.removeClass = function(a) {
    a instanceof RegExp ? Array.prototype.forEach.call(this.element.classList, function(c) {
      a.test(c) && this.element.classList.remove(c)
    }, this) : this.element.classList.remove(a)
  };
  b.hasClass = function(a) {
    return this.element.classList.contains(a)
  };
  b.beginDeparture = function() {
    this.addClass("previous");
    this.removeClass("current");
    this.parent.beginDeparture()
  };
  b.completeDeparture = function() {
    this.removeClass("previous");
    this.removeClass("present");
    this.removeClass("future");
    this.removeClass("current");
    this.addClass("past");
    this.parent.completeDeparture()
  };
  b.beginArrival = function() {
    this.addClass("next");
    this.parent.beginArrival()
  };
  b.completeArrival = function() {
    this.removeClass("next");
    this.addClass("current");
    this.removeClass("future");
    this.removeClass("past");
    this.addClass("present");
    this.parent.completeArrival()
  };
  b.cancelArrival = function() {
    this.removeClass("next")
  };
  b.eachStep = function(a) {
    a(this);
    this.children.forEach(function(c) {
      c.eachStep(a)
    })
  };
  b.relativeLevelPosition = function(a, c) {
    if(!c) {
      return["none", "same", a]
    }
    var b = c.indexes[a] - this.indexes[a];
    return-1 > b ? ["jump", "backwards", "by-" + a] : -1 == b ? ["advance", "backwards", "by-" + a] : 1 == b ? ["advance", "forwards", "by-" + a] : 1 < b ? ["jump", "forwards", "by-" + a] : ["none", "same", "by-" + a]
  };
  b.relativePosition = function(a) {
    var c = this.relativeLevelPosition("slide", a);
    "none" == c[0] && (c = this.relativeLevelPosition("item", a));
    return c
  };
  b.addChild = function(a) {
    this.debugAssoc("Xanc", a);
    var c = this.children.slice(-1)[0];
    c && (this.debugAssoc("Xalc", c), a.addPrevStep(c), c.addNextStep(a));
    this.children.push(a);
    this.addDescendant(a)
  };
  b.addDescendant = function(a) {
    this.childrenById[a.element.id] = a;
    a instanceof rhetButler.Steps.Slide && (this.lastSlide = a, null == this.firstSlide && (this.firstItem = this.firstSlide = a, null != this.prevSlide && (this.prevSlide.addNextSlide(a), a.addPrevSlide(this.prevSlide))));
    a instanceof rhetButler.Steps.Item && (this.lastItem = a);
    this.propagateDescendant(a)
  };
  b.lastChild = function() {
    return 0 < this.children.length ? this.children.slice(-1)[0] : this
  };
  b.debugAssoc = function(a, c) {
  };
  b.addNextRoot = function(a) {
    this.debugAssoc("Xnr", a)
  };
  b.addPrevRoot = function(a) {
    this.debugAssoc("Xpr", a)
  };
  b.addNextGroup = function(a) {
    this.debugAssoc("Xng", a)
  };
  b.addPrevGroup = function(a) {
    this.debugAssoc("Xpg", a)
  };
  b.addNextSlide = function(a) {
    this.debugAssoc("Xns", a)
  };
  b.addPrevSlide = function(a) {
    this.debugAssoc("Xps", a)
  };
  b.addNextItem = function(a) {
    this.debugAssoc("Xni", a)
  };
  b.addPrevItem = function(a) {
    this.debugAssoc("Xpi", a)
  }
})();
rhetButler.ChildStep = function() {
};
rhetButler.ChildStep.prototype = new rhetButler.Step;
(function() {
  var b = rhetButler.ChildStep.prototype, a = rhetButler.Step.prototype;
  b.setup = function(c, b, d) {
    this.parent = c;
    a.setup.call(this, b, d);
    this.parent.addChild(this)
  };
  b.propagateDescendant = function(a) {
    this.parent.addDescendant(a)
  }
})();
rhetButler.Steps = {};
rhetButler.Steps.Group = function(b, a, c) {
  this.setup(b, a, c)
};
rhetButler.Steps.Group.prototype = new rhetButler.ChildStep;
(function() {
  var b = rhetButler.Steps.Group.prototype;
  b.addNextStep = function(a) {
    a.addPrevGroup(this)
  };
  b.addPrevStep = function(a) {
    a.addNextGroup(this)
  };
  b.addNextSlide = function(a) {
    this.debugAssoc("gns", a);
    this.nextSlide = a;
    this.lastSlide && this.lastSlide.addNextSlide(a)
  };
  b.addPrevSlide = function(a) {
    this.debugAssoc("gps", a);
    this.lastSlide || (this.lastSlide = a);
    this.lastItem || (this.lastItem = a.lastChild());
    this.prevSlide = a;
    this.prevItem = a.lastChild()
  };
  b.addNextGroup = function(a) {
    this.debugAssoc("gng", a)
  };
  b.addPrevGroup = function(a) {
    this.debugAssoc("gpg", a);
    this.lastSlide = this.prevSlide = a.lastSlide;
    this.lastItem = a.lastItem
  }
})();
rhetButler.Steps.Item = function(b, a, c, g) {
  this._cue = g;
  this.setup(b, a, c)
};
rhetButler.Steps.Item.prototype = new rhetButler.ChildStep;
(function() {
  var b = rhetButler.Steps.Item.prototype;
  b.cue = function() {
    return this._cue
  };
  b.addChild = function(a) {
    this.parent.addChild(a)
  };
  b.addNextStep = function(a) {
    a.addPrevItem(this)
  };
  b.addPrevStep = function(a) {
    a.addNextItem(this)
  };
  b.addNextItem = function(a) {
    this.debugAssoc("ini", a);
    this.nextItem = a
  };
  b.addPrevItem = function(a) {
    this.debugAssoc("ipi", a);
    this.prevItem = a
  };
  b.beginDeparture = function() {
    this.parent.addClass("prev-" + this.cue());
    this.parent.removeClass(/^current-cue-.*/);
    this.parent.beginDeparture()
  };
  b.completeDeparture = function() {
    this.parent.removeClass("prev-" + this.cue());
    this.parent.completeDeparture()
  };
  b.beginArrival = function() {
    this.parent.addClass("next-" + this.cue());
    this.parent.beginArrival()
  };
  b.completeArrival = function() {
    this.parent.removeClass("next-" + this.cue());
    this.parent.addClass("current-" + this.cue());
    this.parent.completeArrival()
  }
})();
rhetButler.Steps.Root = function(b, a) {
  this.setup(b, a)
};
rhetButler.Steps.Root.prototype = new rhetButler.Step;
(function() {
  var b = rhetButler.Steps.Root.prototype;
  b.propagateDescendant = function(a) {
  };
  b.addNextStep = function(a) {
    a.addPrevRoot(this)
  };
  b.addPrevStep = function(a) {
    a.addNextRoot(this)
  };
  b.beginTransition = function(a) {
    this.addClass("moving");
    this.addClass(a.startElemId());
    this.addClass(a.endElemId());
    a.direction.forEach(function(a) {
      this.addClass(a)
    }, this)
  };
  b.completeTransition = function(a) {
    this.removeClass("moving");
    this.removeClass(a.startElemId());
    this.removeClass(a.endElemId());
    a.direction.forEach(function(a) {
      this.removeClass(a)
    }, this)
  };
  b.beginArrival = function() {
  };
  b.completeArrival = function() {
  };
  b.beginDeparture = function() {
  };
  b.completeDeparture = function() {
  }
})();
rhetButler.Steps.Slide = function(b, a, c) {
  this.setup(b, a, c);
  this.items = []
};
rhetButler.Steps.Slide.prototype = new rhetButler.ChildStep;
(function() {
  var b = rhetButler.Steps.Slide.prototype, a = rhetButler.Step.prototype;
  b.addChild = function(a) {
    this.items.some(function(b) {
      return a.cue() == b.cue()
    }) || this.items.push(a)
  };
  b.treeFinished = function() {
    var c = /^cue-(\d+)/;
    if(0 != this.items.length) {
      this.items = this.items.sort(function(a, b) {
        var g = parseInt(c.exec(a.cue())[1], 10), h = parseInt(c.exec(b.cue())[1], 10);
        return g == h ? a.cue() < b.cue() ? -1 : 1 : g < h ? -1 : 1
      });
      this.items[0].prevItem = this;
      this.nextItem = this.items[0];
      var b = Math.max.apply(void 0, this.items.map(function(a) {
        return a.indexes.item
      }));
      this.items.forEach(function(a) {
        a.indexes.item = b;
        b++
      });
      this.items.forEach(function(b) {
        b.prevSlide = this.prevSlide;
        a.addChild.call(this, b)
      }, this)
    }
  };
  b.addNextStep = function(a) {
    a.addPrevSlide(this)
  };
  b.addPrevStep = function(a) {
    a.addNextSlide(this)
  };
  b.addPrevGroup = function(a) {
    this.debugAssoc("spg", a);
    a.lastSlide && this.addPrevSlide(a.lastSlide)
  };
  b.addNextSlide = function(a) {
    this.debugAssoc("sns", a);
    this.nextSlide = a;
    this.children.forEach(function(b) {
      b.nextSlide = a
    });
    this.lastChild().nextItem = a
  };
  b.addPrevSlide = function(a) {
    this.debugAssoc("sps", a);
    this.prevSlide = a;
    this.children.forEach(function(b) {
      b.prevSlide = a
    });
    this.prevItem = a.lastChild()
  }
})();
rhetButler.TransitionStation = function(b) {
  this.step = b;
  this.checkIn = !1;
  this.eventListener = null
};
(function() {
  var b = ["transition-duration", "animation-name", "animation-iteration-count", "animation-play-state"], a = [];
  (function() {
    var b = ["TransitionEnd", "AnimationEnd"];
    ["webkit", "o", "MS", ""].forEach(function(c) {
      b.forEach(function(b) {
        a.push(c + b);
        a.push(c + b.toLowerCase())
      })
    })
  })();
  var c = rhetButler.TransitionStation.prototype;
  c.visit = function() {
    var a, b;
    if(this.checkIn) {
      return!0
    }
    a = this.getMotionStyles();
    this.step.addClass("am-at");
    this.step.removeClass("to-come");
    b = this.getMotionStyles();
    this.checkIn = !0;
    for(name in b) {
      a[name] != b[name] && (this.checkIn = !1)
    }
    this.elementHasMotion() || this.visited();
    this.checkIn && this.step.removeClass("am-at");
    return this.checkIn
  };
  c.setArriveHandler = function(a) {
    this.removeListener();
    this.eventListener = a;
    this.attachListener()
  };
  c.visited = function() {
    this.step.removeClass("to-come");
    this.step.addClass("has-gone");
    this.checkIn = !0
  };
  c.prepare = function() {
    this.step.addClass("to-come");
    this.attachListener()
  };
  c.complete = function() {
    this.step.removeClass("to-come");
    this.step.removeClass("has-gone");
    this.step.removeClass("am-at");
    this.removeListener()
  };
  c.getMotionStyles = function() {
    var a = window.getComputedStyle(document.getElementById(this.step.element.id)), c = {};
    b.map(function(b) {
      c[b] = a.getPropertyValue(rhetButler.pfx(b))
    });
    return c
  };
  c.elementHasMotion = function() {
    var a = this.getMotionStyles(), b = [], c;
    a["transition-duration"] && (b = a["transition-duration"].split(/\s*,\s*/));
    if(!b.every(function(a) {
      return"0s" == a
    })) {
      return!0
    }
    if(null == a["animation-name"] || "none" == a["animation-name"]) {
      return!1
    }
    b = a["animation-play-state"].split(/\s*,\s*/);
    c = a["animation-iteration-count"].split(/\s*,\s*/);
    b.length < c.length ? b = b.concat(b) : c = c.concat(c);
    return b.some(function(a, b) {
      return"paused" != a && "infinite" != c[b]
    })
  };
  c.attachListener = function() {
    this.eventListener && a.forEach(function(a) {
      this.step.element.addEventListener(a, this.eventListener, !0)
    }, this)
  };
  c.removeListener = function() {
    this.eventListener && a.forEach(function(a) {
      this.step.element.removeEventListener(a, this.eventListener, !0)
    }, this)
  }
})();
rhetButler.TransitionStations = function(b, a, c, g) {
  this.presenter = b;
  this.uphill = [];
  this.uphillIndex = 0;
  this.downhill = [];
  this.downhillIndex = 0;
  this.firstStep = a;
  this.currentStep = c;
  this.lastStep = g;
  this.buildList();
  this.currentState = null;
  this.changeState("preparing")
};
(function() {
  var b = rhetButler.TransitionStations.prototype, a = {preparing:{}, uphill:{}, downhill:{}, cancelled:{}, arrived:{}}, c = {enter:function() {
  }, start:function() {
  }, cancel:function() {
    this.changeState("cancelled")
  }, forceFinish:function() {
    console.log("Force Finish")
  }, finish:function() {
  }, currentLeg:function() {
    return[]
  }, enterState:function() {
  }, resumeStep:function() {
    return this.firstStep
  }, currentStation:function() {
    return null
  }, advanceStation:function() {
  }, nextStation:function() {
    this.currentStation().visit();
    if(this.currentStation().checkIn) {
      return this.advanceStation()
    }
    var a = this, b = this.currentStation();
    this.currentStation().setArriveHandler(function(c) {
      a.arriveListener(b, c)
    });
    return!1
  }};
  for(name in a) {
    for(func in c) {
      a[name][func] = c[func]
    }
  }
  a.preparing.enterState = function() {
    this.eachStation(function(a) {
      a.prepare()
    })
  };
  a.preparing.start = function() {
    this.changeState("uphill");
    this.elementArrived(this.currentStep)
  };
  a.preparing.forceFinish = function() {
    this.eachStation(function(a) {
      a.visited()
    });
    this.changeState("arrived")
  };
  a.uphill.enterState = function() {
    this.currentStep = this.uphill[0].step;
    this.presenter.rootStep.beginTransition(this);
    this.firstStep.beginDeparture();
    this.lastStep.beginArrival()
  };
  a.uphill.finish = function() {
    this.changeState("downhill")
  };
  a.uphill.currentLeg = function() {
    return this.uphill
  };
  a.uphill.currentStation = function() {
    return this.uphill[this.uphillIndex]
  };
  a.uphill.advanceStation = function() {
    this.uphillIndex++;
    this.uphillIndex < this.uphill.length ? this.currentStep = this.currentStation().step : this.changeState("downhill");
    return!0
  };
  a.downhill.currentLeg = function() {
    return this.downhill
  };
  a.downhill.enterState = function() {
    this.currentStep = this.downhill[0].step
  };
  a.downhill.currentStation = function() {
    return this.downhill[this.downhillIndex]
  };
  a.downhill.advanceStation = function() {
    this.downhillIndex++;
    if(this.downhillIndex < this.downhill.length) {
      return this.currentStep = this.currentStation().step, !0
    }
    this.changeState("arrived");
    return!1
  };
  a.downhill.finish = function() {
    this.changeState("arrived")
  };
  a.downhill.resumeStep = function() {
    return this.lastStep
  };
  a.cancelled.enterState = function() {
    this.eachStation(function(a) {
      a.step != this.currentStep && a.complete()
    }, this);
    this.presenter.rootStep.completeTransition(this);
    this.firstStep.completeDeparture();
    this.lastStep.cancelArrival()
  };
  a.arrived.enterState = function() {
    this.eachStation(function(a) {
      a.complete()
    });
    this.currentStep = this.lastStep;
    this.presenter.rootStep.completeTransition(this);
    this.firstStep.completeDeparture();
    this.lastStep.completeArrival();
    this.presenter.completeTransition()
  };
  a.arrived.resumeStep = function() {
    return this.lastStep
  };
  a.arrived.nextStation = function() {
    return!1
  };
  a.arrived.cancel = function() {
    return!1
  };
  b.changeState = function(b) {
    "undefined" == typeof quiet_console && console.log("Changing state: " + b + " S/C/E: " + this.firstStep.toString() + " / " + this.currentStep.toString() + " / " + this.lastStep.toString());
    var c = a[b];
    for(func in c) {
      this[func] = c[func]
    }
    for(stateName in a) {
      this.presenter.rootStep.removeClass(stateName)
    }
    this.presenter.rootStep.addClass(b);
    this.currentState = b;
    this.enterState()
  };
  b.buildList = function() {
    var a = this.firstStep, b = !0, c;
    for(this.direction = this.firstStep.relativePosition(this.lastStep);null != a;) {
      b = b && a != this.currentStep, c = new rhetButler.TransitionStation(a), this.uphill.push(c), b && c.visited(), a = a.parent
    }
    for(a = this.lastStep;null != a;) {
      this.downhill.unshift(new rhetButler.TransitionStation(a)), a = a.parent
    }
  };
  b.startElemId = function() {
    return"prev_" + this.firstStep.element.id
  };
  b.endElemId = function() {
    return"next_" + this.lastStep.element.id
  };
  b.eachStation = function(a) {
    this.uphill.forEach(a, this);
    this.downhill.forEach(a, this)
  };
  b.arriveListener = function(a, b) {
    console.log("rhet-butler/transition-stations.js:256", "event", b);
    b.stopPropagation();
    a.visited();
    this.elementArrived();
    return!0
  };
  b.elementArrived = function(a) {
    for(;this.nextStation();) {
    }
    "undefined" == typeof quiet_console && console.log("Waiting for event")
  }
})();
rhetButler.TreeBuilder = function(b, a) {
  this.root = b;
  this.stepClass = a;
  this.rootStep = null;
  this.parentStack = [];
  this.indexes = {step:0, group:0, slide:0, item:0}
};
(function() {
  var b = rhetButler.TreeBuilder.prototype;
  b.getParent = function(a) {
    for(var b, g, d;0 < this.parentStack.length;) {
      g = this.parentStack[0];
      d = g.element;
      for(b = a;b != d && b != this.root;) {
        b = b.parentElement
      }
      if(b == d) {
        return g
      }
      this.parentStack.shift().treeFinished()
    }
    return null
  };
  b.assembleNextElement = function(a) {
    var b, g = this.getParent(a);
    if(a.classList.contains("root")) {
      0 == a.id.length && (a.id = "rhet-root"), this.rootStep = b = new rhetButler.Steps.Root(a, this.indexes), this.indexes.step++, this.parentStack.unshift(b)
    }else {
      if(a.classList.contains("group")) {
        this.indexes.group++, 0 == a.id.length && (a.id = "group-" + this.indexes.group), b = new rhetButler.Steps.Group(g, a, this.indexes), this.indexes.step++, this.parentStack.unshift(b)
      }else {
        if(a.classList.contains("slide")) {
          this.indexes.slide++, 0 == a.id.length && (a.id = "slide-" + this.indexes.slide), b = new rhetButler.Steps.Slide(g, a, this.indexes), this.indexes.step++, this.parentStack.unshift(b)
        }else {
          if(a.classList.contains("item")) {
            for(var d = Array.prototype.filter.call(a.classList, function(a) {
              return/^cue-.*/.test(a)
            }), e = d.length, f = 0;f < e;f++) {
              this.indexes.item++, 0 == a.id.length && (a.id = "item-" + this.indexes.item), b = new rhetButler.Steps.Item(g, a, this.indexes, d[f]), b.parent.items.some(function(a) {
                return a == b
              }) ? this.indexes.step++ : this.indexes.item--
            }
          }
        }
      }
    }
  };
  b.buildTree = function() {
    for(rhetButler.arrayify(this.root.getElementsByClassName(this.stepClass)).forEach(this.assembleNextElement, this);0 < this.parentStack.length;) {
      this.parentStack.shift().treeFinished()
    }
    return this.rootStep
  }
})();
rhetButler.Presenter = function(b, a) {
  this.document = b;
  this.body = b.body;
  this.window = a;
  this.stepsById = {};
  this.currentTransition = this.rootStep = null;
  this.nextStepIndex = this.previousStepIndex = this.nextStepIndex = this.previousSlideIndex = 0
};
(function() {
  var b = rhetButler.Presenter.prototype, a = rhetButler;
  b.setup = function(b) {
    this.root = a.byId(b);
    this.body.classList.remove("rhet-disabled");
    this.body.classList.add("rhet-enabled");
    a.arrayify(this.root.getElementsByClassName("rhet-butler"));
    this.rootStep = (new rhetButler.TreeBuilder(this.root, "rhet-butler")).buildTree();
    this.rootStep.eachStep(function(a) {
      a.addClass("future")
    });
    b = this.rootStep.firstItem;
    this.currentTransition = new rhetButler.TransitionStations(this, b, b, b);
    this.currentTransition.forceFinish();
    this.bindHandlers();
    a.triggerEvent(this.root, "rhet:init", {api:this})
  };
  b.markRange = function(a, b, d) {
    this.stepsList.slice(a, b).forEach(function(a) {
      a = this.containingElements(a);
      a.steps.forEach(function(a) {
        this.thisClassNotThose(a, d, "before", "after", "passing")
      }, this);
      a.slides.forEach(function(a) {
        this.thisClassNotThose(a, d, "before", "after", "passing")
      }, this)
    }, this)
  };
  b.bindHandlers = function() {
    var a = this;
    this.root.addEventListener("rhet:init", function() {
      var b = "";
      a.root.addEventListener("rhet:stepenter", function(a) {
        window.location.hash = b = "#/" + a.target.id
      }, !1);
      window.addEventListener("hashchange", function(d) {
        window.location.hash !== b && a.moveTo(a.getElementFromHash())
      }, !1);
      a.teleport(a.getElementFromHash() || a.rootStep.firstItem)
    }, !1)
  };
  b.resolveStep = function(a, b) {
    if(a instanceof rhetButler.Step) {
      return a
    }
    switch(a) {
      case "next":
        switch(b) {
          case "slide":
            return this.currentTransition.lastStep.nextSlide;
          case "item":
            return this.currentTransition.lastStep.nextItem;
          default:
            throw"Bad step reference: '" + a + "," + b + "'";
        }
      ;
      case "prev":
      ;
      case "previous":
        switch(b) {
          case "slide":
            return this.currentTransition.lastStep.prevSlide;
          case "item":
            return this.currentTransition.lastStep.prevItem;
          default:
            throw"Bad step reference: '" + a + "," + b + "'";
        }
      ;
      default:
        if(a in this.rootStep.childrenById) {
          return this.rootStep.childrenById[a]
        }
        throw"Bad slide direction: '" + a + "'";
    }
  };
  b.currentStep = function() {
    return this.currentTransition.currentStep
  };
  b.buildTransition = function(a) {
    var b = this.currentTransition.resumeStep(), d = this.currentTransition.currentStep;
    "undefined" == typeof quiet_console && console.log("New transition list: S/C/E: " + b.toString() + " / " + d.toString() + " / " + a.toString());
    this.currentTransition.cancel();
    this.currentTransition = new rhetButler.TransitionStations(this, b, d, a)
  };
  b.teleport = function(a, b) {
    var d = this.resolveStep(a, b);
    d && (this.buildTransition(d), this.currentTransition.forceFinish())
  };
  b.moveTo = function(a, b) {
    var d = this.resolveStep(a, b);
    d && (this.buildTransition(d), this.currentTransition.start())
  };
  b.completeTransition = function() {
    var b = document.getElementById(this.currentTransition.currentStep.element.id);
    a.triggerEvent(b, "rhet:stepenter", {api:this})
  };
  b.checkSupport = function() {
    navigator.userAgent.toLowerCase();
    if(null !== pfx("perspective") && body.classList && body.dataset) {
      return this.body.classList.remove("rhet-not-supported"), this.body.classList.add("rhet-supported"), !0
    }
    this.body.className += " rhet-not-supported ";
    return!1
  };
  b.getElementFromHash = function() {
    return window.location.hash.replace(/^#\/?/, "")
  };
  b.getStep = function(b) {
    "number" === typeof b ? b = 0 > b ? this.stepsList[stepsList.length + b] : this.stepsList[b] : "string" === typeof b && (b = a.byId(b));
    return b && b.id && this.stepsData[b.id] ? b : null
  };
  b.prev = function() {
    var a = this.steps.indexOf(this.activeStep) - 1, a = 0 <= a ? this.steps[a] : this.getStep(-1);
    return this.moveTo(a)
  };
  b.next = function() {
    var a = steps.indexOf(activeStep) + 1, a = a < steps.length ? steps[a] : steps[0];
    return this.moveTo(a)
  };
  b.thisClassNotThose = function(a, b) {
    var d;
    for(d = 2;d < arguments.length;d++) {
      a.classList.remove(arguments[d])
    }
    a.classList.add(b)
  };
  b.unmarkEndpoint = function(a, b) {
    var d = this.containingElements(this.steps[a]), e = d.slides[0];
    d.all.forEach(function(a) {
      a.classList.remove(b)
    });
    this.root.classList.remove(b + "-" + e.id)
  };
  b.markTime = function(a, b) {
    this.containingElements(this.steps[a]).all.forEach(function(a) {
      this.thisClassNotThose(a, b, "past", "present", "future")
    }, this)
  };
  b.markEndpoint = function(a, b) {
    var d = this.containingElements(this.steps[a]), e = d.slides[0];
    d.all.forEach(function(a) {
      this.thisClassNotThose(a, b, "before", "after", "passing")
    }, this);
    this.root.classList.add(b + "-" + e.id);
    return d
  }
})();

