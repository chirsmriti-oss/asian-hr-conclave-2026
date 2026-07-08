import { useEffect, useId, useRef, useState } from "react";
import "./invitation-experience.css";

const STORAGE_KEY = "asia-inc-500-invitation-experience-complete";
const ENABLED = import.meta.env.VITE_ENABLE_INVITATION_EXPERIENCE === "true";

function shouldShowExperience() {
  if (!ENABLED || typeof window === "undefined") return ENABLED;
  const params = new URLSearchParams(window.location.search);
  if (params.has("resetInvitation")) {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return !params.has("skipInvitation");
}

function ThreeInvitationBackdrop({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed || !canvas) return;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const group = new THREE.Group();
      scene.add(group);

      const gold = new THREE.Color("#c9a84c");
      const cream = new THREE.Color("#f5f0e8");
      const lineMaterial = new THREE.LineBasicMaterial({
        color: gold,
        transparent: true,
        opacity: 0.22,
      });

      for (let i = 0; i < 9; i += 1) {
        const y = -2.4 + i * 0.62;
        const z = -1.8 - i * 0.08;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-5.8, y, z),
          new THREE.Vector3(-2.2, y + Math.sin(i) * 0.22, z - 0.25),
          new THREE.Vector3(2.4, y - Math.cos(i) * 0.18, z - 0.18),
          new THREE.Vector3(5.8, y + Math.sin(i * 0.7) * 0.18, z),
        ]);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
        const line = new THREE.Line(geometry, lineMaterial.clone());
        line.rotation.z = (i - 4) * 0.012;
        group.add(line);
      }

      const particles = new THREE.BufferGeometry();
      const count = 72;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 2] = -2 - Math.random() * 2;
      }
      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: cream,
        size: 0.015,
        transparent: true,
        opacity: 0.28,
      });
      const points = new THREE.Points(particles, particleMaterial);
      scene.add(points);

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const render = (now: number) => {
        if (disposed) return;
        const time = now * 0.001;
        group.rotation.x = Math.sin(time * 0.22) * 0.025;
        group.rotation.y = Math.sin(time * 0.18) * 0.045;
        points.rotation.z = time * 0.018;
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      };

      resize();
      window.addEventListener("resize", resize, { passive: true });
      frame = window.requestAnimationFrame(render);

      cleanup = () => {
        window.removeEventListener("resize", resize);
        window.cancelAnimationFrame(frame);
        scene.traverse((object) => {
          if ("geometry" in object && object.geometry) object.geometry.dispose();
          if ("material" in object && object.material) {
            const material = object.material;
            if (Array.isArray(material)) material.forEach((item) => item.dispose());
            else material.dispose();
          }
        });
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [active]);

  return <canvas ref={canvasRef} className="invitation-3d" aria-hidden />;
}

export function InvitationExperience() {
  const titleId = useId();
  const previousOverflowRef = useRef("");
  const [visible, setVisible] = useState(ENABLED);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const show = shouldShowExperience();
    setVisible(show);
    if (!show) return;

    const previousOverflow = document.documentElement.style.overflow;
    previousOverflowRef.current = previousOverflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  const restoreScroll = () => {
    document.documentElement.style.overflow = previousOverflowRef.current;
  };

  const enter = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setLeaving(true);
    window.setTimeout(() => {
      restoreScroll();
      setVisible(false);
    }, 560);
  };

  const skip = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    restoreScroll();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      aria-labelledby={titleId}
      className={`invitation-experience ${leaving ? "is-leaving" : ""}`}
      data-invitation-experience
    >
      <ThreeInvitationBackdrop active={!leaving} />
      <button className="invitation-skip" type="button" onClick={skip}>
        Skip Intro
      </button>

      <div className="invitation-shell">
        <div className="invitation-scene">
          <div className="invitation-opening-logo" aria-hidden>
            <img src="/asia-inc-logo.jpeg" alt="" />
          </div>
          <div className="invitation-envelope-stack">
            <div className="invitation-shadow" aria-hidden />
            <div className="invitation-envelope">
              <div className="invitation-envelope-back" aria-hidden />
              <div className="invitation-letter">
                <div className="invitation-letter-inner">
                  <div className="invitation-logo-lockup">
                    <img
                      className="invitation-asia-logo"
                      src="/asia-inc-logo.jpeg"
                      alt="Asia INC 500"
                    />
                    <span aria-hidden>X</span>
                    <img
                      className="invitation-partner-logo"
                      src="/invitation-partner-logo.png"
                      alt="Partner logo"
                    />
                  </div>
                  <div className="invitation-kicker">Private Delegate Invitation</div>
                  <div className="invitation-line" />
                  <h1 id={titleId} className="invitation-letter-title">
                    BY INVITATION ONLY
                  </h1>
                  <p>Asia's Most Exclusive Gathering of Chief Human Resources Officers</p>
                  <div className="invitation-date">20 August 2026</div>
                  <button className="invitation-enter" type="button" onClick={enter}>
                    Enter Experience
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
              <div className="invitation-flap invitation-flap-left" aria-hidden />
              <div className="invitation-flap invitation-flap-right" aria-hidden />
              <div className="invitation-flap invitation-flap-top" aria-hidden />
              <div className="invitation-seal" aria-hidden>
                <span>500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
