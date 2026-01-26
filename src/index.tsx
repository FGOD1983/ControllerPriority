import { 
  ButtonItem, 
  PanelSection, 
  PanelSectionRow, 
  staticClasses,
  TextField,
  ModalRoot,
  showModal 
} from "@decky/ui";
import { definePlugin, callable, toaster } from "@decky/api";
import { useState, FC, useEffect } from "react";
import { FaGamepad, FaCheckCircle, FaExclamationTriangle, FaToggleOn, FaToggleOff } from "react-icons/fa";

const restoreUdevWithPassword = callable<[string], any>("restore_udev_with_password");
const uninstallUdevRule = callable<[string], any>("uninstall_udev_rule");
const checkStatus = callable<[], boolean>("check_status");
const checkBindStatus = callable<[], boolean>("check_bind_status");
const toggleController = callable<[boolean], boolean>("toggle_controller");

const PasswordModal: FC<{ closeModal: () => void; onRefresh: () => void; mode: 'install' | 'uninstall' }> = ({ closeModal, onRefresh, mode }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!password) return;
    closeModal();
    const action = mode === 'install' ? restoreUdevWithPassword : uninstallUdevRule;
    try {
      const result = await action(password);
      toaster.toast({ title: result.success ? "Success" : "Error", body: result.message });
      onRefresh();
    } catch (e) {
      toaster.toast({ title: "Error", body: "Communication failed" });
    }
  };

  return (
    <ModalRoot onCancel={closeModal} onAccept={handleSubmit} acceptText={mode === 'install' ? "Install" : "Remove"}>
      <h1 style={{ marginBottom: "10px" }}>Sudo Password Required</h1>
      <TextField
        label="Password"
        value={password}
        bIsPassword={true}
        onChange={(e: any) => setPassword(e.target.value)}
        focusOnMount={true}
        onKeyDown={(e: any) => { if (e.key === 'Enter') handleSubmit(); }}
      />
      <div style={{ marginTop: "20px" }}>
        <ButtonItem layout="below" onClick={handleSubmit} disabled={!password}>
          Confirm Password (or press Enter)
        </ButtonItem>
      </div>
    </ModalRoot>
  );
};

const Content: FC = () => {
  const [isOk, setIsOk] = useState<boolean | null>(null);
  const [isBound, setIsBound] = useState<boolean>(true);

  const refreshStatus = async () => {
    try {
      const udevStatus = await checkStatus();
      const bindStatus = await checkBindStatus();
      setIsOk(udevStatus);
      setIsBound(bindStatus);
    } catch (e) {
      console.error("Status check failed", e);
    }
  };

  // Live polling: Check status elke 2 seconden zolang het menu open is
  useEffect(() => {
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

  return (
    <>
      <PanelSection title="System Status">
        <PanelSectionRow>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isOk ? <><FaCheckCircle color="#66ff66" /> <span>Rules Active</span></> : 
                      <><FaExclamationTriangle color="#ffcc00" /> <span>Rules Missing</span></>}
            </div>
            <ButtonItem layout="inline" onClick={refreshStatus}>Refresh</ButtonItem>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => {
              const modal = showModal(<PasswordModal mode={isOk ? 'uninstall' : 'install'} onRefresh={refreshStatus} closeModal={() => modal.Close()} />);
            }}>
            {isOk ? "Uninstall Udev Rules" : "Install Udev Rules"}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Live Control">
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleLiveToggle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              {isBound ? <FaToggleOn color="#66ff66" /> : <FaToggleOff color="#ff4444" />}
              {isBound ? "Internal Controller: ON" : "Internal Controller: OFF"}
            </div>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
}

export default definePlugin(() => ({
  name: "ControllerPriority",
  titleView: <div className={staticClasses.Title}>Controller Priority</div>,
  content: <Content />,
  icon: <FaGamepad />,
}));
