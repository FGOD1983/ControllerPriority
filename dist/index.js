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
}function FaLink (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"},"child":[]}]})(props);
}function FaToggleOff (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z"},"child":[]}]})(props);
}function FaToggleOn (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"},"child":[]}]})(props);
}function FaUnlink (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M304.083 405.907c4.686 4.686 4.686 12.284 0 16.971l-44.674 44.674c-59.263 59.262-155.693 59.266-214.961 0-59.264-59.265-59.264-155.696 0-214.96l44.675-44.675c4.686-4.686 12.284-4.686 16.971 0l39.598 39.598c4.686 4.686 4.686 12.284 0 16.971l-44.675 44.674c-28.072 28.073-28.072 73.75 0 101.823 28.072 28.072 73.75 28.073 101.824 0l44.674-44.674c4.686-4.686 12.284-4.686 16.971 0l39.597 39.598zm-56.568-260.216c4.686 4.686 12.284 4.686 16.971 0l44.674-44.674c28.072-28.075 73.75-28.073 101.824 0 28.072 28.073 28.072 73.75 0 101.823l-44.675 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.598 39.598c4.686 4.686 12.284 4.686 16.971 0l44.675-44.675c59.265-59.265 59.265-155.695 0-214.96-59.266-59.264-155.695-59.264-214.961 0l-44.674 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.597 39.598zm234.828 359.28l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941L63.598 7.029c-9.373-9.373-24.569-9.373-33.941 0L7.029 29.657c-9.373 9.373-9.373 24.569 0 33.941l441.373 441.373c9.373 9.372 24.569 9.372 33.941 0z"},"child":[]}]})(props);
}

