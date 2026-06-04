(function($) {
  "use strict";

// ===== PRELOADER =====
    window.addEventListener('load',()=>{
      setTimeout(()=>{document.getElementById('preloader').classList.add('hidden')},2400)
    })
  
    // ===== CURSOR WITH GLOW =====
    const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing'),glow=document.getElementById('cursorGlow')
    let mx=0,my=0,ringX=0,ringY=0,glowX=0,glowY=0
  
    document.addEventListener('mousemove',e=>{
      mx=e.clientX;my=e.clientY
      dot.style.left=mx+'px';dot.style.top=my+'px'
      dot.classList.add('visible');ring.classList.add('visible');glow.classList.add('visible')
    })
    document.addEventListener('mouseleave',()=>{
      dot.classList.remove('visible');ring.classList.remove('visible');glow.classList.remove('visible')
    })
    document.addEventListener('mousedown',()=>{dot.classList.add('clicking');ring.classList.add('clicking')})
    document.addEventListener('mouseup',()=>{dot.classList.remove('clicking');ring.classList.remove('clicking')})
    function animCursor(){
      ringX+=(mx-ringX)*0.12;ringY+=(my-ringY)*0.12
      ring.style.left=ringX+'px';ring.style.top=ringY+'px'
      glowX+=(mx-glowX)*0.06;glowY+=(my-glowY)*0.06
      glow.style.left=glowX+'px';glow.style.top=glowY+'px'
      requestAnimationFrame(animCursor)
    }
    animCursor()
    document.querySelectorAll('a,button,.gallery-item,.amenity-item,.highlight-card,.feature-card,.form-group input,.form-group select,.form-group textarea').forEach(el=>{
      el.addEventListener('mouseenter',()=>{dot.classList.add('hover');ring.classList.add('hover')})
      el.addEventListener('mouseleave',()=>{dot.classList.remove('hover');ring.classList.remove('hover')})
    })
  
    // ===== NAV =====
    const nav=document.getElementById('nav'),hamburger=document.getElementById('hamburger'),navLinks=document.getElementById('navLinks')
    const progressBar=document.getElementById('progressBar')
  
    window.addEventListener('scroll',()=>{
      nav.classList.toggle('scrolled',window.scrollY>80)
      const h=document.documentElement
      const p=(window.scrollY/(h.scrollHeight-h.clientHeight))*100
      progressBar.style.width=p+'%'
    })
  
    hamburger.addEventListener('click',()=>{
      hamburger.classList.toggle('active');navLinks.classList.toggle('open')
    })
    function closeNav(){hamburger.classList.remove('active');navLinks.classList.remove('open')}
  
    // ===== COUNTER =====
    function animateCounters(){
      document.querySelectorAll('.highlight-number[data-target]').forEach(el=>{
        const target=parseInt(el.dataset.target)
        const duration=2000;const start=performance.now()
        function update(now){
          const p=Math.min((now-start)/duration,1)
          const e=1-Math.pow(1-p,3)
          el.textContent=Math.round(target*e).toLocaleString()
          if(p<1)requestAnimationFrame(update)
          else el.textContent=target.toLocaleString()
        }
        requestAnimationFrame(update)
      })
    }
  
    // ===== SCROLL REVEAL =====
    const revealObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible')
        }
      })
    },{threshold:0.12,rootMargin:'0px 0px -60px 0px'})
  
    document.addEventListener('DOMContentLoaded',()=>{
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger-children').forEach(el=>{revealObserver.observe(el)})
    })
  
    // ===== GALLERY FILTER (Enhanced) =====
    const galleryGrid=document.getElementById('galleryGrid')
    document.querySelectorAll('.gallery-filter button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelector('.gallery-filter button.active').classList.remove('active')
        btn.classList.add('active')
        const filter=btn.dataset.filter
        const items=document.querySelectorAll('.gallery-item')
        items.forEach((item,i)=>{
          if(filter==='all'||item.dataset.category===filter){
            item.classList.remove('hidden-item')
            item.classList.add('fade-in')
            item.style.animationDelay=(i*0.05)+'s'
          }else{
            item.classList.add('hidden-item')
            item.classList.remove('fade-in')
          }
        })
        rebuildLightbox()
      })
    })
  
    // ===== LIGHTBOX (Enhanced with thumbnails + captions) =====
    const lightbox=document.getElementById('lightbox'),lbImage=document.getElementById('lbImage')
    const lbClose=document.getElementById('lbClose'),lbPrev=document.getElementById('lbPrev')
    const lbNext=document.getElementById('lbNext'),lbCounter=document.getElementById('lbCounter')
    const lbTitle=document.getElementById('lbTitle'),lbDesc=document.getElementById('lbDesc')
    const lbThumbnails=document.getElementById('lbThumbnails')
    let currentIndex=0,galleryImages=[]
  
    function rebuildLightbox(){
      galleryImages=[]
      const visibleItems=document.querySelectorAll('.gallery-item:not(.hidden-item)')
      visibleItems.forEach((item,i)=>{
        const img=item.querySelector('img')
        galleryImages.push({
          src:img.src.replace('w=700','w=1400').replace('w=800','w=1400'),
          alt:img.alt,
          title:item.dataset.title||'',
          desc:item.dataset.desc||'',
          thumb:img.src.replace('w=700','w=120').replace('w=800','w=120')
        })
      })
      buildThumbnails()
    }
  
    function buildThumbnails(){
      lbThumbnails.innerHTML=''
      galleryImages.forEach((img,i)=>{
        const thumb=document.createElement('div')
        thumb.className='lightbox-thumb'+(i===currentIndex?' active':'')
        thumb.innerHTML='<img src="'+img.thumb+'" alt="'+img.alt+'">'
        thumb.addEventListener('click',()=>{currentIndex=i;updateLightbox()})
        lbThumbnails.appendChild(thumb)
      })
    }
  
    function openLightbox(i){
      currentIndex=i
      updateLightbox()
      lightbox.classList.add('open');document.body.style.overflow='hidden'
    }
    function closeLightbox(){lightbox.classList.remove('open');document.body.style.overflow=''}
    function prevImage(){currentIndex=(currentIndex-1+galleryImages.length)%galleryImages.length;updateLightbox()}
    function nextImage(){currentIndex=(currentIndex+1)%galleryImages.length;updateLightbox()}
    function updateLightbox(){
      lbImage.style.transform='scale(0.92)';lbImage.style.opacity='0'
      setTimeout(()=>{
        lbImage.src=galleryImages[currentIndex].src
        lbImage.alt=galleryImages[currentIndex].alt
        lbTitle.textContent=galleryImages[currentIndex].title
        lbDesc.textContent=galleryImages[currentIndex].desc
        lbCounter.textContent=(currentIndex+1)+' / '+galleryImages.length
        lbImage.style.transform='scale(1)';lbImage.style.opacity='1'
        document.querySelectorAll('.lightbox-thumb').forEach((t,i)=>{
          t.classList.toggle('active',i===currentIndex)
        })
      },250)
    }
  
    // Bind gallery items
    document.querySelectorAll('.gallery-item').forEach(item=>{
      item.addEventListener('click',()=>{
        rebuildLightbox()
        const visibleItems=[...document.querySelectorAll('.gallery-item:not(.hidden-item)')]
        const idx=visibleItems.indexOf(item)
        if(idx>=0)openLightbox(idx)
      })
    })
  
    lbClose.addEventListener('click',closeLightbox)
    lbPrev.addEventListener('click',prevImage)
    lbNext.addEventListener('click',nextImage)
    lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()})
    document.addEventListener('keydown',e=>{
      if(!lightbox.classList.contains('open'))return
      if(e.key==='Escape')closeLightbox()
      if(e.key==='ArrowLeft')prevImage()
      if(e.key==='ArrowRight')nextImage()
    })
  
    // ===== MAGNETIC BUTTONS =====
    document.querySelectorAll('.btn-magnetic').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{
        const r=btn.getBoundingClientRect()
        const x=e.clientX-r.left-r.width/2
        const y=e.clientY-r.top-r.height/2
        btn.style.transform='translate('+x*0.15+'px,'+y*0.15+'px)'
      })
      btn.addEventListener('mouseleave',()=>{
        btn.style.transform='translate(0,0)'
      })
    })
  
    // ===== FORM =====
    document.getElementById('leadForm').addEventListener('submit',function(e){
      e.preventDefault()
      let valid=true
      const fields=[
        {id:'firstName',errorId:'firstNameError',validate:v=>v.trim().length>0},
        {id:'lastName',errorId:'lastNameError',validate:v=>v.trim().length>0},
        {id:'email',errorId:'emailError',validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)},
        {id:'phone',errorId:'phoneError',validate:v=>v.trim().length>=7},
      ]
      fields.forEach(f=>{
        const input=document.getElementById(f.id),error=document.getElementById(f.errorId)
        if(!f.validate(input.value)){input.classList.add('error');error.classList.add('show');valid=false}
        else{input.classList.remove('error');error.classList.remove('show')}
      })
      if(!valid){
        document.querySelector('.form-card').style.animation='shake 0.5s ease'
        setTimeout(()=>{document.querySelector('.form-card').style.animation=''},600)
        return
      }
      const btn=this.querySelector('button[type="submit"]')
      btn.disabled=true;btn.innerHTML='<span>Submitting...</span>'
      setTimeout(()=>{
        document.getElementById('formContainer').style.display='none'
        document.getElementById('formSuccess').classList.add('show')
        btn.disabled=false;btn.innerHTML='<span>Book Your Private Tour</span> <span class="arrow">\u2192</span>'
      },1600)
    })
  
    // ===== SHAKE =====
    const style=document.createElement('style')
    style.textContent=`@keyframes shake{0%,100%{transform:translateX(0)}10%,50%,90%{transform:translateX(-6px)}30%,70%{transform:translateX(6px)}}`
    document.head.appendChild(style)
  
    // ===== INPUT CLEANUP =====
    document.querySelectorAll('.form-group input,.form-group select,.form-group textarea').forEach(el=>{
      el.addEventListener('input',()=>{
        el.classList.remove('error')
        const errorEl=document.getElementById(el.id+'Error')
        if(errorEl)errorEl.classList.remove('show')
      })
    })
  
    // ===== RIPPLE EFFECT =====
    document.querySelectorAll('[data-ripple]').forEach(btn=>{
      btn.addEventListener('click',function(e){
        const rect=this.getBoundingClientRect()
        const ripple=document.createElement('span');ripple.className='ripple'
        const size=Math.max(rect.width,rect.height)
        ripple.style.width=ripple.style.height=size+'px'
        ripple.style.left=(e.clientX-rect.left-size/2)+'px'
        ripple.style.top=(e.clientY-rect.top-size/2)+'px'
        this.appendChild(ripple)
        setTimeout(()=>ripple.remove(),600)
      })
    })
  
    // ===== TILT / 3D HOVER =====
    document.querySelectorAll('[data-tilt]').forEach(el=>{
      el.addEventListener('mousemove',e=>{
        const r=el.getBoundingClientRect()
        const x=e.clientX-r.left,y=e.clientY-r.top
        const cx=r.width/2,cy=r.height/2
        const dx=(x-cx)/cx,dy=(y-cy)/cy
        const rotY=dx*8,rotX=-dy*8
        el.style.transform=`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) ${el.dataset.tiltScale?'scale('+el.dataset.tiltScale+')':''}`
      })
      el.addEventListener('mouseleave',()=>{
        el.style.transform='perspective(800px) rotateX(0) rotateY(0)'
        el.style.transition='transform 0.6s ease'
        setTimeout(()=>{el.style.transition=''},600)
      })
    })
  
    // ===== PARALLAX HERO =====
    const hero=document.querySelector('.hero')
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect()
      const x=(e.clientX-r.left)/r.width-0.5,y=(e.clientY-r.top)/r.height-0.5
      const bg=hero.querySelector('.hero-bg img')
      bg.style.transform=`scale(1.08) translate(${x*20}px,${y*20}px)`
    })
    hero.addEventListener('mouseleave',()=>{
      hero.querySelector('.hero-bg img').style.transform='scale(1.08) translate(0,0)'
    })
  
    // ===== PARALLAX SCROLL for sections =====
    const parallaxEls=document.querySelectorAll('.amenities-visual,.feature-card-img')
    window.addEventListener('scroll',()=>{
      const scrollY=window.scrollY
      parallaxEls.forEach(el=>{
        const rect=el.getBoundingClientRect()
        const speed=0.05
        if(rect.top<window.innerHeight&&rect.bottom>0){
          const offset=(rect.top-window.innerHeight/2)*speed
          el.querySelector('img').style.transform=`translateY(${offset}px)`
        }
      })
    },{passive:true})
  
    // ===== CARD SPOTLIGHT (mouse glow) =====
    document.querySelectorAll('.highlight-card').forEach(el=>{
      el.addEventListener('mousemove',e=>{
        const r=el.getBoundingClientRect()
        el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%')
        el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')
      })
    })
  
    // ===== SMOOTH SECTION TRANSITIONS =====
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',function(e){
        const target=document.querySelector(this.getAttribute('href'))
        if(target){
          e.preventDefault()
          target.scrollIntoView({behavior:'smooth',block:'start'})
        }
      })
    })
  
    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections=document.querySelectorAll('section[id]')
    window.addEventListener('scroll',()=>{
      let current=''
      sections.forEach(section=>{
        const top=section.offsetTop-200
        if(window.scrollY>=top)current=section.getAttribute('id')
      })
      document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a=>{
        a.style.color=''
        if(a.getAttribute('href')==='#'+current)a.style.color='var(--accent)'
      })
    },{passive:true})
  
    console.log('%c VERDANT HEIGHTS ','background:#c9a84c;color:#0d0d1a;font-size:16px;font-weight:700;padding:8px 16px;border-radius:4px;font-family:Georgia,serif')
    console.log('%c Luxury Real Estate Landing Page ','color:#c9a84c;font-size:12px')

    // ===== TEXT REVEAL for Section Titles =====
    function initTextReveals(){
      document.querySelectorAll('.section-title').forEach(title=>{
        // Split each line (br) separately
        const html=title.innerHTML
        const lines=html.split('<br>')
        title.innerHTML=lines.map(line=>{
          // Split by spaces but keep them
          const words=line.trim().split(/(\s+)/)
          return words.map(w=>{
            if(w.trim()==='')return w
            return '<span class="text-reveal"><span class="text-reveal-inner">'+w+'</span></span>'
          }).join('')
        }).join('<br>')
      })
    }
    initTextReveals()

    // ===== TEXT REVEAL OBSERVER =====
    const textRevealObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible')
          // Also trigger text-reveal children
          entry.target.querySelectorAll('.text-reveal').forEach((tr,i)=>{
            setTimeout(()=>tr.classList.add('visible'),i*60)
          })
        }
      })
    },{threshold:0.15,rootMargin:'0px 0px -40px 0px'})

    document.querySelectorAll('.section-title,.section-label.reveal').forEach(el=>{
      textRevealObserver.observe(el)
    })

    // Also observe parent reveal containers for section-title text reveals
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(container=>{
      const origObs=container._observed
      if(!origObs){
        const mo=new MutationObserver(()=>{
          if(container.classList.contains('visible')){
            container.querySelectorAll('.text-reveal').forEach((tr,i)=>{
              setTimeout(()=>tr.classList.add('visible'),i*60+200)
            })
          }
        })
        mo.observe(container,{attributes:true,attributeFilter:['class']})
        container._observed=true
      }
    })

    // ===== GALLERY IMAGE REVEAL MASKS =====
    document.querySelectorAll('.gallery-item').forEach(item=>{
      const mask=document.createElement('div')
      mask.className='img-reveal'
      item.appendChild(mask)
    })

    const galleryRevealObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          setTimeout(()=>entry.target.classList.add('visible'),100)
        }
      })
    },{threshold:0.1})
    document.querySelectorAll('.gallery-item').forEach(el=>galleryRevealObserver.observe(el))

    // ===== SECTION LABEL REVEAL CLASSES =====
    document.querySelectorAll('.section-label').forEach(label=>{
      label.classList.add('reveal')
      textRevealObserver.observe(label)
    })

    // ===== HERO TITLE WORD-BY-WORD STAGGER =====
    const heroH1=document.querySelector('.hero h1')
    if(heroH1){
      const lines=heroH1.querySelectorAll('.line')
      lines.forEach(line=>{
        const text=line.innerHTML
        // Already has spans, just add entrance micro-animation
        line.style.willChange='transform,opacity'
      })
    }

    // ===== ENHANCED HOVER: Feature Card Spotlight =====
    document.querySelectorAll('.feature-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect()
        const x=((e.clientX-r.left)/r.width*100)
        const y=((e.clientY-r.top)/r.height*100)
        card.style.background=`radial-gradient(circle at ${x}% ${y}%,rgba(201,168,76,0.04) 0%,rgba(255,255,255,0.03) 60%)`
      })
      card.addEventListener('mouseleave',()=>{
        card.style.background='rgba(255,255,255,0.03)'
      })
    })

    // ===== TESTIMONIAL CARD HOVER GLOW =====
    document.querySelectorAll('.testimonial-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect()
        const x=((e.clientX-r.left)/r.width*100)
        const y=((e.clientY-r.top)/r.height*100)
        card.style.background=`radial-gradient(circle at ${x}% ${y}%,rgba(201,168,76,0.04) 0%,rgba(255,255,255,0.02) 50%)`
      })
      card.addEventListener('mouseleave',()=>{
        card.style.background='rgba(255,255,255,0.02)'
      })
    })

    // ===== NAV LINK UNDERLINE ELEMENTS =====
    document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a=>{
      const underline=document.createElement('span')
      underline.className='nav-underline'
      a.appendChild(underline)
    })

    // ===== SMOOTH ENTRANCE FOR AMENITY ITEMS =====
    const amenityItems=document.querySelectorAll('.amenity-item')
    const amenityObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const items=entry.target.parentElement.children
          Array.from(items).forEach((item,i)=>{
            setTimeout(()=>{
              item.style.opacity='1'
              item.style.transform='translateX(0)'
            },i*80)
          })
          amenityObserver.unobserve(entry.target)
        }
      })
    },{threshold:0.2})
    if(amenityItems.length>0){
      amenityItems.forEach(item=>{
        item.style.opacity='0'
        item.style.transform='translateX(-20px)'
        item.style.transition='opacity 0.5s var(--ease-out),transform 0.5s var(--ease-out)'
      })
      amenityObserver.observe(amenityItems[0].parentElement)
    }

    // ===== HIGHLIGHT CARD COUNTER GLOW PULSE =====
    document.querySelectorAll('.highlight-card').forEach(card=>{
      card.addEventListener('mouseenter',()=>{
        const num=card.querySelector('.highlight-number')
        if(num)num.style.textShadow='0 0 30px rgba(201,168,76,0.3)'
      })
      card.addEventListener('mouseleave',()=>{
        const num=card.querySelector('.highlight-number')
        if(num)num.style.textShadow='none'
      })
    })

    // ===== LOGO HOVER ANIMATION =====
    const navLogo=document.querySelector('.logo')
    if(navLogo){
      navLogo.addEventListener('mouseenter',()=>{
        const svg=navLogo.querySelector('.logo-svg')
        if(svg){
          svg.style.transform='rotate(45deg) scale(1.1)'
          svg.style.transition='transform 0.6s var(--ease-out)'
        }
      })
      navLogo.addEventListener('mouseleave',()=>{
        const svg=navLogo.querySelector('.logo-svg')
        if(svg){
          svg.style.transform='rotate(0) scale(1)'
        }
      })
    }

    // ===== FORM INPUT FOCUS LABEL ANIM =====
    document.querySelectorAll('.form-group input,.form-group select,.form-group textarea').forEach(input=>{
      input.addEventListener('focus',()=>{
        const label=input.closest('.form-group')?.querySelector('label')
        if(label)label.style.color='var(--accent)'
      })
      input.addEventListener('blur',()=>{
        const label=input.closest('.form-group')?.querySelector('label')
        if(label)label.style.color=''
      })
    })

    // ===== SECTION DIVIDER SCROLL ANIMATION =====
    const dividerObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.opacity='1'
          const lines=entry.target.querySelectorAll('.div-line')
          const diamond=entry.target.querySelector('.div-diamond')
          const dots=entry.target.querySelectorAll('.div-dot')
          lines.forEach(l=>{l.style.transform='scaleX(1)';l.style.transition='transform 1s var(--ease-out)'})
          if(diamond){diamond.style.transform='rotate(45deg) scale(1)';diamond.style.transition='transform 0.6s var(--ease-bounce) 0.3s'}
          dots.forEach((d,i)=>{d.style.opacity='1';d.style.transition='opacity 0.4s ease '+(0.4+i*0.1)+'s'})
        }
      })
    },{threshold:0.5})
    document.querySelectorAll('.section-divider-ornament').forEach(div=>{
      div.style.opacity='0'
      div.style.transition='opacity 0.6s'
      div.querySelectorAll('.div-line').forEach(l=>{l.style.transform='scaleX(0)';l.style.transition='transform 0s'})
      const diamond=div.querySelector('.div-diamond')
      if(diamond){diamond.style.transform='rotate(45deg) scale(0)';diamond.style.transition='transform 0s'}
      div.querySelectorAll('.div-dot').forEach(d=>{d.style.opacity='0'})
      dividerObserver.observe(div)
    })

    console.log('%c VERDANT HEIGHTS ','background:#c9a84c;color:#0d0d1a;font-size:16px;font-weight:700;padding:8px 16px;border-radius:4px;font-family:Georgia,serif')
    console.log('%c Luxury Real Estate Landing Page ','color:#c9a84c;font-size:12px')

    // ===== CURSOR TRAIL =====
    const trailCount=8
    const trails=[]
    for(let i=0;i<trailCount;i++){
      const t=document.createElement('div')
      t.className='cursor-trail'
      t.style.opacity=(1-i/trailCount)*0.3
      t.style.width=t.style.height=(4-i*0.3)+'px'
      document.body.appendChild(t)
      trails.push({el:t,x:0,y:0})
    }
    function animateTrails(){
      let px=mx,py=my
      trails.forEach((t,i)=>{
        const speed=0.25-i*0.02
        t.x+=(px-t.x)*speed
        t.y+=(py-t.y)*speed
        t.el.style.left=t.x+'px'
        t.el.style.top=t.y+'px'
        px=t.x;py=t.y
      })
      requestAnimationFrame(animateTrails)
    }
    animateTrails()
    if(window.innerWidth<=768)trails.forEach(t=>t.el.style.display='none')

    // ===== SIDE SECTION NAVIGATION =====
    const sideNav=document.getElementById('sideNav')
    const sideNavSections=[
      {id:'hero',label:'Home'},
      {id:'highlights',label:'Highlights'},
      {id:'amenities',label:'Amenities'},
      {id:'gallery',label:'Gallery'},
      {id:'features',label:'Features'},
      {id:'viewer3d',label:'3D Model'},
      {id:'testimonials',label:'Reviews'},
      {id:'contact',label:'Contact'},
      {id:'cta',label:'Register'}
    ]
    sideNavSections.forEach((s,i)=>{
      if(i>0){const line=document.createElement('div');line.className='side-nav-line';sideNav.appendChild(line)}
      const item=document.createElement('div')
      item.className='side-nav-item'
      item.dataset.section=s.id
      item.innerHTML='<div class="side-nav-dot"></div><div class="side-nav-label">'+s.label+'</div>'
      item.addEventListener('click',()=>{
        const target=document.getElementById(s.id)
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'})
      })
      sideNav.appendChild(item)
    })
    const sideNavObserver2=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{sideNav.classList.toggle('visible',!entry.isIntersecting)})
    },{threshold:0.5})
    sideNavObserver2.observe(document.getElementById('hero'))
    function updateSideNav(){
      let current=''
      sideNavSections.forEach(s=>{
        const el=document.getElementById(s.id)
        if(el&&window.scrollY>=el.offsetTop-300)current=s.id
      })
      sideNav.querySelectorAll('.side-nav-item').forEach(item=>{
        item.classList.toggle('active',item.dataset.section===current)
      })
    }
    window.addEventListener('scroll',updateSideNav,{passive:true})
    updateSideNav()

    // ===== HERO BADGE TYPING EFFECT =====
    const badge=document.querySelector('.hero-badge[data-typing]')
    if(badge){
      const fullText=badge.dataset.typing
      const textEl=badge.querySelector('.badge-text')
      if(textEl){
        textEl.textContent=''
        let charIndex=0
        function typeChar(){
          if(charIndex<fullText.length){
            textEl.textContent+=fullText[charIndex]
            charIndex++
            setTimeout(typeChar,50+Math.random()*30)
          }
        }
        setTimeout(typeChar,1400)
      }
    }

    // ===== IMAGE SKELETON LOADING =====
    document.querySelectorAll('img[loading="lazy"]').forEach(img=>{
      const wrapper=img.parentElement
      if(wrapper){
        const skel=document.createElement('div')
        skel.className='img-skeleton'
        wrapper.style.position='relative'
        wrapper.insertBefore(skel,img)
        if(img.complete){skel.classList.add('loaded')}
        else{
          img.addEventListener('load',()=>skel.classList.add('loaded'))
          img.addEventListener('error',()=>skel.classList.add('loaded'))
        }
      }
    })

    // ===== MULTI-DEPTH PARALLAX =====
    const parallaxLayers=[
      {selector:'.amenities-bg-glow',speed:0.04},
      {selector:'.amenities-bg-glow-2',speed:-0.03},
      {selector:'.cta-glow1',speed:0.035},
      {selector:'.cta-glow2',speed:-0.025}
    ]
    const depthElements=[]
    parallaxLayers.forEach(layer=>{
      document.querySelectorAll(layer.selector).forEach(el=>{
        depthElements.push({el,speed:layer.speed})
      })
    })
    window.addEventListener('scroll',()=>{
      const scrollY=window.scrollY
      depthElements.forEach(item=>{
        const rect=item.el.getBoundingClientRect()
        if(rect.top<window.innerHeight+200&&rect.bottom>-200){
          const offset=scrollY*item.speed
          item.el.style.transform=`translate(${offset}px,${offset*0.5}px) scale(${1+Math.abs(offset)*0.0005})`
        }
      })
    },{passive:true})

    // ===== GALLERY ITEM DEPTH PARALLAX =====
    const galleryItems2=document.querySelectorAll('.gallery-item')
    galleryItems2.forEach((item)=>{
      item.classList.add('depth-parallax')
      item.dataset.depth=(0.02+Math.random()*0.03).toFixed(3)
    })
    window.addEventListener('scroll',()=>{
      galleryItems2.forEach(item=>{
        const rect=item.getBoundingClientRect()
        if(rect.top<window.innerHeight&&rect.bottom>0){
          const speed=parseFloat(item.dataset.depth)||0.02
          const offset=(rect.top-window.innerHeight/2)*speed
          item.style.transform=`translateY(${offset}px)`
        }
      })
    },{passive:true})

    // ===== SCROLL-DRIVEN SECTION OPACITY =====
    const sectionOpacityEls=document.querySelectorAll('section.section-padding')
    function updateSectionOpacity(){
      sectionOpacityEls.forEach(section=>{
        const rect=section.getBoundingClientRect()
        const vh=window.innerHeight
        if(rect.top>0&&rect.top<vh*0.5){
          const progress=1-(rect.top/(vh*0.5))
          section.style.opacity=Math.max(0.4,Math.min(1,progress))
        }else if(rect.top<=0){
          section.style.opacity='1'
        }
      })
    }
    window.addEventListener('scroll',updateSectionOpacity,{passive:true})

    // ===== TESTIMONIAL CARD 3D TILT =====
    document.querySelectorAll('.testimonial-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect()
        const x=e.clientX-r.left,y=e.clientY-r.top
        const cx=r.width/2,cy=r.height/2
        const dx=(x-cx)/cx,dy=(y-cy)/cy
        card.style.transform=`translateY(-6px) perspective(600px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg)`
      })
      card.addEventListener('mouseleave',()=>{
        card.style.transform='translateY(0) perspective(600px) rotateX(0) rotateY(0)'
        card.style.transition='transform 0.6s var(--ease-out),border-color 0.5s,box-shadow 0.5s,background 0.5s'
        setTimeout(()=>{card.style.transition=''},600)
      })
    })

    // ===== BENEFITS LIST STAGGERED ENTRANCE =====
    const benefitItems=document.querySelectorAll('.benefits li')
    const benefitsObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const parent=entry.target.closest('.benefits')
          if(parent){
            Array.from(parent.children).forEach((li,i)=>{
              setTimeout(()=>li.classList.add('visible'),i*120)
            })
          }
          benefitsObserver.unobserve(entry.target)
        }
      })
    },{threshold:0.2})
    if(benefitItems.length>0)benefitsObserver.observe(benefitItems[0])

    // ===== FORM INPUT ENHANCED FOCUS =====
    document.querySelectorAll('.form-group input,.form-group select,.form-group textarea').forEach(input=>{
      const fg=input.closest('.form-group')
      if(fg){
        input.addEventListener('focus',()=>fg.classList.add('focused'))
        input.addEventListener('blur',()=>fg.classList.remove('focused'))
      }
    })

    // ===== HERO SCROLL INDICATOR FADE =====
    const heroScrollIndicator=document.querySelector('.hero-scroll')
    if(heroScrollIndicator){
      window.addEventListener('scroll',()=>{
        heroScrollIndicator.classList.toggle('hidden',window.scrollY>200)
      },{passive:true})
    }

    // ===== HIGHLIGHT COUNTER SUFFIX =====
    const counterSuffixObserver=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateCounters()
          setTimeout(()=>{
            document.querySelectorAll('.highlight-number[data-target]').forEach(el=>{
              const val=el.textContent
              if(!val.includes('+'))el.textContent=val+'+'
            })
          },2100)
          counterSuffixObserver.unobserve(entry.target)
        }
      })
    },{threshold:0.12,rootMargin:'0px 0px -60px 0px'})
    const hGrid=document.getElementById('highlightGrid')
    if(hGrid)counterSuffixObserver.observe(hGrid)

    // ===== BUTTON AURA PULSE =====
    document.querySelectorAll('.btn-primary').forEach(btn=>{
      btn.addEventListener('mouseenter',()=>{
        btn.style.boxShadow='0 20px 50px rgba(201,168,76,0.25),0 0 40px rgba(201,168,76,0.1)'
      })
      btn.addEventListener('mouseleave',()=>{
        btn.style.boxShadow=''
      })
    })

    // ===== SCROLL VELOCITY INDICATOR =====
    let lastScroll2=0
    window.addEventListener('scroll',()=>{
      const vel=Math.abs(window.scrollY-lastScroll2)
      lastScroll2=window.scrollY
      const glowSize=120+Math.min(vel*2,80)
      const glowEl=document.getElementById('cursorGlow')
      if(glowEl){glowEl.style.width=glowEl.style.height=glowSize+'px'}
      const pb=document.getElementById('progressBar')
      if(pb){pb.style.boxShadow=`0 0 ${10+vel}px rgba(201,168,76,${0.2+Math.min(vel*0.02,0.4)})`}
    },{passive:true})

    // ===== GALLERY FILTER LETTER-SPACING =====
    document.querySelectorAll('.gallery-filter button').forEach(btn=>{
      btn.addEventListener('mouseenter',()=>{btn.style.letterSpacing='2.5px'})
      btn.addEventListener('mouseleave',()=>{btn.style.letterSpacing=''})
    })

    // ===== FLOOR PLAN VIEWER =====
    const roomData={
      living:{name:'Living Room',dims:'28\' × 22\'',desc:'Expansive open-plan living with floor-to-ceiling windows, Italian marble flooring, and integrated Sonos sound system.',features:['Double-height ceiling','Smart lighting','Fireplace']},
      kitchen:{name:'Gourmet Kitchen',dims:'24\' × 14\'',desc:'Chef\'s kitchen with Gaggenau appliances, Calacatta marble countertops, and walk-in pantry.',features:['Wine fridge','Island seating','Smart oven']},
      dining:{name:'Dining Area',dims:'24\' × 8\'',desc:'Elegant formal dining space with custom chandelier and built-in display cabinets.',features:['Wine cabinet','Ambient lighting']},
      master:{name:'Master Suite',dims:'22\' × 18\'',desc:'Luxurious master bedroom with walk-in closet, en-suite bathroom, and private balcony access.',features:['Walk-in closet','En-suite bath','Balcony access']},
      bedroom2:{name:'Bedroom 2',dims:'14\' × 16\'',desc:'Spacious guest bedroom with built-in wardrobes and en-suite bathroom.',features:['Built-in storage','En-suite bath']},
      bath:{name:'Spa Bathroom',dims:'12\' × 10\'',desc:'Full spa bathroom with freestanding soaking tub, rain shower, and heated floors.',features:['Soaking tub','Rain shower','Heated floors']},
      balcony:{name:'Sky Terrace',dims:'14\' × 8\'',desc:'Private outdoor terrace with panoramic skyline views and space for al fresco dining.',features:['Panoramic views','Glass railing']}
    }
    document.querySelectorAll('.fp-svg-wrap .room').forEach(room=>{
      room.addEventListener('click',()=>{
        const data=roomData[room.dataset.room]
        if(!data)return
        const info=document.getElementById('fpRoomInfo')
        info.innerHTML='<h4>'+data.name+'</h4><p>'+data.desc+'</p><div style="margin-top:12px;font-size:13px;color:var(--accent)">Dimensions: '+data.dims+'</div><div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px">'+data.features.map(f=>'<span style="padding:4px 12px;border-radius:50px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.12);font-size:11px;color:var(--accent)">'+f+'</span>').join('')+'</div>'
      })
    })
    document.querySelectorAll('.fp-tab').forEach(tab=>{
      tab.addEventListener('click',()=>{
        document.querySelectorAll('.fp-tab').forEach(t=>t.classList.remove('active'))
        tab.classList.add('active')
      })
    })

    // ===== MORTGAGE CALCULATOR =====
    const mcPrice=document.getElementById('mcPrice'),mcDown=document.getElementById('mcDown')
    const mcRate=document.getElementById('mcRate'),mcTerm=document.getElementById('mcTerm')
    function formatCurrency(n){return '$'+Math.round(n).toLocaleString()}
    function calcMortgage(){
      const price=parseInt(mcPrice.value)
      const downPct=parseInt(mcDown.value)/100
      const rate=parseFloat(mcRate.value)/100/12
      const years=parseInt(mcTerm.value)
      const months=years*12
      const loan=price*(1-downPct)
      const monthly=loan*(rate*Math.pow(1+rate,months))/(Math.pow(1+rate,months)-1)
      const totalPay=monthly*months
      const totalInt=totalPay-loan
      const downAmt=price*downPct
      document.getElementById('mcPriceVal').textContent=formatCurrency(price)
      document.getElementById('mcDownVal').textContent=mcDown.value+'%'
      document.getElementById('mcRateVal').textContent=parseFloat(mcRate.value).toFixed(1)+'%'
      document.getElementById('mcTermVal').textContent=years+' Years'
      document.getElementById('mcMonthly').textContent=formatCurrency(monthly)
      document.getElementById('mcLoanAmt').textContent=formatCurrency(loan)
      document.getElementById('mcTotalInt').textContent=formatCurrency(totalInt)
      document.getElementById('mcTotalPay').textContent=formatCurrency(totalPay)
      document.getElementById('mcDownAmt').textContent=formatCurrency(downAmt)
    }
    if(mcPrice){[mcPrice,mcDown,mcRate,mcTerm].forEach(el=>{el.addEventListener('input',calcMortgage)})}
    calcMortgage()

    // ===== TOUR BOOKING CALENDAR =====
    let tbMonth=5,tbYear=2026,tbSelectedDate=null,tbSelectedSlot=null,tbSelectedType='in-person'
    const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']
    const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    function renderCalendar(){
      const grid=document.getElementById('tbCalGrid')
      if(!grid)return
      grid.innerHTML=''
      document.getElementById('tbMonthYear').textContent=monthNames[tbMonth]+' '+tbYear
      dayNames.forEach(d=>{const el=document.createElement('div');el.className='tb-cal-day';el.textContent=d;grid.appendChild(el)})
      const firstDay=new Date(tbYear,tbMonth,1).getDay()
      const daysInMonth=new Date(tbYear,tbMonth+1,0).getDate()
      const today=new Date()
      for(let i=0;i<firstDay;i++){const el=document.createElement('div');grid.appendChild(el)}
      for(let d=1;d<=daysInMonth;d++){
        const el=document.createElement('div')
        el.className='tb-cal-date'
        el.textContent=d
        const dateObj=new Date(tbYear,tbMonth,d)
        if(dateObj<new Date(today.getFullYear(),today.getMonth(),today.getDate()))el.classList.add('disabled')
        if(d===today.getDate()&&tbMonth===today.getMonth()&&tbYear===today.getFullYear())el.classList.add('today')
        if(tbSelectedDate&&tbSelectedDate.d===d&&tbSelectedDate.m===tbMonth&&tbSelectedDate.y===tbYear)el.classList.add('selected')
        el.addEventListener('click',()=>{
          tbSelectedDate={d,m:tbMonth,y:tbYear}
          tbSelectedSlot=null
          renderCalendar();renderSlots()
        })
        grid.appendChild(el)
      }
    }
    function renderSlots(){
      const list=document.getElementById('tbSlotList')
      if(!list||!tbSelectedDate)return
      const slots=['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
      const booked=Math.floor(Math.random()*3)
      list.innerHTML=''
      slots.forEach((s,i)=>{
        const el=document.createElement('div')
        el.className='tb-slot'
        if(i===booked||i===booked+3)el.classList.add('booked')
        if(tbSelectedSlot===s)el.classList.add('selected')
        el.innerHTML='<span class="dot"></span>'+s
        el.addEventListener('click',()=>{
          if(el.classList.contains('booked'))return
          tbSelectedSlot=s;renderSlots();updateConfirm()
        })
        list.appendChild(el)
      })
      updateConfirm()
    }
    function updateConfirm(){
      const txt=document.getElementById('tbConfirmText'),btn=document.getElementById('tbBookBtn')
      if(!txt||!btn)return
      if(tbSelectedDate&&tbSelectedSlot){
        const dateStr=monthNames[tbSelectedDate.m]+' '+tbSelectedDate.d+', '+tbSelectedDate.y
        txt.textContent=dateStr+' at '+tbSelectedSlot+' — '+tbSelectedType.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())+' Tour'
        btn.disabled=false;btn.style.opacity='1'
      }else{
        txt.textContent='Select a date and time to continue'
        btn.disabled=true;btn.style.opacity='0.5'
      }
    }
    const tbPrev=document.getElementById('tbPrev'),tbNext=document.getElementById('tbNext')
    if(tbPrev){
      tbPrev.addEventListener('click',()=>{tbMonth--;if(tbMonth<0){tbMonth=11;tbYear--}renderCalendar()})
      tbNext.addEventListener('click',()=>{tbMonth++;if(tbMonth>11){tbMonth=0;tbYear++}renderCalendar()})
    }
    document.querySelectorAll('.tb-type-opt').forEach(opt=>{
      opt.addEventListener('click',()=>{
        document.querySelectorAll('.tb-type-opt').forEach(o=>o.classList.remove('selected'))
        opt.classList.add('selected')
        tbSelectedType=opt.dataset.type;updateConfirm()
      })
    })
    const tbBookBtn=document.getElementById('tbBookBtn')
    if(tbBookBtn){
      tbBookBtn.addEventListener('click',()=>{
        if(tbBookBtn.disabled)return
        tbBookBtn.innerHTML='<span class="btn-shine"></span><span>Booking Confirmed! ✓</span>'
        tbBookBtn.style.background='linear-gradient(135deg,#2a8a4a,#3cb868)'
        tbBookBtn.disabled=true
      })
    }
    renderCalendar()

})(jQuery);