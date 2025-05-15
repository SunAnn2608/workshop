const canvas = document.getElementById('canvas')
const shapes = document.querySelectorAll('.shape')

let dragging = null
let offsetX = 0
let offsetY = 0

let backgroundState = 0 // 0 to 1 range for grayscale

// Random init
shapes.forEach((shape) => {
  // Random position
  shape.style.top = `${Math.random() * 90}%`
  shape.style.left = `${Math.random() * 90}%`

  // Random scale
  const scale = 0.5 + Math.random()
  shape.dataset.baseScale = scale
  shape.style.transform = `scale(${scale})`

  // Random velocity and direction
  shape.dataset.vx = (Math.random() - 0.5) * 0.25
  shape.dataset.vy = (Math.random() - 0.5) * 0.25
})

// Animate movement
function moveShapes() {
  shapes.forEach((shape) => {
    if (dragging === shape) return // skip if being dragged

    let top = parseFloat(shape.style.top)
    let left = parseFloat(shape.style.left)
    let vx = parseFloat(shape.dataset.vx)
    let vy = parseFloat(shape.dataset.vy)

    top += vy
    left += vx

    // Bounce from edges
    if (top < 0 || top > 95) shape.dataset.vy = -vy
    if (left < 0 || left > 95) shape.dataset.vx = -vx

    shape.style.top = `${top}%`
    shape.style.left = `${left}%`
  })

  requestAnimationFrame(moveShapes)
}
moveShapes()

// Click → toggle scale
shapes.forEach((shape) => {
  shape.addEventListener('click', (e) => {
    e.stopPropagation() // prevent background click
    shape.classList.toggle('clicked')
  })

  // Drag start
  shape.addEventListener('mousedown', (e) => {
    dragging = shape
    const rect = shape.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
  })
})

// Dragging logic
document.addEventListener('mousemove', (e) => {
  if (dragging) {
    const canvasRect = canvas.getBoundingClientRect()
    const x = e.clientX - canvasRect.left - offsetX
    const y = e.clientY - canvasRect.top - offsetY

    dragging.style.left = `${(x / canvasRect.width) * 100}%`
    dragging.style.top = `${(y / canvasRect.height) * 100}%`
  }
})

document.addEventListener('mouseup', () => {
  dragging = null
})

// Click background to change color
canvas.addEventListener('click', () => {
  backgroundState += 0.1
  if (backgroundState > 1) backgroundState = 0

  const gray = Math.floor(255 * (1 - backgroundState))
  document.body.style.backgroundColor = `rgb(${gray}, ${gray}, ${gray})`
})

// Mouse kick
canvas.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX
  const mouseY = e.clientY

  shapes.forEach((shape) => {
    const rect = shape.getBoundingClientRect()
    const centerX = rect.left + rect.width / 15
    const centerY = rect.top + rect.height / 15
    const dx = centerX - mouseX
    const dy = centerY - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 100) {
      const force = (100 - dist) / 10
      shape.dataset.vx = (dx / dist) * force
      shape.dataset.vy = (dy / dist) * force
    }
  })
})
