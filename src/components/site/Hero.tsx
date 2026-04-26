import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/** Imagem atual do hero (Unsplash; next.config). */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1682176162491-2e63972a1d9b?q=80&w=1920&h=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
};

export function Hero({ title, subtitle }: Props) {
  return (
    <section className="relative text-white overflow-hidden min-h-screen flex items-center bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Esquadro e compasso sobre livro aberto, símbolos da maçonaria e do trabalho em silêncio"
          fill
          className="object-cover object-center scale-105"
          priority
          quality={88}
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/40 z-[1] particles-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/25 to-slate-950/50 z-[1]" />

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 animate-fade-in-up leading-[1.12] tracking-tight [filter:drop-shadow(0_1px_0_rgba(0,0,0,0.5))_drop-shadow(0_2px_8px_rgba(0,0,0,0.45))_drop-shadow(0_0_1px_rgba(0,0,0,0.6))]"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white from-[28%] via-sky-200 to-blue-600">
              {title}
            </span>
          </h1>
          {subtitle != null && subtitle !== false ? (
            <p
              className="text-lg md:text-xl lg:text-2xl mb-10 text-sky-100/95 font-medium animate-fade-in-up max-w-2xl mx-auto leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
              style={{ animationDelay: "0.4s" }}
            >
              {subtitle}
            </p>
          ) : null}
          <div
            className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              href="/como-ajudar"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform text-lg ring-2 ring-blue-500/50"
            >
              Como ajudar?
            </Link>
            <Link
              href="/sobre"
              className="bg-white/10 backdrop-blur-md border border-white/40 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform text-lg"
            >
              Conheça Nossa História
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full text-white fill-current"
        >
          <path
            d="M0 160L48 144C96 128 192 96 288 90.7C384 85.3 480 106.7 576 122.7C672 138.7 768 149.3 864 144C960 138.7 1056 117.3 1152 106.7C1248 96 1344 96 1392 96L1440 96V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z"
            fillOpacity="0.6"
          />
          <path d="M0 180L48 165.3C96 150.7 192 121.3 288 112C384 102.7 480 113.3 576 128C672 142.7 768 161.3 864 165.3C960 169.3 1056 158.7 1152 144C1248 129.3 1344 110.7 1392 101.3L1440 92V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z" />
        </svg>
      </div>
    </section>
  );
}
