import { PathConstants } from "./pathConstants.ts";
import { v4 as uuidv4 } from "uuid";
import Dashboard from "../../modules/Dashboard/DashboardPage.tsx";
import TicketInformation from "../../modules/TicketInformation/TicketInformationPage.tsx";
import UserDashboardPage from "../../modules/UserDashboard/UserDashboardPage.tsx";
import Maintenance from "../../modules/Maintenance/MaintenancePage.tsx";
import TicketPage from "../../modules/Ticketing/TicketPage.tsx";
import UserTicketPage from "../../modules/UserTicket/UserTicketPage.tsx";
import { useContext } from "react";
import { PermissionContext } from "../../helpers/Providers/PermissionProvider.tsx";

export const usePrivateRoutes = () => {
    const { permission } = useContext(PermissionContext);

    const privateRoutes = [
        {
          id: uuidv4,
          name: "Dashboard",
          description: "See Personal Dashboard",
          path: PathConstants.DASHBOARD,
          component: Dashboard,
          show: true,
        },
        {
            id: uuidv4,
            name: "TicketInformation",
            description: "Ticket Information",
            path: PathConstants.TICKET_INFORMATION,
            component: TicketInformation,
            show: true,
        },
        {
            id: uuidv4,
            name: "Profile",
            description: "Profile",
            path: PathConstants.USER_DASHBOARD,
            component: UserDashboardPage,
            show: true,
        },
        {
            id: uuidv4,
            name: "Maintenance",
            description: "Maintenance",
            path: PathConstants.MAINTENANCE,
            component: Maintenance,
            show: permission?.includes("Can View Maintenance"),
            requiredPermissions: ["Can View Maintenance"],
        },
        {
            id: uuidv4,
            name: "Ticket",
            description: "Ticket",
            path: PathConstants.TICKET,
            component: TicketPage,
            show: true,
        },
        {
            id: uuidv4,
            name: "User Ticket",
            description: "User Ticket",
            path: PathConstants.USERTICKET,
            component: UserTicketPage,
            show: permission?.includes("Can View User Ticket"),
            requiredPermissions: ["Can View User Ticket"],
        },
    ]

    return { privateRoutes };
}