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
import { FaGamepad, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const restoreUdevWithPassword = callable<[string], any>("restore_udev_with_password");
const checkStatus = callable<[], boolean>("check_status");

const PasswordModal: FC<{ closeModal: () => void; onRefresh: () => void }> = ({ closeModal, onRefresh }) => {
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
      onRefresh(); // Ververs de status in het hoofdmenu
    } catch (e) {
      toaster.toast({ title: "Error", body: "Backend communication failed" });
    }
  };

  return (
    <ModalRoot onCancel={closeModal} onAccept={handleSubmit} acceptText="Restore">
      <h1 style={{ marginBottom: "10px" }}>Enter Sudo Password</h1>
      <TextField
        label="Password"
        value={password}
        bIsPassword={true}
        onChange={(e: any) => setPassword(e.target.value)}
        focusOnMount={true}
        onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSubmit()}
      />
    </ModalRoot>
  );
};

const Content: FC = () => {
  const [isOk, setIsOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const status = await checkStatus();
      setIsOk(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Check de status zodra de plugin wordt geopend
  useEffect(() => {
    refreshStatus();
  }, []);

  return (
    <PanelSection title="System Status">
      <PanelSectionRow>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isOk === null ? (
              <span>Checking...</span>
            ) : isOk ? (
              <>
                <FaCheckCircle color="#66ff66" />
                <span style={{ color: "#66ff66" }}>Status: Active</span>
              </>
            ) : (
              <>
                <FaExclamationTriangle color="#ffcc00" />
                <span style={{ color: "#ffcc00" }}>Status: Missing</span>
              </>
            )}
          </div>
          <ButtonItem layout="inline" onClick={refreshStatus} disabled={loading}>
            {loading ? "..." : "Check"}
          </ButtonItem>
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem 
          layout="below" 
          disabled={isOk === true} // Optioneel: disable knop als alles al goed staat
          onClick={() => {
            const modal = showModal(<PasswordModal onRefresh={refreshStatus} closeModal={() => modal.Close()} />);
          }}
        >
          {isOk ? "Reinstall Rules" : "Restore Udev Rules"}
        </ButtonItem>
      </PanelSectionRow>

      {!isOk && isOk !== null && (
        <PanelSectionRow>
          <div style={{ fontSize: "0.8em", color: "#ccc", fontStyle: "italic" }}>
            The udev rules are required to give external controllers priority.
          </div>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
}

export default definePlugin(() => {
  // De opstart-toast laten we staan als extra waarschuwing
  checkStatus().then((ok) => {
    if (!ok) {
      toaster.toast({
        title: "Controller Priority",
        body: "Udev rules missing!",
        duration: 5000,
      });
    }
  });

  return {
    name: "ControllerPriority",
    titleView: <div className={staticClasses.Title}>Controller Priority</div>,
    content: <Content />,
    icon: <FaGamepad />,
  };
});
