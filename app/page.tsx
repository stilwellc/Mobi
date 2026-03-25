'use client';

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Link from "next/link";

interface SectionItem {
  name: string;
  tag: string;
  description: string;
  href?: string;
  url?: string;
  handle?: string;
  wip?: boolean;
}

interface Section {
  id: string;
  label: string;
  accent: string;
  tagline: string;
  description: string;
  items: SectionItem[];
}

const sections: Section[] = [
  {
    id: "physical", label: "Physical", accent: "#D4B896",
    tagline: "Spaces & Installations",
    description: "Exploring the intersection of design and physical space — transforming environments through thoughtful craft.",
    items: [
      { name: "Project 1122", tag: "Installation", description: "A Stilwell residence reimagined from blueprint to lived experience.", href: "/physical/1122" },
      { name: "Curation Archive", tag: "Collection", description: "Exceptional design objects, furniture, and material studies." },
      { name: "Restoration Projects", tag: "Craft", description: "Forgotten pieces brought back through meticulous reimagination." },
    ],
  },
  {
    id: "digital", label: "Digital", accent: "#96B8D4",
    tagline: "Products & Platforms",
    description: "Where innovation meets imagination — crafting digital experiences that feel intuitive, alive, and deeply human.",
    items: [
      { name: "3D Prints", tag: "Fabrication", description: "Digital-to-physical explorations through additive manufacturing." },
      { name: "Soirée", tag: "Art", description: "Curated art discovery — filtered, refined, always surprising." },
      { name: "Pricing Simulator", tag: "WIP", description: "Demystifying the vintage and design market.", wip: true },
      { name: "Crawler", tag: "WIP", description: "An intelligent agent tracking what matters to you.", wip: true },
    ],
  },
  {
    id: "shop", label: "Shop", accent: "#B8D496",
    tagline: "Curated Objects",
    description: "A selection of design pieces, furniture, and artifacts — available now.",
    items: [
      { name: "For Sale", tag: "Store", description: "Curated pieces available — furniture, objects, artifacts.", href: "/shop" },
    ],
  },
  {
    id: "social", label: "Social", accent: "#D496B8",
    tagline: "Communities & Culture",
    description: "Connect with us across our digital communities.",
    items: [
      { name: "TikTok", tag: "10K", description: "Vintage finds and design inspiration.", handle: "@mobi", url: "https://tiktok.com/@mobi" },
      { name: "Instagram", tag: "25K", description: "Visual stories of exceptional pieces.", handle: "@mobi", url: "https://instagram.com/mobi" },
      { name: "X", tag: "15K", description: "Updates and vintage market insights.", handle: "@mobi", url: "https://x.com/mobi" },
    ],
  },
];

