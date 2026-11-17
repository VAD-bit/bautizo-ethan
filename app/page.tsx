'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Download, Heart, Play, X, Video } from 'lucide-react'

// 82 fotos convertidas (HEIC → JPG y JPG existentes) en public/bautizo-ethan/fotos/
const fotoCount = 82
// 13 videos convertidos (MOV → MP4) en public/bautizo-ethan/videos/
const videoCount = 13

// Construimos la lista de recuerdos mezclando fotos y videos cronológicamente.
// Los videos se insertan cada ~6 posiciones para ir intercalando con las fotos.
const buildMemories = () => {
  const memories: Array<{
    src: string
    title: string
    type: 'Fotografía' | 'Video'
    wide?: boolean
  }> = []

  const fotoTitles: Record<number, string> = {
    1: 'Un día para recordar',
    6: 'Pequeñas manos, gran amor',
    11: 'La luz de este día',
    16: 'Juntos en familia',
    21: 'Una bendición',
    26: 'Con todo nuestro amor',
    31: 'Sonrisa de bautizado',
    36: 'Familia reunida',
    41: 'Momentos de fe',
    46: 'Celebración en familia',
    51: 'Instantes de alegría',
    56: 'Un día especial',
    61: 'Amor infinito',
    66: 'Recuerdos para siempre',
    71: 'Bendiciones compartidas',
    76: 'Felicidad en cada detalle',
    81: 'Gracias, Ethan',
  }

  const videoTitles: Record<number, string> = {
    1: 'Video del bautizo · Momento 1',
    2: 'Video del bautizo · Momento 2',
    3: 'Video del bautizo · Momento 3',
    4: 'Video del bautizo · Momento 4',
    5: 'Video del bautizo · Momento 5',
    6: 'Video del bautizo · Momento 6',
    7: 'Video del bautizo · Momento 7',
    8: 'Video del bautizo · Momento 8',
    9: 'Video del bautizo · Momento 9',
    10: 'Video del bautizo · Momento 10',
    11: 'Video del bautizo · Momento 11',
    12: 'Video del bautizo · Momento 12',
    13: 'Video del bautizo · Momento 13',
    14: 'Video del bautizo · Momento 14',
  }

  let fotoIdx = 1
  let videoIdx = 1

  // Intercalamos: 5 fotos, 1 video, repetido. Al final las fotos restantes y luego videos.
  while (fotoIdx <= fotoCount || videoIdx <= videoCount) {
    // Añadir hasta 5 fotos
    for (let i = 0; i < 5 && fotoIdx <= fotoCount; i++) {
      memories.push({
        src: `/bautizo-ethan/fotos/foto-${fotoIdx.toString().padStart(2, '0')}.jpg`,
        title: fotoTitles[fotoIdx] || `Recuerdo de Ethan ${fotoIdx}`,
        type: 'Fotografía',
        wide: fotoIdx === 1 || fotoIdx === 16 || fotoIdx === 41 || fotoIdx === 66,
      })
      fotoIdx++
    }
    // Añadir 1 video si queda
    if (videoIdx <= videoCount) {
      memories.push({
        src: `/bautizo-ethan/videos/video-${videoIdx.toString().padStart(2, '0')}.mp4`,
        title: videoTitles[videoIdx] || `Video del bautizo ${videoIdx}`,
        type: 'Video',
      })
      videoIdx++
    }
  }

  return memories
}

