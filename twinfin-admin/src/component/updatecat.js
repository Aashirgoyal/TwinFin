import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../api/axios";
import CategoryForm from "./categoryform";

function Updatecat() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { api.get(`/category/${id}`).then((r) => setCategory(r.data)).catch((e) => setError(errorMessage(e))); }, [id]);

  const update = async (form) => {
    try {
      await api.put(`/category/${id}`, form);
      navigate("/details/categories");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <h2 className="page-title">Edit category</h2>
      {category ? <CategoryForm initial={category} onSubmit={update} submitLabel="Save" error={error} /> : error && <div className="alert alert-danger">{error}</div>}
    </>
  );
}

export default Updatecat;
