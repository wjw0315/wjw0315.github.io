var selectedClass = 'navbar-active'

// It'd be nicer to use the classList API, but I prefer to support more browsers. Remove a class
// if it's found on the element.
function removeClassIfNeeded (el) {
  // If the element has no classes then we can take a shortcut.
  if (!el.className) {
    return
  }

  var splitClassName = el.className.split(' ')
  var replacementClassName = ''

  // Assemble a string of other class names.
  for (var i = 0, len = splitClassName.length; i < len; i++) {
    var className = splitClassName[i]

    if (className !== selectedClass) {
      replacementClassName += replacementClassName === '' ? className : ' ' + className
    }
  }

  // If the length of the className differs, then it had an selected class in and needs to be
  // updated.
  if (replacementClassName.length !== el.className.length) {
    el.className = replacementClassName
  }
}

// Add a class to an element if it is not found.
function addClassIfNeeded (el) {
  // If the element has no classes then we can take a shortcut.
  if (!el.className) {
    el.className = selectedClass
    return
  }

  var splitClassName = el.className.split(' ')

  // If any of the class names match the selected class then return.
  for (var i = 0, len = splitClassName.length; i < len; i++) {
    if (splitClassName[i] === selectedClass) {
      return
    }
  }

  // If we got here then the selected class needs to be added to an existing className.
  el.className += ' ' + selectedClass
}

function createAndAppendListItems (navList, elementList, makeNavListItem) {
  var pairs = []
  var element
  var li

  // Create list elements
  for (var i = 0, len = elementList.length; i < len; i++) {
    element = elementList[i]
    // console.log(element)
    li = makeNavListItem(element)

    navList.appendChild(li)

    pairs.push({ element: element, navElement: li })
  }

  return pairs
}

function makeHandleScroll (pairs, debounceTime) {
  function handleScroll () {
    var frontRunner = { navElement: {} }
    var closestDist = Infinity
    var pair, absDist

    for (var i = 0, len = pairs.length; i < len; i++) {
      pair = pairs[i]
      absDist = Math.abs(pair.element.getBoundingClientRect().top)

      // If this element is not the front runner for top, deactivate it.
      if (absDist > closestDist) {
        removeClassIfNeeded(pair.navElement)
        continue
      }

      // If this is a new front runner, deactivate the previous front runner.
      removeClassIfNeeded(frontRunner)

      frontRunner = pair.navElement
      closestDist = absDist
    }

    // All other elements have been deactivated, and now the top element is known and can be set
    // as active.
    addClassIfNeeded(frontRunner, selectedClass)
  }

  // The default behaviour is no debounce.
  if (typeof debounceTime !== 'number' || isNaN(debounceTime)) {
    return handleScroll
  }

  var timeout

  function nullifyTimeout () {
    timeout = null
  }

  return function debouncedHandleScroll () {
    if (timeout) {
      return
    }

    // Immediately use handleScroll to calculate.
    handleScroll()

    // No further calls to handleScroll until debounceTime has elapsed.
    timeout = setTimeout(nullifyTimeout, debounceTime)
  }
}

function addScrollListener (target, handleScroll) {
  function scrollHandleWrapper (evt) {
    if (evt.target === target) {
      handleScroll()
    }
  }

  if (target.addEventListener) {
    target.addEventListener('scroll', scrollHandleWrapper, false)
  } else if (target.attachEvent) {
    target.attachEvent('onscroll', scrollHandleWrapper)
  } else {
    throw new Error('This browser does not support addEventListener or attachEvent.')
  }

  // To calculate the initial active list element.
  handleScroll()
}

export default function makeNav (options) {
  // console.log(options.makeNavListItem)
  if (!options || !options.elementList || !options.makeNavListItem) {
    throw new Error('Options object with elementList and makeNavListItem must be provided.')
  }

  var nav = document.createElement(options.tagName || 'nav')
  var navList = document.createElement('ul')

  // The target defaults to window.
  var target = options.target || document

  // Create list elements
  var pairs = createAndAppendListItems(navList, options.elementList, options.makeNavListItem)

  // Whenever the window is scrolled, recalculate the active list element. Compatible with older
  // versions of IE.
  addScrollListener(target, makeHandleScroll(pairs, options.debounceTime))

  nav.appendChild(navList)

  return nav
}
