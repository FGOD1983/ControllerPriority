const manifest = {"name":"ControllerPriority"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaBluetooth (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M292.6 171.1L249.7 214l-.3-86 43.2 43.1m-43.2 219.8l43.1-43.1-42.9-42.9-.2 86zM416 259.4C416 465 344.1 512 230.9 512S32 465 32 259.4 115.4 0 228.6 0 416 53.9 416 259.4zm-158.5 0l79.4-88.6L211.8 36.5v176.9L138 139.6l-27 26.9 92.7 93-92.7 93 26.9 26.9 73.8-73.8 2.3 170 127.4-127.5-83.9-88.7z"},"child":[]}]})(props);
}function FaGamepad (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"},"child":[]}]})(props);
}function FaToggleOff (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z"},"child":[]}]})(props);
}function FaToggleOn (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"},"child":[]}]})(props);
}

// Backend Callables
const checkBindStatus = callable("check_bind_status");
const toggleController = callable("toggle_controller");
const getExternalControllers = callable("get_external_controllers");
const Content = () => {
    const [isBound, setIsBound] = SP_REACT.useState(true);
    const [externalCtrls, setExternalCtrls] = SP_REACT.useState([]);
    const [isToggling, setIsToggling] = SP_REACT.useState(false);
    const refreshStatus = async () => {
        if (isToggling)
            return;
        try {
            const bStatus = await checkBindStatus();
            const ctrls = await getExternalControllers();
            setIsBound(bStatus);
            setExternalCtrls(ctrls);
        }
        catch (e) {
            console.error("Refresh failed:", e);
        }
    };
    SP_REACT.useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, [isToggling]);
    const handleToggle = async (currentStatus, id) => {
        setIsToggling(true);
        const timer = setTimeout(() => setIsToggling(false), 3000);
        try {
            await toggleController(currentStatus, id);
            await new Promise(resolve => setTimeout(resolve, 800));
            const [newStatus, newCtrls] = await Promise.all([
                checkBindStatus(),
                getExternalControllers()
            ]);
            setIsBound(newStatus);
            setExternalCtrls(newCtrls);
        }
        catch (e) {
            console.error("Toggle failed:", e);
        }
        finally {
            clearTimeout(timer);
            setIsToggling(false);
        }
    };
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSection, { title: "Internal Controller", children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => handleToggle(isBound, "internal"), disabled: isToggling, children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }, children: [isBound ? SP_JSX.jsx(FaToggleOn, { color: "#66ff66" }) : SP_JSX.jsx(FaToggleOff, { color: "#ff4444" }), isToggling ? "Processing..." : (isBound ? "Internal: ACTIVE" : "Internal: HIDDEN")] }) }) }) }), SP_JSX.jsx(DFL.PanelSection, { title: "External Devices", children: externalCtrls.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { opacity: 0.5, textAlign: "center", width: "100%", padding: "10px" }, children: "No external hardware found" }) })) : (externalCtrls.map((ctrl) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { display: "flex", flexDirection: "column", width: "100%", gap: "8px" }, children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [ctrl.type === "Bluetooth" ? SP_JSX.jsx(FaBluetooth, { color: "#3b82f6" }) : SP_JSX.jsx(FaGamepad, { color: "#3b82f6" }), SP_JSX.jsxs("div", { style: { flexGrow: 1 }, children: [SP_JSX.jsx("div", { style: { fontWeight: "bold" }, children: ctrl.name }), SP_JSX.jsxs("div", { style: { fontSize: "0.75em", opacity: 0.6 }, children: [ctrl.type, " Connection (", ctrl.id, ")"] })] })] }) }) }, ctrl.id)))) })] }));
};
var index = definePlugin(() => ({
    name: "ControllerPriority",
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(FaGamepad, {})
}));

export { index as default };
//# sourceMappingURL=index.js.map
