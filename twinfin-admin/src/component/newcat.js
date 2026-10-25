import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/axios";
import CategoryForm from "./categoryform";

function Newcat() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const create = async (form) => {
    try {
      await api.post("/category", form);
      navigate("/details/categories");
    } catch (err) {
      setError(errorMessage(err));
    }
  };
  return (
    <>
      <h2 className="page-title">New category</h2>
      <CategoryForm initial={{ name: "", type: "expense", color: "#0f766e", isActive: true }} onSubmit={create} submitLabel="Create" error={error} />
    </>
  );
}

export default Newcat;
