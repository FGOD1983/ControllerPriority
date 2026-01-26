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
const toaster = api.toaster;
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
function FaCheckCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"},"child":[]}]})(props);
}function FaExclamationTriangle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"},"child":[]}]})(props);
}function FaGamepad (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"},"child":[]}]})(props);
}function FaToggleOff (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z"},"child":[]}]})(props);
}function FaToggleOn (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"},"child":[]}]})(props);
}

const restoreUdevWithPassword = callable("restore_udev_with_password");
const uninstallUdevRule = callable("uninstall_udev_rule");
const checkStatus = callable("check_status");
const checkBindStatus = callable("check_bind_status");
const toggleController = callable("toggle_controller");
const PasswordModal = ({ closeModal, onRefresh, mode }) => {
    const [password, setPassword] = SP_REACT.useState("");
    const handleSubmit = async () => {
        if (!password)
            return;
        closeModal();
        const action = mode === 'install' ? restoreUdevWithPassword : uninstallUdevRule;
        try {
            const result = await action(password);
            toaster.toast({ title: result.success ? "Success" : "Error", body: result.message });
            onRefresh();
        }
        catch (e) {
            toaster.toast({ title: "Error", body: "Communication failed" });
        }
    };
    return (SP_JSX.jsxs(DFL.ModalRoot, { onCancel: closeModal, onAccept: handleSubmit, acceptText: mode === 'install' ? "Install" : "Remove", children: [SP_JSX.jsx("h1", { style: { marginBottom: "10px" }, children: "Sudo Password Required" }), SP_JSX.jsx(DFL.TextField, { label: "Password", value: password, bIsPassword: true, onChange: (e) => setPassword(e.target.value), focusOnMount: true, onKeyDown: (e) => { if (e.key === 'Enter')
                    handleSubmit(); } }), SP_JSX.jsx("div", { style: { marginTop: "20px" }, children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleSubmit, disabled: !password, children: "Confirm Password (or press Enter)" }) })] }));
};
const Content = () => {
    const [isOk, setIsOk] = SP_REACT.useState(null);
    const [isBound, setIsBound] = SP_REACT.useState(true);
    const refreshStatus = async () => {
        try {
            const udevStatus = await checkStatus();
            const bindStatus = await checkBindStatus();
            setIsOk(udevStatus);
            setIsBound(bindStatus);
        }
        catch (e) {
            console.error("Status check failed", e);
        }
    };
    // Live polling: Check status elke 2 seconden zolang het menu open is
    SP_REACT.useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, []);
    const handleLiveToggle = async () => {
        const success = await toggleController(isBound);
        if (success) {
            setIsBound(!isBound);
            toaster.toast({ title: "Controller", body: isBound ? "Deactivated" : "Activated" });
        }
    };
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { title: "System Status", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [SP_JSX.jsx("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: isOk ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(FaCheckCircle, { color: "#66ff66" }), " ", SP_JSX.jsx("span", { children: "Rules Active" })] }) :
                                        SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(FaExclamationTriangle, { color: "#ffcc00" }), " ", SP_JSX.jsx("span", { children: "Rules Missing" })] }) }), SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: refreshStatus, children: "Refresh" })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => {
                                const modal = DFL.showModal(SP_JSX.jsx(PasswordModal, { mode: isOk ? 'uninstall' : 'install', onRefresh: refreshStatus, closeModal: () => modal.Close() }));
                            }, children: isOk ? "Uninstall Udev Rules" : "Install Udev Rules" }) })] }), SP_JSX.jsx(DFL.PanelSection, { title: "Live Control", children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleLiveToggle, children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }, children: [isBound ? SP_JSX.jsx(FaToggleOn, { color: "#66ff66" }) : SP_JSX.jsx(FaToggleOff, { color: "#ff4444" }), isBound ? "Internal Controller: ON" : "Internal Controller: OFF"] }) }) }) })] }));
};
var index = definePlugin(() => ({
    name: "ControllerPriority",
    titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Controller Priority" }),
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(FaGamepad, {}),
}));

export { index as default };
//# sourceMappingURL=index.js.map
