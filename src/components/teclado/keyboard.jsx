import React, { useEffect, useMemo, useRef, useState } from "react";

const useSetState = (initial = []) => {
    const [set, setSet] = useState(() => new Set(initial));
    const add = (item) => setSet((prev) => new Set(prev).add(item));
    const remove = (item) =>
        setSet((prev) => {
            const next = new Set(prev);
            next.delete(item);
            return next;
        });
    const has = (item) => set.has(item);
    return { add, remove, has };
};

const useSound = (url) => {
    const sound = useRef(null);
    useEffect(() => {
        sound.current = new Audio(url);
    }, [url]);
    return {
        play: () => {
            if (!sound.current) return;
            try {
                sound.current.currentTime = 0;
                sound.current.play();
            } catch { }
        },
    };
};

const L = {
    Escape: "Esc",
    Backspace: "⌫",
    Tab: "Tab",
    CapsLock: "Caps",
    Enter: "Enter",
    ShiftLeft: "Shift",
    ShiftRight: "Shift",
    ControlLeft: "Ctrl",
    ControlRight: "Ctrl",
    AltLeft: "Alt",
    AltRight: "AltGr",
    MetaLeft: "Win",
    MetaRight: "Win",
    ContextMenu: "Menu",
    Space: "␣",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    PrintScreen: "Prt",
    ScrollLock: "Scr",
    Pause: "Pau",
    Insert: "Ins",
    Delete: "Del",
    Home: "Home",
    End: "End",
    PageUp: "PgUp",
    PageDown: "PgDn",
    NumLock: "Num",
    NumpadDivide: "÷",
    NumpadMultiply: "×",
    NumpadSubtract: "−",
    NumpadAdd: "+",
    NumpadEnter: "⏎",
    NumpadDecimal: ".",
};

const Key = ({ label, code, u = 1, orange = false, small = false, active }) => {
    const cls = ["key", orange && "orange", small && "small", active && "active"]
        .filter(Boolean)
        .join(" ");
    return (
        <div className={cls} style={{ ["--u"]: u }} data-code={code}>
            <div className="top" />
            <div className="char">{label}</div>
        </div>
    );
};

const Row = ({ children }) => <div className="row">{children}</div>;
const Block = ({ children }) => <div className="block">{children}</div>;

export default function Keyboard() {
    const { add, remove, has } = useSetState([]);
    const { play } = useSound("/sounds/keytype.mp3"); // pon el mp3 en /public/sounds/

    const layout = useMemo(() => {
        const K = (code, u = 1, opt = {}) => ({
            code,
            u,
            label: opt.label ?? L[code] ?? code,
            orange: !!opt.orange,
            small: !!opt.small,
        });

        const KeyCode = (code, u = 1, opt = {}) => {
            let label = opt.label;
            if (!label) {
                if (code.startsWith("Key")) label = code.replace("Key", "");
                else if (code.startsWith("Digit")) label = code.replace("Digit", "");
            }
            return K(code, u, { ...opt, label });
        };

        const F = (n) => K(`F${n}`, 1, { small: true });

        const main = [
            [K("Escape", 1, { small: true }), F(1), F(2), F(3), F(4), F(5), F(6), F(7), F(8), F(9), F(10), F(11), F(12)],
            [K("Backquote", 1, { label: "`" }), KeyCode("Digit1"), KeyCode("Digit2"), KeyCode("Digit3"), KeyCode("Digit4"), KeyCode("Digit5"), KeyCode("Digit6"), KeyCode("Digit7"), KeyCode("Digit8"), KeyCode("Digit9"), KeyCode("Digit0"), K("Minus", 1, { label: "-" }), K("Equal", 1, { label: "=" }), K("Backspace", 2, { small: true })],
            [K("Tab", 1.5, { small: true }), KeyCode("KeyQ"), KeyCode("KeyW"), KeyCode("KeyE"), KeyCode("KeyR"), KeyCode("KeyT"), KeyCode("KeyY"), KeyCode("KeyU"), KeyCode("KeyI"), KeyCode("KeyO"), KeyCode("KeyP"), K("BracketLeft", 1, { label: "[" }), K("BracketRight", 1, { label: "]" }), K("Backslash", 1.5, { label: "\\", small: true })],
            [K("CapsLock", 1.75, { small: true }), KeyCode("KeyA"), KeyCode("KeyS"), KeyCode("KeyD"), KeyCode("KeyF"), KeyCode("KeyG"), KeyCode("KeyH"), KeyCode("KeyJ"), KeyCode("KeyK"), KeyCode("KeyL"), K("Semicolon", 1, { label: ";" }), K("Quote", 1, { label: "'" }), K("Enter", 2.25, { small: true })],
            [K("ShiftLeft", 2.25, { small: true }), KeyCode("KeyZ"), KeyCode("KeyX"), KeyCode("KeyC"), KeyCode("KeyV"), KeyCode("KeyB"), KeyCode("KeyN"), KeyCode("KeyM"), K("Comma", 1, { label: "," }), K("Period", 1, { label: "." }), K("Slash", 1, { label: "/" }), K("ShiftRight", 2.75, { small: true })],
            [K("ControlLeft", 1.25, { small: true }), K("MetaLeft", 1.25, { small: true }), K("AltLeft", 1.25, { small: true }), K("Space", 6.25), K("AltRight", 1.25, { small: true }), K("MetaRight", 1.25, { small: true }), K("ContextMenu", 1.25, { small: true }), K("ControlRight", 1.25, { small: true })],
        ];

        return { main };
    }, []);

    useEffect(() => {
        const down = (e) => {
            add(e.code);
            if (!e.repeat) play();
        };
        const up = (e) => remove(e.code);

        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, [add, remove, play]);

    return (
        <div className="keyboard">
            <Block>
                {layout.main.map((row, i) => (
                    <Row key={i}>
                        {row.map((k, j) => (
                            <Key
                                key={`${k.code}-${j}`}
                                label={k.label}
                                code={k.code}
                                u={k.u}
                                orange={k.orange}
                                small={k.small}
                                active={has(k.code)}
                            />
                        ))}
                    </Row>
                ))}
            </Block>
        </div>
    );
}
