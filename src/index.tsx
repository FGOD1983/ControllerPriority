import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { definePlugin, callable } from "@decky/api";
import { useState, FC, useEffect } from "react";
import { FaGamepad, FaToggleOn, FaToggleOff, FaLink, FaUnlink, FaBluetooth } from "react-icons/fa";

const checkBindStatus = callable<[], boolean>("check_bind_status");
const toggleController = callable<[boolean, string], boolean>("toggle_controller");
const getExternalControllers = callable<[], any[]>("get_external_controllers");

const Content: FC = () => {
  const [isBound, setIsBound] = useState<boolean>(true);
  const [externalCtrls, setExternalCtrls] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState<boolean>(false);

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
    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (currentStatus: boolean, id: string) => {
    setIsToggling(true);
    try {
      await toggleController(currentStatus, id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refreshStatus();
    } finally {
      setIsToggling(false);
    }
  };

  // --- SAFEGUARD LOGICA ---
  const activeExternalCount = externalCtrls.filter(c => c.is_bound).length;
  
  // Interne knop disabled als er geen externe actieve controllers zijn
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
              {isToggling ? "Wait..." : (isBound ? "Internal: ACTIVE" : "Internal: HIDDEN")}
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
          externalCtrls.map((ctrl) => {
            // SAFEGUARD: Disable disconnect als intern UIT staat en dit de laatste externe is
            const isLastController = !isBound && activeExternalCount <= 1;
            const externalDisabled = isToggling || (ctrl.is_bound && isLastController);

            return (
              <PanelSectionRow key={ctrl.id}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {ctrl.type === "Bluetooth" ? <FaBluetooth color="#3b82f6" /> : <FaGamepad color="#3b82f6" />}
                    <div style={{ fontWeight: "bold", flexGrow: 1 }}>{ctrl.name}</div>
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
                      gap: "10px",
                      opacity: externalDisabled ? 0.5 : 1
                    }}>
                      {ctrl.is_bound ? <FaUnlink color="#ff4444" /> : <FaLink color="#66ff66" />}
                      {ctrl.is_bound ? "Disconnect" : "Connect"}
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
