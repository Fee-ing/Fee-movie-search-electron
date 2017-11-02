(function (undefined) {
	"use strict" 
  var _global
	var FUNC = {
		toast: function (str) {
			if (document.querySelector('.toast')) {
				return
			}
			let body = document.querySelector('body')
			let div = document.createElement('div')
			div.className = 'toast'
			div.innerHTML = str
			body.appendChild(div)
			setTimeout(function () {
	    	div.style.opacity = 1
	    	setTimeout(function () {
      		div.style.opacity = 0
	      		setTimeout(function () {
		      		div.parentNode.removeChild(div)
		    	}, 350)
	    	}, 2000)
  		}, 300)
		},
		setStorage: function (name,value) {
	  	window.localStorage.setItem(name, value)
		},
		getStorage: function(name) {
		  return window.localStorage.getItem(name)
		},
		delStorage: function(name) {
		  this.setStorage(name, '')
		}
	}

	_global = (function () { return this || (0, eval)('this') }())
  if (typeof module !== "undefined" && module.exports) {
    module.exports = FUNC
  } else if (typeof define === "function" && define.amd) {
    define(function(){return FUNC})
  } else {
    !('FUNC' in _global) && (_global.FUNC = FUNC)
  }
})()