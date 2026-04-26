import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  title: ReactNode;
  description: ReactNode;
  image?: string;
  link?: string;
};

const PLACEHOLDER =
  "https://via.placeholder.com/400x300/E5E7EB/6B7280?text=Imagem";

export function Card({ title, description, image = PLACEHOLDER, link }: Props) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover-lift group cursor-pointer transition-all duration-300">
      <div className="w-full h-56 bg-gray-200 overflow-hidden relative">
        <img
          src={image}
          alt={typeof title === "string" ? title : "Projeto"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 transition-all duration-300">
          {typeof title === "string" || typeof title === "number" ? (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400">
              {title}
            </span>
          ) : (
            title
          )}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        {link ? (
          <Link
            href={link}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-all duration-300 inline-flex items-center group/link"
          >
            Saiba mais
            <svg
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/link:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
