"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl" style={{ aspectRatio: "16/7" }}>
        <button
          className="relative col-span-2 row-span-2 overflow-hidden"
          onClick={() => { setActiveIndex(0); setOpen(true); }}
        >
          <Image src={images[0]} alt={name} fill sizes="50vw" className="object-cover transition-opacity hover:opacity-90" />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={img}
            className="relative overflow-hidden"
            onClick={() => { setActiveIndex(i + 1); setOpen(true); }}
          >
            <Image src={img} alt={`${name} photo ${i + 2}`} fill sizes="25vw" className="object-cover transition-opacity hover:opacity-90" />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{name} photos</DialogTitle>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image src={images[activeIndex]} alt={name} fill sizes="90vw" className="object-cover" />
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i === activeIndex ? "w-6 bg-white" : "bg-white/40"
                )}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
