import { useEffect, useState, useCallback } from "react";
import PastKycCallsTable from "../pages/AgentDashboard/PastKycCallsTable";

import {
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Groups as GroupsIcon,
  History as HistoryIcon,
  EditNote as EditNoteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import ActionButtons from "../components/ActionButtons";
import LiveScheduleTable from "./LiveScheduleTable";
import MissedCallsTable from "../components/MissedCallsTable";
import Pagination from "../components/Pagination";
import CallInitiationModal from "../components/CallInitiationModal";
import CallEndModal from "../components/CallEndModal";

// ---------- debounce ----------
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const CustomerTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState("Video KYC Waitlist");
  const [activeView, setActiveView] = useState("live");
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [initiationModalOpen, setInitiationModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = 3;

  const API_BASE = "http://localhost:5000/api/kyc";

  // ---------- fetch data ----------
 const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    let url = "";

    if (debouncedSearch) {
      url = `${API_BASE}/search?q=${debouncedSearch}&view=${activeView}`;
    } else if (activeView === "live") {
      url = `${API_BASE}/live-schedule`;
    } else {
      url = `${API_BASE}/missed`;
    }

    const res = await fetch(url);
    const json = await res.json();
    setCustomers(json.data || []);
  } catch (err) {
    console.error(err);
    setCustomers([]);
  } finally {
    setLoading(false);
  }
}, [API_BASE, debouncedSearch, activeView]);


  useEffect(() => {
  if (activeTab === "Video KYC Waitlist") {
    fetchData();
  }
}, [fetchData, activeTab]);


  useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch, activeView]);


  const handleOpenInitiationModal = (customer) => {
    setSelectedCustomer(customer);
    setInitiationModalOpen(true);
  };

  const handleCloseInitiationModal = () => {
    setInitiationModalOpen(false);
  };

  const handleCloseIconClick = () => {
    setInitiationModalOpen(false);
    setEndModalOpen(true);
  };

  const handleEndCall = () => {
    setEndModalOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === "Video KYC Waitlist") {
      setActiveView("live");
    }
  };

  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="card">
      <div className="card-body">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab
            value="Video KYC Waitlist"
            label="Video KYC Waitlist"
            icon={<GroupsIcon />}
          />
          <Tab
            value="Past KYC Calls"
            label="Past KYC Calls"
            icon={<HistoryIcon />}
          />
          <Tab value="Draft List" label="Draft List" icon={<EditNoteIcon />} />
        </Tabs>

        <Box sx={{ borderBottom: 1, borderColor: "divider", my: 3 }} />

        {activeTab === "Video KYC Waitlist" && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              mb={3}
            >
              <ActionButtons
                activeView={activeView}
                onViewChange={(v) => {
                  setSearch("");
                  setActiveView(v);
                }}
                liveCount={activeView === "live" ? customers.length : 0}
                missedCount={activeView === "missed" ? customers.length : 0}
                onRefresh={fetchData}
              />

              <TextField
                size="small"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {loading ? (
              <Typography align="center">Loading...</Typography>
            ) : paginatedCustomers.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No records found
              </Typography>
            ) : activeView === "live" ? (
              <LiveScheduleTable customers={paginatedCustomers} onInitiateCall={handleOpenInitiationModal} />
            ) : (
              <MissedCallsTable customers={paginatedCustomers} onInitiateCall={handleOpenInitiationModal} />
            )}

            <Pagination
              currentPage={currentPage}
              totalItems={customers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "Past KYC Calls" && (
          <Box sx={{ mt: 2 }}>
            <PastKycCallsTable />
          </Box>
        )}

        {activeTab === "Draft List" && (
          <Box sx={{ mt: 2, p: 3, textAlign: "center" }}>
            <Typography variant="h5">Draft List</Typography>
            <Typography color="text.secondary">
              This page is under development.
            </Typography>
          </Box>
        )}

        {selectedCustomer && (
          <CallInitiationModal
            open={initiationModalOpen}
            onClose={handleCloseInitiationModal}
            onCloseIconClick={handleCloseIconClick}
            customer={selectedCustomer}
          />
        )}

        <CallEndModal
          open={endModalOpen}
          onClose={() => setEndModalOpen(false)}
          onConfirm={handleEndCall}
        />
      </div>
    </div>
  );
};

export default CustomerTable;
