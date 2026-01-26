import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { definePlugin, callable } from "@decky/api";
import { useState, FC, useEffect, useRef } from "react";
import { FaGamepad, FaToggleOn, FaToggleOff, FaLink, FaUnlink } from "react-icons/fa";

const checkBindStatus = callable<[], boolean>("check_bind_status");
const toggleController = callable<[boolean, string], boolean>("toggle_controller");
const getExternalControllers = callable<[], any[]>("get_external_controllers");

const Content: FC = () => {
  const [isBound, setIsBound] = useState<boolean>(true);
  const [externalCtrls, setExternalCtrls] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const lastCountRef = useRef<number | null>(null);

  const handleInternalToggle = async (currentStatus: boolean) => {
    setIsToggling("internal");
    await toggleController(currentStatus, "internal"); 
    setIsToggling(null);
    await refreshStatus();
  };

  const refreshStatus = async () => {
    if (isToggling !== null) return;
    try {
      const [bStatus, ctrls] = await Promise.all([checkBindStatus(), getExternalControllers()]);
      setIsBound(bStatus);
      setExternalCtrls(ctrls);

      const currentCount = ctrls.filter(c => c.is_bound).length;
      if (lastCountRef.current !== null) {
        if (lastCountRef.current === 0 && currentCount === 1 && bStatus) {
          handleInternalToggle(true); // 0 -> 1: Intern UIT
        } else if (lastCountRef.current > 0 && currentCount === 0 && !bStatus) {
          handleInternalToggle(false); // x -> 0: Intern AAN
        }
      }
      lastCountRef.current = currentCount;
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 2000);
    return () => clearInterval(interval);
  }, [isBound, isToggling]);

  const activeExternalCount = externalCtrls.filter(c => c.is_bound).length;

  return (
    <>
      <PanelSection title="Internal Controller">
        <PanelSectionRow>
          <ButtonItem 
            layout="below" 
            onClick={() => handleInternalToggle(isBound)}
            disabled={isToggling === "internal" || (isBound && activeExternalCount === 0)}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              {isBound ? <FaToggleOn color="#66ff66" /> : <FaToggleOff color="#ff4444" />}
              {isToggling === "internal" ? "Working..." : (isBound ? "Internal: ACTIVE" : "Internal: HIDDEN")}
            </div>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="External Devices">
        {externalCtrls.length === 0 ? (
          <PanelSectionRow>
            <div style={{ opacity: 0.5, textAlign: "center", width: "100%", fontSize: "0.85em", padding: "10px" }}>
              No USB controllers detected
            </div>
          </PanelSectionRow>
        ) : (
          externalCtrls.map((ctrl) => (
            <PanelSectionRow key={ctrl.id}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", padding: "5px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaGamepad color={ctrl.is_bound ? "#3b82f6" : "#555"} size={20} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.95em", fontWeight: "bold" }}>{ctrl.name}</span>
                    <span style={{ fontSize: "0.7em", opacity: 0.5 }}>ID: {ctrl.id}</span>
                  </div>
                </div>
                <ButtonItem 
                  layout="below" 
                  onClick={async () => {
                    setIsToggling(ctrl.id);
                    await toggleController(ctrl.is_bound, ctrl.id);
                    setIsToggling(null);
                    refreshStatus();
                  }}
                  disabled={isToggling !== null || (!isBound && ctrl.is_bound && activeExternalCount === 1)}
                >
                  {ctrl.is_bound ? <><FaUnlink /> Unbind</> : <><FaLink /> Bind</>}
                </ButtonItem>
              </div>
            </PanelSectionRow>
          ))
        )}
      </PanelSection>
    </>
  );
}

export default definePlugin(() => ({ name: "ControllerPriority", content: <Content />, icon: <FaGamepad /> }));
