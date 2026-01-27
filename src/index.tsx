import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { definePlugin, callable } from "@decky/api";
import { useState, FC, useEffect } from "react";
import { FaGamepad, FaToggleOn, FaToggleOff, FaBluetooth } from "react-icons/fa";

// Backend Callables
const checkBindStatus = callable<[], boolean>("check_bind_status");
const toggleController = callable<[boolean, string], boolean>("toggle_controller");
const getExternalControllers = callable<[], any[]>("get_external_controllers");

const Content: FC = () => {
  const [isBound, setIsBound] = useState<boolean>(true);
  const [externalCtrls, setExternalCtrls] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  const refreshStatus = async () => {
    if (isToggling) return; 
    try {
      const bStatus = await checkBindStatus();
      const ctrls = await getExternalControllers();
      setIsBound(bStatus);
      setExternalCtrls(ctrls);
    } catch (e) { 
      console.error("Refresh failed:", e); 
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, [isToggling]);

  const handleToggle = async (currentStatus: boolean, id: string) => {
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
    } catch (e) {
      console.error("Toggle failed:", e);
    } finally {
      clearTimeout(timer);
      setIsToggling(false);
    }
  };

  return (
    <>
      <PanelSection title="Internal Controller">
        <PanelSectionRow>
          <ButtonItem 
            layout="below" 
            onClick={() => handleToggle(isBound, "internal")}
            disabled={isToggling}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              {isBound ? <FaToggleOn color="#66ff66" /> : <FaToggleOff color="#ff4444" />}
              {isToggling ? "Processing..." : (isBound ? "Internal: ACTIVE" : "Internal: HIDDEN")}
            </div>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="External Devices">
        {externalCtrls.length === 0 ? (
          <PanelSectionRow>
            <div style={{ opacity: 0.5, textAlign: "center", width: "100%", padding: "10px" }}>
              No external hardware found
            </div>
          </PanelSectionRow>
        ) : (
          externalCtrls.map((ctrl) => (
            <PanelSectionRow key={ctrl.id}>
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {ctrl.type === "Bluetooth" ? <FaBluetooth color="#3b82f6" /> : <FaGamepad color="#3b82f6" />}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: "bold" }}>{ctrl.name}</div>
                    <div style={{ fontSize: "0.75em", opacity: 0.6 }}>
                      {ctrl.type} Connection ({ctrl.id})
                    </div>
                  </div>
                </div>
              </div>
            </PanelSectionRow>
          ))
        )}
      </PanelSection>
    </>
  );
}

export default definePlugin(() => ({ 
  name: "ControllerPriority", 
  content: <Content />, 
  icon: <FaGamepad /> 
}));
