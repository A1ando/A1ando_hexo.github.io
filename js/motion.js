/* global NexT, CONFIG, Velocity */

if (window.$ && window.$.Velocity) window.Velocity = window.$.Velocity;

NexT.motion = {};

NexT.motion.integrator = {
  queue : [],
  cursor: -1,
  init  : function() {
    this.queue = [];
    this.cursor = -1;
    return this;
  },
  add: function(fn) {
    this.queue.push(fn);
    return this;
  },
  next: function() {
    this.cursor++;
    const fn = this.queue[this.cursor];
    typeof fn === 'function' && fn(NexT.motion.integrator);
  },
  bootstrap: function() {
    this.next();
  }
};

NexT.motion.middleWares = {
  logo: function(integrator) {
    const sequence = [];
    const brand = document.querySelector('.brand');
    const image = document.querySelector('.custom-logo-image');
    const title = document.querySelector('.site-title');
    const subtitle = document.querySelector('.site-subtitle');
    const logoLineTop = document.querySelector('.logo-line-before');
    const logoLineBottom = document.querySelector('.logo-line-after');

    brand && sequence.push({
      e: brand,
      p: {opacity: 1},
      o: {duration: 200}
    });

    function getMistLineSettings(element) {
      Velocity.hook(element, 'scaleX', 0);
      return {
        e: element,
        p: {scaleX: 1},
        o: {
          duration     : 500,
          sequenceQueue: false
        }
      };
    }

    function pushImageToSequence() {
      sequence.push({
        e: image,
        p: {opacity: 1, top: 0},
        o: {duration: 200}
      });
    }

    CONFIG.scheme === 'Mist' && logoLineTop && logoLineBottom
    && sequence.push(
      getMistLineSettings(logoLineTop),
      getMistLineSettings(logoLineBottom)
    );

    CONFIG.scheme === 'Muse' && image && pushImageToSequence();

    title && sequence.push({
      e: title,
      p: {opacity: 1, top: 0},
      o: {duration: 200}
    });

    subtitle && sequence.push({
      e: subtitle,
      p: {opacity: 1, top: 0},
      o: {duration: 200}
    });

    (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini') && image && pushImageToSequence();

    if (sequence.length > 0) {
      sequence[sequence.length - 1].o.complete = function() {
        integrator.next();
      };
      Velocity.RunSequence(sequence);
    } else {
      integrator.next();
    }

    if (CONFIG.motion.async) {
      integrator.next();
    }
  },

  menu: function(integrator) {
    Velocity(document.querySelectorAll('.menu-item'), 'transition.slideDownIn', {
      display : null,
      duration: 200,
      complete: function() {
        integrator.next();
      }
    });

    if (CONFIG.motion.async || !document.querySelectorAll('.menu-item').length) {
      integrator.next();
    }
  },

  subMenu: function(integrator) {
    const subMenuItem = document.querySelectorAll('.sub-menu .menu-item');
    if (subMenuItem.length > 0) {
      subMenuItem.forEach(element => {
        element.style.opacity = 1;
      });
    }
    integrator.next();
  },

  postList: function(integrator) {
    const postBlock = document.querySelectorAll('.post-block, .pagination, .comments');
    const postBlockTransition = CONFIG.motion.transition.post_block;
    const postHeader = document.querySelectorAll('.post-header');
    const postHeaderTransition = CONFIG.motion.transition.post_header;
    const postBody = document.querySelectorAll('.post-body');
    const postBodyTransition = CONFIG.motion.transition.post_body;
    const collHeader = document.querySelectorAll('.collection-header');
    const collHeaderTransition = CONFIG.motion.transition.coll_header;

    if (postBlock.length > 0) {
      const postMotionOptions = window.postMotionOptions || {
        stagger : 100,
        drag    : true,
        complete: function() {
          integrator.next();
        }
      };

      if (CONFIG.motion.transition.post_block) {
        Velocity(postBlock, 'transition.' + postBlockTransition, postMotionOptions);
      }
      if (CONFIG.motion.transition.post_header) {
        Velocity(postHeader, 'transition.' + postHeaderTransition, postMotionOptions);
      }
      if (CONFIG.motion.transition.post_body) {
        Velocity(postBody, 'transition.' + postBodyTransition, postMotionOptions);
      }
      if (CONFIG.motion.transition.coll_header) {
        Velocity(collHeader, 'transition.' + collHeaderTransition, postMotionOptions);
      }
    }
    if (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini') {
      integrator.next();
    }
  },

  sidebar: function(integrator) {
    const sidebarAffix = document.querySelector('.sidebar-inner');
    const sidebarAffixTransition = CONFIG.motion.transition.sidebar;
    // Only for Pisces | Gemini.
    if (sidebarAffixTransition && (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini')) {
      Velocity(sidebarAffix, 'transition.' + sidebarAffixTransition, {
        display : null,
        duration: 200
      });
    }
    integrator.next();
  }
};