/* ── Möbius geometry ── */
function createMobiusGeometry(segments = 200, width = 0.35) {
  const positions: number[] = [], normals: number[] = [], uvs: number[] = [], indices: number[] = [];
  const rows = segments, cols = 8;
  for (let i = 0; i <= rows; i++) {
    const u = (i / rows) * Math.PI * 2;
    for (let j = 0; j <= cols; j++) {
      const v = (j / cols - 0.5) * width;
      const cosU = Math.cos(u), sinU = Math.sin(u);
      const cosH = Math.cos(u / 2), sinH = Math.sin(u / 2);
      const r = 1 + v * cosH;
      positions.push(r * cosU, r * sinU, v * sinH);
      const nx = cosU * cosH, ny = sinU * cosH, nz = sinH;
      const len = Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
      normals.push(nx/len, ny/len, nz/len);
      uvs.push(i/rows, j/cols);
    }
  }
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const a = i*(cols+1)+j, b = a+cols+1, c = a+1, d = b+1;
    indices.push(a,b,c,c,b,d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals,3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs,2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/* ── Möbius Canvas ── */
function MobiusStrip({ mobile }: { mobile: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const size = mobile ? 320 : 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35,1,0.1,100);
    camera.position.set(0,0,4.2);
    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    renderer.setSize(size,size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setClearColor(0x000000,0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff,0.15));
    const kl = new THREE.DirectionalLight(0xD4B896,0.6); kl.position.set(3,4,5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0x96B8D4,0.25); fl.position.set(-3,-1,3); scene.add(fl);
    const rl = new THREE.DirectionalLight(0xD4B896,0.35); rl.position.set(-2,3,-4); scene.add(rl);
    const pl = new THREE.PointLight(0xD4B896,0.4,10); pl.position.set(0,0,3); scene.add(pl);

    const geo = createMobiusGeometry(240,0.4);
    const surf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color:0x0c0c0c, metalness:0.85, roughness:0.3, transparent:true, opacity:0.55, side:THREE.DoubleSide }));
    const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:0xD4B896, wireframe:true, transparent:true, opacity:0.07, side:THREE.DoubleSide }));

    const makeEdge = (v: number, color: number, op: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 400; i++) {
        const u = (i/400)*Math.PI*2;
        const cU=Math.cos(u), sU=Math.sin(u), cH=Math.cos(u/2), sH=Math.sin(u/2);
        const r=1+v*cH;
        pts.push(new THREE.Vector3(r*cU, r*sU, v*sH));
      }
      const curve = new THREE.CatmullRomCurve3(pts,true);
      return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(500)),
        new THREE.LineBasicMaterial({ color, transparent:true, opacity:op })
      );
    };
    const e1 = makeEdge(0.2, 0xD4B896, 0.35);
    const e2 = makeEdge(-0.2, 0x96B8D4, 0.18);

    const pCount = 120, pPos = new Float32Array(pCount*3);
    for (let i=0;i<pCount;i++) {
      const u=Math.random()*Math.PI*2, v=(Math.random()-0.5)*0.4, sp=(Math.random()-0.5)*0.15;
      const cU=Math.cos(u),sU=Math.sin(u),cH=Math.cos(u/2),sH=Math.sin(u/2),r=1+v*cH;
      pPos[i*3]=r*cU+sp; pPos[i*3+1]=r*sU+sp; pPos[i*3+2]=v*sH+sp;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos,3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:0xD4B896, size:0.012, transparent:true, opacity:0.4, sizeAttenuation:true }));

    const group = new THREE.Group();
    group.add(surf,wire,e1,e2,particles);
    group.rotation.x=0.5; group.rotation.z=0.15;
    scene.add(group);

    let id: number, t=0;
    const animate = () => {
      id=requestAnimationFrame(animate);
      t+=0.003;
      group.rotation.y=t;
      group.rotation.x=0.5+Math.sin(t*0.4)*0.1;
      group.rotation.z=0.15+Math.cos(t*0.3)*0.05;
      pl.position.x=Math.sin(t*2)*2; pl.position.y=Math.cos(t*2)*2;
      particles.rotation.y=t*0.3;
      renderer.render(scene,camera);
    };
    animate();

    const hr = () => {
      const s=mobile?Math.min(320,window.innerWidth-40):Math.min(600,window.innerWidth*0.42);
      renderer.setSize(s,s);
    };
    window.addEventListener("resize",hr);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize",hr); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); renderer.dispose(); };
  }, [mobile]);

  return <div ref={mountRef} style={{
    position:"absolute", right:mobile?"50%":"2%", top:"50%",
    transform:mobile?"translate(50%,-50%)":"translateY(-50%)",
    zIndex:0, opacity:0.85, pointerEvents:"none", filter:"contrast(1.1)",
  }} />;
}

/* ── Window size ── */
function useWindowSize() {
  const [w,setW] = useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);h();return()=>window.removeEventListener("resize",h);},[]);
  return w;
}

/* ── Item wrapper — handles links ── */
function ItemWrapper({ item, children, style }: { item: SectionItem; children: React.ReactNode; style?: React.CSSProperties }) {
  if (item.url) {
    return <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", ...style }}>{children}</a>;
  }
  if (item.href) {
    return <Link href={item.href} style={{ textDecoration: "none", color: "inherit", ...style }}>{children}</Link>;
  }
  return <div style={style}>{children}</div>;
}

