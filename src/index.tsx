import { 
  ButtonItem, 
  PanelSection, 
  PanelSectionRow, 
  TextField,
  ModalRoot,
  showModal 
} from "@decky/ui";
import { definePlugin, callable, toaster } from "@decky/api";
import { useState, FC, useEffect } from "react";
import { FaGamepad, FaCheckCircle, FaExclamationTriangle, FaToggleOn, FaToggleOff, FaLink, FaUnlink } from "react-icons/fa";

// Backend calls
const restoreUdevWithPassword = callable<[string], any>("restore_udev_with_password");
const uninstallUdevRule = callable<[string], any>("uninstall_udev_rule");
const checkStatus = callable<[], boolean>("check_status");
const checkBindStatus = callable<[], boolean>("check_bind_status");
const toggleController = callable<[boolean, string], boolean>("toggle_controller");
const getExternalControllers = callable<[], any[]>("get_external_controllers");

const PasswordModal: FC<{ closeModal: () => void; onRefresh: () => void; mode: 'install' | 'uninstall' }> = ({ closeModal, onRefresh, mode }) => {
  const [password, setPassword] = useState("");
  
  const handleSubmit = async () => {
    if (!password) return;
    closeModal();
    const result = await (mode === 'install' ? restoreUdevWithPassword(password) : uninstallUdevRule(password));
    toaster.toast({ title: result.success ? "Success" : "Error", body: result.message });
    onRefresh();
  };

  return (
    <ModalRoot onCancel={closeModal} onAccept={handleSubmit} acceptText={mode === 'install' ? "Install" : "Remove"}>
      <h1 style={{ marginBottom: "10px" }}>Sudo Password Required</h1>
      <TextField label="Password" value={password} bIsPassword={true} onChange={(e: any) => setPassword(e.target.value)} focusOnMount={true} />
      <div style={{ marginTop: "20px" }}>
        <ButtonItem layout="below" onClick={handleSubmit} disabled={!password}>Confirm Password</ButtonItem>
      </div>
    </ModalRoot>
  );
};

const Content: FC = () => {
  const [isOk, setIsOk] = useState<boolean | null>(null);
  const [isBound, setIsBound] = useState<boolean>(true);
  const [externalCtrls, setExternalCtrls] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState<string | null>(null);

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
    } catch (e) { 
      console.error("Refresh failed", e); 
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInternalToggle = async () => {
    setIsToggling("internal");
    const success = await toggleController(isBound, "internal"); 
    if (success) {
      toaster.toast({ 
        title: "Internal Controller", 
        body: isBound ? "Hidden" : "Restored" 
      });
    }
    await refreshStatus();
    setIsToggling(null);
  };

  const handleExternalToggle = async (id: string, currentlyBound: boolean) => {
    setIsToggling(id);
    // disable = true als hij momenteel bound is
    const success = await toggleController(currentlyBound, id);
    if (success) {
      toaster.toast({ 
        title: "USB Port " + id, 
        body: currentlyBound ? "Unbinding device..." : "Binding device..." 
      });
      // Wacht even op USB re-enumeration
      setTimeout(async () => {
        await refreshStatus();
        setIsToggling(null);
      }, 1000);
    } else {
      setIsToggling(null);
    }
  };

  const hasActiveExternal = externalCtrls.some(c => c.is_bound);
  const canToggleInternal = isOk === true && (hasActiveExternal || !isBound);

  return (
    <>
      <PanelSection title="Setup & Safety">
        <PanelSectionRow>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isOk ? <FaCheckCircle color="#66ff66" /> : <FaExclamationTriangle color="#ffcc00" />}
              <span style={{ fontSize: "0.9em" }}>{isOk ? "Udev Safety Active" : "Setup Required"}</span>
            </div>
            <ButtonItem layout="inline" onClick={refreshStatus}>Scan</ButtonItem>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => {
              const modal = showModal(<PasswordModal mode={isOk ? 'uninstall' : 'install'} onRefresh={refreshStatus} closeModal={() => modal.Close()} />);
            }}>
            {isOk ? "Remove Udev Rules" : "Install Udev Rules"}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Controller Priority">
        <PanelSectionRow>
          <ButtonItem 
            layout="below" 
            onClick={handleInternalToggle}
            disabled={!canToggleInternal || isToggling === "internal"}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              {isBound ? <FaToggleOn color="#66ff66" /> : <FaToggleOff color="#ff4444" />}
              {isToggling === "internal" ? "Processing..." : (isBound ? "Internal Pad: ACTIVE" : "Internal Pad: HIDDEN")}
            </div>
          </ButtonItem>
        </PanelSectionRow>
        {!canToggleInternal && isOk && (
          <div style={{ fontSize: "0.75em", padding: "8px", color: "#ffcc00", textAlign: "center", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
             Connect an external controller to allow disabling the internal one.
          </div>
        )}
      </PanelSection>

      <PanelSection title="Detected External Devices">
        {externalCtrls.length === 0 ? (
          <PanelSectionRow>
            <div style={{ opacity: 0.5, textAlign: "center", width: "100%", fontSize: "0.85em", padding: "10px" }}>
              No external USB controllers found
            </div>
          </PanelSectionRow>
        ) : (
          externalCtrls.map((ctrl) => (
            <PanelSectionRow key={ctrl.id}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", padding: "5px 0" }}>
                
                {/* Naam van de controller boven de knop */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ 
                    minWidth: "35px", 
                    height: "35px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "6px"
                  }}>
                    <FaGamepad color={ctrl.is_bound ? "#3b82f6" : "#555"} size={20} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <span style={{ fontSize: "0.95em", fontWeight: "bold", wordBreak: "break-word" }}>
                      {ctrl.name}
                    </span>
                    <span style={{ fontSize: "0.7em", opacity: 0.5 }}>
                      Port: {ctrl.id} • {ctrl.is_bound ? "Status: Bound" : "Status: Unbound"}
                    </span>
                  </div>
                </div>

                {/* De actieknop eronder */}
                <ButtonItem 
                  layout="below" 
                  onClick={() => handleExternalToggle(ctrl.id, ctrl.is_bound)}
                  disabled={isToggling !== null}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {isToggling === ctrl.id ? (
                      "Updating..."
                    ) : (
                      <>
                        {ctrl.is_bound ? <FaUnlink /> : <FaLink />}
                        {ctrl.is_bound ? "Unbind Controller" : "Bind Controller"}
                      </>
                    )}
                  </div>
                </ButtonItem>
              </div>
            </PanelSectionRow>
          ))
        )}
      </PanelSection>
    </>
  );
}

export default definePlugin(() => {
  return {
    name: "ControllerPriority",
    content: <Content />,
    icon: <FaGamepad />,
    onUnload() {
      console.log("ControllerPriority unloaded");
    }
  };
});
