import Button from "../ui/Button";
import React, { useEffect, useRef, useState } from "react";
import FoodDialog from "./FoodDialog";
import { barcodeFromText } from "./barcode";

export default function BarcodeScanner({ onCode, onClose }) {
  const video = useRef(null);
  const callbacks = useRef({ onCode, onClose });
  callbacks.current = { onCode, onClose };
  const [status, setStatus] = useState("Se solicita accesul la camera…");
  useEffect(() => {
    let cancelled = false,
      finished = false,
      stream,
      controls,
      timer,
      notice;
    const stop = () => {
      controls?.stop();
      stream?.getTracks().forEach((track) => track.stop());
      clearTimeout(timer);
      clearTimeout(notice);
    };
    const receive = (text) => {
      if (cancelled || finished) return;
      const code = barcodeFromText(text);
      if (!code) {
        setStatus(
          "Codul citit nu identifica un produs. Scaneaza EAN/UPC sau introdu barcode-ul manual.",
        );
        return;
      }
      finished = true;
      stop();
      callbacks.current.onCode(code);
    };
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            "Camera nu este disponibila. Foloseste HTTPS sau localhost si introdu codul manual.",
          );
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
          },
        });
        if (cancelled) {
          stop();
          return;
        }
        video.current.srcObject = stream;
        await video.current.play();
        if (cancelled) {
          stop();
          return;
        }
        setStatus("Apropie codul de bare de camera si pastreaza-l in cadru.");
        notice = setTimeout(
          () =>
            setStatus(
              "Cod necitit. Imbunatateste lumina sau inchide scanarea si introdu codul manual.",
            ),
          15000,
        );
        let detector;
        if (window.BarcodeDetector) {
          let supported = [];
          try {
            supported = await window.BarcodeDetector.getSupportedFormats();
          } catch {
            /* Unsupported native API: use ZXing. */
          }
          if (
            ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"].every((f) =>
              supported.includes(f),
            )
          ) {
            try {
              detector = new window.BarcodeDetector({
                formats: ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"],
              });
            } catch {
              /* Use ZXing below. */
            }
          }
        }
        if (cancelled) {
          stop();
          return;
        }
        if (detector) {
          const scan = async () => {
            if (cancelled || finished) return;
            try {
              const results = await detector.detect(video.current);
              if (results[0]) receive(results[0].rawValue);
            } catch {
              /* Frames may not yet be ready. Keep the manual alternative visible. */
            }
            if (!cancelled && !finished) timer = setTimeout(scan, 250);
          };
          scan();
        } else {
          const { BrowserMultiFormatReader } = await import("@zxing/browser");
          if (cancelled) {
            stop();
            return;
          }
          controls = await new BrowserMultiFormatReader().decodeFromStream(
            stream,
            video.current,
            (result) => {
              if (result) receive(result.getText());
            },
          );
          if (cancelled || finished) stop();
        }
      } catch (error) {
        stop();
        if (!cancelled)
          setStatus(
            error.name === "NotAllowedError"
              ? "Accesul la camera a fost refuzat. Permite accesul in browser sau introdu codul manual."
              : [
                    "NotFoundError",
                    "NotReadableError",
                    "OverconstrainedError",
                  ].includes(error.name)
                ? "Camera indisponibila sau folosita de alta aplicatie. Introdu codul manual."
                : error.message ||
                  "Scanarea nu este disponibila. Introdu codul manual.",
          );
      }
    }
    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, []);
  return (
    <FoodDialog title="Scaneaza codul produsului" onClose={onClose}>
      <video
        ref={video}
        muted
        playsInline
        className="aspect-video w-full rounded-lg bg-black object-contain"
      />
      <p role="status" className="my-3 text-sm">
        {status}
      </p>
      <Button type="button" onClick={onClose}>
        Introdu codul manual
      </Button>
    </FoodDialog>
  );
}
