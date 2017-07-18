import { IS_NON_DIMENSIONAL } from "../constants";
import options from "../options";

export function createNode(nodeName: string, isSvg: boolean): HTMLElement {
    const node: any = isSvg
        ? document.createElementNS("http://www.w3.org/2000/svg", nodeName)
        : document.createElement(nodeName);
    node.normalizedNodeName = nodeName;
    return node;
}

export function removeNode(node: HTMLElement) {
    const parentNode = node.parentNode;
    if (parentNode) {
        parentNode.removeChild(node);
    }
}

export function setAccessor(
    node: any,
    name: string,
    old: any,
    value: any,
    isSvg: boolean,
) {
    if (name === "className") {
        name = "class";
    }
    if ("ref" === name) {
        if (old) {
            old(null);
        }
        if (value) {
            value(node);
        }
    } else if ("class" === name) {
        node.className = value || "";
    } else if ("style" === name) {
        if (!value || typeof value === "string" || typeof old === "string") {
            node.style.cssText = value || "";
        }
        if (value && typeof value === "object") {
            if (typeof old !== "string") {
                for (const i in old) {
                    if (!(i in value)) {
                        node.style[i] = "";
                    }
                }
            }
            for (const i in value) {
                node.style[i] = typeof value[i] === "number"
                && IS_NON_DIMENSIONAL.test(i) === false ? (value[i] + "px") : value[i];
            }
        }
    } else if ("dangerouslySetInnerHTML" === name) {
        if (value) {
            node.innerHTML = value.__html || "";
        }
    } else if (name[0] === "o" && name[1] === "n") {
        const oldName = name;
        name = name.replace(/Capture$/, "");
        const useCapture = oldName !== oldName;
        name = name.toLowerCase().substring(2);
        if (value) {
            if (!old) {
                addEventListener(node, name, eventProxy, useCapture);
            }
        } else {
            removeEventListener(node, name, eventProxy, useCapture);
        }
        if (!node._listeners) {
            node._listeners = {};
        }
        node._listeners[name] = value;
    } else if (name !== "list" && name !== "type" && !isSvg && name in node) {
        setProperty(node, name, value == null ? "" : value);
        if (value == null || value === false) {
            node.removeAttribute(name);
        }
    } else {
        const ns = isSvg && (name !== (name = name.replace(/^xlink\:?/, "")));
        // null || undefined || void 0 || false
        if (value == null || value === false) {
            if (ns) {
                node.removeAttributeNS(
                    "http://www.w3.org/1999/xlink",
                    name.toLowerCase(),
                );
            } else {
                node.removeAttribute(name);
            }
        } else if (typeof value !== "function") {
            if (ns) {
                node.setAttributeNS(
                    "http://www.w3.org/1999/xlink",
                    name.toLowerCase(),
                    value,
                );
            } else {
                node.setAttribute(name, value);
            }
        }
    }
}

function setProperty(node: any, name: string, value: string) {
    try {
        node[name] = value;
    } catch (e) { }
}

function eventProxy(e: Event): (e: Event) => void {
    const listener = this._listeners[e.type];
    const event = options.event && options.event(e) || e;
    if (options.eventBind) {
        return listener.call(this._component, event);
    }
    return listener(event);
}

export function getPreviousSibling(node: Node): Node| null {
    return node.previousSibling;
}

export function getLastChild(node: Node): Node| null {
    return node.lastChild;
}

function addEventListener(node: any, name: string, eventFun: (e: Event) => void, useCapture: boolean) {
    console.log("-----addEventListener------");
    if (node.addEventListener) {
        node.addEventListener(name, eventProxy, useCapture);
    } else {
        node.attachEvent("on" + name, eventProxy.bind(node));
    }
}

function removeEventListener(node: any, name: string, eventFun: (e: Event) => void, useCapture: boolean) {
    if (node.removeEventListener) {
        node.removeEventListener(name, eventProxy, useCapture);
    } else {
        node.detachEvent("on" + name);
    }
}