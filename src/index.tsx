import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { definePlugin, callable } from "@decky/api";
import { useState, FC, useEffect, useRef } from "react";
import { FaGamepad, FaToggleOn, FaToggleOff, FaLink, FaUnlink, FaBluetooth, FaLifeRing } from "react-icons/fa";

const checkBindStatus = callable<[], boolean>("check_bind_status");
const toggleController = callable<[boolean, string], boolean>("toggle_controller");
const getExternalControllers = callable<[], any[]>("get_external_controllers");
const getUpdateInfo = callable<[], string | null>("get_update_info");

const Content: FC = () => {
  const [isBound, setIsBound] = useState<boolean>(true);
  const [externalCtrls, setExternalCtrls] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const hasCheckedUpdate = useRef(false);

  const refreshStatus = async () => {
    try {
      const bStatus = await checkBindStatus();
      const ctrls = await getExternalControllers();
      setIsBound(bStatus);
      setExternalCtrls(ctrls);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshStatus();

    // Achtergrond update check (Toast)
    if (!hasCheckedUpdate.current) {
      hasCheckedUpdate.current = true;
      getUpdateInfo().then((newVersion) => {
        if (newVersion) {
          // We gebruiken de Toaster via de globale SteamClient als serverApi niet beschikbaar is
          // Of we gebruiken een simpele notificatie binnen de UI
          console.log("ControllerPriority: New version available v" + newVersion);
          // @ts-ignore
          if (window.SteamClient?.Toaster) {
             // @ts-ignore
            window.SteamClient.Toaster.Toast({
              title: "Controller Priority",
              body: `Update available: v${newVersion}`,
              duration: 10
            });
          }
        }
      }).catch(e => console.error("Update check error:", e));
    }

    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (currentStatus: boolean, id: string) => {
    setIsToggling(true);
    try {
      await toggleController(currentStatus, id);
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
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => handleToggle(isBound, "internal")}
            disabled={internalDisabled}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px",
              opacity: internalDisabled ? 0.5 : 1 
            }}>
              {isBound ? <FaToggleOn color="#66ff66" /> : <FaToggleOff color="#ff4444" />}
              {isToggling ? "Processing..." : (isBound ? "Internal: ACTIVE" : "Internal: HIDDEN")}
            </div>
          </ButtonItem>
        </PanelSectionRow>

        {!isBound && activeExternalCount === 0 && (
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={() => handleToggle(false, "internal")}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "#facc15" }}>
                <FaLifeRing /> Emergency Reset Controls
              </div>
            </ButtonItem>
          </PanelSectionRow>
        )}
      </PanelSection>

      <PanelSection title="External Devices">
        {externalCtrls.length === 0 ? (
          <PanelSectionRow>
            <div style={{ opacity: 0.5, textAlign: "center", width: "100%", padding: "10px" }}>
              No controllers remembered
            </div>
          </PanelSectionRow>
        ) : (
          externalCtrls.map((ctrl) => {
            const isLastController = !isBound && activeExternalCount <= 1;
            const externalDisabled = isToggling || (ctrl.is_bound && isLastController);
            const isOffline = !ctrl.is_bound;

            return (
              <PanelSectionRow key={ctrl.id}>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  width: "100%", 
                  gap: "8px",
                  padding: "4px 0",
                  opacity: isOffline ? 0.6 : 1
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {ctrl.type === "Bluetooth" ? 
                      <FaBluetooth color={isOffline ? "#555" : "#3b82f6"} /> : 
                      <FaGamepad color={isOffline ? "#555" : "#3b82f6"} />
                    }
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: "bold" }}>{ctrl.name}</div>
                      <div style={{ fontSize: "0.8em", opacity: 0.7 }}>
                        {isOffline ? "Offline / Disconnected" : `Active ${ctrl.type}`}
                      </div>
                    </div>
                  </div>
                  
                  <ButtonItem
                    layout="below"
                    onClick={() => handleToggle(ctrl.is_bound, ctrl.id)}
                    disabled={externalDisabled}
                  >
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "10px"
                    }}>
                      {ctrl.is_bound ? <FaUnlink color="#ff4444" /> : <FaLink color="#66ff66" />}
                      {ctrl.is_bound ? "Disconnect" : "Reconnect"}
                    </div>
                  </ButtonItem>
                </div>
              </PanelSectionRow>
            );
          })
        )}
      </PanelSection>
    </>
  );
};

export default definePlugin(() => ({
  name: "ControllerPriority",
  content: <Content />,
  icon: <FaGamepad />
}));