const memories = buildMemories()

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

  const isVideo = (m: typeof memories[number]) => m.type === 'Video'

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
        <div className="hero-index">01 <i>/</i> {memories.length}</div>
      </section>

      <section className="intro" id="galeria">
        <div className="intro-label"><span>†</span> NUESTRO DÍA INOLVIDABLE</div>
        <div className="intro-main"><h2>Un pequeño comienzo,<br /><em>un amor infinito.</em></h2><div className="intro-aside"><p>Gracias por acompañarnos en uno de los días más especiales de nuestras vidas. Aquí guardamos cada instante para volver a sentirlo una y otra vez.</p><span className="signature">Con amor, la familia de Ethan</span></div></div>
        <div className="gallery-meta"><span>LA GALERÍA</span><span>{memories.length} MOMENTOS <i>·</i> DESLIZA PARA DESCUBRIR</span></div>
      </section>

      <section className={`gallery ${visible ? 'is-visible' : ''}`} ref={gridRef} aria-label="Galería de recuerdos">
        {memories.map((memory, index) => {
          const fotoNum = (index + 1).toString().padStart(2, '0')
          const poster = `/bautizo-ethan/fotos/foto-${((index * 6) % 114 + 1).toString().padStart(2, '0')}.jpg`
          return (
            <button key={`${memory.src}-${index}`} className={`memory-card ${memory.wide ? 'memory-wide' : ''} memory-${index}`} onClick={() => setActive(index)} aria-label={`Abrir ${memory.title}`}>
              {isVideo(memory) ? (
                <>
                  <video poster={poster} className="memory-video" muted playsInline preload="metadata">
                    <source src={memory.src} type="video/mp4" />
                  </video>
                  <span className="photo-overlay"><span className="photo-type"><Video size={12} fill="currentColor" /> VIDEO</span><span className="photo-title">{memory.title}</span><span className="photo-open">↗</span></span>
                </>
              ) : (
                <>
                  <img src={memory.src} alt={memory.title} decoding="async" />
                  <span className="photo-overlay"><span className="photo-type">ETHAN · {fotoNum}</span><span className="photo-title">{memory.title}</span><span className="photo-open">↗</span></span>
                </>
              )}
            </button>
          )
        })}
      </section>

      <section className="closing"><span className="closing-cross">✳</span><p>Un día bendecido.<br /><em>Un recuerdo para toda la vida.</em></p><a href="#inicio">VOLVER AL INICIO <ArrowRight size={14} /></a></section>
      <footer><span>CON TODO NUESTRO AMOR</span><span>ETHAN <i>·</i> SU BAUTIZO</span><Heart size={13} /></footer>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={memories[active].title} onClick={() => setActive(null)}>
          <button className="close-lightbox" aria-label="Cerrar" onClick={() => setActive(null)}><X /></button>
          <button className="lightbox-arrow prev" aria-label="Recuerdo anterior" onClick={(e) => { e.stopPropagation(); setActive((active - 1 + memories.length) % memories.length) }}><ArrowLeft /></button>
          <figure onClick={(e) => e.stopPropagation()}>
            {isVideo(memories[active]) ? (
              <div style={{ maxHeight: 'calc(100svh - 150px)', maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', width: '100%' }}>
                <video controls playsInline src={memories[active].src} style={{ maxHeight: 'calc(100svh - 250px)', maxWidth: '100%', borderRadius: '8px' }} />
              </div>
            ) : (
              <><img src={memorySrc(memories[active].src, 1800)} alt={memories[active].title} style={{ maxHeight: 'calc(100svh - 150px)', maxWidth: '100%', objectFit: 'contain' }} /><figcaption><span>{memories[active].title}</span><a href={memorySrc(memories[active].src)} download={`ethan-recuerdo-${active + 1}.jpg`}><Download size={15} /> DESCARGAR</a></figcaption></>
            )}
          </figure>
          <button className="lightbox-arrow next" aria-label="Recuerdo siguiente" onClick={(e) => { e.stopPropagation(); setActive((active + 1) % memories.length) }}><ArrowRight /></button>
        </div>
      )}

      {videoOpen && (
        <div className="lightbox video-modal" role="dialog" aria-modal="true" aria-label="Película del bautizo" onClick={() => setVideoOpen(false)}>
          <button className="close-lightbox" aria-label="Cerrar" onClick={() => setVideoOpen(false)}><X /></button>
          <div className="video-placeholder" onClick={(e) => e.stopPropagation()}>
            <img src="/bautizo-ethan/fotos/foto-01.jpg" alt="" />
            <div>
              <span className="play-big"><Play fill="currentColor" /></span>
              <p>LA PELÍCULA DE ETHAN</p>
              <small>El video del bautizo aparecerá aquí</small>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function memorySrc(src: string, width?: number) {
  return src
}