/* ── Section Landing Page ── */
function SectionPage({ section, mobile, tablet, navigate }: { section: Section; mobile: boolean; tablet: boolean; navigate: (t: string) => void }) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const px = mobile ? 20 : tablet ? 36 : 56;

  return (
    <div style={{ minHeight: "100vh", paddingTop: mobile ? 100 : 140 }}>
      <section style={{ padding: `0 ${px}px 80px`, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <span onClick={() => navigate("home")} style={{
            fontSize: 12, color: "#444", cursor: "pointer", fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            transition: "color 0.3s ease",
          }}
            onMouseOver={e => (e.target as HTMLElement).style.color = "#D4B896"}
            onMouseOut={e => (e.target as HTMLElement).style.color = "#444"}
          >&#8592; Back</span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 16,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: section.accent, opacity: 0.6,
          }} />
          <span style={{
            fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#3a3a3a", fontWeight: 600,
          }}>{section.tagline}</span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 48 : tablet ? 64 : 90,
          fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 0.95,
          marginBottom: mobile ? 24 : 36,
        }}>
          {section.label}
        </h1>

        <p style={{
          fontSize: mobile ? 15 : 17, lineHeight: 1.8, color: "#555",
          fontWeight: 400, maxWidth: 520,
        }}>
          {section.description}
        </p>

        <div style={{
          width: "100%", height: 1, marginTop: mobile ? 40 : 64,
          background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent 80%)",
        }} />
      </section>

      <section style={{ padding: `0 ${px}px 120px`, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{
            fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#3a3a3a", fontWeight: 600,
          }}>Projects &mdash; {section.items.length}</span>
        </div>

        {section.items.map((item, i) => {
          const isHov = hoveredItem === i;
          return (
            <ItemWrapper key={item.name} item={item}>
              <div
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: "flex",
                  alignItems: mobile ? "flex-start" : "center",
                  flexDirection: mobile ? "column" : "row",
                  justifyContent: "space-between",
                  gap: mobile ? 12 : 24,
                  padding: mobile ? "24px 0" : "32px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: mobile ? 16 : 28, flex: 1 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 14 : 16, color: isHov ? section.accent : "#2a2a2a",
                    fontWeight: 400, minWidth: 32, transition: "color 0.4s ease",
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: mobile ? 28 : 36, fontWeight: 300, letterSpacing: "-0.02em",
                        transition: "color 0.4s ease",
                        color: isHov ? "#F0EDE8" : "rgba(240,237,232,0.65)",
                      }}>{item.name}</span>
                      {item.wip && (
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "4px 14px", borderRadius: 100,
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#444" }} />
                          <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#444", fontWeight: 600 }}>WIP</span>
                        </div>
                      )}
                      {item.handle && (
                        <span style={{ fontSize: 13, color: "#444", fontWeight: 400 }}>{item.handle}</span>
                      )}
                    </div>
                    <p style={{ fontSize: mobile ? 13 : 15, color: "#3a3a3a", fontWeight: 400, lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                  <span style={{
                    padding: "5px 16px", borderRadius: 100,
                    border: `1px solid ${isHov ? section.accent + "33" : "#1a1a1a"}`,
                    fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    fontWeight: 600, color: isHov ? section.accent : "#444",
                    transition: "all 0.4s ease",
                  }}>{item.tag}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                    opacity: isHov ? 0.7 : 0.1,
                    transform: isHov ? "translate(2px,-2px)" : "none",
                    transition: "all 0.4s ease",
                  }}>
                    <path d="M4 12L12 4M12 4H7M12 4V9" stroke={section.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </ItemWrapper>
          );
        })}
      </section>
    </div>
  );
}

