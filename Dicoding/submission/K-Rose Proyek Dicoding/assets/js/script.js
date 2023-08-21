// carousel main section
(() => {
    'use strict';
    const options = ['lefty', 'left', 'center', 'right', 'righty'];
    const cards = document.querySelectorAll('.carousel-card');
    addCardListeners();
  
    function addCardListeners() {
      cards.forEach(card => {
        card.addEventListener('click', cardEventListener);
      });
    }
  
    function cardEventListener(event) {
      const parent = getParents(event.target, '.carousel-card')[0];
      const parentIndex = options.indexOf(parent.id);
  
      cards.forEach(card => {
        const index = options.indexOf(card.id);
        if (parentIndex > 2) {
          const previousIndex = index - 1 < 0 ? cards.length - 1 : index - 1;
          card.id = options[previousIndex];
        } else if (parentIndex < 2) {
          const nextIndex = index + 1 > cards.length - 1 ? 0 : index + 1;
          card.id = options[nextIndex];
        }
      });
    }
  
    function getParents(elem, selector) {
      // Element.matches() polyfill
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function(s) {
            const matches = (this.document || this.ownerDocument).querySelectorAll(s);
            let i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
          };
      }
  
      // Setup parents array
      const parents = [];
  
      // Get matching parent elements
      for (; elem && elem !== document; elem = elem.parentNode) {
        // Add matching parents to array
        if (selector) {
          if (elem.matches(selector)) {
            parents.push(elem);
          }
        } else {
          parents.push(elem);
        }
      }
  
      return parents;
    }
  })();
  