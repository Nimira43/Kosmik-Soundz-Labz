const navToggle = document.querySelector('.ksl-nav-toggle')
const navLinks = document.querySelector('.ksl-nav-links')

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('ksl-open')
    navToggle.classList.toggle('ksl-open')
  })

  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('ksl-open')
      navToggle.classList.remove('ksl-open')
    }
  })
}

const heroCta = document.getElementById('heroCta')
if (heroCta) {
  heroCta.addEventListener('click', () => {
    const target = document.getElementById('services')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const observed = document.querySelectorAll('.ksl-observe')
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ksl-in-view')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 }
  )
  observed.forEach((el) => io.observe(el))
} else {
  observed.forEach((el) => el.classList.add('ksl-in-view'))
}

const canvas = document.getElementById('heroCanvas')
if (canvas) {
  const ctx = canvas.getContext('2d')
  let width, height, particles, mouseX, mouseY

  function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    initParticles()
  }

  function initParticles() {
    const count = Math.floor((width * height) / 15000)
    particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        hue: 280 + Math.random() * 60
      })
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height)
    const grad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.1,
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height)
    )
    grad.addColorStop(0, 'rgba(255, 75, 255, 0.12)')
    grad.addColorStop(0.4, 'rgba(10, 0, 40, 0.9)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 1)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > width) p.vx *= -1
      if (p.y < 0 || p.y > height) p.vy *= -1

      if (mouseX != null && mouseY != null) {
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) {
          const force = (140 - dist) / 140
          p.x += (dx / dist) * force * 1.2
          p.y += (dy / dist) * force * 1.2
        }
      }
      ctx.beginPath()
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, 0.9)`
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i]
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = dx * dx + dy * dy
        if (dist < 120 * 120) {
          const alpha = 1 - dist / (120 * 120)
          ctx.strokeStyle = `rgba(255, 75, 255, ${alpha * 0.4})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
    requestAnimationFrame(draw)
  }

  window.addEventListener('resize', resize)
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  })
  canvas.addEventListener('mouseleave', () => {
    mouseX = mouseY = null
  })
  resize()
  draw()
}