/* ── About Page ── */
function AboutPage({ mobile, tablet, navigate }: { mobile: boolean; tablet: boolean; navigate: (t: string) => void }) {
  const px = mobile ? 20 : tablet ? 36 : 56;
  return (
    <div style={{ minHeight: "100vh", paddingTop: mobile ? 100 : 140 }}>
      <section style={{ padding: `0 ${px}px 80px`, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <span onClick={() => navigate("home")} style={{
            fontSize: 12, color: "#444", cursor: "pointer", fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.3s ease",
          }}
            onMouseOver={e => (e.target as HTMLElement).style.color = "#D4B896"}
            onMouseOut={e => (e.target as HTMLElement).style.color = "#444"}
          >&#8592; Back</span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 48 : tablet ? 64 : 90,
          fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 0.95,
          marginBottom: mobile ? 32 : 48,
        }}>
          About <span style={{ fontStyle: "italic", color: "#D4B896" }}>mobi</span>
        </h1>

        <div style={{
          fontSize: mobile ? 15 : 18, lineHeight: 2, color: "#555",
          fontWeight: 400, marginBottom: 48,
        }}>
          <p style={{ marginBottom: 28 }}>
            Mobi draws inspiration from the Möbius strip — a symbol of infinity and seamless continuity. Just as the Möbius strip weaves unexpected elements into a continuous flow, Mobi integrates diverse design principles into a harmonious, fluid experience that augments life, not just living spaces.
          </p>
          <p style={{ marginBottom: 28 }}>
            We believe design goes beyond the home. It is about enhancing the way we live, work, and interact with the world around us. Our goal is to create design that flows effortlessly through all aspects of life.
          </p>
        </div>

        <div style={{
          width: "100%", height: 1, marginBottom: 48,
          background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent 80%)",
        }} />

        {[
          { title: "Modern Design", text: "Cutting-edge design with timeless elegance — spaces and experiences that are both contemporary and enduring." },
          { title: "Optimized Experiences", text: "Designs that maximize functionality, comfort, and aesthetics. Advanced technology creating spaces that enhance the human experience." },
          { title: "Balanced Innovation", text: "Smart technology, sustainable practices, and timeless aesthetics integrated into a harmonious whole." },
        ].map((block, i) => (
          <div key={i} style={{
            marginBottom: 48,
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "200px 1fr",
            gap: mobile ? 8 : 40,
          }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? 22 : 24, fontWeight: 400, fontStyle: "italic",
              color: "#D4B896", lineHeight: 1.3,
            }}>{block.title}</h3>
            <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.85, color: "#444", fontWeight: 400 }}>
              {block.text}
            </p>
          </div>
        ))}

        <div style={{
          width: "100%", height: 1, marginBottom: 48,
          background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent 80%)",
        }} />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: mobile ? 32 : 42, fontWeight: 300, letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            How We <span style={{ fontStyle: "italic", color: "#D4B896" }}>Help</span>
          </h2>
          {[
            { title: "Augmenting Everyday Life", text: "Mobi creates designs that amplify human potential. From smart homes to collaborative workspaces, our design solutions support and enhance the way you live, work, and connect with others." },
            { title: "Sustainable Innovation", text: "Our sustainable design solutions seamlessly incorporate eco-friendly materials and energy-efficient technologies into all spaces, reducing your environmental footprint without compromising style or comfort." },
            { title: "Smart Integration", text: "We integrate technology in a way that enhances your lifestyle without disrupting it. From automated systems that enhance comfort to innovative tools that make life easier, our design flows with you." },
            { title: "Community & Connectivity", text: "Mobi believes design should foster connection. We design spaces that bring people together, whether at home, in the office, or in public spaces, fostering collaboration, creativity, and community." },
          ].map((block, i) => (
            <div key={i} style={{
              marginBottom: 32,
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "220px 1fr",
              gap: mobile ? 8 : 40,
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: mobile ? 18 : 20, fontWeight: 400, fontStyle: "italic",
                color: "#D4B896", lineHeight: 1.3,
              }}>{block.title}</h3>
              <p style={{ fontSize: mobile ? 14 : 15, lineHeight: 1.85, color: "#444", fontWeight: 400 }}>
                {block.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          padding: mobile ? 28 : 48,
          borderRadius: 20, background: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: mobile ? 24 : 30, fontWeight: 300, marginBottom: 16,
          }}>Our <span style={{ fontStyle: "italic", color: "#D4B896" }}>Vision</span></h3>
          <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.85, color: "#444", fontWeight: 400 }}>
            To redefine the way we experience design by weaving together sustainability, modern aesthetics, and cutting-edge technology in a way that enhances life at every level. Like the Möbius strip, our designs aim to create a seamless, continuous flow, augmenting the spaces where we live, work, and play.
          </p>
        </div>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */
export default function MobiSite() {
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState(0);
  const [page, setPage] = useState("home");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowSize();
  const mobile = w < 768;
  const tablet = w < 1024;

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
    setTimeout(() => setPhase(1), 700);
    setTimeout(() => setPhase(2), 1400);
    setTimeout(() => setPhase(3), 2000);
    const hs = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", hs, { passive: true });
    return () => window.removeEventListener("scroll", hs);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navigate = (target: string) => {
    setPage(target);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const px = mobile ? 20 : tablet ? 36 : 56;

  const currentSection = sections.find(s => s.id === page);

  return (
    <div style={{
      fontFamily: "'Syne', sans-serif",
      background: "#060606",
      color: "#F0EDE8",
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:rgba(212,184,150,0.25);color:#fff}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#060606}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#D4B896}

        @keyframes grainShift{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(7%,-25%)}50%{transform:translate(-15%,10%)}70%{transform:translate(0%,15%)}90%{transform:translate(-10%,10%)}}
        @keyframes floatSlow{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.02)}66%{transform:translate(-10px,10px) scale(0.98)}}
        @keyframes wipPulse{0%,100%{opacity:0.3}50%{opacity:0.8}}
        @keyframes menuReveal{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes pageIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}

        .grain-overlay{position:fixed;top:-50%;left:-50%;width:200%;height:200%;pointer-events:none;z-index:9999;opacity:0.03;animation:grainShift 0.5s steps(5) infinite;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")}

        .nav-item{color:#555;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;position:relative;padding:6px 0;transition:color 0.4s ease;-webkit-tap-highlight-color:transparent}
        .nav-item:hover{color:#F0EDE8}
        .nav-item::after{content:'';position:absolute;bottom:0;left:0;width:0%;height:1px;background:#D4B896;transition:width 0.5s cubic-bezier(0.23,1,0.32,1)}
        .nav-item:hover::after{width:100%}
        .nav-item-active{color:#F0EDE8!important}
        .nav-item-active::after{width:100%!important;background:#D4B896!important}

        .section-trigger{cursor:pointer;transition:all 0.4s cubic-bezier(0.23,1,0.32,1);-webkit-tap-highlight-color:transparent;position:relative}
        .section-trigger::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)}

        .item-entry{cursor:pointer;transition:all 0.4s cubic-bezier(0.23,1,0.32,1);-webkit-tap-highlight-color:transparent;position:relative}
        .item-entry::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0px;background:var(--accent);transition:width 0.4s cubic-bezier(0.23,1,0.32,1);border-radius:0 2px 2px 0}
        .item-entry:hover::before{width:2px}
        .item-entry:hover{background:rgba(255,255,255,0.015)}

        .wip-dot{width:6px;height:6px;border-radius:50%;background:#444;animation:wipPulse 2.5s ease-in-out infinite}

        .featured-card{position:relative;overflow:hidden;border-radius:20px;cursor:pointer;transition:all 0.6s cubic-bezier(0.23,1,0.32,1);background:#0c0c0c}
        .featured-card:hover{transform:translateY(-4px)}
        .featured-card::before{content:'';position:absolute;inset:0;border-radius:20px;padding:1px;background:linear-gradient(135deg,rgba(255,255,255,0.06),transparent 40%,transparent 60%,rgba(255,255,255,0.03));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}

        .hero-cta{display:inline-flex;align-items:center;gap:14px;padding:18px 36px;border-radius:60px;border:1px solid rgba(212,184,150,0.3);background:rgba(212,184,150,0.06);color:#D4B896;font-family:'Syne',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.5s cubic-bezier(0.23,1,0.32,1);backdrop-filter:blur(10px);-webkit-tap-highlight-color:transparent}
        .hero-cta:hover{background:#D4B896;border-color:#D4B896;color:#060606;box-shadow:0 8px 40px rgba(212,184,150,0.2),0 0 80px rgba(212,184,150,0.08);transform:translateY(-2px)}
        .hero-cta:active{transform:scale(0.97)}
        .hero-cta svg{transition:transform 0.4s ease}
        .hero-cta:hover svg{transform:translateX(4px)}

        .hamburger-bar{display:block;width:24px;height:1.5px;background:#F0EDE8;transition:all 0.4s cubic-bezier(0.23,1,0.32,1);border-radius:1px}
        .section-label-sm{font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#3a3a3a;font-weight:600}
        .tag-chip{display:inline-block;padding:4px 14px;border-radius:100px;border:1px solid #1a1a1a;font-size:10px;color:#555;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;transition:all 0.4s ease;white-space:nowrap;backdrop-filter:blur(4px)}

        .page-transition{animation:pageIn 0.6s cubic-bezier(0.23,1,0.32,1) both}
      `}</style>

      <div className="grain-overlay" />

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: mobile?200:450, height: mobile?200:450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(150,184,212,0.05) 0%, transparent 60%)",
          bottom: "10%", left: "-5%", animation: "floatSlow 20s ease-in-out infinite", filter: "blur(60px)",
        }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? "18px 20px" : "24px 56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 80 || menuOpen || page !== "home" ? "rgba(6,6,6,0.85)" : "transparent",
        backdropFilter: scrollY > 80 || menuOpen || page !== "home" ? "blur(30px) saturate(1.2)" : "none",
        borderBottom: scrollY > 80 || page !== "home" ? "1px solid rgba(255,255,255,0.04)" : "1px solid transparent",
        transition: "all 0.5s ease",
        opacity: loaded ? 1 : 0,
      }}>
        <div onClick={() => navigate("home")} style={{
          cursor: "pointer", zIndex: 101,
          fontFamily: "'Syne', sans-serif",
          fontSize: mobile ? 22 : 26, fontWeight: 700,
          color: "#F0EDE8", letterSpacing: "-0.04em", lineHeight: 1,
        }}>
          mobi<span style={{ color: "#D4B896" }}>.</span>
        </div>

        {!mobile && (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {sections.map((s) => (
              <span
                key={s.id}
                className={`nav-item ${page === s.id ? "nav-item-active" : ""}`}
                onClick={() => navigate(s.id)}
              >{s.label}</span>
            ))}
            <div style={{ width: 1, height: 12, background: "#222", margin: "0 4px" }} />
            <span
              className={`nav-item ${page === "about" ? "nav-item-active" : ""}`}
              style={{ color: page === "about" ? "#F0EDE8" : "#D4B896" }}
              onClick={() => navigate("about")}
            >about</span>
          </div>
        )}

        {mobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 10, display: "flex", flexDirection: "column", gap: 6,
            zIndex: 101, WebkitTapHighlightColor: "transparent",
          }}>
            <span className="hamburger-bar" style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span className="hamburger-bar" style={{ opacity: menuOpen ? 0 : 1, width: 16 }} />
            <span className="hamburger-bar" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobile && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99,
          background: "rgba(6,6,6,0.97)", backdropFilter: "blur(40px)",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6,
          opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity 0.5s ease",
        }}>
          {[...sections.map(s => ({ label: s.label, id: s.id })), { label: "About", id: "about" }].map((item, i) => (
            <div key={item.id} onClick={() => navigate(item.id)} style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300,
              color: page === item.id ? "#F0EDE8" : (item.id === "about" ? "#D4B896" : "#777"),
              padding: "14px 0", cursor: "pointer", textAlign: "center",
              animation: menuOpen ? `menuReveal 0.5s ease ${i * 0.08}s both` : "none",
            }}>{item.label}</div>
          ))}
        </div>
      )}

      {/* PAGES */}

      {currentSection && (
        <div key={page} className="page-transition">
          <SectionPage section={currentSection} mobile={mobile} tablet={tablet} navigate={navigate} />
        </div>
      )}

      {page === "about" && (
        <div key="about" className="page-transition">
          <AboutPage mobile={mobile} tablet={tablet} navigate={navigate} />
        </div>
      )}

      {page === "home" && (
        <>
          {/* HERO */}
          <section style={{
            minHeight: "100vh",
            display: "flex", flexDirection: "column", justifyContent: "center",
            position: "relative", padding: mobile ? "120px 20px 80px" : "140px 56px 100px",
            overflow: "hidden",
          }}>
            <MobiusStrip mobile={mobile} />

            <div style={{
              position: "absolute", top: mobile ? "18%" : "15%", left: mobile ? "5%" : "8%",
              width: phase >= 1 ? (mobile ? 40 : 80) : 0, height: 1, background: "#D4B896",
              transition: "width 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s", opacity: 0.4,
            }} />

            <div style={{
              opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1)",
              marginBottom: mobile ? 24 : 36, display: "flex", alignItems: "center", gap: 16,
              position: "relative", zIndex: 2,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1px solid #D4B896", opacity: 0.5 }} />
              <span className="section-label-sm">Design Studio &mdash; Est. 2024</span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: mobile ? 48 : tablet ? 72 : "clamp(80px, 9vw, 140px)",
              lineHeight: mobile ? 1 : 0.9, letterSpacing: "-0.03em",
              maxWidth: mobile ? "100%" : "65%",
              opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(50px)",
              transition: "all 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.15s",
              position: "relative", zIndex: 2,
            }}>
              <span style={{ display: "block" }}>Where design</span>
              <span style={{
                display: "block", fontStyle: "italic", fontWeight: 400,
                background: "linear-gradient(135deg, #D4B896 0%, #E8D5BC 40%, #D4B896 70%, #C4A886 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>transcends</span>
              <span style={{ display: "block", color: "rgba(240,237,232,0.5)" }}>boundaries</span>
            </h1>

            <div style={{
              marginTop: mobile ? 36 : 56, display: "flex",
              flexDirection: mobile ? "column" : "row", alignItems: mobile ? "flex-start" : "flex-end",
              gap: mobile ? 32 : 80,
              opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1)",
              position: "relative", zIndex: 2,
            }}>
              <p style={{ maxWidth: mobile ? "100%" : 380, fontSize: mobile ? 14 : 15, lineHeight: 1.85, color: "#555", fontWeight: 400 }}>
                Physical spaces, digital products, and cultural connections — designed with intention, built with craft, refined through obsession.
              </p>
              <button className="hero-cta" onClick={() => { const el = document.getElementById("directory"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>
                Explore
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {!mobile && (
              <div style={{
                position: "absolute", bottom: 48, left: 56, right: 56,
                display: "flex", alignItems: "center", gap: 24,
                opacity: phase >= 3 ? 0.4 : 0, transition: "opacity 1.5s ease",
              }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)" }} />
                <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#333", fontWeight: 600 }}>Scroll to explore</span>
              </div>
            )}
          </section>

          {/* DIRECTORY */}
          <section id="directory" style={{ padding: mobile ? "40px 0 80px" : "80px 0 140px", position: "relative", zIndex: 1, scrollMarginTop: 80 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px}px` }}>
              <div style={{
                display: "flex", flexDirection: mobile ? "column" : "row",
                justifyContent: "space-between", alignItems: mobile ? "flex-start" : "flex-end",
                marginBottom: mobile ? 40 : 72, gap: mobile ? 12 : 0,
              }}>
                <div>
                  <div className="section-label-sm" style={{ marginBottom: 16 }}>Index</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 36 : tablet ? 48 : 60,
                    fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1,
                  }}>
                    Everything we{" "}<span style={{ fontStyle: "italic", fontWeight: 400, color: "#D4B896" }}>make</span>
                  </h2>
                </div>
                {!mobile && (
                  <span style={{ fontSize: 11, color: "#2a2a2a", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                    {sections.reduce((a, s) => a + s.items.length, 0)} Projects
                  </span>
                )}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {sections.map((section, si) => {
                  const isExpanded = expandedSection === section.id;
                  const isHovS = hoveredSection === section.id;
                  return (
                    <div key={section.id}>
                      <div className="section-trigger"
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        onMouseEnter={() => setHoveredSection(section.id)}
                        onMouseLeave={() => setHoveredSection(null)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: mobile ? "24px 0" : "32px 0",
                          background: isHovS && !mobile ? "rgba(255,255,255,0.008)" : "transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: mobile ? 16 : 28 }}>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif", fontSize: mobile ? 13 : 15,
                            color: isExpanded ? section.accent : "#2a2a2a", fontWeight: 400,
                            minWidth: mobile ? 24 : 32, transition: "color 0.4s ease",
                          }}>{String(si + 1).padStart(2, "0")}</span>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: mobile ? 32 : tablet ? 40 : 52, fontWeight: 300,
                            letterSpacing: "-0.02em",
                            transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                            color: isExpanded ? section.accent : (isHovS ? "#F0EDE8" : "rgba(240,237,232,0.7)"),
                            transform: isHovS && !mobile ? "translateX(8px)" : "none",
                          }}>{section.label}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 16 : 24 }}>
                          <span
                            onClick={(e) => { e.stopPropagation(); navigate(section.id); }}
                            style={{
                              fontSize: 11, color: "#333", fontWeight: 600, letterSpacing: "0.1em",
                              textTransform: "uppercase", cursor: "pointer",
                              transition: "color 0.3s ease",
                              padding: "4px 0",
                            }}
                            onMouseOver={e => (e.target as HTMLElement).style.color = section.accent}
                            onMouseOut={e => (e.target as HTMLElement).style.color = "#333"}
                          >View &#8594;</span>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            border: `1px solid ${isExpanded ? section.accent + "44" : "#1a1a1a"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                            background: isExpanded ? section.accent + "0a" : "transparent",
                            transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M7 2v10M2 7h10" stroke={isExpanded ? section.accent : "#444"} strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div style={{ maxHeight: isExpanded ? 800 : 0, overflow: "hidden", transition: "max-height 0.7s cubic-bezier(0.23, 1, 0.32, 1)" }}>
                        <div style={{ padding: mobile ? "0 0 12px 0" : "0 0 16px 60px" }}>
                          {section.items.map((item, ii) => {
                            const isHov = hoveredItem === `${section.id}-${ii}`;
                            return (
                              <ItemWrapper key={item.name} item={item}>
                                <div className="item-entry" style={{
                                  "--accent": section.accent,
                                  display: "flex", alignItems: mobile ? "flex-start" : "center",
                                  flexDirection: mobile ? "column" : "row",
                                  justifyContent: "space-between", gap: mobile ? 10 : 20,
                                  padding: mobile ? "16px 12px" : "20px 24px", borderRadius: 10,
                                  opacity: isExpanded ? 1 : 0, transform: isExpanded ? "translateY(0)" : "translateY(-12px)",
                                  transition: `all 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${ii * 0.07}s`,
                                } as React.CSSProperties}
                                  onMouseEnter={() => setHoveredItem(`${section.id}-${ii}`)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                >
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                                      <span style={{
                                        fontSize: mobile ? 16 : 18, fontWeight: 500, letterSpacing: "-0.01em",
                                        transition: "all 0.4s ease", color: isHov ? "#F0EDE8" : "#777",
                                      }}>{item.name}</span>
                                      {item.wip && (
                                        <div style={{
                                          display: "inline-flex", alignItems: "center", gap: 6,
                                          padding: "3px 12px", borderRadius: 100,
                                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                                        }}>
                                          <div className="wip-dot" />
                                          <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#444", fontWeight: 600 }}>WIP</span>
                                        </div>
                                      )}
                                      {item.handle && <span style={{ fontSize: 12, color: "#333" }}>{item.handle}</span>}
                                    </div>
                                    <span style={{ fontSize: mobile ? 12 : 13, color: "#3a3a3a", fontWeight: 400, lineHeight: 1.6 }}>
                                      {item.description}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                                    <span className="tag-chip" style={{
                                      borderColor: isHov ? section.accent + "33" : "#1a1a1a",
                                      color: isHov ? section.accent : "#444",
                                    }}>{item.tag}</span>
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{
                                      opacity: isHov ? 0.7 : 0.1, transform: isHov ? "translate(2px,-2px)" : "none",
                                      transition: "all 0.4s ease",
                                    }}>
                                      <path d="M4 12L12 4M12 4H7M12 4V9" stroke={section.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>
                              </ItemWrapper>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FEATURED */}
          <section style={{ padding: mobile ? "40px 20px 80px" : "60px 56px 140px", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: mobile ? "flex-start" : "flex-end",
                flexDirection: mobile ? "column" : "row",
                marginBottom: mobile ? 32 : 64, gap: mobile ? 12 : 0,
              }}>
                <div>
                  <div className="section-label-sm" style={{ marginBottom: 16 }}>Selected Work</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 36 : tablet ? 48 : 60,
                    fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1,
                  }}>
                    Featured <span style={{ fontStyle: "italic", fontWeight: 400, color: "#D4B896" }}>projects</span>
                  </h2>
                </div>
              </div>

              <Link href="/physical/1122" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="featured-card" style={{ padding: mobile ? 28 : 48 }}>
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(212,184,150,0.3), transparent)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: mobile ? 24 : 36 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4B896", fontWeight: 600, background: "rgba(212,184,150,0.06)", padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(212,184,150,0.1)" }}>Physical</span>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.25 }}><path d="M6 14L14 6M14 6H8M14 6V12" stroke="#F0EDE8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ background: "#080808", borderRadius: 14, height: mobile ? 140 : 200, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: mobile ? 28 : 40, border: "1px solid rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(212,184,150,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,184,150,0.02) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(212,184,150,0.04), transparent 60%)" }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mobile ? 36 : 56, fontWeight: 300, color: "rgba(255,255,255,0.04)", letterSpacing: "0.1em" }}>1122</span>
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: mobile ? 28 : 36, fontWeight: 300, marginBottom: 6 }}>Project 1122</h3>
                  <div style={{ fontSize: 12, color: "#333", marginBottom: mobile ? 14 : 18, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Stilwell</div>
                  <p style={{ fontSize: mobile ? 13 : 15, lineHeight: 1.75, color: "#555", fontWeight: 400, maxWidth: 480 }}>A complete spatial transformation — reimagining a home from blueprint to lived experience.</p>
                </div>
              </Link>
            </div>
          </section>

          {/* PHILOSOPHY */}
          <section style={{ padding: mobile ? "60px 20px 80px" : "100px 56px 160px", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 40 : 80 }}>
                <div>
                  <div className="section-label-sm" style={{ marginBottom: 16 }}>Philosophy</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 36 : tablet ? 48 : 60,
                    fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1,
                    marginBottom: mobile ? 24 : 36,
                  }}>
                    The infinite<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "#D4B896" }}>loop</span>
                  </h2>
                  <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.85, color: "#444", fontWeight: 400, marginBottom: 24 }}>
                    Named after the Möbius strip — a surface with only one side and one boundary. It represents our belief that great design has no beginning or end, no separation between form and function, no divide between physical and digital.
                  </p>
                  <button className="hero-cta" onClick={() => navigate("about")} style={{ marginTop: 8 }}>
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {[
                    { num: "01", title: "Seamless", desc: "Design that flows naturally between physical spaces and digital experiences." },
                    { num: "02", title: "Continuous", desc: "Every project builds on the last — an evolving body of interconnected work." },
                    { num: "03", title: "Infinite", desc: "No boundaries between disciplines. Architecture informs software. Software reshapes space." },
                  ].map((p) => (
                    <div key={p.num} style={{
                      padding: mobile ? 20 : 28, borderRadius: 16,
                      background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#D4B896", fontWeight: 400 }}>{p.num}</span>
                        <span style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{p.title}</span>
                      </div>
                      <p style={{ fontSize: mobile ? 13 : 14, color: "#3a3a3a", fontWeight: 400, lineHeight: 1.7 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{
            padding: mobile ? "40px 20px" : "60px 56px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{
                display: "flex", flexDirection: mobile ? "column" : "row",
                justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center",
                gap: mobile ? 24 : 0,
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700,
                    letterSpacing: "-0.04em", marginBottom: 8,
                  }}>
                    mobi<span style={{ color: "#D4B896" }}>.</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#333", fontWeight: 400 }}>Design studio &mdash; Est. 2024</p>
                </div>
                <div style={{ display: "flex", gap: 28 }}>
                  {sections.filter(s => s.id === "social").flatMap(s => s.items).map(item => (
                    <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 11, color: "#333", fontWeight: 600, letterSpacing: "0.1em",
                      textTransform: "uppercase", textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                      onMouseOver={e => (e.target as HTMLElement).style.color = "#D4B896"}
                      onMouseOut={e => (e.target as HTMLElement).style.color = "#333"}
                    >{item.name}</a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
