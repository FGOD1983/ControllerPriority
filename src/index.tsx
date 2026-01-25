import { 
  ButtonItem, 
  PanelSection, 
  PanelSectionRow, 
  staticClasses,
  TextField
} from "@decky/ui";
import { definePlugin, callable, toaster } from "@decky/api";
import { useState, FC } from "react";
import { FaGamepad } from "react-icons/fa";

const restoreUdevWithPassword = callable<[string], any>("restore_udev_with_password");
const checkStatus = callable<[], boolean>("check_status");

const Content: FC = () => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRestore = async () => {
    if (!password) return;
    setIsProcessing(true);

    try {
      const result = await restoreUdevWithPassword(password);
      toaster.toast({
        title: result.success ? "Success" : "Error",
        body: result.message,
      });
      if (result.success) setPassword("");
    } catch (e) {
      toaster.toast({ title: "Error", body: "Backend communication failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PanelSection title="Controller Priority">
      <PanelSectionRow>
        <TextField
          label="Sudo Password"
          value={password}
          bIsPassword={true}
          onChange={(e: any) => setPassword(e.target.value)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem 
          layout="below" 
          onClick={handleRestore}
          disabled={isProcessing || !password}
        >
          {isProcessing ? "Processing..." : "Restore Udev Rules"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

// We gebruiken geen argumenten in de functie om 'unused variable' errors te voorkomen
// De popup-check doen we direct bij initialisatie.
export default definePlugin(() => {
  
  // Voer de check uit
  checkStatus().then((isOk) => {
    if (!isOk) {
      toaster.toast({
        title: "Controller Priority",
        body: "Udev rules are missing! Please open the plugin to restore them.",
        duration: 10000,
      });
    }
  }).catch((e) => {
    console.error("Startup check failed:", e);
  });

  return {
    name: "ControllerPriority",
    titleView: <div className={staticClasses.Title}>Controller Priority</div>,
    content: <Content />,
    icon: <FaGamepad />,
  };
});
