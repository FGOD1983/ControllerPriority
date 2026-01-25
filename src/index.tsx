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
import { useState, FC } from "react";
import { FaGamepad } from "react-icons/fa";

const restoreUdevWithPassword = callable<[string], any>("restore_udev_with_password");
const checkStatus = callable<[], boolean>("check_status");

// Modal Component
const PasswordModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!password) return;
    
    closeModal();
    toaster.toast({ title: "Working...", body: "Restoring udev rules" });
    
    try {
      const result = await restoreUdevWithPassword(password);
      toaster.toast({
        title: result.success ? "Success" : "Error",
        body: result.message,
      });
    } catch (e) {
      toaster.toast({ title: "Error", body: "Backend communication failed" });
    }
  };

  // Functie om Enter-toets af te vangen
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <ModalRoot 
      onCancel={closeModal} 
      onAccept={handleSubmit}
      acceptText="Restore"
    >
      <h1 style={{ marginBottom: "10px" }}>Enter Sudo Password</h1>
      <p style={{ marginBottom: "20px" }}>The udev rules will be restored using this password.</p>
      <TextField
        label="Password"
        value={password}
        bIsPassword={true}
        onChange={(e: any) => setPassword(e.target.value)}
        focusOnMount={true}
        // Vervang onOK door een standaard onKeyDown check
        onKeyDown={handleKeyDown}
      />
    </ModalRoot>
  );
};

const Content: FC = () => {
  return (
    <PanelSection title="Controller Priority">
      <PanelSectionRow>
        <ButtonItem 
          layout="below" 
          onClick={() => {
            const modal = showModal(<PasswordModal closeModal={() => modal.Close()} />);
          }}
        >
          Restore Udev Rules
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {
  checkStatus().then((isOk) => {
    if (!isOk) {
      toaster.toast({
        title: "Controller Priority",
        body: "Udev rules missing! Click Restore in the plugin menu.",
        duration: 10000,
      });
    }
  }).catch(() => {});

  return {
    name: "ControllerPriority",
    titleView: <div className={staticClasses.Title}>Controller Priority</div>,
    content: <Content />,
    icon: <FaGamepad />,
  };
});