// Backend calls
const restoreUdevWithPassword = callable("restore_udev_with_password");
const uninstallUdevRule = callable("uninstall_udev_rule");
const checkStatus = callable("check_status");
const checkBindStatus = callable("check_bind_status");
const toggleController = callable("toggle_controller");
const getExternalControllers = callable("get_external_controllers");
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
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && password) {
            handleSubmit();
        }
    };
    return (SP_JSX.jsxs(DFL.ModalRoot, { onCancel: closeModal, onAccept: handleSubmit, acceptText: mode === 'install' ? "Install" : "Remove", bAllowFullSize: false, children: [SP_JSX.jsx("h1", { style: { marginBottom: "10px" }, children: "Sudo Password Required" }), SP_JSX.jsx(DFL.TextField, { label: "Password", value: password, bIsPassword: true, onChange: (e) => setPassword(e.target.value), onKeyDown: handleKeyDown, focusOnMount: true }), SP_JSX.jsx("div", { style: { marginTop: "20px" }, children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleSubmit, disabled: !password, children: "Confirm Password" }) })] }));
};
const Content = () => {
    const [isOk, setIsOk] = SP_REACT.useState(null);
    const [isBound, setIsBound] = SP_REACT.useState(true);
    const [externalCtrls, setExternalCtrls] = SP_REACT.useState([]);
    const [isToggling, setIsToggling] = SP_REACT.useState(null);
    const refreshStatus = async () => {
        try {
            const [uStatus, bStatus, ctrls] = await Promise.all([
                checkStatus(),
                checkBindStatus(),
                getExternalControllers()
            ]);
            setIsOk(uStatus);
            setIsBound(bStatus);
            setExternalCtrls(ctrls);
        }
        catch (e) {
            console.error("Refresh failed", e);
        }
    };
    SP_REACT.useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, []);
    const handleInternalToggle = async () => {
        setIsToggling("internal");
        await toggleController(isBound, "internal");
        await refreshStatus();
        setIsToggling(null);
    };
    const handleExternalToggle = async (id, currentlyBound) => {
        setIsToggling(id);
        const success = await toggleController(currentlyBound, id);
        if (success) {
            setTimeout(async () => {
                await refreshStatus();
                setIsToggling(null);
            }, 1000);
        }
        else {
            setIsToggling(null);
        }
    };
    // Logica voor veiligheid
    const activeExternalCount = externalCtrls.filter(c => c.is_bound).length;
    const canToggleInternal = isOk === true && activeExternalCount > 0;
    // Mag je een externe controller unbinden? 
    // Alleen als: de interne pad aan staat OF er nog een andere externe pad overblijft.
    const canUnbindExternal = (ctrlIsBound) => {
        if (!ctrlIsBound)
            return true; // Opnieuw binden mag altijd
        if (isBound)
            return true; // Interne pad is aan, dus unbinden is veilig
        return activeExternalCount > 1; // Interne pad is uit, dus alleen unbinden als er meer dan 1 is
    };
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { title: "Setup & Safety", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [isOk ? SP_JSX.jsx(FaCheckCircle, { color: "#66ff66" }) : SP_JSX.jsx(FaExclamationTriangle, { color: "#ffcc00" }), SP_JSX.jsx("span", { style: { fontSize: "0.9em" }, children: isOk ? "Safety Active" : "Setup Required" })] }), SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: refreshStatus, children: "Scan" })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => {
                                const modal = DFL.showModal(SP_JSX.jsx(PasswordModal, { mode: isOk ? 'uninstall' : 'install', onRefresh: refreshStatus, closeModal: () => modal.Close() }));
                            }, children: isOk ? "Remove Udev Rules" : "Install Udev Rules" }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "Controller Priority", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleInternalToggle, disabled: (!isBound ? false : !canToggleInternal) || isToggling === "internal", children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }, children: [isBound ? SP_JSX.jsx(FaToggleOn, { color: "#66ff66" }) : SP_JSX.jsx(FaToggleOff, { color: "#ff4444" }), isToggling === "internal" ? "Processing..." : (isBound ? "Internal Pad: ACTIVE" : "Internal Pad: HIDDEN")] }) }) }), !canToggleInternal && isBound && isOk && (SP_JSX.jsx("div", { style: { fontSize: "0.75em", padding: "8px", color: "#ffcc00", textAlign: "center", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "4px" }, children: "Connect an external controller to allow disabling the internal one." }))] }), SP_JSX.jsx(DFL.PanelSection, { title: "External Devices", children: externalCtrls.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { opacity: 0.5, textAlign: "center", width: "100%", fontSize: "0.85em", padding: "10px" }, children: "No USB controllers detected" }) })) : (externalCtrls.map((ctrl) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", width: "100%", padding: "5px 0" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [SP_JSX.jsx("div", { style: {
                                            minWidth: "35px",
                                            height: "35px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                                            borderRadius: "6px"
                                        }, children: SP_JSX.jsx(FaGamepad, { color: ctrl.is_bound ? "#3b82f6" : "#555", size: 20 }) }), SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", overflow: "hidden" }, children: [SP_JSX.jsx("span", { style: { fontSize: "0.95em", fontWeight: "bold", wordBreak: "break-word" }, children: ctrl.name }), SP_JSX.jsxs("span", { style: { fontSize: "0.7em", opacity: 0.5 }, children: ["Port: ", ctrl.id, " \u2022 ", ctrl.is_bound ? "Connected" : "Disabled (Unbound)"] })] })] }), SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => handleExternalToggle(ctrl.id, ctrl.is_bound), disabled: isToggling !== null || !canUnbindExternal(ctrl.is_bound), children: SP_JSX.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }, children: isToggling === ctrl.id ? ("Updating...") : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [ctrl.is_bound ? SP_JSX.jsx(FaUnlink, {}) : SP_JSX.jsx(FaLink, {}), ctrl.is_bound ? "Unbind Controller" : "Bind Controller"] })) }) }), !canUnbindExternal(ctrl.is_bound) && (SP_JSX.jsx("div", { style: { fontSize: "0.7em", color: "#ffcc00", textAlign: "center" }, children: "Cannot unbind: this is your last active controller." }))] }) }, ctrl.id)))) })] }));
};
var index = definePlugin(() => ({
    name: "ControllerPriority",
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(FaGamepad, {}),
}));

export { index as default };
//# sourceMappingURL=index.js.map
