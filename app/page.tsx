'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Download, Heart, Play, X } from 'lucide-react'

const memories = [
  { image: 'photo-1511895426328-dc8714191300', title: 'Un día para recordar', type: 'Fotografía', wide: true },
  { image: 'photo-1519689680058-324335c77eba', title: 'Pequeñas manos, gran amor', type: 'Fotografía' },
  { image: 'photo-1478146896981-b80fe463b330', title: 'La luz de este día', type: 'Fotografía' },
  { image: 'photo-1511988617509-a57c8a288659', title: 'Juntos en familia', type: 'Fotografía', wide: true },
  { image: 'photo-1511895426328-dc8714191300', title: 'Una bendición', type: 'Video' },
  { image: 'photo-1519689680058-324335c77eba', title: 'Con todo nuestro amor', type: 'Fotografía' },
]
const imageUrl = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export default function Page() {
  const [active, setActive] = useState<number | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const gridRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }), { threshold: 0.12 })
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setActive(null); setVideoOpen(false) }
      if (active !== null && event.key === 'ArrowRight') setActive((active + 1) % memories.length)
      if (active !== null && event.key === 'ArrowLeft') setActive((active - 1 + memories.length) % memories.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <main className="album-shell">
      <header className="topbar">
        <a href="#inicio" className="brand" aria-label="Ethan, inicio"><span className="brand-mark">E</span><span>ETHAN <i>·</i> SU BAUTIZO</span></a>
        <a className="top-link" href="#galeria">Ver recuerdos <ArrowDown size={14} /></a>
      </header>

      <section className="hero" id="inicio" aria-label="Bautizo de Ethan">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> UN DÍA LLENO DE LUZ <span /></p>
          <h1>El bautizo<br />de <em>Ethan</em></h1>
          <p className="hero-subtitle">Un día especial, para siempre en el corazón.</p>
          <button className="watch-button" onClick={() => setVideoOpen(true)} aria-label="Reproducir video del bautizo"><span><Play size={15} fill="currentColor" /></span> VER LA PELÍCULA</button>
        </div>
        <div className="hero-caption"><span className="caption-line" /> <span>UN RECUERDO DE FAMILIA</span><span>2025</span></div>
        <div className="hero-index">01 <i>/</i> 04</div>
      </section>

      <section className="intro" id="galeria">
        <div className="intro-label"><span>†</span> NUESTRO DÍA INOLVIDABLE</div>
        <div className="intro-main"><h2>Un pequeño comienzo,<br /><em>un amor infinito.</em></h2><div className="intro-aside"><p>Gracias por acompañarnos en uno de los días más especiales de nuestras vidas. Aquí guardamos cada instante para volver a sentirlo una y otra vez.</p><span className="signature">Con amor, la familia de Ethan</span></div></div>
        <div className="gallery-meta"><span>LA GALERÍA</span><span>06 MOMENTOS <i>·</i> DESLIZA PARA DESCUBRIR</span></div>
      </section>

      <section className={`gallery ${visible ? 'is-visible' : ''}`} ref={gridRef} aria-label="Galería de recuerdos">
        {memories.map((memory, index) => (
          <button key={`${memory.title}-${index}`} className={`memory-card ${memory.wide ? 'memory-wide' : ''} memory-${index}`} onClick={() => setActive(index)} aria-label={`Abrir ${memory.title}`}>
            <img src={imageUrl(memory.image, 1200)} alt={memory.title} loading="lazy" />
            <span className="photo-overlay"><span className="photo-type">{memory.type === 'Video' ? <Play size={12} fill="currentColor" /> : 'ETHAN · 01'}</span><span className="photo-title">{memory.title}</span><span className="photo-open">↗</span></span>
          </button>
        ))}
      </section>

      <section className="closing"><span className="closing-cross">✳</span><p>Un día bendecido.<br /><em>Un recuerdo para toda la vida.</em></p><a href="#inicio">VOLVER AL INICIO <ArrowRight size={14} /></a></section>
      <footer><span>CON TODO NUESTRO AMOR</span><span>ETHAN <i>·</i> SU BAUTIZO</span><Heart size={13} /></footer>

      {active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={memories[active].title} onClick={() => setActive(null)}><button className="close-lightbox" aria-label="Cerrar" onClick={() => setActive(null)}><X /></button><button className="lightbox-arrow prev" aria-label="Foto anterior" onClick={(e) => { e.stopPropagation(); setActive((active - 1 + memories.length) % memories.length) }}><ArrowLeft /></button><figure onClick={(e) => e.stopPropagation()}><img src={imageUrl(memories[active].image, 1800)} alt={memories[active].title} /><figcaption><span>{memories[active].title}</span><a href={imageUrl(memories[active].image, 1800)} download={`ethan-recuerdo-${active + 1}.jpg`}><Download size={15} /> DESCARGAR</a></figcaption></figure><button className="lightbox-arrow next" aria-label="Foto siguiente" onClick={(e) => { e.stopPropagation(); setActive((active + 1) % memories.length) }}><ArrowRight /></button></div>}
      {videoOpen && <div className="lightbox video-modal" role="dialog" aria-modal="true" aria-label="Película del bautizo" onClick={() => setVideoOpen(false)}><button className="close-lightbox" aria-label="Cerrar" onClick={() => setVideoOpen(false)}><X /></button><div className="video-placeholder" onClick={(e) => e.stopPropagation()}><img src="/ethan-bautizo-hero.png" alt="" /><div><span className="play-big"><Play fill="currentColor" /></span><p>LA PELÍCULA DE ETHAN</p><small>El video del bautizo aparecerá aquí</small></div></div></div>}
    </main>
  )
}
