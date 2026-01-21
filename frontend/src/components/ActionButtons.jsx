import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import { MissedVideoCall, Refresh } from "@mui/icons-material";

const ActionButtons = ({
  activeView,
  onViewChange,
  liveCount,
  missedCount,
  onRefresh,
}) => {
  return (
    <div
      className="d-flex gap-3 my-3"
      style={{
        flexWrap: "wrap",
      }}
    >
      <Button
        variant="contained"
        startIcon={<VideocamIcon />}
        onClick={() => onViewChange("live")}
        sx={{
          backgroundColor: activeView === "live" ? "#1C43A6" : "#9bb0e8",
          textTransform: "none",
          padding: "8px 16px",
          minWidth: "140px",
          width: { xs: "100%", sm: "auto" }, 
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: "#1C43A6",
          },
          "& .MuiButton-startIcon": {
            marginRight: "8px",
          },
        }}
      >
        Live & Schedule ({liveCount})
      </Button>

      <Button
        variant="contained"
        startIcon={<MissedVideoCall />}
        onClick={() => onViewChange("missed")}
        sx={{
          backgroundColor: activeView === "missed" ? "#F12B01" : "#f5a08c",
          textTransform: "none",
          padding: "8px 16px",
          minWidth: "140px",
          width: { xs: "100%", sm: "auto" }, 
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: "#e42803ff",
          },
          "& .MuiButton-startIcon": {
            marginRight: "8px",
          },
        }}
      >
        Missed Calls ({missedCount})
      </Button>

      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={onRefresh}
        sx={{
          color: "#1C43A6",
          textTransform: "none",
          padding: "8px 16px",
          minWidth: "140px",
          width: { xs: "100%", sm: "auto" }, 
          fontSize: "0.875rem",
          "&:hover": {
            backgroundColor: "#7c8cba",
            color: "white",
          },
          "& .MuiButton-startIcon": {
            marginRight: "8px",
          },
        }}
      >
        Refresh
      </Button>
    </div>
  );
};

export default ActionButtons;