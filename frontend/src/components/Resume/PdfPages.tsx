import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Renders the PDF ourselves instead of relying on the browser's built-in viewer: the native
// <object> viewer looked different in every browser and doesn't exist at all on most phones.
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const MAX_PAGE_WIDTH = 820;
const SAFE_LINK = /^(https?:|mailto:|tel:)/i;

export type PdfStatus = 'loading' | 'ready' | 'error';

interface PageLink {
  url: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

const PdfPage = ({ doc, pageNumber, width, label }: { doc: PDFDocumentProxy; pageNumber: number; width: number; label: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [links, setLinks] = useState<PageLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    let renderTask: RenderTask | null = null;

    (async () => {
      const page = await doc.getPage(pageNumber);
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;

      const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
      // Render above the device pixel ratio (capped) so small CV text stays crisp
      const ratio = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      setSize({ width: viewport.width, height: viewport.height });

      renderTask = page.render({ canvas, viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
      await renderTask.promise;

      // A canvas has no links: put clickable areas over the CV's email / LinkedIn / GitHub links
      const annotations = await page.getAnnotations();
      if (cancelled) return;
      setLinks(
        annotations
          .filter((a) => a.subtype === 'Link' && typeof a.url === 'string' && SAFE_LINK.test(a.url))
          .map((a) => {
            const [x1, y1] = viewport.convertToViewportPoint(a.rect[0], a.rect[1]);
            const [x2, y2] = viewport.convertToViewportPoint(a.rect[2], a.rect[3]);
            return {
              url: a.url,
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1),
              height: Math.abs(y2 - y1),
            };
          }),
      );
    })().catch(() => {
      // Cancelled by a resize / language switch — the next effect run renders again
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [doc, pageNumber, width]);

  return (
    <div
      className="relative mx-auto bg-white rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.08),0_12px_32px_-8px_rgba(0,0,0,0.18)]"
      style={size ? { width: size.width, height: size.height } : { width, aspectRatio: '1 / 1.414' }}
    >
      <canvas ref={canvasRef} role="img" aria-label={label} className="block w-full h-full rounded-sm" />
      {links.map((link) => (
        <a
          key={`${link.url}-${link.left}-${link.top}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.url.replace(/^mailto:/i, '')}
          className="absolute rounded-sm hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
          style={{ left: link.left, top: link.top, width: link.width, height: link.height }}
        />
      ))}
    </div>
  );
};

export const PdfPages = ({
  url,
  pageLabel,
  onStatusChange,
}: {
  url: string;
  pageLabel: (n: number) => string;
  onStatusChange?: (status: PdfStatus) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<PdfStatus>('loading');

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Re-render pages at the column width (whole pixels, so tiny layout jitters don't re-render)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.min(Math.floor(entry.contentRect.width), MAX_PAGE_WIDTH));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setStatus('loading');
    setDoc(null);
    const task = pdfjs.getDocument({ url });
    task.promise.then(
      (loaded) => {
        setDoc(loaded);
        setStatus('ready');
      },
      () => setStatus('error'),
    );
    return () => {
      task.destroy();
    };
  }, [url]);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-6">
      {status === 'loading' && width > 0 && (
        <div
          className="mx-auto bg-white/70 dark:bg-white/10 rounded-sm animate-pulse"
          style={{ width, aspectRatio: '1 / 1.414' }}
        />
      )}
      {doc &&
        width > 0 &&
        Array.from({ length: doc.numPages }, (_, i) => (
          <PdfPage key={i} doc={doc} pageNumber={i + 1} width={width} label={pageLabel(i + 1)} />
        ))}
    </div>
  );
};
