import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import CVTemplate from '../components/CVTemplate';
import AIChat from '../components/AIChat';

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cvRef = React.useRef();

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScroll = () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
      });
      navLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.includes(current)) {
          a.style.color = 'var(--text)';
        } else {
          a.style.color = '';
        }
      });
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  const openMobile = () => setIsMobileMenuOpen(true);
  const closeMobile = () => setIsMobileMenuOpen(false);

  const handleForm = (e) => {
    e.preventDefault();
    setFormSuccess(true);
    e.target.reset();
    setTimeout(() => { setFormSuccess(false); }, 4000);
  };

  const handleDownloadCV = () => {
    setIsDownloading(true);
    const element = cvRef.current;
    const opt = {
      margin: 10,
      filename: 'Toshkanov_Ulugbek_CV.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      setIsDownloading(false);
    });
  };

  return (
    <div className="bg-bg text-text font-dm selection:bg-accent/30">
      <div className={`fixed inset-0 z-[110] bg-bg/98 flex-col items-center justify-center gap-9 transition-all duration-300 ${isMobileMenuOpen ? 'flex' : 'hidden'}`}>
        <button className="absolute top-6 right-[6vw] text-3xl cursor-pointer text-muted bg-transparent border-none" onClick={closeMobile}>&#x2715;</button>
        {['home', 'about', 'education', 'portfolio', 'contact'].map((id) => (
          <a key={id} href={`#${id}`} className="font-syne text-3xl font-bold text-text hover:text-accent transition-colors" onClick={closeMobile}>
            {id === 'home' ? 'Bosh sahifa' : id === 'about' ? 'Men haqimda' : id === 'education' ? 'Ta\'lim' : id === 'portfolio' ? 'Portfolio' : 'Bog\'lanish'}
          </a>
        ))}
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] py-[18px] bg-bg/85 backdrop-blur-[18px] border-b border-border">
        <div className="max-w-[1400px] mx-auto px-[6vw] flex items-center justify-between">
          <div className="font-syne font-extrabold text-[1.4rem] bg-grad bg-clip-text text-transparent tracking-tighter">TU.dev</div>
          <ul className="hidden sm:flex gap-8 list-none nav-links">
            {['home', 'about', 'education', 'portfolio', 'contact'].map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="text-muted no-underline text-[0.92rem] font-medium tracking-wide hover:text-text transition-colors">
                  {id === 'home' ? 'Bosh sahifa' : id === 'about' ? 'Men haqimda' : id === 'education' ? 'Ta\'lim' : id === 'portfolio' ? 'Portfolio' : 'Bog\'lanish'}
                </a>
              </li>
            ))}
          </ul>
          <div className="sm:hidden flex flex-col gap-[5px] cursor-pointer" onClick={openMobile}>
            <span className="w-6 h-[2px] bg-text rounded-[2px] transition-all"></span>
            <span className="w-6 h-[2px] bg-text rounded-[2px] transition-all"></span>
            <span className="w-6 h-[2px] bg-text rounded-[2px] transition-all"></span>
          </div>
        </div>
      </nav>

      <section id="home" className="min-h-[85vh] py-10 pt-[140px] relative overflow-hidden">
        <div className="absolute -right-[5vw] top-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(ellipse_at_60%_40%,rgba(108,99,255,0.18)_0%,rgba(56,189,248,0.10)_60%,transparent_80%)] rounded-full blur-[40px] pointer-events-none animate-blob-float"></div>
        <div className="max-w-[1400px] mx-auto px-[6vw] flex flex-col lg:flex-row items-center relative z-[10]">
          <div className="max-w-[700px] lg:text-left text-center flex flex-col lg:items-start items-center">
            <div className="text-[1rem] tracking-[0.18em] text-accent2 uppercase font-medium flex items-center gap-[10px] mb-[18px] opacity-0 animate-fade-up [animation-delay:0.1s]">
              <span className="w-8 h-[2px] bg-accent2"></span> Assalomu Alaykum, men
            </div>
            <h1 className="font-syne text-[clamp(2.8rem,7vw,5.2rem)] font-extrabold leading-[1.05] mb-[10px] opacity-0 animate-fade-up [animation-delay:0.25s] relative">
              <div className="flex items-center gap-0 lg:justify-start justify-center">
                Toshkanov
                <div className="absolute top-1/2 lg:-right-[30px] -right-[20px] w-12 h-12 -translate-y-1/2 animate-[rotateDots_6s_linear_infinite]">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute rounded-full shadow-[0_0_10px_currentColor] ${i % 3 === 0 ? 'w-2 h-2 text-accent bg-accent' : i % 3 === 1 ? 'w-1.5 h-1.5 text-accent3 bg-accent3' : 'w-1 h-1 text-accent2 bg-accent2'}`}
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-18px)`,
                        opacity: 0.8 + (i * 0.03)
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-0 lg:justify-start justify-center">
                <span className="bg-grad bg-clip-text text-transparent">Ulug'bek</span>
                <div className="relative w-[60px] h-[60px] flex-shrink-0 ml-4 sm:ml-4 inline-flex items-center justify-center opacity-0 animate-fade-up [animation-delay:0.35s]">
                  <div className="absolute inset-0 border-[1.5px] border-transparent border-t-accent border-r-accent3 rounded-full animate-orbit-spin"></div>
                  <div className="absolute inset-[6px] border-[1.5px] border-transparent border-t-accent2 border-r-accent rounded-full animate-orbit-spin-reverse"></div>
                  <div className="absolute inset-3 border-[1.5px] border-transparent border-t-accent3 border-r-accent2 rounded-full animate-orbit-spin-slow"></div>
                  <div className="w-2 h-2 bg-grad rounded-full shadow-[0_0_14px_var(--accent),0_0_28px_rgba(108,99,255,0.5)] animate-dot-pulse z-[1]"></div>
                </div>
              </div>
            </h1>
            <p className="text-[clamp(1rem,2.5vw,1.3rem)] text-muted mb-7 font-light opacity-0 animate-fade-up [animation-delay:0.4s]">Frontend Dasturchi · React & Next.js mutaxassisi</p>
            <p className="text-[1rem] text-muted leading-[1.75] max-w-[520px] mb-10 opacity-0 animate-fade-up [animation-delay:0.55s]">Zamonaviy, tez ishlovchi va foydalanuvchi uchun qulay web ilovalar yarataman. Toshkent, O'zbekiston.</p>
            <div className="flex gap-3.5 flex-wrap opacity-0 animate-fade-up [animation-delay:0.7s] lg:justify-start justify-center">
              <a href="#portfolio" className="px-8 py-[13px] rounded-lg bg-grad text-white font-semibold no-underline text-[0.95rem] font-syne hover:opacity-88 hover:-translate-y-0.5 transition-all border-none cursor-pointer">Loyihalarimni ko'rish</a>
              <button 
                onClick={handleDownloadCV} 
                disabled={isDownloading}
                className="px-[30px] py-3 rounded-lg border-[1.5px] border-border bg-transparent text-text no-underline text-[0.95rem] font-medium hover:border-accent hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? 'Yuklanmoqda...' : 'CV yuklash'}
              </button>
            </div>
            <div className="flex gap-4 mt-11 opacity-0 animate-fade-up [animation-delay:0.85s] lg:justify-start justify-center">
              {[
                { icon: 'fa-envelope', href: 'mailto:toshkanov.4321@icloud.com', title: 'Email' },
                { icon: 'fa-telegram', href: 'https://t.me/mufizm', title: 'Telegram' },
                { icon: 'fa-linkedin-in', href: 'https://www.linkedin.com/login', title: 'LinkedIn' },
                { icon: 'fa-github', href: '#', title: 'GitHub' }
              ].map((social, i) => (
                <a key={i} href={social.href} title={social.title} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="w-[42px] h-[42px] rounded-full border-[1.5px] border-border flex items-center justify-center text-muted no-underline text-[1rem] hover:border-accent hover:text-accent hover:-translate-y-[3px] transition-all">
                  <i className={`${social.icon.includes('envelope') ? 'fas' : 'fab'} ${social.icon}`}></i>
                </a>
              ))}
            </div>
            <div className="flex gap-9 mt-[52px] opacity-0 animate-fade-up [animation-delay:1s] lg:justify-start justify-center">
              {[
                { num: '3+', label: 'Loyihalar' },
                { num: '19', label: 'Yosh' },
                { num: '10+', label: 'Texnologiyalar' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-syne text-[2.2rem] font-extrabold bg-grad bg-clip-text text-transparent">{stat.num}</div>
                  <div className="text-[0.82rem] text-muted mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 h-[550px] relative flex items-center justify-center perspective-[1000px] lg:ml-5 ml-0 w-full mt-20 lg:mt-0">
            <div className="absolute w-[450px] h-[450px] border border-dashed border-accent/15 rounded-full animate-slow-spin before:content-[''] before:absolute before:inset-[60px] before:border before:border-dashed before:border-accent3/10 before:rounded-full before:animate-slow-spin-reverse"></div>
            {[
              { icon: 'fa-react', color: '#61DAFB', label: 'React', class: 'ts-react top-[10%] left-[15%] animate-float-tech' },
              { label: 'NEXT', class: 'ts-next top-[25%] right-[10%] animate-float-tech-delayed' },
              { icon: 'fa-js', color: '#F7DF1E', label: 'JS', class: 'ts-js bottom-[25%] left-[5%] animate-float-tech-short' },
              { label: 'TS', color: '#3178C6', class: 'ts-ts bottom-[15%] right-[20%] animate-float-tech-long', style: { fontSize: '1.8rem' } },
              { icon: 'fa-css3-alt', color: '#38B2AC', label: 'Tailwind', class: 'ts-tailwind top-[45%] right-[40%] animate-float-tech-tw' },
              { icon: 'fa-node-js', color: '#339933', label: 'Node', class: 'ts-node top-[60%] left-[35%] animate-float-tech-node' }
            ].map((tech, i) => (
              <div key={i} title={tech.label} className={`absolute w-20 h-20 bg-card/40 backdrop-blur-[12px] border-[1.5px] border-border rounded-[22px] flex items-center justify-center text-[2.2rem] text-text shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:bg-grad hover:border-transparent hover:scale-115 hover:rotate-8 hover:-translate-y-[10px] hover:shadow-[0_20px_50px_rgba(108,99,255,0.4)] hover:text-white transition-all cursor-pointer z-[2] ${tech.class}`}>
                {tech.icon ? <i className={`fab ${tech.icon}`} style={{ color: tech.color }}></i> : <span className="font-syne font-extrabold text-[1.1rem]" style={tech.style}>{tech.label}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="about" className="bg-bg2 py-[70px]">
        <div className="max-w-[1400px] mx-auto px-[6vw]">
          <div className="section-label reveal">Men haqimda</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            <div className="hidden lg:block relative reveal-left">
              <div className="w-full aspect-square max-w-[380px] rounded-[24px] bg-[linear-gradient(135deg,var(--card)_60%,#1a1530_100%)] border-[1.5px] border-border flex items-center justify-center overflow-hidden relative after:content-[''] after:absolute after:inset-0 after:rounded-[24px] after:bg-[linear-gradient(135deg,rgba(108,99,255,0.1),rgba(56,189,248,0.08))] after:border-[1.5px] after:border-border after:pointer-events-none">
                <img src="/profile.jpg" alt="Toshkanov Ulug'bek" className="w-full h-full object-cover relative z-[1] rounded-[24px] transition-transform duration-400 hover:scale-105" />
              </div>
              <div className="absolute bottom-[-18px] right-[10px] bg-card border-[1.5px] border-border rounded-xl px-[18px] py-[10px] text-[0.85rem] font-semibold text-accent2 flex items-center gap-2 z-[2]">
                <i className="fas fa-map-marker-alt text-accent"></i> Toshkent, O'zbekiston
              </div>
            </div>
            <div className="reveal-right">
              <h2 className="font-syne text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold mb-3.5 leading-[1.1]">
                Frontend<br /><span className="bg-grad bg-clip-text text-transparent">Dasturchi</span>
              </h2>
              <p className="text-muted leading-[1.8] mb-4 text-[0.97rem]">Salom! Men Toshkanov Ulug'bek — 19 yoshli frontend dasturchiman. Najot Ta'lim o'quv markazida zamonaviy veb texnologiyalarni chuqur o'rgandim va amaliy loyihalar orqali kuchli ko'nikmalarga ega bo'ldim.</p>
              <p className="text-muted leading-[1.8] mb-4 text-[0.97rem]">Toza, samarali va foydalanuvchiga qulay interfeyslar yaratishga ixtisoslashganman. Har bir loyihada dizayn va texnologiyani uyg'unlashtirgan holda eng yaxshi natijani olishga harakat qilaman.</p>
              <div className="mt-7 flex flex-col gap-2.5">
                <div className="flex items-center gap-3.5 text-[0.92rem]"><i className="fas fa-envelope text-accent w-[18px]"></i><span>toshkanov.4321@icloud.com</span></div>
                <div className="flex items-center gap-3.5 text-[0.92rem]"><i className="fab fa-telegram text-accent w-[18px]"></i><a href="https://t.me/mufizm" target="_blank" rel="noreferrer" className="text-accent2 no-underline hover:underline">@mufizm</a></div>
                <div className="flex items-center gap-3.5 text-[0.92rem]"><i className="fab fa-linkedin text-accent w-[18px]"></i><a href="https://www.linkedin.com/login" target="_blank" rel="noreferrer" className="text-accent2 no-underline hover:underline">LinkedIn</a></div>
                <div className="flex items-center gap-3.5 text-[0.92rem]"><i className="fas fa-map-marker-alt text-accent w-[18px]"></i><span>Toshkent, O'zbekiston</span></div>
              </div>
              <div className="flex flex-wrap gap-2.5 mt-7">
                {[
                  { name: 'HTML5', icon: 'html5' },
                  { name: 'CSS3', icon: 'css3' },
                  { name: 'JavaScript', icon: 'javascript' },
                  { name: 'TypeScript', icon: 'typescript' },
                  { name: 'React', icon: 'react' },
                  { name: 'Next.js', icon: 'nextjs', invert: true },
                  { name: 'Redux', icon: 'redux' },
                  { name: 'SCSS', icon: 'sass' },
                  { name: 'Tailwind', icon: 'tailwindcss' },
                  { name: 'Git', icon: 'git' }
                ].map((skill, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[0.88rem] font-medium hover:border-accent hover:-translate-y-0.5 transition-all">
                    <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.icon}/${skill.icon}-original.svg`} alt={skill.name} className={`w-[22px] h-[22px] object-contain ${skill.invert ? 'invert' : ''}`} />{skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="education" className="bg-bg py-[70px]">
        <div className="max-w-[1400px] mx-auto px-[6vw]">
          <div className="section-label reveal">Ta'lim</div>
          <h2 className="font-syne text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold mb-3.5 leading-[1.1] reveal [animation-delay:0.1s]">O'quv markazim</h2>
          <p className="text-muted text-[1rem] max-w-[540px] leading-[1.7] mb-[52px] reveal [animation-delay:0.2s]">Professional dasturchi bo'lish yo'lida olgan ta'limim va ko'nikmalarim.</p>
          <div className="bg-card border-[1.5px] border-border rounded-[20px] p-9 sm:p-10 max-w-[820px] flex sm:flex-row flex-col gap-9 sm:items-start items-center hover:border-accent hover:-translate-y-1 transition-all reveal-scale">
            <div className="w-[72px] h-[72px] rounded-2xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5">
              <img src="https://najottalim.uz/favicon.ico" alt="Najot Ta'lim" onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span class="font-syne text-[0.7rem] font-extrabold text-accent text-center leading-[1.2]">NAJOT<br/>TA\'LIM</span>' }} className="w-full h-full object-contain" />
            </div>
            <div className="edu-info sm:text-left text-center">
              <h3 className="font-syne text-[1.3rem] font-bold mb-1.5">Najot Ta'lim</h3>
              <div className="text-accent2 text-[0.9rem] font-medium mb-2.5">Frontend Dasturchi · Bitiruvchi</div>
              <p className="text-muted text-[0.92rem] leading-[1.7] mb-4">Intensiv kurs davomida zamonaviy veb texnologiyalarni chuqur o'rgandim. Amaliy loyihalar orqali real tajriba ortirdim. REST API bilan ishlash, responsive dizayn va clean code amaliyotlarini o'zlashtirdim.</p>
              <div className="flex flex-wrap gap-2 sm:justify-start justify-center">
                {['REST API', 'Responsive dizayn', 'Clean code', 'Amaliy loyihalar'].map((tag) => (
                  <span key={tag} className="bg-accent/12 text-accent2 border border-accent/25 rounded-md px-3 py-1 text-[0.8rem] font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex gap-5 mt-4 flex-wrap sm:justify-start justify-center">
                <div className="flex items-center gap-1.5 text-muted text-[0.85rem]"><i className="far fa-calendar-alt text-accent"></i> 2025 – 2026</div>
                <div className="flex items-center gap-1.5 text-muted text-[0.85rem]"><i className="fas fa-graduation-cap text-accent"></i> Bitiruvchi</div>
                <div className="flex items-center gap-1.5 text-muted text-[0.85rem]"><i className="fas fa-folder-open text-accent"></i> 3+ loyiha</div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3 sm:justify-start justify-center">
                {[
                  { name: 'React', icon: 'react' },
                  { name: 'Next.js', icon: 'nextjs', invert: true },
                  { name: 'TypeScript', icon: 'typescript' },
                  { name: 'JavaScript', icon: 'javascript' },
                  { name: 'Tailwind', icon: 'tailwindcss' },
                  { name: 'Redux', icon: 'redux' },
                  { name: 'SCSS', icon: 'sass' },
                  { name: 'HTML5', icon: 'html5' },
                  { name: 'CSS3', icon: 'css3' },
                  { name: 'Git', icon: 'git' }
                ].map((tech, i) => (
                  <div key={i} className="flex items-center gap-2 bg-bg3 border border-border rounded-[10px] px-3.5 py-2 text-[0.85rem] font-medium">
                    <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}/${tech.icon}-original.svg`} alt={tech.name} className={`w-5 h-5 object-contain ${tech.invert ? 'invert' : ''}`} />{tech.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="bg-bg2 py-[70px]">
        <div className="max-w-[1400px] mx-auto px-[6vw]">
          <div className="section-label reveal">Portfolio</div>
          <h2 className="font-syne text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold mb-3.5 leading-[1.1] reveal [animation-delay:0.1s]">Mening Loyihalarim</h2>
          <p className="text-muted text-[1rem] max-w-[540px] leading-[1.7] mb-[52px] reveal [animation-delay:0.2s]">Men yaratgan amaliy veb loyihalar — har biri o'z texnologiyasi va dizayn yondashuvi bilan.</p>
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {[
              { name: 'Foodzy', img: '/project1.png', url: 'https://exam-7-delta.vercel.app/', delay: '[animation-delay:0.1s]' },
              { name: 'Zoo Market', img: '/project2.png', url: 'https://zoo-market-livid.vercel.app/', delay: '[animation-delay:0.2s]' },
              { name: 'Sport News', img: '/project3.png', url: 'https://figmamext1.vercel.app/', delay: '[animation-delay:0.3s]' }
            ].map((project, i) => (
              <div key={i} className={`bg-card border-[1.5px] border-border rounded-[20px] overflow-hidden transition-all duration-400 hover:border-accent hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(108,99,255,0.15)] relative cursor-pointer reveal ${project.delay}`} onClick={() => window.open(project.url, '_blank')}>
                <div className="w-full h-60 bg-[linear-gradient(135deg,#1a1a30,#0d0d20)] relative overflow-hidden">
                  <img src={project.img} alt={project.name} className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-5 sm:p-6 flex items-center justify-between">
                  <div className="font-syne text-[1.15rem] font-bold text-text">{project.name}</div>
                  <a href={project.url} target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-full border-[1.5px] border-border flex items-center justify-center text-muted no-underline text-[1rem] transition-all hover:bg-grad hover:border-transparent hover:text-white hover:-rotate-45" onClick={(e) => e.stopPropagation()}>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-bg py-[70px]">
        <div className="max-w-[1400px] mx-auto px-[6vw]">
          <div className="section-label reveal">Bog'lanish</div>
          <h2 className="font-syne text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold mb-3.5 leading-[1.1] reveal [animation-delay:0.1s]">Menga Yozing</h2>
          <p className="text-muted text-[1rem] max-w-[540px] leading-[1.7] mb-[52px] reveal [animation-delay:0.2s]">Loyiha, hamkorlik yoki savol bo'lsa — men doim muloqotga tayyorman!</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] items-start">
            <form className="flex flex-col gap-4 reveal-left" onSubmit={handleForm}>
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] text-muted font-medium">Ismingiz</label>
                <input type="text" placeholder="Ismingizni kiriting" required className="bg-card border-[1.5px] border-border rounded-lg px-4 py-[13px] text-text font-dm text-[0.95rem] outline-none focus:border-accent transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] text-muted font-medium">Email</label>
                <input type="email" placeholder="email@example.com" required className="bg-card border-[1.5px] border-border rounded-lg px-4 py-[13px] text-text font-dm text-[0.95rem] outline-none focus:border-accent transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] text-muted font-medium">Xabar</label>
                <textarea placeholder="Xabaringizni kiriting..." className="bg-card border-[1.5px] border-border rounded-lg px-4 py-[13px] text-text font-dm text-[0.95rem] outline-none focus:border-accent transition-colors min-h-[130px] resize-none"></textarea>
              </div>
              <button type="submit" className="px-8 py-[13px] rounded-lg bg-grad text-white font-semibold no-underline text-[0.95rem] font-syne hover:opacity-88 hover:-translate-y-0.5 transition-all border-none cursor-pointer w-fit">Yuborish →</button>
              {formSuccess && (
                <div className="text-accent2 text-[0.9rem] mt-2">✓ Xabaringiz yuborildi! Tez orada javob beraman.</div>
              )}
            </form>
            <div className="flex flex-col gap-[18px] reveal-right">
              {[
                { icon: 'fa-envelope', label: 'Email', value: 'toshkanov.4321@icloud.com', href: 'mailto:toshkanov.4321@icloud.com' },
                { icon: 'fa-telegram', label: 'Telegram', value: '@mufizm', href: 'https://t.me/mufizm' },
                { icon: 'fa-linkedin-in', label: 'LinkedIn', value: 'LinkedIn profilim', href: 'https://www.linkedin.com/login' },
                { icon: 'fa-map-marker-alt', label: 'Manzil', value: 'Toshkent, O\'zbekiston' }
              ].map((item, i) => (
                <div key={i} className="bg-card border-[1.5px] border-border rounded-[14px] p-5 sm:p-[22px] flex gap-4 items-center hover:border-accent hover:translate-x-1 transition-all">
                  <div className="w-[46px] h-[46px] rounded-xl bg-accent/12 flex items-center justify-center text-[1.2rem] text-accent flex-shrink-0">
                    <i className={`${item.icon.includes('envelope') || item.icon.includes('marker') ? 'fas' : 'fab'} ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-[0.78rem] text-muted mb-[3px]">{item.label}</div>
                    <div className="text-[0.95rem] font-medium">
                      {item.href ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-text no-underline hover:text-accent2">{item.value}</a> : item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-bg2 border-t border-border py-9">
        <div className="max-w-[1400px] mx-auto px-[6vw] flex flex-col sm:flex-row items-center justify-between flex-wrap gap-5 text-center sm:text-left">
          <div className="font-syne font-extrabold text-[1.2rem] bg-grad bg-clip-text text-transparent">TU.dev</div>
          <div className="text-muted text-[0.85rem]">© 2025 Toshkanov Ulug'bek · Barcha huquqlar himoyalangan</div>
          <div className="flex gap-3">
            {[
              { icon: 'fa-envelope', href: 'mailto:toshkanov.4321@icloud.com' },
              { icon: 'fa-telegram', href: 'https://t.me/mufizm' },
              { icon: 'fa-linkedin-in', href: 'https://www.linkedin.com/login' }
            ].map((social, i) => (
              <a key={i} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-muted text-[1rem] no-underline hover:text-accent transition-colors">
                <i className={`${social.icon.includes('envelope') ? 'fas' : 'fab'} ${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </footer>
      {/* Hidden CV Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <CVTemplate ref={cvRef} />
      </div>

      {/* AI Chatbot Assistant */}
      <AIChat onDownloadCV={handleDownloadCV} />
    </div>
  );
};

export default Home;
