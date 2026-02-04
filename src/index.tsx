import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { definePlugin, call, toaster } from "@decky/api";
import { useState, FC, useEffect } from "react";
import { FaGamepad, FaToggleOn, FaToggleOff, FaLink, FaUnlink, FaBluetooth, FaLifeRing } from "react-icons/fa";

// Types for backend calls
type Controller = { id: string; name: string; type: string; is_bound: boolean };
type UpdateInfo = { version: string; show_toast: boolean };

const Content: FC = () => {
  const [isBound, setIsBound] = useState<boolean>(true);
  const [externalCtrls, setExternalCtrls] = useState<Controller[]>([]);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [updateVersion, setUpdateVersion] = useState<string>("");

  const refreshStatus = async () => {
    try {
      // V3 API: call returns result directly
      const bStatus = await call<[], boolean>("check_bind_status");
      const ctrls = await call<[], Controller[]>("get_external_controllers");
      const updateData = await call<[], UpdateInfo>("get_update_info");

      setIsBound(bStatus);
      setExternalCtrls(ctrls);
      if (updateData?.version) setUpdateVersion(updateData.version);
    } catch (e) {
      console.error("ControllerPriority UI Error:", e);
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (currentStatus: boolean, id: string) => {
    setIsToggling(true);
    try {
      await call("toggle_controller", currentStatus, id);
      await new Promise((resolve) => setTimeout(resolve, 800));
      await refreshStatus();
    } finally {
      setIsToggling(false);
    }
  };

  const activeExternalCount = externalCtrls.filter(c => c.is_bound).length;
  const internalDisabled = isToggling || (isBound && activeExternalCount === 0);

  return (
    <>
      <PanelSection title="Internal Controller">
        {updateVersion && (
           <PanelSectionRow>
             <div style={{ color: "#66ff66", textAlign: "center", fontSize: "0.85em", padding: "5px", border: "1px solid #66ff6633", borderRadius: "4px", fontWeight: "bold" }}>
               Update v{updateVersion} available!
             </div>
           </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => handleToggle(isBound, "internal")}
            disabled={internalDisabled}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: internalDisabled ? 0.5 : 1 }}>
              {isBound ? <FaToggleOn color="#66ff66" /> : <FaToggleOff color="#ff4444" />}
              {isToggling ? "Processing..." : (isBound ? "Internal: ACTIVE" : "Internal: HIDDEN")}
            </div>
          </ButtonItem>
        </PanelSectionRow>

        {!isBound && activeExternalCount === 0 && (
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={() => handleToggle(false, "internal")}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "#facc15" }}>
                <FaLifeRing /> Emergency Reset
              </div>
            </ButtonItem>
          </PanelSectionRow>
        )}
      </PanelSection>

      <PanelSection title="External Devices">
        {externalCtrls.length === 0 ? (
          <PanelSectionRow>
            <div style={{ opacity: 0.5, textAlign: "center", width: "100%", padding: "10px" }}>No controllers remembered</div>
          </PanelSectionRow>
        ) : (
          externalCtrls.map((ctrl) => (
            <PanelSectionRow key={ctrl.id}>
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "8px", padding: "4px 0", opacity: !ctrl.is_bound ? 0.6 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {ctrl.type === "Bluetooth" ? <FaBluetooth color={!ctrl.is_bound ? "#555" : "#3b82f6"} /> : <FaGamepad color={!ctrl.is_bound ? "#555" : "#3b82f6"} />}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: "bold" }}>{ctrl.name}</div>
                    <div style={{ fontSize: "0.8em", opacity: 0.7 }}>{!ctrl.is_bound ? "Offline" : `Active ${ctrl.type}`}</div>
                  </div>
                </div>
                <ButtonItem layout="below" onClick={() => handleToggle(ctrl.is_bound, ctrl.id)} disabled={isToggling || (ctrl.is_bound && !isBound && activeExternalCount <= 1)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    {ctrl.is_bound ? <FaUnlink color="#ff4444" /> : <FaLink color="#66ff66" />}
                    {ctrl.is_bound ? "Disconnect" : "Reconnect"}
                  </div>
                </ButtonItem>
              </div>
            </PanelSectionRow>
          ))
        )}
      </PanelSection>
    </>
  );
};

export default definePlugin(() => {
  const backgroundInterval = setInterval(async () => {
    try {
      const updateData = await call<[], UpdateInfo>("get_update_info");
      
      if (updateData?.show_toast) {
        toaster.toast({
          title: "Controller Priority",
          body: `Update v${updateData.version} available!`,
          duration: 10000,
        });
        
        await call("reset_update_toast");
      }
    } catch (e) {
      // Background silent error
    }
  }, 10000);

  return {
    name: "ControllerPriority",
    content: <Content />,
    icon: <FaGamepad />,
    onDismount: () => {
      clearInterval(backgroundInterval);
    }
  };
});
