import { useEffect, useState, useRef } from "react";

export default function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [hideBearImgs, setHideBearImgs] = useState<string[]>([]);
  const [watchBearImgs, setWatchBearImgs] = useState<string[]>([]);
  const [values, setValues] = useState({ email: '', password: '' });
  const [currentFocus, setCurrentFocus] = useState<"EMAIL" | "PASSWORD">("EMAIL");
  const [currentBearImg, setCurrentBearImg] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = (glob: Record<string, { default: string }>, setState: (imgs: string[]) => void) => {
      setState(
        Object.values(glob)
          .map((asset) => asset.default)
          .sort((a, b) =>
            (parseInt(a.match(/(\d+)-.*\.png$/)?.[1] || "0") - parseInt(b.match(/(\d+)-.*\.png$/)?.[1] || "0"))
          )
      );
    };

    loadImages(import.meta.glob("./assets/img/watch_bear_*.png", { eager: true }), setWatchBearImgs);
    loadImages(import.meta.glob("./assets/img/hide_bear_*.png", { eager: true }), setHideBearImgs);
  }, []);

  useEffect(() => {
    if (currentFocus === "EMAIL") {
      const index = Math.min(Math.floor(((values.email.length * 8) / 400) * watchBearImgs.length - 1), watchBearImgs.length - 1)
      setCurrentBearImg(watchBearImgs[index])
    } else if (currentFocus === "PASSWORD") {
      hideBearImgs.forEach((img, index) => setTimeout(() => setCurrentBearImg(img), index * 50));
    }
  }, [currentFocus, hideBearImgs, watchBearImgs, values.email.length])


  return (
    <main className="w-[400px] mx-auto min-h-dvh grid place-items-center">
      <form className="w-full flex flex-col items-center gap-4" onSubmit={(e) => {
        e.preventDefault()
        alert("Voilà~")
      }}>
        <img src={currentBearImg ?? watchBearImgs[0]} className="rounded-full" width={130} height={130} tabIndex={-1} />
        <input placeholder="Email" ref={emailRef} autoFocus onFocus={() => setCurrentFocus('EMAIL')} autoComplete="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        <input placeholder="Password" type="password" onFocus={() => setCurrentFocus('PASSWORD')} ref={passwordRef} autoComplete="current-password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
        <button className="py-4 w-full rounded-lg bg-tunnel-bear font-semibold text-lg focus:outline-tunnel-bear outline-offset-2">Log In</button>
      </form>
    </main>
  )
}

