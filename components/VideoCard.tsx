"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface VideoCardProps {
    id: string
    title: string
    description?: string
    isShort?: boolean
}

export default function VideoCard({ id, title, description, isShort = false }: VideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const thumbnailUrl = isShort
        ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` // Shorts often lack maxres
        : `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

    // SEO Schema
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title,
        "description": description || title,
        "thumbnailUrl": [thumbnailUrl],
        "uploadDate": "2024-01-01T00:00:00Z", // Fixed date for SEO schema to prevent hydration mismatch
        "embedUrl": `https://www.youtube.com/embed/${id}`,
    }

    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl transition-all hover:border-primary/50 hover:shadow-primary/20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
            />

            {/* Header (Title) */}
            <div className="absolute top-0 z-20 w-full bg-gradient-to-b from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <h3 className="line-clamp-2 text-sm font-medium text-white shadow-black drop-shadow-md">
                    {title}
                </h3>
            </div>

            {/* Video Area */}
            <div className={`relative w-full ${isShort ? 'aspect-[9/16] max-w-[250px] mx-auto' : 'aspect-video'}`}>
                {!isPlaying ? (
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="group/btn relative h-full w-full cursor-pointer focus:outline-none"
                        aria-label={`Reproducir video: ${title}`}
                    >
                        <Image
                            src={thumbnailUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/btn:bg-black/40">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover/btn:scale-110">
                                <Play className="ml-1 h-8 w-8 fill-current" />
                            </div>
                        </div>
                    </button>
                ) : (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                    />
                )}
            </div>

            {/* Footer Details */}
            {description && !isPlaying && (
                <div className="border-t border-white/5 bg-background/5 p-4 backdrop-blur-sm">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
                </div>
            )}
        </div>
    )
}
