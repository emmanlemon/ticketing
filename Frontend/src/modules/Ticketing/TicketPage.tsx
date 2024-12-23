import React, { useEffect, useState } from "react";
import TicketCreationForm from "./TicketCreationForm";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import TicketTable from "./TicketTable";
import { ticketApi } from "../../api/services/ticket";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  filterFormtype,
  filterTicket,
} from "../../schema/Ticket/ticketSearchSchema";
import { getCategoryAPI } from "../../api/services/getCategoryList";
import { priorityList, statusList } from "../../constants/constants";
import { useQuery } from "../TicketInformation/TicketInformationPage";
import { useAuth } from "../../context/AuthContext";
import UpdateUserBranchSection from "../UsersProfile/UpdateUserBranchSection";

const TicketPage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const query = useQuery();
  const [page, setPage] = useState(query.get("page") || "1");
  const [maxPage, setMaxPage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<filterFormtype>({
    resolver: yupResolver(filterTicket),
  });

  const fetchData = async (data: any, page: string) => {
    try {
      setLoading(true);
      const result = await ticketApi.getTicketData(data, page);
      setData(result.data);
      const maxPage = result.last_page;
      setMaxPage(maxPage);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: string) => {
    setPage(newPage);
  };

  const onSubmit: SubmitHandler<filterFormtype> = async (formData: any) => {
    try {
      setLoading(true);
      fetchData(formData, page);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await getCategoryAPI.getAllData();
      const data = response.map((row: any) => {
        return {
          value: row.id,
          label: row.category_description,
          sub_category: row.sub_category,
        };
      });
      setCategories(data);
    } catch (error) {
      console.error("Error fetching category list:", error);
      throw error;
    }
  };

  function handleSubCategoryList(e: any) {
    const data = categories
      .find((category: any) => category.value == e)
      ?.sub_category.map((row: any) => {
        return { value: row.id, label: row.subcategory_description };
      });
    setSubCategories(data);
  }

  const ticketSearchFilter = [
    {
      name: "ticket_id",
      label: "Ticket ID",
      register: register,
      errors: errors,
      type: "text",
    },
    {
      name: "title",
      label: "Title",
      register: register,
      errors: errors,
      type: "text",
    },
    {
      name: "status",
      label: "Status",
      register: register,
      control: control,
      errors: errors,
      options: statusList,
      type: "select",
    },
    {
      name: "priority",
      label: "Priority",
      register: register,
      control: control,
      errors: errors,
      options: priorityList,
      type: "select",
    },
    {
      name: "category_id",
      label: "Category",
      register: register,
      control: control,
      errors: errors,
      options: categories,
      type: "select",
      onChange: (value: any) => handleSubCategoryList(value),
    },
    {
      name: "subcategory_id",
      label: "Sub Category",
      register: register,
      control: control,
      errors: errors,
      options: subcategories,
      type: "select",
    },
    {
      name: "start_date",
      label: "Start Date",
      register: register,
      control: control,
      errors: errors,
      type: "date",
    },
    {
      name: "end_date",
      label: "End Date",
      register: register,
      control: control,
      errors: errors,
      type: "date",
    },
  ];

  const handleReset = () => {
    reset();
    fetchData(null, page);
  };
  useEffect(() => {
    getCategoryList();
    fetchData(null, page);
  }, [page]);
  console.log(user)
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          p: 3,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Ticket List
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" color="success" onClick={handleOpen}>
            Create Ticket
          </Button>
        </Box>

        <Box>
          <TicketTable
            onReset={handleReset}
            tickets={data}
            isLoading={loading}
            isOptions={true}
            onPageChange={handlePageChange}
            pageProps={page}
            maxCount={maxPage}
            onSubmit={handleSubmit(onSubmit)}
            customInputs={ticketSearchFilter}
            refetch={() => fetchData(null, page)}
          />
        </Box>
        <Dialog open={open} onClose={handleClose}>
          {user?.branch_id !== null && user?.section_id !== null ? (
            <>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogContent>
              <TicketCreationForm
                  onCreate={() => setOpen(false)}
                  refetch={() => fetchData(null, page)}
                  categories={categories}
                  subcategories={subcategories}
                  handleSubCategoryList={handleSubCategoryList}
                />
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle>You Need To Update Your Profile Before Creating Ticket.</DialogTitle>
              <DialogContent>
              <UpdateUserBranchSection onClose={handleClose}/>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default TicketPage;
